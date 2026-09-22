-- Migration: user_challenges — badge/challenge completions
--
-- This table backs app/api/challenges/route.ts and, as of the เกมร้านยา
-- feature, the game_runs badges (game_first_win / game_grade_s /
-- game_no_mistake). It was originally only defined in the legacy
-- supabase/migrations/002_pharmacy_subjects_and_challenges.sql file and had
-- never been ported into the numbered drizzle/ migration track, so it was
-- missing from the production database even though lib/db/schema.ts already
-- declared it. This migration formalizes it here (table only — that legacy
-- file's mcq_subjects upsert is unrelated and is not repeated).
--
-- Also enables Row Level Security on user_challenges and on game_runs
-- (added in 0008, before RLS was enabled on it) to match every other table
-- in this schema: RLS enabled with no policies (deny-by-default via
-- PostgREST/anon+authenticated keys). The app itself reads/writes through a
-- direct pg.Pool connection using DATABASE_URL, which bypasses RLS, so this
-- only closes the public REST-API exposure and does not affect app behavior.

CREATE TABLE IF NOT EXISTS user_challenges (
  id           text PRIMARY KEY DEFAULT generate_hex_id(),
  user_id      text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id text NOT NULL,
  completed_at text NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS')),
  UNIQUE (user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_challenges_user ON user_challenges (user_id);

ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_runs ENABLE ROW LEVEL SECURITY;
