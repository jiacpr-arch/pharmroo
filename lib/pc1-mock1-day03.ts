import type { Pc1MockItem } from "@/lib/pc1-mock-builder";

// PC1 Mock Set 1 — ข้อใหม่ชุดที่ 3: ทางเดินอาหารและตับ (5) + ข้อ/กระดูก/ปวด (2) + กลุ่มประชากรพิเศษ (5)
// เติมหมวดที่คลังเดิมมีไม่ถึง 10 ข้อ (ใช้ร่วมกับ Case 26, 5, 7, 14 จากคลังเดิม) · เน้นง่าย–ปานกลาง

export const MOCK1_DAY03: Record<string, Pc1MockItem[]> = {
  gi: [
    {
      title: "Decompensated cirrhosis: ascites + hepatic encephalopathy",
      base:
        "ชายไทยอายุ 58 ปี น้ำหนัก 62 kg เป็นตับแข็งจากแอลกอฮอล์ (เลิกดื่มแล้ว) มาด้วยท้องโตขึ้น ซึมลง สับสน มี asterixis และท้องผูก 4 วัน. " +
        "ตรวจพบ ascites ปานกลาง ไม่มีไข้ ไม่มีเลือดออกทางเดินอาหาร. Na 133 mmol/L, K 4.0 mmol/L, SCr 0.9 mg/dL, albumin 2.6 g/dL, total bilirubin 3.1 mg/dL",
      ref: "AASLD/EASL 2014 Practice Guideline on Hepatic Encephalopathy; AASLD 2021 Guidance on Ascites and Hepatorenal Syndrome",
      qs: [
        {
          d: "easy",
          p: "ยาที่เหมาะสมที่สุดสำหรับรักษา hepatic encephalopathy ในผู้ป่วยรายนี้คือข้อใด?",
          o: [
            "Lactulose ปรับขนาดให้ถ่ายอุจจาระนิ่ม 2–3 ครั้ง/วัน",
            "Loperamide 2 mg หลังถ่ายเหลวทุกครั้ง",
            "Lorazepam 1 mg IV เพื่อลดอาการสับสน",
            "Omeprazole 40 mg IV OD",
            "จำกัดโปรตีนในอาหารให้น้อยกว่า 20 g/วัน",
          ],
          a: 0,
          r: "Lactulose เป็นยาขั้นแรกของ HE: ถูกแบคทีเรียในลำไส้ย่อยเป็นกรด ทำให้ NH₃ เปลี่ยนเป็น NH₄⁺ ซึ่งดูดซึมไม่ได้ และเป็นยาระบายช่วยขับออก ปรับขนาดให้ถ่ายนิ่ม 2–3 ครั้ง/วัน (rifaximin เสริมเมื่อเป็นซ้ำ). ต้องหาและแก้ปัจจัยกระตุ้น เช่น ท้องผูก ติดเชื้อ เลือดออก ยากดประสาท",
          w: ["ถูก", "ทำให้ท้องผูก เพิ่มการดูดซึม ammonia", "Benzodiazepine ทำให้ HE แย่ลง", "ไม่ได้รักษา HE และ PPI ระยะยาวเพิ่มความเสี่ยง HE/SBP", "ไม่แนะนำจำกัดโปรตีน เพราะผู้ป่วยตับแข็งมักขาดสารอาหาร"],
          k: "HE: lactulose (ถ่ายนิ่ม 2–3 ครั้ง/วัน) ± rifaximin; แก้ปัจจัยกระตุ้น; ไม่จำกัดโปรตีน",
        },
        {
          d: "easy",
          p: "ผู้ป่วยปวดข้อเข่า ยาแก้ปวดที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "Paracetamol ไม่เกิน 2 g/วัน",
            "Ibuprofen 400 mg TID",
            "Naproxen 500 mg BID",
            "Tramadol 100 mg q6h",
            "Diclofenac 75 mg IM เมื่อปวด",
          ],
          a: 0,
          r: "ผู้ป่วยตับแข็งใช้ paracetamol ได้อย่างปลอดภัยในขนาดไม่เกิน 2 g/วัน. NSAIDs ห้ามใช้เพราะลด renal perfusion (เสี่ยง AKI/hepatorenal syndrome) ทำให้ดื้อต่อยาขับปัสสาวะ และเสี่ยงเลือดออกทางเดินอาหาร. Opioid และ tramadol อาจกระตุ้น HE",
          w: ["ถูก", "เสี่ยง AKI, ดื้อยาขับปัสสาวะ, เลือดออก", "เสี่ยง AKI, ดื้อยาขับปัสสาวะ, เลือดออก", "อาจกระตุ้น HE และชัก ขนาดนี้สูงเกินในตับแข็ง", "เสี่ยง AKI และเลือดออก"],
          k: "ตับแข็ง: paracetamol ≤2 g/วัน; หลีกเลี่ยง NSAIDs และยากดประสาท",
        },
        {
          d: "medium",
          p: "หลังอาการสับสนดีขึ้น แพทย์จะเริ่มยาขับปัสสาวะรักษา ascites ขนาดเริ่มต้นที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "Spironolactone 100 mg ร่วมกับ furosemide 40 mg วันละครั้งตอนเช้า",
            "Furosemide 80 mg IV BID อย่างเดียว",
            "Hydrochlorothiazide 50 mg OD",
            "Spironolactone 400 mg ร่วมกับ furosemide 40 mg OD",
            "Acetazolamide 250 mg BID",
          ],
          a: 0,
          r: "Ascites ในตับแข็งเกิดจาก secondary hyperaldosteronism จึงใช้ spironolactone เป็นหลัก ร่วมกับ furosemide ในสัดส่วน 100:40 mg (ปรับเพิ่มได้ถึง 400:160) รักษาสมดุล K และลดน้ำหนักไม่เกิน 0.5 kg/วัน (ไม่มีบวม) ร่วมกับจำกัดเกลือ 2 g/วัน",
          w: ["ถูก", "Loop diuretic อย่างเดียวได้ผลน้อยและเสี่ยง hypokalemia/HE/AKI", "ไม่ใช่ยาหลักของ ascites", "สัดส่วนไม่เหมาะ เริ่มขนาดสูงเกินไป เสี่ยง hyperkalemia", "ไม่ใช้ในการรักษา ascites และอาจเพิ่ม ammonia"],
          k: "Cirrhotic ascites: spironolactone:furosemide = 100:40 (max 400:160) + จำกัดเกลือ",
        },
      ],
    },
    {
      ref: "Maastricht VI/Florence Consensus Report 2022; ACG Clinical Guideline: Treatment of Helicobacter pylori Infection 2024",
      qs: [
        {
          d: "medium",
          p: "ผู้ป่วยแผลในกระเพาะอาหารตรวจพบ H. pylori ยังไม่เคยรักษา ไม่แพ้ penicillin ในพื้นที่ที่เชื้อดื้อ clarithromycin มากกว่า 15% สูตรใดเหมาะสมที่สุด?",
          o: [
            "PPI + bismuth + tetracycline + metronidazole นาน 14 วัน",
            "PPI + amoxicillin + clarithromycin นาน 7 วัน",
            "PPI อย่างเดียว 8 สัปดาห์",
            "PPI + clarithromycin นาน 14 วัน",
            "Amoxicillin + metronidazole นาน 5 วัน",
          ],
          a: 0,
          r: "เมื่อเชื้อดื้อ clarithromycin สูง (>15%) หรือไม่ทราบความไวของเชื้อ แนะนำ bismuth quadruple therapy 14 วันเป็นสูตรแรก. สูตร clarithromycin triple therapy ใช้ได้เฉพาะที่เชื้อไวหรือดื้อต่ำ และควรให้ 14 วัน",
          w: ["ถูก", "ดื้อ clarithromycin สูงและระยะเวลาสั้นเกินไป", "ไม่ได้กำจัดเชื้อ แผลกลับเป็นซ้ำ", "ยาต้านจุลชีพตัวเดียวทำให้เชื้อดื้อ", "ไม่มี PPI และสั้นเกินไป"],
          k: "H. pylori + clarithromycin resistance สูง → bismuth quadruple 14 วัน",
        },
      ],
    },
    {
      ref: "AASLD 2024 Practice Guidance on Risk Stratification and Management of Portal Hypertension and Varices; Baveno VII",
      qs: [
        {
          d: "hard",
          p: "ผู้ป่วยตับแข็งมาด้วยอาเจียนเป็นเลือดสด BP 96/60 mmHg HR 112 Hb 7.4 g/dL สงสัยเลือดออกจาก esophageal varices ระหว่างรอส่องกล้อง การรักษาด้วยยาใดเหมาะสมที่สุด?",
          o: [
            "Octreotide 50 mcg IV bolus แล้วหยด 50 mcg/h ร่วมกับ ceftriaxone 1 g IV OD",
            "Propranolol 40 mg PO BID ทันที",
            "Vitamin K 10 mg IV อย่างเดียว",
            "ให้เลือดจน Hb ≥12 g/dL",
            "Omeprazole 80 mg IV bolus อย่างเดียว",
          ],
          a: 0,
          r: "Acute variceal bleeding: ให้ vasoactive agent (octreotide/somatostatin/terlipressin) ทันทีต่อเนื่อง 2–5 วัน ร่วมกับยาต้านจุลชีพป้องกันการติดเชื้อ (ceftriaxone 1 g/วัน สูงสุด 7 วัน ลดการติดเชื้อ เลือดออกซ้ำ และการเสียชีวิต) และทำ endoscopic band ligation ภายใน 12 ชั่วโมง. ให้เลือดแบบจำกัด (เป้า Hb 7–8 g/dL)",
          w: [
            "ถูก",
            "Non-selective beta-blocker ใช้ป้องกันหลังพ้นระยะเฉียบพลัน ห้ามใช้ขณะความดันต่ำ",
            "ไม่ได้ลดความดัน portal และไม่ใช่การรักษาหลัก",
            "ให้เลือดมากเกินเพิ่มความดัน portal และเลือดออกซ้ำ เป้า 7–8 g/dL",
            "ไม่ได้รักษาเลือดออกจาก varices",
          ],
          k: "Variceal bleed: vasoactive (octreotide/terlipressin) + ceftriaxone + EBL ≤12 ชม.; restrictive transfusion (Hb 7–8)",
        },
      ],
    },
  ],
  rheum: [
    {
      ref: "Alendronate prescribing information; Bone Health & Osteoporosis Foundation Clinician's Guide 2022",
      qs: [
        {
          d: "easy",
          p: "คำแนะนำการรับประทาน alendronate 70 mg สัปดาห์ละครั้ง ข้อใดถูกต้องที่สุด?",
          o: [
            "ทานตอนเช้าขณะท้องว่างกับน้ำเปล่า 1 แก้ว นั่งหรือยืนตัวตรงอย่างน้อย 30 นาทีก่อนทานอาหารหรือยาอื่น",
            "ทานหลังอาหารเช้าทันทีพร้อมนม",
            "ทานก่อนนอนแล้วนอนราบทันที",
            "ทานพร้อม calcium carbonate เพื่อเสริมฤทธิ์",
            "เคี้ยวเม็ดยาก่อนกลืนเพื่อให้ดูดซึมดีขึ้น",
          ],
          a: 0,
          r: "Bisphosphonate ชนิดรับประทานดูดซึมได้น้อยมาก (<1%) และลดลงอีกเมื่อมีอาหาร นม กาแฟ หรือ cation (Ca, Fe, Mg) จึงต้องทานขณะท้องว่างกับน้ำเปล่า 200–250 mL และอยู่ในท่าตัวตรง ≥30 นาทีเพื่อป้องกันหลอดอาหารอักเสบ",
          w: ["ถูก", "อาหารและนมลดการดูดซึม", "นอนราบเสี่ยงหลอดอาหารอักเสบ", "Calcium จับกับยาทำให้ไม่ดูดซึม", "ห้ามเคี้ยว ระคายเคืองช่องปากและหลอดอาหาร"],
          k: "Oral bisphosphonate: ท้องว่าง + น้ำเปล่าเต็มแก้ว + ตัวตรง ≥30 นาที ก่อนอาหาร/ยาอื่น",
        },
      ],
    },
    {
      ref: "NCCN Guidelines: Adult Cancer Pain; CDC 2022 Clinical Practice Guideline for Prescribing Opioids for Pain",
      qs: [
        {
          d: "medium",
          p: "ผู้ป่วยมะเร็งเริ่มใช้ morphine sustained-release 30 mg ทุก 12 ชั่วโมง การป้องกันอาการท้องผูกที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "เริ่ม senna ร่วมกับยาระบายชนิดออสโมติก (เช่น lactulose) ตั้งแต่วันแรกที่เริ่ม opioid",
            "ให้ psyllium อย่างเดียวโดยไม่ต้องเพิ่มน้ำ",
            "รอให้ท้องผูกก่อนแล้วค่อยให้ยาระบาย",
            "ไม่ต้องให้ยาระบายเพราะร่างกายจะทนต่อผลนี้ได้ใน 1–2 สัปดาห์",
            "ลดขนาด morphine ลงครึ่งหนึ่ง",
          ],
          a: 0,
          r: "Opioid-induced constipation เกิดแทบทุกรายและร่างกายไม่เกิด tolerance ต่อผลนี้ จึงควรให้ยาระบายป้องกันตั้งแต่เริ่มยา: stimulant (senna/bisacodyl) ± osmotic. Bulk-forming laxative อาจทำให้อุจจาระอุดตันในผู้ที่ดื่มน้ำน้อยและลำไส้เคลื่อนไหวช้า",
          w: ["ถูก", "Bulk-forming ไม่แนะนำ อาจทำให้อุดตัน", "ควรป้องกันตั้งแต่เริ่ม opioid", "ไม่เกิด tolerance ต่อท้องผูก (ต่างจากคลื่นไส้/ง่วง)", "ทำให้คุมปวดไม่ได้"],
          k: "Opioid → ให้ stimulant ± osmotic laxative ป้องกันตั้งแต่วันแรก; ไม่เกิด tolerance ต่อท้องผูก",
        },
      ],
    },
  ],
  special: [
    {
      title: "Older adult: renal function + potentially inappropriate medications",
      base:
        "หญิงไทยอายุ 84 ปี น้ำหนัก 45 kg อาศัยอยู่คนเดียว SCr 1.2 mg/dL. ยาปัจจุบัน: amlodipine 5 mg OD, omeprazole 20 mg OD และซื้อ diphenhydramine 50 mg ทานก่อนนอนเป็นประจำ. " +
        "ช่วงหลังมีหกล้ม 1 ครั้ง ปากแห้ง และท้องผูก",
      ref: "AGS Beers Criteria 2023; Cockcroft–Gault equation",
      qs: [
        {
          d: "medium",
          p: "ค่า creatinine clearance (Cockcroft–Gault) ของผู้ป่วยรายนี้ใกล้เคียงข้อใดมากที่สุด?",
          o: ["15 mL/min", "25 mL/min", "35 mL/min", "45 mL/min", "55 mL/min"],
          a: 1,
          r: "CrCl = [(140 − อายุ) × น้ำหนัก] / (72 × SCr) × 0.85 (หญิง) = (56 × 45) / (72 × 1.2) × 0.85 ≈ 25 mL/min. แม้ SCr ดูใกล้ปกติ แต่ผู้สูงอายุน้ำหนักน้อยมีมวลกล้ามเนื้อน้อย ไตจึงทำงานลดลงมาก",
          c: ["CrCl = (140 − 84) × 45 / (72 × 1.2) × 0.85", "= 2,520 / 86.4 × 0.85", "≈ 29.2 × 0.85 ≈ 25 mL/min"],
          w: ["ต่ำเกินจริง", "ถูก", "คำนวณคลาดเคลื่อน (ไม่คูณ 0.85 ได้ ≈ 29)", "สูงเกินจริง", "สูงเกินจริง (มักเกิดจากเดาจาก SCr ที่ดูปกติ)"],
          k: "ผู้สูงอายุน้ำหนักน้อย: SCr ปกติไม่ได้แปลว่าไตปกติ ต้องคำนวณ CrCl",
        },
        {
          d: "easy",
          p: "เภสัชกรควรจัดการ diphenhydramine อย่างไร?",
          o: [
            "แนะนำหยุด diphenhydramine และใช้การดูแลด้านสุขอนามัยการนอนแทน",
            "เพิ่มเป็น 100 mg เพื่อให้หลับดีขึ้น",
            "เปลี่ยนเป็น chlorpheniramine 4 mg ก่อนนอน",
            "เปลี่ยนเป็น diazepam 5 mg ก่อนนอน",
            "ใช้ต่อได้เพราะเป็นยาที่ซื้อได้เอง",
          ],
          a: 0,
          r: "Beers Criteria: หลีกเลี่ยง first-generation antihistamine ในผู้สูงอายุ เพราะฤทธิ์ anticholinergic สูง (สับสน ปากแห้ง ท้องผูก ปัสสาวะคั่ง) และเพิ่มการหกล้ม. อาการปากแห้ง ท้องผูก และหกล้มของผู้ป่วยอาจเกิดจากยานี้ ควรเริ่มจากการดูแลการนอนแบบไม่ใช้ยา",
          w: ["ถูก", "เพิ่ม ADR และการหกล้ม", "เป็น first-generation antihistamine เช่นกัน", "Benzodiazepine เพิ่มการหกล้มและสับสนในผู้สูงอายุ (Beers)", "ยา OTC ก็เป็น potentially inappropriate medication ได้"],
          k: "Beers: หลีกเลี่ยง first-gen antihistamine และ benzodiazepine ในผู้สูงอายุ (anticholinergic, หกล้ม)",
        },
        {
          d: "medium",
          p: "ผู้ป่วยเป็น acute uncomplicated cystitis ยาใดควรหลีกเลี่ยงในผู้ป่วยรายนี้มากที่สุด?",
          o: [
            "Nitrofurantoin 100 mg BID",
            "Fosfomycin 3 g ครั้งเดียว",
            "Cephalexin 500 mg BID (ปรับตาม CrCl)",
            "Amoxicillin/clavulanate 625 mg BID (ปรับตาม CrCl)",
            "Cefdinir 300 mg OD (ปรับตาม CrCl)",
          ],
          a: 0,
          r: "Beers Criteria แนะนำหลีกเลี่ยง nitrofurantoin เมื่อ CrCl <30 mL/min เพราะความเข้มข้นในปัสสาวะต่ำจนไม่ได้ผล และยาสะสมทำให้เกิดพิษ (peripheral neuropathy, ปอด, ตับ) โดยเฉพาะเมื่อใช้ระยะยาว",
          w: ["ถูก", "ใช้ได้ ไม่ต้องปรับขนาด", "ใช้ได้เมื่อปรับขนาดตามไต", "ใช้ได้เมื่อปรับขนาดตามไต", "ใช้ได้เมื่อปรับขนาดตามไต"],
          k: "Nitrofurantoin: หลีกเลี่ยงเมื่อ CrCl <30 mL/min (ไม่ได้ผล + พิษ)",
        },
      ],
    },
    {
      ref: "FDA Drug Safety Communication 2017 (codeine and tramadol in breastfeeding); LactMed",
      qs: [
        {
          d: "easy",
          p: "มารดาหลังคลอด 5 วัน ให้นมบุตร ปวดแผลฝีเย็บ ยาแก้ปวดใดควรหลีกเลี่ยงมากที่สุด?",
          o: ["Codeine 30 mg ร่วมกับ paracetamol", "Paracetamol 500 mg", "Ibuprofen 400 mg", "Naproxen 250 mg ระยะสั้น", "Diclofenac gel ทาเฉพาะที่"],
          a: 0,
          r: "Codeine ถูกเปลี่ยนเป็น morphine ผ่าน CYP2D6 มารดาที่เป็น ultra-rapid metabolizer มี morphine ในน้ำนมสูง ทำให้ทารกง่วงซึม กดการหายใจ และเสียชีวิตได้ FDA จึงแนะนำหลีกเลี่ยง codeine และ tramadol ขณะให้นม. Paracetamol และ ibuprofen ผ่านน้ำนมน้อย ใช้ได้",
          w: ["ถูก", "ปลอดภัยขณะให้นม", "ปลอดภัยขณะให้นม", "ใช้ระยะสั้นได้", "ดูดซึมเข้าสู่ร่างกายน้อย"],
          k: "ให้นมบุตร: หลีกเลี่ยง codeine/tramadol (CYP2D6 ultra-rapid); ใช้ paracetamol/ibuprofen",
        },
      ],
    },
    {
      ref: "ACOG Practice Bulletin No. 203: Chronic Hypertension in Pregnancy",
      qs: [
        {
          d: "medium",
          p: "หญิงอายุ 32 ปี ความดันโลหิตสูงเรื้อรัง คุมได้ด้วย enalapril 10 mg OD ตรวจพบว่าตั้งครรภ์ 7 สัปดาห์ ควรจัดการยาอย่างไร?",
          o: [
            "หยุด enalapril และเปลี่ยนเป็น labetalol หรือ nifedipine ER",
            "ใช้ enalapril ต่อเพราะความดันคุมได้ดี",
            "เปลี่ยนเป็น losartan 50 mg OD",
            "หยุดยาลดความดันทั้งหมดจนคลอด",
            "เปลี่ยนเป็น hydrochlorothiazide 25 mg OD และเพิ่ม aliskiren",
          ],
          a: 0,
          r: "ACEI/ARB/direct renin inhibitor เป็นพิษต่อทารก (fetotoxic) โดยเฉพาะไตรมาส 2–3: ไตทารกผิดปกติ น้ำคร่ำน้อย กะโหลกเจริญไม่สมบูรณ์ ควรหยุดทันทีเมื่อทราบว่าตั้งครรภ์และเปลี่ยนเป็น labetalol, nifedipine ER หรือ methyldopa",
          w: ["ถูก", "เสี่ยงพิษต่อทารก", "ARB มีความเสี่ยงเหมือน ACEI", "ความดันสูงที่ไม่ได้รักษาเพิ่มความเสี่ยงต่อแม่และทารก", "Aliskiren ห้ามใช้ในหญิงตั้งครรภ์"],
          k: "ตั้งครรภ์: หยุด ACEI/ARB/aliskiren → labetalol, nifedipine ER, methyldopa",
        },
      ],
    },
  ],
};
