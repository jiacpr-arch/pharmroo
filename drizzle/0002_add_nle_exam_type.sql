-- Migration: Add NLE (Nursing Licensing Exam) to exam_type enums
-- Expands the CHECK constraints on mcq_subjects, mcq_questions, and mcq_sessions
-- so nursing-category subjects, questions, and sessions can live alongside PLE.

-- Drop existing CHECK constraints that reference exam_type on the three tables
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT conname, conrelid::regclass::text AS tbl
    FROM pg_constraint
    WHERE contype = 'c'
      AND conrelid IN (
        'mcq_subjects'::regclass,
        'mcq_questions'::regclass,
        'mcq_sessions'::regclass
      )
      AND pg_get_constraintdef(oid) ILIKE '%exam_type%'
  LOOP
    EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I', r.tbl, r.conname);
  END LOOP;
END $$;

-- Re-add expanded CHECK constraints including 'NLE'
ALTER TABLE mcq_subjects
  ADD CONSTRAINT mcq_subjects_exam_type_check
  CHECK (exam_type IN ('PLE-PC', 'PLE-CC1', 'both', 'NLE'));

ALTER TABLE mcq_questions
  ADD CONSTRAINT mcq_questions_exam_type_check
  CHECK (exam_type IN ('PLE-PC', 'PLE-CC1', 'NLE'));

ALTER TABLE mcq_sessions
  ADD CONSTRAINT mcq_sessions_exam_type_check
  CHECK (exam_type IN ('PLE-PC', 'PLE-CC1', 'NLE'));
