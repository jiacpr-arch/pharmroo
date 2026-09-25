-- Fix AI-generated MCQs whose answer key disagrees with the correct calculation.
--
-- Reported case: norepinephrine 4 mg/NSS 250 mL @ 0.1 mcg/kg/min, 70 kg.
--   7 mcg/min = 420 mcg/hr; 4,000 mcg / 250 mL = 16 mcg/mL; 420 / 16 = 26.25 mL/hr (A),
--   but correct_answer was B (10.5 mL/hr).
--
-- Found by looking for questions where detailed_explanation.choices[].is_correct
-- points to a different letter than correct_answer (the model self-corrected in the
-- explanation but the key was never updated). Each one below was re-computed by hand.
-- Three more (fd393eae, f768277a, 066dda36) had a wrong key AND a wrong explanation;
-- they get a rewritten explanation.

begin;

-- 1) Re-key: set correct_answer, sync is_correct flags and the summary line.
with fix(id, ans) as (values
  ('05cd984afe04097695604fd80317832e','A'), -- PPV 90/150=60%, NPV 810/850=95.3%
  ('0ccbaf92c97a535a5bf96987961380ed','B'), -- BSA √(160×58/3600)=1.60 → 96 mg
  ('1c7bca7b28a72a91b57e3aba271e0675','A'), -- 2.4% = 24 mg/mL → 1000/24 = 41.7 mL
  ('1e2a1a3902b23de1141b37016ced8cde','B'), -- 5×80×60/800 = 30 mL/hr
  ('2bb7fddefb2c2544afc252f141135f94','B'), -- apixaban: wt ≤60 + SCr ≥1.5 → 2.5 mg BID
  ('2ed5408bf0b09d0cd98b45a16f742daa','B'), -- 0.4%×250 = 1 g → 50 mL of 2%
  ('319d9055ab5bf53127d1f932a7aeb634','A'), -- F = (150/200)×(50/100) = 37.5%
  ('32020b3d6a55f1d2b14af0a066019a03','D'), -- 308 + 80×2 = 468 mOsm/L
  ('35797415e2ec85853d1e2de576c4df0a','D'), -- RR 2.5, NNH 1/0.012 ≈ 83, balanced policy
  ('3a191d85db0f11b3871d6c1d12c1e5fa','A'), -- 45 L × 6 / 513 = 527 mL
  ('3af8c9ec2e111341a8eb9313',             'A'), -- placeholder, replaced below
  ('3f31d23e2ec00fcf6f4a42b834254921','A'), -- (400/100)/(500/50) = 40%
  ('46a6dbaab5c6c8f91f5d84958fdeae38','A'), -- NE 70 kg → 26.25 mL/hr = 26.25 gtt/min
  ('529a86fadf34f226d87a644f28855949','D'), -- 5×70×60/800 = 26.25 mL/hr
  ('54e0a6df1e5d2652eb15b88e29ed4393','C'), -- apixaban: wt 52 + SCr 1.6 → 2.5 mg BID
  ('5e00b82a3fe450bbaf86a97e6804ce45','C'), -- OR = 160×600/(240×200) = 2.0
  ('63a086fc2ab9b98a18b043257727f6dc','A'), -- NE 80 kg 16 mcg/mL → 30 → 45 mL/hr
  ('7907d12f7b3aeb1a6a5dc0c9129e307e','B'), -- NE 70 kg → 26.25 mL/hr
  ('8390075b91e8a6d083ff9b946f209558','B'), -- 800 mcg/min, 1600 mcg/mL → 30 mL/hr
  ('8cbe8552f544eb3da8c337999043523c','E'), -- CL 8.66 L/h; 0.4×500/8.66 = 23.1
  ('8cffca3273382760f566f0e1768e5779','A'), -- (80/100)/(100/50) = 40%
  ('9ff6bc8632d887c7cee12eff6d589a33','A'), -- 1000×20/480 = 42 gtt/min; 2.98 mg/mL
  ('abaed991957572ab1edeaafc88828d7c','A'), -- 385 mg = 38.5 mL; 288.5 mL over 1 h
  ('c4e6a56256f0f137e13e3599a2d49bb5','B'), -- 50 g / (0.37×1.19) = 113.6 mL
  ('c73098552c8808345dd418eabe8d9832','B'), -- 24000/1600 = 15 mL/hr
  ('c8563637ee890bc37749910ba25d8359','B'), -- 4% − 2% = 2% → NNH 50
  ('cf4d0e757275d275e19918887849872e','A'), -- reported question: 26.25 ≈ 26.3 mL/hr
  ('dab2d2783b7589602ece6212b8c36d2e','C'), -- NE 80 kg → 30 mL/hr
  ('ed06f37b0d01f86e1aa141e45820c0eb','B'), -- 480/32 = 15 mL/hr
  ('edc47ad3264b3fdf4d7c26220196c8fb','D'), -- Vd = CL/k = 5/0.1 = 50 L
  ('ef935501bdddcd96406923f6a15d0a86','B'), -- ARR 15%−8% = 7% → NNT 15
  ('f603665baebb2a71afe24a173703e50d','A'), -- (400/250)/(500/100) = 32%
  ('fd393eae9d5cf674559f2ed3deae7dbb','A'), -- NE 70 kg → 26.25 mL/hr
  ('f768277ad9259e831af380e002b71ebd','A'), -- 16 mcg/mL; 0.2×80×60/16 = 60 mL/hr
  ('066dda36cea615d0bf25c02b2f719f36','C')  -- 18 mL/h; 40 mcg/mL×250 mL = 10 mg = 2.5 amp
)
update mcq_questions q
set correct_answer = f.ans,
    detailed_explanation = jsonb_set(
      jsonb_set(q.detailed_explanation, '{choices}',
        (select jsonb_agg(c || jsonb_build_object('is_correct', c->>'label' = f.ans) order by c->>'label')
           from jsonb_array_elements(q.detailed_explanation->'choices') c)),
      '{summary}',
      to_jsonb('คำตอบที่ถูกต้อง: ' || f.ans || ' — ' ||
        (select c->>'text' from jsonb_array_elements(q.choices) c where c->>'label' = f.ans)))
from fix f
where q.id = f.id;

-- 2) Choice text whose parenthetical reasoning contradicted the (correct) value.
update mcq_questions set choices = (
  select jsonb_agg(case c->>'label'
    when 'A' then jsonb_build_object('label','A','text','F = 37.5% (คำนวณจาก (AUC oral / AUC IV) × (Dose IV / Dose oral) = (150/200) × (50/100))')
    when 'B' then jsonb_build_object('label','B','text','F = 75% (คำนวณจาก AUC oral / AUC IV โดยไม่ปรับ dose)')
    else c end order by c->>'label') from jsonb_array_elements(choices) c)
where id = '319d9055ab5bf53127d1f932a7aeb634';

update mcq_questions set choices = (
  select jsonb_agg(case c->>'label'
    when 'A' then jsonb_build_object('label','A','text','F = 40% (คำนวณจาก [AUC(oral)/Dose(oral)] ÷ [AUC(IV)/Dose(IV)] × 100)')
    when 'B' then jsonb_build_object('label','B','text','F = 80% (คำนวณจาก AUC(oral)/AUC(IV) โดยตรงโดยไม่ปรับขนาดยา)')
    else c end order by c->>'label') from jsonb_array_elements(choices) c)
where id = '8cffca3273382760f566f0e1768e5779';

update mcq_questions set choices = (
  select jsonb_agg(case c->>'label'
    when 'B' then jsonb_build_object('label','B','text','เริ่ม apixaban 2.5 mg BID เพราะผู้ป่วยมีเกณฑ์ dose reduction ≥2 ข้อ (SCr ≥1.5 mg/dL + น้ำหนัก ≤60 กก.) จึงต้องใช้ขนาดต่ำ')
    else c end order by c->>'label') from jsonb_array_elements(choices) c)
where id = '2bb7fddefb2c2544afc252f141135f94';

-- 3) Rewrite the explanation where it argued for the wrong answer.
update mcq_questions set detailed_explanation = jsonb_build_object(
  'reason', E'1) ความเข้มข้น = 4,000 mcg ÷ 250 mL = 16 mcg/mL\n2) Dose = 0.1 mcg/kg/min × 70 kg = 7 mcg/min = 420 mcg/hr\n3) อัตรา = 420 ÷ 16 = 26.25 mL/hr',
  'summary', 'คำตอบที่ถูกต้อง: A — 26.25 mL/hr',
  'key_takeaway', 'Rate (mL/hr) = Dose (mcg/kg/min) × น้ำหนัก (kg) × 60 ÷ ความเข้มข้น (mcg/mL)',
  'choices', jsonb_build_array(
    jsonb_build_object('label','A','text','26.25 mL/hr','is_correct',true,'explanation','ถูกต้อง: 7 mcg/min × 60 ÷ 16 mcg/mL = 26.25 mL/hr'),
    jsonb_build_object('label','B','text','10.5 mL/hr','is_correct',false,'explanation','ตัวเลขนี้ไม่ได้มาจากสูตรที่ถูกต้อง — ได้ต่ำกว่าความจริง 2.5 เท่า'),
    jsonb_build_object('label','C','text','6.3 mL/hr','is_correct',false,'explanation','ผิด — ไม่ได้คูณน้ำหนักผู้ป่วยให้ถูกต้อง'),
    jsonb_build_object('label','D','text','10.5 mL/hr + แนะนำ 8 mg/250 mL','is_correct',false,'explanation','อัตรา 10.5 mL/hr ผิด (ที่ 16 mcg/mL ต้องเป็น 26.25 mL/hr) แม้การเพิ่มความเข้มข้นเพื่อจำกัด fluid จะทำได้ในทางปฏิบัติ'),
    jsonb_build_object('label','E','text','21 mL/hr','is_correct',false,'explanation','ผิด — 21 mL/hr จะได้เมื่อความเข้มข้นเป็น 20 mcg/mL ไม่ใช่ 16 mcg/mL')))
where id = 'fd393eae9d5cf674559f2ed3deae7dbb';

update mcq_questions set detailed_explanation = jsonb_build_object(
  'reason', E'1) ความเข้มข้น = 4,000 mcg ÷ 250 mL = 16 mcg/mL\n2) Dose ใหม่ = 0.2 mcg/kg/min × 80 kg = 16 mcg/min = 960 mcg/hr\n3) อัตรา = 960 ÷ 16 = 60 mL/hr',
  'summary', 'คำตอบที่ถูกต้อง: A — Concentration = 16 mcg/mL; อัตราใหม่ = 60 mL/hr',
  'key_takeaway', 'เพิ่ม dose เป็น 2 เท่าที่ความเข้มข้นเดิม → อัตราเพิ่ม 2 เท่า (30 → 60 mL/hr)',
  'choices', jsonb_build_array(
    jsonb_build_object('label','A','text','Concentration = 16 mcg/mL; อัตราใหม่ = 60 mL/hr','is_correct',true,'explanation','ถูกต้อง: 16 mcg/min × 60 ÷ 16 mcg/mL = 60 mL/hr'),
    jsonb_build_object('label','B','text','Concentration = 16 mcg/mL; อัตราใหม่ = 48 mL/hr','is_correct',false,'explanation','ผิด — 48 mL/hr ให้เพียง 0.16 mcg/kg/min'),
    jsonb_build_object('label','C','text','Concentration = 14.9 mcg/mL; อัตราใหม่ = 64.3 mL/hr','is_correct',false,'explanation','ผิด — ความเข้มข้นที่ใช้ตามโจทย์คือ 4 mg/250 mL = 16 mcg/mL'),
    jsonb_build_object('label','D','text','Concentration = 16 mcg/mL; อัตราใหม่ = 30 mL/hr','is_correct',false,'explanation','ผิด — 30 mL/hr คืออัตราของ dose เดิม 0.1 mcg/kg/min'),
    jsonb_build_object('label','E','text','Concentration = 8 mcg/mL; อัตราใหม่ = 120 mL/hr','is_correct',false,'explanation','ผิด — คิดความเข้มข้นเป็นครึ่งหนึ่ง (สับสนเรื่อง salt/base)')))
where id = 'f768277ad9259e831af380e002b71ebd';

update mcq_questions set detailed_explanation = jsonb_build_object(
  'reason', E'1) Dose = 0.15 mcg/kg/min × 80 kg = 12 mcg/min = 720 mcg/hr\n2) อัตรา = 720 ÷ 40 mcg/mL = 18 mL/h\n3) ปริมาณยาในถุง = 40 mcg/mL × 250 mL = 10,000 mcg = 10 mg = 2.5 ampule (4 mg/ampule)\nการเปลี่ยน hydrocortisone เป็น bolus ไม่ต้องปรับ dose norepinephrine ล่วงหน้า',
  'summary', 'คำตอบที่ถูกต้อง: C — 18 mL/h; ใช้ norepinephrine 2.5 ampule (10 mg) ให้ได้ 40 mcg/mL ใน 250 mL',
  'key_takeaway', 'ปริมาณยาที่ต้องใช้ = ความเข้มข้นเป้าหมาย × ปริมาตรถุง — 40 mg ใน 250 mL จะได้ 160 mcg/mL ไม่ใช่ 40 mcg/mL',
  'choices', jsonb_build_array(
    jsonb_build_object('label','A','text',(select c->>'text' from jsonb_array_elements(choices) c where c->>'label'='A'),'is_correct',false,'explanation','ผิด — 40 mg ใน 250 mL = 160 mcg/mL (สูงกว่าเป้า 4 เท่า)'),
    jsonb_build_object('label','B','text',(select c->>'text' from jsonb_array_elements(choices) c where c->>'label'='B'),'is_correct',false,'explanation','ผิด — จำนวน ampule ผิดเช่นเดียวกับข้อ A'),
    jsonb_build_object('label','C','text',(select c->>'text' from jsonb_array_elements(choices) c where c->>'label'='C'),'is_correct',true,'explanation','ถูกต้อง: 720 mcg/hr ÷ 40 mcg/mL = 18 mL/h; 10 mg = 2.5 ampule'),
    jsonb_build_object('label','D','text',(select c->>'text' from jsonb_array_elements(choices) c where c->>'label'='D'),'is_correct',false,'explanation','ผิด — ลืมแปลง mcg/min เป็น mcg/hr (×60)'),
    jsonb_build_object('label','E','text',(select c->>'text' from jsonb_array_elements(choices) c where c->>'label'='E'),'is_correct',false,'explanation','ผิด — ไม่มีเหตุให้ลด norepinephrine ก่อน hydrocortisone bolus และจำนวน ampule ก็ผิด')))
where id = '066dda36cea615d0bf25c02b2f719f36';

-- 4) No single correct option exists — pull from practice until rewritten.
update mcq_questions set status = 'review',
  ai_notes = coalesce(ai_notes || ' • ', '') || '2026-09-25: pulled — no fully correct choice'
where id in (
  '08d09e5db463d7655ca5ecc736cdf532', -- MTX 12 mg/m² × 0.913 m² ≈ 11 mg: not among choices
  '12da9c4149a4d850fc6898ea10e7adb3', -- gentamicin t½: A has right Ke/wrong t½, B the reverse
  '449b5d56b70301ee19accbc6842cb810', -- IPA alligation: correct 254.2/245.8 mL not among choices
  'c74bc6723ddb607e1e67ccd577513a63'  -- key = pioglitazone in osteoporosis; D has wrong sitagliptin dose for eGFR 48
);

commit;
