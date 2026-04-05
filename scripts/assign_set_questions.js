// Assign questions to question_sets
// node scripts/assign_set_questions.js

const { Client } = require("pg");

const SUPABASE_URL = "postgresql://postgres.xdafacvqfqkicaxfhwom:juxsu1-xawqEv-cysvug@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres";

// Subject IDs from DB
const SUBJECTS = {
  tech:     "0a7f8e61-3786-494c-9c54-b6edc17b03b6", // เภสัชเทคโนโลยีและการวิเคราะห์
  kidney:   "557c6214-3039-4e1b-aeaf-99f55950de66", // ไต/ทางเดินปัสสาวะ
  infect:   "8bccedb2-3bdb-4f5c-9da9-f589b25672fd", // โรคติดเชื้อ
  cardio:   "dce79912-01f6-4871-96df-94c6cfc853e7", // หัวใจและหลอดเลือด
  calc:     "c7d84b07-f67b-40da-831d-bdc2caf07e63", // การคำนวณทางเภสัชกรรม
  gi:       "91eedbf3-4301-4f40-ae3d-3cc6f64c4f8a", // ทางเดินอาหาร
  psych:    "beee26b1-72c2-4c70-be73-24d7fa036f19", // จิตเวช
  hemo:     "ace9965c-285b-4d4a-aaf2-5de9739cc09a", // โลหิตวิทยา
  derm:     "12b0b8c1-fe53-49d8-9c4b-e348eba85e36", // ผิวหนัง
  allergy:  "ccb73060-b09f-4927-8ff8-53190db76d18", // การแพ้และภูมิคุ้มกันวิทยา
  endo:     "3c30613d-83c7-4be5-b3e3-ee9240e7552a", // ต่อมไร้ท่อ
  neuro:    "fb62e97d-dec1-4b47-b45f-617b2c03fb4d", // ระบบประสาท
  clinical: "41f903b7-5258-47fa-9ec3-44e756e705d1", // เภสัชกรรมคลินิก
  pulm:     "cc7ce595-2da4-4207-95a4-9a4bb606bbe0", // ปอด
  law:      "83beabf8-abdd-4aef-a849-b0fec3d733b8", // กฎหมายยาและจริยธรรม
  pk:       "fe430fdf-f81b-4719-9ea9-cb7d514f47dc", // เภสัชจลนศาสตร์
  rheum:    "06991a85-412e-476e-89ff-32b0a7b92e6c", // กระดูกและข้อ
  adr:      "49695e05-f84c-419b-8442-af9bbdeceb25", // ADR/Drug Interaction
};

// Plan: assign questions to each set by subject + limit
const PLAN = {
  "ple-cc1-day1": [
    { subjectId: SUBJECTS.infect,   limit: 26 },
    { subjectId: SUBJECTS.cardio,   limit: 25 },
    { subjectId: SUBJECTS.gi,       limit: 23 },
    { subjectId: SUBJECTS.psych,    limit: 23 },
    { subjectId: SUBJECTS.endo,     limit: 17 },
    { subjectId: SUBJECTS.adr,      limit: 6  },
  ],
  "ple-cc1-day2": [
    { subjectId: SUBJECTS.tech,     limit: 30 },
    { subjectId: SUBJECTS.calc,     limit: 24 },
    { subjectId: SUBJECTS.pk,       limit: 20 },
    { subjectId: SUBJECTS.law,      limit: 20 },
    { subjectId: SUBJECTS.neuro,    limit: 15 },
    { subjectId: SUBJECTS.rheum,    limit: 11 },
  ],
  "ple-pc1": [
    { subjectId: SUBJECTS.kidney,   limit: 29 },
    { subjectId: SUBJECTS.hemo,     limit: 22 },
    { subjectId: SUBJECTS.derm,     limit: 22 },
    { subjectId: SUBJECTS.allergy,  limit: 22 },
    { subjectId: SUBJECTS.clinical, limit: 21 },
    { subjectId: SUBJECTS.pulm,     limit: 4  },
  ],
};

async function assign() {
  const client = new Client({ connectionString: SUPABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  // Clear existing assignments for these sets
  await client.query(`DELETE FROM set_questions WHERE set_id IN ('ple-cc1-day1','ple-cc1-day2','ple-cc1-bundle','ple-pc1','bundle-all')`);
  console.log("🗑️  ล้าง set_questions เดิมแล้ว");

  // Assign questions per set
  for (const [setId, subjects] of Object.entries(PLAN)) {
    let totalInserted = 0;
    let sortOrder = 1;

    for (const { subjectId, limit } of subjects) {
      const { rows } = await client.query(
        `SELECT id FROM mcq_questions WHERE status = 'active' AND subject_id = $1 ORDER BY created_at LIMIT $2`,
        [subjectId, limit]
      );
      for (const row of rows) {
        await client.query(
          `INSERT INTO set_questions (set_id, question_id, sort_order) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
          [setId, row.id, sortOrder++]
        );
        totalInserted++;
      }
    }
    console.log(`✅ ${setId}: ${totalInserted} ข้อ`);
  }

  // CC1 Bundle = Day1 + Day2
  const { rowCount: bundleCC1 } = await client.query(`
    INSERT INTO set_questions (set_id, question_id, sort_order)
    SELECT 'ple-cc1-bundle', question_id, ROW_NUMBER() OVER (ORDER BY sort_order)
    FROM set_questions WHERE set_id IN ('ple-cc1-day1','ple-cc1-day2')
    ON CONFLICT DO NOTHING
  `);
  console.log(`✅ ple-cc1-bundle: ${bundleCC1} ข้อ (Day1+Day2)`);

  // Bundle All = Day1 + Day2 + PC1
  const { rowCount: bundleAll } = await client.query(`
    INSERT INTO set_questions (set_id, question_id, sort_order)
    SELECT 'bundle-all', question_id, ROW_NUMBER() OVER (ORDER BY sort_order)
    FROM set_questions WHERE set_id IN ('ple-cc1-day1','ple-cc1-day2','ple-pc1')
    ON CONFLICT DO NOTHING
  `);
  console.log(`✅ bundle-all: ${bundleAll} ข้อ (Day1+Day2+PC1)`);

  // Update question_count on question_sets
  await client.query(`
    UPDATE question_sets qs
    SET question_count = sub.cnt
    FROM (SELECT set_id, COUNT(*) as cnt FROM set_questions GROUP BY set_id) sub
    WHERE qs.id = sub.set_id
  `);
  console.log("\n📊 สรุป question_count:");

  const { rows: summary } = await client.query(`
    SELECT name_th, question_count, price FROM question_sets ORDER BY sort_order
  `);
  summary.forEach(r => console.log(`  ${r.name_th}: ${r.question_count} ข้อ — ฿${r.price}`));

  await client.end();
}

assign().catch(console.error);
