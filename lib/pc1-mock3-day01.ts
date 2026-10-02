import type { Pc1MockItem } from "@/lib/pc1-mock-builder";

// PC1 Mock Set 3 — ข้อใหม่ชุดที่ 1: ไต/อิเล็กโทรไลต์ (10) + ต่อมไร้ท่อ (10)
// ใช้ชื่อยา/รูปแบบยาที่มีใช้ในประเทศไทยเป็นหลัก และอธิบายเหตุผลเชิงลึกสำหรับเภสัชกร

export const MOCK3_DAY01: Record<string, Pc1MockItem[]> = {
  renal: [
    {
      title: "Hypercalcemia of malignancy",
      base:
        "หญิงไทยอายุ 62 ปี น้ำหนัก 50 kg เป็นมะเร็งเต้านมแพร่กระจายไปกระดูก มาด้วยสับสน ปัสสาวะบ่อย กระหายน้ำ ท้องผูก 5 วัน. " +
        "ยาเดิม: hydrochlorothiazide 25 mg OD (ความดันโลหิตสูง), calcium carbonate 1,000 mg/วัน และ calcitriol 0.25 mcg/วัน (ซื้อทานเองเพื่อบำรุงกระดูก). " +
        "ตรวจร่างกาย: BP 100/60 mmHg, HR 108, ปากแห้ง. Lab: Ca 14.2 mg/dL, albumin 2.8 g/dL, phosphate 2.4 mg/dL, SCr 1.4 mg/dL (เดิม 0.8), intact PTH 6 pg/mL (ต่ำ)",
      ref: "Endocrine Society Clinical Practice Guideline: Treatment of Hypercalcemia of Malignancy in Adults 2023; Zoledronic acid (Zometa) prescribing information; Denosumab (Xgeva) prescribing information",
      qs: [
        {
          d: "easy",
          p: "Corrected calcium ของผู้ป่วยรายนี้มีค่าใกล้เคียงข้อใดที่สุด?",
          o: ["13.2 mg/dL", "14.2 mg/dL", "15.2 mg/dL", "16.0 mg/dL", "17.2 mg/dL"],
          a: 2,
          r:
            "หลักการ: calcium ในเลือดประมาณ 40% จับกับ albumin ส่วนที่ออกฤทธิ์คือ ionized calcium เมื่อ albumin ต่ำ (พบบ่อยในผู้ป่วยมะเร็งที่ขาดอาหาร) ค่า total calcium จะต่ำกว่าความเป็นจริง จึงต้องแก้ค่าตาม albumin\n\n" +
            "สูตร: corrected Ca = measured Ca + 0.8 × (4.0 − albumin)\n" +
            "แทนค่า: 14.2 + 0.8 × (4.0 − 2.8) = 14.2 + 0.8 × 1.2 = 14.2 + 0.96 = 15.16 ≈ 15.2 mg/dL\n\n" +
            "การแปลผล: ระดับความรุนแรงของ hypercalcemia — mild 10.5–11.9, moderate 12.0–13.9, severe 14.0 mg/dL ขึ้นไป ผู้ป่วยรายนี้เป็น severe hypercalcemia ร่วมกับอาการทางระบบประสาท (สับสน) และไตบาดเจ็บเฉียบพลัน ต้องรักษาเร่งด่วน\n\n" +
            "กลไกของ hypercalcemia ในรายนี้: PTH ต่ำแสดงว่าไม่ได้เกิดจาก primary hyperparathyroidism แต่เกิดจากมะเร็ง (มะเร็งเต้านมที่แพร่ไปกระดูกทำให้เกิด local osteolysis และอาจหลั่ง PTH-related peptide) ร่วมกับปัจจัยจากยา: thiazide ลดการขับ calcium ทางไต, calcium carbonate และ calcitriol เพิ่มการดูดซึม calcium จากลำไส้\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ถ้าโรงพยาบาลวัด ionized calcium ได้ ควรใช้ค่า ionized โดยตรงเพราะแม่นยำกว่าสูตรแก้ค่า โดยเฉพาะในผู้ป่วยวิกฤตหรือ albumin ต่ำมาก",
          w: [
            "ต่ำเกินไป เป็นการลบค่าแก้แทนการบวก",
            "เป็นค่าที่วัดได้ซึ่งยังไม่ได้แก้ตาม albumin ทำให้ประเมินความรุนแรงต่ำกว่าความจริง",
            "ถูก — 14.2 + 0.8 × (4.0 − 2.8) = 15.16 ≈ 15.2 mg/dL",
            "สูงเกินไป อาจใช้ตัวคูณผิด",
            "สูงเกินไป อาจใช้ตัวคูณ 2.5 ซึ่งไม่ใช่สูตรสำหรับ mg/dL",
          ],
          c: ["Corrected Ca = Ca + 0.8 × (4.0 − albumin)", "= 14.2 + 0.8 × (4.0 − 2.8)", "= 14.2 + 0.96 = 15.16 ≈ 15.2 mg/dL"],
          k: "Corrected Ca = Ca + 0.8 × (4 − albumin); ≥14 mg/dL = severe hypercalcemia; PTH ต่ำ → hypercalcemia of malignancy (ไม่ใช่ hyperparathyroidism)",
        },
        {
          d: "medium",
          p: "การจัดการเบื้องต้นที่ควรทำทันทีข้อใดเหมาะสมที่สุด?",
          o: [
            "ให้ 0.9% NaCl IV อัตราเริ่มต้น 200–300 mL/h ปรับให้ปัสสาวะออก 100–150 mL/h และหยุด hydrochlorothiazide, calcium carbonate และ calcitriol",
            "ให้ furosemide 40 mg IV ทันทีเพื่อเร่งขับ calcium ก่อนให้สารน้ำ",
            "ให้ zoledronic acid 4 mg IV เพียงอย่างเดียวโดยไม่ต้องให้สารน้ำ เพราะผู้ป่วยมี AKI",
            "ให้ hydrocortisone 100 mg IV ทุก 6 ชั่วโมงเป็นการรักษาหลัก",
            "หยุดเฉพาะ calcium carbonate และให้ดื่มน้ำมากๆ ที่บ้าน",
          ],
          a: 0,
          r:
            "พยาธิสรีรวิทยา: calcium ที่สูงทำให้ไตเสียความสามารถในการทำปัสสาวะให้เข้มข้น (nephrogenic diabetes insipidus ผ่าน calcium-sensing receptor) ผู้ป่วยจึงปัสสาวะมากและขาดน้ำ เมื่อขาดน้ำ GFR ลดลง การขับ calcium ทางไตลดลง calcium ยิ่งสูงขึ้น เป็นวงจรที่แย่ลงเรื่อยๆ ผู้ป่วยรายนี้มี BP 100/60, HR 108, ปากแห้ง, SCr เพิ่มจาก 0.8 เป็น 1.4 = volume depletion ชัดเจน\n\n" +
            "ขั้นตอนการรักษา severe hypercalcemia: (1) ให้ isotonic saline เป็นอันดับแรก: เริ่ม 200–300 mL/h ปรับให้ปัสสาวะออก 100–150 mL/h การแก้ภาวะขาดน้ำเพิ่ม GFR และการขับ calcium (ลด Ca ได้ประมาณ 1–2 mg/dL) (2) หยุดยาที่เพิ่ม calcium: thiazide (ลดการขับ Ca ที่ distal tubule), calcium supplement, vitamin D และ calcitriol, lithium (3) ให้ calcitonin ร่วมกับ bisphosphonate (zoledronic acid) ซึ่งเป็นการรักษาหลักระยะยาว\n\n" +
            "ทำไม furosemide ไม่ใช่ขั้นแรก: แนวทางปัจจุบันไม่แนะนำ loop diuretic เป็นประจำ เพราะทำให้ขาดน้ำมากขึ้นถ้าให้ก่อนแก้ภาวะขาดน้ำ ใช้เฉพาะเมื่อผู้ป่วยมีน้ำเกิน (เช่น หัวใจล้มเหลวหรือไตวาย) ระหว่างให้สารน้ำ\n\n" +
            "บทบาทของ steroid: ได้ผลเฉพาะ hypercalcemia ที่เกิดจาก calcitriol สูงเกิน เช่น lymphoma, granulomatous disease (sarcoidosis, TB) หรือ vitamin D intoxication ไม่ใช่การรักษาหลักใน solid tumor ที่แพร่ไปกระดูก\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ทบทวนผลิตภัณฑ์เสริมอาหารที่ผู้ป่วยซื้อเอง (calcium, vitamin D, calcitriol, นมแคลเซียมสูง) ซึ่งเป็นสาเหตุร่วมที่พบบ่อยและมักไม่ถูกบันทึกในประวัติยา; ติดตาม K และ Mg ระหว่างให้สารน้ำปริมาณมาก",
          w: [
            "ถูก — แก้ภาวะขาดน้ำด้วย NSS และหยุดยาทุกตัวที่เพิ่ม calcium (thiazide, calcium, calcitriol) เป็นขั้นแรก",
            "Loop diuretic ก่อนแก้ภาวะขาดน้ำทำให้ขาดน้ำและไตแย่ลง ใช้เฉพาะเมื่อมีน้ำเกิน",
            "Zoledronic acid ออกฤทธิ์ช้า 2–4 วัน และต้องให้หลังแก้ภาวะขาดน้ำ เพราะพิษต่อไตสูงขึ้นเมื่อขาดน้ำ",
            "Steroid ได้ผลเฉพาะ hypercalcemia ที่เกิดจาก calcitriol สูง (lymphoma, granuloma, vitamin D toxicity) ไม่ใช่การรักษาหลักในรายนี้",
            "Severe hypercalcemia ร่วมกับสับสนและ AKI ต้องรักษาในโรงพยาบาล การดื่มน้ำเองไม่พอ และยังต้องหยุด thiazide/calcitriol ด้วย",
          ],
          k: "Severe hypercalcemia: NSS 200–300 mL/h (UO 100–150 mL/h) + หยุด thiazide/Ca/vitamin D → calcitonin + zoledronic acid; furosemide เฉพาะเมื่อน้ำเกิน",
        },
        {
          d: "hard",
          p: "หลังให้สารน้ำ 12 ชั่วโมง SCr ลดลงเป็น 1.2 mg/dL (CrCl ประมาณ 40 mL/min) แพทย์จะให้ zoledronic acid สำหรับ hypercalcemia of malignancy ข้อใดเหมาะสมที่สุด?",
          o: [
            "Zoledronic acid 4 mg IV หยดอย่างน้อย 15 นาที โดยไม่ต้องลดขนาด เพราะ SCr ต่ำกว่า 4.5 mg/dL และผู้ป่วยได้สารน้ำเพียงพอแล้ว",
            "Zoledronic acid 4 mg IV push ใน 1 นาที เพื่อให้ออกฤทธิ์เร็ว",
            "ลดขนาด zoledronic acid เป็น 3 mg ตาม CrCl เหมือนการให้ทุก 4 สัปดาห์สำหรับ bone metastasis",
            "Zoledronic acid 8 mg IV เพราะ calcium สูงมาก",
            "เปลี่ยนเป็น alendronate 70 mg รับประทานสัปดาห์ละครั้ง เพื่อหลีกเลี่ยงพิษต่อไต",
          ],
          a: 0,
          r:
            "กลไก: bisphosphonate จับกับ hydroxyapatite ของกระดูก และถูก osteoclast กลืนเข้าไป zoledronic acid (nitrogen-containing bisphosphonate) ยับยั้ง farnesyl pyrophosphate synthase ทำให้ osteoclast ทำงานไม่ได้และตาย ลดการสลายกระดูก ระดับ calcium เริ่มลดใน 2–4 วัน ต่ำสุดใน 4–7 วัน และคงอยู่ได้ 1–4 สัปดาห์\n\n" +
            "ขนาดยาตามข้อบ่งใช้ (ตามฉลาก Zometa): (1) hypercalcemia of malignancy: 4 mg IV หยดอย่างน้อย 15 นาที ไม่ต้องลดขนาดถ้า SCr ต่ำกว่า 4.5 mg/dL (ข้อมูลใน SCr สูงกว่านี้มีจำกัด) และให้ซ้ำได้หลัง 7 วันถ้าไม่ตอบสนอง (2) multiple myeloma และ bone metastasis (ให้ทุก 3–4 สัปดาห์): ต้องลดขนาดตาม CrCl เช่น CrCl 40–49 → 3.3 mg, 30–39 → 3.0 mg และห้ามให้เมื่อ CrCl ต่ำกว่า 30 ความแตกต่างนี้เป็นจุดที่ออกสอบบ่อย\n\n" +
            "ทำไมต้องหยดอย่างน้อย 15 นาที: การให้เร็วเพิ่มความเข้มข้นสูงสุดในไต ทำให้เกิด acute tubular necrosis (การศึกษาพบว่าการหยด 5 นาทีเพิ่ม nephrotoxicity ชัดเจน) ต้องให้หลังแก้ภาวะขาดน้ำ และตรวจ SCr ก่อนให้ยาทุกครั้ง\n\n" +
            "ผลข้างเคียงที่ต้องติดตาม: acute phase reaction (ไข้ ปวดเมื่อยคล้ายไข้หวัด 1–3 วันหลังให้ครั้งแรก รักษาด้วย paracetamol), hypocalcemia, hypophosphatemia, hypomagnesemia, osteonecrosis of the jaw (ONJ) ในการใช้ระยะยาว\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ทางเลือกที่ใช้ในไทยอีกตัวคือ pamidronate 60–90 mg หยดใน 2–4 ชั่วโมง (ถ้าไตเสื่อม หยดช้าลง); bisphosphonate รับประทานดูดซึมได้น้อยมาก (น้อยกว่า 1%) และออกฤทธิ์ช้า ไม่ใช้ใน hypercalcemia เฉียบพลัน; ถ้าไตเสื่อมรุนแรงหรือไม่ตอบสนองต่อ bisphosphonate ใช้ denosumab 120 mg SC แทน",
          w: [
            "ถูก — hypercalcemia of malignancy ใช้ 4 mg หยดอย่างน้อย 15 นาที ไม่ต้องลดขนาดถ้า SCr ต่ำกว่า 4.5 mg/dL และได้สารน้ำเพียงพอแล้ว",
            "การให้เร็วเพิ่มความเข้มข้นสูงสุดในไต ทำให้เกิด acute tubular necrosis ต้องหยดอย่างน้อย 15 นาที",
            "การลดขนาดตาม CrCl ใช้กับการให้ซ้ำทุก 3–4 สัปดาห์ใน myeloma/bone metastasis ไม่ใช่การรักษา hypercalcemia of malignancy",
            "ขนาด 8 mg ไม่ได้ผลดีกว่าและเพิ่มพิษต่อไตชัดเจน ขนาดสูงสุดคือ 4 mg",
            "Bisphosphonate รับประทานดูดซึมน้อยกว่า 1% และออกฤทธิ์ช้า ไม่ใช้ในภาวะฉุกเฉิน",
          ],
          k: "Zoledronic acid สำหรับ HCM: 4 mg IV ≥15 นาที ไม่ปรับถ้า SCr <4.5 (หลังให้สารน้ำ); การให้ทุก 3–4 สัปดาห์ใน bone mets ต้องลดตาม CrCl, ห้ามเมื่อ CrCl <30",
        },
        {
          d: "medium",
          p: "แพทย์สั่ง calcitonin 4 IU/kg SC ทุก 12 ชั่วโมง ร่วมกับ zoledronic acid เหตุผลและข้อจำกัดของ calcitonin ข้อใดถูกต้องที่สุด?",
          o: [
            "Calcitonin ลด calcium ได้เร็วภายใน 4–6 ชั่วโมง ช่วยในช่วงที่รอ bisphosphonate ออกฤทธิ์ แต่เกิด tachyphylaxis ภายใน 48 ชั่วโมง จึงใช้เพียง 1–2 วัน",
            "Calcitonin ลด calcium ได้มากกว่า zoledronic acid และใช้ต่อเนื่องได้นานหลายเดือน",
            "Calcitonin ใช้แทน NSS ได้ในผู้ป่วยที่มี AKI",
            "Calcitonin ทำงานโดยจับ calcium ในเลือดโดยตรงเหมือน chelating agent",
            "Calcitonin ชนิดพ่นจมูกให้ผลเทียบเท่าชนิดฉีดในการรักษา hypercalcemia เฉียบพลัน",
          ],
          a: 0,
          r:
            "กลไก: calcitonin ออกฤทธิ์ที่ calcitonin receptor บน osteoclast ยับยั้งการสลายกระดูก และเพิ่มการขับ calcium ทางไต ลด calcium ได้ประมาณ 1–2 mg/dL ภายใน 4–6 ชั่วโมง ซึ่งเร็วที่สุดในบรรดายาที่ใช้\n\n" +
            "บทบาท: ใช้ร่วมกับ NSS และ bisphosphonate ในผู้ป่วย severe hypercalcemia (14 mg/dL ขึ้นไป) หรือมีอาการ เพื่อลด calcium เร็วในช่วง 48 ชั่วโมงแรกที่รอ bisphosphonate ออกฤทธิ์ (zoledronic acid ใช้เวลา 2–4 วัน)\n\n" +
            "ข้อจำกัด: (1) tachyphylaxis เกิดภายใน 48–72 ชั่วโมง เนื่องจาก receptor ลดจำนวนลง (downregulation) จึงไม่มีประโยชน์ถ้าใช้นานกว่านี้ (2) ฤทธิ์อ่อน ลด calcium ได้น้อย ใช้เดี่ยวไม่พอ (3) ชนิดพ่นจมูกไม่มีประสิทธิภาพในการรักษา hypercalcemia ใช้เฉพาะ osteoporosis ซึ่งปัจจุบันลดบทบาทลงแล้ว\n\n" +
            "ขนาดยา: 4 IU/kg SC หรือ IM ทุก 12 ชั่วโมง ปรับเพิ่มได้ถึง 6–8 IU/kg ทุก 6 ชั่วโมง ผลข้างเคียง: คลื่นไส้ หน้าแดง ปฏิกิริยาที่ตำแหน่งฉีด แพ้ (calcitonin ที่ใช้คือ salmon calcitonin)\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ยาที่ใช้ใน hypercalcemia เรียงตามความเร็วของการออกฤทธิ์: calcitonin (ชั่วโมง) → NSS (ชั่วโมง-วัน) → bisphosphonate/denosumab (2–4 วัน แต่คงอยู่นาน) → steroid (หลายวัน เฉพาะ calcitriol-mediated); เก็บ calcitonin ในตู้เย็น",
          w: [
            "ถูก — ออกฤทธิ์เร็ว 4–6 ชั่วโมง ใช้ช่วง 48 ชั่วโมงแรก แต่เกิด tachyphylaxis จึงใช้ระยะสั้น",
            "Calcitonin ฤทธิ์อ่อนกว่า bisphosphonate มาก และเกิด tachyphylaxis ใน 48 ชั่วโมง ใช้ระยะยาวไม่ได้",
            "การแก้ภาวะขาดน้ำยังเป็นการรักษาหลักที่ขาดไม่ได้ calcitonin เป็นเพียงยาเสริม",
            "Calcitonin ออกฤทธิ์ผ่าน receptor บน osteoclast และไต ไม่ได้จับ calcium โดยตรง",
            "ชนิดพ่นจมูกไม่ได้ผลในการรักษา hypercalcemia เฉียบพลัน",
          ],
          k: "Calcitonin: ลด Ca เร็วใน 4–6 ชั่วโมง (4 IU/kg SC/IM q12h) ใช้ร่วม NSS + bisphosphonate แค่ 48 ชั่วโมงเพราะ tachyphylaxis; ชนิดพ่นจมูกไม่ได้ผล",
        },
        {
          d: "medium",
          p: "เมื่อ calcium กลับสู่ปกติ แพทย์เริ่ม denosumab 120 mg SC ทุก 4 สัปดาห์เพื่อป้องกัน skeletal-related events คำแนะนำใดเหมาะสมที่สุด?",
          o: [
            "ตรวจ calcium ก่อนฉีดทุกครั้ง ให้ calcium และ vitamin D เสริมเมื่อ calcium ปกติแล้ว และตรวจสุขภาพช่องปากก่อนเริ่มยา",
            "ไม่ต้องตรวจ calcium อีกเพราะ denosumab ไม่ทำให้ calcium ต่ำ",
            "ต้องปรับขนาด denosumab ตาม CrCl เหมือน zoledronic acid",
            "ห้ามให้ calcium และ vitamin D เสริมตลอดชีวิตเพราะเคยมี hypercalcemia",
            "ให้ denosumab ร่วมกับ zoledronic acid ทุก 4 สัปดาห์เพื่อเสริมฤทธิ์",
          ],
          a: 0,
          r:
            "กลไก: denosumab เป็น monoclonal antibody ต่อ RANKL ยับยั้งการสร้างและการทำงานของ osteoclast ได้แรงและรวดเร็ว ลดการสลายกระดูก ไม่ถูกกำจัดทางไต (กำจัดผ่าน reticuloendothelial system) จึงไม่ต้องปรับขนาดตามไต\n\n" +
            "ความเสี่ยงสำคัญ: (1) hypocalcemia ซึ่งพบบ่อยและรุนแรงกว่า bisphosphonate โดยเฉพาะในผู้ที่ CrCl ต่ำกว่า 30 หรือขาด vitamin D (มีรายงานเสียชีวิต) ดังนั้นต้องแก้ hypocalcemia ก่อนเริ่ม ตรวจ calcium ก่อนฉีดแต่ละครั้ง และให้ calcium อย่างน้อย 500 mg + vitamin D อย่างน้อย 400 IU ต่อวันเมื่อ calcium ปกติ (2) osteonecrosis of the jaw (ONJ) พบประมาณ 1–2% ต่อปีในขนาดสำหรับมะเร็ง ต้องตรวจฟันและรักษาฟันที่มีปัญหาก่อนเริ่ม หลีกเลี่ยงการถอนฟันระหว่างใช้ยา (3) atypical femoral fracture (4) rebound vertebral fracture เมื่อหยุดยา (สำคัญในข้อบ่งใช้ osteoporosis)\n\n" +
            "ทำไมไม่ใช้ร่วมกับ bisphosphonate: ทั้งสองยับยั้ง osteoclast ซ้ำซ้อน ไม่เพิ่มประโยชน์ แต่เพิ่มความเสี่ยง hypocalcemia และ ONJ ใช้ตัวใดตัวหนึ่ง\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: แยกผลิตภัณฑ์ denosumab ให้ถูก — Xgeva 120 mg ทุก 4 สัปดาห์ (มะเร็ง) และ Prolia 60 mg ทุก 6 เดือน (osteoporosis); hypercalcemia ที่ผ่านมาเกิดจากมะเร็งและยาที่ผู้ป่วยใช้ ไม่ได้เป็นข้อห้ามการเสริม calcium ขนาดปกติเมื่อได้ยาต้านการสลายกระดูกที่แรง",
          w: [
            "ถูก — ป้องกัน hypocalcemia (ตรวจ Ca ก่อนฉีด เสริม Ca + vitamin D) และป้องกัน ONJ ด้วยการตรวจฟันก่อนเริ่ม",
            "Denosumab ทำให้ hypocalcemia บ่อยและรุนแรงกว่า bisphosphonate ต้องตรวจ calcium เสมอ",
            "Denosumab ไม่ถูกกำจัดทางไต ไม่ต้องปรับขนาด แต่ไตเสื่อมเพิ่มความเสี่ยง hypocalcemia จึงต้องติดตามใกล้ชิดขึ้น",
            "เมื่อได้ denosumab ต้องเสริม calcium และ vitamin D เพื่อป้องกัน hypocalcemia (หลังจาก Ca กลับมาปกติแล้ว)",
            "การใช้ร่วมกันไม่เพิ่มประโยชน์ แต่เพิ่มความเสี่ยง hypocalcemia และ ONJ",
          ],
          k: "Denosumab 120 mg q4wk (Xgeva): ไม่ปรับตามไต แต่เสี่ยง hypocalcemia → ตรวจ Ca ก่อนฉีด + เสริม Ca/vitamin D; ตรวจฟันก่อนเริ่ม (ONJ); ไม่ใช้ร่วม bisphosphonate",
        },
      ],
    },
    {
      title: "Refractory hypokalemia with PPI-associated hypomagnesemia",
      base:
        "ชายไทยอายุ 68 ปี น้ำหนัก 60 kg เป็น GERD ใช้ omeprazole 20 mg BID ต่อเนื่องมา 4 ปี และ HFrEF ใช้ furosemide 40 mg OD, enalapril 5 mg BID. " +
        "มาด้วยอ่อนแรง ตะคริว ใจสั่น มือจีบเกร็ง. Lab: K 2.9 mmol/L, Mg 0.9 mg/dL (ปกติ 1.7–2.4), Ca 7.6 mg/dL, albumin 4.0 g/dL, SCr 1.0 mg/dL. " +
        "ECG: QTc 520 ms มี PVC บ่อย. ได้ KCl IV รวม 60 mmol ใน 12 ชั่วโมง แต่ K ขึ้นเป็นเพียง 3.0 mmol/L",
      ref: "FDA Drug Safety Communication: Low magnesium levels with long-term PPI use (2011); Kraft MD et al. Treatment of electrolyte disorders in adult patients in the ICU, Am J Health-Syst Pharm 2005; UpToDate: Hypomagnesemia",
      qs: [
        {
          d: "medium",
          p: "เหตุผลที่ระดับโพแทสเซียมไม่เพิ่มขึ้นตามที่ควร แม้ได้รับ KCl ไปแล้วจำนวนมาก คือข้อใด?",
          o: [
            "Hypomagnesemia ทำให้ช่อง ROMK ที่ distal nephron ขาดการยับยั้งจาก Mg ภายในเซลล์ K จึงถูกขับทิ้งทางปัสสาวะต่อเนื่อง ต้องแก้ Mg ก่อนหรือพร้อมกัน",
            "KCl ที่ให้ทางหลอดเลือดดำถูกจับโดย albumin จึงไม่เพิ่มระดับ K ในเลือด",
            "Enalapril เพิ่มการขับ K ทางไตอย่างมาก จึงต้องหยุด enalapril",
            "ผู้ป่วยมี hypercalcemia ร่วมซึ่งทำให้ K ไม่เข้าเซลล์",
            "ควรเปลี่ยนเป็น potassium citrate เพราะ KCl ไม่ได้ผลในผู้ป่วยที่ใช้ furosemide",
          ],
          a: 0,
          r:
            "พยาธิสรีรวิทยา: ในเซลล์ principal cell ของ collecting duct, Mg²⁺ ภายในเซลล์จับกับและปิดกั้นช่อง ROMK (renal outer medullary K channel) ไม่ให้ K⁺ ไหลออกสู่ท่อไตมากเกินไป เมื่อ Mg ต่ำ การยับยั้งนี้หายไป K⁺ ถูกขับทิ้งทางปัสสาวะอย่างต่อเนื่อง การให้ K อย่างเดียวจึงไม่ได้ผล (refractory hypokalemia) จนกว่าจะแก้ Mg นอกจากนี้ Mg ต่ำยังลดการทำงานของ Na⁺/K⁺-ATPase ทำให้ K ภายในเซลล์ลดลง\n\n" +
            "ผลต่อ calcium: Mg ต่ำมาก (ต่ำกว่า 1.2 mg/dL) ยับยั้งการหลั่ง PTH และทำให้กระดูกดื้อต่อ PTH เกิด hypocalcemia ร่วมด้วย (ผู้ป่วยรายนี้ Ca 7.6 ทั้งที่ albumin ปกติ และมีมือจีบเกร็ง) ซึ่งจะแก้ไม่ได้จนกว่าจะแก้ Mg เช่นกัน\n\n" +
            "สาเหตุในผู้ป่วยรายนี้: (1) PPI ใช้นาน (มักมากกว่า 1 ปี) ลดการดูดซึม Mg ที่ลำไส้ผ่านช่อง TRPM6/7 (2) loop diuretic เพิ่มการขับ Mg ทางไตที่ thick ascending limb\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: hypokalemia + hypomagnesemia + hypocalcemia ทำให้ QT ยาวและเสี่ยง torsades de pointes ต้องทบทวนยาที่ยืด QT (เช่น ondansetron, domperidone, macrolide, fluoroquinolone, haloperidol) และหลีกเลี่ยงในผู้ป่วยรายนี้",
          w: [
            "ถูก — Mg ต่ำทำให้ ROMK ขาดการยับยั้ง K ถูกขับทิ้งทางไตต่อเนื่อง ต้องแก้ Mg ก่อนหรือพร้อมกับ K",
            "K ไม่ได้ถูกจับโดย albumin อย่างมีนัยสำคัญ ไม่ใช่สาเหตุ",
            "ACEI ลดการขับ K (เพิ่ม K) ไม่ใช่เพิ่มการขับ และ enalapril มีประโยชน์ใน HFrEF",
            "ผู้ป่วยมี hypocalcemia ไม่ใช่ hypercalcemia",
            "Potassium citrate ไม่ได้แก้ปัญหาการขับ K จาก Mg ต่ำ และ citrate ทำให้เลือดเป็นด่าง ซึ่งยิ่งทำให้ K ต่ำ",
          ],
          k: "Hypokalemia ที่ไม่ตอบสนองต่อ K → ตรวจ Mg; Mg ต่ำทำให้ ROMK ขับ K ทิ้งและกด PTH (hypocalcemia) ต้องแก้ Mg ก่อน",
        },
        {
          d: "medium",
          p: "การให้แมกนีเซียมในผู้ป่วยรายนี้ (Mg 0.9 mg/dL, QTc 520 ms, PVC บ่อย, ไตปกติ) ข้อใดเหมาะสมที่สุด?",
          o: [
            "50% MgSO₄ 4 mL (MgSO₄ 2 g) เจือจางใน 0.9% NaCl 100 mL หยดใน 15–60 นาที แล้วตามด้วย MgSO₄ 4–6 g หยดต่อเนื่องใน 12–24 ชั่วโมง พร้อมติดตาม Mg, deep tendon reflex และ BP",
            "Magnesium oxide 250 mg รับประทานวันละ 1 ครั้งเพียงอย่างเดียว",
            "50% MgSO₄ 10 mL ฉีดเข้าหลอดเลือดดำโดยตรงไม่เจือจางภายใน 1 นาที",
            "10% calcium gluconate 10 mL IV แทนการให้แมกนีเซียม เพราะแก้ hypocalcemia ได้",
            "รอให้ K สูงกว่า 3.5 mmol/L ก่อนจึงเริ่มให้แมกนีเซียม",
          ],
          a: 0,
          r:
            "การประเมิน: Mg 0.9 mg/dL ร่วมกับ QTc ยาวและ PVC บ่อย = severe symptomatic hypomagnesemia ต้องให้ทางหลอดเลือดดำ\n\n" +
            "การคำนวณ: 50% MgSO₄ มี MgSO₄ 500 mg/mL = Mg 4 mEq/mL (MgSO₄ 1 g = Mg 8.1 mEq หรือ 4 mmol); 2 g = 4 mL ของ 50% MgSO₄\n\n" +
            "แนวทางการให้: (1) มีอาการรุนแรงหรือหัวใจเต้นผิดจังหวะ: MgSO₄ 1–2 g IV ใน 5–15 นาที (สำหรับ torsades de pointes ให้ใน 2–5 นาทีได้) หรือหยดใน 15–60 นาทีถ้าไม่ฉุกเฉินมาก (2) ตามด้วย 4–6 g/วัน หยดต่อเนื่องใน 12–24 ชั่วโมง ติดต่อกัน 3–5 วัน เพราะ Mg ที่ให้เร็วจะถูกขับออกทางไตประมาณครึ่งหนึ่ง และต้องใช้เวลาเติมเต็ม Mg ภายในเซลล์ (ระดับในเลือดอาจปกติก่อนที่ Mg ในร่างกายจะเต็ม) (3) ให้ K ต่อไปพร้อมกัน\n\n" +
            "ข้อควรระวัง: (1) ไตเสื่อม (CrCl ต่ำกว่า 30) ลดขนาดลง 50% และติดตามใกล้ชิด (2) พิษจาก Mg สูง: deep tendon reflex หายไป (Mg ประมาณ 7–10 mg/dL), BP ต่ำ, หายใจช้า, หัวใจหยุดเต้น ยาแก้คือ calcium gluconate (3) 50% MgSO₄ เป็นสารละลายเข้มข้น (high-alert medication) ต้องเจือจางเป็น 20% หรือน้อยกว่าก่อนให้ทางหลอดเลือดดำ\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: magnesium oxide ชนิดรับประทานใช้หลังจากแก้ภาวะเฉียบพลันแล้ว หรือกรณีไม่มีอาการ แต่ดูดซึมได้น้อยและทำให้ท้องเสีย (ยิ่งเสีย Mg) จึงต้องแบ่งให้หลายครั้งต่อวัน",
          w: [
            "ถูก — MgSO₄ 2 g IV เจือจาง หยดช้า แล้วหยดต่อเนื่องเพื่อเติมเต็ม Mg ในร่างกาย พร้อมติดตามพิษจาก Mg สูง",
            "Mg รับประทานดูดซึมน้อยและออกฤทธิ์ช้า ไม่เหมาะกับภาวะรุนแรงที่มีหัวใจเต้นผิดจังหวะ",
            "50% MgSO₄ เข้มข้นสูง ห้ามฉีดโดยตรงไม่เจือจาง และ 10 mL (5 g) เร็วเกินไป เสี่ยง BP ต่ำและหัวใจหยุดเต้น",
            "Calcium ไม่ได้แก้ Mg ต่ำ และ hypocalcemia จะไม่ดีขึ้นจนกว่าจะแก้ Mg",
            "ต้องแก้ Mg ก่อนหรือพร้อมกัน เพราะถ้า Mg ยังต่ำ K จะไม่ขึ้น",
          ],
          k: "Severe hypoMg + arrhythmia: MgSO₄ 1–2 g IV (เจือจาง, 50% = 4 mEq/mL) แล้ว 4–6 g/วัน หยดต่อ 3–5 วัน; CrCl <30 ลดขนาด 50%; ติดตาม reflex/BP/RR",
        },
        {
          d: "easy",
          p: "เมื่ออาการดีขึ้นแล้ว การจัดการระยะยาวเรื่อง omeprazole ข้อใดเหมาะสมที่สุด?",
          o: [
            "ทบทวนข้อบ่งใช้ ลด omeprazole เป็นขนาดต่ำสุดที่คุมอาการได้หรือเปลี่ยนเป็น famotidine และติดตามระดับ Mg เป็นระยะ",
            "เปลี่ยน omeprazole เป็น esomeprazole 40 mg BID เพราะไม่ทำให้ Mg ต่ำ",
            "ใช้ omeprazole ขนาดเดิมต่อและให้ magnesium oxide เสริมโดยไม่ต้องทบทวนข้อบ่งใช้",
            "เพิ่ม furosemide เพื่อช่วยให้ Mg สูงขึ้น",
            "หยุด enalapril เพราะเป็นสาเหตุของ hypomagnesemia",
          ],
          a: 0,
          r:
            "หลักฐาน: FDA ออกคำเตือน (2011) ว่า PPI ที่ใช้นานกว่า 1 ปี (บางรายเร็วกว่านั้น) ทำให้เกิด hypomagnesemia ซึ่งอาจรุนแรงจนเกิดชัก หัวใจเต้นผิดจังหวะ และ tetany เป็น class effect ของ PPI ทุกตัว (omeprazole, esomeprazole, lansoprazole, pantoprazole, rabeprazole) กลไกคือ PPI ลดการดูดซึม Mg แบบ active transport ผ่าน TRPM6/7 ในลำไส้ การเสริม Mg อย่างเดียวในบางรายไม่พอ\n\n" +
            "การจัดการ: (1) ทบทวนข้อบ่งใช้ — GERD ที่คุมอาการได้แล้วควรลดเป็นขนาดต่ำสุดที่ได้ผล หรือใช้เมื่อมีอาการ (on-demand) (2) ถ้าต้องหยุด PPI ให้ลดขนาดลงทีละน้อยเพื่อป้องกัน rebound acid hypersecretion (3) เปลี่ยนเป็น H2-receptor antagonist (famotidine 20 mg BID ในบัญชียาหลักแห่งชาติ) ซึ่งไม่ทำให้ Mg ต่ำ (4) Mg มักกลับสู่ปกติภายใน 1–2 สัปดาห์หลังหยุด PPI และกลับต่ำอีกเมื่อเริ่มใช้ใหม่ (ช่วยยืนยันว่าเกิดจาก PPI)\n\n" +
            "การติดตาม: ตรวจ Mg ก่อนเริ่ม PPI และเป็นระยะในผู้ที่จะใช้นาน โดยเฉพาะผู้ที่ใช้ diuretic, digoxin (Mg ต่ำเพิ่มพิษของ digoxin) หรือยาที่ยืด QT\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ผลเสียอื่นของการใช้ PPI นาน: ขาดวิตามิน B12, กระดูกหักเพิ่มขึ้น, การติดเชื้อ C. difficile, ปอดอักเสบ, interstitial nephritis; การทบทวนข้อบ่งใช้ PPI (deprescribing) เป็นบทบาทสำคัญของเภสัชกร",
          w: [
            "ถูก — ทบทวนข้อบ่งใช้ ลดขนาดหรือเปลี่ยนเป็น H2RA และติดตาม Mg เพราะ hypomagnesemia เป็น class effect ของ PPI",
            "Hypomagnesemia เป็น class effect ของ PPI ทุกตัว esomeprazole ขนาดสูงไม่ช่วย",
            "ควรทบทวนข้อบ่งใช้และลดขนาด PPI ก่อน การเสริม Mg อย่างเดียวในบางรายไม่พอ และ Mg รับประทานทำให้ท้องเสีย",
            "Loop diuretic เพิ่มการขับ Mg ทางไต ทำให้ Mg ต่ำลงอีก",
            "ACEI ไม่ใช่สาเหตุของ Mg ต่ำ และมีประโยชน์ลดการตายใน HFrEF",
          ],
          k: "PPI ใช้นาน >1 ปี → hypomagnesemia (class effect); ทบทวนข้อบ่งใช้ ลดขนาด/เปลี่ยนเป็น H2RA (famotidine); ตรวจ Mg ในผู้ใช้ diuretic/digoxin",
        },
      ],
    },
    {
      ref: "Acyclovir prescribing information; Perazella MA. Crystal-induced acute renal failure, Am J Med 1999; IDSA Guideline: Management of Encephalitis 2008",
      qs: [
        {
          d: "medium",
          p:
            "ชายไทยอายุ 45 ปี น้ำหนัก 70 kg วินิจฉัย HSV encephalitis ได้ acyclovir 700 mg IV ทุก 8 ชั่วโมง (10 mg/kg) หยดใน 30 นาที ได้สารน้ำน้อยเพราะกลัวสมองบวม. " +
            "วันที่ 3 SCr เพิ่มจาก 0.8 เป็น 2.0 mg/dL (CrCl ประมาณ 45 mL/min) ปัสสาวะพบผลึกรูปเข็ม. การจัดการข้อใดเหมาะสมที่สุด?",
          o: [
            "ให้สารน้ำอย่างเพียงพอ หยด acyclovir อย่างน้อย 1 ชั่วโมง และปรับขนาดตาม CrCl เป็น 10 mg/kg ทุก 12 ชั่วโมง โดยรักษาต่อจนครบ 14–21 วัน",
            "หยุด acyclovir ทันทีและเปลี่ยนเป็น valacyclovir 1 g รับประทาน วันละ 3 ครั้ง",
            "ลดขนาด acyclovir เป็น 5 mg/kg ทุก 8 ชั่วโมงโดยไม่ต้องให้สารน้ำเพิ่ม",
            "ให้ furosemide 80 mg IV เพื่อชะล้างผลึกออกจากท่อไต",
            "หยุด acyclovir และเปลี่ยนเป็น ganciclovir IV เพราะไม่เป็นพิษต่อไต",
          ],
          a: 0,
          r:
            "กลไก: acyclovir ละลายน้ำได้น้อย (ประมาณ 2.5 mg/mL ที่ 37 °C) และถูกขับออกทางไตในรูปเดิมประมาณ 60–90% ผ่านทั้ง glomerular filtration และ tubular secretion เมื่อความเข้มข้นในท่อไตสูง (ให้ยาเร็ว ขนาดสูง หรือขาดน้ำ) ยาจะตกผลึกรูปเข็มในท่อไตส่วนปลาย อุดท่อไตและเกิด acute kidney injury ภายใน 24–48 ชั่วโมง ซึ่งพบได้ 12–48% ของผู้ที่ได้ยาขนาดสูงโดยไม่ได้รับสารน้ำพอ\n\n" +
            "การป้องกันและรักษา: (1) ให้สารน้ำให้เพียงพอเพื่อให้ปัสสาวะออกมาก (เป้าหมายประมาณ 1 mL/kg/h ขึ้นไป) ในผู้ป่วย encephalitis ใช้สารน้ำ isotonic และหลีกเลี่ยงการให้น้อยเกินไป (2) หยดยาอย่างน้อย 1 ชั่วโมง ห้ามให้ bolus (3) ปรับขนาดตามไต: CrCl มากกว่า 50 → 10 mg/kg ทุก 8 ชั่วโมง; 25–50 → ทุก 12 ชั่วโมง; 10–25 → ทุก 24 ชั่วโมง; ต่ำกว่า 10 → 5 mg/kg ทุก 24 ชั่วโมง (4) ใช้น้ำหนักในอุดมคติ (IBW) ในผู้ป่วยอ้วน\n\n" +
            "ทำไมไม่เปลี่ยนเป็นยารับประทาน: HSV encephalitis มีอัตราตายสูงถ้าไม่รักษาอย่างเพียงพอ ต้องให้ acyclovir ทางหลอดเลือดดำ 14–21 วัน valacyclovir รับประทานยังไม่เป็นมาตรฐานสำหรับ encephalitis และไม่ได้ลดความเสี่ยงต่อไต (เพราะถูกเปลี่ยนเป็น acyclovir)\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: AKI จาก crystal nephropathy ส่วนใหญ่หายได้เมื่อปรับการให้ยาและให้สารน้ำ; acyclovir ระดับสูงในผู้ป่วยไตเสื่อมทำให้เกิดพิษต่อระบบประสาท (สับสน ประสาทหลอน สั่น) ซึ่งอาจแยกยากจากอาการ encephalitis เอง; ยาอื่นที่ทำให้เกิด crystal nephropathy: methotrexate ขนาดสูง, sulfadiazine, indinavir, ciprofloxacin ในปัสสาวะที่เป็นด่าง",
          w: [
            "ถูก — แก้สาเหตุ (ขาดน้ำ หยดเร็ว) ปรับขนาดตาม CrCl 25–50 เป็นทุก 12 ชั่วโมง และรักษาต่อจนครบ",
            "Valacyclovir รับประทานไม่ใช่มาตรฐานสำหรับ HSV encephalitis และยังถูกเปลี่ยนเป็น acyclovir จึงเป็นพิษต่อไตได้เหมือนกัน",
            "การลดขนาดโดยไม่แก้ภาวะขาดน้ำไม่ได้แก้สาเหตุของการตกผลึก และ 5 mg/kg ไม่ใช่ขนาดที่ถูกต้องสำหรับ CrCl 45",
            "Furosemide ทำให้ขาดน้ำมากขึ้นและปัสสาวะเป็นกรด ยิ่งทำให้ตกผลึก",
            "Ganciclovir ไม่ใช่ยามาตรฐานสำหรับ HSV และเป็นพิษต่อไขกระดูก ต้องปรับตามไตเช่นกัน",
          ],
          k: "Acyclovir IV: crystal nephropathy เมื่อขาดน้ำ/ให้เร็ว/ขนาดสูง → ให้สารน้ำพอ หยด ≥1 ชั่วโมง ปรับตาม CrCl (25–50: q12h); รักษา HSV encephalitis ต่อ 14–21 วัน",
        },
      ],
    },
    {
      ref: "Lithium carbonate prescribing information; Garofeanu CG et al. Causes of reversible nephrogenic diabetes insipidus, Am J Kidney Dis 2005; Kortenoeven ML et al. Amiloride blocks lithium entry, Kidney Int 2009",
      qs: [
        {
          d: "hard",
          p:
            "หญิงไทยอายุ 50 ปี เป็น bipolar I disorder คุมอาการได้ดีด้วย lithium carbonate 300 mg วันละ 3 ครั้งมานาน 12 ปี ระดับ lithium 0.7 mmol/L. " +
            "ปัจจุบันปัสสาวะวันละ 5–6 ลิตร ตื่นมาปัสสาวะกลางคืนหลายครั้ง Na 147 mmol/L, urine osmolality 150 mOsm/kg, ทดสอบด้วย desmopressin แล้ว urine osmolality ไม่เพิ่มขึ้น. " +
            "จิตแพทย์ต้องการให้ใช้ lithium ต่อเพราะยาอื่นเคยไม่ได้ผล ยาใดเหมาะสมที่สุดในการลดปัสสาวะ?",
          o: [
            "Amiloride 5 mg OD (ปรับเพิ่มได้ถึง 10 mg BID) พร้อมติดตามระดับ lithium, K และ Na",
            "Hydrochlorothiazide 50 mg OD โดยไม่ต้องปรับขนาด lithium",
            "Desmopressin 0.2 mg รับประทาน วันละ 3 ครั้ง",
            "ให้ดื่มน้ำน้อยลงไม่เกิน 1.5 ลิตรต่อวัน",
            "Furosemide 40 mg OD เพื่อลดปริมาณสารน้ำในร่างกาย",
          ],
          a: 0,
          r:
            "การวินิจฉัย: lithium-induced nephrogenic diabetes insipidus (NDI) พบได้ 20–40% ของผู้ที่ใช้ lithium ระยะยาว ลักษณะคือปัสสาวะมาก ปัสสาวะเจือจาง (urine osmolality ต่ำกว่า 300) Na สูงเล็กน้อย และไม่ตอบสนองต่อ desmopressin (ต่างจาก central DI)\n\n" +
            "กลไก: lithium เข้าสู่ principal cell ของ collecting duct ผ่าน epithelial sodium channel (ENaC) แล้วสะสมภายในเซลล์ ยับยั้ง glycogen synthase kinase-3β และลดการสร้าง aquaporin-2 ทำให้ท่อไตตอบสนองต่อ ADH ลดลง น้ำจึงไม่ถูกดูดกลับ\n\n" +
            "ทำไม amiloride ได้ผล: amiloride ปิดกั้น ENaC จึงลดการที่ lithium เข้าไปสะสมใน principal cell การสร้าง aquaporin-2 ฟื้นกลับบางส่วน ลดปัสสาวะได้ และไม่เพิ่มระดับ lithium อย่างมีนัยสำคัญ (ต่างจาก thiazide) ขนาดที่ใช้ 5–10 mg/วัน ปรับได้ถึง 10 mg BID (ในประเทศไทยมีในรูปแบบผสม amiloride/HCTZ เป็นส่วนใหญ่ ถ้าไม่มี amiloride เดี่ยวต้องระวังส่วนประกอบ HCTZ) ต้องติดตาม K เพราะเสี่ยง hyperkalemia โดยเฉพาะถ้าใช้ ACEI/ARB\n\n" +
            "ทำไม thiazide ต้องระวัง: thiazide ลดปัสสาวะใน NDI ได้ (ทำให้ขาดน้ำเล็กน้อย เพิ่มการดูดกลับ Na และน้ำที่ proximal tubule) แต่ก็เพิ่มการดูดกลับ lithium ที่ proximal tubule ทำให้ระดับ lithium สูงขึ้น 25–40% ถ้าจำเป็นต้องใช้ ต้องลดขนาด lithium และตรวจระดับใน 5–7 วัน\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ผู้ป่วยที่ใช้ lithium ต้องดื่มน้ำให้พอ ห้ามจำกัดน้ำ (จะเกิด hypernatremia และ lithium toxicity); ยาที่เพิ่มระดับ lithium: thiazide, ACEI/ARB, NSAIDs, การขาดน้ำ, อาหารเค็มน้อย; ตรวจ SCr, TSH และ calcium ทุก 6–12 เดือน (lithium ทำให้ hypothyroidism และ hyperparathyroidism ได้)",
          w: [
            "ถูก — amiloride ปิดกั้น ENaC ลดการสะสมของ lithium ใน principal cell ลดปัสสาวะได้ โดยไม่เพิ่มระดับ lithium มาก",
            "Thiazide ลดปัสสาวะได้แต่เพิ่มระดับ lithium 25–40% ถ้าใช้โดยไม่ปรับขนาด lithium เสี่ยงพิษ",
            "NDI ไม่ตอบสนองต่อ desmopressin (ทดสอบแล้วว่า urine osmolality ไม่เพิ่ม)",
            "การจำกัดน้ำในผู้ป่วย NDI ทำให้ hypernatremia และระดับ lithium สูงจนเป็นพิษ",
            "Loop diuretic ทำให้ขาดน้ำ เพิ่มระดับ lithium และไม่ได้แก้ NDI",
          ],
          k: "Lithium-induced NDI: ไม่ตอบสนองต่อ desmopressin; ใช้ amiloride (ปิด ENaC ลด lithium เข้าเซลล์); thiazide เพิ่มระดับ lithium; ห้ามจำกัดน้ำ",
        },
      ],
    },
  ],
  endocrine: [
    {
      title: "Sulfonylurea-induced hypoglycemia in an older adult",
      base:
        "หญิงไทยอายุ 76 ปี น้ำหนัก 48 kg เป็น T2DM 15 ปี ใช้ glibenclamide 5 mg BID และ metformin 500 mg BID, HbA1c ล่าสุด 6.4%, eGFR 35 mL/min/1.73m². " +
        "ช่วง 3 วันนี้เจ็บคอ กินข้าวได้น้อย. บ่ายวันนี้ลูกพบว่าซึม เหงื่อแตก พูดไม่รู้เรื่อง จึงนำส่งโรงพยาบาล. DTX 38 mg/dL, BP 140/80 mmHg, กลืนไม่ได้",
      ref: "ADA Standards of Care in Diabetes 2025 (Section 6 Glycemic Goals and Hypoglycemia; Section 13 Older Adults); แนวทางเวชปฏิบัติสำหรับโรคเบาหวาน 2566 (สมาคมโรคเบาหวานแห่งประเทศไทย); Glatstein M et al. Octreotide for sulfonylurea-induced hypoglycemia, Ann Pharmacother 2012",
      qs: [
        {
          d: "easy",
          p: "การรักษาภาวะน้ำตาลต่ำในห้องฉุกเฉินทันทีข้อใดเหมาะสมที่สุด?",
          o: [
            "50% glucose 50 mL IV ทันที แล้วตามด้วย 10% dextrose หยดต่อเนื่อง และตรวจ DTX ทุก 1 ชั่วโมง",
            "ให้ดื่มน้ำส้มคั้น 1 แก้ว แล้วตรวจ DTX ซ้ำใน 15 นาที",
            "งดยาเบาหวานแล้วสังเกตอาการ เพราะ DTX จะกลับมาเองเมื่อยาหมดฤทธิ์",
            "5% dextrose 100 mL IV หยดใน 1 ชั่วโมง",
            "Regular insulin 2 units IV เพื่อช่วยให้น้ำตาลเข้าเซลล์",
          ],
          a: 0,
          r:
            "การประเมิน: DTX 38 mg/dL ร่วมกับซึมและสับสน = level 3 (severe) hypoglycemia คือมีการเปลี่ยนแปลงทางสติที่ต้องให้ผู้อื่นช่วยรักษา ผู้ป่วยกลืนไม่ได้ จึงห้ามให้ทางปากเพราะเสี่ยงสำลัก\n\n" +
            "การรักษา: (1) 50% glucose 50 mL IV (glucose 25 g) ทางหลอดเลือดดำใหญ่ (ระคายหลอดเลือดมาก ถ้าเส้นเล็กอาจเปลี่ยนเป็น 10% dextrose 150–250 mL) ออกฤทธิ์ในไม่กี่นาที (2) ตามด้วย 10% dextrose หยดต่อเนื่อง (เช่น 50–100 mL/h) เพราะ sulfonylurea ยังกระตุ้นการหลั่ง insulin ต่อไปหลายชั่วโมง ถ้าให้ glucose ครั้งเดียวน้ำตาลจะต่ำซ้ำ (3) ตรวจ DTX ทุก 1 ชั่วโมงจนคงที่ (4) เมื่อตื่นรู้ตัวและกลืนได้ ให้กินอาหารที่มีคาร์โบไฮเดรต\n\n" +
            "ทางเลือกเมื่อเปิดเส้นเลือดไม่ได้: glucagon 1 mg IM/SC (ในไทยมีจำกัด) แต่ผลอาจน้อยในผู้สูงอายุที่ขาดอาหาร (glycogen ในตับน้อย) และ glucagon ยังกระตุ้นการหลั่ง insulin ในผู้ที่ใช้ sulfonylurea ได้ด้วย\n\n" +
            "หลัก 15-15 (rule of 15): ใช้กับผู้ที่รู้ตัวดีและกลืนได้: ให้ glucose 15–20 g (เช่น น้ำผลไม้ 150–200 mL, น้ำตาล 3 ช้อนชา) ตรวจซ้ำใน 15 นาที\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: insulin ใช้รักษาน้ำตาลสูง ไม่ใช่น้ำตาลต่ำ; ผู้สูงอายุอาจไม่มีอาการเตือน (เหงื่อออก ใจสั่น) จนน้ำตาลต่ำรุนแรง (hypoglycemia unawareness) โดยเฉพาะถ้าใช้ beta-blocker",
          w: [
            "ถูก — 50% glucose 50 mL IV แล้วตามด้วย 10% dextrose หยดต่อเนื่อง และตรวจ DTX ทุกชั่วโมง เพราะ sulfonylurea ออกฤทธิ์นาน",
            "ผู้ป่วยซึมและกลืนไม่ได้ ห้ามให้ทางปากเพราะเสี่ยงสำลัก หลัก 15-15 ใช้กับผู้ที่รู้ตัวดี",
            "Glibenclamide ออกฤทธิ์นานมากในผู้ที่ไตเสื่อม การรอโดยไม่รักษาทำให้สมองเสียหายถาวรหรือเสียชีวิต",
            "5% dextrose 100 mL มี glucose เพียง 5 g และให้ช้าเกินไปสำหรับภาวะรุนแรง",
            "Insulin ทำให้น้ำตาลต่ำลงอีก ห้ามให้",
          ],
          k: "Severe hypoglycemia (ซึม กลืนไม่ได้): 50% glucose 50 mL IV + 10% dextrose หยดต่อ + DTX ทุก 1 ชั่วโมง; รู้ตัวดีใช้หลัก 15-15",
        },
        {
          d: "medium",
          p: "เหตุผลที่ผู้ป่วยรายนี้ต้องนอนโรงพยาบาลเพื่อสังเกตอาการอย่างน้อย 24–72 ชั่วโมง แม้รู้ตัวดีแล้ว คือข้อใด?",
          o: [
            "Glibenclamide ออกฤทธิ์นานและมี active metabolite ที่ขับทางไต ซึ่งสะสมในผู้ที่ eGFR ต่ำ ทำให้น้ำตาลต่ำซ้ำได้นานหลายวัน",
            "Metformin เป็นสาเหตุหลักของน้ำตาลต่ำในผู้ป่วยรายนี้และมีครึ่งชีวิตยาวมาก",
            "50% glucose ทำให้เกิด rebound hyperglycemia ที่ต้องรักษาด้วย insulin",
            "ผู้ป่วยต้องรอให้ HbA1c ลดลงก่อนจึงจะกลับบ้านได้",
            "Glibenclamide ถูกกำจัดทางตับเท่านั้น จึงไม่เกี่ยวข้องกับการทำงานของไต",
          ],
          a: 0,
          r:
            "เภสัชจลนศาสตร์ของ glibenclamide (glyburide): ครึ่งชีวิตของยาประมาณ 10 ชั่วโมง แต่ฤทธิ์ลดน้ำตาลอยู่ได้นานถึง 24 ชั่วโมงขึ้นไป ยาถูกเปลี่ยนที่ตับเป็น metabolite (4-trans-hydroxy และ 3-cis-hydroxy glibenclamide) ที่ยังมีฤทธิ์ลดน้ำตาล และขับออกทางไตประมาณ 50% เมื่อ eGFR ต่ำ metabolite เหล่านี้สะสม ทำให้น้ำตาลต่ำซ้ำได้นาน 24–72 ชั่วโมงหรือนานกว่า นอกจากนี้ glibenclamide สะสมอยู่ใน beta cell ของตับอ่อน จึงกระตุ้นการหลั่ง insulin ต่อไปแม้ระดับยาในเลือดลดลง\n\n" +
            "ปัจจัยเสี่ยงในผู้ป่วยรายนี้: อายุ 76 ปี, น้ำหนักน้อย, eGFR 35, กินอาหารได้น้อยจากการเจ็บป่วย, HbA1c 6.4% (คุมเข้มเกินไปสำหรับผู้สูงอายุ) และใช้ sulfonylurea ที่ออกฤทธิ์นานที่สุด\n\n" +
            "ทำไม metformin ไม่ใช่สาเหตุ: metformin เดี่ยวไม่ทำให้น้ำตาลต่ำเพราะไม่ได้กระตุ้นการหลั่ง insulin (ลดการสร้าง glucose ที่ตับและเพิ่มความไวต่อ insulin)\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: เกณฑ์ Beers 2023 แนะนำหลีกเลี่ยง sulfonylurea ทั้งหมดในผู้สูงอายุถ้าเป็นไปได้ โดยเฉพาะ glibenclamide และ glimepiride ที่ออกฤทธิ์นาน ถ้าจำเป็นต้องใช้ ให้เลือก gliclazide หรือ glipizide ซึ่งออกฤทธิ์สั้นกว่าและ metabolite ไม่มีฤทธิ์; ผู้ป่วยที่ได้ glibenclamide เกินขนาดหรือน้ำตาลต่ำซ้ำควรสังเกตอาการอย่างน้อย 24 ชั่วโมงหลังหยุดให้ dextrose",
          w: [
            "ถูก — glibenclamide ออกฤทธิ์นานและมี active metabolite ที่ขับทางไต สะสมเมื่อ eGFR ต่ำ ทำให้น้ำตาลต่ำซ้ำได้หลายวัน",
            "Metformin เดี่ยวไม่ทำให้น้ำตาลต่ำ และครึ่งชีวิตไม่ยาว",
            "Rebound hyperglycemia เล็กน้อยไม่ต้องรักษาด้วย insulin และไม่ใช่เหตุผลที่ต้องนอนโรงพยาบาล",
            "HbA1c สะท้อนน้ำตาลเฉลี่ย 2–3 เดือน ไม่เกี่ยวกับการตัดสินใจกลับบ้าน",
            "Metabolite ของ glibenclamide ที่มีฤทธิ์ขับทางไตประมาณ 50% ไตเสื่อมจึงทำให้ยาสะสม",
          ],
          k: "Glibenclamide: ฤทธิ์นาน >24 ชั่วโมง + active metabolite ขับทางไต → น้ำตาลต่ำซ้ำ 24–72 ชั่วโมงในผู้ที่ไตเสื่อม; ผู้สูงอายุหลีกเลี่ยง (Beers) ถ้าจำเป็นใช้ gliclazide",
        },
        {
          d: "hard",
          p: "วันที่ 2 ผู้ป่วยยังมีน้ำตาลต่ำซ้ำ (DTX 45–55 mg/dL) หลายครั้ง แม้ได้ 10% dextrose หยดต่อเนื่องและได้ 50% glucose เพิ่มอีก 3 ครั้ง ยาใดเหมาะสมที่สุดที่จะเพิ่ม?",
          o: [
            "Octreotide 50–100 mcg SC ทุก 6–12 ชั่วโมง",
            "Hydrocortisone 100 mg IV ทุก 6 ชั่วโมง",
            "ให้ 50% glucose ซ้ำทุกชั่วโมงต่อไปโดยไม่เพิ่มยาอื่น",
            "Glucagon 1 mg IM ทุก 4 ชั่วโมงเป็นการรักษาหลัก",
            "Propranolol 10 mg รับประทานเพื่อลดอาการใจสั่น",
          ],
          a: 0,
          r:
            "ปัญหา: การให้ glucose ปริมาณมากในผู้ที่ได้ sulfonylurea ทำให้ glucose กระตุ้น beta cell ซึ่งไวต่อการกระตุ้นอยู่แล้ว (เพราะ sulfonylurea ปิด K_ATP channel) ให้หลั่ง insulin เพิ่ม เกิดวงจรน้ำตาลขึ้นแล้วต่ำซ้ำ (rebound hypoglycemia) การให้ glucose เพิ่มอย่างเดียวจึงไม่แก้ปัญหา\n\n" +
            "กลไกของ octreotide: เป็น somatostatin analogue ที่จับกับ somatostatin receptor (SSTR2, SSTR5) บน beta cell ทำให้ voltage-gated calcium channel ปิดและลดการปล่อย insulin ที่ปลายขั้นตอน จึงหยุดการหลั่ง insulin ที่ถูกกระตุ้นจาก sulfonylurea ได้โดยตรง การศึกษาพบว่าลดจำนวนครั้งของน้ำตาลต่ำซ้ำและปริมาณ glucose ที่ต้องใช้อย่างมาก\n\n" +
            "ขนาดยา: ผู้ใหญ่ 50–100 mcg SC หรือ IV ทุก 6–12 ชั่วโมง (เด็ก 1–2 mcg/kg) ให้ต่อจนไม่มีน้ำตาลต่ำซ้ำอย่างน้อย 12–24 ชั่วโมงหลังหยุดยา ผลข้างเคียงน้อย (คลื่นไส้ ปวดท้อง) octreotide มีในบัญชียาหลักแห่งชาติและมีในโรงพยาบาลส่วนใหญ่\n\n" +
            "ทำไมตัวเลือกอื่นไม่ดีเท่า: (1) hydrocortisone มีบทบาทเฉพาะเมื่อมี adrenal insufficiency ร่วม (2) glucagon ฤทธิ์สั้นและยังกระตุ้นการหลั่ง insulin ได้ด้วย ใช้ชั่วคราวเมื่อเปิดเส้นไม่ได้ (3) propranolol ปิดบังอาการเตือนของน้ำตาลต่ำและลดการสร้าง glucose ที่ตับ (4) diazoxide เป็นทางเลือกหนึ่ง แต่ทำให้ BP ต่ำและไม่มีใช้แพร่หลายในไทย\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: octreotide เป็นการรักษาที่ถูกต้องสำหรับ sulfonylurea poisoning ที่ศูนย์พิษวิทยาแนะนำ ควรแนะนำทีมรักษาเมื่อพบผู้ป่วยที่ต้องใช้ glucose ปริมาณมากต่อเนื่อง",
          w: [
            "ถูก — octreotide ยับยั้งการหลั่ง insulin ที่ถูกกระตุ้นจาก sulfonylurea ลดน้ำตาลต่ำซ้ำและปริมาณ glucose ที่ต้องใช้",
            "Steroid ไม่ใช่การรักษาหลัก มีประโยชน์เฉพาะเมื่อมี adrenal insufficiency ร่วม",
            "Glucose ปริมาณมากกระตุ้นการหลั่ง insulin ต่อ ทำให้วงจรน้ำตาลต่ำซ้ำไม่จบ",
            "Glucagon ฤทธิ์สั้นและกระตุ้นการหลั่ง insulin ได้ ใช้ชั่วคราวเมื่อเปิดเส้นไม่ได้ ไม่ใช่การรักษาหลัก",
            "Propranolol ปิดบังอาการเตือนของน้ำตาลต่ำและลดการสร้าง glucose ที่ตับ ทำให้แย่ลง",
          ],
          k: "Sulfonylurea hypoglycemia ที่ต่ำซ้ำแม้ได้ glucose → octreotide 50–100 mcg SC q6–12h (ยับยั้งการหลั่ง insulin); glucose อย่างเดียวทำให้เกิด rebound",
        },
        {
          d: "medium",
          p: "ก่อนจำหน่าย การปรับแผนการรักษาเบาหวานข้อใดเหมาะสมที่สุด?",
          o: [
            "หยุด glibenclamide ตั้งเป้าหมาย HbA1c ไม่เกิน 8.0% และพิจารณา DPP-4 inhibitor เช่น linagliptin 5 mg OD ร่วมกับ metformin ขนาดที่เหมาะกับไต",
            "เปลี่ยนเป็น glimepiride 4 mg OD เพราะเป็น sulfonylurea รุ่นใหม่",
            "ใช้ glibenclamide ต่อแต่ลดเหลือ 2.5 mg OD ตั้งเป้า HbA1c ต่ำกว่า 6.5%",
            "เริ่ม insulin glargine 20 units ก่อนนอนเพื่อให้ HbA1c ต่ำกว่า 6.5%",
            "เพิ่ม metformin เป็น 1,000 mg BID แทน glibenclamide",
          ],
          a: 0,
          r:
            "การตั้งเป้าหมาย: ผู้สูงอายุที่มีโรคร่วมหลายโรค (CKD G3b) น้ำหนักน้อย และเคยมีน้ำตาลต่ำรุนแรง ควรใช้เป้าหมายที่ผ่อนคลาย ADA 2025 แนะนำ HbA1c ต่ำกว่า 8.0% สำหรับผู้สูงอายุที่มีโรคร่วมหลายโรคหรือมีปัญหาการรู้คิดระดับปานกลาง แนวทางสมาคมโรคเบาหวานแห่งประเทศไทย 2566 แนะนำ 7.0–8.0% ในผู้สูงอายุที่ช่วยเหลือตัวเองได้บางส่วน HbA1c 6.4% ในรายนี้ต่ำเกินไปและสะท้อนว่ามีน้ำตาลต่ำบ่อยโดยไม่รู้ตัว การคุมน้ำตาลเข้มในผู้สูงอายุไม่ลดภาวะแทรกซ้อนระยะสั้น แต่เพิ่มน้ำตาลต่ำ ล้ม กระดูกหัก และสมองเสื่อม\n\n" +
            "การเลือกยา: (1) หยุด sulfonylurea ที่ทำให้เกิดเหตุการณ์นี้ (2) DPP-4 inhibitor ไม่ทำให้น้ำตาลต่ำเมื่อใช้เดี่ยวหรือร่วมกับ metformin ใช้ง่าย ทนได้ดีในผู้สูงอายุ — linagliptin (Trajenta) 5 mg OD ไม่ต้องปรับตามไต (ขับทางน้ำดีเป็นหลัก) ส่วน sitagliptin และ vildagliptin ต้องปรับขนาดเมื่อ eGFR ต่ำ (3) ทางเลือกอื่น: SGLT2 inhibitor (ประโยชน์ต่อไตและหัวใจ แต่ระวังขาดน้ำในผู้สูงอายุน้ำหนักน้อย), GLP-1 RA (ระวังน้ำหนักลดในผู้สูงอายุที่ผอม)\n\n" +
            "ทำไมตัวเลือกอื่นไม่เหมาะ: glimepiride ก็ออกฤทธิ์นานและทำให้น้ำตาลต่ำได้; การลดขนาด glibenclamide ไม่แก้ปัญหาการสะสมของ metabolite; insulin ตั้งเป้าเข้มเกินไปเสี่ยงน้ำตาลต่ำ; metformin ที่ eGFR 30–45 ขนาดสูงสุด 1,000 mg/วัน\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ให้ความรู้ผู้ป่วยและผู้ดูแลเรื่องอาการน้ำตาลต่ำ การตรวจ DTX ที่บ้าน และการปฏิบัติเมื่อเจ็บป่วย (sick-day rules); บันทึกในประวัติว่าเคยเกิดน้ำตาลต่ำรุนแรงจาก glibenclamide",
          w: [
            "ถูก — หยุด glibenclamide เป้าหมาย HbA1c ผ่อนคลาย (<8.0%) และใช้ DPP-4 inhibitor ที่ไม่ทำให้น้ำตาลต่ำ (linagliptin ไม่ต้องปรับตามไต)",
            "Glimepiride ออกฤทธิ์นานและทำให้น้ำตาลต่ำได้เช่นกัน Beers แนะนำหลีกเลี่ยงในผู้สูงอายุ",
            "การลดขนาดไม่แก้ปัญหาการสะสมของ metabolite และเป้าหมาย HbA1c ต่ำกว่า 6.5% เข้มเกินไปสำหรับผู้สูงอายุ",
            "เป้าหมาย HbA1c เข้มเกินไปและ insulin ขนาดนี้เสี่ยงน้ำตาลต่ำในผู้สูงอายุน้ำหนัก 48 kg",
            "Metformin ที่ eGFR 30–45 ไม่ควรเกิน 1,000 mg/วัน",
          ],
          k: "ผู้สูงอายุที่มีโรคร่วมและเคยน้ำตาลต่ำ: HbA1c <8.0%; หยุด sulfonylurea ออกฤทธิ์นาน; DPP-4i (linagliptin ไม่ปรับตามไต) ไม่ทำให้น้ำตาลต่ำ",
        },
        {
          d: "easy",
          p: "คำแนะนำการใช้ metformin ต่อในผู้ป่วยรายนี้ (eGFR 35 mL/min/1.73m²) ข้อใดถูกต้องที่สุด?",
          o: [
            "ใช้ต่อได้ไม่เกิน 1,000 mg/วัน ตรวจ eGFR ทุก 3–6 เดือน และหยุดชั่วคราวเมื่อกินไม่ได้ อาเจียน ท้องเสีย หรือก่อนฉีดสารทึบรังสี",
            "ต้องหยุด metformin ถาวรทันทีเมื่อ eGFR ต่ำกว่า 45",
            "ใช้ต่อได้ขนาดเดิมไม่มีข้อจำกัดจนกว่า eGFR ต่ำกว่า 15",
            "เปลี่ยนเป็น metformin ชนิดออกฤทธิ์นานเพื่อให้ใช้ได้ถึง 2,000 mg/วัน",
            "ให้ใช้ metformin เฉพาะวันที่น้ำตาลสูงเกิน 200 mg/dL",
          ],
          a: 0,
          r:
            "เกณฑ์การใช้ metformin ตามการทำงานของไต (FDA 2016, ADA, แนวทางไทย): (1) eGFR 45 ขึ้นไป: ใช้ได้ขนาดปกติ (สูงสุด 2,000–2,550 mg/วัน) (2) eGFR 30–44: ไม่แนะนำให้เริ่มยาใหม่ ถ้าใช้อยู่แล้วให้ใช้ต่อได้ แต่ลดขนาดไม่เกิน 1,000 mg/วัน (3) eGFR ต่ำกว่า 30: ห้ามใช้\n\n" +
            "เหตุผล: metformin ไม่ถูกเปลี่ยนแปลงที่ตับและขับออกทางไตในรูปเดิม เมื่อไตเสื่อม ระดับยาสะสม เพิ่มความเสี่ยง metformin-associated lactic acidosis (MALA) ซึ่งพบได้น้อยมาก (ประมาณ 3–10 ต่อ 100,000 ราย-ปี) แต่มีอัตราตายสูง ความเสี่ยงเพิ่มเมื่อมีภาวะที่ทำให้ไตแย่ลงเฉียบพลันหรือเนื้อเยื่อขาดออกซิเจน (sepsis, ช็อก, หัวใจล้มเหลวเฉียบพลัน, ขาดน้ำ)\n\n" +
            "Sick-day rules: หยุด metformin ชั่วคราวเมื่ออาเจียน ท้องเสีย กินไม่ได้ หรือไข้สูง และกลับมาใช้เมื่อกินได้ปกติ 24–48 ชั่วโมง (ใช้หลัก SADMANS: Sulfonylurea, ACEI, Diuretics, Metformin, ARB, NSAIDs, SGLT2i); สารทึบรังสี: หยุดก่อนหรือขณะฉีดในผู้ที่ eGFR 30–60 และตรวจ eGFR ซ้ำ 48 ชั่วโมงหลังฉีดก่อนกลับมาใช้\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ผู้ที่ใช้ metformin นานควรตรวจระดับวิตามิน B12 เป็นระยะ (ลดการดูดซึม B12 ทำให้โลหิตจางและ neuropathy); ชนิด extended-release ช่วยลดผลข้างเคียงทางเดินอาหาร แต่เกณฑ์ขนาดตามไตเหมือนกัน",
          w: [
            "ถูก — eGFR 30–44 ใช้ต่อได้ไม่เกิน 1,000 mg/วัน ติดตามไต และหยุดชั่วคราวเมื่อเจ็บป่วยหรือฉีดสารทึบรังสี",
            "ยังไม่ต้องหยุดถาวร ห้ามใช้เมื่อ eGFR ต่ำกว่า 30; ที่ 30–44 ใช้ต่อได้ด้วยขนาดที่ลดลง",
            "ต้องลดขนาดเมื่อ eGFR ต่ำกว่า 45 และห้ามใช้เมื่อต่ำกว่า 30",
            "ชนิดออกฤทธิ์นานใช้เกณฑ์ไตเหมือนกัน ไม่ได้ทำให้ใช้ขนาดสูงได้",
            "Metformin ต้องกินสม่ำเสมอทุกวัน ไม่ใช้เป็นครั้งคราวตามระดับน้ำตาล",
          ],
          k: "Metformin: eGFR ≥45 ขนาดปกติ; 30–44 ห้ามเริ่มใหม่ ถ้าใช้อยู่ ≤1,000 mg/วัน; <30 ห้ามใช้; หยุดชั่วคราวเมื่อเจ็บป่วย/ขาดน้ำ/สารทึบรังสี",
        },
      ],
    },
    {
      title: "Graves' hyperthyroidism on methimazole",
      base:
        "หญิงไทยอายุ 34 ปี น้ำหนัก 52 kg ใจสั่น น้ำหนักลด 5 kg ใน 2 เดือน มือสั่น ขี้ร้อน คอพอกโตทั้งสองข้าง ตาโปนเล็กน้อย ไม่ได้ตั้งครรภ์และไม่ได้วางแผนมีบุตรเร็วๆ นี้ ไม่มีโรคหืด. " +
        "HR 118 bpm, BP 132/70 mmHg. Lab: free T4 4.2 ng/dL (ปกติ 0.9–1.7), TSH ต่ำกว่า 0.01 mIU/L, TRAb บวก, CBC และ LFT ปกติ",
      ref: "2016 American Thyroid Association Guidelines for Diagnosis and Management of Hyperthyroidism; 2018 European Thyroid Association Guideline for the Management of Graves' Hyperthyroidism; Methimazole prescribing information",
      qs: [
        {
          d: "easy",
          p: "การรักษาเริ่มต้นข้อใดเหมาะสมที่สุด?",
          o: [
            "Methimazole 20–30 mg/วัน ร่วมกับ propranolol 20–40 mg ทุก 6–8 ชั่วโมงเพื่อคุมอาการ",
            "Propylthiouracil 100 mg วันละ 3 ครั้งเป็นยาเลือกแรก",
            "Levothyroxine 50 mcg/วัน เพื่อปรับสมดุลฮอร์โมน",
            "Lugol's solution 5 หยด วันละ 3 ครั้งเป็นการรักษาหลักระยะยาว",
            "Radioactive iodine ทันทีโดยไม่ต้องเตรียมผู้ป่วยหรือประเมินภาวะตา",
          ],
          a: 0,
          r:
            "การเลือกยาต้านไทรอยด์ (thionamide): methimazole (ในไทยมีขนาด 5 mg) เป็นยาเลือกแรกสำหรับ Graves' disease ในผู้ใหญ่ เพราะ (1) ออกฤทธิ์นาน ให้วันละครั้งได้ ทำให้ใช้ยาได้สม่ำเสมอ (2) คุมฮอร์โมนได้เร็วกว่า (3) พิษต่อตับรุนแรงน้อยกว่า propylthiouracil (PTU) ซึ่งมีคำเตือนเรื่องตับวายรุนแรง (FDA boxed warning) PTU ใช้เฉพาะไตรมาสแรกของการตั้งครรภ์, thyroid storm, หรือผู้ที่แพ้ methimazole แบบไม่รุนแรง\n\n" +
            "ขนาดเริ่มต้นตาม free T4: 1–1.5 เท่าของค่าปกติสูงสุด → 5–10 mg/วัน; 1.5–2 เท่า → 10–20 mg/วัน; 2–3 เท่า → 30–40 mg/วัน ผู้ป่วยรายนี้ FT4 4.2 (ประมาณ 2.5 เท่า) จึงเริ่ม 20–30 mg/วัน ตรวจ FT4 (และ T3) ใน 4–6 สัปดาห์แล้วลดขนาดเป็นขนาดคงที่ 5–10 mg/วัน รักษานาน 12–18 เดือน\n\n" +
            "บทบาทของ beta-blocker: thionamide ยับยั้งการสร้างฮอร์โมนใหม่ แต่ไม่ได้ยับยั้งการหลั่งฮอร์โมนที่สร้างไว้แล้ว ระดับฮอร์โมนจึงลดลงช้า 2–6 สัปดาห์ propranolol คุมอาการใจสั่น มือสั่น ได้เร็ว และขนาดสูงยับยั้งการเปลี่ยน T4 เป็น T3 ได้บ้าง (ข้อห้ามในโรคหืด ถ้ามีหืดใช้ atenolol/metoprolol หรือ diltiazem)\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ก่อนเริ่มยาควรตรวจ CBC และ LFT เป็นค่าพื้นฐาน; ให้ความรู้ผู้ป่วยว่าถ้ามีไข้ เจ็บคอ แผลในปาก ต้องหยุดยาและมาตรวจ CBC ทันที (agranulocytosis), และถ้าตัวเหลือง ปัสสาวะสีเข้ม คันมาก ให้หยุดยามาตรวจ LFT; methimazole ทำให้เกิดความผิดปกติแต่กำเนิดในไตรมาสแรก ผู้ที่วางแผนตั้งครรภ์ต้องปรึกษาแพทย์",
          w: [
            "ถูก — methimazole ขนาดตามความรุนแรง (FT4 ประมาณ 2.5 เท่า → 20–30 mg/วัน) ร่วมกับ propranolol คุมอาการ",
            "PTU มีความเสี่ยงตับวายรุนแรง ใช้เฉพาะไตรมาสแรกของการตั้งครรภ์ thyroid storm หรือแพ้ methimazole",
            "Levothyroxine เป็นฮอร์โมนไทรอยด์ ทำให้ภาวะไทรอยด์เป็นพิษแย่ลง",
            "Iodine ใช้ระยะสั้นก่อนผ่าตัดหรือใน thyroid storm ฤทธิ์ยับยั้งหายไปใน 1–2 สัปดาห์ (escape) ไม่ใช่การรักษาระยะยาว",
            "RAI อาจทำให้ตาโปนแย่ลง ต้องประเมินภาวะตาและอาจต้องให้ steroid ป้องกัน และมักคุมฮอร์โมนด้วยยาก่อน",
          ],
          k: "Graves': methimazole ยาเลือกแรก (ขนาดตาม FT4) + beta-blocker คุมอาการ; PTU เฉพาะไตรมาสแรก/thyroid storm/แพ้ methimazole",
        },
        {
          d: "medium",
          p: "5 สัปดาห์หลังเริ่ม methimazole ผู้ป่วยโทรมาที่ร้านยาว่ามีไข้ 39 °C เจ็บคอมาก กลืนลำบาก เภสัชกรควรแนะนำอย่างไร?",
          o: [
            "หยุด methimazole ทันทีและไปโรงพยาบาลเพื่อตรวจ CBC with differential วันนี้",
            "จ่าย amoxicillin สำหรับคออักเสบและใช้ methimazole ต่อ",
            "ลดขนาด methimazole ลงครึ่งหนึ่งและนัดตรวจเลือดในการนัดครั้งต่อไป",
            "เปลี่ยนเป็น propylthiouracil ทันทีโดยไม่ต้องตรวจเลือด",
            "ใช้ยาต่อและกิน paracetamol ลดไข้ ถ้าไม่ดีขึ้นใน 1 สัปดาห์จึงไปพบแพทย์",
          ],
          a: 0,
          r:
            "ภาวะที่ต้องสงสัย: agranulocytosis (absolute neutrophil count ต่ำกว่า 500 cells/mm³) จาก thionamide พบประมาณ 0.2–0.5% ส่วนใหญ่เกิดใน 90 วันแรกของการรักษา และสัมพันธ์กับขนาดยาสำหรับ methimazole (พบมากขึ้นเมื่อขนาดมากกว่า 40 mg/วัน) กลไกเป็นทั้งแบบ immune-mediated และพิษโดยตรงต่อเซลล์ตั้งต้นของเม็ดเลือด อาการแรกที่พบบ่อยที่สุดคือ ไข้และเจ็บคอ (pharyngitis) ซึ่งอาจลุกลามเป็น sepsis เสียชีวิตได้\n\n" +
            "การปฏิบัติ: (1) หยุดยาทันทีที่มีไข้หรือเจ็บคอ (2) ตรวจ CBC with differential ในวันเดียวกัน (3) ถ้า ANC ต่ำกว่า 1,000 ให้หยุดยาถาวร ถ้าต่ำกว่า 500 = agranulocytosis ต้องรักษาเป็น febrile neutropenia ด้วยยาปฏิชีวนะครอบคลุมกว้างทางหลอดเลือดดำ และพิจารณา G-CSF (4) ถ้า ANC ปกติ สามารถกลับมาใช้ยาได้\n\n" +
            "ทำไมการตรวจ CBC เป็นประจำไม่ได้ช่วยมาก: agranulocytosis เกิดอย่างเฉียบพลัน การตรวจ CBC ตามนัดอาจพลาดได้ จึงสำคัญที่สุดคือการให้ความรู้ผู้ป่วยให้รู้จักอาการเตือน และให้หยุดยาทันทีแล้วมาตรวจ (ผู้ป่วยต้องได้รับคำแนะนำนี้เป็นลายลักษณ์อักษรตั้งแต่วันแรก)\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: เภสัชกรร้านยาเป็นด่านแรกที่ผู้ป่วยมักมาซื้อยาแก้เจ็บคอ ต้องซักประวัติการใช้ยาต้านไทรอยด์ (รวมถึง clozapine, co-trimoxazole, carbamazepine, dapsone ซึ่งทำให้เม็ดเลือดขาวต่ำได้) ก่อนจ่ายยาปฏิชีวนะ; ห้ามเปลี่ยนเป็น PTU เมื่อสงสัย agranulocytosis เพราะเกิดปฏิกิริยาข้ามกันได้",
          w: [
            "ถูก — ไข้และเจ็บคอขณะใช้ thionamide ต้องหยุดยาและตรวจ CBC with differential ในวันเดียวกันเพื่อแยก agranulocytosis",
            "การให้ยาปฏิชีวนะและใช้ methimazole ต่อโดยไม่ตรวจ CBC อาจพลาด agranulocytosis ที่เสี่ยงต่อ sepsis",
            "การลดขนาดไม่ปลอดภัย และการรอนัดครั้งต่อไปช้าเกินไปสำหรับภาวะที่อาจเสียชีวิตได้",
            "PTU เกิดปฏิกิริยาข้ามกับ methimazole ได้ ต้องตรวจ CBC ก่อนเสมอ",
            "การรอ 1 สัปดาห์อาจทำให้ผู้ป่วยติดเชื้อรุนแรงจนเสียชีวิต",
          ],
          k: "Thionamide + ไข้/เจ็บคอ → หยุดยาทันที ตรวจ CBC with diff วันนั้น; ANC <500 = agranulocytosis (ส่วนใหญ่เกิดใน 90 วันแรก); ให้ความรู้ผู้ป่วยตั้งแต่วันแรก",
        },
        {
          d: "hard",
          p: "ผล CBC: WBC 1,100 cells/mm³, ANC 200 cells/mm³ ได้รับการรักษา febrile neutropenia จนหาย. แผนการรักษา Graves' disease ต่อไปข้อใดเหมาะสมที่สุด?",
          o: [
            "ห้ามใช้ thionamide ทั้ง methimazole และ PTU อีก วางแผนรักษาด้วย radioactive iodine หรือผ่าตัดไทรอยด์ โดยคุมอาการระหว่างรอด้วย beta-blocker ร่วมกับยาเสริมอื่น เช่น cholestyramine หรือ iodine ก่อนผ่าตัด",
            "เปลี่ยนเป็น PTU 100 mg วันละ 3 ครั้ง เพราะเป็นยาคนละตัวกับ methimazole",
            "กลับมาใช้ methimazole ขนาดต่ำ 5 mg/วัน ร่วมกับ G-CSF ตลอดการรักษา",
            "ใช้ propranolol เดี่ยวไปตลอดโดยไม่ต้องรักษาสาเหตุ",
            "ใช้ Lugol's solution ต่อเนื่องเป็นการรักษาหลักระยะยาว",
          ],
          a: 0,
          r:
            "หลักการ: ผู้ที่เกิด agranulocytosis จาก thionamide ตัวหนึ่ง ห้ามใช้ thionamide ตัวอื่นอีก เพราะเกิดปฏิกิริยาข้ามกันระหว่าง methimazole และ PTU ได้ (ATA 2016) และการกลับมาใช้ยาซ้ำอาจทำให้เกิดซ้ำรุนแรงกว่าเดิม\n\n" +
            "การรักษาที่แน่นอน (definitive therapy): (1) radioactive iodine (RAI, I-131): ได้ผลดี ข้อห้ามคือตั้งครรภ์ ให้นมบุตร และตาโปนปานกลางถึงรุนแรงที่ยัง active (ถ้าตาโปนเล็กน้อยให้ prednisolone ป้องกันได้) ผู้ป่วยต้องคุมกำเนิดอย่างน้อย 6 เดือนหลัง RAI (2) ผ่าตัด total thyroidectomy: เหมาะเมื่อคอพอกโตมาก มีตาโปนรุนแรง สงสัยมะเร็ง หรือต้องการผลเร็ว ต้องทำให้ฮอร์โมนใกล้ปกติก่อนผ่าตัดเพื่อป้องกัน thyroid storm\n\n" +
            "การคุมฮอร์โมนระหว่างรอ (เมื่อใช้ thionamide ไม่ได้): (1) beta-blocker คุมอาการ (2) potassium iodide หรือ Lugol's solution ยับยั้งการหลั่งฮอร์โมนได้เร็ว และลดเลือดไปเลี้ยงต่อมไทรอยด์ ใช้ 7–10 วันก่อนผ่าตัด แต่ไม่ใช้ระยะยาวเพราะเกิด escape และถ้าใช้ก่อน RAI จะทำให้ RAI ไม่ได้ผล (3) cholestyramine 4 g วันละ 2–4 ครั้ง จับฮอร์โมนไทรอยด์ในลำไส้ (ลดการหมุนเวียน enterohepatic) (4) corticosteroid ลดการเปลี่ยน T4 เป็น T3\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: บันทึกการแพ้ยาให้ชัดเจนว่า \"agranulocytosis จาก methimazole — ห้ามใช้ thionamide ทุกตัว\" ในระบบโรงพยาบาลและบัตรแพ้ยา เพื่อป้องกันการได้ PTU ในอนาคต; G-CSF ใช้รักษาช่วงเกิดภาวะ ไม่ได้ใช้เพื่อให้กลับมาใช้ยาได้",
          w: [
            "ถูก — ห้ามใช้ thionamide ทุกตัว วางแผน RAI หรือผ่าตัด และใช้ beta-blocker ร่วมกับยาเสริมระหว่างรอ",
            "PTU เกิดปฏิกิริยาข้ามกับ methimazole ได้ ห้ามใช้หลังเกิด agranulocytosis",
            "การกลับมาใช้ methimazole หลัง agranulocytosis เสี่ยงเกิดซ้ำรุนแรง G-CSF ไม่ได้ป้องกัน",
            "Beta-blocker คุมเฉพาะอาการ ไม่ได้ลดฮอร์โมน ภาวะไทรอยด์เป็นพิษยังทำลายหัวใจและกระดูก",
            "Iodine ใช้ระยะสั้นเท่านั้น ใช้นานเกิด escape และทำให้ RAI ใช้ไม่ได้ผลในภายหลัง",
          ],
          k: "Agranulocytosis จาก thionamide → ห้ามใช้ทั้ง methimazole และ PTU; definitive therapy ด้วย RAI หรือผ่าตัด; คุมอาการด้วย beta-blocker ± iodine (ก่อนผ่าตัด)/cholestyramine",
        },
      ],
    },
    {
      ref: "Insulin product labels (Lantus, NovoRapid, Mixtard); ADA Standards of Care in Diabetes 2025 Section 9; แนวทางเวชปฏิบัติสำหรับโรคเบาหวาน 2566",
      qs: [
        {
          d: "easy",
          p:
            "ผู้ป่วยเบาหวานได้รับปากกาฉีดอินซูลิน (insulin glargine) 3 ด้ามสำหรับใช้ 3 เดือน บ้านอยู่ต่างจังหวัด อากาศร้อน คำแนะนำการเก็บรักษาข้อใดถูกต้องที่สุด?",
          o: [
            "ด้ามที่ยังไม่เปิดใช้เก็บในตู้เย็นช่องธรรมดา 2–8 °C ห้ามแช่แข็ง ส่วนด้ามที่เปิดใช้แล้วเก็บที่อุณหภูมิห้องไม่เกิน 30 °C หลีกเลี่ยงแสงแดดและความร้อน และใช้ให้หมดภายในประมาณ 28 วัน",
            "เก็บทุกด้ามในช่องแช่แข็งเพื่อให้ยาคงตัวนานที่สุด",
            "ด้ามที่เปิดใช้แล้วต้องเก็บในตู้เย็นตลอดและใช้ได้นาน 3 เดือน",
            "เก็บทุกด้ามไว้ในรถยนต์เพื่อให้พกพาสะดวก",
            "ถ้ายาเปลี่ยนเป็นสีขุ่นหรือมีตะกอน ให้เขย่าแรงๆ แล้วใช้ต่อได้",
          ],
          a: 0,
          r:
            "หลักการ: insulin เป็นโปรตีน ไวต่อความร้อน การแช่แข็ง และแสงแดด ความร้อนทำให้ insulin เสื่อมฤทธิ์ (โปรตีนเสียสภาพ) และการแช่แข็งทำให้โครงสร้างผลึก/โปรตีนเสียและเกาะกลุ่ม ซึ่งไม่สามารถกลับคืนได้ แม้ละลายแล้วก็ใช้ไม่ได้\n\n" +
            "การเก็บรักษา: (1) ยังไม่เปิดใช้: ตู้เย็นช่องธรรมดา 2–8 °C (ไม่วางชิดช่องแช่แข็งหรือผนังด้านในที่เย็นจัด) ใช้ได้จนถึงวันหมดอายุบนฉลาก (2) เปิดใช้แล้ว (ปากกาหรือขวด): เก็บที่อุณหภูมิห้องไม่เกิน 30 °C (ตามฉลากส่วนใหญ่) ใช้ได้ประมาณ 28 วัน (บางผลิตภัณฑ์ เช่น insulin detemir 42 วัน, degludec 56 วัน) การเก็บปากกาที่ใช้อยู่ในอุณหภูมิห้องช่วยลดอาการเจ็บขณะฉีดและป้องกันฟองอากาศ (3) ห้ามทิ้งไว้ในรถยนต์ ซึ่งในประเทศไทยอุณหภูมิในรถอาจสูงถึง 60–70 °C (4) เมื่อเดินทาง ใช้กระเป๋าเก็บความเย็นแต่ไม่วางยาสัมผัสน้ำแข็งโดยตรง\n\n" +
            "การตรวจสภาพยา: insulin ชนิดใส (glargine, aspart, regular) ต้องใส ถ้าขุ่นหรือมีตะกอนให้ทิ้ง; insulin ชนิดขุ่น (NPH เช่น Insulatard, premixed เช่น Mixtard 30) ต้องคลึงฝ่ามือหรือพลิกขึ้นลงเบาๆ 10–20 ครั้งให้เป็นเนื้อเดียวกัน ห้ามเขย่าแรง\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ในบ้านที่อากาศร้อนและไม่มีที่เย็น แนะนำให้วางยาในที่ร่ม อากาศถ่ายเท หรือใช้หม้อดินเผา (clay pot) ใส่น้ำ ซึ่งมีการศึกษาว่าช่วยลดอุณหภูมิได้; เขียนวันที่เปิดใช้บนปากกาทุกครั้ง; สอนเปลี่ยนเข็มทุกครั้งที่ฉีดและหมุนเวียนตำแหน่งฉีดเพื่อป้องกัน lipohypertrophy",
          w: [
            "ถูก — ยังไม่เปิดเก็บ 2–8 °C ห้ามแช่แข็ง; เปิดใช้แล้วเก็บอุณหภูมิห้องไม่เกิน 30 °C ประมาณ 28 วัน หลีกเลี่ยงความร้อน",
            "การแช่แข็งทำให้ insulin เสื่อมถาวร แม้ละลายแล้วก็ใช้ไม่ได้",
            "ด้ามที่เปิดแล้วมีอายุการใช้ประมาณ 28 วันไม่ว่าจะเก็บที่ใด (เพราะความปลอดเชื้อหลังเจาะ) ไม่ใช่ 3 เดือน",
            "อุณหภูมิในรถยนต์ในประเทศไทยสูงมาก ทำให้ insulin เสื่อมฤทธิ์",
            "Insulin glargine ต้องใส ถ้าขุ่นหรือมีตะกอนแสดงว่าเสื่อม ต้องทิ้ง และไม่ควรเขย่าแรง",
          ],
          k: "Insulin: ยังไม่เปิด 2–8 °C ห้ามแช่แข็ง; เปิดแล้วอุณหภูมิห้อง ≤30 °C ~28 วัน; ห้ามทิ้งในรถ; glargine/aspart/regular ต้องใส, NPH/premix คลึงเบาๆ",
        },
      ],
    },
    {
      ref: "FDA Drug Safety Communication: SGLT2 inhibitors label changes for ketoacidosis before surgery (2020); ADA Standards of Care in Diabetes 2025 Section 16 (Diabetes Care in the Hospital); Dapagliflozin (Forxiga) prescribing information",
      qs: [
        {
          d: "medium",
          p:
            "ชายอายุ 58 ปี T2DM ใช้ dapagliflozin 10 mg OD และ metformin 1,000 mg BID นัดผ่าตัดถุงน้ำดีแบบนัดล่วงหน้า (elective laparoscopic cholecystectomy) อีก 1 สัปดาห์. " +
            "คำแนะนำเรื่อง dapagliflozin ข้อใดเหมาะสมที่สุด?",
          o: [
            "หยุด dapagliflozin อย่างน้อย 3 วันก่อนผ่าตัด และกลับมาใช้เมื่อกินดื่มได้ปกติและอาการคงที่ เพื่อป้องกัน euglycemic diabetic ketoacidosis",
            "ใช้ dapagliflozin ต่อจนถึงเช้าวันผ่าตัดเพราะไม่ทำให้น้ำตาลต่ำ",
            "หยุด dapagliflozin 2 สัปดาห์ก่อนผ่าตัดเพราะทำให้แผลหายช้า",
            "ไม่ต้องหยุดยา แต่ให้ตรวจ DTX ก่อนผ่าตัด ถ้าน้ำตาลปกติแสดงว่าไม่มีความเสี่ยง DKA",
            "หยุดเฉพาะ metformin ส่วน dapagliflozin ให้ใช้ต่อได้ทุกกรณี",
          ],
          a: 0,
          r:
            "ภาวะที่ต้องป้องกัน: euglycemic diabetic ketoacidosis (euDKA) คือ DKA ที่น้ำตาลในเลือดไม่สูงมาก (มักต่ำกว่า 250 mg/dL) จึงวินิจฉัยได้ช้า พบได้ในผู้ที่ใช้ SGLT2 inhibitor โดยเฉพาะช่วงผ่าตัด อดอาหาร เจ็บป่วยเฉียบพลัน ดื่มสุรา หรือลด insulin\n\n" +
            "กลไก: SGLT2 inhibitor ทำให้ glucose ถูกขับทางปัสสาวะ ระดับน้ำตาลจึงลดลงโดยไม่ขึ้นกับ insulin ร่างกายตอบสนองด้วยการลด insulin และเพิ่ม glucagon (insulin:glucagon ratio ต่ำ) กระตุ้นการสลายไขมันและสร้าง ketone นอกจากนี้ยาลดการขับ ketone ทางไต เมื่อมีภาวะเครียดจากการผ่าตัดและอดอาหาร ketone จึงสะสมจนเกิด DKA ในขณะที่น้ำตาลไม่สูง\n\n" +
            "คำแนะนำ (FDA 2020, ADA): หยุดก่อนผ่าตัดที่นัดล่วงหน้า — canagliflozin, dapagliflozin, empagliflozin อย่างน้อย 3 วัน; ertugliflozin อย่างน้อย 4 วัน กลับมาใช้เมื่อกินดื่มได้ปกติ ไม่มีภาวะขาดน้ำ และอาการทางคลินิกคงที่ ระหว่างหยุดยาอาจต้องใช้ยาอื่นหรือ insulin คุมน้ำตาล\n\n" +
            "การวินิจฉัย euDKA: ถ้าผู้ป่วยที่ใช้ SGLT2 inhibitor มีคลื่นไส้ อาเจียน ปวดท้อง เหนื่อยหอบ อ่อนเพลีย ต้องตรวจ ketone (beta-hydroxybutyrate ในเลือด) และ blood gas แม้น้ำตาลปกติ การรักษาต้องให้ glucose ร่วมกับ insulin (เพราะน้ำตาลไม่สูง)\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: metformin หยุดวันผ่าตัด (เช้าวันผ่าตัด) และกลับมาใช้เมื่อกินได้และไตปกติ; ให้ความรู้ sick-day rules ว่าหยุด SGLT2 inhibitor เมื่อเจ็บป่วยกินไม่ได้; dapagliflozin (Forxiga) และ empagliflozin (Jardiance) มีใช้ในไทยและอยู่ในบัญชียาหลักบางข้อบ่งใช้",
          w: [
            "ถูก — หยุด dapagliflozin อย่างน้อย 3 วันก่อนผ่าตัด (ertugliflozin 4 วัน) เพื่อป้องกัน euglycemic DKA และกลับมาใช้เมื่อกินดื่มได้ปกติ",
            "ความเสี่ยงหลักคือ euglycemic DKA ไม่ใช่น้ำตาลต่ำ การใช้ยาถึงเช้าวันผ่าตัดเพิ่มความเสี่ยง",
            "เหตุผลไม่ถูกต้อง และการหยุดนานเกินไปทำให้คุมน้ำตาลไม่ดีโดยไม่จำเป็น",
            "Euglycemic DKA เกิดได้แม้น้ำตาลปกติ การตรวจ DTX จึงไม่ได้ตัดความเสี่ยง",
            "SGLT2 inhibitor เป็นยาที่ต้องหยุดก่อนผ่าตัดล่วงหน้าหลายวัน (metformin หยุดวันผ่าตัด)",
          ],
          k: "SGLT2i ก่อนผ่าตัด elective: หยุด dapa/empa/cana ≥3 วัน, ertugliflozin ≥4 วัน (ป้องกัน euglycemic DKA); น้ำตาลปกติไม่ได้ตัด DKA ต้องตรวจ ketone",
        },
      ],
    },
  ],
};
