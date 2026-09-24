-- Migration: leads + chat_messages (Phase 3 — AI chatbot on the LINE OA)

CREATE TABLE IF NOT EXISTS leads (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  line_user_id text UNIQUE,
  email text,
  user_id text REFERENCES users(id) ON DELETE SET NULL,
  stage text NOT NULL DEFAULT 'new',
  source text NOT NULL DEFAULT 'line_oa',
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS'),
  updated_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  channel text NOT NULL DEFAULT 'line',
  channel_user_id text NOT NULL,
  user_id text REFERENCES users(id) ON DELETE SET NULL,
  lead_id text REFERENCES leads(id) ON DELETE SET NULL,
  role text NOT NULL,
  content text NOT NULL,
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_channel_user
  ON chat_messages (channel_user_id, created_at);
