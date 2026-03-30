// Detailed explanations Q1-40
const { createClient } = require('@libsql/client');
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const d = (summary, reason, choices, key_takeaway) => ({ summary, reason, choices, key_takeaway });
const c = (label, text, explanation) => ({ label, text, explanation });

const data = [
  { n:1, det: d(
    "Tinea pedis — การจำแนก Tinea ตาม body site",
    "Trichophyton rubrum เป็นเชื้อหลักของ Tinea pedis ซึ่งเกิดที่เท้า/ซอกนิ้วเท้า",
    [c("A","Tinea capitis","✗ ผิด — Tinea capitis = เชื้อราที่หนังศีรษะ/เส้นผม ไม่ใช่เท้า"),
     c("B","Tinea manuum","✗ ผิด — Tinea manuum = เชื้อราที่ฝ่ามือ"),
     c("C","Tinea cruris","✗ ผิด — Tinea cruris = เชื้อราที่ขาหนีบ (jock itch)"),
     c("D","Tinea pedis","✓ ถูก — Trichophyton rubrum/mentagrophytes = สาเหตุหลัก Tinea pedis (athlete's foot) พบที่ซอกนิ้วเท้าและฝ่าเท้า"),
     c("E","Tinea corporis","✗ ผิด — Tinea corporis = ringworm บนผิวหนังลำตัว ไม่ใช่เท้า")],
    "จำ: pedis=เท้า, cruris=ขาหนีบ, capitis=ศีรษะ, manuum=มือ, corporis=ลำตัว, unguium=เล็บ"
  )},
  { n:2, det: d(
    "การรักษา Tinea pedis ที่ผิวหนัง (ไม่ใช่เล็บ)",
    "Tinea pedis ที่ผิวหนัง → Topical antifungal เป็น first-line ไม่ต้องใช้ oral",
    [c("A","Ketoconazole cream","✓ ถูก — Topical azole (Ketoconazole 2% cream) = first-line สำหรับ Tinea pedis ที่ผิวหนัง ทา 2-4 สัปดาห์"),
     c("B","Itraconazole capsule","✗ ผิด — Oral itraconazole ใช้สำหรับ onychomycosis (Tinea unguium) ไม่จำเป็นสำหรับ skin infection"),
     c("C","Mupirocin cream","✗ ผิด — Mupirocin = antibacterial ใช้กับ MRSA/impetigo ไม่มีฤทธิ์ antifungal"),
     c("D","Dexamethasone cream","✗ ผิด — Corticosteroid ห้ามใช้ใน fungal infection เพราะจะกดภูมิทำให้เชื้อรุนแรงขึ้น"),
     c("E","Miconazole tablets","✗ ผิด — Miconazole oral tablet ใช้สำหรับ oral/esophageal candidiasis ไม่ใช่ Tinea pedis ที่ผิวหนัง")],
    "Skin Tinea → topical antifungal; Nail Tinea → oral antifungal (Itraconazole/Terbinafine)"
  )},
  { n:3, det: d(
    "ADR ของ Azole antifungals",
    "Azole antifungals ยับยั้ง CYP enzymes โดยเฉพาะ CYP3A4 → สะสมใน liver → Hepatotoxicity",
    [c("A","Agranulocytosis","✗ ผิด — Agranulocytosis พบกับ Clozapine, Carbimazole, Carbamazepine ไม่ใช่ azoles"),
     c("B","Kidney Injury","✗ ผิด — Nephrotoxicity เป็น ADR ของ Amphotericin B ไม่ใช่ azoles"),
     c("C","Hepatotoxicity","✓ ถูก — Azoles (โดยเฉพาะ Ketoconazole) → Hepatotoxicity ต้อง monitor LFT; Ketoconazole ถูกถอนออกจากตลาดหลายประเทศ"),
     c("D","Nephrotoxicity","✗ ผิด — Nephrotoxicity ไม่ใช่ ADR หลักของ azoles แต่เป็นของ Amphotericin B"),
     c("E","Cardiotoxicity","✗ ผิด — Itraconazole อาจทำให้ QT prolongation ได้บ้าง แต่ไม่ใช่ ADR หลักของ azoles ทุกตัว")],
    "Azole = Hepatotoxicity; Amphotericin B = Nephrotoxicity + Infusion reactions"
  )},
  { n:4, det: d(
    "หน้าที่ของ excipient ใน Ketoconazole nail lacquer",
    "Eudragit RL 100 = film-forming polymer ทำให้ยาเกาะติดเล็บเป็นฟิล์ม",
    [c("A","PEG 400","✗ ผิด — PEG 400 ไม่มีในสูตรตำรับนี้; PEG เป็น solvent/plasticizer ไม่ใช่ film-former"),
     c("B","PG (Propylene glycol)","✗ ผิด — PG = co-solvent/humectant ช่วยละลายยา ไม่ใช่ film-former"),
     c("C","Eudragit RL 100","✓ ถูก — Eudragit RL 100 (polymethacrylic acid copolymer) = film-forming polymer ทำให้ยาเกาะเล็บเป็น film ค้างอยู่นาน"),
     c("D","Glyceryl triacetate","✗ ผิด — Glyceryl triacetate (Triacetin) = Plasticizer เพิ่มความยืดหยุ่นของ film ไม่แตกหรือลอก"),
     c("E","Isopropyl alcohol","✗ ผิด — IPA = solvent ทำหน้าที่ละลาย drug และ polymer ระเหยออกหลังทา")],
    "Nail lacquer: Film-former=Eudragit, Plasticizer=Triacetin, Solvent=IPA, Co-solvent=PG"
  )},
  { n:5, det: d(
    "หน้าที่ของ Glyceryl triacetate (Triacetin) ใน nail lacquer",
    "Triacetin = plasticizer ป้องกัน film แตกหรือลอก เพิ่ม flexibility",
    [c("A","Antioxidant","✗ ผิด — Antioxidant เช่น Vitamin E, BHA, BHT ไม่ใช่ Triacetin"),
     c("B","Buffer","✗ ผิด — Buffer ปรับ pH เช่น phosphate, citrate buffer ไม่ใช่ Triacetin"),
     c("C","Preservative","✗ ผิด — Preservative เช่น BAK, chlorhexidine ไม่ใช่ Triacetin"),
     c("D","Opacifier","✗ ผิด — Opacifier เช่น TiO₂ ทำให้ขุ่นขาว ไม่ใช่ Triacetin"),
     c("E","Plasticizer","✓ ถูก — Glyceryl triacetate/Triacetin = plasticizer เพิ่ม flexibility ของ Eudragit film ป้องกันฟิล์มแตกร้าวขณะงอนิ้ว")],
    "Plasticizers ใน nail lacquer: Triacetin, Dibutyl sebacate, PEG — ต้องเพิ่มเพื่อให้ film ยืดหยุ่น"
  )},
  { n:6, det: d(
    "Preservative ใน ophthalmic solution",
    "Benzalkonium chloride (BAK) = most common preservative ใน eye drops",
    [c("A","Antioxidant","✗ ผิด — Antioxidant เช่น Na2EDTA, sodium metabisulfite ป้องกัน oxidation ไม่ใช่ microbial preservative"),
     c("B","Benzalkonium chloride","✓ ถูก — BAK 0.01-0.02% = most widely used preservative ใน ophthalmic solution; ออกฤทธิ์ disrupt bacterial cell membrane"),
     c("C","Eudragit RL 100","✗ ผิด — Eudragit = film-former ใน nail lacquer ไม่ใช่ ophthalmic preservative"),
     c("D","PEG 400","✗ ผิด — PEG 400 = solvent/vehicle ไม่ใช่ preservative"),
     c("E","Isopropyl alcohol","✗ ผิด — IPA ระคายเคืองตาอย่างรุนแรง ไม่ใช้ใน ophthalmic ยกเว้นในกระบวนการผลิต")],
    "BAK = most common ophthalmic preservative แต่ toxic ต่อ corneal epithelium ใน long-term → preservative-free ดีกว่าในผู้ป่วย glaucoma"
  )},
  { n:7, det: d(
    "CURB-65 score และการจัดการ CAP",
    "CURB-65 ≥ 2 = admit ward ไม่ใช่ ICU ทันที; ≥ 3 จึงพิจารณา ICU",
    [c("A","CURB-65 = 0 → รักษาที่บ้านได้","✓ ถูก — Score 0 = low risk → OPD/home treatment"),
     c("B","CURB-65 = 1 → ผู้ป่วยนอก (OPD)","✓ ถูก — Score 1 = short admission หรือ OPD ขึ้นกับ clinical judgement"),
     c("C","CURB-65 ≥ 2 → รับไว้รักษาในโรงพยาบาล (non-ICU)","✓ ถูก — Score 2 = admit ward"),
     c("D","CURB-65 ≥ 2 → รับไว้รักษาใน ICU ทันที","✗ ผิด — Score 2 = admit ward ไม่ใช่ ICU; ต้องได้ score ≥ 3 จึงพิจารณา ICU"),
     c("E","CURB-65 ≥ 3 → พิจารณา ICU","✓ ถูก — Score ≥ 3 = high risk → consider ICU admission")],
    "CURB-65: 0-1=home, 2=ward, ≥3=ICU; C=Confusion, U=Urea>7, R=RR≥30, B=SBP<90, 65=age≥65"
  )},
  { n:8, det: d(
    "Empirical therapy สำหรับ CAP ที่ต้อง admit (non-ICU)",
    "IDSA/ATS: Beta-lactam + Macrolide = standard สำหรับ inpatient non-ICU CAP",
    [c("A","Ceftriaxone + Azithromycin","✓ ถูก — Beta-lactam (Ceftriaxone) + Macrolide (Azithromycin) = recommended combination สำหรับ inpatient non-ICU CAP ตาม IDSA/ATS"),
     c("B","Ceftriaxone + Doxycycline","✗ ผิด — Doxycycline เป็น alternative ได้ แต่ Azithromycin เป็น preferred มากกว่าเพราะ dosing และ efficacy"),
     c("C","Piperacillin/tazobactam + Azithromycin","✗ ผิด — Pip/tazo ใช้สำหรับ Hospital-acquired/Pseudomonal pneumonia ไม่ใช่ typical CAP"),
     c("D","Amoxicillin/Clavulanic acid","✗ ผิด — Augmentin ใช้ outpatient CAP ไม่เหมาะสำหรับ inpatient ที่ต้อง IV"),
     c("E","Ampicillin + Sulbactam","✗ ผิด — Ampicillin/sulbactam ไม่ครอบคลุม atypical organisms (Mycoplasma, Chlamydia, Legionella)")],
    "Inpatient CAP non-ICU: Ceftriaxone + Azithromycin (IV); ICU CAP: เพิ่ม respiratory FQ หรือ beta-lactam+macrolide"
  )},
  { n:9, det: d(
    "Antipseudomonal antibiotics",
    "Ceftazidime = 3rd gen cephalosporin ที่มีฤทธิ์ต้าน Pseudomonas aeruginosa",
    [c("A","Ampicillin","✗ ผิด — Ampicillin ไม่มีฤทธิ์ต้าน Pseudomonas (narrow spectrum gram-positive)"),
     c("B","Amoxicillin/Clavulanic","✗ ผิด — Augmentin ครอบคลุม gram-negative แต่ไม่ครอบคลุม Pseudomonas"),
     c("C","Ceftazidime","✓ ถูก — Ceftazidime = 3rd gen cephalosporin ที่มี anti-Pseudomonal activity; ใช้ใน Pseudomonal infections"),
     c("D","Doxycycline","✗ ผิด — Doxycycline = tetracycline ครอบคลุม atypicals, MRSA community แต่ไม่ใช่ Pseudomonas"),
     c("E","Azithromycin","✗ ผิด — Azithromycin = macrolide ครอบคลุม atypicals/gram-positive ไม่มีฤทธิ์ต้าน Pseudomonas")],
    "Anti-Pseudomonal: Ceftazidime, Cefepime, Pip/tazo, Meropenem, Imipenem, Ciprofloxacin, Aminoglycosides"
  )},
  { n:10, det: d(
    "Incompatibility ของ Ceftriaxone",
    "Ceftriaxone + Calcium → ตกตะกอน ceftriaxone-calcium salt อันตรายถึงชีวิต",
    [c("A","D5W","✗ ผิด — Ceftriaxone ผสม D5W ได้ปกติ (compatible)"),
     c("B","0.9% NaCl","✗ ผิด — Ceftriaxone ผสม NSS ได้ปกติ"),
     c("C","0.45% NaCl","✗ ผิด — Half-normal saline compatible กับ Ceftriaxone"),
     c("D","สารละลายที่มี Calcium (Ringer's Lactate)","✓ ถูก — Ceftriaxone + Ca²⁺ → ตกตะกอน Ceftriaxone-calcium salt ในปอด/ไต → เสียชีวิต (Black box warning โดยเฉพาะใน newborn)"),
     c("E","D10W","✗ ผิด — D10W compatible กับ Ceftriaxone")],
    "Ceftriaxone + Calcium (LR, Hartmann's) = ห้ามเด็ดขาด → Fatal precipitate; ใน neonates ห้ามให้ IV calcium ภายใน 48 ชม."
  )},
  { n:11, det: d(
    "การแปลผล Relative Risk และ 95% CI",
    "RR = 1.7, 95% CI 1.3-2.45 — CI ไม่ครอบค่า 1.0 → significant difference",
    [c("A","Amoxicillin/Clavulanate ดีกว่า Cefixime อย่างมีนัยสำคัญ","✓ ถูก — RR > 1.0 และ 95% CI (1.3-2.45) ไม่ครอบ 1.0 → แตกต่างอย่างมีนัยสำคัญ (p < 0.05); RR > 1 หมาย Amoxiclav ให้ผลดีกว่า"),
     c("B","Amoxicillin/Clavulanate ดีกว่าแต่ไม่มีนัยสำคัญ","✗ ผิด — ถ้าไม่มีนัยสำคัญ CI ต้องครอบ 1.0"),
     c("C","ไม่แตกต่างกัน","✗ ผิด — ถ้าไม่แตกต่าง RR จะ = 1 และ CI ครอบ 1.0"),
     c("D","Cefixime ดีกว่าอย่างมีนัยสำคัญ","✗ ผิด — RR > 1 แสดงว่า Amoxiclav ดีกว่า ไม่ใช่ Cefixime; Cefixime ดีกว่าถ้า RR < 1 และ CI ต่ำกว่า 1.0"),
     c("E","ยังสรุปไม่ได้","✗ ผิด — สรุปได้ชัดเจนเพราะ CI ไม่ครอบ 1.0")],
    "95% CI ไม่ครอบ 1.0 → p < 0.05 → significant; ครอบ 1.0 → p > 0.05 → not significant"
  )},
  { n:12, det: d(
    "การคำนวณ NNT จาก ARR",
    "ARR = CER - EER = 40/200 - 20/200 = 0.10; NNT = 1/ARR = 10",
    [c("A","5","✗ ผิด — NNT 5 จะได้เมื่อ ARR = 20%; ข้อนี้ ARR = 10%"),
     c("B","10","✓ ถูก — ARR = 0.20 - 0.10 = 0.10 → NNT = 1/0.10 = 10; ต้องรักษา 10 คนเพื่อป้องกัน 1 event"),
     c("C","13","✗ ผิด — NNT 13 = ARR ~7.7% ไม่ตรงกับโจทย์"),
     c("D","20","✗ ผิด — NNT 20 = ARR 5%"),
     c("E","25","✗ ผิด — NNT 25 = ARR 4%")],
    "NNT = 1/ARR; ARR = CER - EER; ยิ่ง NNT น้อย ยาได้ผลดียิ่งขึ้น"
  )},
  { n:13, det: d(
    "เหตุผลที่ใช้ Amoxicillin/Clavulanate ขนาดสูงใน COPD exacerbation",
    "Beta-lactam เป็น time-dependent — การเพิ่มขนาดเพื่อ overcome MIC ที่สูงของเชื้อดื้อยา",
    [c("A","เพื่อเพิ่ม absorption","✗ ผิด — การเพิ่มขนาดไม่ได้เพิ่ม oral bioavailability อย่างมีนัยสำคัญ"),
     c("B","เพื่อเอาชนะ MIC สูงของเชื้อดื้อยา","✓ ถูก — Beta-lactam = time-dependent (T>MIC); การเพิ่มขนาดเพื่อ achieve และรักษา T>MIC ต่อเชื้อดื้อยา เช่น H. influenzae, M. catarrhalis"),
     c("C","เพื่อลด side effects","✗ ผิด — ขนาดสูงกว่าปกติ เพิ่ม GI side effects ไม่ใช่ลด"),
     c("D","เป็นขนาดปกติสำหรับ COPD exacerbation","✗ ผิด — 3000 mg/day สูงกว่าขนาดปกติ (750-2000 mg/day)"),
     c("E","ลด protein binding","✗ ผิด — ขนาดยาไม่ได้มีผลต่อ protein binding อย่างมีนัยสำคัญ")],
    "Beta-lactam = time-dependent (ต้องรักษา T>MIC ≥40-50%); Aminoglycosides/Fluoroquinolones = concentration-dependent"
  )},
  { n:14, det: d(
    "Baseline monitoring ก่อนเริ่ม Hydroxychloroquine ใน SLE",
    "HCQ สะสมใน melanin-containing tissues รวมถึง retina → ต้อง baseline eye exam",
    [c("A","Serum creatinine","✗ ผิด — Renal function ไม่ใช่ main concern ของ HCQ; อาจ adjust dose ใน severe renal impairment แต่ไม่ใช่ baseline หลัก"),
     c("B","eGFR","✗ ผิด — eGFR ไม่ใช่ baseline monitoring หลักสำหรับ HCQ"),
     c("C","CBC","✗ ผิด — HCQ ไม่ก่อ myelosuppression ที่ต้อง baseline CBC"),
     c("D","Vision (Ophthalmologic exam)","✓ ถูก — HCQ → retinal toxicity → ต้อง baseline ophthalmologic exam (visual field + spectral-domain OCT) ตาม ACR 2016 guidelines"),
     c("E","การทดสอบการได้ยิน","✗ ผิด — Hearing loss เป็น ADR ของ Quinine/Aminoglycosides ไม่ใช่ HCQ")],
    "HCQ monitoring: baseline eye exam + ทุกปีหลัง 5 ปี; HCQ dose ≤5 mg/kg/day ลด retinopathy risk"
  )},
  { n:15, det: d(
    "Absolute contraindication ของ Hydroxychloroquine",
    "HCQ สะสม retina → pre-existing retinal disease = absolute CI",
    [c("A","ตั้งครรภ์","✗ ผิด — HCQ ปลอดภัยในการตั้งครรภ์ (Category C, แต่ benefit > risk ใน SLE); ไม่ใช่ CI"),
     c("B","ไตวาย","✗ ผิด — ไตวายต้องปรับขนาดยา แต่ไม่ใช่ absolute CI"),
     c("C","เบาหวาน","✗ ผิด — HCQ อาจ reduce blood glucose ได้เล็กน้อย ไม่ใช่ CI"),
     c("D","Retinal/Macular disease ที่มีอยู่เดิม","✓ ถูก — Pre-existing retinal/macular disease = absolute contraindication เพราะ HCQ จะทำให้แย่ลงอย่างถาวร"),
     c("E","ความดันโลหิตสูง","✗ ผิด — Hypertension ไม่ใช่ CI ของ HCQ")],
    "HCQ: ปลอดภัยในการตั้งครรภ์และ breastfeeding; CI หลัก = pre-existing retinopathy"
  )},
  { n:16, det: d(
    "บทบาทของ Hydroxychloroquine ใน SLE",
    "HCQ = cornerstone/background therapy ใน SLE ทุก severity ไม่ใช่แค่ rescue therapy",
    [c("A","Rescue therapy เฉพาะตอน flare","✗ ผิด — HCQ ใช้ต่อเนื่อง ไม่ใช่แค่ตอน flare; หยุดยาเพิ่มความเสี่ยง flare"),
     c("B","Background/maintenance therapy ใน SLE ทุก severity","✓ ถูก — ACR แนะนำ HCQ ในผู้ป่วย SLE ทุกราย (ยกเว้น CI) เพื่อลด disease activity, flare, organ damage, mortality"),
     c("C","ใช้เฉพาะใน severe SLE","✗ ผิด — ใช้ได้ทุก severity รวมถึง mild SLE"),
     c("D","ใช้แทน corticosteroid","✗ ผิด — HCQ ไม่ใช่ corticosteroid; ใช้ร่วมกันได้และช่วยลดขนาด steroid"),
     c("E","ใช้เฉพาะใน lupus nephritis","✗ ผิด — ใช้ได้ทุก manifestation ไม่จำกัดแค่ nephritis")],
    "HCQ benefits ใน SLE: ลด flare, ลด organ damage, ลด thrombosis (APS), ลด mortality, ปลอดภัยในตั้งครรภ์"
  )},
  { n:17, det: d(
    "Monitoring ระหว่างใช้ Hydroxychloroquine",
    "ACR 2016: ophthalmologic monitoring ปีละ 1 ครั้งหลังใช้ยา 5 ปี",
    [c("A","ตรวจ Serum creatinine ทุก 3 เดือน","✗ ผิด — Renal monitoring ไม่ใช่ routine สำหรับ HCQ โดยเฉพาะ"),
     c("B","ตรวจ eGFR ทุก 6 เดือน","✗ ผิด — eGFR ไม่ใช่ primary monitoring parameter ของ HCQ"),
     c("C","CBC ทุกเดือน","✗ ผิด — HCQ ไม่มีผล myelosuppression ที่ต้อง monthly CBC"),
     c("D","Vision field test ทุกปีหลังใช้ยา 5 ปี","✓ ถูก — ACR 2016: annual ophthalmologic exam หลัง 5 ปีแรก (หรือเร็วกว่าถ้า high-risk: renal/liver disease, high dose, อายุ ≥60)"),
     c("E","ไม่ต้อง monitor ใดๆ","✗ ผิด — ต้อง monitor eyes เสมอ")],
    "HCQ safe dose ≤5 mg/kg/day; ophthalmologic screening ปีแรก (baseline) แล้ว annual ตั้งแต่ปีที่ 5"
  )},
  { n:18, det: d(
    "ข้อที่ไม่ถูกต้องเกี่ยวกับ HCQ ใน SLE",
    "HCQ ไม่สามารถทดแทน immunosuppressant ได้ใน severe disease",
    [c("A","ใช้ร่วมกับ Methotrexate ได้","✗ คำตอบนี้ถูกต้อง — HCQ + MTX ใช้ร่วมกันได้ใน RA และ SLE"),
     c("B","ใช้ HCQ แทน Immunosuppressant ทุกชนิดได้","✓ นี่คือข้อที่ผิด — HCQ ไม่สามารถแทน MMF/Azathioprine/Cyclophosphamide ใน severe manifestations เช่น lupus nephritis class III/IV"),
     c("C","ใช้ได้อย่างปลอดภัยในหญิงตั้งครรภ์ที่เป็น SLE","✗ คำตอบนี้ถูกต้อง — HCQ ปลอดภัยในการตั้งครรภ์; การหยุดยาเพิ่มความเสี่ยง flare"),
     c("D","ใช้ร่วมกับ Mycophenolate mofetil ได้","✗ คำตอบนี้ถูกต้อง — HCQ + MMF ใช้ร่วมกันเป็น standard of care ใน lupus nephritis"),
     c("E","ลดความเสี่ยง thrombosis ใน APS","✗ คำตอบนี้ถูกต้อง — HCQ มีคุณสมบัติ antithrombotic ลด risk ใน antiphospholipid syndrome")],
    "HCQ = adjunct therapy ไม่สามารถแทน immunosuppressants ได้; ใน severe SLE ต้องใช้ร่วมกัน"
  )},
  { n:19, det: d(
    "Drug-induced lupus (DIL) — classic causative drugs",
    "H-P-I triad = Hydralazine, Procainamide, Isoniazid — classic DIL",
    [c("A","Enalapril","✗ ผิด — ACE inhibitors ไม่ใช่ classic DIL drugs; อาจทำให้ SLE flare ได้แต่ไม่ใช่ classic"),
     c("B","Hydralazine","✓ ถูก — Hydralazine = classic DIL; มักเป็น slow acetylators; ANA+ (anti-histone Ab); หายหลังหยุดยา"),
     c("C","Simvastatin","✗ ผิด — Statins อาจทำ lupus-like ได้บ้างแต่ไม่ใช่ classic"),
     c("D","Amlodipine","✗ ผิด — Calcium channel blockers ไม่ใช่ classic DIL drugs"),
     c("E","Metformin","✗ ผิด — Metformin ไม่ก่อ DIL")],
    "Classic DIL: H=Hydralazine, P=Procainamide, I=Isoniazid; Others: Minocycline, Anti-TNF, Methyldopa; DIL = anti-histone Ab+"
  )},
  { n:20, det: d(
    "การคุมกำเนิดใน SLE ที่มี antiphospholipid antibody",
    "APS + estrogen = เพิ่ม thrombosis risk → ห้าม COC; ใช้ progestin-only แทน",
    [c("A","Combined oral contraceptive (COC)","✗ ผิด — Estrogen ใน COC เพิ่ม thrombosis risk อย่างมากใน APS → ห้ามใช้"),
     c("B","Progestin-only pill","✓ ถูก — Progestin-only (norethindrone) ไม่เพิ่ม thrombosis risk → เลือกใช้ใน SLE/APS"),
     c("C","ไม่ต้องคุมกำเนิด","✗ ผิด — การตั้งครรภ์ใน APS เสี่ยง recurrent miscarriage, thrombosis; ต้องวางแผน"),
     c("D","ฉีด DMPA","✗ ผิด — DMPA (progestin) ใช้ได้แต่มี concern เรื่อง bone density loss ในระยะยาว; อาจพิจารณาได้"),
     c("E","ใส่ห่วงอนามัยชนิดฮอร์โมน","✗ ผิด — Levonorgestrel IUD (progestin) พิจารณาได้ แต่ copper IUD ดีกว่าถ้าต้องการ hormone-free")],
    "SLE+APS: ห้าม COC → Progestin-only pill, copper IUD, or barrier method; Hydroxychloroquine ลด thrombosis risk"
  )},
  { n:21, det: d(
    "การจัดประเภท Heart Failure ตาม LVEF",
    "LVEF 30% < 40% จัดเป็น HFrEF",
    [c("A","Acute heart failure","✗ ผิด — Acute HF อธิบาย timeline ไม่ใช่ category ตาม LVEF"),
     c("B","Acute decompensated heart failure","✗ ผิด — ADHF = acute deterioration ของ chronic HF ไม่ใช่ category ตาม LVEF"),
     c("C","HFrEF (LVEF < 40%)","✓ ถูก — LVEF 30% < 40% = HFrEF (Heart Failure with reduced EF); มี evidence-based treatment ที่ลด mortality"),
     c("D","HFmrEF (LVEF 40-49%)","✗ ผิด — HFmrEF = 40-49%; LVEF 30% ต่ำกว่า"),
     c("E","HFpEF (LVEF ≥ 50%)","✗ ผิด — HFpEF = preserved EF ≥50%; LVEF 30% ไม่ใช่ category นี้")],
    "HF categories: HFrEF <40%, HFmrEF 40-49%, HFpEF ≥50%; ยา mortality benefit มีเฉพาะ HFrEF"
  )},
  { n:22, det: d(
    "กลไกของ Sacubitril/Valsartan (ARNI)",
    "Sacubitril = Neprilysin inhibitor → เพิ่ม natriuretic peptides; Valsartan = ARB",
    [c("A","Block Angiotensin II receptor","✗ ผิด — นี่คือกลไกของ Valsartan (ARB component) เพียงส่วนเดียว ไม่ใช่กลไกหลักที่ทำให้ ARNI แตกต่าง"),
     c("B","Block Neprilysin (NEP)","✓ ถูก — Sacubitril → Sacubitrilat → inhibit Neprilysin → เพิ่ม BNP, ANP → vasodilation + natriuresis + anti-fibrosis; PARADIGM-HF พิสูจน์ลด mortality"),
     c("C","Block Angiotensin converting enzyme","✗ ผิด — นี่คือกลไกของ ACE inhibitors; ห้ามใช้ ARNI ร่วมกับ ACEi"),
     c("D","Block Beta-adrenergic receptor","✗ ผิด — นี่คือกลไกของ Beta-blockers"),
     c("E","Block Aldosterone receptor","✗ ผิด — นี่คือกลไกของ Spironolactone/Eplerenone (MRA)")],
    "ARNI = Neprilysin inhibitor (Sacubitril) + ARB (Valsartan); ห้ามใช้ร่วมกับ ACEi (angioedema risk)"
  )},
  { n:23, det: d(
    "การเปลี่ยนจาก ACE inhibitor เป็น ARNI",
    "ต้อง washout ACEi ≥ 36 ชั่วโมงก่อนเริ่ม ARNI เพื่อป้องกัน angioedema",
    [c("A","เปลี่ยนทันทีได้เลย","✗ ผิด — ห้ามเปลี่ยนทันที; ต้อง washout เพื่อป้องกัน angioedema จาก bradykinin excess"),
     c("B","หยุด ACE inhibitor อย่างน้อย 36 ชั่วโมงก่อนเริ่ม ARNI","✓ ถูก — ACEi ยับยั้ง bradykinin degradation; Sacubitril ก็ยับยั้ง Neprilysin (ซึ่ง degrade bradykinin) → ถ้าให้พร้อมกัน bradykinin สูงมาก → angioedema"),
     c("C","ให้ร่วมกันได้","✗ ผิด — ห้ามใช้ ARNI + ACEi ร่วมกัน เป็น absolute contraindication"),
     c("D","เปลี่ยนเป็น Losartan ก่อน","✗ ผิด — ไม่จำเป็นต้องเปลี่ยนผ่าน ARB ก่อน; แค่ washout 36 ชั่วโมงแล้วเริ่ม ARNI"),
     c("E","ไม่ต้องหยุด","✗ ผิด — ต้อง washout เสมอ")],
    "ACEi → ARNI: หยุด ACEi ≥36h → เริ่ม ARNI; ARB → ARNI: ไม่ต้อง washout"
  )},
  { n:24, det: d(
    "Beta-blockers ที่ได้รับการรับรองใน HFrEF",
    "มีเพียง 3 BB ที่ approved ใน HFrEF: Carvedilol, Bisoprolol, Metoprolol succinate",
    [c("A","Atenolol","✗ ผิด — Atenolol ไม่ได้ approved สำหรับ HFrEF; เป็น cardioselective BB แต่ไม่มี evidence ลด mortality ใน HF"),
     c("B","Bisoprolol","✓ ถูก — Bisoprolol ได้ approved สำหรับ HFrEF (CIBIS-II trial); ลด all-cause mortality 34%"),
     c("C","Nebivolol","✗ ผิด — Nebivolol ใช้ใน elderly HFrEF (SENIORS trial) แต่ไม่ใช่ standard first-line ที่ approved เช่น Bisoprolol"),
     c("D","Propranolol","✗ ผิด — Propranolol non-selective BB ไม่ approved ใน HFrEF"),
     c("E","Nadolol","✗ ผิด — Nadolol ไม่ approved ใน HFrEF")],
    "HFrEF BB: Carvedilol (CAPRICORN/COPERNICUS), Bisoprolol (CIBIS-II), Metoprolol succinate (MERIT-HF); เริ่มขนาดต่ำ titrate ขึ้น"
  )},
  { n:25, det: d(
    "คำนวณ ARR และ NNT",
    "ARR = 40/200 - 20/200 = 0.10 = 10%; NNT = 1/0.10 = 10",
    [c("A","ARR 5%, NNT 5","✗ ผิด — ARR 5% = NNT 20; ข้อนี้คำนวณผิด"),
     c("B","ARR 10%, NNT 10","✓ ถูก — CER=0.20, EER=0.10; ARR=0.10=10%; NNT=1/0.10=10; ต้องรักษา 10 คนเพื่อป้องกัน 1 event extra"),
     c("C","ARR 13%, NNT 13","✗ ผิด — ตัวเลขไม่ตรงกับโจทย์"),
     c("D","ARR 20%, NNT 20","✗ ผิด — ARR 20% = 40/200 ซึ่งเป็น CER อย่างเดียว ไม่ใช่ ARR"),
     c("E","ARR 25%, NNT 25","✗ ผิด — ตัวเลขไม่สอดคล้องกับโจทย์")],
    "NNT = 1/ARR; ARR = CER - EER; RRR = ARR/CER = 10%/20% = 50%; NNH ใช้ ARI = AER - CER"
  )},
  { n:26, det: d(
    "การเลือกกระบวนการผลิต Digoxin tablet ขนาดน้อยที่ไวต่อความร้อน/ชื้น",
    "Dry granulation หลีกเลี่ยงทั้งความร้อน (oven drying) และน้ำ",
    [c("A","Wet granulation","✗ ผิด — Wet granulation ใช้น้ำ/solvent + ความร้อนตากแห้ง → ทำลาย Digoxin ที่ heat/moisture labile"),
     c("B","Dry granulation (Slugging)","✓ ถูก — Dry granulation ไม่ใช้น้ำและไม่ใช้ความร้อน เหมาะกับ drug ที่ heat/moisture labile เช่น Digoxin ขนาดน้อย"),
     c("C","Direct compression","✗ ผิด — Direct compression ใช้ได้แต่ Digoxin มีปัญหา flowability และ content uniformity เพราะ dose เล็กมาก; dry granulation ดีกว่า"),
     c("D","Hot melt extrusion","✗ ผิด — Hot melt extrusion ใช้ความร้อนสูง → ทำลาย Digoxin"),
     c("E","Spray drying","✗ ผิด — Spray drying ใช้ความร้อน + moisture labile")],
    "Dry granulation (Roller compaction/Slugging): ไม่ใช้น้ำ ไม่ใช้ความร้อน → เหมาะกับ heat/moisture-sensitive drugs"
  )},
  { n:27, det: d(
    "การจัดการ Fluid overload ใน HFrEF",
    "Loop diuretic = first-line สำหรับ fluid overload ใน HF ลด preload บรรเทา congestion",
    [c("A","เพิ่ม Furosemide (loop diuretic)","✓ ถูก — Loop diuretic (Furosemide) = first-line สำหรับ acute fluid overload; ลด preload, บรรเทา dyspnea, ลด edema"),
     c("B","เพิ่ม Spironolactone","✗ ผิด — Spironolactone (MRA) ใช้ลด mortality ใน HFrEF แต่ effect diuretic อ่อนกว่า loop diuretic; ไม่ใช่ first-line สำหรับ acute fluid overload"),
     c("C","เพิ่ม Thiazide","✗ ผิด — Thiazide ออกฤทธิ์อ่อนกว่า loop diuretic; ใช้เป็น add-on ใน diuretic resistance ไม่ใช่ first-line"),
     c("D","เพิ่ม Digoxin","✗ ผิด — Digoxin ใช้ลด heart rate ใน HF+AF และลด hospitalization แต่ไม่ช่วย fluid overload โดยตรง"),
     c("E","เพิ่ม Amlodipine","✗ ผิด — CCB (Amlodipine) ไม่ใช่ยา HF; อาจ worsen HF ได้ในบางกรณี")],
    "Fluid overload ใน HF → Furosemide IV/PO; ถ้าดื้อยา: เพิ่มขนาด + Thiazide combination (sequential nephron blockade)"
  )},
  { n:28, det: d(
    "Criteria วินิจฉัย Osteoporosis ตาม WHO",
    "WHO BMD criteria: T-score ≤ −2.5 = Osteoporosis",
    [c("A","T-score ≤ −1.0","✗ ผิด — T-score ≤ −1.0 = เริ่มออกจาก Normal ลงไปหา Osteopenia; ≤ −1.0 ถึง −2.5 = Osteopenia"),
     c("B","T-score ≤ −2.5","✓ ถูก — WHO: T-score ≤ −2.5 = Osteoporosis; ถ้ามี fragility fracture ด้วย = Severe osteoporosis"),
     c("C","T-score ≤ −3.0","✗ ผิด — ≤ −3.0 ยังคงเป็น Osteoporosis แต่ไม่ใช่ threshold diagnosis"),
     c("D","T-score ≤ −1.5","✗ ผิด — ≤ −1.5 อยู่ใน Osteopenia range (−1.0 ถึง −2.5)"),
     c("E","T-score ≤ −2.0","✗ ผิด — ≤ −2.0 ยังเป็น Osteopenia")],
    "T-score: ≥−1.0=Normal; −1.0 to −2.5=Osteopenia; ≤−2.5=Osteoporosis; ≤−2.5+fragility fracture=Severe OP"
  )},
  { n:29, det: d(
    "คำแนะนำการรับประทาน Alendronate (Bisphosphonate)",
    "ต้องดื่มน้ำเปล่า 200 mL นั่งตัวตรง ≥30 นาที เพื่อป้องกัน esophageal ulcer",
    [c("A","รับประทานตอนเช้ากับน้ำเปล่า 200 mL ก่อนอาหาร 30 นาที นั่งตัวตรง ≥ 30 นาที","✓ ถูก — ปฏิบัติถูกต้อง: น้ำเปล่า (ไม่ใช่น้ำอื่น), ก่อนอาหาร 30 นาที, upright position ≥30 นาที — ป้องกัน esophageal ulcer"),
     c("B","รับประทานพร้อมอาหารเพื่อลด GI irritation","✗ ผิด — อาหารลด bioavailability ของ bisphosphonate อย่างมาก ต้องกินตอนท้องว่าง"),
     c("C","ดื่มนมพร้อมยา","✗ ผิด — Ca²⁺ ในนม chelate bisphosphonate → ลด absorption อย่างมาก"),
     c("D","รับประทานก่อนนอน","✗ ผิด — นอนราบหลังกินยา → gastroesophageal reflux → esophageal ulcer/stricture"),
     c("E","รับประทานได้ตลอดเวลา","✗ ผิด — ต้องกินตอนเช้าพร้อมน้ำเปล่า ก่อนอาหาร และนั่งตัวตรง")],
    "Bisphosphonate counseling: น้ำเปล่า 200 mL + ก่อนอาหาร 30 นาที + upright ≥30 นาที + ไม่ Ca/Fe/Mg ร่วม"
  )},
  { n:30, det: d(
    "First-line pharmacotherapy สำหรับ Osteoporosis",
    "Bisphosphonate (Alendronate) = first-line ลด fracture risk ได้ดีที่สุด และ cost-effective",
    [c("A","Calcium + Vitamin D เท่านั้น","✗ ผิด — Ca+VitD เป็น adjunct therapy ไม่เพียงพอสำหรับ T-score −2.9 ที่ต้องการ pharmacotherapy"),
     c("B","Calcitonin","✗ ผิด — Calcitonin เป็น 2nd/3rd line; ไม่ได้แสดง fracture reduction ที่ดีเท่า bisphosphonate"),
     c("C","Alendronate","✓ ถูก — Alendronate (bisphosphonate) = first-line pharmacotherapy สำหรับ postmenopausal osteoporosis; ลด vertebral fracture 50%, hip fracture 51%"),
     c("D","Estrogen","✗ ผิด — Estrogen/HRT ลด fracture ได้แต่ เพิ่มความเสี่ยง cardiovascular disease, breast cancer → ไม่ใช่ first-line"),
     c("E","Teriparatide","✗ ผิด — Teriparatide (PTH analogue) = anabolic therapy สำหรับ very high risk/severe OP หรือ bisphosphonate failure")],
    "First-line OP: Bisphosphonate (Alendronate/Risedronate/Zoledronate); 2nd line: Denosumab; Severe/very high risk: Teriparatide/Romosozumab"
  )},
  { n:31, det: d(
    "ADR ที่ไม่ใช่ของ Alendronate",
    "Bradykinesia เป็นอาการ Parkinson's disease ไม่ใช่ ADR ของ bisphosphonate",
    [c("A","Esophageal ulcer","✗ คำตอบนี้ถูก (เป็น ADR จริง) — Esophageal ulcer/stricture ถ้าไม่ปฏิบัติตามคำแนะนำ"),
     c("B","Bradykinesia","✓ นี่คือข้อที่ไม่ใช่ ADR — Bradykinesia = อาการ Parkinson's ไม่มีความสัมพันธ์กับ bisphosphonate"),
     c("C","Osteonecrosis of the jaw (ONJ)","✗ คำตอบนี้ถูก (เป็น ADR จริง) — ONJ พบใน bisphosphonate ที่ใช้ขนาดสูง (IV zoledronate ใน cancer) หรือระยะยาว"),
     c("D","Atrial fibrillation","✗ คำตอบนี้ถูก (เป็น ADR จริง) — Bisphosphonate เพิ่มความเสี่ยง AFib เล็กน้อย"),
     c("E","Atypical femur fracture","✗ คำตอบนี้ถูก (เป็น ADR จริง) — Long-term bisphosphonate (>5 ปี) → atypical subtrochanteric fracture")],
    "Bisphosphonate ADR: GI (esophageal ulcer), ONJ, Atypical fracture, AFib, Hypocalcemia, Flu-like (IV route)"
  )},
  { n:32, det: d(
    "Excipient ที่เหมาะสมสำหรับ Direct Compression",
    "MCC (Avicel) = ideal สำหรับ direct compression เพราะ compressibility + flowability ดีเยี่ยม",
    [c("A","Starch","✗ ผิด — Regular starch มี poor flowability ไม่เหมาะสำหรับ direct compression"),
     c("B","PVP (Povidone)","✗ ผิด — PVP = binder ใน wet granulation ไม่ใช่ diluent/filler สำหรับ direct compression"),
     c("C","HPMC","✗ ผิด — HPMC ใช้เป็น binder หรือ controlled-release matrix ไม่ใช่ primary diluent สำหรับ DC"),
     c("D","Lactose monohydrate ทั่วไป","✗ ผิด — Regular lactose monohydrate มี poor flowability ต้องทำ granulation ก่อน; Spray-dried lactose ถึงจะใช้ DC ได้"),
     c("E","Microcrystalline cellulose (MCC)","✓ ถูก — MCC (Avicel PH-101, PH-102) = gold standard สำหรับ direct compression; ทำหน้าที่ diluent + binder ในเม็ดเดียว compressibility ดี")],
    "DC excipients: MCC (Avicel), Spray-dried lactose, DiCal phosphate, Mannitol DC grade — ต้องมี good flowability + compressibility"
  )},
  { n:33, det: d(
    "Diluent ที่เหมาะสำหรับ Direct Compression",
    "Spray dried lactose มี flowability + compressibility ดี เหมาะสำหรับ DC",
    [c("A","Starch","✗ ผิด — Regular starch มี poor flowability ต้องทำ granulation ก่อน"),
     c("B","Colloidal silicon dioxide","✗ ผิด — Colloidal SiO₂ (Aerosil) = glidant ช่วย flowability แต่ไม่ใช่ diluent หลัก"),
     c("C","Spray dried lactose","✓ ถูก — Spray dried lactose ผลิตโดย spray drying → รูปทรงกลม, compressibility + flowability ดี เหมาะสำหรับ DC; ต่างจาก regular lactose monohydrate"),
     c("D","Talc","✗ ผิด — Talc = glidant/lubricant ไม่ใช่ diluent หลัก"),
     c("E","Regular lactose monohydrate","✗ ผิด — Regular lactose = poor flowability; ต้องทำ granulation ก่อนจะใช้ได้")],
    "DC diluent: Spray dried lactose > MCC > DiCal phosphate; Regular lactose ต้อง granulate ก่อน"
  )},
  { n:34, det: d(
    "Superdisintegrant ในสูตรตำรับ tablet",
    "Sodium starch glycolate = superdisintegrant พองตัวเร็ว ช่วย tablet แตกตัวเร็ว",
    [c("A","PVP","✗ ผิด — PVP = binder ยึดอนุภาค ไม่ใช่ disintegrant"),
     c("B","Lactose","✗ ผิด — Lactose = diluent/filler ไม่ใช่ disintegrant"),
     c("C","Colloidal silicon dioxide","✗ ผิด — Colloidal SiO₂ = glidant ช่วย flowability ไม่ใช่ disintegrant"),
     c("D","Sodium starch glycolate","✓ ถูก — Sodium starch glycolate (Explotab/Primojel) = superdisintegrant พองตัวเร็ว 300× ช่วย tablet disintegrate ใน < 5 นาที"),
     c("E","Magnesium stearate","✗ ผิด — Mg stearate = lubricant ลดการเสียดสี ไม่ใช่ disintegrant")],
    "Superdisintegrants: Sodium starch glycolate, Croscarmellose sodium (Ac-Di-Sol), Crospovidone (XL) — ใช้ 2-5% พองตัวเร็ว"
  )},
  { n:35, det: d(
    "ยาที่ทำให้เกิด hemolysis ใน G6PD deficiency",
    "Ofloxacin (fluoroquinolone) ทำให้ oxidative hemolysis ใน G6PD",
    [c("A","Amoxicillin","✗ ผิด — Amoxicillin (penicillin) ปลอดภัยใน G6PD; ไม่ก่อ oxidative stress"),
     c("B","Chlorpheniramine","✗ ผิด — Antihistamine ปลอดภัยใน G6PD"),
     c("C","Paracetamol","✗ ผิด — Paracetamol ปลอดภัยใน G6PD ในขนาดปกติ"),
     c("D","Ofloxacin","✓ ถูก — Fluoroquinolones (Ofloxacin, Ciprofloxacin) ทำให้ oxidative hemolysis ใน G6PD — ต้องหลีกเลี่ยง"),
     c("E","HCTZ","✗ ผิด — Thiazide diuretics ไม่ก่อ hemolysis ใน G6PD")],
    "G6PD hemolysis drugs: Primaquine, Dapsone, Nitrofurantoin, Quinolones, Sulfonamides, Rasburicase — จำ PNQSR"
  )},
  { n:36, det: d(
    "เวลาที่เกิด hemolytic anemia ใน G6PD",
    "Hemolysis ใน G6PD มักเกิดช้า 3-7 วันหลังเริ่มยา ไม่ได้เกิดทันที",
    [c("A","ทันทีหลังรับยา","✗ ผิด — Hemolysis ใน G6PD ไม่ได้เกิดทันที ต้องใช้เวลาสะสม oxidative damage"),
     c("B","1 ชั่วโมงหลังรับยา","✗ ผิด — เร็วเกินไป; acute hemolytic reaction แบบนี้เกิดใน anaphylaxis หรือ intravascular hemolysis จาก mismatch blood"),
     c("C","1 วันหลังรับยา","✗ ผิด — ยังเร็วเกินไป"),
     c("D","3-7 วันหลังเริ่มยา","✓ ถูก — Hemolytic anemia ใน G6PD typically เกิดหลัง exposure 1-3 วัน และ peak ~7-10 วัน หลังหยุดยา RBC ปกติใหม่ใน 3-6 สัปดาห์"),
     c("E","หลังหยุดยา 2 สัปดาห์","✗ ผิด — Hemolysis เกิดระหว่างที่ยังใช้ยา ไม่ใช่หลังหยุดยา")],
    "G6PD hemolysis: เริ่ม 1-3 วัน peak 7-10 วัน recovery 3-6 สัปดาห์หลังหยุด offending drug"
  )},
  { n:37, det: d(
    "การ monitor CBC หลังหยุดยาที่ก่อ hemolysis ใน G6PD",
    "Recheck CBC 1 วันหลังหยุดยาเพื่อติดตามการฟื้นตัว (reticulocytosis)",
    [c("A","20 ชั่วโมงหลังหยุดยา","✗ ผิด — เร็วเกินไป; RBC ใช้เวลาฟื้นตัว reticulocyte count เพิ่งเริ่มเพิ่ม"),
     c("B","2 วันหลังหยุดยา","✗ ผิด — ไม่ตรงกับ convention"),
     c("C","1 วันหลังหยุด Ofloxacin","✓ ถูก — Recheck CBC หลังหยุดยา 1 วัน เพื่อดู reticulocytosis (สัญญาณฟื้นตัว) และ Hb trend"),
     c("D","5 วันหลังหยุดยา","✗ ผิด — นานเกินไป; อาจพลาดการ monitor ช่วง critical"),
     c("E","3 วันหลังหยุดยา","✗ ผิด — อาจ acceptable แต่ไม่ใช่คำตอบที่ดีที่สุด")],
    "G6PD management: หยุด offending drug, CBC ติดตาม, rehydration, blood transfusion ถ้า severe anemia"
  )},
  { n:38, det: d(
    "กลไกของ hemolytic anemia ใน G6PD deficiency",
    "G6PD ขาด → NADPH ลด → Glutathione ลด → Oxidative damage → Heinz bodies → Hemolysis",
    [c("A","Oxidative hemolysis","✓ ถูก — G6PD ขาด → NADPH ลด (penthose phosphate pathway) → reduced glutathione ลด → oxidized Hb (Heinz bodies) → RBC หักเปราะ → hemolysis"),
     c("B","Immune-mediated hemolysis","✗ ผิด — Immune hemolysis เกิดจาก autoantibodies (AIHA) หรือ drug-induced immune hemolysis คนละกลไก"),
     c("C","Mechanical hemolysis","✗ ผิด — Mechanical hemolysis เกิดจาก prosthetic heart valve หรือ microangiopathy"),
     c("D","Osmotic hemolysis","✗ ผิด — Osmotic hemolysis เกิดใน hereditary spherocytosis หรือ hypotonic solution"),
     c("E","Autoimmune hemolysis","✗ ผิด — Autoimmune = AIHA มี positive Coombs test; G6PD hemolysis = Coombs negative")],
    "G6PD pathway: Glucose→G6P→(G6PD)→6PG + NADPH; NADPH → reduced glutathione → protect RBC from oxidative stress"
  )},
  { n:39, det: d(
    "หน้าที่ของ HCl ใน Ciprofloxacin Ophthalmic Solution",
    "HCl ใช้ปรับ pH ให้เหมาะสำหรับตา (6.5-7.4)",
    [c("A","Antioxidant","✗ ผิด — Antioxidant เช่น Na2EDTA, sodium metabisulfite ไม่ใช่ HCl"),
     c("B","Non-aqueous solvent","✗ ผิด — HCl เป็น aqueous acid ไม่ใช่ non-aqueous solvent"),
     c("C","Adjust pH","✓ ถูก — HCl ใช้ปรับ pH ของ ophthalmic solution ให้อยู่ใน acceptable range (6.5-7.4) ซึ่งเหมาะกับ tear pH ปกติ และลด ocular irritation"),
     c("D","Preservative","✗ ผิด — Preservative คือ BAK หรือ chlorhexidine ไม่ใช่ HCl"),
     c("E","Viscosity enhancer","✗ ผิด — Viscosity enhancer เช่น HPMC, carbomer ไม่ใช่ HCl")],
    "Ophthalmic pH: tear pH ≈ 7.4; acceptable 6.5-7.4; ใช้ HCl (acid) หรือ NaOH (base) adjust pH"
  )},
  { n:40, det: d(
    "USP Ofloxacin Tablets — Assay method",
    "Ofloxacin tablets ใช้ Liquid chromatography (HPLC) สำหรับ assay",
    [c("A","LA-HPLC NMT 110%","✗ ผิด — ไม่ใช่ terminology ที่ถูกต้อง"),
     c("B","Liquid chromatography (HPLC)","✓ ถูก — USP Ofloxacin Tablets: ASSAY ด้วย Liquid chromatography ได้ความจำเพาะและความแม่นยำสูง; Acceptance criteria 90.0-110.0%"),
     c("C","Dissolution ≥80% ใน 30 min (D)","✗ ผิด — นี่คือ Dissolution test ไม่ใช่ ASSAY method"),
     c("D","Uniformity ≤5%","✗ ผิด — Uniformity of dosage units ≤ 6.0% RSD ไม่ใช่ ASSAY"),
     c("E","Impurity ≤0.5%","✗ ผิด — นี่คือ Related substances test ไม่ใช่ ASSAY")],
    "USP Ofloxacin Tablets: ID=IR/HPLC, ASSAY=LC(HPLC), Dissolution≥80%Q/30min, Uniformity ≤6%RSD"
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
  console.log('\nDone Q1-40');
})();
