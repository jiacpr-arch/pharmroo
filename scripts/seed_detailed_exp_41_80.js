const { createClient } = require('@libsql/client');
const db = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const d = (summary, reason, choices, key_takeaway) => ({ summary, reason, choices, key_takeaway });
const c = (label, text, explanation) => ({ label, text, explanation });

const data = [
  { n:41, det: d(
    "การจำแนกประเภท Alkaloid จากโครงสร้าง",
    "Tropane alkaloid มี N-methyl piperidine fused with cyclopentane — bicyclic ring",
    [c("A","Isoquinoline alkaloid","✗ ผิด — Isoquinoline มี benzene fused กับ pyridine — ตัวอย่าง: Morphine, Codeine, Papaverine"),
     c("B","Indole alkaloid","✗ ผิด — Indole มี benzene fused กับ pyrrole — ตัวอย่าง: Ergotamine, Reserpine, Vincristine"),
     c("C","Tropane alkaloid","✓ ถูก — Tropane = bicyclic: N-methyl piperidine + cyclopentane ring; ตัวอย่าง: Atropine, Scopolamine, Cocaine"),
     c("D","Purine alkaloid","✗ ผิด — Purine alkaloid เช่น Caffeine, Theophylline มี purine ring (fused pyrimidine+imidazole)"),
     c("E","Steroidal alkaloid","✗ ผิด — Steroidal alkaloid เช่น Solanine มี steroid skeleton")],
    "Tropane = N-CH₃ bridged bicyclic; Atropine racemic mixture; L-Hyoscyamine = active form; Scopolamine = motion sickness"
  )},
  { n:42, det: d(
    "T-score ≤ −2.5 + previous fragility fracture = risk level อะไร",
    "T-score ≤ −2.5 + fragility fracture = Very High Risk → พิจารณา anabolic therapy",
    [c("A","Osteopenia","✗ ผิด — Osteopenia = T-score −1.0 to −2.5; ข้อนี้ต่ำกว่า −2.5"),
     c("B","Very High Risk Osteoporosis","✓ ถูก — AACE: Very High Risk = T-score ≤ −2.5 + fragility fracture หรือ multiple risk factors → พิจารณา anabolic therapy (Teriparatide/Romosozumab) ก่อน antiresorptive"),
     c("C","Normal","✗ ผิด — Normal = T-score ≥ −1.0"),
     c("D","Severe osteoporosis คำนวณ FRAX","✗ ผิด — FRAX ใช้ใน intermediate risk ที่ยังไม่ถึง treatment threshold; ข้อนี้มี established fracture แล้ว"),
     c("E","Mild osteoporosis","✗ ผิด — Mild OP ไม่มีนิยามทาง WHO; classification คือ OP + severity")],
    "AACE Risk stratification: High risk = T≤−2.5 หรือ fracture; Very high = T≤−2.5 + fracture → anabolic first"
  )},
  { n:43, det: d(
    "วิธี titration วิเคราะห์ Calcium carbonate ตาม USP",
    "CaCO₃ ใช้ Complexometric titration (EDTA method) — จับ Ca²⁺ ด้วย EDTA",
    [c("A","Precipitation titration","✗ ผิด — Precipitation titration ใช้สำหรับ halides เช่น argentometric (Ag⁺) สำหรับ Cl⁻"),
     c("B","Non-aqueous acid-base titration","✗ ผิด — Non-aqueous titration ใช้กับ weak acids/bases เช่น tablet assay ใน anhydrous acetic acid"),
     c("C","Complexometric titration","✓ ถูก — CaCO₃ + HCl → Ca²⁺ → EDTA chelate Ca²⁺ → endpoint: Eriochrome Black T หรือ Calcon indicator เปลี่ยนสี"),
     c("D","Residual titration","✗ ผิด — Residual titration ใช้ใน back titration บางชนิด"),
     c("E","Redox titration","✗ ผิด — Redox titration ใช้กับ Fe²⁺/Fe³⁺, vitamin C ไม่ใช่ Ca²⁺")],
    "EDTA titration: pH 12-13 (NaOH), indicator: Calcon (Ca only) หรือ EBT pH 10 (Ca+Mg); endpoint: red→blue"
  )},
  { n:44, det: d(
    "Pharmacokinetics ของ Alendronate",
    "Alendronate: bioavailability <1%, Tmax ~1 ชั่วโมง, ขับทางไตโดยไม่เปลี่ยนแปลง",
    [c("A","Bioavailability > 50%","✗ ผิด — Alendronate bioavailability ต่ำมาก < 1% ถ้ากินพร้อมอาหารจะลดอีก"),
     c("B","Tmax ~1 ชั่วโมง","✓ ถูก — Tmax ~1 ชั่วโมง หลังกินตอนท้องว่าง; ยาดูดซึมเข้ากระแสเลือด แล้วจับกับ hydroxyapatite ใน bone"),
     c("C","Half-life 2-3 ชั่วโมง","✗ ผิด — Plasma half-life ~2 ชั่วโมง แต่ elimination half-life จาก bone นานมาก (>10 ปี) เพราะ bisphosphonate ฝังใน bone matrix"),
     c("D","ดูดซึมดีพร้อมอาหาร","✗ ผิด — อาหาร (โดยเฉพาะ Ca, Mg, Fe, coffee) ลด absorption อย่างมาก ต้องกินก่อนอาหาร 30 นาที"),
     c("E","ขับทาง hepatic metabolism","✗ ผิด — Bisphosphonate ไม่ถูก metabolize ใน liver; ขับทางไตในรูปไม่เปลี่ยนแปลง")],
    "Bisphosphonate PK: bioavail <1%, ไม่ metabolize, renal excretion, bone half-life >10 yr → drug holiday ได้"
  )},
  { n:45, det: d(
    "USP Acceptance criteria ของ Calcium carbonate",
    "USP CaCO₃: 98.5-101.5% on dried basis",
    [c("A","97.0-103.0%","✗ ผิด — ไม่ตรงกับ USP monograph"),
     c("B","95.0-105.0%","✗ ผิด — Wide range นี้ใช้กับบางยาไม่ใช่ CaCO₃"),
     c("C","98.5-101.5%","✓ ถูก — USP: CaCO₃ content ≥ 98.5% และ ≤ 101.5% calculated on dried basis — narrow range เพราะเป็น inorganic salt บริสุทธิ์"),
     c("D","90.0-110.0%","✗ ผิด — Wide range ใช้กับ some pharmaceutical preparations ไม่ใช่ pure CaCO₃"),
     c("E","99.0-101.0%","✗ ผิด — แคบเกินไป ไม่ตรงกับ USP")],
    "Pure inorganic salts (CaCO₃, NaCl, KCl) มักมี narrow acceptance criteria ≥98.5%; pharmaceutical preparations มักใช้ 90-110%"
  )},
  { n:46, det: d(
    "ขั้นตอน Complexometric titration ของ CaCO₃",
    "ละลายใน HCl → adjust pH 12-13 ด้วย NaOH → titrate ด้วย EDTA + Calcon indicator",
    [c("A","ละลายใน NaOH","✗ ผิด — CaCO₃ ไม่ละลายใน NaOH; ต้องละลายใน HCl ก่อนเพื่อให้ Ca²⁺ free"),
     c("B","Titrate ด้วย HCl","✗ ผิด — HCl ใช้ละลายตัวอย่าง ไม่ใช่ titrant; titrant คือ EDTA"),
     c("C","ใช้ EDTA เป็น titrant กับ indicator Eriochrome black T","✓ ถูก — Standard procedure: ละลายใน HCl → add NaOH (pH 12-13) → titrate ด้วย 0.05M EDTA ใช้ Calcon (pH 12) หรือ EBT (pH 10, Ca+Mg)"),
     c("D","ใช้ KMnO₄ เป็น titrant","✗ ผิด — KMnO₄ = oxidizing titrant ใน redox titration สำหรับ Fe²⁺, oxalate"),
     c("E","ละลายใน ethanol","✗ ผิด — CaCO₃ ไม่ละลายใน ethanol")],
    "EDTA complexometry: M²⁺ + EDTA → [M-EDTA] complex; pH สำคัญ: pH 10=Ca+Mg, pH 12=Ca only"
  )},
  { n:47, det: d(
    "กระบวนการผลิต Alendronate effervescent tablet",
    "Effervescent ประกอบด้วย citric acid + NaHCO₃ ซึ่งทำปฏิกิริยากับน้ำทันที → dry granulation",
    [c("A","Wet granulation ด้วยน้ำ","✗ ผิด — น้ำทำให้ citric acid + NaHCO₃ เกิด CO₂ ทำลาย effervescent blend ทันที"),
     c("B","Wet granulation ด้วย alcohol","✗ ผิด — Alcohol ยังมี moisture บ้าง; ยิ่งกว่านั้น Alendronate ดูดซับ moisture ได้"),
     c("C","Dry granulation","✓ ถูก — Dry granulation (roller compaction) = ไม่ใช้น้ำหรือ solvent; สภาพแห้ง ป้องกัน premature reaction ระหว่าง citric acid กับ NaHCO₃"),
     c("D","Hot melt extrusion","✗ ผิด — ใช้ความร้อนสูง เปลี่ยน physical form อาจทำลายยา"),
     c("E","Spray drying","✗ ผิด — ใช้ความร้อนและ moisture")],
    "Effervescent tablet: ต้องผลิตใน low humidity (<25% RH) + dry granulation; citric acid + NaHCO₃ = CO₂ เมื่อสัมผัสน้ำ"
  )},
  { n:48, det: d(
    "KDIGO 2012 AKI Staging",
    "SCr เพิ่ม ≥0.3 mg/dL ใน 48 ชั่วโมง = AKI Stage 1",
    [c("A","AKI Stage 0","✗ ผิด — AKI Stage 0 ไม่มีใน KDIGO classification"),
     c("B","AKI Stage 1","✓ ถูก — KDIGO 2012: Stage 1 = SCr เพิ่ม ≥0.3 mg/dL ใน 48h หรือ ≥1.5-1.9× baseline ใน 7 วัน หรือ UO <0.5 mL/kg/h ≥6h"),
     c("C","AKI Stage 2","✗ ผิด — Stage 2 = SCr เพิ่ม 2.0-2.9× baseline; ข้อนี้ baseline=1.0 mg/dL เพิ่มเป็น 2.0 = 2× = borderline"),
     c("D","AKI Stage 3","✗ ผิด — Stage 3 = SCr ≥3.0× baseline หรือ ≥4.0 mg/dL หรือ ต้อง RRT"),
     c("E","Chronic Kidney Disease","✗ ผิด — CKD = นาน >3 เดือน; AKI = เฉียบพลัน ≤48 ชั่วโมง")],
    "KDIGO AKI: S1=SCr≥0.3↑/48h or 1.5-1.9×; S2=2-2.9×; S3=≥3× or ≥4mg/dL or RRT; UO criteria สำคัญด้วย"
  )},
  { n:49, det: d(
    "การจัดการ Enalapril ใน AKI Stage 1",
    "ACEi ลด efferent arteriole tone → ลด GFR → ไม่เหมาะใน AKI → หยุดชั่วคราว",
    [c("A","หยุด Enalapril ชั่วคราว","✓ ถูก — ACEi/ARB ลด GFR ใน AKI เพราะ dilate efferent arteriole → ลด filtration pressure; หยุดชั่วคราวจนกว่า AKI resolve แล้ว resume"),
     c("B","เพิ่มขนาด Enalapril","✗ ผิด — เพิ่มขนาด ACEi ขณะ AKI จะทำให้ renal function แย่ลง"),
     c("C","เปลี่ยนเป็น Losartan","✗ ผิด — ARB ก็มีกลไกเดียวกัน ลด GFR เหมือนกัน ไม่ควรใช้ใน AKI"),
     c("D","ไม่ต้องทำอะไร","✗ ผิด — ต้องหยุดยาที่อาจ worsen AKI"),
     c("E","เพิ่ม Furosemide","✗ ผิด — Loop diuretic อาจเพิ่ม hypovolemia และ worsen AKI ถ้า pre-renal component")],
    "AKI: หยุด nephrotoxins (NSAIDs, ACEi, ARB, aminoglycosides, contrast); rehydrate; monitor urine output"
  )},
  { n:50, det: d(
    "การจำแนก Quaternary ammonium compound จากโครงสร้าง",
    "N+ มี 4 substituents = Quaternary ammonium — ประจุบวกถาวร",
    [c("A","Tertiary amine","✗ ผิด — Tertiary amine มี N ที่มี 3 substituents + lone pair; ประจุขึ้นกับ pH"),
     c("B","Primary amine","✗ ผิด — Primary amine มี NH₂; มี 1 substituent บน N"),
     c("C","Flavonoid","✗ ผิด — Flavonoid = polyphenol มี benzene ring ไม่เกี่ยวกับ N"),
     c("D","Quaternary ammonium","✓ ถูก — Quaternary ammonium: N⁺ มี 4 substituents → ประจุบวกถาวร ไม่ขึ้นกับ pH → poor GI absorption, antimicrobial"),
     c("E","Tertiary alcohol","✗ ผิด — Tertiary alcohol = C ที่มี OH กับ 3 carbon substituents ไม่เกี่ยวกับ N")],
    "Quaternary N⁺: ไม่ cross BBB, ไม่ดูดซึม oral (ยกเว้น depot), ใช้เป็น antiseptic (BAK, cetrimide) หรือ neuromuscular blocker"
  )},
  { n:51, det: d(
    "NCC MERP Medication Error Categories",
    "ยาไม่ถึงผู้ป่วย = Category B (error occurred, did not reach patient)",
    [c("A","Category A","✗ ผิด — Category A = Circumstances or events that have the capacity to cause error (ยังไม่เกิด error จริง)"),
     c("B","Category B","✓ ถูก — Category B = Error occurred but did not reach the patient; ยาผิดเตรียมแล้วแต่จับได้ก่อนส่ง"),
     c("C","Category C","✗ ผิด — Category C = Error reached patient but did not cause harm"),
     c("D","Category D","✗ ผิด — Category D = Error reached patient, required monitoring to confirm no harm"),
     c("E","Category E","✗ ผิด — Category E = Error caused temporary harm, required intervention")],
    "NCC MERP: A=potential, B=no reach, C=reach no harm, D=monitor, E=temp harm, F=temp+hospitalize, G=perm harm, H=near death, I=death"
  )},
  { n:52, det: d(
    "First-line pharmacotherapy สำหรับการเลิกบุหรี่",
    "Varenicline = partial agonist at nAChR → ลด craving + withdrawal; meta-analysis ดีที่สุด",
    [c("A","Nicotine gum","✗ ผิด — NRT (nicotine replacement) มี efficacy แต่ต่ำกว่า Varenicline; เป็น 2nd option"),
     c("B","Varenicline","✓ ถูก — Varenicline (Champix) = partial agonist nicotinic acetylcholine receptor α4β2 → ลด craving และ withdrawal; odds ratio เลิกได้ดีกว่า NRT 1.57× และ Bupropion"),
     c("C","Bupropion","✗ ผิด — Bupropion = 2nd line (NDRI ยับยั้ง dopamine/norepinephrine reuptake); ดีกว่า NRT แต่ด้อยกว่า Varenicline"),
     c("D","Cytisine","✗ ผิด — Cytisine = partial nAChR agonist; ใช้ใน Eastern Europe; ไม่ใช่ standard first-line ใน Thai guidelines"),
     c("E","Nortriptyline","✗ ผิด — Nortriptyline = TCA; ใช้ off-label สำหรับเลิกบุหรี่เป็น 3rd line")],
    "ลำดับ smoking cessation: Varenicline > Combination NRT > Bupropion SR; Varenicline ควร 12 สัปดาห์"
  )},
  { n:53, det: d(
    "Transtheoretical Model (Stages of Change) — Precontemplation",
    "ไม่ตั้งใจเปลี่ยนพฤติกรรมใน 6 เดือน = Precontemplation",
    [c("A","Precontemplation","✓ ถูก — Precontemplation: ไม่รู้ปัญหาหรือไม่อยากเปลี่ยน ไม่มีแผนเปลี่ยนใน 6 เดือน; ใช้ Motivational Interviewing"),
     c("B","Contemplation","✗ ผิด — Contemplation: คิดจะเปลี่ยนใน 6 เดือน แต่ยังลังเล (ambivalent)"),
     c("C","Preparation","✗ ผิด — Preparation: วางแผนจะเปลี่ยนใน 1 เดือน"),
     c("D","Action","✗ ผิด — Action: กำลังเปลี่ยนพฤติกรรมอยู่ (ภายใน 6 เดือนที่ผ่านมา)"),
     c("E","Maintenance","✗ ผิด — Maintenance: เปลี่ยนแปลงสำเร็จ >6 เดือนและรักษาไว้ได้")],
    "5 stages: Pre-contemplation → Contemplation → Preparation → Action → Maintenance; Relapse สามารถเกิดได้ทุก stage"
  )},
  { n:54, det: d(
    "หน้าที่ของ Backing Layer ใน Nicotine Transdermal Patch",
    "Backing layer = ชั้นนอกสุด ป้องกันการสูญเสียยา กันน้ำ เป็นรูปทรง",
    [c("A","Reservoir system ของยา","✗ ผิด — Reservoir (drug-containing layer) อยู่ชั้นในถัดจาก backing layer"),
     c("B","Matrix system","✗ ผิด — Matrix = ชั้นที่ยาผสมอยู่ใน polymer; backing layer อยู่ด้านบนสุด"),
     c("C","ชั้นสัมผัสผิวหนัง","✗ ผิด — ชั้นสัมผัสผิวหนัง = Adhesive layer หรือ membrane ด้านล่าง ไม่ใช่ backing"),
     c("D","ชั้นปิดด้านนอก ป้องกันการสูญเสียยา","✓ ถูก — Backing layer = ชั้นนอกสุดทำจาก polyester/metal foil: กันน้ำ, ป้องกันการสูญเสียยา, เป็นรูปทรงและ support ของ patch"),
     c("E","Release liner","✗ ผิด — Release liner = ชั้นล่างสุดที่ต้องลอกออกก่อนติด ทำจาก silicone-coated paper")],
    "Patch layers (นอก→ใน): Backing → Drug reservoir/Matrix → Rate-controlling membrane → Adhesive → Release liner"
  )},
  { n:55, det: d(
    "Nicotine patch Matrix system",
    "Matrix system: ยาผสมโดยตรงใน polymer matrix; diffusion ออกจาก matrix โดยตรง",
    [c("A","มี Reservoir ยาแยกต่างหาก","✗ ผิด — นี่คือลักษณะของ Reservoir system ไม่ใช่ Matrix"),
     c("B","ยาผสมอยู่ใน polymer matrix โดยตรง","✓ ถูก — Matrix system: active drug ผสมใน adhesive/polymer matrix; release rate ขึ้นกับ drug loading และ polymer properties"),
     c("C","ควบคุมการปล่อยด้วย membrane แยก","✗ ผิด — Reservoir system ใช้ rate-controlling membrane; Matrix ไม่มี separate membrane"),
     c("D","ปล่อยยาเร็วกว่า reservoir system","✗ ผิด — Matrix release เป็น first-order/square root of time; Reservoir system ให้ zero-order release ที่สม่ำเสมอกว่า"),
     c("E","ต้องการ rate-controlling membrane เสมอ","✗ ผิด — Matrix system ไม่ต้องการ rate-controlling membrane; Reservoir system ต้องการ")],
    "Matrix patch: ง่ายกว่า cheaper กว่า; Reservoir patch: zero-order release ดีกว่า แต่ถ้า membrane รั่ว dose dumping"
  )},
  { n:56, det: d(
    "การรักษา H. pylori ใน UBT positive",
    "PPI-based triple therapy = standard H. pylori eradication regimen",
    [c("A","Antacid + PPI","✗ ผิด — Antacid ไม่มีฤทธิ์ต้าน H. pylori; PPI เดี่ยวก็ไม่เพียงพอ"),
     c("B","PPI monotherapy","✗ ผิด — PPI เพียงอย่างเดียวลด acid แต่ไม่ eradicate H. pylori"),
     c("C","PPI-based triple therapy (PPI + Amoxicillin + Clarithromycin)","✓ ถูก — Standard: PPI BD + Amoxicillin 1g BD + Clarithromycin 500mg BD × 14 วัน; eradication rate ~80-85%"),
     c("D","High dose antibiotic เดี่ยว","✗ ผิด — Monotherapy ดื้อยาสูงมาก ไม่ใช่ standard"),
     c("E","H2RA + probiotic","✗ ผิด — H2RA ไม่มีในปัจจุบัน standard ของ H. pylori; probiotic เป็น adjunct เท่านั้น")],
    "H. pylori 1st line: PPI+Amox+Clarithro 14d; ถ้าดื้อ Clarithro: Bismuth quadruple (PBMT); ประเมินผล: UBT/stool Ag ≥4 สัปดาห์หลังรักษา"
  )},
  { n:57, det: d(
    "การปรับ regimen เมื่อ Clarithromycin resistance ≥ 15%",
    "Clarithromycin resistance สูง → Bismuth quadruple therapy (PBMT)",
    [c("A","เปลี่ยน Clarithromycin เป็น Ampicillin","✗ ผิด — Ampicillin ไม่ใช่ standard สำหรับ H. pylori"),
     c("B","เปลี่ยนเป็น Amoxicillin เดี่ยว","✗ ผิด — Amoxicillin monotherapy ไม่เพียงพอ"),
     c("C","ใช้ Bismuth quadruple therapy (PPI + Bismuth + Tetracycline + Metronidazole)","✓ ถูก — PBMT (Pylera) = 2nd line เมื่อ Clarithromycin resistance สูง; bismuth มี synergy กับ Metronidazole; eradication >90%"),
     c("D","เพิ่มขนาด Clarithromycin","✗ ผิด — ยาดื้อแล้ว เพิ่มขนาดก็ไม่ช่วย"),
     c("E","ไม่ต้องเปลี่ยน","✗ ผิด — ต้องเปลี่ยน regimen เมื่อ resistance rate สูง เพื่อเพิ่ม eradication rate")],
    "H. pylori regimen choice: Clarithro resistance <15% → Triple; ≥15% → Bismuth quadruple; Penicillin allergy → Clarithro+Metronidazole+PPI"
  )},
  { n:58, det: d(
    "ADR ที่ไม่ใช่ของ Phenobarbital",
    "Peripheral edema ไม่ใช่ ADR ของ Phenobarbital แต่เป็นของ Gabapentin/Pregabalin",
    [c("A","Sedation/drowsiness","✗ ถูก (เป็น ADR จริง) — Phenobarbital = barbiturate → CNS depression → sedation/drowsiness"),
     c("B","Hyperactivity ในเด็ก","✗ ถูก (เป็น ADR จริง) — Paradoxical hyperactivity/irritability ใน pediatric patients พบได้บ่อย"),
     c("C","Peripheral edema","✓ นี่คือข้อที่ไม่ใช่ ADR — Peripheral edema เป็น ADR ของ Gabapentin, Pregabalin, Valproate ไม่ใช่ Phenobarbital"),
     c("D","Stevens-Johnson syndrome","✗ ถูก (เป็น ADR จริง) — Phenobarbital ก่อ SJS/TEN ได้ โดยเฉพาะ HLA-B*1502 (Asian)"),
     c("E","Osteomalacia (ใช้ระยะยาว)","✗ ถูก (เป็น ADR จริง) — Barbiturate/Phenytoin ใช้นาน → induce CYP enzymes → เพิ่ม Vit D catabolism → osteomalacia")],
    "Phenobarbital ADR: sedation, cognitive impairment, hyperactivity (kids), SJS, osteomalacia, CYP inducer (DDI)"
  )},
  { n:59, det: d(
    "AED ที่ทำให้น้ำหนักเพิ่มมากที่สุด",
    "Valproic acid ทำให้น้ำหนักเพิ่มมากที่สุดในกลุ่ม AED",
    [c("A","Phenytoin","✗ ผิด — Phenytoin = weight neutral หรือ เพิ่มเล็กน้อย"),
     c("B","Valproic acid","✓ ถูก — VPA ทำให้น้ำหนักเพิ่มมากที่สุด; กลไก: เพิ่ม appetite (กระตุ้น NPY), ยับยั้ง β-oxidation ของ fatty acid → fat accumulation"),
     c("C","Lamotrigine","✗ ผิด — Lamotrigine = weight neutral"),
     c("D","Topiramate","✗ ผิด — Topiramate = ทำให้น้ำหนักลด (ยับยั้ง carbonic anhydrase + appetite suppression) → ใช้เป็น add-on ใน obesity"),
     c("E","Zonisamide","✗ ผิด — Zonisamide = ทำให้น้ำหนักลดได้")],
    "AED weight effects: ↑ VPA, Pregabalin, Gabapentin; ↓ Topiramate, Zonisamide, Felbamate; Neutral: LTG, LEV, PHT"
  )},
  { n:60, det: d(
    "ADR ที่พบบ่อยจาก Carbamazepine ระยะยาว",
    "Carbamazepine → SIADH → Hyponatremia พบบ่อย โดยเฉพาะผู้สูงอายุ",
    [c("A","Agranulocytosis","✗ ผิด — Agranulocytosis พบได้แต่หายาก (<1%); CBC ต้อง monitor แต่ไม่ใช่ที่พบบ่อยที่สุด"),
     c("B","Hepatomegaly","✗ ผิด — Hepatotoxicity พบได้แต่ไม่ใช่ที่พบบ่อยที่สุด"),
     c("C","Pancytopenia","✗ ผิด — Pancytopenia หายาก"),
     c("D","Peripheral edema","✗ ผิด — Peripheral edema ไม่ใช่ ADR หลักของ Carbamazepine"),
     c("E","Hyponatremia (SIADH)","✓ ถูก — Carbamazepine stimulates ADH → SIADH → hyponatremia; พบบ่อยในผู้สูงอายุ ต้อง monitor serum Na⁺")],
    "CBZ ADR: SJS (HLA-B*1502), SIADH/hyponatremia, agranulocytosis (rare), CYP inducer; ระวัง Carbamazepine-10,11-epoxide (active metabolite)"
  )},
  { n:61, det: d(
    "ประเภท suppository base: PEG molecular weight ต่ำ",
    "PEG (low MW) = water-soluble base ละลายน้ำ ไม่ต้องพึ่ง body temperature",
    [c("A","Oleaginous base","✗ ผิด — Oleaginous base เช่น Cocoa butter, Hard fat ละลายด้วย body heat (35-37°C) ไม่ละลายน้ำ"),
     c("B","Water soluble base","✓ ถูก — PEG (polyethylene glycol) = water-soluble base ละลายในสารคัดหลั่งในทวารหนัก ไม่ต้องพึ่ง body heat; ดีในคลิมาบร้อน"),
     c("C","Water removable base","✗ ผิด — Water removable = emulsion base เช่น cream base ไม่ใช่ PEG"),
     c("D","Emulsion base","✗ ผิด — Emulsion base เช่น o/w cream ไม่ใช่ PEG suppository"),
     c("E","Absorption base","✗ ผิด — Absorption base เช่น Anhydrous lanolin ดูดซับน้ำได้แต่ยังเป็น oleaginous")],
    "Suppository bases: Oleaginous (Cocoa butter, Witepsol) = melt at body temp; Water-soluble (PEG) = dissolve in secretions"
  )},
  { n:62, det: d(
    "Dissolution Apparatus สำหรับ Suppository",
    "USP Apparatus 3 (Reciprocating cylinder) เหมาะสำหรับ suppository dissolution",
    [c("A","Apparatus 1 (Basket)","✗ ผิด — Apparatus 1 = สำหรับ capsule, floating tablets ไม่เหมาะ suppository"),
     c("B","Apparatus 2 (Paddle)","✗ ผิด — Apparatus 2 = standard สำหรับ tablets; ไม่ออกแบบมาสำหรับ suppository"),
     c("C","Apparatus 3 (Reciprocating cylinder)","✓ ถูก — Apparatus 3 = reciprocating cylinder เหมาะสำหรับ suppository และ extended release beads; เลียนแบบ rectal environment"),
     c("D","Apparatus 4 (Flow-through cell)","✗ ผิด — Apparatus 4 = flow-through cell ใช้สำหรับ poorly soluble drugs, implants"),
     c("E","Apparatus 5","✗ ผิด — Apparatus 5 = Paddle over disk ใช้สำหรับ transdermal patch")],
    "Dissolution apparatuses: 1=Basket, 2=Paddle, 3=Reciprocating, 4=Flow-through, 5=Paddle/disk(transdermal), 6=Rotating cylinder, 7=Reciprocating holder"
  )},
  { n:63, det: d(
    "ยาที่ไม่ควรใช้ monotherapy รักษา H. pylori",
    "Metronidazole เดี่ยว = high resistance rate → ต้องใช้ใน combination เท่านั้น",
    [c("A","Amoxicillin","✗ ผิด — Amoxicillin มี low resistance rate ใน H. pylori; ใช้ใน triple/quadruple therapy"),
     c("B","Tetracycline","✗ ผิด — Tetracycline ยังมี good activity ต่อ H. pylori ใช้ใน bismuth quadruple"),
     c("C","Metronidazole เดี่ยว","✓ ถูก — Metronidazole resistance rate สูง (>40% ในหลายพื้นที่) ถ้าใช้เดี่ยว; แต่เมื่อใช้ร่วมกับ Bismuth มี synergistic effect ที่ overcome resistance"),
     c("D","Bismuth","✗ ผิด — Bismuth มี intrinsic antibacterial activity ต่อ H. pylori และ ลด resistance"),
     c("E","PPI","✗ ผิด — PPI ไม่มีฤทธิ์ antibacterial โดยตรง แต่เพิ่ม MIC ของ H. pylori ต่อยาอื่นโดย raise gastric pH")],
    "H. pylori resistance: Clarithromycin 20-30% (ไทย), Metronidazole >40%; Amoxicillin/Tetracycline ยัง low resistance"
  )},
  { n:64, det: d(
    "H. pylori regimen เมื่อแพ้ Clarithromycin",
    "Clarithromycin allergy → ใช้ PPI + Amoxicillin + Metronidazole (Non-clarithromycin triple)",
    [c("A","PPI + Amoxicillin + Clarithromycin","✗ ผิด — ไม่ใช้ยาที่แพ้; ห้ามใช้ Clarithromycin"),
     c("B","PPI + Amoxicillin + Metronidazole","✓ ถูก — Non-clarithromycin triple therapy: PPI + Amoxicillin 1g BD + Metronidazole 500mg BD × 14 วัน; alternative ที่ดีเมื่อแพ้ Clarithromycin"),
     c("C","PPI เดี่ยว","✗ ผิด — PPI เดี่ยวไม่ eradicate H. pylori"),
     c("D","Amoxicillin + Doxycycline","✗ ผิด — Combination นี้ไม่ใช่ validated H. pylori regimen"),
     c("E","ไม่รักษา","✗ ผิด — H. pylori positive ต้องรักษาเสมอเพื่อป้องกัน peptic ulcer, MALT lymphoma, gastric cancer")],
    "H. pylori allergy alternatives: Clarithro allergy → PPI+Amox+Metro; Penicillin allergy → Bismuth quadruple"
  )},
  { n:65, det: d(
    "ผลข้างเคียงของ PPI ระยะยาว",
    "Long-term PPI เพิ่มความเสี่ยง C. difficile infection (CDI)",
    [c("A","Agranulocytosis","✗ ผิด — Agranulocytosis ไม่ใช่ ADR ของ PPI"),
     c("B","Hepatotoxicity","✗ ผิด — PPI hepatotoxicity พบน้อยมาก"),
     c("C","เพิ่มความเสี่ยง Clostridium difficile infection","✓ ถูก — Long-term PPI: ↑ gastric pH → ↑ C. difficile spore survival → ↑ CDI risk; ยังเพิ่ม Mg²⁺ def, Vit B12 def, hip fracture"),
     c("D","Pneumonia","✗ ผิด — มีหลักฐาน PPI อาจเพิ่ม community-acquired pneumonia เล็กน้อย แต่ไม่ใช่ ADR หลักที่ต้องระวัง"),
     c("E","Hypercalcemia","✗ ผิด — Hypercalcemia ไม่ใช่ ADR ของ PPI")],
    "Long-term PPI ADR: CDI, Hypomagnesemia, Vit B12 deficiency, Hip fracture (ลด Ca absorption), CKD (controversial)"
  )},
  { n:66, det: d(
    "Cotrimoxazole ใน HIV",
    "Cotrimoxazole = drug of choice สำหรับ PCP prophylaxis และ treatment",
    [c("A","MAC infection","✗ ผิด — MAC prophylaxis/treatment ใช้ Azithromycin/Clarithromycin + Ethambutol"),
     c("B","Pneumocystis jirovecii pneumonia (PCP) prophylaxis/treatment","✓ ถูก — TMP-SMX = drug of choice: PCP treatment (high dose) และ PCP prophylaxis (CD4<200/mm³); ยังป้องกัน Toxoplasma (CD4<100)"),
     c("C","CMV retinitis","✗ ผิด — CMV retinitis ใช้ Ganciclovir/Valganciclovir หรือ Foscarnet"),
     c("D","Cryptococcal meningitis","✗ ผิด — Cryptococcus ใช้ Amphotericin B + Flucytosine (induction) → Fluconazole (maintenance)"),
     c("E","Aspergillosis","✗ ผิด — Aspergillosis ใช้ Voriconazole หรือ Amphotericin B")],
    "HIV OI prophylaxis: CD4<200→TMP-SMX (PCP); CD4<100→ + Toxo prophylaxis; CD4<50→ + MAC (Azithromycin weekly)"
  )},
  { n:67, det: d(
    "กลไกการออกฤทธิ์ของ Doxorubicin (Anthracycline)",
    "Doxorubicin intercalates DNA + inhibits Topoisomerase II → DNA strand breaks",
    [c("A","ยับยั้ง purine base guanine","✗ ผิด — MMF/Mycophenolic acid ยับยั้ง IMPDH → ลด guanosine synthesis"),
     c("B","ยับยั้ง tyrosine kinase","✗ ผิด — Tyrosine kinase inhibitors = Imatinib, Erlotinib, Gefitinib"),
     c("C","ยับยั้ง pyrimidine analogue","✗ ผิด — Pyrimidine analogues = 5-FU, Capecitabine, Cytarabine"),
     c("D","ยับยั้ง Topoisomerase II","✓ ถูก — Doxorubicin: intercalate DNA (ขัดขวาง replication/transcription) + inhibit Topoisomerase II → DNA DSBs → apoptosis; free radicals → cardiotoxicity"),
     c("E","ยับยั้ง dihydrofolate reductase","✗ ผิด — DHFR inhibitor = Methotrexate (antifolate)")],
    "Anthracycline: Doxorubicin, Daunorubicin, Epirubicin; Cardiotoxicity cumulative dose >450-550 mg/m² → dilated cardiomyopathy"
  )},
  { n:68, det: d(
    "คำนวณขนาด Doxorubicin ใน AC regimen",
    "Doxorubicin 60 mg/m² × BSA 1.4 m² = 84 mg ≈ 85 mg",
    [c("A","85 mg","✓ ถูก — 60 mg/m² × 1.4 m² = 84 mg ≈ 85 mg (rounded); สอดคล้องกับ 5 mg increment rounding"),
     c("B","120 mg","✗ ผิด — 120 mg = 60 × 2.0 m²; BSA ผิด"),
     c("C","860 mg","✗ ผิด — หน่วยผิด; คำนวณผิด"),
     c("D","1,200 mg","✗ ผิด — นี่คือขนาด Cyclophosphamide (600 mg/m² × 2.0 = 1200 mg) ไม่ใช่ Doxorubicin"),
     c("E","3,900 mg","✗ ผิด — ผิดพลาดอย่างมาก")],
    "BSA-based dosing: Dose = mg/m² × BSA; BSA คำนวณด้วย Mosteller: BSA = √(H×W/3600); AC = Doxorubicin 60 + Cyclophosphamide 600 mg/m²"
  )},
  { n:69, det: d(
    "Antiemetic สำหรับ Highly Emetogenic Chemotherapy (HEC)",
    "HEC: 5HT3 antagonist + NK1 antagonist (Aprepitant) + Dexamethasone = triple regimen",
    [c("A","Progestin-only pill","✗ ผิด — Progestin ไม่ใช้สำหรับ chemotherapy-induced nausea"),
     c("B","Ondansetron + Aprepitant + Dexamethasone","✓ ถูก — NCCN: HEC (เช่น Cisplatin, AC regimen) → Triple: 5HT3-RA (Ondansetron) + NK1-RA (Aprepitant/Fosaprepitant) + Dexamethasone; ± Olanzapine"),
     c("C","Ondansetron + Dexamethasone เท่านั้น","✗ ผิด — Double therapy เพียงพอสำหรับ MEC (Moderately Emetogenic) ไม่ใช่ HEC"),
     c("D","Granisetron เดี่ยว","✗ ผิด — 5HT3-RA เดี่ยวไม่เพียงพอสำหรับ HEC"),
     c("E","Dolasetron เดี่ยว","✗ ผิด — Dolasetron เดี่ยวไม่เพียงพอสำหรับ HEC")],
    "HEC antiemetic: 5HT3-RA + NK1-RA + Dex ± Olanzapine; MEC: 5HT3-RA + Dex; Dexamethasone ใช้ D1-D3/D4"
  )},
  { n:70, det: d(
    "COPD GOLD stage ที่ใช้ Tiotropium Handihaler",
    "Tiotropium LAMA = first-line maintenance ใน GOLD 2 (Moderate) ขึ้นไป",
    [c("A","GOLD 1 (Mild)","✗ ผิด — GOLD 1 FEV1≥80%; SABA PRN เพียงพอ; LAMA ไม่จำเป็นใน GOLD 1 ที่ไม่มีอาการ"),
     c("B","GOLD 2 (Moderate)","✓ ถูก — GOLD 2: FEV1 50-79%; LAMA (Tiotropium) เป็น preferred maintenance ใน GOLD 2 ที่มีอาการ (Group B/E)"),
     c("C","GOLD 3 (Severe)","✗ ผิด — ใช้ได้ใน GOLD 3 ด้วย แต่โจทย์ถามว่า stage ใดที่ match กับ Tiotropium เดี่ยว; GOLD 3 มักต้อง LAMA+LABA หรือ triple"),
     c("D","GOLD 4 (Very severe)","✗ ผิด — GOLD 4 FEV1<30%; มักต้อง triple therapy"),
     c("E","ไม่สามารถระบุได้","✗ ผิด — Tiotropium เดี่ยวเหมาะสมที่สุดกับ GOLD 2 Group B/E ที่มีอาการ")],
    "GOLD 2024: GOLD A=SABA PRN, GOLD B=LAMA or LABA, GOLD E=LAMA+LABA; ICS เพิ่มเมื่อ exacerbation ≥2 หรือ eos≥300"
  )},
  { n:71, det: d(
    "ข้อที่ไม่ถูกต้องเกี่ยวกับ LAMA (Tiotropium) ใน COPD",
    "LAMA เป็น maintenance therapy ไม่ใช่ rescue drug; ใน acute bronchospasm ใช้ SABA",
    [c("A","บรรเทาอาการได้น้อยกว่า SABA ใน acute bronchospasm","✓ นี่คือข้อที่ผิด — ข้อความนี้ถูกต้อง: LAMA onset ช้ากว่า SABA; ใน acute attack ต้องใช้ SABA (Salbutamol) ไม่ใช่ LAMA; คำถามถามข้อ 'ไม่ถูกต้อง' = ข้อที่เป็น false statement"),
     c("B","ลด exacerbation ได้ดีกว่า LABA ในบางกรณี","✗ คำตอบนี้ถูกต้อง — UPLIFT trial: Tiotropium ลด exacerbation ได้ดีกว่า LABA ในบางกลุ่ม"),
     c("C","ออกฤทธิ์ยาวนาน 24 ชั่วโมง","✗ ถูก — Tiotropium = once daily (24h duration); Ipratropium = short-acting (4-6h)"),
     c("D","เป็น M3 muscarinic antagonist","✗ ถูก — Tiotropium = selective M3 antagonist → bronchodilation; Ipratropium = non-selective"),
     c("E","ใช้เป็น maintenance therapy","✗ ถูก — LAMA = maintenance ไม่ใช่ rescue")],
    "LAMA: onset 30-60 min → ไม่ใช่ rescue; SABA: onset 5 min → rescue; Tiotropium kinetically selective M3"
  )},
  { n:72, det: d(
    "First-line maintenance therapy ใน COPD GOLD Group B",
    "GOLD 2024 Group B → เริ่มด้วย LAMA หรือ LABA เดี่ยว",
    [c("A","LAMA หรือ LABA เดี่ยว","✓ ถูก — GOLD 2024: Group B (few symptoms, few exacerbations) → LAMA or LABA as initial maintenance; preferably LAMA"),
     c("B","ICS/LABA combination","✗ ผิด — ICS/LABA ใช้ใน Group E (≥2 exacerbations หรือ ≥1 hospitalization หรือ eos≥300); ไม่ใช่ first-line ใน Group B"),
     c("C","Triple therapy","✗ ผิด — Triple (LAMA+LABA+ICS) ใช้ใน severe/uncontrolled Group E"),
     c("D","SABA + SAMA","✗ ผิด — Short-acting combination ใช้ PRN ไม่ใช่ scheduled maintenance"),
     c("E","Theophylline","✗ ผิด — Theophylline narrow TI, drug interactions มาก; ไม่ใช่ first-line")],
    "GOLD 2024 Groups: A=PRN SABA, B=LAMA or LABA, E=LAMA+LABA ± ICS (eos≥300); ICS ไม่ใช้ใน COPD ที่ไม่มี asthma overlap"
  )},
  { n:73, det: d(
    "ADR ที่ไม่ใช่ของ Anticholinergic (Tiotropium)",
    "Diabetes ไม่ใช่ ADR ของ anticholinergic mechanism",
    [c("A","Dry mouth","✗ ถูก (เป็น ADR จริง) — Anticholinergic ยับยั้ง M3 ใน salivary gland → dry mouth; ADR พบบ่อยที่สุดของ Tiotropium"),
     c("B","Urinary retention","✗ ถูก (เป็น ADR จริง) — ยับยั้ง M3 ใน detrusor → urinary retention; ระวังใน BPH"),
     c("C","Constipation","✗ ถูก (เป็น ADR จริง) — ยับยั้ง M3 ใน GI smooth muscle → ลด peristalsis → constipation"),
     c("D","Diabetes mellitus","✓ นี่คือข้อที่ไม่ใช่ ADR — Diabetes ไม่ใช่ผลของ anticholinergic mechanism; ไม่มี M3 receptor ที่ควบคุม glucose metabolism"),
     c("E","Blurred vision","✗ ถูก (เป็น ADR จริง) — ยับยั้ง M3 ใน ciliary muscle/iris sphincter → mydriasis + cycloplegia → blurred vision")],
    "Anticholinergic ADRs: 'DUMBELLS' reversed = Dry mouth, Urinary retention, Mydriasis, Blurred vision, ↓ GI, Tachycardia, ↓ secretions"
  )},
  { n:74, det: d(
    "การ escalate ยาเมื่อ COPD ยังมี exacerbation ≥2 ครั้ง/ปี",
    "LAMA + ICS/LABA = triple therapy → ลด exacerbation",
    [c("A","SABA เพิ่ม","✗ ผิด — SABA เป็น rescue ไม่ใช่ maintenance; เพิ่ม SABA ไม่ลด exacerbation"),
     c("B","เพิ่ม ICS/LABA (เป็น triple therapy)","✓ ถูก — IMPACT/ETHOS trial: Triple therapy (LAMA+ICS/LABA) ลด exacerbation อย่างมีนัยสำคัญในผู้ป่วยที่มี eosinophils สูงหรือ exacerbation ≥2 ครั้ง"),
     c("C","เปลี่ยนเป็น Theophylline","✗ ผิด — Theophylline ไม่ใช่ preferred escalation; side effects สูง, DDI มาก"),
     c("D","หยุด LAMA เปลี่ยนเป็น LABA","✗ ผิด — ไม่ลดขนาดการรักษา; ควรเพิ่มไม่ใช่เปลี่ยน"),
     c("E","ไม่ต้องเพิ่ม","✗ ผิด — ≥2 exacerbations/ปี = ต้องปรับขึ้น therapy")],
    "COPD escalation: LAMA → LAMA+LABA → Triple (LAMA+ICS/LABA); ICS ช่วยเมื่อ eos≥100-300 หรือ exacerbation ≥2"
  )},
  { n:75, det: d(
    "การจำแนก Alkaloid จากโครงสร้างเคมี (ข้อ 75)",
    "Tropane alkaloid = N-methyl bridged bicyclic ring; ตัวอย่าง: Atropine, Scopolamine",
    [c("A","Isoquinoline alkaloid","✗ ผิด — Isoquinoline มี fused benzene+pyridine; ตัวอย่าง: Morphine, Tubocurarine, Berberine"),
     c("B","Indole alkaloid","✗ ผิด — Indole มี fused benzene+pyrrole; ตัวอย่าง: LSD, Ergotamine, Strychnine"),
     c("C","Tropane alkaloid","✓ ถูก — Tropane ring = N-methyl piperidine fused cyclopentane = ecgonine backbone; ตัวอย่าง: Atropine, Scopolamine, Cocaine, Hyoscyamine"),
     c("D","Purine alkaloid","✗ ผิด — Purine alkaloids: Caffeine (trimethylxanthine), Theophylline, Theobromine"),
     c("E","Steroidal alkaloid","✗ ผิด — Steroidal alkaloids เช่น Solanine (potato), Veratridine; มี steroid skeleton")],
    "สังเกต Tropane: มี N หักมุม + bicyclic; Cocaine = tropane; Atropine = racemic hyoscyamine"
  )},
  { n:76, det: d(
    "Muscarinic receptor antagonist",
    "Ipratropium/Tiotropium = M3 muscarinic receptor antagonist → bronchodilation",
    [c("A","Atenolol","✗ ผิด — Atenolol = cardioselective β1 blocker ไม่ใช่ muscarinic antagonist"),
     c("B","Prazosin","✗ ผิด — Prazosin = α1 adrenergic blocker ใช้ใน hypertension/BPH"),
     c("C","Amlodipine","✗ ผิด — Amlodipine = calcium channel blocker (dihydropyridine) ไม่มีผลต่อ muscarinic receptor"),
     c("D","Ipratropium / Tiotropium","✓ ถูก — Tiotropium/Ipratropium = anticholinergic/antimuscarinic (M3 antagonist) → ลด bronchoconstriction และ secretions; ใช้ใน COPD"),
     c("E","Metformin","✗ ผิด — Metformin = biguanide ยา antidiabetic ไม่มีผลต่อ muscarinic receptor")],
    "Muscarinic antagonists: Atropine (nonselective), Ipratropium (inhaled, short-acting), Tiotropium (inhaled, long-acting M3 selective)"
  )},
  { n:77, det: d(
    "First-line สำหรับ Ascariasis (พยาธิไส้เดือน)",
    "Albendazole single dose = first-line สำหรับ soil-transmitted helminths",
    [c("A","Albendazole","✓ ถูก — Albendazole 400 mg single dose = first-line สำหรับ Ascariasis, hookworm, trichuriasis, enterobiasis; benzimidazole → ยับยั้ง beta-tubulin"),
     c("B","Mebendazole","✗ ผิด — Mebendazole 500 mg single dose ก็ใช้ได้ แต่ Albendazole ดีกว่า bioavailability และ preferred"),
     c("C","Niclosamide","✗ ผิด — Niclosamide ใช้สำหรับ cestodes (tapeworm) เฉพาะ intestinal; ไม่ใช่ nematodes"),
     c("D","Praziquantel","✗ ผิด — Praziquantel ใช้สำหรับ trematodes (flukes) และ tapeworm ไม่ใช่ Ascariasis"),
     c("E","Ivermectin","✗ ผิด — Ivermectin ใช้สำหรับ Strongyloides, Onchocerca; ไม่ใช่ first-line สำหรับ Ascaris")],
    "STH (Soil-Transmitted Helminths): Albendazole 400mg single dose ครอบคลุม roundworm, hookworm, whipworm, pinworm"
  )},
  { n:78, det: d(
    "ยาที่ดีที่สุดสำหรับ Taenia (พยาธิตัวตืด)",
    "Praziquantel = drug of choice สำหรับ Cestoda (tapeworm) ทุกชนิด",
    [c("A","Albendazole","✗ ผิด — Albendazole ใช้กับ nematodes เป็นหลัก; สำหรับ tapeworm มีฤทธิ์อ่อนกว่า Praziquantel"),
     c("B","Praziquantel","✓ ถูก — Praziquantel = drug of choice สำหรับ Cestodes (Taenia, Diphyllobothrium) และ Trematodes (Schistosoma, Clonorchis, Opisthorchis, Paragonimus)"),
     c("C","Niclosamide","✗ ผิด — Niclosamide ใช้ได้สำหรับ intestinal tapeworm แต่ Praziquantel preferred; Niclosamide ไม่ absorbed ลำไส้จึงไม่ใช้กับ systemic disease"),
     c("D","Mebendazole","✗ ผิด — Mebendazole ใช้กับ nematodes เป็นหลัก"),
     c("E","Ivermectin","✗ ผิด — Ivermectin ใช้กับ Strongyloides, filarial, scabies ไม่ใช่ tapeworm")],
    "Praziquantel กลไก: เพิ่ม Ca²⁺ permeability → spastic paralysis ของพยาธิ; ใช้ได้กับ Schistosoma, Taenia, Opisthorchis"
  )},
  { n:79, det: d(
    "กลไกของ Albendazole ในการฆ่าพยาธิ",
    "Benzimidazoles ยับยั้ง beta-tubulin → microtubule disruption → ลด glucose uptake → พยาธิตาย",
    [c("A","ยับยั้ง acetylcholinesterase","✗ ผิด — Organophosphate ยับยั้ง AChE ไม่ใช่ benzimidazoles"),
     c("B","กล้ามเนื้อพยาธิหดเกร็ง","✗ ผิด — Piperazine ทำให้ atonic paralysis; Levamisole ทำ spastic paralysis; Benzimidazole ไม่ใช่กลไกนี้"),
     c("C","ยับยั้ง beta-tubulin → microtubule disruption","✓ ถูก — Albendazole/Mebendazole ยับยั้งการ polymerization ของ beta-tubulin → ทำลาย microtubule ของพยาธิ → ลดการดูดซึม glucose → ATP ลด → พยาธิตาย"),
     c("D","เพิ่ม Cl- influx → hyperpolarization","✗ ผิด — Ivermectin กลไกนี้: เพิ่ม Cl⁻ conductance ผ่าน GluCl channels → hyperpolarization → paralysis"),
     c("E","ยับยั้ง dihydrofolate reductase","✗ ผิด — DHFR inhibitor = Pyrimethamine (antiprotozoal), Trimethoprim (antibacterial)")],
    "Benzimidazole MOA: beta-tubulin inhibition (colchicine-binding site) → microtubule disruption → no glucose uptake → ATP depletion"
  )},
  { n:80, det: d(
    "คุณสมบัติที่จำเป็นของ Ophthalmic Solution",
    "Ophthalmic solution ต้องเป็น sterile เสมอ เพราะตาเสี่ยงต่อ infection",
    [c("A","ต้องเป็น sterile product","✓ ถูก — Ophthalmic preparation ต้องเป็น sterile เสมอ เพราะตาไม่มี immune defense ที่ดี; non-sterile → bacterial endophthalmitis"),
     c("B","ไม่ต้อง isotonic","✗ ผิด — ต้อง isotonic (~280-320 mOsm) ไม่เช่นนั้นทำให้ discomfort และ cell damage"),
     c("C","pH ไม่สำคัญ","✗ ผิด — pH สำคัญมาก: ต้องอยู่ในช่วง 6.5-7.4 ใกล้เคียง tear fluid; pH ต่างมากทำให้เจ็บตา"),
     c("D","ไม่ต้อง preservative","✗ ผิด — Multi-dose ophthalmic ต้อง preservative; single-dose preservative-free ก็ต้อง sterile เหมือนกัน"),
     c("E","สามารถมี particulate matter ได้บ้าง","✗ ผิด — ต้องปราศจาก particulate matter เด็ดขาด; อาจทำให้ corneal scratch หรือ inflammation")],
    "Ophthalmic requirements: Sterile + Isotonic (280-320 mOsm) + pH 6.5-7.4 + Particulate-free + Preserved (multi-dose)"
  )},
];

(async () => {
  let count = 0;
  for (const item of data) {
    await db.execute({
      sql: 'UPDATE mcq_questions SET detailed_explanation = ? WHERE question_number = ? AND exam_source = ?',
      args: [JSON.stringify(item.det), item.n, 'Pharmacyguru']
    });
    count++;
    if (count % 10 === 0) process.stdout.write(count + '/40 ');
  }
  console.log('\nDone Q41-80');
})();
