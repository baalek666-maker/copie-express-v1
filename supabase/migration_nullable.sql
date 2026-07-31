-- ============================================
-- Migration : type devient optionnel (formulaire simplifié)
-- ============================================

ALTER TABLE evaluations ALTER COLUMN type DROP NOT NULL;
ALTER TABLE evaluations ALTER COLUMN grading_scale DROP NOT NULL;
ALTER TABLE evaluations ALTER COLUMN total_copies SET DEFAULT 0;

-- Vérification
SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_name = 'evaluations'
ORDER BY ordinal_position;