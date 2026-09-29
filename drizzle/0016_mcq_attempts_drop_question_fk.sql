-- Migration: let mcq_attempts record answers to the static PLE question banks
--
-- /ple/practice and /ple/pc1-pilot serve questions from TypeScript files
-- (lib/ip1-*.ts, lib/pc1-bank.ts) whose ids (ip1set1_001, pc1pilot001, ...)
-- are not rows in mcq_questions, so every attempt insert failed on
-- mcq_attempts_question_id_fkey (23503) since 2026-09-22: progress on those
-- sets was lost and free users were never counted against the daily limit.
-- Joins from mcq_attempts to mcq_questions (subject stats) simply skip
-- attempts on static questions.

ALTER TABLE mcq_attempts DROP CONSTRAINT IF EXISTS mcq_attempts_question_id_fkey;
