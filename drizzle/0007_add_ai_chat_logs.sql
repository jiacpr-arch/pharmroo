-- Migration: AI chat logs
-- Backs per-user rate limiting for /api/ai/mcq-chat (mirrors lesson_questions
-- for /api/learn/ask).

CREATE TABLE IF NOT EXISTS ai_chat_logs (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id text REFERENCES mcq_questions(id) ON DELETE SET NULL,
  user_question text NOT NULL,
  status text NOT NULL DEFAULT 'answered' CHECK (status IN ('answered', 'failed')),
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_logs_user_created
  ON ai_chat_logs (user_id, created_at);
