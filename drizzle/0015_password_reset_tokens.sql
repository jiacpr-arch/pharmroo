-- Migration: password reset tokens (forgot-password flow). Only the SHA-256 hash of the token is stored.

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at text NOT NULL,
  used_at text,
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx ON password_reset_tokens(user_id);

-- Match the other tables: RLS on with no policies (the app connects directly via DATABASE_URL; PostgREST gets no access).
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
