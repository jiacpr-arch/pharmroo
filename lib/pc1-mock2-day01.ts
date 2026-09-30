import type { Pc1MockItem } from "@/lib/pc1-mock-builder";

// PC1 Mock Set 2 — ข้อใหม่ชุดที่ 1: ไต/อิเล็กโทรไลต์ (5) + ต่อมไร้ท่อ (1) + ระบบประสาท (10)
// ใช้ร่วมกับเคสจากคลังเดิม (ไต: Case 31; ต่อมไร้ท่อ: Case 1, 30)
// ใช้ชื่อยา/รูปแบบยาที่มีใช้ในประเทศไทยเป็นหลัก และอธิบายเหตุผลเชิงลึกสำหรับเภสัชกร

export const MOCK2_DAY01: Record<string, Pc1MockItem[]> = {
  renal: [
    {
      title: "Severe hyperkalemia with ECG changes",
      base:
        "ชายไทยอายุ 70 ปี น้ำหนัก 65 kg เป็น HFrEF และ CKD G4 (eGFR 22) ใช้ enalapril 10 mg BID และ spironolactone 25 mg OD. " +
        "มาด้วยอ่อนแรง K 7.0 mmol/L, glucose 110 mg/dL, ECG พบ peaked T waves และ QRS กว้างขึ้น. BP 118/70 mmHg",
      ref: "KDIGO Controversies Conference on Potassium Management 2020; UK Kidney Association Clinical Practice Guideline: Treatment of Acute Hyperkalaemia in Adults 2023",
      qs: [
        {
          d: "easy",
          p: "ยาที่ควรให้เป็นอันดับแรกทันทีคือข้อใด?",
          o: [
            "10% calcium gluconate 10 mL IV ใน 2–3 นาที",
            "Calcium polystyrene sulfonate (Kalimate) 15 g PO",
            "Furosemide 80 mg IV",
            "Sodium bicarbonate 7.5% 50 mL IV",
            "Salbutamol 2.5 mg พ่นฝอยละออง",
          ],
          a: 0,
          r:
            "หลักการ: การรักษา hyperkalemia แบ่งเป็น 3 ขั้นตามลำดับความเร่งด่วน — (1) stabilize cardiac membrane (2) shift K เข้าเซลล์ (3) remove K ออกจากร่างกาย. เมื่อมี ECG เปลี่ยนแปลง (peaked T, PR ยาว, P หาย, QRS กว้าง, sine wave) แสดงว่า myocardium ได้รับผลแล้ว เสี่ยง VF/asystole ได้ทุกเมื่อ ต้องเริ่มขั้นที่ 1 ทันที\n\n" +
            "กลไก: K สูงทำให้ resting membrane potential ของเซลล์หัวใจสูงขึ้น (less negative) Na channel inactivate บางส่วน การนำไฟฟ้าช้าลง. Calcium เพิ่ม threshold potential ทำให้ช่องห่างระหว่าง resting และ threshold potential กลับมาใกล้ปกติ จึงลดความเสี่ยง arrhythmia โดยไม่ได้ลดระดับ K เลย\n\n" +
            "การใช้ยา: 10% calcium gluconate 10 mL (Ca²⁺ 2.2 mmol) IV ช้าๆ 2–3 นาที ออกฤทธิ์ใน 1–3 นาที อยู่ได้ 30–60 นาที ถ้า ECG ยังไม่ดีขึ้นใน 5–10 นาทีให้ซ้ำได้ (ผู้ป่วยบางรายต้องได้ 30 mL). Calcium chloride มี Ca มากกว่า 3 เท่าแต่ระคายหลอดเลือดมาก ควรให้ทาง central line\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ห้ามผสม calcium กับ sodium bicarbonate ในสายเดียวกัน (ตกตะกอน calcium carbonate); ผู้ที่ใช้ digoxin ให้ calcium ช้าๆ ระวัง (แนวคิดเดิมเรื่อง stone heart ปัจจุบันมีหลักฐานน้อย แต่ยังควรให้ช้าและ monitor)",
          w: [
            "ถูก — stabilize membrane ออกฤทธิ์เร็วที่สุด",
            "Potassium binder ออกฤทธิ์ช้าหลายชั่วโมง ใช้ในขั้น remove ไม่ใช่ภาวะฉุกเฉินที่ ECG เปลี่ยน",
            "Loop diuretic ขับ K ทางไตได้ช้าและได้ผลน้อยใน CKD G4 ไม่ป้องกัน arrhythmia ทันที",
            "Bicarbonate shift K ได้น้อยและไม่แน่นอน ใช้เสริมเฉพาะเมื่อมี metabolic acidosis ร่วม",
            "Salbutamol shift K ได้ แต่ต้องให้ calcium ก่อนเสมอเมื่อ ECG ผิดปกติ และอาจทำให้ tachycardia",
          ],
          k: "Hyperkalemia + ECG change → 10% calcium gluconate 10 mL IV ก่อนเสมอ (stabilize membrane ไม่ได้ลด K); ห้ามผสมกับ bicarbonate",
        },
        {
          d: "medium",
          p: "ขั้นต่อไปเพื่อย้ายโพแทสเซียมเข้าเซลล์ ข้อใดเหมาะสมที่สุด?",
          o: [
            "Regular insulin 10 units IV ร่วมกับ 50% dextrose 50 mL IV แล้วติดตามน้ำตาลในเลือด",
            "Regular insulin 10 units IV อย่างเดียว",
            "50% dextrose 50 mL IV อย่างเดียว",
            "NPH insulin 10 units SC",
            "Glucagon 1 mg IM",
          ],
          a: 0,
          r:
            "หลักการ: Insulin กระตุ้น Na⁺/K⁺-ATPase ที่เซลล์กล้ามเนื้อและตับ ดึง K เข้าเซลล์ ลดระดับ K ได้ประมาณ 0.6–1.0 mmol/L เริ่มใน 15 นาที สูงสุด 30–60 นาที อยู่ได้ 4–6 ชั่วโมง เป็นวิธี shift ที่น่าเชื่อถือที่สุด\n\n" +
            "เหตุผลที่ต้องให้ dextrose ร่วม: ผู้ป่วยมี glucose 110 mg/dL (<250) การให้ insulin อย่างเดียวจะเกิด hypoglycemia ได้สูง จึงให้ dextrose 25 g (50% dextrose 50 mL) ร่วม. ผู้ป่วย CKD ขับ insulin ได้ช้า เสี่ยง hypoglycemia ล่าช้า 1–6 ชั่วโมงหลังให้ยา ต้องตรวจ capillary glucose ทุก 1 ชั่วโมงอย่างน้อย 6 ชั่วโมง บางแนวทาง (UKKA) แนะนำให้ 10% dextrose หยดต่อเนื่องในผู้ที่ glucose ก่อนให้ยาต่ำ\n\n" +
            "ยาเสริม: Salbutamol พ่นฝอยละออง 10–20 mg (ขนาดสูงกว่าที่ใช้รักษาหืด) ลด K ได้อีก 0.5–1.0 mmol/L และเสริมฤทธิ์ insulin แต่ระวังใน ischemic heart disease/tachyarrhythmia. ผู้ป่วยรายนี้เป็น HFrEF จึงต้องระวัง tachycardia\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: การ shift เป็นการรักษาชั่วคราว K จะกลับขึ้นมาเมื่อฤทธิ์ยาหมด ต้องเริ่มขั้น remove ควบคู่เสมอ และตรวจ K ซ้ำที่ 1, 2, 4, 6 ชั่วโมง",
          w: [
            "ถูก",
            "Glucose ปกติ ให้ insulin อย่างเดียวเสี่ยง hypoglycemia รุนแรง",
            "Dextrose อย่างเดียวกระตุ้น insulin ภายในร่างกายได้ไม่แน่นอน และในผู้ขาด insulin อาจทำให้ K สูงขึ้นจาก hyperosmolality",
            "NPH ออกฤทธิ์ช้า (onset 1–2 ชั่วโมง) และการดูดซึมทาง SC ไม่แน่นอน ไม่เหมาะกับภาวะฉุกเฉิน",
            "Glucagon ไม่ได้ลดโพแทสเซียม",
          ],
          k: "Shift K: regular insulin 10 U IV + 50% dextrose 50 mL (ถ้า glucose <250) ± salbutamol neb 10–20 mg; ติดตามน้ำตาลอย่างน้อย 6 ชม. (CKD เสี่ยง hypoglycemia ล่าช้า)",
        },
        {
          d: "medium",
          p: "หลังพ้นภาวะฉุกเฉิน แพทย์ต้องการขับโพแทสเซียมออกจากร่างกายและอยากคง enalapril ไว้เพราะมี HFrEF ข้อใดเหมาะสมที่สุด?",
          o: [
            "หยุด spironolactone ชั่วคราว และให้ potassium binder เช่น calcium polystyrene sulfonate หรือ sodium zirconium cyclosilicate",
            "หยุด enalapril ถาวร",
            "ให้ calcium gluconate IV ทุก 6 ชั่วโมง",
            "ให้ insulin/dextrose ซ้ำทุก 4 ชั่วโมงต่อเนื่อง",
            "จำกัดผลไม้ที่มีโพแทสเซียมสูงอย่างเดียว",
          ],
          a: 0,
          r:
            "หลักการ: หลัง stabilize และ shift แล้วต้องลด total body K (remove) พร้อมหาสาเหตุ ผู้ป่วยรายนี้มีปัจจัยหลายอย่างซ้อนกัน: CKD G4 + ACEI + MRA ซึ่งลด aldosterone ทั้งคู่ ทำให้ขับ K ทางไตไม่ได้\n\n" +
            "การจัดการยา: MRA (spironolactone) เพิ่ม K มากที่สุดและในผู้ที่ eGFR <30 ความเสี่ยงสูงมาก จึงหยุดก่อน. ACEI ใน HFrEF ลดการเสียชีวิตและการนอนโรงพยาบาล แนวทาง HF จึงแนะนำให้พยายามคงไว้ (หรือลดขนาด) โดยใช้ potassium binder ช่วย\n\n" +
            "Potassium binder ที่มีในไทย: (1) Calcium polystyrene sulfonate (Kalimate) แลก Ca กับ K ในลำไส้ใหญ่ ออกฤทธิ์ช้า (หลายชั่วโมง–วัน) ขนาด 15 g วันละ 1–3 ครั้ง ADR ท้องผูก ห้ามใช้ร่วม sorbitol เพราะเสี่ยงลำไส้ตาย (bowel necrosis) (2) Sodium zirconium cyclosilicate (Lokelma) จับ K แบบเลือกจำเพาะ ออกฤทธิ์เร็วใน 1 ชั่วโมง ขนาด 10 g TID สูงสุด 72 ชั่วโมงแล้วลดเป็น maintenance ADR บวมจาก Na. ถ้า K ยังสูงหรือไม่ตอบสนอง พิจารณาฟอกเลือด\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: resin ทุกชนิดจับยาอื่นได้ ควรให้ยาอื่นห่างอย่างน้อย 3 ชั่วโมง (SZC 2 ชั่วโมง) และทบทวน OTC/สมุนไพรที่มี K สูง เช่น เกลือโพแทสเซียมทดแทน (salt substitute) NSAIDs",
          w: [
            "ถูก",
            "เสียประโยชน์ด้าน mortality ของ ACEI ใน HFrEF ควรหยุดยาที่เสี่ยงกว่าก่อนและใช้ binder",
            "Calcium ไม่ได้ลด K เป็นเพียงการป้องกันหัวใจชั่วคราว",
            "Insulin ไม่ได้ขับ K ออกจากร่างกาย และให้ซ้ำเสี่ยง hypoglycemia",
            "การควบคุมอาหารจำเป็นแต่ไม่พอในภาวะ K 7.0 ที่มีสาเหตุจากยา",
          ],
          k: "Remove K: หยุด/ลดยาที่เพิ่ม K (MRA ก่อน), potassium binder (Kalimate, SZC), loop diuretic หรือฟอกเลือด; binder ช่วยคง RAASi ใน HF/CKD",
        },
      ],
    },
    {
      ref: "Potassium chloride injection prescribing information; ASHP Guidelines on IV potassium; ISMP High-Alert Medications",
      qs: [
        {
          d: "easy",
          p: "ผู้ป่วย K 2.8 mmol/L ต้องให้ KCl ทางหลอดเลือดดำส่วนปลาย (peripheral line) โดยไม่ได้ติด ECG monitor อัตราการให้สูงสุดที่ปลอดภัยโดยทั่วไปคือข้อใด?",
          o: ["10 mEq/h", "20 mEq/h", "40 mEq/h", "60 mEq/h", "80 mEq/h"],
          a: 0,
          r:
            "หลักการ: KCl ความเข้มข้นสูงเป็น high-alert medication การให้เร็วเกินทำให้ K ในเลือดสูงเฉียบพลันจน cardiac arrest ได้ และความเข้มข้นสูงระคายหลอดเลือดส่วนปลายจนปวดและ phlebitis\n\n" +
            "อัตราที่แนะนำ: ทาง peripheral line ไม่เกิน 10 mEq/h (ความเข้มข้นมักไม่เกิน 40 mEq/L ตามนโยบายส่วนใหญ่ บางแห่งยอมถึง 80 mEq/L). ทาง central line ให้ได้ 20 mEq/h (บางกรณีรุนแรงถึง 40 mEq/h) ต้องติด continuous ECG monitoring\n\n" +
            "การประเมินปริมาณ: โดยประมาณ K ลดลง 0.3 mmol/L ≈ ขาด K ~100 mEq (แปรผันมาก) จึงให้เป็นช่วงและตรวจ K ซ้ำทุก 2–4 ชั่วโมง ถ้าผู้ป่วยทานได้ ควรให้ทางปากร่วม (KCl elixir/Potassium citrate) เพราะปลอดภัยกว่า\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: (1) ห้ามให้ KCl IV push หรือ bolus เด็ดขาด (2) ควรใช้สารละลายสำเร็จรูป premixed เพื่อลด error (3) แก้ hypomagnesemia ร่วมด้วย เพราะ Mg ต่ำทำให้ไตสูญเสีย K ต่อเนื่อง แก้ K ไม่ขึ้น (4) ผสมใน NSS ดีกว่า dextrose เพราะ dextrose กระตุ้น insulin ดึง K เข้าเซลล์",
          w: [
            "ถูก",
            "ใช้ได้ทาง central line พร้อม ECG monitor เท่านั้น",
            "เร็วเกินไปสำหรับ peripheral line เสี่ยง arrhythmia และหลอดเลือดอักเสบ",
            "เร็วเกินไป อันตราย",
            "เร็วเกินไป อันตรายถึงชีวิต",
          ],
          k: "IV KCl: peripheral ≤10 mEq/h, central ≤20 mEq/h + ECG monitor; ห้าม IV push; แก้ Mg ร่วม; ผสม NSS",
        },
      ],
    },
    {
      ref: "ADA Standards of Care in Diabetes 2026; แนวทางเวชปฏิบัติสำหรับโรคเบาหวาน พ.ศ. 2566; FDA Drug Safety Communication on metformin in renal impairment (2016)",
      qs: [
        {
          d: "medium",
          p: "ผู้ป่วย T2DM ใช้ metformin 1,000 mg BID มานาน ตรวจล่าสุด eGFR 38 mL/min/1.73m² (คงที่ 2 ครั้งห่างกัน 3 เดือน) การจัดการ metformin ข้อใดเหมาะสมที่สุด?",
          o: [
            "ลดขนาดเหลือไม่เกิน 1,000 mg/วัน และติดตาม eGFR ทุก 3–6 เดือน",
            "ใช้ขนาดเดิมต่อ ไม่ต้องปรับ",
            "หยุด metformin ทันทีเพราะห้ามใช้เมื่อ eGFR <45",
            "เพิ่มเป็น 2,550 mg/วัน เพื่อคุมน้ำตาล",
            "เปลี่ยนเป็น glibenclamide แทน",
          ],
          a: 0,
          r:
            "หลักการ: Metformin ขับออกทางไตในรูปเดิมเกือบทั้งหมด (tubular secretion ผ่าน OCT2/MATE) เมื่อไตเสื่อม ระดับยาสะสม เพิ่มความเสี่ยง metformin-associated lactic acidosis (พบน้อยมากแต่เสียชีวิตสูง)\n\n" +
            "เกณฑ์ตาม eGFR (FDA 2016, ADA, แนวทางไทย): eGFR ≥45 ใช้ขนาดปกติได้; eGFR 30–44 ไม่แนะนำให้เริ่มใหม่ ถ้าใช้อยู่แล้วให้ใช้ต่อโดยลดขนาด (โดยทั่วไปไม่เกิน 1,000 mg/วัน) และประเมินประโยชน์-ความเสี่ยง; eGFR <30 ห้ามใช้. ควรติดตาม eGFR ถี่ขึ้น (ทุก 3–6 เดือน) เมื่อ eGFR <60\n\n" +
            "สถานการณ์ที่ต้องหยุดชั่วคราว: ก่อนฉีด iodinated contrast ในผู้ที่ eGFR 30–60, ภาวะขาดน้ำ ติดเชื้อรุนแรง หัวใจล้มเหลวเฉียบพลัน หรือผ่าตัดใหญ่ (sick day rules)\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ใน CKD + T2DM ควรพิจารณา SGLT2 inhibitor (เริ่มได้เมื่อ eGFR ≥20) เพื่อชะลอไต และ GLP-1 RA เมื่อต้องคุมน้ำตาลเพิ่ม. Sulfonylurea ที่ขับทางไตอย่าง glibenclamide ต้องหลีกเลี่ยง; ถ้าจำเป็นใช้ glipizide ซึ่งเสี่ยง hypoglycemia น้อยกว่า",
          w: [
            "ถูก",
            "ขนาด 2,000 mg/วัน สูงเกินไปสำหรับ eGFR ระดับนี้ เพิ่มการสะสมของยา",
            "เกณฑ์ห้ามใช้คือ eGFR <30 ส่วน 30–44 ใช้ต่อได้โดยลดขนาด",
            "เกินขนาดสูงสุดและไม่เหมาะกับไตเสื่อม",
            "Glibenclamide และ active metabolite ขับทางไต เสี่ยง hypoglycemia นานและรุนแรง (Beers: หลีกเลี่ยงในผู้สูงอายุ)",
          ],
          k: "Metformin: eGFR ≥45 ปกติ; 30–44 ไม่เริ่มใหม่ ใช้อยู่ลดเหลือ ≤1,000 mg/วัน; <30 ห้ามใช้; หยุดชั่วคราวเมื่อได้ contrast/ขาดน้ำ",
        },
      ],
    },
  ],
  endocrine: [
    {
      ref: "ATA Guidelines for the Treatment of Hypothyroidism 2014; Levothyroxine prescribing information",
      qs: [
        {
          d: "easy",
          p: "หญิงอายุ 45 ปี hypothyroidism เริ่ม levothyroxine 50 mcg และทาน calcium carbonate กับ ferrous fumarate ร่วมด้วย คำแนะนำใดถูกต้องที่สุด?",
          o: [
            "ทาน levothyroxine ตอนท้องว่าง 30–60 นาทีก่อนอาหารเช้า และห่างจาก calcium/iron อย่างน้อย 4 ชั่วโมง",
            "ทาน levothyroxine พร้อม calcium และ iron ตอนเช้าเพื่อไม่ให้ลืม",
            "ทาน levothyroxine หลังอาหารเช้าทันที",
            "ทาน levothyroxine วันเว้นวันเพื่อลด ADR",
            "หยุด levothyroxine เมื่ออาการดีขึ้นแล้ว",
          ],
          a: 0,
          r:
            "หลักการ: Levothyroxine ดูดซึมที่ลำไส้เล็กส่วนต้นประมาณ 60–80% ขณะท้องว่าง และต้องอาศัยสภาวะกรดในกระเพาะช่วยละลาย อาหาร กาแฟ นมถั่วเหลือง และใยอาหารลดการดูดซึมได้ชัดเจน\n\n" +
            "ปฏิกิริยาระหว่างยา: Calcium, iron, aluminium/magnesium antacid, sucralfate, bile acid sequestrant จับกับ levothyroxine ในทางเดินอาหาร ลดการดูดซึม → ต้องแยกเวลาอย่างน้อย 4 ชั่วโมง. PPI ลดความเป็นกรด อาจต้องเพิ่มขนาดยา. ยาเร่ง metabolism (rifampicin, carbamazepine, phenytoin) และ estrogen (เพิ่ม TBG) ก็ทำให้ต้องการขนาดยาเพิ่ม\n\n" +
            "การติดตาม: Levothyroxine มี half-life ~7 วัน ถึง steady state ใน 6 สัปดาห์ จึงตรวจ TSH หลังเริ่ม/ปรับขนาด 6–8 สัปดาห์ เป้าหมาย TSH อยู่ในช่วงปกติ. ผู้สูงอายุหรือมีโรคหัวใจขาดเลือดให้เริ่มขนาดต่ำ 12.5–25 mcg/วัน\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ถ้าผู้ป่วยทานตอนเช้าไม่สะดวก อาจทานก่อนนอนโดยห่างมื้อเย็นอย่างน้อย 3–4 ชั่วโมงได้ ขอให้ทานเวลาเดิมสม่ำเสมอ ถ้าลืม 1 วันทานรวมวันถัดไปได้เพราะ half-life ยาว",
          w: [
            "ถูก",
            "Calcium และ iron จับยาทำให้ดูดซึมลดลงจน TSH ไม่ลง",
            "อาหารลดการดูดซึม 20–40%",
            "ไม่ใช่วิธีการใช้ยามาตรฐาน ควรทานทุกวันเวลาเดิม",
            "Primary hypothyroidism ส่วนใหญ่ต้องใช้ยาตลอดชีวิต",
          ],
          k: "Levothyroxine: ท้องว่าง 30–60 นาทีก่อนอาหาร, แยก Ca/Fe/antacid ≥4 ชม., ตรวจ TSH หลัง 6–8 สัปดาห์",
        },
      ],
    },
  ],
  neuro: [
    {
      title: "Parkinson's disease: motor fluctuations and complications",
      base:
        "ชายไทยอายุ 68 ปี เป็นโรคพาร์กินสันมา 7 ปี ใช้ levodopa/benserazide (Madopar) 100/25 mg วันละ 3 ครั้ง และ pramipexole 0.5 mg วันละ 3 ครั้ง. " +
        "ช่วงหลังอาการสั่นและเคลื่อนไหวช้ากลับมาก่อนถึงมื้อยาถัดไปประมาณ 1 ชั่วโมง",
      ref: "MDS Evidence-Based Medicine Review: Treatments for Motor and Non-Motor Symptoms of Parkinson's Disease; แนวทางเวชปฏิบัติโรคพาร์กินสัน สถาบันประสาทวิทยา",
      qs: [
        {
          d: "easy",
          p: "ภรรยาเล่าว่าผู้ป่วยเล่นการพนันและซื้อของออนไลน์โดยควบคุมตัวเองไม่ได้ ซึ่งไม่เคยเป็นมาก่อน ยาใดน่าจะเป็นสาเหตุมากที่สุด?",
          o: ["Pramipexole", "Benserazide", "Levodopa ขนาดปัจจุบัน", "Vitamin D", "Omeprazole"],
          a: 0,
          r:
            "หลักการ: Dopamine agonist (pramipexole, ropinirole, rotigotine) กระตุ้น D3 receptor ใน mesolimbic pathway ซึ่งเกี่ยวกับระบบรางวัล ทำให้เกิด impulse control disorders (ICD) เช่น เล่นการพนัน ซื้อของ กินไม่หยุด hypersexuality และ punding พบได้ 14–17% ของผู้ใช้ agonist เทียบกับน้อยกว่ามากในผู้ใช้ levodopa อย่างเดียว\n\n" +
            "ปัจจัยเสี่ยง: เพศชาย อายุน้อย ประวัติการเสพติดหรือโรคทางจิตเวช และขนาด agonist สูง\n\n" +
            "การจัดการ: ลดขนาดหรือหยุด dopamine agonist ค่อยๆ ลด (ระวัง dopamine agonist withdrawal syndrome: วิตกกังวล ซึมเศร้า ปวด) และชดเชยอาการทางการเคลื่อนไหวด้วย levodopa\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ต้องถามคัดกรอง ICD กับผู้ป่วยและญาติทุกครั้งที่จ่ายยา เพราะผู้ป่วยมักไม่เล่าเอง; ADR อื่นของ agonist ที่ต้องเตือน: sleep attack (หลับกะทันหันขณะขับรถ), ขาบวม, ภาพหลอน, orthostatic hypotension",
          w: [
            "ถูก",
            "Benserazide เป็น peripheral decarboxylase inhibitor ไม่ผ่านสมอง ไม่ทำให้เกิด ICD",
            "Levodopa ทำให้เกิด ICD ได้น้อยกว่า dopamine agonist มาก",
            "ไม่เกี่ยวข้อง",
            "ไม่เกี่ยวข้อง",
          ],
          k: "Dopamine agonist → impulse control disorder, sleep attack, ขาบวม, ภาพหลอน; ต้องถามคัดกรองทุกครั้ง",
        },
        {
          d: "medium",
          p: "เพื่อแก้อาการ wearing-off ข้อใดเหมาะสมที่สุด?",
          o: [
            "เพิ่ม entacapone 200 mg ทานพร้อม levodopa ทุกมื้อ",
            "เพิ่ม pramipexole เป็น 1.5 mg วันละ 3 ครั้ง",
            "หยุด levodopa/benserazide แล้วใช้ pramipexole อย่างเดียว",
            "เพิ่ม trihexyphenidyl 2 mg TID",
            "ทาน levodopa/benserazide พร้อมอาหารโปรตีนสูงทุกมื้อ",
          ],
          a: 0,
          r:
            "พยาธิสรีรวิทยา: เมื่อโรคดำเนินไป dopaminergic neuron เหลือน้อย สมองเก็บ dopamine ได้น้อยลง ฤทธิ์ของ levodopa (half-life ~1.5 ชั่วโมง) จึงสั้นลงตามระดับยาในเลือด เกิด wearing-off (end-of-dose deterioration)\n\n" +
            "ทางเลือกในการจัดการ: (1) COMT inhibitor เช่น entacapone 200 mg ทานพร้อม levodopa ทุกมื้อ ยับยั้งการเปลี่ยน levodopa เป็น 3-O-methyldopa นอกสมอง ยืดครึ่งชีวิตและเพิ่ม on-time ~1 ชั่วโมง/วัน (มีในรูป levodopa/carbidopa/entacapone - Stalevo) (2) MAO-B inhibitor (selegiline, rasagiline) ลดการทำลาย dopamine ในสมอง (3) แบ่ง levodopa เป็นมื้อถี่ขึ้นหรือใช้ controlled-release (4) dopamine agonist\n\n" +
            "เหตุผลที่เลือก entacapone: ผู้ป่วยมี impulse control disorder จาก pramipexole อยู่แล้ว การเพิ่ม agonist จะทำให้แย่ลง\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: entacapone ทำให้ปัสสาวะสีส้มแดง (ไม่อันตราย) ท้องเสีย และอาจเพิ่ม dyskinesia จึงอาจต้องลดขนาด levodopa ลง 10–30%. แนะนำทาน levodopa ก่อนอาหาร 30 นาทีหรือหลังอาหาร 1 ชั่วโมง เพราะโปรตีน (large neutral amino acids) แย่งการดูดซึมและการขนส่งผ่าน BBB",
          w: [
            "ถูก",
            "ผู้ป่วยมี impulse control disorder จาก agonist อยู่แล้ว การเพิ่มขนาดทำให้แย่ลง",
            "Levodopa มีประสิทธิภาพสูงสุด การหยุดทำให้อาการแย่ลงมากและเสี่ยง parkinsonism-hyperpyrexia syndrome",
            "Anticholinergic ไม่ช่วย wearing-off และทำให้สับสน ท้องผูก ปัสสาวะคั่งในผู้สูงอายุ",
            "โปรตีนแย่งการดูดซึมและการขนส่ง levodopa เข้าสมอง ทำให้ off มากขึ้น",
          ],
          k: "Wearing-off: entacapone (ทานพร้อม levodopa ทุกมื้อ), MAO-B inhibitor, แบ่ง levodopa ถี่ขึ้น; โปรตีนลดการดูดซึม levodopa",
        },
        {
          d: "medium",
          p: "ผู้ป่วยนอนโรงพยาบาลด้วยคลื่นไส้อาเจียนจากกระเพาะอาหารอักเสบ ยาแก้คลื่นไส้ที่เหมาะสมที่สุดคือข้อใด?",
          o: ["Domperidone 10 mg TID", "Metoclopramide 10 mg IV q8h", "Prochlorperazine 10 mg IM", "Haloperidol 1 mg IV", "Chlorpromazine 25 mg IM"],
          a: 0,
          r:
            "หลักการ: อาการพาร์กินสันเกิดจากการขาด dopamine ใน nigrostriatal pathway ยาใดที่ต้าน D2 receptor ในสมองจะทำให้อาการแย่ลงอย่างรุนแรง (rigidity, akinesia, ล้ม) และอาจเกิด parkinsonism-hyperpyrexia\n\n" +
            "เหตุผลที่เลือก domperidone: เป็น peripheral D2 antagonist ที่ผ่าน BBB ได้น้อยมาก ออกฤทธิ์ที่ chemoreceptor trigger zone (อยู่นอก BBB) และกระเพาะอาหาร จึงแก้คลื่นไส้ได้โดยไม่กระทบอาการพาร์กินสัน ยังใช้ป้องกันคลื่นไส้จาก levodopa/dopamine agonist ได้ด้วย\n\n" +
            "ความปลอดภัยของ domperidone: ทำให้ QT ยาวและเสี่ยง sudden cardiac death ในขนาดสูง EMA แนะนำขนาดไม่เกิน 10 mg วันละ 3 ครั้ง ไม่เกิน 7 วัน หลีกเลี่ยงร่วมกับ strong CYP3A4 inhibitor (ketoconazole, clarithromycin) และยาที่ทำให้ QT ยาว\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ยาแก้อาเจียนที่ห้ามใช้ในผู้ป่วยพาร์กินสัน: metoclopramide, prochlorperazine, perphenazine, chlorpromazine, haloperidol, droperidol. ทางเลือกอื่นที่ใช้ได้: ondansetron (แต่ห้ามใช้ร่วม apomorphine เพราะความดันต่ำรุนแรง)",
          w: [
            "ถูก",
            "ผ่าน BBB ต้าน D2 ในสมอง ทำให้อาการพาร์กินสันแย่ลง (มีคำเตือน tardive dyskinesia)",
            "Phenothiazine ต้าน D2 ในสมอง",
            "Butyrophenone ต้าน D2 แรงมาก อาการแย่ลงรุนแรง",
            "Phenothiazine ต้าน D2 ในสมอง",
          ],
          k: "Parkinson's + คลื่นไส้: domperidone (ไม่ผ่าน BBB, ระวัง QT, ≤30 mg/วัน); ห้าม metoclopramide, phenothiazine, haloperidol",
        },
        {
          d: "hard",
          p: "6 เดือนต่อมาผู้ป่วยเห็นภาพหลอนเป็นคนในบ้านตอนกลางคืน ไม่สับสน ไม่ติดเชื้อ ผลเลือดปกติ ปรับลด pramipexole จนหยุดแล้วยังมีอาการที่รบกวนชีวิตประจำวัน การจัดการข้อใดเหมาะสมที่สุด?",
          o: [
            "เริ่ม quetiapine ขนาดต่ำ 12.5–25 mg ก่อนนอน",
            "เริ่ม haloperidol 2 mg ก่อนนอน",
            "เริ่ม risperidone 2 mg ก่อนนอน",
            "หยุด levodopa/benserazide ทันที",
            "เพิ่ม amantadine 100 mg BID",
          ],
          a: 0,
          r:
            "หลักการ: Parkinson's disease psychosis พบได้ 20–40% สัมพันธ์กับตัวโรค (Lewy body) และยา dopaminergic ขั้นตอนการจัดการ: (1) หาและแก้สาเหตุกระตุ้น เช่น ติดเชื้อ ขาดน้ำ ยาใหม่ (2) ลดยาที่มักเป็นต้นเหตุตามลำดับ: anticholinergic → amantadine → MAO-B inhibitor → dopamine agonist → COMT inhibitor → สุดท้ายค่อยลด levodopa (3) ถ้ายังมีอาการที่รบกวน จึงใช้ antipsychotic\n\n" +
            "การเลือก antipsychotic: ต้องใช้ยาที่จับ D2 น้อยเพื่อไม่ให้การเคลื่อนไหวแย่ลง — quetiapine (ใช้บ่อยที่สุดในไทย เริ่ม 12.5–25 mg ก่อนนอน), clozapine (มีหลักฐานดีที่สุดในขนาดต่ำ 6.25–50 mg/วัน แต่ต้องตรวจ ANC), pimavanserin (5-HT2A inverse agonist ยังไม่มีในไทย). พิจารณา cholinesterase inhibitor (rivastigmine) ร่วมถ้ามีภาวะสมองเสื่อม\n\n" +
            "เหตุผลที่ห้าม haloperidol/risperidone: จับ D2 แรง ทำให้ rigidity และ akinesia แย่ลงอย่างรุนแรง ผู้ป่วยที่มี Lewy body ยังไวต่อ antipsychotic อย่างมาก (severe neuroleptic sensitivity) อาจถึงชีวิต\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: antipsychotic ในผู้สูงอายุที่มีภาวะสมองเสื่อมมี boxed warning เพิ่มการเสียชีวิต ใช้ขนาดต่ำสุดและประเมินซ้ำเป็นระยะ; quetiapine ทำให้ง่วงและ orthostatic hypotension เพิ่มความเสี่ยงล้ม",
          w: [
            "ถูก",
            "ต้าน D2 แรง ทำให้อาการพาร์กินสันแย่ลงรุนแรง",
            "ต้าน D2 มาก ทำให้อาการแย่ลง",
            "Levodopa เป็นยาหลัก การหยุดทันทีเสี่ยง parkinsonism-hyperpyrexia syndrome (คล้าย NMS)",
            "Amantadine เองทำให้เกิดภาพหลอนได้ ควรลดเป็นลำดับต้นๆ",
          ],
          k: "PD psychosis: แก้สาเหตุ → ลด anticholinergic/amantadine/MAO-B/agonist → quetiapine หรือ clozapine ขนาดต่ำ; ห้าม haloperidol/risperidone",
        },
      ],
    },
    {
      title: "Migraine in a woman of reproductive age",
      base:
        "หญิงไทยอายุ 29 ปี เป็นไมเกรนชนิดมีออร่า (เห็นแสงวูบวาบก่อนปวด 20 นาที) ปวดตุบๆ ข้างเดียว คลื่นไส้ ปวด 2–3 ครั้ง/เดือน. " +
        "ใช้ยาเม็ดคุมกำเนิดชนิดฮอร์โมนรวม (ethinylestradiol 30 mcg/levonorgestrel 150 mcg) ไม่สูบบุหรี่ BP 118/74 mmHg",
      ref: "แนวทางการรักษาโรคปวดศีรษะไมเกรน สมาคมโรคปวดศีรษะแห่งประเทศไทย; AHS Consensus Statement 2021; ICHD-3; WHO Medical Eligibility Criteria for Contraceptive Use 2015",
      qs: [
        {
          d: "easy",
          p: "ผู้ป่วยปวดศีรษะไมเกรนระดับปานกลางถึงรุนแรง ใช้ paracetamol และ naproxen แล้วไม่ได้ผล ยาแก้ปวดเฉียบพลันที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "Triptan เช่น eletriptan 40 mg หรือ sumatriptan 50 mg ทันทีที่เริ่มปวด ซ้ำได้หลัง 2 ชั่วโมงถ้าปวดกลับมา",
            "Propranolol 40 mg BID ทุกวัน",
            "Tramadol 50 mg ทุก 6 ชั่วโมงเป็นประจำ",
            "Ergotamine/caffeine (Cafergot) ร่วมกับ triptan ในวันเดียวกัน",
            "Diazepam 5 mg เมื่อปวด",
          ],
          a: 0,
          r:
            "หลักการ: การรักษาไมเกรนเฉียบพลันใช้แบบ stratified care ตามความรุนแรง — ปวดเล็กน้อยถึงปานกลางใช้ paracetamol/NSAIDs; ปวดปานกลางถึงรุนแรงหรือ NSAIDs ไม่ได้ผลใช้ triptan\n\n" +
            "กลไกของ triptan: 5-HT1B/1D agonist — 5-HT1B ทำให้หลอดเลือด meningeal ที่ขยายหดตัว, 5-HT1D ยับยั้งการหลั่ง CGRP และ substance P จาก trigeminal nerve ลดการอักเสบรอบหลอดเลือด และยับยั้งการส่งสัญญาณปวดที่ trigeminal nucleus caudalis\n\n" +
            "วิธีใช้ให้ได้ผล: ทานตั้งแต่เริ่มปวด (ขณะยังปวดน้อย) ไม่ใช่ช่วงออร่า ถ้าได้ผลแต่ปวดกลับมาทานซ้ำได้หลัง 2 ชั่วโมง ไม่เกินขนาดสูงสุดต่อวัน (sumatriptan 200 mg, eletriptan 80 mg). ถ้าครั้งแรกไม่ได้ผลเลยไม่ควรทานซ้ำในครั้งเดียวกัน ให้ลองกับการปวดครั้งถัดไป 2–3 ครั้งก่อนสรุปว่าไม่ได้ผล\n\n" +
            "ข้อห้ามและข้อควรรู้สำหรับเภสัชกร: ห้ามใช้ triptan ในโรคหลอดเลือดหัวใจ/สมอง ความดันสูงที่คุมไม่ได้ hemiplegic/brainstem aura; ห้ามใช้ร่วม ergotamine ภายใน 24 ชั่วโมง (vasospasm) และห้ามร่วม MAOI; eletriptan ถูกเปลี่ยนแปลงผ่าน CYP3A4 ห้ามใช้ร่วม strong CYP3A4 inhibitor. ในไทย Cafergot ใช้บ่อย แต่เป็นยาที่ทำให้เกิด MOH และ ergotism ได้",
          w: [
            "ถูก",
            "เป็นยาป้องกันไมเกรน ไม่ใช่ยารักษาเฉียบพลัน",
            "Opioid ไม่แนะนำในไมเกรน ได้ผลน้อย เสี่ยง MOH และติดยา",
            "ห้ามใช้ ergot ร่วมกับ triptan ภายใน 24 ชั่วโมง เสี่ยงหลอดเลือดหดเกร็งรุนแรง",
            "Benzodiazepine ไม่ใช่ยารักษาไมเกรน",
          ],
          k: "Acute migraine ปานกลาง–รุนแรง → triptan ตั้งแต่เริ่มปวด; ห้ามร่วม ergot ใน 24 ชม.; ห้ามใช้ใน CAD/stroke/HTN คุมไม่ได้",
        },
        {
          d: "medium",
          p: "1 ปีต่อมาผู้ป่วยปวดศีรษะเกือบทุกวัน ใช้ Cafergot หรือ triptan รวมกัน 12–14 วัน/เดือน มา 4 เดือน ภาวะใดน่าจะเป็นมากที่สุด?",
          o: [
            "Medication-overuse headache",
            "Serotonin syndrome",
            "Tension-type headache จากความเครียด",
            "Cluster headache",
            "ผลข้างเคียงจาก triptan ต่อความดันโลหิต",
          ],
          a: 0,
          r:
            "เกณฑ์วินิจฉัย (ICHD-3): Medication-overuse headache (MOH) คือปวดศีรษะ ≥15 วัน/เดือนในผู้ที่มีโรคปวดศีรษะเดิม ร่วมกับใช้ยาแก้ปวดเกินเกณฑ์นานกว่า 3 เดือน — triptan, ergotamine, opioid หรือยาผสม ≥10 วัน/เดือน; หรือ simple analgesic (paracetamol, NSAIDs) ≥15 วัน/เดือน\n\n" +
            "กลไก: การใช้ยาแก้ปวดบ่อยทำให้เกิด central sensitization และ downregulation ของระบบยับยั้งความปวด เกณฑ์ปวดลดลง ปวดถี่ขึ้นจนเป็นวงจร\n\n" +
            "การจัดการ: (1) ให้ความรู้และลด/หยุดยาที่ใช้เกิน (ergot/triptan/simple analgesic หยุดได้ทันที; opioid, butalbital, benzodiazepine ต้องค่อยๆ ลด) (2) เริ่มยาป้องกันไมเกรน เช่น propranolol, amitriptyline, flunarizine หรือ topiramate (ระวังในหญิงวัยเจริญพันธุ์) (3) อาจใช้ bridging therapy เช่น NSAIDs หรือ steroid ระยะสั้นช่วงหยุดยา\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: เกณฑ์ที่ควรเริ่มยาป้องกันคือปวด ≥4 วัน/เดือน หรือปวดที่กระทบชีวิตประจำวันมาก เภสัชกรร้านยาควรสังเกตผู้ที่ซื้อ Cafergot/ยาแก้ปวดบ่อยและส่งต่อ; การใช้ ergotamine บ่อยยังเสี่ยง ergotism (มือเท้าเย็น ขาดเลือด) โดยเฉพาะเมื่อใช้ร่วม CYP3A4 inhibitor",
          w: [
            "ถูก",
            "ไม่มีอาการทางระบบประสาทอัตโนมัติ กล้ามเนื้อกระตุก หรือไข้",
            "ประวัติการใช้ยาเกินเกณฑ์ชัดเจน ต้องนึกถึง MOH ก่อน",
            "ลักษณะไม่เข้า (ปวดรอบตาข้างเดียว 15–180 นาที มีน้ำตา/น้ำมูกข้างเดียวกัน)",
            "ไม่อธิบายการปวดทุกวัน",
          ],
          k: "MOH: triptan/ergot/opioid/ยาผสม ≥10 วัน/เดือน หรือ simple analgesic ≥15 วัน/เดือน >3 เดือน → หยุดยาที่ใช้เกิน + เริ่มยาป้องกัน",
        },
        {
          d: "hard",
          p: "ประเด็นใดสำคัญที่สุดเกี่ยวกับยาคุมกำเนิดของผู้ป่วยรายนี้?",
          o: [
            "ไมเกรนชนิดมีออร่าเป็นข้อห้ามของยาคุมฮอร์โมนรวม ควรเปลี่ยนเป็นยาคุมชนิดโปรเจสตินอย่างเดียว ยาฉีด ยาฝัง หรือห่วงอนามัย",
            "ใช้ยาคุมเดิมต่อได้เพราะผู้ป่วยอายุน้อยกว่า 35 ปีและไม่สูบบุหรี่",
            "ควรเปลี่ยนเป็นยาคุมที่มี ethinylestradiol ขนาดสูงขึ้นเพื่อลดไมเกรน",
            "Triptan ลดประสิทธิภาพยาคุม ต้องใช้ถุงยางร่วม",
            "ยาคุมฮอร์โมนรวมป้องกันไมเกรนชนิดมีออร่าได้",
          ],
          a: 0,
          r:
            "หลักการ: ไมเกรนชนิดมีออร่าเพิ่มความเสี่ยง ischemic stroke ประมาณ 2 เท่า ส่วน estrogen ในยาคุมเพิ่มความเสี่ยงการแข็งตัวของเลือดและ stroke เมื่อรวมกันความเสี่ยงเพิ่มแบบทวีคูณ (บางการศึกษาสูงถึง 6 เท่า และสูงขึ้นอีกเมื่อสูบบุหรี่)\n\n" +
            "ตามเกณฑ์ WHO MEC: ไมเกรนมีออร่า = category 4 สำหรับ combined hormonal contraception (ยาเม็ด แผ่นแปะ วงแหวน) คือห้ามใช้ไม่ว่าอายุเท่าใด ส่วนไมเกรนไม่มีออร่าในผู้อายุ <35 ปีจัดเป็น category 2\n\n" +
            "ทางเลือกที่ปลอดภัย: ยาเม็ดโปรเจสตินอย่างเดียว (desogestrel 75 mcg), ยาฉีด DMPA, ยาฝัง (etonogestrel/levonorgestrel implant), ห่วงอนามัยทองแดงหรือห่วงฮอร์โมน LNG-IUS — ทั้งหมดเป็น category 1–2 ในไมเกรนมีออร่า\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ร้านยาควรถามประวัติไมเกรนและออร่า (เห็นแสงวูบวาบ เส้นซิกแซก ชา) ทุกครั้งที่จ่ายยาคุมฮอร์โมนรวม และประเมินปัจจัยเสี่ยงอื่น (สูบบุหรี่ ความดันสูง อายุ ≥35 ปี ประวัติ VTE)",
          w: [
            "ถูก",
            "ข้อห้ามนี้ไม่ขึ้นกับอายุหรือการสูบบุหรี่ (อายุและบุหรี่ใช้แยกเฉพาะไมเกรนไม่มีออร่า)",
            "Estrogen ขนาดสูงเพิ่มความเสี่ยง stroke",
            "ไม่มีปฏิกิริยาระหว่าง triptan กับยาคุม",
            "ไม่จริง และเพิ่มความเสี่ยง stroke",
          ],
          k: "Migraine with aura → ห้ามยาคุมฮอร์โมนรวม (WHO MEC 4); ใช้ progestin-only, DMPA, implant หรือ IUD",
        },
      ],
    },
    {
      ref: "Donepezil prescribing information; AGS Beers Criteria 2023",
      qs: [
        {
          d: "easy",
          p: "ผู้ป่วยอัลไซเมอร์อายุ 80 ปี เริ่ม donepezil 5 mg ก่อนนอน อาการไม่พึงประสงค์ใดที่ต้องเฝ้าระวังเป็นพิเศษ?",
          o: [
            "หัวใจเต้นช้าและเป็นลม",
            "ปากแห้ง ท้องผูก ปัสสาวะคั่ง",
            "ความดันโลหิตสูงวิกฤต",
            "Hyperkalemia",
            "น้ำตาลในเลือดต่ำ",
          ],
          a: 0,
          r:
            "กลไก: Donepezil เป็น reversible acetylcholinesterase inhibitor เพิ่ม acetylcholine ในสมองเพื่อชดเชยการสูญเสีย cholinergic neuron ใน Alzheimer's disease แต่ก็เพิ่ม acetylcholine นอกสมองด้วย ทำให้เกิดฤทธิ์ cholinergic (muscarinic)\n\n" +
            "ADR สำคัญ: (1) ทางเดินอาหาร: คลื่นไส้ อาเจียน ท้องเสีย เบื่ออาหาร น้ำหนักลด (พบบ่อยที่สุด ลดได้โดย titrate ช้าๆ) (2) หัวใจ: vagotonic effect ที่ SA/AV node ทำให้ bradycardia, heart block และ syncope เพิ่มความเสี่ยงล้มและกระดูกสะโพกหัก (3) ฝันร้าย นอนไม่หลับ (4) ตะคริว (5) ปัสสาวะบ่อย\n\n" +
            "การใช้ยา: เริ่ม 5 mg ก่อนนอน 4–6 สัปดาห์แล้วเพิ่มเป็น 10 mg ถ้าทนได้ ถ้าฝันร้าย/นอนไม่หลับให้ย้ายไปทานตอนเช้า ประเมินผลด้วย cognitive score และการทำกิจวัตร\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ระวังใช้ร่วม beta-blocker, non-DHP CCB, digoxin (bradycardia เสริมกัน) และหลีกเลี่ยงยา anticholinergic (oxybutynin, first-gen antihistamine, TCA) ซึ่งต้านฤทธิ์ donepezil และทำให้สมองแย่ลง — เป็น prescribing cascade ที่พบบ่อย เช่น donepezil ทำให้ปัสสาวะบ่อยแล้วได้ oxybutynin",
          w: [
            "ถูก",
            "เป็นฤทธิ์ anticholinergic ซึ่งตรงข้ามกับ donepezil",
            "ไม่ใช่ ADR ของยานี้",
            "ไม่ใช่ ADR ของยานี้",
            "ไม่ใช่ ADR ของยานี้",
          ],
          k: "Donepezil: GI ADR, bradycardia/syncope, ฝันร้าย; ระวังร่วม beta-blocker; เลี่ยง anticholinergic (prescribing cascade)",
        },
      ],
    },
    {
      ref: "International Consensus Guidance for Management of Myasthenia Gravis 2020 update; FDA boxed warning for fluoroquinolones",
      qs: [
        {
          d: "medium",
          p: "หญิงอายุ 40 ปี เป็น myasthenia gravis ใช้ pyridostigmine (Mestinon) เป็น acute cystitis ยาต้านจุลชีพใดควรหลีกเลี่ยงมากที่สุด?",
          o: ["Norfloxacin", "Fosfomycin", "Cephalexin", "Amoxicillin/clavulanate", "Cefdinir"],
          a: 0,
          r:
            "พยาธิสรีรวิทยา: Myasthenia gravis เกิดจาก autoantibody ต่อ acetylcholine receptor ที่ neuromuscular junction ทำให้จำนวน receptor ที่ใช้งานได้ลดลง ระยะปลอดภัย (safety margin) ของการส่งสัญญาณประสาท-กล้ามเนื้อต่ำ ยาที่รบกวน NMJ แม้เล็กน้อยจึงทำให้กล้ามเนื้ออ่อนแรงมากขึ้น จนเกิด myasthenic crisis (หายใจล้มเหลว)\n\n" +
            "Fluoroquinolone (norfloxacin, ciprofloxacin, levofloxacin): มี boxed warning ว่าทำให้ MG กำเริบ อาจรุนแรงถึงต้องใส่ท่อช่วยหายใจ กลไกคาดว่ายับยั้งการหลั่ง ACh ก่อน synapse และกั้น receptor\n\n" +
            "ยาอื่นที่ต้องหลีกเลี่ยงหรือใช้อย่างระวังใน MG: aminoglycoside, macrolide (azithromycin, clarithromycin), telithromycin (ห้ามใช้), magnesium ทางหลอดเลือด, beta-blocker, calcium channel blocker, neuromuscular blocker, botulinum toxin, chloroquine/hydroxychloroquine, statin, D-penicillamine และ immune checkpoint inhibitor\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ในไทย norfloxacin เป็นยารักษา UTI ที่จ่ายบ่อยในร้านยาและโรงพยาบาล ต้องซักประวัติโรคประจำตัวก่อนจ่าย ทางเลือกที่ปลอดภัยกว่าสำหรับ cystitis: fosfomycin, beta-lactam; ถ้าจำเป็นต้องใช้ยาเสี่ยง ต้องติดตามอาการอ่อนแรง กลืนลำบาก หายใจลำบากอย่างใกล้ชิด",
          w: [
            "ถูก — fluoroquinolone มี boxed warning ใน MG",
            "ใช้ได้ ไม่มีผลต่อ NMJ",
            "ใช้ได้",
            "ใช้ได้",
            "ใช้ได้",
          ],
          k: "Myasthenia gravis: หลีกเลี่ยง fluoroquinolone, aminoglycoside, macrolide, Mg IV, beta-blocker; ซักประวัติก่อนจ่าย norfloxacin",
        },
      ],
    },
    {
      ref: "FSRH Clinical Guidance: Drug Interactions with Hormonal Contraception 2022; Carbamazepine prescribing information",
      qs: [
        {
          d: "hard",
          p: "หญิงอายุ 25 ปี เริ่ม carbamazepine รักษา focal epilepsy และใช้ยาเม็ดคุมกำเนิดชนิดฮอร์โมนรวมอยู่ ต้องการคุมกำเนิดที่ได้ผลแน่นอน คำแนะนำใดเหมาะสมที่สุด?",
          o: [
            "เปลี่ยนเป็นห่วงอนามัยทองแดง ห่วงฮอร์โมน levonorgestrel หรือยาฉีด DMPA",
            "ใช้ยาคุมเดิมต่อได้ไม่มีปฏิกิริยา",
            "เปลี่ยนเป็นยาเม็ดโปรเจสตินอย่างเดียว (desogestrel)",
            "ใช้ยาฝังคุมกำเนิด etonogestrel",
            "ใช้ยาคุมฉุกเฉิน levonorgestrel 1.5 mg หลังมีเพศสัมพันธ์ทุกครั้ง",
          ],
          a: 0,
          r:
            "กลไก: Carbamazepine เป็น potent enzyme inducer (CYP3A4 และ UGT) เร่งการทำลาย ethinylestradiol และ progestin ทำให้ระดับฮอร์โมนลดลง 40–50% ส่งผลให้ยาคุมรวม ยาเม็ดโปรเจสตินอย่างเดียว ยาฝัง และยาคุมฉุกเฉินได้ผลลดลง เกิดการตั้งครรภ์ได้ ฤทธิ์กระตุ้นเอนไซม์ยังคงอยู่ต่อไปอีก ~28 วันหลังหยุด inducer\n\n" +
            "วิธีที่ไม่ถูกกระทบ: ห่วงอนามัยทองแดง (ไม่มีฮอร์โมน), LNG-IUS (ออกฤทธิ์เฉพาะที่มดลูก), DMPA (ขนาดฮอร์โมนสูงพอ ฉีดทุก 12 สัปดาห์โดยไม่ต้องปรับ) — FSRH แนะนำเป็นทางเลือกแรก\n\n" +
            "เรื่องการตั้งครรภ์: carbamazepine เองเป็น teratogen (neural tube defects ~1%, facial cleft) ควรให้ folic acid และวางแผนการตั้งครรภ์ร่วมกับแพทย์; ถ้าต้องใช้ยาคุมฉุกเฉินขณะใช้ inducer ให้ใส่ห่วงทองแดง หรือใช้ levonorgestrel ขนาด 3 mg\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: enzyme inducer อื่นที่มีปฏิกิริยาเดียวกัน: phenytoin, phenobarbital, oxcarbazepine (ขนาด >1,200 mg), topiramate (>200 mg), rifampicin, efavirenz, St John's wort; ทิศทางตรงข้าม — estrogen ลดระดับ lamotrigine ได้มาก",
          w: [
            "ถูก",
            "Carbamazepine ลดประสิทธิภาพยาคุมอย่างชัดเจน",
            "ถูกลดประสิทธิภาพจาก enzyme induction เช่นกัน",
            "ระดับฮอร์โมนลดลงจาก enzyme induction ไม่น่าเชื่อถือพอ",
            "ยาคุมฉุกเฉินไม่ใช่วิธีคุมกำเนิดประจำ และถูกลดประสิทธิภาพด้วย",
          ],
          k: "Enzyme inducer (carbamazepine, phenytoin, rifampicin) + hormonal contraception → ใช้ Cu-IUD, LNG-IUS หรือ DMPA; ผลอยู่ต่อ 28 วันหลังหยุด",
        },
      ],
    },
  ],
};
