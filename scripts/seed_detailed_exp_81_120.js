const { createClient } = require('@libsql/client');
const db = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const d = (summary, reason, choices, key_takeaway) => ({ summary, reason, choices, key_takeaway });
const c = (label, text, explanation) => ({ label, text, explanation });

const data = [
  { n:81, det: d(
    "Ciprofloxacin Ophthalmic Solution ใช้รักษาโรคตาชนิดใด",
    "Ciprofloxacin ophthalmic = fluoroquinolone → bacterial conjunctivitis/keratitis",
    [c("A","Allergic conjunctivitis","✗ ผิด — Allergic conjunctivitis ใช้ antihistamine eye drops (Ketotifen, Olopatadine) หรือ mast cell stabilizers"),
     c("B","Bacterial conjunctivitis","✓ ถูก — Ciprofloxacin ophthalmic 0.3% = fluoroquinolone antimicrobial; ใช้ bacterial conjunctivitis, bacterial keratitis, corneal ulcer จากเชื้อแบคทีเรีย"),
     c("C","Viral conjunctivitis","✗ ผิด — Viral conjunctivitis (adenovirus) ใช้ supportive treatment; antibiotic ไม่มีผล"),
     c("D","Hordeolum (กุ้งยิง)","✗ ผิด — Hordeolum = S. aureus abscess; ใช้ warm compress ± topical antibiotic (เช่น fucidic acid) ไม่ใช่ fluoroquinolone primarily"),
     c("E","Trachoma","✗ ผิด — Trachoma (Chlamydia trachomatis) ใช้ Azithromycin systemic หรือ Tetracycline eye ointment")],
    "Ciprofloxacin ophthalmic: broad-spectrum gram-negative/positive; bacteria keratitis เลือก fluoroquinolone (Cipro, Moxiflo)"
  )},
  { n:82, det: d(
    "คุณสมบัติที่ไม่จำเป็นใน Ophthalmic Solution ทุกสูตร",
    "Viscosity enhancer ไม่จำเป็นในทุกสูตร — เพิ่มเฉพาะสูตรที่ต้องการ contact time ยาวขึ้น",
    [c("A","Sterility","✗ ถูก (จำเป็น) — Sterility จำเป็นในทุก ophthalmic preparation"),
     c("B","Isotonicity","✗ ถูก (จำเป็น) — Isotonicity จำเป็นเพื่อ comfort และป้องกัน cell damage"),
     c("C","Appropriate pH","✗ ถูก (จำเป็น) — pH 6.5-7.4 จำเป็นสำหรับ comfort และ stability"),
     c("D","Viscosity enhancer จำเป็นในทุกสูตร","✓ นี่คือข้อที่ไม่ถูก — Viscosity enhancer (HPMC, PVA) ไม่จำเป็นในทุกสูตร เพิ่มเฉพาะสูตร eye drops ที่ต้องการยืด contact time (เช่น artificial tears)"),
     c("E","Preserved หรือ preservative-free","✗ ถูก (จำเป็น) — ต้องเลือกว่าจะ preserved หรือ preservative-free ขึ้นกับ packaging และ indication")],
    "Ophthalmic optional: viscosity enhancer, tonicity agents, antioxidants; ต้องมีเสมอ: sterility, appropriate pH, isotonic"
  )},
  { n:83, det: d(
    "Buffer ที่ใช้บ่อยที่สุดใน Ophthalmic Solution",
    "Phosphate buffer ใช้บ่อยที่สุดใน ophthalmic preparation — compatible กับ eye tissue",
    [c("A","Phosphate","✓ ถูก — Phosphate buffer (Na₂HPO₄/NaH₂PO₄) ใช้บ่อยที่สุดใน ophthalmic; compatible กับ eye tissue, รักษา pH 6-8, ไม่ระคายเคือง"),
     c("B","Borate","✗ ผิด — Borate buffer ใช้ได้แต่ไม่เหมาะกับ eye ที่มี soft contact lens; ทำ complex กับ polyol"),
     c("C","Citrate","✗ ผิด — Citrate buffer ใช้ในยาฉีด IV มากกว่า ophthalmic"),
     c("D","Carbonate","✗ ผิด — Carbonate buffer ไม่เหมาะ ophthalmic เพราะ pH สูงเกินไป"),
     c("E","Acetate","✗ ผิด — Acetate buffer ใช้ใน parenteral formulation มากกว่า ophthalmic")],
    "Ophthalmic buffers: Phosphate (most common), Borate (avoid contact lens), Acetate (low pH range); pH 6.5-7.4"
  )},
  { n:84, det: d(
    "Test ที่ไม่ใช่ของ Ophthalmic Solution ตาม USP",
    "Uniformity of dosage unit ใช้กับ solid dosage form ไม่ใช่ solution",
    [c("A","ASSAY ด้วย Liquid chromatography","✗ ถูก (มีใน USP) — ASSAY เป็น test มาตรฐานสำหรับ ophthalmic solution"),
     c("B","Identification","✗ ถูก (มีใน USP) — Identity test มีในทุก USP monograph"),
     c("C","pH testing","✗ ถูก (มีใน USP) — pH testing สำคัญสำหรับ ophthalmic"),
     c("D","Uniformity of dosage unit","✓ นี่คือ test ที่ไม่ใช่ — Uniformity of dosage units ใช้กับ tablets, capsules; solutions ใช้ Uniformity of content (ถ้าจำเป็น) หรือ ASSAY แทน"),
     c("E","Sterility testing","✗ ถูก (มีใน USP) — Sterility testing จำเป็นสำหรับ ophthalmic solutions (Sterility test; membrane filtration method)")],
    "USP Ophthalmic tests: ID, ASSAY, pH, Sterility, Particulate matter, Leakage test; ไม่มี uniformity of dosage units"
  )},
  { n:85, det: d(
    "RSD ของ ASSAY สำหรับ Ciprofloxacin Ophthalmic Solution",
    "RSD NMT 5% ตาม USP monograph สำหรับ inorganic impurities/ASSAY",
    [c("A","NMT 5% (inorganic impurities)","✓ ถูก — USP Ciprofloxacin Ophthalmic Solution: RSD ≤ 5% สำหรับ system suitability ใน ASSAY"),
     c("B","NMT 2%","✗ ผิด — 2% เข้มงวดเกินไปสำหรับ ophthalmic solution ASSAY"),
     c("C","NMT 10%","✗ ผิด — ≤10% หลวมเกินไป; ใช้สำหรับบางชนิด"),
     c("D","NMT 0.5%","✗ ผิด — 0.5% เข้มงวดมากเกินไปสำหรับ routine ASSAY"),
     c("E","NMT 15%","✗ ผิด — หลวมเกินไปสำหรับ ASSAY")],
    "System suitability RSD ใน HPLC ASSAY ทั่วไป: ≤2% (USP strict), ≤5% (บางสูตร); Check specific monograph เสมอ"
  )},
  { n:86, det: d(
    "Acceptance criteria ASSAY ของ Ciprofloxacin Ophthalmic Solution",
    "USP Ciprofloxacin Ophthalmic Solution: 90.0-115.0%",
    [c("A","90.0-110.0%","✗ ผิด — 90-110% ใช้กับ tablet/capsule มาตรฐาน ไม่ใช่ ophthalmic solution"),
     c("B","95.0-105.0%","✗ ผิด — 95-105% แคบเกินไปสำหรับ ophthalmic solution"),
     c("C","90.0-115.0%","✓ ถูก — USP Ciprofloxacin Ophthalmic Solution acceptance criteria: 90.0-115.0% of labeled amount (wider upper limit เพราะ concentration loss ต่ำกว่าสม่ำเสมอ)"),
     c("D","98.0-102.0%","✗ ผิด — แคบเกินไป; ใช้กับ pure chemicals เช่น CaCO₃"),
     c("E","97.0-103.0%","✗ ผิด — ยังแคบเกินไปสำหรับ ophthalmic solution")],
    "Acceptance criteria: pure chemical 98.5-101.5%; tablets 90-110%; some ophthalmic 90-115%; check USP monograph เสมอ"
  )},
  { n:87, det: d(
    "เชื้อก่อ Herpes labialis (Cold sore)",
    "HSV-1 = สาเหตุหลักของ herpes labialis/cold sore บริเวณริมฝีปาก",
    [c("A","Cytomegalovirus","✗ ผิด — CMV ทำให้เกิด mononucleosis, retinitis, congenital CMV ไม่ใช่ cold sore"),
     c("B","Herpes simplex virus type 1 (HSV-1)","✓ ถูก — HSV-1 = primary cause ของ herpes labialis (cold sore); latent ใน trigeminal ganglion → reactivate → oral lesion"),
     c("C","Varicella zoster virus","✗ ผิด — VZV ทำให้ chickenpox (primary) และ shingles (reactivation); herpes zoster ≠ herpes labialis"),
     c("D","Herpes simplex virus type 2","✗ ผิด — HSV-2 = primary cause ของ genital herpes; แต่ cross-infection ได้"),
     c("E","Human Papilloma virus","✗ ผิด — HPV ทำให้ warts, condyloma, cervical cancer ไม่ใช่ cold sore")],
    "HSV-1: oral herpes, encephalitis; HSV-2: genital herpes; ทั้งคู่ latent ใน sensory ganglia → recurrence trigger: stress, UV, fever"
  )},
  { n:88, det: d(
    "กลไกการออกฤทธิ์ของ Acyclovir",
    "Acyclovir → phosphorylated by viral TK → chain terminator ของ viral DNA polymerase",
    [c("A","Protease inhibitor","✗ ผิด — HIV protease inhibitors (Ritonavir, Lopinavir) ใช้กับ HIV ไม่ใช่ Herpes"),
     c("B","DNA polymerase inhibitor แบบ competitive","✗ ผิด — Acyclovir-TP เป็นทั้ง competitive inhibitor AND chain terminator; ไม่ใช่แค่ competitive"),
     c("C","DNA polymerase inhibitor (chain terminator)","✓ ถูก — Acyclovir → viral TK phosphorylates → Acyclovir-TP → ขัดขวาง viral DNA polymerase: competitive inhibitor + chain terminator (ไม่มี 3'-OH → DNA elongation หยุด)"),
     c("D","Reverse transcriptase inhibitor","✗ ผิด — NRTI/NNRTI ใช้กับ HIV ไม่ใช่ HSV"),
     c("E","Neuraminidase inhibitor","✗ ผิด — Oseltamivir/Zanamivir = neuraminidase inhibitor ใช้กับ Influenza")],
    "Acyclovir selectivity: ต้อง viral TK (HSV/VZV) phosphorylate → ปลอดภัยกว่า Ganciclovir ซึ่ง cellular kinase phosphorylate ด้วย → myelosuppression"
  )},
  { n:89, det: d(
    "กรณีที่ต้องใช้ยาอื่นแทน Acyclovir",
    "CMV ขาด thymidine kinase → Acyclovir ไม่ถูก activate → ไม่มีประสิทธิภาพ",
    [c("A","Cytomegalovirus (CMV) infection","✓ ถูก — CMV ไม่มี thymidine kinase ที่จะ phosphorylate Acyclovir → ต้องใช้ Ganciclovir (activated by UL97 kinase) หรือ Valganciclovir, Foscarnet"),
     c("B","Varicella zoster","✗ ผิด — VZV มี TK → Acyclovir ใช้ได้ แต่ต้องใช้ขนาดสูงกว่า HSV (800 mg 5×/วัน); Valacyclovir preferred"),
     c("C","Herpes simplex","✗ ผิด — HSV มี TK → Acyclovir ใช้ได้ดี เป็น drug of choice"),
     c("D","Epstein-Barr virus","✗ ผิด — EBV มี TK แต่ Acyclovir efficacy ต่ำ; ไม่มี standard antiviral ที่ชัดเจนสำหรับ EBV"),
     c("E","Human herpesvirus 6","✗ ผิด — HHV-6 ไม่ตอบสนองต่อ Acyclovir ดี; ใช้ Ganciclovir/Foscarnet แต่ไม่ใช่ standard indication ที่ต้องพิสูจน์ TK absence")],
    "CMV treatment: Ganciclovir IV (first-line), Valganciclovir PO, Foscarnet (GCV-resistant), Cidofovir; ไม่ใช้ Acyclovir"
  )},
  { n:90, det: d(
    "ขนาด Acyclovir สำหรับ Herpes genitalis first episode",
    "HSV genitalis first episode: Acyclovir 400 mg TID × 7-10 วัน",
    [c("A","200 mg TID 5 วัน","✗ ผิด — 200 mg TID ใช้สำหรับ suppressive therapy ไม่ใช่ acute treatment; 5 วันสั้นเกินไปสำหรับ first episode"),
     c("B","400 mg TID นาน 7-10 วัน","✓ ถูก — CDC guidelines: Acyclovir 400 mg TID × 7-10 วัน หรือ 200 mg 5×/วัน × 7-10 วัน สำหรับ HSV genitalis first episode"),
     c("C","800 mg BID","✗ ผิด — 800 mg BID ใช้สำหรับ chronic suppressive therapy ไม่ใช่ first episode acute"),
     c("D","800 mg 5×/วัน","✗ ผิด — 800 mg 5×/วัน ใช้สำหรับ VZV (Varicella/Zoster) ไม่ใช่ HSV genitalis"),
     c("E","1,200 mg วันละ 1 ครั้ง","✗ ผิด — ไม่ใช่ standard dosing ของ Acyclovir")],
    "Acyclovir dosing: HSV genital acute 400mg TID; VZV 800mg 5×/d; Suppression 400mg BD; IV severe: 5-10 mg/kg q8h"
  )},
  { n:91, det: d(
    "Membrane ควบคุมการปล่อยยาใน Acyclovir SR matrix tablet",
    "OROS osmotic pump = semipermeable membrane; water เข้า → osmotic pressure → ดันยาออก",
    [c("A","Semipermeable membrane","✓ ถูก — OROS (Osmotic Release Oral System): Semipermeable membrane ให้น้ำผ่านเข้า แต่ไม่ให้ยาผ่าน → osmotic pressure ดันยาออก orifice ใน zero-order rate"),
     c("B","Prolonged release system","✗ ผิด — นี่เป็นคำอธิบาย release pattern ไม่ใช่ membrane ชนิด"),
     c("C","Controlled release matrix","✗ ผิด — Matrix system ไม่มี semipermeable membrane; ยาแพร่จาก matrix โดยตรง"),
     c("D","Delayed release","✗ ผิด — Delayed release = enteric coat ชะลอการปล่อยยาจนเข้า intestine"),
     c("E","Immediate release","✗ ผิด — SR = sustained release ตรงข้ามกับ immediate release")],
    "OROS: semipermeable membrane (cellulose acetate) + laser-drilled orifice → zero-order release; ตัวอย่าง: Glucotrol XL, Procardia XL"
  )},
  { n:92, det: d(
    "Carr's Compressibility Index และ Flowability",
    "CI = (Tapped - Bulk)/Tapped × 100 = (1.02-0.28)/1.02 × 100 = 72.5% = Very poor",
    [c("A","5% (Excellent)","✗ ผิด — CI 5-15% = Excellent flowability; ข้อนี้ CI 72.5% ซึ่ง very poor"),
     c("B","72.5% (Very poor → ต้องทำ granulation)","✓ ถูก — CI = (1.02-0.28)/1.02 × 100 = 72.5%; CI >40% = Very poor/Extremely poor flowability → ต้องทำ granulation ก่อน tablet compression"),
     c("C","20% (Fair)","✗ ผิด — CI 18-25% = Passable/Fair; ข้อนี้ CI = 72.5%"),
     c("D","25.5% (Poor)","✗ ผิด — CI 25-35% = Poor; ข้อนี้ CI = 72.5%"),
     c("E","35% (Very poor)","✗ ผิด — CI 35-45% = Very poor ใกล้เคียงกว่าแต่ยังไม่ถูก; ข้อนี้ CI = 72.5%")],
    "Carr's Index: <15=Excellent, 15-25=Good, 25-35=Passable, 35-45=Poor, >45=Very poor; Hausner Ratio = Tapped/Bulk (<1.25=Good)"
  )},
  { n:93, det: d(
    "คำนวณอัตราส่วน Span 20 : Tween 60 สำหรับ HLB 13",
    "Span 3g + Tween 7g = HLB = (3×8.6 + 7×14.9)/10 = 13.01 ≈ 13",
    [c("A","Span 5g + Tween 5g","✗ ผิด — HLB = (5×8.6 + 5×14.9)/10 = (43+74.5)/10 = 11.75 ≠ 13"),
     c("B","Span 2g + Tween 8g","✗ ผิด — HLB = (2×8.6 + 8×14.9)/10 = (17.2+119.2)/10 = 13.64 ≠ 13"),
     c("C","Span 6g + Tween 4g","✗ ผิด — HLB = (6×8.6 + 4×14.9)/10 = (51.6+59.6)/10 = 11.12 ≠ 13"),
     c("D","Span 3g + Tween 7g","✗ ผิด — HLB = (3×8.6 + 7×14.9)/10 = (25.8+104.3)/10 = 13.01 ✓ ซ้ำกับ E"),
     c("E","Span 3g + Tween 7g (HLB ≈ 13.0)","✓ ถูก — HLB = (3×8.6 + 7×14.9)/10 = 13.01 ≈ 13.0; ตรงกับ required HLB สำหรับ o/w cream")],
    "HLB blending: HLB_mix = Σ(weight fraction × HLB); o/w emulsion ต้องการ HLB 8-16; w/o ต้องการ HLB 3-6"
  )},
  { n:94, det: d(
    "หน้าที่ของ White Petrolatum ใน Cream",
    "White petrolatum = occlusive emollient/moisture barrier",
    [c("A","Emulsifier","✗ ผิด — Emulsifier คือ Span 20, Tween 60 (surfactants); White petrolatum ไม่มี HLB ชัดเจน"),
     c("B","Emollient (occlusive)","✓ ถูก — White petrolatum (Vaseline) = occlusive emollient ปิดผิวหนัง ลดการสูญเสียน้ำ (TEWL) ให้ความชุ่มชื้น"),
     c("C","Preservative","✗ ผิด — Preservative เช่น methylparaben, propylparaben, BAK ไม่ใช่ petrolatum"),
     c("D","Humectant","✗ ผิด — Humectant เช่น Glycerin, PG, Sorbitol ดึงน้ำจาก atmosphere หรือ dermis มาผิวหนัง"),
     c("E","Surfactant","✗ ผิด — Surfactant เป็น amphiphilic ลด surface tension; petrolatum ไม่มีคุณสมบัตินี้")],
    "Emollient types: Occlusive (petrolatum, mineral oil) = barrier; Humectant (glycerin, PG) = attract water; Emollient (lanolin) = lubricate"
  )},
  { n:95, det: d(
    "สาร Emollient ใน Terbinafine cream",
    "White petrolatum = emollient ในสูตรตำรับ; Span/Tween = emulsifiers",
    [c("A","Span 20","✗ ผิด — Span 20 (HLB 8.6) = lipophilic emulsifier (w/o tendency)"),
     c("B","Tween 60","✗ ผิด — Tween 60 (HLB 14.9) = hydrophilic emulsifier (o/w tendency)"),
     c("C","Propylene glycol","✗ ผิด — PG = humectant/co-solvent ช่วยละลายยา และดึงน้ำ"),
     c("D","White petrolatum","✓ ถูก — White petrolatum = emollient/occlusive agent ให้ความชุ่มชื้น ปิดผิวหนัง"),
     c("E","Sodium lauryl sulfate","✗ ผิด — SLS = anionic surfactant ไม่มีในสูตรตำรับ Terbinafine cream ทั่วไป")],
    "Cream composition: Drug + Emulsifiers (Span+Tween) + Oil phase (petrolatum) + Water phase + Humectant (PG) + Preservative"
  )},
  { n:96, det: d(
    "เหตุผลที่ Alendronate effervescent ต้องใช้ Dry Granulation",
    "Effervescent + Alendronate ทั้งคู่ไวต่อความชื้น → dry granulation หลีกเลี่ยงน้ำ",
    [c("A","เพื่อเพิ่ม binding","✗ ผิด — Dry granulation ใช้แรงอัด (mechanical compaction) ไม่ใช่ binder solution"),
     c("B","เพราะ water sensitive เหมือนกัน","✗ ผิด — ตอบไม่ครบ ไม่ได้อธิบายกลไกที่ชัดเจน"),
     c("C","เพราะง่ายที่สุด","✗ ผิด — Dry granulation ไม่ใช่กระบวนการที่ง่ายที่สุด; เหตุผลคือ chemistry ไม่ใช่ความสะดวก"),
     c("D","Alendronate + effervescent ไวต่อความชื้น → ต้องหลีกเลี่ยงน้ำ","✓ ถูก — Citric acid + NaHCO₃ ทำปฏิกิริยากับน้ำทันที → CO₂ → effervescent system เสีย; Alendronate ยังดูดความชื้น → hydrolysis; dry granulation เป็นทางเดียวที่เหมาะ"),
     c("E","เพื่อลด particle size","✗ ผิด — Dry granulation เพิ่ม particle size (agglomeration) ไม่ใช่ลด")],
    "Effervescent granulation ต้องทำใน controlled humidity (<25% RH); dry granulation (roller compaction/slugging)"
  )},
  { n:97, det: d(
    "หน้าที่ของ PVP ใน Tablet Formulation",
    "PVP (Povidone) = binder ใน wet granulation ยึดอนุภาค powder เข้าหากัน",
    [c("A","Disintegrant","✗ ผิด — Disintegrant เช่น Sodium starch glycolate, Croscarmellose sodium ทำให้ tablet แตกตัว"),
     c("B","Binder","✓ ถูก — PVP (Povidone K30/K29-32) = binder ใน wet granulation; ละลายใน water/alcohol เป็น granulating solution ยึด primary particles"),
     c("C","Lubricant","✗ ผิด — Lubricant เช่น Mg stearate, stearic acid ลดแรงเสียดทาน"),
     c("D","Glidant","✗ ผิด — Glidant เช่น Colloidal SiO₂, Talc ช่วย flowability"),
     c("E","Diluent","✗ ผิด — Diluent เช่น MCC, Lactose เพิ่ม bulk ไม่ใช่ PVP")],
    "Tablet excipients: Diluent (MCC/Lactose), Binder (PVP/HPC), Disintegrant (SSG), Lubricant (MgSt), Glidant (SiO₂)"
  )},
  { n:98, det: d(
    "สารที่ลด Sedimentation Rate โดยเพิ่ม Viscosity",
    "Methyl cellulose/HPMC เพิ่ม viscosity ของ medium → ลด v ตาม Stokes' Law",
    [c("A","Simethicone","✗ ผิด — Simethicone = antifoaming agent ลดฟอง ไม่ใช่ viscosity enhancer"),
     c("B","Glycerin","✗ ผิด — Glycerin ใช้เป็น humectant/sweetener; viscosity ต่ำเกินไปที่จะลด sedimentation อย่างมีนัยสำคัญ"),
     c("C","Colloidal silicon dioxide","✗ ผิด — Colloidal SiO₂ ใช้เป็น glidant ใน solid dosage form"),
     c("D","Sorbitol","✗ ผิด — Sorbitol เป็น sweetener/humectant"),
     c("E","Methyl cellulose","✓ ถูก — Methyl cellulose/HPMC/Carbomer/Xanthan gum = viscosity enhancers ใน suspension; เพิ่ม η (viscosity) → ลด v ตาม Stokes' Law v = 2r²Δρg/9η")],
    "Stokes: v ∝ r² และ Δρ; v ∝ 1/η; ลด sedimentation โดย: ลด particle size, ลด Δρ, เพิ่ม viscosity"
  )},
  { n:99, det: d(
    "หน้าที่หลักของ Glycerin ใน Suspension",
    "Glycerin = humectant ป้องกันการแห้ง และช่วยรักษาความชุ่มชื้น",
    [c("A","Humectant","✓ ถูก — Glycerin = hygroscopic humectant ดึงน้ำจาก atmosphere ป้องกัน suspension แห้งและ caking; ยังเป็น sweetener/cosolvent"),
     c("B","Flocculating agent","✗ ผิด — Flocculating agent เช่น electrolyte (NaCl) ทำให้อนุภาค flocculat"),
     c("C","Preservative","✗ ผิด — Glycerin มีคุณสมบัติ antimicrobial ที่ความเข้มข้นสูง แต่ไม่ใช้เป็น primary preservative"),
     c("D","Wetting agent","✗ ผิด — Wetting agent เช่น Polysorbate 80, SLS ลด contact angle ช่วย dispersibility"),
     c("E","Sweetener","✗ ผิด — Glycerin เป็น sweetener ได้ แต่ไม่ใช่หน้าที่หลักใน pharmaceutical suspension")],
    "Glycerin roles: humectant (ป้องกันแห้ง), solvent, cosolvent, sweetener, plasticizer; ความเข้มข้น 15-20% = antimicrobial"
  )},
  { n:100, det: d(
    "ปัจจัยที่เพิ่ม Sedimentation Rate ตาม Stokes' Law",
    "Stokes: v = 2r²(ρₚ-ρₘ)g/9η; เพิ่ม Δρ = เพิ่ม sedimentation rate",
    [c("A","เพิ่ม viscosity ของ medium","✗ ผิด — เพิ่ม η → ลด v (ตัวหาร); ตรงข้าม"),
     c("B","ลด particle size","✗ ผิด — ลด r → ลด v อย่างมาก (r² term); ลดขนาดอนุภาค = วิธีหลักลด sedimentation"),
     c("C","เพิ่มผลต่างความหนาแน่น (ρ_p − ρ_m)","✓ ถูก — v ∝ (ρₚ-ρₘ); เพิ่ม Δρ (เช่น ใช้ particle หนักกว่า medium มาก) → เพิ่ม sedimentation rate"),
     c("D","เพิ่ม temperature","✗ ผิด — เพิ่ม temperature → ลด viscosity → เพิ่ม v แต่ไม่ใช่ primary factor ที่ถามในบริบทนี้ และ ρ ก็เปลี่ยนด้วย"),
     c("E","ลด particle density","✗ ผิด — ลด ρₚ → ลด Δρ → ลด v ถ้า ρₚ > ρₘ")],
    "Stokes: v = 2r²(ρₚ−ρₘ)g/9η; ลด sedimentation: ↓r (micronize), ↑η (thickener), ↓Δρ, flocculation"
  )},
  { n:101, det: d(
    "การให้ KCl ที่ไม่ปลอดภัย",
    "IV KCl bolus โดยตรง = cardiac arrest; ต้องเจือจางและให้ช้าๆ เสมอ",
    [c("A","เพิ่ม Furosemide","✗ ผิด — Furosemide ขับ K⁺ ออก → hypokalemia; ไม่ใช่วิธีให้ KCl"),
     c("B","เพิ่ม Spironolactone","✗ ผิด — Spironolactone เก็บ K⁺ = K-sparing; ไม่ใช่วิธีให้ KCl"),
     c("C","ผสม KCl ใน NSS drip ช้าๆ","✗ ผิด — นี่คือวิธีที่ปลอดภัยและถูกต้อง"),
     c("D","KCl IV bolus โดยตรง ไม่เจือจาง","✓ ถูก — KCl IV bolus = ห้ามเด็ดขาด → High K⁺ ทันที → Ventricular fibrillation → Cardiac arrest; KCl สารพิษถ้าให้เร็ว"),
     c("E","KCl tablet รับประทาน","✗ ผิด — Oral KCl ปลอดภัย ดูดซึมช้า ไม่ทำ hyperkalemia ฉับพลัน")],
    "KCl IV safety: ห้าม bolus; เจือจาง ≤40 mEq/L peripheral or ≤80 mEq/L central; อัตรา ≤10-20 mEq/hr + cardiac monitor"
  )},
  { n:102, det: d(
    "วิธีให้ Potassium replacement ใน Severe Hypokalemia ที่ถูกต้อง",
    "KCl ใน NSS (ไม่ใช่ D5W), ≤20 mEq/hr, พร้อม cardiac monitoring",
    [c("A","Dipotassium phosphate IV bolus","✗ ผิด — IV bolus ห้ามเด็ดขาด; DiKPO₄ ยังเพิ่ม phosphate เสี่ยง hypocalcemia"),
     c("B","KCl ผสม D5W ให้ใน 30 นาที","✗ ผิด — ผสม D5W ไม่ดี: insulin-mediated glucose uptake จะดัน K⁺ เข้าเซลล์ → เพิ่ม hypokalemia; 30 นาทีเร็วเกินไป"),
     c("C","KCl ผสม NSS 0.9% ให้ ≤ 20 mEq/hr พร้อม cardiac monitoring","✓ ถูก — NSS ไม่มี glucose → ไม่ดัน K⁺ เข้าเซลล์; อัตรา ≤20 mEq/hr ปลอดภัย; cardiac monitor ป้องกัน arrhythmia"),
     c("D","KCl 40 mEq IV bolus","✗ ผิด — Bolus → cardiac arrest"),
     c("E","KCl elixir รับประทาน","✗ ผิด — Oral ใช้ได้ใน mild-moderate hypokalemia ไม่เหมาะ severe ที่ต้องแก้เร็ว")],
    "KCl replacement: severe → IV KCl in NSS ≤20 mEq/hr + cardiac monitor; mild → Oral KCl; ต้อง correct hypomagnesemia ด้วย"
  )},
  { n:103, det: d(
    "อัตรา IV KCl ที่ปลอดภัยสูงสุดในผู้ใหญ่",
    "Peripheral IV: max 10-20 mEq/hr; Central line emergency: max 40 mEq/hr",
    [c("A","5 mEq/hr","✗ ผิด — 5 mEq/hr ปลอดภัยแต่ช้าเกินไปในกรณีที่ต้องแก้ไขเร็ว"),
     c("B","10-20 mEq/hr","✓ ถูก — Standard maximum rate = 10-20 mEq/hr ทาง peripheral IV; ในกรณีฉุกเฉิน max 40 mEq/hr ต้องทาง central line พร้อม cardiac monitoring"),
     c("C","40 mEq/hr เสมอ","✗ ผิด — 40 mEq/hr เฉพาะ central line + cardiac monitoring ในกรณีฉุกเฉินเท่านั้น ไม่ใช่ 'เสมอ'"),
     c("D","80 mEq/hr","✗ ผิด — เร็วเกินไปและเสี่ยง cardiac arrest"),
     c("E","ไม่มีขีดจำกัด","✗ ผิด — มีขีดจำกัดชัดเจน ขึ้นกับ route, concentration, clinical status")],
    "KCl IV rate: Peripheral ≤10-20 mEq/hr, Central emergency ≤40 mEq/hr; concentration: peripheral ≤40 mEq/L, central ≤80 mEq/L"
  )},
  { n:104, det: d(
    "ADR ของ Dipotassium Phosphate IV มากเกินขนาด",
    "DiKPO₄ เพิ่ม K⁺ + PO₄³⁻ → Hyperkalemia + Hyperphosphatemia → hypocalcemia ตามมา",
    [c("A","Hypokalemia","✗ ผิด — DiKPO₄ ให้ K⁺ เพิ่ม → hyperkalemia ไม่ใช่ hypokalemia"),
     c("B","Hypernatremia","✗ ผิด — DiKPO₄ ไม่มี Na⁺"),
     c("C","Hyperkalemia และ Hyperphosphatemia","✓ ถูก — DiKPO₄ (K₂HPO₄): K⁺ → hyperkalemia; PO₄³⁻ → hyperphosphatemia → chelate Ca²⁺ → hypocalcemia → tetany, seizures"),
     c("D","Hypocalcemia เท่านั้น","✗ ผิด — Hypocalcemia เป็น consequence ของ hyperphosphatemia แต่ hyperkalemia + hyperphosphatemia เป็น direct effect ด้วย"),
     c("E","Metabolic alkalosis","✗ ผิด — Phosphate เป็น buffer ไม่ก่อ metabolic alkalosis")],
    "DiKPO₄ overdose: K⁺ excess → hyperkalemia → arrhythmia; PO₄³⁻ excess → hypocalcemia → tetany; monitor ECG"
  )},
  { n:105, det: d(
    "ความเสี่ยงจากการใช้ Losartan ร่วมกับ ACE inhibitor",
    "Double RAAS blockade → Hyperkalemia + Hypotension + AKI",
    [c("A","Hyperkalemia","✓ ถูก — Double RAAS blockade (ARB+ACEi): ทั้งคู่ลด aldosterone → เก็บ K⁺ → hyperkalemia สูงมาก; ONTARGET trial แสดงว่า dual blockade เพิ่ม adverse outcomes"),
     c("B","Hypokalemia","✗ ผิด — RAAS blockade เก็บ K⁺ ทำให้ hyperkalemia ไม่ใช่ hypokalemia"),
     c("C","Hypernatremia","✗ ผิด — RAAS blockade ลด aldosterone → Na⁺ ขับออกมากขึ้น → hyponatremia possible ไม่ใช่ hypernatremia"),
     c("D","Hyponatremia","✗ ผิด — เป็นไปได้เล็กน้อย แต่ไม่ใช่ความเสี่ยงหลักที่ต้องระวัง"),
     c("E","Hypocalcemia","✗ ผิด — RAAS blockade ไม่มีผลโดยตรงต่อ Ca²⁺")],
    "ONTARGET: ACEi+ARB dual blockade → ↑ hyperkalemia, ↑ AKI, ↑ hypotension; ไม่แนะนำ combination นี้"
  )},
  { n:106, det: d(
    "ปฏิสัมพันธ์ระหว่าง Vitamin E กับ Simvastatin",
    "Antioxidant (Vit E) อาจลด statin efficacy ผ่าน oxidative pathway (theoretical)",
    [c("A","ลด statin absorption","✗ ผิด — Vit E ไม่ลด oral absorption ของ statin"),
     c("B","เพิ่ม statin efficacy","✗ ผิด — ไม่มีหลักฐานว่า Vit E เพิ่ม statin efficacy"),
     c("C","Antioxidant อาจลด statin efficacy บางส่วน","✓ ถูก — Theoretical DDI: antioxidants (Vit E, C, A) อาจ attenuate statin benefits โดยเฉพาะ HDL-raising effect และ vasoprotective mechanism ที่เกี่ยวกับ oxidative stress; หลักฐานยังไม่ชัดเจนใน clinical practice"),
     c("D","ไม่มีปฏิสัมพันธ์","✗ ผิด — มี theoretical DDI ที่รายงานในการศึกษาบางชิ้น"),
     c("E","เพิ่ม hepatotoxicity","✗ ผิด — ไม่มีหลักฐานว่า Vit E เพิ่ม statin hepatotoxicity")],
    "Vit E + statin: ไม่แนะนำ high-dose antioxidant supplement ร่วมกับ statin (HPS trial); ใน formulation Vit E เป็น antioxidant excipient ไม่ใช่ active supplement"
  )},
  { n:107, det: d(
    "หน้าที่ของ Vitamin E ในสูตรตำรับ Capsule",
    "Vitamin E ในสูตรตำรับ = antioxidant excipient ป้องกัน statin oxidize",
    [c("A","Active ingredient","✗ ผิด — Vitamin E ในสูตรตำรับนี้เป็น excipient ไม่ใช่ active drug"),
     c("B","Antioxidant (กันยาเสื่อมจาก oxidation)","✓ ถูก — dl-alpha-tocopherol acetate (Vitamin E) ทำหน้าที่ antioxidant ใน capsule formulation ป้องกัน statin (ซึ่งมี double bonds) จาก oxidative degradation → ยืด shelf life"),
     c("C","Lubricant","✗ ผิด — Lubricant เช่น Mg stearate, hydrogenated vegetable oil ไม่ใช่ Vit E"),
     c("D","Binder","✗ ผิด — Binder เช่น PVP, HPC ไม่ใช่ Vit E"),
     c("E","Disintegrant","✗ ผิด — Disintegrant เช่น SSG, CCS ไม่ใช่ Vit E")],
    "Common antioxidants ใน formulation: BHA, BHT, Vitamin E (tocopherol), Na metabisulfite, Na ascorbate; ใช้ป้องกัน oxidative degradation"
  )},
  { n:108, det: d(
    "ความเข้มข้นของ Epinephrine 1 mg ใน 10 mL",
    "1 mg ใน 10 mL = 0.1 mg/mL = 1:10,000",
    [c("A","0.01 mg/mL","✗ ผิด — 0.01 mg/mL = 1 mg ใน 100 mL; ผิด"),
     c("B","0.1 mg/mL (1:10,000)","✓ ถูก — 1 mg ÷ 10 mL = 0.1 mg/mL; เป็น 1:10,000 concentration ใช้สำหรับ cardiac arrest (IV/IO 1 mg = 10 mL), bradycardia"),
     c("C","0.09 mg/mL","✗ ผิด — ไม่ใช่ตัวเลขมาตรฐาน"),
     c("D","1 mg/mL","✗ ผิด — 1 mg/mL = 1:1,000 ซึ่งเป็น Epinephrine สำหรับ anaphylaxis IM (0.3-0.5 mL = 0.3-0.5 mg)"),
     c("E","0.001 mg/mL","✗ ผิด — 0.001 mg/mL = 1 mg ใน 1,000 mL; ผิด")],
    "Epinephrine concentrations: 1:1000 = 1mg/mL (anaphylaxis IM); 1:10,000 = 0.1mg/mL (cardiac arrest IV); 1:100,000 (local anesthesia)"
  )},
  { n:109, det: d(
    "คุณสมบัติของ Epinephrine HCl Solution",
    "Epinephrine ไวต่อ oxidation และแสง → เก็บในขวดสีชา pH 2-5",
    [c("A","เสถียรใน alkaline pH","✗ ผิด — Epinephrine เสถียรใน acidic pH 2-5; alkaline pH → oxidize เร็วขึ้น → adrenochrome"),
     c("B","เก็บอุณหภูมิห้องได้นาน","✗ ผิด — ต้องเก็บในที่เย็น เพราะ oxidize ได้ง่าย; ภายหลังเปิดใช้ควรใช้ทันที"),
     c("C","ต้องป้องกันแสง เพราะ oxidize เป็น adrenochrome (สีน้ำตาล)","✓ ถูก — Epinephrine catecholamine ไวต่อ light และ oxidation → adrenochrome (brown) + norepinephrine → ยาหมดฤทธิ์; เก็บในขวดสีชา, pH 2-5, N₂ headspace"),
     c("D","pH 7-9","✗ ผิด — pH 7-9 = alkaline → Epi oxidize เร็ว → ต้อง pH 2-5 acidic"),
     c("E","ผสมกับ NaHCO₃ ได้","✗ ผิด — NaHCO₃ เพิ่ม pH → alkaline → Epi oxidize ทันที; ห้ามผสม")],
    "Catecholamine stability: oxidize by air, light, metal ions, alkaline pH; ป้องกัน: acidic pH + amber vial + N₂ + EDTA chelate metal"
  )},
  { n:110, det: d(
    "การจัดประเภท NaCl 2.5% Solution",
    "NaCl isotonic = 0.9%; NaCl 2.5% > 0.9% → Hypertonic",
    [c("A","Hypertonic","✓ ถูก — NaCl 2.5% osmolarity >> plasma (~308 mOsm/L → ~856 mOsm/L); > 0.9% isotonic = hypertonic; ใช้ severe hyponatremia, cerebral edema"),
     c("B","Isotonic","✗ ผิด — Isotonic NaCl = 0.9%; plasma osmolarity ~280-320 mOsm/L"),
     c("C","Hypotonic","✗ ผิด — Hypotonic < 0.9% NaCl (เช่น 0.45% half normal saline)"),
     c("D","Isoosmotic","✗ ผิด — Isoosmotic ≈ isotonic = 0.9% NaCl ≈ 308 mOsm/L"),
     c("E","Non-electrolyte solution","✗ ผิด — NaCl = electrolyte; non-electrolyte เช่น glucose, mannitol")],
    "Tonicity: <0.9% NaCl=hypotonic, 0.9%=isotonic, >0.9%=hypertonic; ใช้ hypertonic saline ใน severe hyponatremia (Na<120 mEq/L) + symptoms"
  )},
  { n:111, det: d(
    "ประโยชน์ของ Sodium Chloride Equivalent (E-value)",
    "E-value ใช้คำนวณ tonicity adjustment สำหรับ ophthalmic/parenteral solution",
    [c("A","Tonicity adjustment ของ ophthalmic/parenteral solution","✓ ถูก — E-value (NaCl equivalent) = จำนวน g NaCl ที่มี osmolarity เท่ากับ drug 1 g; ใช้คำนวณปริมาณ NaCl ที่ต้องเพิ่มหรือลดเพื่อให้ solution isotonic"),
     c("B","Drug dosage calculation","✗ ผิด — Drug dosage คำนวณจาก mg/kg หรือ BSA-based ไม่ใช้ E-value"),
     c("C","pH adjustment","✗ ผิด — pH adjustment ใช้ acid/base titration และ Henderson-Hasselbalch equation"),
     c("D","Solubility prediction","✗ ผิด — Solubility ใช้ HSP (Hansen Solubility Parameter) หรือ Rule of 5"),
     c("E","Stability testing","✗ ผิด — Stability testing ใช้ ICH Q1A guidelines; E-value ไม่เกี่ยว")],
    "E-value formula: ปริมาณ NaCl = 0.9 - Σ(drug%×E-value) g/100 mL; ถ้าได้ negative = หายิ่งกว่า isotonic"
  )},
  { n:112, det: d(
    "คำนวณอัตราหยด IV Infusion",
    "Rate = Volume × Drop factor ÷ Time(min) = 500×20÷240 = 41.7 ≈ 42 drops/min",
    [c("A","8 drops/min","✗ ผิด — 8 drops/min = 500×20÷1250; ผิด"),
     c("B","10 drops/min","✗ ผิด — 10 drops/min = 500×12÷600; ผิด"),
     c("C","42 drops/min","✓ ถูก — Rate = (500 mL × 20 drops/mL) ÷ (4×60 min) = 10,000 ÷ 240 = 41.67 ≈ 42 drops/min"),
     c("D","125 drops/min","✗ ผิด — 125 drops/min เร็วเกินไป; ≈ 500 mL ใน 1 ชั่วโมง"),
     c("E","20 drops/min","✗ ผิด — 20 drops/min = 500×20÷500; หมายถึง 500 mL ใน 500 นาที ≈ 8 ชั่วโมง")],
    "IV rate formula: drops/min = Volume(mL) × Drop factor(drops/mL) ÷ Time(min); mL/hr = Volume ÷ Hours"
  )},
  { n:113, det: d(
    "คำนวณอัตรา Pump สำหรับ Adrenaline Infusion",
    "Dose=7 mcg/min=420 mcg/hr; Conc=1000/50=20 mcg/mL; Rate=420/20=21 mL/hr",
    [c("A","8 mL/hr","✗ ผิด — 8 mL/hr = 8×20 = 160 mcg/hr = 2.3 mcg/kg/min; ผิด"),
     c("B","21 mL/hr","✓ ถูก — Dose=0.1×70=7 mcg/min×60=420 mcg/hr; Conc=1,000 mcg/50 mL=20 mcg/mL; Rate=420÷20=21 mL/hr"),
     c("C","0.42 mL/hr","✗ ผิด — หน่วยผิด; คำนวณผิด"),
     c("D","4.2 mL/hr","✗ ผิด — 4.2 mL/hr×20 mcg/mL = 84 mcg/hr = 1.4 mcg/kg/min × 70 kg ≠ 0.1"),
     c("E","42 mL/hr","✗ ผิด — 42 mL/hr×20 = 840 mcg/hr = 14 mcg/min = 0.2 mcg/kg/min ≠ 0.1")],
    "Infusion rate: Rate(mL/hr) = Dose(mcg/kg/min) × Weight(kg) × 60 ÷ Concentration(mcg/mL)"
  )},
  { n:114, det: d(
    "Dissolution Test S1/S2 Staging — Interpretation",
    "ค่าเฉลี่ย S1 < Q = ไม่ผ่าน S1 → ต้องทดสอบ S2 ต่อ",
    [c("A","ผ่าน S1","✗ ผิด — S1 ผ่านได้เมื่อ ทุก unit ≥ Q−15% และ mean ≥ Q; ข้อนี้ mean = 78.5% < Q 80% = ไม่ผ่าน"),
     c("B","ผ่าน S2","✗ ผิด — ยังไม่ได้ทำ S2 ยังไม่สามารถบอกว่าผ่าน S2"),
     c("C","ไม่ผ่าน S1 → ต้องทดสอบ S2","✓ ถูก — S1 criteria: 1) ไม่มี unit < Q-15% = 80-15=65% (ทุก unit ≥65%) 2) mean ≥ Q = mean 78.5% < 80% → ไม่ผ่าน S1 → ต้องทำ S2 (n=6 เพิ่ม รวม 12 units)"),
     c("D","Fail ทุกขั้นตอน","✗ ผิด — ยังสรุปไม่ได้ว่า fail โดยรวม ต้องทำ S2 ก่อน"),
     c("E","ผ่านระดับ 2","✗ ผิด — ยังไม่ได้ทำ S2")],
    "USP Dissolution: S1(n=6): mean≥Q, ไม่มี<Q-15%; S2(n=12): mean≥Q, ≤2 units<Q-15%; S3(n=24): mean≥Q, ไม่มี<Q-25%"
  )},
  { n:115, det: d(
    "การแปลผล RR = 1.3, 95% CI (0.85-1.17)",
    "95% CI ครอบ 1.0 → ไม่มีความแตกต่างอย่างมีนัยสำคัญ",
    [c("A","Amoxicillin/Clavulanate ดีกว่า Cefixime","✗ ผิด — ถ้า significant RR > 1 และ CI ไม่ครอบ 1.0; ข้อนี้ CI ครอบ 1.0"),
     c("B","ไม่มีความแตกต่างอย่างมีนัยสำคัญ (95% CI ครอบ 1.0)","✓ ถูก — 95% CI (0.85-1.17) ครอบค่า 1.0 → p > 0.05 → ไม่มีความแตกต่างอย่างมีนัยสำคัญ; แม้ RR = 1.3 แต่ confidence interval กว้างและครอบ null"),
     c("C","Cefixime ดีกว่า","✗ ผิด — ถ้า Cefixime ดีกว่า RR < 1 และ CI < 1.0 ทั้งหมด"),
     c("D","ยังสรุปไม่ได้","✗ ผิด — สรุปได้ชัดเจน: ไม่มีนัยสำคัญ เพราะ CI ครอบ 1.0"),
     c("E","Amoxicillin/Clavulanate แย่กว่า","✗ ผิด — ถ้า Amoxiclav แย่กว่า RR < 1 และ CI < 1.0 ทั้งหมด")],
    "สรุป CI ของ RR: ถ้า CI ครอบ 1.0 = not significant; ไม่ครอบ 1.0 = significant; ขนาด CI บอก precision ของการศึกษา"
  )},
  { n:116, det: d(
    "Statistical test สำหรับ categorical outcome ระหว่าง 2 กลุ่ม",
    "Adherence ดี/ไม่ดี × กลุ่ม = 2×2 table → Chi-square test",
    [c("A","Chi-square test","✓ ถูก — ข้อมูล categorical (adherence: ดี/ไม่ดี) × 2 กลุ่ม = contingency table → Chi-square test; ถ้า expected frequency < 5 ใช้ Fisher's exact test แทน"),
     c("B","Logistic regression","✗ ผิด — Logistic regression ใช้เพื่อ predict outcome จาก multiple predictors ไม่ใช่แค่เปรียบเทียบ 2 กลุ่ม"),
     c("C","Pearson correlation","✗ ผิด — Pearson correlation ใช้กับ 2 continuous variables ไม่ใช่ categorical"),
     c("D","ANOVA","✗ ผิด — ANOVA เปรียบเทียบ mean ของ continuous variable ≥ 3 กลุ่ม"),
     c("E","Paired t-test","✗ ผิด — Paired t-test ใช้กับ continuous variable ที่วัด 2 ครั้งใน subject เดียวกัน")],
    "Statistical test selection: Categorical→Chi-square/Fisher; Continuous 2 groups→t-test; ≥3 groups→ANOVA; Correlation→Pearson/Spearman"
  )},
  { n:117, det: d(
    "Statistical test สำหรับ predict Binary Outcome จาก Multiple Predictors",
    "Binary outcome + multiple predictors → Logistic Regression",
    [c("A","Chi-square test","✗ ผิด — Chi-square ใช้เปรียบเทียบ 2 กลุ่ม ไม่ใช่ predictive model ที่มี multiple variables"),
     c("B","Logistic regression","✓ ถูก — Binary outcome (adherence ดี/ไม่ดี) + multiple predictors (age, sex, dose, etc.) → Multiple logistic regression; ให้ Odds Ratio (OR) ของแต่ละ predictor"),
     c("C","Pearson correlation","✗ ผิด — Pearson ใช้กับ continuous variables ไม่ใช่ binary outcome"),
     c("D","ANOVA","✗ ผิด — ANOVA วิเคราะห์ continuous outcome ไม่ใช่ binary"),
     c("E","Paired t-test","✗ ผิด — ไม่เกี่ยวกับ predictors")],
    "Logistic regression: binary outcome → OR; Linear regression: continuous outcome → β coefficient; Cox regression: time-to-event → Hazard Ratio"
  )},
  { n:118, det: d(
    "ABC Inventory Analysis",
    "Class A = 20% ของรายการยา แต่มีมูลค่า ~80% ของทั้งหมด",
    [c("A","Class A","✓ ถูก — ABC analysis (Pareto principle): Class A = ~20% รายการ → ~80% มูลค่าทั้งหมด; ควบคุมเข้มงวดที่สุด; จัดเก็บน้อยชิ้น monitor stock บ่อย"),
     c("B","Class B","✗ ผิด — Class B = ~30% รายการ → ~15% มูลค่า; ระดับกลาง"),
     c("C","Class C","✗ ผิด — Class C = ~50% รายการ → ~5% มูลค่า; ควบคุมน้อยสุด สั่งซื้อครั้งละมาก"),
     c("D","Class D","✗ ผิด — ไม่มี Class D ใน standard ABC analysis"),
     c("E","Class E","✗ ผิด — ไม่มี Class E ใน standard ABC analysis")],
    "ABC: A=vital, B=essential, C=desirable; Inventory method: A=periodic review (frequent), C=fixed order quantity"
  )},
  { n:119, det: d(
    "กลไกการออกฤทธิ์ของ Mycophenolate Mofetil (MMF)",
    "MMF → Mycophenolic acid → ยับยั้ง IMPDH → ลด de novo guanosine → antiproliferative",
    [c("A","ยับยั้ง purine base guanine ใช้ adenine","✗ ผิด — คำอธิบายไม่ถูกต้อง; IMPDH ยับยั้ง → ลด guanosine (purine) synthesis ทั้งหมด"),
     c("B","ยับยั้ง tyrosine kinase","✗ ผิด — TKI เช่น Imatinib, Erlotinib; ไม่ใช่ MMF"),
     c("C","ยับยั้ง pyrimidine analogue","✗ ผิด — Pyrimidine synthesis inhibitor เช่น Leflunomide (DHODH inhibitor)"),
     c("D","ยับยั้ง IMPDH → ลด de novo guanosine synthesis","✓ ถูก — MMF hydrolyzed to MPA → inhibit IMPDH (inosine monophosphate dehydrogenase) → block de novo guanosine synthesis → lymphocytes depend on de novo pathway → selective antiproliferative on T and B cells"),
     c("E","ยับยั้ง calcineurin","✗ ผิด — Calcineurin inhibitors = Cyclosporine, Tacrolimus; ยับยั้ง IL-2 production")],
    "MMF/MPA → IMPDH inhibition → ↓GMP → ↓lymphocyte proliferation; non-lymphocyte cells ใช้ salvage pathway จึงไม่ affected มาก"
  )},
  { n:120, det: d(
    "ผลของ Magnesium Stearate มากเกินไปใน Direct Compression",
    "Mg stearate hydrophobic → over-mixing → hydrophobic coating บน particle → ลด dissolution",
    [c("A","เพิ่ม hardness","✗ ผิด — Mg stearate ลด hardness เพราะขัดขวาง particle-particle binding ใน compression"),
     c("B","ไม่มีผล","✗ ผิด — Mg stearate มากเกินไปหรือ mix นานเกินไปมีผลมาก"),
     c("C","เพิ่ม dissolution rate","✗ ผิด — ตรงข้าม; Mg stearate ลด dissolution"),
     c("D","ลด dissolution rate (hydrophobic coating บน particle)","✓ ถูก — Mg stearate hydrophobic; over-mixing → hydrophobic film เคลือบบน drug particles → ลด wettability → น้ำแทรกซึมได้น้อยลง → dissolution rate ลด; ควรใช้ 0.1-1% และ mix สั้นๆ"),
     c("E","เพิ่ม disintegration time","✗ ผิด — Mg stearate ไม่ได้ส่งผลต่อ disintegration โดยตรง แต่ส่งผลต่อ dissolution ผ่าน wettability")],
    "Mg stearate: ใช้ 0.1-1%; mix เวลาสั้น (<5 นาที); มากเกิน/นานเกิน → hydrophobic coating → ↓dissolution; ใช้ hydrophilic lubricant (SDS) แทนบางครั้ง"
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
  console.log('\nDone Q81-120');
  // verify
  const r = await db.execute("SELECT COUNT(*) as cnt FROM mcq_questions WHERE detailed_explanation IS NOT NULL AND exam_source='Pharmacyguru'");
  console.log('Total with detailed_explanation:', r.rows[0].cnt);
})();
