import { createClient } from "@libsql/client";
import pg from "pg";
const { Client } = pg;

// Turso config
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Supabase PostgreSQL config
const supabase = new Client({
  connectionString: process.env.SUPABASE_DATABASE_URL,
});

// Tables in correct order (respecting foreign keys)
const TABLES = [
  "users",
  "sessions",
  "mcq_subjects",
  "mcq_questions",
  "mcq_attempts",
  "mcq_sessions",
  "question_sets",
  "set_questions",
  "set_purchases",
  "payment_orders",
];

// Columns with boolean values (SQLite stores as 0/1, PG needs true/false)
const BOOLEAN_COLUMNS = {
  mcq_questions: ["is_ai_enhanced"],
  mcq_attempts: ["is_correct"],
  question_sets: ["is_bundle", "is_active"],
  payment_orders: ["invoice_requested"],
};

// Columns with JSON values (need to stringify for PG jsonb)
const JSON_COLUMNS = {
  mcq_questions: ["choices", "detailed_explanation"],
};

async function migrate() {
  await supabase.connect();
  console.log("Connected to both databases.\n");

  for (const table of TABLES) {
    try {
      // Get data from Turso
      const result = await turso.execute(`SELECT * FROM ${table}`);
      const rows = result.rows;
      console.log(`${table}: ${rows.length} rows`);

      if (rows.length === 0) continue;

      // Get column names
      const columns = result.columns;

      // Insert in batches
      const batchSize = 100;
      let inserted = 0;

      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        const values = [];
        const placeholders = [];
        let paramIndex = 1;

        for (const row of batch) {
          const rowPlaceholders = [];
          for (const col of columns) {
            let value = row[col];

            // Convert SQLite booleans (0/1) to PG booleans
            if (BOOLEAN_COLUMNS[table]?.includes(col)) {
              value = value === 1 || value === true ? true : value === 0 || value === false ? false : null;
            }

            // Convert JSON strings to proper JSON for PG
            if (JSON_COLUMNS[table]?.includes(col) && typeof value === "string") {
              try {
                value = JSON.parse(value);
                value = JSON.stringify(value);
              } catch {
                // keep as-is
              }
            }

            values.push(value);
            rowPlaceholders.push(`$${paramIndex++}`);
          }
          placeholders.push(`(${rowPlaceholders.join(", ")})`);
        }

        const quotedColumns = columns.map((c) => `"${c}"`).join(", ");
        const sql = `INSERT INTO ${table} (${quotedColumns}) VALUES ${placeholders.join(", ")} ON CONFLICT DO NOTHING`;

        await supabase.query(sql, values);
        inserted += batch.length;
      }

      console.log(`  → Inserted ${inserted} rows`);
    } catch (err) {
      console.error(`ERROR on ${table}:`, err.message);
    }
  }

  await supabase.end();
  turso.close();
  console.log("\nMigration complete!");
}

migrate().catch(console.error);
