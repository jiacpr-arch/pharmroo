const { createClient } = require("@libsql/client");
const { randomUUID } = require("crypto");

require("dotenv").config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const SUBJECT_ID = "06991a85-412e-476e-89ff-32b0a7b92e6c"; // กระดูกและข้อ

const questions = [
  {
    scenario: "ผู้ป่วยชายอายุ 55 ปี มีอาการปวดข้อเข่าทั้งสองข้าง เดินลำบาก X-ray พบ joint space narrowing ที่เข่า วินิจฉัย OA (Osteoarthritis) ยาแก้ปวดที่แนะนำเป็น first-line คือ",
    choices: JSON.stringify(["Celecoxib 200 mg OD", "Paracetamol 500-1000 mg PRN/QID", "Diclofenac 75 mg BID", "Tramadol 50 mg PRN"]),
    correct_answer: "B",
    explanation: "Paracetamol เป็น first-line analgesic ใน OA ตาม ACR/EULAR guideline เนื่องจากปลอดภัยกว่า NSAIDs",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Celecoxib (COX-2 inhibitor) ใช้เมื่อ Paracetamol ไม่ได้ผลหรือมี GI risk",
      B: "ถูก — Paracetamol 500-1000 mg สูงสุด 4g/day เป็น first-line ที่ปลอดภัย",
      C: "ผิด — NSAIDs เป็น second-line หรือ add-on ไม่ใช่ first-line",
      D: "ผิด — Tramadol เป็นยากลุ่ม opioid ใช้เมื่อ NSAIDs/Paracetamol ไม่เพียงพอ",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 45 ปี RA (Rheumatoid Arthritis) วินิจฉัยใหม่ แพทย์เริ่ม DMARD ตัวแรก ยาใดที่เป็น anchor drug / first-line DMARD",
    choices: JSON.stringify(["Hydroxychloroquine", "Methotrexate (MTX)", "Leflunomide", "Sulfasalazine"]),
    correct_answer: "B",
    explanation: "Methotrexate เป็น anchor DMARD first-line สำหรับ RA ทุก guideline (ACR/EULAR 2023)",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Hydroxychloroquine ใช้ใน mild RA หรือ SLE ไม่ใช่ anchor drug RA",
      B: "ถูก — MTX 10-25 mg/week + folic acid เป็น first-line csDMARD ทุก RA guideline",
      C: "ผิด — Leflunomide ใช้เมื่อ MTX ไม่สามารถใช้ได้ เป็น alternative",
      D: "ผิด — Sulfasalazine ใช้ใน mild-moderate RA หรือ combination ไม่ใช่ anchor drug",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 35 ปี RA ใช้ Methotrexate 15 mg/week เภสัชกรต้องแนะนำให้รับประทาน Folic acid ทุกวันเพื่ออะไร",
    choices: JSON.stringify(["เพิ่มประสิทธิภาพ MTX", "ลดผลข้างเคียง (mouth sore, GI, hepatotoxicity)", "ป้องกัน osteoporosis จาก RA", "เสริมภูมิคุ้มกัน"]),
    correct_answer: "B",
    explanation: "Folic acid ลด MTX-induced toxicity: mucositis, GI side effects, hepatotoxicity โดยไม่ลด efficacy",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Folic acid ไม่เพิ่มประสิทธิภาพ MTX",
      B: "ถูก — MTX ยับยั้ง DHFR → folate deficiency → mouth sores, nausea, hepatotoxicity; folic acid 1-5 mg/day ลด toxicity เหล่านี้",
      C: "ผิด — Folic acid ไม่ป้องกัน osteoporosis",
      D: "ผิด — Folic acid ไม่ใช่ immunomodulator",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 60 ปี ปวดข้อนิ้วโป้งเท้าซ้ายเฉียบพลัน บวมแดงร้อน ระดับ uric acid 9.5 mg/dL วินิจฉัย Acute Gouty Arthritis ยา first-line ที่เหมาะสมที่สุดคือ",
    choices: JSON.stringify(["Allopurinol 300 mg ทันที", "Colchicine 1.2 mg แล้วตามด้วย 0.6 mg ใน 1 ชั่วโมง", "Febuxostat 80 mg OD", "Benzbromarone 50 mg"]),
    correct_answer: "B",
    explanation: "Colchicine เป็น first-line ใน acute gout attack ร่วมกับ NSAIDs หรือ corticosteroid; Allopurinol ไม่ควรเริ่มระหว่าง acute attack",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Allopurinol ไม่ควรเริ่มหรือเปลี่ยนขนาดระหว่าง acute attack เพราะยิ่งกระตุ้นการโจมตี",
      B: "ถูก — Colchicine low-dose regimen (1.2 mg + 0.6 mg ใน 1 ชม.) ACR guideline สำหรับ acute gout",
      C: "ผิด — Febuxostat เป็น urate-lowering therapy ใช้หลังจาก acute ระงับแล้ว ≥2 สัปดาห์",
      D: "ผิด — Benzbromarone เป็น uricosuric agent ใช้ chronic gout",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 55 ปี Chronic Gout มีประวัติ tophi ที่นิ้วมือ uric acid 10 mg/dL ควรเริ่ม Allopurinol โดยมีเป้าหมาย serum uric acid ที่ระดับใด",
    choices: JSON.stringify(["< 8 mg/dL", "< 6 mg/dL", "< 4 mg/dL", "< 9 mg/dL"]),
    correct_answer: "B",
    explanation: "Serum uric acid target ใน chronic gout: < 6 mg/dL (และ < 5 mg/dL ถ้ามี tophi)",
    detailed_explanation: JSON.stringify({
      A: "ผิด — 8 mg/dL สูงเกิน ยังมีการตกตะกอน urate crystals",
      B: "ถูก — ACR 2020 target: SUA < 6 mg/dL สำหรับ gout ทั่วไป; < 5 mg/dL ถ้ามี tophaceous gout",
      C: "ผิด — < 4 mg/dL ต่ำเกินความจำเป็น",
      D: "ผิด — 9 mg/dL สูงเกินไป ไม่ใช่ target",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 65 ปี วัยหมดประจำเดือน 15 ปี ตรวจ DEXA พบ T-score = -2.6 วินิจฉัย Osteoporosis ยา first-line คือ",
    choices: JSON.stringify(["Calcium + Vitamin D เพียงอย่างเดียว", "Bisphosphonate (Alendronate/Risedronate)", "HRT (Hormone Replacement Therapy)", "Calcitonin nasal spray"]),
    correct_answer: "B",
    explanation: "Bisphosphonate เป็น first-line pharmacotherapy สำหรับ osteoporosis ในผู้หญิงวัยหมดประจำเดือน",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Calcium + Vitamin D เสริมแต่ไม่ใช่ treatment หลักเมื่อ T-score ≤ -2.5",
      B: "ถูก — Alendronate 70 mg/week หรือ Risedronate 35 mg/week เป็น first-line antifracture therapy",
      C: "ผิด — HRT ลดความเสี่ยงกระดูกหักแต่มีความเสี่ยง breast cancer, thrombosis",
      D: "ผิด — Calcitonin ประสิทธิภาพต่ำกว่า bisphosphonate",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 50 ปี รับประทาน Alendronate 70 mg/week มา 2 ปี มาพบเภสัชกรเพื่อรับยา เภสัชกรควรให้คำแนะนำอะไร",
    choices: JSON.stringify(["รับประทานหลังอาหารเช้า", "รับประทานก่อนอาหารเช้า 30 นาที นั่งตัวตรงหรือยืน", "รับประทานก่อนนอน", "รับประทานพร้อมนม"]),
    correct_answer: "B",
    explanation: "Bisphosphonate oral: ต้องรับประทานตอนเช้า ก่อนอาหาร 30-60 นาที กับน้ำเปล่า และต้องนั่งหรือยืนตรงเพื่อป้องกัน esophageal irritation",
    detailed_explanation: JSON.stringify({
      A: "ผิด — รับประทานหลังอาหารลดการดูดซึม",
      B: "ถูก — Alendronate ต้องรับประทานตอนเช้า ก่อนอาหาร 30 นาที กับน้ำเปล่า 200 mL นั่งตรงหรือยืนอย่างน้อย 30 นาทีหลังกิน",
      C: "ผิด — รับประทานก่อนนอน เสี่ยง esophageal ulceration",
      D: "ผิด — นมลดการดูดซึมอย่างมาก",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 40 ปี SLE (Systemic Lupus Erythematosus) รักษาด้วย Hydroxychloroquine มา 2 ปี เภสัชกรต้องแนะนำให้ตรวจตาเพราะเหตุใด",
    choices: JSON.stringify(["Uveitis จาก SLE", "Cataracts จาก Hydroxychloroquine", "Retinopathy จาก Hydroxychloroquine", "Glaucoma จาก Hydroxychloroquine"]),
    correct_answer: "C",
    explanation: "Hydroxychloroquine สะสมที่ retina → macular toxicity (bull's eye retinopathy) ควรตรวจตาทุกปีหลังใช้ 5 ปีแรก",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Uveitis อาจเกิดจาก SLE เอง ไม่ใช่ผลข้างเคียงของ HCQ",
      B: "ผิด — Cataracts เกิดจาก corticosteroid ไม่ใช่ HCQ",
      C: "ถูก — Chloroquine/Hydroxychloroquine: retinal toxicity (maculopathy) ขึ้นกับ cumulative dose ตรวจ baseline แล้วทุกปีหลังปีที่ 5",
      D: "ผิด — Glaucoma ไม่ใช่ผลข้างเคียงของ HCQ",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 32 ปี RA กำลังจะตั้งครรภ์ ยา DMARD ใดที่ต้องหยุดก่อนตั้งครรภ์อย่างน้อย 3 เดือน",
    choices: JSON.stringify(["Hydroxychloroquine", "Sulfasalazine", "Methotrexate", "Azathioprine"]),
    correct_answer: "C",
    explanation: "Methotrexate เป็น teratogen ชัดเจน (category X) ต้องหยุดอย่างน้อย 3 เดือนก่อนตั้งครรภ์",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Hydroxychloroquine ปลอดภัย สามารถใช้ต่อระหว่างตั้งครรภ์",
      B: "ผิด — Sulfasalazine ใช้ได้ระหว่างตั้งครรภ์ (ต้องให้ folic acid เสริม)",
      C: "ถูก — MTX teratogenic, abortifacient หยุดอย่างน้อย 3 เดือน (บางแหล่ง 6 เดือน) ก่อนตั้งครรภ์",
      D: "ผิด — Azathioprine ใช้ได้ระหว่างตั้งครรภ์ใน inflammatory disease",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 45 ปี ปวดหลังส่วนล่าง (Low Back Pain) เฉียบพลัน 3 วัน ไม่มี red flags ยาที่เหมาะสม first-line คือ",
    choices: JSON.stringify(["Tramadol 50 mg PRN", "Paracetamol 500 mg PRN + Ibuprofen 400 mg TID", "Methocarbamol (muscle relaxant)", "Gabapentin 300 mg TID"]),
    correct_answer: "B",
    explanation: "Acute LBP ไม่มี red flags: Paracetamol และ NSAIDs เป็น first-line ร่วมกับ non-pharmacological (heat, exercise)",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Tramadol ไม่ใช่ first-line สำหรับ non-specific LBP",
      B: "ถูก — Paracetamol ± NSAIDs เป็น first-line pharmacotherapy สำหรับ acute LBP",
      C: "ผิด — Muscle relaxant เพิ่มเป็น add-on ถ้ามี muscle spasm ชัดเจน ไม่ใช่ first-line",
      D: "ผิด — Gabapentin ใช้ใน neuropathic pain ไม่ใช่ acute LBP",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 60 ปี Osteoporosis รับประทาน Alendronate มา 5 ปี แพทย์จะพิจารณา drug holiday เหตุใดจึงทำ",
    choices: JSON.stringify(["เพราะ bisphosphonate หมดฤทธิ์หลัง 5 ปี", "เพื่อลดความเสี่ยง atypical femoral fracture และ ONJ", "เพราะ bone density เพิ่มสูงสุดที่ 5 ปี", "เพื่อประหยัดค่าใช้จ่าย"]),
    correct_answer: "B",
    explanation: "Bisphosphonate drug holiday ลด cumulative dose เพื่อลดความเสี่ยง atypical femoral fracture และ osteonecrosis of the jaw (ONJ)",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Bisphosphonate สะสมในกระดูก ยังมีฤทธิ์ได้นานหลังหยุดยา",
      B: "ถูก — ผลข้างเคียงหายาก แต่รุนแรง: atypical femoral fracture และ ONJ สัมพันธ์กับ cumulative dose ยาว → drug holiday ลดความเสี่ยง",
      C: "ผิด — Bone density ไม่ใช่เหตุผลหลัก",
      D: "ผิด — Drug holiday ไม่ใช่เพื่อประหยัด",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 35 ปี Ankylosing Spondylitis (AS) ปวดหลังส่วนล่าง ตอบสนองไม่ดีต่อ NSAIDs หลายชนิด แพทย์จะใช้ biologic ชนิดใดเป็น first-line",
    choices: JSON.stringify(["Anti-CD20 (Rituximab)", "Anti-TNF (Etanercept หรือ Adalimumab)", "IL-6 inhibitor (Tocilizumab)", "JAK inhibitor (Tofacitinib)"]),
    correct_answer: "B",
    explanation: "Anti-TNF therapy เป็น first-line biologic สำหรับ AS ที่ fail NSAIDs ตาม ASAS/EULAR guideline",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Rituximab ไม่มีหลักฐานชัดเจนใน AS",
      B: "ถูก — Anti-TNF (Etanercept, Adalimumab, Certolizumab, Golimumab) เป็น first-line biologic ใน active AS ที่ fail ≥2 NSAIDs",
      C: "ผิด — Tocilizumab ไม่ได้รับการอนุมัติใน AS",
      D: "ผิด — JAK inhibitor (Tofacitinib, Upadacitinib) ใช้ได้แต่เป็น second-line หลัง anti-TNF",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 62 ปี OA เข่า ใช้ Diclofenac 75 mg BID มา 3 เดือน เริ่มมีอาการบวมขาและความดันโลหิตสูงขึ้น สาเหตุที่น่าจะเป็น",
    choices: JSON.stringify(["RA แย่ลง", "NSAIDs-induced sodium/water retention และ hypertension", "Methotrexate toxicity", "Calcium deficiency"]),
    correct_answer: "B",
    explanation: "NSAIDs ยับยั้ง prostaglandin ซึ่งมีบทบาทใน renal blood flow → sodium retention → บวม, ความดันสูง",
    detailed_explanation: JSON.stringify({
      A: "ผิด — RA ไม่ใช่ diagnosis ของผู้ป่วยรายนี้",
      B: "ถูก — NSAIDs: inhibit PGE2/PGI2 → renal sodium retention → oedema, hypertension เป็น class effect",
      C: "ผิด — ผู้ป่วยไม่ได้รับ MTX",
      D: "ผิด — Calcium deficiency ไม่ทำให้บวมขาหรือ BP สูง",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 70 ปี ปวดข้อทั่วไป ได้รับ Prednisolone 10 mg/day มา 6 เดือน ควรให้ยาเสริมอะไรเพื่อป้องกัน steroid-induced osteoporosis",
    choices: JSON.stringify(["Vitamin D 1000 IU/day เท่านั้น", "Calcium 1000 mg + Vitamin D 800 IU/day", "Calcium + Vitamin D + Bisphosphonate (Alendronate)", "Estrogen therapy"]),
    correct_answer: "C",
    explanation: "Steroid ≥7.5 mg/day ≥3 เดือน: ACR แนะนำ Calcium + Vitamin D + Bisphosphonate เพื่อป้องกัน fracture",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Vitamin D เดี่ยวไม่เพียงพอ",
      B: "ผิด — Calcium + Vitamin D ไม่เพียงพอใน long-term high-dose steroid",
      C: "ถูก — ACR 2017: steroid ≥7.5 mg/day ≥3 เดือน → Calcium 1000-1200 mg + Vit D 600-800 IU + oral bisphosphonate",
      D: "ผิด — Estrogen ไม่ใช่ first-line สำหรับ steroid-induced osteoporosis",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 45 ปี ปวดกล้ามเนื้อ Fibromyalgia ยาที่มีหลักฐานดีที่สุดและ FDA-approved สำหรับ Fibromyalgia คือ",
    choices: JSON.stringify(["Ibuprofen 400 mg TID", "Duloxetine 60 mg OD", "Codeine 30 mg PRN", "Methotrexate"]),
    correct_answer: "B",
    explanation: "Duloxetine (SNRI) เป็นหนึ่งใน 3 ยาที่ FDA อนุมัติสำหรับ Fibromyalgia (อีก 2 คือ Milnacipran, Pregabalin)",
    detailed_explanation: JSON.stringify({
      A: "ผิด — NSAIDs มีหลักฐานน้อยใน Fibromyalgia เพราะไม่ใช่ inflammatory condition",
      B: "ถูก — Duloxetine 60 mg/day FDA-approved สำหรับ Fibromyalgia ลด central sensitization",
      C: "ผิด — Opioid ไม่แนะนำใน Fibromyalgia (ไม่ได้ผล อาจแย่ลง)",
      D: "ผิด — Methotrexate ใช้ใน autoimmune ไม่ใช่ Fibromyalgia",
    }),
    difficulty: "hard",
  },
];

async function seed() {
  console.log(`Seeding ${questions.length} musculoskeletal questions...`);
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
  console.log(`\nDone! ${questions.length} questions inserted for กระดูกและข้อ`);
}

seed().catch(console.error);
