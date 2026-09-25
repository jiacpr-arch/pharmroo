-- Migration: LINE OA core — unfollow tracking + notification dedupe
--
-- Part of bringing pharmroo's LINE OA up to parity with morroo's (Phase 1:
-- core + notifications). Adds:
--   1. line_unfollow_events — audit trail for when a user blocks the OA
--      (the webhook doesn't yet clear users.line_user_id on unfollow; this
--      just records it so we can decide that policy later without losing data).
--   2. line_messages_sent — dedupe log so cron jobs (e.g. expiry-warning)
--      don't re-notify the same user for the same event every day.

CREATE TABLE IF NOT EXISTS line_unfollow_events (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  line_user_id text NOT NULL,
  unfollowed_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

CREATE TABLE IF NOT EXISTS line_messages_sent (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  ref text NOT NULL,
  channel text NOT NULL DEFAULT 'line',
  sent_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_line_messages_sent
  ON line_messages_sent (user_id, kind, ref);
