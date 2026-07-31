-- ============================================
-- Copie Express — Schéma Supabase (Postgres)
-- À exécuter dans : Supabase Dashboard > SQL Editor > New Query
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table USERS
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table EVALUATIONS
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'brevet_blanc' | 'bac_blanc' | 'controle'
  subject TEXT NOT NULL,
  class_level TEXT NOT NULL,
  total_copies INTEGER NOT NULL DEFAULT 0,
  grading_scale JSONB NOT NULL,
  correct_answers JSONB,
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
  status TEXT DEFAULT 'pending',  -- 'pending' | 'processing' | 'ready_to_validate' | 'validated'
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

-- Indexes
CREATE INDEX idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX idx_copies_evaluation_id ON copies(evaluation_id);
CREATE INDEX idx_copies_status ON copies(status);
CREATE INDEX idx_exports_evaluation_id ON exports(evaluation_id);
CREATE INDEX idx_exports_expires_at ON exports(expires_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE copies ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports ENABLE ROW LEVEL SECURITY;

-- Users : un user ne voit que son propre record
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Evaluations : un user ne voit que ses propres evaluations
CREATE POLICY "Users can view own evaluations" ON evaluations
  FOR ALL USING (auth.uid() = user_id);

-- Copies : un user ne voit que les copies de ses evaluations
CREATE POLICY "Users can view own copies" ON copies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM evaluations e
      WHERE e.id = copies.evaluation_id
      AND e.user_id = auth.uid()
    )
  );

-- Exports : un user ne voit que ses propres exports
CREATE POLICY "Users can view own exports" ON exports
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKETS
-- (à créer manuellement via Supabase Dashboard > Storage)
-- ============================================
-- Bucket 'copies' : privé, région EU (Frankfurt)
-- Bucket 'exports' : privé, région EU, auto-delete après 30j
-- Politiques Storage à configurer dans Dashboard > Storage > Policies

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at
  BEFORE UPDATE ON evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();