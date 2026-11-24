// index.js — Express backend pour Copie Express
// Endpoints : dépôt, lecture des copies, export CSV, paiement, purge RGPD

import express from 'express';
import cors from 'cors';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import helmet from 'helmet';
import multer from 'multer';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// === CONSTANTES PRODUIT (source unique côté serveur) ===
const TRIAL_LIMIT = 5; // copies offertes, une seule fois
const PLAN_LIMITS = { petit: 50, monthly: 500, yearly: 2000, expert_yearly: 3000 }; // copies / mois
const RETENTION_DAYS = 30;
const PURGED = 'purged';
const FRONT_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://copie-express-v1.vercel.app';
const DATA_DIR = process.env.CE_DATA_DIR || path.join(os.homedir(), '.local/share/copie-express');

// === MOTEUR DE LECTURE (API via fetch direct) ===
const MISTRAL_API_URL = process.env.MISTRAL_API_URL || 'https://api.mistral.ai/v1';

// Erreur du moteur : `code` est renvoyé au client, le détail reste dans le journal serveur.
class EngineError extends Error {
  constructor(code, detail) {
    super(detail || code);
    this.code = code;
  }
}

async function mistralFetch(pathname, init, label) {
  let lastStatus = 0;
  let lastDetail = '';
  for (let attempt = 0; attempt < 3; attempt++) {
    let response;
    try {
      response = await fetch(`${MISTRAL_API_URL}${pathname}`, init);
    } catch (err) {
      lastStatus = 0;
      lastDetail = `${label} network: ${err.message}`;
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      continue;
    }
    if (response.ok) return response;
    lastStatus = response.status;
    lastDetail = `${label} ${response.status}: ${(await response.text()).slice(0, 300)}`;
    // Quota du compte à zéro : inutile d'insister, le service est indisponible.
    if (response.status === 429 && response.headers.get('x-ratelimit-limit-req-minute') === '0') {
      throw new EngineError('engine_unavailable', lastDetail);
    }
    if (response.status !== 429 && response.status < 500) break;
    await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
  }
  throw new EngineError(lastStatus === 429 ? 'engine_busy' : 'engine_error', lastDetail);
}

async function mistralChat(messages, jsonMode = true) {
  const response = await mistralFetch('/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
      temperature: 0, // même copie → même résultat
    }),
  }, 'chat');
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!jsonMode) return content;
  try {
    return JSON.parse(content);
  } catch {
    throw new EngineError('engine_error', 'chat: réponse JSON invalide');
  }
}

// Télécharge le fichier depuis le stockage, l'envoie au moteur, puis lit le texte
// (le moteur ne peut pas récupérer lui-même les URL signées du stockage)
async function mistralOcr(supabaseSignedUrl) {
  const fileResponse = await fetch(supabaseSignedUrl);
  if (!fileResponse.ok) {
    throw new Error(`Failed to download file from storage: ${fileResponse.status}`);
  }
  const fileBuffer = await fileResponse.arrayBuffer();
  const contentType = fileResponse.headers.get('content-type') || 'image/jpeg';

  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer], { type: contentType }), 'document');
  formData.append('purpose', 'ocr');

  const uploadResponse = await mistralFetch('/files', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}` },
    body: formData,
  }, 'upload');
  const fileData = await uploadResponse.json();

  const ocrBody = {
    model: 'mistral-ocr-latest',
    document: { type: 'file', file_id: fileData.id },
    include_image_base64: false,
  };
  // Les fichiers Office nécessitent image_limit=0 (sinon erreur 3051)
  if (contentType.includes('officedocument') || contentType.includes('ms-')) {
    ocrBody.image_limit = 0;
  }

  const ocrResponse = await mistralFetch('/ocr', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify(ocrBody),
  }, 'ocr');
  const data = await ocrResponse.json();
  return data.pages?.map((p) => p.markdown || '').join('\n\n') || '';
}

// Le texte du sujet est le même pour toute la classe : on ne le relit pas à chaque copie.
const subjectTextCache = new Map();
async function readSubjectText(storagePath) {
  if (subjectTextCache.has(storagePath)) return subjectTextCache.get(storagePath);
  const { data: signed } = await supabase.storage.from('copies').createSignedUrl(storagePath, 120);
  if (!signed?.signedUrl) return '';
  const text = await mistralOcr(signed.signedUrl);
  if (subjectTextCache.size > 200) subjectTextCache.delete(subjectTextCache.keys().next().value);
  subjectTextCache.set(storagePath, text);
  return text;
}

const app = express();
const PORT = process.env.PORT || 4000;

// Derrière le tunnel Cloudflare : sans ceci, tous les visiteurs partagent la même adresse
// et donc le même compteur de limite de débit.
app.set('trust proxy', 1);

// === SÉCURITÉ : Helmet (headers HTTP de protection) ===
app.use(helmet({
  contentSecurityPolicy: false, // Next.js gère ses propres CSP headers
  crossOriginEmbedderPolicy: false,
}));

// === SÉCURITÉ : limites de débit ===
// Global : par adresse IP. Routes connectées : par utilisateur (une classe de 100 copies doit passer).
const limiterOptions = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'too_many_requests' },
};
const userKey = (req) => req.user?.id || ipKeyGenerator(req.ip);

const globalLimiter = rateLimit({ ...limiterOptions, max: 900 });
app.use(globalLimiter);

const authLimiter = rateLimit({ ...limiterOptions, max: 120, keyGenerator: userKey });
const uploadLimiter = rateLimit({ ...limiterOptions, max: 40, keyGenerator: userKey });
const extractLimiter = rateLimit({ ...limiterOptions, max: 450, keyGenerator: userKey });
const contactLimiter = rateLimit({ ...limiterOptions, windowMs: 60 * 60 * 1000, max: 5 });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'application/vnd.ms-powerpoint', // .ppt
    ];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('file_type_not_allowed'));
  },
});

const allowedOrigins = [
  'https://copie-express-v1.vercel.app',
  'http://localhost:3000',
  process.env.NEXT_PUBLIC_APP_URL,
  ...(process.env.CE_EXTRA_ORIGINS || '').split(','),
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Requêtes sans origine (curl, appels serveur à serveur) : acceptées
    if (!origin) return callback(null, true);
    return callback(null, allowedOrigins.includes(origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Le webhook Stripe a besoin du corps brut pour vérifier la signature :
// il ne doit pas passer par le parseur JSON.
const jsonParser = express.json({ limit: '10mb' });
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/stripe/webhook')) return next();
  return jsonParser(req, res, next);
});

app.use((req, res, next) => {
  if (req.method === 'POST' && req.headers['content-type']?.includes('multipart/form-data')) {
    res.setHeader('Connection', 'close');
  }
  next();
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_missing');
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// === OUTILS ===
// Réponse d'erreur : un code stable pour le front, le détail uniquement dans le journal.
function fail(res, status, code, err, extra = {}) {
  if (err) console.error(`[${code}]`, err?.message || err);
  return res.status(status).json({ error: code, ...extra });
}

// Nom de fichier accepté par le stockage (pas d'accents ni de caractères spéciaux)
function safeName(original) {
  const base = String(original || 'fichier')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '_')
    .replace(/_+/g, '_');
  return base.slice(-80) || 'fichier';
}

const round2 = (n) => Math.round(n * 100) / 100;
const isUuid = (v) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

// === CALCUL DE LA NOTE (même règle que src/lib/scoring.ts) ===
function normId(v) {
  return String(v ?? '').trim().toLowerCase()
    .replace(/^(question|exercice|ex|q)\s*\.?\s*/, '')
    .replace(/[\s.)]+$/, '');
}

function pointsFor(answer, max) {
  if (typeof answer?.points === 'number' && Number.isFinite(answer.points)) {
    return Math.min(max, Math.max(0, answer.points));
  }
  return answer?.is_correct === true ? max : 0;
}

// Les évaluations créées avant novembre 2026 portent un barème factice (1 question, 1 point) :
// il ne doit pas servir au calcul.
function usableScale(scale) {
  const sc = Array.isArray(scale) ? scale : [];
  if (sc.length === 1 && normId(sc[0]?.id) === '1' && Number(sc[0]?.max_points) === 1 && /^question 1$/i.test(String(sc[0]?.label || ''))) return [];
  return sc;
}

// Avec un barème : il fait foi (une question sans réponse vaut 0).
// Sans barème, ou si aucune question ne correspond : 1 point par réponse lue.
function computeCopyScore(answers, scale) {
  const list = Array.isArray(answers) ? answers : [];
  const sc = usableScale(scale);
  if (!list.length) return { score: 0, max: 0, weighted: false };
  const byId = new Map(list.map((a) => [normId(a.question_id), a]));
  const matched = sc.filter((q) => byId.has(normId(q.id))).length;
  const weighted = sc.length > 0 && matched >= 1;
  if (weighted) {
    let score = 0;
    let max = 0;
    for (const q of sc) {
      const m = Number(q.max_points) || 0;
      max += m;
      const a = byId.get(normId(q.id));
      if (a) score += pointsFor(a, m);
    }
    return { score: round2(score), max: round2(max), weighted: true };
  }
  let score = 0;
  for (const a of list) score += pointsFor(a, 1);
  return { score: round2(score), max: list.length, weighted: false };
}

// === AUTHENTIFICATION ===
// Vérifie le jeton de session envoyé dans Authorization: Bearer <jeton>
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'invalid_token' });
    req.user = user;
    next();
  } catch (err) {
    return fail(res, 500, 'auth_check_failed', err);
  }
};

// Si le client envoie un userId, il doit être celui du jeton.
// Les routes n'utilisent de toute façon que req.user.id.
const requireUserMatch = (req, res, next) => {
  const bodyUserId = req.body?.userId || req.query?.userId;
  if (bodyUserId && req.user && bodyUserId !== req.user.id) {
    return res.status(403).json({ error: 'user_mismatch' });
  }
  next();
};

async function ownedEvaluation(evaluationId, userId, columns = 'id, user_id') {
  if (!isUuid(evaluationId)) return null;
  const { data } = await supabase
    .from('evaluations')
    .select(columns)
    .eq('id', evaluationId)
    .eq('user_id', userId)
    .maybeSingle();
  return data || null;
}

// === COMPTE, FORFAIT ET COMPTEURS ===
// Le forfait et les compteurs vivent dans app_metadata du compte d'authentification :
// seul le serveur peut y écrire. La table `users` n'en garde qu'une copie d'affichage.
const userLocks = new Map();
function withUserLock(userId, fn) {
  const prev = userLocks.get(userId) || Promise.resolve();
  const next = prev.catch(() => {}).then(fn);
  userLocks.set(userId, next);
  next.catch(() => {}).finally(() => {
    if (userLocks.get(userId) === next) userLocks.delete(userId);
  });
  return next;
}

const monthKey = () => new Date().toISOString().slice(0, 7);
const GRACE_MS = 3 * 24 * 3600 * 1000;
const SUB_REFRESH_MS = 12 * 3600 * 1000;
const subRefreshTries = new Map(); // dernier essai de relecture par compte (évite d'insister en cas de panne)

async function loadAccount(userId) {
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error || !data?.user) throw new Error('user_not_found');
  const meta = data.user.app_metadata || {};
  let usage = meta.ce_usage;
  if (!usage) {
    // Première fois : on reprend le compteur d'essai existant
    const { data: row } = await supabase.from('users').select('trial_copies_count').eq('id', userId).maybeSingle();
    usage = { trial: Math.max(0, row?.trial_copies_count || 0), month: monthKey(), monthly: 0 };
  }
  if (usage.month !== monthKey()) usage = { ...usage, month: monthKey(), monthly: 0 };
  const sub = meta.ce_sub || null;
  const subActive = !!sub
    && ['active', 'trialing'].includes(sub.status)
    && !!PLAN_LIMITS[sub.plan]
    && (!sub.period_end || new Date(sub.period_end).getTime() + GRACE_MS > Date.now());
  return { authUser: data.user, meta, usage, sub, subActive };
}

function entitlementOf(acc) {
  if (acc.subActive) {
    const limit = PLAN_LIMITS[acc.sub.plan];
    const used = acc.usage.monthly || 0;
    return { plan: acc.sub.plan, paid: true, limit, used, remaining: Math.max(0, limit - used), reason: 'monthly_quota_exceeded' };
  }
  const used = acc.usage.trial || 0;
  return { plan: 'discovery', paid: false, limit: TRIAL_LIMIT, used, remaining: Math.max(0, TRIAL_LIMIT - used), reason: 'trial_exhausted' };
}

async function writeMeta(userId, patch) {
  // Relit avant d'écrire : app_metadata est remplacé clé par clé
  const { data } = await supabase.auth.admin.getUserById(userId);
  const current = data?.user?.app_metadata || {};
  const { error } = await supabase.auth.admin.updateUserById(userId, { app_metadata: { ...current, ...patch } });
  if (error) throw error;
}

async function saveUsage(userId, usage) {
  await writeMeta(userId, { ce_usage: usage });
  await supabase.from('users').update({
    trial_copies_count: usage.trial || 0,
    trial_used: (usage.trial || 0) >= TRIAL_LIMIT,
    monthly_copy_count: usage.monthly || 0,
    last_copy_at: new Date().toISOString(),
  }).eq('id', userId);
}

// Réserve une copie dans le quota AVANT la lecture (évite les dépassements en parallèle).
function reserveCopy(userId) {
  return withUserLock(userId, async () => {
    const acc = await loadAccount(userId);
    const ent = entitlementOf(acc);
    if (ent.remaining <= 0) return { ok: false, reason: ent.reason };
    const usage = { ...acc.usage };
    if (ent.paid) usage.monthly = (usage.monthly || 0) + 1;
    else usage.trial = (usage.trial || 0) + 1;
    await saveUsage(userId, usage);
    return { ok: true, paid: ent.paid };
  });
}

// Rend la copie réservée si la lecture a échoué : une copie non lue n'est pas décomptée.
function releaseCopy(userId, paid) {
  return withUserLock(userId, async () => {
    const acc = await loadAccount(userId);
    const usage = { ...acc.usage };
    if (paid) usage.monthly = Math.max(0, (usage.monthly || 0) - 1);
    else usage.trial = Math.max(0, (usage.trial || 0) - 1);
    await saveUsage(userId, usage);
  }).catch((err) => console.error('[release_failed]', err?.message || err));
}

function setSubscription(userId, patch) {
  return withUserLock(userId, async () => {
    const acc = await loadAccount(userId);
    const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
    const sub = { ...(acc.sub || {}), ...clean };
    await writeMeta(userId, { ce_sub: sub });
    await supabase.from('users').update({
      subscription_status: sub.status || null,
      subscription_plan: sub.plan || null,
      ...(sub.customer ? { stripe_customer_id: sub.customer } : {}),
      ...(sub.period_end ? { subscription_expires_at: sub.period_end } : {}),
    }).eq('id', userId);
    return sub;
  });
}

async function isSuspended(userId, acc) {
  if (acc?.meta?.ce_suspended) return true;
  const { data } = await supabase.from('users').select('is_suspended').eq('id', userId).maybeSingle();
  return !!data?.is_suspended;
}

// === HEALTH ===
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'copie-express-backend', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'copie-express-backend', timestamp: new Date().toISOString() });
});

// === ÉTAT DU FORFAIT (affichage + contrôle avant dépôt) ===
app.get('/api/usage', authMiddleware, authLimiter, async (req, res) => {
  try {
    let acc = await loadAccount(req.user.id);
    // Filet de sécurité si une notification de paiement s'est perdue : on relit l'abonnement
    // auprès du prestataire de paiement, au plus deux fois par jour.
    const syncedAt = acc.sub?.synced_at ? new Date(acc.sub.synced_at).getTime() : 0;
    const lastTry = subRefreshTries.get(req.user.id) || 0;
    if (acc.sub?.sub_id && process.env.STRIPE_SECRET_KEY
      && Date.now() - syncedAt > SUB_REFRESH_MS && Date.now() - lastTry > 10 * 60 * 1000) {
      subRefreshTries.set(req.user.id, Date.now());
      try {
        const sub = await ownedSubscription(req.user.id);
        if (sub) {
          await applyStripeSubscription(sub);
          acc = await loadAccount(req.user.id);
        }
      } catch (err) {
        console.error('[sub_refresh_failed]', err?.message || err);
      }
    }
    const ent = entitlementOf(acc);
    res.json({
      plan: ent.plan,
      paid: ent.paid,
      limit: ent.limit,
      used: ent.used,
      remaining: ent.remaining,
      subscription: acc.sub ? {
        status: acc.subActive ? 'active' : (acc.sub.status || 'inactive'),
        plan: acc.sub.plan || null,
        period_end: acc.sub.period_end || null,
        cancel_at_period_end: !!acc.sub.cancel_at_period_end,
      } : null,
    });
  } catch (err) {
    fail(res, 500, 'usage_failed', err);
  }
});

// === BARÈME : PHOTO DU CORRIGÉ (optionnel, 1 fois par évaluation) ===
app.post('/api/grading-key', authMiddleware, authLimiter, upload.single('file'), requireUserMatch, async (req, res) => {
  try {
    const userId = req.user.id;
    const { evaluationId } = req.body;
    if (!evaluationId) return fail(res, 400, 'missing_params');
    if (!req.file) return fail(res, 400, 'no_file');
    if (!(await ownedEvaluation(evaluationId, userId))) return fail(res, 404, 'evaluation_not_found');

    const filename = `${userId}/${evaluationId}/grading_key_${Date.now()}_${safeName(req.file.originalname)}`;
    const { error: uploadError } = await supabase.storage
      .from('copies')
      .upload(filename, req.file.buffer, { contentType: req.file.mimetype, upsert: true });
    if (uploadError) return fail(res, 500, 'upload_failed', uploadError);

    const { data: signedUrl } = await supabase.storage.from('copies').createSignedUrl(filename, 60);
    if (!signedUrl?.signedUrl) return fail(res, 500, 'signed_url_failed');

    const rawText = await mistralOcr(signedUrl.signedUrl);
    const cleanedText = rawText.replace(/\n{3,}/g, '\n\n').trim();
    if (!cleanedText) return fail(res, 422, 'document_unreadable');

    await supabase.from('evaluations').update({
      grading_key: cleanedText,
      grading_key_storage_path: filename,
      grading_key_uploaded_at: new Date().toISOString(),
    }).eq('id', evaluationId);

    res.json({ success: true, path: filename });
  } catch (err) {
    fail(res, err instanceof EngineError ? 503 : 500, err instanceof EngineError ? err.code : 'grading_key_failed', err);
  }
});

function cleanBaremeQuestions(questions) {
  return questions.slice(0, 100).map((q, i) => ({
    id: String(q.id || (i + 1)),
    label: String(q.label || `Question ${i + 1}`).slice(0, 300),
    expected: String(q.expected || '').slice(0, 1000),
    points: Math.min(20, Math.max(0.25, Number(q.points) || 1)),
    skill: String(q.skill || '').slice(0, 200),
  }));
}

async function saveBareme(evaluationId, questions) {
  const gradingScale = questions.map((q) => ({ id: q.id, label: q.label, max_points: q.points, skill: q.skill }));
  const correctAnswers = {};
  for (const q of questions) correctAnswers[q.id] = q.expected;
  const gradingKeyText = questions
    .map((q) => `Q${q.id} (${q.points} pts${q.skill ? ` — ${q.skill}` : ''}) : ${q.expected}`)
    .join('\n');
  await supabase.from('evaluations').update({
    grading_scale: gradingScale,
    correct_answers: correctAnswers,
    grading_key: gradingKeyText,
  }).eq('id', evaluationId);
}

// === PUT /api/bareme-auto : enregistre les ajustements du prof ===
app.put('/api/bareme-auto', authMiddleware, authLimiter, requireUserMatch, async (req, res) => {
  try {
    const { evaluationId, questions } = req.body;
    if (!evaluationId || !Array.isArray(questions) || !questions.length) return fail(res, 400, 'missing_params');
    if (!(await ownedEvaluation(evaluationId, req.user.id))) return fail(res, 404, 'evaluation_not_found');

    const cleaned = cleanBaremeQuestions(questions);
    await saveBareme(evaluationId, cleaned);
    res.json({ success: true, total_points: round2(cleaned.reduce((s, q) => s + q.points, 0)) });
  } catch (err) {
    fail(res, 500, 'bareme_auto_save_failed', err);
  }
});

// === BARÈME EXPRESS (généré depuis le sujet déposé) ===
app.post('/api/bareme-auto', authMiddleware, authLimiter, requireUserMatch, async (req, res) => {
  try {
    const { evaluationId } = req.body;
    if (!evaluationId) return fail(res, 400, 'missing_params');

    const evaluation = await ownedEvaluation(evaluationId, req.user.id, 'id, user_id, title, subject, class_level, subject_storage_path');
    if (!evaluation) return fail(res, 404, 'evaluation_not_found');
    if (!evaluation.subject_storage_path) return fail(res, 400, 'no_subject');

    const subjectText = await readSubjectText(evaluation.subject_storage_path);
    if (!subjectText.trim()) return fail(res, 422, 'document_unreadable');

    const bareme = await mistralChat([
      {
        role: 'system',
        content: 'Tu es un professeur français expert en évaluation. Tu retournes UNIQUEMENT du JSON valide.',
      },
      {
        role: 'user',
        content: `Tu es un professeur qui prépare la correction d'une évaluation.

SUJET DU CONTRÔLE (OCR) :
"""
${subjectText}
"""

CONTEXTE : matière = ${evaluation.subject || 'non précisée'}, niveau = ${evaluation.class_level || 'non précisé'}.

TÂCHE : construis le BARÈME de correction complet de ce sujet.
1. Liste CHAQUE question / exercice numéroté du sujet (même les sous-questions : 1a, 1b...)
2. Pour chaque question : la réponse attendue PRÉCISE, le nombre de points, et le savoir-faire évalué
3. Si le sujet indique les points de chaque question ou un total, respecte-les. Sinon répartis les points pour un total rond (20 par défaut)
4. Si une question est ouverte (rédaction, dissertation), mets "réponse ouverte" et des critères

JSON STRICT (rien d'autre) :
{
  "questions": [
    { "id": "1", "label": "intitulé court de la question", "expected": "réponse attendue précise", "points": 2, "skill": "savoir-faire évalué" }
  ],
  "total_points": 20,
  "comment": "remarque courte pour le prof (max 1 phrase)"
}`,
      },
    ], true);

    if (!bareme?.questions?.length) return fail(res, 422, 'bareme_generation_failed');

    const questions = cleanBaremeQuestions(bareme.questions);
    await saveBareme(evaluationId, questions);

    res.json({
      success: true,
      questions,
      total_points: round2(questions.reduce((s, q) => s + q.points, 0)),
      comment: bareme.comment || null,
    });
  } catch (err) {
    fail(res, err instanceof EngineError ? 503 : 500, err instanceof EngineError ? err.code : 'bareme_auto_failed', err);
  }
});

// === SUJET (optionnel, 1 fois par évaluation) ===
app.post('/api/subject', authMiddleware, authLimiter, upload.single('file'), requireUserMatch, async (req, res) => {
  try {
    const userId = req.user.id;
    const { evaluationId } = req.body;
    if (!evaluationId) return fail(res, 400, 'missing_params');
    if (!req.file) return fail(res, 400, 'no_file');
    if (!(await ownedEvaluation(evaluationId, userId))) return fail(res, 404, 'evaluation_not_found');

    const filename = `${userId}/${evaluationId}/subject_${Date.now()}_${safeName(req.file.originalname)}`;
    const { data, error } = await supabase.storage
      .from('copies')
      .upload(filename, req.file.buffer, { contentType: req.file.mimetype, upsert: true });
    if (error) return fail(res, 500, 'upload_failed', error);

    await supabase.from('evaluations').update({
      subject_storage_path: data.path,
      subject_uploaded_at: new Date().toISOString(),
    }).eq('id', evaluationId);

    res.json({ success: true, path: data.path });
  } catch (err) {
    fail(res, 500, 'subject_upload_failed', err);
  }
});

// === DÉPÔT DES COPIES ===
// Envoie les fichiers au stockage ET crée les copies en base, dans la même opération :
// si l'un échoue, l'autre est annulé (pas de fichier orphelin).
app.post('/api/upload', authMiddleware, uploadLimiter, upload.array('files', 100), requireUserMatch, async (req, res) => {
  try {
    const userId = req.user.id;
    const { evaluationId } = req.body;
    const files = req.files;
    if (!files?.length) return fail(res, 400, 'no_files');
    if (!evaluationId) return fail(res, 400, 'missing_params');
    if (!(await ownedEvaluation(evaluationId, userId))) return fail(res, 404, 'evaluation_not_found');

    const acc = await loadAccount(userId);
    if (await isSuspended(userId, acc)) return fail(res, 403, 'account_suspended');
    const ent = entitlementOf(acc);
    if (ent.remaining <= 0) return fail(res, 403, ent.reason, null, { limit: ent.limit });
    if (files.length > ent.remaining) {
      return fail(res, 403, 'quota_insufficient', null, { remaining: ent.remaining, limit: ent.limit });
    }

    const { count: existing } = await supabase
      .from('copies')
      .select('id', { count: 'exact', head: true })
      .eq('evaluation_id', evaluationId);

    const rows = [];
    const stamp = Date.now();
    for (const file of files) {
      const filename = `${userId}/${evaluationId}/${stamp}_${rows.length}_${safeName(file.originalname)}`;
      const { data, error } = await supabase.storage
        .from('copies')
        .upload(filename, file.buffer, { contentType: file.mimetype, upsert: false });
      if (error) { console.error('[upload_file_failed]', error.message); continue; }
      rows.push({
        evaluation_id: evaluationId,
        photo_storage_path: data.path,
        student_identifier: `Élève ${String((existing || 0) + rows.length + 1).padStart(2, '0')}`,
        status: 'pending',
      });
    }
    if (!rows.length) return fail(res, 500, 'upload_failed');

    const { data: inserted, error: dbError } = await supabase
      .from('copies')
      .insert(rows)
      .select('id, photo_storage_path');
    if (dbError || !inserted?.length) {
      await supabase.storage.from('copies').remove(rows.map((r) => r.photo_storage_path));
      return fail(res, 500, 'upload_failed', dbError);
    }

    res.json({
      uploaded: inserted.length,
      failed: files.length - inserted.length,
      copies: inserted.map((c) => ({ id: c.id })),
    });
  } catch (err) {
    fail(res, 500, 'upload_failed', err);
  }
});

function buildExtractPrompt(evalData, promptContext, ocrText) {
    // === Construction du prompt selon ce qui est disponible ===
    const hasSubject = !!evalData.subject_storage_path;
    const hasGradingKey = !!evalData.grading_key;
    const scaleIds = usableScale(evalData.grading_scale).map((q) => String(q.id));
    const idRule = scaleIds.length
      ? `\nIDENTIFIANTS DES QUESTIONS (obligatoire) : le tableau "answers" contient EXACTEMENT un objet par identifiant, dans cet ordre, sans en ajouter ni en retirer : ${scaleIds.map((id) => `"${id}"`).join(', ')}.\nSi l'élève n'a rien écrit pour une question : "student_wrote": null, "is_correct": false, "error_type": "absence".\n`
      : '';

    let userPrompt;
    if (hasGradingKey) {
      // MODE AVEC BARÈME : on demande une notation automatique
      userPrompt = `Tu es un correcteur de copies d'élèves français.

${hasSubject ? 'Voici le SUJET du contrôle, le BARÈME avec les bonnes réponses, puis la COPIE de l\'élève.' : 'Voici le BARÈME avec les bonnes réponses, puis la COPIE de l\'élève.'}

${promptContext}
BARÈME (bonnes réponses attendues, une par ligne) :
"""
${evalData.grading_key}
"""

COPIE DE L'ÉLÈVE (texte OCR) :
"""
${ocrText}
"""

TÂCHE :
1. Identifie le numéro/nom de l'élève s'il est écrit sur la copie
2. Pour CHAQUE question du barème, trouve la réponse de l'élève dans la copie
3. Compare avec la bonne réponse du barème
4. Note la réponse comme correcte (true) ou fausse (false)
5. Tolère les fautes de frappe mineures (1-2 caractères) et les variations de casse
6. Si l'élève n'a pas répondu ou a écrit "?" / "je sais pas" → false
7. Si illisible → "unclear" + false
8. "confidence" = ta certitude d'avoir bien LU la réponse de l'élève (écriture nette = proche de 1, mot douteux ou raturé = sous 0.6). Ne mets pas la même valeur partout.
${idRule}
Pour chaque réponse FAUSSE, classifie l'erreur dans "error_type" (catégorie pédagogique) :
- "calcul" (erreur de calcul), "concept" (notion non comprise), "lecture" (mauvaise lecture de l'énoncé),
- "inattention" ( étourderie, oubli d'unité, signe inversé), "incomplet" (réponse partielle),
- "absence" (pas de réponse), "autre"

JSON STRICT (rien d'autre) :
{
  "student_identifier": "Prénom et nom tels qu'écrits sur la copie" | null,
  "answers": [
    {
      "question_id": "1",
      "student_wrote": "4" | null,
      "expected": "4",
      "is_correct": true | false,
      "error_type": "calcul" | "concept" | ... | null,
      "confidence": 0.0-1.0
    },
    ...
  ],
  "total_correct": <nombre entier>,
  "total_questions": <nombre entier>,
  "overall_confidence": 0.0-1.0
}`;
    } else {
      // MODE SANS BARÈME : extraction + notation autonome (le LLM déduit les bonnes réponses)
      userPrompt = `Tu es un correcteur de copies d'élèves français.

${hasSubject ? "Voici le SUJET du contrôle et la COPIE de l'élève." : "Voici la COPIE de l'élève."}

${promptContext}Texte OCR de la copie :
"""
${ocrText}
"""

TÂCHE :
1. Identifie le numéro/nom de l'élève s'il est écrit sur la copie
2. Pour CHAQUE question visible dans la copie, trouve la réponse de l'élève
3. ${hasSubject ? 'En te basant sur le SUJET,' : 'En utilisant tes connaissances,'} détermine la RÉPONSE ATTENDUE pour chaque question
4. Compare la réponse de l'élève avec la réponse attendue
5. Tolère les fautes de frappe mineures (1-2 caractères) et les variations de casse
6. Si l'élève n'a pas répondu ou a écrit "?" / "je sais pas" → false
7. Si illisible → "unclear" + false
8. Pour les calculs mathématiques, vérifie le résultat numérique
9. "confidence" = ta certitude d'avoir bien LU la réponse de l'élève (écriture nette = proche de 1, mot douteux ou raturé = sous 0.6). Ne mets pas la même valeur partout.
10. Pour chaque réponse FAUSSE, classe l'erreur dans "error_type" : "calcul", "concept" (notion non comprise), "lecture" (énoncé mal lu), "inattention" (étourderie, unité oubliée, signe), "incomplet" (partiel), "absence" (pas de réponse), ou "autre"

JSON STRICT (rien d'autre) :
{
  "student_identifier": "Prénom et nom tels qu'écrits sur la copie" | null,
  "answers": [
    {
      "question_id": "1",
      "question_text": "2+2=?" | null,
      "student_wrote": "5" | null,
      "expected": "4",
      "is_correct": true | false,
      "error_type": "calcul" | "concept" | ... | null,
      "confidence": 0.0-1.0
    },
    ...
  ],
  "total_correct": <nombre entier>,
  "total_questions": <nombre entier>,
  "overall_confidence": 0.0-1.0
}`;
    }
  return userPrompt;
}

const DEFAULT_NAME = /^(élève \d+|eleve_?\d+|eleve_xx)$/i;
const clamp01 = (n) => Math.min(1, Math.max(0, Number(n) || 0));
const ERROR_TYPES = ['calcul', 'concept', 'lecture', 'inattention', 'incomplet', 'absence', 'autre'];

function normalizeAnswers(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 200).map((a, i) => ({
    question_id: String(a?.question_id ?? i + 1).slice(0, 20),
    ...(a?.question_text ? { question_text: String(a.question_text).slice(0, 300) } : {}),
    student_wrote: a?.student_wrote == null ? null : String(a.student_wrote).slice(0, 2000),
    expected: a?.expected == null ? null : String(a.expected).slice(0, 1000),
    is_correct: a?.is_correct === true,
    error_type: a?.is_correct === true ? null : (ERROR_TYPES.includes(a?.error_type) ? a.error_type : 'autre'),
    confidence: clamp01(a?.confidence ?? 0.5),
  }));
}

// Avec un barème : une entrée par question du barème, dans l'ordre du barème.
// Une question que le moteur n'a pas rendue est ajoutée « sans réponse », avec un indice bas
// pour que l'enseignant la vérifie (le moteur a pu la manquer).
function alignAnswers(answers, scale) {
  const sc = usableScale(scale);
  if (!sc.length) return { answers, aligned: false };
  const byId = new Map(answers.map((a) => [normId(a.question_id), a]));
  const matched = sc.filter((q) => byId.has(normId(q.id))).length;
  if (!matched) return { answers, aligned: false };
  const out = sc.map((q) => {
    const found = byId.get(normId(q.id));
    if (found) return { ...found, question_id: String(q.id) };
    return { question_id: String(q.id), student_wrote: null, expected: null, is_correct: false, error_type: 'absence', confidence: 0.5 };
  });
  return { answers: out, aligned: true };
}

// === LECTURE D'UNE COPIE ===
const copiesInFlight = new Set();

app.post('/api/extract', authMiddleware, extractLimiter, requireUserMatch, async (req, res) => {
  const userId = req.user.id;
  const { copyId } = req.body;
  if (!isUuid(copyId)) return fail(res, 400, 'missing_params');
  if (copiesInFlight.has(copyId)) return fail(res, 409, 'already_processing');
  copiesInFlight.add(copyId);

  let reservation = null;
  try {
    // La copie doit appartenir au demandeur
    const { data: copy } = await supabase
      .from('copies')
      .select('*, evaluations(*)')
      .eq('id', copyId)
      .maybeSingle();
    if (!copy || copy.evaluations?.user_id !== userId) return fail(res, 404, 'copy_not_found');
    if (copy.validated_by_user) return fail(res, 409, 'copy_already_validated');
    if (!copy.photo_storage_path || copy.photo_storage_path === PURGED) return fail(res, 410, 'copy_purged');

    const acc = await loadAccount(userId);
    if (await isSuspended(userId, acc)) return fail(res, 403, 'account_suspended');

    // Une copie n'est décomptée qu'à sa première lecture réussie
    if (!copy.processed_at) {
      reservation = await reserveCopy(userId);
      if (!reservation.ok) {
        const reason = reservation.reason;
        reservation = null;
        return fail(res, 403, reason);
      }
    }

    await supabase.from('copies').update({ status: 'processing' }).eq('id', copyId);

    const { data: signedUrl } = await supabase.storage
      .from('copies')
      .createSignedUrl(copy.photo_storage_path, 60);
    if (!signedUrl?.signedUrl) throw new EngineError('signed_url_failed', 'signed url');

    const ocrText = await mistralOcr(signedUrl.signedUrl);
    if (!ocrText.trim()) throw new EngineError('copy_unreadable', 'ocr vide');

    const evalData = copy.evaluations;
    let promptContext = '';
    if (evalData.subject_storage_path) {
      const subjectText = await readSubjectText(evalData.subject_storage_path);
      if (subjectText) promptContext = `\nSUJET DU CONTRÔLE (contexte) :\n"""\n${subjectText}\n"""\n`;
    }

    const parsed = await mistralChat([
      {
        role: 'system',
        content: 'Tu es un assistant qui extrait et compare des réponses d\'élèves. Tu retournes UNIQUEMENT du JSON valide, aucun commentaire.',
      },
      { role: 'user', content: buildExtractPrompt(evalData, promptContext, ocrText) },
    ], true);

    const readAnswers = normalizeAnswers(parsed?.answers);
    if (!readAnswers.length) throw new EngineError('copy_unreadable', 'aucune réponse lue');

    const { answers, aligned } = alignAnswers(readAnswers, evalData.grading_scale);
    const score = computeCopyScore(answers, evalData.grading_scale);
    // Indice de la copie : jamais meilleur que sa réponse la moins sûre en moyenne,
    // et plafonné si le barème n'a pas pu être appliqué (copie à regarder de près).
    const meanConfidence = answers.reduce((s, a) => s + a.confidence, 0) / answers.length;
    let confidence = Math.min(clamp01(parsed?.overall_confidence ?? parsed?.confidence ?? meanConfidence), meanConfidence + 0.05);
    if (usableScale(evalData.grading_scale).length && !aligned) confidence = Math.min(confidence, 0.6);

    // Nom lu sur la copie : on ne remplace que le nom par défaut, jamais une saisie du prof
    const readName = typeof parsed?.student_identifier === 'string' ? parsed.student_identifier.trim().slice(0, 80) : '';
    const useReadName = readName && !DEFAULT_NAME.test(readName) && DEFAULT_NAME.test(copy.student_identifier || 'eleve_xx');

    const { error: updateError } = await supabase.from('copies').update({
      ocr_text: ocrText,
      extracted_answers: answers,
      confidence_score: round2(clamp01(confidence)),
      proposed_score: Math.min(99.99, score.score),
      proposed_max_score: Math.min(99.99, score.max),
      processed_at: new Date().toISOString(),
      status: 'ready_to_validate',
      ...(useReadName ? { student_identifier: readName } : {}),
    }).eq('id', copyId);
    if (updateError) throw updateError;

    reservation = null; // lecture réussie : la copie reste décomptée
    res.json({ success: true, copyId, score: score.score, max: score.max });
  } catch (err) {
    if (reservation?.ok) await releaseCopy(userId, reservation.paid);
    await supabase.from('copies').update({ status: 'error' }).eq('id', copyId).eq('validated_by_user', false);
    const code = err instanceof EngineError ? err.code : 'extract_failed';
    const status = ['engine_unavailable', 'engine_busy', 'engine_error'].includes(code) ? 503 : (code === 'copy_unreadable' ? 422 : 500);
    fail(res, status, code, err);
  } finally {
    copiesInFlight.delete(copyId);
  }
});

// === EXPORT CSV (SACoche / Pronote) ===
app.post('/api/export', authMiddleware, authLimiter, async (req, res) => {
  const { evaluationId, format } = req.body || {};
  await handleExport(res, evaluationId, format, req.user.id);
});

app.get('/api/export', authMiddleware, authLimiter, async (req, res) => {
  const { evaluationId, format } = req.query;
  await handleExport(res, evaluationId, format, req.user.id);
});

const frNumber = (n) => String(round2(n)).replace('.', ',');

// Cellule CSV sûre : séparateur, guillemets, et formules de tableur neutralisées
function csvCell(value) {
  let s = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function getAppreciation(ratio) {
  if (ratio >= 0.9) return 'Excellent';
  if (ratio >= 0.75) return 'Très bien';
  if (ratio >= 0.6) return 'Bien';
  if (ratio >= 0.5) return 'Assez bien';
  if (ratio >= 0.4) return 'Passable';
  return 'Insuffisant';
}

async function handleExport(res, evaluationId, format, userId) {
  try {
    if (!evaluationId || !format) return fail(res, 400, 'missing_params');
    if (!['sacoche', 'pronote'].includes(format)) return fail(res, 400, 'invalid_format');

    const evaluation = await ownedEvaluation(evaluationId, userId, 'grading_scale, title, user_id');
    if (!evaluation) return fail(res, 404, 'evaluation_not_found');

    const { data: copies, error } = await supabase
      .from('copies')
      .select('student_identifier, extracted_answers, final_score, proposed_score')
      .eq('evaluation_id', evaluationId)
      .eq('validated_by_user', true);
    if (error) throw error;
    if (!copies?.length) return fail(res, 404, 'no_validated_copies');

    const scale = Array.isArray(evaluation.grading_scale) ? evaluation.grading_scale : [];
    const rows = copies
      .map((copy) => {
        const computed = computeCopyScore(copy.extracted_answers, scale);
        const score = copy.final_score != null ? Number(copy.final_score) : computed.score;
        return { name: copy.student_identifier || 'Élève', score, max: computed.max, weighted: computed.weighted, answers: Array.isArray(copy.extracted_answers) ? copy.extracted_answers : [] };
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'fr', { numeric: true, sensitivity: 'base' }));

    const lines = [];
    if (format === 'pronote') {
      lines.push(['Élève', 'Note', 'Barème', 'Note sur 20', 'Appréciation'].join(';'));
      for (const r of rows) {
        const ratio = r.max > 0 ? Math.min(1, r.score / r.max) : 0;
        lines.push([csvCell(r.name), frNumber(r.score), frNumber(r.max), frNumber(ratio * 20), getAppreciation(ratio)].join(';'));
      }
    } else {
      // Une colonne par question : points obtenus
      const weighted = rows.every((r) => r.weighted);
      const columns = weighted
        ? scale.map((q) => ({ id: normId(q.id), label: q.label || `Q${q.id}`, max: Number(q.max_points) || 0 }))
        : (rows[0]?.answers || []).map((a) => ({ id: normId(a.question_id), label: `Q${a.question_id}`, max: 1 }));
      lines.push(['Élève', ...columns.map((c) => csvCell(c.label)), 'Note', 'Barème'].join(';'));
      for (const r of rows) {
        const byId = new Map(r.answers.map((a) => [normId(a.question_id), a]));
        const cells = columns.map((c) => {
          const a = byId.get(c.id);
          return a ? frNumber(pointsFor(a, c.max)) : '';
        });
        lines.push([csvCell(r.name), ...cells, frNumber(r.score), frNumber(r.max)].join(';'));
      }
    }

    // BOM : les accents s'affichent correctement dans Excel
    const csv = '\uFEFF' + lines.join('\r\n') + '\r\n';
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${format}_${evaluationId}.csv"`);
    res.status(200).send(csv);
  } catch (err) {
    fail(res, 500, 'export_failed', err);
  }
}

// === STRIPE : création d'une session de paiement ===
// Plans (montants en centimes) — en ligne avec /pricing
const PLANS = {
  petit:         { label: 'Petit Correcteur',  amount: 500,   interval: 'month', interval_count: 1 },
  monthly:       { label: 'Standard',          amount: 1500,  interval: 'month', interval_count: 1 },
  yearly:        { label: 'Annuel Standard',   amount: 9900,  interval: 'year',  interval_count: 1 },
  expert_yearly: { label: 'Expert Bac/Brevet', amount: 14900, interval: 'year',  interval_count: 1 },
};

app.post('/api/stripe/checkout', authMiddleware, authLimiter, async (req, res) => {
  const planId = req.body?.plan;
  const plan = PLANS[planId];
  if (!plan) return fail(res, 400, 'unknown_plan');
  if (!process.env.STRIPE_SECRET_KEY) return fail(res, 503, 'payment_not_configured');

  try {
    const acc = await loadAccount(req.user.id);
    if (acc.subActive && !acc.sub.cancel_at_period_end) return fail(res, 409, 'already_subscribed');

    // Prix créés dans Stripe (libellé de relevé « COPIE EXPRESS ») si configurés, sinon prix en ligne
    const priceEnv = {
      petit: process.env.STRIPE_PRICE_PETIT,
      monthly: process.env.STRIPE_PRICE_MONTHLY,
      yearly: process.env.STRIPE_PRICE_YEARLY,
      expert_yearly: process.env.STRIPE_PRICE_EXPERT,
    }[planId];

    const line_item = priceEnv
      ? { quantity: 1, price: priceEnv }
      : {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: plan.amount,
            recurring: { interval: plan.interval, interval_count: plan.interval_count },
            product_data: { name: `Copie Express — ${plan.label}` },
          },
        };

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      ...(acc.sub?.customer ? { customer: acc.sub.customer } : { customer_email: req.user.email }),
      client_reference_id: req.user.id,
      line_items: [line_item],
      metadata: { app: 'copie-express', user_id: req.user.id, plan_id: planId },
      subscription_data: { metadata: { app: 'copie-express', user_id: req.user.id, plan_id: planId } },
      success_url: `${FRONT_URL}/app/billing?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONT_URL}/app/billing?status=cancelled`,
      allow_promotion_codes: true,
      locale: 'fr',
    });
    res.json({ url: session.url });
  } catch (err) {
    fail(res, 500, 'checkout_failed', err);
  }
});

// === STRIPE : résiliation en 1 clic (effective à la fin de la période payée) ===
async function ownedSubscription(userId) {
  const acc = await loadAccount(userId);
  if (!acc.sub?.sub_id) return null;
  const sub = await stripe.subscriptions.retrieve(acc.sub.sub_id);
  if (sub?.metadata?.user_id !== userId) return null;
  return sub;
}

app.post('/api/stripe/cancel', authMiddleware, authLimiter, async (req, res) => {
  try {
    const sub = await ownedSubscription(req.user.id);
    if (!sub || sub.status === 'canceled') return fail(res, 404, 'no_subscription');
    const updated = await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });
    const patch = periodEndPatch(updated);
    await setSubscription(req.user.id, { cancel_at_period_end: true, ...patch });
    res.json({ success: true, period_end: patch.period_end || null });
  } catch (err) {
    fail(res, 500, 'cancel_failed', err);
  }
});

app.post('/api/stripe/resume', authMiddleware, authLimiter, async (req, res) => {
  try {
    const sub = await ownedSubscription(req.user.id);
    if (!sub || sub.status === 'canceled') return fail(res, 404, 'no_subscription');
    await stripe.subscriptions.update(sub.id, { cancel_at_period_end: false });
    await setSubscription(req.user.id, { cancel_at_period_end: false });
    res.json({ success: true });
  } catch (err) {
    fail(res, 500, 'resume_failed', err);
  }
});

// === STRIPE WEBHOOK ===
// Le compte Stripe sert aussi à d'autres produits : on ne traite que les événements
// qui portent nos métadonnées (app, user_id, plan_id).
function ourSubscriptionMeta(metadata) {
  if (!metadata || !isUuid(metadata.user_id) || !PLANS[metadata.plan_id]) return null;
  return { userId: metadata.user_id, planId: metadata.plan_id };
}

// Fin de période payée. Selon la version de l'API Stripe, la date est sur l'abonnement
// ou sur sa première ligne : on accepte les deux, et on n'écrit rien si elle manque.
function periodEndPatch(sub) {
  const ts = sub?.current_period_end ?? sub?.items?.data?.[0]?.current_period_end;
  return Number.isFinite(ts) ? { period_end: new Date(ts * 1000).toISOString() } : {};
}

// Recopie l'état d'un abonnement (lu chez le prestataire de paiement) dans le compte.
// Ne fait rien si l'abonnement ne porte pas nos métadonnées.
async function applyStripeSubscription(sub) {
  const ours = ourSubscriptionMeta(sub?.metadata);
  if (!ours) return null;
  return setSubscription(ours.userId, {
    status: sub.status,
    plan: ours.planId,
    sub_id: sub.id,
    customer: typeof sub.customer === 'string' ? sub.customer : sub.customer?.id,
    ...periodEndPatch(sub),
    cancel_at_period_end: !!sub.cancel_at_period_end,
    synced_at: new Date().toISOString(),
  });
}

// === STRIPE : activation au retour du paiement ===
// Appelée par la page « Mon forfait » après le paiement : le forfait s'active tout de suite,
// même si la notification de paiement arrive en retard ou se perd.
app.post('/api/stripe/sync', authMiddleware, authLimiter, async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) return fail(res, 503, 'payment_not_configured');
  try {
    const raw = req.body?.session_id;
    const sessionId = typeof raw === 'string' && /^cs_[A-Za-z0-9_]{10,200}$/.test(raw) ? raw : null;
    let sub = null;
    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.client_reference_id !== req.user.id || session.metadata?.user_id !== req.user.id) {
        return fail(res, 404, 'no_subscription');
      }
      if (session.status !== 'complete' || !session.subscription) return res.json({ active: false, pending: true });
      sub = await stripe.subscriptions.retrieve(typeof session.subscription === 'string' ? session.subscription : session.subscription.id);
    } else {
      sub = await ownedSubscription(req.user.id);
    }
    if (!sub || sub.metadata?.user_id !== req.user.id) return fail(res, 404, 'no_subscription');
    await applyStripeSubscription(sub);
    const acc = await loadAccount(req.user.id);
    res.json({ active: acc.subActive, plan: acc.subActive ? acc.sub.plan : null, pending: !acc.subActive });
  } catch (err) {
    if (err?.code === 'resource_missing') return fail(res, 404, 'no_subscription');
    fail(res, 500, 'sync_failed', err);
  }
});

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) return fail(res, 400, 'missing_signature');
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return fail(res, 400, 'invalid_signature', err);
  }
  try {
    const obj = event.data.object;

    if (event.type === 'checkout.session.completed' && obj.mode === 'subscription' && obj.subscription) {
      const ours = ourSubscriptionMeta(obj.metadata);
      if (ours) {
        const sub = await stripe.subscriptions.retrieve(obj.subscription);
        await setSubscription(ours.userId, {
          status: 'active',
          plan: ours.planId,
          sub_id: sub.id,
          customer: typeof obj.customer === 'string' ? obj.customer : obj.customer?.id,
          ...periodEndPatch(sub),
          cancel_at_period_end: false,
        });
        console.log('[stripe] forfait activé', ours.planId);
      }
    }

    const invoiceSubId = obj.subscription || obj.parent?.subscription_details?.subscription;
    if (event.type === 'invoice.paid' && invoiceSubId) {
      const sub = await stripe.subscriptions.retrieve(typeof invoiceSubId === 'string' ? invoiceSubId : invoiceSubId.id);
      const ours = ourSubscriptionMeta(sub.metadata);
      if (ours) {
        await setSubscription(ours.userId, {
          status: 'active',
          plan: ours.planId,
          sub_id: sub.id,
          customer: typeof sub.customer === 'string' ? sub.customer : sub.customer?.id,
          ...periodEndPatch(sub),
        });
      }
    }

    if (event.type === 'customer.subscription.updated') {
      const ours = ourSubscriptionMeta(obj.metadata);
      if (ours) {
        await setSubscription(ours.userId, {
          status: obj.status,
          plan: ours.planId,
          sub_id: obj.id,
          customer: typeof obj.customer === 'string' ? obj.customer : obj.customer?.id,
          ...periodEndPatch(obj),
          cancel_at_period_end: !!obj.cancel_at_period_end,
        });
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const ours = ourSubscriptionMeta(obj.metadata);
      if (ours) await setSubscription(ours.userId, { status: 'canceled', cancel_at_period_end: false });
    }

    res.json({ received: true });
  } catch (err) {
    // 500 : Stripe renverra l'événement plus tard
    fail(res, 500, 'webhook_failed', err);
  }
});

// === CONTACT (formulaire public) ===
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { email, message, name, topic, website } = req.body || {};
    if (website) return res.json({ success: true }); // champ piège rempli = robot
    const cleanEmail = String(email || '').trim().slice(0, 200);
    const cleanMessage = String(message || '').trim().slice(0, 5000);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail) || cleanMessage.length < 10) {
      return fail(res, 400, 'invalid_contact');
    }
    const entry = {
      at: new Date().toISOString(),
      email: cleanEmail,
      name: String(name || '').trim().slice(0, 120),
      topic: String(topic || 'question').slice(0, 40),
      message: cleanMessage,
    };

    let stored = false;
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
      fs.appendFileSync(path.join(DATA_DIR, 'contact-messages.jsonl'), JSON.stringify(entry) + '\n', { mode: 0o600 });
      stored = true;
    } catch (err) {
      console.error('[contact_store_failed]', err.message);
    }

    let sent = false;
    if (resend && process.env.CONTACT_TO) {
      const { error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: process.env.CONTACT_TO,
        reply_to: cleanEmail,
        subject: `[Copie Express] ${entry.topic} — ${entry.name || cleanEmail}`,
        text: `De : ${entry.name} <${cleanEmail}>\nSujet : ${entry.topic}\n\n${cleanMessage}`,
      });
      if (error) console.error('[contact_send_failed]', error.message || error);
      else sent = true;
    }

    if (!stored && !sent) return fail(res, 500, 'contact_failed');
    res.json({ success: true });
  } catch (err) {
    fail(res, 500, 'contact_failed', err);
  }
});

// === SUPPRESSION DU COMPTE (droit à l'effacement) ===
async function listAllFiles(prefix) {
  const out = [];
  const { data: entries } = await supabase.storage.from('copies').list(prefix, { limit: 1000 });
  for (const entry of entries || []) {
    const full = `${prefix}/${entry.name}`;
    if (entry.id) out.push({ path: full, created_at: entry.created_at });
    else out.push(...(await listAllFiles(full)));
  }
  return out;
}

app.delete('/api/account', authMiddleware, authLimiter, async (req, res) => {
  const userId = req.user.id;
  if (req.body?.confirm !== 'SUPPRIMER') return fail(res, 400, 'confirmation_required');
  try {
    // 1. Abonnement : arrêt immédiat
    try {
      const sub = await ownedSubscription(userId);
      if (sub && sub.status !== 'canceled') await stripe.subscriptions.cancel(sub.id);
    } catch (err) {
      console.error('[account_delete_stripe]', err.message);
    }
    // 2. Fichiers
    const files = await listAllFiles(userId);
    for (let i = 0; i < files.length; i += 100) {
      await supabase.storage.from('copies').remove(files.slice(i, i + 100).map((f) => f.path));
    }
    // 3. Données (les copies partent avec les évaluations)
    await supabase.from('evaluations').delete().eq('user_id', userId);
    await supabase.from('users').delete().eq('id', userId);
    // 4. Compte
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    fail(res, 500, 'account_delete_failed', err);
  }
});

// === PURGE RGPD : copies de plus de 30 jours ===
// Supprime la photo, le texte lu et les réponses de l'élève. La note validée et le détail
// juste/faux par question restent (statistiques du prof), comme annoncé dans la politique
// de confidentialité.
async function runCleanup() {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 3600 * 1000).toISOString();
  let purged = 0;
  let orphans = 0;

  const { data: expired, error } = await supabase
    .from('copies')
    .select('id, photo_storage_path, extracted_answers')
    .lt('created_at', cutoff)
    .neq('photo_storage_path', PURGED)
    .limit(500);
  if (error) throw error;

  for (const copy of expired || []) {
    if (copy.photo_storage_path) await supabase.storage.from('copies').remove([copy.photo_storage_path]);
    const answers = Array.isArray(copy.extracted_answers)
      ? copy.extracted_answers.map((a) => ({ ...a, student_wrote: null }))
      : null;
    await supabase.from('copies').update({
      photo_storage_path: PURGED,
      ocr_text: null,
      extracted_answers: answers,
    }).eq('id', copy.id);
    purged++;
  }

  // Fichiers sans copie associée (dépôts interrompus), vieux de plus d'un jour
  const dayAgo = Date.now() - 24 * 3600 * 1000;
  const { data: users } = await supabase.storage.from('copies').list('', { limit: 1000 });
  for (const userDir of users || []) {
    if (userDir.id) continue;
    const { data: evalDirs } = await supabase.storage.from('copies').list(userDir.name, { limit: 1000 });
    for (const evalDir of evalDirs || []) {
      if (evalDir.id || !isUuid(evalDir.name)) continue;
      const prefix = `${userDir.name}/${evalDir.name}`;
      const files = await listAllFiles(prefix);
      if (!files.length) continue;
      const { data: evaluation } = await supabase
        .from('evaluations')
        .select('subject_storage_path, grading_key_storage_path')
        .eq('id', evalDir.name)
        .maybeSingle();
      const { data: rows } = await supabase.from('copies').select('photo_storage_path').eq('evaluation_id', evalDir.name);
      const known = new Set([
        evaluation?.subject_storage_path,
        evaluation?.grading_key_storage_path,
        ...(rows || []).map((r) => r.photo_storage_path),
      ].filter(Boolean));
      const stale = files
        .filter((f) => !known.has(f.path) && (!f.created_at || new Date(f.created_at).getTime() < dayAgo))
        .map((f) => f.path);
      if (stale.length) {
        await supabase.storage.from('copies').remove(stale);
        orphans += stale.length;
      }
    }
  }

  return { purged, orphans, cutoff };
}

// Déclenchement manuel protégé (le serveur lance aussi la purge tout seul, voir plus bas)
app.post('/api/cron/cleanup', async (req, res) => {
  const cronSecret = req.headers['x-cron-secret'];
  if (!process.env.CRON_SECRET || cronSecret !== process.env.CRON_SECRET) {
    return res.status(403).json({ error: 'unauthorized' });
  }
  try {
    res.json(await runCleanup());
  } catch (err) {
    fail(res, 500, 'cleanup_failed', err);
  }
});

// === ERREURS DE DÉPÔT (fichier trop lourd, type refusé…) ===
app.use((err, req, res, next) => {
  if (!err) return next();
  if (err.code === 'LIMIT_FILE_SIZE') return fail(res, 413, 'file_too_large');
  if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') return fail(res, 400, 'too_many_files');
  if (err.message === 'file_type_not_allowed') return fail(res, 415, 'file_type_not_allowed');
  if (err.type === 'entity.too.large') return fail(res, 413, 'file_too_large');
  if (err.type === 'entity.parse.failed') return fail(res, 400, 'invalid_request');
  return fail(res, 500, 'server_error', err);
});

app.listen(PORT, '0.0.0.0', () => console.log(`Copie Express backend running on 0.0.0.0:${PORT}`));

// La purge tourne dans le serveur lui-même : au démarrage puis toutes les 6 heures.
if (process.env.CE_DISABLE_JOBS !== '1') {
  const cleanupJob = () => runCleanup()
    .then((r) => { if (r.purged || r.orphans) console.log('[cleanup]', JSON.stringify(r)); })
    .catch((err) => console.error('[cleanup_failed]', err?.message || err));
  setTimeout(cleanupJob, 90 * 1000);
  setInterval(cleanupJob, 6 * 3600 * 1000);
}
