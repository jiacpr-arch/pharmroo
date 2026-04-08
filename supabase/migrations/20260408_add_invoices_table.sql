-- Add invoices table for Stripe webhook + FlowAccount auto-invoice
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY DEFAULT generate_hex_id(),
  invoice_number TEXT NOT NULL UNIQUE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  order_id TEXT REFERENCES payment_orders(id),
  payment_method TEXT NOT NULL DEFAULT 'stripe',
  stripe_session_id TEXT,
  plan_type TEXT,
  order_type TEXT CHECK (order_type IN ('subscription', 'set')),
  set_name TEXT,
  amount REAL NOT NULL,
  vat_amount REAL NOT NULL,
  total_amount REAL NOT NULL,
  buyer_name TEXT,
  buyer_tax_id TEXT,
  buyer_address TEXT,
  buyer_email TEXT,
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'voided')),
  issued_at TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS'),
  created_at TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

-- Index for fast lookup by order_id (used by invoice-request API)
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON invoices(order_id);

-- Index for invoice number sequence counting
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
