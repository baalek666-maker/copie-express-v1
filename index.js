// index.js — Express backend pour Copie Express
// Endpoints : upload, extraction Mistral, export CSV, cron RGPD

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Mistral API via fetch direct (évite les problèmes de version du SDK)
const MISTRAL_API_URL = 'https://api.mistral.ai/v1';
async function mistralChat(messages, jsonMode = true) {
  const response = await fetch(`${MISTRAL_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
      temperature: 0,
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Mistral chat ${response.status}: ${err}`);
  }
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  return jsonMode ? JSON.parse(content) : content;
}

async function mistralOcr(documentUrl) {
  const response = await fetch(`${MISTRAL_API_URL}/ocr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-ocr-latest',
      document: { type: 'document_url', document_url: documentUrl },
      include_image_base64: false,
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Mistral OCR ${response.status}: ${err}`);
  }
  const data = await response.json();
  return data.pages?.map(p => p.markdown || '').join('\n\n') || '';
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// CORS permissif pour le développement (Vercel + localhost)
const allowedOrigins = [
  'https://copie-express-v1.vercel.app',
  'http://localhost:3000',
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, true); // Permissif en dev : on accepte tout
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));

// Désactive le streaming pour multer : on lit tout en buffer d'abord
// (évite ERR_FAILED lié à HTTP/2 RST_STREAM entre Vercel et Railway)
app.use((req, res, next) => {
  if (req.method === 'POST' && req.headers['content-type']?.includes('multipart/form-data')) {
    // Le body est déjà bufferisé par multer.single() / multer.array()
    // On force Connection: close pour éviter le HTTP/2 streaming
    res.setHeader('Connection', 'close');
  }
  next();
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

// === HEALTH ===
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'copie-express-backend', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'copie-express-backend', timestamp: new Date().toISOString() });
});

// === UPLOAD BARÈME (optionnel, 1 fois par évaluation) ===
// Upload une PHOTO du barème (ou PDF), OCR Mistral pour extraire le texte
app.post('/api/grading-key', upload.single('file'), async (req, res) => {
  console.log('[GRADING-KEY] request received, headers:', req.headers['content-type']);
  console.log('[GRADING-KEY] body keys:', Object.keys(req.body));
  console.log('[GRADING-KEY] file:', req.file ? { name: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype } : null);
  try {
    const { evaluationId, userId } = req.body;
    if (!evaluationId || !userId) return res.status(400).json({ error: 'missing_params', received: { evaluationId: !!evaluationId, userId: !!userId } });
    if (!req.file) return res.status(400).json({ error: 'no_file', hint: 'multer did not parse the file' });

    // Vérifier que l'éval appartient au user
    const { data: evalData, error: evalError } = await supabase
      .from('evaluations')
      .select('id, user_id')
      .eq('id', evaluationId)
      .eq('user_id', userId)
      .single();

    if (evalError || !evalData) return res.status(404).json({ error: 'evaluation_not_found' });

    // Upload l'image dans le bucket copies
    const filename = `${userId}/${evaluationId}/grading_key_${Date.now()}_${req.file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('copies')
      .upload(filename, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

    if (uploadError) {
      console.error('grading key upload error:', uploadError);
      return res.status(500).json({ error: 'upload_failed' });
    }

    // OCR du barème via Mistral OCR
    const { data: signedUrl } = await supabase.storage
      .from('copies')
      .createSignedUrl(filename, 60);

    if (!signedUrl?.signedUrl) {
      return res.status(500).json({ error: 'signed_url_failed' });
    }

    const rawText = await mistralOcr(signedUrl.signedUrl);

    // Nettoyage du texte OCR pour avoir un barème lisible
    const cleanedText = rawText
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Update l'évaluation avec le barème texte
    await supabase.from('evaluations').update({
      grading_key: cleanedText,
      grading_key_storage_path: filename,
      grading_key_uploaded_at: new Date().toISOString(),
    }).eq('id', evaluationId);

    res.json({
      success: true,
      path: filename,
      extracted_text: cleanedText,
      pages: ocrResponse.pages?.length || 0,
    });
  } catch (err) {
    console.error('grading key error:', err);
    res.status(500).json({ error: 'grading_key_failed', details: err.message });
  }
});

// === UPLOAD SUJET (optionnel, 1 fois par évaluation) ===
app.post('/api/subject', upload.single('file'), async (req, res) => {
  console.log('[SUBJECT] request received, headers:', req.headers['content-type']);
  console.log('[SUBJECT] body keys:', Object.keys(req.body));
  console.log('[SUBJECT] file:', req.file ? { name: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype } : null);
  try {
    const { evaluationId, userId } = req.body;
    if (!evaluationId || !userId) return res.status(400).json({ error: 'missing_params', received: { evaluationId: !!evaluationId, userId: !!userId } });
    if (!req.file) return res.status(400).json({ error: 'no_file', hint: 'multer did not parse the file' });

    // Vérifier que l'éval appartient au user
    console.log('[SUBJECT] Checking evaluation:', evaluationId, 'for user:', userId);
    const { data: evalData, error: evalError } = await supabase
      .from('evaluations')
      .select('id, user_id')
      .eq('id', evaluationId)
      .eq('user_id', userId)
      .single();

    console.log('[SUBJECT] evalData:', evalData, 'evalError:', evalError);
    if (evalError || !evalData) return res.status(404).json({ error: 'evaluation_not_found', evalError: evalError?.message });

    // Upload le sujet dans le bucket copies
    const filename = `${userId}/${evaluationId}/subject_${Date.now()}_${req.file.originalname}`;
    console.log('[SUBJECT] uploading to storage:', filename);
    const { data, error } = await supabase.storage
      .from('copies')
      .upload(filename, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

    console.log('[SUBJECT] storage result:', { data, error });
    if (error) {
      console.error('subject upload error:', error);
      return res.status(500).json({ error: 'upload_failed', details: error.message });
    }

    // Update l'évaluation
    await supabase.from('evaluations').update({
      subject_storage_path: data.path,
      subject_uploaded_at: new Date().toISOString(),
    }).eq('id', evaluationId);

    res.json({ success: true, path: data.path });
  } catch (err) {
    console.error('subject error:', err);
    res.status(500).json({ error: 'subject_upload_failed' });
  }
});

// === UPLOAD ===
app.post('/api/upload', upload.array('files', 100), async (req, res) => {
  try {
    const { evaluationId, userId } = req.body;
    const files = req.files;
    if (!files?.length) return res.status(400).json({ error: 'no_files' });
    if (!evaluationId || !userId) return res.status(400).json({ error: 'missing_params' });

    const uploaded = [];
    for (const file of files) {
      const filename = `${userId}/${evaluationId}/${Date.now()}_${file.originalname}`;
      const { data, error } = await supabase.storage
        .from('copies')
        .upload(filename, file.buffer, { contentType: file.mimetype, upsert: false });

      if (error) { console.error('upload error:', error); continue; }
      uploaded.push(data.path);
    }

    res.json({ uploaded: uploaded.length, paths: uploaded });
  } catch (err) {
    console.error('upload error:', err);
    res.status(500).json({ error: 'upload_failed' });
  }
});

// === EXTRACT (Mistral OCR + LLM) ===
app.post('/api/extract', async (req, res) => {
  const { evaluationId, copyId, userId } = req.body;
  if (!evaluationId || !copyId || !userId) {
    return res.status(400).json({ error: 'missing_params' });
  }

  try {
    console.log('[EXTRACT] start for copyId:', copyId);

    // === ANTI-ABUSE BACKEND CHECK ===
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('subscription_status, subscription_plan, trial_used, trial_copies_count, monthly_copy_count, is_suspended')
      .eq('id', userId)
      .single();

    if (userError || !user) return res.status(404).json({ error: 'user_not_found' });

    if (user.is_suspended) {
      return res.status(403).json({ error: 'account_suspended' });
    }

    // Vérif quota (côté serveur = infaillible)
    if (user.subscription_status !== 'active') {
      if (user.trial_used || (user.trial_copies_count || 0) >= 10) {
        return res.status(403).json({ error: 'trial_exhausted' });
      }
    } else {
      const limits = { monthly: 1500, yearly: 2000, expert_yearly: 3000 };
      const limit = limits[user.subscription_plan] || 1500;
      if ((user.monthly_copy_count || 0) >= limit) {
        return res.status(403).json({ error: 'monthly_quota_exceeded', limit });
      }
    }

    // Récupère la copie
    const { data: copy, error: copyError } = await supabase
      .from('copies')
      .select('*, evaluations(*)')
      .eq('id', copyId)
      .single();

    if (copyError || !copy) return res.status(404).json({ error: 'copy_not_found' });

    // Récupère l'URL signée
    const { data: signedUrl } = await supabase.storage
      .from('copies')
      .createSignedUrl(copy.photo_storage_path, 60);

    if (!signedUrl?.signedUrl) return res.status(500).json({ error: 'signed_url_failed' });

    // Step 1 : OCR de la copie
    const ocrText = await mistralOcr(signedUrl.signedUrl);

    // Step 2 : Extraction structurée (avec sujet optionnel)
    const evalData = copy.evaluations;
    let promptContext = '';

    // Si un sujet a été uploadé, on l'OCR et on l'ajoute au prompt
    if (evalData.subject_storage_path) {
      const { data: subjectSignedUrl } = await supabase.storage
        .from('copies')
        .createSignedUrl(evalData.subject_storage_path, 60);

      if (subjectSignedUrl?.signedUrl) {
        const subjectText = await mistralOcr(subjectSignedUrl.signedUrl);
        promptContext = `\nSUJET DU CONTRÔLE (contexte) :\n"""\n${subjectText}\n"""\n`;
      }
    }

    // === Construction du prompt selon ce qui est disponible ===
    const hasSubject = !!evalData.subject_storage_path;
    const hasGradingKey = !!evalData.grading_key;

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

JSON STRICT (rien d'autre) :
{
  "student_identifier": "eleve_001" | null,
  "answers": [
    {
      "question_id": "1",
      "student_wrote": "4" | null,
      "expected": "4",
      "is_correct": true | false,
      "confidence": 0.0-1.0
    },
    ...
  ],
  "total_correct": <nombre entier>,
  "total_questions": <nombre entier>,
  "overall_confidence": 0.0-1.0
}`;
    } else {
      // MODE SIMPLE : juste extraction des réponses (sans notation)
      userPrompt = `${hasSubject ? 'Voici le SUJET et la COPIE de l\'élève. Extrait ses réponses en te basant sur les questions du sujet.' : 'Voici la COPIE de l\'élève. Extrait ses réponses.'}

${promptContext}Texte OCR de la copie :
"""
${ocrText}
"""

JSON STRICT :
{
  "student_identifier": "eleve_XX" | null,
  "answers": {"<question_id>": "réponse élève" | null, ...},
  "confidence": 0.0-1.0
}`;
    }

    const parsed = await mistralChat([
      {
        role: 'system',
        content: 'Tu es un assistant qui extrait et compare des réponses d\'élèves. Tu retournes UNIQUEMENT du JSON valide, aucun commentaire.',
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ], true);

    // Calcul du score total
    let totalScore = null;
    let maxScore = null;
    if (hasGradingKey && parsed.answers && Array.isArray(parsed.answers)) {
      totalScore = parsed.answers.filter(a => a.is_correct === true).length;
      maxScore = parsed.total_questions || parsed.answers.length;
    }

    // Update la copie
    await supabase.from('copies').update({
      ocr_text: ocrText,
      extracted_answers: parsed.answers,
      confidence_score: parsed.overall_confidence || parsed.confidence || 0,
      proposed_score: totalScore,
      proposed_max_score: maxScore,
      processed_at: new Date().toISOString(),
      status: 'ready_to_validate',
    }).eq('id', copyId);

    res.json({ success: true, copyId, parsed });
  } catch (err) {
    console.error('=== EXTRACT ERROR ===');
    console.error('copyId:', copyId);
    console.error('error:', err && err.message ? err.message : String(err));
    console.error('======================');
    res.status(500).json({ error: 'extract_failed', details: err && err.message ? err.message : 'unknown error' });
  }
});

// === EXPORT CSV (SACoche / Pronote) ===
app.post('/api/export', async (req, res) => {
  try {
    const { evaluationId, format } = req.body; // format: 'sacoche' | 'pronote' | 'xlsx'
    if (!evaluationId || !format) return res.status(400).json({ error: 'missing_params' });

    const { data: copies, error } = await supabase
      .from('copies')
      .select('*')
      .eq('evaluation_id', evaluationId)
      .eq('validated_by_user', true);

    if (error) throw error;
    if (!copies?.length) return res.status(404).json({ error: 'no_validated_copies' });

    // Calcul du score pour chaque copie
    const { data: evaluation } = await supabase
      .from('evaluations')
      .select('grading_scale, correct_answers')
      .eq('id', evaluationId)
      .single();

    const scale = evaluation.grading_scale;
    let csv = '';

    if (format === 'sacoche') {
      const headers = ['eleve', ...scale.map(q => q.id), 'note'];
      csv = headers.join(';') + '\n';
      for (const copy of copies) {
        const row = [copy.student_identifier || 'eleve_XX'];
        let total = 0;
        for (const q of scale) {
          const ans = copy.extracted_answers?.[q.id];
          const correct = evaluation.correct_answers?.[q.id];
          const pts = ans && correct && ans.toLowerCase() === correct.toLowerCase() ? q.max_points : 0;
          row.push(`"${ans || ''}"`);
          total += pts;
        }
        row.push(total.toFixed(2));
        csv += row.join(';') + '\n';
      }
    } else if (format === 'pronote') {
      csv = 'Nom;Note;Appreciation\n';
      for (const copy of copies) {
        const total = computeScore(copy.extracted_answers, scale, evaluation.correct_answers);
        csv += `${copy.student_identifier || 'eleve_XX'};${total.toFixed(2)};${getAppreciation(total / scale.reduce((s, q) => s + q.max_points, 0))}\n`;
      }
    }

    // Upload le CSV
    const filename = `${evaluationId}/${Date.now()}_${format}.csv`;
    await supabase.storage.from('exports').upload(filename, csv, { contentType: 'text/csv' });

    // Trace l'export
    await supabase.from('exports').insert({
      evaluation_id: evaluationId,
      format,
      file_storage_path: filename,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    res.json({ success: true, filename, preview: csv.split('\n').slice(0, 3).join('\n') });
  } catch (err) {
    console.error('export error:', err);
    res.status(500).json({ error: 'export_failed' });
  }
});

function computeScore(answers, scale, correctAnswers) {
  let total = 0;
  for (const q of scale) {
    const ans = answers?.[q.id];
    const correct = correctAnswers?.[q.id];
    if (ans && correct && ans.toLowerCase().trim() === correct.toLowerCase().trim()) total += q.max_points;
  }
  return total;
}

function getAppreciation(ratio) {
  if (ratio >= 0.9) return 'Excellent';
  if (ratio >= 0.75) return 'Très bien';
  if (ratio >= 0.6) return 'Bien';
  if (ratio >= 0.5) return 'Assez bien';
  if (ratio >= 0.4) return 'Passable';
  return 'Insuffisant';
}

// === STRIPE WEBHOOK ===
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata.user_id;
      const planId = session.metadata.plan_id;
      await supabase.from('users').update({
        subscription_status: 'active',
        subscription_plan: planId,
        stripe_customer_id: session.customer,
      }).eq('id', userId);
    }
    res.json({ received: true });
  } catch (err) {
    console.error('webhook error:', err);
    res.status(400).json({ error: 'webhook_failed' });
  }
});

// === CRON RGPD : suppression copies > 30 jours ===
// À héberger séparément (ex: GitHub Action cron, Railway cron, Vercel cron)
app.post('/api/cron/cleanup', async (req, res) => {
  try {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: expiredCopies } = await supabase
      .from('copies')
      .select('id, photo_storage_path, evaluations!inner(created_at)')
      .lt('evaluations.created_at', cutoff);

    let deleted = 0;
    for (const copy of expiredCopies || []) {
      await supabase.storage.from('copies').remove([copy.photo_storage_path]);
      await supabase.from('copies').delete().eq('id', copy.id);
      deleted++;
    }
    res.json({ deleted, cutoff });
  } catch (err) {
    console.error('cleanup error:', err);
    res.status(500).json({ error: 'cleanup_failed' });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Copie Express backend running on 0.0.0.0:${PORT}`));

// Force la fermeture des connexions après chaque requête (évite ERR_FAILED HTTP/2)
app.use((req, res, next) => {
  res.setHeader('Connection', 'close');
  next();
});// Trigger Railway redeploy
