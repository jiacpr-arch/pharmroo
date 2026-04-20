const { Client } = require("pg");
const { randomUUID } = require("crypto");

// Requires DATABASE_URL env var (same as drizzle.config.ts)
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL env var is required");
  process.exit(1);
}

// Pilot batch — sample questions per subject based on the NLE curriculum
// (ขอบเขตเนื้อหารายวิชาของสภาการพยาบาล ชั้นหนึ่ง).
// Treat these as pilot/placeholder items for verifying the /nursing flow;
// content should be reviewed and expanded by subject-matter experts before
// going live. Status is set to 'active' so the UI renders them immediately.

/**
 * Format conventions (matches lib/types-mcq.ts):
 *   choices: [{ label: "A", text: "..." }, ...]
 *   detailed_explanation: {
 *     summary: "...",
 *     reason: "...",
 *     choices: [{ label, text, is_correct, explanation }, ...],
 *     key_takeaway: "..."
 *   }
 */

const questionsBySubjectName = {
  // 1. การพยาบาลผู้ใหญ่
  NursingAdult: [
    {
      scenario:
        "ผู้ป่วยหญิงอายุ 55 ปี ได้รับการวินิจฉัยเป็น COPD exacerbation มีอาการหอบเหนื่อย SpO2 88% room air ข้อใดเป็นเป้าหมาย SpO2 ที่เหมาะสมสำหรับผู้ป่วย COPD",
      choices: [
        { label: "A", text: "90–92%" },
        { label: "B", text: "88–92%" },
        { label: "C", text: "95–100%" },
        { label: "D", text: "ยิ่งสูงยิ่งดี ไม่ต้องกำหนดขอบบน" },
      ],
      correct_answer: "B",
      explanation:
        "ผู้ป่วย COPD มี chronic hypercapnic risk การให้ออกซิเจนสูงเกินไปกด hypoxic drive ทำให้ CO2 คั่ง เป้าหมาย SpO2 ที่แนะนำคือ 88–92%",
      detailed_explanation: {
        summary: "เป้าหมาย SpO2 ของผู้ป่วย COPD คือ 88–92%",
        reason:
          "COPD ที่มี chronic CO2 retention อาศัย hypoxic drive ในการหายใจ ถ้าให้ O2 สูงจะทำให้ลด drive → hypercapnia และ respiratory acidosis",
        choices: [
          {
            label: "A",
            text: "90–92%",
            is_correct: false,
            explanation: "ขอบล่างสูงเกินไป เสี่ยง over-oxygenation",
          },
          {
            label: "B",
            text: "88–92%",
            is_correct: true,
            explanation:
              "ช่วง target ตาม BTS/GOLD guideline สำหรับผู้ป่วย COPD ที่เสี่ยง hypercapnia",
          },
          {
            label: "C",
            text: "95–100%",
            is_correct: false,
            explanation:
              "เป็นเป้าหมายของผู้ป่วยทั่วไปที่ไม่มี chronic hypercapnia",
          },
          {
            label: "D",
            text: "ยิ่งสูงยิ่งดี",
            is_correct: false,
            explanation:
              "ใน COPD การให้ O2 มากเกินไปกด hypoxic drive เพิ่มเสี่ยง CO2 narcosis",
          },
        ],
        key_takeaway: "COPD: 88–92% — อย่า overshoot",
      },
      difficulty: "medium",
    },
    {
      scenario:
        "ผู้ป่วยหลังผ่าตัด abdominal surgery 1 วัน บ่นปวดแผลระดับ 7/10 พยาบาลควรประเมินและจัดการปวดตามหลักใดเป็นลำดับแรก",
      choices: [
        { label: "A", text: "ให้ยาตาม PRN order ทันทีโดยไม่ต้องประเมิน" },
        {
          label: "B",
          text: "ประเมินแบบ PQRST/OLDCARTS แล้วเลือกการจัดการตามระดับความปวด",
        },
        { label: "C", text: "ให้ผู้ป่วยทนไปก่อนเพื่อไม่ให้ติดยา" },
        { label: "D", text: "แจ้งแพทย์ให้มาตรวจก่อนทำอะไรทุกครั้ง" },
      ],
      correct_answer: "B",
      explanation:
        "การจัดการปวดเริ่มจากประเมินอย่างเป็นระบบ (character, onset, location, severity) แล้วจึงเลือก intervention ที่เหมาะสมทั้ง pharmacologic และ non-pharmacologic",
      detailed_explanation: {
        summary: "ประเมินความปวดก่อนเสมอ แล้วจึงจัดการตามระดับ",
        reason:
          "หลักการพยาบาลคือ assess → plan → implement → evaluate การให้ยาโดยไม่ประเมินเสี่ยง over/under-dose และพลาด red flag เช่นภาวะเลือดออกในช่องท้อง",
        choices: [
          {
            label: "A",
            text: "ให้ยาทันทีโดยไม่ประเมิน",
            is_correct: false,
            explanation: "ข้ามขั้นตอน assessment อาจพลาด complication",
          },
          {
            label: "B",
            text: "ประเมินแล้วจัดการตามระดับ",
            is_correct: true,
            explanation: "ตรงตามกระบวนการพยาบาลและมาตรฐานการจัดการปวด",
          },
          {
            label: "C",
            text: "ให้ผู้ป่วยทน",
            is_correct: false,
            explanation:
              "ขัด patient right + เพิ่ม stress response ทำให้ฟื้นตัวช้า",
          },
          {
            label: "D",
            text: "รอแพทย์ทุกครั้ง",
            is_correct: false,
            explanation:
              "พยาบาลมีบทบาทในการประเมินและจัดการปวดเบื้องต้นได้ตาม order",
          },
        ],
        key_takeaway: "Assess ก่อน manage — pain เป็น 5th vital sign",
      },
      difficulty: "easy",
    },
  ],

  // 2. การพยาบาลผู้สูงอายุ
  NursingGeriatric: [
    {
      scenario:
        "ผู้สูงอายุชายอายุ 78 ปี เข้ารับการรักษาในโรงพยาบาลเนื่องจาก UTI หลังเข้ารักษา 2 วัน เริ่มสับสน พูดไม่รู้เรื่อง ภาวะที่น่าจะเป็นมากที่สุดคือ",
      choices: [
        { label: "A", text: "Dementia" },
        { label: "B", text: "Delirium" },
        { label: "C", text: "Depression" },
        { label: "D", text: "Normal aging" },
      ],
      correct_answer: "B",
      explanation:
        "Delirium คือภาวะสับสนเฉียบพลัน (acute onset) มักมีสาเหตุจาก infection ยา หรือ metabolic disturbance ในผู้สูงอายุ",
      detailed_explanation: {
        summary:
          "อาการสับสนเฉียบพลันในผู้สูงอายุที่มี UTI คือ delirium ต้องรีบหาสาเหตุและแก้ไข",
        reason:
          "Delirium มี hallmark คือ acute onset, fluctuating course, inattention และ disorganized thinking ต่างจาก dementia ที่ onset ค่อยเป็นค่อยไป",
        choices: [
          {
            label: "A",
            text: "Dementia",
            is_correct: false,
            explanation: "Dementia มี onset แบบค่อยเป็นค่อยไป เป็นเดือน/ปี",
          },
          {
            label: "B",
            text: "Delirium",
            is_correct: true,
            explanation:
              "Acute onset + reversible cause (UTI) = delirium ที่พบบ่อยในผู้สูงอายุที่ admit",
          },
          {
            label: "C",
            text: "Depression",
            is_correct: false,
            explanation: "Depression ไม่ทำให้สับสนแบบ acute ทันที",
          },
          {
            label: "D",
            text: "Normal aging",
            is_correct: false,
            explanation: "การเปลี่ยนแปลงของ cognition ตามวัยไม่รุนแรงถึงขั้นสับสน",
          },
        ],
        key_takeaway: "Acute confusion + infection ในผู้สูงอายุ → think delirium",
      },
      difficulty: "medium",
    },
  ],

  // 3. การพยาบาลเด็กและวัยรุ่น
  NursingPediatric: [
    {
      scenario:
        "มารดานำบุตรชายอายุ 2 ปี มาตรวจ มีไข้สูง ไอเสียงแหบ หายใจดังเสียง inspiratory stridor อาการดังกล่าวสัมพันธ์กับโรคใดมากที่สุด",
      choices: [
        { label: "A", text: "Bronchiolitis" },
        { label: "B", text: "Croup (laryngotracheobronchitis)" },
        { label: "C", text: "Asthma exacerbation" },
        { label: "D", text: "Pneumonia" },
      ],
      correct_answer: "B",
      explanation:
        "Croup มีอาการเด่น ไอเสียงก้อง (barking cough) และ inspiratory stridor จาก upper airway obstruction",
      detailed_explanation: {
        summary: "ไอเสียงก้อง + stridor ในเด็กเล็ก = Croup",
        reason:
          "Croup เกิดจาก viral infection ทำให้เกิด subglottic edema → inspiratory stridor ต่างจาก bronchiolitis ที่มี wheeze (expiratory)",
        choices: [
          {
            label: "A",
            text: "Bronchiolitis",
            is_correct: false,
            explanation: "Bronchiolitis พบ wheeze expiratory ไม่ใช่ stridor",
          },
          {
            label: "B",
            text: "Croup",
            is_correct: true,
            explanation:
              "Barking cough + inspiratory stridor = classic presentation",
          },
          {
            label: "C",
            text: "Asthma",
            is_correct: false,
            explanation:
              "Asthma พบ wheeze expiratory และมักมีประวัติ atopy/ซ้ำ",
          },
          {
            label: "D",
            text: "Pneumonia",
            is_correct: false,
            explanation:
              "Pneumonia เน้น fever + crackles/tachypnea ไม่ใช่ stridor",
          },
        ],
        key_takeaway: "Inspiratory stridor = upper airway problem",
      },
      difficulty: "medium",
    },
  ],

  // 4. การพยาบาลมารดาและทารก
  NursingMaternal: [
    {
      scenario:
        "ทารกแรกเกิดที่คลอดครบกำหนด ประเมิน APGAR score 1 นาทีหลังคลอด: HR 110, หายใจสม่ำเสมอ ร้องดัง, muscle tone ดี, reflex ตอบสนองร้องเสียงดัง, ตัวแดง ปลายเขียว คะแนน APGAR เท่ากับเท่าใด",
      choices: [
        { label: "A", text: "7" },
        { label: "B", text: "8" },
        { label: "C", text: "9" },
        { label: "D", text: "10" },
      ],
      correct_answer: "C",
      explanation:
        "APGAR: HR>100=2, Respiration=2, Tone=2, Reflex=2, Color ตัวแดง ปลายเขียว (acrocyanosis)=1 → รวม 9",
      detailed_explanation: {
        summary: "APGAR = 9 (เสีย 1 คะแนนจาก acrocyanosis)",
        reason:
          "APGAR 5 องค์ประกอบ: Appearance (color), Pulse (HR), Grimace (reflex), Activity (tone), Respiration แต่ละรายการ 0–2 คะแนน",
        choices: [
          {
            label: "A",
            text: "7",
            is_correct: false,
            explanation: "เสีย 3 คะแนน — ตัวเลขต่ำเกิน",
          },
          {
            label: "B",
            text: "8",
            is_correct: false,
            explanation: "เสีย 2 คะแนน — ในข้อนี้เสียแค่ color",
          },
          {
            label: "C",
            text: "9",
            is_correct: true,
            explanation: "ครบ 2 คะแนนทุกข้อ ยกเว้น color (1)",
          },
          {
            label: "D",
            text: "10",
            is_correct: false,
            explanation: "Acrocyanosis ทำให้ color ได้แค่ 1",
          },
        ],
        key_takeaway: "Acrocyanosis ใน newborn เป็น normal และหัก 1 ใน APGAR",
      },
      difficulty: "easy",
    },
  ],

  // 5. การผดุงครรภ์
  NursingMidwifery: [
    {
      scenario:
        "สตรีตั้งครรภ์ G2P1 อายุครรภ์ 39 สัปดาห์ เจ็บครรภ์คลอด การตรวจภายใน cervix เปิด 4 cm, effacement 80%, station 0 อยู่ในระยะใดของการคลอด",
      choices: [
        { label: "A", text: "Latent phase ของระยะที่ 1" },
        { label: "B", text: "Active phase ของระยะที่ 1" },
        { label: "C", text: "ระยะที่ 2 (second stage)" },
        { label: "D", text: "ระยะที่ 3 (third stage)" },
      ],
      correct_answer: "B",
      explanation:
        "Active phase เริ่มเมื่อ cervix เปิด ≥ 4–6 cm จนถึง fully dilated (10 cm)",
      detailed_explanation: {
        summary: "Cervix 4 cm + effacement 80% = active phase of stage 1",
        reason:
          "ระยะที่ 1: latent (0–<4–6 cm) → active (4–6 cm ถึง 10 cm); ระยะที่ 2: fully dilated → คลอด; ระยะที่ 3: คลอด → รกคลอด",
        choices: [
          {
            label: "A",
            text: "Latent phase",
            is_correct: false,
            explanation: "Latent สิ้นสุดก่อน active เริ่ม (~4–6 cm)",
          },
          {
            label: "B",
            text: "Active phase",
            is_correct: true,
            explanation: "4 cm + 80% effacement เข้าเกณฑ์ active phase",
          },
          {
            label: "C",
            text: "Stage 2",
            is_correct: false,
            explanation: "Stage 2 เริ่มเมื่อ cervix เปิด 10 cm",
          },
          {
            label: "D",
            text: "Stage 3",
            is_correct: false,
            explanation: "Stage 3 คือระยะหลังคลอดทารก จนถึงรกคลอด",
          },
        ],
        key_takeaway: "Stage 1: latent → active (เริ่มประมาณ 4–6 cm)",
      },
      difficulty: "medium",
    },
  ],

  // 6. การพยาบาลสุขภาพจิตและจิตเวช
  NursingPsych: [
    {
      scenario:
        "ผู้ป่วยชายอายุ 35 ปี ได้รับการวินิจฉัยเป็น schizophrenia กำลังได้รับยา haloperidol 5 mg IM ผู้ป่วยเริ่มมีอาการคอเอียง ลิ้นแข็ง ตาลอย พยาบาลควรประเมินว่าเป็นอาการใด",
      choices: [
        { label: "A", text: "Tardive dyskinesia" },
        { label: "B", text: "Acute dystonia" },
        { label: "C", text: "Akathisia" },
        { label: "D", text: "Neuroleptic malignant syndrome (NMS)" },
      ],
      correct_answer: "B",
      explanation:
        "Acute dystonia เกิดภายในชั่วโมง–วันแรก มี muscular spasm เช่น torticollis, oculogyric crisis รักษาด้วย anticholinergic (benztropine/diphenhydramine)",
      detailed_explanation: {
        summary: "อาการเฉียบพลันหลังได้ antipsychotic = acute dystonia",
        reason:
          "Extrapyramidal symptoms แบ่งเป็น acute dystonia (ชั่วโมง-วัน), akathisia (วัน-สัปดาห์), parkinsonism (สัปดาห์-เดือน), tardive dyskinesia (เดือน-ปี)",
        choices: [
          {
            label: "A",
            text: "Tardive dyskinesia",
            is_correct: false,
            explanation: "TD เป็น late-onset เกิดหลังใช้ยาเป็นเดือน–ปี",
          },
          {
            label: "B",
            text: "Acute dystonia",
            is_correct: true,
            explanation:
              "Muscular spasm เฉียบพลันหลังเริ่มยา เช่น torticollis, oculogyric",
          },
          {
            label: "C",
            text: "Akathisia",
            is_correct: false,
            explanation: "Akathisia คือ restlessness ไม่ใช่ muscular spasm",
          },
          {
            label: "D",
            text: "NMS",
            is_correct: false,
            explanation:
              "NMS มี fever, rigidity, autonomic instability, เปลี่ยน conscious level",
          },
        ],
        key_takeaway:
          "Acute muscular spasm หลังเริ่ม antipsychotic = dystonia — รักษาด้วย anticholinergic",
      },
      difficulty: "medium",
    },
  ],

  // 7. การพยาบาลอนามัยชุมชน
  NursingCommunity: [
    {
      scenario:
        "การให้วัคซีนคอตีบ-ไอกรน-บาดทะยัก (DTP) ในเด็กเพื่อป้องกันโรค จัดเป็นการป้องกันระดับใดตามหลัก primary prevention",
      choices: [
        { label: "A", text: "Primary prevention" },
        { label: "B", text: "Secondary prevention" },
        { label: "C", text: "Tertiary prevention" },
        { label: "D", text: "Quaternary prevention" },
      ],
      correct_answer: "A",
      explanation:
        "Primary prevention คือป้องกันก่อนเกิดโรค เช่น วัคซีน สุขศึกษา; secondary คือ early detection (screening); tertiary คือ rehabilitation",
      detailed_explanation: {
        summary: "วัคซีน = primary prevention",
        reason:
          "Primary prevention ลดอุบัติการณ์โรค ด้วยการป้องกันก่อนเกิดโรค เช่น immunization, health promotion, การสุขาภิบาล",
        choices: [
          {
            label: "A",
            text: "Primary prevention",
            is_correct: true,
            explanation: "Vaccine = ป้องกันก่อนเกิดโรค",
          },
          {
            label: "B",
            text: "Secondary prevention",
            is_correct: false,
            explanation: "Secondary = คัดกรอง/early detection เช่น Pap smear",
          },
          {
            label: "C",
            text: "Tertiary prevention",
            is_correct: false,
            explanation:
              "Tertiary = ฟื้นฟูสภาพ/ลด disability หลังเป็นโรคแล้ว",
          },
          {
            label: "D",
            text: "Quaternary prevention",
            is_correct: false,
            explanation:
              "Quaternary = ป้องกัน overmedicalization (ไม่อยู่ใน 3 ระดับหลัก)",
          },
        ],
        key_takeaway:
          "Primary = ก่อนเกิดโรค, Secondary = คัดกรอง, Tertiary = ฟื้นฟู",
      },
      difficulty: "easy",
    },
  ],

  // 8. กฎหมายและจรรยาบรรณวิชาชีพ
  NursingLawEthics: [
    {
      scenario:
        "ผู้ป่วยขอดูเวชระเบียนของตนเองและขอสำเนา พยาบาลควรปฏิบัติตามหลักจริยศาสตร์ข้อใดมากที่สุด",
      choices: [
        { label: "A", text: "Beneficence" },
        { label: "B", text: "Autonomy" },
        { label: "C", text: "Justice" },
        { label: "D", text: "Nonmaleficence" },
      ],
      correct_answer: "B",
      explanation:
        "Autonomy คือการเคารพสิทธิในการตัดสินใจและเข้าถึงข้อมูลสุขภาพของตนเอง ซึ่งตรงกับสิทธิผู้ป่วยตามคำประกาศฯ",
      detailed_explanation: {
        summary: "สิทธิผู้ป่วยในการเข้าถึงข้อมูลตน = Autonomy",
        reason:
          "หลักจริยศาสตร์ 4 ข้อหลัก: autonomy, beneficence, nonmaleficence, justice; การเข้าถึงข้อมูลของตนเองเน้นที่ autonomy",
        choices: [
          {
            label: "A",
            text: "Beneficence",
            is_correct: false,
            explanation: "Beneficence = ทำประโยชน์ให้ผู้ป่วย (ไม่ตรง core)",
          },
          {
            label: "B",
            text: "Autonomy",
            is_correct: true,
            explanation: "เคารพสิทธิการตัดสินใจและเข้าถึงข้อมูลของตนเอง",
          },
          {
            label: "C",
            text: "Justice",
            is_correct: false,
            explanation: "Justice = ความยุติธรรม/เสมอภาคในการจัดสรรทรัพยากร",
          },
          {
            label: "D",
            text: "Nonmaleficence",
            is_correct: false,
            explanation: "Nonmaleficence = ไม่ก่ออันตราย (ไม่ตรงบริบท)",
          },
        ],
        key_takeaway:
          "Autonomy = respect decision-making + access to own information",
      },
      difficulty: "easy",
    },
  ],
};

async function run() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  // Look up subject ids by name (must already exist via create_nursing_subjects.js)
  const subjectRows = await client.query(
    "SELECT id, name FROM mcq_subjects WHERE exam_type = 'NLE'"
  );
  const subjectIdByName = Object.fromEntries(
    subjectRows.rows.map((r) => [r.name, r.id])
  );

  const missing = Object.keys(questionsBySubjectName).filter(
    (n) => !subjectIdByName[n]
  );
  if (missing.length > 0) {
    console.error(
      "ERROR: missing nursing subjects — run create_nursing_subjects.js first. Missing:",
      missing.join(", ")
    );
    process.exit(1);
  }

  let inserted = 0;
  for (const [subjectName, questions] of Object.entries(
    questionsBySubjectName
  )) {
    const subjectId = subjectIdByName[subjectName];
    for (const q of questions) {
      const id = randomUUID();
      await client.query(
        `INSERT INTO mcq_questions
         (id, subject_id, exam_type, scenario, choices, correct_answer,
          explanation, detailed_explanation, difficulty, is_ai_enhanced,
          ai_notes, status)
         VALUES ($1, $2, 'NLE', $3, $4, $5, $6, $7, $8, false, $9, 'active')`,
        [
          id,
          subjectId,
          q.scenario,
          JSON.stringify(q.choices),
          q.correct_answer,
          q.explanation,
          JSON.stringify(q.detailed_explanation),
          q.difficulty,
          "NLE pilot batch 1 — review before using at scale",
        ]
      );
      inserted++;
    }
    console.log(
      `✅ ${subjectName}: inserted ${questions.length} questions`
    );
  }

  // Refresh question_count per subject
  await client.query(`
    UPDATE mcq_subjects s
    SET question_count = (
      SELECT COUNT(*) FROM mcq_questions q
      WHERE q.subject_id = s.id AND q.status = 'active'
    )
    WHERE s.exam_type = 'NLE'
  `);

  console.log(`\n=== Done: inserted ${inserted} NLE questions ===`);
  await client.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
