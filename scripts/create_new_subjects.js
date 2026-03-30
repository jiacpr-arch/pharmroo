const { Client } = require("pg");
const { randomUUID } = require("crypto");

const SUPABASE_URL = "postgresql://postgres.xdafacvqfqkicaxfhwom:juxsu1-xawqEv-cysvug@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres";

const newSubjects = [
  { name: "Renal", name_th: "ไต/ทางเดินปัสสาวะ", icon: "🫘", exam_type: "PLE-CC1" },
  { name: "PharmacyLaw", name_th: "กฎหมายยาและจริยธรรม", icon: "⚖️", exam_type: "PLE-CC1" },
  { name: "Pharmacokinetics", name_th: "เภสัชจลนศาสตร์", icon: "📈", exam_type: "PLE-CC1" },
  { name: "Pharmacognosy", name_th: "สมุนไพรและเภสัชเวท", icon: "🌿", exam_type: "PLE-CC1" },
  { name: "Biopharmaceutics", name_th: "ชีวเภสัชศาสตร์", icon: "💊", exam_type: "PLE-CC1" },
  { name: "ADR_DI", name_th: "ADR / Drug Interaction / DI", icon: "⚠️", exam_type: "PLE-CC1" },
  { name: "PharmCalculations", name_th: "การคำนวณทางเภสัชกรรม", icon: "🔢", exam_type: "PLE-CC1" },
  { name: "PublicHealth", name_th: "เภสัชสาธารณสุข", icon: "🏥", exam_type: "PLE-CC1" },
  // PLE-PC subjects
  { name: "PharmCare", name_th: "การบริบาลทางเภสัชกรรม", icon: "👨‍⚕️", exam_type: "both" },
  { name: "Dispensing", name_th: "การจ่ายยาและให้คำปรึกษา", icon: "💬", exam_type: "both" },
  { name: "HealthInsurance", name_th: "ระบบประกันสุขภาพ", icon: "🏦", exam_type: "both" },
];

async function run() {
  const client = new Client({ connectionString: SUPABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const ids = {};
  for (const s of newSubjects) {
    const id = randomUUID();
    await client.query(
      `INSERT INTO mcq_subjects (id, name, name_th, icon, exam_type, question_count)
       VALUES ($1, $2, $3, $4, $5, 0) ON CONFLICT (name) DO NOTHING`,
      [id, s.name, s.name_th, s.icon, s.exam_type]
    );
    ids[s.name] = id;
    console.log(`✅ ${s.name_th} (${s.name}) → ${id}`);
  }

  // Get all subject IDs
  const r = await client.query("SELECT id, name, name_th FROM mcq_subjects ORDER BY name");
  console.log("\n=== All subjects ===");
  for (const row of r.rows) {
    console.log(`  ${row.name}: ${row.id} (${row.name_th})`);
  }

  await client.end();
}

run().catch(console.error);
