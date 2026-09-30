import type { Pc1MockItem } from "@/lib/pc1-mock-builder";

// PC1 Mock Set 2 — ข้อใหม่ชุดที่ 2: จิตเวช (10) + ระบบหายใจ (10)
// แต่ละหมวด: ง่าย 3–5 · ปานกลาง 3–4 · ยาก 2–3 (หัวข้อไม่ซ้ำกับเซต 1)

export const MOCK2_DAY02: Record<string, Pc1MockItem[]> = {
  psych: [
    {
      title: "Schizophrenia: antipsychotic adverse effects and clozapine",
      base:
        "ชายไทยอายุ 24 ปี น้ำหนัก 68 kg วินิจฉัยโรคจิตเภทครั้งแรก มีหูแว่ว หลงผิดว่ามีคนปองร้าย ไม่มีโรคประจำตัว สูบบุหรี่วันละ 20 มวน",
      ref: "APA Practice Guideline for the Treatment of Patients with Schizophrenia 2020; ADA/APA Consensus on Antipsychotic Drugs and Obesity/Diabetes; Maudsley Prescribing Guidelines",
      qs: [
        {
          d: "easy",
          p: "แพทย์เริ่ม olanzapine 10 mg ก่อนนอน การติดตามความปลอดภัยที่สำคัญที่สุดคือข้อใด?",
          o: [
            "น้ำหนัก รอบเอว ความดัน น้ำตาลและไขมันในเลือด ที่ baseline และ 12 สัปดาห์",
            "ระดับยาในเลือดทุกสัปดาห์",
            "INR ทุกเดือน",
            "Absolute neutrophil count ทุกสัปดาห์",
            "ระดับ TSH ทุก 3 เดือน",
          ],
          a: 0,
          r: "Olanzapine (และ clozapine) ทำให้น้ำหนักขึ้นและเกิด metabolic syndrome สูงที่สุดในกลุ่ม SGA ต้องติดตามน้ำหนัก/BMI รอบเอว BP fasting glucose/HbA1c และไขมันที่ baseline, 12 สัปดาห์ และทุกปี (น้ำหนักทุกเดือนใน 3 เดือนแรก)",
          w: ["ถูก", "ไม่จำเป็นในการใช้ทั่วไป", "ไม่เกี่ยวข้อง", "เป็นการติดตามของ clozapine", "ไม่ใช่การติดตามหลักของ olanzapine"],
          k: "SGA (โดยเฉพาะ olanzapine, clozapine): ติดตาม metabolic — น้ำหนัก รอบเอว BP glucose lipid",
        },
        {
          d: "medium",
          p: "ต่อมาเปลี่ยนเป็น risperidone เพราะน้ำหนักขึ้น 3 เดือนต่อมาผู้ป่วยมีน้ำนมไหลและเสื่อมสมรรถภาพทางเพศ ข้อใดเหมาะสมที่สุด?",
          o: [
            "ตรวจ prolactin และพิจารณาเปลี่ยนเป็น aripiprazole",
            "เพิ่ม risperidone เพื่อคุมอาการให้ดีขึ้น",
            "เปลี่ยนเป็น haloperidol",
            "เพิ่ม sildenafil และใช้ risperidone ต่อ",
            "เพิ่ม metoclopramide",
          ],
          a: 0,
          r: "Risperidone/paliperidone ต้าน D2 ใน tuberoinfundibular pathway ทำให้ hyperprolactinemia มากที่สุดใน SGA (galactorrhea, sexual dysfunction, กระดูกบาง). จัดการโดยลดขนาดหรือเปลี่ยนเป็นยาที่กระทบ prolactin น้อย เช่น aripiprazole (partial D2 agonist) หรือเสริม aripiprazole ขนาดต่ำ",
          w: ["ถูก", "ทำให้ prolactin สูงขึ้นอีก", "FGA ก็เพิ่ม prolactin มาก", "ไม่แก้สาเหตุ และไม่แก้ galactorrhea", "D2 antagonist เพิ่ม prolactin"],
          k: "Risperidone → hyperprolactinemia; เปลี่ยน/เสริม aripiprazole",
        },
        {
          d: "hard",
          p: "ช่วงหนึ่งผู้ป่วยอาละวาด ได้ haloperidol IM ซ้ำหลายครั้ง 2 วันต่อมามีไข้ 40 °C กล้ามเนื้อแข็งเกร็งทั้งตัว สับสน BP แกว่ง เหงื่อออกมาก CK 12,000 U/L การจัดการข้อใดเหมาะสมที่สุด?",
          o: [
            "หยุด antipsychotic ทั้งหมด ให้สารน้ำ ลดอุณหภูมิ และพิจารณา dantrolene หรือ bromocriptine",
            "เพิ่ม haloperidol เพื่อคุมอาการสับสน",
            "ให้ cyproheptadine และใช้ haloperidol ต่อ",
            "ให้ benztropine IM แล้วใช้ haloperidol ต่อ",
            "ให้ paracetamol ลดไข้อย่างเดียว",
          ],
          a: 0,
          r: "อาการเข้าได้กับ neuroleptic malignant syndrome (ไข้สูง lead-pipe rigidity สับสน autonomic instability CK สูงมาก) เป็นภาวะฉุกเฉิน: หยุดยาต้าน dopamine ทันที supportive care (สารน้ำป้องกัน rhabdomyolysis/AKI ลดอุณหภูมิ) benzodiazepine และรายรุนแรงให้ dantrolene และ/หรือ bromocriptine",
          w: ["ถูก", "ทำให้ NMS แย่ลง อาจถึงชีวิต", "Cyproheptadine ใช้ใน serotonin syndrome", "Anticholinergic รักษา acute dystonia ไม่ใช่ NMS", "ไข้ใน NMS ไม่ได้เกิดจาก hypothalamic set point ยาลดไข้ได้ผลน้อย"],
          k: "NMS: ไข้ + rigidity + สับสน + autonomic instability + CK สูง → หยุด antipsychotic, supportive, dantrolene/bromocriptine",
        },
        {
          d: "hard",
          p: "หลังล้มเหลวจาก antipsychotic 2 ชนิด ผู้ป่วยได้ clozapine 300 mg/day อาการคงที่ ต่อมาผู้ป่วยเลิกบุหรี่ได้ (ใช้แผ่นนิโคติน) ควรทำอย่างไร?",
          o: [
            "ลดขนาด clozapine ประมาณ 30–40% ใน 1–2 สัปดาห์ และติดตามระดับยาและอาการง่วง/ชัก",
            "เพิ่มขนาด clozapine เพราะนิโคตินเร่งการทำลายยา",
            "ใช้ขนาดเดิมเพราะแผ่นนิโคตินให้ผลเหมือนการสูบบุหรี่",
            "หยุด clozapine ชั่วคราวจนเลิกบุหรี่สำเร็จ",
            "ไม่ต้องทำอะไรเพราะบุหรี่ไม่มีผลต่อ clozapine",
          ],
          a: 0,
          r: "Polycyclic aromatic hydrocarbons ในควันบุหรี่ (ไม่ใช่นิโคติน) กระตุ้น CYP1A2 ซึ่งทำลาย clozapine/olanzapine. เมื่อเลิกบุหรี่ ฤทธิ์กระตุ้นหายไปใน 1–2 สัปดาห์ ระดับ clozapine อาจเพิ่ม ~50% เสี่ยงง่วงซึม hypotension ชัก จึงควรลดขนาดล่วงหน้า 30–40% และตรวจระดับยา. แผ่นนิโคตินไม่กระตุ้น CYP1A2",
          w: ["ถูก", "นิโคตินไม่ใช่ตัวกระตุ้นเอนไซม์ และทิศทางผิด", "แผ่นนิโคตินไม่มีสาร PAH จึงไม่กระตุ้น CYP1A2", "เสี่ยงอาการกำเริบ และถ้าจะเริ่มใหม่ต้อง titrate ใหม่", "การสูบบุหรี่มีผลต่อระดับ clozapine อย่างมาก"],
          k: "เลิกบุหรี่ → CYP1A2 induction หาย → clozapine/olanzapine ↑ → ลดขนาด 30–40% + ตรวจระดับ",
        },
      ],
    },
    {
      title: "Panic disorder",
      base:
        "หญิงไทยอายุ 35 ปี มีอาการใจสั่น หายใจไม่อิ่ม กลัวจะตายเป็นพักๆ สัปดาห์ละหลายครั้งมา 6 เดือน ตรวจร่างกายและ ECG ปกติ TSH ปกติ. " +
        "ได้ alprazolam 0.5 mg TID จากคลินิกมา 6 เดือน",
      ref: "APA Practice Guideline for the Treatment of Patients with Panic Disorder; NICE CG113 Generalised Anxiety Disorder and Panic Disorder in Adults",
      qs: [
        {
          d: "easy",
          p: "ยาที่เหมาะสมที่สุดสำหรับการรักษาระยะยาวของโรคนี้คือข้อใด?",
          o: ["Sertraline เริ่ม 25 mg/day", "Alprazolam ใช้ต่อเนื่องระยะยาว", "Propranolol 40 mg TID", "Quetiapine 100 mg ก่อนนอน", "Diphenhydramine 50 mg ก่อนนอน"],
          a: 0,
          r: "SSRI (หรือ SNRI) เป็นยาหลักระยะยาวของ panic disorder ควรเริ่มขนาดต่ำ (sertraline 25 mg) เพราะช่วงแรกอาจเกิด jitteriness/วิตกกังวลมากขึ้น แล้วค่อยเพิ่มขนาด. Benzodiazepine ใช้ระยะสั้นระหว่างรอ SSRI ออกฤทธิ์เท่านั้น",
          w: ["ถูก", "เสี่ยงติดยาและดื้อยา ไม่แนะนำระยะยาว", "ลดเฉพาะอาการทางกาย ไม่รักษาโรค", "ไม่ใช่ยาหลัก มี metabolic ADR", "ไม่ใช่ยารักษาโรควิตกกังวล"],
          k: "Panic disorder: SSRI/SNRI เริ่มขนาดต่ำ; BZD ระยะสั้นเท่านั้น",
        },
        {
          d: "medium",
          p: "คำแนะนำใดเหมาะสมที่สุดเมื่อเริ่ม sertraline?",
          o: [
            "ยาเริ่มได้ผลใน 2–4 สัปดาห์ เต็มที่ 8–12 สัปดาห์ ช่วงแรกอาจกระวนกระวายมากขึ้น ห้ามหยุดยาเอง",
            "ทานเฉพาะเวลามีอาการ panic",
            "ยาออกฤทธิ์ทันทีหลังทานเม็ดแรก",
            "ถ้าไม่ดีขึ้นใน 3 วันให้เพิ่มขนาดเป็น 2 เท่าเอง",
            "ห้ามทานร่วมกับอาหารทุกชนิด",
          ],
          a: 0,
          r: "SSRI ใช้ต่อเนื่องทุกวัน ต้องใช้เวลาหลายสัปดาห์ถึงจะได้ผล ช่วงแรกอาจมีคลื่นไส้ นอนไม่หลับ หรือวิตกกังวลเพิ่มขึ้นชั่วคราว การหยุดยากะทันหันทำให้เกิด discontinuation syndrome ควรใช้ต่ออย่างน้อย 12 เดือนหลังอาการดีขึ้น",
          w: ["ถูก", "SSRI ต้องใช้ต่อเนื่องทุกวัน", "ต้องใช้เวลาหลายสัปดาห์", "ไม่ควรปรับขนาดเองและเร็วเกินไป", "ทานพร้อมอาหารได้ ช่วยลดคลื่นไส้"],
          k: "SSRI: onset 2–4 สัปดาห์, เต็มที่ 8–12 สัปดาห์; ช่วงแรกอาจ jittery; ห้ามหยุดเอง",
        },
        {
          d: "medium",
          p: "เมื่อ sertraline ได้ผลดีแล้ว ผู้ป่วยต้องการหยุด alprazolam ที่ใช้มา 6 เดือน วิธีใดเหมาะสมที่สุด?",
          o: [
            "ค่อยๆ ลดขนาดครั้งละประมาณ 10–25% ทุก 1–2 สัปดาห์ และช้าลงช่วงท้าย",
            "หยุดทันทีเพราะมี sertraline แล้ว",
            "หยุดทันทีแล้วใช้ diphenhydramine แทน",
            "ลดเหลือครึ่งหนึ่งในวันแรก แล้วหยุดในวันที่สาม",
            "เปลี่ยนเป็น zolpidem แทน alprazolam",
          ],
          a: 0,
          r: "การใช้ benzodiazepine ต่อเนื่องหลายสัปดาห์ทำให้เกิด physical dependence การหยุดทันทีเสี่ยง withdrawal (วิตกกังวลรุนแรง นอนไม่หลับ ชัก) โดยเฉพาะยาครึ่งชีวิตสั้นอย่าง alprazolam จึงต้อง taper ช้าๆ ประมาณ 10–25% ทุก 1–2 สัปดาห์ (อาจเปลี่ยนเป็นยาครึ่งชีวิตยาวอย่าง diazepam ก่อน taper)",
          w: ["ถูก", "SSRI ไม่ป้องกัน BZD withdrawal", "ไม่ป้องกัน withdrawal", "ลดเร็วเกินไป เสี่ยงชัก", "Z-drug ออกฤทธิ์ที่ GABA-A เช่นกัน เป็นการแทนที่ไม่ใช่การหยุด"],
          k: "หยุด BZD ที่ใช้นาน: taper 10–25% ทุก 1–2 สัปดาห์; alprazolam เสี่ยง withdrawal สูง",
        },
      ],
    },
    {
      ref: "Methylphenidate prescribing information; AAP Clinical Practice Guideline for ADHD 2019",
      qs: [
        {
          d: "easy",
          p: "เด็กชายอายุ 9 ปี ADHD เริ่ม methylphenidate IR 5 mg เช้าและเที่ยง อาการไม่พึงประสงค์ที่พบบ่อยที่สุดและควรแนะนำผู้ปกครองคือข้อใด?",
          o: [
            "เบื่ออาหารและนอนไม่หลับ ควรให้ยาหลังอาหารและไม่ให้ยาช่วงเย็น",
            "ง่วงซึมมาก ควรให้ยาก่อนนอน",
            "น้ำหนักขึ้นเร็ว ควรจำกัดอาหาร",
            "ความดันโลหิตต่ำ ควรเพิ่มเกลือ",
            "ท้องผูก ควรให้ยาระบายทุกวัน",
          ],
          a: 0,
          r: "Stimulant ทำให้เบื่ออาหาร น้ำหนักลด นอนไม่หลับ ปวดศีรษะ ปวดท้อง และเพิ่ม HR/BP เล็กน้อย จึงให้ยาหลังอาหารเช้า/กลางวัน หลีกเลี่ยงช่วงบ่ายแก่–เย็น และติดตามน้ำหนัก ส่วนสูง และความดัน",
          w: ["ถูก", "เป็นยากระตุ้น ทำให้นอนไม่หลับ", "มักทำให้น้ำหนักลด", "มักเพิ่มความดันเล็กน้อย", "ไม่ใช่ ADR ที่พบบ่อย"],
          k: "Methylphenidate: เบื่ออาหาร นอนไม่หลับ ↑HR/BP; ให้หลังอาหาร ไม่ให้ช่วงเย็น; ติดตามการเจริญเติบโต",
        },
      ],
    },
    {
      ref: "FDA Drug Safety Communication: Revised recommendations for citalopram (2012)",
      qs: [
        {
          d: "medium",
          p: "หญิงอายุ 72 ปี ภาวะซึมเศร้า ใช้ citalopram 40 mg/day ECG พบ QTc 480 ms ข้อใดเหมาะสมที่สุด?",
          o: [
            "ลด citalopram เหลือไม่เกิน 20 mg/day หรือเปลี่ยนเป็น sertraline และตรวจ K/Mg",
            "เพิ่ม citalopram เป็น 60 mg/day",
            "ใช้ขนาดเดิมเพราะ QTc ยังไม่ถึง 500 ms",
            "เพิ่ม ondansetron เพื่อลดคลื่นไส้",
            "เปลี่ยนเป็น escitalopram 20 mg/day",
          ],
          a: 0,
          r: "Citalopram ทำให้ QT ยาวตามขนาดยา ขนาดสูงสุดในผู้ที่อายุ >60 ปีคือ 20 mg/day (ทั่วไป 40 mg/day). ผู้ป่วยได้ขนาดเกินและ QTc ยาวแล้ว ควรลดขนาดหรือเปลี่ยนเป็น SSRI ที่มีผลต่อ QT น้อย เช่น sertraline และแก้ K/Mg ต่ำ",
          w: ["ถูก", "เกินขนาดสูงสุดและเพิ่มความเสี่ยง torsades", "เกินขนาดสูงสุดสำหรับอายุ >60 และ QTc ยาวแล้ว", "Ondansetron ทำให้ QT ยาวขึ้นอีก", "ขนาดสูงสุดของ escitalopram ในผู้สูงอายุคือ 10 mg/day และยังมีผลต่อ QT"],
          k: "Citalopram: max 20 mg/day เมื่ออายุ >60 ปี (QT prolongation); escitalopram max 10 mg",
        },
      ],
    },
    {
      ref: "CANMAT/ISBD 2018 Guidelines for the Management of Patients with Bipolar Disorder",
      qs: [
        {
          d: "hard",
          p: "หญิงอายุ 30 ปี bipolar I disorder ขณะนี้อยู่ในภาวะซึมเศร้ารุนแรง ไม่ได้ใช้ยาใดอยู่ ยาใดเหมาะสมที่สุด?",
          o: ["Quetiapine", "Sertraline อย่างเดียว", "Venlafaxine อย่างเดียว", "Amitriptyline อย่างเดียว", "Haloperidol"],
          a: 0,
          r: "Bipolar depression รักษาด้วยยาที่มีหลักฐาน เช่น quetiapine, lurasidone, cariprazine, lithium หรือ lamotrigine. ห้ามใช้ antidepressant เดี่ยวๆ ใน bipolar I เพราะเสี่ยง switch เป็น mania/rapid cycling (TCA และ SNRI เสี่ยงสูงสุด)",
          w: ["ถูก", "Antidepressant monotherapy เสี่ยงเกิด mania", "SNRI เสี่ยง switch สูง", "TCA เสี่ยง switch สูงที่สุด", "ไม่มีหลักฐานใน bipolar depression"],
          k: "Bipolar depression: quetiapine, lurasidone, cariprazine, lithium, lamotrigine; ห้าม antidepressant monotherapy",
        },
      ],
    },
  ],
  resp: [
    {
      title: "Newly diagnosed stable COPD",
      base:
        "ชายไทยอายุ 62 ปี สูบบุหรี่วันละ 1 ซองมา 40 ปี เหนื่อยเมื่อเดินขึ้นเนินหรือเดินเร็ว (mMRC 2) post-bronchodilator FEV1/FVC 0.62, FEV1 58% predicted. " +
        "ไม่เคยมีอาการกำเริบ blood eosinophil 150 cells/µL มีข้อนิ้วมืออักเสบ (rheumatoid arthritis) มือไม่ค่อยมีแรง",
      ref: "GOLD 2024 Global Strategy for COPD; Varenicline prescribing information",
      qs: [
        {
          d: "easy",
          p: "ตามแนวทาง GOLD ยาเริ่มต้นที่เหมาะสมที่สุดคือข้อใด?",
          o: ["LABA + LAMA", "ICS + LABA", "SABA เมื่อมีอาการเท่านั้น", "ICS อย่างเดียว", "Oral prednisolone ขนาดต่ำระยะยาว"],
          a: 0,
          r: "ผู้ป่วย GOLD group B (อาการมาก mMRC ≥2 ไม่มีประวัติกำเริบ) เริ่มด้วย LABA + LAMA ในอุปกรณ์เดียวถ้าทำได้. ไม่แนะนำ ICS ใน COPD ที่ไม่มีอาการกำเริบและ eosinophil ต่ำ",
          w: ["ถูก", "ไม่แนะนำ LABA/ICS ใน COPD", "ไม่พอสำหรับผู้ที่มีอาการมาก", "ICS เดี่ยวไม่ใช้ใน COPD และเพิ่มความเสี่ยงปอดอักเสบ", "ไม่แนะนำ ADR มาก"],
          k: "COPD group B → LABA + LAMA; ICS เฉพาะผู้ที่กำเริบบ่อย + eosinophil สูง",
        },
        {
          d: "easy",
          p: "วัคซีนใดแนะนำสำหรับผู้ป่วยรายนี้?",
          o: [
            "วัคซีนไข้หวัดใหญ่ทุกปี และวัคซีนนิวโมคอคคัส",
            "วัคซีนไข้หวัดใหญ่เฉพาะเมื่อมีการระบาด",
            "ไม่ต้องฉีดวัคซีนเพราะยังไม่เคยกำเริบ",
            "วัคซีนไข้เหลือง",
            "BCG กระตุ้นซ้ำ",
          ],
          a: 0,
          r: "GOLD แนะนำให้ผู้ป่วย COPD ทุกรายได้วัคซีนไข้หวัดใหญ่ทุกปี วัคซีนนิวโมคอคคัส (PCV20 หรือ PCV15 ตามด้วย PPSV23) COVID-19 และพิจารณา RSV (อายุ ≥60), Tdap และงูสวัด เพื่อลดการกำเริบและการติดเชื้อรุนแรง",
          w: ["ถูก", "ต้องฉีดทุกปีตามฤดูกาล", "วัคซีนช่วยป้องกันการกำเริบ ควรฉีดทุกราย", "ไม่เกี่ยวข้อง", "ไม่มีข้อบ่งใช้"],
          k: "COPD: influenza ทุกปี + pneumococcal + COVID-19 ± RSV, Tdap, zoster",
        },
        {
          d: "medium",
          p: "ผู้ป่วยต้องการเลิกบุหรี่และเลือกใช้ varenicline วิธีใช้ยาข้อใดถูกต้อง?",
          o: [
            "0.5 mg วันละครั้ง 3 วัน → 0.5 mg วันละ 2 ครั้ง 4 วัน → 1 mg วันละ 2 ครั้ง รวม 12 สัปดาห์ กำหนดวันเลิกหลังเริ่มยา 1 สัปดาห์",
            "1 mg วันละ 2 ครั้งตั้งแต่วันแรก ใช้ 2 สัปดาห์",
            "ใช้เฉพาะเมื่ออยากสูบบุหรี่",
            "2 mg ก่อนนอนวันละครั้ง 4 สัปดาห์",
            "ต้องหยุดบุหรี่ให้ได้ก่อนเริ่มยา 1 เดือน",
          ],
          a: 0,
          r: "Varenicline (partial agonist ที่ α4β2 nicotinic receptor) ต้อง titrate เพื่อลดคลื่นไส้ ทานหลังอาหารพร้อมน้ำ ตั้งวันเลิกบุหรี่ในวันที่ 8–35 หลังเริ่มยา ใช้ 12 สัปดาห์ (ต่ออีก 12 สัปดาห์ได้ถ้าเลิกสำเร็จ) ปรับขนาดเมื่อ CrCl <30",
          w: ["ถูก", "ไม่ titrate ทำให้คลื่นไส้มาก และระยะเวลาสั้นเกินไป", "ต้องใช้ต่อเนื่องทุกวัน", "ขนาดและวิธีใช้ไม่ถูกต้อง", "เริ่มยาก่อนวันเลิกบุหรี่ 1 สัปดาห์"],
          k: "Varenicline: titrate 0.5 mg OD ×3 วัน → 0.5 BID ×4 วัน → 1 mg BID; quit date สัปดาห์ที่ 2; 12 สัปดาห์",
        },
        {
          d: "hard",
          p: "ประเมินพบว่าผู้ป่วยมีแรงสูดหายใจเข้าสูงสุด (peak inspiratory flow) เพียง 25 L/min และมือไม่มีแรงกดหลอดยา อุปกรณ์ใดเหมาะสมที่สุดสำหรับ LABA + LAMA?",
          o: [
            "Soft mist inhaler หรือ pMDI ร่วมกับ spacer (มีผู้ช่วยกดหลอดยา)",
            "Dry powder inhaler ชนิดแคปซูล",
            "Dry powder inhaler ชนิด multi-dose",
            "pMDI กดเองโดยไม่ใช้ spacer",
            "ใช้ยาชนิดรับประทานแทนยาพ่น",
          ],
          a: 0,
          r: "DPI ต้องอาศัยแรงสูดที่เพียงพอ (โดยทั่วไป ≥30–60 L/min) เพื่อให้ผงยาแตกตัวเข้าปอด ผู้ที่ PIF ต่ำจึงไม่เหมาะ. Soft mist inhaler หรือ pMDI + spacer ไม่ต้องใช้แรงสูดมาก และ spacer ลดปัญหาการประสานมือกับการหายใจ (ผู้ดูแลช่วยกดได้) หรือใช้ nebulizer",
          w: ["ถูก", "แรงสูดไม่พอให้ยาแตกตัว", "แรงสูดไม่พอให้ยาแตกตัว", "ต้องประสานการกดกับการหายใจ และมือไม่มีแรง", "LABA/LAMA ชนิดรับประทานไม่มีใช้ใน COPD"],
          k: "PIF <30 L/min → หลีกเลี่ยง DPI; ใช้ SMI, pMDI + spacer หรือ nebulizer",
        },
      ],
    },
    {
      title: "Acute severe asthma in the emergency department",
      base:
        "หญิงไทยอายุ 30 ปี เป็นโรคหืด มาห้องฉุกเฉินด้วยหอบมาก พูดได้เป็นคำๆ RR 30/min HR 124/min SpO₂ 90% room air PEF 40% ของค่าที่ดีที่สุด ไม่มีภาวะหมดสติ",
      ref: "GINA 2024 Global Strategy for Asthma Management and Prevention (management of exacerbations)",
      qs: [
        {
          d: "easy",
          p: "การรักษาเบื้องต้นที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "ให้ออกซิเจนเป้าหมาย SpO₂ 93–95% และ salbutamol พ่นฝอยละอองซ้ำทุก 20 นาทีร่วมกับ ipratropium",
            "ให้ montelukast 10 mg รับประทานทันที",
            "ให้ salmeterol/fluticasone 2 puffs",
            "ให้ theophylline รับประทาน",
            "ให้ยานอนหลับเพื่อลดความกังวล",
          ],
          a: 0,
          r: "Acute severe asthma: ออกซิเจนให้ SpO₂ 93–95%, SABA ขนาดสูงซ้ำ (ทุก 20 นาทีในชั่วโมงแรกหรือต่อเนื่อง) ร่วมกับ ipratropium ลดการนอนโรงพยาบาล และให้ systemic corticosteroid เร็ว. ห้ามให้ยากดประสาท",
          w: ["ถูก", "ไม่ใช่ยาบรรเทาอาการเฉียบพลัน", "LABA ออกฤทธิ์ช้า (salmeterol) ไม่ใช้ในภาวะเฉียบพลัน", "ไม่แนะนำ ประสิทธิภาพต่ำ ADR มาก", "กดการหายใจ อันตราย"],
          k: "Acute severe asthma: O₂ (SpO₂ 93–95%) + SABA ซ้ำ + ipratropium + systemic steroid; ห้ามยากดประสาท",
        },
        {
          d: "medium",
          p: "การให้ corticosteroid ชนิด systemic ข้อใดเหมาะสมที่สุดสำหรับผู้ป่วยผู้ใหญ่รายนี้?",
          o: [
            "Prednisolone 40–50 mg/day 5–7 วัน หยุดได้โดยไม่ต้องค่อยๆ ลดขนาด",
            "Prednisolone 5 mg/day 1 วัน",
            "Prednisolone 60 mg/day 1 เดือนแล้วค่อยๆ ลดขนาด",
            "Dexamethasone พ่นจมูก",
            "ไม่ต้องให้ steroid ถ้าตอบสนองต่อ salbutamol",
          ],
          a: 0,
          r: "GINA แนะนำ prednisolone 40–50 mg/day (หรือเทียบเท่า) นาน 5–7 วันในผู้ใหญ่ ให้ภายใน 1 ชั่วโมงแรก ลดการกลับเป็นซ้ำและการนอนโรงพยาบาล. ใช้ไม่เกิน 2 สัปดาห์หยุดได้โดยไม่ต้อง taper และควรเริ่ม/ปรับ ICS ต่อเมื่อกลับบ้าน",
          w: ["ถูก", "ขนาดต่ำและสั้นเกินไป", "นานเกินจำเป็น เพิ่ม ADR", "ไม่ใช่การรักษาหืด", "Exacerbation รุนแรงต้องให้ systemic steroid เสมอ"],
          k: "Asthma exacerbation (ผู้ใหญ่): prednisolone 40–50 mg/day 5–7 วัน ไม่ต้อง taper",
        },
        {
          d: "hard",
          p: "หลังได้ salbutamol + ipratropium 3 รอบและ steroid แล้ว อาการยังไม่ดีขึ้น PEF 35% ยาใดควรพิจารณาเพิ่มเป็นลำดับถัดไป?",
          o: [
            "Magnesium sulfate 2 g IV หยดใน 20 นาที",
            "Aminophylline IV loading",
            "Salmeterol MDI 4 puffs",
            "Montelukast 10 mg PO",
            "Propranolol IV เพื่อลด heart rate",
          ],
          a: 0,
          r: "Magnesium sulfate IV (2 g ใน 20 นาที) ช่วยคลายกล้ามเนื้อหลอดลม ลดการนอนโรงพยาบาลในผู้ที่มีอาการรุนแรงหรือไม่ตอบสนองต่อการรักษาเบื้องต้น. Aminophylline ไม่แนะนำเพราะได้ผลไม่ต่างและ ADR มาก. ประเมินความจำเป็นเข้า ICU/ใส่ท่อช่วยหายใจ",
          w: ["ถูก", "ไม่แนะนำ ประสิทธิภาพต่ำ ADR มาก", "ไม่ใช้ในภาวะเฉียบพลัน", "ไม่มีบทบาทในภาวะรุนแรงเฉียบพลัน", "Beta-blocker ทำให้หลอดลมหดเกร็ง อันตรายมาก"],
          k: "Severe asthma ไม่ตอบสนอง → MgSO₄ 2 g IV ใน 20 นาที; ไม่แนะนำ aminophylline",
        },
      ],
    },
    {
      ref: "ACCP Guideline: Cough due to ACE inhibitors; ACEI prescribing information",
      qs: [
        {
          d: "easy",
          p: "ผู้ป่วยความดันโลหิตสูงใช้ enalapril 10 mg BID มา 2 เดือน มีไอแห้งๆ เรื้อรัง ไม่มีไข้ CXR ปกติ ข้อใดเหมาะสมที่สุด?",
          o: ["เปลี่ยนเป็น losartan", "เพิ่ม dextromethorphan และใช้ enalapril ต่อ", "เปลี่ยนเป็น lisinopril", "เพิ่ม amoxicillin", "เพิ่ม salbutamol MDI"],
          a: 0,
          r: "ACEI ยับยั้งการทำลาย bradykinin และ substance P ทำให้ไอแห้งได้ 5–20% (พบมากในคนเอเชีย) เป็น class effect จึงควรเปลี่ยนเป็น ARB ซึ่งไม่มีผลต่อ bradykinin อาการไอมักหายใน 1–4 สัปดาห์",
          w: ["ถูก", "ยาแก้ไอไม่ได้ผลกับไอจาก ACEI", "ACEI ทุกตัวทำให้ไอได้ (class effect)", "ไม่ใช่การติดเชื้อ", "ไม่ใช่หลอดลมหดเกร็ง"],
          k: "ACEI cough (bradykinin) = class effect → เปลี่ยนเป็น ARB",
        },
      ],
    },
    {
      ref: "FDA Drug Safety Communication 2020: Boxed Warning for montelukast",
      qs: [
        {
          d: "medium",
          p: "เด็กอายุ 10 ปี ใช้ montelukast 5 mg ก่อนนอนสำหรับโรคหืดและภูมิแพ้ ผู้ปกครองสังเกตว่าเด็กฝันร้าย หงุดหงิด ก้าวร้าวมากขึ้น ข้อใดเหมาะสมที่สุด?",
          o: [
            "หยุด montelukast และแจ้งแพทย์ เพราะอาจเป็น neuropsychiatric ADR",
            "ใช้ต่อเพราะเป็นอาการของโรคหืด",
            "เปลี่ยนเวลาให้ยาเป็นตอนเช้าแล้วใช้ต่อได้เลย",
            "เพิ่มขนาดเป็น 10 mg",
            "เพิ่ม diphenhydramine ก่อนนอน",
          ],
          a: 0,
          r: "Montelukast มี boxed warning เรื่อง neuropsychiatric events: ฝันร้าย นอนไม่หลับ ซึมเศร้า ก้าวร้าว จนถึงความคิดฆ่าตัวตาย ควรหยุดยาและประเมิน ไม่ใช่ยาตัวแรกสำหรับภูมิแพ้จมูกเมื่อมีทางเลือกอื่น",
          w: ["ถูก", "เป็น ADR ที่มี boxed warning", "ยังคงเสี่ยงอาการทางจิตประสาท", "เพิ่มความเสี่ยง และเกินขนาดของเด็กอายุนี้", "ไม่แก้สาเหตุ และทำให้ง่วงซึม"],
          k: "Montelukast: boxed warning neuropsychiatric (ฝันร้าย ก้าวร้าว ความคิดฆ่าตัวตาย)",
        },
      ],
    },
    {
      ref: "ARIA 2019/2020 Guideline for Allergic Rhinitis; Intranasal corticosteroid patient information",
      qs: [
        {
          d: "easy",
          p: "ผู้ป่วยโรคจมูกอักเสบจากภูมิแพ้ต่อเนื่อง เริ่มใช้ fluticasone พ่นจมูก คำแนะนำใดถูกต้องที่สุด?",
          o: [
            "พ่นทุกวันต่อเนื่อง หันหัวพ่นออกจากผนังกั้นจมูก ยาเริ่มได้ผลใน 1–2 วันและเต็มที่ใน 1–2 สัปดาห์",
            "พ่นเฉพาะวันที่มีอาการ",
            "พ่นตรงไปที่ผนังกั้นจมูกให้แรงที่สุด",
            "ใช้ได้ไม่เกิน 3 วันเพราะจะเกิดจมูกบวมซ้ำ",
            "สูดยาเข้าลึกให้ยาลงคอ",
          ],
          a: 0,
          r: "Intranasal corticosteroid เป็นยาหลักของ persistent allergic rhinitis ได้ผลดีที่สุดเมื่อใช้สม่ำเสมอ พ่นโดยใช้มือข้างตรงข้าม หันหัวพ่นออกจากผนังกั้นจมูก ลดเลือดกำเดาและผนังจมูกทะลุ. อาการจมูกบวมซ้ำ (rhinitis medicamentosa) เกิดกับ decongestant ไม่ใช่ steroid",
          w: ["ถูก", "ได้ผลน้อยเมื่อใช้เป็นครั้งคราว", "เสี่ยงเลือดกำเดาและผนังกั้นจมูกทะลุ", "เป็นข้อควรระวังของ decongestant พ่นจมูก", "ยาควรอยู่ในโพรงจมูก ไม่ใช่ลงคอ"],
          k: "INCS: ใช้ทุกวัน, หันออกจาก septum, onset 1–2 วัน เต็มที่ 1–2 สัปดาห์; rebound = decongestant",
        },
      ],
    },
  ],
};
