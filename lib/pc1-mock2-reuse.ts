import type { Pc1MockReuse } from "@/lib/pc1-mock-builder";

// PC1 Mock Set 2 — เคสจากคลังเดิมที่นำมาใช้ พร้อมคำอธิบายเชิงลึกเขียนใหม่ (โจทย์/ตัวเลือก/เฉลยคงเดิม)
// w ใช้ label ตามลำดับตัวเลือกเดิมของแต่ละข้อในคลัง

export const MOCK2_REUSE: Record<string, Pc1MockReuse[]> = {
  cardio: [
    {
      reuse: 2,
      ref: "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure; 2023 ESC Focused Update of the HF Guidelines; DOSE trial (NEJM 2011)",
      explain: {
        0: {
          r:
            "การประเมิน: ผู้ป่วยมี orthopnea, edema, JVP สูง = congestion ชัดเจน ร่วมกับ BP 154/92 (ไม่มี hypoperfusion) จัดเป็น \"warm and wet\" ซึ่งพบมากที่สุดใน acute decompensated HF เป้าหมายเร่งด่วนคือ decongestion\n\n" +
            "เหตุผลที่ต้องใช้ IV loop diuretic: ระหว่าง ADHF ลำไส้บวม (gut edema) การดูดซึม furosemide ทางปากไม่แน่นอน (bioavailability 10–90%) และผู้ที่ใช้ furosemide อยู่แล้วมักเกิด diuretic resistance. แนวทางแนะนำให้ IV loop diuretic ขนาดอย่างน้อยเท่ากับหรือ 1–2.5 เท่าของขนาดรับประทานเดิมต่อวัน (การศึกษา DOSE: ขนาดสูงลด congestion ได้เร็วกว่าโดยไม่เพิ่มผลเสียระยะยาว) แบบ bolus หรือหยดต่อเนื่องได้ผลใกล้เคียงกัน\n\n" +
            "การติดตาม: urine output (เป้าหมาย >100–150 mL/h ใน 6 ชั่วโมงแรก) หรือ spot urine Na >50–70 mEq/L ใน 2 ชั่วโมง น้ำหนักตัวทุกวัน intake/output, SCr และ K/Mg ทุกวัน; ถ้าตอบสนองไม่ดีให้เพิ่มขนาดเป็นสองเท่า หรือเพิ่ม thiazide (sequential nephron blockade) หรือ acetazolamide\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: SCr ที่เพิ่มเล็กน้อยระหว่าง decongestion ที่ได้ผล (\"permissive\" WRF) ไม่สัมพันธ์กับผลเสีย ไม่ควรหยุด diuretic ก่อนหมด congestion; ไม่ควรหยุด GDMT (beta-blocker, ACEI) ระหว่าง ADHF ถ้าไม่มี shock หรือ bradycardia รุนแรง",
          w: {
            A: "ถูก — IV loop diuretic ขนาดเพียงพอ พร้อมติดตาม urine output น้ำหนัก และไต เป็นหัวใจของการรักษา warm-and-wet ADHF",
            B: "การดูดซึมทางปากไม่แน่นอนช่วง ADHF และผู้ป่วยใช้ขนาดเดิมอยู่แล้วแต่ยังคั่งน้ำ การรอ 48 ชั่วโมงทำให้อาการแย่ลง",
            C: "ผู้ป่วยมีน้ำเกิน การให้สารน้ำทำให้ pulmonary edema แย่ลง SCr ที่เพิ่มเล็กน้อยระหว่าง decongest ยอมรับได้",
            D: "Beta-blocker ควรใช้ต่อใน ADHF ที่ไม่มี cardiogenic shock หรือ bradycardia รุนแรง การหยุดเพิ่มการเสียชีวิต",
            E: "Thiazolidinedione ทำให้คั่งน้ำ ห้ามใช้ใน HF (NYHA III–IV) ไม่ได้เพิ่ม cardiac output",
          },
          k: "ADHF warm-and-wet → IV loop diuretic ≥1–2.5 เท่าของขนาดรับประทานเดิม, ติดตาม UO/urine Na/น้ำหนัก/SCr/K; ไม่หยุด BB/ACEI ถ้าไม่มี shock",
        },
        1: {
          r:
            "หลักการ: ช่วงก่อนจำหน่ายเป็นโอกาสสำคัญที่สุดในการเริ่มและปรับ guideline-directed medical therapy (GDMT) เพราะ 30 วันหลังจำหน่ายเป็นช่วงที่เสี่ยงกลับมานอนโรงพยาบาลและเสียชีวิตสูงสุด. Loop diuretic แก้อาการคั่งน้ำแต่ไม่ลดการเสียชีวิต\n\n" +
            "4 เสาหลักของ HFrEF (ลด mortality ทุกตัว): (1) ARNI (sacubitril/valsartan) หรือ ACEI/ARB (2) evidence-based beta-blocker: carvedilol, bisoprolol, metoprolol succinate (3) MRA: spironolactone, eplerenone (4) SGLT2 inhibitor: dapagliflozin, empagliflozin. การศึกษา STRONG-HF แสดงว่าการเพิ่มยาอย่างรวดเร็วก่อนและหลังจำหน่าย (ภายใน 2 สัปดาห์) ลดเหตุการณ์ได้ชัดเจน\n\n" +
            "การประเมินความทนได้ในผู้ป่วยรายนี้: BP 118/72, euvolemic, eGFR 58, K 4.5 → เพิ่ม MRA และ SGLT2i ได้ และพิจารณาเปลี่ยน enalapril เป็น ARNI (washout 36 ชั่วโมง)\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ทำ medication reconciliation ก่อนจำหน่าย และนัดตรวจ K/SCr ภายใน 1–2 สัปดาห์หลังเริ่ม MRA/ARNI; ยาที่ต้องหลีกเลี่ยงใน HFrEF: non-DHP CCB, TZD, NSAIDs, class I antiarrhythmics, dronedarone",
          w: {
            A: "Loop diuretic ช่วยอาการแต่ไม่ลดการเสียชีวิต ต้อง optimize GDMT ด้วย",
            B: "Verapamil (non-DHP CCB) มีฤทธิ์ negative inotrope ทำให้ HFrEF แย่ลง ห้ามใช้",
            C: "ถูก — ก่อนจำหน่ายต้องทบทวนและเพิ่ม 4 เสาหลักของ HFrEF ตามความทนได้",
            D: "Beta-blocker ลดการเสียชีวิต ไม่ควรหยุดเมื่ออาการคงที่แล้ว",
            E: "Digoxin ลดการนอนโรงพยาบาลแต่ไม่ลด mortality ใช้เสริม ไม่ใช่แทน foundational therapy",
          },
          k: "HFrEF 4 pillars ก่อนจำหน่าย: ARNI/ACEI/ARB + BB + MRA + SGLT2i; ตรวจ K/SCr 1–2 สัปดาห์; หลีกเลี่ยง non-DHP CCB, TZD, NSAIDs",
        },
        2: {
          r:
            "กลไกความเสี่ยง: MRA (spironolactone, eplerenone) ยับยั้ง aldosterone ที่ distal nephron ลดการขับ K⁺ และ H⁺ เมื่อใช้ร่วมกับ ACEI/ARB/ARNI ซึ่งลด aldosterone เช่นกัน ความเสี่ยง hyperkalemia เพิ่มขึ้นมาก โดยเฉพาะผู้สูงอายุ เบาหวาน ไตเสื่อม และขาดน้ำ (บทเรียนจาก RALES: เมื่อใช้ spironolactone อย่างแพร่หลายโดยไม่ติดตาม พบการนอนโรงพยาบาลและเสียชีวิตจาก hyperkalemia เพิ่มขึ้น)\n\n" +
            "เกณฑ์การเริ่มและติดตาม: เริ่มเมื่อ K⁺ <5.0 mEq/L และ eGFR >30; ตรวจ K⁺ และ SCr ที่ 3 วันและ 1 สัปดาห์หลังเริ่ม/ปรับ แล้วทุกเดือนใน 3 เดือนแรก และทุก 3 เดือนหลังจากนั้น; K⁺ >5.5 → ลดขนาดครึ่งหนึ่ง, K⁺ >6.0 → หยุด\n\n" +
            "ADR อื่นของ spironolactone: gynecomastia และเจ็บเต้านม (anti-androgen) ถ้าเกิดให้เปลี่ยนเป็น eplerenone ซึ่งเลือกจำเพาะกว่า\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: สอนผู้ป่วยหลีกเลี่ยงเกลือทดแทน (KCl), ผลิตภัณฑ์เสริม K, NSAIDs และให้หยุดยาชั่วคราวเมื่อท้องเสีย/อาเจียน (sick day rules)",
          w: {
            A: "BNP ใช้ประเมินภาวะหัวใจล้มเหลว ไม่ใช่ safety parameter ของ MRA",
            B: "MRA ไม่มีผลต่อ INR",
            C: "Uric acid ไม่ใช่ความเสี่ยงหลักของ MRA (เป็นของ thiazide/loop diuretic)",
            D: "ถูก — hyperkalemia และไตเสื่อมเป็นความเสี่ยงหลัก ต้องตรวจที่ 3 วัน, 1 สัปดาห์ และทุกเดือนใน 3 เดือนแรก",
            E: "K baseline ปกติไม่รับประกันความปลอดภัย hyperkalemia มักเกิดหลังเริ่มยาหรือเมื่อเจ็บป่วย",
          },
          k: "MRA: เริ่มเมื่อ K <5.0 และ eGFR >30; ตรวจ K/SCr ที่ 3 วัน, 1 สัปดาห์, รายเดือน 3 เดือน; K >5.5 ลดครึ่ง, >6.0 หยุด",
        },
        3: {
          r:
            "หลักการ self-care: การคั่งน้ำมักเกิดก่อนอาการเหนื่อยหลายวัน น้ำหนักตัวที่เพิ่มขึ้นเป็นสัญญาณเตือนที่เร็วและวัดได้ง่ายที่สุด\n\n" +
            "คำแนะนำที่ถูกต้อง: ชั่งน้ำหนักทุกเช้าหลังปัสสาวะ ก่อนรับประทานอาหาร ด้วยเครื่องชั่งเดิม; ถ้าน้ำหนักเพิ่ม >1–1.5 kg ใน 1–2 วัน หรือ >2 kg ใน 1 สัปดาห์ หรือเหนื่อยขึ้น นอนราบไม่ได้ ขาบวมมากขึ้น ให้ทำตามแผน (เช่น เพิ่ม diuretic ตามที่แพทย์กำหนด) หรือติดต่อทีมรักษา\n\n" +
            "อาหารและน้ำ: จำกัดเกลือ (โซเดียม ~2 g/วัน); จำกัดน้ำ 1.5–2 L/วันเฉพาะผู้ที่มีอาการรุนแรงหรือ hyponatremia ไม่ต้องจำกัดเข้มงวดทุกราย\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ยาที่ต้องหลีกเลี่ยง — NSAIDs (คั่งน้ำ ไตเสื่อม), ยาแก้หวัดที่มี pseudoephedrine, ยาลดกรดที่มีโซเดียมสูง, สมุนไพรบางชนิด; ผู้ป่วยไม่ควรหยุด diuretic เองเมื่อน้ำหนักลดเล็กน้อย เพราะเป็นผลที่ต้องการ",
          w: {
            A: "การจำกัดน้ำเข้มงวดขนาดนี้ไม่จำเป็นและอาจเกิดภาวะขาดน้ำ/ไตเสื่อม ใช้ 1.5–2 L ในบางรายเท่านั้น",
            B: "ถูก — daily weight + เฝ้าระวังอาการคั่งน้ำ + แผนเมื่ออาการแย่ลง เป็นหัวใจของ self-care",
            C: "เวียนศีรษะอาจเกิดจากความดันต่ำหรือยา การเพิ่มเกลือเองทำให้คั่งน้ำ",
            D: "น้ำหนักลดเป็นผลที่ต้องการของ diuretic ไม่ควรปรับยาเองโดยไม่มีแผน",
            E: "NSAIDs ทำให้คั่งน้ำ ไตเสื่อม และ HF กำเริบ อาการแน่นหน้าอกต้องประเมินโดยแพทย์",
          },
          k: "HF self-care: ชั่งน้ำหนักทุกเช้า (เพิ่ม >1–1.5 kg/1–2 วัน หรือ >2 kg/สัปดาห์ → ทำตามแผน), จำกัดเกลือ, หลีกเลี่ยง NSAIDs",
        },
      },
    },
    {
      reuse: 18,
      ref: "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure; 2023 ACC Expert Consensus Decision Pathway for HFrEF; ESC/HFA practical guidance on MRA and hyperkalemia",
      explain: {
        0: {
          r:
            "กลไก: Sacubitril ยับยั้ง neprilysin ซึ่งทำลาย natriuretic peptides และ bradykinin; ACEI ยับยั้งการทำลาย bradykinin ผ่าน ACE เช่นกัน. เมื่อใช้ร่วมกัน bradykinin สะสมมาก เสี่ยง angioedema รุนแรง (ในการศึกษา OVERTURE ที่ใช้ omapatrilat ซึ่งยับยั้งทั้งสองเอนไซม์พบ angioedema สูง)\n\n" +
            "วิธีเปลี่ยนยา: หยุด ACEI อย่างน้อย 36 ชั่วโมง (ประมาณ 3 half-lives ของ enalaprilat) ก่อนเริ่ม ARNI เข็มแรก — ในทางปฏิบัติ หยุด enalapril มื้อเย็นวันที่ 1 ข้ามวันที่ 2 และเริ่ม ARNI เช้าวันที่ 3; ถ้าเปลี่ยนจาก ARB ไม่ต้อง washout เริ่มได้ในมื้อถัดไป\n\n" +
            "ข้อห้ามของ ARNI: มีประวัติ angioedema (จากยาใดก็ตาม), ใช้ร่วม ACEI, ตั้งครรภ์, ใช้ร่วม aliskiren ในผู้ป่วยเบาหวาน\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: เภสัชกรต้องตรวจสอบเวลาหยุด ACEI ในใบสั่งยาและอธิบายให้ผู้ป่วยเข้าใจชัด เพราะผู้ป่วยมักทาน ACEI ที่เหลือที่บ้านต่อ; BNP สูงขึ้นจาก neprilysin inhibition จึงควรใช้ NT-proBNP ติดตามแทน",
          w: {
            A: "ถูก — washout ≥36 ชั่วโมงลดความเสี่ยง angioedema",
            B: "Bradykinin สะสมจาก ACEI ที่ยังเหลือ เสี่ยง angioedema",
            C: "ห้ามใช้ ACEI ร่วมกับ ARNI (contraindicated)",
            D: "นานเกินจำเป็น ผู้ป่วยขาด RAAS blockade หลายวัน เสี่ยง HF กำเริบ",
            E: "สั้นเกินไป ยังมี ACEI ในร่างกายมาก",
          },
          k: "ACEI → ARNI: washout ≥36 ชม.; ARB → ARNI: มื้อถัดไปได้เลย; ห้าม ARNI ในผู้มีประวัติ angioedema; ใช้ NT-proBNP ติดตาม",
        },
        1: {
          r:
            "หลักการเลือกขนาดเริ่มต้น: ARNI เริ่มขนาดต่ำ 24/26 mg BID ในผู้ที่ (1) ไม่เคยได้ ACEI/ARB หรือได้ขนาดต่ำ (enalapril ≤10 mg/วัน หรือเทียบเท่า) (2) eGFR <30 (3) อายุ ≥75 ปี (4) ตับบกพร่องปานกลาง (5) SBP 100–110 mmHg. ผู้ที่ได้ ACEI/ARB ขนาดปานกลาง–สูงและ BP ดีเริ่ม 49/51 mg BID\n\n" +
            "ผู้ป่วยรายนี้: enalapril 5 mg BID = 10 mg/วัน (ขนาดต่ำ) และ BP 112/70 → เริ่ม 24/26 mg BID แล้วเพิ่มเป็นสองเท่าทุก 2–4 สัปดาห์จนถึง target 97/103 mg BID ตามความทนได้\n\n" +
            "การติดตาม: BP (อาการหน้ามืด), K⁺ และ SCr 1–2 สัปดาห์หลังเริ่ม/ปรับขนาด; ARNI ลด BP มากกว่า ACEI จึงอาจต้องลด diuretic ถ้าผู้ป่วย euvolemic\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ขนาดเรียกตามส่วนประกอบ sacubitril/valsartan (เดิมเรียก 50, 100, 200 mg); ARNI ต้องให้วันละ 2 ครั้งเสมอ; valsartan ใน ARNI ดูดซึมได้ดีกว่า valsartan เดี่ยว (valsartan 26 mg ใน ARNI ≈ valsartan 40 mg)",
          w: {
            A: "ARNI ต้องให้วันละ 2 ครั้ง",
            B: "ใช้เมื่อได้ ACEI >10 mg/วัน enalapril-equivalent และ BP เพียงพอ",
            C: "เป็น target dose ไม่ใช่ starting dose",
            D: "ถูก — ได้ ACEI ขนาดต่ำและ BP ค่อนข้างต่ำ จึงเริ่มขนาดต่ำแล้ว titrate",
            E: "ขนาดและความถี่ไม่ถูกต้อง",
          },
          k: "ARNI start 24/26 BID: ACEI/ARB ขนาดต่ำ/naive, eGFR <30, ≥75 ปี, SBP 100–110; target 97/103 BID; titrate ทุก 2–4 สัปดาห์",
        },
        2: {
          r:
            "หลักฐาน: SGLT2 inhibitor ลด CV death และการนอนโรงพยาบาลจาก HF ใน HFrEF ทั้งผู้ที่เป็นและไม่เป็นเบาหวาน (DAPA-HF: dapagliflozin 10 mg; EMPEROR-Reduced: empagliflozin 10 mg) ประโยชน์เกิดเร็วภายในไม่กี่สัปดาห์ จึงเป็น 1 ใน 4 เสาหลัก\n\n" +
            "กลไกที่เป็นไปได้: natriuresis/osmotic diuresis ลด preload, ลดความดันใน glomerulus ป้องกันไต, เปลี่ยนการใช้พลังงานของกล้ามเนื้อหัวใจ (ketone), ลด inflammation และ fibrosis\n\n" +
            "ขนาดและการใช้: dapagliflozin 10 mg หรือ empagliflozin 10 mg วันละครั้ง ไม่ต้อง titrate; เริ่มได้เมื่อ eGFR ≥20–25; eGFR อาจลดลงเล็กน้อยใน 2–4 สัปดาห์แรก (hemodynamic dip) ไม่ต้องหยุดยา\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ในผู้ไม่เป็นเบาหวานความเสี่ยง hypoglycemia ต่ำ; สอนเรื่อง genital mycotic infection (รักษาความสะอาด), ภาวะขาดน้ำ (อาจต้องลด loop diuretic), sick day rules (หยุดยาเมื่อเจ็บป่วยเฉียบพลัน ทานอาหารไม่ได้ หรือก่อนผ่าตัด 3 วัน เพื่อลด euglycemic DKA)",
          w: {
            A: "Empagliflozin ใน HF ใช้ 10 mg (25 mg ใช้คุมน้ำตาลในเบาหวาน)",
            B: "ถูก — SGLT2i ลด CV death/HF hospitalization แม้ไม่เป็นเบาหวาน",
            C: "Metformin ไม่มีข้อบ่งใช้ในผู้ไม่เป็นเบาหวาน และไม่ใช่ GDMT ของ HF",
            D: "TZD ทำให้คั่งน้ำ ห้ามใช้ใน HF",
            E: "Non-DHP CCB มีฤทธิ์ negative inotrope ทำให้ HFrEF แย่ลง",
          },
          k: "SGLT2i (dapagliflozin/empagliflozin 10 mg) = เสาหลัก HFrEF แม้ไม่เป็นเบาหวาน; eGFR ≥20–25; eGFR dip ช่วงแรกยอมรับได้; sick day rules",
        },
        3: {
          r:
            "เกณฑ์การเริ่ม MRA: K⁺ <5.0 mEq/L และ eGFR >30 mL/min/1.73m². ผู้ป่วยมี K⁺ 4.6 และ eGFR 48 → เริ่มได้ แต่เพราะ eGFR อยู่ระหว่าง 30–49 และกำลังเริ่ม ARNI ร่วม ความเสี่ยง hyperkalemia สูงขึ้น จึงต้องเริ่มขนาดต่ำ\n\n" +
            "ขนาดยา: eGFR ≥50 → spironolactone 25 mg OD (target 25–50 mg) หรือ eplerenone 25 mg OD (target 50 mg); eGFR 30–49 → spironolactone 12.5 mg OD หรือ 25 mg วันเว้นวัน, eplerenone 25 mg วันเว้นวัน\n\n" +
            "การติดตาม: K⁺/SCr ที่ 3 วันและ 1 สัปดาห์ แล้วทุกเดือน 3 เดือน และเมื่อปรับยาที่เกี่ยวข้อง; หยุดหรือลด K supplement ที่เคยใช้ร่วมกับ loop diuretic\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: spironolactone ในไทยมีเม็ด 25 mg (แบ่งครึ่งได้) และ 100 mg; eplerenone ราคาสูงกว่า ใช้เมื่อเกิด gynecomastia; amiloride/triamterene ไม่ใช่ MRA และไม่มีหลักฐานลด mortality",
          w: {
            A: "ขนาดสูงเกินไปสำหรับ eGFR 48 ร่วมกับ RAAS inhibitor เสี่ยง hyperkalemia",
            B: "Amiloride ไม่มีหลักฐานลดการเสียชีวิตใน HFrEF",
            C: "ไม่ควรเสริม K⁺ เมื่อเริ่ม MRA ร่วมกับ RAAS inhibitor และ eGFR 30–49 ควรเริ่ม eplerenone 25 mg วันเว้นวัน",
            D: "MRA เริ่มได้เมื่อ eGFR >30 การรอทำให้เสียประโยชน์ด้าน mortality",
            E: "ถูก — ขนาดต่ำเหมาะกับ eGFR 30–49 และต้องตรวจ K⁺/SCr ภายใน 1 สัปดาห์",
          },
          k: "MRA: K <5.0 + eGFR >30; eGFR 30–49 → spironolactone 12.5 mg OD; หยุด K supplement; ตรวจ K/SCr 3 วัน, 1 สัปดาห์",
        },
        4: {
          r:
            "การหาสาเหตุ: hyperkalemia ในผู้ป่วยที่ได้ GDMT หลายตัวต้องหา \"hidden potassium\" เสมอ — เกลือลดโซเดียม/เกลือทดแทนส่วนใหญ่ใช้ KCl แทน NaCl (1 ช้อนชามี K ~ 40–60 mEq) เป็นสาเหตุที่พบบ่อยและผู้ป่วยมักไม่รู้ ยาอื่น: NSAIDs, TMP-SMX, K supplement, สมุนไพร/ผลไม้บางชนิด\n\n" +
            "การจัดการตาม ESC/HFA practical guidance: K⁺ 5.5–6.0 → ลด MRA ครึ่งหนึ่งและหา/แก้สาเหตุ; K⁺ >6.0 → หยุด MRA ชั่วคราวและประเมิน RAAS inhibitor; SCr ที่เพิ่ม <50% (หรือ <3.5 mg/dL) จากค่าเริ่มต้นยอมรับได้ ไม่ต้องหยุด ARNI. ผู้ป่วยรายนี้ K⁺ 5.7, SCr เพิ่ม 17% → ลด spironolactone เป็น 12.5 mg วันเว้นวัน หยุดเกลือทดแทน ตรวจซ้ำใน 3–7 วัน\n\n" +
            "บทบาทของ potassium binder: patiromer หรือ sodium zirconium cyclosilicate ช่วยให้คง RAASi/MRA ไว้ในผู้ที่เป็น hyperkalemia ซ้ำ. Sodium polystyrene sulfonate ไม่เหมาะกับการใช้ประจำ (ลำไส้ตาย ทนยาได้ไม่ดี)\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: SGLT2i ไม่เพิ่ม K⁺ และอาจลดความเสี่ยง hyperkalemia ไม่ควรหยุด; ร้านยาไทยขายเกลือทดแทน/ซอสลดโซเดียมทั่วไป ต้องเตือนผู้ป่วย HF/CKD ที่ใช้ RAAS inhibitor",
          w: {
            A: "การหยุด GDMT ทั้งหมดเพิ่มความเสี่ยงเสียชีวิตและนอนโรงพยาบาล ควรปรับเฉพาะยาที่เกี่ยวข้อง",
            B: "SGLT2i ไม่เพิ่ม K⁺ (อาจลดความเสี่ยง hyperkalemia ด้วยซ้ำ)",
            C: "ไม่แก้สาเหตุ และ SPS ระยะยาวเสี่ยง intestinal necrosis",
            D: "ถูก — แก้สาเหตุ (เกลือทดแทน) และลด MRA ตามระดับ K⁺ แล้วติดตามใกล้ชิด",
            E: "ทำให้ hyperkalemia แย่ลง",
          },
          k: "Hyperkalemia ใน HF: หา hidden K (เกลือทดแทน, NSAID, TMP) → K 5.5–6.0 ลด MRA ครึ่ง, >6.0 หยุด; SCr เพิ่ม <50% คง ARNI ได้",
        },
        5: {
          r:
            "หลักการ titration: beta-blocker ใน HFrEF ลด mortality ตามขนาดยา ควรเพิ่มให้ถึง target dose หรือขนาดสูงสุดที่ทนได้ โดยเพิ่มเป็นสองเท่าทุก ≥2 สัปดาห์ เมื่อผู้ป่วย euvolemic และไม่มี symptomatic hypotension หรือ bradycardia\n\n" +
            "Target dose ของ evidence-based beta-blocker: carvedilol 25 mg BID (50 mg BID ถ้าน้ำหนัก >85 kg), bisoprolol 10 mg OD, metoprolol succinate 200 mg OD. ผู้ป่วยรายนี้ HR 76, BP 110/68 ไม่มีอาการ → เพิ่ม carvedilol 6.25 → 12.5 → 25 mg BID\n\n" +
            "BP ต่ำแบบไม่มีอาการไม่ใช่เหตุผลในการหยุดหรือไม่เพิ่ม GDMT; ถ้ามีหน้ามืดให้ลด diuretic ก่อน (ถ้าไม่มีคั่งน้ำ) หรือแยกเวลาทานยาที่ลด BP\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: carvedilol ทานพร้อมอาหารเพื่อลด orthostatic hypotension; ช่วงเพิ่มขนาดอาจเหนื่อยหรือบวมชั่วคราว ให้ชั่งน้ำหนักทุกวัน; ivabradine ใช้เมื่อได้ BB ขนาดสูงสุดที่ทนได้แล้ว HR ยัง ≥70 ใน sinus rhythm",
          w: {
            A: "ถูก — เพิ่มทีละ 2 เท่าทุก ≥2 สัปดาห์ถึง target 25 mg BID",
            B: "BP ต่ำโดยไม่มีอาการไม่ใช่ข้อห้าม การหยุด BB เพิ่มการเสียชีวิต",
            C: "Atenolol ไม่ใช่ evidence-based beta-blocker ใน HFrEF",
            D: "Ivabradine ใช้เมื่อได้ BB ขนาดสูงสุดที่ทนได้แล้ว HR ยัง ≥70 เท่านั้น",
            E: "เพิ่มเร็วเกินไปและเกิน target dose ของผู้หนัก ≤85 kg",
          },
          k: "BB titration: เพิ่ม 2 เท่าทุก ≥2 สัปดาห์ → carvedilol 25 BID (≤85 kg), bisoprolol 10 OD, metoprolol succinate 200 OD; asymptomatic low BP ไม่ใช่ข้อห้าม",
        },
      },
    },
  ],
  infection: [
    {
      reuse: 3,
      ref: "ATS/IDSA 2019 Guideline for Community-acquired Pneumonia in Adults; แนวทางการดูแลรักษาโรคปอดอักเสบติดเชื้อในชุมชน สมาคมโรคติดเชื้อแห่งประเทศไทย",
      explain: {
        0: {
          r:
            "หลักการเลือกยา empirical ใน CAP: ประเมิน (1) ความรุนแรงและสถานที่รักษา (ผู้ป่วยนอก/ward/ICU) ด้วย CURB-65 หรือ PSI และเกณฑ์ severe CAP (2) โรคร่วม (COPD, HF, CKD, เบาหวาน, ติดสุรา) (3) ปัจจัยเสี่ยงเชื้อดื้อยา — เคยเพาะเชื้อพบ MRSA/Pseudomonas ในทางเดินหายใจ หรือนอนโรงพยาบาลและได้ยาปฏิชีวนะ IV ใน 90 วัน (4) ข้อมูลเชื้อดื้อยาในพื้นที่\n\n" +
            "ผู้ป่วยรายนี้: อายุ 72 ปี RR 28 (CURB-65 ≥2) มี COPD → รักษาในโรงพยาบาล non-severe; ไม่มีปัจจัยเสี่ยง MRSA/Pseudomonas → β-lactam (ceftriaxone หรือ amoxicillin/clavulanate) ร่วมกับ macrolide (azithromycin) หรือ respiratory fluoroquinolone เดี่ยว (levofloxacin) โดยไม่ต้องครอบคลุม MRSA/Pseudomonas\n\n" +
            "ทำไมไม่ครอบคลุมกว้างทุกคน: การให้ยา anti-MRSA/antipseudomonal โดยไม่มีปัจจัยเสี่ยงเพิ่ม ADR, C. difficile, เชื้อดื้อยา และไม่ลดการเสียชีวิต; ส่งเพาะเชื้อเสมหะและเลือดในผู้ป่วยในก่อนให้ยา แต่ไม่รอผล\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ในไทย ระวัง fluoroquinolone ในพื้นที่ที่มี TB สูง (บดบังการวินิจฉัย TB และทำให้ดื้อยา); procalcitonin ไม่ใช้ตัดสินใจไม่ให้ยาปฏิชีวนะเมื่อสงสัย bacterial CAP ชัดเจน",
          w: {
            A: "อายุไม่ใช่ปัจจัยเสี่ยงเชื้อดื้อยา การครอบคลุมกว้างโดยไม่จำเป็นเพิ่ม ADR และเชื้อดื้อยา",
            B: "ความสะดวกไม่ใช่เกณฑ์หลัก fluoroquinolone มี ADR (tendinopathy, QT, dysglycemia) และบดบัง TB",
            C: "ไม่ควรรอผลเพาะเชื้อ การให้ยาช้าเพิ่มการเสียชีวิต",
            D: "Procalcitonin ค่าเดียวไม่ใช้ตัดสินไม่ให้ยาเมื่อสงสัย bacterial CAP",
            E: "ถูก — พิจารณาความรุนแรง โรคร่วม เชื้อดื้อยาในพื้นที่ และปัจจัยเสี่ยง MRSA/Pseudomonas",
          },
          k: "CAP empirical: ประเมินความรุนแรง + โรคร่วม + ปัจจัยเสี่ยง MRSA/Pseudomonas (เคยพบเชื้อ/IV antibiotic ใน 90 วัน); non-severe inpatient → β-lactam + macrolide หรือ resp FQ",
        },
        1: {
          r:
            "หลักการปรับขนาดยาตามไต: เป็นแบบ drug-specific — ขึ้นกับว่ายาขับทางไตในรูปเดิมมากน้อยเพียงใด therapeutic index และลักษณะ PK/PD ของยา ไม่ใช่การลดทุกยาตามสัดส่วนเดียวกัน\n\n" +
            "ตัวอย่างใน CAP: ceftriaxone และ azithromycin ไม่ต้องปรับตามไต; levofloxacin ต้องปรับเมื่อ CrCl <50 (750 mg แล้ว 750 mg ทุก 48 ชั่วโมง); amoxicillin/clavulanate ปรับเมื่อ CrCl <30; piperacillin/tazobactam, cefepime, meropenem ปรับตาม CrCl\n\n" +
            "หลักการเพิ่มเติม: (1) ขนาดแรก (loading dose) มักไม่ต้องลด เพื่อให้ได้ระดับยาเร็ว ส่วนขนาดต่อเนื่องจึงปรับ (2) ในวันแรกของ sepsis ไตอาจเปลี่ยนเร็ว และผู้ป่วยบางรายมี augmented renal clearance ควรประเมินซ้ำทุกวัน (3) ประเมินการทำงานของไตด้วย CrCl (Cockcroft–Gault) สำหรับการปรับขนาดยาตามข้อมูลยา โดยพิจารณาน้ำหนักและมวลกล้ามเนื้อ\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ผู้สูงอายุที่มวลกล้ามเนื้อน้อย SCr อาจต่ำหลอกให้ดูว่าไตดี; β-lactam ที่สะสมในไตเสื่อมเสี่ยง neurotoxicity (cefepime, imipenem)",
          w: {
            A: "ถูก — ปรับตามยาแต่ละตัวและการทำงานของไต",
            B: "ไม่ใช่ทุกยาต้องปรับ และสัดส่วนการปรับต่างกันตามยา",
            C: "SCr ค่าเดียวไม่สะท้อนการทำงานของไต ต้องประเมินร่วมกับอายุ น้ำหนัก มวลกล้ามเนื้อ",
            D: "ยาที่ขับทางไตต้องปรับขนาดต่อเนื่องแม้ติดเชื้อรุนแรง (แต่ไม่ลดขนาดแรก)",
            E: "อายุเป็นเพียงส่วนหนึ่งของการประเมินการทำงานของไต",
          },
          k: "Renal dosing = drug-specific (ceftriaxone/azithro ไม่ต้องปรับ; levofloxacin, pip-tazo, cefepime ปรับ); loading dose ไม่ลด; ประเมิน CrCl ซ้ำทุกวัน",
        },
        2: {
          r:
            "หลักการ antimicrobial stewardship: เมื่อผู้ป่วยตอบสนอง (ไข้ลง hemodynamics คงที่ RR ลด oxygenation ดีขึ้น ทานได้) และมีข้อมูลเชื้อ ควร de-escalate เป็นยาที่แคบลงตามผลเพาะเชื้อ เปลี่ยนเป็นยารับประทาน (IV-to-PO switch) และกำหนดระยะเวลาให้เหมาะสม\n\n" +
            "ระยะเวลาใน CAP (ATS/IDSA 2019): อย่างน้อย 5 วัน และหยุดได้เมื่อผู้ป่วย clinically stable (ไข้ลงอย่างน้อย 48–72 ชั่วโมงและ vital signs ปกติ) — ส่วนใหญ่ 5–7 วัน; ยกเว้นมี complication (empyema, abscess) หรือเชื้อบางชนิด (MRSA/Pseudomonas 7 วัน)\n\n" +
            "ประโยชน์: ลด ADR, C. difficile, เชื้อดื้อยา, ค่าใช้จ่าย และระยะเวลานอนโรงพยาบาล โดยไม่เพิ่มการกลับเป็นซ้ำ\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: เภสัชกรมีบทบาทหลักในการทบทวนยาปฏิชีวนะที่ 48–72 ชั่วโมง (antibiotic time-out) เสนอ IV-to-PO และระยะเวลาที่เหมาะสม ตามนโยบาย Antimicrobial Stewardship ของโรงพยาบาลในไทย",
          w: {
            A: "การให้ยากว้างนานเกินจำเป็นไม่ลด relapse แต่เพิ่ม ADR และเชื้อดื้อยา",
            B: "ไข้ลงเพียง 24 ชั่วโมงยังไม่ถึงเกณฑ์ clinical stability และยังไม่ครบขั้นต่ำ 5 วัน",
            C: "ถูก — de-escalate ตามข้อมูลเชื้อและการตอบสนอง กำหนด duration ตาม clinical stability",
            D: "ไม่มีประโยชน์เมื่อเชื้อไวต่อยาเดิม เพิ่ม ADR",
            E: "การเปลี่ยนยาบ่อยไม่ป้องกันการดื้อยา และเพิ่มความสับสน",
          },
          k: "CAP stewardship: antibiotic time-out 48–72 ชม., de-escalate + IV-to-PO, รักษา ≥5 วันและหยุดเมื่อ clinically stable ≥48–72 ชม.",
        },
        3: {
          r:
            "เกณฑ์จำหน่าย: ผู้ป่วยควร clinically stable — ไข้ลง HR ≤100, RR ≤24, SBP ≥90, SpO₂ ≥90% (หรือเท่า baseline), รู้สติปกติ, รับประทานอาหารและยาได้ — และไม่มีภาวะแทรกซ้อนที่ต้องรักษาในโรงพยาบาล\n\n" +
            "สิ่งที่ต้องประเมินเพิ่มในผู้ป่วยรายนี้ (สูงอายุ + COPD): ความต้องการออกซิเจนเมื่อเทียบกับ baseline, เทคนิคการพ่นยา COPD, โรคร่วมที่อาจกำเริบ (HF, น้ำตาล), ความสามารถทานยาปฏิชีวนะต่อจนครบ, การนัดติดตาม และอาการที่ต้องกลับมาโรงพยาบาล (ไข้กลับ หอบมากขึ้น เจ็บหน้าอก สับสน)\n\n" +
            "สิ่งที่ไม่จำเป็น: CXR อาจใช้ 6–12 สัปดาห์กว่าจะกลับปกติ ไม่ต้องรอก่อนจำหน่าย (ตรวจซ้ำในผู้สูงอายุ/สูบบุหรี่เพื่อคัดกรองมะเร็งตามความเหมาะสม)\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ทำ medication reconciliation (ยา COPD เดิมต้องใช้ต่อ), แนะนำวัคซีนไข้หวัดใหญ่และนิวโมคอคคัส, การเลิกบุหรี่, ไม่ควรให้ยาปฏิชีวนะสำรองไปใช้เองเพราะส่งเสริมการใช้ยาไม่เหมาะสม",
          w: {
            A: "CXR อาจใช้หลายสัปดาห์กว่าจะปกติ ไม่ต้องรอก่อนจำหน่าย",
            B: "ไข้ลงอย่างเดียวไม่พอ ต้องดู oxygen, vital signs, การรับประทาน",
            C: "การให้ยาปฏิชีวนะสำรองไปใช้เองส่งเสริมการใช้ยาไม่เหมาะสมและเชื้อดื้อยา",
            D: "ถูก — ประเมิน clinical stability, oral intake, oxygen, adherence และ red flags",
            E: "ยา COPD maintenance ต้องใช้ต่อ การหยุดเพิ่มความเสี่ยงกำเริบ",
          },
          k: "จำหน่าย CAP: clinically stable (vital signs, SpO₂, รู้สติ, ทานได้), ไม่ต้องรอ CXR ปกติ; reconcile ยาเดิม + วัคซีน + red flags",
        },
      },
    },
    {
      reuse: 11,
      ref: "ASHP/IDSA/PIDS/SIDP 2020 Consensus Guideline on Therapeutic Monitoring of Vancomycin; IDSA 2011 MRSA Guideline; Daptomycin prescribing information",
      explain: {
        0: {
          r:
            "เหตุผลของ loading dose: vancomycin มี volume of distribution ~0.7 L/kg และ half-life ยาว (~6–8 ชั่วโมงเมื่อไตปกติ) ถ้าให้ขนาดปกติต้องใช้เวลาหลายวันกว่าจะถึง steady state ในการติดเชื้อรุนแรง (bacteremia, sepsis, meningitis, pneumonia) จึงควรให้ loading dose 20–35 mg/kg (ตาม actual body weight, สูงสุด ~3 g) เพื่อให้ได้ระดับเป้าหมายเร็ว\n\n" +
            "การคำนวณ: 25 mg/kg × 70 kg = 1,750 mg (ปัดเป็นทวีคูณของ 250 mg ตามขนาดขวดยา)\n\n" +
            "การบริหารยา: หยดอัตราไม่เกิน 1 g/ชั่วโมง (หรือ ≥60 นาทีต่อ 1 g) ขนาด 1,750 mg จึงควรหยดอย่างน้อย 1.75–2 ชั่วโมง เพื่อลด vancomycin infusion reaction (เดิมเรียก red man syndrome — ผื่นแดงที่หน้า คอ ลำตัว คัน ความดันต่ำ เกิดจาก histamine release ไม่ใช่การแพ้ยา) ถ้าเกิดให้หยุดหยดชั่วคราว ให้ antihistamine แล้วหยดใหม่ช้าลง\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: loading dose ไม่ต้องลดตามไต (ขึ้นกับ Vd) แต่ขนาดต่อเนื่องปรับตามไต; ผู้ป่วยอ้วนใช้ actual body weight สำหรับ loading แต่ maintenance ต้องอาศัย PK/AUC",
          w: {
            A: "ต่ำเกินไป ไม่ถึงระดับเป้าหมายเร็ว",
            B: "ต่ำกว่าที่คำนวณได้ (เป็นขนาดคงที่แบบเดิมที่ไม่ได้คิดตามน้ำหนัก)",
            C: "ถูก — 25 mg/kg × 70 kg = 1,750 mg",
            D: "เกินขนาดสูงสุด (~3 g) และเพิ่มความเสี่ยง AKI",
            E: "เกินขนาดอย่างมาก",
          },
          k: "Vancomycin LD 20–35 mg/kg (actual BW, max ~3 g), ไม่ลดตามไต; หยด≤1 g/h ลด infusion reaction (histamine, ไม่ใช่แพ้)",
        },
        1: {
          r:
            "สูตร Cockcroft–Gault: CrCl = [(140 − อายุ) × น้ำหนัก] / (72 × SCr) (× 0.85 ในผู้หญิง)\n\n" +
            "การเลือกน้ำหนัก: คำนวณ ideal body weight ก่อนเสมอ — IBW ชาย = 50 + 2.3 × (ส่วนสูงเป็นนิ้ว − 60) = 50 + 2.3 × (66.9 − 60) ≈ 65.9 kg. น้ำหนักจริง 70 kg ไม่เกิน 120% ของ IBW (79 kg) จึงใช้น้ำหนักจริงได้ (ถ้าเกิน 120–130% มักใช้ adjusted body weight = IBW + 0.4 × (TBW − IBW); ถ้าน้ำหนักจริงน้อยกว่า IBW ใช้น้ำหนักจริง)\n\n" +
            "การคำนวณ: (140 − 55) × 70 / (72 × 1.0) = 5,950 / 72 ≈ 82.6 mL/min\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: CG ใช้กับการปรับขนาดยาตามข้อมูลยาส่วนใหญ่ (ซึ่งสร้างจาก CG) ส่วน eGFR (CKD-EPI) ใช้จัดระยะ CKD; ไม่ใช้ CG เมื่อไตเปลี่ยนแปลงเร็ว (AKI) หรือในผู้ที่มวลกล้ามเนื้อผิดปกติมาก บางแห่งปัด SCr ที่ต่ำมากในผู้สูงอายุขึ้นเป็น 0.8–1.0 ซึ่งยังเป็นที่ถกเถียง",
          w: {
            A: "ต่ำเกินจริง (เหมือนคูณ 0.85 ของผู้หญิงหรือใช้น้ำหนักผิด)",
            B: "คำนวณคลาดเคลื่อน",
            C: "ถูก — (140 − 55) × 70 / 72 ≈ 83 mL/min",
            D: "สูงเกินจริง",
            E: "สูงเกินจริง",
          },
          k: "CG: (140 − อายุ) × น้ำหนัก / (72 × SCr) (×0.85 หญิง); ตรวจ IBW ก่อน — TBW >120% IBW ใช้ AdjBW",
        },
        2: {
          r:
            "หลักการ: เมื่อมีระดับยา 2 จุดใน elimination phase (หลังหยดจบและหลัง distribution phase) สามารถคำนวณ elimination rate constant (ke) จาก first-order kinetics: ke = ln(C1/C2) / Δt และ t½ = 0.693 / ke\n\n" +
            "การคำนวณ: Δt = 9 − 1 = 8 ชั่วโมง; ke = ln(30/10)/8 = 1.0986/8 = 0.137 h⁻¹; t½ = 0.693/0.137 ≈ 5.05 ชั่วโมง\n\n" +
            "การนำไปใช้: ระดับยาลดลงเหลือ 1/3 ใน 8 ชั่วโมง (ประมาณ 1.6 half-lives) ค่า ke ใช้ต่อในการคำนวณ Cmax/Cmin ที่แท้จริง (extrapolate กลับไปที่เวลาหยุดหยดและก่อนเข็มถัดไป) และ AUC₂₄ ด้วยวิธี trapezoidal หรือสมการ Sawchuk–Zaske\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ต้องเจาะระดับยาที่ steady state (ประมาณเข็มที่ 4) และบันทึกเวลาเจาะ เวลาเริ่ม-หยุดหยดให้ถูกต้อง เพราะความคลาดเคลื่อนของเวลาเพียงเล็กน้อยทำให้ AUC ผิดมาก; ปัจจุบันนิยมใช้ Bayesian software ร่วมด้วย",
          w: {
            A: "สั้นเกินไป",
            B: "คำนวณคลาดเคลื่อน",
            C: "ถูก — t½ = 0.693 / [ln(30/10)/8] ≈ 5 ชั่วโมง",
            D: "ยาวเกินจริง",
            E: "ยาวเกินจริง (เท่ากับ Δt ซึ่งไม่ใช่ half-life)",
          },
          k: "2-point PK: ke = ln(C1/C2)/Δt, t½ = 0.693/ke; เจาะที่ steady state และบันทึกเวลาให้แม่นยำ",
        },
        3: {
          r:
            "เป้าหมาย AUC-guided dosing (ASHP/IDSA 2020): สำหรับ MRSA infection ที่รุนแรง ใช้ AUC₂₄/MIC 400–600 (เมื่อ MIC 1 mg/L → AUC₂₄ 400–600 mg·h/L) แทนการไล่ trough 15–20 mg/L เพราะได้ประสิทธิภาพเท่ากันแต่ลด AKI ได้ชัดเจน (AUC >600 สัมพันธ์กับ nephrotoxicity)\n\n" +
            "การปรับขนาด: vancomycin มี linear PK ที่ steady state AUC แปรผันตรงกับขนาดยาต่อวัน: AUC ใหม่ = AUC เดิม × (ขนาดใหม่/ขนาดเดิม). ปัจจุบัน 2,500 mg/วัน → AUC 750 (สูงเกิน) ต้องการ ~450 → ขนาดต่อวัน ≈ 2,500 × 450/750 = 1,500 mg/วัน = 750 mg q12h\n\n" +
            "การเปรียบเทียบตัวเลือก: 500 q12h → 300 (ต่ำ), 750 q12h → 450 (เป้าหมาย), 1,250 q24h → 375 (ต่ำ และ trough ต่ำมาก), 1,000 q8h → 900, 1,500 q12h → 1,350 (เป็นพิษ)\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ตรวจระดับยาซ้ำหลังปรับขนาดและเมื่อไตเปลี่ยน; ปัจจัยเสริม AKI: ใช้ร่วม piperacillin/tazobactam (ข้อมูลสังเกตพบ AKI เพิ่ม), aminoglycoside, contrast, loop diuretic ขนาดสูง",
          w: {
            A: "AUC ≈ 300 ต่ำกว่าเป้า เสี่ยงรักษาไม่ได้ผล",
            B: "ถูก — AUC ≈ 450 อยู่ในเป้าหมาย 400–600",
            C: "AUC ≈ 375 ต่ำกว่าเป้า และ trough ต่ำมากเพราะช่วงห่างยาว",
            D: "AUC ≈ 900 สูงเกิน เสี่ยง AKI",
            E: "AUC ≈ 1,350 เป็นพิษต่อไตอย่างมาก",
          },
          k: "Vancomycin MRSA: AUC₂₄ 400–600 (MIC 1) ลด AKI เทียบ trough 15–20; AUC แปรผันตรงกับขนาดต่อวัน",
        },
        4: {
          r:
            "การประเมิน: blood culture ยังขึ้น MRSA ในวันที่ 5 = persistent bacteremia (≥3–7 วัน) ร่วมกับเกิด AKI (SCr 1.0 → 2.1) — ถือว่าการรักษาด้วย vancomycin ล้มเหลวและมีพิษ ต้อง (1) ค้นหาและกำจัดแหล่งติดเชื้อ (ถอด central line, หา endocarditis ด้วย echocardiography, ฝี, osteomyelitis) (2) เปลี่ยนยา\n\n" +
            "เหตุผลที่เลือก daptomycin: เป็น cyclic lipopeptide ฆ่าเชื้อแบบ concentration-dependent bactericidal ต่อ MRSA ได้ดี ใช้ใน bacteremia และ right-sided endocarditis; ใน persistent bacteremia แนะนำขนาดสูง 8–10 (ถึง 12) mg/kg/วัน ± ร่วม β-lactam (เช่น ceftaroline หรือ cefazolin) เพื่อ synergy; ไม่เป็นพิษต่อไต (ปรับเป็น q48h เมื่อ CrCl <30)\n\n" +
            "ADR และการติดตาม: CPK สัปดาห์ละครั้ง (myopathy/rhabdomyolysis) พิจารณาหยุด statin ชั่วคราว; eosinophilic pneumonia (พบน้อย)\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: linezolid เป็น bacteriostatic ต่อ S. aureus ไม่ใช่ตัวเลือกแรกใน bacteremia; gentamicin ร่วมไม่ได้ประโยชน์และเพิ่ม AKI; clindamycin เป็น bacteriostatic ไม่ใช้ใน bacteremia",
          w: {
            A: "ไม่ลดการเสียชีวิตและเพิ่ม nephrotoxicity โดยเฉพาะเมื่อเกิด AKI แล้ว",
            B: "Cefazolin ไม่ครอบคลุม MRSA",
            C: "Bacteriostatic และไม่แนะนำใน S. aureus bacteremia",
            D: "ถูก — high-dose daptomycin ใน persistent MRSA bacteremia/vancomycin failure และติดตาม CPK",
            E: "Bacteriostatic ไม่ใช่ตัวเลือกแรกใน bacteremia และผู้ป่วยรุนแรงควรใช้ยาฉีด",
          },
          k: "Persistent MRSA bacteremia/vancomycin failure → source control + high-dose daptomycin 8–10 mg/kg (± β-lactam); ติดตาม CPK",
        },
        5: {
          r:
            "กลไกข้อจำกัด: daptomycin ถูกจับและยับยั้งโดย pulmonary surfactant (phospholipid) ในถุงลม ทำให้ไม่สามารถออกฤทธิ์ในเนื้อปอดได้ การศึกษาใน CAP พบว่าด้อยกว่า ceftriaxone จึงห้ามใช้รักษา pneumonia\n\n" +
            "ข้อยกเว้นที่ต้องเข้าใจ: septic pulmonary emboli จาก right-sided endocarditis เป็นการติดเชื้อที่มาจากกระแสเลือดสู่ปอด daptomycin อาจได้ผลกับก้อน emboli ได้บางส่วน แต่ถ้ามี MRSA pneumonia ร่วม (ติดเชื้อในถุงลม) ควรเลือกยาที่เข้าปอดได้ดี เช่น linezolid หรือ vancomycin (ถ้าไตเอื้ออำนวย) หรือ ceftaroline\n\n" +
            "ADR สำคัญของ daptomycin: CPK สูง/myopathy, eosinophilic pneumonia (ไข้ หอบ infiltrate eosinophil ใน BAL — ต้องหยุดยา) พบไม่บ่อย, ทำให้ PT/INR สูงหลอกในบาง reagent\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: daptomycin ไม่ทำให้ QT ยาว และไม่จำเป็นต้องใช้ร่วม rifampicin; การเลือกยาต้องดูตำแหน่งการติดเชื้อ (site penetration) ไม่ใช่เพียงความไวของเชื้อ",
          w: {
            A: "Daptomycin ครอบคลุม MRSA ได้ แต่ถูก surfactant ยับยั้งในถุงลม",
            B: "ถูก — surfactant ยับยั้ง daptomycin จึงไม่ใช้รักษา pneumonia",
            C: "Daptomycin ไม่ทำให้ QT ยาว",
            D: "ไม่จำเป็นต้องใช้ร่วม rifampicin",
            E: "Eosinophilic pneumonia พบได้น้อย ไม่ใช่ทุกราย และไม่ใช่เหตุผลหลักที่ไม่ใช้รักษา pneumonia",
          },
          k: "Daptomycin: ใช้ bacteremia/endocarditis ได้ แต่ห้าม pneumonia (surfactant ยับยั้ง); ADR: CPK ↑, eosinophilic pneumonia",
        },
      },
    },
  ],
  renal: [
    {
      reuse: 31,
      ref: "KDIGO Clinical Practice Guideline for Anemia in CKD 2012; KDIGO 2017 CKD-MBD Guideline Update; Cinacalcet prescribing information",
      explain: {
        0: {
          r:
            "หลักการ: แคลเซียมในเลือดประมาณ 40% จับกับ albumin เมื่อ albumin ต่ำ total calcium จะต่ำลงทั้งที่ ionized calcium (ส่วนที่ออกฤทธิ์) อาจปกติ จึงต้องปรับค่า\n\n" +
            "สูตร: corrected Ca = measured Ca + 0.8 × (4.0 − albumin) = 8.6 + 0.8 × (4.0 − 3.2) = 8.6 + 0.64 ≈ 9.2 mg/dL → อยู่ในช่วงปกติ ไม่ต้องเสริมแคลเซียม\n\n" +
            "ความสำคัญในผู้ป่วย CKD: ค่า Ca ที่ปรับแล้วใช้ตัดสินใจเรื่อง phosphate binder ชนิดมีแคลเซียม calcitriol และ cinacalcet (ห้ามเริ่ม cinacalcet ถ้า Ca ต่ำ); KDIGO แนะนำหลีกเลี่ยง hypercalcemia ในผู้ใหญ่ CKD\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: สูตรนี้คลาดเคลื่อนได้ในผู้ป่วยวิกฤต ไตวายรุนแรง หรือ acid-base ผิดปกติ ถ้าค่าสำคัญต่อการตัดสินใจควรตรวจ ionized calcium โดยตรง",
          w: {
            A: "ลบค่าปรับแทนการบวก",
            B: "เป็นค่าที่วัดได้ ยังไม่ได้ปรับตาม albumin",
            C: "ถูก — 8.6 + 0.8 × 0.8 ≈ 9.2 mg/dL",
            D: "ใช้ค่าปรับเกินจริง",
            E: "คำนวณผิด",
          },
          k: "Corrected Ca = Ca + 0.8 × (4 − albumin); albumin ต่ำ → total Ca ต่ำลวง; วิกฤต/ไตวายรุนแรงตรวจ ionized Ca",
        },
        1: {
          r:
            "การประเมิน: ผู้ป่วยมี absolute iron deficiency ในบริบท CKD (ferritin 150 ≤500 ng/mL และ TSAT 15% ≤30%) — ผู้ป่วยฟอกเลือดเสียเหล็กประมาณ 1–3 g/ปีจากเลือดที่ค้างในเครื่องฟอก การเจาะเลือด และเลือดออกทางเดินอาหาร\n\n" +
            "ทำไมต้องเติมเหล็กก่อน ESA: การสร้างเม็ดเลือดแดงต้องการเหล็ก ถ้าให้ ESA ขณะขาดเหล็กจะตอบสนองไม่ดี (ESA hyporesponsiveness) ต้องใช้ขนาด ESA สูงขึ้นซึ่งเพิ่มความเสี่ยง CV. KDIGO แนะนำทดลองให้เหล็ก IV เมื่อ TSAT ≤30% และ ferritin ≤500 ng/mL\n\n" +
            "ทำไมต้อง IV ในผู้ป่วยฟอกเลือด: hepcidin สูงจากการอักเสบเรื้อรังทำให้ลำไส้ดูดซึมเหล็กได้น้อย ยาเหล็กทานยังถูกลดการดูดซึมจาก phosphate binder ที่มีแคลเซียม. Iron sucrose 100 mg IV ระหว่างฟอกเลือดทุกครั้ง รวม 10 ครั้ง (1 g) เป็นสูตรมาตรฐาน\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: หลีกเลี่ยงการให้เลือดถ้าเป็นไปได้ (เสี่ยง sensitization ต่อการปลูกถ่ายไต, iron overload, ติดเชื้อ); ไม่ให้ IV iron ขณะมีการติดเชื้อรุนแรง; ตรวจ ferritin/TSAT ซ้ำหลังให้ครบอย่างน้อย 1 สัปดาห์",
          w: {
            A: "ESA ตอบสนองไม่ดีเมื่อยังขาดเหล็ก ต้องใช้ขนาดสูงขึ้นเพิ่มความเสี่ยง",
            B: "ดูดซึมได้น้อยในผู้ป่วยฟอกเลือด (hepcidin สูง) และ calcium carbonate ลดการดูดซึมอีก",
            C: "ใช้เมื่ออาการรุนแรงหรือ Hb ต่ำมาก เพราะเสี่ยง sensitization ต่อการปลูกถ่ายไต",
            D: "Folate ไม่ใช่สาเหตุหลัก และขนาดเดิมเพียงพอ",
            E: "ถูก — IV iron sucrose 1 g แก้ absolute iron deficiency ก่อนเริ่ม ESA",
          },
          k: "CKD anemia: TSAT ≤30% + ferritin ≤500 → เติมเหล็ก (HD ใช้ IV iron sucrose 100 mg × 10) ก่อนประเมิน ESA",
        },
        2: {
          r:
            "พยาธิสรีรวิทยา: ไตวายระยะท้ายขับฟอสเฟตไม่ได้ hyperphosphatemia กระตุ้น PTH, FGF-23 และทำให้ vascular smooth muscle cell เปลี่ยนเป็นเซลล์คล้ายกระดูก เกิด vascular calcification ซึ่งสัมพันธ์กับการเสียชีวิตจากโรคหัวใจในผู้ป่วยฟอกเลือด\n\n" +
            "เหตุผลที่เปลี่ยนเป็น non-calcium binder: KDIGO 2017 แนะนำจำกัดขนาด calcium-based binder ในผู้ใหญ่ CKD G3a–G5D ทุกราย (ยิ่งในผู้ที่มี vascular calcification หรือ hypercalcemia) เพราะ positive calcium balance เร่ง calcification. Sevelamer carbonate เป็น polymer แลกเปลี่ยนไอออนที่ไม่ดูดซึม จับฟอสเฟตในลำไส้ ยังลด LDL-C ได้เล็กน้อย\n\n" +
            "การใช้ยา: ทานพร้อมอาหารทุกมื้อ (จับฟอสเฟตจากอาหาร) ขนาดตามระดับฟอสเฟต; ADR ท้องอืด ท้องผูก; จับยาอื่น (levothyroxine, ciprofloxacin, mycophenolate) ต้องแยกเวลา\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: การให้ความรู้เรื่องอาหารฟอสเฟตสูงสำคัญมาก — ฟอสเฟตจากสารเติมแต่งอาหาร (อาหารแปรรูป น้ำอัดลมสีเข้ม เนื้อสัตว์แปรรูป) ดูดซึมได้เกือบ 100%; aluminium hydroxide ใช้ได้ระยะสั้นเท่านั้น",
          w: {
            A: "เพิ่มภาระแคลเซียม ทำให้ vascular calcification แย่ลง",
            B: "ถูก — non-calcium binder ทานพร้อมอาหาร เหมาะกับผู้มี vascular calcification",
            C: "ยังเป็นยาจับฟอสเฟตกลุ่มแคลเซียม",
            D: "ใช้ระยะยาวเสี่ยงสะสม aluminium (encephalopathy, osteomalacia, anemia)",
            E: "Calcitriol เพิ่มการดูดซึมฟอสเฟตและแคลเซียม ทำให้ฟอสเฟตสูงขึ้น",
          },
          k: "Hyperphosphatemia + vascular calcification → non-calcium binder (sevelamer, lanthanum) พร้อมอาหาร; จำกัด Ca binder ใน CKD ทุกระยะ; ให้ความรู้ฟอสเฟตในอาหารแปรรูป",
        },
        3: {
          r:
            "หลักฐาน: การศึกษาขนาดใหญ่ (Normal Hematocrit Trial, CHOIR, CREATE, TREAT) พบว่าการใช้ ESA ให้ Hb สูงใกล้ปกติ (≥13 g/dL) เพิ่ม stroke, hypertension, vascular access thrombosis, CV events และการเสียชีวิต โดยคุณภาพชีวิตดีขึ้นเพียงเล็กน้อย\n\n" +
            "แนวทาง KDIGO: ผู้ป่วย CKD 5D เริ่ม ESA เมื่อ Hb 9–10 g/dL (หลังแก้ภาวะขาดเหล็กแล้ว); ไม่ใช้ ESA เพื่อคง Hb >11.5 g/dL และไม่ตั้งใจเพิ่ม Hb ให้เกิน 13 g/dL; อัตราการเพิ่ม Hb ไม่ควรเกิน ~1–2 g/dL ต่อเดือน (ถ้าเพิ่มเร็วเกินให้ลดขนาด ESA 25%)\n\n" +
            "การติดตาม: Hb ทุก 1–2 สัปดาห์ช่วงเริ่มหรือปรับขนาด แล้วทุกเดือน; ความดันโลหิต; สถานะเหล็ก (ferritin/TSAT) ทุก 1–3 เดือน; ถ้าตอบสนองไม่ดี หาสาเหตุ: ขาดเหล็ก การอักเสบ/ติดเชื้อ hyperparathyroidism การฟอกไม่เพียงพอ pure red cell aplasia\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ESA ต้องเก็บในตู้เย็น ห้ามเขย่า; ผู้ป่วยที่มีประวัติ stroke หรือมะเร็งต้องใช้ ESA อย่างระมัดระวังมาก",
          w: {
            A: "Hb ≥13 เพิ่ม stroke และ CV events",
            B: "เป้าสูงเกินไป เพิ่มความเสี่ยงโดยไม่ได้ประโยชน์เพิ่ม",
            C: "ถูก — คง Hb ~10–11.5 และไม่ตั้งใจให้ถึง 13 g/dL",
            D: "Hb 9 ยังต่ำเกินไป และการหยุด ESA ทันทีทำให้ Hb ผันผวน",
            E: "เพิ่มเร็วเกินไป เสี่ยงความดันสูงและ thrombosis",
          },
          k: "ESA ใน CKD: เริ่มเมื่อ Hb 9–10 (หลังเติมเหล็ก), ไม่คง Hb >11.5, ห้ามตั้งใจเกิน 13; Hb ขึ้น ≤1–2 g/dL/เดือน",
        },
        4: {
          r:
            "พยาธิสรีรวิทยา: secondary hyperparathyroidism ใน CKD เกิดจากฟอสเฟตสูง calcitriol ต่ำ แคลเซียมต่ำ และ FGF-23 สูง กระตุ้นต่อมพาราไทรอยด์ให้หลั่ง PTH และโตขึ้น ทำให้กระดูกผิดปกติ (renal osteodystrophy) และ vascular calcification\n\n" +
            "เป้าหมายใน CKD 5D (KDIGO): คง iPTH ประมาณ 2–9 เท่าของค่าปกติ; ผู้ป่วยรายนี้สูงกว่า 9 เท่า ร่วมกับฟอสเฟตสูง ต้องใช้ยาลด PTH — calcimimetic, calcitriol/vitamin D analog หรือร่วมกัน\n\n" +
            "เหตุผลที่เลือก cinacalcet: เป็น calcimimetic เพิ่มความไวของ calcium-sensing receptor ที่ต่อมพาราไทรอยด์ ลด PTH โดยลด Ca และ P ไปด้วย เหมาะเมื่อฟอสเฟตสูงหรือ Ca ค่อนข้างสูง ขณะที่ calcitriol/paricalcitol เพิ่มการดูดซึม Ca และ P จากลำไส้ทำให้ฟอสเฟตแย่ลง; เริ่ม 30 mg/วันพร้อมอาหาร ปรับทุก 2–4 สัปดาห์\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ADR — hypocalcemia (ตรวจ Ca ภายใน 1 สัปดาห์หลังเริ่ม/ปรับ ห้ามเริ่มถ้า Ca <8.4), คลื่นไส้อาเจียน; cinacalcet เป็น strong CYP2D6 inhibitor (เพิ่มระดับ TCA, metoprolol, flecainide) และถูกเปลี่ยนแปลงผ่าน CYP3A4; ergocalciferol ใช้เฉพาะเมื่อขาด vitamin D",
          w: {
            A: "ถูก — cinacalcet ลด PTH, Ca และ P เหมาะเมื่อฟอสเฟตสูง และต้องติดตาม Ca",
            B: "เพิ่มการดูดซึมฟอสเฟตและแคลเซียมขณะฟอสเฟตสูงอยู่แล้ว",
            C: "ให้เฉพาะเมื่อขาด vitamin D แต่ 25(OH)D ของผู้ป่วยปกติ",
            D: "พิจารณาเมื่อดื้อต่อยาหรือมีภาวะแทรกซ้อนรุนแรง ไม่ใช่ขั้นแรก",
            E: "Vitamin D analog ร่วมกับแคลเซียมเพิ่ม เสี่ยง hypercalcemia และ calcification",
          },
          k: "SHPT ใน CKD 5D (iPTH >9× ULN) + ฟอสเฟตสูง → cinacalcet 30 mg พร้อมอาหาร; ตรวจ Ca 1 สัปดาห์; CYP2D6 inhibitor",
        },
      },
    },
  ],
  endocrine: [
    {
      reuse: 1,
      ref: "KDIGO 2022 Clinical Practice Guideline for Diabetes Management in CKD; KDIGO 2024 CKD Guideline; ADA Standards of Care in Diabetes 2026; EMPA-KIDNEY, FIDELIO-DKD/FIGARO-DKD",
      explain: {
        0: {
          r:
            "การประเมิน: ผู้ป่วยมี T2DM + HTN + CKD G3a (eGFR 48) และ severely increased albuminuria (UACR 680 mg/g = A3) ซึ่งเป็นกลุ่มที่เสี่ยงทั้งไตวายระยะท้ายและ CV events สูง\n\n" +
            "เหตุผลของ ACEI/ARB: ลด efferent arteriolar constriction (ผ่านการลด angiotensin II) ลดความดันใน glomerulus ลด proteinuria และชะลอการเสื่อมของไต (IDNT, RENAAL ใน diabetic nephropathy ด้วย irbesartan/losartan) — ข้อบ่งใช้เกินกว่าการลดความดันอย่างเดียว ควร titrate ถึงขนาดสูงสุดที่ทนได้ (losartan 100 mg/วัน) ไม่ใช่หยุดเมื่อ BP ถึงเป้า\n\n" +
            "เป้าหมาย BP ใน CKD: SBP <120–130 mmHg ถ้าทนได้ (KDIGO 2021 แนะนำ SBP <120 เมื่อวัดแบบมาตรฐาน)\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ตรวจ SCr และ K⁺ 1–2 สัปดาห์หลังเริ่ม/ปรับขนาด; ห้ามใช้ ACEI + ARB ร่วมกัน; หญิงวัยเจริญพันธุ์ต้องคุมกำเนิด; doxazosin, carvedilol และ thiazide ลด BP ได้แต่ไม่มีผลป้องกันไตจำเพาะ",
          w: {
            A: "ลด BP ได้ แต่ไม่มีผลลด albuminuria/ชะลอไตจำเพาะเท่า ARB และเสี่ยงน้ำตาล/ uric acid สูง",
            B: "ไม่มีประโยชน์ป้องกันไตจำเพาะ และไม่มีข้อบ่งชี้ beta-blocker",
            C: "ถูก — ARB titrate ถึงขนาดสูงสุดที่ทนได้ ลด albuminuria และชะลอไต",
            D: "Alpha-blocker ไม่มีประโยชน์ป้องกันไต และเสี่ยง orthostatic hypotension",
            E: "ยังไม่ได้ RAAS blockade ขั้นพื้นฐาน และเสี่ยง hyperkalemia เมื่อ eGFR 48",
          },
          k: "T2DM + CKD + albuminuria → ACEI/ARB titrate ถึง max tolerated dose; ห้าม ACEI + ARB; ตรวจ SCr/K 1–2 สัปดาห์",
        },
        1: {
          r:
            "หลักการ: ACEI/ARB ลดความดันใน glomerulus (efferent arteriole ขยาย) GFR จึงลดลงเล็กน้อยในช่วงแรก — เป็น hemodynamic effect ที่สะท้อนการลด hyperfiltration และสัมพันธ์กับการป้องกันไตระยะยาว ไม่ใช่การบาดเจ็บของไต\n\n" +
            "เกณฑ์ (KDIGO): SCr เพิ่ม <30% ภายใน 4 สัปดาห์หลังเริ่มหรือเพิ่มขนาด และ K⁺ ควบคุมได้ → ใช้ยาต่อ; ถ้าเพิ่ม >30% ให้หาสาเหตุ (ขาดน้ำ NSAIDs renal artery stenosis ใช้ diuretic มากเกิน) และพิจารณาลด/หยุดยา. ผู้ป่วยรายนี้ SCr 1.5 → 1.8 = เพิ่ม 20%, K⁺ 4.9, ไม่มีขาดน้ำ → ใช้ต่อ\n\n" +
            "การติดตาม: ตรวจ SCr และ K⁺ ซ้ำใน 1–2 สัปดาห์เพื่อดูว่าคงที่; ถ้า K⁺ 5.0–5.5 ให้คำแนะนำอาหาร ทบทวนยา และพิจารณา diuretic หรือ potassium binder เพื่อให้คง ARB ได้\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ข้อผิดพลาดที่พบบ่อยคือหยุด ACEI/ARB เมื่อ SCr เพิ่มเล็กน้อย ทำให้ผู้ป่วยเสียประโยชน์ระยะยาว; เปลี่ยน ARB เป็น ACEI ไม่ช่วยเพราะผลต่อ SCr เหมือนกัน",
          w: {
            A: "SCr เพิ่ม 20% (<30%) เป็น hemodynamic effect ที่ยอมรับได้",
            B: "ยังไม่จำเป็นต้องลดขนาด เพราะ SCr เพิ่มไม่ถึงเกณฑ์และ K⁺ ยังควบคุมได้",
            C: "ACEI มีผลต่อ SCr และ K⁺ แบบเดียวกัน",
            D: "ถูก — ใช้ต่อพร้อมติดตาม SCr และ K⁺",
            E: "K⁺ 4.9 ยังไม่จำเป็นต้องใช้ binder ทันที",
          },
          k: "หลังเริ่ม ACEI/ARB: SCr เพิ่ม <30% + K⁺ ควบคุมได้ → ใช้ต่อ; >30% → หาสาเหตุ (ขาดน้ำ NSAIDs RAS) ลด/หยุด",
        },
        2: {
          r:
            "หลักการ: ผู้ป่วยยังมี albuminuria A3 แม้ได้ ARB ขนาดสูงสุด → ต้องเพิ่มยาที่ลดการเสื่อมของไตและ CV events ไม่ใช่เพียงยาลดน้ำตาล\n\n" +
            "หลักฐานของ SGLT2 inhibitor: CREDENCE (canagliflozin), DAPA-CKD (dapagliflozin), EMPA-KIDNEY (empagliflozin) แสดงว่าลด kidney failure, การลดลงของ eGFR อย่างมีนัยสำคัญ, CV death และ HF hospitalization ทั้งผู้ป่วยเบาหวานและไม่เป็นเบาหวาน. KDIGO 2022 แนะนำ SGLT2i ใน T2DM + CKD ที่ eGFR ≥20 (เป็น first-line ร่วมกับ metformin)\n\n" +
            "กลไก: เพิ่มการส่ง Na⁺ ไปที่ macula densa → tubuloglomerular feedback → afferent arteriole หดตัว ลด hyperfiltration (คล้าย ACEI/ARB แต่ด้านตรงข้าม จึงเสริมกัน); ผลลดน้ำตาลลดลงเมื่อ eGFR ต่ำ แต่ผลป้องกันไตยังคงอยู่\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: eGFR อาจลดลง 3–5 mL/min ช่วงแรก (ไม่ต้องหยุด); sick day rules (หยุดเมื่อเจ็บป่วย ทานไม่ได้ ก่อนผ่าตัด); ติดเชื้อราที่อวัยวะเพศ; ลด sulfonylurea/insulin ถ้าเสี่ยง hypoglycemia; DPP-4i (linagliptin) ปลอดภัยในไตเสื่อมแต่ไม่มีผลป้องกันไต/หัวใจ",
          w: {
            A: "ลดน้ำตาลได้แต่ไม่ลด CKD progression/CV events และเสี่ยง hypoglycemia ในไตเสื่อม",
            B: "ถูก — SGLT2i ลดการเสื่อมของไตและ CV events ใช้ได้เมื่อ eGFR ≥20",
            C: "ปลอดภัยในไตเสื่อม แต่ไม่ลด kidney/CV outcomes",
            D: "ทำให้คั่งน้ำ น้ำหนักขึ้น กระดูกหัก ไม่มีผลป้องกันไต",
            E: "ลด HbA1c ได้น้อย ไม่มีผลต่อไต/หัวใจ",
          },
          k: "T2DM + CKD (eGFR ≥20): SGLT2i ร่วมกับ ACEI/ARB ลด kidney failure + CV events; eGFR dip ช่วงแรกยอมรับได้; sick day rules",
        },
        3: {
          r:
            "หลักการ: residual risk ยังสูงเมื่อ albuminuria ยังคงอยู่ (UACR 360 mg/g) แม้ได้ RAAS blockade ขนาดสูงสุดและ SGLT2i — แนวทาง KDIGO 2022/ADA แนะนำเพิ่ม nonsteroidal MRA (finerenone) ใน T2DM ที่ eGFR ≥25, K⁺ ปกติ และ UACR ≥30 mg/g\n\n" +
            "หลักฐานและกลไก: FIDELIO-DKD และ FIGARO-DKD (FIDELITY pooled) แสดงว่า finerenone ลด kidney composite outcome และ CV events. การกระตุ้น mineralocorticoid receptor มากเกินในไตและหัวใจทำให้เกิดการอักเสบและ fibrosis; finerenone เลือกจำเพาะสูง ไม่มีฤทธิ์ต่อ androgen/progesterone receptor (ไม่ทำให้ gynecomastia) และเพิ่ม K⁺ น้อยกว่า spironolactone\n\n" +
            "การใช้ยา: eGFR 25–<60 เริ่ม 10 mg OD; eGFR ≥60 เริ่ม 20 mg OD; เริ่มได้เมื่อ K⁺ ≤5.0; ตรวจ K⁺ ที่ 4 สัปดาห์และเพิ่มเป็น 20 mg ถ้า K⁺ ≤4.8 และ eGFR คงที่; หยุดชั่วคราวเมื่อ K⁺ >5.5\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: finerenone ถูกเปลี่ยนแปลงผ่าน CYP3A4 — ห้ามใช้ร่วม strong CYP3A4 inhibitor (itraconazole, clarithromycin) และหลีกเลี่ยงน้ำเกรปฟรุต; dual RAAS blockade (ACEI + ARB, หรือ + aliskiren) เพิ่ม AKI และ hyperkalemia ห้ามใช้",
          w: {
            A: "Dual RAAS blockade เพิ่ม AKI และ hyperkalemia โดยไม่ลด outcomes (VA NEPHRON-D)",
            B: "Spironolactone ไม่มีหลักฐานลด kidney outcomes และการไม่ติดตาม K⁺ อันตราย",
            C: "SGLT2i ใช้เพื่อป้องกันไต/หัวใจ ไม่ได้ใช้เพียงคุมน้ำตาล ไม่ควรหยุด",
            D: "Aliskiren ร่วมกับ ARB ในเบาหวานเพิ่มเหตุการณ์ไม่พึงประสงค์ (ALTITUDE) ห้ามใช้",
            E: "ถูก — finerenone ลด residual cardiorenal risk ต้องติดตาม K⁺",
          },
          k: "T2DM + CKD + albuminuria ค้าง หลัง max RASi + SGLT2i → finerenone (eGFR ≥25, K ≤5.0; 10 mg ถ้า eGFR <60; ตรวจ K ที่ 4 สัปดาห์); CYP3A4 DDI",
        },
      },
    },
    {
      reuse: 30,
      ref: "2017 ATA Guidelines for the Diagnosis and Management of Thyroid Disease During Pregnancy and the Postpartum; Endocrine Society Clinical Practice Guideline",
      explain: {
        0: {
          r:
            "การเลือกยาตามไตรมาส: ทั้ง methimazole (MMI) และ propylthiouracil (PTU) ผ่านรก — MMI ในไตรมาสแรก (ช่วง organogenesis สัปดาห์ที่ 6–10) สัมพันธ์กับ methimazole embryopathy: aplasia cutis, choanal/esophageal atresia, omphalocele; PTU มีความผิดปกติแต่กำเนิดน้อยกว่าและรุนแรงน้อยกว่า. ATA จึงแนะนำ PTU ในไตรมาสแรก แล้วเปลี่ยนเป็น MMI ในไตรมาสที่ 2 เพราะ PTU มีความเสี่ยง hepatotoxicity รุนแรง (ตับวายเฉียบพลันถึงขั้นต้องปลูกถ่ายตับ)\n\n" +
            "ทำไมต้องรักษา: overt hyperthyroidism ที่ไม่ได้รักษาเพิ่มความเสี่ยงแท้ง ครรภ์เป็นพิษ คลอดก่อนกำหนด ทารกน้ำหนักน้อย thyroid storm และ heart failure ในแม่\n\n" +
            "ข้อห้ามในการตั้งครรภ์: radioactive iodine (ทำลายต่อมไทรอยด์ทารกที่เริ่มจับไอโอดีนหลังสัปดาห์ที่ 10–12); การผ่าตัดทำในไตรมาสที่ 2 เฉพาะผู้ที่แพ้ยาหรือคุมไม่ได้\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ต้องแยก Graves' disease (TRAb บวก ต่อมโต ตาโปน) จาก gestational transient thyrotoxicosis จาก hCG สูงในไตรมาสแรก (มักไม่ต้องใช้ยาต้านไทรอยด์); สอนอาการตับอักเสบ (ตัวเหลือง ปัสสาวะสีเข้ม คลื่นไส้ ปวดท้องขวาบน)",
          w: {
            A: "ถูก — PTU ในไตรมาสแรกเพื่อเลี่ยง methimazole embryopathy",
            B: "MMI ในไตรมาสแรกเสี่ยง embryopathy ใช้ในไตรมาสที่ 2–3",
            C: "ห้ามใช้ radioactive iodine ในการตั้งครรภ์",
            D: "การผ่าตัดสงวนไว้สำหรับไตรมาสที่ 2 ในรายที่ใช้ยาไม่ได้",
            E: "Overt hyperthyroidism ที่ไม่รักษาเพิ่มความเสี่ยงแม่และทารกอย่างมาก",
          },
          k: "Hyperthyroidism ตั้งครรภ์: ไตรมาส 1 → PTU (เลี่ยง MMI embryopathy); ไตรมาส 2–3 → MMI (เลี่ยง PTU hepatotoxicity); ห้าม RAI",
        },
        1: {
          r:
            "หลักการ: ยาต้านไทรอยด์ยับยั้งการสร้างฮอร์โมนใหม่ แต่ฮอร์โมนที่สะสมในต่อมยังหลั่งต่อเนื่อง อาการจึงดีขึ้นหลัง 2–6 สัปดาห์ ระหว่างนี้ใช้ beta-blocker คุมอาการ adrenergic (ใจสั่น มือสั่น วิตกกังวล)\n\n" +
            "การใช้ในการตั้งครรภ์: propranolol 10–40 mg ทุก 6–8 ชั่วโมง (หรือ metoprolol) ขนาดต่ำที่สุดและระยะสั้นที่สุด (ไม่กี่สัปดาห์) จนยาต้านไทรอยด์ออกฤทธิ์ เพราะการใช้นานสัมพันธ์กับ fetal growth restriction, neonatal bradycardia และ hypoglycemia; propranolol ขนาดสูงยังลดการเปลี่ยน T4 เป็น T3 ส่วนปลาย\n\n" +
            "ทำไมไม่ใช้ตัวเลือกอื่น: amiodarone มีไอโอดีนสูงมาก ทำให้เกิดความผิดปกติของไทรอยด์ทั้งแม่และทารก; digoxin ไม่ได้คุมอาการ adrenergic; verapamil IV ไม่ใช่การรักษามาตรฐาน; iodine ใช้ระยะสั้นมากในการเตรียมผ่าตัดหรือ thyroid storm เท่านั้น การใช้ยาวในการตั้งครรภ์ทำให้ทารกเกิด goiter/hypothyroidism\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ห้ามใช้ non-selective beta-blocker ในผู้ป่วยหืด (ใช้ cardioselective หรือ non-DHP CCB แทน)",
          w: {
            A: "มีไอโอดีนสูงมาก ทำให้ไทรอยด์ผิดปกติทั้งแม่และทารก",
            B: "ไม่ได้คุมอาการ adrenergic ของ thyrotoxicosis",
            C: "Iodine ระยะยาวทำให้ทารก goiter และ hypothyroidism",
            D: "ไม่ใช่การรักษามาตรฐานสำหรับอาการ thyrotoxicosis",
            E: "ถูก — beta-blocker ขนาดต่ำระยะสั้นคุมอาการระหว่างรอยาต้านไทรอยด์ออกฤทธิ์",
          },
          k: "Thyrotoxicosis: beta-blocker (propranolol) คุมอาการระยะสั้น; ในตั้งครรภ์ใช้ขนาดต่ำสุด สั้นที่สุด (เสี่ยง FGR, neonatal bradycardia/hypoglycemia)",
        },
        2: {
          r:
            "ภาวะที่ต้องสงสัย: agranulocytosis (ANC <500/µL) เป็น ADR ที่รุนแรงที่สุดของ thionamide ทั้ง PTU และ MMI พบ 0.2–0.5% มักเกิดใน 3 เดือนแรกและสัมพันธ์กับขนาดยา (โดยเฉพาะ MMI ขนาดสูง) อาการแรกคือไข้และเจ็บคอ แผลในปาก อาจลุกลามเป็น sepsis อย่างรวดเร็ว\n\n" +
            "การจัดการ: หยุดยาทันทีและตรวจ CBC with differential ด่วน; ถ้า ANC <500 ห้ามกลับมาใช้ thionamide ทุกชนิดอีก (cross-reactivity สูง) รักษาการติดเชื้อด้วยยาปฏิชีวนะ broad-spectrum ± G-CSF และพิจารณาการรักษาวิธีอื่น (ในการตั้งครรภ์ → thyroidectomy ในไตรมาสที่ 2)\n\n" +
            "การป้องกัน: การตรวจ CBC เป็นประจำไม่สามารถทำนายได้เพราะเกิดเร็ว สิ่งที่สำคัญที่สุดคือสอนผู้ป่วยให้หยุดยาและมาโรงพยาบาลทันทีเมื่อมีไข้หรือเจ็บคอ (บันทึกการให้คำแนะนำเป็นลายลักษณ์อักษร); ตรวจ CBC และ LFT baseline ก่อนเริ่มยา\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ADR อื่น — ผื่นคัน (พบบ่อย มักใช้ยาต่อร่วม antihistamine ได้), hepatotoxicity (PTU: hepatocellular รุนแรง; MMI: cholestatic), ANCA vasculitis (PTU), arthralgia",
          w: {
            A: "อันตราย อาจเป็น agranulocytosis ที่ติดเชื้อรุนแรงได้ใน 1–2 วัน",
            B: "ถูก — หยุดยาและตรวจ CBC (ANC) ด่วน",
            C: "ถ้าเป็น agranulocytosis การเพิ่มยาทำให้อันตรายยิ่งขึ้น",
            D: "ไม่ได้แก้ปัญหาและทำให้การวินิจฉัยล่าช้า",
            E: "Thionamide สองชนิดมี cross-reactivity และต้องตรวจก่อนตัดสินใจ",
          },
          k: "Thionamide + ไข้/เจ็บคอ → หยุดยา + CBC ด่วน (agranulocytosis); ANC <500 ห้ามใช้ thionamide ทุกชนิดอีก; สอนผู้ป่วยตั้งแต่เริ่มยา",
        },
        3: {
          r:
            "หลักการ: เมื่อเข้าไตรมาสที่ 2 ช่วง organogenesis ผ่านไปแล้ว ATA แนะนำพิจารณาเปลี่ยน PTU เป็น MMI เพื่อลดความเสี่ยง hepatotoxicity ของ PTU ในการใช้ระยะยาว\n\n" +
            "อัตราส่วนการเปลี่ยน: PTU : MMI ประมาณ 20 : 1 (ช่วงที่ใช้ได้ 10–15 : 1 ถึง 20 : 1) → PTU 100 mg × 3 = 300 mg/วัน ÷ 20 = 15 mg/วัน methimazole\n\n" +
            "ความแตกต่างทาง PK: MMI มีครึ่งชีวิตยาวกว่า และสะสมในต่อมไทรอยด์ จึงให้วันละครั้งได้ (เพิ่ม adherence) ขณะที่ PTU ต้องให้วันละ 2–3 ครั้ง; PTU ยังยับยั้งการเปลี่ยน T4 เป็น T3 ส่วนปลาย จึงยังใช้ใน thyroid storm\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ตรวจ FT4/TT4 ซ้ำ 2–4 สัปดาห์หลังเปลี่ยนยา; การเปลี่ยนยาอาจทำให้ระดับฮอร์โมนเปลี่ยนชั่วคราว; บางผู้เชี่ยวชาญเลือกใช้ PTU ต่อจนคลอดถ้าคุมได้ดีและไม่มีปัญหาตับ เพื่อเลี่ยงความเสี่ยงจากการเปลี่ยนยา",
          w: {
            A: "ต่ำเกินไป เสี่ยงคุมโรคไม่ได้",
            B: "ต่ำกว่าที่คำนวณได้",
            C: "ถูก — 300 mg PTU ÷ 20 = 15 mg MMI",
            D: "สูงเกินไป เสี่ยงทารก hypothyroidism",
            E: "สูงเกินไปมาก",
          },
          k: "PTU → MMI ≈ 20 : 1 (ช่วง 10–20 : 1); MMI วันละครั้งได้; ตรวจ FT4 2–4 สัปดาห์หลังเปลี่ยน",
        },
        4: {
          r:
            "หลักการ: thionamide ผ่านรกได้มากกว่า thyroxine การให้ยาจนแม่มี free T4 อยู่กึ่งกลางหรือต่ำกว่าปกติ ทำให้ทารกได้รับยาเกินจนเกิด fetal hypothyroidism และ goiter (ทำให้คลอดลำบากหรือทางเดินหายใจอุดกั้น)\n\n" +
            "เป้าหมาย ATA: ใช้ขนาดต่ำสุดที่คุมอาการได้ โดยให้ free T4 อยู่ที่หรือสูงกว่าขอบบนของช่วงปกติเล็กน้อย (หรือ total T4 ~1.5 เท่าของค่าปกติผู้ไม่ตั้งครรภ์) ตรวจทุก 4 สัปดาห์; TSH ไม่ใช่เป้าหมาย เพราะอาจถูกกดอยู่นานหลายเดือน\n\n" +
            "การดำเนินโรค: Graves' มักดีขึ้นในไตรมาสที่ 3 (immune tolerance) ผู้ป่วยบางราย (~20–30%) ลดหรือหยุดยาได้ แต่ต้องประเมินเป็นรายบุคคลตาม TRAb และระดับฮอร์โมน และอาจกำเริบหลังคลอด\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ตรวจ TRAb ในไตรมาสแรก ซ้ำที่ 18–22 สัปดาห์ (ถ้าสูง) และ 30–34 สัปดาห์ เพราะ TRAb สูง (>3 เท่าของค่าปกติ) ผ่านรกทำให้เกิด fetal/neonatal hyperthyroidism; หลังคลอด MMI ≤20 mg/วัน และ PTU ≤450 mg/วันใช้ระหว่างให้นมบุตรได้",
          w: {
            A: "ถูก — ขนาดต่ำสุดให้ FT4 อยู่ที่/สูงกว่าขอบบนเล็กน้อย ลดความเสี่ยงทารก hypothyroid",
            B: "TSH ตอบสนองช้าและอาจถูกกดนาน ไม่ใช่เป้าหมาย",
            C: "เสี่ยงทารก hypothyroidism",
            D: "เสี่ยงทารก hypothyroidism และ goiter",
            E: "บางรายลดหรือหยุดยาได้ในไตรมาสที่ 3 แต่ไม่ใช่ทุกรายและไม่ใช่ตามกำหนดตายตัว",
          },
          k: "Graves ตั้งครรภ์: ขนาด ATD ต่ำสุดให้ FT4 ที่/เหนือ ULN เล็กน้อย ตรวจทุก 4 สัปดาห์; TRAb ไตรมาส 1, 18–22 และ 30–34 สัปดาห์",
        },
      },
    },
  ],
};
