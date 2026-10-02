import type { McqQuestion } from "@/lib/types-mcq";
import { buildPc1Cases, type Pc1Case } from "@/lib/pc1-case-builder";

// PC1 Exam Set 2 — ไฟล์ที่ 1/… (2 เคส/ไฟล์) — ชุดใหม่ที่เริ่มต่อท้ายชุด Day 1–10 เดิม (Case 1–32, ข้อ 1–157)
// เป้าหมาย: ทยอยสร้างเป็น "ชุดข้อสอบ PC1" ขนาดใหญ่ขึ้น (รวมเป้าหมาย 4–5 เซต x 120 ข้อ) ไม่ซ้ำกับ Day01–10, pilot-032,
// scenario-001 และ pc1-mock-001 (ไฟล์ orphan ที่ไม่ได้ใช้งานจริง แต่ยังเช็กหัวข้อไม่ให้ซ้ำไว้ด้วย)
// หัวข้อที่มีอยู่แล้ว (ห้ามซ้ำ): ADHF, CAP, AF+CKD, Gout+CKD, Depression/sertraline, Methotrexate toxicity, COPD exacerbation,
// Warfarin+co-trimoxazole+digoxin, TB/HIV, MRSA bacteremia+vancomycin AUC, Status epilepticus+phenytoin, DKA, Pediatric AOM,
// STEMI+DAPT, PE+AKI+heparin+HIT, Aortic dissection, Chronic HFrEF GDMT, Post-MI dyslipidemia+statin intolerance,
// VTE in pregnancy, Septic shock+aminoglycoside, Bacterial meningitis, Pyelonephritis in pregnancy+ESBL,
// Candidemia+azole-tacrolimus, C. difficile+stewardship, HCV/HBV+DAA, Triple-whammy AKI, SSRI-induced SIADH,
// T2DM+ASCVD GLP-1→insulin, Graves' in pregnancy, CKD G5D hemodialysis (anemia/CKD-MBD/SHPT), Long-term prednisolone
// (adrenal crisis/GIOP), Hyperkalemia, Asthma, Lithium, Anaphylaxis, Polypharmacy/Beers
// Case 33: Febrile neutropenia post-chemotherapy + CINV prophylaxis — หัวข้อ oncology supportive care ที่ยังไม่เคยมีมาก่อน
// Case 34: DOAC (apixaban)-associated major GI bleeding — reversal agent, resumption timing, CrCl calculation — ยังไม่เคยมีเคส DOAC reversal มาก่อน
// ผสมระดับความยาก: ปานกลาง 4 (รวม calculation 2 ข้อ) · ยาก 6

const CASES: Pc1Case[] = [
  {
    title: "Febrile neutropenia post-chemotherapy + CINV prophylaxis",
    base:
      "หญิงไทยอายุ 58 ปี เป็นมะเร็งเต้านมระยะลุกลาม ได้รับยาเคมีบำบัดสูตร TC (docetaxel 75 mg/m² + cyclophosphamide 600 mg/m²) รอบที่ 2 เมื่อ 8 วันก่อน มาโรงพยาบาลด้วยไข้ 38.6°C หนาวสั่นที่บ้าน ไม่มีอาการเฉพาะที่ชัดเจน " +
      "ผล CBC: WBC 1.2×10³/µL (segmented neutrophil 25%, band form 5%), Hb 10.1 g/dL, Plt 142,000/µL. BP 108/68 mmHg, HR 102 ครั้ง/นาที, RR 20, SpO₂ 97% room air ไม่มี hypotension หรือ organ dysfunction อื่น",
    ref: "NCCN Guidelines: Prevention and Treatment of Cancer-Related Infections; ASCO/IDSA Clinical Practice Guideline for Outpatient Management of Febrile Neutropenia; MASCC/ESMO Antiemetic Guidelines 2024",
    qs: [
      {
        d: "medium",
        p: "จากผล CBC ข้างต้น ค่า absolute neutrophil count (ANC) ของผู้ป่วยเท่ากับเท่าใด และเข้าเกณฑ์ febrile neutropenia หรือไม่?",
        o: [
          "300 cells/µL — เข้าเกณฑ์ febrile neutropenia",
          "360 cells/µL — เข้าเกณฑ์ febrile neutropenia",
          "720 cells/µL — เข้าเกณฑ์ febrile neutropenia",
          "1,200 cells/µL — ไม่เข้าเกณฑ์ febrile neutropenia",
          "3,600 cells/µL — ไม่เข้าเกณฑ์ febrile neutropenia",
        ],
        a: 1,
        r: "ANC = WBC รวม × (%segmented neutrophil + %band form) = 1,200 × (25% + 5%) = 1,200 × 0.30 = 360 cells/µL. Febrile neutropenia ตาม IDSA/NCCN คือ ANC <500 cells/µL (หรือคาดว่าจะลดลง <500 ภายใน 48 ชม.) ร่วมกับไข้ ≥38.3°C ครั้งเดียว หรือ ≥38.0°C นานต่อเนื่อง ≥1 ชม. ผู้ป่วยมี ANC 360 และไข้ 38.6°C จึงเข้าเกณฑ์",
        w: [
          "คำนวณจาก segmented neutrophil อย่างเดียว (1,200×25%=300) โดยลืมรวม band form ซึ่งต้องนับรวมด้วยเสมอ ทำให้ได้ค่าต่ำกว่าความเป็นจริง",
          "ถูกต้อง — รวม %segs และ %bands เข้าด้วยกันก่อนคูณกับ WBC รวม",
          "คูณค่า ANC ที่ถูกต้องซ้ำสอง (360×2=720) ซึ่งไม่มีเหตุผลทางคลินิกรองรับ",
          "ใช้ค่า WBC รวมทั้งหมดโดยไม่คูณด้วยสัดส่วน neutrophil เลย ได้ค่าสูงเกินจริงมาก และจะประเมินความเสี่ยงต่ำกว่าความเป็นจริงอย่างอันตราย",
          "ผิดพลาดด้านหน่วย เช่น อ่าน 1.2×10³ เป็น 12×10³ ทำให้ค่าคลาดเคลื่อนไปประมาณ 10 เท่า",
        ],
        c: [
          "WBC = 1,200 cells/µL",
          "%segs + %bands = 25% + 5% = 30%",
          "ANC = 1,200 × 0.30 = 360 cells/µL",
          "ANC <500 + ไข้ ≥38.3°C → เข้าเกณฑ์ febrile neutropenia",
        ],
        k: "ANC = WBC × (%segs + %bands) ต้องรวม band form เสมอ; ANC <500 cells/µL ร่วมกับไข้ คือเกณฑ์วินิจฉัย febrile neutropenia ที่ต้องให้ยาปฏิชีวนะโดยเร็ว",
      },
      {
        d: "hard",
        p: "การจัดการเบื้องต้นที่เหมาะสมที่สุดสำหรับผู้ป่วย febrile neutropenia รายนี้คือข้อใด?",
        o: [
          "เริ่มยาปฏิชีวนะ anti-pseudomonal beta-lactam ชนิดเดียว (เช่น cefepime 2 g IV q8h หรือ piperacillin-tazobactam) ทันทีภายใน 1 ชั่วโมง โดยไม่ต้องรอผลเพาะเชื้อ",
          "รอผลเพาะเชื้อเลือด (blood culture) ก่อน เพื่อเลือกยาปฏิชีวนะให้ตรงกับเชื้อที่พบ",
          "ให้ amoxicillin-clavulanate รับประทานกลับบ้านได้เลย เนื่องจากสัญญาณชีพยังคงที่",
          "เริ่มยาปฏิชีวนะครอบคลุม Pseudomonas สองชนิดร่วมกัน (เช่น cefepime + piperacillin-tazobactam) เพื่อเพิ่มความครอบคลุม",
          "เริ่ม fluconazole ร่วมกับยาปฏิชีวนะตั้งแต่วันแรกเพื่อป้องกันเชื้อรา",
        ],
        a: 0,
        r: "Febrile neutropenia มีความเสี่ยงต่อ gram-negative sepsis (รวม Pseudomonas) ต้องได้ empiric anti-pseudomonal beta-lactam monotherapy โดยเร็วที่สุด (door-to-antibiotic time ภายใน 1 ชั่วโมง) โดยไม่ต้องรอผลเพาะเชื้อ เพราะความล่าช้าเพิ่มอัตราตายอย่างมีนัยสำคัญ",
        w: [
          "ถูกต้อง — มาตรฐานคือเริ่ม empiric antibiotic ให้เร็วที่สุด ไม่รอผลเพาะเชื้อ",
          "การรอผลเพาะเชื้อ (ใช้เวลา 24–48 ชม.) ก่อนเริ่มยา ทำให้ผู้ป่วยเสี่ยง septic shock และเสียชีวิตเพิ่มขึ้นอย่างมาก",
          "แม้สัญญาณชีพจะคงที่ แต่ ANC ต่ำมาก (360) และมีไข้ชัดเจน จัดเป็นกลุ่มที่ควรได้รับการประเมินและรักษาด้วยยาฉีดในโรงพยาบาล ไม่ใช่ส่งกลับบ้านทันทีโดยไม่ประเมินปัจจัยเสี่ยงให้ครบถ้วน",
          "การให้ anti-pseudomonal beta-lactam สองชนิดร่วมกันไม่เพิ่มประสิทธิภาพ แต่เพิ่มความเป็นพิษและค่าใช้จ่ายโดยไม่จำเป็น ไม่ใช่แนวทางมาตรฐาน",
          "ยาต้านเชื้อราเชิง empiric ควรเริ่มเฉพาะเมื่อไข้ไม่ลดลงหลังได้ยาปฏิชีวนะกว้างสเปกตรัมแล้ว 4–7 วัน ไม่ใช่ตั้งแต่วันแรก",
        ],
        k: "Febrile neutropenia: ให้ IV anti-pseudomonal beta-lactam monotherapy ภายใน 1 ชั่วโมง ไม่รอเพาะเชื้อ ไม่ double-cover โดยไม่จำเป็น และยังไม่ให้ยาต้านเชื้อราตั้งแต่แรก",
      },
      {
        d: "hard",
        p: "แพทย์ปรึกษาเภสัชกรว่าควรเพิ่ม vancomycin เข้าไปร่วมกับ cefepime ตั้งแต่เริ่มต้นเลยหรือไม่ เพราะเหตุใด?",
        o: [
          "ไม่ควรเพิ่มตั้งแต่แรก เพราะผู้ป่วยไม่มีข้อบ่งชี้จำเพาะ (hemodynamic instability, สงสัย catheter-related infection, skin/soft-tissue infection, ปอดอักเสบจากภาพถ่ายรังสี หรือทราบว่า colonize เชื้อ MRSA) ควรเพิ่มเมื่อมีข้อบ่งชี้หรือผลเพาะเชื้อขึ้นเชื้อกรัมบวกดื้อยา",
          "ควรเพิ่ม vancomycin ในผู้ป่วย febrile neutropenia ทุกรายเพื่อให้ครอบคลุมเชื้อกรัมบวกอย่างครบถ้วนตั้งแต่ต้น",
          "ควรเพิ่มเฉพาะเมื่อ ANC ต่ำกว่า 100 cells/µL เท่านั้น",
          "ควรใช้ vancomycin แทนที่ cefepime ไปเลย เพราะ cefepime ไม่ครอบคลุมเชื้อกรัมบวกเลย",
          "ควรเพิ่ม vancomycin พร้อมกับหยุด cefepime แล้วเปลี่ยนเป็น ciprofloxacin เพื่อลดการดื้อยา",
        ],
        a: 0,
        r: "แนวทาง IDSA/NCCN ระบุว่าการเพิ่มยาครอบคลุมเชื้อกรัมบวก (เช่น vancomycin) แบบ empiric ไม่ใช่มาตรฐานในผู้ป่วย febrile neutropenia ทุกราย ควรเพิ่มเฉพาะเมื่อมีข้อบ่งชี้จำเพาะ เช่น hemodynamic instability/sepsis, สงสัยติดเชื้อที่สาย catheter, skin/soft tissue infection, ปอดอักเสบ, ทราบว่า colonize MRSA หรือเพาะเชื้อขึ้นเชื้อกรัมบวกดื้อยา ผู้ป่วยรายนี้ไม่มีข้อบ่งชี้ดังกล่าว",
        w: [
          "ถูกต้อง — เพิ่ม vancomycin เฉพาะเมื่อมีข้อบ่งชี้จำเพาะ ไม่ใช่ให้ทุกราย",
          "การให้ vancomycin โดยไม่จำเป็นเพิ่มความเสี่ยง nephrotoxicity การดื้อยา (VRE) และค่าใช้จ่ายโดยไม่มีประโยชน์ทางคลินิกเพิ่มในผู้ป่วยที่ไม่มีข้อบ่งชี้",
          "เกณฑ์การเพิ่ม vancomycin อิงจากลักษณะทางคลินิก ไม่ได้อิงจากตัวเลข ANC",
          "cefepime เป็น broad-spectrum cephalosporin ที่ครอบคลุมเชื้อกรัมบวกบางส่วนได้ (เช่น streptococci, MSSA) อยู่แล้ว การแทนที่ด้วย vancomycin ล้วนจะสูญเสียความครอบคลุม Pseudomonas และ gram-negative ซึ่งเป็นความเสี่ยงหลักในภาวะนี้",
          "การหยุด cefepime เปลี่ยนเป็น ciprofloxacin จะสูญเสียความครอบคลุมเชื้อกรัมลบรุนแรงรวมถึง Pseudomonas ซึ่งไม่สมเหตุสมผลและเพิ่มความเสี่ยงผู้ป่วย",
        ],
        k: "ไม่เพิ่ม empiric gram-positive coverage (vancomycin) ใน febrile neutropenia ทุกราย ให้เพิ่มเฉพาะเมื่อมีข้อบ่งชี้จำเพาะตามแนวทาง IDSA/NCCN",
      },
      {
        d: "medium",
        p: "ผู้ป่วยหายจาก febrile neutropenia episode นี้แล้ว และแพทย์วางแผนให้เคมีบำบัดรอบที่ 3 ตามกำหนดเดิม ควรดำเนินการเกี่ยวกับ G-CSF อย่างไร?",
        o: [
          "เริ่ม G-CSF แบบ secondary prophylaxis (เช่น filgrastim) ตั้งแต่รอบถัดไป หรือพิจารณาลดขนาดยาเคมีบำบัดลง เนื่องจากมีประวัติ febrile neutropenia จากรอบก่อนหน้า",
          "ให้ G-CSF ทันทีตั้งแต่วันนี้ขณะยังมีไข้และ ANC ต่ำ เพื่อเร่งการฟื้นตัวของไขกระดูก",
          "ไม่ต้องทำอะไรเพิ่มเติม เพราะ regimen นี้มีความเสี่ยง febrile neutropenia พื้นฐานต่ำอยู่แล้ว",
          "ให้ยาปฏิชีวนะป้องกัน (เช่น levofloxacin) ต่อเนื่องทุกวันแทนการใช้ G-CSF ในรอบถัดไป",
          "หยุดให้เคมีบำบัดต่อถาวร เนื่องจากเคยเกิด febrile neutropenia มาแล้วหนึ่งครั้ง",
        ],
        a: 0,
        r: "ตาม ASCO/NCCN guideline เมื่อผู้ป่วยเคยเกิด febrile neutropenia จากรอบเคมีบำบัดก่อนหน้า ควรพิจารณาให้ G-CSF แบบ secondary prophylaxis ตั้งแต่รอบถัดไป หรือพิจารณาลดขนาดยา/ปรับ regimen เพื่อลดความเสี่ยงเกิดซ้ำ",
        w: [
          "ถูกต้อง — secondary prophylaxis ด้วย G-CSF หรือการลดขนาดยา เป็นแนวทางมาตรฐานหลังเกิด FN episode",
          "ไม่แนะนำให้ G-CSF ระหว่างที่ยังมีไข้จาก febrile neutropenia เป็นประจำ และไม่ควรให้ใกล้กับวันที่ให้เคมีบำบัดครั้งถัดไปมากเกินไป",
          "การเคยเกิด febrile neutropenia มาแล้วหนึ่งครั้งเป็นข้อบ่งชี้ให้พิจารณา secondary prophylaxis ในรอบถัดไป ไม่ใช่ปล่อยผ่านโดยไม่ทำอะไร",
          "Fluoroquinolone prophylaxis ใช้หลักในผู้ป่วยที่คาดว่าจะมี severe neutropenia ยาวนาน (เช่น hematologic malignancy/HSCT) ไม่ใช่ทางเลือกทดแทน G-CSF ใน solid tumor regimen ทั่วไป",
          "การหยุดเคมีบำบัดถาวรเป็นการตอบสนองที่รุนแรงเกินไป ทั้งที่สามารถจัดการความเสี่ยงได้ด้วย G-CSF prophylaxis หรือปรับขนาดยา",
        ],
        k: "ประวัติ febrile neutropenia ครั้งก่อน = ข้อบ่งชี้ secondary G-CSF prophylaxis หรือลดขนาดเคมีบำบัดในรอบถัดไป ไม่ใช่ primary prophylaxis ระหว่างมีไข้",
      },
      {
        d: "medium",
        p: "ก่อนเริ่มเคมีบำบัดรอบถัดไป เภสัชกรทบทวนแผนป้องกันคลื่นไส้อาเจียนจากเคมีบำบัด (CINV) สำหรับสูตร TC (cyclophosphamide ขนาด 600 mg/m²) ควรจัดอยู่ในกลุ่มความเสี่ยงใดและป้องกันด้วยอะไร?",
        o: [
          "Highly emetogenic chemotherapy (HEC) — ให้ NK1-receptor antagonist + 5-HT3 antagonist + dexamethasone (± olanzapine) ก่อนเริ่มเคมีบำบัด",
          "Minimally emetogenic — ให้ dexamethasone ตัวเดียวก่อนเริ่มเคมีบำบัดก็เพียงพอ",
          "Moderately emetogenic — ให้ 5-HT3 antagonist ร่วมกับ dexamethasone สองตัวโดยไม่จำเป็นต้องใช้ NK1 antagonist",
          "ให้เฉพาะ 5-HT3 antagonist ตัวเดียวแบบ prn เมื่อมีอาการคลื่นไส้เกิดขึ้นแล้วเท่านั้น",
          "ให้ metoclopramide เป็นยาหลักตัวเดียวในการป้องกัน เนื่องจากราคาถูกและเพียงพอสำหรับทุกระดับความเสี่ยง",
        ],
        a: 0,
        r: "สูตรที่มี cyclophosphamide ขนาด ≥600 mg/m² ร่วมกับ taxane/anthracycline จัดเป็น highly emetogenic chemotherapy (HEC) ตามแนวทาง MASCC/ESMO และ NCCN Antiemesis guideline จึงต้องป้องกันแบบ 3–4 กลุ่มยา: NK1-RA + 5-HT3 RA + dexamethasone โดยอาจเพิ่ม olanzapine ร่วมด้วย",
        w: [
          "ถูกต้อง — regimen ที่มี cyclophosphamide ขนาดสูงจัดเป็น HEC ต้องป้องกันครบ 3–4 กลุ่มยา",
          "การให้ dexamethasone ตัวเดียวไม่เพียงพอสำหรับ HEC จะเกิด breakthrough CINV ได้สูง",
          "การละเว้น NK1 antagonist ใน HEC เป็นการป้องกันที่ไม่ครบถ้วน เหมาะสำหรับ moderately emetogenic chemotherapy (MEC) เท่านั้น ไม่ใช่ TC regimen ซึ่งเป็น HEC",
          "การรอให้มีอาการก่อนแล้วค่อยให้ยา (reactive) ไม่ใช่หลักการป้องกัน (prophylactic) ที่ถูกต้องสำหรับ HEC ซึ่งมีโอกาสอาเจียนมากกว่า 90% หากไม่ป้องกัน",
          "Metoclopramide ไม่ใช่ยาหลักสำหรับป้องกัน HEC และมีประสิทธิภาพไม่เพียงพอเมื่อใช้เดี่ยวในกลุ่มความเสี่ยงสูง",
        ],
        k: "Cyclophosphamide ≥600 mg/m² (เช่นใน TC regimen) = highly emetogenic → ต้องป้องกันด้วย NK1-RA + 5-HT3 RA + dexamethasone (± olanzapine) ไม่ใช่ 2-drug หรือ reactive therapy",
      },
    ],
  },
  {
    title: "DOAC (apixaban)-associated major GI bleeding: reversal & resumption",
    base:
      "ชายไทยอายุ 74 ปี น้ำหนัก 68 kg เป็น atrial fibrillation (CHA₂DS₂-VASc 4) ใช้ apixaban 5 mg วันละ 2 ครั้ง (ขนาดมาตรฐาน ไม่เข้าเกณฑ์ลดขนาด) มาห้องฉุกเฉินด้วยอาเจียนเป็นเลือดสดและถ่ายดำ (melena) 6 ชั่วโมงก่อน " +
      "BP 88/54 mmHg, HR 118 ครั้ง/นาที, Hb ลดจาก 13.2 เหลือ 7.8 g/dL ภายใน 24 ชั่วโมง, SCr 1.1 mg/dL กินยาเม็ดสุดท้ายเมื่อ 3 ชั่วโมงก่อนมาโรงพยาบาล ไม่สามารถตรวจ anti-factor Xa assay เฉพาะของ apixaban ได้ทันทีในโรงพยาบาลนี้",
    ref: "2023 ACC Expert Consensus Decision Pathway on Management of Bleeding in Patients on Oral Anticoagulants; ISTH Guidance on DOAC Reversal; Apixaban Prescribing Information",
    qs: [
      {
        d: "hard",
        p: "ภาวะเลือดออกของผู้ป่วยรายนี้จัดเป็น life-threatening major bleeding จาก apixaban ยาใดเป็น reversal agent ที่เหมาะสมที่สุด (หรือทางเลือกหากไม่มี)?",
        o: [
          "Andexanet alfa หากมีใช้ หรือ 4-factor prothrombin complex concentrate (4F-PCC) ขนาดที่เหมาะสมหากไม่มี andexanet alfa",
          "Idarucizumab ขนาด 5 g IV",
          "Vitamin K1 10 mg IV",
          "Fresh frozen plasma (FFP) เป็น first-line reversal agent",
          "Protamine sulfate ตามน้ำหนักตัว",
        ],
        a: 0,
        r: "Apixaban เป็น direct factor Xa inhibitor การ reverse ฤทธิ์ที่มีหลักฐานจำเพาะคือ andexanet alfa หากมีใช้ หรือ 4F-PCC เป็นทางเลือกเมื่อไม่มี andexanet alfa ส่วน idarucizumab จำเพาะกับ dabigatran เท่านั้น, vitamin K และ protamine ไม่มีผลต่อฤทธิ์ของ DOAC, FFP ไม่ใช่ first-line เพราะ reverse ฤทธิ์ anti-Xa ได้ไม่แน่นอนและไม่เพียงพอ",
        w: [
          "ถูกต้อง — andexanet alfa เป็น reversal agent จำเพาะของ factor Xa inhibitor, 4F-PCC เป็นทางเลือกที่มีหลักฐานสนับสนุนรองลงมา",
          "Idarucizumab เป็น monoclonal antibody fragment ที่จำเพาะกับ dabigatran เท่านั้น ไม่มีผลต่อ apixaban ซึ่งเป็น factor Xa inhibitor",
          "Vitamin K reverse เฉพาะฤทธิ์ของ warfarin/vitamin K antagonist ผ่านการสร้าง clotting factor II, VII, IX, X ใหม่ ไม่มีผลต่อกลไกการออกฤทธิ์ของ apixaban",
          "FFP ให้ clotting factor ทดแทนทั่วไปแต่ไม่สามารถ reverse ฤทธิ์ยับยั้ง factor Xa ได้อย่างเฉพาะเจาะจงหรือเพียงพอ จึงไม่ใช่ตัวเลือกแรก",
          "Protamine sulfate reverse เฉพาะฤทธิ์ของ heparin/LMWH ไม่มีกลไกต่อต้าน factor Xa inhibitor ชนิด direct อย่าง apixaban",
        ],
        k: "Apixaban/rivaroxaban (factor Xa inhibitors): reverse ด้วย andexanet alfa หรือ 4F-PCC เท่านั้น; idarucizumab ใช้กับ dabigatran, vitamin K/protamine ใช้กับ VKA/heparin ตามลำดับ ไม่ใช่กับ DOAC กลุ่มนี้",
      },
      {
        d: "hard",
        p: "นอกเหนือจาก reversal agent ข้อใดคือแนวทางจัดการภาพรวมที่เหมาะสมที่สุด ณ ตอนนี้?",
        o: [
          "หยุด apixaban ทันที ให้ IV fluid resuscitation และพิจารณาเลือด (PRBC) ตามข้อบ่งชี้ ปรึกษาทีม gastroenterology เพื่อส่องกล้องโดยเร็ว และให้ reversal agent ตามความรุนแรงโดยไม่จำเป็นต้องรอผล anti-factor Xa assay",
          "รอผลตรวจ anti-factor Xa assay เฉพาะของ apixaban ให้ได้ก่อน จึงค่อยตัดสินใจเรื่อง reversal agent และการส่องกล้อง",
          "ให้ vitamin K 10 mg IV ร่วมกับ FFP เป็นแนวทางหลักในการจัดการภาวะเลือดออกนี้",
          "ไม่จำเป็นต้องดำเนินการเร่งด่วน เนื่องจาก apixaban มีครึ่งชีวิตสั้น (~12 ชั่วโมง) สามารถรอให้ฤทธิ์ยาหมดไปเองได้",
          "ให้ protamine sulfate ทันทีเพื่อลบล้างฤทธิ์ anticoagulant ทั้งหมดก่อนทำหัตถการใดๆ",
        ],
        a: 0,
        r: "ผู้ป่วยมี life-threatening major bleeding (hemodynamic instability + Hb ลดเร็ว) ต้อง resuscitate ทันที (fluid/PRBC) หยุดยาต้านการแข็งตัวของเลือด ปรึกษาส่องกล้องโดยเร็ว และพิจารณาให้ reversal agent ตามความรุนแรงทางคลินิกโดยไม่ต้องรอผล anti-Xa assay ซึ่งมักไม่พร้อมใช้ในทางคลินิกทันเวลา",
        w: [
          "ถูกต้อง — bundle การดูแลภาวะเลือดออกรุนแรงจาก DOAC เน้น resuscitation, หยุดยา, ส่องกล้องเร็ว และ reversal ตามความรุนแรง ไม่รอผล assay ที่มักไม่พร้อมใช้ทันที",
          "Anti-factor Xa assay เฉพาะของแต่ละ DOAC มักไม่พร้อมใช้งานในโรงพยาบาลทั่วไปและใช้เวลานาน การรอผลก่อนตัดสินใจจะทำให้การรักษาล่าช้าในผู้ป่วยที่ไม่คงที่ทางเฮโมไดนามิก",
          "Vitamin K และ FFP เป็นแนวทางสำหรับ reverse warfarin/VKA ไม่ใช่ apixaban ซึ่งเป็น factor Xa inhibitor โดยตรง การใช้แนวทางนี้จะไม่ได้ผลเพียงพอ",
          "ผู้ป่วยมีภาวะช็อกจากการเสียเลือด (BP ต่ำ, HR เร็ว, Hb ลดเร็ว) การรอให้ยาหมดฤทธิ์เองมีความเสี่ยงเสียชีวิตสูง ต้องรักษาเชิงรุกทันที",
          "Protamine sulfate ไม่มีผลต่อฤทธิ์ของ apixaban การใช้จะไม่ช่วยควบคุมเลือดออกและอาจทำให้แพทย์เข้าใจผิดว่าได้ reverse ฤทธิ์ยาไปแล้ว",
        ],
        k: "Major bleeding จาก DOAC: resuscitation + หยุดยา + endoscopy เร็ว + reversal ตามความรุนแรงทางคลินิก ไม่ต้องรอผล anti-Xa assay ที่มักไม่พร้อมใช้ทันเวลา",
      },
      {
        d: "hard",
        p: "หลังเลือดหยุดและส่องกล้องควบคุมจุดเลือดออกได้แล้ว ข้อใดถูกต้องที่สุดเกี่ยวกับการกลับไปใช้ยาต้านการแข็งตัวของเลือดในผู้ป่วยรายนี้ (CHA₂DS₂-VASc 4)?",
        o: [
          "ประเมินร่วมกันระหว่างทีมสหวิชาชีพ โดยทั่วไปพิจารณาเริ่มยาต้านการแข็งตัวของเลือดใหม่ประมาณ 7 วันหลังเหตุการณ์เลือดออกเมื่อแน่ใจว่าควบคุมเลือดออกได้แล้ว โดยชั่งน้ำหนักระหว่างความเสี่ยง thromboembolism จาก AF กับความเสี่ยง rebleeding",
          "ไม่ควรเริ่มยาต้านการแข็งตัวของเลือดซ้ำอีกเลยตลอดชีวิตหลังเกิด major GI bleed",
          "เริ่มยาต้านการแข็งตัวของเลือดใหม่ทันทีภายใน 24–48 ชั่วโมงหลังเลือดหยุด เพื่อป้องกัน stroke ให้เร็วที่สุด",
          "เปลี่ยนไปใช้ aspirin ตัวเดียวแทน anticoagulant เนื่องจากปลอดภัยกว่าในผู้ป่วยที่เคยเลือดออก",
          "ไม่ให้ยาต้านการแข็งตัวของเลือดใดๆ อีก และใช้ left atrial appendage occlusion (LAAO) แทนในทุกราย",
        ],
        a: 0,
        r: "ผู้ป่วย AF ที่มีความเสี่ยง stroke สูง (CHA₂DS₂-VASc 4) ส่วนใหญ่ควรได้กลับมาใช้ยาต้านการแข็งตัวของเลือดหลังควบคุมเลือดออกได้แล้ว เนื่องจากความเสี่ยง thromboembolism ระยะยาวมักสูงกว่าความเสี่ยง rebleed โดยทั่วไปพิจารณาเริ่มใหม่ประมาณ 7 วันหลังเหตุการณ์ ต้องประเมินเป็นรายบุคคลร่วมกับแพทย์ผู้ดูแล",
        w: [
          "ถูกต้อง — ชั่งน้ำหนักความเสี่ยงและประโยชน์เป็นรายบุคคล โดยทั่วไปกลับมาเริ่มยาประมาณ 1 สัปดาห์หลังเลือดหยุดแน่นอน",
          "การหยุดยาต้านการแข็งตัวของเลือดถาวรในผู้ป่วยความเสี่ยง stroke สูง (CHA₂DS₂-VASc 4) จะเพิ่มความเสี่ยง ischemic stroke อย่างมีนัยสำคัญในระยะยาว ซึ่งมักมีผลเสียมากกว่าความเสี่ยง rebleed ที่ควบคุมได้แล้ว",
          "การเริ่มยาเร็วเกินไป (24–48 ชม.) หลังเลือดออกรุนแรงเพิ่มความเสี่ยง rebleeding อย่างมีนัยสำคัญ ควรรอให้แผลที่ส่องกล้องรักษามีเวลาสมานตัวระดับหนึ่งก่อน",
          "Aspirin ให้ประสิทธิภาพป้องกัน stroke ใน AF ต่ำกว่า anticoagulant อย่างมีนัยสำคัญ ไม่ใช่ทางเลือกทดแทนที่เท่าเทียมกัน",
          "LAAO เป็นทางเลือกเฉพาะสำหรับผู้ป่วยที่มีข้อห้ามใช้ยาต้านการแข็งตัวของเลือดอย่างแท้จริงในระยะยาว ไม่ใช่แนวทางมาตรฐานที่ใช้แทนยาในทุกรายที่เคยมีเลือดออกครั้งเดียว",
        ],
        k: "AF ความเสี่ยง stroke สูง + major bleeding ที่ควบคุมได้แล้ว: โดยทั่วไปพิจารณากลับมาใช้ anticoagulant ประมาณ 7 วันหลังเหตุการณ์ ชั่งน้ำหนัก thromboembolic risk vs rebleeding risk เป็นรายบุคคล",
      },
      {
        d: "medium",
        p: "เภสัชกรต้องการประเมินการทำงานของไตของผู้ป่วย (ชาย อายุ 74 ปี น้ำหนัก 68 kg, SCr 1.1 mg/dL) ด้วยสูตร Cockcroft-Gault เพื่อประกอบการพิจารณาเลือกและปรับขนาดยาต้านการแข็งตัวของเลือดในอนาคต ผลลัพธ์ที่ถูกต้องคือข้อใด?",
        o: ["48.2 mL/min", "51.5 mL/min", "56.7 mL/min", "61.8 mL/min", "566.7 mL/min"],
        a: 2,
        r: "Cockcroft-Gault: CrCl = [(140 − อายุ) × น้ำหนักตัว] / (72 × SCr) = [(140−74) × 68] / (72 × 1.1) = (66×68)/79.2 = 4,488/79.2 ≈ 56.7 mL/min (เพศชายไม่ต้องคูณด้วย 0.85)",
        w: [
          "เกิดจากการคูณผลลัพธ์ที่ถูกต้องด้วย 0.85 ซึ่งเป็นตัวปรับสำหรับเพศหญิงเท่านั้น ผู้ป่วยรายนี้เป็นเพศชายจึงไม่ต้องคูณตัวปรับนี้",
          "เกิดจากการใช้อายุผิดพลาด (เช่น ใช้ 80 ปีแทนที่จะเป็น 74 ปีตามที่ระบุในโจทย์)",
          "ถูกต้อง — แทนค่าตามสูตร Cockcroft-Gault สำหรับเพศชายได้ 56.7 mL/min",
          "เกิดจากการคำนวณลัดผิดวิธี โดยใช้เพียงน้ำหนักตัวหารด้วย SCr โดยตรง (68/1.1) โดยไม่รวมปัจจัยอายุและตัวคูณ 140 กับ 72 ตามสูตรที่ถูกต้อง",
          "เกิดจากความผิดพลาดด้านทศนิยม เช่น ใช้ตัวหารเป็น 7.2 แทนที่จะเป็น 72 ทำให้ค่าคลาดเคลื่อนไปประมาณ 10 เท่าจากค่าที่ถูกต้อง",
        ],
        c: [
          "CrCl = [(140 − age) × weight] / (72 × SCr)",
          "= [(140 − 74) × 68] / (72 × 1.1)",
          "= (66 × 68) / 79.2",
          "= 4,488 / 79.2 ≈ 56.7 mL/min",
        ],
        k: "Cockcroft-Gault: CrCl = [(140−age)×weight]/(72×SCr); คูณ ×0.85 เฉพาะเพศหญิงเท่านั้น ระวังตัวคูณ 72 และการอ่านอายุ/น้ำหนักผิดพลาด",
      },
      {
        d: "medium",
        p: "เมื่อแพทย์ตัดสินใจให้ผู้ป่วยกลับมาใช้ apixaban อีกครั้งหลังเหตุการณ์เลือดออก คำแนะนำใดเหมาะสมที่สุดที่เภสัชกรควรให้แก่ผู้ป่วย?",
        o: [
          "หลีกเลี่ยงการใช้ร่วมกับ NSAIDs หรือ aspirin โดยไม่จำเป็น สังเกตอาการเลือดออกผิดปกติ (เช่น ถ่ายดำ อาเจียนเป็นเลือด จ้ำเลือดผิดปกติ) และไม่ต้องจำกัดอาหารที่มีวิตามินเคเหมือนตอนใช้ warfarin เนื่องจาก apixaban ไม่ถูกรบกวนจากวิตามินเค",
          "ต้องจำกัดผักใบเขียวและอาหารที่มีวิตามินเคสูงเช่นเดียวกับตอนใช้ warfarin เพื่อความปลอดภัย",
          "หากลืมกินยาให้กินสองเท่าในมื้อถัดไปเสมอเพื่อชดเชยขนาดที่ขาดไป",
          "สามารถหยุดยาเองได้ทันทีหากพบรอยฟกช้ำเล็กน้อยโดยไม่ต้องแจ้งแพทย์หรือเภสัชกรก่อน",
          "สามารถใช้ ibuprofen ร่วมด้วยได้อย่างปลอดภัยสำหรับอาการปวดข้อเรื้อรังโดยไม่ต้องปรับเปลี่ยนอะไร",
        ],
        a: 0,
        r: "Apixaban ออกฤทธิ์ยับยั้ง factor Xa โดยตรง ไม่ผ่านกลไกวิตามินเคเหมือน warfarin จึงไม่จำเป็นต้องจำกัดอาหารที่มีวิตามินเค แต่ยังต้องเน้นหลีกเลี่ยงยาที่เพิ่มความเสี่ยงเลือดออก (NSAIDs/aspirin โดยไม่จำเป็น) สังเกตอาการเลือดออกผิดปกติ และไม่หยุดยาหรือปรับขนาดเองโดยไม่ปรึกษาแพทย์",
        w: [
          "ถูกต้อง — เน้นหลีกเลี่ยงยาเพิ่มความเสี่ยงเลือดออก สังเกตอาการผิดปกติ และไม่ต้องจำกัดวิตามินเคเหมือน warfarin",
          "ข้อจำกัดเรื่องวิตามินเคเป็นข้อควรระวังเฉพาะของ warfarin ซึ่งออกฤทธิ์ผ่านการยับยั้งการสร้าง clotting factor ที่ต้องพึ่งวิตามินเค ไม่เกี่ยวข้องกับกลไกการออกฤทธิ์ของ apixaban",
          "คำแนะนำเรื่องการลืมยาของ apixaban โดยทั่วไปคือกินทันทีที่นึกได้หากยังไม่เกินครึ่งหนึ่งของช่วงเวลาระหว่างมื้อ และห้ามกินสองเท่าเพื่อชดเชยเนื่องจากเพิ่มความเสี่ยงเลือดออก",
          "การหยุดยาต้านการแข็งตัวของเลือดเองโดยไม่ปรึกษาแพทย์เพิ่มความเสี่ยง thromboembolism ทันที ควรแจ้งทีมผู้ดูแลก่อนตัดสินใจปรับเปลี่ยนใดๆ แม้จะพบอาการเลือดออกเพียงเล็กน้อย",
          "NSAIDs เช่น ibuprofen เพิ่มความเสี่ยงเลือดออกในทางเดินอาหารเมื่อใช้ร่วมกับ anticoagulant อย่างมีนัยสำคัญ ควรหลีกเลี่ยงหรือใช้ยาแก้ปวดทางเลือกอื่นที่ปลอดภัยกว่า เช่น paracetamol",
        ],
        k: "Apixaban: ไม่ต้องจำกัดวิตามินเคเหมือน warfarin, ห้ามกินยาซ้ำสองเท่าเมื่อลืม, หลีกเลี่ยง NSAIDs/aspirin ที่ไม่จำเป็น, ห้ามหยุดยาเองโดยไม่ปรึกษาแพทย์",
      },
    ],
  },
];

// ต่อท้าย PC1 (Case 1–32, ข้อ 1–157) → Case 33–34, ข้อ 158–167
export const PC1_SET2_01: McqQuestion[] = buildPc1Cases(CASES, {
  idPrefix: "pc1s2q",
  caseOffset: 32,
  qOffset: 157,
  createdAt: "2026-10-02 09:00:00",
  posShift: 7,
});
