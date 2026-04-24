-- Migration: Add exam_category to users
-- Separates higher-level track (pharmacy / nursing) from the specific target_exam
-- so we can group PLE-PC + PLE-CC1 under "pharmacy" and NLE (+ future variants) under "nursing".

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS exam_category TEXT;

ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_exam_category_check;

ALTER TABLE users
  ADD CONSTRAINT users_exam_category_check
  CHECK (exam_category IS NULL OR exam_category IN ('pharmacy', 'nursing'));

-- Backfill from existing target_exam
UPDATE users
SET exam_category = CASE
  WHEN target_exam = 'NLE' THEN 'nursing'
  WHEN target_exam IN ('PLE-PC', 'PLE-CC1') THEN 'pharmacy'
  ELSE exam_category
END
WHERE exam_category IS NULL AND target_exam IS NOT NULL;
