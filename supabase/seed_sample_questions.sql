-- Sample pharmacy questions for PharmRoo (from PLE-CC1 analysis)
-- These are example questions for testing the system

-- Get subject IDs (use subquery)
WITH subjects AS (
  SELECT id, name FROM public.mcq_subjects
)

INSERT INTO public.mcq_questions (subject_id, exam_type, exam_source, exam_day, question_number, scenario, choices, correct_answer, explanation, detailed_explanation, difficulty) VALUES

-- Pharmacotherapy
((SELECT id FROM public.mcq_subjects WHERE name = 'pharmacotherapy'), 'PLE-CC1', 'PLE-CC1 Dec 2025', 1, 1,
'ผู้ป่วยหญิง อายุ 55 ปี มาพบแพทย์ด้วยอาการปวดข้อนิ้วเท้าข้างขวาอย่างรุนแรง บวมแดง ผลตรวจ uric acid 9.5 mg/dL แพทย์วินิจฉัยว่าเป็น acute gout attack ยาใดเหมาะสมที่สุดสำหรับรักษา acute attack นี้?',
'[{"label":"a","text":"Allopurinol 300 mg OD"},{"label":"b","text":"Colchicine 0.6 mg ทุก 1 ชม."},{"label":"c","text":"Indomethacin 50 mg TID"},{"label":"d","text":"Febuxostat 40 mg OD"},{"label":"e","text":"Probenecid 500 mg BID"}]',
'c', 'NSAIDs เช่น Indomethacin เป็น first-line treatment สำหรับ acute gout attack',
'{"summary":"Indomethacin (NSAIDs) เป็นยาหลักสำหรับรักษา acute gout attack","reason":"ในการรักษา acute gout attack เป้าหมายคือลดอาการอักเสบอย่างรวดเร็ว NSAIDs (เช่น Indomethacin, Naproxen) เป็น first-line therapy\n\nAllopurinol และ Febuxostat เป็น urate-lowering therapy ใช้ป้องกัน ไม่ใช้ในภาวะ acute (อาจทำให้อาการกำเริบแย่ลง)\n\nColchicine ใช้ได้แต่ต้องให้ low-dose (1.2 mg แล้วตามด้วย 0.6 mg) ไม่ใช่ทุก 1 ชม.","choices":[{"label":"a","text":"Allopurinol 300 mg OD","is_correct":false,"explanation":"Allopurinol เป็น xanthine oxidase inhibitor ใช้ลด uric acid ระยะยาว ห้ามเริ่มในภาวะ acute"},{"label":"b","text":"Colchicine 0.6 mg ทุก 1 ชม.","is_correct":false,"explanation":"Colchicine high-dose ทำให้เกิด GI side effects มาก ปัจจุบันแนะนำ low-dose protocol"},{"label":"c","text":"Indomethacin 50 mg TID","is_correct":true,"explanation":"NSAIDs เป็น first-line สำหรับ acute gout ลดอาการอักเสบเร็ว"},{"label":"d","text":"Febuxostat 40 mg OD","is_correct":false,"explanation":"Febuxostat เป็น xanthine oxidase inhibitor เหมือน Allopurinol ใช้ป้องกันระยะยาว"},{"label":"e","text":"Probenecid 500 mg BID","is_correct":false,"explanation":"Probenecid เป็น uricosuric agent ใช้ลด uric acid ระยะยาว ไม่ใช้ acute"}],"key_takeaway":"Acute gout: NSAIDs หรือ Colchicine low-dose เป็น first-line; Allopurinol/Febuxostat ใช้ป้องกันระยะยาว ห้ามเริ่มในภาวะ acute"}',
'medium'),

-- Pharmaceutical Technology
((SELECT id FROM public.mcq_subjects WHERE name = 'pharma_tech'), 'PLE-CC1', 'PLE-CC1 Dec 2025', 2,
'ในการเตรียมยา diazepam rectal suppository ควรเลือก base ใดที่เหมาะสมที่สุด?',
'[{"label":"a","text":"Oleaginous base"},{"label":"b","text":"Water soluble base (PEG)"},{"label":"c","text":"Water removable base"},{"label":"d","text":"Emulsion base"},{"label":"e","text":"Absorption base"}]',
'b', 'PEG base (water soluble) เหมาะสำหรับยาที่ละลายในไขมันเพราะจะปลดปล่อยยาได้ดี',
'{"summary":"PEG base เป็น water-soluble base เหมาะสำหรับ diazepam ซึ่งเป็นยาที่ละลายในไขมัน","reason":"หลักการเลือก suppository base คือ like dissolves like ในทางตรงกันข้าม\n\nDiazepam เป็นยาที่ละลายในไขมัน (lipophilic) ดังนั้นควรเลือก base ที่เป็น water-soluble (PEG) เพื่อให้ยาถูกปลดปล่อยจาก base ได้ดี\n\nถ้าใช้ oleaginous base ยาจะอยู่ใน base ที่ชอบเหมือนกัน ทำให้ปลดปล่อยยาช้า","choices":[{"label":"a","text":"Oleaginous base","is_correct":false,"explanation":"ยาละลายได้ดีใน oleaginous base ทำให้ปลดปล่อยยาช้า"},{"label":"b","text":"Water soluble base (PEG)","is_correct":true,"explanation":"PEG base ละลายน้ำ ทำให้ diazepam (lipophilic) ถูกปลดปล่อยจาก base ได้ดี"},{"label":"c","text":"Water removable base","is_correct":false,"explanation":"ไม่เหมาะกับ rectal suppository เท่า PEG"},{"label":"d","text":"Emulsion base","is_correct":false,"explanation":"ไม่ใช่ตัวเลือกหลักสำหรับ suppository"},{"label":"e","text":"Absorption base","is_correct":false,"explanation":"ดูดซับน้ำได้แต่ไม่ใช่ตัวเลือกที่ดีที่สุดสำหรับ lipophilic drug"}],"key_takeaway":"Suppository base: ยา lipophilic ใช้ water-soluble base (PEG); ยา hydrophilic ใช้ oleaginous base (cocoa butter)"}',
'medium'),

-- Pharmaceutical Analysis
((SELECT id FROM public.mcq_subjects WHERE name = 'pharma_analysis'), 'PLE-CC1', 'PLE-CC1 Dec 2025', 3,
'การวิเคราะห์ยา Ofloxacin Tablets ตาม USP monograph กำหนดว่า LA (Label Amount) NLT 90% ถึง NMT 110% ถ้า label claim คือ 200 mg ผลวิเคราะห์พบ assay = 95% จงคำนวณปริมาณ ofloxacin ที่ได้',
'[{"label":"a","text":"180 mg"},{"label":"b","text":"190 mg"},{"label":"c","text":"195 mg"},{"label":"d","text":"200 mg"},{"label":"e","text":"210 mg"}]',
'b', 'ปริมาณ = Label Claim x (Assay%/100) = 200 x 0.95 = 190 mg',
'{"summary":"ปริมาณ ofloxacin = 200 mg x 95/100 = 190 mg ซึ่งผ่านเกณฑ์ USP (NLT 90% = 180 mg)","reason":"การคำนวณ assay จาก USP monograph:\nLabel Claim = 200 mg\nAssay = 95%\nปริมาณจริง = 200 x (95/100) = 190 mg\n\nเกณฑ์ USP: NLT 90% ถึง NMT 110%\n= 200 x 0.90 ถึง 200 x 1.10\n= 180 mg ถึง 220 mg\n\n190 mg อยู่ในเกณฑ์ จึงผ่าน","choices":[{"label":"a","text":"180 mg","is_correct":false,"explanation":"นี่คือขอบล่างของเกณฑ์ (90% ของ 200)"},{"label":"b","text":"190 mg","is_correct":true,"explanation":"200 x 0.95 = 190 mg ถูกต้อง"},{"label":"c","text":"195 mg","is_correct":false,"explanation":"คำนวณผิด"},{"label":"d","text":"200 mg","is_correct":false,"explanation":"นี่คือ label claim ไม่ใช่ปริมาณจริง"},{"label":"e","text":"210 mg","is_correct":false,"explanation":"จะได้ 210 mg ต้อง assay 105%"}],"key_takeaway":"USP Assay: ปริมาณจริง = Label Claim × (Assay%/100); เกณฑ์ NLT-NMT คิดจาก Label Claim","calculation_steps":["Label Claim = 200 mg","Assay = 95%","ปริมาณจริง = 200 × (95/100)","= 200 × 0.95","= 190 mg","เกณฑ์ USP: 200 × 0.90 = 180 mg ถึง 200 × 1.10 = 220 mg","190 mg อยู่ในช่วง 180-220 → ผ่านเกณฑ์"]}',
'easy'),

-- Pharmacokinetics
((SELECT id FROM public.mcq_subjects WHERE name = 'pharmacokinetics'), 'PLE-CC1', 'PLE-CC1 Dec 2025', 4,
'ผู้ป่วยชายอายุ 60 ปี น้ำหนัก 70 kg ได้รับ aminoglycoside IV infusion dose 350 mg ผล peak level = 10 mcg/mL, trough level = 2 mcg/mL จงคำนวณ Volume of distribution (Vd)',
'[{"label":"a","text":"25 L"},{"label":"b","text":"35 L"},{"label":"c","text":"43.75 L"},{"label":"d","text":"50 L"},{"label":"e","text":"70 L"}]',
'c', 'Vd = Dose / (Cpeak - Ctrough) = 350 mg / (10-2) mcg/mL = 350/8 = 43.75 L (ใช้สูตร simplified)',
'{"summary":"Vd = Dose/(Cpeak - Ctrough) = 350/8 = 43.75 L","reason":"สำหรับ aminoglycoside ที่ให้แบบ IV infusion สามารถใช้สูตร simplified ในการคำนวณ Vd ได้:\n\nVd = Dose / (Cpeak - Ctrough)\n\nโดย Cpeak คือ peak concentration และ Ctrough คือ trough concentration\n\nVd = 350 mg / (10 - 2) mcg/mL\n= 350 / 8\n= 43.75 L","choices":[{"label":"a","text":"25 L","is_correct":false,"explanation":"คำนวณผิด"},{"label":"b","text":"35 L","is_correct":false,"explanation":"อาจใช้สูตร Dose/Cpeak = 350/10 = 35 ซึ่งผิด"},{"label":"c","text":"43.75 L","is_correct":true,"explanation":"Vd = 350/(10-2) = 350/8 = 43.75 L"},{"label":"d","text":"50 L","is_correct":false,"explanation":"คำนวณผิด"},{"label":"e","text":"70 L","is_correct":false,"explanation":"อาจใช้ 1 L/kg ซึ่งไม่ถูก"}],"key_takeaway":"Aminoglycoside Vd: ใช้สูตร Vd = Dose/(Cpeak - Ctrough) สำหรับ IV infusion","calculation_steps":["สูตร: Vd = Dose / (Cpeak - Ctrough)","Dose = 350 mg","Cpeak = 10 mcg/mL","Ctrough = 2 mcg/mL","Vd = 350 / (10 - 2)","= 350 / 8","= 43.75 L"]}',
'hard'),

-- Pharmacy Law
((SELECT id FROM public.mcq_subjects WHERE name = 'pharma_law'), 'PLE-CC1', 'PLE-CC1 Dec 2025', 5,
'ร้านยา GPP (Good Pharmacy Practice) ตาม พ.ร.บ. ยา พ.ศ. 2510 กำหนดให้เภสัชกรต้องอยู่ประจำร้านขณะเปิดทำการ หากไม่ปฏิบัติตามจะมีโทษอย่างไร?',
'[{"label":"a","text":"ปรับไม่เกิน 1,000 บาท"},{"label":"b","text":"ปรับไม่เกิน 5,000 บาท"},{"label":"c","text":"จำคุกไม่เกิน 1 ปี"},{"label":"d","text":"พักใช้ใบอนุญาต"},{"label":"e","text":"เพิกถอนใบอนุญาต"}]',
'd', 'การไม่มีเภสัชกรประจำร้านขณะเปิดทำการอาจถูกพักใช้ใบอนุญาต',
'{"summary":"เภสัชกรไม่อยู่ประจำร้านขณะเปิดทำการ อาจถูกพักใช้ใบอนุญาตประกอบวิชาชีพ","reason":"ตาม พ.ร.บ. ยา พ.ศ. 2510 และกฎกระทรวง GPP กำหนดให้ร้านยาต้องมีเภสัชกรอยู่ปฏิบัติหน้าที่ตลอดเวลาที่เปิดทำการ หากฝ่าฝืนอาจถูกดำเนินการทางปกครอง โดยสภาเภสัชกรรมอาจพิจารณาพักใช้ใบอนุญาตประกอบวิชาชีพเภสัชกรรม","choices":[{"label":"a","text":"ปรับไม่เกิน 1,000 บาท","is_correct":false,"explanation":"โทษน้อยเกินไปสำหรับความผิดนี้"},{"label":"b","text":"ปรับไม่เกิน 5,000 บาท","is_correct":false,"explanation":"เป็นโทษปรับทั่วไปแต่ไม่ใช่โทษหลักสำหรับกรณีนี้"},{"label":"c","text":"จำคุกไม่เกิน 1 ปี","is_correct":false,"explanation":"ไม่มีโทษจำคุกสำหรับกรณีนี้"},{"label":"d","text":"พักใช้ใบอนุญาต","is_correct":true,"explanation":"สภาเภสัชกรรมมีอำนาจพักใช้ใบอนุญาตประกอบวิชาชีพ"},{"label":"e","text":"เพิกถอนใบอนุญาต","is_correct":false,"explanation":"เพิกถอนเป็นโทษขั้นสูงสุด ใช้กับกรณีร้ายแรงกว่านี้"}],"key_takeaway":"GPP: เภสัชกรต้องอยู่ประจำร้านตลอดเวลาเปิดทำการ ฝ่าฝืนอาจถูกพักใช้ใบอนุญาต"}',
'easy');
