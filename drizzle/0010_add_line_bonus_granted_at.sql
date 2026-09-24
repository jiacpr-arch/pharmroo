-- Migration: users.line_bonus_granted_at
--
-- New members who add the LINE OA (link code or follow event) get 7 days of
-- free premium, once per account. This column records when that bonus was
-- granted so relinking / refollowing can't grant it again.

ALTER TABLE users ADD COLUMN IF NOT EXISTS line_bonus_granted_at text;
