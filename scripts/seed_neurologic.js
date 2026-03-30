const { createClient } = require("@libsql/client");
const { randomUUID } = require("crypto");
require("dotenv").config({ path: ".env.local" });

const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const SUBJECT_ID = "fb62e97d-dec1-4b47-b45f-617b2c03fb4d"; // ระบบประสาท

const questions = [
  {
    question: "ผู้ป่วยชายอายุ 65 ปี มีอาการสั่นขณะพัก (resting tremor) กล้ามเนื้อแข็งเกร็ง (rigidity) เดินช้า ก้าวเล็ก (bradykinesia) การวินิจฉัยและยาที่เหมาะสมคือ",
    choices: [
      { label: "A", text: "Essential tremor รักษาด้วย Propranolol" },
      { label: "B", text: "Parkinson's disease รักษาด้วย Levodopa/Carbidopa" },
      { label: "C", text: "Huntington's disease รักษาด้วย Tetrabenazine" },
      { label: "D", text: "Multiple sclerosis รักษาด้วย Interferon beta" },
      { label: "E", text: "Myasthenia gravis รักษาด้วย Pyridostigmine" },
    ],
    correct_answer: "B",
    explanation: "อาการ cardinal features ของ Parkinson's disease: resting tremor, rigidity, bradykinesia, postural instability รักษาด้วย Levodopa/Carbidopa (gold standard) ที่เพิ่ม dopamine ใน striatum",
    detailed_explanation: {
      summary: "Parkinson's disease: TRAP = Tremor(rest), Rigidity, Akinesia/Bradykinesia, Postural instability",
      reason: "Levodopa: precursor ของ dopamine ผ่าน BBB ได้ | Carbidopa: peripheral DOPA decarboxylase inhibitor ลด peripheral conversion → เพิ่ม levodopa เข้า CNS + ลด nausea | ยาอื่น: Dopamine agonists (pramipexole, ropinirole), MAO-B inhibitors (selegiline, rasagiline), Amantadine, Anticholinergics (สำหรับ tremor)",
      choices: [
        { label: "A", text: "Essential tremor รักษาด้วย Propranolol", explanation: "✗ ผิด — Essential tremor: action/postural tremor ไม่ใช่ resting tremor ไม่มี rigidity/bradykinesia" },
        { label: "B", text: "Parkinson's disease รักษาด้วย Levodopa/Carbidopa", explanation: "✓ ถูก — TRAP features + Levodopa/Carbidopa เป็น most effective treatment" },
        { label: "C", text: "Huntington's disease รักษาด้วย Tetrabenazine", explanation: "✗ ผิด — HD: chorea, cognitive decline, ถ่ายทอดทาง autosomal dominant ไม่มี resting tremor" },
        { label: "D", text: "Multiple sclerosis รักษาด้วย Interferon beta", explanation: "✗ ผิด — MS: relapsing-remitting neurologic symptoms, young adult, ไม่มี resting tremor" },
        { label: "E", text: "Myasthenia gravis รักษาด้วย Pyridostigmine", explanation: "✗ ผิด — MG: fatigable muscle weakness, ptosis, diplopia ไม่มี resting tremor/rigidity" },
      ],
      key_takeaway: "PD: Levodopa/Carbidopa = gold standard | เริ่มช้าเพื่อลด motor complications | Dopamine agonists: ใช้แทนในผู้ป่วยอายุน้อย",
    },
    difficulty: "easy",
  },
  {
    question: "ผู้ป่วยใช้ Levodopa/Carbidopa มา 5 ปี เริ่มมีปัญหา 'Wearing off' คืออาการกลับมาก่อนถึงเวลากิน ยาใดที่เพิ่มได้เพื่อแก้ปัญหานี้",
    choices: [
      { label: "A", text: "เพิ่มขนาด Levodopa เป็น 2 เท่า" },
      { label: "B", text: "เพิ่ม MAO-B inhibitor (Rasagiline) หรือ COMT inhibitor (Entacapone)" },
      { label: "C", text: "เพิ่ม Haloperidol" },
      { label: "D", text: "เพิ่ม Propranolol" },
      { label: "E", text: "หยุด Levodopa แล้วเปลี่ยนเป็น Anticholinergic" },
    ],
    correct_answer: "B",
    explanation: "Wearing off แก้ได้โดย: 1) MAO-B inhibitor (rasagiline/selegiline): ยับยั้งการสลาย dopamine 2) COMT inhibitor (entacapone/tolcapone): ยับยั้งการสลาย levodopa ทำให้ออกฤทธิ์นานขึ้น 3) เพิ่มความถี่ยา ไม่ใช่ขนาด",
    detailed_explanation: {
      summary: "Wearing off: ยาหมดฤทธิ์ก่อนเวลา → เพิ่ม MAO-Bi หรือ COMTi เพื่อยืดฤทธิ์ levodopa",
      reason: "Wearing off เกิดจาก dopaminergic neurons เสื่อมลง buffer dopamine ได้น้อยลง รักษา: (1) MAO-B inhibitor: selegiline/rasagiline ยับยั้ง MAO-B (ย่อย dopamine ใน brain) | (2) COMT inhibitor: entacapone ยับยั้ง COMT (ย่อย levodopa ใน periphery) → levodopa t½ ยาวขึ้น | (3) Dopamine agonist | (4) Extended-release levodopa",
      choices: [
        { label: "A", text: "เพิ่มขนาด Levodopa เป็น 2 เท่า", explanation: "✗ ผิด — เพิ่มขนาดทำให้ dyskinesia มากขึ้น ควรเพิ่มความถี่แทน" },
        { label: "B", text: "เพิ่ม MAO-B inhibitor (Rasagiline) หรือ COMT inhibitor (Entacapone)", explanation: "✓ ถูก — ทั้งสองช่วยยืดฤทธิ์ dopamine/levodopa ลด wearing off" },
        { label: "C", text: "เพิ่ม Haloperidol", explanation: "✗ ผิด — Antipsychotic บล็อก D2 receptor ทำให้ PD แย่ลง ห้ามใช้ใน PD" },
        { label: "D", text: "เพิ่ม Propranolol", explanation: "✗ ผิด — Beta-blocker ไม่มีประโยชน์ใน PD motor complications" },
        { label: "E", text: "หยุด Levodopa แล้วเปลี่ยนเป็น Anticholinergic", explanation: "✗ ผิด — Levodopa ยังมีประสิทธิภาพดีที่สุด Anticholinergic ใช้เสริมสำหรับ tremor เท่านั้น" },
      ],
      key_takeaway: "Wearing off: เพิ่มความถี่ยา + เพิ่ม MAO-Bi/COMTi | Dyskinesia: ลดขนาด levodopa + เพิ่ม dopamine agonist",
    },
    difficulty: "hard",
  },
  {
    question: "ผู้ป่วยหญิงอายุ 28 ปี มีอาการชาครึ่งซีก ตามัว อ่อนแรงขา เป็นๆ หายๆ ตลอด 2 ปี MRI พบ demyelinating lesions ที่ white matter วินิจฉัยและยา first-line คือ",
    choices: [
      { label: "A", text: "Parkinson's disease รักษาด้วย Levodopa" },
      { label: "B", text: "Multiple Sclerosis รักษาด้วย Interferon beta-1a หรือ Glatiramer acetate" },
      { label: "C", text: "Epilepsy รักษาด้วย Valproate" },
      { label: "D", text: "Migraine รักษาด้วย Sumatriptan" },
      { label: "E", text: "Myasthenia gravis รักษาด้วย Pyridostigmine" },
    ],
    correct_answer: "B",
    explanation: "Multiple Sclerosis: relapsing-remitting neurologic symptoms ใน young adults, demyelinating lesions ใน MRI รักษา disease-modifying therapy (DMT): Interferon beta หรือ Glatiramer acetate เป็น first-line",
    detailed_explanation: {
      summary: "MS: young female, relapsing-remitting, demyelination on MRI → DMT (Interferon/Glatiramer)",
      reason: "MS criteria (McDonald): ≥2 attacks + ≥2 lesions | DMT first-line: Interferon beta (1a/1b) หรือ Glatiramer acetate | High-efficacy: Natalizumab, Ocrelizumab, Alemtuzumab | Acute relapse: IV Methylprednisolone 1g/day × 3-5 วัน | ห้ามใช้ Natalizumab ถ้า JC virus antibody positive (risk PML)",
      choices: [
        { label: "A", text: "Parkinson's disease รักษาด้วย Levodopa", explanation: "✗ ผิด — PD ในผู้สูงอายุ มี TRAP features ไม่ใช่ relapsing-remitting" },
        { label: "B", text: "Multiple Sclerosis รักษาด้วย Interferon beta-1a หรือ Glatiramer acetate", explanation: "✓ ถูก — RRMS + demyelination → DMT first-line" },
        { label: "C", text: "Epilepsy รักษาด้วย Valproate", explanation: "✗ ผิด — Epilepsy: recurrent seizures ไม่มีชา/อ่อนแรง ไม่มี MRI demyelination" },
        { label: "D", text: "Migraine รักษาด้วย Sumatriptan", explanation: "✗ ผิด — Migraine: episodic headache ไม่มี objective neurologic deficits" },
        { label: "E", text: "Myasthenia gravis รักษาด้วย Pyridostigmine", explanation: "✗ ผิด — MG: fatigable weakness, ptosis, diplopia ไม่มี MRI demyelination" },
      ],
      key_takeaway: "MS: DMT ลด relapse rate 30-70% | Acute relapse: IV Methylprednisolone | Symptomatic: fatigue(amantadine), spasticity(baclofen), bladder(oxybutynin)",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยชายอายุ 70 ปี มีอาการปวดศีรษะรุนแรงฉับพลัน (thunderclap headache) สูงสุดทันที ไม่เคยเจ็บปวดแบบนี้มาก่อน ควรนึกถึงและรักษาอย่างไร",
    choices: [
      { label: "A", text: "Tension headache รับประทาน Paracetamol แล้วกลับบ้าน" },
      { label: "B", text: "Migraine ให้ Sumatriptan ฉีด" },
      { label: "C", text: "Subarachnoid hemorrhage รีบทำ CT head ฉุกเฉิน" },
      { label: "D", text: "Cluster headache ให้ Oxygen 100% สูดดม" },
      { label: "E", text: "Hypertensive headache รักษาความดันแล้วกลับบ้าน" },
    ],
    correct_answer: "C",
    explanation: "Thunderclap headache = worst headache of life ที่เริ่มทันทีและรุนแรงสูงสุด ต้องนึกถึง Subarachnoid hemorrhage (SAH) ก่อน รีบทำ CT head ถ้าลบต้อง lumbar puncture ห้ามส่งกลับบ้าน",
    detailed_explanation: {
      summary: "Thunderclap headache = SAH until proven otherwise → CT head STAT",
      reason: "SAH: thunderclap headache + nuchal rigidity + photophobia | CT head ตรวจจับ SAH ได้ 98% ใน 12 ชั่วโมงแรก | ถ้า CT negative → Lumbar puncture ตรวจ xanthochromia | สาเหตุ: ruptured berry aneurysm (85%), AVM | รักษา: nimodipine (calcium channel blocker: ป้องกัน vasospasm), surgical clipping/endovascular coiling | ห้ามให้ anticoagulant",
      choices: [
        { label: "A", text: "Tension headache รับประทาน Paracetamol แล้วกลับบ้าน", explanation: "✗ ผิด — อันตรายมาก Thunderclap headache ไม่ใช่ tension-type ต้องตรวจ CT ก่อนเสมอ" },
        { label: "B", text: "Migraine ให้ Sumatriptan ฉีด", explanation: "✗ ผิด — Migraine มีอาการค่อยๆ เพิ่ม ไม่ใช่ thunderclap อย่าวินิจฉัย migraine ครั้งแรกโดยไม่ exclude SAH" },
        { label: "C", text: "Subarachnoid hemorrhage รีบทำ CT head ฉุกเฉิน", explanation: "✓ ถูก — Thunderclap headache = SAH until proven otherwise ต้องทำ CT head STAT" },
        { label: "D", text: "Cluster headache ให้ Oxygen 100% สูดดม", explanation: "✗ ผิด — Cluster headache: unilateral periorbital pain รุนแรง ระยะสั้น 15-180 นาที มี autonomic features ไม่ใช่ thunderclap" },
        { label: "E", text: "Hypertensive headache รับประทาน antihypertensive แล้วกลับบ้าน", explanation: "✗ ผิด — SAH อาจทำให้ความดันสูงได้ ไม่ใช่ความดันเป็นสาเหตุ" },
      ],
      key_takeaway: "Thunderclap headache: CT head STAT → ถ้า negative → LP (xanthochromia) | SAH Rx: Nimodipine + Neurosurgery consult",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยหญิงอายุ 35 ปี มีอาการปวดศีรษะข้างเดียว ร่วมกับคลื่นไส้ กลัวแสง กลัวเสียง ก่อนปวดมีอาการตามัวเป็นเส้นๆ (aura) ยาที่ใช้รักษา acute migraine attack ที่มีประสิทธิภาพที่สุด",
    choices: [
      { label: "A", text: "Paracetamol 500 mg" },
      { label: "B", text: "Sumatriptan (Triptan)" },
      { label: "C", text: "Diazepam 5 mg" },
      { label: "D", text: "Prednisolone" },
      { label: "E", text: "Carbamazepine" },
    ],
    correct_answer: "B",
    explanation: "Triptans (Sumatriptan, Rizatriptan) เป็น 5-HT1B/1D agonist เป็น specific migraine treatment ที่มีประสิทธิภาพสูงสุด ลด vasodilation และการปล่อย neuropeptide ที่เป็นสาเหตุ migraine",
    detailed_explanation: {
      summary: "Acute migraine: Triptans (5-HT1B/1D agonist) = most effective specific therapy",
      reason: "Migraine acute Rx: Step therapy: NSAIDs/Paracetamol → Triptans → Ergotamine | Triptans: สูดดม/ฉีด เร็วกว่าแบบเม็ด ห้ามใช้ใน hemiplegic migraine, basilar migraine, CAD, uncontrolled HTN | ห้ามใช้ MAOI ร่วมกับ triptan (serotonin syndrome) | Prophylaxis: Propranolol, Valproate, Amitriptyline, Topiramate",
      choices: [
        { label: "A", text: "Paracetamol 500 mg", explanation: "✗ ผิด — ใช้ได้ในบางราย แต่ประสิทธิภาพน้อยกว่า triptan สำหรับ moderate-severe migraine" },
        { label: "B", text: "Sumatriptan (Triptan)", explanation: "✓ ถูก — 5-HT1B/1D agonist เป็น specific migraine abortive therapy ที่มีประสิทธิภาพสูงสุด" },
        { label: "C", text: "Diazepam 5 mg", explanation: "✗ ผิด — Benzodiazepine ไม่มีประสิทธิภาพสำหรับ migraine pain" },
        { label: "D", text: "Prednisolone", explanation: "✗ ผิด — Corticosteroid ไม่ใช่ first-line acute migraine แต่ใช้ป้องกัน rebound ได้บ้าง" },
        { label: "E", text: "Carbamazepine", explanation: "✗ ผิด — Carbamazepine ใช้รักษา trigeminal neuralgia และ epilepsy ไม่ใช่ migraine" },
      ],
      key_takeaway: "Migraine acute: NSAIDs/Paracetamol → Triptans | Prophylaxis: Propranolol/Valproate/Topiramate/Amitriptyline | ห้าม triptan ใน hemiplegic/basilar migraine, CAD",
    },
    difficulty: "medium",
  },
  {
    question: "เด็กหญิงอายุ 8 ปี มีอาการหยุดชะงักกะทันหัน (staring spell) วันละหลายครั้ง ระยะสั้นๆ 5-30 วินาที EEG พบ 3Hz spike-and-wave discharge ควรรักษาด้วยยาใด",
    choices: [
      { label: "A", text: "Phenytoin" },
      { label: "B", text: "Ethosuximide" },
      { label: "C", text: "Carbamazepine" },
      { label: "D", text: "Phenobarbital" },
      { label: "E", text: "Gabapentin" },
    ],
    correct_answer: "B",
    explanation: "Childhood absence epilepsy: staring spell สั้น 5-30 วินาที EEG 3Hz spike-wave รักษาด้วย Ethosuximide (drug of choice สำหรับ pure absence) หรือ Valproate",
    detailed_explanation: {
      summary: "Absence epilepsy: Ethosuximide (DOC) หรือ Valproate | Carbamazepine ห้ามใช้ (ทำให้แย่ลง)",
      reason: "Ethosuximide: บล็อก T-type Ca channel ใน thalamus ซึ่งเป็น pacemaker ของ 3Hz spike-wave | Valproate: ทางเลือกถ้ามี generalized tonic-clonic ร่วมด้วย | Carbamazepine, Phenytoin, Gabapentin ห้ามใช้ใน absence → อาจทำให้ absence แย่ลง | Lamotrigine: alternative แต่ตอบสนองช้ากว่า",
      choices: [
        { label: "A", text: "Phenytoin", explanation: "✗ ผิด — Phenytoin ใช้สำหรับ focal/generalized tonic-clonic ไม่มีประสิทธิภาพใน absence และอาจทำให้แย่ลง" },
        { label: "B", text: "Ethosuximide", explanation: "✓ ถูก — Drug of choice สำหรับ childhood absence epilepsy บล็อก T-type Ca channel" },
        { label: "C", text: "Carbamazepine", explanation: "✗ ผิด — ห้ามใช้ใน absence epilepsy ทำให้ absence บ่อยขึ้น" },
        { label: "D", text: "Phenobarbital", explanation: "✗ ผิด — ไม่มีประสิทธิภาพใน absence ทำให้ cognitive impairment ในเด็ก" },
        { label: "E", text: "Gabapentin", explanation: "✗ ผิด — ไม่มีประสิทธิภาพใน absence epilepsy อาจทำให้แย่ลง" },
      ],
      key_takeaway: "Absence epilepsy: Ethosuximide (pure absence) หรือ Valproate (ถ้ามี GTCS ร่วม) | ห้าม: Carbamazepine, Phenytoin, Gabapentin",
    },
    difficulty: "hard",
  },
  {
    question: "ผู้ป่วยชายอายุ 55 ปี เป็น Epilepsy ควบคุมได้ดีด้วย Phenytoin นาน 10 ปี ควรติดตามอะไรเป็นพิเศษ",
    choices: [
      { label: "A", text: "Liver function ทุก 6 เดือน" },
      { label: "B", text: "Renal function ทุก 3 เดือน" },
      { label: "C", text: "Serum Phenytoin level, CBC, LFT, Bone density" },
      { label: "D", text: "Thyroid function ทุก 6 เดือน" },
      { label: "E", text: "Serum K+ ทุกเดือน" },
    ],
    correct_answer: "C",
    explanation: "Phenytoin ระยะยาว: ตรวจ serum level (therapeutic 10-20 mcg/mL), CBC (megaloblastic anemia), LFT (hepatotoxicity), Bone density (osteoporosis เพราะเร่ง vitamin D metabolism)",
    detailed_explanation: {
      summary: "Phenytoin long-term monitoring: drug level + CBC + LFT + bone density",
      reason: "Phenytoin SE ระยะยาว: Gingival hyperplasia | Hirsutism | Coarsening facial features | Megaloblastic anemia (ลด folate absorption) | Osteoporosis (induces CYP → เร่ง vitamin D catabolism → ลด Ca absorption) | Cerebellar atrophy | Peripheral neuropathy | Teratogenic (fetal hydantoin syndrome) | Phenytoin: narrow therapeutic index, non-linear (zero-order) kinetics → เพิ่มขนาดนิดเดียวระดับยาพุ่งสูง",
      choices: [
        { label: "A", text: "Liver function ทุก 6 เดือน", explanation: "✗ ผิด — LFT ต้อง monitor แต่ไม่ครบ ต้องตรวจ level/CBC/bone density ด้วย" },
        { label: "B", text: "Renal function ทุก 3 เดือน", explanation: "✗ ผิด — Phenytoin ไม่ toxic ต่อไตโดยตรง" },
        { label: "C", text: "Serum Phenytoin level, CBC, LFT, Bone density", explanation: "✓ ถูก — ครบ monitoring ที่จำเป็นสำหรับ phenytoin ระยะยาว" },
        { label: "D", text: "Thyroid function ทุก 6 เดือน", explanation: "✗ ผิด — ไม่ใช่ required monitoring สำหรับ phenytoin" },
        { label: "E", text: "Serum K+ ทุกเดือน", explanation: "✗ ผิด — K+ ไม่ได้รับผลจาก phenytoin โดยตรง" },
      ],
      key_takeaway: "Phenytoin: therapeutic level 10-20 mcg/mL | SE ระยะยาว: gingival hyperplasia, hirsutism, osteoporosis, megaloblastic anemia | ระวัง drug interactions (enzyme inducer)",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยหญิงอายุ 45 ปี Myasthenia gravis มีอาการหนังตาตก (ptosis) กลืนลำบาก แน่นหน้าอก Cholinergic crisis จาก Pyridostigmine เกินขนาด มีอาการใดต่างจาก Myasthenic crisis",
    choices: [
      { label: "A", text: "Cholinergic: กล้ามเนื้ออ่อนแรง | Myasthenic: กล้ามเนื้อแข็ง" },
      { label: "B", text: "Cholinergic: SLUDGE (น้ำลายมาก ท้องเสีย ปัสสาวะบ่อย) + กล้ามเนื้ออ่อนแรง | Myasthenic: กล้ามเนื้ออ่อนแรง ไม่มี SLUDGE" },
      { label: "C", text: "ไม่แตกต่างกัน รักษาเหมือนกัน" },
      { label: "D", text: "Cholinergic: ความดันสูง | Myasthenic: ความดันต่ำ" },
      { label: "E", text: "Cholinergic: ไข้สูง | Myasthenic: ไม่มีไข้" },
    ],
    correct_answer: "B",
    explanation: "Cholinergic crisis (pyridostigmine overdose): SLUDGE/DUMBELS + fasciculations + weakness | Myasthenic crisis (ยาไม่พอ): weakness เพียงอย่างเดียว ไม่มี cholinergic symptoms แยกด้วย Edrophonium (Tensilon) test",
    detailed_explanation: {
      summary: "Cholinergic crisis: SLUDGE + weakness | Myasthenic crisis: weakness เท่านั้น | แยกด้วย Tensilon test",
      reason: "SLUDGE: Salivation, Lacrimation, Urination, Defecation, GI cramps, Emesis | Cholinergic crisis: pyridostigmine เกินขนาด → acetylcholine สะสม → SLUDGE + miosis + fasciculations + weakness | Myasthenic crisis: crisis จากยาไม่พอ/trigger (infection, surgery) → weakness ไม่มี SLUDGE | Tensilon test: ให้ Edrophonium IV → ถ้า MG crisis: weakness ดีขึ้น ถ้า cholinergic crisis: แย่ลง | รักษา cholinergic crisis: หยุด pyridostigmine + Atropine",
      choices: [
        { label: "A", text: "Cholinergic: กล้ามเนื้ออ่อนแรง | Myasthenic: กล้ามเนื้อแข็ง", explanation: "✗ ผิด — ทั้งคู่ทำให้กล้ามเนื้ออ่อนแรง ไม่มีแบบ rigid" },
        { label: "B", text: "Cholinergic: SLUDGE (น้ำลายมาก ท้องเสีย ปัสสาวะบ่อย) + กล้ามเนื้ออ่อนแรง | Myasthenic: กล้ามเนื้ออ่อนแรง ไม่มี SLUDGE", explanation: "✓ ถูก — SLUDGE เป็น key differentiator สำหรับ cholinergic crisis" },
        { label: "C", text: "ไม่แตกต่างกัน รักษาเหมือนกัน", explanation: "✗ ผิด — รักษาตรงข้ามกัน! Cholinergic: หยุดยา + atropine | Myasthenic: เพิ่มยา + plasmapheresis/IVIG" },
        { label: "D", text: "Cholinergic: ความดันสูง | Myasthenic: ความดันต่ำ", explanation: "✗ ผิด — ไม่ใช่ discriminating feature ที่ชัดเจน" },
        { label: "E", text: "Cholinergic: ไข้สูง | Myasthenic: ไม่มีไข้", explanation: "✗ ผิด — Cholinergic crisis ไม่มีไข้ (MG crisis อาจมีไข้ถ้า trigger คือ infection)" },
      ],
      key_takeaway: "MG crisis: Myasthenic (ยาไม่พอ) → เพิ่มยา | Cholinergic (ยาเกิน) → หยุดยา + Atropine | แยกด้วย SLUDGE และ Tensilon test",
    },
    difficulty: "hard",
  },
  {
    question: "ผู้ป่วยชายอายุ 60 ปี เบาหวาน ความดัน มีอาการอ่อนแรงข้างขวาเฉียบพลัน พูดไม่ออก ส่ง ER ภายใน 2 ชั่วโมง CT brain ไม่มี hemorrhage ควรรักษาอย่างไร",
    choices: [
      { label: "A", text: "ให้ Aspirin 300 mg ทันที" },
      { label: "B", text: "ให้ IV Alteplase (rt-PA) ภายใน 4.5 ชั่วโมงจาก onset" },
      { label: "C", text: "ให้ IV Heparin ทันที" },
      { label: "D", text: "รอสังเกตอาการ 24 ชั่วโมง" },
      { label: "E", text: "ผ่าตัด craniotomy ฉุกเฉิน" },
    ],
    correct_answer: "B",
    explanation: "Ischemic stroke ที่มาภายใน 4.5 ชั่วโมง CT ไม่มี hemorrhage → IV Alteplase (rt-PA thrombolysis) 0.9 mg/kg (max 90mg) เป็น standard of care ที่ลด disability ได้อย่างมีนัยสำคัญ",
    detailed_explanation: {
      summary: "Acute ischemic stroke ภายใน 4.5h + CT ไม่มีเลือด = IV Alteplase (thrombolysis)",
      reason: "IV Alteplase: recombinant tissue plasminogen activator ละลายลิ่มเลือด | Time window: ≤4.5h จาก symptom onset | Dose: 0.9 mg/kg IV (10% bolus, 90% infusion ใน 60 นาที) | ข้อห้าม: BP >185/110, เลือดออก, INR >1.7, ผ่าตัดใน 14 วัน, stroke/TBI ใน 3 เดือน | Endovascular thrombectomy: ถ้า large vessel occlusion ภายใน 6-24 ชั่วโมง",
      choices: [
        { label: "A", text: "ให้ Aspirin 300 mg ทันที", explanation: "✗ ผิด — Aspirin ใช้หลังจาก 24h post-thrombolysis ถ้าให้ก่อน alteplase เพิ่มความเสี่ยงเลือดออก" },
        { label: "B", text: "ให้ IV Alteplase (rt-PA) ภายใน 4.5 ชั่วโมงจาก onset", explanation: "✓ ถูก — Standard of care ชัดเจน: CT ไม่มีเลือด + onset ≤4.5h → IV rtPA" },
        { label: "C", text: "ให้ IV Heparin ทันที", explanation: "✗ ผิด — Heparin ไม่ได้รับการพิสูจน์ใน acute ischemic stroke routine และเพิ่มความเสี่ยง hemorrhagic transformation" },
        { label: "D", text: "รอสังเกตอาการ 24 ชั่วโมง", explanation: "✗ ผิด — 'Time is brain' ทุกนาทีที่เสียไปทำลาย neurons 1.9 ล้านตัว ต้องรักษาเร็วที่สุด" },
        { label: "E", text: "ผ่าตัด craniotomy ฉุกเฉิน", explanation: "✗ ผิด — Ischemic stroke ไม่ผ่าตัด (ยกเว้น malignant MCA infarction ที่บวมมาก)" },
      ],
      key_takeaway: "Acute ischemic stroke: IV Alteplase ≤4.5h | 'Time is brain' | ข้อห้าม: hemorrhage, BP >185/110, anticoagulant | หลัง 24h: Aspirin + Statin",
    },
    difficulty: "hard",
  },
  {
    question: "ยาใดที่ใช้รักษา Trigeminal neuralgia เป็น first-line",
    choices: [
      { label: "A", text: "Sumatriptan" },
      { label: "B", text: "Gabapentin" },
      { label: "C", text: "Carbamazepine" },
      { label: "D", text: "Amitriptyline" },
      { label: "E", text: "Morphine" },
    ],
    correct_answer: "C",
    explanation: "Carbamazepine เป็น drug of choice สำหรับ Trigeminal neuralgia (TN) มีหลักฐานสูงสุด ลดอาการปวดแบบ electric shock ที่แก้มหรือขากรรไกรได้ดีมาก",
    detailed_explanation: {
      summary: "Trigeminal neuralgia: Carbamazepine = drug of choice | Oxcarbazepine = alternative",
      reason: "Trigeminal neuralgia: ปวดแบบ electric shock ที่ใบหน้าข้างเดียว เป็นพักๆ วินาที Carbamazepine บล็อก Na channel ลด ectopic discharge ของ trigeminal nerve | Oxcarbazepine: ทนได้ดีกว่า carbamazepine ผลข้างเคียงน้อยกว่า | Baclofen: GABA-B agonist ใช้เสริม | Gabapentin: ใช้บ้างแต่หลักฐานน้อยกว่า | Surgical: microvascular decompression",
      choices: [
        { label: "A", text: "Sumatriptan", explanation: "✗ ผิด — Triptan ใช้ migraine ไม่มีหลักฐานใน TN" },
        { label: "B", text: "Gabapentin", explanation: "✗ ผิด — ใช้ได้บ้างแต่ไม่ใช่ first-line เหมือน carbamazepine" },
        { label: "C", text: "Carbamazepine", explanation: "✓ ถูก — Drug of choice TN มี RCT evidence ที่แข็งแกร่งที่สุด" },
        { label: "D", text: "Amitriptyline", explanation: "✗ ผิด — TCA ใช้ใน neuropathic pain และ migraine prophylaxis แต่ไม่ใช่ DOC สำหรับ TN" },
        { label: "E", text: "Morphine", explanation: "✗ ผิด — Opioid ไม่มีประสิทธิภาพดีใน neuropathic/trigeminal pain" },
      ],
      key_takeaway: "Trigeminal neuralgia: Carbamazepine (DOC) → Oxcarbazepine → Baclofen + Carbamazepine | Surgical: MVD ถ้ายาไม่ได้ผล",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยหญิงอายุ 25 ปี ตั้งครรภ์ 8 สัปดาห์ มีประวัติ Epilepsy ควบคุมด้วย Valproate ควรแนะนำอย่างไร",
    choices: [
      { label: "A", text: "หยุดยาทันที ไม่มียาใดปลอดภัยในตั้งครรภ์" },
      { label: "B", text: "ปรึกษาแพทย์เพื่อพิจารณาเปลี่ยนเป็น Lamotrigine หรือ Levetiracetam และให้ Folic acid" },
      { label: "C", text: "เพิ่มขนาด Valproate เป็น 2 เท่าเพื่อความแน่ใจ" },
      { label: "D", text: "เปลี่ยนเป็น Phenobarbital ทันที" },
      { label: "E", text: "ใช้ Carbamazepine แทน Valproate โดยไม่ต้องปรึกษาแพทย์" },
    ],
    correct_answer: "B",
    explanation: "Valproate เป็น teratogen ที่รุนแรงที่สุดในบรรดา AEDs ทำให้ neural tube defects, cognitive impairment ในบุตร ควรปรึกษาแพทย์เพื่อเปลี่ยนเป็น Lamotrigine หรือ Levetiracetam (ปลอดภัยกว่า) + Folic acid 5 mg/day",
    detailed_explanation: {
      summary: "Valproate: teratogen ที่สุดใน AEDs | ตั้งครรภ์: เปลี่ยนเป็น Lamotrigine/Levetiracetam + Folic acid",
      reason: "Valproate teratogenic risk: Neural tube defects (spina bifida ~1-2%), Fetal valproate syndrome (craniofacial), Cognitive impairment ในบุตร (IQ ต่ำกว่า 9 คะแนน) | Lamotrigine + Levetiracetam: ปลอดภัยที่สุดใน pregnancy | Folic acid 5 mg/day: ลด NTD | ห้ามหยุดยาเองเพราะ seizure ขณะตั้งครรภ์อันตรายกว่า | Carbamazepine ก็ทำให้ NTD ได้แต่น้อยกว่า valproate",
      choices: [
        { label: "A", text: "หยุดยาทันที ไม่มียาใดปลอดภัยในตั้งครรภ์", explanation: "✗ ผิด — ห้ามหยุดยาเอง seizure ขณะตั้งครรภ์อันตรายต่อแม่และทารก Lamotrigine/Levetiracetam ปลอดภัยกว่า" },
        { label: "B", text: "ปรึกษาแพทย์เพื่อพิจารณาเปลี่ยนเป็น Lamotrigine หรือ Levetiracetam และให้ Folic acid", explanation: "✓ ถูก — ถูกต้องที่สุด: ปรึกษาผู้เชี่ยวชาญ เปลี่ยนยา + Folic acid" },
        { label: "C", text: "เพิ่มขนาด Valproate เป็น 2 เท่าเพื่อความแน่ใจ", explanation: "✗ ผิด — เพิ่ม teratogenic risk มากขึ้น" },
        { label: "D", text: "เปลี่ยนเป็น Phenobarbital ทันที", explanation: "✗ ผิด — Phenobarbital ก็ teratogenic (cleft lip/palate, cardiac defects) ไม่ดีกว่า valproate" },
        { label: "E", text: "ใช้ Carbamazepine แทน Valproate โดยไม่ต้องปรึกษาแพทย์", explanation: "✗ ผิด — Carbamazepine ก็ teratogenic (NTD 0.5%) และไม่ควรเปลี่ยนยาเองโดยไม่ปรึกษาแพทย์" },
      ],
      key_takeaway: "Epilepsy ตั้งครรภ์: Lamotrigine/Levetiracetam ปลอดภัยที่สุด | Valproate = most teratogenic AED | Folic acid 5mg/day ก่อนตั้งครรภ์",
    },
    difficulty: "hard",
  },
  {
    question: "Status epilepticus (SE) ที่ชักนานกว่า 5 นาที ยาที่ให้เป็น first-line ทาง IV คือ",
    choices: [
      { label: "A", text: "Phenytoin IV" },
      { label: "B", text: "Lorazepam IV หรือ Diazepam IV" },
      { label: "C", text: "Valproate IV" },
      { label: "D", text: "Levetiracetam IV" },
      { label: "E", text: "Propofol IV" },
    ],
    correct_answer: "B",
    explanation: "Status epilepticus first-line: Benzodiazepine IV (Lorazepam 4mg IV หรือ Diazepam 10mg IV) ออกฤทธิ์เร็วและมีประสิทธิภาพสูงสุดในการหยุด SE ถ้าไม่มี IV access: Diazepam rectal หรือ Midazolam buccal/IM",
    detailed_explanation: {
      summary: "SE first-line: Benzodiazepine IV | Second-line: Fosphenytoin/Valproate/Levetiracetam IV",
      reason: "SE protocol: (1) Lorazepam 0.1 mg/kg IV (max 4mg) หรือ Diazepam 0.15 mg/kg IV → (2) ถ้าไม่หยุด: Fosphenytoin 20 PE/kg IV หรือ Valproate 40 mg/kg IV หรือ Levetiracetam 60 mg/kg IV → (3) ถ้าไม่หยุด: Refractory SE → Propofol/Midazolam/Pentobarbital infusion | Non-IV: Midazolam IM/buccal/intranasal, Diazepam rectal",
      choices: [
        { label: "A", text: "Phenytoin IV", explanation: "✗ ผิด — Phenytoin/Fosphenytoin เป็น second-line ออกฤทธิ์ช้ากว่า benzodiazepine" },
        { label: "B", text: "Lorazepam IV หรือ Diazepam IV", explanation: "✓ ถูก — Benzodiazepine = first-line SE ออกฤทธิ์เร็ว (ใน 1-3 นาที)" },
        { label: "C", text: "Valproate IV", explanation: "✗ ผิด — Valproate IV เป็น second-line option" },
        { label: "D", text: "Levetiracetam IV", explanation: "✗ ผิด — Levetiracetam IV เป็น second-line option" },
        { label: "E", text: "Propofol IV", explanation: "✗ ผิด — Propofol ใช้สำหรับ refractory SE เท่านั้น ต้อง intubation" },
      ],
      key_takeaway: "SE: Benzo IV (first) → Fosphenytoin/VPA/LEV IV (second) → Propofol/Midazolam infusion (refractory) | Time critical: ทุกนาทีเพิ่ม neuronal damage",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยหญิงอายุ 40 ปี ปวดศีรษะเป็นประจำทุกวัน สัมพันธ์กับการใช้ยาแก้ปวดทุกวัน (Paracetamol > 15 วัน/เดือน) วินิจฉัยและรักษาอย่างไร",
    choices: [
      { label: "A", text: "Migraine รักษาด้วย Sumatriptan ทุกวัน" },
      { label: "B", text: "Medication Overuse Headache (MOH) รักษาด้วยการหยุดยาแก้ปวดและทำ detoxification" },
      { label: "C", text: "Tension headache รักษาด้วย Amitriptyline" },
      { label: "D", text: "Cluster headache รักษาด้วย Oxygen therapy" },
      { label: "E", text: "Secondary headache จาก tumor รักษาด้วย Dexamethasone" },
    ],
    correct_answer: "B",
    explanation: "Medication Overuse Headache (MOH/Rebound headache): ปวดหัวทุกวัน สัมพันธ์กับการใช้ยาแก้ปวด > 10-15 วัน/เดือน รักษาด้วยการหยุดยาที่ใช้เกิน (detoxification) และ prophylaxis",
    detailed_explanation: {
      summary: "MOH: ปวดหัวทุกวัน + ใช้ยาแก้ปวดเกินขีด → หยุดยา (detox) + prophylaxis",
      reason: "MOH criteria: Headache ≥15 วัน/เดือน + Simple analgesic ≥15 วัน/เดือน หรือ Triptan/ergot ≥10 วัน/เดือน รักษา: (1) หยุดยาที่ใช้เกิน (ทันทีหรือค่อยๆ ลด) (2) Prophylaxis: Topiramate, Valproate, Propranolol, Amitriptyline (3) อาจ bridge therapy ด้วย prednisolone ระยะสั้น",
      choices: [
        { label: "A", text: "Migraine รักษาด้วย Sumatriptan ทุกวัน", explanation: "✗ ผิด — Triptan ทุกวัน ทำให้ MOH! ห้ามใช้ > 10 วัน/เดือน" },
        { label: "B", text: "Medication Overuse Headache (MOH) รักษาด้วยการหยุดยาแก้ปวดและทำ detoxification", explanation: "✓ ถูก — MOH = ปวดหัวทุกวัน + ยาเกินขีด รักษาด้วย detoxification" },
        { label: "C", text: "Tension headache รักษาด้วย Amitriptyline", explanation: "✗ ผิด — Amitriptyline ใช้ prophylaxis แต่ต้องหยุดยาที่ใช้เกินก่อน" },
        { label: "D", text: "Cluster headache รักษาด้วย Oxygen therapy", explanation: "✗ ผิด — Cluster: unilateral severe orbital pain 15-180 นาที มี autonomic features ไม่ใช่กรณีนี้" },
        { label: "E", text: "Secondary headache จาก tumor รักษาด้วย Dexamethasone", explanation: "✗ ผิด — Brain tumor headache: morning headache, papilledema, progressive ไม่สัมพันธ์กับยาแก้ปวด" },
      ],
      key_takeaway: "MOH: ปวดหัวทุกวัน + ยาแก้ปวดเกิน → หยุดยา + prophylaxis | ป้องกัน: ไม่ใช้ analgesic > 10-15 วัน/เดือน",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยชายอายุ 55 ปี เบาหวาน มีอาการชาปลายมือปลายเท้าสมมาตรทั้งสองข้าง แพทย์วินิจฉัย Diabetic peripheral neuropathy ยาที่เหมาะสมที่สุดสำหรับ neuropathic pain คือ",
    choices: [
      { label: "A", text: "Tramadol เป็น first-line" },
      { label: "B", text: "Pregabalin หรือ Duloxetine" },
      { label: "C", text: "Aspirin" },
      { label: "D", text: "Metformin เพิ่ม dose" },
      { label: "E", text: "Insulin เปลี่ยนชนิด" },
    ],
    correct_answer: "B",
    explanation: "Diabetic peripheral neuropathy pain: First-line ได้แก่ Pregabalin (alpha-2-delta ligand), Duloxetine (SNRI) และ Gabapentin มีหลักฐาน level A จาก AAN guideline",
    detailed_explanation: {
      summary: "Diabetic neuropathy pain: Pregabalin/Duloxetine/Gabapentin = first-line | Tricyclics: effective แต่ SE มาก",
      reason: "AAN guideline first-line: Pregabalin (FDA approved), Duloxetine (FDA approved), Gabapentin | Second-line: Venlafaxine, Amitriptyline, Opioids (Tramadol) | Pregabalin: บล็อก voltage-gated Ca channel (alpha-2-delta subunit) ลด pain neurotransmitter release | Duloxetine: SNRI เพิ่ม NE/5HT ใน descending pain pathway | ควบคุมน้ำตาลให้ดีด้วย",
      choices: [
        { label: "A", text: "Tramadol เป็น first-line", explanation: "✗ ผิด — Tramadol เป็น second/third-line เสี่ยง dependence/serotonin syndrome" },
        { label: "B", text: "Pregabalin หรือ Duloxetine", explanation: "✓ ถูก — FDA approved และ AAN guideline Level A สำหรับ diabetic neuropathy pain" },
        { label: "C", text: "Aspirin", explanation: "✗ ผิด — NSAID ไม่มีประสิทธิภาพสำหรับ neuropathic pain" },
        { label: "D", text: "Metformin เพิ่ม dose", explanation: "✗ ผิด — การควบคุมน้ำตาลช่วยป้องกัน แต่ metformin ไม่ใช่ยาแก้ neuropathic pain" },
        { label: "E", text: "Insulin เปลี่ยนชนิด", explanation: "✗ ผิด — การควบคุมน้ำตาลดีช่วยชะลอการดำเนิน แต่ไม่ใช่ยาแก้ neuropathic pain" },
      ],
      key_takeaway: "Diabetic neuropathy pain: Pregabalin/Duloxetine (FDA approved) first-line | Gabapentin/Amitriptyline: alternative | Opioids: last resort",
    },
    difficulty: "medium",
  },
  {
    question: "ผู้ป่วยหญิงตั้งครรภ์ 36 สัปดาห์ มีอาการชามือกลางดึก ปวดแบบ electric ที่นิ้วโป้ง นิ้วชี้ นิ้วกลาง ดีขึ้นเมื่อสะบัดมือ (flick sign) วินิจฉัยและรักษาอย่างไร",
    choices: [
      { label: "A", text: "Peripheral neuropathy จาก vitamin B12 ขาด ให้ B12 supplement" },
      { label: "B", text: "Carpal Tunnel Syndrome รักษาด้วย Wrist splint และ NSAIDs" },
      { label: "C", text: "Thoracic outlet syndrome รักษาด้วย Physiotherapy" },
      { label: "D", text: "Cervical radiculopathy รักษาด้วย Traction" },
      { label: "E", text: "Raynaud's phenomenon รักษาด้วย Calcium channel blocker" },
    ],
    correct_answer: "B",
    explanation: "Carpal Tunnel Syndrome (CTS): ชา/ปวดที่นิ้วโป้ง ชี้ กลาง และครึ่งนิ้วนาง (median nerve distribution) worse at night, flick sign (+) ตั้งครรภ์เสี่ยงสูง รักษาด้วย wrist splint (conservative) ± corticosteroid injection",
    detailed_explanation: {
      summary: "CTS: median nerve compression ที่ carpal tunnel | Flick sign = pathognomonic | Rx: wrist splint ± steroid injection",
      reason: "CTS: ชาใน median nerve territory (นิ้ว 1-3 ½) กลางดึก Phalen's test (+), Tinel's sign (+), Flick sign (+) | ตั้งครรภ์: fluid retention → carpal tunnel pressure สูง | Rx: wrist splint กลางคืน, corticosteroid injection ใน carpal tunnel | ผ่าตัด: surgical decompression ถ้าไม่ตอบสนอง/atrophy of thenar muscles | ใน pregnancy: มักดีขึ้นหลังคลอด",
      choices: [
        { label: "A", text: "Peripheral neuropathy จาก vitamin B12 ขาด ให้ B12 supplement", explanation: "✗ ผิด — B12 deficiency: symmetric stockings-gloves distribution ไม่ใช่ specific digits" },
        { label: "B", text: "Carpal Tunnel Syndrome รักษาด้วย Wrist splint และ NSAIDs", explanation: "✓ ถูก — Flick sign + median nerve distribution + worse at night = CTS | Wrist splint เป็น first-line" },
        { label: "C", text: "Thoracic outlet syndrome รักษาด้วย Physiotherapy", explanation: "✗ ผิด — TOS: ปวดแขนทั้งแขน มักสัมพันธ์กับท่าทาง ไม่ใช่ specific finger distribution" },
        { label: "D", text: "Cervical radiculopathy รักษาด้วย Traction", explanation: "✗ ผิด — Cervical radiculopathy: ปวดร้าวจากคอ Spurling test (+) ไม่มี flick sign" },
        { label: "E", text: "Raynaud's phenomenon รักษาด้วย Calcium channel blocker", explanation: "✗ ผิด — Raynaud's: color change (white→blue→red) เมื่อเย็น ไม่มีชาแบบ specific distribution" },
      ],
      key_takeaway: "CTS: Median nerve compression | Flick sign = pathognomonic | Rx: splint → steroid injection → surgical decompression | ตั้งครรภ์: มักดีขึ้นหลังคลอด",
    },
    difficulty: "medium",
  },
];

async function seed() {
  console.log(`Seeding ${questions.length} neurologic questions...`);
  let count = 0;
  for (const q of questions) {
    const id = randomUUID();
    await client.execute({
      sql: `INSERT INTO mcq_questions (id, subject_id, exam_type, scenario, choices, correct_answer, explanation, detailed_explanation, difficulty, status) VALUES (?, ?, 'PLE-CC1', ?, ?, ?, ?, ?, ?, 'active')`,
      args: [id, SUBJECT_ID, q.question, JSON.stringify(q.choices), q.correct_answer, q.explanation, JSON.stringify(q.detailed_explanation), q.difficulty],
    });
    count++;
    console.log(`  ${count}. ${q.question.substring(0, 60)}...`);
  }
  console.log(`\nDone! ${count} questions inserted for ระบบประสาท`);
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
