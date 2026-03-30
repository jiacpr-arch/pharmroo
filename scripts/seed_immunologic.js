const { createClient } = require("@libsql/client");
const { randomUUID } = require("crypto");

require("dotenv").config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const SUBJECT_ID = "ccb73060-b09f-4927-8ff8-53190db76d18"; // การแพ้และภูมิคุ้มกัน

const questions = [
  {
    scenario: "ผู้ป่วยชายอายุ 30 ปี เกิด Anaphylaxis ทันทีหลังฉีด Penicillin G เริ่มมีลมพิษ หายใจลำบาก ความดันต่ำ ยาที่ต้องให้ทันทีก่อนอื่นคือ",
    choices: JSON.stringify(["Diphenhydramine IV", "Hydrocortisone IV", "Epinephrine 1:1000 IM 0.3-0.5 mg", "Salbutamol nebulizer"]),
    correct_answer: "C",
    explanation: "Epinephrine IM เป็น first-line และ life-saving treatment ใน anaphylaxis ต้องให้ทันที",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Antihistamine (Diphenhydramine) เป็น adjunct ช้าเกินสำหรับ anaphylaxis ไม่ควรให้ก่อน epinephrine",
      B: "ผิด — Corticosteroid ออกฤทธิ์ช้า (1-6 ชม.) ไม่ใช่ first-line",
      C: "ถูก — Epinephrine 1:1000 IM 0.3-0.5 mg (anterolateral thigh) เป็น first-line ทันที ลด bronchospasm, vasodilation, angioedema",
      D: "ผิด — Salbutamol nebulizer เป็น adjunct สำหรับ bronchospasm ไม่ใช่ first-line",
    }),
    difficulty: "easy",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 25 ปี แพ้ Penicillin (ประวัติ anaphylaxis) ต้องใช้ antibiotic รักษา community-acquired pneumonia ควรใช้ยาใด",
    choices: JSON.stringify(["Amoxicillin (beta-lactam อื่น)", "Cefuroxime (cephalosporin)", "Azithromycin หรือ Doxycycline", "Ampicillin-sulbactam"]),
    correct_answer: "C",
    explanation: "ประวัติ severe Penicillin allergy (anaphylaxis): ควรหลีกเลี่ยง beta-lactam ทั้งหมดในกรณี severe; Azithromycin/Doxycycline ปลอดภัย",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Amoxicillin เป็น aminopenicillin ห้ามใช้เด็ดขาด",
      B: "ผิด — Cephalosporin มี cross-reactivity กับ Penicillin ~2% ระวังใน severe allergy",
      C: "ถูก — Macrolide (Azithromycin) หรือ Tetracycline (Doxycycline) ปลอดภัยสำหรับ Penicillin-allergic patients",
      D: "ผิด — Ampicillin-sulbactam ยังเป็น beta-lactam ห้ามใช้",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 35 ปี HIV positive CD4 count 150 cells/mm³ ควรได้รับ prophylaxis ยาใดป้องกัน Pneumocystis pneumonia (PCP)",
    choices: JSON.stringify(["Fluconazole 200 mg OD", "TMP-SMX (Cotrimoxazole) DS OD", "Azithromycin 1250 mg weekly", "Isoniazid 300 mg OD"]),
    correct_answer: "B",
    explanation: "PCP prophylaxis: TMP-SMX (Cotrimoxazole) เป็น first-line เมื่อ CD4 < 200 cells/mm³",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Fluconazole ป้องกัน Cryptococcus/Candida ไม่ใช่ PCP",
      B: "ถูก — TMP-SMX DS OD เป็น first-line PCP prophylaxis เมื่อ CD4 < 200 (และ primary prophylaxis เริ่มที่ CD4 < 200)",
      C: "ผิด — Azithromycin ป้องกัน MAC (Mycobacterium avium complex) เมื่อ CD4 < 50",
      D: "ผิด — INH ป้องกัน TB (LTBI) ไม่ใช่ PCP",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 28 ปี HIV positive เพิ่งเริ่ม ARV (Antiretroviral therapy) มาใช้ Efavirenz + Tenofovir + Emtricitabine (TDF/FTC/EFV) เภสัชกรแนะนำว่าควรรับประทาน EFV ตอนใด",
    choices: JSON.stringify(["ก่อนอาหาร 30 นาที", "กับอาหารมัน (fatty meal)", "ก่อนนอน บนท้องว่าง", "กับนม"]),
    correct_answer: "C",
    explanation: "Efavirenz แนะนำให้รับประทานก่อนนอน บนท้องว่าง เพื่อลด CNS side effects (ฝัน วิงเวียน) ที่มักเกิดช่วงกลางคืน",
    detailed_explanation: JSON.stringify({
      A: "ผิด — การกินก่อนอาหาร 30 นาทีไม่ใช่คำแนะนำสำหรับ EFV",
      B: "ผิด — อาหารมัน (high-fat meal) เพิ่ม EFV absorption ถึง 50% เพิ่ม CNS toxicity",
      C: "ถูก — EFV ก่อนนอน บนท้องว่าง: ลด AUC เล็กน้อย แต่ CNS effects (ฝันผวา, วิงเวียน) เกิดขณะนอนหลับไม่รบกวนกิจวัตร",
      D: "ผิด — นมไม่มีผลพิเศษ แต่อาหารมันควรหลีกเลี่ยง",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 40 ปี Kidney transplant รับ Cyclosporine เป็น immunosuppressant มีอาการ gum hyperplasia ผลข้างเคียงนี้เกิดจากอะไร",
    choices: JSON.stringify(["Tacrolimus", "Cyclosporine", "Mycophenolate mofetil", "Prednisolone"]),
    correct_answer: "B",
    explanation: "Gingival hyperplasia เป็น adverse effect เฉพาะของ Cyclosporine (Calcineurin inhibitor)",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Tacrolimus (FK506) ไม่ทำให้ gingival hyperplasia (ข้อดีกว่า CsA)",
      B: "ถูก — Cyclosporine: gingival hyperplasia, nephrotoxicity, hypertension, hirsutism เป็น classic AEs",
      C: "ผิด — MMF ผลข้างเคียงหลัก GI (nausea, diarrhea), myelosuppression",
      D: "ผิด — Corticosteroid ทำให้ moon face, DM, osteoporosis ไม่ทำให้ gum hyperplasia",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 33 ปี ผู้บริจาคไต (renal transplant) ได้รับ Tacrolimus เภสัชกรต้องติดตาม drug level ใด",
    choices: JSON.stringify(["Peak level (2 ชม. หลังกิน)", "Trough level (ก่อนกินยาเช้า)", "Random level", "Area under curve (AUC)"]),
    correct_answer: "B",
    explanation: "Tacrolimus monitoring ใช้ trough level (C0) เก็บตัวอย่างก่อนกินยาเช้า เป้าหมายขึ้นกับช่วงหลัง transplant",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Peak level ไม่ใช่ standard monitoring parameter สำหรับ Tacrolimus",
      B: "ถูก — Trough level (C0) ก่อนกินยาเช้า เป็น standard monitoring; target: early post-transplant 8-12 ng/mL, maintenance 5-8 ng/mL",
      C: "ผิด — Random level ไม่น่าเชื่อถือ",
      D: "ผิด — AUC ใช้ใน research ไม่ใช่ routine clinical monitoring",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 50 ปี ได้รับ Tacrolimus หลัง renal transplant 1 ปี เภสัชกรตรวจสอบรายการยา พบว่าผู้ป่วยเพิ่งเริ่มกิน Fluconazole สำหรับ oral candidiasis Drug interaction ที่ต้องระวังคือ",
    choices: JSON.stringify(["Fluconazole ลดระดับ Tacrolimus", "Fluconazole เพิ่มระดับ Tacrolimus (CYP3A4 inhibitor)", "ไม่มี interaction ที่สำคัญ", "Tacrolimus ลดฤทธิ์ Fluconazole"]),
    correct_answer: "B",
    explanation: "Fluconazole เป็น CYP3A4/CYP2C19 inhibitor → ลดการ metabolize Tacrolimus → Tacrolimus level เพิ่มสูงขึ้น",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Fluconazole ยับยั้ง ไม่ใช่เพิ่ม CYP3A4 metabolism",
      B: "ถูก — Fluconazole inhibit CYP3A4 → Tacrolimus ไม่ถูก metabolize → blood level สูงขึ้น → ต้องลดขนาด Tacrolimus และ monitor level อย่างใกล้ชิด",
      C: "ผิด — เป็น significant interaction ที่ต้องจัดการ",
      D: "ผิด — Tacrolimus ไม่ inhibit Fluconazole metabolism",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 27 ปี มีอาการแพ้ยา Sulfonamide (TMP-SMX) เช่น ผื่น ควรระวังการใช้ยาใดต่อไปนี้",
    choices: JSON.stringify(["Amoxicillin", "Furosemide (loop diuretic)", "Paracetamol", "Metformin"]),
    correct_answer: "B",
    explanation: "Furosemide มีโครงสร้าง sulfonamide moiety อาจเกิด cross-reactivity ในผู้แพ้ sulfonamide",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Amoxicillin ไม่มี cross-reactivity กับ sulfonamide",
      B: "ถูก — Furosemide, Thiazides, Celecoxib, Sulfonylureas มี sulfonamide group อาจ cross-react แต่ความเสี่ยงต่ำ ควรระวังและติดตาม",
      C: "ผิด — Paracetamol ไม่มี sulfonamide structure",
      D: "ผิด — Metformin ไม่มี sulfonamide structure",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 45 ปี RA ได้รับ Anti-TNF biologic (Adalimumab) แพทย์ต้องตรวจคัดกรองอะไรก่อนเริ่มยา",
    choices: JSON.stringify(["HbA1c", "Tuberculosis screening (TST หรือ IGRA)", "Uric acid level", "Thyroid function test"]),
    correct_answer: "B",
    explanation: "Anti-TNF therapy กระตุ้น reactivation ของ latent TB จึงต้องคัดกรอง TB ทุก patient ก่อนเริ่ม",
    detailed_explanation: JSON.stringify({
      A: "ผิด — HbA1c ไม่ใช่ prerequisite ก่อน anti-TNF",
      B: "ถูก — TB screening (TST/IGRA + CXR) บังคับก่อนเริ่ม anti-TNF เพราะ TNF สำคัญในการ contain granuloma; ถ้า LTBI ต้องรักษาก่อน",
      C: "ผิด — Uric acid ไม่เกี่ยวข้อง",
      D: "ผิด — Thyroid function ไม่ใช่ prerequisite",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 30 ปี วินิจฉัย SLE ที่มี lupus nephritis (LN) class III เพิ่งตรวจ renal biopsy ยาที่ใช้เป็น induction therapy คือ",
    choices: JSON.stringify(["Hydroxychloroquine เดี่ยว", "Prednisolone + Mycophenolate mofetil (MMF)", "Prednisolone + Methotrexate", "Azathioprine เดี่ยว"]),
    correct_answer: "B",
    explanation: "Lupus nephritis class III/IV: high-dose prednisolone + MMF เป็น standard induction therapy (ACR/EULAR 2023)",
    detailed_explanation: JSON.stringify({
      A: "ผิด — HCQ เดี่ยวไม่เพียงพอสำหรับ LN",
      B: "ถูก — Prednisolone 1 mg/kg/day + MMF 2-3 g/day หรือ IV Cyclophosphamide เป็น induction therapy LN class III/IV",
      C: "ผิด — MTX ไม่ใช้ใน LN (มีข้อห้ามใน renal impairment)",
      D: "ผิด — Azathioprine เป็น maintenance therapy ไม่ใช่ induction",
    }),
    difficulty: "hard",
  },
  {
    scenario: "เด็กชายอายุ 8 ปี ได้รับ MMR vaccine แล้วมีไข้ 38.5°C หลังฉีด 2-3 สัปดาห์ ผู้ปกครองกังวล ควรอธิบายว่า",
    choices: JSON.stringify(["เด็กติดเชื้อหัดจาก vaccine", "เป็น normal vaccine reaction สำหรับ live attenuated vaccine", "ต้องหยุด vaccine ทันที", "ต้องให้ corticosteroid รักษา"]),
    correct_answer: "B",
    explanation: "MMR เป็น live attenuated vaccine อาจเกิด mild fever + rash 7-21 วันหลังฉีด เป็น normal immune response",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Vaccine strain ไม่ทำให้เกิดโรคจริง attenuated จนไม่รุนแรง",
      B: "ถูก — Mild fever 38-39°C + rash หลัง MMR 7-21 วัน เป็น expected reaction ของ live attenuated vaccine บอก parents ให้ Paracetamol ตามอาการ",
      C: "ผิด — ไม่ต้องหยุด vaccine series",
      D: "ผิด — Corticosteroid ไม่จำเป็น และอาจ suppress immune response",
    }),
    difficulty: "medium",
  },
  {
    scenario: "ผู้ป่วยหญิงอายุ 24 ปี ตั้งครรภ์ 20 สัปดาห์ มีประวัติสัมผัส chicken pox (varicella) เมื่อ 72 ชั่วโมงก่อน ไม่มีประวัติ varicella ควรให้อะไร",
    choices: JSON.stringify(["Varicella vaccine ทันที", "Varicella-Zoster Immune Globulin (VZIG)", "Acyclovir prophylaxis", "ไม่จำเป็นต้องรักษา"]),
    correct_answer: "B",
    explanation: "หญิงตั้งครรภ์ที่สัมผัส varicella ภายใน 96 ชั่วโมง: VZIG เพื่อ passive immunization ป้องกัน severe varicella",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Live vaccine ห้ามใช้ในตั้งครรภ์",
      B: "ถูก — VZIG ภายใน 96 ชั่วโมงหลังสัมผัส ป้องกัน/ลด severity ของ varicella ใน seronegative pregnant women",
      C: "ผิด — Acyclovir prophylaxis ไม่แนะนำเป็น post-exposure prophylaxis ในตั้งครรภ์",
      D: "ผิด — ตั้งครรภ์ที่เป็น varicella มีความเสี่ยง maternal (pneumonia) และ fetal (congenital varicella syndrome)",
    }),
    difficulty: "hard",
  },
  {
    scenario: "ผู้ป่วยชายอายุ 62 ปี ได้รับ Rituximab (Anti-CD20) สำหรับ NHL มา 6 เดือน มาพบเภสัชกรพร้อมรายการยา ผลข้างเคียงที่ต้องระวังพิเศษจาก Rituximab คือ",
    choices: JSON.stringify(["Hyperglycemia", "Hepatitis B reactivation", "Pulmonary fibrosis", "Agranulocytosis"]),
    correct_answer: "B",
    explanation: "Rituximab (anti-CD20) กดภูมิคุ้มกัน B cell → HBV reactivation เป็น serious complication ต้องคัดกรอง HBsAg/anti-HBc ก่อนใช้",
    detailed_explanation: JSON.stringify({
      A: "ผิด — Hyperglycemia ไม่ใช่ผลข้างเคียงหลักของ Rituximab",
      B: "ถูก — HBV reactivation เป็น black box warning ของ Rituximab ต้องตรวจ HBsAg, anti-HBc; ถ้า positive ต้องให้ antiviral prophylaxis (Entecavir/Tenofovir)",
      C: "ผิด — Pulmonary fibrosis เกิดจาก Bleomycin ไม่ใช่ Rituximab",
      D: "ผิด — Agranulocytosis เกิดจาก Clozapine, Carbimazole ไม่ใช่ Rituximab",
    }),
    difficulty: "hard",
  },
];

async function seed() {
  console.log(`Seeding ${questions.length} immunologic questions...`);
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
  console.log(`\nDone! ${questions.length} questions inserted for การแพ้และภูมิคุ้มกัน`);
}

seed().catch(console.error);
