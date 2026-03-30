const { Client } = require("pg");
const fs = require("fs");

const SUPABASE_URL = "postgresql://postgres.xdafacvqfqkicaxfhwom:juxsu1-xawqEv-cysvug@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres";

async function migrate() {
  const client = new Client({ connectionString: SUPABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("Connected to Supabase PostgreSQL!");

  // Step 1: Create tables (SQLite → PostgreSQL schema)
  console.log("\n=== Creating tables ===");

  const createSQL = `
    -- Users
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL DEFAULT '',
      password_hash TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      membership_type TEXT NOT NULL DEFAULT 'free',
      membership_expires_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- MCQ Subjects
    CREATE TABLE IF NOT EXISTS mcq_subjects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_th TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT '📝',
      exam_type TEXT NOT NULL DEFAULT 'both',
      question_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- MCQ Questions
    CREATE TABLE IF NOT EXISTS mcq_questions (
      id TEXT PRIMARY KEY,
      subject_id TEXT REFERENCES mcq_subjects(id),
      exam_type TEXT NOT NULL DEFAULT 'PLE-CC1',
      exam_source TEXT,
      exam_day INTEGER,
      question_number INTEGER,
      scenario TEXT NOT NULL,
      image_url TEXT,
      choices JSONB NOT NULL DEFAULT '[]',
      correct_answer TEXT NOT NULL,
      explanation TEXT,
      detailed_explanation JSONB,
      difficulty TEXT NOT NULL DEFAULT 'medium',
      is_ai_enhanced BOOLEAN NOT NULL DEFAULT FALSE,
      ai_notes TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Question Sets
    CREATE TABLE IF NOT EXISTS question_sets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_th TEXT NOT NULL,
      description TEXT,
      exam_type TEXT,
      exam_day INTEGER,
      question_count INTEGER NOT NULL DEFAULT 0,
      price REAL NOT NULL,
      original_price REAL,
      is_bundle BOOLEAN NOT NULL DEFAULT FALSE,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Set Questions (junction)
    CREATE TABLE IF NOT EXISTS set_questions (
      set_id TEXT REFERENCES question_sets(id) ON DELETE CASCADE,
      question_id TEXT REFERENCES mcq_questions(id) ON DELETE CASCADE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (set_id, question_id)
    );

    -- Payment Orders
    CREATE TABLE IF NOT EXISTS payment_orders (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      order_type TEXT NOT NULL DEFAULT 'subscription',
      plan_type TEXT,
      set_id TEXT REFERENCES question_sets(id),
      amount REAL NOT NULL,
      slip_url TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      reviewed_by TEXT REFERENCES users(id),
      reviewed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      invoice_requested BOOLEAN DEFAULT FALSE,
      invoice_type TEXT,
      invoice_name TEXT,
      invoice_tax_id TEXT,
      invoice_address TEXT,
      invoice_branch TEXT
    );

    -- Set Purchases
    CREATE TABLE IF NOT EXISTS set_purchases (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      set_id TEXT REFERENCES question_sets(id) ON DELETE CASCADE,
      payment_order_id TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      purchased_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- MCQ Sessions
    CREATE TABLE IF NOT EXISTS mcq_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      mode TEXT NOT NULL DEFAULT 'practice',
      exam_type TEXT NOT NULL DEFAULT 'PLE-CC1',
      exam_day INTEGER,
      subject_id TEXT REFERENCES mcq_subjects(id),
      total_questions INTEGER NOT NULL DEFAULT 0,
      correct_count INTEGER NOT NULL DEFAULT 0,
      time_limit_minutes INTEGER,
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- MCQ Attempts
    CREATE TABLE IF NOT EXISTS mcq_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      question_id TEXT REFERENCES mcq_questions(id) ON DELETE CASCADE,
      selected_answer TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL,
      time_spent_seconds INTEGER,
      mode TEXT NOT NULL DEFAULT 'practice',
      session_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Sessions (auth)
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at BIGINT NOT NULL
    );
  `;

  await client.query(createSQL);
  console.log("All tables created!");

  // Step 2: Import data
  console.log("\n=== Importing data ===");
  const data = JSON.parse(fs.readFileSync("turso_export.json", "utf-8"));

  // Users
  for (const u of data.users) {
    await client.query(
      `INSERT INTO users (id, email, name, password_hash, role, membership_type, membership_expires_at, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING`,
      [u.id, u.email, u.name || '', u.password_hash, u.role || 'user', u.membership_type || 'free', u.membership_expires_at || null, u.created_at || new Date().toISOString()]
    );
  }
  console.log(`  users: ${data.users.length} rows`);

  // Subjects
  for (const s of data.mcq_subjects) {
    await client.query(
      `INSERT INTO mcq_subjects (id, name, name_th, icon, exam_type, question_count, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING`,
      [s.id, s.name, s.name_th, s.icon || '📝', s.exam_type || 'both', s.question_count || 0, s.created_at || new Date().toISOString()]
    );
  }
  console.log(`  mcq_subjects: ${data.mcq_subjects.length} rows`);

  // Questions (batch)
  let qCount = 0;
  for (const q of data.mcq_questions) {
    // Parse choices/detailed_explanation if they're strings
    let choices = q.choices;
    let detailedExpl = q.detailed_explanation;
    if (typeof choices === 'string') {
      try { choices = JSON.parse(choices); } catch(e) { /* keep as is */ }
    }
    if (typeof detailedExpl === 'string') {
      try { detailedExpl = JSON.parse(detailedExpl); } catch(e) { /* keep as is */ }
    }

    await client.query(
      `INSERT INTO mcq_questions (id, subject_id, exam_type, exam_source, exam_day, question_number, scenario, image_url, choices, correct_answer, explanation, detailed_explanation, difficulty, is_ai_enhanced, ai_notes, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) ON CONFLICT (id) DO NOTHING`,
      [q.id, q.subject_id, q.exam_type, q.exam_source || null, q.exam_day || null, q.question_number || null, q.scenario, q.image_url || null,
       JSON.stringify(choices), q.correct_answer, q.explanation || null, detailedExpl ? JSON.stringify(detailedExpl) : null,
       q.difficulty || 'medium', q.is_ai_enhanced === 1 || q.is_ai_enhanced === true, q.ai_notes || null, q.status || 'active', q.created_at || new Date().toISOString()]
    );
    qCount++;
  }
  console.log(`  mcq_questions: ${qCount} rows`);

  // Payment orders
  for (const p of data.payment_orders) {
    await client.query(
      `INSERT INTO payment_orders (id, user_id, order_type, plan_type, set_id, amount, slip_url, status, reviewed_by, reviewed_at, created_at, invoice_requested, invoice_type, invoice_name, invoice_tax_id, invoice_address, invoice_branch)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) ON CONFLICT (id) DO NOTHING`,
      [p.id, p.user_id, p.order_type, p.plan_type || null, p.set_id || null, p.amount, p.slip_url || null, p.status || 'pending',
       p.reviewed_by || null, p.reviewed_at || null, p.created_at || new Date().toISOString(),
       p.invoice_requested === 1 || p.invoice_requested === true, p.invoice_type || null, p.invoice_name || null, p.invoice_tax_id || null, p.invoice_address || null, p.invoice_branch || null]
    );
  }
  console.log(`  payment_orders: ${data.payment_orders.length} rows`);

  // Verify
  console.log("\n=== Verification ===");
  const tables = ['users', 'mcq_subjects', 'mcq_questions', 'payment_orders'];
  for (const t of tables) {
    const r = await client.query(`SELECT COUNT(*) as count FROM ${t}`);
    console.log(`  ${t}: ${r.rows[0].count} rows`);
  }

  await client.end();
  console.log("\nMigration complete!");
}

migrate().catch(console.error);
