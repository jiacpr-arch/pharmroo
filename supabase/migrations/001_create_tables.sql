-- PharmRoo: Turso (SQLite) → Supabase (PostgreSQL) Migration
-- Generated from lib/db/schema.ts

-- Helper: generate random hex id (like SQLite's lower(hex(randomblob(16))))
CREATE OR REPLACE FUNCTION generate_hex_id() RETURNS text AS $$
  SELECT encode(gen_random_bytes(16), 'hex');
$$ LANGUAGE sql;

-- ========================================
-- 1. Users
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  membership_type TEXT NOT NULL DEFAULT 'free' CHECK (membership_type IN ('free', 'monthly', 'yearly')),
  membership_expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS'))
);

-- ========================================
-- 2. Sessions (NextAuth)
-- ========================================
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

-- ========================================
-- 3. MCQ Subjects
-- ========================================
CREATE TABLE IF NOT EXISTS mcq_subjects (
  id TEXT PRIMARY KEY DEFAULT generate_hex_id(),
  name TEXT NOT NULL UNIQUE,
  name_th TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📝',
  exam_type TEXT NOT NULL DEFAULT 'both' CHECK (exam_type IN ('PLE-PC', 'PLE-CC1', 'both')),
  question_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS'))
);

-- ========================================
-- 4. MCQ Questions
-- ========================================
CREATE TABLE IF NOT EXISTS mcq_questions (
  id TEXT PRIMARY KEY DEFAULT generate_hex_id(),
  subject_id TEXT REFERENCES mcq_subjects(id),
  exam_type TEXT NOT NULL DEFAULT 'PLE-CC1' CHECK (exam_type IN ('PLE-PC', 'PLE-CC1')),
  exam_source TEXT,
  exam_day INTEGER,
  question_number INTEGER,
  scenario TEXT NOT NULL,
  image_url TEXT,
  choices JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  detailed_explanation JSONB,
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_ai_enhanced BOOLEAN NOT NULL DEFAULT false,
  ai_notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'review', 'disabled')),
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS'))
);

CREATE INDEX IF NOT EXISTS idx_mcq_questions_subject ON mcq_questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_mcq_questions_exam_type ON mcq_questions(exam_type);
CREATE INDEX IF NOT EXISTS idx_mcq_questions_exam_day ON mcq_questions(exam_day);
CREATE INDEX IF NOT EXISTS idx_mcq_questions_status ON mcq_questions(status);

-- ========================================
-- 5. MCQ Attempts
-- ========================================
CREATE TABLE IF NOT EXISTS mcq_attempts (
  id TEXT PRIMARY KEY DEFAULT generate_hex_id(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES mcq_questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INTEGER,
  mode TEXT NOT NULL DEFAULT 'practice' CHECK (mode IN ('practice', 'mock')),
  session_id TEXT,
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS'))
);

CREATE INDEX IF NOT EXISTS idx_mcq_attempts_user ON mcq_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_mcq_attempts_question ON mcq_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_mcq_attempts_session ON mcq_attempts(session_id);

-- ========================================
-- 6. MCQ Sessions
-- ========================================
CREATE TABLE IF NOT EXISTS mcq_sessions (
  id TEXT PRIMARY KEY DEFAULT generate_hex_id(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL DEFAULT 'practice' CHECK (mode IN ('practice', 'mock')),
  exam_type TEXT NOT NULL DEFAULT 'PLE-CC1' CHECK (exam_type IN ('PLE-PC', 'PLE-CC1')),
  exam_day INTEGER,
  subject_id TEXT REFERENCES mcq_subjects(id),
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  time_limit_minutes INTEGER,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS'))
);

CREATE INDEX IF NOT EXISTS idx_mcq_sessions_user ON mcq_sessions(user_id);

-- ========================================
-- 7. Question Sets
-- ========================================
CREATE TABLE IF NOT EXISTS question_sets (
  id TEXT PRIMARY KEY DEFAULT generate_hex_id(),
  name TEXT NOT NULL,
  name_th TEXT NOT NULL,
  description TEXT,
  exam_type TEXT CHECK (exam_type IN ('PLE-CC1', 'PLE-PC1', 'PLE-IP1', 'PLE-PHCP1', 'mixed')),
  exam_day INTEGER,
  question_count INTEGER NOT NULL DEFAULT 0,
  price REAL NOT NULL,
  original_price REAL,
  is_bundle BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS'))
);

-- ========================================
-- 8. Set Questions (many-to-many)
-- ========================================
CREATE TABLE IF NOT EXISTS set_questions (
  set_id TEXT REFERENCES question_sets(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES mcq_questions(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (set_id, question_id)
);

-- ========================================
-- 9. Set Purchases
-- ========================================
CREATE TABLE IF NOT EXISTS set_purchases (
  id TEXT PRIMARY KEY DEFAULT generate_hex_id(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  set_id TEXT REFERENCES question_sets(id) ON DELETE CASCADE,
  payment_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'refunded')),
  purchased_at TEXT,
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS'))
);

CREATE INDEX IF NOT EXISTS idx_set_purchases_user ON set_purchases(user_id);

-- ========================================
-- 10. Payment Orders
-- ========================================
CREATE TABLE IF NOT EXISTS payment_orders (
  id TEXT PRIMARY KEY DEFAULT generate_hex_id(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  order_type TEXT NOT NULL DEFAULT 'subscription' CHECK (order_type IN ('subscription', 'set')),
  plan_type TEXT CHECK (plan_type IN ('monthly', 'yearly')),
  set_id TEXT REFERENCES question_sets(id),
  amount REAL NOT NULL,
  slip_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by TEXT REFERENCES users(id),
  reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS')),
  invoice_requested BOOLEAN DEFAULT false,
  invoice_type TEXT CHECK (invoice_type IN ('personal', 'company')),
  invoice_name TEXT,
  invoice_tax_id TEXT,
  invoice_address TEXT,
  invoice_branch TEXT
);

CREATE INDEX IF NOT EXISTS idx_payment_orders_user ON payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status);
