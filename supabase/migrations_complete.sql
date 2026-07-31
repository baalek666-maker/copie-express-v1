-- ============================================
-- MIGRATION COMPLÈTE — Copie Express
-- ============================================
-- Ce script est IDEMPOTENT : tu peux le relancer
-- sans risque. Il consolide toutes les migrations
-- précédentes + les ajustements V2.

-- 1. SCHEMA DE BASE
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table USERS (avec colonnes anti-abus)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  academy TEXT,
  subject TEXT[],
  school_level TEXT[],
  role TEXT DEFAULT 'teacher',
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT,
  subscription_plan TEXT,
  subscription_expires_at TIMESTAMPTZ,
  trial_used BOOLEAN DEFAULT FALSE,
  trial_copies_count INTEGER DEFAULT 0,
  trial_used_at TIMESTAMPTZ,
  monthly_copy_count INTEGER DEFAULT 0,
  monthly_reset_at TIMESTAMPTZ,
  fingerprint_hash TEXT,
  fingerprint_account_count INTEGER DEFAULT 1,
  last_copy_at TIMESTAMPTZ,
  is_suspended BOOLEAN DEFAULT FALSE,
  suspended_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table EVALUATIONS
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT,
  subject TEXT NOT NULL,
  class_level TEXT NOT NULL,
  total_copies INTEGER DEFAULT 0,
  grading_scale JSONB,
  correct_answers JSONB,
  subject_storage_path TEXT,
  subject_uploaded_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table COPIES
CREATE TABLE IF NOT EXISTS copies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE NOT NULL,
  student_identifier TEXT,
  photo_storage_path TEXT NOT NULL,
  ocr_text TEXT,
  extracted_answers JSONB,
  confidence_score NUMERIC(3,2),
  validated_by_user BOOLEAN DEFAULT FALSE,
  user_corrections JSONB,
  final_score NUMERIC(4,2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  validated_at TIMESTAMPTZ
);

-- Table EXPORTS
CREATE TABLE IF NOT EXISTS exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  format TEXT NOT NULL,
  file_storage_path TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1b. MIGRATIONS ALTER TABLE (idempotent pour DB existantes)
-- Anti-abus (users)
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_used_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_copy_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_reset_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS fingerprint_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS fingerprint_account_count INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_copy_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_reason TEXT;

-- Sujet optionnel (evaluations)
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS subject_storage_path TEXT;
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS subject_uploaded_at TIMESTAMPTZ;

-- Colonnes nullable (V2 formulaire simplifié)
ALTER TABLE evaluations ALTER COLUMN type DROP NOT NULL;
ALTER TABLE evaluations ALTER COLUMN grading_scale DROP NOT NULL;
ALTER TABLE evaluations ALTER COLUMN total_copies SET DEFAULT 0;

-- 2. INDEXES
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_copies_evaluation_id ON copies(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_copies_status ON copies(status);
CREATE INDEX IF NOT EXISTS idx_exports_evaluation_id ON exports(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_exports_expires_at ON exports(expires_at);
CREATE INDEX IF NOT EXISTS idx_users_fingerprint ON users(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users(lower(email));
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

-- 3. ROW LEVEL SECURITY
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE copies ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports ENABLE ROW LEVEL SECURITY;

-- Policies : users voient que leurs données
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can view own evaluations" ON evaluations;
DROP POLICY IF EXISTS "Users can view own copies" ON copies;
DROP POLICY IF EXISTS "Users can view own exports" ON exports;

CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own evaluations" ON evaluations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own copies" ON copies FOR ALL USING (
  EXISTS (SELECT 1 FROM evaluations e WHERE e.id = copies.evaluation_id AND e.user_id = auth.uid())
);
CREATE POLICY "Users can view own exports" ON exports FOR ALL USING (auth.uid() = user_id);

-- 4. TRIGGERS updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_evaluations_updated_at ON evaluations;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON evaluations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. ANTI-ABUSE : Incrément mensuel
CREATE OR REPLACE FUNCTION increment_monthly_count(user_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET monthly_copy_count = COALESCE(monthly_copy_count, 0) + 1,
      last_copy_at = NOW()
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- 6. ANTI-ABUSE : Reset mensuel
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

-- 7. AUTH SYNC : créer public.users à chaque signup Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, academy, subject, school_level)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'academy',
    CASE
      WHEN NEW.raw_user_meta_data->>'subject' IS NOT NULL
      THEN ARRAY[NEW.raw_user_meta_data->>'subject']
      ELSE NULL
    END,
    CASE
      WHEN NEW.raw_user_meta_data->>'school_level' IS NOT NULL
      THEN ARRAY[NEW.raw_user_meta_data->>'school_level']
      ELSE NULL
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 8. BACKFILL : copier les users existants auth.users → public.users
INSERT INTO public.users (id, email, full_name)
SELECT
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name'
FROM auth.users au
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FIN — Tu peux relancer ce script sans risque
-- ============================================
SELECT '✅ Migration complète OK' as status;