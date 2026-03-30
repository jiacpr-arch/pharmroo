// Usage: node scripts/release_week.js <week_number>
// Example: node scripts/release_week.js 1

const { Client } = require("pg");

const SUPABASE_URL = "postgresql://postgres.xdafacvqfqkicaxfhwom:juxsu1-xawqEv-cysvug@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres";

const week = process.argv[2];
if (!week) {
  console.log("Usage: node scripts/release_week.js <week_number>");
  console.log("Example: node scripts/release_week.js 1");
  process.exit(1);
}

async function release() {
  const client = new Client({ connectionString: SUPABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  // Check how many questions in this week
  const check = await client.query(
    `SELECT COUNT(*) as count FROM mcq_questions WHERE status = 'review' AND ai_notes = $1`,
    [`week_${week}`]
  );

  if (Number(check.rows[0].count) === 0) {
    console.log(`Week ${week}: ไม่มีข้อสอบที่รอปล่อย (อาจปล่อยแล้ว)`);
    await client.end();
    return;
  }

  console.log(`Week ${week}: พบ ${check.rows[0].count} ข้อ กำลังเปลี่ยน status เป็น active...`);

  const result = await client.query(
    `UPDATE mcq_questions SET status = 'active' WHERE status = 'review' AND ai_notes = $1`,
    [`week_${week}`]
  );

  console.log(`✅ ปล่อยข้อสอบ Week ${week} จำนวน ${result.rowCount} ข้อ เรียบร้อย!`);

  // Show remaining
  const remaining = await client.query(
    `SELECT ai_notes, COUNT(*) as count FROM mcq_questions WHERE status = 'review' GROUP BY ai_notes ORDER BY ai_notes`
  );
  if (remaining.rows.length > 0) {
    console.log("\n📋 ข้อสอบที่ยังรอปล่อย:");
    for (const row of remaining.rows) {
      console.log(`  ${row.ai_notes}: ${row.count} ข้อ`);
    }
  } else {
    console.log("\n🎉 ปล่อยข้อสอบครบทุก week แล้ว!");
  }

  // Total active
  const total = await client.query(`SELECT COUNT(*) as count FROM mcq_questions WHERE status = 'active'`);
  console.log(`\n📊 ข้อสอบ active ทั้งหมด: ${total.rows[0].count} ข้อ`);

  await client.end();
}

release().catch(console.error);
