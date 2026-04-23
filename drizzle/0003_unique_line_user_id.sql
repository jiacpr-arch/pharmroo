-- Migration: make users.line_user_id unique
-- The old non-unique index (idx_users_line_user_id) allowed duplicate LINE
-- identities on multiple accounts, which is incorrect: a LINE userId maps to
-- exactly one pharmroo account. Replace with a partial unique index so rows
-- with NULL line_user_id (non-LINE users) stay unconstrained.

DROP INDEX IF EXISTS idx_users_line_user_id;
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_line_user_id
  ON users(line_user_id)
  WHERE line_user_id IS NOT NULL;
