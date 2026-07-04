-- Referral rewards can now be paid in credits instead of membership days,
-- and the credit ledger gains a 'referral' entry type for those grants
-- (also used for the referred user's signup bonus).

ALTER TABLE referrals
  ADD COLUMN IF NOT EXISTS reward_type TEXT NOT NULL DEFAULT 'days'
    CHECK (reward_type IN ('days', 'credits'));
ALTER TABLE referrals
  ADD COLUMN IF NOT EXISTS reward_credits INTEGER NOT NULL DEFAULT 0;

ALTER TABLE credit_ledger DROP CONSTRAINT IF EXISTS credit_ledger_type_check;
ALTER TABLE credit_ledger
  ADD CONSTRAINT credit_ledger_type_check
  CHECK (type IN ('welcome', 'purchase', 'spend', 'refund', 'admin', 'referral'));
