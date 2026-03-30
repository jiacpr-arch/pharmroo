const { createClient } = require("@libsql/client");
const { randomUUID } = require("crypto");
require("dotenv").config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const SUBJECT_ID = "beee26b1-72c2-4c70-be73-24d7fa036f19"; // จิตเวช

const questions = [
  {
    question: "ผู้ป่วยชายอายุ 25 ปี วินิจฉัย Schizophrenia รับ Haloperidol อยู่ 4 สัปดาห์ พบอาการ Akathisia ข้อใดอธิบาย Akathisia ได้ถูกต้องที่สุด",
    choices: [
      { label: "A", text: "กล้ามเนื้อคอบิด (torticollis)" },
      { label: "B", text: "ความรู้สึกอยู่ไม่สุข ต้องขยับตัวตลอดเวลา" },
      { label: "C", text: "กล้ามเนื้อแข็งเกร็งทั้งตัว" },
      { label: "D", text: "การเคลื่อนไหวผิดปกติช้าๆ ของปากและลิ้น" },
      { label: "E", text: "อาการสั่นขณะพัก (resting tremor)" },
    ],
    correct_answer: "B",
    explanation: "Akathisia คือความรู้สึกกระวนกระวาย อยู่ไม่สุข จำเป็นต้องเดินหรือขยับตัวตลอดเวลา เป็น EPS ที่พบบ่อยจาก antipsychotics รักษาด้วย propranolol หรือ benzodiazepine",
    detailed_explanation: {
      summary: "EPS จาก antipsychotics แบ่งเป็น 4 ชนิด: Akathisia, Acute dystonia, Parkinsonism, Tardive dyskinesia",
      reason: "Akathisia: ความรู้สึก subjective restlessness ต้องการเคลื่อนไหว | Acute dystonia: กล้ามเนื้อหดเกร็งเฉียบพลัน (torticollis, oculogyric crisis) | Drug-induced Parkinsonism: bradykinesia, rigidity, tremor | Tardive dyskinesia: การเคลื่อนไหวช้าๆ ผิดปกติของปาก ลิ้น ใบหน้า (ระยะยาว)",
      choices: [
        { label: "A", text: "กล้ามเนื้อคอบิด (torticollis)", explanation: "✗ ผิด — Torticollis เป็น acute dystonia ไม่ใช่ akathisia" },
        { label: "B", text: "ความรู้สึกอยู่ไม่สุข ต้องขยับตัวตลอดเวลา", explanation: "✓ ถูก — คำนิยามของ akathisia: subjective restlessness + objective motor restlessness" },
        { label: "C", text: "กล้ามเนื้อแข็งเกร็งทั้งตัว", explanation: "✗ ผิด — Rigidity เป็นอาการของ drug-induced Parkinsonism หรือ NMS" },
        { label: "D", text: "การเคลื่อนไหวผิดปกติช้าๆ ของปากและลิ้น", explanation: "✗ ผิด — Tardive dyskinesia: choreoathetoid movement ของปาก ลิ้น หลังใช้ยานาน" },
        { label: "E", text: "อาการสั่นขณะพัก (resting tremor)", explanation: "✗ ผิด — Resting tremor เป็นอาการของ drug-induced Parkinsonism" },
      ],
      key_takeaway: "Akathisia รักษา: Propranolol 10-40 mg/day (first-line) หรือ benzodiazepine | ไม่ใช่ lorazepam IM อย่าง acute dystonia",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยรับ Clozapine 300 mg/day มา 6 เดือน การติดตามที่สำคัญที่สุดในผู้ป่วยรายนี้คือ",
    choices: [
      { label: "A", text: "ตรวจ LFT ทุก 3 เดือน" },
      { label: "B", text: "ตรวจ CBC โดยเฉพาะ WBC และ ANC อย่างสม่ำเสมอ" },
      { label: "C", text: "ตรวจ renal function ทุกเดือน" },
      { label: "D", text: "ตรวจ ECG ทุก 6 เดือน" },
      { label: "E", text: "ตรวจ thyroid function ทุก 3 เดือน" },
    ],
    correct_answer: "B",
    explanation: "Clozapine เสี่ยง agranulocytosis (~1-2%) ซึ่งอาจถึงตาย ต้องตรวจ CBC/WBC/ANC ตาม schedule: ทุกสัปดาห์ 6 เดือนแรก → ทุก 2 สัปดาห์ 6 เดือนต่อมา → ทุกเดือน",
    detailed_explanation: {
      summary: "Clozapine: ต้อง monitor CBC เพื่อตรวจ agranulocytosis ซึ่งเป็น black box warning",
      reason: "Clozapine ทำให้ agranulocytosis: ANC < 500/mm³ ต้องหยุดยาทันที ใน 6 เดือนแรกเสี่ยงสูงที่สุด ถ้า WBC < 3,000 หรือ ANC < 1,500 ให้ monitor ถี่ขึ้น ถ้า ANC < 1,000 ให้หยุดยา REMS program บังคับให้ monitor CBC ก่อนจ่ายยา",
      choices: [
        { label: "A", text: "ตรวจ LFT ทุก 3 เดือน", explanation: "✗ ผิด — LFT ไม่ใช่ priority หลักของ clozapine (แม้จะมี hepatotoxicity บ้าง)" },
        { label: "B", text: "ตรวจ CBC โดยเฉพาะ WBC และ ANC อย่างสม่ำเสมอ", explanation: "✓ ถูก — Agranulocytosis เป็น life-threatening ADR ของ clozapine ต้อง monitor CBC ตาม schedule" },
        { label: "C", text: "ตรวจ renal function ทุกเดือน", explanation: "✗ ผิด — Clozapine ไม่ toxic ต่อไตโดยตรง" },
        { label: "D", text: "ตรวจ ECG ทุก 6 เดือน", explanation: "✗ ผิด — Clozapine อาจยืด QTc แต่ไม่ใช่ priority หลักเท่า agranulocytosis" },
        { label: "E", text: "ตรวจ thyroid function ทุก 3 เดือน", explanation: "✗ ผิด — ไม่ใช่ required monitoring สำหรับ clozapine" },
      ],
      key_takeaway: "Clozapine monitoring: CBC สัปดาห์ละครั้ง ×6 เดือน → 2 สัปดาห์ครั้ง ×6 เดือน → เดือนละครั้ง | หยุดทันทีถ้า ANC < 1,000",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยรับ Lithium เพื่อรักษา Bipolar disorder ระดับ Lithium ในเลือด = 2.5 mEq/L อาการใดที่ต้องระวังมากที่สุด",
    choices: [
      { label: "A", text: "Polyuria และ Polydipsia" },
      { label: "B", text: "น้ำหนักขึ้น" },
      { label: "C", text: "Tremor มือละเอียด" },
      { label: "D", text: "ชัก สับสน หมดสติ (Lithium toxicity รุนแรง)" },
      { label: "E", text: "ผื่นสิว" },
    ],
    correct_answer: "D",
    explanation: "ระดับ Lithium > 2.0 mEq/L คือ severe toxicity มีอาการ neurotoxicity รุนแรง: seizure, confusion, coma อาจเสียชีวิตได้ ต้องหยุดยาและรักษาสนับสนุนทันที ระดับ therapeutic = 0.6-1.2 mEq/L",
    detailed_explanation: {
      summary: "Lithium toxicity: >1.5 mild, >2.0 moderate-severe (neuro toxic), >3.0 life-threatening",
      reason: "Lithium therapeutic range: 0.6-1.2 mEq/L (acute mania: 0.8-1.2) | 1.5-2.0: mild (tremor, GI, confusion) | 2.0-2.5: moderate (ataxia, slurred speech, marked confusion) | >2.5: severe (seizure, coma, death) รักษา: IV NS + hemodialysis ถ้า severe",
      choices: [
        { label: "A", text: "Polyuria และ Polydipsia", explanation: "✗ ผิด — เป็น SE ที่พบบ่อยในการใช้ lithium ระยะยาว (nephrogenic DI) ไม่ใช่ฉุกเฉิน" },
        { label: "B", text: "น้ำหนักขึ้น", explanation: "✗ ผิด — เป็น SE ที่พบบ่อยแต่ไม่อันตราย" },
        { label: "C", text: "Tremor มือละเอียด", explanation: "✗ ผิด — Fine tremor เป็น SE ปกติของ lithium ระดับ therapeutic" },
        { label: "D", text: "ชัก สับสน หมดสติ (Lithium toxicity รุนแรง)", explanation: "✓ ถูก — Lithium 2.5 mEq/L = severe toxicity ต้องรักษาฉุกเฉิน hemodialysis" },
        { label: "E", text: "ผื่นสิว", explanation: "✗ ผิด — Acne เป็น SE ทางผิวหนังของ lithium ไม่อันตราย" },
      ],
      key_takeaway: "Lithium toxic range: >2.0 mEq/L → neurologic emergency | Rx: หยุดยา + IV NS + dialysis | ป้องกัน: monitor level ทุก 3-6 เดือน",
    },
    difficulty: "hard",
  },
  {
    question: "ผู้ป่วยหญิงอายุ 32 ปี วินิจฉัย Major Depressive Disorder ยาต้านเศร้ากลุ่มใดที่เป็น first-line treatment",
    choices: [
      { label: "A", text: "Tricyclic antidepressants (TCA)" },
      { label: "B", text: "Monoamine oxidase inhibitors (MAOI)" },
      { label: "C", text: "Selective serotonin reuptake inhibitors (SSRI)" },
      { label: "D", text: "Typical antipsychotics" },
      { label: "E", text: "Benzodiazepines" },
    ],
    correct_answer: "C",
    explanation: "SSRI เป็น first-line สำหรับ MDD เนื่องจากมีประสิทธิภาพดี ผลข้างเคียงน้อยกว่า TCA ปลอดภัยใน overdose และใช้ง่ายกว่า MAOI",
    detailed_explanation: {
      summary: "MDD first-line: SSRI (fluoxetine, sertraline, escitalopram) หรือ SNRI",
      reason: "SSRI: serotoninergic specific ผลข้างเคียงน้อย ปลอดภัยใน overdose ใช้ครั้งเดียวต่อวัน | TCA: anticholinergic, antihistamine, alpha-blocking มี cardiac toxicity ใน overdose | MAOI: food and drug interaction มาก (tyramine reaction) ใช้เป็น last resort | Benzo: ไม่ใช่ antidepressant ใช้สำหรับ anxiety",
      choices: [
        { label: "A", text: "Tricyclic antidepressants (TCA)", explanation: "✗ ผิด — มีผลข้างเคียงมาก (anticholinergic, cardiac) อันตรายใน overdose ใช้เป็น second-line" },
        { label: "B", text: "Monoamine oxidase inhibitors (MAOI)", explanation: "✗ ผิด — interaction มาก (tyramine → hypertensive crisis) ใช้เป็น last resort" },
        { label: "C", text: "Selective serotonin reuptake inhibitors (SSRI)", explanation: "✓ ถูก — First-line: ประสิทธิภาพดี ปลอดภัย ผลข้างเคียงน้อย" },
        { label: "D", text: "Typical antipsychotics", explanation: "✗ ผิด — ใช้รักษา psychosis ไม่ใช่ first-line ใน MDD (ยกเว้น psychotic depression)" },
        { label: "E", text: "Benzodiazepines", explanation: "✗ ผิด — ไม่ใช่ antidepressant อาจใช้ระยะสั้นสำหรับ anxiety/insomnia ร่วม" },
      ],
      key_takeaway: "MDD first-line: SSRI/SNRI | ระยะเวลาขั้นต่ำ 6-9 เดือน | ประเมิน suicide risk ทุกครั้ง",
    },
    difficulty: "easy",
  },
  {
    question: "ผู้ป่วยรับ Fluoxetine มาแล้ว 3 วัน พบอาการ: ไข้ ชัก กล้ามเนื้อกระตุก (myoclonus) เหงื่อออกมาก ใจสั่น ควรนึกถึงภาวะใดก่อน",
    choices: [
      { label: "A", text: "Neuroleptic Malignant Syndrome (NMS)" },
      { label: "B", text: "Serotonin Syndrome" },
      { label: "C", text: "Anticholinergic toxicity" },
      { label: "D", text: "SSRI discontinuation syndrome" },
      { label: "E", text: "Tardive dyskinesia" },
    ],
    correct_answer: "B",
    explanation: "Serotonin syndrome เกิดจาก serotonin excess ใน CNS อาการ: mental status change + autonomic instability + neuromuscular abnormality (myoclonus, hyperreflexia, clonus) มักเกิดภายใน 24 ชั่วโมง",
    detailed_explanation: {
      summary: "Serotonin syndrome: triad = altered mental status + autonomic instability + neuromuscular findings",
      reason: "Hunter criteria สำหรับ Serotonin syndrome: clonus (spontaneous/inducible/ocular) + agitation/diaphoresis + tremor + hyperreflexia | เกิดจาก: SSRI+MAOI, SSRI+Tramadol, SSRI+Triptan, SSRI+Linezolid | รักษา: หยุดยา, cyproheptadine, benzodiazepine, supportive",
      choices: [
        { label: "A", text: "Neuroleptic Malignant Syndrome (NMS)", explanation: "✗ ผิด — NMS เกิดจาก antipsychotics: ไข้สูง, rigidity (lead-pipe), altered consciousness, elevated CPK, autonomic instability เริ่มช้ากว่า (วัน-สัปดาห์)" },
        { label: "B", text: "Serotonin Syndrome", explanation: "✓ ถูก — ไข้ + myoclonus + diaphoresis + tachycardia หลังเริ่ม SSRI = serotonin syndrome" },
        { label: "C", text: "Anticholinergic toxicity", explanation: "✗ ผิด — Anticholinergic: dry (ปากแห้ง ผิวแห้ง), hot, blind, mad, tachycardia ไม่มี myoclonus" },
        { label: "D", text: "SSRI discontinuation syndrome", explanation: "✗ ผิด — เกิดเมื่อ หยุดยาเร็ว ไม่ใช่เริ่มยา อาการ: FINISH (Flu-like, Insomnia, Nausea, Imbalance, Sensory disturbance, Hyperarousal)" },
        { label: "E", text: "Tardive dyskinesia", explanation: "✗ ผิด — TD เกิดหลังใช้ antipsychotics นาน ไม่ใช่ SSRI และไม่มีไข้" },
      ],
      key_takeaway: "Serotonin syndrome: ใน 24hr หลังเพิ่ม serotonergic drug | NMS: ในสัปดาห์หลังเริ่ม/เปลี่ยน antipsychotic | แยกด้วย: Rigidity (NMS) vs Myoclonus/clonus (SS)",
    },
    difficulty: "hard",
  },
  {
    question: "ยาต้านซึมเศร้าชนิดใดที่เหมาะสมที่สุดสำหรับผู้ป่วย MDD ที่มี neuropathic pain ร่วมด้วย",
    choices: [
      { label: "A", text: "Fluoxetine" },
      { label: "B", text: "Sertraline" },
      { label: "C", text: "Duloxetine (SNRI)" },
      { label: "D", text: "Escitalopram" },
      { label: "E", text: "Fluvoxamine" },
    ],
    correct_answer: "C",
    explanation: "Duloxetine (SNRI) มีข้อบ่งใช้ทั้ง MDD และ neuropathic pain (diabetic peripheral neuropathy, fibromyalgia) เนื่องจากยับยั้งทั้ง serotonin และ norepinephrine reuptake",
    detailed_explanation: {
      summary: "SNRI (duloxetine, venlafaxine) มีประโยชน์ทั้ง depression และ pain conditions",
      reason: "Duloxetine FDA approved: MDD, GAD, Diabetic peripheral neuropathy, Fibromyalgia, Chronic musculoskeletal pain | Norepinephrine pathway สำคัญในการควบคุมความเจ็บปวด SSRI อย่างเดียว (fluoxetine, sertraline) ไม่มี indication สำหรับ pain",
      choices: [
        { label: "A", text: "Fluoxetine", explanation: "✗ ผิด — SSRI ไม่มี indication ใน neuropathic pain" },
        { label: "B", text: "Sertraline", explanation: "✗ ผิด — SSRI เช่นกัน ไม่มีหลักฐานใน neuropathic pain" },
        { label: "C", text: "Duloxetine (SNRI)", explanation: "✓ ถูก — FDA approved ทั้ง MDD และ diabetic neuropathy/fibromyalgia" },
        { label: "D", text: "Escitalopram", explanation: "✗ ผิด — SSRI ไม่มี indication ใน pain" },
        { label: "E", text: "Fluvoxamine", explanation: "✗ ผิด — SSRI ใช้หลักใน OCD ไม่มี indication ใน pain" },
      ],
      key_takeaway: "Pain + Depression: Duloxetine (SNRI) ดีที่สุด | TCAs (amitriptyline) ก็ใช้ได้แต่ SE มากกว่า | Pregabalin/Gabapentin ใช้สำหรับ pain โดยเฉพาะ",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วย Bipolar I disorder ในระยะ acute manic episode ยาที่เป็น first-line treatment คือ",
    choices: [
      { label: "A", text: "Antidepressant (SSRI)" },
      { label: "B", text: "Lithium หรือ Valproate ± Antipsychotic" },
      { label: "C", text: "Benzodiazepine เพียงอย่างเดียว" },
      { label: "D", text: "Carbamazepine เป็นยาเดี่ยว" },
      { label: "E", text: "Haloperidol เพียงอย่างเดียว" },
    ],
    correct_answer: "B",
    explanation: "Acute mania: Lithium หรือ Valproate (mood stabilizer) ± Antipsychotic (olanzapine/risperidone/quetiapine) เป็น first-line ห้ามให้ antidepressant เพียงอย่างเดียวเพราะอาจ trigger mania",
    detailed_explanation: {
      summary: "Bipolar mania first-line: Mood stabilizer (Li/VPA) ± Atypical antipsychotic",
      reason: "Acute mania รุนแรง: Lithium + Antipsychotic หรือ Valproate + Antipsychotic | ไม่รุนแรง: Lithium หรือ Valproate เดี่ยว | Antidepressant ห้ามใช้ใน mania เพราะทำให้ worse | Carbamazepine: alternative แต่ drug interaction มาก | Benzodiazepine: ช่วย agitation แต่ไม่ใช่ definitive treatment",
      choices: [
        { label: "A", text: "Antidepressant (SSRI)", explanation: "✗ ผิด — ห้ามใช้ใน acute mania! อาจ trigger switch เป็น mania หนักขึ้น" },
        { label: "B", text: "Lithium หรือ Valproate ± Antipsychotic", explanation: "✓ ถูก — First-line ตาม guideline: mood stabilizer ± atypical antipsychotic" },
        { label: "C", text: "Benzodiazepine เพียงอย่างเดียว", explanation: "✗ ผิด — Benzo ช่วย agitation แต่ไม่ใช่ mood stabilizer ไม่เพียงพอ" },
        { label: "D", text: "Carbamazepine เป็นยาเดี่ยว", explanation: "✗ ผิด — Carbamazepine เป็น alternative แต่ไม่ใช่ first-line มี drug interaction มาก" },
        { label: "E", text: "Haloperidol เพียงอย่างเดียว", explanation: "✗ ผิด — Antipsychotic เดี่ยวโดยไม่มี mood stabilizer ไม่เพียงพอสำหรับ bipolar" },
      ],
      key_takeaway: "Bipolar mania: Lithium/Valproate + Atypical antipsychotic | Maintenance: Lithium (gold standard) | ห้าม antidepressant เดี่ยว",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยชายอายุ 28 ปี วินิจฉัย Generalized Anxiety Disorder (GAD) ยาที่เป็น first-line treatment ที่เหมาะสมที่สุดคือ",
    choices: [
      { label: "A", text: "Alprazolam ระยะยาว" },
      { label: "B", text: "SSRI (เช่น Escitalopram) หรือ SNRI" },
      { label: "C", text: "Haloperidol" },
      { label: "D", text: "Phenobarbital" },
      { label: "E", text: "Hydroxyzine เป็นยาหลัก" },
    ],
    correct_answer: "B",
    explanation: "SSRI/SNRI เป็น first-line สำหรับ GAD ระยะยาว Benzodiazepine ใช้ระยะสั้นเท่านั้น (< 4 สัปดาห์) เพราะเสี่ยง dependence",
    detailed_explanation: {
      summary: "GAD first-line: SSRI/SNRI (long-term) | Benzo: short-term adjunct เท่านั้น",
      reason: "SSRI (sertraline, escitalopram) และ SNRI (venlafaxine, duloxetine) FDA approved ใน GAD ปลอดภัย ใช้ระยะยาว | Buspirone: non-benzo anxiolytic ใช้ GAD ได้แต่ onset ช้า 2-4 สัปดาห์ | Benzodiazepine: ใช้ระยะสั้นช่วง gap ก่อน SSRI/SNRI ออกฤทธิ์ เสี่ยง dependence และ cognitive impairment",
      choices: [
        { label: "A", text: "Alprazolam ระยะยาว", explanation: "✗ ผิด — Benzodiazepine ระยะยาวเสี่ยง dependence, tolerance, cognitive impairment ไม่แนะนำ" },
        { label: "B", text: "SSRI (เช่น Escitalopram) หรือ SNRI", explanation: "✓ ถูก — First-line สำหรับ GAD ระยะยาว ปลอดภัย ไม่เสี่ยง dependence" },
        { label: "C", text: "Haloperidol", explanation: "✗ ผิด — Antipsychotic ไม่ใช่ treatment สำหรับ GAD" },
        { label: "D", text: "Phenobarbital", explanation: "✗ ผิด — Barbiturate ไม่ใช่ยา anxiety ในปัจจุบัน อันตรายและเสี่ยง dependence สูง" },
        { label: "E", text: "Hydroxyzine เป็นยาหลัก", explanation: "✗ ผิด — Hydroxyzine (antihistamine) ช่วย anxiety ได้บ้างแต่ไม่ใช่ first-line ทำให้ง่วงมาก" },
      ],
      key_takeaway: "GAD first-line: SSRI/SNRI (ระยะยาว) | Buspirone: alternative | Benzo: short-term adjunct เท่านั้น",
    },
    difficulty: "easy",
  },
  {
    question: "Risperidone ต่างจาก Haloperidol (typical antipsychotic) อย่างไร",
    choices: [
      { label: "A", text: "Risperidone มีประสิทธิภาพน้อยกว่า" },
      { label: "B", text: "Risperidone มี EPS น้อยกว่าและรักษา negative symptoms ได้ดีกว่า" },
      { label: "C", text: "Risperidone ไม่ทำให้ QTc ยืดเลย" },
      { label: "D", text: "Risperidone ไม่มีผลต่อ dopamine" },
      { label: "E", text: "Risperidone ปลอดภัยกว่าในผู้ป่วยสูงอายุ" },
    ],
    correct_answer: "B",
    explanation: "Atypical antipsychotics (Risperidone, Olanzapine, Quetiapine) มี EPS น้อยกว่า typical (Haloperidol, Chlorpromazine) และรักษา negative symptoms (alogia, avolition, flat affect) ของ schizophrenia ได้ดีกว่า",
    detailed_explanation: {
      summary: "Atypical vs Typical antipsychotic: Atypical มี EPS น้อย + ดีกว่าสำหรับ negative symptoms",
      reason: "Typical (D2 blocker): EPS สูง, ไม่ช่วย negative symptoms | Atypical (D2+5HT2A blocker): EPS น้อย, ช่วย negative symptoms, แต่มี metabolic side effects (น้ำหนักขึ้น, DM, dyslipidemia) | Risperidone ยังมี EPS มากกว่า quetiapine/olanzapine เมื่อใช้ขนาดสูง",
      choices: [
        { label: "A", text: "Risperidone มีประสิทธิภาพน้อยกว่า", explanation: "✗ ผิด — Atypical มีประสิทธิภาพเทียบเท่าหรือดีกว่า typical สำหรับ positive symptoms" },
        { label: "B", text: "Risperidone มี EPS น้อยกว่าและรักษา negative symptoms ได้ดีกว่า", explanation: "✓ ถูก — จุดเด่นหลักของ atypical antipsychotics" },
        { label: "C", text: "Risperidone ไม่ทำให้ QTc ยืดเลย", explanation: "✗ ผิด — Risperidone ก็ยืด QTc ได้ (น้อยกว่า haloperidol IV แต่ก็มี)" },
        { label: "D", text: "Risperidone ไม่มีผลต่อ dopamine", explanation: "✗ ผิด — Risperidone บล็อก D2 receptor เช่นกัน แต่บล็อก 5HT2A ด้วย" },
        { label: "E", text: "Risperidone ปลอดภัยกว่าในผู้ป่วยสูงอายุ", explanation: "✗ ผิด — ทั้ง typical และ atypical เพิ่มความเสี่ยง stroke/mortality ในผู้สูงอายุที่มี dementia" },
      ],
      key_takeaway: "Atypical AP: EPS น้อย + negative symptoms ดีกว่า แต่แลกกับ metabolic syndrome | Clozapine: most effective แต่ agranulocytosis",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยรับ Antipsychotic มาได้ 2 ปี พบอาการขยับปากซ้ำๆ ดูดปาก ขยับลิ้น โดยที่ผู้ป่วยไม่ทราบตัว ควรวินิจฉัยว่าอะไร และรักษาอย่างไร",
    choices: [
      { label: "A", text: "Acute dystonia รักษาด้วย Diphenhydramine IM" },
      { label: "B", text: "Tardive dyskinesia รักษาด้วย Valbenazine หรือ Deutetrabenazine" },
      { label: "C", text: "Akathisia รักษาด้วย Propranolol" },
      { label: "D", text: "Parkinsonism รักษาด้วย Trihexyphenidyl" },
      { label: "E", text: "Serotonin syndrome รักษาด้วย Cyproheptadine" },
    ],
    correct_answer: "B",
    explanation: "Tardive dyskinesia (TD): การเคลื่อนไหวผิดปกติของปาก ลิ้น ใบหน้า แบบ choreoathetoid โดยผู้ป่วยไม่รู้ตัว หลังใช้ dopamine blocker นาน ≥3 เดือน รักษาด้วย VMAT2 inhibitor (Valbenazine, Deutetrabenazine)",
    detailed_explanation: {
      summary: "Tardive dyskinesia: involuntary choreoathetoid movement ปาก/ลิ้น/ใบหน้า หลังใช้ antipsychotic นาน",
      reason: "TD เกิดจาก D2 receptor upregulation หลัง chronic blockade อาการ: lip smacking, tongue protrusion, facial grimacing, choreoathetoid limb movement ผู้ป่วยมักไม่รู้ตัว | AIMS scale ประเมิน | รักษา: VMAT2 inhibitor (valbenazine/deutetrabenazine) ลด dopamine release | ลด/เปลี่ยนเป็น atypical antipsychotic",
      choices: [
        { label: "A", text: "Acute dystonia รักษาด้วย Diphenhydramine IM", explanation: "✗ ผิด — Acute dystonia เกิดใน 4 วันแรก กล้ามเนื้อ spasm เฉียบพลัน ไม่ใช่ขยับซ้ำๆ" },
        { label: "B", text: "Tardive dyskinesia รักษาด้วย Valbenazine หรือ Deutetrabenazine", explanation: "✓ ถูก — TD: ขยับซ้ำๆ ไม่รู้ตัว หลัง antipsychotic นาน รักษาด้วย VMAT2i" },
        { label: "C", text: "Akathisia รักษาด้วย Propranolol", explanation: "✗ ผิด — Akathisia: รู้สึกอยู่ไม่สุข ต้องขยับ ผู้ป่วยรู้ตัว" },
        { label: "D", text: "Parkinsonism รักษาด้วย Trihexyphenidyl", explanation: "✗ ผิด — Drug-induced Parkinsonism: resting tremor, rigidity, bradykinesia ไม่ใช่ lip smacking" },
        { label: "E", text: "Serotonin syndrome รักษาด้วย Cyproheptadine", explanation: "✗ ผิด — Serotonin syndrome: ไข้ myoclonus เกิดเฉียบพลัน ไม่ใช่ chronic movement disorder" },
      ],
      key_takeaway: "TD: เกิดหลัง ≥3 เดือน involuntary movement | รักษา: Valbenazine/Deutetrabenazine (VMAT2i) | ป้องกัน: ใช้ atypical AP, ลด dose เป็นระยะ",
    },
    difficulty: "hard",
  },
  {
    question: "ผู้ป่วยได้รับยา Amitriptyline ผลข้างเคียงจากคุณสมบัติ Anticholinergic ที่พบบ่อยคือข้อใด",
    choices: [
      { label: "A", text: "ท้องเสีย น้ำลายไหลมาก" },
      { label: "B", text: "ปากแห้ง ท้องผูก ปัสสาวะขัด สายตาพร่า" },
      { label: "C", text: "น้ำหนักลด ขี้ร้อน" },
      { label: "D", text: "ความดันต่ำขณะออกกำลัง" },
      { label: "E", text: "เหงื่อออกมาก หัวใจเต้นช้า" },
    ],
    correct_answer: "B",
    explanation: "Anticholinergic effects (SLUD opposite): ปากแห้ง ท้องผูก ปัสสาวะขัด สายตาพร่า (mydriasis) ผิวแดงแห้งร้อน ใจสั่น สับสน (ในผู้สูงอายุ)",
    detailed_explanation: {
      summary: "Anticholinergic toxidrome: DUMB → Dry, Urinary retention, Mydriasis, Blurred vision + Bowel obstipation",
      reason: "Amitriptyline มี anticholinergic activity สูงมาก: ปากแห้ง ท้องผูก ปัสสาวะขัด สายตาพร่า ผิวแห้งแดง ใจสั่น hyperthermia delirium (ผู้สูงอายุ) | TCA ควรระวังในผู้สูงอายุ, BPH, narrow-angle glaucoma, ท้องผูกเรื้อรัง | Beers criteria: ห้ามใช้ TCA ใน elderly",
      choices: [
        { label: "A", text: "ท้องเสีย น้ำลายไหลมาก", explanation: "✗ ผิด — เป็น cholinergic effect (SLUD: Salivation, Lacrimation, Urination, Defecation) ตรงข้ามกับ anticholinergic" },
        { label: "B", text: "ปากแห้ง ท้องผูก ปัสสาวะขัด สายตาพร่า", explanation: "✓ ถูก — Classic anticholinergic side effects ของ amitriptyline/TCA" },
        { label: "C", text: "น้ำหนักลด ขี้ร้อน", explanation: "✗ ผิด — อาการของ hyperthyroidism ไม่ใช่ anticholinergic" },
        { label: "D", text: "ความดันต่ำขณะออกกำลัง", explanation: "✗ ผิด — Orthostatic hypotension ของ TCA เกิดจาก alpha-1 blockade ไม่ใช่ anticholinergic" },
        { label: "E", text: "เหงื่อออกมาก หัวใจเต้นช้า", explanation: "✗ ผิด — Anticholinergic ทำให้ เหงื่อออกน้อย และ tachycardia ไม่ใช่ bradycardia" },
      ],
      key_takeaway: "TCA anticholinergic: Dry mouth, Constipation, Urinary retention, Blurred vision, Tachycardia, Delirium | ระวังใน elderly, BPH, glaucoma",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยใช้ SSRI มา 2 สัปดาห์แล้วหยุดยาเองกะทันหัน พบอาการ ปวดหัว คลื่นไส้ รู้สึกเหมือนไฟฟ้าช็อต (electric shock sensation) วิงเวียน นึกถึงภาวะใด",
    choices: [
      { label: "A", text: "Serotonin syndrome" },
      { label: "B", text: "SSRI Discontinuation syndrome" },
      { label: "C", text: "MDD relapse" },
      { label: "D", text: "Anxiety attack" },
      { label: "E", text: "Hypoglycemia" },
    ],
    correct_answer: "B",
    explanation: "SSRI Discontinuation syndrome เกิดเมื่อหยุด SSRI กะทันหัน อาการ FINISH: Flu-like, Insomnia, Nausea, Imbalance, Sensory disturbance (brain zap), Hyperarousal/anxiety ใน 1-3 วัน",
    detailed_explanation: {
      summary: "SSRI Discontinuation: หยุดยาเร็ว → FINISH symptoms ใน 1-3 วัน",
      reason: "Brain zap (electric shock sensation) เป็นอาการ pathognomonic ของ SSRI discontinuation รักษา: reintroduce SSRI แล้วค่อย taper ช้าๆ Paroxetine และ Venlafaxine มี discontinuation syndrome บ่อยที่สุด (t½ สั้น) Fluoxetine น้อยที่สุด (t½ ยาวมาก ~4-6 วัน)",
      choices: [
        { label: "A", text: "Serotonin syndrome", explanation: "✗ ผิด — Serotonin syndrome เกิดเมื่อ serotonin สูงเกิน (เริ่มยา/เพิ่มยา) ไม่ใช่หยุดยา" },
        { label: "B", text: "SSRI Discontinuation syndrome", explanation: "✓ ถูก — Brain zap + คลื่นไส้ + วิงเวียน หลังหยุด SSRI กะทันหัน = classic discontinuation syndrome" },
        { label: "C", text: "MDD relapse", explanation: "✗ ผิด — MDD relapse ใช้เวลานานกว่า ไม่มี brain zap" },
        { label: "D", text: "Anxiety attack", explanation: "✗ ผิด — Panic attack ไม่มี brain zap และไม่สัมพันธ์กับการหยุดยา" },
        { label: "E", text: "Hypoglycemia", explanation: "✗ ผิด — Hypoglycemia: เหงื่อออก ใจสั่น สับสน ไม่มี brain zap" },
      ],
      key_takeaway: "SSRI หยุดเร็ว → FINISH | Brain zap = pathognomonic | Fluoxetine หยุดง่ายที่สุด (t½ ยาว) | Paroxetine/Venlafaxine หยุดยากที่สุด",
    },
    difficulty: "medium",
  },
  {
    question: "Valproate ใช้รักษาโรคใดได้บ้าง (เลือกที่ถูกต้องที่สุด)",
    choices: [
      { label: "A", text: "Bipolar disorder เท่านั้น" },
      { label: "B", text: "Epilepsy เท่านั้น" },
      { label: "C", text: "Bipolar disorder, Epilepsy และ Migraine prophylaxis" },
      { label: "D", text: "Schizophrenia และ Depression" },
      { label: "E", text: "GAD และ Panic disorder" },
    ],
    correct_answer: "C",
    explanation: "Valproate มี FDA approved indications หลายอย่าง: Epilepsy (complex partial, absence, generalized), Bipolar mania, Migraine prophylaxis นอกจากนี้ยังใช้ off-label ใน neuropathic pain",
    detailed_explanation: {
      summary: "Valproate: triple indication — Epilepsy + Bipolar mania + Migraine prevention",
      reason: "Valproate กลไก: เพิ่ม GABA, บล็อก sodium channel, บล็อก T-type Ca channel | Epilepsy: ทุกชนิดโดยเฉพาะ generalized | Bipolar: acute mania และ maintenance | Migraine prophylaxis: ลดความถี่ได้ 50% | ข้อห้าม: ตั้งครรภ์ (neural tube defects, teratogenic), โรคตับ",
      choices: [
        { label: "A", text: "Bipolar disorder เท่านั้น", explanation: "✗ ผิด — Valproate ใช้ทั้ง epilepsy และ migraine ด้วย" },
        { label: "B", text: "Epilepsy เท่านั้น", explanation: "✗ ผิด — ใช้ใน bipolar และ migraine prophylaxis ด้วย" },
        { label: "C", text: "Bipolar disorder, Epilepsy และ Migraine prophylaxis", explanation: "✓ ถูก — ครบ 3 indications หลักของ valproate" },
        { label: "D", text: "Schizophrenia และ Depression", explanation: "✗ ผิด — ไม่ใช่ indication ของ valproate" },
        { label: "E", text: "GAD และ Panic disorder", explanation: "✗ ผิด — Benzodiazepine/SSRI ใช้ใน anxiety disorders ไม่ใช่ valproate" },
      ],
      key_takeaway: "Valproate: Epilepsy + Bipolar mania + Migraine prevention | ห้ามใช้ตั้งครรภ์ (teratogenic: NTD, cognitive impairment in children)",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยรับ Olanzapine มา 6 เดือน พบว่าน้ำหนักขึ้น 8 kg ระดับน้ำตาลสูง ไขมันในเลือดสูง ควรติดตามอะไร",
    choices: [
      { label: "A", text: "CBC และ LFT" },
      { label: "B", text: "Metabolic parameters: น้ำหนัก BMI ระดับน้ำตาล HbA1c ไขมัน ความดัน" },
      { label: "C", text: "Renal function ทุกเดือน" },
      { label: "D", text: "Thyroid function ทุก 6 เดือน" },
      { label: "E", text: "ECG ทุก 3 เดือน" },
    ],
    correct_answer: "B",
    explanation: "Atypical antipsychotics โดยเฉพาะ Olanzapine และ Clozapine มีความเสี่ยงสูงสำหรับ metabolic syndrome ต้อง monitor น้ำหนัก, BMI, waist, FPG, HbA1c, lipid, BP ตาม ADA/APA guideline",
    detailed_explanation: {
      summary: "Olanzapine/Clozapine: Metabolic syndrome risk สูงที่สุดใน atypical AP group",
      reason: "ความเสี่ยง metabolic syndrome ของ atypical AP: Clozapine = Olanzapine > Quetiapine > Risperidone > Aripiprazole/Ziprasidone | Monitor: baseline → 4 สัปดาห์ → 8 สัปดาห์ → 12 สัปดาห์ → ทุก 3 เดือน: น้ำหนัก, FPG, lipid, BP | พิจารณาเปลี่ยนยาถ้า metabolic syndrome แย่ลง",
      choices: [
        { label: "A", text: "CBC และ LFT", explanation: "✗ ผิด — CBC สำคัญสำหรับ clozapine แต่ไม่ใช่ priority หลักสำหรับ olanzapine" },
        { label: "B", text: "Metabolic parameters: น้ำหนัก BMI ระดับน้ำตาล HbA1c ไขมัน ความดัน", explanation: "✓ ถูก — Metabolic syndrome monitoring เป็น priority หลักของ olanzapine" },
        { label: "C", text: "Renal function ทุกเดือน", explanation: "✗ ผิด — Olanzapine ไม่ toxic ต่อไตโดยตรง" },
        { label: "D", text: "Thyroid function ทุก 6 เดือน", explanation: "✗ ผิด — ไม่ใช่ required monitoring สำหรับ olanzapine" },
        { label: "E", text: "ECG ทุก 3 เดือน", explanation: "✗ ผิด — QTc monitoring สำคัญกว่าสำหรับ ziprasidone/haloperidol IV ไม่ใช่ olanzapine" },
      ],
      key_takeaway: "Olanzapine: Metabolic monitoring ทุก 3 เดือน | เสี่ยง DM/dyslipidemia สูง | พิจารณา switch เป็น aripiprazole ถ้า metabolic SE มาก",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยชายอายุ 30 ปี วินิจฉัย ADHD ยาที่เป็น first-line สำหรับผู้ใหญ่คือ",
    choices: [
      { label: "A", text: "Methylphenidate หรือ Amphetamine salts" },
      { label: "B", text: "Risperidone" },
      { label: "C", text: "Diazepam" },
      { label: "D", text: "Haloperidol" },
      { label: "E", text: "Sertraline" },
    ],
    correct_answer: "A",
    explanation: "Stimulants (Methylphenidate, Amphetamine) เป็น first-line สำหรับ ADHD ทั้งในเด็กและผู้ใหญ่ มีประสิทธิภาพสูงสุด ลด inattention และ hyperactivity ได้ดี Atomoxetine เป็น non-stimulant alternative",
    detailed_explanation: {
      summary: "ADHD first-line: Stimulants (Methylphenidate/Amphetamine) | Non-stimulant: Atomoxetine, Guanfacine",
      reason: "Methylphenidate: บล็อก DAT/NET → เพิ่ม DA/NE ใน PFC | Amphetamine: เพิ่ม release DA/NE | ประสิทธิภาพ effect size ~0.8 | Non-stimulant: Atomoxetine (SNRI-like), Guanfacine/Clonidine (alpha-2 agonist) ใช้ถ้า stimulant ไม่ได้ผล/ข้อห้าม | ข้อควรระวัง: ประวัติ substance abuse → Atomoxetine/non-stimulant ดีกว่า",
      choices: [
        { label: "A", text: "Methylphenidate หรือ Amphetamine salts", explanation: "✓ ถูก — Stimulants เป็น first-line ADHD ทุก guideline ประสิทธิภาพสูงสุด" },
        { label: "B", text: "Risperidone", explanation: "✗ ผิด — Antipsychotic ไม่ใช่ first-line ADHD ใช้เฉพาะถ้ามี comorbid mania/psychosis" },
        { label: "C", text: "Diazepam", explanation: "✗ ผิด — Benzodiazepine ไม่มีประสิทธิภาพใน ADHD อาจทำให้แย่ลง" },
        { label: "D", text: "Haloperidol", explanation: "✗ ผิด — Typical antipsychotic ไม่ใช่ treatment ADHD" },
        { label: "E", text: "Sertraline", explanation: "✗ ผิด — SSRI ไม่มีประสิทธิภาพใน ADHD (Bupropion มีหลักฐานมากกว่าแต่ก็ไม่ใช่ first-line)" },
      ],
      key_takeaway: "ADHD: Stimulants (MPH/AMPH) first-line | Atomoxetine: non-stimulant alternative | ระวัง substance abuse, cardiovascular, tic disorders",
    },
    difficulty: "easy",
  },
  {
    question: "ผู้ป่วยที่รับ MAOIs (Phenelzine) รับประทานอาหารที่มี Tyramine สูง (เนยแข็ง ไวน์แดง) จะเกิดอะไรขึ้น",
    choices: [
      { label: "A", text: "Hypoglycemia รุนแรง" },
      { label: "B", text: "Hypertensive crisis (Cheese reaction)" },
      { label: "C", text: "Serotonin syndrome" },
      { label: "D", text: "Hypotension รุนแรง" },
      { label: "E", text: "QTc prolongation" },
    ],
    correct_answer: "B",
    explanation: "MAOIs ยับยั้ง MAO-A ซึ่งย่อย Tyramine ในลำไส้และตับ เมื่อทาน Tyramine สูง → Tyramine สะสม → NE release มาก → Hypertensive crisis (severe headache, stroke risk)",
    detailed_explanation: {
      summary: "MAOI + Tyramine = Cheese reaction → Hypertensive crisis",
      reason: "MAO-A ปกติย่อย tyramine ก่อนเข้าระบบ เมื่อบล็อก MAO: tyramine เข้าเส้นเลือด → เข้าปลายประสาท sympathetic → displace NE → massive NE release → severe HTN → risk of hemorrhagic stroke | อาหาร tyramine สูง: aged cheese, cured meat, fermented food, red wine, beer | รักษา hypertensive crisis: Phentolamine IV (alpha-blocker)",
      choices: [
        { label: "A", text: "Hypoglycemia รุนแรง", explanation: "✗ ผิด — MAOI อาจมีผล glycemic แต่ไม่ใช่ interaction หลักกับ tyramine" },
        { label: "B", text: "Hypertensive crisis (Cheese reaction)", explanation: "✓ ถูก — Classic MAOI-Tyramine interaction: severe HTN, thunderclap headache, risk of stroke" },
        { label: "C", text: "Serotonin syndrome", explanation: "✗ ผิด — Serotonin syndrome เกิดจาก MAOI + serotonergic drug ไม่ใช่ tyramine" },
        { label: "D", text: "Hypotension รุนแรง", explanation: "✗ ผิด — Tyramine ทำให้ NE release มาก → ความดันสูง ไม่ใช่ต่ำ" },
        { label: "E", text: "QTc prolongation", explanation: "✗ ผิด — ไม่เกี่ยวกับ tyramine-MAOI interaction" },
      ],
      key_takeaway: "MAOI: ห้ามกิน tyramine-rich food (aged cheese, red wine, cured meat) | ห้ามใช้ร่วม serotonergic drugs (→ Serotonin syndrome) | Wash-out 14 วันก่อนเปลี่ยนยา",
    },
    difficulty: "hard",
  },
  {
    question: "ผู้ป่วยที่รับยา Haloperidol IM ฉุกเฉิน พบอาการ Oculogyric crisis (ตากลอกขึ้นข้างบน กล้ามเนื้อคอแข็ง) ควรรักษาด้วยอะไรทันที",
    choices: [
      { label: "A", text: "Propranolol 40 mg PO" },
      { label: "B", text: "Diphenhydramine 50 mg IV/IM หรือ Benztropine 2 mg IV/IM" },
      { label: "C", text: "Valbenazine PO" },
      { label: "D", text: "Clonazepam 2 mg PO" },
      { label: "E", text: "Flumazenil IV" },
    ],
    correct_answer: "B",
    explanation: "Oculogyric crisis เป็น acute dystonia ที่ต้องรักษาด้วย Anticholinergic drugs: Diphenhydramine (Benadryl) IV/IM หรือ Benztropine IV/IM ทำให้อาการหายภายในนาที",
    detailed_explanation: {
      summary: "Acute dystonia รักษาด้วย Anticholinergic (Diphenhydramine/Benztropine) IV/IM",
      reason: "Acute dystonia เกิดในช่วง 4 วันแรกของการใช้ D2 blocker dopamine ที่ถูกบล็อก → กล้ามเนื้อ hyper → sustained contraction (torticollis, opisthotonus, oculogyric crisis) รักษา: Diphenhydramine 50mg IV หรือ Benztropine 2mg IV ออกฤทธิ์เร็ว 5-10 นาที ควรให้ anticholinergic ป้องกันด้วยถ้าใช้ high-potency AP",
      choices: [
        { label: "A", text: "Propranolol 40 mg PO", explanation: "✗ ผิด — Propranolol ใช้สำหรับ akathisia ไม่ใช่ acute dystonia" },
        { label: "B", text: "Diphenhydramine 50 mg IV/IM หรือ Benztropine 2 mg IV/IM", explanation: "✓ ถูก — Anticholinergic IM/IV รักษา acute dystonia ได้ทันที" },
        { label: "C", text: "Valbenazine PO", explanation: "✗ ผิด — VMAT2i ใช้สำหรับ tardive dyskinesia ไม่ใช่ acute dystonia" },
        { label: "D", text: "Clonazepam 2 mg PO", explanation: "✗ ผิด — Benzodiazepine ช่วย akathisia แต่ไม่ใช่ first-line acute dystonia และ PO ช้าเกินไป" },
        { label: "E", text: "Flumazenil IV", explanation: "✗ ผิด — Flumazenil เป็น benzodiazepine antagonist ไม่เกี่ยวกับ EPS" },
      ],
      key_takeaway: "Acute dystonia: Diphenhydramine 50mg IV/IM หรือ Benztropine 2mg IV/IM → หายใน 5-10 นาที | ป้องกัน: ให้ benztropine ร่วมกับ high-potency AP",
    },
    difficulty: "medium",
  },
];

async function seed() {
  console.log(`Seeding ${questions.length} psychiatric questions...`);
  let count = 0;
  for (const q of questions) {
    const id = randomUUID();
    await client.execute({
      sql: `INSERT INTO mcq_questions
        (id, subject_id, exam_type, scenario, choices, correct_answer, explanation, detailed_explanation, difficulty, status)
        VALUES (?, ?, 'PLE-CC1', ?, ?, ?, ?, ?, ?, 'active')`,
      args: [id, SUBJECT_ID, q.question, JSON.stringify(q.choices), q.correct_answer, q.explanation, JSON.stringify(q.detailed_explanation), q.difficulty],
    });
    count++;
    console.log(`  ${count}. ${q.question.substring(0, 60)}...`);
  }
  console.log(`\nDone! ${count} questions inserted for จิตเวช`);
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
