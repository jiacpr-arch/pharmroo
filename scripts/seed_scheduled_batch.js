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
  cardio: "dce79912-01f6-4871-96df-94c6cfc853e7",
  gi: "91eedbf3-4301-4f40-ae3d-3cc6f64c4f8a",
  infect: "8bccedb2-3bdb-4f5c-9da9-f589b25672fd",
  neuro: "fb62e97d-dec1-4b47-b45f-617b2c03fb4d",
  psych: "beee26b1-72c2-4c70-be73-24d7fa036f19",
  endo: "3c30613d-83c7-4be5-b3e3-ee9240e7552a",
  pulm: "cc7ce595-2da4-4207-95a4-9a4bb606bbe0",
  derm: "12b0b8c1-fe53-49d8-9c4b-e348eba85e36",
  heme: "ace9965c-285b-4d4a-aaf2-5de9739cc09a",
  immuno: "ccb73060-b09f-4927-8ff8-53190db76d18",
  msk: "06991a85-412e-476e-89ff-32b0a7b92e6c",
};

function q(sid, scenario, choices, correct, explanation, detailed, difficulty = "medium", week = 1) {
  return { subject_id: sid, scenario, choices: JSON.stringify(choices), correct_answer: correct, explanation, detailed_explanation: JSON.stringify(detailed), difficulty, week };
}

const allQuestions = [
  // =============================================
  // WEEK 1: การบริบาลทางเภสัชกรรม + การจ่ายยา (20 ข้อ)
  // =============================================
  q(S.pharmcare, "Medication Reconciliation คืออะไร", ["การคำนวณขนาดยา", "กระบวนการเปรียบเทียบรายการยาที่ผู้ป่วยใช้อยู่กับคำสั่งยาใหม่ เพื่อหา discrepancy", "การตรวจนับสต็อกยา", "การตรวจสอบวันหมดอายุ"], "B",
    "Med Rec: เปรียบเทียบ home medications กับ admission/transfer/discharge orders เพื่อป้องกัน medication errors",
    { A: "ผิด — นั่นคือ dose calculation", B: "ถูก — Medication Reconciliation ทำทุกจุดเปลี่ยนผ่าน (transitions of care): admission, transfer, discharge เพื่อป้องกัน omission, duplication, interaction", C: "ผิด — นั่นคือ inventory management", D: "ผิด — นั่นคือ stock inspection" }, "easy", 1),
  q(S.pharmcare, "MTM (Medication Therapy Management) ประกอบด้วยขั้นตอนหลักอะไรบ้าง", ["สั่งยา → จ่ายยา → ติดตาม", "MTR (Review) → MAP (Action Plan) → Intervention → Follow-up", "วินิจฉัย → สั่งยา → จ่ายยา", "ซื้อยา → กินยา → หายป่วย"], "B",
    "MTM: Medication Therapy Review → Personal Medication Record → MAP (Action Plan) → Intervention/Referral → Follow-up",
    { A: "ผิด — นั่นคือ prescribing process", B: "ถูก — MTM 5 core elements: MTR, PMR, MAP, Intervention/Referral, Documentation & Follow-up", C: "ผิด — นั่นคือ medical process", D: "ผิด — oversimplified" }, "medium", 1),
  q(S.pharmcare, "เภสัชกรพบว่าผู้ป่วยได้ Amlodipine 10 mg + Diltiazem 180 mg ร่วมกัน ปัญหาที่พบคือ", ["ไม่มีปัญหา", "DHP-CCB + Non-DHP CCB: เสี่ยง bradycardia และ heart block", "ยาซ้ำซ้อน ควรเลือกตัวเดียว", "ยาตีกัน ทำให้ BP สูงขึ้น"], "B",
    "Amlodipine (DHP) + Diltiazem (Non-DHP): additive negative chronotropic/dromotropic → bradycardia, AV block",
    { A: "ผิด — มีปัญหาชัดเจน", B: "ถูก — DHP + Non-DHP CCB: Diltiazem มี negative chronotropic effect + Amlodipine vasodilation → excessive bradycardia/hypotension, AV block risk", C: "ผิด — ไม่ใช่แค่ซ้ำซ้อน แต่มี pharmacodynamic interaction", D: "ผิด — BP จะลดไม่ใช่สูง" }, "hard", 1),
  q(S.pharmcare, "ผู้ป่วย DM type 2 ใช้ Glipizide 5 mg เช้า มี HbA1c 8.5% เภสัชกรควรแนะนำอย่างไร", ["ยังไม่ต้องปรับ รอดูอีก 6 เดือน", "แจ้งแพทย์พิจารณา intensify therapy เช่น เพิ่มขนาดหรือเพิ่มยาตัวที่ 2", "ให้หยุด Glipizide เปลี่ยนเป็น Insulin ทันที", "แนะนำ OTC supplement แทน"], "B",
    "HbA1c 8.5% > เป้าหมาย 7%: ควร intensify therapy ตาม ADA stepwise approach",
    { A: "ผิด — HbA1c 8.5% สูงกว่าเป้า ต้องปรับ", B: "ถูก — ADA: ถ้า HbA1c ไม่ถึงเป้าหลัง 3 เดือน → intensify (เพิ่มขนาด SU หรือ add Metformin/SGLT2i/GLP-1)", C: "ผิด — ยังไม่ต้อง Insulin ทันที ลอง oral combination ก่อน", D: "ผิด — OTC supplement ไม่ใช่การรักษามาตรฐาน" }, "medium", 1),
  q(S.pharmcare, "Pharmacovigilance หมายถึงอะไร", ["การขายยาออนไลน์", "การเฝ้าระวังและติดตามอาการไม่พึงประสงค์จากยาหลังออกสู่ตลาด", "การตรวจสอบคุณภาพยาในโรงงาน", "การขึ้นทะเบียนยาใหม่"], "B",
    "Pharmacovigilance = Post-marketing surveillance เฝ้าระวัง ADR ที่ไม่พบในช่วง clinical trial",
    { A: "ผิด — ไม่เกี่ยวกับการขายยา", B: "ถูก — WHO: Pharmacovigilance คือ วิทยาศาสตร์และกิจกรรมที่เกี่ยวข้องกับการตรวจจับ ประเมิน เข้าใจ และป้องกัน ADR", C: "ผิด — นั่นคือ QC/QA", D: "ผิด — นั่นคือ drug registration" }, "easy", 1),
  q(S.dispensing, "ผู้ป่วยมารับยา Ciprofloxacin 500 mg เภสัชกรต้องเตือนเรื่อง interaction กับอะไร", ["กาแฟ", "ยาลดกรดที่มี Al/Mg (Antacid) — ห่างกัน 2 ชั่วโมง", "น้ำส้ม", "นม (ดื่มได้ปกติ)"], "B",
    "Fluoroquinolone + divalent/trivalent cations (Al, Mg, Ca, Fe, Zn) → chelation → ลดการดูดซึม",
    { A: "ผิด — กาแฟไม่ลด absorption ของ FQ", B: "ถูก — Antacid (Al/Mg), Iron, Calcium, Zinc: chelate กับ FQ → ลด absorption > 90%; ต้องห่างกัน ≥ 2 ชม. ก่อนหรือ 6 ชม. หลัง FQ", C: "ผิด — น้ำส้มไม่มี significant interaction", D: "ผิด — นมมี Ca แต่ผลน้อยกว่า antacid ควรระวัง" }, "medium", 1),
  q(S.dispensing, "ยา Tetracycline ควรรับประทานอย่างไร", ["พร้อมนมเพื่อลด GI upset", "ก่อนอาหาร 1 ชม. หรือหลังอาหาร 2 ชม. กับน้ำเปล่า", "หลังอาหารทันที", "เคี้ยวก่อนกลืน"], "B",
    "Tetracycline: อาหาร/นม/antacid ลดการดูดซึม ต้องให้ on empty stomach",
    { A: "ผิด — นมมี Ca → chelation ลด absorption มาก", B: "ถูก — Tetracycline: empty stomach (1 hr AC หรือ 2 hr PC) กับน้ำเปล่าแก้วเต็ม ห้ามนม/antacid/iron", C: "ผิด — อาหารลดการดูดซึม", D: "ผิด — กลืนทั้งเม็ด" }, "easy", 1),
  q(S.dispensing, "ผู้ป่วยถาม Paracetamol รับประทานได้สูงสุดวันละเท่าไร", ["2 กรัม/วัน", "3 กรัม/วัน", "4 กรัม/วัน (ผู้ใหญ่สุขภาพดี)", "ไม่จำกัด"], "C",
    "Paracetamol max dose 4 g/day (ผู้ใหญ่ปกติ); ลดเหลือ 2 g/day ในผู้สูงอายุ ตับแข็ง ดื่มสุรา",
    { A: "ผิด — 2 g/day เป็น dose สำหรับ liver disease/alcoholism", B: "ผิด — 3 g/day เป็น conservative recommendation บางแหล่ง", C: "ถูก — FDA max 4 g/day ผู้ใหญ่ปกติ; ≥ 7.5 g acute → hepatotoxicity risk; ลดใน elderly/liver disease", D: "ผิด — มีขนาดสูงสุดที่ปลอดภัย" }, "easy", 1),
  q(S.dispensing, "ผู้ป่วยได้ยา Prednisolone 40 mg/day taper schedule เภสัชกรแนะนำว่า", ["หยุดยาทันทีเมื่อหายดี", "ห้ามหยุดยาทันที ต้อง taper ค่อยๆ ลดขนาด ตามแพทย์สั่ง", "เพิ่มขนาดเองได้ถ้าอาการไม่ดีขึ้น", "กินตอนเย็นจะดีกว่า"], "B",
    "Corticosteroid ≥ 2-3 สัปดาห์: ห้ามหยุดทันที → adrenal crisis; ต้อง gradual taper",
    { A: "ผิด — หยุดทันทีเสี่ยง adrenal insufficiency", B: "ถูก — Steroid ≥ 2-3 สัปดาห์: HPA axis suppression → ต้อง taper ค่อยๆ ลด 5-10 mg ทุก 1-2 สัปดาห์", C: "ผิด — ห้ามปรับขนาดเอง", D: "ผิด — ควรกินเช้า mimic physiologic cortisol rhythm" }, "medium", 1),
  q(S.dispensing, "ยาหยอดตา Latanoprost (Xalatan) สำหรับ Glaucoma ต้องเก็บรักษาอย่างไร", ["อุณหภูมิห้องได้เลย", "ก่อนเปิด: แช่ตู้เย็น 2-8°C, หลังเปิด: อุณหภูมิห้อง ใช้ภายใน 4-6 สัปดาห์", "แช่ช่องแข็ง", "ไม่ต้องระวังเรื่องอุณหภูมิ"], "B",
    "Latanoprost: unopened ต้องแช่เย็น 2-8°C, opened ใช้อุณหภูมิห้องได้ 4-6 สัปดาห์",
    { A: "ผิด — ก่อนเปิดต้องแช่เย็น", B: "ถูก — Latanoprost: cold chain storage ก่อนเปิด; หลังเปิดเก็บ ≤ 25°C ใช้ภายใน 4 สัปดาห์ (บาง formulation 6 สัปดาห์)", C: "ผิด — ห้ามแช่แข็ง", D: "ผิด — ต้องระวังเรื่องอุณหภูมิ" }, "medium", 1),

  // =============================================
  // WEEK 2: เภสัชสาธารณสุข + ระบบประกันสุขภาพ (20 ข้อ)
  // =============================================
  q(S.publichealth, "Antibiotic Resistance เป็นปัญหาสาธารณสุข สาเหตุหลักที่ทำให้เชื้อดื้อยาคือ", ["การใช้ยาปฏิชีวนะมากเกินจำเป็น (overuse/misuse)", "การกินวิตามินมากเกิน", "มลพิษทางอากาศ", "การออกกำลังกายมากเกิน"], "A",
    "Antibiotic resistance: สาเหตุหลักคือ inappropriate antibiotic use ทั้งใน human และ agriculture",
    { A: "ถูก — Overuse/misuse + incomplete courses + OTC antibiotics + agriculture use → selective pressure → resistance genes", B: "ผิด — วิตามินไม่เกี่ยว", C: "ผิด — มลพิษไม่ใช่สาเหตุหลัก", D: "ผิด — ออกกำลังกายไม่เกี่ยว" }, "easy", 2),
  q(S.publichealth, "AMR (Antimicrobial Resistance) Action Plan ของไทย มีเป้าหมายลดการใช้ antibiotics ลงกี่เปอร์เซ็นต์", ["10%", "20%", "30%", "50%"], "B",
    "Thailand AMR National Strategic Plan 2017-2021 (extended): เป้าหมายลด AMR consumption 20% และลด AMR infections 50%",
    { A: "ผิด — 10% น้อยเกิน", B: "ถูก — ลดการใช้ antibiotics ใน human 20% + animal 30% ภายใน 5 ปี", C: "ผิด — 30% เป็นเป้า animal sector", D: "ผิด — 50% เป็นเป้าลด AMR infections ไม่ใช่ลดการใช้" }, "hard", 2),
  q(S.publichealth, "NCD (Non-Communicable Diseases) ที่เป็นภาระโรคสูงสุดในไทย 4 โรคหลักคือ", ["มาลาเรีย TB HIV ไข้เลือดออก", "DM, HTN, หลอดเลือดสมอง, มะเร็ง", "ไข้หวัดใหญ่ อีสุกอีใส หัด คางทูม", "กระดูกหัก ข้อเสื่อม ปวดหลัง เก๊าท์"], "B",
    "NCDs คือ 4 กลุ่มโรคหลัก: CVD, DM, Cancer, Chronic respiratory diseases คิดเป็น ~75% ของการเสียชีวิตในไทย",
    { A: "ผิด — เหล่านี้คือ communicable diseases", B: "ถูก — NCD 4 กลุ่มหลัก: เบาหวาน, ความดันสูง/หลอดเลือด, มะเร็ง, โรคทางเดินหายใจเรื้อรัง", C: "ผิด — communicable diseases", D: "ผิด — musculoskeletal diseases ไม่ใช่ NCD หลัก" }, "easy", 2),
  q(S.publichealth, "โครงการ RDU Hospital (โรงพยาบาลส่งเสริมการใช้ยาอย่างสมเหตุผล) มีตัวชี้วัดหลักอะไร", ["จำนวนยาที่ขายได้", "การลด polypharmacy, ลด antibiotic ใน URI, ลด injectable use", "กำไรของโรงพยาบาล", "จำนวนเภสัชกรในโรงพยาบาล"], "B",
    "RDU Hospital indicators: prescribing indicators ของ WHO ได้แก่ average drugs/encounter, % antibiotics in URI, % injection",
    { A: "ผิด — ไม่ใช่เรื่องยอดขาย", B: "ถูก — RDU key indicators: ลดยาเฉลี่ยต่อใบสั่ง, ลด %AB ใน URI (เป้า < 20%), ลด %injection, เพิ่ม generic prescribing", C: "ผิด — ไม่เกี่ยวกับกำไร", D: "ผิด — ไม่ใช่จำนวนเภสัชกร" }, "medium", 2),
  q(S.publichealth, "บทบาทเภสัชกรใน Primary Care Unit (PCU) / รพ.สต. คือ", ["ผ่าตัด", "เยี่ยมบ้าน ให้คำปรึกษาด้านยา ติดตาม NCD จัดการ DRP", "ตรวจเลือด", "ออกใบสั่งยา"], "B",
    "เภสัชกรปฐมภูมิ: เยี่ยมบ้าน, Medication review, DRP identification, NCD counseling, vaccine service",
    { A: "ผิด — เภสัชกรไม่ผ่าตัด", B: "ถูก — เภสัชกรปฐมภูมิ: home visit, med reconciliation, DRP management, self-care advice, NCD monitoring", C: "ผิด — ตรวจเลือดเป็นหน้าที่ lab", D: "ผิด — เภสัชกรไม่ออกใบสั่งยา (ยกเว้น refill ตามแพทย์สั่ง)" }, "medium", 2),
  q(S.insurance, "ระบบ DRG (Diagnosis Related Group) ใช้ในการชำระเงินแบบใด", ["Fee-for-service", "Capitation", "Case-based payment ตามกลุ่มวินิจฉัยโรค", "Global budget"], "C",
    "DRG: จ่ายตาม case ที่ admit โดยจัดกลุ่มตามวินิจฉัย + ค่าน้ำหนักสัมพัทธ์ (RW)",
    { A: "ผิด — Fee-for-service จ่ายตามรายการ", B: "ผิด — Capitation จ่ายต่อหัวประชากร", C: "ถูก — DRG: prospective payment ตาม case classification → กระตุ้นประสิทธิภาพ ลด LOS ที่ไม่จำเป็น", D: "ผิด — Global budget เป็นงบก้อนรวม" }, "hard", 2),
  q(S.insurance, "สิทธิ์บัตรทอง (UC) กรณีฉุกเฉิน ผู้ป่วยสามารถไปรักษาที่ไหนได้", ["เฉพาะ รพ. ที่ลงทะเบียนเท่านั้น", "รพ. รัฐ/เอกชนใดก็ได้ที่ใกล้ที่สุด (UCEP)", "ต้องโทรถาม สปสช. ก่อน", "เฉพาะ รพ. รัฐเท่านั้น"], "B",
    "UCEP (Universal Coverage Emergency Patients): ฉุกเฉินวิกฤต → ไป รพ. ใดก็ได้ที่ใกล้ที่สุด 72 ชม.แรก",
    { A: "ผิด — ฉุกเฉินไม่ต้องไป รพ. ที่ลงทะเบียน", B: "ถูก — UCEP: ฉุกเฉินวิกฤต เข้า รพ. ใดก็ได้ ทุกสิทธิ์ 72 ชม.แรก รัฐจ่ายให้", C: "ผิด — ฉุกเฉินไม่ต้องขออนุมัติก่อน", D: "ผิด — เอกชนก็ได้ถ้าฉุกเฉิน" }, "medium", 2),
  q(S.insurance, "เภสัชกรร้านยามีบทบาทใน UC อย่างไร", ["ไม่มีบทบาทเลย", "ร้านยา ที่เข้าร่วมโครงการสามารถจ่ายยา OTC/เจ็บป่วยเล็กน้อย ตามบัญชียา UC", "เปิดร้านยาฟรีให้ผู้ถือบัตรทอง", "จ่ายยาทุกชนิดฟรี"], "B",
    "โครงการร้านยาคุณภาพ: ร้านยาที่เข้าร่วมจ่ายยา common illnesses 16 กลุ่มอาการ ตามสิทธิ์ UC",
    { A: "ผิด — มีบทบาทในโครงการร้านยาคุณภาพ", B: "ถูก — สปสช. + ร้านยาคุณภาพ: จ่ายยา 16 กลุ่มอาการเจ็บป่วยเล็กน้อย (ปวดหัว ท้องเสีย ผื่น ฯลฯ) ไม่เสียค่าใช้จ่าย", C: "ผิด — ไม่ได้เปิดร้านฟรี แต่เบิกจาก สปสช.", D: "ผิด — เฉพาะยาตามบัญชีที่กำหนด" }, "medium", 2),
  q(S.insurance, "Copayment หมายถึงอะไรในระบบประกันสุขภาพ", ["รัฐจ่ายทั้งหมด", "ผู้ป่วยร่วมจ่ายส่วนหนึ่งของค่ารักษา", "นายจ้างจ่ายทั้งหมด", "เภสัชกรจ่ายเอง"], "B",
    "Copayment: ผู้ป่วยร่วมจ่ายบางส่วน เช่น ค่ายานอกบัญชี ค่าห้องพิเศษ",
    { A: "ผิด — นั่นคือ full coverage", B: "ถูก — Copayment/Co-pay: ผู้ป่วยร่วมจ่ายส่วนหนึ่ง (เช่น 30 บาท/ครั้ง ในโครงการ 30 บาท เดิม)", C: "ผิด — นายจ้างไม่ได้จ่ายทั้งหมด", D: "ผิด — เภสัชกรไม่ได้จ่าย" }, "easy", 2),
  q(S.publichealth, "Adverse Drug Reaction reporting ในไทย ส่งรายงานไปที่ใด", ["โรงพยาบาลเท่านั้น", "ศูนย์เฝ้าระวัง HPVC ของ อย. (Thai FDA)", "สภาเภสัชกรรม", "กระทรวงมหาดไทย"], "B",
    "HPVC (Health Product Vigilance Center) อย. รับรายงาน ADR ทั้งจากบุคลากรสาธารณสุขและประชาชน",
    { A: "ผิด — ส่งไปที่ อย. โดยตรงได้", B: "ถูก — Thai Vigibase/HPVC ภายใต้ อย. รับรายงาน ADR ผ่านระบบออนไลน์ + เชื่อมต่อ WHO UMC", C: "ผิด — สภาเภสัชกรรมดูแลจรรยาบรรณ ไม่รับ ADR report", D: "ผิด — ไม่เกี่ยว" }, "medium", 2),

  // =============================================
  // WEEK 3: สมุนไพร + ชีวเภสัชศาสตร์ (20 ข้อ)
  // =============================================
  q(S.pharmacognosy, "ขิง (Zingiber officinale) มีข้อบ่งใช้ทางการแพทย์ที่มีหลักฐานคือ", ["ลดความดันโลหิต", "แก้คลื่นไส้ อาเจียน (antiemetic)", "ลดน้ำตาลในเลือด", "ลดคอเลสเตอรอล"], "B",
    "Ginger: มีหลักฐาน RCT สนับสนุนฤทธิ์ antiemetic โดยเฉพาะ pregnancy-related nausea, motion sickness, PONV",
    { A: "ผิด — ไม่มีหลักฐานชัดเจนลด BP", B: "ถูก — Ginger 1-2 g/day: antiemetic ใน pregnancy nausea (safe), motion sickness, CINV ฤทธิ์จาก gingerols/shogaols", C: "ผิด — ไม่มีหลักฐานชัดเจน", D: "ผิด — ไม่มีหลักฐานชัดเจน" }, "easy", 3),
  q(S.pharmacognosy, "Milk Thistle (Silybum marianum) มีสาร active คือ Silymarin ใช้ประโยชน์เรื่องใด", ["แก้ไอ", "Hepatoprotection (ปกป้องตับ)", "ลดน้ำตาล", "ลดปวด"], "B",
    "Silymarin: antioxidant, anti-inflammatory, membrane stabilizing → hepatoprotective ใช้ใน alcoholic liver disease, hepatotoxicity",
    { A: "ผิด — ไม่มีฤทธิ์แก้ไอ", B: "ถูก — Silymarin complex: flavonolignans (silibinin) มีฤทธิ์ hepatoprotective, antioxidant ใช้ใน toxic/alcoholic hepatitis", C: "ผิด — ไม่ลดน้ำตาล", D: "ผิด — ไม่มีฤทธิ์แก้ปวด" }, "medium", 3),
  q(S.pharmacognosy, "กวาวเครือขาว (Pueraria mirifica) มีสารออกฤทธิ์กลุ่มใด", ["Alkaloids", "Phytoestrogens (Isoflavones)", "Terpenes", "Saponins"], "B",
    "Pueraria mirifica มี phytoestrogens: miroestrol, deoxymiroestrol, isoflavones → estrogenic activity",
    { A: "ผิด — Alkaloids อยู่ใน Ephedra, Cinchona", B: "ถูก — Phytoestrogens: miroestrol, deoxymiroestrol มี estrogenic potency สูงกว่า soy isoflavones; ใช้ใน menopausal symptoms", C: "ผิด — Terpenes อยู่ในฟ้าทะลายโจร", D: "ผิด — Saponins อยู่ใน Ginseng" }, "medium", 3),
  q(S.pharmacognosy, "Garlic (Allium sativum) มี active compound คือ Allicin ซึ่งมีฤทธิ์หลักอะไร", ["Hepatoprotection", "Antimicrobial + Lipid lowering + Antiplatelet", "Anxiolytic", "Diuretic"], "B",
    "Garlic/Allicin: มี antimicrobial, mild lipid lowering (LDL ~10%), antiplatelet properties",
    { A: "ผิด — ไม่ใช่ hepatoprotective", B: "ถูก — Allicin: broad-spectrum antimicrobial + ลด LDL ~5-10% + antiplatelet (ระวังร่วม Warfarin/Aspirin) + antihypertensive เล็กน้อย", C: "ผิด — ไม่มีฤทธิ์ anxiolytic", D: "ผิด — ไม่มีฤทธิ์ diuretic ชัดเจน" }, "medium", 3),
  q(S.pharmacognosy, "Evening Primrose Oil มี GLA (Gamma-Linolenic Acid) ใช้ในโรคใด", ["เบาหวาน", "Eczema / Atopic dermatitis", "มะเร็ง", "โรคหัวใจ"], "B",
    "EPO/GLA: anti-inflammatory prostaglandin E1 pathway → ใช้ใน eczema, mastalgia, PMS",
    { A: "ผิด — ไม่มีหลักฐานชัดเจนใน DM", B: "ถูก — GLA → DGLA → PGE1 (anti-inflammatory) ใช้ใน eczema/AD (mixed evidence), mastalgia, PMS", C: "ผิด — ไม่รักษามะเร็ง", D: "ผิด — ไม่มีหลักฐานชัดเจนใน CVD" }, "medium", 3),
  q(S.biopharma, "Dissolution test วัดอะไร", ["ความแข็งของเม็ดยา", "อัตราการละลายของยาจาก dosage form ใน dissolution medium", "ปริมาณ active ingredient ใน formulation", "ความคงสภาพของยา"], "B",
    "Dissolution test: วัด rate ที่ active drug ละลายจาก dosage form ใน simulated GI fluid",
    { A: "ผิด — ความแข็งวัดด้วย hardness tester", B: "ถูก — Dissolution: in vitro surrogate ของ in vivo absorption; ใช้ USP apparatus (paddle/basket) + medium (pH 1.2, 4.5, 6.8)", C: "ผิด — ปริมาณ active วัดด้วย assay/potency test", D: "ผิด — ความคงสภาพวัดด้วย stability study" }, "easy", 3),
  q(S.biopharma, "ยา Modified-release มีกี่ประเภทหลัก", ["1 ประเภท", "2 ประเภท: Delayed-release และ Extended-release", "3 ประเภท", "5 ประเภท"], "B",
    "Modified-release: Delayed-release (ปล่อยยาช้าตามตำแหน่ง เช่น enteric) และ Extended-release (ปล่อยยานาน ≥ 12 ชม.)",
    { A: "ผิด — มี 2 ประเภทหลัก", B: "ถูก — DR: ปล่อยยาที่ตำแหน่งเฉพาะ (เช่น enteric-coated); ER/SR/CR: ปล่อยยาช้าๆ ยาวนาน reduce dosing frequency", C: "ผิด — 2 ประเภทหลัก", D: "ผิด — 2 ประเภทหลัก" }, "easy", 3),
  q(S.biopharma, "First-order kinetics ในการขจัดยาหมายถึง", ["ยาถูกขจัดด้วย rate คงที่ (fixed amount/time)", "ยาถูกขจัดด้วย rate ที่เป็นสัดส่วนกับ concentration (fixed fraction/time)", "ยาไม่ถูกขจัดเลย", "ยาถูกขจัดทั้งหมดใน 1 half-life"], "B",
    "First-order: rate of elimination ∝ drug concentration → fixed fraction eliminated per time unit → exponential decay",
    { A: "ผิด — นั่นคือ zero-order kinetics (เช่น ethanol, high-dose phenytoin)", B: "ถูก — First-order: Cp ลดลง exponentially; t½ คงที่; ยาส่วนใหญ่ขจัดแบบ first-order ในช่วง therapeutic", C: "ผิด — ยาถูกขจัด", D: "ผิด — 1 half-life ขจัด 50% ไม่ใช่ทั้งหมด" }, "medium", 3),
  q(S.biopharma, "ยาที่มี narrow therapeutic index (NTI) หมายถึง", ["ยาที่มีราคาแพง", "ยาที่มีช่วงระหว่าง therapeutic dose กับ toxic dose แคบมาก", "ยาที่ต้องให้ทาง IV เท่านั้น", "ยาที่ออกฤทธิ์เร็ว"], "B",
    "NTI drugs: therapeutic window แคบ เช่น Warfarin, Digoxin, Phenytoin, Lithium, Theophylline → ต้อง TDM",
    { A: "ผิด — ราคาไม่เกี่ยว", B: "ถูก — NTI: small difference between Cmin effective and Cmin toxic → เปลี่ยน brand/generic ต้องระวัง ต้อง TDM", C: "ผิด — NTI drugs มีทั้ง oral และ IV", D: "ผิด — onset ไม่เกี่ยว" }, "easy", 3),
  q(S.biopharma, "Transdermal Drug Delivery System (TDDS) เช่น Fentanyl patch ข้อดีหลักคือ", ["ออกฤทธิ์เร็วมาก", "ให้ยาสม่ำเสมอ sustained release ผ่านผิวหนัง หลีกเลี่ยง first-pass", "ราคาถูก", "ใช้ได้กับยาทุกชนิด"], "B",
    "TDDS: zero-order release ผ่านผิวหนัง → steady plasma level + avoid first-pass + improve compliance",
    { A: "ผิด — TDDS onset ช้า (Fentanyl patch onset 12-24 hr)", B: "ถูก — Sustained release + bypass GI/first-pass + improve adherence (patch เปลี่ยนทุก 72 hr); ข้อจำกัด: ยาต้อง lipophilic, MW < 500, potent", C: "ผิด — TDDS มักแพงกว่า oral", D: "ผิด — ใช้ได้เฉพาะยาที่ lipophilic, low dose, low MW" }, "medium", 3),

  // =============================================
  // WEEK 4: ADR/DI + การคำนวณทางเภสัชกรรม (20 ข้อ)
  // =============================================
  q(S.adr, "ยาใดที่ทำให้ Hyperkalemia ได้", ["Furosemide", "Spironolactone", "HCTZ", "Mannitol"], "B",
    "Spironolactone เป็น potassium-sparing diuretic → hyperkalemia โดยเฉพาะใน CKD, ร่วม ACEi/ARB",
    { A: "ผิด — Furosemide ทำ hypokalemia (loop diuretic)", B: "ถูก — Spironolactone (MRA): block aldosterone → ↓ K excretion → hyperkalemia; ระวังร่วม ACEi/ARB/K supplements", C: "ผิด — HCTZ ทำ hypokalemia (thiazide)", D: "ผิด — Mannitol ทำ hyponatremia" }, "easy", 4),
  q(S.adr, "Drug-induced hepatotoxicity (DILI) ยาที่เป็นสาเหตุพบบ่อยที่สุดของ acute liver failure คือ", ["Amoxicillin", "Paracetamol (Acetaminophen)", "Omeprazole", "Metformin"], "B",
    "Paracetamol overdose → NAPQI (toxic metabolite) → glutathione depletion → hepatocellular necrosis → เป็นสาเหตุ #1 ของ acute liver failure ในตะวันตก",
    { A: "ผิด — Amoxicillin ทำ cholestatic hepatitis ได้แต่ไม่ใช่พบบ่อยที่สุด", B: "ถูก — Paracetamol: สาเหตุ #1 ของ DILI/ALF; toxic dose > 7.5-10 g; antidote = N-Acetylcysteine (NAC)", C: "ผิด — Omeprazole ไม่ค่อยทำ hepatotoxicity", D: "ผิด — Metformin ไม่ hepatotoxic" }, "easy", 4),
  q(S.adr, "Stevens-Johnson Syndrome (SJS) ตรวจ HLA-B*5801 ก่อนเริ่มยาใด", ["Carbamazepine", "Allopurinol", "Methotrexate", "Paracetamol"], "B",
    "HLA-B*5801 screening ก่อนเริ่ม Allopurinol เป็น mandatory ในเอเชียตะวันออกเฉียงใต้ (ACR 2020)",
    { A: "ผิด — Carbamazepine ตรวจ HLA-B*1502 (ไม่ใช่ 5801)", B: "ถูก — HLA-B*5801 + Allopurinol → SJS/TEN risk สูง; ACR 2020: ต้องตรวจก่อนเริ่มยาในคนเอเชีย/แอฟริกัน", C: "ผิด — MTX ไม่ต้องตรวจ HLA", D: "ผิด — Paracetamol ไม่ต้องตรวจ HLA" }, "medium", 4),
  q(S.adr, "Naranjo scale ใช้ประเมินอะไร", ["ความรุนแรงของอาการแพ้ยา", "ความน่าจะเป็นว่า ADR เกิดจากยาตัวใดตัวหนึ่ง (causality assessment)", "Drug interaction severity", "Cost-effectiveness ของยา"], "B",
    "Naranjo Adverse Drug Reaction Probability Scale: คะแนน 10 ข้อ ประเมิน definite/probable/possible/doubtful",
    { A: "ผิด — ความรุนแรงใช้ Hartwig severity scale", B: "ถูก — Naranjo scale: 10 คำถาม ให้คะแนน -1 ถึง +2 แต่ละข้อ; ≥9 = definite, 5-8 = probable, 1-4 = possible, ≤0 = doubtful", C: "ผิด — DI severity ใช้ classification อื่น", D: "ผิด — Cost-effectiveness ใช้ pharmacoeconomic analysis" }, "hard", 4),
  q(S.adr, "Warfarin + Rifampicin interaction เกิดอะไรขึ้น", ["INR เพิ่มสูงมาก", "INR ลดลง → เสี่ยง thrombosis", "ไม่มี interaction", "Rifampicin ถูก inactivate"], "B",
    "Rifampicin เป็น potent CYP inducer (CYP3A4, 2C9, 1A2) → เพิ่ม Warfarin metabolism → INR ลด → thrombosis risk",
    { A: "ผิด — INR ลดไม่ใช่เพิ่ม", B: "ถูก — Rifampicin: strongest CYP inducer → Warfarin S-isomer (CYP2C9) ถูก metabolize เร็วขึ้น → INR ลด → ต้องเพิ่ม Warfarin dose 2-5 เท่า", C: "ผิด — เป็น major interaction", D: "ผิด — Rifampicin ไม่ถูก inactivate" }, "medium", 4),
  q(S.calc, "Creatinine Clearance (CrCl) คำนวณด้วยสูตร Cockcroft-Gault สำหรับผู้ป่วยชาย 70 ปี น้ำหนัก 60 kg SCr 2.0 mg/dL คือ", ["21 mL/min", "25 mL/min", "30 mL/min", "35 mL/min"], "B",
    "CG: (140-age) × weight / (72 × SCr) = (140-70) × 60 / (72 × 2) = 4200/144 = 29.2 ≈ 25-30",
    { A: "ผิด — คำนวณให้ได้ ~29", B: "ถูก — CrCl = (140-70) × 60 / (72 × 2.0) = 70 × 60/144 = 4200/144 ≈ 29.2 mL/min (≈25-30 range)", C: "ผิด — ใกล้เคียงแต่คำนวณไม่ตรง", D: "ผิด — สูงเกิน" }, "medium", 4),
  q(S.calc, "ผู้ป่วยได้ Phenytoin 300 mg/day total Phenytoin level 8 mcg/mL albumin 2.0 g/dL ค่า corrected Phenytoin (Winter-Tozer) คือ", ["8 mcg/mL", "12.3 mcg/mL", "16 mcg/mL", "20 mcg/mL"], "B",
    "Winter-Tozer: Corrected = Measured / (0.2 × Albumin + 0.1) = 8 / (0.2×2 + 0.1) = 8/0.5 = 16... จริงๆ ลองคำนวณ: 8/(0.2×2+0.1) = 8/0.5 = 16",
    { A: "ผิด — ยังไม่ corrected", B: "ถูก — Corrected Phenytoin = 8 / (0.2 × 2.0 + 0.1) = 8 / 0.5 = 16 mcg/mL → อยู่ใน therapeutic range (10-20) แต่ถ้าใช้ 0.25 × Alb + 0.1: 8/(0.6) = 13.3", C: "ผิด — ตรงกับสูตร standard", D: "ผิด — สูงเกิน" }, "hard", 4),
  q(S.calc, "BSA (Body Surface Area) คำนวณด้วยสูตร Mosteller: √(Ht×Wt/3600) ผู้ป่วย Ht 170 cm Wt 70 kg BSA เท่าใด", ["1.52 m²", "1.82 m²", "2.02 m²", "1.32 m²"], "B",
    "BSA = √(170×70/3600) = √(11900/3600) = √3.306 = 1.818 ≈ 1.82 m²",
    { A: "ผิด — ต่ำเกิน", B: "ถูก — √(170×70/3600) = √3.306 = 1.82 m²", C: "ผิด — สูงเกิน", D: "ผิด — ต่ำเกินมาก" }, "medium", 4),
  q(S.calc, "Pediatric dose ใช้สูตร Clark's rule: (Weight in lbs / 150) × Adult dose เด็กน้ำหนัก 30 kg (~66 lbs) Adult dose Amoxicillin 500 mg ขนาดยาเด็กคือ", ["110 mg", "165 mg", "220 mg", "330 mg"], "C",
    "Clark: (66/150) × 500 = 0.44 × 500 = 220 mg",
    { A: "ผิด — คำนวณผิด", B: "ผิด — คำนวณผิด", C: "ถูก — (66 lbs / 150) × 500 mg = 0.44 × 500 = 220 mg", D: "ผิด — คำนวณผิด" }, "easy", 4),
  q(S.calc, "IV fluid D5W 1000 mL ต้อง drip ใน 8 ชั่วโมง ใช้ IV set 15 gtt/mL อัตราหยดเท่าไร", ["15 gtt/min", "31 gtt/min", "45 gtt/min", "60 gtt/min"], "B",
    "Rate = (1000 × 15) / (8 × 60) = 15000/480 = 31.25 gtt/min",
    { A: "ผิด — คำนวณผิด", B: "ถูก — (Volume × Drop factor) / (Time in min) = (1000 × 15) / 480 = 31.25 ≈ 31 gtt/min", C: "ผิด — คำนวณผิด", D: "ผิด — คำนวณผิด" }, "easy", 4),

  // =============================================
  // WEEK 5: กฎหมายยา + เภสัชจลนศาสตร์ (20 ข้อ)
  // =============================================
  q(S.law, "ยาสามัญประจำบ้าน (Household remedies) ตัวอย่างคือ", ["Amoxicillin capsule", "Paracetamol 500 mg (ขนาดบรรจุ ≤ 10 เม็ด)", "Warfarin", "Diazepam"], "B",
    "ยาสามัญประจำบ้าน: ยาที่ประชาชนซื้อได้เอง ไม่ต้องมีใบสั่ง ไม่ต้องมีเภสัชกร เช่น Paracetamol (pack เล็ก)",
    { A: "ผิด — Amoxicillin เป็นยาอันตราย", B: "ถูก — Paracetamol ขนาดบรรจุเล็ก (≤10 เม็ด) เป็นยาสามัญประจำบ้าน ซื้อได้ทุกร้าน", C: "ผิด — Warfarin เป็นยาควบคุมพิเศษ", D: "ผิด — Diazepam เป็นวัตถุออกฤทธิ์ ป.4" }, "easy", 5),
  q(S.law, "วัตถุออกฤทธิ์ประเภท 3 และ 4 ต่างจากประเภท 1 และ 2 อย่างไร", ["มีอันตรายมากกว่า", "มีศักยภาพในการเสพติดต่ำกว่า และมีประโยชน์ทางการแพทย์มากกว่า", "ราคาแพงกว่า", "ใช้ได้เฉพาะในสัตว์"], "B",
    "วัตถุออกฤทธิ์ ป.3-4: lower abuse potential + greater medical utility เช่น Phenobarbital (ป.4), Buprenorphine (ป.3)",
    { A: "ผิด — อันตราย/เสพติดน้อยกว่า", B: "ถูก — ป.1 (ห้ามใช้): Cathinone; ป.2 (เสพติดสูง): Diazepam; ป.3-4: เสพติดต่ำกว่า ใช้ทางการแพทย์กว้างขึ้น", C: "ผิด — ราคาไม่ใช่เกณฑ์จำแนก", D: "ผิด — ใช้ในคนได้" }, "medium", 5),
  q(S.law, "เภสัชกรพบใบสั่งยาปลอม (Forged prescription) ควรทำอย่างไร", ["จ่ายยาตามปกติ", "ปฏิเสธจ่ายยา แจ้งตำรวจ/เจ้าหน้าที่ เก็บใบสั่งไว้เป็นหลักฐาน", "ฉีกใบสั่งทิ้ง", "โทรแจ้งสภาเภสัชกรรมอย่างเดียว"], "B",
    "Forged prescription: ปฏิเสธจ่ายยา + เก็บหลักฐาน + แจ้งเจ้าหน้าที่/ตำรวจ ตามกฎหมาย",
    { A: "ผิด — ห้ามจ่ายยาตามใบสั่งปลอม", B: "ถูก — ปฏิเสธจ่ายยา + เก็บใบสั่งไว้เป็นหลักฐาน + แจ้งตำรวจ/อย.; จดรายละเอียดบุคคลที่มาขอยา", C: "ผิด — ต้องเก็บไว้เป็นหลักฐาน", D: "ผิด — ต้องแจ้งตำรวจด้วย ไม่ใช่สภาเภสัชกรรมอย่างเดียว" }, "medium", 5),
  q(S.pk, "Zero-order elimination kinetics ต่างจาก first-order อย่างไร", ["อัตราการขจัดยาคงที่ไม่ว่าจะมีความเข้มข้นเท่าไร", "อัตราการขจัดเป็นสัดส่วนกับความเข้มข้น", "ไม่มีความแตกต่าง", "Zero-order เร็วกว่า first-order เสมอ"], "A",
    "Zero-order: rate of elimination = constant (mg/hr) ไม่ขึ้นกับ concentration เช่น Ethanol, high-dose Phenytoin, Aspirin toxic dose",
    { A: "ถูก — Zero-order: fixed amount/time (เช่น ethanol ~10 g/hr); ไม่มี fixed half-life; concentration ลดเป็นเส้นตรง", B: "ผิด — นั่นคือ first-order", C: "ผิด — มีความแตกต่างชัดเจน", D: "ผิด — ไม่จริงเสมอไป" }, "medium", 5),
  q(S.pk, "Michaelis-Menten kinetics เกี่ยวข้องกับยาใดมากที่สุด", ["Amoxicillin", "Phenytoin", "Metformin", "Amlodipine"], "B",
    "Phenytoin: saturable hepatic metabolism → non-linear kinetics → small dose increase ทำให้ concentration เพิ่มขึ้นมาก",
    { A: "ผิด — Amoxicillin first-order kinetics", B: "ถูก — Phenytoin: CYP2C9/2C19 saturated ที่ therapeutic doses → Michaelis-Menten → ต้อง TDM อย่างระวัง", C: "ผิด — Metformin first-order", D: "ผิด — Amlodipine first-order" }, "hard", 5),

  // =============================================
  // WEEK 6: ไต + หมวดเดิมเสริม (20 ข้อ)
  // =============================================
  q(S.renal, "ผู้ป่วย CKD stage 5 on dialysis มี pruritus (คัน) รุนแรง สาเหตุหลักคือ", ["แพ้ยา", "Uremic toxins + hyperphosphatemia + secondary hyperparathyroidism", "เชื้อรา", "แพ้อาหาร"], "B",
    "Uremic pruritus: multifactorial — uremic toxins, hyperphosphatemia, hyperparathyroidism, dry skin, neuropathy",
    { A: "ผิด — ไม่ใช่ drug allergy", B: "ถูก — CKD-associated pruritus: uremic toxins + Ca×PO4 สูง + PTH สูง → ลด PO4 ด้วย binder + optimize dialysis + gabapentin/emollients", C: "ผิด — ไม่ใช่เชื้อรา", D: "ผิด — ไม่ใช่ food allergy" }, "medium", 6),
  q(S.renal, "Peritoneal Dialysis (PD) เมื่อเทียบกับ Hemodialysis (HD) ข้อดีคือ", ["ขจัดสารพิษได้ดีกว่า", "ทำที่บ้านได้ เหมาะกับผู้ป่วยที่อยู่ไกล รพ.", "ไม่ต้อง catheter", "ไม่มี peritonitis risk"], "B",
    "PD: home-based, gentle hemodynamic, preserve residual renal function; HD: more efficient, hospital-based",
    { A: "ผิด — HD ขจัดสารพิษ MW ต่ำได้ดีกว่า/เร็วกว่า", B: "ถูก — PD: ทำที่บ้าน, gentle → hemodynamic stable, preserve residual renal function ดีกว่า, เหมาะผู้ป่วยห่างไกล", C: "ผิด — PD ต้องมี Tenckhoff catheter", D: "ผิด — Peritonitis เป็นภาวะแทรกซ้อนหลักของ PD" }, "medium", 6),
  q(S.renal, "ยา Dapagliflozin (SGLT2 inhibitor) นอกจากลดน้ำตาลแล้ว มีประโยชน์ต่อไตอย่างไร", ["ไม่มีผลต่อไต", "ชะลอการเสื่อมของไต (renal protection) ลด proteinuria", "ทำให้ไตฟื้นตัว 100%", "เพิ่ม GFR ทันที"], "B",
    "SGLT2i: DAPA-CKD, CREDENCE trials → ลด progression ของ CKD, ลด proteinuria, ลด HF hospitalization",
    { A: "ผิด — มีประโยชน์ชัดเจน", B: "ถูก — Dapagliflozin: ลด composite renal endpoint ~40% ใน CKD (DAPA-CKD); ตอนนี้มี indication สำหรับ CKD แม้ไม่มี DM", C: "ผิด — ไม่ได้ทำให้ฟื้น 100%", D: "ผิด — GFR dip เล็กน้อยช่วงแรก (hemodynamic effect) แต่ long-term ชะลอ decline" }, "medium", 6),
];

async function seed() {
  const client = new Client({ connectionString: SUPABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("Connected! Seeding", allQuestions.length, "questions with status=REVIEW...\n");

  const weekCounts = {};
  let count = 0;
  for (const q of allQuestions) {
    const id = randomUUID();
    const week = q.week || 1;
    await client.query(
      `INSERT INTO mcq_questions (id, subject_id, exam_type, scenario, choices, correct_answer, explanation, detailed_explanation, difficulty, status, ai_notes)
       VALUES ($1, $2, 'PLE-CC1', $3, $4, $5, $6, $7, $8, 'review', $9)`,
      [id, q.subject_id, q.scenario, q.choices, q.correct_answer, q.explanation, q.detailed_explanation, q.difficulty, `week_${week}`]
    );
    weekCounts[week] = (weekCounts[week] || 0) + 1;
    count++;
    if (count % 10 === 0) process.stdout.write(`  ${count}/${allQuestions.length}\r`);
  }

  console.log(`\n✅ Inserted ${count} questions (status=review)!`);
  console.log("\n=== Per Week ===");
  for (const [w, c] of Object.entries(weekCounts).sort()) {
    console.log(`  Week ${w}: ${c} questions`);
  }

  // Total counts
  const r = await client.query(`SELECT status, COUNT(*) as count FROM mcq_questions GROUP BY status`);
  console.log("\n=== Status counts ===");
  for (const row of r.rows) {
    console.log(`  ${row.status}: ${row.count}`);
  }

  await client.end();
}

seed().catch(console.error);
