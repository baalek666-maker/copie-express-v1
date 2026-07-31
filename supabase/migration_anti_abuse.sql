-- ============================================
-- MIGRATION : Ajout des colonnes anti-abus
-- À exécuter dans Supabase SQL Editor
-- Safe : utilise IF NOT EXISTS partout
-- ============================================

-- Colonnes anti-abus sur users
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_used_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_copy_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_reset_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS fingerprint_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS fingerprint_account_count INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_copy_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_reason TEXT;

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_users_fingerprint ON users(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users(lower(email));
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

-- Fonction d'incrément compteur mensuel (atomic)
CREATE OR REPLACE FUNCTION increment_monthly_count(user_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET monthly_copy_count = COALESCE(monthly_copy_count, 0) + 1,
      last_copy_at = NOW()
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Fonction de reset mensuel (à appeler via cron)
CREATE OR REPLACE FUNCTION reset_monthly_quotas()
RETURNS void AS $$
BEGIN
  UPDATE users
  SET monthly_copy_count = 0,
      monthly_reset_at = date_trunc('month', NOW()) + INTERVAL '1 month'
  WHERE subscription_status = 'active'
    AND monthly_reset_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Vérification : affichage des colonnes users
-- ============================================
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;