-- ============================================
-- Migration : ajout du sujet (optionnel) à evaluations
-- ============================================

ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS subject_storage_path TEXT;
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS subject_uploaded_at TIMESTAMPTZ;

-- Le sujet est dans le même bucket que les copies (privé, RLS)
-- Pas besoin de nouveau bucket

-- Vérification
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'evaluations'
ORDER BY ordinal_position;