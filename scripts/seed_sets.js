// Seed question_sets table
// node scripts/seed_sets.js

const { Client } = require("pg");

const SUPABASE_URL = "postgresql://postgres.xdafacvqfqkicaxfhwom:juxsu1-xawqEv-cysvug@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres";

const SETS = [
  {
    id: "ple-cc1-day1",
    name: "PLE-CC1 Day 1",
    name_th: "PLE-CC1 Day 1 (120 ข้อ)",
    description: "ข้อสอบ PLE-CC1 วันที่ 1 ครบ 120 ข้อ ครอบคลุม Pharmacotherapy, เภสัชเคมี, เทคโนโลยีเภสัช",
    exam_type: "PLE-CC1",
    exam_day: 1,
    question_count: 120,
    price: 390,
    original_price: null,
    is_bundle: false,
    is_active: true,
    sort_order: 1,
  },
  {
    id: "ple-cc1-day2",
    name: "PLE-CC1 Day 2",
    name_th: "PLE-CC1 Day 2 (120 ข้อ)",
    description: "ข้อสอบ PLE-CC1 วันที่ 2 ครบ 120 ข้อ ครอบคลุม วิเคราะห์เภสัช, จลนศาสตร์, กฎหมายยา, สมุนไพร",
    exam_type: "PLE-CC1",
    exam_day: 2,
    question_count: 120,
    price: 390,
    original_price: null,
    is_bundle: false,
    is_active: true,
    sort_order: 2,
  },
  {
    id: "ple-cc1-bundle",
    name: "PLE-CC1 Full (2 Days)",
    name_th: "PLE-CC1 ครบ 2 วัน (240 ข้อ)",
    description: "ชุดรวม PLE-CC1 ทั้ง 2 วัน ครบ 240 ข้อ ประหยัดกว่าซื้อแยก ฿190",
    exam_type: "PLE-CC1",
    exam_day: null,
    question_count: 240,
    price: 590,
    original_price: 780,
    is_bundle: true,
    is_active: true,
    sort_order: 3,
  },
  {
    id: "ple-pc1",
    name: "PLE-PC1",
    name_th: "PLE-PC1 บริบาลเภสัชกรรม (120 ข้อ)",
    description: "ข้อสอบ PLE-PC1 สำหรับสาขาบริบาลเภสัชกรรม ครบ 120 ข้อ พร้อมเฉลยละเอียด",
    exam_type: "PLE-PC1",
    exam_day: null,
    question_count: 120,
    price: 490,
    original_price: null,
    is_bundle: false,
    is_active: true,
    sort_order: 4,
  },
  {
    id: "bundle-all",
    name: "Bundle All",
    name_th: "Bundle ทุกชุด (360 ข้อ)",
    description: "ชุดรวมสุดคุ้ม — PLE-CC1 ทั้ง 2 วัน + PLE-PC1 ครบ 360 ข้อ ประหยัดกว่าซื้อแยก ฿280",
    exam_type: "mixed",
    exam_day: null,
    question_count: 360,
    price: 990,
    original_price: 1270,
    is_bundle: true,
    is_active: true,
    sort_order: 5,
  },
];

async function seed() {
  const client = new Client({ connectionString: SUPABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  for (const s of SETS) {
    await client.query(
      `INSERT INTO question_sets (id, name, name_th, description, exam_type, exam_day, question_count, price, original_price, is_bundle, is_active, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (id) DO UPDATE SET
         name=EXCLUDED.name, name_th=EXCLUDED.name_th, description=EXCLUDED.description,
         exam_type=EXCLUDED.exam_type, exam_day=EXCLUDED.exam_day, question_count=EXCLUDED.question_count,
         price=EXCLUDED.price, original_price=EXCLUDED.original_price,
         is_bundle=EXCLUDED.is_bundle, is_active=EXCLUDED.is_active, sort_order=EXCLUDED.sort_order`,
      [s.id, s.name, s.name_th, s.description, s.exam_type, s.exam_day,
       s.question_count, s.price, s.original_price, s.is_bundle, s.is_active, s.sort_order]
    );
    console.log(`✅ ${s.name_th} — ฿${s.price}`);
  }

  const { rows } = await client.query("SELECT COUNT(*) FROM question_sets WHERE is_active = true");
  console.log(`\n📦 question_sets ทั้งหมด: ${rows[0].count} ชุด`);
  await client.end();
}

seed().catch(console.error);
