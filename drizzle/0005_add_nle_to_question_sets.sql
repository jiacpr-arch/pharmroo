-- Migration: Add NLE to question_sets.exam_type
-- Lets admins create NLE (nursing) question sets alongside existing PLE sets.

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT conname
    FROM pg_constraint
    WHERE contype = 'c'
      AND conrelid = 'question_sets'::regclass
      AND pg_get_constraintdef(oid) ILIKE '%exam_type%'
  LOOP
    EXECUTE format('ALTER TABLE question_sets DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

ALTER TABLE question_sets
  ADD CONSTRAINT question_sets_exam_type_check
  CHECK (exam_type IS NULL OR exam_type IN ('PLE-CC1', 'PLE-PC1', 'PLE-IP1', 'PLE-PHCP1', 'NLE', 'mixed'));
