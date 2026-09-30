import type { Pc1MockItem } from "@/lib/pc1-mock-builder";

// PC1 Mock Set 1 — ข้อใหม่ชุดที่ 2: ระบบประสาท (5) + จิตเวช (6) + ระบบหายใจ (6)
// เติมหมวดที่คลังเดิมมีไม่ถึง 10 ข้อ (ใช้ร่วมกับ Case 12, 6, 8 จากคลังเดิม) · เน้นง่าย–ปานกลาง เพราะเคสเดิมเป็นระดับยาก

export const MOCK1_DAY02: Record<string, Pc1MockItem[]> = {
  neuro: [
    {
      title: "Acute ischemic stroke + alteplase",
      base:
        "ชายไทยอายุ 72 ปี น้ำหนัก 70 kg มีอาการแขนขาขวาอ่อนแรงและพูดไม่ชัด เริ่มมีอาการ 2 ชั่วโมงก่อนมาโรงพยาบาล. CT brain ไม่พบเลือดออก. " +
        "BP 196/104 mmHg, glucose 142 mg/dL, platelet 230,000/mm³, INR 1.0 ไม่ได้ใช้ยาต้านการแข็งตัวของเลือด แพทย์พิจารณาให้ alteplase",
      ref: "AHA/ASA 2019 Guidelines for the Early Management of Acute Ischemic Stroke; Alteplase prescribing information",
      qs: [
        {
          d: "easy",
          p: "ก่อนให้ alteplase ต้องลดความดันโลหิตให้ต่ำกว่าระดับใด?",
          o: ["<185/110 mmHg", "<140/90 mmHg", "<120/80 mmHg", "<220/120 mmHg", "ไม่ต้องลดความดันก่อนให้ยา"],
          a: 0,
          r: "ผู้ที่จะได้ thrombolysis ต้องลด BP ให้ <185/110 mmHg ก่อนเริ่มยา (เช่น labetalol หรือ nicardipine IV) และคงไว้ <180/105 mmHg อย่างน้อย 24 ชั่วโมงหลังให้ยา เพื่อลดความเสี่ยงเลือดออกในสมอง",
          w: ["ถูก", "ต่ำเกินไป เสี่ยงลดการไหลเวียนเลือดไปสมองส่วนที่ขาดเลือด", "ต่ำเกินไปมาก อันตรายในระยะเฉียบพลัน", "เป็นเกณฑ์ของผู้ที่ไม่ได้รับ thrombolysis", "BP สูงเพิ่มความเสี่ยง intracranial hemorrhage"],
          k: "ก่อน alteplase: BP <185/110; หลังให้ยา 24 ชม.: <180/105",
        },
        {
          d: "medium",
          p: "ขนาด alteplase สำหรับผู้ป่วยรายนี้ ข้อใดถูกต้อง?",
          o: [
            "6.3 mg IV bolus ใน 1 นาที แล้วหยด 56.7 mg ใน 60 นาที",
            "7 mg IV bolus แล้วหยด 63 mg ใน 60 นาที",
            "9 mg IV bolus แล้วหยด 81 mg ใน 60 นาที",
            "63 mg IV bolus ครั้งเดียว",
            "90 mg IV หยดใน 60 นาที",
          ],
          a: 0,
          r: "Alteplase สำหรับ acute ischemic stroke = 0.9 mg/kg (สูงสุด 90 mg) ให้ 10% เป็น bolus ใน 1 นาที ที่เหลือหยดใน 60 นาที. 70 kg × 0.9 = 63 mg → bolus 6.3 mg, infusion 56.7 mg",
          c: ["ขนาดรวม = 0.9 mg/kg × 70 kg = 63 mg (ไม่เกิน 90 mg)", "Bolus 10% = 6.3 mg ใน 1 นาที", "ที่เหลือ 63 − 6.3 = 56.7 mg หยดใน 60 นาที"],
          w: ["ถูก", "คิดขนาดรวมเป็น 1 mg/kg (70 mg) ซึ่งเป็นขนาดของข้อบ่งใช้อื่น", "ใช้ขนาดสูงสุดของผู้ที่หนัก ≥100 kg", "ต้องแบ่ง bolus 10% และหยดส่วนที่เหลือ", "เกินขนาดตามน้ำหนักตัว"],
          k: "Alteplase stroke: 0.9 mg/kg (max 90), 10% bolus/1 นาที + 90% หยด 60 นาที",
        },
        {
          d: "medium",
          p: "หลังให้ alteplase ครบ ควรเริ่ม aspirin เมื่อใด?",
          o: [
            "หลังให้ alteplase 24 ชั่วโมง และภาพถ่ายสมองซ้ำไม่พบเลือดออก",
            "ทันทีพร้อมกับ alteplase",
            "ภายใน 1 ชั่วโมงหลังให้ alteplase",
            "หลังจำหน่าย 2 สัปดาห์",
            "ไม่ต้องให้ aspirin เพราะได้ alteplase แล้ว",
          ],
          a: 0,
          r: "ห้ามให้ antiplatelet/anticoagulant ภายใน 24 ชั่วโมงหลัง alteplase เพราะเพิ่มความเสี่ยงเลือดออกในสมอง เริ่ม aspirin หลัง 24 ชั่วโมงเมื่อ CT/MRI ซ้ำไม่พบเลือดออก เพื่อป้องกันการเกิดซ้ำ",
          w: ["ถูก", "เพิ่มความเสี่ยงเลือดออกในสมอง", "เพิ่มความเสี่ยงเลือดออกในสมอง", "ช้าเกินไป เสี่ยงเกิด stroke ซ้ำในช่วงแรก", "ยังต้องใช้ antiplatelet เพื่อป้องกันการเกิดซ้ำ"],
          k: "หลัง alteplase: เลี่ยง antithrombotic 24 ชม. → เริ่ม aspirin เมื่อภาพซ้ำไม่มีเลือดออก",
        },
      ],
    },
    {
      ref: "Carbidopa/levodopa prescribing information",
      qs: [
        {
          d: "easy",
          p: "เหตุผลที่ให้ carbidopa ร่วมกับ levodopa ในการรักษาโรคพาร์กินสันคือข้อใด?",
          o: [
            "ยับยั้ง DOPA decarboxylase นอกสมอง ลดคลื่นไส้และทำให้ใช้ levodopa ขนาดต่ำลง",
            "กระตุ้น dopamine receptor ในสมองโดยตรง",
            "ยับยั้ง MAO-B ในสมอง",
            "ยับยั้ง COMT ทำให้ levodopa ออกฤทธิ์นานขึ้น",
            "ลดอาการ dyskinesia จาก levodopa",
          ],
          a: 0,
          r: "Carbidopa ยับยั้ง aromatic L-amino acid (DOPA) decarboxylase ที่อวัยวะส่วนปลายและไม่ผ่าน BBB → levodopa เข้าสมองได้มากขึ้น ลดการสร้าง dopamine นอกสมองที่ทำให้คลื่นไส้ อาเจียน ความดันต่ำ",
          w: ["ถูก", "เป็นกลไกของ dopamine agonist เช่น pramipexole", "เป็นกลไกของ selegiline/rasagiline", "เป็นกลไกของ entacapone", "ไม่ได้ลด dyskinesia (มักเกิดจาก levodopa ระยะยาว)"],
          k: "Carbidopa = peripheral DOPA decarboxylase inhibitor → ลด ADR นอกสมองและลดขนาด levodopa",
        },
      ],
    },
    {
      ref: "MHRA/EMA Valproate Pregnancy Prevention Programme; ILAE recommendations on antiseizure medication in women of childbearing potential",
      qs: [
        {
          d: "medium",
          p: "หญิงอายุ 22 ปี วินิจฉัย juvenile myoclonic epilepsy ครั้งแรก วางแผนจะมีบุตรใน 2 ปี ยาที่เหมาะสมที่สุดคือข้อใด?",
          o: ["Levetiracetam", "Sodium valproate", "Carbamazepine", "Phenytoin", "Lamotrigine ขนาดสูง"],
          a: 0,
          r: "Valproate มีประสิทธิภาพดีใน generalized epilepsy แต่ทำให้เกิดความพิการแต่กำเนิด (neural tube defects) และพัฒนาการผิดปกติสูง จึงหลีกเลี่ยงในหญิงวัยเจริญพันธุ์. Levetiracetam ใช้ได้ผลใน JME และความเสี่ยงต่อทารกต่ำ. Carbamazepine/phenytoin อาจทำให้ myoclonic seizure แย่ลง ส่วน lamotrigine อาจทำให้ myoclonus แย่ลงในบางราย. ควรให้ folic acid ก่อนตั้งครรภ์",
          w: ["ถูก", "Teratogenic สูง หลีกเลี่ยงในหญิงวัยเจริญพันธุ์", "อาจทำให้ myoclonic/absence seizure แย่ลง", "อาจทำให้ myoclonic seizure แย่ลง และมีปัญหา teratogenicity", "อาจทำให้ myoclonus แย่ลงใน JME"],
          k: "หญิงวัยเจริญพันธุ์ + generalized epilepsy → หลีกเลี่ยง valproate; levetiracetam/lamotrigine + folic acid",
        },
      ],
    },
  ],
  psych: [
    {
      title: "Bipolar I disorder on lithium",
      base:
        "หญิงไทยอายุ 40 ปี น้ำหนัก 60 kg เป็น bipolar I disorder ได้ lithium carbonate 300 mg วันละ 3 ครั้ง (900 mg/day) มา 2 สัปดาห์ อาการคงที่. SCr 0.8 mg/dL. " +
        "ตรวจระดับยาครั้งแรกได้ 0.5 mmol/L",
      ref: "CANMAT/ISBD 2018 Guidelines for Bipolar Disorder; Lithium carbonate prescribing information",
      qs: [
        {
          d: "easy",
          p: "การเจาะระดับ lithium ที่ถูกต้องและช่วงเป้าหมายในการรักษาระยะยาวคือข้อใด?",
          o: [
            "เจาะก่อนมื้อถัดไปประมาณ 12 ชั่วโมงหลังยามื้อสุดท้าย เป้าหมาย 0.6–1.0 mmol/L",
            "เจาะ 2 ชั่วโมงหลังทานยา เป้าหมาย 1.5–2.0 mmol/L",
            "เจาะเวลาใดก็ได้ เป้าหมาย 0.2–0.4 mmol/L",
            "เจาะ 12 ชั่วโมงหลังยา เป้าหมาย 1.5–2.5 mmol/L",
            "เจาะหลังเริ่มยา 1 วัน เป้าหมาย 0.6–1.0 mmol/L",
          ],
          a: 0,
          r: "เจาะระดับ lithium 12 ชั่วโมงหลังยามื้อสุดท้าย เมื่อถึง steady state (ประมาณ 5 วันหลังเริ่ม/ปรับยา). ระยะยาวเป้าหมาย 0.6–1.0 mmol/L (อาการ mania เฉียบพลันอาจถึง 1.2)",
          w: ["ถูก", "ระดับสูงสุดหลังยาทำให้แปลผลไม่ได้ และช่วงนี้เป็นระดับเป็นพิษ", "ช่วงต่ำเกินไป และเวลาเจาะต้องแน่นอน", "ช่วงเป็นพิษ", "ยังไม่ถึง steady state"],
          k: "Lithium: trough 12 ชม. หลังยา ที่ steady state (~5 วัน); maintenance 0.6–1.0 mmol/L",
        },
        {
          d: "medium",
          p: "หากต้องการให้ระดับ lithium เป็น 0.8 mmol/L (สมมติว่า PK เป็นเส้นตรง) ควรปรับขนาดยาเป็นเท่าใด โดยใช้เม็ดยา 300 mg?",
          o: ["1,050 mg/day", "1,200 mg/day", "1,500 mg/day", "1,800 mg/day", "2,100 mg/day"],
          a: 2,
          r: "Lithium มี PK แบบเส้นตรง ขนาดใหม่ = ขนาดเดิม × (ระดับเป้าหมาย / ระดับเดิม) = 900 × 0.8/0.5 = 1,440 mg/day ปัดเป็น 1,500 mg/day (5 เม็ด) แล้วตรวจระดับซ้ำหลัง 5 วัน",
          c: ["ขนาดใหม่ = 900 × (0.8 / 0.5)", "= 1,440 mg/day", "ปัดตามเม็ดยา 300 mg → 1,500 mg/day"],
          w: ["ระดับที่ได้ ≈ 0.58 mmol/L ยังต่ำกว่าเป้า", "ระดับที่ได้ ≈ 0.67 mmol/L", "ถูก", "ระดับที่ได้ ≈ 1.0 mmol/L สูงเกินเป้า", "ระดับที่ได้ ≈ 1.17 mmol/L เสี่ยงเป็นพิษ"],
          k: "Linear PK: dose ใหม่ = dose เดิม × (C เป้าหมาย / C เดิม)",
        },
        {
          d: "medium",
          p: "ผู้ป่วยปวดหลังและขอยาแก้ปวด ยาใดเหมาะสมที่สุดระหว่างใช้ lithium?",
          o: ["Paracetamol 500 mg เมื่อปวด", "Ibuprofen 400 mg TID", "Naproxen 500 mg BID", "Diclofenac 50 mg TID", "Celecoxib 200 mg BID"],
          a: 0,
          r: "NSAIDs (รวม COX-2 inhibitor) ลด prostaglandin ที่ไต ลดการขับ lithium ทำให้ระดับยาสูงขึ้นได้ 20–40% เสี่ยงเป็นพิษ. ยาอื่นที่เพิ่มระดับ lithium: thiazide, ACEI/ARB. Paracetamol ไม่มีปฏิกิริยานี้",
          w: ["ถูก", "เพิ่มระดับ lithium", "เพิ่มระดับ lithium", "เพิ่มระดับ lithium", "COX-2 inhibitor ก็เพิ่มระดับ lithium"],
          k: "Lithium ↑ ด้วย NSAIDs, thiazide, ACEI/ARB, ภาวะขาดน้ำ",
        },
        {
          d: "medium",
          p: "3 เดือนต่อมาผู้ป่วยท้องเสียและอาเจียน 2 วัน มีมือสั่นหยาบ เดินเซ สับสน ระดับ lithium 2.1 mmol/L SCr 1.4 mg/dL การจัดการเบื้องต้นที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "หยุด lithium ให้ 0.9% NaCl IV และประเมินความจำเป็นในการฟอกเลือด",
            "ให้ activated charcoal ซ้ำหลายครั้ง",
            "ให้ furosemide IV เพื่อเร่งขับยา",
            "ลด lithium ครึ่งหนึ่งและตรวจระดับซ้ำใน 1 สัปดาห์",
            "ให้ haloperidol คุมอาการสับสนและใช้ lithium ต่อ",
          ],
          a: 0,
          r: "Lithium toxicity จากการขาดน้ำและไตทำงานลดลง: หยุดยา ให้ NaCl IV แก้ volume depletion เพื่อเพิ่มการขับยา ตรวจระดับซ้ำ และพิจารณา hemodialysis เมื่อระดับสูงมาก (เช่น >4.0 mmol/L หรือ >2.5 ร่วมกับไตเสื่อม/อาการทางระบบประสาท). Activated charcoal ไม่จับ lithium",
          w: ["ถูก", "Charcoal ไม่จับ lithium (เป็นโลหะ/ion)", "Loop diuretic ทำให้ขาดน้ำมากขึ้นและไม่เพิ่มการขับ lithium", "ระดับเป็นพิษและมีอาการ ต้องหยุดยาทันที", "ไม่แก้สาเหตุ และยาต้านโรคจิตอาจเพิ่ม neurotoxicity"],
          k: "Lithium toxicity: หยุดยา + NaCl IV; charcoal ไม่ได้ผล; รุนแรง → hemodialysis",
        },
      ],
    },
    {
      ref: "Clozapine prescribing information (REMS monitoring)",
      qs: [
        {
          d: "easy",
          p: "ผู้ป่วยโรคจิตเภทดื้อยาจะเริ่ม clozapine การตรวจทางห้องปฏิบัติการที่สำคัญที่สุดเพื่อติดตามความปลอดภัยคือข้อใด?",
          o: ["Absolute neutrophil count (ANC)", "Serum potassium", "INR", "Serum amylase", "TSH"],
          a: 0,
          r: "Clozapine ทำให้เกิด severe neutropenia/agranulocytosis ได้ ต้องตรวจ ANC ก่อนเริ่มยา ทุกสัปดาห์ใน 6 เดือนแรก ทุก 2 สัปดาห์ในเดือนที่ 6–12 และทุกเดือนหลังจากนั้น. ADR สำคัญอื่น: myocarditis, ชัก, ท้องผูกรุนแรง, metabolic syndrome",
          w: ["ถูก", "ไม่ใช่ ADR หลักของ clozapine", "ไม่เกี่ยวข้อง", "ไม่ใช่การติดตามหลัก", "ไม่ใช่การติดตามหลัก (เป็นของ lithium)"],
          k: "Clozapine: ติดตาม ANC (agranulocytosis) + myocarditis, ชัก, ท้องผูก, metabolic",
        },
      ],
    },
    {
      ref: "Maudsley Prescribing Guidelines in Psychiatry",
      qs: [
        {
          d: "easy",
          p: "ชายอายุ 20 ปี ได้ haloperidol IM ในห้องฉุกเฉิน 6 ชั่วโมงต่อมา คอบิดเกร็ง ตาเหลือกขึ้น ยาที่เหมาะสมที่สุดคือข้อใด?",
          o: ["Benztropine 2 mg IM หรือ diphenhydramine 50 mg IM", "Dantrolene 1 mg/kg IV", "Propranolol 10 mg PO", "Haloperidol เพิ่มอีก 5 mg IM", "Bromocriptine 2.5 mg PO"],
          a: 0,
          r: "Acute dystonia เกิดภายในชั่วโมงถึงไม่กี่วันหลังได้ยาต้านโรคจิต (โดยเฉพาะ high-potency FGA) รักษาด้วย anticholinergic เช่น benztropine หรือ diphenhydramine ทางหลอดเลือด/กล้ามเนื้อ อาการดีขึ้นในไม่กี่นาที",
          w: ["ถูก", "ใช้กับ NMS หรือ malignant hyperthermia", "ใช้กับ akathisia", "ทำให้อาการแย่ลง", "ใช้ใน NMS ไม่ใช่ acute dystonia"],
          k: "Acute dystonia → anticholinergic IM/IV (benztropine, diphenhydramine); akathisia → propranolol",
        },
      ],
    },
  ],
  resp: [
    {
      title: "Mild asthma on SABA alone",
      base:
        "หญิงไทยอายุ 25 ปี เป็นโรคหืด ใช้ salbutamol MDI เมื่อมีอาการเพียงอย่างเดียว ปัจจุบันใช้ประมาณ 3–4 ครั้ง/สัปดาห์ ตื่นกลางคืนเพราะหอบ 1–2 ครั้ง/เดือน ไม่เคยมีอาการกำเริบรุนแรง",
      ref: "GINA 2024 Global Strategy for Asthma Management and Prevention",
      qs: [
        {
          d: "easy",
          p: "ตามแนวทาง GINA การรักษาที่เหมาะสมที่สุดสำหรับผู้ป่วยรายนี้คือข้อใด?",
          o: [
            "Budesonide/formoterol ขนาดต่ำ ใช้เมื่อมีอาการ (as-needed ICS-formoterol)",
            "ใช้ salbutamol เมื่อมีอาการต่อไปอย่างเดียว",
            "Montelukast 10 mg OD อย่างเดียว",
            "Theophylline SR 200 mg BID",
            "Prednisolone 30 mg/day 5 วัน",
          ],
          a: 0,
          r: "GINA ไม่แนะนำให้ใช้ SABA อย่างเดียว เพราะเพิ่มความเสี่ยงอาการกำเริบรุนแรงและเสียชีวิต. Track 1 สำหรับหืดระดับเล็กน้อย (step 1–2) คือ low-dose ICS-formoterol ใช้เมื่อมีอาการ ลดการกำเริบได้ดีกว่า SABA",
          w: ["ถูก", "SABA-only เพิ่มความเสี่ยงอาการกำเริบรุนแรง", "ด้อยกว่า ICS และมีคำเตือนเรื่อง neuropsychiatric ADR", "ไม่ใช่ทางเลือกหลัก ADR มากและต้องติดตามระดับยา", "ใช้ในอาการกำเริบ ไม่ใช่การควบคุมระยะยาว"],
          k: "GINA: ไม่ใช้ SABA อย่างเดียว; mild asthma → as-needed low-dose ICS-formoterol",
        },
        {
          d: "easy",
          p: "คำแนะนำใดสำคัญที่สุดเพื่อลดการเกิดเชื้อราในช่องปากจาก ICS?",
          o: [
            "บ้วนปากด้วยน้ำหลังพ่นยาทุกครั้งโดยไม่กลืน",
            "พ่นยาก่อนอาหารทันที",
            "กลั้นหายใจให้สั้นที่สุดหลังพ่นยา",
            "ใช้ยาพ่นจมูกร่วมด้วย",
            "เขย่าหลอดยาหลังพ่น",
          ],
          a: 0,
          r: "ยา ICS ที่ตกค้างในช่องปากและคอทำให้เกิด oropharyngeal candidiasis และเสียงแหบ การบ้วนปากหลังใช้ยา (และใช้ spacer กับ MDI) ช่วยลดการตกค้าง",
          w: ["ถูก", "ไม่ลดการตกค้างของยา", "ควรกลั้นหายใจประมาณ 10 วินาทีให้ยาเข้าปอด", "ไม่เกี่ยวข้อง", "ต้องเขย่าก่อนพ่น (MDI) ไม่ใช่หลังพ่น"],
          k: "ICS → บ้วนปากหลังใช้ยา ± spacer ลด oral thrush และเสียงแหบ",
        },
        {
          d: "medium",
          p: "หากใช้ budesonide/formoterol 160/4.5 mcg ทั้งเป็นยาควบคุมและบรรเทาอาการ (MART) ขนาดสูงสุดต่อวันสำหรับผู้ใหญ่คือเท่าใด?",
          o: ["4 inhalations", "6 inhalations", "8 inhalations", "12 inhalations", "20 inhalations"],
          a: 3,
          r: "Budesonide/formoterol 160/4.5 mcg ใช้ได้สูงสุดรวม 12 inhalations/วัน (formoterol 54 mcg delivered dose) ในผู้ใหญ่ ถ้าต้องใช้บ่อยเกินควรมาพบแพทย์เพื่อประเมิน",
          w: ["ต่ำกว่าขนาดสูงสุดที่ใช้ได้", "ต่ำกว่าขนาดสูงสุดที่ใช้ได้", "ยังไม่ใช่ขนาดสูงสุด (ถ้าต้องใช้เกิน 8 inhalations/วัน ควรมาพบแพทย์)", "ถูก", "เกินขนาดสูงสุด เสี่ยง ADR จาก beta-agonist"],
          k: "ICS-formoterol (MART/as-needed): สูงสุด 12 inhalations/วัน (budesonide/formoterol 160/4.5)",
        },
        {
          d: "medium",
          p: "1 ปีต่อมาผู้ป่วยตั้งครรภ์ 8 สัปดาห์ อาการหืดคุมได้ดีด้วย budesonide/formoterol ถามว่าควรหยุดยาหรือไม่ คำแนะนำใดเหมาะสมที่สุด?",
          o: [
            "ใช้ยาต่อ เพราะการคุมหืดไม่ได้อันตรายต่อทารกมากกว่ายา",
            "หยุดยาทั้งหมดตลอดไตรมาสแรก",
            "เปลี่ยนเป็น salbutamol อย่างเดียว",
            "เปลี่ยนเป็น prednisolone รับประทานแทนยาพ่น",
            "ลดเป็นพ่นเฉพาะช่วงไตรมาสที่ 3",
          ],
          a: 0,
          r: "หืดที่คุมไม่ได้ขณะตั้งครรภ์เพิ่มความเสี่ยง preeclampsia คลอดก่อนกำหนด และทารกน้ำหนักน้อย. ICS (budesonide มีข้อมูลความปลอดภัยมากที่สุด) และ LABA ใช้ต่อได้ ไม่ควรหยุดยาเอง",
          w: ["ถูก", "เสี่ยงหืดกำเริบซึ่งอันตรายต่อทั้งแม่และทารก", "SABA-only เพิ่มความเสี่ยงอาการกำเริบ", "Systemic steroid มี ADR มากกว่า ไม่ใช่ยาควบคุมระยะยาว", "หืดอาจกำเริบระหว่างหยุดยา"],
          k: "หืดขณะตั้งครรภ์: ใช้ ICS/ICS-LABA ต่อ; budesonide มีข้อมูลมากที่สุด",
        },
      ],
    },
    {
      ref: "Theophylline and ciprofloxacin prescribing information",
      qs: [
        {
          d: "medium",
          p: "ผู้ป่วย COPD ใช้ theophylline SR 200 mg BID ระดับยา 12 mg/L ได้รับ ciprofloxacin 500 mg BID สำหรับ UTI 3 วันต่อมามีคลื่นไส้ อาเจียน ใจสั่น กลไกที่อธิบายได้ดีที่สุดคือข้อใด?",
          o: [
            "Ciprofloxacin ยับยั้ง CYP1A2 ทำให้ระดับ theophylline สูงขึ้น",
            "Ciprofloxacin เร่ง CYP1A2 ทำให้ระดับ theophylline ลดลง",
            "Ciprofloxacin แย่งจับ protein กับ theophylline",
            "Ciprofloxacin ลดการขับ theophylline ทางไตโดยยับยั้ง OAT",
            "เป็น ADR ของ ciprofloxacin เพียงอย่างเดียว ไม่เกี่ยวกับ theophylline",
          ],
          a: 0,
          r: "Theophylline ถูกเปลี่ยนแปลงผ่าน CYP1A2 เป็นหลักและมีช่วงการรักษาแคบ (10–20 mg/L). Ciprofloxacin (และ fluvoxamine) ยับยั้ง CYP1A2 ทำให้ระดับยาสูง เกิดคลื่นไส้ tachyarrhythmia จนถึงชัก ควรเลือกยาต้านจุลชีพอื่นหรือลดขนาด theophylline และตรวจระดับยา",
          w: ["ถูก", "Ciprofloxacin เป็น inhibitor ไม่ใช่ inducer", "ไม่ใช่กลไกหลัก", "Theophylline ขับทางตับเป็นหลัก", "อาการเข้าได้กับ theophylline toxicity"],
          k: "Theophylline (CYP1A2, NTI) + ciprofloxacin/fluvoxamine → toxicity; บุหรี่เร่ง CYP1A2 → ระดับลด",
        },
      ],
    },
    {
      ref: "GOLD 2024 Global Strategy for the Diagnosis, Management and Prevention of COPD",
      qs: [
        {
          d: "hard",
          p: "ชายอายุ 66 ปี COPD ใช้ tiotropium/olodaterol ถูกวิธีและสม่ำเสมอ ปีที่ผ่านมามีอาการกำเริบต้องนอนโรงพยาบาล 1 ครั้งและรักษาแบบผู้ป่วยนอกอีก 1 ครั้ง. blood eosinophil 350 cells/µL เลิกบุหรี่แล้ว การปรับยาที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "เพิ่ม ICS เป็น LABA/LAMA/ICS",
            "เปลี่ยนเป็น LABA/ICS แทน",
            "เพิ่ม roflumilast",
            "เพิ่ม azithromycin 250 mg OD",
            "เพิ่ม prednisolone 5 mg OD ระยะยาว",
          ],
          a: 0,
          r: "GOLD 2024: ผู้ที่ยังกำเริบขณะใช้ LABA/LAMA และมี eosinophil ≥100 cells/µL (ยิ่ง ≥300 ยิ่งได้ประโยชน์มาก) → escalate เป็น LABA/LAMA/ICS. Roflumilast (FEV1 <50% + chronic bronchitis) และ azithromycin (โดยเฉพาะผู้ที่เลิกบุหรี่แล้ว) พิจารณาเมื่อ eosinophil <100 หรือยังกำเริบหลังได้ triple therapy",
          w: ["ถูก", "ไม่แนะนำ LABA/ICS ใน COPD เพราะด้อยกว่าและตัด LAMA ออก", "ใช้เมื่อ eosinophil <100 หรือหลัง triple therapy แล้ว และต้องมี chronic bronchitis + FEV1 <50%", "พิจารณาเมื่อ eosinophil <100 หรือยังกำเริบหลัง triple therapy", "Systemic steroid ระยะยาวไม่แนะนำ ADR มาก"],
          k: "COPD กำเริบขณะใช้ LABA/LAMA + eos ≥100 (โดยเฉพาะ ≥300) → LABA/LAMA/ICS",
        },
      ],
    },
  ],
};
