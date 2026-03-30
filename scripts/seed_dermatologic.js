const { createClient } = require("@libsql/client");
const { randomUUID } = require("crypto");

require("dotenv").config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const SUBJECT_ID = "12b0b8c1-fe53-49d8-9c4b-e348eba85e36"; // ผิวหนัง

const questions = [
  {
    scenario: "ผู้ป่วยหญิงอายุ 22 ปี มีสิวอักเสบ (inflammatory acne) ระดับปานกลาง ยาทาที่เป็น first-line สำหรับ inflammatory acne คือ",
    choices: JSON.stringify(["Benzoyl peroxide เพียงอย่างเดียว", "Topical retinoid (Adapalene/Tretinoin)", "Topical antibiotic (Clindamycin) + Benzoyl peroxide", "Topical corticosteroid"]),
    correct_answer: "C",
    explanation: "Moderate inflammatory acne: topical antibiotic + benzoyl peroxide เป็น first-line; benzoyl peroxide ป้องกัน antibiotic resistance",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Benzoyl peroxide เดี่ยวเหมาะ mild acne ไม่เพียงพอสำหรับ moderate",
      B: "ผิด — Retinoid เหมาะกับ comedonal acne (non-inflammatory) มากกว่า",
      C: "ถูก — Clindamycin + Benzoyl peroxide (เช่น Duac) เป็น first-line moderate inflammatory acne ป้องกัน resistance",
      D: "ผิด — Topical steroid ห้ามใช้ใน acne (ทำให้ acne แย่ลง)",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 25 ปี Moderate-Severe Acne ไม่ตอบสนองต่อ topical therapy แพทย์พิจารณา Oral Isotretinoin ผู้ป่วยควรทราบข้อห้ามที่สำคัญที่สุดคืออะไร",
    choices: JSON.stringify(["ห้ามรับประทานกับอาหาร", "ห้ามใช้ในหญิงตั้งครรภ์ (Pregnancy X)", "ห้ามรับประทานเกิน 20 mg/day", "ห้ามรับประทานร่วมกับ Paracetamol"]),
    correct_answer: "B",
    explanation: "Isotretinoin เป็น teratogen รุนแรง (FDA category X) ห้ามใช้ในตั้งครรภ์ ต้องคุมกำเนิดอย่างเคร่งครัด",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Isotretinoin ควรรับประทานพร้อมอาหาร (fatty meal) เพื่อเพิ่มการดูดซึม",
      B: "ถูก — Pregnancy category X teratogen รุนแรง ต้องทำ pregnancy test ก่อนเริ่ม และทุกเดือน + คุมกำเนิด 2 วิธีตลอดการรักษา",
      C: "ผิด — ขนาดปกติ 0.5-1 mg/kg/day ไม่มีข้อห้าม 20 mg/day",
      D: "ผิด — ไม่มี significant interaction กับ Paracetamol",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 40 ปี มี Psoriasis plaque type ที่ข้อศอกและหัวเข่า mild-moderate ยาทาที่เหมาะสม first-line คือ",
    choices: JSON.stringify(["Topical corticosteroid (Betamethasone valerate)", "Topical retinoid", "Topical antibiotic", "Topical antifungal"]),
    correct_answer: "A",
    explanation: "Topical corticosteroid เป็น first-line สำหรับ mild-moderate plaque psoriasis",
    detailed_explanation: JSON.stringify({
      A: "ถูก — Medium-high potency topical corticosteroid (Betamethasone valerate, Mometasone) เป็น first-line สำหรับ limited psoriasis",
      B: "ผิด — Topical retinoid (Tazarotene) ใช้ได้แต่เป็น alternative ไม่ใช่ first-line",
      C: "ผิด — Psoriasis ไม่ใช่การติดเชื้อ topical antibiotic ไม่มีประสิทธิภาพ",
      D: "ผิด — Psoriasis ไม่ใช่เชื้อรา topical antifungal ไม่มีประสิทธิภาพ",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 35 ปี ผื่น Atopic Dermatitis เรื้อรัง ยาทาสเตียรอยด์ทำให้ผิวบาง ควรเปลี่ยนมาใช้ยาใดเป็น maintenance",
    choices: JSON.stringify(["Topical Tacrolimus หรือ Pimecrolimus (TCI)", "Topical antifungal", "Topical antibiotic", "Topical antihistamine"]),
    correct_answer: "A",
    explanation: "Topical calcineurin inhibitors (TCI): Tacrolimus/Pimecrolimus ใช้เป็น steroid-sparing agent ใน atopic dermatitis โดยไม่ทำให้ผิวบาง",
    detailed_explanation: JSON.stringify({
      A: "ถูก — TCI (Tacrolimus 0.03%/0.1%, Pimecrolimus 1%) เป็น non-steroidal alternative ไม่ทำให้ skin atrophy",
      B: "ผิด — Antifungal ไม่มีประสิทธิภาพต่อ atopic dermatitis",
      C: "ผิด — Topical antibiotic ใช้เมื่อมี secondary bacterial infection",
      D: "ผิด — Topical antihistamine ไม่แนะนำ (ประสิทธิภาพต่ำ อาจเกิด sensitization)",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 30 ปี เกิดอาการแพ้ยา Stevens-Johnson Syndrome (SJS) จากยาใดที่พบบ่อยที่สุด",
    choices: JSON.stringify(["Paracetamol", "Allopurinol", "Amoxicillin", "Metformin"]),
    correct_answer: "B",
    explanation: "Allopurinol เป็นสาเหตุพบบ่อยที่สุดของ SJS/TEN ในเอเชีย โดยเฉพาะผู้ที่มี HLA-B*5801",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Paracetamol ไม่ค่อยทำให้เกิด SJS",
      B: "ถูก — Allopurinol + HLA-B*5801 (พบมากในคนเอเชีย) เป็นสาเหตุ SJS/TEN พบบ่อยในไทย; ยาอื่นที่พบบ่อย: aromatic antiepileptics (Carbamazepine, Phenytoin), Sulfonamides",
      C: "ผิด — Amoxicillin ทำให้ maculopapular rash บ่อย แต่ SJS น้อยกว่า",
      D: "ผิด — Metformin ไม่พบ SJS",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 55 ปี มีผื่นแดงเป็นวงๆ ที่หน้า (butterfly rash) + ข้อ + ไต วินิจฉัย SLE ยาใดที่ใช้ป้องกันการกำเริบและลด mortality ใน SLE ทุก case",
    choices: JSON.stringify(["Prednisolone", "Methotrexate", "Hydroxychloroquine", "Mycophenolate mofetil"]),
    correct_answer: "C",
    explanation: "Hydroxychloroquine แนะนำให้ทุก SLE patient เพื่อลด disease flare, organ damage, thrombosis และ mortality",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Prednisolone ใช้ใน active disease ไม่ใช่ baseline treatment ทุก patient",
      B: "ผิด — Methotrexate ใช้ใน skin/joint SLE ไม่ใช่ baseline ทุก patient",
      C: "ถูก — HCQ 200-400 mg/day ควรให้ทุก SLE patient ยกเว้น contraindication; ลด flare, thrombosis, mortality",
      D: "ผิด — MMF ใช้ใน lupus nephritis ไม่ใช่ baseline ทุก SLE",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 65 ปี Herpes Zoster (งูสวัด) มีผื่นพุพองที่ด้านซ้ายของหน้าอก เกิดขึ้น 48 ชั่วโมง ควรให้ยา antiviral ใดและเมื่อใด",
    choices: JSON.stringify(["รอดูก่อน ถ้าแย่ค่อยให้ยา", "Acyclovir 800 mg 5 ครั้ง/วัน × 7 วัน เริ่มทันที", "Valacyclovir 1000 mg TID × 7 วัน เริ่มทันที", "Famciclovir 500 mg TID × 7 วัน เริ่มทันที หรือ Valacyclovir"]),
    correct_answer: "D",
    explanation: "Herpes Zoster: ควรเริ่ม antiviral ภายใน 72 ชั่วโมง Valacyclovir/Famciclovir มี bioavailability ดีกว่า Acyclovir oral",
    detailed_explanation: JSON.stringify({
      A: "ผิด — การรอจะทำให้ post-herpetic neuralgia และ complications แย่ขึ้น",
      B: "ผิด — Acyclovir oral ใช้ได้แต่ต้องกิน 5 ครั้ง/วัน compliance ต่ำกว่า; Valacyclovir/Famciclovir preferred",
      C: "ผิด — Valacyclovir ถูกต้อง แต่ Famciclovir ก็ใช้ได้เท่ากัน ควรระบุทั้งสอง",
      D: "ถูก — Valacyclovir 1000 mg TID หรือ Famciclovir 500 mg TID × 7 วัน เป็น preferred therapy ใน HZ (better bioavailability)",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 28 ปี ผื่นแพ้สัมผัส (Contact Dermatitis) ที่ข้อมือจากนาฬิกา ผื่นเป็นมา 1 สัปดาห์ ยาที่ใช้บรรเทาอาการในระยะเฉียบพลัน",
    choices: JSON.stringify(["Topical antifungal", "Topical corticosteroid (Hydrocortisone 1%)", "Oral antibiotic", "Topical antibiotic"]),
    correct_answer: "B",
    explanation: "Acute contact dermatitis: topical corticosteroid ลด inflammation เป็น mainstay treatment",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Contact dermatitis ไม่ใช่เชื้อรา",
      B: "ถูก — Topical corticosteroid (hydrocortisone ส่วน face/groin, medium-high potency ส่วน body) ลด inflammation",
      C: "ผิด — ไม่มีการติดเชื้อแบคทีเรีย",
      D: "ผิด — ไม่มีการติดเชื้อแบคทีเรีย",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 45 ปี มีผื่นเชื้อรา Tinea pedis (Hong Kong foot) ระหว่างนิ้วเท้า ยาทาที่เหมาะสม first-line คือ",
    choices: JSON.stringify(["Topical corticosteroid", "Topical Terbinafine (Lamisil cream)", "Oral Fluconazole", "Topical Nystatin"]),
    correct_answer: "B",
    explanation: "Tinea pedis (dermatophytosis): topical allylamine (Terbinafine) หรือ azole เป็น first-line",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Corticosteroid ห้ามใช้กับเชื้อรา (ทำให้แย่ลง)",
      B: "ถูก — Topical Terbinafine 1% (allylamine) มี cure rate สูงกว่า azoles ใน dermatophyte infections",
      C: "ผิด — Oral antifungal สำหรับกรณีรุนแรง, extensive, หรือ onycomycosis",
      D: "ผิด — Nystatin ใช้กับ Candida เท่านั้น ไม่ได้ผลกับ dermatophyte",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 50 ปี มีสีผิวคล้ำเป็นจ้ำที่แก้ม (melasma) ต้องการรักษา ยาทาที่เป็น gold standard คือ",
    choices: JSON.stringify(["Hydrocortisone cream", "Triple combination: Hydroquinone 4% + Tretinoin 0.05% + Hydrocortisone 0.01%", "Sunscreen SPF 50 เพียงอย่างเดียว", "Vitamin C serum"]),
    correct_answer: "B",
    explanation: "Triple combination cream (Kligman's formula) เป็น gold standard สำหรับ melasma treatment",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Hydrocortisone เดี่ยวไม่มีประสิทธิภาพต่อ melasma",
      B: "ถูก — Kligman's formula: Hydroquinone (bleaching) + Tretinoin (epidermal turnover) + Hydrocortisone (anti-inflammatory) เป็น first-line",
      C: "ผิด — Sunscreen สำคัญมากแต่เป็น adjunct ไม่ใช่ treatment หลัก",
      D: "ผิด — Vitamin C ช่วยได้บ้างแต่ไม่ใช่ gold standard",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 30 ปี มีเล็บเป็นเชื้อรา (Onychomycosis) ตรวจพบ Trichophyton rubrum ยา oral ที่เหมาะสมที่สุดคือ",
    choices: JSON.stringify(["Fluconazole 150 mg weekly × 12 สัปดาห์", "Terbinafine 250 mg OD × 12 สัปดาห์ (เล็บเท้า)", "Itraconazole 200 mg BID × 7 วัน/เดือน × 3 เดือน", "Griseofulvin × 1 ปี"]),
    correct_answer: "B",
    explanation: "Terbinafine oral เป็น first-line สำหรับ onychomycosis จาก dermatophyte (cure rate สูงที่สุด)",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Fluconazole ใช้ได้แต่ cure rate ต่ำกว่า Terbinafine",
      B: "ถูก — Terbinafine 250 mg OD × 6 สัปดาห์ (เล็บมือ) หรือ 12 สัปดาห์ (เล็บเท้า) — highest mycological cure rate",
      C: "ผิด — Itraconazole pulse therapy ใช้ได้แต่ second-line",
      D: "ผิด — Griseofulvin ล้าสมัย cure rate ต่ำ ต้องใช้นาน",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 20 ปี มีผื่นลมพิษ (Urticaria) เฉียบพลัน ยาที่ให้บรรเทาอาการ first-line คือ",
    choices: JSON.stringify(["Oral corticosteroid", "2nd generation antihistamine (Cetirizine/Loratadine)", "1st generation antihistamine (Chlorpheniramine)", "Epinephrine IM"]),
    correct_answer: "B",
    explanation: "Non-sedating 2nd generation antihistamine เป็น first-line สำหรับ acute urticaria",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Oral steroid ใช้เมื่อ severe หรือ angioedema ไม่ใช่ first-line ทั่วไป",
      B: "ถูก — 2nd gen H1 antihistamine (Cetirizine, Loratadine, Fexofenadine) เป็น first-line ไม่ง่วง",
      C: "ผิด — 1st gen (Chlorpheniramine) ใช้ได้แต่ง่วงมากกว่า ไม่ใช่ preferred",
      D: "ผิด — Epinephrine IM ใช้ใน anaphylaxis ไม่ใช่ mild urticaria",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 25 ปี Severe Psoriasis ทั่วตัว ใช้ Methotrexate มา 1 ปี เภสัชกรต้องติดตามผลข้างเคียงอะไรบ้าง",
    choices: JSON.stringify(["ระดับน้ำตาลในเลือด", "Liver function test + CBC + Renal function", "Serum uric acid", "Thyroid function test"]),
    correct_answer: "B",
    explanation: "MTX ผลข้างเคียงสำคัญ: hepatotoxicity, myelosuppression, nephrotoxicity → ติดตาม LFT, CBC, Cr",
    detailed_explanation: JSON.stringify({
      A: "ผิด — MTX ไม่ทำให้น้ำตาลในเลือดผิดปกติ",
      B: "ถูก — MTX monitoring: LFT (hepatotoxicity), CBC (myelosuppression — WBC, platelet), Cr/BUN (nephrotoxicity) ทุก 4-8 สัปดาห์",
      C: "ผิด — Hyperuricemia ไม่ใช่ผลข้างเคียงหลักของ MTX",
      D: "ผิด — MTX ไม่ส่งผลต่อ thyroid function",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 45 ปี Cellulitis ที่ขาซ้าย ไม่มีโรคร่วม ไม่มีไข้ ยา antibiotic oral first-line คือ",
    choices: JSON.stringify(["Ciprofloxacin", "Cephalexin (Cefalexin)", "Clindamycin", "Metronidazole"]),
    correct_answer: "B",
    explanation: "Non-purulent cellulitis: Streptococcus เป็นเชื้อหลัก → Cephalexin (1st gen cephalosporin) เป็น first-line",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Fluoroquinolone ไม่ใช่ first-line สำหรับ Streptococcal cellulitis",
      B: "ถูก — Cephalexin 500 mg QID × 5-7 วัน เป็น first-line สำหรับ non-purulent cellulitis",
      C: "ผิด — Clindamycin ใช้เมื่อแพ้ beta-lactam หรือสงสัย MRSA",
      D: "ผิด — Metronidazole ใช้กับ anaerobes ไม่ใช่ Streptococcal cellulitis",
    }),
    difficulty: "easy",
  },
];

async function seed() {
  console.log(`Seeding ${questions.length} dermatologic questions...`);
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
  console.log(`\nDone! ${questions.length} questions inserted for ผิวหนัง`);
}

seed().catch(console.error);
