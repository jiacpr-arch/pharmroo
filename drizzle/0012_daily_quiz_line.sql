-- Migration: daily_quiz_answers — LINE daily MCQ (Phase 2)
--
-- One row per (line_user_id, quiz_date): records the answer a LINE-linked
-- user tapped on the daily MCQ pushed by /api/line/daily-reminder, graded
-- server-side in lib/daily-mcq-line.ts. The unique index makes a repeated
-- postback tap (double-tap, retried delivery) a no-op rather than a
-- double-count.

CREATE TABLE IF NOT EXISTS daily_quiz_answers (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  line_user_id text NOT NULL,
  user_id text REFERENCES users(id) ON DELETE SET NULL,
  question_id text NOT NULL REFERENCES mcq_questions(id) ON DELETE CASCADE,
  quiz_date text NOT NULL,
  selected_answer text NOT NULL,
  is_correct boolean NOT NULL,
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_daily_quiz_answers
  ON daily_quiz_answers (line_user_id, quiz_date);
