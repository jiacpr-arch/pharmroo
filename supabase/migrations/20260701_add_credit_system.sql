-- Credit system: top-up credits, then spend 1 credit to unlock a question's
-- detailed explanation. Mirrors the existing set-purchase infrastructure.

-- 1. Add credit balance to users (existing rows default to 0)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS credit_balance INTEGER NOT NULL DEFAULT 0;

-- 2. Allow 'credit' as an order type on payment_orders + invoices.
--    (order_type is stored as plain text in these tables; no CHECK constraint
--     exists on payment_orders, and invoices' constraint is widened below.)
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_order_type_check;
ALTER TABLE invoices
  ADD CONSTRAINT invoices_order_type_check
  CHECK (order_type IN ('subscription', 'set', 'credit'));

-- 3. Credit packs (top-up catalog)
CREATE TABLE IF NOT EXISTS credit_packs (
  id TEXT PRIMARY KEY DEFAULT generate_hex_id(),
  name_th TEXT NOT NULL,
  amount_credits INTEGER NOT NULL,
  price REAL NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

-- 4. Credit purchases (one row per top-up)
CREATE TABLE IF NOT EXISTS credit_purchases (
  id TEXT PRIMARY KEY DEFAULT generate_hex_id(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  pack_id TEXT REFERENCES credit_packs(id),
  payment_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'refunded')),
  amount_credits INTEGER NOT NULL,
  purchased_at TEXT,
  created_at TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

-- 5. Credit ledger (audit trail of every balance change)
CREATE TABLE IF NOT EXISTS credit_ledger (
  id TEXT PRIMARY KEY DEFAULT generate_hex_id(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('welcome', 'purchase', 'spend', 'refund', 'admin')),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  related_id TEXT,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

-- 6. Question unlocks (which questions a user has bought the explanation for)
CREATE TABLE IF NOT EXISTS question_unlocks (
  id TEXT PRIMARY KEY DEFAULT generate_hex_id(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES mcq_questions(id) ON DELETE CASCADE,
  credit_ledger_id TEXT,
  created_at TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

-- One unlock per (user, question) — prevents double-charging.
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_question_unlock
  ON question_unlocks(user_id, question_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_user ON credit_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_purchases_user ON credit_purchases(user_id);

-- 7. Seed the three launch packs (entry / main / pre-subscription ceiling)
INSERT INTO credit_packs (name_th, amount_credits, price, sort_order)
SELECT * FROM (VALUES
  ('แพ็กเริ่มต้น 10 เครดิต', 10, 49.0, 1),
  ('แพ็กคุ้ม 25 เครดิต', 25, 99.0, 2),
  ('แพ็กจัดเต็ม 60 เครดิต', 60, 199.0, 3)
) AS v(name_th, amount_credits, price, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM credit_packs);
