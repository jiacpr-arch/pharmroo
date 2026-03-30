const { Client } = require("pg");
const { randomUUID } = require("crypto");

const SUPABASE_URL = "postgresql://postgres.xdafacvqfqkicaxfhwom:juxsu1-xawqEv-cysvug@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres";

const S = {
  renal: "557c6214-3039-4e1b-aeaf-99f55950de66",
  law: "83beabf8-abdd-4aef-a849-b0fec3d733b8",
  pk: "fe430fdf-f81b-4719-9ea9-cb7d514f47dc",
  pharmacognosy: "aad2199b-21dd-4ae6-ad09-41ac323a134f",
  biopharma: "2c02a7e8-0ee7-4c3f-afd4-5afb184043e4",
  adr: "49695e05-f84c-419b-8442-af9bbdeceb25",
  calc: "c7d84b07-f67b-40da-831d-bdc2caf07e63",
  publichealth: "64e001fd-e861-4986-bf5f-259bc363d577",
  pharmcare: "2b863220-f6d6-49d6-a426-8fff222869a1",
  dispensing: "ca25e948-542b-4e18-b3c3-ec9a4ca10b64",
  insurance: "4bc91ff4-b1c8-4d40-bdc7-d4541bec5d1f",
  pharmatech: "0a7f8e61-3786-494c-9c54-b6edc17b03b6",
};

function q(sid, scenario, choices, correct, explanation, detailed, difficulty = "medium") {
  return { subject_id: sid, scenario, choices: JSON.stringify(choices), correct_answer: correct, explanation, detailed_explanation: JSON.stringify(detailed), difficulty };
}

const allQuestions = [
  // === RENAL (เพิ่ม 10 ข้อ) ===
  q(S.renal, "ผู้ป่วย CKD stage 5 on hemodialysis มี anemia Hb 8.5 g/dL ยา ESA (Erythropoiesis-Stimulating Agent) ที่ใช้คือ", ["Ferrous sulfate เดี่ยว", "Epoetin alfa หรือ Darbepoetin alfa", "Folic acid เดี่ยว", "Vitamin B12 injection"], "B",
    "ESA เป็นหลักรักษา anemia of CKD โดยกระตุ้น erythropoiesis เป้าหมาย Hb 10-11.5 g/dL",
    { A: "ผิด — Iron เป็น adjunct ให้ร่วม แต่ไม่พอ", B: "ถูก — Epoetin alfa SC/IV 3 ครั้ง/สัปดาห์ หรือ Darbepoetin alfa ทุก 1-2 สัปดาห์ + IV iron supplement", C: "ผิด — Folic acid ไม่ใช่ primary treatment", D: "ผิด — B12 ไม่ใช่สาเหตุหลัก anemia CKD" }),
  q(S.renal, "Kidney stone ชนิด Calcium oxalate ป้องกันการเกิดซ้ำด้วยวิธีใด", ["ลดดื่มน้ำ", "ดื่มน้ำมาก ≥ 2.5 L/วัน + ลด sodium + Thiazide diuretic", "เพิ่ม Vitamin C ขนาดสูง", "เพิ่มอาหาร oxalate สูง"], "B",
    "Ca oxalate stone prevention: hydration, dietary Na restriction, Thiazide (HCTZ) ลด urinary calcium",
    { A: "ผิด — ต้องดื่มน้ำมากเพื่อ dilute urine", B: "ถูก — Fluid > 2.5 L/day + low Na diet + Thiazide (ลด Ca ในปัสสาวะ) + adequate dietary Ca (paradox: restriction ทำ oxalate ดูดซึมมากขึ้น)", C: "ผิด — Vitamin C > 1g/day เพิ่ม oxalate → เพิ่ม stone risk", D: "ผิด — ควรลด oxalate (ผักโขม ช็อกโกแลต ชา)" }),
  q(S.renal, "ผู้ป่วย AKI (Acute Kidney Injury) จาก prerenal cause สิ่งที่ต้องทำก่อนคือ", ["ให้ Furosemide IV ทันที", "แก้ไขสาเหตุ: IV fluid resuscitation", "เริ่ม hemodialysis ทันที", "ให้ Dopamine low dose"], "B",
    "Prerenal AKI (dehydration, hemorrhage, heart failure): IV fluid resuscitation เพื่อ restore renal perfusion",
    { A: "ผิด — Furosemide อาจแย่ลง ใน prerenal AKI (ขาดน้ำอยู่แล้ว)", B: "ถูก — Prerenal AKI: restore intravascular volume ด้วย IV crystalloid (NSS/LR) เป็นสิ่งแรก", C: "ผิด — Dialysis ใช้เฉพาะ indication เฉพาะ (hyperkalemia, pulmonary edema refractory)", D: "ผิด — Low-dose dopamine ไม่มี renal protective benefit (debunked)" }),
  q(S.renal, "ยา NSAIDs ทำให้ AKI ได้อย่างไร", ["กระตุ้น renin-angiotensin system", "ยับยั้ง prostaglandin → ลด renal blood flow", "เป็น nephrotoxin โดยตรง", "ทำให้ renal tubular acidosis"], "B",
    "NSAIDs inhibit COX → ลด PGE2/PGI2 → afferent arteriole vasoconstriction → ลด GFR",
    { A: "ผิด — NSAIDs ไม่กระตุ้น RAAS โดยตรง", B: "ถูก — NSAIDs inhibit prostaglandin synthesis → afferent arteriole constriction → ↓ GFR → AKI (hemodynamic mechanism)", C: "ผิด — NSAIDs-induced AKI เป็น hemodynamic ไม่ใช่ direct nephrotoxicity (ต่างจาก aminoglycoside)", D: "ผิด — RTA เกิดจากยาอื่น เช่น Amphotericin B" }),
  q(S.renal, "ผู้ป่วย ESRD on hemodialysis ยาใดต้องให้เสริมหลัง dialysis session", ["Amlodipine", "ยาที่ถูก dialysis ออก เช่น water-soluble vitamins, aminoglycosides", "Simvastatin", "Metoprolol"], "B",
    "Highly dialyzable drugs (water-soluble, low protein binding, low Vd) ต้อง supplement dose หลัง dialysis",
    { A: "ผิด — Amlodipine highly protein bound ไม่ถูก dialysis ออก", B: "ถูก — Water-soluble vitamins (B, C), Aminoglycosides, Vancomycin ต้องให้ supplemental dose post-HD", C: "ผิด — Simvastatin highly protein bound", D: "ผิด — Metoprolol partially dialyzable แต่ไม่ใช่ตัวอย่างหลัก" }),

  // === LAW (เพิ่ม 10 ข้อ) ===
  q(S.law, "ร้านขายยาแผนปัจจุบัน (ขย.1) ต้องมีเภสัชกรประจำอยู่ตลอดเวลาที่เปิดทำการ ถ้าไม่มีจะมีโทษอย่างไร", ["ตักเตือนด้วยวาจา", "ปรับไม่เกิน 1,000 บาท", "สั่งพักใช้หรือเพิกถอนใบอนุญาต", "ไม่มีโทษ"], "C",
    "ขย.1 ต้องมีเภสัชกรตลอดเวลาเปิดทำการ ฝ่าฝืนอาจถูกพักใช้/เพิกถอนใบอนุญาต",
    { A: "ผิด — มีโทษตามกฎหมาย", B: "ผิด — โทษรุนแรงกว่านั้น", C: "ถูก — ตาม พ.ร.บ. ยา: ร้าน ขย.1 ไม่มีเภสัชกร → สั่งพักใช้ใบอนุญาต หรือเพิกถอน", D: "ผิด — มีโทษ" }),
  q(S.law, "ฉลากยาตาม พ.ร.บ. ยา ต้องแสดงข้อมูลใดบ้างอย่างน้อย", ["ชื่อยา ราคา ร้านขาย", "ชื่อยา เลขทะเบียนยา ส่วนประกอบ วันผลิต วันหมดอายุ ชื่อผู้ผลิต", "ชื่อยา และวันหมดอายุ เท่านั้น", "ชื่อยาภาษาอังกฤษเท่านั้น"], "B",
    "ฉลากยาตามกฎหมาย: ชื่อยา ทะเบียนยา ส่วนประกอบ/ปริมาณ วันผลิต/หมดอายุ ชื่อผู้ผลิต วิธีใช้ คำเตือน",
    { A: "ผิด — ราคาไม่จำเป็น แต่ขาดข้อมูลสำคัญอื่น", B: "ถูก — พ.ร.บ. ยา กำหนด: ชื่อยา (ไทย+อังกฤษ), เลขทะเบียน, active ingredient, strength, วันผลิต/หมดอายุ, ผู้ผลิต, วิธีใช้, คำเตือน", C: "ผิด — ไม่ครบ", D: "ผิด — ต้องมีภาษาไทยด้วย" }),
  q(S.law, "การโฆษณายาต่อประชาชนทั่วไป ตาม พ.ร.บ. ยา ยาประเภทใดที่โฆษณาได้", ["ยาอันตราย", "ยาควบคุมพิเศษ", "ยาสามัญประจำบ้าน", "ยาเสพติดให้โทษ"], "C",
    "เฉพาะยาสามัญประจำบ้านเท่านั้นที่โฆษณาต่อประชาชนทั่วไปได้ ยาอันตรายและยาควบคุมพิเศษห้ามโฆษณา",
    { A: "ผิด — ยาอันตรายห้ามโฆษณาต่อประชาชนทั่วไป", B: "ผิด — ยาควบคุมพิเศษห้ามโฆษณา", C: "ถูก — ยาสามัญประจำบ้าน (household remedies) โฆษณาได้ ต้องขออนุญาต อย. ก่อน", D: "ผิด — ยาเสพติดห้ามโฆษณาเด็ดขาด" }),
  q(S.law, "GPP (Good Pharmacy Practice) คืออะไร", ["มาตรฐานการผลิตยา", "หลักเกณฑ์วิธีปฏิบัติทางเภสัชกรรมชุมชน", "ระบบประกันสุขภาพ", "มาตรฐาน GMP สำหรับร้านยา"], "B",
    "GPP = Good Pharmacy Practice หลักเกณฑ์การปฏิบัติที่ดีสำหรับร้านยา ครอบคลุมสถานที่ อุปกรณ์ บุคลากร การจ่ายยา",
    { A: "ผิด — การผลิตยาคือ GMP", B: "ถูก — GPP: หลักเกณฑ์วิธีปฏิบัติทางเภสัชกรรมชุมชน ครอบคลุม 5 ด้าน: สถานที่, อุปกรณ์, บุคลากร, การปฏิบัติทางเภสัชกรรม, การควบคุมคุณภาพ", C: "ผิด — ไม่ใช่ระบบประกัน", D: "ผิด — GMP คือมาตรฐานการผลิต" }),
  q(S.law, "ผู้ป่วยมาซื้อ Prednisolone (ยาอันตราย) ที่ร้านยา เภสัชกรไม่อยู่ ผู้ช่วยเภสัชกร (pharmacy technician) จ่ายยาได้หรือไม่", ["ได้ ถ้ามีใบสั่งแพทย์", "ได้ เพราะเป็นแค่ยาอันตราย", "ไม่ได้ ยาอันตรายต้องจ่ายโดยเภสัชกรเท่านั้น", "ได้ ถ้าลูกค้าเซ็นรับทราบ"], "C",
    "ยาอันตรายต้องจ่ายโดยเภสัชกร ผู้ช่วยเภสัชกรจ่ายยาอันตรายไม่ได้แม้มีใบสั่ง",
    { A: "ผิด — แม้มีใบสั่ง ผู้ช่วยฯ จ่ายยาอันตรายไม่ได้", B: "ผิด — ยาอันตรายต้องมีเภสัชกรจ่าย", C: "ถูก — ตาม พ.ร.บ. ยา: ยาอันตรายต้องจ่ายโดยเภสัชกรที่มีใบประกอบวิชาชีพ", D: "ผิด — การเซ็นรับทราบไม่ทำให้ถูกกฎหมาย" }),

  // === PK (เพิ่ม 10 ข้อ) ===
  q(S.pk, "Loading dose มีวัตถุประสงค์อะไร", ["ลดผลข้างเคียงของยา", "ให้ถึง therapeutic concentration เร็วขึ้น โดยไม่ต้องรอ steady state", "ลดขนาดยาในระยะยาว", "เพิ่ม half-life ของยา"], "B",
    "Loading dose = Vd × Cp(target) / F ใช้เพื่อให้ถึง target concentration ทันทีไม่ต้องรอ 4-5 half-lives",
    { A: "ผิด — Loading dose ไม่ลด side effects", B: "ถูก — Loading dose ให้ถึง therapeutic level ทันที สำคัญในยา long half-life เช่น Digoxin, Amiodarone, Phenytoin", C: "ผิด — ไม่เกี่ยวกับ maintenance dose", D: "ผิด — Loading dose ไม่เปลี่ยน half-life" }),
  q(S.pk, "ยาที่มี first-pass metabolism สูง (เช่น Morphine, Propranolol) หมายถึง", ["ยาถูกทำลายที่ไตก่อนเข้า systemic", "ยาถูก metabolize ที่ตับ/ลำไส้มากก่อนเข้า systemic → oral bioavailability ต่ำ", "ยาออกฤทธิ์ได้เร็วขึ้น", "ยามี half-life สั้นมาก"], "B",
    "First-pass effect: ยาถูก metabolize ที่ gut wall + ตับ ก่อนเข้า systemic circulation → oral bioavailability ลดลง",
    { A: "ผิด — First-pass เกิดที่ GI tract + ตับ ไม่ใช่ไต", B: "ถูก — High first-pass: Morphine oral F ~25%, Propranolol oral F ~25% เพราะถูก metabolize มากที่ตับ", C: "ผิด — ไม่ได้ออกฤทธิ์เร็วขึ้น ตรงข้าม ยาที่เหลือน้อยลง", D: "ผิด — First-pass ไม่เกี่ยวกับ half-life โดยตรง" }),
  q(S.pk, "ผู้ป่วยตับแข็ง (cirrhosis) ได้รับ Morphine oral ผลต่อ pharmacokinetics คือ", ["Bioavailability ลดลง", "Bioavailability เพิ่มขึ้น เพราะ first-pass metabolism ลดลง", "ไม่มีผลต่อ drug level", "Half-life สั้นลง"], "B",
    "Liver cirrhosis → hepatic blood flow ลด + hepatocyte function ลด → first-pass metabolism ลด → oral bioavailability เพิ่ม",
    { A: "ผิด — F เพิ่มไม่ใช่ลด", B: "ถูก — Cirrhosis: ↓ first-pass → ↑ oral bioavailability ของ high-extraction ratio drugs เช่น Morphine, Propranolol → ต้องลดขนาดยา", C: "ผิด — มีผลชัดเจน", D: "ผิด — Half-life ยาวขึ้น ไม่ใช่สั้นลง" }),
  q(S.pk, "Volume of distribution (Vd) สูงหมายถึงอะไร", ["ยาอยู่ในเลือดมาก", "ยากระจายไปเนื้อเยื่อมาก", "ยาถูกขับออกทางไตเร็ว", "ยาจับ albumin มาก"], "B",
    "Vd สูง = ยากระจายไปสู่ tissues/fat มาก concentration ในเลือดต่ำ เช่น Digoxin Vd ~500L, Amiodarone ~60 L/kg",
    { A: "ผิด — Vd สูง = ยาอยู่ในเลือดน้อย อยู่ในเนื้อเยื่อมาก", B: "ถูก — High Vd: ยา lipophilic กระจายไปเนื้อเยื่อ/ไขมันมาก → Vd >> total body water (เช่น Digoxin ~500 L)", C: "ผิด — Vd ไม่เกี่ยวกับ clearance โดยตรง", D: "ผิด — ยาจับ albumin มาก → Vd ต่ำ (ตรงข้าม)" }),
  q(S.pk, "Therapeutic Drug Monitoring (TDM) จำเป็นสำหรับยาใดมากที่สุด", ["Amoxicillin", "Vancomycin", "Omeprazole", "Amlodipine"], "B",
    "Vancomycin มี narrow therapeutic index + nephrotoxicity → ต้อง TDM (AUC/MIC หรือ trough monitoring)",
    { A: "ผิด — Amoxicillin wide therapeutic index ไม่ต้อง TDM", B: "ถูก — Vancomycin: narrow TI, nephro/ototoxicity → TDM (AUC target 400-600 mg·h/L); ยาอื่นที่ต้อง TDM: Phenytoin, Digoxin, Aminoglycosides, Lithium, Cyclosporine", C: "ผิด — Omeprazole wide TI", D: "ผิด — Amlodipine wide TI" }),

  // === PHARMACOGNOSY (เพิ่ม 7 ข้อ) ===
  q(S.pharmacognosy, "กระเจี๊ยบแดง (Hibiscus sabdariffa) มีฤทธิ์ทางเภสัชวิทยาที่สำคัญคือ", ["ลดน้ำตาลในเลือด", "ลดความดันโลหิต (antihypertensive)", "ลดไขมันในเลือด", "แก้ปวด"], "B",
    "Hibiscus tea มีฤทธิ์ลด BP จาก ACE-inhibitory activity และ diuretic effect",
    { A: "ผิด — ไม่มีหลักฐานชัดเจนลดน้ำตาล", B: "ถูก — Hibiscus sabdariffa: ลด systolic BP 7-10 mmHg จาก ACE inhibition + diuretic effect (หลายงานวิจัย RCT)", C: "ผิด — ผลต่อ lipid มีน้อย", D: "ผิด — ไม่มีฤทธิ์แก้ปวดชัดเจน" }),
  q(S.pharmacognosy, "บัวบก (Centella asiatica) มีสรรพคุณหลักที่มีหลักฐานทางวิทยาศาสตร์คือ", ["แก้ไอ", "ช่วยสมานแผล (wound healing)", "ลดน้ำหนัก", "ลดคอเลสเตอรอล"], "B",
    "Centella asiatica มี asiaticoside/madecassoside กระตุ้น collagen synthesis ช่วย wound healing",
    { A: "ผิด — ไม่ใช่สรรพคุณหลัก", B: "ถูก — Asiaticoside + Madecassoside กระตุ้น collagen type I synthesis → wound healing, scar reduction; ใช้ใน Madecassol cream", C: "ผิด — ไม่มีฤทธิ์ลดน้ำหนัก", D: "ผิด — ไม่มีฤทธิ์ลด cholesterol" }),
  q(S.pharmacognosy, "Ginkgo biloba มี drug interaction ที่สำคัญกับยาใด", ["Paracetamol", "Antiplatelet/Anticoagulant (Aspirin, Warfarin)", "Metformin", "Omeprazole"], "B",
    "Ginkgo มีฤทธิ์ antiplatelet → เพิ่ม bleeding risk เมื่อใช้ร่วม anticoagulant/antiplatelet",
    { A: "ผิด — ไม่มี significant interaction", B: "ถูก — Ginkgo + Aspirin/Warfarin: เพิ่ม bleeding risk; ต้องหยุดก่อนผ่าตัด ≥2 สัปดาห์", C: "ผิด — ไม่มี significant interaction", D: "ผิด — ไม่มี significant interaction" }),

  // === BIOPHARMACEUTICS (เพิ่ม 7 ข้อ) ===
  q(S.biopharma, "Bioequivalence study เปรียบเทียบอะไรระหว่าง generic กับ innovator", ["ราคา", "AUC และ Cmax (pharmacokinetic parameters)", "Clinical outcome", "Manufacturing process"], "B",
    "Bioequivalence: เปรียบเทียบ rate (Cmax, Tmax) และ extent (AUC) of absorption ระหว่าง test vs reference",
    { A: "ผิด — ราคาไม่ใช่ bioequivalence parameter", B: "ถูก — BE study: AUC0-t, AUC0-inf, Cmax ต้องอยู่ในช่วง 80-125% ของ reference product (90% CI)", C: "ผิด — Clinical outcome ไม่ใช่ BE requirement", D: "ผิด — กระบวนการผลิตเปรียบเทียบใน ANDA ไม่ใช่ BE" }),
  q(S.biopharma, "ยาที่ absorption เพิ่มขึ้นเมื่อให้กับอาหาร (food effect) เป็นเพราะอะไร", ["อาหารลด gastric acid", "อาหารเพิ่ม bile secretion ช่วยละลายยา lipophilic", "อาหารเพิ่ม gastric motility", "อาหารลด hepatic blood flow"], "B",
    "Lipophilic drugs (BCS Class II): อาหารเพิ่ม bile secretion → เพิ่ม solubility → เพิ่ม absorption",
    { A: "ผิด — อาหารกระตุ้น gastric acid ไม่ใช่ลด", B: "ถูก — Fat-containing meal → bile secretion ↑ → micelle formation → ละลาย lipophilic drug ดีขึ้น เช่น Griseofulvin, Itraconazole", C: "ผิด — อาหารลด gastric motility (ช้าลง) แต่เพิ่ม contact time", D: "ผิด — อาหารเพิ่ม hepatic blood flow ไม่ใช่ลด" }),

  // === ADR/DI (เพิ่ม 12 ข้อ) ===
  q(S.adr, "Serotonin syndrome เกิดจากการใช้ยาร่วมกันกลุ่มใด", ["SSRI + Tramadol", "ACEi + ARB", "Statin + Fibrate", "PPI + H2-blocker"], "A",
    "Serotonin syndrome: SSRI + serotonergic drugs (Tramadol, MAOi, Linezolid, St. John's Wort) → excess serotonin",
    { A: "ถูก — SSRI + Tramadol (serotonergic): clonus, agitation, hyperthermia, diaphoresis → ต้อง stop offending agent + supportive care + Cyproheptadine", B: "ผิด — ACEi + ARB → hyperkalemia, AKI ไม่ใช่ serotonin syndrome", C: "ผิด — Statin + Fibrate → rhabdomyolysis", D: "ผิด — PPI + H2-blocker → ไม่มี serotonin interaction" }),
  q(S.adr, "QT prolongation เกิดจากยาใดมากที่สุด", ["Paracetamol", "Erythromycin", "Amoxicillin", "Omeprazole"], "B",
    "Erythromycin เป็น macrolide ที่มี QT prolongation risk สูง โดยยับยั้ง hERG potassium channel",
    { A: "ผิด — Paracetamol ไม่ทำให้ QT prolongation", B: "ถูก — Erythromycin: block hERG K+ channel → QT prolongation → Torsades de Pointes; ยาอื่น: Haloperidol, Methadone, Fluoroquinolones", C: "ผิด — Amoxicillin ไม่ทำให้ QT prolongation", D: "ผิด — Omeprazole ไม่ทำให้ QT prolongation" }),
  q(S.adr, "ผู้ป่วยได้ Lithium + HCTZ (Thiazide) ร่วมกัน ADR ที่ต้องระวังคือ", ["Lithium level ลดลง", "Lithium toxicity เพราะ Thiazide ลดการขับ Lithium", "ไม่มี interaction", "HCTZ ถูก inactivate"], "B",
    "Thiazide ลด sodium reabsorption → compensatory lithium reabsorption เพิ่ม → lithium level สูง → toxicity",
    { A: "ผิด — Lithium level เพิ่ม ไม่ใช่ลด", B: "ถูก — Thiazide diuretics: ↑ Na excretion → proximal tubule ดูดกลับ Na+Li+ มากขึ้น → ↑ lithium level → toxicity (tremor, ataxia, seizure)", C: "ผิด — เป็น significant interaction", D: "ผิด — HCTZ ยังออกฤทธิ์ปกติ" }),
  q(S.adr, "Grapefruit juice มี interaction กับยาใดมากที่สุด", ["Metformin", "Felodipine", "Amoxicillin", "Paracetamol"], "B",
    "Grapefruit juice ยับยั้ง intestinal CYP3A4 → เพิ่ม bioavailability ของ CYP3A4 substrates",
    { A: "ผิด — Metformin ไม่ metabolize ผ่าน CYP3A4", B: "ถูก — Felodipine (DHP-CCB): intestinal CYP3A4 substrate → grapefruit juice ↑ Cmax 200-300% → hypotension; ยาอื่น: Simvastatin, Cyclosporine, Midazolam", C: "ผิด — Amoxicillin ไม่เกี่ยว", D: "ผิด — Paracetamol ไม่ metabolize ผ่าน CYP3A4" }),

  // === PHARM CALCULATIONS (เพิ่ม 7 ข้อ) ===
  q(S.calc, "ยา Vancomycin vial 500 mg ละลายใน NSS 100 mL drip ใน 1 ชั่วโมง อัตราการหยด (gtt/min) ที่ใช้ IV set 20 gtt/mL คือ", ["20 gtt/min", "33 gtt/min", "50 gtt/min", "100 gtt/min"], "B",
    "100 mL/60 min × 20 gtt/mL = 33.3 gtt/min ≈ 33 gtt/min",
    { A: "ผิด — คำนวณผิด", B: "ถูก — Rate = (Volume × Drop factor) / Time = (100 × 20) / 60 = 33.3 gtt/min", C: "ผิด — คำนวณผิด", D: "ผิด — คำนวณผิด" }, "easy"),
  q(S.calc, "ผู้ป่วยน้ำหนัก 70 kg ต้องการ Dopamine 5 mcg/kg/min ถ้า Dopamine 200 mg ใน D5W 250 mL อัตรา infusion (mL/hr) คือ", ["2.6 mL/hr", "5.25 mL/hr", "13.1 mL/hr", "26.3 mL/hr"], "D",
    "Dose = 5 × 70 = 350 mcg/min = 21,000 mcg/hr = 21 mg/hr; Conc = 200/250 = 0.8 mg/mL; Rate = 21/0.8 = 26.3 mL/hr",
    { A: "ผิด — คำนวณผิด", B: "ผิด — คำนวณผิด", C: "ผิด — คำนวณผิด", D: "ถูก — 5 mcg/kg/min × 70 kg = 350 mcg/min × 60 = 21,000 mcg/hr = 21 mg/hr ÷ 0.8 mg/mL = 26.25 mL/hr" }, "hard"),

  // === PUBLIC HEALTH (เพิ่ม 8 ข้อ) ===
  q(S.publichealth, "RDU (Rational Drug Use) หมายถึงอะไร", ["การใช้ยาราคาถูกที่สุด", "การใช้ยาถูกคน ถูกโรค ถูกขนาด ถูกเวลา ถูกวิธี", "การใช้ยาแผนโบราณเท่านั้น", "การใช้ยาตามโฆษณา"], "B",
    "RDU: Right patient, Right drug, Right dose, Right route, Right time + right monitoring",
    { A: "ผิด — ราคาถูกไม่ใช่ criteria หลัก", B: "ถูก — Rational Drug Use (WHO): ผู้ป่วยได้ยาที่เหมาะสม ขนาดถูกต้อง ระยะเวลาเพียงพอ ราคาที่เหมาะสม", C: "ผิด — ไม่ได้หมายถึงเฉพาะยาแผนโบราณ", D: "ผิด — โฆษณาไม่ใช่แหล่งข้อมูลที่น่าเชื่อถือ" }, "easy"),
  q(S.publichealth, "National List of Essential Medicines (NLEM) ของไทยจัดยาเป็นกี่บัญชี", ["3 บัญชี", "5 บัญชี (ก ข ค ง จ)", "7 บัญชี", "10 บัญชี"], "B",
    "NLEM ไทยแบ่ง 5 บัญชี: ก (ยาพื้นฐาน), ข (ยาที่ต้องใช้โดยความชำนาญ), ค (ยาสำหรับโรคเฉพาะ), ง (ยาต้านจุลชีพ), จ (ยาที่ต้องอนุมัติ)",
    { A: "ผิด — มีมากกว่า 3", B: "ถูก — 5 บัญชี: ก ข ค ง จ ตามระดับความจำเป็นและความชำนาญในการใช้", C: "ผิด — 7 มากเกิน", D: "ผิด — 10 มากเกิน" }),

  // === DISPENSING (เพิ่ม 8 ข้อ) ===
  q(S.dispensing, "ผู้ป่วยมารับยา Metformin 500 mg BID เภสัชกรต้องให้คำแนะนำว่า", ["รับประทานก่อนอาหาร", "รับประทานพร้อมอาหาร หรือ หลังอาหารทันที เพื่อลดอาการ GI", "รับประทานก่อนนอน", "เคี้ยวก่อนกลืน"], "B",
    "Metformin ให้รับประทานพร้อมหรือหลังอาหาร เพื่อลด GI side effects (คลื่นไส้ ท้องเสีย)",
    { A: "ผิด — ก่อนอาหาร GI side effects มากขึ้น", B: "ถูก — Metformin + food: ลด GI side effects (nausea, diarrhea, abdominal discomfort) เริ่มขนาดต่ำแล้ว titrate up", C: "ผิด — ไม่ต้องก่อนนอน", D: "ผิด — กลืนทั้งเม็ด" }),
  q(S.dispensing, "ผู้ป่วยใช้ Nitroglycerin sublingual มาขอซื้อเพิ่ม เภสัชกรต้องแนะนำอะไร", ["เก็บในกล่องพลาสติก", "เก็บในขวดแก้วสีชา ปิดสนิท หลีกเลี่ยงแสง/ความร้อน ใช้ภายใน 6 เดือนหลังเปิด", "แช่ตู้เย็น", "เก็บรวมกับยาอื่น"], "B",
    "NTG sublingual: ไม่เสถียร ต้องเก็บในขวดแก้วสีชา ปิดสนิท ห่างแสง/ความร้อน/ความชื้น",
    { A: "ผิด — พลาสติกดูดซับ NTG ทำให้ยาลดประสิทธิภาพ", B: "ถูก — NTG SL: ขวดแก้วสีชา, ปิดสนิท, อุณหภูมิห้อง, ใช้ภายใน 6 เดือนหลังเปิด, ทิ้ง cotton filler ออก", C: "ผิด — ไม่ต้องแช่ตู้เย็น", D: "ผิด — ห้ามเก็บรวมยาอื่น (cross-contamination)" }),
  q(S.dispensing, "ผู้ป่วยได้ยาหยอดตา 2 ชนิด เภสัชกรแนะนำว่า", ["หยอดพร้อมกันได้เลย", "หยอดห่างกัน 5-10 นาที", "หยอดตัวเดียวก็พอ", "หยอดห่างกัน 1 ชั่วโมง"], "B",
    "ยาหยอดตาหลายชนิด: ห่างกัน 5-10 นาที เพื่อให้ยาแรกดูดซึมก่อน ไม่ถูกล้างออก",
    { A: "ผิด — หยอดพร้อมกัน ยาล้างกันออก", B: "ถูก — 5-10 นาทีระหว่างแต่ละยา; ถ้ามี suspension ให้หยอดหลังสุด; ointment หยอดหลัง solution", C: "ผิด — ต้องใช้ทั้งสองตัว", D: "ผิด — 1 ชั่วโมงนานเกินไป" }, "easy"),

  // === INSURANCE (เพิ่ม 3 ข้อ) ===
  q(S.insurance, "สิทธิ์สวัสดิการข้าราชการ ครอบคลุมถึงใครบ้าง", ["เฉพาะข้าราชการเท่านั้น", "ข้าราชการ + บิดามารดา + คู่สมรส + บุตรที่ยังไม่บรรลุนิติภาวะ (ไม่เกิน 3 คน)", "ข้าราชการ + ญาติทุกคน", "เฉพาะข้าราชการที่เกษียณแล้ว"], "B",
    "สิทธิ์ข้าราชการ: ตัวข้าราชการ + บิดามารดา + คู่สมรส + บุตรชอบด้วยกฎหมาย (ไม่เกิน 3 คน ยังไม่บรรลุนิติภาวะ)",
    { A: "ผิด — ครอบคลุมครอบครัวด้วย", B: "ถูก — สิทธิ์ข้าราชการ: ตนเอง + บิดามารดา + คู่สมรส + บุตร (≤3 คน ยังไม่บรรลุนิติภาวะ) ดูแลโดยกรมบัญชีกลาง", C: "ผิด — ไม่ครอบคลุมญาติทุกคน", D: "ผิด — ครอบคลุมทั้งที่ยังรับราชการอยู่และเกษียณแล้ว" }),
];

async function seed() {
  const client = new Client({ connectionString: SUPABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("Connected! Seeding", allQuestions.length, "questions (batch 2)...\n");

  let count = 0;
  for (const q of allQuestions) {
    const id = randomUUID();
    await client.query(
      `INSERT INTO mcq_questions (id, subject_id, exam_type, scenario, choices, correct_answer, explanation, detailed_explanation, difficulty, status)
       VALUES ($1, $2, 'PLE-CC1', $3, $4, $5, $6, $7, $8, 'active')`,
      [id, q.subject_id, q.scenario, q.choices, q.correct_answer, q.explanation, q.detailed_explanation, q.difficulty]
    );
    count++;
    if (count % 10 === 0) process.stdout.write(`  ${count}/${allQuestions.length}\r`);
  }

  console.log(`\n✅ Inserted ${count} questions!`);

  const r = await client.query(`SELECT s.name_th, COUNT(q.id) as count FROM mcq_subjects s LEFT JOIN mcq_questions q ON q.subject_id = s.id GROUP BY s.id, s.name_th ORDER BY count DESC`);
  console.log("\n=== Final Question Counts ===");
  let total = 0;
  for (const row of r.rows) {
    console.log(`  ${row.name_th}: ${row.count}`);
    total += Number(row.count);
  }
  console.log(`\n  TOTAL: ${total}`);
  await client.end();
}

seed().catch(console.error);
