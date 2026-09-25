import type { McqQuestion } from "@/lib/types-mcq";
import { buildPc1Cases, type Pc1Case } from "@/lib/pc1-case-builder";

// PC1 Daily — Day 2/30 (2 เคส/วัน, ~10–12 ข้อ) · สัปดาห์ที่ 1: ระบบหัวใจและหลอดเลือด
// Case 15: STEMI → primary PCI → DAPT/switching/secondary prevention
// Case 16: Acute PE + AKI → UFH weight-based nomogram → HIT

const CASES: Pc1Case[] = [
  {
    title: "STEMI + primary PCI + DAPT",
    base:
      "ชายไทยอายุ 62 ปี น้ำหนัก 80 kg เจ็บแน่นหน้าอกร้าวไปแขนซ้าย 2 ชั่วโมง ECG: ST elevation V1–V4, hs-troponin T สูง. " +
      "โรคประจำตัว HTN, T2DM, สูบบุหรี่วันละ 1 ซอง ยาเดิม amlodipine 10 mg OD, metformin 1,000 mg BID, omeprazole 20 mg OD (GERD). " +
      "ไม่มีประวัติ stroke/TIA หรือเลือดออก. BP 150/90 mmHg, HR 88 bpm, ไม่มีภาวะหัวใจล้มเหลว. SCr 1.2 mg/dL, K⁺ 4.4 mEq/L. โรงพยาบาลทำ primary PCI ได้ภายใน 90 นาที",
    ref: "2025 ACC/AHA/ACEP/NAEMSP/SCAI ACS Guideline; 2023 ESC ACS Guideline; International Expert Consensus on Switching Platelet P2Y12 Inhibitors (Circulation 2017)",
    qs: [
      {
        p: "ยาต้านเกล็ดเลือดก่อนทำ primary PCI ข้อใดเหมาะสมที่สุด?",
        o: [
          "Aspirin 300 mg เคี้ยว + ticagrelor 180 mg loading",
          "Aspirin 81 mg + clopidogrel 75 mg",
          "Aspirin 300 mg + clopidogrel 300 mg + tenecteplase",
          "Aspirin 300 mg + prasugrel 10 mg (ไม่ต้อง loading)",
          "Aspirin 300 mg + ticagrelor 90 mg",
        ],
        a: 0,
        r: "STEMI ที่ทำ primary PCI: aspirin loading 162–325 mg (เคี้ยว) ร่วมกับ potent P2Y12 inhibitor loading — ticagrelor 180 mg (หรือ prasugrel 60 mg ในผู้ไม่มี stroke/TIA) ดีกว่า clopidogrel",
        w: [
          "ถูก: aspirin loading + ticagrelor 180 mg",
          "เป็นขนาด maintenance ไม่มี loading — ออกฤทธิ์ช้าเกินไป",
          "ไม่ต้องให้ fibrinolytic เมื่อทำ primary PCI ได้ทันเวลา และ clopidogrel 300 mg ต่ำกว่าขนาดที่ใช้ก่อน PCI (600 mg)",
          "Prasugrel ต้อง loading 60 mg ก่อน; 10 mg เป็นขนาด maintenance",
          "Ticagrelor loading คือ 180 mg ไม่ใช่ 90 mg",
        ],
        k: "Primary PCI: aspirin 162–325 mg + ticagrelor 180 mg หรือ prasugrel 60 mg (clopidogrel 600 mg เมื่อใช้ 2 ตัวแรกไม่ได้)",
      },
      {
        p: "ระหว่างทำ primary PCI (ไม่ใช้ GP IIb/IIIa inhibitor) ควรให้ unfractionated heparin IV bolus ขนาดเท่าใด?",
        o: ["2,000 U", "4,000 U", "5,600–8,000 U", "10,000–12,000 U", "ไม่ให้ UFH ใช้ fondaparinux 2.5 mg SC แทน"],
        a: 2,
        r: "UFH ระหว่าง primary PCI: 70–100 U/kg IV bolus (ลดเป็น 50–70 U/kg ถ้าใช้ GP IIb/IIIa) → 80 kg × 70–100 = 5,600–8,000 U แล้ว titrate ตาม ACT",
        c: ["70 U/kg × 80 kg = 5,600 U", "100 U/kg × 80 kg = 8,000 U", "ขนาด 5,600–8,000 U IV bolus และติดตาม ACT"],
        w: [
          "ต่ำเกินไป (25 U/kg)",
          "ต่ำเกินไป (50 U/kg) เป็นขนาดเมื่อใช้ร่วม GP IIb/IIIa",
          "ถูก: 70–100 U/kg",
          "สูงเกิน (125–150 U/kg) เสี่ยงเลือดออก",
          "ห้ามใช้ fondaparinux เป็น anticoagulant เดี่ยวใน primary PCI เพราะเสี่ยง catheter thrombosis",
        ],
        k: "Primary PCI anticoagulant: UFH 70–100 U/kg (ไม่มี GPI) หรือ bivalirudin; ห้าม fondaparinux เดี่ยว",
      },
      {
        p: "หลัง PCI แพทย์ให้ ticagrelor 90 mg BID. ขนาด aspirin ต่อเนื่องที่เหมาะสมคือข้อใด?",
        o: [
          "Aspirin 325 mg วันละครั้ง",
          "Aspirin 162 mg วันละ 2 ครั้ง",
          "Aspirin 81 mg วันละครั้ง",
          "Aspirin 300 mg วันเว้นวัน",
          "หยุด aspirin ทันทีหลัง PCI ใช้ ticagrelor เดี่ยว",
        ],
        a: 2,
        r: "เมื่อใช้ร่วม ticagrelor ต้องให้ aspirin maintenance ≤ 100 mg/day — ข้อมูลจาก PLATO พบว่า aspirin ขนาดสูง (> 100 mg) ลดประสิทธิภาพของ ticagrelor",
        w: [
          "> 100 mg/day ลดประสิทธิภาพของ ticagrelor",
          "324 mg/day สูงเกิน",
          "ถูก: 75–100 mg/day",
          "ขนาดและความถี่ไม่เหมาะสม",
          "ต้องให้ DAPT ต่อเนื่อง (มาตรฐาน 12 เดือน) การหยุด aspirin ทันทีเสี่ยง stent thrombosis",
        ],
        k: "Ticagrelor + aspirin ≤ 100 mg/day",
      },
      {
        p: "Statin ข้อใดเหมาะสมที่สุดสำหรับผู้ป่วยรายนี้ (LDL-C 142 mg/dL) ขณะได้ ticagrelor?",
        o: [
          "Simvastatin 80 mg OD",
          "Pravastatin 20 mg OD",
          "Rosuvastatin 5 mg OD",
          "Atorvastatin 80 mg OD",
          "Ezetimibe 10 mg OD เดี่ยว",
        ],
        a: 3,
        r: "หลัง ACS ต้องใช้ high-intensity statin (atorvastatin 40–80 mg หรือ rosuvastatin 20–40 mg) เป้าหมาย LDL-C < 55 mg/dL. Ticagrelor เป็น CYP3A4 inhibitor อ่อน — เพิ่มระดับ simvastatin/lovastatin จึงห้ามใช้ simvastatin > 40 mg",
        w: [
          "ห้าม simvastatin > 40 mg ร่วมกับ ticagrelor (เพิ่มระดับ simvastatin → myopathy) และ simvastatin 80 mg ไม่แนะนำแล้ว",
          "Low-intensity ไม่พอสำหรับ ACS",
          "Moderate/low intensity ไม่พอ ต้องเป็น 20–40 mg",
          "ถูก: high-intensity statin และไม่มีปัญหาปฏิกิริยาที่มีนัยสำคัญกับ ticagrelor",
          "Ezetimibe ใช้เสริมเมื่อ statin ไม่ถึงเป้า ไม่ใช้แทน statin",
        ],
        k: "ACS → high-intensity statin; ticagrelor + simvastatin/lovastatin ≤ 40 mg",
      },
      {
        p: "วันที่ 3 ผู้ป่วยบ่นหายใจไม่อิ่มเล็กน้อย เป็นพัก ๆ ขณะพัก SpO₂ 98%, ปอดไม่มี crepitation, CXR ปกติ, BNP ไม่สูง ไม่มีหลอดลมตีบ. ข้อใดเหมาะสมที่สุด?",
        o: [
          "หยุด DAPT ทั้งหมดทันที",
          "ให้ furosemide 40 mg IV",
          "อธิบายว่าเป็น ADR ที่พบบ่อยของ ticagrelor มักไม่รุนแรงและดีขึ้นเอง ให้ยาต่อและติดตาม",
          "เปลี่ยนเป็น warfarin",
          "หยุด aspirin เนื่องจาก aspirin-induced bronchospasm",
        ],
        a: 2,
        r: "Ticagrelor ยับยั้ง ENT1 ทำให้ adenosine เพิ่มขึ้น → dyspnea พบได้ ~14% ส่วนใหญ่ไม่รุนแรงและหายเอง — ถ้าไม่รบกวนมากให้ยาต่อ ถ้าทนไม่ได้จึงเปลี่ยน P2Y12 inhibitor",
        w: [
          "อันตราย — เสี่ยง stent thrombosis",
          "ไม่มีหลักฐาน volume overload",
          "ถูก: adenosine-mediated dyspnea",
          "Warfarin ไม่ได้ป้องกัน stent thrombosis",
          "ไม่มี wheeze/bronchospasm และอาการเข้าได้กับ ticagrelor มากกว่า",
        ],
        k: "Ticagrelor ADR: dyspnea (adenosine), bradyarrhythmia/ventricular pause, uric acid ↑",
      },
      {
        p: "ต่อมา dyspnea รบกวนชีวิตประจำวันมาก แพทย์ต้องการเปลี่ยนเป็น clopidogrel. ข้อใดถูกต้องที่สุด?",
        o: [
          "Clopidogrel 75 mg เริ่มพร้อมมื้อ ticagrelor ถัดไป และให้ omeprazole ต่อ",
          "Clopidogrel 600 mg loading 24 ชั่วโมงหลัง ticagrelor มื้อสุดท้าย แล้ว 75 mg/day และเปลี่ยน omeprazole เป็น pantoprazole",
          "Clopidogrel 300 mg ทันทีพร้อม ticagrelor มื้อเดิม และหยุด PPI",
          "หยุด P2Y12 inhibitor 7 วันก่อนเริ่ม clopidogrel",
          "Clopidogrel 75 mg และเพิ่ม esomeprazole 40 mg",
        ],
        a: 1,
        r: "De-escalation จาก ticagrelor → clopidogrel ในระยะ early/late: ให้ clopidogrel 600 mg loading 24 ชม. หลัง ticagrelor มื้อสุดท้าย เพื่อไม่ให้มีช่วง platelet inhibition ต่ำ. Omeprazole/esomeprazole ยับยั้ง CYP2C19 ลดการเปลี่ยน clopidogrel เป็น active metabolite → ใช้ pantoprazole แทน (ยังต้องมี PPI เพราะเสี่ยง GI bleed จาก DAPT)",
        w: [
          "ไม่มี loading dose และ omeprazole ลดฤทธิ์ clopidogrel",
          "ถูก",
          "Loading ต่ำและไม่ควรหยุด PPI ในผู้ป่วยที่ได้ DAPT และมี GERD",
          "การเว้นช่วงไม่มียาต้านเกล็ดเลือดเสี่ยง stent thrombosis",
          "Esomeprazole ยับยั้ง CYP2C19 เช่นเดียวกับ omeprazole",
        ],
        k: "Ticagrelor → clopidogrel: 600 mg LD 24 ชม. หลังมื้อสุดท้าย; clopidogrel + PPI → pantoprazole",
      },
      {
        p: "ก่อนจำหน่าย echocardiography: LVEF 38% BP 130/80 mmHg, HR 82 bpm, K⁺ 4.4 mEq/L, eGFR 62. ข้อใดควรเพิ่มในแผนการรักษามากที่สุด?",
        o: [
          "Diltiazem SR 180 mg OD เพื่อคุม HR",
          "Nifedipine IR 10 mg TID",
          "Ramipril เริ่มขนาดต่ำร่วมกับ bisoprolol และ titrate ขึ้นตามที่ทนได้",
          "Ivabradine 5 mg BID แทน beta-blocker",
          "Eplerenone 25 mg OD แทน ACEI",
        ],
        a: 2,
        r: "Post-MI ร่วม LVEF ≤ 40%: ACEI (หรือ ARB) + evidence-based beta-blocker (bisoprolol, carvedilol, metoprolol succinate) ลด mortality/reinfarction; เพิ่ม MRA ได้ภายหลังในผู้ที่มี DM หรือ HF",
        w: [
          "Non-DHP CCB เพิ่ม mortality ใน LV systolic dysfunction",
          "Nifedipine IR ทำให้ reflex tachycardia และเพิ่ม mortality หลัง MI",
          "ถูก: ACEI + beta-blocker",
          "Ivabradine ใช้เมื่อได้ beta-blocker ขนาดสูงสุดแล้ว HR ยัง ≥ 70 ใน HFrEF ไม่ใช่แทน",
          "MRA เป็นยาเสริม ไม่ใช่ยาแทน ACEI/ARB",
        ],
        k: "Post-MI LVEF ≤ 40%: ACEI/ARB + BB ± MRA; หลีกเลี่ยง non-DHP CCB และ nifedipine IR",
      },
    ],
  },
  {
    title: "Acute PE + AKI + heparin nomogram + HIT",
    base:
      "หญิงไทยอายุ 58 ปี น้ำหนัก 70 kg หลังผ่าตัดเปลี่ยนข้อสะโพก 7 วัน ได้ enoxaparin 40 mg SC OD ป้องกัน VTE ตั้งแต่วันแรกหลังผ่าตัด. " +
      "วันนี้หายใจเหนื่อยเฉียบพลัน CT pulmonary angiography: segmental PE. BP 118/74 mmHg, HR 104 bpm, SpO₂ 93% (room air), RV ไม่โต, troponin ปกติ. " +
      "Lab: SCr 2.4 mg/dL (AKI จากเดิม 0.9), platelet 250,000/mm³ (ก่อนผ่าตัด 260,000), aPTT baseline 30 วินาที",
    ref: "CHEST Guideline Antithrombotic Therapy for VTE 2021; ASH 2018 Guideline HIT; Raschke weight-based heparin nomogram (Ann Intern Med 1993)",
    qs: [
      {
        p: "CrCl ของผู้ป่วยรายนี้ (Cockcroft–Gault, ใช้น้ำหนักจริง) มีค่าใกล้เคียงข้อใดที่สุด?",
        o: ["20 mL/min", "24 mL/min", "28 mL/min", "33 mL/min", "40 mL/min"],
        a: 2,
        r: "CrCl = (140 − 58) × 70 / (72 × 2.4) × 0.85 ≈ 28 mL/min. ข้อควรระวัง: SCr ใน AKI ยังไม่ steady state ค่าจริงอาจต่ำกว่านี้",
        c: ["(140 − 58) × 70 = 82 × 70 = 5,740", "72 × 2.4 = 172.8", "5,740 / 172.8 = 33.2", "× 0.85 (หญิง) ≈ 28.2 mL/min"],
        w: ["ต่ำเกิน", "ต่ำเกิน", "ถูก", "ลืมคูณ 0.85", "สูงเกิน"],
        k: "AKI: SCr ไม่คงที่ → CrCl จาก CG อาจ overestimate; เลือกยาที่ปรับง่าย/ไม่พึ่งไต",
      },
      {
        p: "ยาต้านการแข็งตัวของเลือดเริ่มต้นใดเหมาะสมที่สุด?",
        o: [
          "Enoxaparin 1 mg/kg SC q12h",
          "Fondaparinux 7.5 mg SC OD",
          "Dabigatran 150 mg BID",
          "Unfractionated heparin IV แบบ weight-based ปรับตาม aPTT",
          "Alteplase 100 mg IV ใน 2 ชั่วโมง",
        ],
        a: 3,
        r: "PE ที่ hemodynamically stable ร่วม AKI (CrCl < 30 และไม่คงที่) → UFH IV เหมาะที่สุด: ไม่ขึ้นกับไต ปรับขนาด/หยุดได้เร็ว และ reverse ด้วย protamine ได้ครบ",
        w: [
          "CrCl < 30 ต้องลดเป็น 1 mg/kg q24h และ AKI ไม่คงที่เสี่ยงสะสม",
          "Fondaparinux ห้ามใช้เมื่อ CrCl < 30",
          "Dabigatran ห้ามใช้เมื่อ CrCl < 30 และต้องได้ parenteral anticoagulant ก่อน 5–10 วัน",
          "ถูก",
          "Systemic thrombolysis ใช้ใน high-risk (massive) PE ที่ BP ต่ำ — ผู้ป่วย BP ปกติ และเพิ่งผ่าตัดใหญ่ 7 วัน",
        ],
        k: "VTE + CrCl < 30/AKI/อาจต้องทำหัตถการ → UFH IV",
      },
      {
        p: "ขนาด UFH เริ่มต้นสำหรับ VTE ของผู้ป่วยรายนี้คือข้อใด?",
        o: [
          "Bolus 4,200 U แล้ว 840 U/h",
          "Bolus 5,000 U แล้ว 1,000 U/h",
          "Bolus 5,600 U แล้ว 1,260 U/h",
          "Bolus 7,000 U แล้ว 1,260 U/h",
          "Bolus 5,600 U แล้ว 1,750 U/h",
        ],
        a: 2,
        r: "VTE: UFH 80 U/kg IV bolus แล้ว 18 U/kg/h → 70 kg: 5,600 U bolus และ 1,260 U/h",
        c: ["Bolus = 80 U/kg × 70 kg = 5,600 U", "Infusion = 18 U/kg/h × 70 kg = 1,260 U/h"],
        w: [
          "เป็นขนาด ACS (60 U/kg, 12 U/kg/h)",
          "ขนาดคงที่ ไม่ได้คิดตามน้ำหนัก",
          "ถูก: 80 U/kg + 18 U/kg/h",
          "Bolus 100 U/kg สูงเกิน",
          "Infusion 25 U/kg/h สูงเกิน",
        ],
        k: "UFH: VTE 80 U/kg + 18 U/kg/h; ACS 60 U/kg (max 4,000) + 12 U/kg/h (max 1,000)",
      },
      {
        p: "6 ชั่วโมงหลังเริ่ม UFH ได้ aPTT = 40 วินาที (control 30 วินาที; nomogram: < 35 วินาที → rebolus 80 U/kg และเพิ่ม 4 U/kg/h; 35–45 → rebolus 40 U/kg และเพิ่ม 2 U/kg/h; 46–70 → ไม่ปรับ; 71–90 → ลด 2 U/kg/h; > 90 → หยุด 1 ชม. แล้วลด 3 U/kg/h). ควรปรับอย่างไร?",
        o: [
          "ไม่ต้องปรับ ตรวจ aPTT ซ้ำพรุ่งนี้",
          "Rebolus 5,600 U และเพิ่ม infusion เป็น 1,540 U/h",
          "หยุด infusion 1 ชั่วโมง แล้วลดเป็น 1,050 U/h",
          "Rebolus 2,800 U และเพิ่ม infusion เป็น 1,400 U/h แล้วตรวจ aPTT ซ้ำใน 6 ชั่วโมง",
          "หยุด UFH เปลี่ยนเป็น warfarin 10 mg",
        ],
        a: 3,
        r: "aPTT 40 วินาที (1.3 × control) อยู่ช่วง 35–45 → rebolus 40 U/kg = 2,800 U และเพิ่ม 2 U/kg/h = 140 U/h → 1,260 + 140 = 1,400 U/h, ตรวจ aPTT ซ้ำทุก 6 ชม. จนถึงเป้า (46–70 วินาที)",
        c: ["Rebolus = 40 U/kg × 70 = 2,800 U", "เพิ่ม 2 U/kg/h × 70 = 140 U/h", "Infusion ใหม่ = 1,260 + 140 = 1,400 U/h"],
        w: [
          "aPTT ต่ำกว่าเป้า ต้องปรับ",
          "เป็นแถวของ aPTT < 35 วินาที",
          "เป็นแถวของ aPTT > 90 วินาที",
          "ถูก",
          "ต้องมี parenteral anticoagulant ให้ถึงเป้าก่อน และ warfarin ต้อง overlap ≥ 5 วัน",
        ],
        k: "ตรวจ aPTT 6 ชม. หลังเริ่ม/ปรับทุกครั้ง; คำนวณจาก U/kg แล้วบวกกับ rate เดิม",
      },
      {
        p: "วันที่ 5 ของ UFH (วันที่ 12 หลังเริ่ม enoxaparin) platelet ลดลงเหลือ 95,000/mm³ และพบ DVT ใหม่ที่ขาซ้าย ไม่มีสาเหตุอื่นของเกล็ดเลือดต่ำ. การจัดการใดเหมาะสมที่สุด?",
        o: [
          "เปลี่ยน UFH เป็น enoxaparin 1 mg/kg SC q24h",
          "ให้ UFH ต่อและให้ platelet transfusion",
          "หยุด heparin ทุกชนิด (รวม heparin flush) เริ่ม argatroban IV และส่งตรวจ anti-PF4 antibody",
          "หยุด UFH แล้วเริ่ม warfarin 10 mg ทันที",
          "หยุดยาต้านการแข็งตัวของเลือดทั้งหมด ใส่ IVC filter",
        ],
        a: 2,
        r: "4T score สูง (platelet ลด > 50% และ nadir ≥ 20k = 2, เกิดวันที่ 5–10 = 2, thrombosis ใหม่ = 2, ไม่มีสาเหตุอื่น = 2 → 8) → สงสัย HIT อย่างมาก: หยุด heparin ทุกรูปแบบ ให้ non-heparin anticoagulant ทันที — argatroban เหมาะเพราะกำจัดทางตับ (ผู้ป่วยมี AKI)",
        c: ["Platelet ลดลง (250 − 95)/250 = 62% → 2 คะแนน", "Timing วันที่ 5–10 หลังได้ heparin → 2", "New thrombosis → 2", "ไม่มีสาเหตุอื่น → 2", "4T = 8 (high probability)"],
        w: [
          "LMWH มี cross-reactivity กับ HIT antibody สูง",
          "Platelet transfusion อาจเพิ่ม thrombosis และไม่ได้หยุดสาเหตุ",
          "ถูก",
          "Warfarin ในระยะ acute HIT ทำให้ protein C ลด → venous limb gangrene; เริ่มได้เมื่อ platelet ≥ 150,000 และ overlap กับ non-heparin anticoagulant",
          "HIT มีความเสี่ยง thrombosis สูงมาก ต้องได้ anticoagulant; IVC filter ไม่แนะนำ",
        ],
        k: "HIT: stop all heparin → argatroban (ตับ) / bivalirudin / fondaparinux (ไตดี) / DOAC ในรายที่เหมาะ; warfarin เมื่อ platelet ≥ 150k",
      },
    ],
  },
];

// ต่อท้าย PC1 (Case 1–14, ข้อ 1–64) → Case 15–16, ข้อ 65–76
export const PC1_DAY02: McqQuestion[] = buildPc1Cases(CASES, {
  idPrefix: "pc1d02q",
  caseOffset: 14,
  qOffset: 64,
  createdAt: "2026-09-25 09:00:00",
});
