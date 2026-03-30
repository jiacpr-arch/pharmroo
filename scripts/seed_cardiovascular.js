const { createClient } = require("@libsql/client");
const { randomUUID } = require("crypto");

require("dotenv").config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const SUBJECT_ID = "dce79912-01f6-4871-96df-94c6cfc853e7"; // หัวใจและหลอดเลือด

const questions = [
  {
    scenario: "ผู้ป่วยชายอายุ 58 ปี ความดันโลหิตสูง 160/95 mmHg ไม่มีโรคร่วม เป้าหมายความดันโลหิตตาม 2023 guideline คือ",
    choices: JSON.stringify(["< 150/90 mmHg", "< 140/90 mmHg", "< 130/80 mmHg", "< 120/80 mmHg"]),
    correct_answer: "C",
    explanation: "ACC/AHA 2017/2023 เป้าหมาย BP < 130/80 mmHg สำหรับผู้ใหญ่ทั่วไป",
    detailed_explanation: JSON.stringify({
      A: "ผิด — < 150/90 เป็น older target สำหรับผู้สูงอายุ ≥ 80 ปี",
      B: "ผิด — < 140/90 เป็น JNC 7 (เก่า) และ ESH 2023 ยังใช้ แต่ ACC/AHA 2017 ใช้ < 130/80",
      C: "ถูก — ACC/AHA 2017 guideline: target BP < 130/80 mmHg สำหรับ hypertensive adults (high cardiovascular risk และ stage 2)",
      D: "ผิด — < 120/80 เป็น normal BP ไม่ใช่ target สำหรับ treatment",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 55 ปี HTN + DM type 2 + CKD (proteinuria) ยา antihypertensive first-line ที่เหมาะสมที่สุดคือ",
    choices: JSON.stringify(["Calcium channel blocker (Amlodipine)", "ACE inhibitor หรือ ARB", "Beta-blocker (Atenolol)", "Thiazide diuretic (HCTZ)"]),
    correct_answer: "B",
    explanation: "HTN + DM + CKD proteinuria: ACEi/ARB เป็น first-line เพราะมี renoprotective effect ลด proteinuria",
    detailed_explanation: JSON.stringify({
      A: "ผิด — CCB ใช้ได้แต่ไม่มี renoprotective benefit เหมือน ACEi/ARB",
      B: "ถูก — ACEi (Enalapril, Lisinopril) หรือ ARB (Losartan, Valsartan) ลด proteinuria และชะลอการดำเนินของ CKD — first-line ใน DM + CKD",
      C: "ผิด — Beta-blocker ไม่ใช่ first-line HTN ทั่วไป ยกเว้นมี heart failure, post-MI",
      D: "ผิด — Thiazide ใช้ได้แต่ไม่มี renoprotective benefit เพิ่มเติม",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 62 ปี STEMI เพิ่งเกิดขึ้น 2 ชั่วโมง ถูกนำส่ง ER ยาใดที่ต้องให้ทันทีก่อน PCI (ภายใน loading dose)",
    choices: JSON.stringify(["Aspirin 81 mg OD", "Aspirin 325 mg + P2Y12 inhibitor (Ticagrelor 180 mg หรือ Clopidogrel 600 mg) loading", "Warfarin", "Heparin IV เพียงอย่างเดียว"]),
    correct_answer: "B",
    explanation: "STEMI: dual antiplatelet (DAPT) loading — Aspirin 150-300 mg + Ticagrelor 180 mg หรือ Clopidogrel 600 mg ก่อน PCI",
    detailed_explanation: JSON.stringify({
      A: "ผิด — 81 mg OD เป็น maintenance dose ไม่ใช่ loading",
      B: "ถูก — DAPT loading: Aspirin 150-300 mg + Ticagrelor 180 mg (preferred) หรือ Clopidogrel 600 mg ก่อน primary PCI ตาม ACC/AHA/ESC guidelines",
      C: "ผิด — Warfarin ไม่มีบทบาทใน acute STEMI management",
      D: "ผิด — Heparin IV ใช้ร่วมใน PCI แต่ไม่ใช่ antiplatelet therapy",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 65 ปี Post-MI (2 สัปดาห์) ปัจจุบัน EF 35% ยาที่ช่วยลด mortality หลัง MI ที่ต้องใช้ทุกราย (ไม่มี contraindication) คือ",
    choices: JSON.stringify(["Aspirin เพียงอย่างเดียว", "Aspirin + Beta-blocker + ACEi/ARB + Statin", "CCB + Diuretic", "Nitrate ทุกวัน"]),
    correct_answer: "B",
    explanation: "Post-MI with reduced EF: ยา 4 กลุ่ม ลด mortality — Aspirin, Beta-blocker, ACEi/ARB, Statin (ACC/AHA secondary prevention)",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Aspirin เดี่ยวไม่เพียงพอ",
      B: "ถูก — Post-MI evidence-based therapies: Aspirin (antiplatelet) + Beta-blocker (reduce arrhythmia/remodeling) + ACEi/ARB (reduce mortality HFrEF) + Statin (LDL reduction, plaque stabilization)",
      C: "ผิด — CCB ไม่ได้ลด mortality post-MI (ยกเว้น rate control AF)",
      D: "ผิด — Nitrate ใช้ symptom relief ไม่ได้ลด mortality",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 70 ปี Heart Failure HFrEF (EF 30%) ยา 4 pillars of HFrEF ที่ลด mortality ประกอบด้วย",
    choices: JSON.stringify(["Furosemide + Spironolactone + Digoxin + ACEi", "ACEi/ARB/ARNI + Beta-blocker + MRA + SGLT2i", "CCB + Diuretic + Digoxin + Statin", "Amiodarone + ACEi + Diuretic + Aspirin"]),
    correct_answer: "B",
    explanation: "HFrEF 4 pillars (2023 AHA/ESC): ARNI (Sacubitril/Valsartan) or ACEi/ARB + Beta-blocker + MRA (Eplerenone/Spironolactone) + SGLT2i",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Digoxin ไม่ได้ลด mortality เพียงลดการ hospitalization",
      B: "ถูก — 2022 AHA HF guideline 4 pillars: ARNI/ACEi/ARB + Beta-blocker + MRA + SGLT2i (Dapagliflozin/Empagliflozin) ลด mortality และ hospitalization",
      C: "ผิด — CCB (non-DHP) อาจแย่ลง HF; Statin ไม่มี mortality benefit ใน HF",
      D: "ผิด — Amiodarone ใช้เฉพาะ arrhythmia management ไม่ใช่ standard HF pillar",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 55 ปี AF (Atrial Fibrillation) สะดุดใจ แพทย์ต้องการ rate control เป้าหมาย resting heart rate ที่ยอมรับได้สำหรับ lenient control คือ",
    choices: JSON.stringify(["HR < 60 bpm", "HR < 80 bpm", "HR < 100 bpm", "HR < 110 bpm"]),
    correct_answer: "D",
    explanation: "RACE II trial: lenient rate control (HR < 110 bpm) ไม่แย่กว่า strict (< 80 bpm) ใน AF ที่ไม่มีอาการรุนแรง",
    detailed_explanation: JSON.stringify({
      A: "ผิด — 60 bpm เข้มเกินไป",
      B: "ผิด — < 80 bpm คือ strict rate control ใช้ได้แต่ lenient ก็ acceptable",
      C: "ผิด — < 100 bpm เป็น older target",
      D: "ถูก — Lenient rate control: resting HR < 110 bpm ยอมรับได้ตาม ESC/ACC ในผู้ที่ไม่มี HF หรืออาการรุนแรง (RACE II)",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 45 ปี LDL 180 mg/dL มีประวัติครอบครัว premature CVD แต่ยังไม่มี CVD เอง คำนวณ 10-year ASCVD risk ได้ 12% ควรเริ่มยาชนิดใด",
    choices: JSON.stringify(["Lifestyle modification อย่างเดียว", "Moderate-intensity Statin (Atorvastatin 10-20 mg)", "High-intensity Statin (Atorvastatin 40-80 mg)", "Ezetimibe เดี่ยว"]),
    correct_answer: "C",
    explanation: "ASCVD risk ≥ 10% + LDL สูง: High-intensity statin เป็น first-line ตาม ACC/AHA 2019 guideline",
    detailed_explanation: JSON.stringify({
      A: "ผิด — ASCVD risk 12% เกิน threshold ที่ต้องการยา",
      B: "ผิด — Moderate statin ใช้ใน intermediate risk (7.5-10%)",
      C: "ถูก — ASCVD risk ≥ 10% (high risk): high-intensity statin เป็น first-line (Atorvastatin 40-80 mg หรือ Rosuvastatin 20-40 mg)",
      D: "ผิด — Ezetimibe เป็น add-on ไม่ใช่ monotherapy first-line",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 35 ปี ตั้งครรภ์ 24 สัปดาห์ ความดันโลหิต 158/104 mmHg วินิจฉัย Gestational Hypertension ยาลดความดันที่ปลอดภัยในตั้งครรภ์คือ",
    choices: JSON.stringify(["Enalapril (ACE inhibitor)", "Methyldopa หรือ Nifedipine หรือ Labetalol", "Losartan (ARB)", "Hydrochlorothiazide"]),
    correct_answer: "B",
    explanation: "Hypertension ในตั้งครรภ์: Methyldopa, Nifedipine, Labetalol ปลอดภัย; ACEi/ARB ห้ามใช้ (fetotoxic)",
    detailed_explanation: JSON.stringify({
      A: "ผิด — ACEi (Enalapril) ห้ามใช้ใน pregnancy: ทำให้ fetal renal agenesis, oligohydramnios",
      B: "ถูก — Methyldopa (category B), Nifedipine extended-release, Labetalol เป็น safe options ตาม ACOG",
      C: "ผิด — ARB ห้ามใช้ใน pregnancy เช่นเดียวกับ ACEi",
      D: "ผิด — Thiazide ลด plasma volume อาจส่งผลเสียต่อ fetal perfusion",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 60 ปี ได้รับ Digoxin 0.25 mg OD สำหรับ AF + HF มาพบแพทย์ด้วยอาการคลื่นไส้อาเจียน ตาพร่า มองเห็นสีเหลือง EKG พบ premature ventricular contractions ค่าใดที่ต้องตรวจ",
    choices: JSON.stringify(["Serum potassium และ Digoxin level", "Serum sodium", "INR", "Troponin"]),
    correct_answer: "A",
    explanation: "Digoxin toxicity signs: GI, visual (xanthopsia), arrhythmias; Hypokalemia เพิ่ม toxicity — ต้องตรวจ K+ และ Digoxin level",
    detailed_explanation: JSON.stringify({
      A: "ถูก — Digoxin toxicity: ตรวจ serum digoxin level (therapeutic 0.5-0.9 ng/mL สำหรับ HF) + serum K+ เพราะ hypokalemia เพิ่มความเป็น toxicity อย่างมาก",
      B: "ผิด — Sodium ไม่เกี่ยวข้องกับ Digoxin toxicity โดยตรง",
      C: "ผิด — INR สำหรับ Warfarin ไม่เกี่ยวกับ Digoxin",
      D: "ผิด — Troponin สำหรับ MI ไม่ใช่ Digoxin toxicity",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 50 ปี Stable Angina ใช้ Nitrate (ISDN) ทุกวัน เภสัชกรแนะนำให้มี nitrate-free interval ประมาณ 8-12 ชั่วโมงต่อวัน เหตุใด",
    choices: JSON.stringify(["ลดโอกาส hypotension", "ป้องกัน nitrate tolerance", "ลด reflex tachycardia", "ป้องกัน methemoglobinemia"]),
    correct_answer: "B",
    explanation: "Nitrate tolerance: การใช้ nitrate ต่อเนื่องทำให้ vascular sensitivity ลดลง → ต้องมี nitrate-free interval",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Hypotension ป้องกันโดยไม่ใช้ขนาดสูงและหลีกเลี่ยง PDE5 inhibitors",
      B: "ถูก — Nitrate tolerance เกิดจาก continuous exposure → ลด cGMP generation; nitrate-free interval 8-12 ชม./วัน ป้องกัน tolerance",
      C: "ผิด — Reflex tachycardia เกิดในช่วงแรก ไม่ใช่สาเหตุของ nitrate-free interval",
      D: "ผิด — Methemoglobinemia เกิดที่ขนาดสูงมาก ไม่ใช่สาเหตุหลัก",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 48 ปี ใช้ Sildenafil (Viagra) สำหรับ Erectile Dysfunction อยู่แล้ว แพทย์อยากให้ใช้ยาใดสำหรับ Angina แต่มี contraindication",
    choices: JSON.stringify(["Beta-blocker (Metoprolol)", "CCB (Amlodipine)", "Nitrate (Isosorbide dinitrate)", "Ivabradine"]),
    correct_answer: "C",
    explanation: "Nitrate + PDE5 inhibitor (Sildenafil) → severe hypotension อาจถึงแก่ชีวิต — ห้ามใช้ร่วมกัน absolute contraindication",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Beta-blocker ปลอดภัย ใช้ร่วมกับ Sildenafil ได้",
      B: "ผิด — CCB ปลอดภัย ไม่มี interaction รุนแรงกับ Sildenafil",
      C: "ถูก — Nitrate + PDE5i: cGMP ยิ่งเพิ่ม → vasodilation รุนแรง → severe hypotension → absolute contraindication",
      D: "ผิด — Ivabradine ไม่มี severe interaction กับ Sildenafil",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 65 ปี HTN + Asthma ยาลดความดันกลุ่มใดที่ควรหลีกเลี่ยง",
    choices: JSON.stringify(["Amlodipine (dihydropyridine CCB)", "Losartan (ARB)", "Atenolol (selective beta-blocker)", "Furosemide"]),
    correct_answer: "C",
    explanation: "Beta-blocker (แม้ selective) ควรหลีกเลี่ยงใน asthma เพราะอาจ exacerbate bronchospasm",
    detailed_explanation: JSON.stringify({
      A: "ผิด — DHP-CCB (Amlodipine) ปลอดภัยใน asthma",
      B: "ผิด — ARB ปลอดภัยใน asthma",
      C: "ถูก — Beta-blockers (แม้ cardioselective เช่น Atenolol, Metoprolol) ควรหลีกเลี่ยงใน asthma เพราะ beta-2 blockade อาจทำให้ bronchospasm แย่ลง",
      D: "ผิด — Furosemide ปลอดภัยใน asthma",
    }),
    difficulty: "easy",
  },
];

async function seed() {
  console.log(`Seeding ${questions.length} cardiovascular questions...`);
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const id = randomUUID();
    await client.execute({
      sql: `INSERT INTO mcq_questions (id, subject_id, exam_type, scenario, choices, correct_answer, explanation, detailed_explanation, difficulty, status)
            VALUES (?, ?, 'PLE-CC1', ?, ?, ?, ?, ?, ?, 'active')`,
      args: [id, SUBJECT_ID, q.scenario, q.choices, q.correct_answer, q.explanation, q.detailed_explanation, q.difficulty],
    });
    console.log(`  ${i + 1}. ${q.scenario.substring(0, 50)}...`);
  }
  console.log(`\nDone! ${questions.length} questions inserted for หัวใจและหลอดเลือด`);
}

seed().catch(console.error);
