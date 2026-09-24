-- Migration: free Premium trial for linking LINE OA
--
-- Linking a web account to the LINE OA (sending the PHARMROO-XXXXXX code in
-- chat) grants 7 days of Premium once. users.line_trial_expires_at holds the
-- trial end (NULL = never claimed); line_trial_claims records which LINE
-- userIds have claimed so one LINE account can't claim on several web
-- accounts. RLS enabled with no policies, matching the other tables.

ALTER TABLE users ADD COLUMN IF NOT EXISTS line_trial_expires_at text;

CREATE TABLE IF NOT EXISTS line_trial_claims (
  line_user_id text PRIMARY KEY,
  user_id      text NOT NULL,
  claimed_at   text NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS'))
);

ALTER TABLE line_trial_claims ENABLE ROW LEVEL SECURITY;
