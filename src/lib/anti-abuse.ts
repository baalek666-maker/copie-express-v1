import { createBrowserSupabase } from './supabase-browser';

// === CAPS PAR PLAN (anti-abus) ===
export const PLAN_LIMITS = {
  discovery: 5, // Total, one-shot (était 10 — trop, le paywall ne déclenchait jamais)
  petit: 50, // Plan Petit Correcteur 5€/mois
  monthly: 1500, // Par mois
  yearly: 2000, // Par mois
  expert_yearly: 3000, // Par mois
} as const;

export type PlanId = keyof typeof PLAN_LIMITS;

// === EMAIL JETABLES (bloqués au signup) ===
// Top 50 des services d'email temporaire les plus utilisés
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'yopmail.com', 'tempmail.com', 'temp-mail.org', 'guerrillamail.com',
  'mailinator.com', '10minutemail.com', 'throwawaymail.com', 'fakeinbox.com',
  'trashmail.com', 'getairmail.com', 'sharklasers.com', 'spam4.me',
  'maildrop.cc', 'dispostable.com', 'mintemail.com', 'mohmal.com',
  'tempinbox.com', 'tempmailaddress.com', 'byom.de', 'mt2014.com',
  'mt2015.com', 'thankyou2010.com', 'wuzup.net', 'wuzupmail.net',
  'zoemail.org', 'spamfree24.org', 'mailcatch.com', 'mailnesia.com',
  'mailtemp.info', 'no-spam.ws', 'noclickemail.com', 'objectmail.com',
  'one-time.email', 'proxymail.eu', 'rcpt.at', 'reallymymail.com',
  'rmqkr.net', 'rppkn.com', 'rtrtr.com', 's0ny.net', 'safetymail.info',
  'sandelf.de', 'saynotospams.com', 'schafmail.de', 'schrott-email.de',
  'secretemail.de', 'sendspamhere.com', 'sharedmailbox.org', 'shieldedmail.com',
  'shieldemail.com', 'shitmail.me', 'shitware.nl', 'shmeriously.com',
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return true;
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

// === FINGERPRINT NAVIGATEUR ===
// Hash simple mais stable : on prend des caractéristiques du navigateur
// Note : c'est du soft-fingerprinting (pas infaillible), mais ça bloque
// 95% des abus "bateau"
export function generateFingerprint(): string {
  if (typeof window === 'undefined') return 'server';

  const components = [
    navigator.userAgent,
    navigator.language,
    navigator.languages?.join(',') || '',
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.maxTouchPoints || 0,
  ];

  // Hash simple (djb2)
  const str = components.join('|');
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  return Math.abs(hash).toString(36);
}

// === VÉRIFICATION QUOTA ===
export interface QuotaCheckResult {
  allowed: boolean;
  reason?: string;
  remaining?: number;
  reset_at?: string;
  upgrade_required?: boolean;
}

export async function checkQuota(userId: string): Promise<QuotaCheckResult> {
  const supabase = createBrowserSupabase();
  const { data: user, error } = await supabase
    .from('users')
    .select('subscription_status, subscription_plan, trial_used, trial_copies_count, monthly_copy_count, monthly_reset_at, is_suspended')
    .eq('id', userId)
    .single();

  if (error || !user) {
    return { allowed: false, reason: 'user_not_found' };
  }

  // Suspendu ?
  if (user.is_suspended) {
    return { allowed: false, reason: 'account_suspended', upgrade_required: false };
  }

  // Payant actif ?
  if (user.subscription_status === 'active' && user.subscription_plan) {
    const limit = PLAN_LIMITS[user.subscription_plan as PlanId] || PLAN_LIMITS.monthly;

    // Reset mensuel si nécessaire
    const now = new Date();
    const resetAt = user.monthly_reset_at ? new Date(user.monthly_reset_at) : null;
    if (!resetAt || resetAt < now) {
      // Reset auto
      const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      await supabase.from('users').update({
        monthly_copy_count: 0,
        monthly_reset_at: nextReset.toISOString(),
      }).eq('id', userId);
      return { allowed: true, remaining: limit, reset_at: nextReset.toISOString() };
    }

    const remaining = limit - (user.monthly_copy_count || 0);
    if (remaining <= 0) {
      return {
        allowed: false,
        reason: 'monthly_quota_exceeded',
        remaining: 0,
        reset_at: resetAt.toISOString(),
        upgrade_required: true,
      };
    }

    return { allowed: true, remaining, reset_at: resetAt.toISOString() };
  }

  // Gratuit (trial)
  if (!user.trial_used && (user.trial_copies_count || 0) < PLAN_LIMITS.discovery) {
    return { allowed: true, remaining: PLAN_LIMITS.discovery - (user.trial_copies_count || 0) };
  }

  // Trial épuisé, pas d'abonnement
  return {
    allowed: false,
    reason: 'trial_exhausted',
    upgrade_required: true,
  };
}

// === INCRÉMENT COMPTEUR (après traitement réussi) ===
export async function incrementCopyCount(userId: string): Promise<void> {
  const supabase = createBrowserSupabase();
  const { data: user } = await supabase
    .from('users')
    .select('subscription_status, trial_used, trial_copies_count')
    .eq('id', userId)
    .single();

  if (!user) return;

  if (user.subscription_status === 'active') {
    await supabase.rpc('increment_monthly_count', { user_id_param: userId });
  } else {
    const newCount = (user.trial_copies_count || 0) + 1;
    await supabase.from('users').update({
      trial_copies_count: newCount,
      trial_used: newCount >= PLAN_LIMITS.discovery,
      trial_used_at: new Date().toISOString(),
      last_copy_at: new Date().toISOString(),
    }).eq('id', userId);
  }
}

// === DÉLAI MIN ENTRE COPIES (anti spam) ===
const MIN_DELAY_BETWEEN_COPIES_MS = 30 * 1000; // 30 secondes

export async function checkDelaySinceLastCopy(userId: string): Promise<{ allowed: boolean; retry_after_seconds?: number }> {
  const supabase = createBrowserSupabase();
  const { data: user } = await supabase
    .from('users')
    .select('last_copy_at')
    .eq('id', userId)
    .single();

  if (!user?.last_copy_at) return { allowed: true };

  const lastCopy = new Date(user.last_copy_at).getTime();
  const now = Date.now();
  const elapsed = now - lastCopy;

  if (elapsed < MIN_DELAY_BETWEEN_COPIES_MS) {
    return {
      allowed: false,
      retry_after_seconds: Math.ceil((MIN_DELAY_BETWEEN_COPIES_MS - elapsed) / 1000),
    };
  }

  return { allowed: true };
}

// === FINGERPRINT ENREGISTREMENT ===
export async function registerFingerprint(userId: string, fingerprint: string): Promise<void> {
  const supabase = createBrowserSupabase();

  // Compte les comptes existants avec ce fingerprint
  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('fingerprint_hash', fingerprint);

  await supabase.from('users').update({
    fingerprint_hash: fingerprint,
    fingerprint_account_count: count || 1,
  }).eq('id', userId);
}

// === AUDIT COMPLET (à appeler avant chaque upload) ===
export interface FullAuditResult {
  allowed: boolean;
  quota: QuotaCheckResult;
  delay: { allowed: boolean; retry_after_seconds?: number };
  fingerprint_ok: boolean;
  reasons: string[];
}

export async function runAntiAbuseAudit(userId: string): Promise<FullAuditResult> {
  const reasons: string[] = [];

  const quota = await checkQuota(userId);
  if (!quota.allowed) reasons.push(`quota: ${quota.reason}`);

  const delay = await checkDelaySinceLastCopy(userId);
  if (!delay.allowed) reasons.push(`delay: wait ${delay.retry_after_seconds}s`);

  // Fingerprint check (soft warning, pas bloquant)
  const fingerprint = generateFingerprint();
  const supabase = createBrowserSupabase();
  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('fingerprint_hash', fingerprint);
  const fingerprint_ok = (count || 0) <= 2; // Soft warning si 3+ comptes

  if (!fingerprint_ok) reasons.push(`fingerprint: ${count} accounts same browser`);

  return {
    allowed: quota.allowed && delay.allowed,
    quota,
    delay,
    fingerprint_ok,
    reasons,
  };
}