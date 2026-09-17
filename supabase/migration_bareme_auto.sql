-- 16/09/2026 — Barème auto : colonne témoin (la structure est en JSONB existant :
-- grading_scale, correct_answers, grading_key déjà présents). Aucune donnée migrée.
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS bareme_auto_generated_at TIMESTAMPTZ;
