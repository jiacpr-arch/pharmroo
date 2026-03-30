const { createClient } = require('@libsql/client');
const crypto = require('crypto');
const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

const S = {
  skin:    '12b0b8c1-fe53-49d8-9c4b-e348eba85e36',
  infect:  '8bccedb2-3bdb-4f5c-9da9-f589b25672fd',
  immuno:  'ccb73060-b09f-4927-8ff8-53190db76d18',
  cardio:  'dce79912-01f6-4871-96df-94c6cfc853e7',
  msk:     '06991a85-412e-476e-89ff-32b0a7b92e6c',
  hemo:    'ace9965c-285b-4d4a-aaf2-5de9739cc09a',
  gi:      '91eedbf3-4301-4f40-ae3d-3cc6f64c4f8a',
  neuro:   'fb62e97d-dec1-4b47-b45f-617b2c03fb4d',
  psych:   'beee26b1-72c2-4c70-be73-24d7fa036f19',
  pulm:    'cc7ce595-2da4-4207-95a4-9a4bb606bbe0',
  pharma:  '0a7f8e61-3786-494c-9c54-b6edc17b03b6',
  clinic:  '41f903b7-5258-47fa-9ec3-44e756e705d1',
};

const q = (n,s,scenario,choices,ans,exp) => ({n,s,scenario,choices,ans,exp});

const questions = [
q(1,S.skin,'ผู้ป่วยชายอายุ 55 ปี มีโรค Dyslipidemia รับประทาน Simvastatin 40 mg ตรวจพบการติดเชื้อราที่เล็บเท้าและซอกนิ้วเท้า เชื้อที่พบน่าจะเป็น Trichophyton ซึ่งทำให้เกิดโรคชนิดใดต่อไปนี้',['Tinea capitis','Tinea manuum','Tinea cruris','Tinea pedis','Tinea corporis'],'d','Trichophyton rubrum = สาเหตุหลักของ Tinea pedis (athlete\'s foot) ซึ่งพบที่ซอกนิ้วเท้าและฝ่าเท้า'),

q(2,S.skin,'จากกรณีผู้ป่วยข้างต้น ยาใดต่อไปนี้เหมาะสมที่สุดในการรักษา Tinea pedis แบบผิวหนัง (ไม่ใช่เล็บ)',['Ketoconazole cream','Itraconazole capsule','Mupirocin cream','Dexamethasone cream','Miconazole tablets'],'a','Tinea pedis ที่ผิวหนัง → Topical antifungal เป็น first-line: Ketoconazole 2% cream ทา 2-4 สัปดาห์ หากเป็น onychomycosis จึงใช้ oral Itraconazole'),

q(3,S.skin,'ผลข้างเคียงสำคัญที่ต้องระวังเป็นพิเศษเมื่อใช้ Azole antifungal (Ketoconazole, Itraconazole) คือข้อใด',['Agranulocytosis','Kidney Injury','Hepatotoxicity','Nephrotoxicity','Cardiotoxicity'],'c','Azole antifungals ทำให้เกิด Hepatotoxicity — Ketoconazole ถูกถอนออกจากตลาดหลายประเทศเพราะ liver toxicity รุนแรง ต้อง monitor LFT'),

q(4,S.skin,'จากสูตรตำรับ Ketoconazole nail lacquer: Ketoconazole 100mg, Eudragit RL100 400mg, PG 1ml, Glyceryl triacetate 2.5ml, Isopropyl alcohol qs 10ml สารใดทำหน้าที่เป็น Film-former',['PEG 400','PG (Propylene glycol)','Eudragit RL 100','Glyceryl triacetate','Isopropyl alcohol'],'c','Eudragit RL 100 (polymethacrylic acid copolymer) = Film-forming polymer ทำให้ยาเกาะติดผิวเล็บ; Glyceryl triacetate = Plasticizer; IPA = Solvent'),

q(5,S.skin,'ใน Ketoconazole nail lacquer สูตรเดิม Glyceryl triacetate (Triacetin) ทำหน้าที่อะไร',['Antioxidant','Buffer','Preservative','Opacifier','Plasticizer'],'e','Glyceryl triacetate (Triacetin) = Plasticizer เพิ่มความยืดหยุ่นของ Eudragit film ไม่ให้แตกหรือลอก'),

q(6,S.skin,'สารใดต่อไปนี้ทำหน้าที่เป็น Preservative ในสูตรตำรับ ophthalmic solution',['Antioxidant','Benzalkonium chloride','Eudragit RL 100','PEG 400','Isopropyl alcohol'],'b','Benzalkonium chloride (BAK) = Preservative ที่ใช้บ่อยที่สุดใน ophthalmic solutions (0.01-0.02%)'),

q(7,S.infect,'ข้อใดต่อไปนี้กล่าว "ไม่ถูกต้อง" เกี่ยวกับการจัดการโรคปอดอักเสบตามคะแนน CURB-65',['CURB-65 = 0 → รักษาที่บ้านได้','CURB-65 = 1 → ผู้ป่วยนอก (OPD)','CURB-65 ≥ 2 → รับไว้รักษาในโรงพยาบาล (non-ICU)','CURB-65 ≥ 2 → รับไว้รักษาใน ICU ทันที','CURB-65 ≥ 3 → พิจารณา ICU'],'d','CURB-65: 0-1=home/OPD, 2=hospital non-ICU, ≥3=consider ICU — CURB-65 ≥2 ไม่ได้แปลว่าต้อง ICU ทันที'),

q(8,S.infect,'ผู้ป่วย CAP (Community-Acquired Pneumonia) ที่ต้องรับไว้รักษาในโรงพยาบาล ควรได้รับ empirical therapy ใด',['Ceftriaxone + Azithromycin','Ceftriaxone + Doxycycline','Piperacillin/tazobactam + Azithromycin','Amoxicillin/Clavulanic acid','Ampicillin + Sulbactam'],'a','CAP ที่ต้องนอนโรงพยาบาล (non-ICU): Beta-lactam (Ceftriaxone) + Macrolide (Azithromycin) — IDSA/ATS guidelines'),

q(9,S.infect,'ข้อใดต่อไปนี้เป็น antipseudomonal antibiotic ที่เหมาะสำหรับ Pseudomonas aeruginosa',['Ampicillin','Amoxicillin/Clavulanic','Ceftazidime','Doxycycline','Azithromycin'],'c','Ceftazidime = 3rd gen cephalosporin ที่มีฤทธิ์ต้าน Pseudomonas — ทางเลือกอื่น: Cefepime, Pip/tazo, Meropenem, Ciprofloxacin'),

q(10,S.infect,'Ceftriaxone sodium ไม่ควรผสมกับสารละลายใดต่อไปนี้',['D5W','0.9% NaCl','0.45% NaCl','สารละลายที่มี Calcium (Ringer\'s Lactate)','D10W'],'d','Ceftriaxone + Calcium → ตกตะกอน Ceftriaxone-calcium precipitate — ห้ามใช้ร่วมกับ Ringer\'s Lactate, Hartmann\'s (fatal ใน newborn)'),

q(11,S.infect,'RCT เปรียบเทียบ Amoxicillin/Clavulanate กับ Cefixime ใน CAP พบ RR = 1.7 และ 95% CI: 1.3-2.45 ข้อใดแปลผลได้ถูกต้อง',['Amoxicillin/Clavulanate ดีกว่า Cefixime อย่างมีนัยสำคัญ','Amoxicillin/Clavulanate ดีกว่าแต่ไม่มีนัยสำคัญ','ไม่แตกต่างกัน','Cefixime ดีกว่าอย่างมีนัยสำคัญ','ยังสรุปไม่ได้'],'a','RR = 1.7 และ 95% CI ไม่ครอบ 1.0 (1.3-2.45) → แตกต่างอย่างมีนัยสำคัญ (p < 0.05)'),

q(12,S.infect,'จากการทดลอง: Placebo เกิด 40 เหตุการณ์จาก 200 คน, Dapagliflozin เกิด 20 เหตุการณ์จาก 200 คน ค่า NNT คือเท่าใด',['5','10','13','20','25'],'b','ARR = 40/200 − 20/200 = 0.20 − 0.10 = 0.10 (10%)\nNNT = 1/ARR = 1/0.10 = 10'),

q(13,S.infect,'ผู้ป่วย COPD ที่ได้รับ Amoxicillin/Clavulanic acid 500 mg ทุก 8 ชั่วโมง นาน 3,000 mg/วัน ซึ่งสูงกว่าขนาดปกติ เหตุผลที่ถูกต้องคือ',['เพื่อเพิ่ม absorption','เพื่อเอาชนะ MIC สูงของเชื้อดื้อยา','เพื่อลด side effects','เป็นขนาดปกติสำหรับ COPD exacerbation','ลด protein binding'],'b','Beta-lactam ออกฤทธิ์แบบ time-dependent — การเพิ่มขนาดยาเพื่อเอาชนะ MIC ที่สูงของเชื้อดื้อยา เช่น H. influenzae, M. catarrhalis ใน COPD'),

q(14,S.immuno,'ผู้ป่วย SLE ที่ต้องการเริ่มใช้ Hydroxychloroquine (HCQ) ควรตรวจอะไรเป็น baseline ก่อนเริ่มยา',['Serum creatinine','eGFR','CBC','Vision (Ophthalmologic exam)','การทดสอบการได้ยิน'],'d','HCQ สะสมในจอตา (retina) ทำให้เกิด retinopathy ถาวร — ต้อง ophthalmologic exam baseline และทุกปีหลังใช้ 5 ปี (ACR 2016 guidelines)'),

q(15,S.immuno,'ข้อใดเป็น absolute contraindication ของ Hydroxychloroquine',['ตั้งครรภ์','ไตวาย','เบาหวาน','Retinal/Macular disease ที่มีอยู่เดิม','ความดันโลหิตสูง'],'d','HCQ มี retinal toxicity — absolute contraindicated ใน pre-existing retinal/macular disease; HCQ ปลอดภัยในการตั้งครรภ์ (ไม่ใช่ CI)'),

q(16,S.immuno,'Hydroxychloroquine ในผู้ป่วย SLE ใช้เป็นอะไร',['Rescue therapy เฉพาะตอน flare','Background/maintenance therapy ใน SLE ทุก severity','ใช้เฉพาะใน severe SLE','ใช้แทน corticosteroid','ใช้เฉพาะใน lupus nephritis'],'b','HCQ = cornerstone therapy ใน SLE — ใช้ต่อเนื่องในทุก severity เพื่อลด disease activity, ป้องกัน flare และลด mortality'),

q(17,S.immuno,'ข้อใดถูกต้องเกี่ยวกับการ monitoring ระหว่างใช้ Hydroxychloroquine',['ตรวจ Serum creatinine ทุก 3 เดือน','ตรวจ eGFR ทุก 6 เดือน','CBC ทุกเดือน','Vision field test ทุกปีหลังใช้ยา 5 ปี','ไม่ต้อง monitor ใดๆ'],'d','ACR 2016: ophthalmologic monitoring ปีละ 1 ครั้งหลังใช้ยา 5 ปี (หรือก่อนหน้าถ้า renal/hepatic disease, high cumulative dose, อายุ ≥ 60 ปี)'),

q(18,S.immuno,'ข้อใดกล่าว "ไม่ถูกต้อง" เกี่ยวกับการใช้ Hydroxychloroquine ใน SLE',['ใช้ร่วมกับ Methotrexate ได้','ใช้ HCQ แทน Immunosuppressant ทุกชนิดได้','ใช้ได้อย่างปลอดภัยในหญิงตั้งครรภ์ที่เป็น SLE','ใช้ร่วมกับ Mycophenolate mofetil ได้','ลดความเสี่ยง thrombosis ใน APS'],'b','HCQ ไม่สามารถแทน immunosuppressant (MMF, Azathioprine, Cyclophosphamide) ได้ใน lupus nephritis class III/IV ที่ต้องใช้ immunosuppressant'),

q(19,S.immuno,'ยาใดต่อไปนี้เป็น classic cause ของ Drug-induced lupus (DIL)',['Enalapril','Hydralazine','Simvastatin','Amlodipine','Metformin'],'b','Drug-induced lupus: Hydralazine, Procainamide, Isoniazid = H-P-I classic triad; ยาอื่น: Minocycline, Anti-TNF agents'),

q(20,S.immuno,'ผู้ป่วย SLE ที่มี antiphospholipid antibody positive ควรใช้การคุมกำเนิดแบบใด',['Combined oral contraceptive (COC)','Progestin-only pill','ไม่ต้องคุมกำเนิด','ฉีด DMPA','ใส่ห่วงอนามัยชนิดฮอร์โมน'],'b','SLE + APS → thrombosis risk สูง → ห้ามใช้ COC (estrogen เพิ่ม clot risk) — ใช้ Progestin-only, Copper IUD หรือ barrier method แทน'),

q(21,S.cardio,'ผู้ป่วย HF ที่มี LVEF 30% จัดอยู่ใน category ใด',['Acute heart failure','Acute decompensated heart failure','HFrEF (LVEF < 40%)','HFmrEF (LVEF 40-49%)','HFpEF (LVEF ≥ 50%)'],'c','HFrEF: LVEF < 40%; HFmrEF: LVEF 40-49%; HFpEF: LVEF ≥ 50% — LVEF 30% = HFrEF'),

q(22,S.cardio,'Sacubitril/Valsartan (ARNI) ยับยั้ง Receptor ใดเป็นหลัก',['Block Angiotensin II receptor','Block Neprilysin (NEP)','Block Angiotensin converting enzyme','Block Beta-adrenergic receptor','Block Aldosterone receptor'],'b','Sacubitril = Neprilysin inhibitor → เพิ่ม natriuretic peptides → vasodilation + natriuresis; Valsartan = ARB — PARADIGM-HF trial'),

q(23,S.cardio,'ผู้ป่วย HFrEF รับประทาน Enalapril อยู่ การเปลี่ยนเป็น Sacubitril/Valsartan ต้องทำอย่างไร',['เปลี่ยนทันทีได้เลย','หยุด ACE inhibitor อย่างน้อย 36 ชั่วโมงก่อนเริ่ม ARNI','ให้ร่วมกันได้','เปลี่ยนเป็น Losartan ก่อน','ไม่ต้องหยุด'],'b','ต้องหยุด ACE inhibitor ≥ 36 ชั่วโมงก่อนเริ่ม ARNI เพื่อป้องกัน angioedema (ทั้งคู่เพิ่ม bradykinin)'),

q(24,S.cardio,'Beta-blocker ใดได้รับการรับรองสำหรับใช้ใน HFrEF',['Atenolol','Bisoprolol','Nebivolol','Propranolol','Nadolol'],'b','Beta-blockers ที่ approved ใน HFrEF (mortality benefit): Carvedilol, Bisoprolol, Metoprolol succinate — ต้องเริ่มขนาดต่ำแล้วค่อย titrate'),

q(25,S.cardio,'Placebo เกิด 40/200 คน, Dapagliflozin เกิด 20/200 คน ค่า ARR และ NNT คือเท่าใด',['ARR 5%, NNT 5','ARR 10%, NNT 10','ARR 13%, NNT 13','ARR 20%, NNT 20','ARR 25%, NNT 25'],'b','ARR = 40/200 − 20/200 = 0.10 = 10%\nNNT = 1/0.10 = 10'),

q(26,S.cardio,'การผลิต Digoxin tablet 0.25 mg ควรใช้กระบวนการใด เนื่องจากขนาดยาน้อยและไวต่อความร้อน/ชื้น',['Wet granulation','Dry granulation (Slugging)','Direct compression','Hot melt extrusion','Spray drying'],'b','Digoxin ขนาดน้อย (0.25 mg) ไวต่อความร้อนชื้น — Dry granulation (slugging) หลีกเลี่ยงได้'),

q(27,S.cardio,'ผู้ป่วย HFrEF มี fluid overload ควรเพิ่มยาใดก่อน',['เพิ่ม Furosemide (loop diuretic)','เพิ่ม Spironolactone','เพิ่ม Thiazide','เพิ่ม Digoxin','เพิ่ม Amlodipine'],'a','Loop diuretic (Furosemide) = first-line สำหรับ fluid overload ใน HF — ลด preload, บรรเทา dyspnea และ edema'),

q(28,S.msk,'T-score เท่าใดที่วินิจฉัย Osteoporosis ตาม WHO criteria',['T-score ≤ −1.0','T-score ≤ −2.5','T-score ≤ −3.0','T-score ≤ −1.5','T-score ≤ −2.0'],'b','WHO: T-score ≥ −1.0 = Normal; −1.0 ถึง −2.5 = Osteopenia; ≤ −2.5 = Osteoporosis'),

q(29,S.msk,'คำแนะนำที่ถูกต้องสำหรับการรับประทาน Alendronate คือข้อใด',['รับประทานตอนเช้ากับน้ำเปล่า 200 mL ก่อนอาหาร 30 นาที นั่งตัวตรง ≥ 30 นาที','รับประทานพร้อมอาหารเพื่อลด GI irritation','ดื่มนมพร้อมยา','รับประทานก่อนนอน','รับประทานได้ตลอดเวลา'],'a','Bisphosphonate: น้ำเปล่า 200 mL, ก่อนอาหาร 30 นาที, อย่านอนราบ ≥ 30 นาทีหลังกิน — ป้องกัน esophageal ulcer'),

q(30,S.msk,'ผู้ป่วยหญิงอายุ 70 ปี T-score −2.9 ที่ lumbar spine ควรได้รับยา first-line ใด',['Calcium + Vitamin D เท่านั้น','Calcitonin','Alendronate','Estrogen','Teriparatide'],'c','Alendronate (bisphosphonate) = first-line pharmacotherapy สำหรับ osteoporosis ลด vertebral, hip fracture risk ได้ดีที่สุด'),

q(31,S.msk,'ผลข้างเคียงใดต่อไปนี้ "ไม่ใช่" ADR ของ Alendronate',['Esophageal ulcer','Bradykinesia','Osteonecrosis of the jaw (ONJ)','Atrial fibrillation','Atypical femur fracture'],'b','Bradykinesia = อาการ Parkinson\'s disease ไม่ใช่ ADR ของ Bisphosphonate — ADR จริง: GI, ONJ, AFib, atypical fracture, hypocalcemia'),

q(32,S.pharma,'ข้อใดต่อไปนี้เป็น excipient ที่เหมาะที่สุดสำหรับ Direct compression',['Starch','PVP (Povidone)','HPMC','Lactose monohydrate ทั่วไป','Microcrystalline cellulose (MCC)'],'e','MCC (Avicel) = ideal สำหรับ direct compression เพราะ compressibility + flowability ดี เป็นทั้ง diluent และ binder'),

q(33,S.pharma,'Direct compression ต้องใช้ diluent ชนิดใด',['Starch','Colloidal silicon dioxide','Spray dried lactose','Talc','Regular lactose monohydrate'],'c','Spray dried lactose มี flowability + compressibility ดีเหมาะสำหรับ direct compression ต่างจาก regular lactose ที่ต้องทำ granulation'),

q(34,S.pharma,'Superdisintegrant ในสูตรตำรับ tablet คือสารใด',['PVP','Lactose','Colloidal silicon dioxide','Sodium starch glycolate','Magnesium stearate'],'d','Sodium starch glycolate (Explotab) = superdisintegrant พองตัวเร็ว — ชนิดอื่น: Croscarmellose sodium, Crospovidone (XL)'),

q(35,S.hemo,'ผู้ป่วย G6PD deficiency มาพบแพทย์ด้วยอาการ jaundice ยาใดน่าจะเป็นสาเหตุ',['Amoxicillin','Chlorpheniramine','Paracetamol','Ofloxacin','HCTZ'],'d','Ofloxacin (fluoroquinolone) ทำให้เกิด hemolysis ใน G6PD — ยาที่ต้องระวัง: Primaquine, Dapsone, Nitrofurantoin, Quinolones, Sulfonamides'),

q(36,S.hemo,'ผู้ป่วย G6PD ได้รับ Chlorpheniramine + Paracetamol น่าจะเกิด hemolytic anemia เมื่อใด',['ทันทีหลังรับยา','1 ชั่วโมงหลังรับยา','1 วันหลังรับยา','3-7 วันหลังเริ่มยา','หลังหยุดยา 2 สัปดาห์'],'d','Hemolytic anemia ใน G6PD มักเกิด 1-3 วันหลังเริ่มยา, peak ~7-10 วัน, recover หลังหยุดยา'),

q(37,S.hemo,'วันที่ 7 หยุดยา Ofloxacin ควร recheck CBC เมื่อใด',['20 ชั่วโมงหลังหยุดยา','2 วันหลังหยุดยา','1 วันหลังหยุด Ofloxacin','5 วันหลังหยุดยา','3 วันหลังหยุดยา'],'c','หลังหยุดยาที่ก่อ hemolysis ควร recheck CBC เพื่อดูการฟื้นตัว (reticulocytosis จะเพิ่มขึ้นก่อน)'),

q(38,S.hemo,'กลไกของ hemolytic anemia ใน G6PD deficiency คืออะไร',['Oxidative hemolysis','Immune-mediated hemolysis','Mechanical hemolysis','Osmotic hemolysis','Autoimmune hemolysis'],'a','G6PD ขาด → NADPH ลด → ไม่สามารถ reduce glutathione → oxidative damage → Heinz bodies → hemolysis'),

q(39,S.pharma,'Hydrochloric acid ใน Ciprofloxacin Ophthalmic solution ทำหน้าที่อะไร',['Antioxidant','Non-aqueous solvent','Adjust pH','Preservative','Viscosity enhancer'],'c','HCl ใช้ปรับ pH ของ ophthalmic solution ให้อยู่ในช่วง 6.5-7.4 ที่เหมาะสมสำหรับตา'),

q(40,S.pharma,'USP Ofloxacin Tablets กำหนด ASSAY ด้วยวิธีใด',['LA-HPLC NMT 110%','Liquid chromatography (HPLC)','Dissolution ≥80% ใน 30 min (D)','Uniformity ≤5%','Impurity ≤0.5%'],'b','USP Ofloxacin Tablets: ASSAY ด้วย Liquid chromatography (HPLC) — Dissolution ≥80% Q ใน 30 นาที'),

q(41,S.pharma,'โครงสร้างสารประกอบที่แสดงในโจทย์เป็น Alkaloid ประเภทใด',['Isoquinoline alkaloid','Indole alkaloid','Tropane alkaloid','Purine alkaloid','Steroidal alkaloid'],'c','Tropane alkaloid มี bicyclic ring: N-methyl piperidine fused with cyclopentane — ตัวอย่าง: Atropine, Scopolamine, Cocaine'),

q(42,S.msk,'T-score ≤ −2.5 ร่วมกับ previous fragility fracture จัดเป็น osteoporosis ระดับใด',['Osteopenia','Very High Risk Osteoporosis','Normal','Severe osteoporosis คำนวณ FRAX','Mild osteoporosis'],'b','T-score ≤ −2.5 + prior fragility fracture หรือ multiple risk factors = very high risk — AACE: พิจารณา anabolic therapy (Teriparatide)'),

q(43,S.pharma,'การวิเคราะห์ Calcium carbonate โดย USP ใช้วิธี titration ใด',['Precipitation titration','Non-aqueous acid-base titration','Complexometric titration','Residual titration','Redox titration'],'c','Calcium carbonate → Complexometric titration (EDTA method) ใช้ Eriochrome black T หรือ Calcon เป็น indicator'),

q(44,S.pharma,'Pharmacokinetic ของ Alendronate ข้อใดถูกต้อง',['Bioavailability > 50%','Tmax ~1 ชั่วโมง','Half-life 2-3 ชั่วโมง','ดูดซึมดีพร้อมอาหาร','ขับทาง hepatic metabolism'],'b','Alendronate: bioavailability < 1%, Tmax ~1 ชั่วโมง, ขับทางไตในรูปยาไม่เปลี่ยนแปลง, ดูดซึมลดลงถ้ากินพร้อมอาหาร'),

q(45,S.pharma,'USP Calcium carbonate Acceptance criteria คือ',['97.0-103.0%','95.0-105.0%','98.5-101.5%','90.0-110.0%','99.0-101.0%'],'c','USP: Calcium carbonate ≥ 98.5% และ ≤ 101.5% calculated on dried basis'),

q(46,S.pharma,'Complexometric (EDTA) titration ของ Calcium carbonate ขั้นตอนที่ถูกต้องคือ',['ละลายใน NaOH','Titrate ด้วย HCl','ใช้ EDTA เป็น titrant กับ indicator Eriochrome black T','ใช้ KMnO₄ เป็น titrant','ละลายใน ethanol'],'c','CaCO₃ ละลายใน HCl เจือจาง, adjust pH 12-13 ด้วย NaOH, titrate ด้วย 0.05M EDTA กับ Calcon indicator'),

q(47,S.pharma,'Alendronate effervescent tablet ใช้กระบวนการ granulation แบบใด',['Wet granulation ด้วยน้ำ','Wet granulation ด้วย alcohol','Dry granulation','Hot melt extrusion','Spray drying'],'c','Citric acid + Sodium bicarbonate ทำปฏิกิริยากับน้ำทันที → ต้องใช้ dry granulation (roller compaction/slugging)'),

q(48,S.clinic,'SCr เพิ่มขึ้น 1 mg/dL ภายใน 48 ชั่วโมง Baseline SCr = 1.0 mg/dL ตาม KDIGO 2012 คือ AKI stage ใด',['AKI Stage 0','AKI Stage 1','AKI Stage 2','AKI Stage 3','Chronic Kidney Disease'],'b','KDIGO 2012 AKI Stage 1: SCr เพิ่ม ≥ 0.3 mg/dL ใน 48 ชั่วโมง หรือเพิ่ม ≥ 1.5× baseline ใน 7 วัน'),

q(49,S.clinic,'ผู้ป่วยที่มี AKI Stage 1 และรับ Enalapril อยู่ ควรทำอย่างไร',['หยุด Enalapril ชั่วคราว','เพิ่มขนาด Enalapril','เปลี่ยนเป็น Losartan','ไม่ต้องทำอะไร','เพิ่ม Furosemide'],'a','ACE inhibitor ลด GFR → ไม่เหมาะใน AKI ระยะเฉียบพลัน → หยุดชั่วคราวและ recheck renal function หลัง AKI resolve'),

q(50,S.pharma,'โครงสร้างสารประกอบในโจทย์มีลักษณะ N+ ที่มี 4 substituents คือ compound ประเภทใด',['Tertiary amine','Primary amine','Flavonoid','Quaternary ammonium','Tertiary alcohol'],'d','Quaternary ammonium: N+ มี 4 substituents — ประจุบวกถาวรไม่ขึ้นกับ pH — ตัวอย่าง: Benzalkonium chloride, Cetrimide'),

q(51,S.psych,'ผู้ป่วยได้รับยาผิดแต่ยาไม่ถึงผู้ป่วย ตาม NCC MERP จัดเป็น Category ใด',['Category A','Category B','Category C','Category D','Category E'],'b','NCC MERP Category B = ความผิดพลาดเกิดขึ้นแต่ไม่ถึงผู้ป่วย ไม่ก่อให้เกิดอันตราย'),

q(52,S.psych,'ยาใดเป็น first-line pharmacotherapy สำหรับการเลิกบุหรี่',['Nicotine gum','Varenicline','Bupropion','Cytisine','Nortriptyline'],'b','Varenicline = partial agonist ที่ nicotinic acetylcholine receptor ลด craving — meta-analysis: ดีกว่า bupropion และ NRT'),

q(53,S.psych,'ผู้ป่วยไม่ได้ตั้งใจเลิกบุหรี่ในอีก 6 เดือนข้างหน้า อยู่ใน Stage ใด ของ Transtheoretical Model',['Precontemplation','Contemplation','Preparation','Action','Maintenance'],'a','Precontemplation: ไม่มีความตั้งใจเปลี่ยนแปลงพฤติกรรมใน 6 เดือน; Contemplation: คิดจะเปลี่ยนใน 6 เดือน'),

q(54,S.pharma,'Nicotine transdermal patch ชั้น Backing layer ทำหน้าที่อะไร',['Reservoir system ของยา','Matrix system','ชั้นสัมผัสผิวหนัง','ชั้นปิดด้านนอก ป้องกันการสูญเสียยา','Release liner'],'d','Backing layer = ชั้นนอกสุด ทำจาก polymer/metal foil ป้องกันการสูญเสียยาด้านนอก กันน้ำ เป็นรูปทรงของ patch'),

q(55,S.pharma,'Nicotine transdermal patch ชนิด Matrix system ข้อใดถูกต้อง',['มี Reservoir ยาแยกต่างหาก','ยาผสมอยู่ใน polymer matrix โดยตรง','ควบคุมการปล่อยด้วย membrane แยก','ปล่อยยาเร็วกว่า reservoir system','ต้องการ rate-controlling membrane เสมอ'],'b','Matrix system: ยาผสมอยู่ใน polymer matrix โดยตรง → diffusion ออกจาก matrix ต่างจาก Reservoir system ที่มียาใน reservoir + membrane'),

q(56,S.gi,'ผู้ป่วยหญิงอายุ 55 ปี H. pylori positive โดย Urea breath test วิธีรักษาที่เหมาะสมที่สุดคือ',['Antacid + PPI','PPI monotherapy','PPI-based triple therapy (PPI + Amoxicillin + Clarithromycin)','High dose antibiotic เดี่ยว','H2RA + probiotic'],'c','H. pylori standard: PPI-based triple therapy 14 วัน = PPI + Amoxicillin 1g BD + Clarithromycin 500mg BD'),

q(57,S.gi,'Clarithromycin resistance ≥ 15% ในพื้นที่ ควรเปลี่ยน H. pylori regimen อย่างไร',['เปลี่ยน Clarithromycin เป็น Ampicillin','เปลี่ยนเป็น Amoxicillin เดี่ยว','ใช้ Bismuth quadruple therapy (PPI + Bismuth + Tetracycline + Metronidazole)','เพิ่มขนาด Clarithromycin','ไม่ต้องเปลี่ยน'],'c','Clarithromycin resistance สูง → ใช้ Bismuth quadruple หรือ Levofloxacin-based therapy แทน'),

q(58,S.neuro,'ผลข้างเคียงใดต่อไปนี้ "ไม่ใช่" ของ Phenobarbital',['Sedation/drowsiness','Hyperactivity ในเด็ก','Peripheral edema','Stevens-Johnson syndrome','Osteomalacia (ใช้ระยะยาว)'],'c','Peripheral edema ไม่ใช่ ADR ของ Phenobarbital — ADR จริง: sedation, cognitive impairment, hyperactivity (children), SJS, osteomalacia'),

q(59,S.neuro,'AED ใดทำให้น้ำหนักเพิ่มมากที่สุด',['Phenytoin','Valproic acid','Lamotrigine','Topiramate','Zonisamide'],'b','Valproic acid ทำให้น้ำหนักเพิ่มมากที่สุดใน AED — mechanism: เพิ่ม appetite, ยับยั้ง beta-oxidation; Topiramate/Zonisamide ทำให้น้ำหนักลด'),

q(60,S.neuro,'Carbamazepine ทำให้เกิด ADR ใดต่อไปนี้บ่อยที่สุดเมื่อใช้ระยะยาว',['Agranulocytosis','Hepatomegaly','Pancytopenia','Peripheral edema','Hyponatremia (SIADH)'],'e','Carbamazepine → SIADH → Hyponatremia พบได้บ่อย โดยเฉพาะในผู้สูงอายุ ต้อง monitor serum Na+'),

q(61,S.pharma,'Diazepam rectal suppository ที่ใช้ PEG molecular weight ต่ำ เป็น base ประเภทใด',['Oleaginous base','Water soluble base','Water removable base','Emulsion base','Absorption base'],'b','PEG (Polyethylene glycol) = water-soluble base ละลายน้ำได้ ไม่ต้องการ body heat — ใช้กับยาที่ไม่ชอบน้ำ'),

q(62,S.pharma,'Dissolution test สำหรับ Diazepam rectal suppository ใช้ Apparatus ใด',['Apparatus 1 (Basket)','Apparatus 2 (Paddle)','Apparatus 3 (Reciprocating cylinder)','Apparatus 4 (Flow-through cell)','Apparatus 5'],'c','Suppository dissolution: USP Apparatus 3 (Reciprocating cylinder) เหมาะสมที่สุด'),

q(63,S.gi,'ยาใดต่อไปนี้ไม่ควรใช้รักษา H. pylori เนื่องจากมีอัตราดื้อยาสูงถ้าใช้เดี่ยว',['Amoxicillin','Tetracycline','Metronidazole เดี่ยว','Bismuth','PPI'],'c','Metronidazole เดี่ยว = ดื้อยาสูง ไม่ควรใช้ monotherapy แต่ใช้ร่วมใน bismuth quadruple therapy ได้ (bismuth มี synergy)'),

q(64,S.gi,'ผู้ป่วยแพ้ Clarithromycin ควรใช้ H. pylori regimen ใด',['PPI + Amoxicillin + Clarithromycin','PPI + Amoxicillin + Metronidazole','PPI เดี่ยว','Amoxicillin + Doxycycline','ไม่รักษา'],'b','Clarithromycin allergy → ใช้ PPI + Amoxicillin + Metronidazole หรือ Bismuth quadruple therapy (PPI + Bismuth + Tetracycline + Metronidazole)'),

q(65,S.gi,'PPI ระยะยาวมีผลข้างเคียงใดที่ต้องระวัง',['Agranulocytosis','Hepatotoxicity','เพิ่มความเสี่ยง Clostridium difficile infection','Pneumonia','Hypercalcemia'],'c','Long-term PPI: เพิ่มความเสี่ยง C. difficile, Mg²⁺ deficiency, Vitamin B12 deficiency, Hip fracture, Community-acquired pneumonia'),

q(66,S.infect,'Cotrimoxazole (TMP-SMX) ใช้รักษาโรคใดใน HIV เป็นหลัก',['MAC infection','Pneumocystis jirovecii pneumonia (PCP) prophylaxis/treatment','CMV retinitis','Cryptococcal meningitis','Aspergillosis'],'b','Cotrimoxazole = drug of choice สำหรับ PCP (CD4 < 200 → prophylaxis) — ยังป้องกัน Toxoplasma ด้วย'),

q(67,S.hemo,'กลไกการออกฤทธิ์ของ Doxorubicin (Anthracycline) คือ',['ยับยั้ง purine base guanine','ยับยั้ง tyrosine kinase','ยับยั้ง pyrimidine analogue','ยับยั้ง Topoisomerase II','ยับยั้ง dihydrofolate reductase'],'d','Doxorubicin: intercalates DNA + inhibits Topoisomerase II → DNA double strand breaks; free radicals → cardiotoxicity'),

q(68,S.hemo,'AC regimen: Doxorubicin 60 mg/m² สำหรับผู้ป่วย BSA 1.4 m² ขนาด Doxorubicin ที่ได้รับ',['85 mg','120 mg','860 mg','1,200 mg','3,900 mg'],'a','Doxorubicin = 60 mg/m² × 1.4 m² = 84 mg ≈ 85 mg (rounded); Cyclophosphamide = 600 × 1.4 = 840 mg'),

q(69,S.hemo,'Antiemetic สำหรับ Highly Emetogenic Chemotherapy (HEC) ที่ถูกต้องคือ',['Progestin-only pill','Ondansetron + Aprepitant + Dexamethasone','Ondansetron + Dexamethasone เท่านั้น','Granisetron เดี่ยว','Dolasetron เดี่ยว'],'b','HEC triple antiemetic: 5HT3 antagonist + NK1 antagonist (Aprepitant) + Dexamethasone — NCCN guidelines'),

q(70,S.pulm,'ผู้ป่วย COPD ที่ใช้ Tiotropium Handihaler 18 mcg/วัน อยู่ใน GOLD stage ใด',['GOLD 1 (Mild)','GOLD 2 (Moderate)','GOLD 3 (Severe)','GOLD 4 (Very severe)','ไม่สามารถระบุได้'],'b','GOLD 2 (Moderate): FEV1 50-79% — LAMA (Tiotropium) เป็น first-line ใน GOLD B/E ที่มีอาการ'),

q(71,S.pulm,'ข้อใด "ไม่ถูกต้อง" เกี่ยวกับ LAMA (Tiotropium) ใน COPD',['บรรเทาอาการได้น้อยกว่า SABA ใน acute bronchospasm','ลด exacerbation ได้ดีกว่า LABA ในบางกรณี','ออกฤทธิ์ยาวนาน 24 ชั่วโมง','เป็น M3 muscarinic antagonist','ใช้เป็น maintenance therapy'],'a','LAMA เป็น maintenance therapy ไม่ใช่ rescue drug — ใน acute bronchospasm ใช้ SABA (ออกฤทธิ์เร็วกว่า)'),

q(72,S.pulm,'ผู้ป่วย COPD GOLD กลุ่ม B ยาใดเป็น first-line maintenance therapy',['LAMA หรือ LABA เดี่ยว','ICS/LABA combination','Triple therapy','SABA + SAMA','Theophylline'],'a','GOLD 2024 กลุ่ม B → เริ่มด้วย LAMA หรือ LABA เดี่ยว; ถ้า GOLD E (≥2 exacerbations) → เพิ่ม ICS'),

q(73,S.pulm,'ผลข้างเคียงใด "ไม่ควร" เกิดจาก anticholinergic mechanism ของ Tiotropium',['Dry mouth','Urinary retention','Constipation','Diabetes mellitus','Blurred vision'],'d','Anticholinergic ADR: dry mouth, urinary retention, constipation, blurred vision, tachycardia — Diabetes ไม่ใช่'),

q(74,S.pulm,'ผู้ป่วย COPD ใช้ Tiotropium แต่ยังมี exacerbation ≥2 ครั้ง/ปี ควรเพิ่มยาใด',['SABA เพิ่ม','เพิ่ม ICS/LABA (เป็น triple therapy)','เปลี่ยนเป็น Theophylline','หยุด LAMA เปลี่ยนเป็น LABA','ไม่ต้องเพิ่ม'],'b','COPD escalation: LAMA + ICS/LABA = triple therapy ลด exacerbation ในผู้ป่วย eosinophil สูง หรือ exacerbation บ่อย'),

q(75,S.pharma,'โครงสร้างเคมีที่แสดง เป็น Alkaloid ประเภทใด',['Isoquinoline alkaloid','Indole alkaloid','Tropane alkaloid','Purine alkaloid','Steroidal alkaloid'],'c','Tropane alkaloid มี bicyclic ring system — ตัวอย่าง: Atropine, Scopolamine, Hyoscyamine, Cocaine'),

q(76,S.neuro,'ยาใดต่อไปนี้เป็น Muscarinic receptor antagonist',['Atenolol','Prazosin','Amlodipine','Ipratropium / Tiotropium','Metformin'],'d','Tiotropium/Ipratropium = M3 muscarinic receptor antagonist → bronchodilation — ใช้ใน COPD และ asthma'),

q(77,S.infect,'ยาใดเป็น first-line สำหรับ Ascariasis (พยาธิไส้เดือน)',['Albendazole','Mebendazole','Niclosamide','Praziquantel','Ivermectin'],'a','Albendazole 400 mg single dose = first-line สำหรับ Ascariasis, hookworm, trichuris — Mebendazole ก็ใช้ได้'),

q(78,S.infect,'ยาใดใช้รักษา Taenia (พยาธิตัวตืด) ได้ผลดีที่สุด',['Albendazole','Praziquantel','Niclosamide','Mebendazole','Ivermectin'],'b','Praziquantel = drug of choice สำหรับ Cestode (Taenia) และ Trematode (Schistosoma, Clonorchis) ทุกชนิด'),

q(79,S.infect,'กลไกของ Albendazole ในการฆ่าพยาธิ',['ยับยั้ง acetylcholinesterase','กล้ามเนื้อพยาธิหดเกร็ง','ยับยั้ง beta-tubulin → microtubule disruption','เพิ่ม Cl- influx → hyperpolarization','ยับยั้ง dihydrofolate reductase'],'c','Benzimidazoles: ยับยั้ง beta-tubulin polymerization → ทำลาย microtubule → ยับยั้งการดูดซึม glucose ของพยาธิ → ตาย'),

q(80,S.pharma,'ข้อใดถูกต้องเกี่ยวกับ Ciprofloxacin ophthalmic solution',['ต้องเป็น sterile product','ไม่ต้อง isotonic','pH ไม่สำคัญ','ไม่ต้อง preservative','สามารถมี particulate matter ได้บ้าง'],'a','Ophthalmic preparation: ต้องเป็น sterile เสมอ, isotonic (~280-320 mOsm), pH 6.5-7.4, ปราศจาก particulate matter'),

q(81,S.infect,'Ciprofloxacin ophthalmic solution ใช้รักษาโรคตาชนิดใด',['Allergic conjunctivitis','Bacterial conjunctivitis','Viral conjunctivitis','Hordeolum (กุ้งยิง)','Trachoma'],'b','Ciprofloxacin ophthalmic = fluoroquinolone → bacterial conjunctivitis, bacterial keratitis (กระจกตาอักเสบจากเชื้อ)'),

q(82,S.pharma,'ข้อใดต่อไปนี้ "ไม่ใช่" คุณสมบัติที่ต้องการของ ophthalmic solution',['Sterility','Isotonicity','Appropriate pH','Viscosity enhancer จำเป็นในทุกสูตร','Preserved หรือ preservative-free'],'d','Ophthalmic solution ไม่จำเป็นต้องมี viscosity enhancer ทุกสูตร — มีเฉพาะสูตรที่ต้องการเพิ่ม contact time'),

q(83,S.pharma,'Ciprofloxacin ophthalmic solution ใช้ buffer ประเภทใด',['Phosphate','Borate','Citrate','Carbonate','Acetate'],'a','Phosphate buffer ใช้บ่อยที่สุดใน ophthalmic preparation — compatible กับ eye tissue, รักษา pH ช่วง 6-8'),

q(84,S.pharma,'USP Ciprofloxacin ophthalmic solution — test ใดต่อไปนี้ "ไม่ใช่" test ที่กำหนดสำหรับ solution',['ASSAY ด้วย Liquid chromatography','Identification','pH testing','Uniformity of dosage unit','Sterility testing'],'d','Uniformity of dosage unit ใช้กับ solid dosage form (tablet, capsule) ไม่ใช่ solution'),

q(85,S.pharma,'USP Ciprofloxacin Ophthalmic Solution กำหนด Relative Standard Deviation (RSD) ของ ASSAY ไม่เกินเท่าใด',['NMT 5% (inorganic impurities)','NMT 2%','NMT 10%','NMT 0.5%','NMT 15%'],'a','Standard deviation สำหรับ ophthalmic ASSAY: RSD NMT 5% (ตาม USP monograph)'),

q(86,S.pharma,'Acceptance criteria ของ ASSAY Ciprofloxacin Ophthalmic Solution ตาม USP คือ',['90.0-110.0%','95.0-105.0%','90.0-115.0%','98.0-102.0%','97.0-103.0%'],'c','USP Ciprofloxacin Ophthalmic Solution: 90.0-115.0% of labeled amount'),

q(87,S.infect,'Herpes labialis (cold sore) ส่วนใหญ่เกิดจากเชื้อใด',['Cytomegalovirus','Herpes simplex virus type 1 (HSV-1)','Varicella zoster virus','Herpes simplex virus type 2','Human Papilloma virus'],'b','HSV-1 = สาเหตุหลักของ herpes labialis; HSV-2 = genital herpes; VZV = chickenpox/shingles'),

q(88,S.infect,'กลไกการออกฤทธิ์ของ Acyclovir ต้านไวรัส Herpes คือ',['Protease inhibitor','DNA polymerase inhibitor แบบ competitive','DNA polymerase inhibitor (chain terminator)','Reverse transcriptase inhibitor','Neuraminidase inhibitor'],'c','Acyclovir → phosphorylated by viral TK → Acyclovir triphosphate → competitive inhibitor + chain terminator ของ viral DNA polymerase'),

q(89,S.infect,'ยาใดต่อไปนี้ต้องใช้ยาอื่นแทน Acyclovir เนื่องจาก Acyclovir มีประสิทธิภาพต่ำ',['Cytomegalovirus (CMV) infection','Varicella zoster','Herpes simplex','Epstein-Barr virus','Human herpesvirus 6'],'a','CMV ขาด thymidine kinase → ไม่สามารถ phosphorylate acyclovir → ต้องใช้ Ganciclovir/Valganciclovir แทน'),

q(90,S.infect,'ขนาดยา Acyclovir สำหรับรักษา Herpes simplex genitalis (first episode) คือ',['200 mg TID 5 วัน','400 mg TID นาน 7-10 วัน','800 mg BID','800 mg 5×/วัน','1,200 mg วันละ 1 ครั้ง'],'b','HSV genital first episode: Acyclovir 400 mg TID หรือ 200 mg 5×/วัน นาน 7-10 วัน'),

q(91,S.pharma,'Acyclovir 1,200 mg sustained release matrix tablet ใช้ชั้น membrane ประเภทใดควบคุมการปล่อยยา',['Semipermeable membrane','Prolonged release system','Controlled release matrix','Delayed release','Immediate release'],'a','OROS: semipermeable membrane ให้น้ำผ่านแต่ไม่ให้ยาผ่าน → osmotic pressure ขับยาออกทาง orifice ใน rate คงที่'),

q(92,S.pharma,'Powder: Bulk density = 0.28 g/mL, Tapped density = 1.02 g/mL ค่า Carr\'s Compressibility Index และระดับ flowability คือ',['5% (Excellent)','72.5% (Very poor → ต้องทำ granulation)','20% (Fair)','25.5% (Poor)','35% (Very poor)'],'b','Carr\'s Index = (1.02−0.28)/1.02 × 100 = 72.5% — Very poor flowability → ต้องทำ granulation ก่อน direct compression ไม่ได้'),

q(93,S.pharma,'Terbinafine cream 1% (o/w) ต้องการ HLB = 13 ใช้ Span 20 (HLB 8.6) + Tween 60 (HLB 14.9) อัตราส่วนใดถูกต้อง',['Span 5g + Tween 5g','Span 2g + Tween 8g','Span 6g + Tween 4g','Span 3g + Tween 7g','Span 3g + Tween 7g (HLB ≈ 13.0)'],'e','HLB = (3×8.6 + 7×14.9)/10 = (25.8+104.3)/10 = 13.01 ≈ 13 ✓'),

q(94,S.pharma,'White petrolatum ในสูตรตำรับ cream ทำหน้าที่อะไร',['Emulsifier','Emollient (occlusive)','Preservative','Humectant','Surfactant'],'b','White petrolatum (Vaseline) = occlusive emollient/moisture barrier — Span/Tween = emulsifiers, PG = humectant'),

q(95,S.pharma,'ใน Terbinafine cream สารใดเป็น emollient',['Span 20','Tween 60','Propylene glycol','White petrolatum','Sodium lauryl sulfate'],'d','White petrolatum = emollient ให้ความชุ่มชื้น — Span/Tween = emulsifiers, PG = humectant/solvent'),

q(96,S.pharma,'เหตุใด Alendronate effervescent tablet จึงต้องใช้ dry granulation',['เพื่อเพิ่ม binding','เพราะ water sensitive เหมือนกัน','เพราะง่ายที่สุด','Alendronate + effervescent ไวต่อความชื้น → ต้องหลีกเลี่ยงน้ำ','เพื่อลด particle size'],'d','Citric acid + Sodium bicarbonate ทำปฏิกิริยากับน้ำทันที → ต้องผลิตในสภาพ dry (dry granulation/roller compaction)'),

q(97,S.pharma,'ใน tablet สูตร (MCC, Mg stearate, Lactose, PVP, Colloidal silicon dioxide, Sodium starch glycolate) PVP ทำหน้าที่อะไร',['Disintegrant','Binder','Lubricant','Glidant','Diluent'],'b','PVP (Povidone) = Binder ใน wet granulation ยึดอนุภาค — MCC/Lactose = Diluent, Mg stearate = Lubricant, Na starch glycolate = Disintegrant'),

q(98,S.pharma,'สารใดช่วยลด sedimentation rate ใน suspension โดยเพิ่ม viscosity ของ medium',['Simethicone','Glycerin','Colloidal silicon dioxide','Sorbitol','Methyl cellulose'],'e','Methyl cellulose (HPMC, Carbomer, Xanthan gum) = viscosity enhancer ลด sedimentation rate ตาม Stokes\' Law'),

q(99,S.pharma,'Glycerin ทำหน้าที่อะไรใน suspension เป็นหลัก',['Humectant','Flocculating agent','Preservative','Wetting agent','Sweetener'],'a','Glycerin = Humectant ดึงน้ำ ป้องกันผลิตภัณฑ์แห้ง — ยังใช้เป็น sweetener และ vehicle ในบางสูตร'),

q(100,S.pharma,'ตาม Stokes\' Law ปัจจัยใด "เพิ่ม" sedimentation rate',['เพิ่ม viscosity ของ medium','ลด particle size','เพิ่มผลต่างความหนาแน่น (ρ_p − ρ_m)','เพิ่ม temperature','ลด particle density'],'c','Stokes: v = 2r²(ρ_p−ρ_m)g/9η → เพิ่ม (ρ_p−ρ_m) = เพิ่ม rate; เพิ่ม viscosity = ลด rate; ลด r = ลด rate มาก'),

q(101,S.clinic,'วิธีการให้ Potassium chloride ข้อใด "ไม่ปลอดภัย"',['เพิ่ม Furosemide','เพิ่ม Spironolactone','ผสม KCl ใน NSS drip ช้าๆ','KCl IV bolus โดยตรง ไม่เจือจาง','KCl tablet รับประทาน'],'d','IV KCl bolus = ห้ามเด็ดขาด → Cardiac arrest (ventricular fibrillation) — ต้องเจือจางและให้ไม่เกิน 10-20 mEq/hr'),

q(102,S.clinic,'วิธีการให้ potassium replacement ใน hypokalemia รุนแรงที่ถูกต้อง',['Dipotassium phosphate IV bolus','KCl ผสม D5W ให้ใน 30 นาที','KCl ผสม NSS 0.9% ให้ ≤ 20 mEq/hr พร้อม cardiac monitoring','KCl 40 mEq IV bolus','KCl elixir รับประทาน'],'c','KCl IV: เจือจางใน NSS (ไม่ใช่ D5W เพราะ insulin อาจดัน K+ เข้าเซลล์) ≤ 20 mEq/hr พร้อม cardiac monitor'),

q(103,S.clinic,'อัตราการให้ KCl ทาง IV ที่ปลอดภัยสูงสุดในผู้ใหญ่ทั่วไปคือ',['5 mEq/hr','10-20 mEq/hr','40 mEq/hr เสมอ','80 mEq/hr','ไม่มีขีดจำกัด'],'b','Maximum KCl IV rate = 10-20 mEq/hr (peripheral) ในกรณีฉุกเฉิน max 40 mEq/hr ทาง central line + cardiac monitoring'),

q(104,S.clinic,'ผลข้างเคียงหลักของ Dipotassium phosphate IV มากเกินขนาดคือ',['Hypokalemia','Hypernatremia','Hyperkalemia และ Hyperphosphatemia','Hypocalcemia เท่านั้น','Metabolic alkalosis'],'c','Dipotassium phosphate: เพิ่ม K+ และ PO₄³⁻ → Hyperkalemia + Hyperphosphatemia (phosphate สูง → hypocalcemia ตามมา)'),

q(105,S.cardio,'ผู้ป่วยใช้ Losartan ร่วมกับ ACE inhibitor ความเสี่ยงที่ต้องระวังมากที่สุดคือ',['Hyperkalemia','Hypokalemia','Hypernatremia','Hyponatremia','Hypocalcemia'],'a','Double RAAS blockade (ARB + ACEi): เพิ่ม hyperkalemia, hypotension, AKI อย่างมีนัยสำคัญ — ONTARGET trial'),

q(106,S.clinic,'Vitamin E ร่วมกับ Simvastatin อาจมีปฏิสัมพันธ์อย่างไร',['ลด statin absorption','เพิ่ม statin efficacy','Antioxidant อาจลด statin efficacy บางส่วน','ไม่มีปฏิสัมพันธ์','เพิ่ม hepatotoxicity'],'c','Theoretical: antioxidant (Vit E) อาจ interfere กับ oxidative stress pathway ที่ statin ออกฤทธิ์ — หลักฐานยังไม่ชัดเจน'),

q(107,S.clinic,'Vitamin E ใน statin capsule ทำหน้าที่อะไรในสูตรตำรับ',['Active ingredient','Antioxidant (กันยาเสื่อมจาก oxidation)','Lubricant','Binder','Disintegrant'],'b','Vitamin E (dl-alpha-tocopherol acetate) = antioxidant ในสูตรตำรับ capsule ป้องกัน statin จากการ oxidize'),

q(108,S.pharma,'Epinephrine 1 mg ผสม NSS รวม 10 mL ได้ความเข้มข้น',['0.01 mg/mL','0.1 mg/mL (1:10,000)','0.09 mg/mL','1 mg/mL','0.001 mg/mL'],'b','Epi 1 mg ใน 10 mL = 0.1 mg/mL = 1:10,000 — ใช้ใน cardiac arrest (IV/IO) และ severe bradycardia'),

q(109,S.pharma,'Epinephrine HCl solution มีคุณสมบัติใด',['เสถียรใน alkaline pH','เก็บอุณหภูมิห้องได้นาน','ต้องป้องกันแสง เพราะ oxidize เป็น adrenochrome (สีน้ำตาล)','pH 7-9','ผสมกับ NaHCO₃ ได้'],'c','Epinephrine ไวต่อ oxidation และแสง → เก็บในขวดสีชา, pH 2-5 (acidic เพื่อความเสถียร), ห้ามผสมกับ NaHCO₃'),

q(110,S.pharma,'NaCl 2.5% จัดเป็น solution ประเภทใด',['Hypertonic','Isotonic','Hypotonic','Isoosmotic','Non-electrolyte solution'],'a','NaCl isotonic = 0.9% — NaCl 2.5% > 0.9% = Hypertonic → ใช้รักษา severe hyponatremia หรือ cerebral edema'),

q(111,S.pharma,'Sodium chloride equivalent (E-value) ใช้ประโยชน์ในการคำนวณอะไร',['Tonicity adjustment ของ ophthalmic/parenteral solution','Drug dosage calculation','pH adjustment','Solubility prediction','Stability testing'],'a','E-value = amount of NaCl equivalent ใน tonicity ต่อ 1 g drug → คำนวณปริมาณ NaCl เพิ่ม/ลดเพื่อทำ isotonic solution'),

q(112,S.clinic,'IV infusion 500 mL ใน 4 ชั่วโมง infusion set 20 drops/mL อัตราหยดคือ',['8 drops/min','10 drops/min','42 drops/min','125 drops/min','20 drops/min'],'c','Rate = 500 mL × 20 drops/mL ÷ 240 min = 10,000/240 = 41.7 ≈ 42 drops/min'),

q(113,S.clinic,'Adrenaline infusion 0.1 mcg/kg/min น้ำหนัก 70 kg ผสม 1 mg ใน NSS 50 mL อัตรา pump คือ',['8 mL/hr','21 mL/hr','0.42 mL/hr','4.2 mL/hr','42 mL/hr'],'b','Dose = 0.1×70 = 7 mcg/min = 420 mcg/hr; Conc = 1,000/50 = 20 mcg/mL; Rate = 420/20 = 21 mL/hr'),

q(114,S.pharma,'Dissolution S1 (n=6): Q=80%, ผล: 75,78,82,80,79,77% ผลการทดสอบเป็นอย่างไร',['ผ่าน S1','ผ่าน S2','ไม่ผ่าน S1 → ต้องทดสอบ S2','Fail ทุกขั้นตอน','ผ่านระดับ 2'],'c','Mean = 78.5% < Q (80%) → ไม่ผ่าน S1 → ต้องทำ S2 (อีก 6 เม็ด รวม 12 เม็ด)'),

q(115,S.infect,'RR = 1.3, 95% CI (0.85-1.17) ข้อสรุปที่ถูกต้อง',['Amoxicillin/Clavulanate ดีกว่า Cefixime','ไม่มีความแตกต่างอย่างมีนัยสำคัญ (95% CI ครอบ 1.0)','Cefixime ดีกว่า','ยังสรุปไม่ได้','Amoxicillin/Clavulanate แย่กว่า'],'b','95% CI (0.85-1.17) ครอบค่า 1.0 → ไม่มีความแตกต่าง significant (p > 0.05)'),

q(116,S.clinic,'ต้องการทดสอบว่า adherence (ดี/ไม่ดี) แตกต่างกันระหว่าง 2 กลุ่ม ควรใช้ test ใด',['Chi-square test','Logistic regression','Pearson correlation','ANOVA','Paired t-test'],'a','ข้อมูล categorical 2×2 (adherence ดี/ไม่ดี × กลุ่ม) → Chi-square test เหมาะที่สุด'),

q(117,S.clinic,'ต้องการหาปัจจัยทำนาย adherence (binary: ดี/ไม่ดี) ควรใช้ test ใด',['Chi-square test','Logistic regression','Pearson correlation','ANOVA','Paired t-test'],'b','Binary outcome + multiple predictors → Multiple logistic regression — ให้ Odds Ratio ของแต่ละปัจจัย'),

q(118,S.clinic,'ABC inventory analysis: รายการยาที่มูลค่าสูง ~80% ของมูลค่าทั้งหมด จัดเป็น class ใด',['Class A','Class B','Class C','Class D','Class E'],'a','ABC: A = 20% ของรายการ → 80% มูลค่า; B = 30% รายการ → 15%; C = 50% รายการ → 5% — Class A ควบคุมเข้มงวดที่สุด'),

q(119,S.hemo,'Mycophenolate mofetil (MMF) มีกลไกการออกฤทธิ์อย่างไร',['ยับยั้ง purine base guanine ใช้ adenine','ยับยั้ง tyrosine kinase','ยับยั้ง pyrimidine analogue','ยับยั้ง IMPDH → ลด de novo guanosine synthesis','ยับยั้ง calcineurin'],'d','MMF → Mycophenolic acid → ยับยั้ง IMPDH → ลด guanosine → selective antiproliferative บน T และ B lymphocytes'),

q(120,S.pharma,'ใน direct compression การใช้ Magnesium stearate มากเกินไปจะส่งผลอย่างไร',['เพิ่ม hardness','ไม่มีผล','เพิ่ม dissolution rate','ลด dissolution rate (hydrophobic coating บน particle)','เพิ่ม disintegration time'],'d','Mg stearate hydrophobic → มากเกินหรือ mix นานเกิน → coat บน particle → ลด wettability → ลด dissolution rate'),
];

async function insertAll() {
  let count = 0;
  for (const q of questions) {
    const id = crypto.randomUUID();
    const choices = JSON.stringify(q.choices);
    await client.execute({
      sql: `INSERT INTO mcq_questions 
            (id, subject_id, exam_type, exam_source, exam_day, question_number,
             scenario, choices, correct_answer, explanation, difficulty, status, created_at) 
            VALUES (?, ?, 'PLE-CC1', 'Pharmacyguru', 1, ?, ?, ?, ?, ?, 'medium', 'active', datetime('now'))`,
      args: [id, q.s, q.n, q.scenario, choices, q.ans, q.exp]
    });
    count++;
    if (count % 20 === 0) process.stdout.write(`${count}/120 `);
  }
  console.log('');

  // Update question counts
  const sids = [...new Set(questions.map(q => q.s))];
  for (const sid of sids) {
    const cnt = questions.filter(q => q.s === sid).length;
    await client.execute({
      sql: 'UPDATE mcq_subjects SET question_count = question_count + ? WHERE id = ?',
      args: [cnt, sid]
    });
  }

  const r = await client.execute('SELECT COUNT(*) as total FROM mcq_questions');
  console.log('✓ Done! Total questions in DB:', r.rows[0].total);

  const bySub = await client.execute(`
    SELECT s.name_th, COUNT(q.id) as cnt 
    FROM mcq_subjects s LEFT JOIN mcq_questions q ON q.subject_id = s.id 
    GROUP BY s.id ORDER BY cnt DESC`);
  bySub.rows.forEach(r => console.log(' ', r.cnt, r.name_th));
}

insertAll().catch(e => { console.error(e); process.exit(1); });
