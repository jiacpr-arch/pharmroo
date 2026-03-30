const { createClient } = require('@libsql/client');
const crypto = require('crypto');

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Subject IDs
const S = {
  skin:    '12b0b8c1-fe53-49d8-9c4b-e348eba85e36', // ผิวหนัง
  infect:  '8bccedb2-3bdb-4f5c-9da9-f589b25672fd', // โรคติดเชื้อ
  immuno:  'ccb73060-b09f-4927-8ff8-53190db76d18', // ภูมิคุ้มกัน/SLE
  cardio:  'dce79912-01f6-4871-96df-94c6cfc853e7', // หัวใจ
  msk:     '06991a85-412e-476e-89ff-32b0a7b92e6c', // กระดูกและข้อ
  hemo:    'ace9965c-285b-4d4a-aaf2-5de9739cc09a', // โลหิต
  gi:      '91eedbf3-4301-4f40-ae3d-3cc6f64c4f8a', // GI
  neuro:   'fb62e97d-dec1-4b47-b45f-617b2c03fb4d', // ระบบประสาท
  psych:   'beee26b1-72c2-4c70-be73-24d7fa036f19', // จิตเวช
  pulm:    'cc7ce595-2da4-4207-95a4-9a4bb606bbe0', // ปอด
  pharma:  '0a7f8e61-3786-494c-9c54-b6edc17b03b6', // เภสัชเทคโนโลยี
  clinic:  '41f903b7-5258-47fa-9ec3-44e756e705d1', // เภสัชกรรมคลินิก
};

const questions = [
// ─── DERMATOLOGY / TINEA ───────────────────────────────────────────────────
{n:1, s:S.skin,
 q:'ผู้ป่วยชายอายุ 55 ปี มีโรค Dyslipidemia รับประทาน Simvastatin 40 mg ตรวจพบการติดเชื้อราที่เล็บเท้าและซอกนิ้วเท้า เชื้อที่พบน่าจะเป็น Trichophyton ซึ่งทำให้เกิดโรคชนิดใดต่อไปนี้',
 a:'Tinea capitis',b:'Tinea manuum',c:'Tinea cruris',d:'Tinea pedis',e:'Tinea corporis',
 ans:'d',
 exp:'Trichophyton rubrum เป็นสาเหตุหลักของ Tinea pedis (ringworm of the foot/athlete\'s foot) ซึ่งพบที่ซอกนิ้วเท้าและฝ่าเท้า'},

{n:2, s:S.skin,
 q:'จากกรณีผู้ป่วยข้างต้น ยาใดต่อไปนี้เหมาะสมที่สุดในการรักษา Tinea pedis แบบผิวหนัง (ไม่ใช่เล็บ)',
 a:'Ketoconazole cream',b:'Itraconazole capsule',c:'Mupirocin cream',d:'Dexamethasone cream',e:'Miconazole tablets',
 ans:'a',
 exp:'Tinea pedis ที่ผิวหนัง → Topical antifungal เป็น first-line: Ketoconazole 2% cream ทา 2-4 สัปดาห์ หากเป็น onychomycosis (เล็บ) จึงใช้ oral Itraconazole'},

{n:3, s:S.skin,
 q:'ผลข้างเคียงสำคัญที่ต้องระวังเป็นพิเศษเมื่อใช้ Azole antifungal (Ketoconazole, Itraconazole) คือข้อใด',
 a:'Agranulocytosis',b:'Kidney Injury',c:'Hepatotoxicity',d:'Nephrotoxicity',e:'Cardiotoxicity',
 ans:'c',
 exp:'Azole antifungals ทำให้เกิด Hepatotoxicity ได้ — Ketoconazole ถูกถอนจากตลาดหลายประเทศเพราะ liver toxicity รุนแรง ต้อง monitor LFT'},

{n:4, s:S.skin,
 q:'จากสูตรตำรับ Ketoconazole nail lacquer: Ketoconazole 100mg, Eudragit RL 100 400mg, PG 1ml, Glyceryl triacetate 2.5ml, Isopropyl alcohol qs 10ml — สารใดทำหน้าที่เป็น Film-former',
 a:'PEG 400',b:'PG (Propylene glycol)',c:'Eudragit RL 100',d:'Glyceryl triacetate',e:'Isopropyl alcohol',
 ans:'c',
 exp:'Eudragit RL 100 (polymethacrylic acid copolymer) = Film-forming polymer ทำให้ยาเกาะติดผิวเล็บ ส่วน Glyceryl triacetate = Plasticizer, IPA = Solvent'},

{n:5, s:S.skin,
 q:'ใน Ketoconazole nail lacquer สูตรเดิม Glyceryl triacetate (Triacetin) ทำหน้าที่อะไร',
 a:'Antioxidant',b:'Buffer',c:'Preservative',d:'Opacifier',e:'Plasticizer',
 ans:'e',
 exp:'Glyceryl triacetate (Triacetin) = Plasticizer เพิ่มความยืดหยุ่นของ Eudragit film ไม่ให้แตกหรือลอก'},

{n:6, s:S.skin,
 q:'ผู้ป่วยหญิงอายุ 66 ปี ติดเชื้อ Ketoconazole ชนิดใดต่อไปนี้เป็น Preservative ในสูตรตำรับ Ketoconazole ophthalmic solution',
 a:'Antioxidant',b:'Benzalkonium chloride',c:'Eudragit RL 100',d:'PEG 400',e:'Isopropyl alcohol',
 ans:'b',
 exp:'Benzalkonium chloride (BAK) = Preservative ที่ใช้บ่อยที่สุดใน ophthalmic solutions (0.01-0.02%)'},

// ─── INFECTIOUS DISEASES / PNEUMONIA ──────────────────────────────────────
{n:7, s:S.infect,
 q:'ข้อใดต่อไปนี้กล่าว "ไม่ถูกต้อง" เกี่ยวกับการจัดการโรคปอดอักเสบตามคะแนน CURB-65',
 a:'CURB-65 = 0 → รักษาที่บ้านได้',b:'CURB-65 = 1 → ผู้ป่วยนอก (OPD)',c:'CURB-65 ≥ 2 → รับไว้รักษาในโรงพยาบาล (non-ICU)',d:'CURB-65 ≥ 2 → รับไว้รักษาใน ICU ทันที',e:'CURB-65 ≥ 3 → พิจารณา ICU',
 ans:'d',
 exp:'CURB-65: 0-1=home/OPD, 2=hospital non-ICU, ≥3=consider ICU — CURB-65 ≥2 ไม่ได้แปลว่าต้อง ICU ทันที'},

{n:8, s:S.infect,
 q:'ผู้ป่วย CAP (Community-Acquired Pneumonia) ที่ต้องรับไว้รักษาในโรงพยาบาล ควรได้รับ empirical therapy ใด',
 a:'Ceftriaxone + Azithromycin',b:'Ceftriaxone + Doxycycline',c:'Piperacillin/tazobactam + Azithromycin',d:'Amoxicillin/Clavulanic acid',e:'Ampicillin + Sulbactam',
 ans:'a',
 exp:'CAP ที่ต้องนอนโรงพยาบาล (non-ICU): Beta-lactam (Ceftriaxone) + Macrolide (Azithromycin) — IDSA/ATS guidelines'},

{n:9, s:S.infect,
 q:'ข้อใดต่อไปนี้เป็น antipseudomonal antibiotic ที่เหมาะสำหรับ Pseudomonas aeruginosa',
 a:'Ampicillin',b:'Amoxicillin/Clavulanic',c:'Ceftazidime',d:'Doxycycline',e:'Azithromycin',
 ans:'c',
 exp:'Ceftazidime = 3rd gen cephalosporin ที่มีฤทธิ์ต้าน Pseudomonas — ทางเลือกอื่น: Cefepime, Piperacillin/tazo, Meropenem, Ciprofloxacin'},

{n:10, s:S.infect,
 q:'Ceftriaxone sodium ไม่ควรผสมกับสารละลายใดต่อไปนี้',
 a:'D5W',b:'0.9% NaCl',c:'0.45% NaCl',d:'สารละลายที่มี Calcium (เช่น Ringer\'s Lactate)',e:'D10W',
 ans:'d',
 exp:'Ceftriaxone + Calcium → ตกตะกอน Ceftriaxone-calcium precipitate ในปอดและไต (fatal ใน newborn) — ห้ามใช้ร่วมกับ Ringer\'s lactate, Hartmann\'s'},

{n:11, s:S.infect,
 q:'การศึกษา RCT เปรียบเทียบ Amoxicillin/Clavulanate กับ Cefixime ในการรักษา CAP พบว่า Relative Risk (RR) = 1.7 และ 95% CI: 1.3-2.45 ข้อใดต่อไปนี้แปลผลได้ถูกต้อง',
 a:'Amoxicillin/Clavulanate ดีกว่า Cefixime อย่างมีนัยสำคัญ',b:'Amoxicillin/Clavulanate ดีกว่า Cefixime แต่ไม่มีนัยสำคัญ',c:'Amoxicillin/Clavulanate ไม่แตกต่างจาก Cefixime',d:'Cefixime ดีกว่า Amoxicillin/Clavulanate อย่างมีนัยสำคัญ',e:'ยังสรุปไม่ได้',
 ans:'a',
 exp:'RR = 1.7 และ 95% CI ไม่ครอบ 1.0 (1.3-2.45) → แตกต่างอย่างมีนัยสำคัญ (significant) และ RR > 1 แปลว่า Amoxicillin/Clav เพิ่มความเสี่ยงต่อ outcome — ต้องดูว่า outcome คือ ADR หรือประสิทธิภาพ'},

{n:12, s:S.infect,
 q:'จากการทดลอง: Placebo เกิด 40 เหตุการณ์จาก 200 คน, Dapagliflozin เกิด 20 เหตุการณ์จาก 200 คน ค่า NNT (Number Needed to Treat) เท่ากับเท่าใด',
 a:'5',b:'10',c:'13',d:'20',e:'25',
 ans:'b',
 exp:'ARR = 40/200 − 20/200 = 0.20 − 0.10 = 0.10 (10%)\nNNT = 1/ARR = 1/0.10 = 10'},

{n:13, s:S.infect,
 q:'ผู้ป่วยหญิง COPD ที่ได้รับ Amoxicillin/Clavulanic acid 500 mg ทุก 8 ชั่วโมง นาน 3,000 mg/วัน ซึ่งสูงกว่าขนาดปกติ ข้อใดคือเหตุผลที่ถูกต้อง',
 a:'เพื่อเพิ่ม absorption',b:'เพื่อเอาชนะ MIC สูงของเชื้อดื้อยา',c:'เพื่อลด side effects',d:'เป็นขนาดปกติสำหรับ COPD exacerbation',e:'ลด protein binding',
 ans:'b',
 exp:'Beta-lactam ออกฤทธิ์แบบ time-dependent — การเพิ่มขนาดยาเพื่อเอาชนะ MIC ที่สูงขึ้นของเชื้อดื้อยา เช่น H. influenzae หรือ M. catarrhalis ใน COPD'},

// ─── SLE / HYDROXYCHLOROQUINE ──────────────────────────────────────────────
{n:14, s:S.immuno,
 q:'ผู้ป่วย SLE ที่ต้องการเริ่มใช้ Hydroxychloroquine (HCQ) ควรตรวจอะไรเป็น baseline ก่อนเริ่มยา',
 a:'Serum creatinine',b:'eGFR',c:'CBC',d:'Vision (Ophthalmologic exam)',e:'การทดสอบการได้ยิน',
 ans:'d',
 exp:'HCQ สะสมในจอตา (retina) ทำให้เกิด retinopathy ที่ไม่สามารถย้อนกลับได้ — ต้อง ophthalmologic exam ก่อนเริ่มยาและทุกปีหลังใช้ 5 ปี'},

{n:15, s:S.immuno,
 q:'ข้อใดเป็น absolute contraindication ของ Hydroxychloroquine',
 a:'ตั้งครรภ์',b:'ไตวาย',c:'เบาหวาน',d:'Retinal disease หรือ macular disease ที่มีอยู่เดิม',e:'ความดันโลหิตสูง',
 ans:'d',
 exp:'HCQ มี retinal toxicity — จึง absolute contraindicated ใน pre-existing retinal/macular disease HCQ ปลอดภัยในการตั้งครรภ์ (ไม่ใช่ CI)'},

{n:16, s:S.immuno,
 q:'Hydroxychloroquine ในผู้ป่วย SLE ใช้เป็นอะไร',
 a:'Rescue therapy เฉพาะตอน flare',b:'Background/maintenance therapy ใน SLE ทุก severity',c:'ใช้เฉพาะใน severe SLE',d:'ใช้แทน corticosteroid',e:'ใช้เฉพาะใน lupus nephritis',
 ans:'b',
 exp:'HCQ เป็น cornerstone therapy ใน SLE — ใช้ต่อเนื่องในทุก severity เพื่อลด disease activity, ป้องกัน flare, ลด organ damage และลด mortality'},

{n:17, s:S.immuno,
 q:'ข้อใดถูกต้องเกี่ยวกับการ monitoring ระหว่างใช้ Hydroxychloroquine',
 a:'ตรวจ Serum creatinine ทุก 3 เดือน',b:'ตรวจ eGFR ทุก 6 เดือน',c:'CBC ทุกเดือน',d:'Vision field test ทุกปีหลังใช้ยา 5 ปี (หรือเร็วกว่าถ้า high risk)',e:'ไม่ต้อง monitor ใดๆ',
 ans:'d',
 exp:'ACR 2016 guidelines: ophthalmologic monitoring ปีละ 1 ครั้งหลังใช้ยา 5 ปี (หรือก่อนหน้าถ้า renal/hepatic disease, high cumulative dose, ≥age 60)'},

{n:18, s:S.immuno,
 q:'ข้อใดกล่าว "ไม่ถูกต้อง" เกี่ยวกับการใช้ Hydroxychloroquine ใน SLE',
 a:'ใช้ร่วมกับ Methotrexate ได้',b:'ใช้ HCQ แทน Immunosuppressant ทุกชนิดได้',c:'ใช้ได้อย่างปลอดภัยในหญิงตั้งครรภ์ที่เป็น SLE',d:'ใช้ร่วมกับ Mycophenolate mofetil ได้',e:'ลดความเสี่ยง thrombosis ใน APS',
 ans:'b',
 exp:'HCQ ไม่สามารถแทน immunosuppressant (MMF, Azathioprine, Cyclophosphamide) ได้ในทุกกรณี — โดยเฉพาะ lupus nephritis class III/IV ต้องใช้ immunosuppressant'},

{n:19, s:S.immuno,
 q:'ยาใดต่อไปนี้เป็น classic cause ของ Drug-induced lupus (DIL)',
 a:'Enalapril',b:'Hydralazine',c:'Simvastatin',d:'Amlodipine',e:'Metformin',
 ans:'b',
 exp:'Drug-induced lupus: Hydralazine, Procainamide, Isoniazid (H-P-I) = classic triad ยาอื่นที่พบ: Minocycline, Anti-TNF agents'},

{n:20, s:S.immuno,
 q:'ผู้ป่วย SLE ที่มี antiphospholipid antibody positive ควรใช้การคุมกำเนิดแบบใด',
 a:'Combined oral contraceptive (COC)',b:'Progestin-only pill',c:'ไม่ต้องคุมกำเนิด',d:'ฉีด DMPA',e:'ใส่ห่วงอนามัย (IUD) ชนิดฮอร์โมน',
 ans:'b',
 exp:'SLE + APS → thrombosis risk สูง → ห้ามใช้ COC (estrogen เพิ่ม clot risk) — ใช้ Progestin-only, Copper IUD, หรือ barrier method แทน'},

// ─── CARDIOVASCULAR / HEART FAILURE ────────────────────────────────────────
{n:21, s:S.cardio,
 q:'ผู้ป่วย HF ที่มี LVEF 30% จัดอยู่ใน category ใด',
 a:'Acute heart failure',b:'Acute decompensated heart failure',c:'HFrEF (Heart failure with reduced ejection fraction)',d:'HFmrEF (Heart failure with mildly reduced EF)',e:'HFpEF (Heart failure with preserved EF)',
 ans:'c',
 exp:'HFrEF: LVEF < 40%; HFmrEF: LVEF 40-49%; HFpEF: LVEF ≥ 50% — LVEF 30% จึงเป็น HFrEF'},

{n:22, s:S.cardio,
 q:'Sacubitril/Valsartan (ARNI) ยับยั้ง Receptor ใดเป็นหลัก',
 a:'Block Angiotensin II receptor',b:'Block Neprilysin (NEP)',c:'Block Angiotensin converting enzyme',d:'Block Beta-adrenergic receptor',e:'Block Aldosterone receptor',
 ans:'b',
 exp:'Sacubitril = Neprilysin inhibitor (ยับยั้งการสลาย BNP, ANP) → เพิ่ม natriuretic peptides → vasodilation + natriuresis; Valsartan = ARB'},

{n:23, s:S.cardio,
 q:'ผู้ป่วย HFrEF ที่รับประทาน Enalapril (ACE inhibitor) อยู่ การเปลี่ยนเป็น Sacubitril/Valsartan ควรทำอย่างไร',
 a:'เปลี่ยนทันทีโดยไม่ต้องหยุด',b:'หยุด ACE inhibitor อย่างน้อย 36 ชั่วโมงก่อนเริ่ม ARNI',c:'เพิ่ม ARNI ควบคู่กับ ACE inhibitor',d:'เปลี่ยนเป็น Losartan ก่อนแล้วค่อยเปลี่ยนเป็น ARNI',e:'ไม่จำเป็นต้องหยุด ACE inhibitor',
 ans:'b',
 exp:'ต้องหยุด ACE inhibitor อย่างน้อย 36 ชั่วโมงก่อนเริ่ม ARNI เพื่อป้องกัน angioedema (เนื่องจากทั้งคู่เพิ่ม bradykinin)'},

{n:24, s:S.cardio,
 q:'Beta-blocker ใดต่อไปนี้ได้รับการรับรองสำหรับใช้ใน HFrEF',
 a:'Atenolol',b:'Bisoprolol',c:'Nebivolol',d:'Block Angiotensin receptor',e:'Propranolol',
 ans:'b',
 exp:'Beta-blockers ที่ approved ใน HFrEF (mortality benefit): Carvedilol, Bisoprolol, Metoprolol succinate (ER) — ต้องเริ่มขนาดต่ำ titrate ขึ้น'},

{n:25, s:S.cardio,
 q:'จากข้อมูล: Placebo เกิด composite endpoint 40 จาก 200 คน, Dapagliflozin เกิด 20 จาก 200 คน ค่า Absolute Risk Reduction (ARR) และ NNT คือเท่าใด',
 a:'ARR 5%, NNT 5',b:'ARR 10%, NNT 10',c:'ARR 13%, NNT 13',d:'ARR 20%, NNT 20',e:'ARR 25%, NNT 25',
 ans:'b',
 exp:'ARR = (40/200) − (20/200) = 0.20 − 0.10 = 0.10 = 10%\nNNT = 1/ARR = 1/0.10 = 10'},

{n:26, s:S.cardio,
 q:'การผลิต Digoxin tablet 0.25 mg ควรใช้กระบวนการใด เนื่องจากขนาดยาน้อยมาก',
 a:'Wet granulation',b:'Dry granulation (Slugging)',c:'Direct compression',d:'Compression',e:'Trituration',
 ans:'b',
 exp:'Digoxin ขนาดน้อย (0.25 mg) ไวต่อความร้อน/ชื้น — Dry granulation (slugging/roller compaction) หลีกเลี่ยงความร้อนและความชื้นในกระบวนการผลิต'},

{n:27, s:S.cardio,
 q:'ผู้ป่วย HFrEF มี fluid overload ควรเพิ่มยาใดก่อน',
 a:'เพิ่ม Furosemide (loop diuretic)',b:'เพิ่ม Spironolactone',c:'เพิ่ม Thiazide',d:'เพิ่ม Digoxin',e:'เพิ่ม Amlodipine',
 ans:'a',
 exp:'Loop diuretic (Furosemide) เป็น first-line สำหรับ fluid overload ใน HF — ลด preload, บรรเทาอาการบวม, หายใจหอบ'},

// ─── MUSCULOSKELETAL / OSTEOPOROSIS ────────────────────────────────────────
{n:28, s:S.msk,
 q:'T-score เท่าใดที่วินิจฉัย Osteoporosis ตาม WHO criteria',
 a:'T-score ≤ −1.0',b:'T-score ≤ −2.5',c:'T-score ≤ −3.0',d:'T-score ≤ −1.5',e:'T-score ≤ −2.0',
 ans:'b',
 exp:'WHO criteria: T-score ≥ −1.0 = Normal; −1.0 ถึง −2.5 = Osteopenia; ≤ −2.5 = Osteoporosis; ≤ −2.5 + fragility fracture = Severe osteoporosis'},

{n:29, s:S.msk,
 q:'คำแนะนำที่ถูกต้องสำหรับการรับประทาน Alendronate คือข้อใด',
 a:'รับประทานตอนเช้ากับน้ำเปล่า 200 mL ก่อนอาหาร 30 นาที นั่งตัวตรงอย่างน้อย 30 นาที',b:'รับประทานพร้อมอาหารเพื่อลด GI irritation',c:'ดื่มนมพร้อมยาเพื่อเพิ่ม calcium',d:'รับประทานก่อนนอน',e:'รับประทานได้ตลอดเวลา',
 ans:'a',
 exp:'Bisphosphonate: ต้องรับประทาน upright position กับน้ำเปล่า 200 mL ก่อนอาหาร 30 นาที นั่งตัวตรงอย่างน้อย 30 นาทีหลังกิน — ป้องกัน esophageal ulcer'},

{n:30, s:S.msk,
 q:'ผู้ป่วยหญิงอายุ 70 ปี T-score −2.9 ที่ lumbar spine ควรได้รับยาใดเป็น first-line',
 a:'Calcium + Vitamin D เท่านั้น',b:'Calcitonin',c:'Alendronate',d:'Estrogen',e:'Teriparatide',
 ans:'c',
 exp:'Alendronate (bisphosphonate) = first-line pharmacotherapy สำหรับ osteoporosis ที่ลด vertebral, hip fracture risk ได้ดีที่สุด'},

{n:31, s:S.msk,
 q:'ผู้ป่วยกินยา Alendronate 70 mg ทุกสัปดาห์ อาการไม่พึงประสงค์ใดต่อไปนี้ "ไม่ใช่" ผลจาก Alendronate',
 a:'Esophageal ulcer',b:'Bradykinesia',c:'Osteonecrosis of the jaw (ONJ)',d:'Atrial fibrillation',e:'Atypical femur fracture',
 ans:'b',
 exp:'Bradykinesia = อาการของ Parkinson\'s disease ไม่ใช่ ADR ของ Bisphosphonate — ADR จริง: GI, ONJ, AFib, atypical fracture, hypocalcemia'},

{n:32, s:S.pharma,
 q:'ข้อใดต่อไปนี้เป็น excipient ที่เหมาะสมที่สุดสำหรับการผลิต tablet แบบ Direct compression',
 a:'Starch',b:'PVP (Povidone)',c:'HPMC',d:'Lactose monohydrate',e:'Microcrystalline cellulose (MCC)',
 ans:'e',
 exp:'MCC (Avicel) = ideal excipient สำหรับ direct compression เพราะมี good compressibility, flowability, เป็นทั้ง diluent และ binder ในตัว'},

{n:33, s:S.pharma,
 q:'การผลิต Furosemide tablet แบบ direct compression ต้องใช้ diluent ชนิดใด',
 a:'Starch',b:'Colloidal silicon dioxide',c:'Spray dried lactose',d:'Talc',e:'Microcrystalline cellulose',
 ans:'c',
 exp:'Spray dried lactose มี good flowability และ compressibility เหมาะสำหรับ direct compression (ต่างจาก regular lactose ที่ต้องทำ granulation)'},

{n:34, s:S.pharma,
 q:'สูตรตำรับ Furosemide tablet ที่มี Microcrystalline cellulose, Lactose, PVP, Colloidal silicon dioxide, Magnesium stearate — สารใดทำหน้าที่เป็น Disintegrant',
 a:'PVP',b:'Lactose',c:'Colloidal silicon dioxide',d:'Sodium starch glycolate',e:'Magnesium stearate',
 ans:'d',
 exp:'Sodium starch glycolate (Explotab) = superdisintegrant อย่างไรก็ตามถ้าไม่มีในสูตร อาจใช้ Starch หรือ Croscarmellose sodium แทน'},

// ─── HEMATOLOGY / G6PD ─────────────────────────────────────────────────────
{n:35, s:S.hemo,
 q:'ผู้ป่วย G6PD deficiency มาพบแพทย์ด้วยอาการ jaundice ยาใดต่อไปนี้น่าจะเป็นสาเหตุ',
 a:'Amoxicillin',b:'Chlorpheniramine (CPM)',c:'Paracetamol',d:'Ofloxacin',e:'HCTZ',
 ans:'d',
 exp:'Ofloxacin (fluoroquinolone) สามารถทำให้เกิด hemolysis ใน G6PD — ยาที่ต้องระวัง: Primaquine, Dapsone, Nitrofurantoin, Quinolones, Sulfonamides'},

{n:36, s:S.hemo,
 q:'ผู้ป่วย G6PD ที่ได้รับยา Chlorpheniramine (CPM) + Paracetamol น่าจะเกิด hemolytic anemia เมื่อใด',
 a:'ทันทีหลังรับยา',b:'1 ชั่วโมงหลังรับยา',c:'1 วันหลังรับยา',d:'3-7 วันหลังเริ่มยา',e:'หลังหยุดยา 2 สัปดาห์',
 ans:'d',
 exp:'Hemolytic anemia ใน G6PD มักเกิด 1-3 วันหลังเริ่มยา (บางตำรายืนยัน 3-7 วัน) peak ที่ ~7-10 วัน แล้ว recover หลังหยุดยา'},

{n:37, s:S.hemo,
 q:'วันที่ 2 ผู้ป่วย G6PD ได้รับ Ofloxacin แล้วเกิด hemolysis วันที่ 3 วันที่ 3 มีอาการเหลือง วันที่ 7 ถ้าหยุดยา Ofloxacin ควร recheck CBC เมื่อใด',
 a:'20 ชั่วโมงหลังหยุดยา',b:'2 วันหลังหยุดยา',c:'1 วันหลังหยุด Ofloxacin',d:'5 วันหลังหยุดยา',e:'3 วันหลังหยุดยา',
 ans:'c',
 exp:'หลังหยุดยาที่ก่อ hemolysis ควร recheck CBC เพื่อดูการฟื้นตัว (reticulocytosis จะเพิ่มขึ้นก่อน) — 1 วันหลังหยุดยาเป็น time point ที่เหมาะสม'},

{n:38, s:S.hemo,
 q:'กลไกของ hemolytic anemia ใน G6PD deficiency คืออะไร',
 a:'Oxidative hemolysis',b:'Immune-mediated hemolysis',c:'Mechanical hemolysis',d:'Osmotic hemolysis',e:'Autoimmune hemolysis',
 ans:'a',
 exp:'G6PD สร้าง NADPH → protect RBC จาก oxidative stress — G6PD ขาด → NADPH ลด → oxidative damage → Heinz bodies → hemolysis'},

// ─── PHARMACEUTICAL ANALYSIS ───────────────────────────────────────────────
{n:39, s:S.pharma,
 q:'สารใน Inactive ingredient ของ Ciprofloxacin Ophthalmic solution ข้อใดต่อไปนี้คือ Hydrochloric acid ใช้ทำอะไร',
 a:'Antioxidant',b:'Non-aqueous solvent',c:'Adjust pH',d:'Preservative',e:'Viscosity enhancer',
 ans:'c',
 exp:'Hydrochloric acid ใช้ปรับ pH ของ ophthalmic solution ให้อยู่ในช่วง 6.5-7.4 ซึ่งเหมาะสมสำหรับตา'},

{n:40, s:S.pharma,
 q:'USP monograph ของ Ofloxacin Tablets กำหนด test ใดต่อไปนี้',
 a:'LA-HPLC: NMT 110%',b:'ASSAY: Liquid chromatography',c:'Dissolution: ไม่น้อยกว่า 80% ใน 30 นาที',d:'Uniformity of dosage unit ไม่ใช้กับ tablet',e:'Impurity: ≤ 0.5%',
 ans:'b',
 exp:'USP Ofloxacin Tablets: ASSAY ใช้ Liquid chromatography (HPLC) — Dissolution test ≥ 80% Q ใน 30 นาที — Uniformity of dosage unit ใช้กับ tablet ได้'},

{n:41, s:S.pharma,
 q:'จากโครงสร้างเคมีที่แสดง สารใดต่อไปนี้เป็น Tropane alkaloid',
 a:'Hydrochlorothiazide',b:'Chlorthalidone',c:'Spironolactone',d:'Mannitol',e:'Furosemide',
 ans:'c',
 exp:'Tropane alkaloid มี bicyclic nitrogen-containing ring structure เช่น Atropine, Cocaine, Scopolamine — ต้องดูโครงสร้างในโจทย์'},

{n:42, s:S.msk,
 q:'ผู้ป่วย osteoporosis ที่มี T-score −2.5 ในกรณีใด T-score −2.5 ถือว่าเป็น very high risk fracture',
 a:'Osteopenia',b:'Osteoporosis Very High Risk',c:'Normal',d:'Severe osteoporosis',e:'Osteoporosis',
 ans:'b',
 exp:'T-score ≤ −2.5 + prior fragility fracture หรือ multiple risk factors = very high risk — AACE กำหนด very high risk เพื่อพิจารณา anabolic therapy (Teriparatide, Romosozumab)'},

// ─── PHARMACEUTICAL ANALYSIS (Titration) ──────────────────────────────────
{n:43, s:S.pharma,
 q:'การวิเคราะห์ Calcium carbonate โดย USP ใช้วิธี titration ใด',
 a:'Precipitation titration',b:'Non-aqueous acid-base titration',c:'Complexometric titration',d:'Residual titration',e:'Redox titration',
 ans:'c',
 exp:'Calcium carbonate → วิเคราะห์ด้วย Complexometric titration (EDTA method) ใช้ Eriochrome black T หรือ Calcon เป็น indicator — EDTA chelates Ca²⁺'},

{n:44, s:S.pharma,
 q:'จาก pharmacokinetic parameter ของ Alendronate ข้อใดต่อไปนี้ถูกต้อง',
 a:'Bioavailability สูง > 50%',b:'Tmax สั้น (~1 ชั่วโมง)',c:'Half-life สั้น 2-3 ชั่วโมง',d:'ดูดซึมดีเมื่อรับประทานพร้อมอาหาร',e:'ขับถ่ายทาง hepatic metabolism',
 ans:'b',
 exp:'Alendronate: bioavailability < 1%, Tmax ~1 ชั่วโมง, ขับทางไตในรูปยาไม่เปลี่ยนแปลง, ดูดซึมลดลงถ้ารับประทานพร้อมอาหาร'},

{n:45, s:S.pharma,
 q:'USP monograph ของ Calcium carbonate สำหรับ Alendronate Titration กำหนด Acceptance criteria ข้อใดต่อไปนี้',
 a:'97.0-103.0%',b:'95.0-105.0%',c:'98.5-101.5%',d:'90.0-110.0%',e:'99.0-101.0%',
 ans:'c',
 exp:'USP: Calcium carbonate ≥ 98.5% และ ≤ 101.5% calculated on the dried basis'},

{n:46, s:S.pharma,
 q:'การตรวจหา Calcium carbonate ด้วย Complexometric titration — ขั้นตอนใดต่อไปนี้ถูกต้อง',
 a:'ละลายใน NaOH',b:'Titrate ด้วย HCl',c:'ใช้ EDTA เป็น titrant กับ indicator Eriochrome black T',d:'ใช้ KMnO₄ เป็น titrant',e:'ละลายใน ethanol',
 ans:'c',
 exp:'Complexometric (EDTA) titration: ละลาย CaCO₃ ใน HCl เจือจาง, adjust pH 12-13 ด้วย NaOH, titrate ด้วย 0.05M EDTA กับ Calcon indicator'},

// ─── ALENDRONATE EFFERVESCENT / AKI ───────────────────────────────────────
{n:47, s:S.pharma,
 q:'Alendronate effervescent tablet ใช้กระบวนการ granulation แบบใด',
 a:'Wet granulation ด้วยน้ำ',b:'Wet granulation ด้วย alcohol',c:'Dry granulation',d:'Hot melt extrusion',e:'Spray drying',
 ans:'c',
 exp:'Alendronate + effervescent excipient (citric acid, sodium bicarbonate) ไวต่อความชื้น → ต้องใช้ dry granulation หลีกเลี่ยงน้ำ'},

{n:48, s:S.clinic,
 q:'ผู้ป่วย Serum creatinine (SCr) เพิ่มขึ้น 1 mg/dL ภายใน 48 ชั่วโมง Baseline SCr = 1.0 mg/dL ตาม KDIGO 2012 นี้คือ Acute Kidney Injury (AKI) stage ใด',
 a:'AKI Stage 0',b:'AKI Stage 1',c:'AKI Stage 2',d:'AKI Stage 3',e:'Chronic Kidney Disease',
 ans:'b',
 exp:'KDIGO 2012 AKI Stage 1: SCr เพิ่ม ≥ 0.3 mg/dL ใน 48 ชั่วโมง หรือเพิ่ม ≥ 1.5× baseline ใน 7 วัน หรือ UO < 0.5 ml/kg/hr นาน > 6 ชั่วโมง'},

{n:49, s:S.clinic,
 q:'ผู้ป่วยที่มี AKI Stage 1 และรับ Enalapril อยู่ ควรทำอย่างไร',
 a:'หยุด Enalapril ชั่วคราว',b:'เพิ่มขนาด Enalapril',b:'เปลี่ยนเป็น Losartan',c:'ไม่ต้องทำอะไร',d:'เพิ่ม Furosemide',
 ans:'a',
 exp:'ACE inhibitor (Enalapril) ลด GFR → ไม่เหมาะใน AKI ระยะเฉียบพลัน → หยุดชั่วคราวและ recheck renal function หลัง AKI resolve'},

{n:50, s:S.pharma,
 q:'โครงสร้างสารประกอบในโจทย์เป็น Quaternary ammonium compound ลักษณะใด',
 a:'Tertiary amine',b:'Primary amine',c:'Flavonoid',d:'Quaternary ammonium',e:'Tertiary alcohol',
 ans:'d',
 exp:'Quaternary ammonium compound มี 4 substituents บน nitrogen (N+) — ประจุบวกถาวร ไม่ขึ้นกับ pH — ตัวอย่าง: Benzalkonium chloride, Cetrimide'},

// ─── PSYCHIATRIC / TOBACCO CESSATION ──────────────────────────────────────
{n:51, s:S.psych,
 q:'ผู้ป่วยหญิงอายุ 30-40 ปี มารับการตรวจในคลินิก แพทย์สั่งยา contact lens แล้วมีปัญหา medication error ข้อใดในระบบ NCC MERP ที่เหมาะสม',
 a:'Category A',b:'Category B',c:'Category C',d:'Category D',e:'Category E',
 ans:'b',
 exp:'NCC MERP Category B = ความผิดพลาดเกิดขึ้นแต่ไม่ถึงผู้ป่วย (error occurred, did not reach patient) ไม่ก่อให้เกิดอันตราย'},

{n:52, s:S.psych,
 q:'ยาใดต่อไปนี้เป็น first-line pharmacotherapy สำหรับการเลิกบุหรี่',
 a:'Nicotine gum',b:'Varenicline',c:'Bupropion',d:'Cytisine',e:'Nortriptyline',
 ans:'b',
 exp:'Varenicline (Chantix/Champix) = partial agonist ที่ nicotinic acetylcholine receptor → ลด craving และ withdrawal symptoms — meta-analysis แสดงว่า varenicline ดีกว่า bupropion และ NRT'},

{n:53, s:S.psych,
 q:'ผู้ป่วยที่ยังไม่ได้ตั้งใจเลิกบุหรี่ในอีก 6 เดือนข้างหน้า อยู่ใน Stage ใด ของ Transtheoretical Model (Stages of change)',
 a:'Precontemplation',b:'Contemplation',c:'Preparation',d:'Action',e:'Maintenance',
 ans:'a',
 exp:'Precontemplation: ไม่มีความตั้งใจเปลี่ยนแปลงพฤติกรรมในอีก 6 เดือน; Contemplation: คิดจะเปลี่ยนใน 6 เดือน; Preparation: วางแผนเปลี่ยนใน 30 วัน'},

{n:54, s:S.pharma,
 q:'Nicotine transdermal patch โครงสร้างชั้น Backing layer ทำหน้าที่อะไร',
 a:'Reservoir system ของยา',b:'Matrix system',c:'ชั้นสัมผัสผิวหนัง',d:'ชั้นปิดด้านนอก ป้องกันการสูญเสียยาและน้ำ',e:'Backing liner',
 ans:'d',
 exp:'Backing layer = ชั้นนอกสุดของ transdermal patch ทำจาก polymer/metal foil ป้องกันการสูญเสียยาด้านนอก กันน้ำ และเป็นรูปทรงของ patch'},

{n:55, s:S.pharma,
 q:'Nicotine transdermal patch ชนิด Matrix system ข้อใดถูกต้อง',
 a:'มี Reservoir ยาแยกต่างหาก',b:'ยาผสมอยู่ใน polymer matrix โดยตรง',c:'ควบคุมการปล่อยด้วย membrane',d:'ปล่อยยาเร็วกว่า reservoir system',e:'ต้องการ rate-controlling membrane',
 ans:'b',
 exp:'Matrix system: ยาผสมอยู่ใน polymer matrix โดยตรง → diffusion ออกจาก matrix — ต่างจาก Reservoir system ที่มียาอยู่ใน reservoir + rate-controlling membrane'},

// ─── NEUROLOGY / GI ────────────────────────────────────────────────────────
{n:56, s:S.gi,
 q:'ผู้ป่วยหญิงอายุ 55 ปี มี H. pylori ตรวจโดย Urea breath test positive วิธีรักษาใดเหมาะสมที่สุดในปัจจุบัน',
 a:'Antacid + PPI',b:'PPI monotherapy',c:'PPI-based triple therapy (PPI + Amoxicillin + Clarithromycin)',d:'High dose antibiotic',e:'H2RA + probiotic',
 ans:'c',
 exp:'H. pylori standard treatment: PPI-based triple therapy 14 วัน = PPI + Amoxicillin 1g BD + Clarithromycin 500mg BD — eradication rate ~80-85%'},

{n:57, s:S.gi,
 q:'ถ้า Clarithromycin resistance ≥ 15% ในพื้นที่ ควรเปลี่ยน H. pylori regimen เป็นอะไร',
 a:'เปลี่ยน Clarithromycin เป็น Ampicillin',b:'เปลี่ยน Clarithromycin เป็น Amoxicillin',c:'เปลี่ยน Clarithromycin เป็น Doxycycline/Tetracycline',d:'เพิ่มขนาด Clarithromycin',e:'ไม่ต้องเปลี่ยน',
 ans:'c',
 exp:'Clarithromycin resistance สูง → ใช้ Bismuth quadruple therapy (PPI + Bismuth + Tetracycline + Metronidazole) หรือ Levofloxacin-based therapy'},

{n:58, s:S.neuro,
 q:'Phenobarbital ผลข้างเคียงใดต่อไปนี้ "ไม่ใช่" ของ Phenobarbital',
 a:'Sedation/drowsiness',b:'Hyperactivity ในเด็ก',c:'Peripheral edema',d:'Hyponatremia',e:'Osteomalacia (ใช้ระยะยาว)',
 ans:'e',
 exp:'Phenobarbital side effects: sedation, cognitive impairment, hyperactivity (children), Stevens-Johnson syndrome, osteomalacia (ใช้นาน) — แต่ Hyponatremia เป็น ADR ของ Carbamazepine ไม่ใช่ Phenobarbital'},

{n:59, s:S.neuro,
 q:'ยา AED ใดต่อไปนี้มีแนวโน้มทำให้น้ำหนักเพิ่มมากที่สุด',
 a:'Phenytoin',b:'Valproic acid',c:'Lamotrigine',d:'Topiramate',e:'Zonisamide',
 ans:'b',
 exp:'Valproic acid ทำให้น้ำหนักเพิ่มมากที่สุดในบรรดา AED — mechanism: เพิ่ม appetite, ยับยั้ง beta-oxidation; ส่วน Topiramate/Zonisamide ทำให้น้ำหนักลด'},

{n:60, s:S.neuro,
 q:'Carbamazepine ทำให้เกิด ADR ใดต่อไปนี้บ่อยที่สุดเมื่อใช้ระยะยาว',
 a:'Agranulocytosis',b:'Hepatomegaly',c:'Pancytopenia',d:'Peripheral edema',e:'Hyponatremia (SIADH)',
 ans:'e',
 exp:'Carbamazepine → SIADH → Hyponatremia พบได้บ่อย โดยเฉพาะในผู้สูงอายุ ต้อง monitor serum Na+ ระหว่างการรักษา'},

// ─── GI / ONCOLOGY ─────────────────────────────────────────────────────────
{n:61, s:S.pharma,
 q:'Diazepam rectal suppository ที่ใช้ Polyethylene glycol (PEG) molecular weight ต่ำ เป็น base ประเภทใด',
 a:'Oleaginous base',b:'Water soluble base',c:'Water removable base',d:'Emulsion base',e:'Absorption base',
 ans:'b',
 exp:'PEG (Polyethylene glycol) = water-soluble base ละลายน้ำได้ ไม่ต้องการ body heat ในการหลอมละลาย เหมาะกับยาที่ไม่ชอบน้ำ'},

{n:62, s:S.pharma,
 q:'การตรวจ dissolution สำหรับ Diazepam rectal suppository อุปกรณ์ใดเหมาะสม',
 a:'Apparatus 1 (Basket)',b:'Apparatus 2 (Paddle)',c:'Apparatus 3 (Reciprocating cylinder)',d:'Apparatus 4 (Flow-through cell)',e:'Apparatus 5',
 ans:'c',
 exp:'Suppository dissolution: USP Apparatus 3 (Reciprocating cylinder) หรือ modified paddle — บางตำราใช้ Apparatus 2 ที่อุณหภูมิ 37°C'},

{n:63, s:S.gi,
 q:'ยาใดต่อไปนี้ไม่ควรใช้รักษา H. pylori เนื่องจากมีอัตราดื้อยาสูงในปัจจุบัน',
 a:'Amoxicillin',b:'Tetracycline',c:'Metronidazole (เดี่ยว)',d:'Bismuth',e:'PPI',
 ans:'c',
 exp:'Metronidazole เดี่ยว = ดื้อยาสูงมาก ไม่ควรใช้เป็น monotherapy แต่ใช้ร่วมใน bismuth quadruple therapy ได้เพราะ bismuth มี synergistic effect'},

{n:64, s:S.gi,
 q:'ผู้ป่วยที่ไม่สามารถใช้ Clarithromycin ได้ (แพ้ยา) ควรใช้ H. pylori regimen ใด',
 a:'PPI + Amoxicillin + Clarithromycin',b:'PPI + Amoxicillin + Metronidazole (Metronidazole-based triple therapy)',c:'PPI เดี่ยว',d:'Amoxicillin + Doxycycline',e:'ไม่รักษา',
 ans:'b',
 exp:'Clarithromycin allergy → ใช้ PPI + Amoxicillin + Metronidazole หรือ Bismuth quadruple therapy (PPI + Bismuth + Tetracycline + Metronidazole)'},

{n:65, s:S.gi,
 q:'Proton Pump Inhibitor (PPI) มีผลข้างเคียงระยะยาวใดที่ต้องระวัง',
 a:'Agranulocytosis',b:'Home-related adverse effects',c:'เพิ่มความเสี่ยง Clostridium difficile infection',d:'Pneumonia',e:'Hypercalcemia',
 ans:'c',
 exp:'Long-term PPI: เพิ่มความเสี่ยง C. difficile, Mg²⁺ deficiency, Vitamin B12 deficiency, Hip fracture (ใช้นานมาก), Community-acquired pneumonia'},

{n:66, s:S.infect,
 q:'Cotrimoxazole (TMP-SMX) ใช้รักษาโรคใดในผู้ป่วย HIV เป็นหลัก',
 a:'MAC (Mycobacterium avium complex)',b:'Pneumocystis jirovecii pneumonia (PCP) prophylaxis/treatment',c:'CMV retinitis',d:'Cryptococcal meningitis',e:'Toxoplasma',
 ans:'b',
 exp:'Cotrimoxazole = drug of choice สำหรับ PCP (Pneumocystis jirovecii pneumonia) ทั้ง prophylaxis (CD4 < 200) และ treatment — ยังใช้ป้องกัน Toxoplasma ด้วย'},

// ─── ONCOLOGY ──────────────────────────────────────────────────────────────
{n:67, s:S.hemo,
 q:'กลไกการออกฤทธิ์ของ Doxorubicin (Anthracycline) คือข้อใด',
 a:'ยับยั้ง purine base guanine ใช้ adenine',b:'ยับยั้ง tyrosine kinase',c:'ยับยั้ง pyrimidine analogue',d:'ยับยั้ง Topoisomerase II',e:'ยับยั้ง dihydrofolate reductase',
 ans:'d',
 exp:'Doxorubicin: intercalates DNA + inhibits Topoisomerase II → DNA double strand breaks → cell death; ยัง generate free radicals → cardiotoxicity'},

{n:68, s:S.hemo,
 q:'AC regimen (Doxorubicin 60 mg/m² + Cyclophosphamide 600 mg/m²) สำหรับผู้ป่วย BSA 1.4 m² ขนาด Doxorubicin ที่ได้รับ',
 a:'85 mg',b:'120 mg',c:'860 mg',d:'1,200 mg',e:'3,900 mg',
 ans:'a',
 exp:'Doxorubicin = 60 mg/m² × 1.4 m² = 84 mg ≈ 85 mg (round ตามโจทย์); Cyclophosphamide = 600 × 1.4 = 840 mg'},

{n:69, s:S.hemo,
 q:'Antiemetic regimen สำหรับ Highly Emetogenic Chemotherapy (HEC) ที่ถูกต้องคือข้อใด',
 a:'Progestin-only pill',b:'Ondansetron + Aprepitant + Dexamethasone',c:'Ondansetron + Dexamethasone เท่านั้น',d:'Granisetron เดี่ยว',e:'Dolasetron เดี่ยว',
 ans:'b',
 exp:'HEC (Cisplatin, AC regimen): Triple antiemetic = 5HT3 antagonist (Ondansetron/Granisetron) + NK1 antagonist (Aprepitant) + Dexamethasone — NCCN guidelines'},

// ─── PULMONARY / COPD ──────────────────────────────────────────────────────
{n:70, s:S.pulm,
 q:'ผู้ป่วย COPD ที่ใช้ Tiotropium Handihaler 18 mcg/วัน อยู่ใน GOLD stage ใด',
 a:'GOLD 1 (Mild)',b:'GOLD 2 (Moderate)',c:'GOLD 3 (Severe)',d:'GOLD 4 (Very severe)',e:'ไม่สามารถระบุได้',
 ans:'b',
 exp:'GOLD 2 (Moderate): FEV1 50-79% predicted — LAMA (Tiotropium) เป็น first-line ใน GOLD 2 ที่มีอาการ หรือ GOLD B/E'},

{n:71, s:S.pulm,
 q:'ข้อใดต่อไปนี้กล่าว "ไม่ถูกต้อง" เกี่ยวกับ LAMA (Tiotropium) ใน COPD',
 a:'บรรเทาอาการได้น้อยกว่า SABA ใน acute bronchospasm',b:'ลด exacerbation ได้ดีกว่า LABA',c:'ออกฤทธิ์ยาวนาน 24 ชั่วโมง',d:'เป็น M3 muscarinic antagonist',e:'ใช้เป็น maintenance therapy',
 ans:'a',
 exp:'LAMA เป็น maintenance therapy ไม่ใช่ rescue drug — ใน acute bronchospasm ใช้ SABA (Salbutamol) ซึ่งออกฤทธิ์เร็วกว่า — แต่ LAMA ไม่ได้บรรเทาน้อยกว่าในระยะยาว'},

{n:72, s:S.pulm,
 q:'ผู้ป่วย COPD GOLD 2 กลุ่ม B ยาใดเป็น first-line maintenance therapy',
 a:'LAMA หรือ LABA เดี่ยว',b:'ICS/LABA combination',c:'Triple therapy (ICS + LAMA + LABA)',d:'SABA + SAMA',e:'Theophylline',
 ans:'a',
 exp:'GOLD 2024: กลุ่ม B → เริ่มด้วย LAMA หรือ LABA เดี่ยว; ถ้า GOLD E (≥2 exacerbations) → เพิ่ม ICS'},

{n:73, s:S.pulm,
 q:'ผลข้างเคียงของ Tiotropium ที่ "ไม่ควร" เกิดจาก anticholinergic mechanism',
 a:'Dry mouth',b:'Urinary retention',c:'Constipation',d:'Diabetes mellitus',e:'Blurred vision',
 ans:'d',
 exp:'Anticholinergic ADR: dry mouth, urinary retention, constipation, blurred vision, tachycardia, confusion — Diabetes mellitus ไม่ใช่ anticholinergic effect'},

{n:74, s:S.pulm,
 q:'ผู้ป่วย COPD ที่ใช้ Tiotropium อยู่แต่ยังมี exacerbation ≥2 ครั้ง/ปี ควรเพิ่มยาใด',
 a:'SABA เพิ่ม',b:'เพิ่ม ICS/LABA (เป็น triple therapy)',c:'เปลี่ยนเป็น Theophylline',d:'หยุด LAMA เปลี่ยนเป็น LABA',e:'ไม่ต้องเพิ่ม',
 ans:'b',
 exp:'COPD escalation: LAMA + ICS/LABA = triple therapy (LAMA + ICS + LABA) ลด exacerbation ในผู้ป่วยที่มี eosinophil สูงหรือ exacerbation บ่อย'},

// ─── STRUCTURE IDENTIFICATION / MUSCARINICS ────────────────────────────────
{n:75, s:S.pharma,
 q:'จากโครงสร้างเคมีที่แสดง สารประกอบชนิดนี้จัดเป็น Alkaloid ประเภทใด',
 a:'Isoquinoline alkaloid',b:'Indole alkaloid',c:'Tropane alkaloid',d:'Purine alkaloid',e:'Steroidal alkaloid',
 ans:'c',
 exp:'Tropane alkaloid มี bicyclic ring system (N-methyl piperidine ring fused with cyclopentane) — ตัวอย่าง: Atropine, Scopolamine, Hyoscyamine, Cocaine'},

{n:76, s:S.neuro,
 q:'โครงสร้างที่แสดงเป็นยาที่ออกฤทธิ์เป็น Muscarinic receptor antagonist ยาใดต่อไปนี้ที่มีกลไกนี้',
 a:'Atenolol',b:'Prazosin',c:'Amlodipine',d:'Ipratropium (Tiotropium)',e:'Metformin',
 ans:'d',
 exp:'Tiotropium/Ipratropium = M3 muscarinic receptor antagonist → bronchodilation — ใช้ใน COPD และ asthma (เป็น anticholinergic bronchodilator)'},

// ─── PARASITIC / INFECTIOUS ────────────────────────────────────────────────
{n:77, s:S.infect,
 q:'ยาใดเป็น first-line สำหรับ Ascariasis (พยาธิไส้เดือน)',
 a:'Albendazole',b:'Mebendazole',c:'Niclosamide',d:'Praziquantel',e:'Ivermectin',
 ans:'a',
 exp:'Albendazole 400 mg single dose = first-line สำหรับ Ascariasis (และ hookworm, trichuris) — Mebendazole ก็ใช้ได้ แต่ Albendazole preferred'},

{n:78, s:S.infect,
 q:'ยาใดใช้รักษา Taenia (พยาธิตัวตืด) ได้ผลดีที่สุด',
 a:'Albendazole',b:'Praziquantel',c:'Niclosamide',d:'Mebendazole',e:'Ivermectin',
 ans:'b',
 exp:'Praziquantel = drug of choice สำหรับ Cestode (Taenia saginata, T. solium) และ Trematode (Schistosoma, Clonorchis) ทุกชนิด'},

{n:79, s:S.infect,
 q:'กลไกของ Albendazole ในการฆ่าพยาธิคืออะไร',
 a:'ยับยั้ง acetylcholinesterase',b:'ทำให้กล้ามเนื้อพยาธิหดเกร็ง',c:'ยับยั้ง tubulin polymerization → microtubule disruption',d:'เพิ่ม Cl- influx → hyperpolarization',e:'ยับยั้ง dihydrofolate reductase',
 ans:'c',
 exp:'Benzimidazoles (Albendazole, Mebendazole): ยับยั้ง beta-tubulin polymerization → ทำลาย microtubule → ยับยั้งการดูดซึม glucose ของพยาธิ → ตาย'},

// ─── OPHTHALMOLOGY / CIPROFLOXACIN OPHTHALMIC ─────────────────────────────
{n:80, s:S.pharma,
 q:'ข้อใดถูกต้องเกี่ยวกับ Ciprofloxacin ophthalmic solution',
 a:'ต้องเป็น sterile product',b:'ไม่ต้อง isotonic',c:'pH ไม่สำคัญ',d:'ไม่ต้อง preservative',e:'สามารถมี particulate matter ได้บ้าง',
 ans:'a',
 exp:'Ophthalmic preparation: ต้องเป็น sterile, isotonic (~280-320 mOsm), pH เหมาะสม (6.5-7.4), preservative-free หรือมี preservative ถ้า multi-dose'},

{n:81, s:S.infect,
 q:'Ciprofloxacin ophthalmic solution ใช้รักษาโรคตาชนิดใด',
 a:'Allergic conjunctivitis',b:'Bacterial conjunctivitis',c:'Viral conjunctivitis',d:'Hordeolum (กุ้งยิง)',e:'Trachoma',
 ans:'b',
 exp:'Ciprofloxacin ophthalmic = fluoroquinolone ต้านเชื้อ Gram-positive และ Gram-negative → ใช้รักษา bacterial conjunctivitis, keratitis (กระจกตาอักเสบจากเชื้อ)'},

{n:82, s:S.pharma,
 q:'ข้อใดต่อไปนี้ "ไม่ใช่" คุณสมบัติที่ต้องการของ ophthalmic solution',
 a:'Sterility',b:'Isotonicity',c:'Appropriate pH',d:'Viscosity enhancer ทุกสูตร',e:'Preserved หรือ preservative-free',
 ans:'d',
 exp:'Ophthalmic solution ไม่จำเป็นต้องมี viscosity enhancer ทุกสูตร — มีเฉพาะสูตรที่ต้องการเพิ่ม contact time เช่น eye drops ที่ใส่ยาก'},

{n:83, s:S.pharma,
 q:'Ciprofloxacin ophthalmic solution ใช้ buffer ประเภทใดในสูตรตำรับ',
 a:'Phosphate',b:'Borate',c:'Citrate',d:'Carbonate',e:'Acetate',
 ans:'a',
 exp:'Phosphate buffer ใช้บ่อยที่สุดใน ophthalmic preparation เพราะ compatible กับ eye tissue และรักษา pH ได้ดีในช่วง 6-8'},

{n:84, s:S.pharma,
 q:'USP Ciprofloxacin ophthalmic solution ASSAY กำหนด Acceptance criteria ข้อใด',
 a:'LA-HPLC: NMT 110%',b:'ASSAY: Liquid chromatography',c:'Dissolution: ≥ 80% Q ใน 30 นาที',d:'Uniformity of dosage unit ไม่ใช้กับ solution',e:'Impurity: ≤ MAT 0.3%',
 ans:'d',
 exp:'Uniformity of dosage unit ใช้กับ solid dosage form (tablet, capsule) ไม่ใช่ solution — สำหรับ ophthalmic solution ใช้ ASSAY, pH, Sterility, Particulate matter'},

{n:85, s:S.pharma,
 q:'USP Ciprofloxacin ophthalmic solution กำหนด Relative Standard Deviation (RSD) ของ ASSAY ไม่เกินเท่าใด',
 a:'NMT 5% (inorganic impurities)',b:'NMT 2%',c:'NMT 10%',d:'NMT 0.5%',e:'NMT 15%',
 ans:'a',
 exp:'Standard deviation สำหรับ ophthalmic ASSAY: Relative standard deviation NMT 5% (ตาม USP Ciprofloxacin Ophthalmic Solution monograph)'},

{n:86, s:S.pharma,
 q:'การคำนวณ % assay ของ Ciprofloxacin ophthalmic solution: Acceptance criteria ตาม USP คือ',
 a:'90.0-110.0%',b:'95.0-105.0%',c:'90.0-115.0%',d:'98.0-102.0%',e:'97.0-103.0%',
 ans:'c',
 exp:'USP Ciprofloxacin Ophthalmic Solution: 90.0-115.0% of labeled amount (ช่วงกว้างกว่าปกติเพราะ ophthalmic solution มีปริมาณน้อย)'},

// ─── VIROLOGY / HERPES ─────────────────────────────────────────────────────
{n:87, s:S.infect,
 q:'Herpes labialis (cold sore บริเวณปาก) ส่วนใหญ่เกิดจากเชื้อใด',
 a:'Cytomegalovirus',b:'Herpes simplex virus type 1 (HSV-1)',c:'Varicella zoster virus',d:'Herpes simplex virus type 2',e:'Human Papilloma virus',
 ans:'b',
 exp:'HSV-1 = สาเหตุหลักของ herpes labialis (oral herpes); HSV-2 = genital herpes; VZV = chickenpox/shingles'},

{n:88, s:S.infect,
 q:'กลไกการออกฤทธิ์ของ Acyclovir ในการต้านไวรัส Herpes คือข้อใด',
 a:'Protease inhibitor',b:'DNA polymerase inhibitor',c:'DNA polymerase inhibitor (chain terminator)',d:'Reverse transcriptase inhibitor',e:'Neuraminidase inhibitor',
 ans:'c',
 exp:'Acyclovir → phosphorylated by viral thymidine kinase → Acyclovir triphosphate → competitive inhibitor + chain terminator ของ viral DNA polymerase'},

{n:89, s:S.infect,
 q:'ยาใดต่อไปนี้มีประสิทธิภาพต่ำกับ Acyclovir (cross-reaction น้อย)',
 a:'Cytomegalovirus (CMV)',b:'Varicella zoster virus',c:'Herpes simplex virus',d:'Epstein-Barr virus',e:'Human herpesvirus 6',
 ans:'a',
 exp:'Acyclovir ครอบคลุม HSV-1, HSV-2 ได้ดีมาก และ VZV ได้ดีพอสมควร แต่ CMV ขาด thymidine kinase ที่จะ phosphorylate acyclovir → ต้องใช้ Ganciclovir/Valganciclovir'},

{n:90, s:S.infect,
 q:'ขนาดยา Acyclovir สำหรับรักษา Herpes simplex genitalis (first episode) คือเท่าใด',
 a:'200 mg วันละ 3 ครั้ง',b:'400 mg วันละ 3 ครั้ง นาน 7-10 วัน',c:'800 mg วันละ 2 ครั้ง',d:'800 mg วันละ 5 ครั้ง',e:'1,200 mg วันละ 1 ครั้ง',
 ans:'b',
 exp:'HSV genital first episode: Acyclovir 400 mg TID หรือ 200 mg 5×/วัน นาน 7-10 วัน (recurrent: 400 mg TID × 5 วัน หรือ suppressive 400 mg BD)'},

{n:91, s:S.pharma,
 q:'Acyclovir 1,200 mg sustained release matrix tablet ใช้ชั้น membrane ประเภทใดควบคุมการปล่อยยา',
 a:'Semipermeable membrane',b:'Prolonged release',c:'Controlled release',d:'Delayed release',e:'Immediate release',
 ans:'a',
 exp:'OROS (Osmotic controlled release): ใช้ semipermeable membrane ที่ให้น้ำผ่านแต่ไม่ให้ยาผ่าน → osmotic pressure ขับยาออกทาง orifice ใน rate ที่คงที่'},

// ─── PHARMACEUTICAL SCIENCES (Formulation) ────────────────────────────────
{n:92, s:S.pharma,
 q:'Powder มี Bulk density = 0.28 g/mL และ Tapped density = 1.02 g/mL ค่า Carr\'s Compressibility Index (%) คือเท่าใด และอยู่ในระดับใด',
 a:'5% (Excellent)',b:'72.5% (Very poor → ต้องทำ granulation)',c:'20% (Fair)',d:'25.5% (Poor)',e:'35% (Very poor)',
 ans:'b',
 exp:'Carr\'s Index = (Tap − Bulk)/Tap × 100 = (1.02 − 0.28)/1.02 × 100 = 72.5% — Very poor flowability → ต้องทำ granulation ก่อน direct compression ไม่ได้'},

{n:93, s:S.pharma,
 q:'การผลิต Terbinafine cream 1% (o/w emulsion) ที่ต้องการ HLB = 13 โดยใช้ Span 20 (HLB 8.6) + Tween 60 (HLB 14.9) อัตราส่วนใดถูกต้อง',
 a:'Span 5g + Tween 5g',b:'Span 2g + Tween 8g',c:'Span 6g + Tween 4g',d:'Span 3g + Tween 7g',e:'Span 3g + Tween 7g (HLB ≈ 13.2)',
 ans:'e',
 exp:'HLB mixture = (W_Span × HLB_Span + W_Tween × HLB_Tween) / Total\n= (3×8.6 + 7×14.9)/10 = (25.8+104.3)/10 = 13.01 ≈ 13 ✓'},

{n:94, s:S.pharma,
 q:'สูตรตำรับ Anhydrous cream 5% ประกอบด้วย Cetostearyl alcohol + Stearin + Mineral oil + Carbopol + Propylene glycol + White petroleum + Water ข้อใดถูกต้อง',
 a:'Stearic acid เป็น emulsifier',b:'Carbopol 940 เป็น emulsifier',c:'Cetostearyl alcohol เป็น emollient',d:'White petrolatum เป็น occlusive emollient',e:'Sodium lauryl sulfate เป็น humectant',
 ans:'d',
 exp:'White petrolatum (Vaseline) = occlusive emollient/moisture barrier — ไม่ใช่ emulsifier; Cetostearyl alcohol = emollient + stabilizer; SLS = anionic emulsifier'},

{n:95, s:S.pharma,
 q:'สูตรตำรับ Terbinafine cream มี SpanX + TweenY = emulsifier ข้อใดต่อไปนี้เป็น emollient ใน cream',
 a:'Span 20',b:'Tween 60',c:'Propylene glycol',d:'White petrolatum',e:'Sodium lauryl sulfate',
 ans:'d',
 exp:'White petrolatum (Vaseline) = emollient ให้ความชุ่มชื้นแก่ผิว — Span/Tween = emulsifiers, PG = humectant/solvent'},

{n:96, s:S.pharma,
 q:'Alendronate effervescent tablet ควรใช้กระบวนการ granulation ใด และทำไม',
 a:'Wet granulation ด้วยน้ำ เพื่อเพิ่ม binding',b:'Wet granulation ด้วย alcohol เพราะ water sensitive',c:'Direct compression เพราะง่ายที่สุด',d:'Dry granulation เพราะ alendronate และ effervescent excipients ไวต่อความชื้น',e:'Spray drying เพราะต้องการ particle size เล็ก',
 ans:'d',
 exp:'Citric acid + Sodium bicarbonate (effervescent pair) ทำปฏิกิริยากับน้ำทันที → ต้องผลิตในสภาพ dry เท่านั้น → Dry granulation (roller compaction/slugging)'},

{n:97, s:S.pharma,
 q:'สูตรตำรับ tablet ประกอบด้วย Microcrystalline cellulose, Magnesium stearate, Lactose, PVP, Colloidal silicon dioxide, Sodium starch glycolate — PVP ทำหน้าที่อะไร',
 a:'Disintegrant',b:'Binder',c:'Lubricant',d:'Glidant',e:'Diluent',
 ans:'b',
 exp:'PVP (Povidone) = Binder ใช้ใน wet granulation เพื่อยึดอนุภาคผงให้เป็น granule — MCC/Lactose = Diluent, Mg stearate = Lubricant, Na starch glycolate = Disintegrant'},

{n:98, s:S.pharma,
 q:'สารใดต่อไปนี้ช่วยลด sedimentation rate ใน suspension โดยการเพิ่ม viscosity ของ medium',
 a:'Simethicone',b:'Glycerin',c:'Colloidal silicon dioxide',d:'Sorbitol',e:'Methyl cellulose',
 ans:'e',
 exp:'Methyl cellulose (HPMC, Carbomer, Xanthan gum) เป็น viscosity enhancer ลด Sedimentation rate ตาม Stokes\' Law — Colloidal silicon dioxide เป็น suspending agent ประเภท thickener'},

{n:99, s:S.pharma,
 q:'Glycerin ทำหน้าที่อะไรใน suspension',
 a:'Humectant',b:'Flocculating agent',c:'Preservative',d:'Wetting agent',e:'Sweetener',
 ans:'a',
 exp:'Glycerin = Humectant ดึงน้ำ ป้องกันผลิตภัณฑ์แห้ง — ยังใช้เป็น sweetener และ vehicle ในบางสูตร แต่หน้าที่หลักใน suspension คือ humectant'},

{n:100, s:S.pharma,
 q:'ตาม Stokes\' Law ปัจจัยใดต่อไปนี้ที่ "เพิ่ม" sedimentation rate',
 a:'เพิ่ม viscosity ของ medium',b:'ลด particle size',c:'เพิ่ม density ของ particle ให้ต่างจาก medium มากขึ้น',d:'เพิ่ม temperature',e:'ลด particle density',
 ans:'c',
 exp:'Stokes: v = 2r²(ρ_p − ρ_m)g / 9η → เพิ่ม (ρ_p − ρ_m) = เพิ่ม sedimentation rate; เพิ่ม viscosity (η) = ลด sedimentation; ลด r = ลด rate'},

// ─── ELECTROLYTES / POTASSIUM ──────────────────────────────────────────────
{n:101, s:S.clinic,
 q:'วิธีการให้ Potassium chloride แก้ไข hypokalemia ข้อใด "ไม่ปลอดภัย"',
 a:'Furosemide ลด',b:'เพิ่มขนาด Spironolactone',c:'ผสม KCl ใน NSS drip ช้าๆ',d:'KCl IV bolus โดยตรง ไม่เจือจาง',e:'KCl tablet รับประทาน',
 ans:'d',
 exp:'IV KCl bolus = ห้ามเด็ดขาด → Cardiac arrest (ventricular fibrillation) — ต้องเจือจางและให้ไม่เกิน 10-20 mEq/hr (max 40 mEq/hr ในกรณีฉุกเฉิน)'},

{n:102, s:S.clinic,
 q:'ผู้ป่วย hypokalemia รุนแรง วิธีการให้ potassium replacement ที่ถูกต้องคือข้อใด',
 a:'Dipotassium phosphate IV bolus',b:'KCl ผสม D5W 100 mL ให้ใน 30 นาที',c:'KCl ผสม NSS 0.9% 100 mL ให้ใน 30 นาที (ไม่เกิน 20 mEq/hr)',d:'Potassium phosphate 40 mEq IV bolus',e:'Potassium chloride elixir รับประทาน',
 ans:'c',
 exp:'KCl IV: เจือจางใน NSS (ไม่ใช่ D5W เพราะ insulin จาก glucose อาจทำให้ K+ เข้าเซลล์มากขึ้น) ให้ไม่เกิน 20 mEq/hr พร้อม cardiac monitoring'},

{n:103, s:S.clinic,
 q:'อัตราการให้ KCl ทางหลอดเลือดดำที่ปลอดภัยสูงสุดในผู้ใหญ่ทั่วไปคือเท่าใด',
 a:'5 mEq/hr',b:'10-20 mEq/hr',c:'40 mEq/hr เสมอ',d:'80 mEq/hr',e:'ไม่มีขีดจำกัด',
 ans:'b',
 exp:'Potassium IV: maximum rate = 10-20 mEq/hr (peripheral line) ในกรณี severe hypokalemia อาจให้ถึง 40 mEq/hr ทาง central line พร้อม cardiac monitoring'},

{n:104, s:S.clinic,
 q:'ผลข้างเคียงที่ต้องระวังเมื่อให้ Dipotassium phosphate ทางหลอดเลือดดำ',
 a:'Hypokalemia',b:'Hypernatremia',c:'Hyperkalemia และ Hyperphosphatemia',d:'Hypocalcemia เท่านั้น',e:'Metabolic alkalosis',
 ans:'c',
 exp:'Dipotassium phosphate IV: เพิ่มทั้ง K+ และ PO₄³⁻ → Hyperkalemia + Hyperphosphatemia ถ้าให้เร็วเกิน นอกจากนี้ phosphate สูง → hypocalcemia (Ca × P product สูง)'},

{n:105, s:S.cardio,
 q:'ผู้ป่วยที่ใช้ Losartan ร่วมกับ ACE inhibitor ความเสี่ยงใดที่ต้องระวังมากที่สุด',
 a:'Hyperkalemia',b:'Hypokalemia',c:'Hypernatremia',d:'Hyponatremia',e:'Hypocalcemia',
 ans:'a',
 exp:'Double RAAS blockade (ARB + ACEi): เพิ่มความเสี่ยง hyperkalemia, hypotension, และ AKI อย่างมีนัยสำคัญ — ONTARGET trial แสดงว่า combination ไม่มีประโยชน์เพิ่มแต่เพิ่ม ADR'},

{n:106, s:S.clinic,
 q:'Vitamin E ที่ให้ร่วมกับ Simvastatin อาจมีปฏิสัมพันธ์อย่างไร',
 a:'ลด statin absorption',b:'เพิ่ม statin efficacy',c:'Vitamin E (antioxidant) อาจลด statin efficacy บางส่วน',d:'ไม่มีปฏิสัมพันธ์ใดๆ',e:'เพิ่ม hepatotoxicity',
 ans:'c',
 exp:'Theoretical interaction: antioxidant (Vitamin E) อาจ interfere กับ oxidative stress pathway ที่ statin ออกฤทธิ์ — หลักฐานยังไม่ชัดเจน แต่ควรระวัง'},

{n:107, s:S.clinic,
 q:'Vitamin E ที่ให้ร่วมใน statin capsule ทำหน้าที่อะไรในสูตรตำรับ',
 a:'Active ingredient',b:'Antioxidant (กันยาเสื่อมจาก oxidation)',c:'Lubricant',d:'Binder',e:'Disintegrant',
 ans:'b',
 exp:'Vitamin E (dl-alpha-tocopherol acetate) ในสูตรตำรับ capsule ทำหน้าที่เป็น antioxidant ป้องกัน statin จากการเสื่อมสลายเนื่องจาก oxidation'},

// ─── PARENTERAL / EPINEPHRINE ──────────────────────────────────────────────
{n:108, s:S.pharma,
 q:'Epinephrine 1 mg ผสมน้ำเกลือรวมเป็น 10 mL ได้ความเข้มข้นเท่าใด',
 a:'Adrenaline 0.1 mL แผน NSS 9 mL = 0.01 mg/mL',b:'Adrenaline 1:10,000 = 0.1 mg/mL',c:'Adrenaline 1 mL แผน NSS 10 mL = 0.09 mg/mL',d:'ไม่ถูกต้องทุกข้อ',e:'1 mg/mL',
 ans:'b',
 exp:'Epi 1 mg ใน 10 mL = 0.1 mg/mL = 1:10,000 (1 g ใน 10,000 mL = 0.1 mg/mL) — ใช้ใน cardiac arrest (IV/IO) และ bradycardia'},

{n:109, s:S.pharma,
 q:'Epinephrine HCl solution มีคุณสมบัติใดต่อไปนี้',
 a:'เสถียรใน alkaline pH',b:'เก็บที่อุณหภูมิห้องได้นาน',c:'ต้องป้องกันแสง เพราะ oxidize เป็น adrenochrome (สีน้ำตาล)',d:'pH 7-9',e:'ผสมกับ Sodium bicarbonate ได้',
 ans:'c',
 exp:'Epinephrine: ไวต่อ oxidation และ แสง → เก็บในขวดสีชา, pH 2-5 (acidic เพื่อความเสถียร), ห้ามผสมกับ NaHCO₃ (alkaline → oxidize เร็ว)'},

{n:110, s:S.pharma,
 q:'NaCl 2.5% จัดเป็น solution ประเภทใด',
 a:'Hypertonic (เข้มข้นกว่า isotonic)',b:'Isotonic',c:'Hypotonic',d:'Isoosmotic',e:'Non-electrolyte solution',
 ans:'a',
 exp:'NaCl isotonic = 0.9% — NaCl 2.5% > 0.9% = Hypertonic → ออสโมซิสดึงน้ำออกจากเซลล์ (ใช้รักษา hyponatremia รุนแรงหรือ cerebral edema)'},

{n:111, s:S.pharma,
 q:'Sodium chloride equivalent (E-value) ใช้ประโยชน์ในการคำนวณอะไร',
 a:'Tonicity adjustment ของ ophthalmic/parenteral solution',b:'Drug dosage calculation',c:'pH adjustment',d:'Solubility prediction',e:'Stability testing',
 ans:'a',
 exp:'E-value = amount of NaCl equivalent in tonicity to 1 g of drug substance → ใช้คำนวณปริมาณ NaCl ที่ต้องเพิ่ม/ลดเพื่อทำ isotonic solution'},

{n:112, s:S.clinic,
 q:'สั่ง IV infusion 500 mL ใน 4 ชั่วโมง ใช้ infusion set 20 drops/mL อัตราหยดควรเป็นเท่าใด',
 a:'8 drops/min',b:'10 drops/min',c:'42 drops/min',d:'125 drops/min',e:'20 drops/min',
 ans:'c',
 exp:'Rate = Volume(mL) × Drop factor / Time(min) = 500 × 20 / (4×60) = 10000/240 = 41.7 ≈ 42 drops/min'},

{n:113, s:S.clinic,
 q:'ผู้ป่วยได้รับ Adrenaline infusion 0.1 mcg/kg/min น้ำหนัก 70 kg ผสมใน NSS 50 mL (1 mg Adrenaline ใน 50 mL) อัตรา infusion pump คือเท่าใด',
 a:'8 mL/hr',b:'21 mL/hr',c:'0.42 mL/hr',d:'4.2 mL/hr',e:'42 mL/hr',
 ans:'b',
 exp:'Dose = 0.1 mcg/kg/min × 70 kg = 7 mcg/min = 420 mcg/hr\nConcentration = 1 mg/50 mL = 1000 mcg/50 mL = 20 mcg/mL\nRate = 420/20 = 21 mL/hr'},

// ─── DISSOLUTION / QC ──────────────────────────────────────────────────────
{n:114, s:S.pharma,
 q:'Dissolution test Stage 1 (S1, n=6 tablets) กำหนด Q = 80% ผลที่ได้ในแต่ละเม็ด: 75, 78, 82, 80, 79, 77% ผลการทดสอบเป็นอย่างไร',
 a:'ผ่าน S1',b:'ผ่าน S2',c:'ไม่ผ่าน S1 → ต้องทดสอบ S2 (เพราะมีค่าต่ำกว่า Q)',d:'Fail ทุกขั้นตอน',e:'ผ่านตามเกณฑ์ระดับ 2',
 ans:'c',
 exp:'S1 criteria: แต่ละเม็ด ≥ Q−5% = 75% และ mean ≥ Q = 80% — ผล: mean = (75+78+82+80+79+77)/6 = 78.5% < 80% → ไม่ผ่าน S1 → ต้องทำ S2'},

{n:115, s:S.infect,
 q:'การศึกษาเปรียบเทียบ Amoxicillin/Clavulanate กับ Cefixime ผลที่ได้ RR = 1.3, 95% CI (0.85-1.17) ข้อสรุปที่ถูกต้อง',
 a:'Amoxicillin/Clavulanate ดีกว่า Cefixime',b:'ไม่มีความแตกต่างอย่างมีนัยสำคัญ (95% CI ครอบ 1.0)',c:'Cefixime ดีกว่า',d:'ผลยังไม่สามารถสรุปได้',e:'Amoxicillin/Clavulanate แย่กว่า',
 ans:'b',
 exp:'95% CI (0.85-1.17) ครอบค่า 1.0 → ไม่มีความแตกต่างอย่างมีนัยสำคัญ (p > 0.05) — แม้ RR = 1.3 แต่ CI บอกว่า อาจเป็นความบังเอิญ'},

{n:116, s:S.clinic,
 q:'การวิจัยต้องการทดสอบว่า adherence ของผู้ป่วย (ดี/ไม่ดี) แตกต่างกันระหว่างกลุ่มที่ได้รับการสอนกับไม่ได้รับ ควรใช้ statistical test ใด',
 a:'Chi-square test',b:'Logistic regression',c:'Pearson correlation coefficient',d:'Analysis of variance',e:'Paired t-test',
 ans:'a',
 exp:'ข้อมูล categorical 2×2 (adherence: ดี/ไม่ดี; กลุ่ม: ได้รับสอน/ไม่ได้รับ) → Chi-square test เหมาะที่สุด'},

{n:117, s:S.clinic,
 q:'ต้องการทดสอบว่าปัจจัยใดทำนาย adherence ของผู้ป่วย (outcome เป็น binary: ดี/ไม่ดี) ควรใช้ statistical test ใด',
 a:'Chi-square test',b:'Logistic regression',c:'Pearson correlation',d:'Analysis of variance',e:'Paired simple t-test',
 ans:'b',
 exp:'Binary outcome (adherence ดี/ไม่ดี) + multiple predictors → Logistic regression (multiple logistic regression) เหมาะที่สุด — ให้ Odds Ratio'},

{n:118, s:S.clinic,
 q:'ใน ABC inventory analysis รายการยาที่มูลค่าสูงที่สุด (ประมาณ 80% ของมูลค่าทั้งหมด) จัดอยู่ใน class ใด',
 a:'Class A',b:'Class B',c:'Class C',d:'Class D',e:'Class E',
 ans:'a',
 exp:'ABC analysis: A (20% ของรายการ → 80% มูลค่า), B (30% รายการ → 15% มูลค่า), C (50% รายการ → 5% มูลค่า) — Class A ต้องควบคุมและ monitor เข้มงวดที่สุด'},

{n:119, s:S.hemo,
 q:'Mycophenolate mofetil (MMF) มีกลไกการออกฤทธิ์อย่างไร',
 a:'ยับยั้ง purine base guanine ใช้ adenine',b:'ยับยั้ง tyrosine kinase',c:'ยับยั้ง pyrimidine analogue',d:'ยับยั้ง IMP dehydrogenase (IMPDH) → ลด guanosine',e:'ยับยั้ง calcineurin',
 ans:'d',
 exp:'MMF (Mycophenolic acid): ยับยั้ง IMPDH enzyme → ลด de novo purine (guanosine) synthesis → selective antiproliferative effect บน T และ B lymphocytes'},

{n:120, s:S.pharma,
 q:'ใน direct compression การใช้ Magnesium stearate (Lubricant) มากเกินไปจะส่งผลอย่างไร',
 a:'เพิ่ม hardness ของ tablet',b:'ไม่มีผลใดๆ',c:'เพิ่ม dissolution rate',d:'ลด dissolution rate เพราะ Mg stearate เป็น hydrophobic lubricant',e:'เพิ่ม disintegration time',
 ans:'d',
 exp:'Mg stearate เป็น hydrophobic lubricant → ถ้าใช้มากเกิน หรือ mix นานเกิน → coating บน particle → ลด wettability → ลด dissolution rate เป็น critical manufacturing parameter'},
];

async function insertAll() {
  let count = 0;
  for (const q of questions) {
    const id = crypto.randomUUID();
    await client.execute({
      sql: `INSERT INTO mcq_questions 
            (id, subject_id, question, option_a, option_b, option_c, option_d, option_e, 
             correct_answer, explanation, difficulty, exam_type, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'medium', 'PLE-CC1', datetime('now'))`,
      args: [id, q.s, q.q, q.a, q.b, q.c, q.d, q.e||null, q.ans, q.exp]
    });
    count++;
    if (count % 10 === 0) console.log(`Inserted ${count}/120...`);
  }
  
  // Update question counts per subject
  const subjects = [...new Set(questions.map(q => q.s))];
  for (const sid of subjects) {
    const cnt = questions.filter(q => q.s === sid).length;
    await client.execute({
      sql: 'UPDATE mcq_subjects SET question_count = ? WHERE id = ?',
      args: [cnt, sid]
    });
  }
  
  const result = await client.execute('SELECT COUNT(*) as total FROM mcq_questions');
  console.log('✓ Done! Total questions in DB:', result.rows[0].total);
}

insertAll().catch(e => { console.error(e); process.exit(1); });
