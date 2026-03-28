-- Migration: Add exam_day column to support PLE-CC1 Day 1 / Day 2
-- Run this if you already created the tables without exam_day

ALTER TABLE public.mcq_questions
  ADD COLUMN IF NOT EXISTS exam_day SMALLINT CHECK (exam_day IN (1, 2));

ALTER TABLE public.mcq_sessions
  ADD COLUMN IF NOT EXISTS exam_day SMALLINT CHECK (exam_day IN (1, 2));

-- Update existing sample questions to Day 1
UPDATE public.mcq_questions
SET exam_day = 1
WHERE exam_source LIKE '%Dec 2025%' AND exam_day IS NULL;

-- Index for fast filtering by day
CREATE INDEX IF NOT EXISTS idx_mcq_questions_exam_day
  ON public.mcq_questions(exam_day);
