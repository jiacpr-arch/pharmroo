import type { McqQuestion } from "@/lib/types-mcq";
import { buildPc1Cases, type Pc1Case } from "@/lib/pc1-case-builder";

// PC1 Daily — Day 4/30 (2 เคส/วัน) · สัปดาห์ที่ 1: ระบบหัวใจและหลอดเลือด (ปิดสัปดาห์)
// Case 19: Secondary prevention dyslipidemia — statin-associated muscle symptoms → ezetimibe → PCSK9i → fibrate choice
// Case 20: VTE in pregnancy — LMWH dosing, peripartum/neuraxial timing, duration, postpartum/breastfeeding

const CASES: Pc1Case[] = [
  {
    title: "Post-MI dyslipidemia + statin intolerance",
    base:
      "ชายไทยอายุ 58 ปี น้ำหนัก 75 kg เป็น MI และทำ PCI เมื่อ 1 ปีก่อน มี T2DM และ HTN. LDL-C ก่อนเริ่ม statin 160 mg/dL. " +
      "ได้ atorvastatin 80 mg OD มา 6 สัปดาห์ แล้วปวดเมื่อยต้นขาทั้งสองข้างจนรบกวนการเดินและการทำงาน ไม่มีปัสสาวะสีเข้ม. " +
      "Lab: CK 380 U/L (ULN 190), SCr 1.0 mg/dL, ALT ปกติ, TSH ปกติ. LDL-C ขณะได้ atorvastatin 80 mg = 58 mg/dL, TG 180 mg/dL",
    ref: "2019 ESC/EAS Dyslipidaemia Guideline; 2022 ACC Expert Consensus Decision Pathway on Non-statin Therapies; NLA Statin Intolerance Statement 2022",
    qs: [
      {
        p: "การจัดการอาการปวดกล้ามเนื้อของผู้ป่วยรายนี้ข้อใดเหมาะสมที่สุด?",
        o: [
          "ให้ atorvastatin 80 mg ต่อ และเพิ่ม coenzyme Q10 เพื่อรักษาอาการ",
          "หยุด statin ทุกชนิดถาวร เปลี่ยนเป็น fenofibrate",
          "หยุด atorvastatin จนอาการหาย (2–4 สัปดาห์) แล้ว rechallenge ด้วย statin ตัวอื่นขนาดต่ำ เช่น rosuvastatin 5–10 mg",
          "เปลี่ยนเป็น simvastatin 80 mg OD",
          "หยุดยาลดไขมันทั้งหมด ใช้น้ำมันปลาแทน",
        ],
        a: 2,
        r: "Statin-associated muscle symptoms ที่ CK < 4 × ULN แต่มีอาการรบกวนชีวิตประจำวัน → หยุด statin ชั่วคราวจนอาการหาย แล้ว rechallenge ด้วย statin อื่น/ขนาดต่ำ/วันเว้นวัน. ผู้ป่วยส่วนใหญ่กลับมาใช้ statin ได้ และผู้ป่วย post-MI ได้ประโยชน์จาก statin มาก",
        w: [
          "CoQ10 ไม่มีหลักฐานชัดว่ารักษา SAMS และการให้ขนาดเดิมต่อไม่แก้อาการที่รบกวน",
          "ไม่ควรสรุปว่าแพ้ statin ถาวรจากการลองครั้งเดียว และ fibrate ไม่ลด CV events เทียบเท่า statin",
          "ถูก",
          "Simvastatin 80 mg มีความเสี่ยง myopathy สูงที่สุด ไม่แนะนำแล้ว",
          "ผู้ป่วยเสี่ยงสูงมาก การหยุดยาลดไขมันเพิ่มความเสี่ยง recurrent event",
        ],
        k: "SAMS: ตรวจ CK, TSH, vitamin D, DDI → หยุดชั่วคราว → rechallenge (ตัวอื่น/ขนาดต่ำ/intermittent); CK > 10 × ULN หรือ rhabdomyolysis → หยุดถาวร",
      },
      {
        p: "ตาม ESC/EAS 2019 เป้าหมาย LDL-C ของผู้ป่วยรายนี้คือข้อใด?",
        o: [
          "< 130 mg/dL",
          "< 100 mg/dL",
          "< 70 mg/dL",
          "< 55 mg/dL และลดลง ≥ 50% จากค่าเริ่มต้น",
          "< 40 mg/dL เพราะเป็นเบาหวาน",
        ],
        a: 3,
        r: "Established ASCVD (MI) = very-high risk → LDL-C < 55 mg/dL (1.4 mmol/L) และลด ≥ 50% จาก baseline (160 → ≤ 80). ถ้ามี vascular event ครั้งที่ 2 ภายใน 2 ปีขณะได้ statin ขนาดสูงสุด เป้าหมาย < 40 mg/dL",
        c: ["Baseline 160 mg/dL → ลด ≥ 50% = ≤ 80 mg/dL", "Very-high risk → < 55 mg/dL", "ต้องผ่านทั้งสองเกณฑ์ → เป้าหมาย < 55 mg/dL"],
        w: [
          "เป็นเป้าหมายของ low risk",
          "เป็นเป้าหมายของ moderate risk",
          "เป็นเป้าหมายของ high risk (ไม่ใช่ very-high)",
          "ถูก",
          "< 40 mg/dL ใช้เมื่อเกิด event ซ้ำภายใน 2 ปีขณะได้ maximally tolerated statin ไม่ใช่เพราะ DM",
        ],
        k: "ESC/EAS 2019: very-high < 55 และ ↓ ≥ 50%; high < 70; moderate < 100; low < 116",
      },
      {
        p: "หลัง rechallenge ผู้ป่วยทน rosuvastatin 10 mg ได้ดี แต่ LDL-C = 90 mg/dL. ขั้นต่อไปที่เหมาะสมที่สุดคือข้อใด?",
        o: [
          "เพิ่ม ezetimibe 10 mg OD",
          "เพิ่ม gemfibrozil 600 mg BID",
          "เพิ่ม niacin ER 1 g/day",
          "เพิ่ม omega-3 fatty acid 4 g/day",
          "เพิ่ม rosuvastatin เป็น 40 mg ทันที",
        ],
        a: 0,
        r: "เมื่อได้ maximally tolerated statin แล้วยังไม่ถึงเป้า ให้เพิ่ม ezetimibe เป็นลำดับแรก (ลด LDL-C เพิ่มอีก ~20–25%, IMPROVE-IT ลด CV events) — ผู้ป่วยเพิ่งมีประวัติ SAMS จึงไม่ควรเพิ่ม statin ขนาดสูงสุดทันที",
        w: [
          "ถูก",
          "Gemfibrozil + statin เพิ่มความเสี่ยง rhabdomyolysis และไม่ได้ลด LDL-C เป็นหลัก",
          "Niacin ไม่ลด CV events เมื่อใช้ร่วม statin และเพิ่ม ADR",
          "Omega-3 ไม่ได้ลด LDL-C (icosapent ethyl ใช้สำหรับ TG สูง)",
          "เพิ่มเร็วเกินไปในผู้ที่เพิ่งมี SAMS เสี่ยงอาการกลับมา",
        ],
        k: "Statin → + ezetimibe → + PCSK9 inhibitor (หรือ inclisiran/bempedoic acid ตามความเหมาะสม)",
      },
      {
        p: "3 เดือนหลังเพิ่ม ezetimibe LDL-C = 72 mg/dL (adherence ดี) ยังไม่ถึงเป้า. ข้อใดเหมาะสมที่สุด?",
        o: [
          "เพิ่ม ezetimibe เป็น 20 mg OD",
          "เพิ่ม cholestyramine 8 g BID",
          "เปลี่ยน ezetimibe เป็น fenofibrate",
          "เพิ่ม PCSK9 inhibitor เช่น evolocumab 140 mg SC ทุก 2 สัปดาห์",
          "หยุด rosuvastatin เพราะไม่ได้ผล",
        ],
        a: 3,
        r: "Very-high risk ที่ได้ statin + ezetimibe แล้ว LDL-C ยังไม่ถึงเป้า → เพิ่ม PCSK9 monoclonal antibody (ลด LDL-C เพิ่ม ~60%, FOURIER/ODYSSEY ลด CV events) คาดว่า LDL-C ≈ 72 × 0.4 ≈ 29 mg/dL",
        c: ["PCSK9 mAb ลด LDL-C ~60%", "72 × (1 − 0.6) ≈ 29 mg/dL → ถึงเป้า < 55"],
        w: [
          "Ezetimibe มีขนาดเดียวคือ 10 mg/day",
          "Bile acid sequestrant ลด LDL-C น้อย เพิ่ม TG ขัดขวางการดูดซึมยาอื่น และ GI ADR มาก",
          "Fenofibrate ลด LDL-C ได้น้อยกว่าและไม่ใช่ขั้นตอนตามแนวทาง",
          "ถูก",
          "Statin ยังเป็นพื้นฐาน การหยุดทำให้ LDL-C สูงขึ้นมาก",
        ],
        k: "PCSK9 mAb: evolocumab 140 mg q2w หรือ 420 mg q4w; alirocumab 75–150 mg q2w",
      },
      {
        p: "1 ปีต่อมาผู้ป่วยดื่มสุราหนัก ตรวจพบ TG 880 mg/dL (ยังได้ rosuvastatin + ezetimibe + evolocumab). หากต้องเพิ่มยากลุ่ม fibrate ร่วมกับ statin ควรเลือกข้อใด?",
        o: [
          "Gemfibrozil 600 mg BID",
          "Fenofibrate (ปรับขนาดตามการทำงานของไต)",
          "Niacin IR 3 g/day",
          "Cholestyramine 4 g TID",
          "ไม่ต้องใช้ยา แค่งดสุราอย่างเดียวในผู้ที่ TG > 880",
        ],
        a: 1,
        r: "TG > 500–880 mg/dL เสี่ยง acute pancreatitis → งดสุรา + ลดไขมันในอาหาร + fibrate. เมื่อใช้ร่วม statin ต้องเลือก fenofibrate เพราะ gemfibrozil ยับยั้ง glucuronidation (UGT1A1/1A3) และ OATP1B1 ทำให้ระดับ statin สูง → rhabdomyolysis",
        w: [
          "Gemfibrozil + statin เสี่ยง myopathy/rhabdomyolysis สูง — หลีกเลี่ยง",
          "ถูก",
          "Niacin เพิ่ม ADR (flushing, hepatotoxicity, hyperglycemia) ในผู้ป่วยเบาหวาน",
          "Bile acid sequestrant เพิ่ม TG — ห้ามใช้เมื่อ TG > 400",
          "TG สูงมากเสี่ยง pancreatitis ต้องใช้ยาร่วมกับปรับพฤติกรรม",
        ],
        k: "Statin + fibrate → fenofibrate เท่านั้น; ห้าม gemfibrozil. TG > 1,000 (หรือ > 880) = pancreatitis risk",
      },
    ],
  },
  {
    title: "VTE in pregnancy",
    base:
      "หญิงไทยอายุ 30 ปี G2P1 อายุครรภ์ 20 สัปดาห์ น้ำหนักปัจจุบัน 70 kg ขาซ้ายบวมปวด 3 วัน Doppler ultrasound: proximal DVT ขาซ้าย ไม่มีอาการของ PE. " +
      "ไม่มี mechanical heart valve ไม่มีประวัติ VTE. Lab: platelet 230,000/mm³, SCr 0.6 mg/dL, ALT ปกติ",
    ref: "ASH 2018 Guideline VTE in the Context of Pregnancy; ACOG Practice Bulletin No. 196; ASRA 2018 Regional Anesthesia in Patients on Antithrombotic Therapy; RCOG Green-top Guideline 37b",
    qs: [
      {
        p: "ยาต้านการแข็งตัวของเลือดใดเหมาะสมที่สุดสำหรับผู้ป่วยรายนี้?",
        o: [
          "Warfarin ให้ INR 2–3",
          "Rivaroxaban 15 mg BID 21 วัน แล้ว 20 mg OD",
          "Dabigatran 150 mg BID",
          "Low-molecular-weight heparin (enoxaparin) ขนาดรักษา",
          "Aspirin 81 mg OD",
        ],
        a: 3,
        r: "LMWH ไม่ผ่านรก ปลอดภัยต่อทารก และมีข้อมูลมากที่สุด → first-line สำหรับ VTE ระหว่างตั้งครรภ์",
        w: [
          "Warfarin ผ่านรก → warfarin embryopathy (GA 6–12 สัปดาห์) และเลือดออกในทารก/สมอง",
          "DOAC ผ่านรกและข้อมูลความปลอดภัยไม่พอ — หลีกเลี่ยงในการตั้งครรภ์",
          "DOAC หลีกเลี่ยงในการตั้งครรภ์",
          "ถูก",
          "Aspirin ไม่ใช่การรักษา DVT",
        ],
        k: "Pregnancy VTE: LMWH (UFH ถ้าไตวาย/ใกล้คลอด); หลีกเลี่ยง warfarin และ DOAC",
      },
      {
        p: "ขนาด enoxaparin ขนาดรักษาแบบวันละ 2 ครั้งที่เหมาะสมคือข้อใด?",
        o: [
          "40 mg SC OD",
          "35 mg SC q12h",
          "70 mg SC q12h",
          "100 mg SC q12h",
          "140 mg SC OD",
        ],
        a: 2,
        r: "Enoxaparin ขนาดรักษา 1 mg/kg SC q12h ตามน้ำหนักปัจจุบัน → 70 mg q12h (หรือ 1.5 mg/kg OD ในบางแนวทาง; หลายแนวทางแนะนำ q12h ในครรภ์เพราะ clearance เพิ่มขึ้น)",
        c: ["1 mg/kg × 70 kg = 70 mg SC ทุก 12 ชั่วโมง"],
        w: [
          "เป็นขนาดป้องกัน (prophylaxis)",
          "0.5 mg/kg q12h — intermediate dose ไม่พอสำหรับรักษา",
          "ถูก",
          "เกินขนาด (~1.4 mg/kg q12h)",
          "2 mg/kg OD — เกินขนาด",
        ],
        k: "Enoxaparin treatment: 1 mg/kg q12h หรือ 1.5 mg/kg OD; prophylaxis 40 mg OD",
      },
      {
        p: "ที่อายุครรภ์ 38 สัปดาห์ แพทย์วางแผนชักนำการคลอดและผู้ป่วยต้องการ epidural analgesia. ข้อใดถูกต้องที่สุด?",
        o: [
          "ให้ enoxaparin ขนาดเดิมต่อจนถึงวันคลอด ใส่ epidural ได้ทันที",
          "หยุด enoxaparin ขนาดรักษาอย่างน้อย 24 ชั่วโมงก่อน neuraxial anesthesia/การชักนำคลอดที่วางแผนไว้",
          "หยุด enoxaparin 4 ชั่วโมงก่อนใส่ epidural",
          "เปลี่ยนเป็น warfarin ตั้งแต่อายุครรภ์ 36 สัปดาห์",
          "หยุด enoxaparin ตั้งแต่อายุครรภ์ 28 สัปดาห์",
        ],
        a: 1,
        r: "Therapeutic-dose LMWH ต้องเว้น ≥ 24 ชั่วโมงก่อน neuraxial puncture (prophylactic dose ≥ 12 ชั่วโมง) เพื่อป้องกัน spinal/epidural hematoma. บางแนวทางเปลี่ยนเป็น UFH ที่ 36–37 สัปดาห์เพื่อความยืดหยุ่น",
        w: [
          "เสี่ยง spinal/epidural hematoma",
          "ถูก",
          "สั้นเกินไป (4 ชม. ใช้กับ UFH SC ขนาดป้องกัน)",
          "Warfarin ผ่านรกทำให้ทารกเลือดออกขณะคลอด",
          "หยุดเร็วเกินไป เสี่ยง VTE ซ้ำในไตรมาสที่ 3",
        ],
        k: "Neuraxial: LMWH prophylactic ≥ 12 ชม., therapeutic ≥ 24 ชม.; เริ่มใหม่หลังถอดสายตามแนวทาง ASRA",
      },
      {
        p: "ระยะเวลาการให้ยาต้านการแข็งตัวของเลือดที่เหมาะสมที่สุดคือข้อใด?",
        o: [
          "หยุดทันทีหลังคลอด",
          "รวม 6 สัปดาห์นับจากวินิจฉัย",
          "ต่อเนื่องจนถึงอย่างน้อย 6 สัปดาห์หลังคลอด และรวมทั้งหมดไม่น้อยกว่า 3 เดือน",
          "ตลอดชีวิต",
          "ถึง 2 สัปดาห์หลังคลอด",
        ],
        a: 2,
        r: "ช่วงหลังคลอดมีความเสี่ยง VTE สูงที่สุด → ให้ต่อจนถึง ≥ 6 สัปดาห์หลังคลอด และรวมระยะเวลาทั้งหมด ≥ 3 เดือน",
        w: [
          "Postpartum เป็นช่วงที่เสี่ยงสูงสุด",
          "สั้นเกินไป",
          "ถูก",
          "Provoked (pregnancy) VTE ครั้งแรก ไม่ต้องให้ตลอดชีวิต",
          "สั้นเกินไป",
        ],
        k: "Pregnancy-associated VTE: ≥ 6 สัปดาห์หลังคลอด และรวม ≥ 3 เดือน",
      },
      {
        p: "หลังคลอดผู้ป่วยต้องการเลี้ยงลูกด้วยนมแม่ และไม่อยากฉีดยาต่อ. ยารับประทานใดเหมาะสมที่สุด?",
        o: [
          "Rivaroxaban 20 mg OD",
          "Apixaban 5 mg BID",
          "Dabigatran 150 mg BID",
          "Warfarin โดย overlap กับ enoxaparin จน INR 2–3 ติดต่อกัน ≥ 24 ชั่วโมง (อย่างน้อย 5 วัน)",
          "Edoxaban 60 mg OD",
        ],
        a: 3,
        r: "Warfarin (และ LMWH/UFH) ผ่านน้ำนมน้อยมาก ใช้ได้ขณะให้นมบุตร. DOAC ผ่านน้ำนม/ข้อมูลไม่เพียงพอ → หลีกเลี่ยงขณะให้นม. การเปลี่ยนเป็น warfarin ต้อง overlap กับ parenteral anticoagulant ≥ 5 วัน และจน INR ≥ 2 ติดต่อกัน 24 ชม.",
        w: [
          "DOAC ไม่แนะนำขณะให้นมบุตร",
          "DOAC ไม่แนะนำขณะให้นมบุตร",
          "DOAC ไม่แนะนำขณะให้นมบุตร",
          "ถูก",
          "DOAC ไม่แนะนำขณะให้นมบุตร",
        ],
        k: "Breastfeeding: warfarin, LMWH, UFH ปลอดภัย; หลีกเลี่ยง DOAC",
      },
    ],
  },
];

// ต่อท้าย PC1 (Case 1–18, ข้อ 1–87) → Case 19–20, ข้อ 88–97
export const PC1_DAY04: McqQuestion[] = buildPc1Cases(CASES, {
  idPrefix: "pc1d04q",
  caseOffset: 18,
  qOffset: 87,
  createdAt: "2026-09-26 09:00:00",
});
