import { createClient } from "@libsql/client";
import fs from "fs";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Tables in FK order
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

const BOOLEAN_COLUMNS = {
  mcq_questions: ["is_ai_enhanced"],
  mcq_attempts: ["is_correct"],
  question_sets: ["is_bundle", "is_active"],
  payment_orders: ["invoice_requested"],
};

const JSON_COLUMNS = {
  mcq_questions: ["choices", "detailed_explanation"],
};

function escapeSql(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "number") return String(val);
  // Escape single quotes
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function exportData() {
  const lines = ["-- PharmRoo data export from Turso\n"];

  for (const table of TABLES) {
    const result = await turso.execute(`SELECT * FROM ${table}`);
    const rows = result.rows;
    const columns = result.columns;
    console.log(`${table}: ${rows.length} rows`);

    if (rows.length === 0) continue;

    lines.push(`\n-- ${table} (${rows.length} rows)`);

    for (const row of rows) {
      const values = columns.map((col) => {
        let val = row[col];

        // Boolean conversion
        if (BOOLEAN_COLUMNS[table]?.includes(col)) {
          if (val === 1 || val === true) return "true";
          if (val === 0 || val === false) return "false";
          return "NULL";
        }

        // JSON columns — ensure proper JSON string
        if (JSON_COLUMNS[table]?.includes(col) && val !== null && val !== undefined) {
          if (typeof val === "string") {
            try {
              JSON.parse(val); // validate
              return `'${val.replace(/'/g, "''")}'::jsonb`;
            } catch {
              return "NULL";
            }
          }
          if (typeof val === "object") {
            return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
          }
        }

        return escapeSql(val);
      });

      const quotedCols = columns.map((c) => `"${c}"`).join(", ");
      lines.push(
        `INSERT INTO ${table} (${quotedCols}) VALUES (${values.join(", ")}) ON CONFLICT DO NOTHING;`
      );
    }
  }

  const outFile = "scripts/turso_export.sql";
  fs.writeFileSync(outFile, lines.join("\n") + "\n");
  console.log(`\nExported to ${outFile}`);
  turso.close();
}

exportData().catch(console.error);
