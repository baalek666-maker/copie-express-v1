// Forfait et compteurs du compte, lus dans app_metadata (seul le serveur peut y écrire).
// Mêmes règles que le serveur (index.js) : garder les deux alignés.

export const TRIAL_LIMIT = 5;

export const PLAN_LIMITS: Record<string, number> = {
  petit: 50,
  monthly: 500,
  yearly: 2000,
  expert_yearly: 3000,
};

export const PLAN_NAMES: Record<string, string> = {
  discovery: 'Découverte',
  petit: 'Petit Correcteur',
  monthly: 'Standard',
  yearly: 'Annuel',
  expert_yearly: 'Expert Bac/Brevet',
};

export const PLAN_PRICES: Record<string, string> = {
  petit: '5 € / mois',
  monthly: '15 € / mois',
  yearly: '99 € / an',
  expert_yearly: '149 € / an',
};

const GRACE_MS = 3 * 24 * 3600 * 1000;

export interface AccountPlan {
  plan: string;
  name: string;
  paid: boolean;
  limit: number;
  used: number;
  remaining: number;
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export function planFromUser(
  user: { app_metadata?: Record<string, any> } | null | undefined,
  fallbackTrialUsed = 0
): AccountPlan {
  const meta = user?.app_metadata || {};
  const sub = meta.ce_sub || null;
  const usage = meta.ce_usage || null;
  const month = new Date().toISOString().slice(0, 7);

  const active = !!sub
    && ['active', 'trialing'].includes(sub.status)
    && !!PLAN_LIMITS[sub.plan]
    && (!sub.period_end || new Date(sub.period_end).getTime() + GRACE_MS > Date.now());

  if (active) {
    const limit = PLAN_LIMITS[sub.plan];
    const used = usage && usage.month === month ? Number(usage.monthly) || 0 : 0;
    return {
      plan: sub.plan,
      name: PLAN_NAMES[sub.plan],
      paid: true,
      limit,
      used,
      remaining: Math.max(0, limit - used),
      periodEnd: sub.period_end || null,
      cancelAtPeriodEnd: !!sub.cancel_at_period_end,
    };
  }

  const used = usage ? Number(usage.trial) || 0 : Math.max(0, fallbackTrialUsed);
  return {
    plan: 'discovery',
    name: PLAN_NAMES.discovery,
    paid: false,
    limit: TRIAL_LIMIT,
    used: Math.min(used, TRIAL_LIMIT),
    remaining: Math.max(0, TRIAL_LIMIT - used),
    periodEnd: null,
    cancelAtPeriodEnd: false,
  };
}

export function frDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}
