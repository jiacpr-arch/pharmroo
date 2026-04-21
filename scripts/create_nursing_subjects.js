const { Client } = require("pg");
const { randomUUID } = require("crypto");

// Requires DATABASE_URL env var (same as drizzle.config.ts)
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL env var is required");
  process.exit(1);
}

// 8 รายวิชาของข้อสอบขึ้นทะเบียนสภาการพยาบาล (NLE) ชั้นหนึ่ง
// ตามขอบเขตเนื้อหารายวิชาของสภาการพยาบาล ประเทศไทย
const nursingSubjects = [
  { name: "NursingAdult",      name_th: "การพยาบาลผู้ใหญ่",                       icon: "🧑‍⚕️", exam_type: "NLE" },
  { name: "NursingGeriatric",  name_th: "การพยาบาลผู้สูงอายุ",                     icon: "👴",   exam_type: "NLE" },
  { name: "NursingPediatric",  name_th: "การพยาบาลเด็กและวัยรุ่น",                  icon: "🧒",   exam_type: "NLE" },
  { name: "NursingMaternal",   name_th: "การพยาบาลมารดาและทารก",                 icon: "🤱",   exam_type: "NLE" },
  { name: "NursingMidwifery",  name_th: "การผดุงครรภ์",                            icon: "🤰",   exam_type: "NLE" },
  { name: "NursingPsych",      name_th: "การพยาบาลสุขภาพจิตและจิตเวชศาสตร์",        icon: "🧠",   exam_type: "NLE" },
  { name: "NursingCommunity",  name_th: "การพยาบาลอนามัยชุมชนและการรักษาพยาบาลขั้นต้น", icon: "🏘️",   exam_type: "NLE" },
  { name: "NursingLawEthics",  name_th: "กฎหมายและจรรยาบรรณวิชาชีพ",               icon: "⚖️",   exam_type: "NLE" },
];

async function run() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  for (const s of nursingSubjects) {
    const id = randomUUID();
    const res = await client.query(
      `INSERT INTO mcq_subjects (id, name, name_th, icon, exam_type, question_count)
       VALUES ($1, $2, $3, $4, $5, 0)
       ON CONFLICT (name) DO UPDATE SET name_th = EXCLUDED.name_th, icon = EXCLUDED.icon
       RETURNING id`,
      [id, s.name, s.name_th, s.icon, s.exam_type]
    );
    console.log(`✅ ${s.name_th} (${s.name}) → ${res.rows[0].id}`);
  }

  const r = await client.query(
    "SELECT id, name, name_th FROM mcq_subjects WHERE exam_type = 'NLE' ORDER BY name"
  );
  console.log("\n=== Nursing subjects ===");
  for (const row of r.rows) {
    console.log(`  ${row.name}: ${row.id} (${row.name_th})`);
  }

  await client.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
