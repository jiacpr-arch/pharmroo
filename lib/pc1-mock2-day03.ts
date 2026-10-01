import type { Pc1MockItem } from "@/lib/pc1-mock-builder";

// PC1 Mock Set 2 — ข้อใหม่ชุดที่ 3: ทางเดินอาหารและตับ (10) + โลหิตวิทยาและมะเร็ง (10)
// ใช้ชื่อยา/รูปแบบยาที่มีใช้ในประเทศไทยเป็นหลัก และอธิบายเหตุผลเชิงลึกสำหรับเภสัชกร

export const MOCK2_DAY03: Record<string, Pc1MockItem[]> = {
  gi: [
    {
      title: "NSAID-associated peptic ulcer bleeding in a post-PCI patient",
      base:
        "ชายไทยอายุ 66 ปี ทำ PCI ใส่ขดลวดเมื่อ 8 เดือนก่อน ใช้ aspirin 81 mg OD และ clopidogrel 75 mg OD (แพทย์วางแผน DAPT 12 เดือน) " +
        "ซื้อ naproxen 250 mg BID จากร้านยามาทานเองนาน 1 เดือนเพราะปวดเข่า. มาด้วยถ่ายดำ 2 วัน Hb 8.2 g/dL BP 104/66 mmHg HR 104/min. " +
        "ส่องกล้องพบแผลที่ duodenum มีเส้นเลือดโผล่ (visible vessel) ได้ทำ endoscopic hemostasis สำเร็จ",
      ref: "ACG Clinical Guideline: Upper GI and Ulcer Bleeding 2021; ACG Guidelines for Prevention of NSAID-Related Ulcer Complications; FDA Drug Safety Communication on clopidogrel and omeprazole",
      qs: [
        {
          d: "easy",
          p: "ยาที่เหมาะสมที่สุดหลังทำ endoscopic hemostasis สำเร็จคือข้อใด?",
          o: [
            "Omeprazole 80 mg IV bolus แล้ว 8 mg/h หยดต่อเนื่อง 72 ชั่วโมง (หรือ 40 mg IV วันละ 2 ครั้ง)",
            "Ranitidine 50 mg IV ทุก 8 ชั่วโมง",
            "Aluminium hydroxide/magnesium hydroxide 30 mL ทุก 4 ชั่วโมง",
            "Sucralfate 1 g ทุก 6 ชั่วโมงอย่างเดียว",
            "Tranexamic acid 1 g IV ทุก 8 ชั่วโมง",
          ],
          a: 0,
          r:
            "หลักการ: ก้อนเลือดที่อุดหลอดเลือดบนแผล (clot) จะคงตัวได้ดีเมื่อ pH ในกระเพาะ >6 เพราะ pepsin และกรดทำลาย fibrin clot และยับยั้งการเกาะกลุ่มของเกล็ดเลือด การกดกรดให้ได้ pH สูงต่อเนื่องจึงลดการเลือดออกซ้ำ\n\n" +
            "ข้อบ่งใช้และขนาดยา: ผู้ที่มี high-risk stigmata (active bleeding, visible vessel, adherent clot) หลังทำ endoscopic therapy แนะนำ high-dose PPI ต่อเนื่อง 72 ชั่วโมง (ช่วงที่เลือดออกซ้ำบ่อยที่สุด): omeprazole/esomeprazole/pantoprazole 80 mg IV bolus แล้ว 8 mg/h หรือแบบ intermittent 40 mg IV วันละ 2–4 ครั้ง (ACG 2021 ให้ผลเทียบเท่า) จากนั้นเปลี่ยนเป็น PPI ทางปากวันละ 2 ครั้งจนครบ 14 วัน แล้ววันละครั้งตามข้อบ่งใช้\n\n" +
            "เหตุผลที่ตัดตัวเลือกอื่น: H2RA กดกรดได้ไม่พอและเกิด tolerance ใน 24–72 ชั่วโมง; antacid และ sucralfate ไม่ได้ยก pH ต่อเนื่อง; tranexamic acid ไม่ลดการเสียชีวิตใน GI bleeding (HALT-IT trial) และเพิ่ม VTE\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: omeprazole IV ในไทยเป็นผงต้องละลายก่อนใช้ ความคงตัวหลังผสมจำกัด (มักไม่เกิน 12 ชั่วโมงใน NSS) ควรเตรียมใหม่ตามรอบ; ห้ามผสมในสารละลายที่มี dextrose เพราะเสื่อมสลายเร็ว",
          w: [
            "ถูก",
            "H2RA กดกรดไม่พอและเกิด tolerance ไม่แนะนำในเลือดออกจากแผล",
            "Antacid ไม่ยก pH ต่อเนื่องพอให้ clot คงตัว",
            "Sucralfate ไม่ใช่ยาหลักในภาวะเลือดออกเฉียบพลัน",
            "ไม่ลดการเสียชีวิตใน GI bleeding และเพิ่ม VTE (HALT-IT)",
          ],
          k: "หลัง endoscopic hemostasis (high-risk stigmata): high-dose PPI IV 72 ชม. (80 mg bolus + 8 mg/h หรือ 40 mg IV BID–QID) → PPI PO BID ถึง 14 วัน",
        },
        {
          d: "medium",
          p: "หลังหยุดเลือดได้ แพทย์โรคหัวใจยืนยันว่ายังต้องใช้ยาต้านเกล็ดเลือด การจัดการ aspirin ข้อใดเหมาะสมที่สุด?",
          o: [
            "หยุด naproxen ถาวร และเริ่ม aspirin กลับเร็วที่สุดเมื่อหยุดเลือดได้ (โดยทั่วไปภายใน 1–3 วัน) ร่วมกับ PPI",
            "หยุด aspirin ถาวรเพราะเคยเลือดออก",
            "หยุด aspirin 4 สัปดาห์แล้วค่อยเริ่มใหม่",
            "เปลี่ยน aspirin เป็น naproxen เพราะมีฤทธิ์ต้านเกล็ดเลือดเช่นกัน",
            "เพิ่ม aspirin เป็น 325 mg/วัน เพื่อป้องกันขดลวดอุดตัน",
          ],
          a: 0,
          r:
            "หลักการ: ผู้ป่วยใส่ขดลวดมา 8 เดือนและใช้ aspirin เพื่อ secondary prevention ความเสี่ยงจากการหยุดยาต้านเกล็ดเลือด (stent thrombosis, MI, เสียชีวิต) สูงกว่าความเสี่ยงเลือดออกซ้ำเมื่อได้ PPI ร่วม\n\n" +
            "หลักฐาน: การศึกษาของ Sung และคณะ (Ann Intern Med 2010) พบว่าการเริ่ม aspirin ต่อทันทีหลังหยุดเลือดได้ร่วมกับ PPI มีอัตราเลือดออกซ้ำสูงขึ้นเล็กน้อย แต่การเสียชีวิตลดลงชัดเจนเมื่อเทียบกับการหยุด aspirin. ACG 2021 แนะนำให้เริ่ม aspirin กลับภายในวันแรกๆ หลังหยุดเลือด (ส่วน P2Y12 inhibitor ให้ตัดสินร่วมกับแพทย์โรคหัวใจ)\n\n" +
            "การกำจัดสาเหตุ: naproxen เป็นต้นเหตุหลัก — NSAID ร่วมกับ DAPT เพิ่มความเสี่ยงเลือดออกทางเดินอาหารหลายเท่า ต้องหยุดถาวร และควรตรวจ H. pylori ด้วย ถ้าพบต้องกำจัด\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ผู้ป่วยที่ใช้ antiplatelet/anticoagulant มักซื้อ NSAID เองจากร้านยา เภสัชกรต้องถามยาประจำทุกครั้งก่อนจ่าย NSAID และแนะนำ paracetamol หรือ NSAID ชนิดทาแทน",
          w: [
            "ถูก",
            "การหยุดถาวรเพิ่มความเสี่ยง stent thrombosis และเสียชีวิต",
            "หยุดนานเกินไป เสี่ยงเหตุการณ์หัวใจขาดเลือด",
            "Naproxen ไม่ใช่ยาต้านเกล็ดเลือดเพื่อป้องกันโรคหัวใจ และเป็นสาเหตุของแผล",
            "ขนาดสูงไม่เพิ่มประสิทธิภาพ แต่เพิ่มความเสี่ยงเลือดออก",
          ],
          k: "Aspirin เพื่อ secondary prevention: เริ่มกลับเร็วที่สุดหลังหยุดเลือดได้ + PPI; หยุด NSAID ถาวร; ตรวจ H. pylori",
        },
        {
          d: "medium",
          p: "ผู้ป่วยต้องใช้ clopidogrel ต่อจนครบ 12 เดือน PPI ชนิดรับประทานใดเหมาะสมที่สุดในการใช้ร่วม?",
          o: ["Pantoprazole 40 mg OD", "Omeprazole 40 mg OD", "Esomeprazole 40 mg OD", "Cimetidine 400 mg BID", "ไม่ต้องใช้ยาลดกรดใดๆ"],
          a: 0,
          r:
            "กลไก: Clopidogrel เป็น prodrug ต้องเปลี่ยนเป็น active thiol metabolite ผ่าน CYP2C19 เป็นหลัก. Omeprazole และ esomeprazole เป็น CYP2C19 inhibitor ที่ค่อนข้างแรง ลดการเกิด active metabolite และลดฤทธิ์ต้านเกล็ดเลือด (FDA warning 2009/2010) แม้ผลต่อ clinical outcome ยังไม่ชัดเจน (COGENT trial) แต่แนะนำหลีกเลี่ยงคู่นี้\n\n" +
            "การเลือก PPI: pantoprazole (และ rabeprazole) ยับยั้ง CYP2C19 น้อยที่สุด จึงเป็นตัวเลือกที่แนะนำเมื่อใช้ร่วม clopidogrel. การแยกเวลาทานไม่ช่วย เพราะ omeprazole ยับยั้งเอนไซม์แบบ irreversible\n\n" +
            "ความจำเป็นของ PPI: ผู้ป่วยเคยเลือดออกจากแผล + ใช้ DAPT = high GI risk แนวทาง ACC/AHA และ ESC แนะนำให้ใช้ PPI ร่วมกับ DAPT ในผู้ที่มีความเสี่ยงเลือดออกทางเดินอาหาร\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ในคนเอเชีย (รวมคนไทย) มี CYP2C19 loss-of-function allele (*2, *3) สูงกว่าคนตะวันตก (~50–60% เป็น intermediate หรือ poor metabolizer) ทำให้ตอบสนองต่อ clopidogrel ลดลงอยู่แล้ว ยิ่งต้องเลี่ยงยาที่ยับยั้ง CYP2C19; ทางเลือกในผู้ที่ตอบสนองไม่ดีคือ ticagrelor หรือ prasugrel",
          w: [
            "ถูก",
            "ยับยั้ง CYP2C19 ลดการกระตุ้น clopidogrel",
            "ยับยั้ง CYP2C19 เช่นเดียวกับ omeprazole",
            "Cimetidine ยับยั้ง CYP หลายตัวรวมถึง CYP2C19 และกดกรดได้น้อย",
            "ผู้ป่วยมีความเสี่ยงเลือดออกสูงมาก ควรใช้ PPI ร่วมกับ DAPT",
          ],
          k: "Clopidogrel + PPI → เลือก pantoprazole (หลีกเลี่ยง omeprazole/esomeprazole ที่ยับยั้ง CYP2C19); คนไทยมี CYP2C19 LOF สูง",
        },
        {
          d: "hard",
          p: "หลังครบ 12 เดือน ผู้ป่วยเหลือ aspirin 81 mg ตลอดชีวิต ยังปวดเข่าจากข้อเสื่อมและขอใช้ NSAID แนวทางที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "หลีกเลี่ยง NSAID ชนิดรับประทานทั้งหมด ใช้ paracetamol ร่วมกับ NSAID ชนิดทาและการรักษาไม่ใช้ยา",
            "Naproxen 500 mg BID ร่วมกับ omeprazole",
            "Celecoxib 200 mg BID เดี่ยวๆ ไม่ต้องใช้ PPI",
            "Ibuprofen 400 mg TID ทานก่อน aspirin 2 ชั่วโมง",
            "Diclofenac 75 mg IM เมื่อปวดมาก",
          ],
          a: 0,
          r:
            "หลักการประเมินความเสี่ยง (ACG/Lanza): ต้องประเมินทั้ง GI risk และ CV risk ก่อนใช้ NSAID — ผู้ป่วยรายนี้มี GI risk สูง (เคยเลือดออกจากแผล + อายุ >65 + ใช้ aspirin) และ CV risk สูง (CAD หลัง PCI ต้องใช้ aspirin) ซึ่งเป็นกลุ่มที่แนวทางแนะนำให้หลีกเลี่ยง NSAID (ทั้ง non-selective และ COX-2 inhibitor) โดยสิ้นเชิง\n\n" +
            "เหตุผลของแต่ละความเสี่ยง: NSAID ทุกชนิดเพิ่มความเสี่ยง MI/stroke และ HF exacerbation (ผ่านการยับยั้ง COX-2 → prostacyclin ลด, คั่งน้ำ); celecoxib ลดแผลในกระเพาะได้ แต่ประโยชน์นี้ลดลงมากเมื่อใช้ร่วม aspirin และยังมีความเสี่ยง CV; ibuprofen ยังแย่งจับ COX-1 กับ aspirin ทำให้ฤทธิ์ต้านเกล็ดเลือดของ aspirin ลดลง\n\n" +
            "ทางเลือก: paracetamol (ไม่เกิน 3–4 g/วัน), NSAID ชนิดทาที่ข้อเข่า (ดูดซึมเข้ากระแสเลือดน้อย), การออกกำลังกาย ลดน้ำหนัก กายภาพ, intra-articular steroid เป็นครั้งคราว; ถ้าจำเป็นต้องใช้ NSAID จริงในกลุ่มเสี่ยงต่ำกว่า ให้ใช้ naproxen (CV risk ต่ำสุด) + PPI ขนาดต่ำสุดในระยะสั้นที่สุด\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ร้านยาไทยมักมียาชุดหรือยาแก้ปวดเมื่อยที่มี NSAID ผสม (บางครั้งมี steroid ปน) ต้องซักถามและให้ความรู้ผู้ป่วยกลุ่มนี้",
          w: [
            "ถูก",
            "GI และ CV risk สูงทั้งคู่ แม้มี PPI ก็ยังไม่แนะนำ",
            "ยังมี CV risk และประโยชน์ต่อกระเพาะลดลงเมื่อใช้ร่วม aspirin ต้องใช้ PPI ด้วยถ้าจำเป็นจริง",
            "ยังเสี่ยงเลือดออกและ CV และ ibuprofen รบกวนฤทธิ์ของ aspirin",
            "ฉีดก็ยังเกิดผลต่อกระเพาะและหัวใจเหมือนยาทาน และเสี่ยงฝีจากการฉีด",
          ],
          k: "GI risk สูง + CV risk สูง (ต้องใช้ aspirin) → หลีกเลี่ยง NSAID ทุกชนิด; ใช้ paracetamol + topical NSAID",
        },
      ],
    },
    {
      title: "Ulcerative colitis",
      base:
        "หญิงไทยอายุ 28 ปี ถ่ายเป็นมูกเลือดวันละ 4–5 ครั้ง ปวดเบ่ง ส่องกล้องพบ ulcerative colitis ตั้งแต่ rectum ถึง splenic flexure (left-sided) ความรุนแรงปานกลาง ไม่มีไข้ Hb 11.5 g/dL",
      ref: "ACG Clinical Guideline: Ulcerative Colitis in Adults 2019; AGA Clinical Practice Guidelines on Mild-to-Moderate UC 2019; CPIC Guideline for Thiopurines and TPMT/NUDT15 2018",
      qs: [
        {
          d: "easy",
          p: "การรักษาเริ่มต้นเพื่อให้โรคสงบ (induction) ที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "Mesalazine รับประทาน ≥2–3 g/วัน ร่วมกับ mesalazine เหน็บหรือสวนทางทวารหนัก",
            "Loperamide 2 mg หลังถ่ายเหลวทุกครั้ง",
            "Ciprofloxacin ร่วมกับ metronidazole 14 วัน",
            "Infliximab เป็นยาตัวแรก",
            "Prednisolone ขนาดต่ำ 5 mg/วัน ใช้ต่อเนื่องระยะยาว",
          ],
          a: 0,
          r:
            "กลไก: 5-aminosalicylates (mesalazine/mesalamine) ออกฤทธิ์เฉพาะที่ผนังลำไส้ใหญ่ ยับยั้ง prostaglandin/leukotriene, NF-κB และ free radical ลดการอักเสบของเยื่อบุ\n\n" +
            "การรักษา mild–moderate UC ตามตำแหน่งโรค: proctitis → mesalazine เหน็บ; left-sided → mesalazine สวน (enema) ร่วมกับ mesalazine รับประทาน ≥2–3 g/วัน ซึ่งได้ผลดีกว่ารูปแบบเดียว; extensive → mesalazine รับประทานขนาดสูง ± ทางทวารหนัก. ถ้าไม่ตอบสนองใน 4–8 สัปดาห์จึงเพิ่ม corticosteroid (เช่น budesonide MMX หรือ prednisolone 40 mg/วันแล้วลดขนาด)\n\n" +
            "การรักษาต่อเนื่อง: เมื่อโรคสงบใช้ 5-ASA ต่อเป็น maintenance (ทานวันละครั้งได้ผลเท่าแบ่งทาน ช่วยเรื่อง adherence); steroid ไม่ใช้ระยะยาวเพราะไม่ป้องกันการกำเริบและมี ADR มาก\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: สอนวิธีใช้ยาสวน (นอนตะแคงซ้าย สวนก่อนนอน กลั้นไว้ให้นานที่สุด); ADR ของ mesalazine ที่ต้องติดตาม: interstitial nephritis (ตรวจ SCr ก่อนเริ่มและเป็นระยะ), pancreatitis, อาการท้องเสียแย่ลงช่วงแรก (intolerance)",
          w: [
            "ถูก",
            "ห้ามใช้ antimotility ใน UC ที่กำเริบ เสี่ยง toxic megacolon",
            "UC ไม่ได้เกิดจากการติดเชื้อ ยาปฏิชีวนะไม่ใช่การรักษาหลัก",
            "Biologics ใช้ในรายปานกลาง–รุนแรงที่ไม่ตอบสนองหรือพึ่ง steroid",
            "Steroid ไม่ใช้เป็น maintenance และขนาดต่ำเกินไปสำหรับ induction",
          ],
          k: "Mild–moderate left-sided UC: mesalazine PO ≥2–3 g/วัน + rectal mesalazine; maintenance ด้วย 5-ASA; ติดตาม SCr",
        },
        {
          d: "medium",
          p: "หากแพทย์เลือกใช้ sulfasalazine แทน ข้อใดเป็นคำแนะนำหรือการติดตามที่สำคัญ?",
          o: [
            "ให้ folic acid เสริม เตือนว่าปัสสาวะ/เหงื่ออาจเป็นสีส้มเหลือง และตรวจ CBC เป็นระยะ",
            "ห้ามดื่มน้ำมากเพราะยาจะถูกขับเร็ว",
            "ทานพร้อม calcium carbonate เพื่อเพิ่มการดูดซึม",
            "ไม่ต้องติดตามผลเลือดเพราะยาออกฤทธิ์เฉพาะที่",
            "ใช้ได้อย่างปลอดภัยในผู้ที่แพ้ยากลุ่ม sulfonamide",
          ],
          a: 0,
          r:
            "เภสัชวิทยา: Sulfasalazine = 5-ASA เชื่อมกับ sulfapyridine ด้วย azo bond แบคทีเรียในลำไส้ใหญ่ตัดพันธะปล่อย 5-ASA (ตัวออกฤทธิ์ใน UC) ส่วน sulfapyridine ถูกดูดซึมและเป็นสาเหตุของ ADR ส่วนใหญ่\n\n" +
            "ADR และการติดตาม: (1) ขึ้นกับขนาด: คลื่นไส้ ปวดศีรษะ เบื่ออาหาร (2) ยับยั้งการดูดซึม folate → ให้ folic acid 1 mg/วัน (3) hemolytic anemia โดยเฉพาะใน G6PD deficiency (พบบ่อยในคนไทย) (4) agranulocytosis/leukopenia มักเกิดใน 3 เดือนแรก → ตรวจ CBC และ LFT ทุก 2–4 สัปดาห์ใน 3 เดือนแรกแล้วห่างขึ้น (5) แพ้ยา rash, SJS, DRESS (6) oligospermia/มีบุตรยากในผู้ชาย (กลับคืนได้หลังหยุดยา) (7) ปัสสาวะ ผิวหนัง และคอนแทคเลนส์ติดสีส้มเหลือง (ไม่อันตราย)\n\n" +
            "ข้อห้าม: แพ้ sulfonamide หรือ salicylate\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: sulfasalazine ราคาถูกกว่า mesalazine มากและอยู่ในบัญชียาหลักแห่งชาติ จึงใช้บ่อยในไทย ควรเริ่มขนาดต่ำแล้วค่อยเพิ่ม (เช่น 500 mg BID เพิ่มทุกสัปดาห์) ทานหลังอาหาร และใช้ enteric-coated เพื่อลดอาการทางเดินอาหาร",
          w: [
            "ถูก",
            "ควรดื่มน้ำให้เพียงพอ ลดความเสี่ยง crystalluria",
            "ไม่มีข้อมูลสนับสนุน และไม่ใช่คำแนะนำที่ถูกต้อง",
            "Sulfapyridine ถูกดูดซึมเข้ากระแสเลือด ต้องติดตาม CBC/LFT",
            "ห้ามใช้ในผู้แพ้ sulfonamide",
          ],
          k: "Sulfasalazine: folate supplement, CBC/LFT ช่วง 3 เดือนแรก, ระวัง G6PD deficiency, ปัสสาวะสีส้ม, oligospermia กลับคืนได้",
        },
        {
          d: "hard",
          p: "ต่อมาผู้ป่วยต้องพึ่ง steroid แพทย์จะเริ่ม azathioprine การตรวจใดสำคัญที่สุดก่อนเริ่มยาในผู้ป่วยไทย?",
          o: [
            "ตรวจ genotype ของ NUDT15 (และ TPMT) เพื่อปรับขนาดยา",
            "ตรวจ HLA-B*15:02",
            "ตรวจ HLA-B*58:01",
            "ตรวจ CYP2C9 genotype",
            "ตรวจ G6PD เพียงอย่างเดียว",
          ],
          a: 0,
          r:
            "เภสัชพันธุศาสตร์: Azathioprine → 6-mercaptopurine → เปลี่ยนเป็น thioguanine nucleotides (TGN, ตัวออกฤทธิ์และเป็นพิษต่อไขกระดูก). TPMT ทำลาย 6-MP ไปเป็น metabolite ที่ไม่ออกฤทธิ์ ส่วน NUDT15 ทำลาย TGN ที่ active. ผู้ที่ขาดเอนไซม์ใดเอนไซม์หนึ่งจะมี TGN สะสมสูง เกิด severe myelosuppression ถึงชีวิตได้ในขนาดปกติ\n\n" +
            "ความสำคัญในคนเอเชีย: TPMT variant พบน้อยในคนเอเชีย (~1–3%) แต่ NUDT15 variant (เช่น R139C) พบบ่อย ~10–20% ในคนเอเชียตะวันออกและไทย เป็นสาเหตุหลักของ thiopurine-induced leukopenia ในคนไทย. CPIC แนะนำ: intermediate metabolizer → ลดขนาดเริ่มต้น (30–80% ของขนาดปกติ); poor metabolizer → ลดขนาดลงมาก (~10%) หรือเลือกยาอื่น\n\n" +
            "การติดตามแม้ genotype ปกติ: CBC ทุก 1–2 สัปดาห์ในช่วงแรก แล้วทุก 1–3 เดือน, LFT, ระวัง pancreatitis; ปฏิกิริยาสำคัญ: allopurinol/febuxostat ยับยั้ง xanthine oxidase ทำให้ระดับ 6-MP สูงมาก ต้องลดขนาด azathioprine เหลือ 25–33% หรือหลีกเลี่ยง\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ตัวเลือกอื่นเป็น HLA marker ของยาอื่น — HLA-B*15:02 (carbamazepine/phenytoin → SJS/TEN), HLA-B*58:01 (allopurinol → SCAR) ซึ่งกระทรวงสาธารณสุขไทยแนะนำให้ตรวจก่อนเริ่มยา",
          w: [
            "ถูก",
            "เป็น marker ของ carbamazepine/phenytoin-induced SJS/TEN",
            "เป็น marker ของ allopurinol-induced SCAR",
            "เกี่ยวข้องกับ warfarin/phenytoin",
            "ไม่ใช่ปัจจัยหลักของพิษ azathioprine (G6PD สำคัญกับ sulfasalazine, dapsone, rasburicase)",
          ],
          k: "Thiopurine: ตรวจ NUDT15 (พบบ่อยในคนไทย) + TPMT ก่อนเริ่ม; ห้ามใช้ร่วม allopurinol โดยไม่ลดขนาด; ติดตาม CBC",
        },
      ],
    },
    {
      ref: "ACG Clinical Guideline for the Diagnosis and Management of GERD 2022; PPI prescribing information",
      qs: [
        {
          d: "easy",
          p: "ผู้ป่วย GERD เริ่ม omeprazole 20 mg วันละครั้ง ควรแนะนำให้ทานยาเวลาใดจึงได้ผลดีที่สุด?",
          o: [
            "ก่อนอาหารเช้า 30–60 นาที",
            "หลังอาหารเช้าทันที",
            "ก่อนนอนโดยไม่สัมพันธ์กับมื้ออาหาร",
            "เฉพาะเวลาที่มีอาการแสบร้อนกลางอก",
            "พร้อม antacid ทุกมื้อ",
          ],
          a: 0,
          r:
            "กลไก: PPI เป็น prodrug ที่ต้องถูกกระตุ้นในสภาวะกรดภายใน canaliculi ของ parietal cell แล้วจับกับ H⁺/K⁺-ATPase ที่ทำงานอยู่ (active pump) แบบ irreversible. ปั๊มจะถูกกระตุ้นมากที่สุดหลังรับประทานอาหาร\n\n" +
            "เวลาที่เหมาะสม: ทาน 30–60 นาทีก่อนอาหารมื้อแรกของวัน เพื่อให้ระดับยาในเลือดสูงสุดตรงกับช่วงที่ปั๊มถูกกระตุ้นจากอาหาร ถ้าใช้วันละ 2 ครั้งให้ทานก่อนอาหารเช้าและก่อนอาหารเย็น. ผู้ป่วยที่ \"PPI ไม่ได้ผล\" จำนวนมากเกิดจากทานยาผิดเวลา\n\n" +
            "ระยะเวลาและการลดยา: รักษา 8 สัปดาห์ ถ้าอาการหายควรพยายามลดเป็นขนาดต่ำสุดหรือใช้เมื่อมีอาการ (on-demand) ยกเว้นมี erosive esophagitis รุนแรงหรือ Barrett's esophagus. ADR จากการใช้ระยะยาว: hypomagnesemia, ขาด vitamin B12, เพิ่มความเสี่ยง C. difficile และ pneumonia, กระดูกหัก\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: แคปซูล omeprazole เป็น enteric-coated pellets ห้ามเคี้ยวหรือบด (ถ้ากลืนลำบากแกะผสมน้ำผลไม้ที่เป็นกรดได้); แนะนำการปรับพฤติกรรม: ลดน้ำหนัก ไม่นอนหลังอาหาร 2–3 ชั่วโมง ยกหัวเตียงสูง",
          w: [
            "ถูก",
            "ทานหลังอาหารยาไม่ทันออกฤทธิ์ตรงช่วงที่ปั๊มถูกกระตุ้น",
            "ได้ผลน้อยกว่าเพราะไม่สัมพันธ์กับการกระตุ้นปั๊ม",
            "PPI ออกฤทธิ์ช้า ไม่เหมาะใช้เฉพาะเมื่อมีอาการในช่วงรักษา",
            "Antacid เพิ่ม pH ลดการกระตุ้น PPI ไม่จำเป็นต้องใช้ร่วมทุกมื้อ",
          ],
          k: "PPI: ทาน 30–60 นาทีก่อนอาหารมื้อแรก (กระตุ้นในกรด, จับ active pump); รักษา 8 สัปดาห์แล้วลดเป็นขนาดต่ำสุด",
        },
      ],
    },
    {
      ref: "IDSA 2017 Clinical Practice Guidelines for the Diagnosis and Management of Infectious Diarrhea; ACG Clinical Guideline: Acute Diarrheal Infections in Adults 2016",
      qs: [
        {
          d: "medium",
          p: "ชายอายุ 30 ปี ถ่ายเป็นมูกเลือดวันละ 8 ครั้ง ไข้ 38.8 °C ปวดเบ่ง ขอซื้อยาหยุดถ่าย การจัดการข้อใดเหมาะสมที่สุด?",
          o: [
            "ไม่ให้ loperamide ให้ ORS และส่งพบแพทย์ (มักพิจารณา azithromycin)",
            "ให้ loperamide 4 mg แล้ว 2 mg หลังถ่ายเหลวทุกครั้ง",
            "ให้ diphenoxylate/atropine",
            "ให้ ORS และ loperamide ร่วมกัน ไม่ต้องพบแพทย์",
            "ให้ norfloxacin เป็นยาตัวแรกโดยไม่ต้องประเมินเพิ่ม",
          ],
          a: 0,
          r:
            "การประเมิน: ถ่ายเป็นมูกเลือด + ไข้สูง + ปวดเบ่ง = dysentery (inflammatory diarrhea) จากเชื้อรุกล้ำเยื่อบุลำไส้ เช่น Shigella, Campylobacter, Salmonella, EIEC หรือ Entamoeba\n\n" +
            "เหตุผลที่ห้าม antimotility: loperamide และ diphenoxylate ชะลอการเคลื่อนไหวของลำไส้ ทำให้เชื้อและสารพิษค้างนาน เพิ่มความเสี่ยง toxic megacolon, ไข้นานขึ้น และ HUS ใน STEC (E. coli O157:H7)\n\n" +
            "การรักษา: (1) ทดแทนน้ำและเกลือแร่ด้วย ORS เป็นหลักการสำคัญที่สุด (2) ยาปฏิชีวนะพิจารณาใน dysentery ที่มีไข้สูง — ในประเทศไทย Campylobacter ดื้อ fluoroquinolone สูงมาก (>80%) จึงนิยม azithromycin (500 mg/วัน 3 วัน หรือ 1 g ครั้งเดียว) เป็นตัวเลือกแรก (3) ส่งตรวจอุจจาระเมื่อจำเป็น\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: เภสัชกรร้านยาต้องคัดกรอง red flags ก่อนจ่ายยาหยุดถ่าย: มีเลือดปน ไข้สูง ปวดท้องรุนแรง ขาดน้ำรุนแรง ผู้สูงอายุ/เด็กเล็ก ภูมิคุ้มกันต่ำ ท้องเสียนานกว่า 7 วัน — กลุ่มนี้ควรส่งต่อ",
          w: [
            "ถูก",
            "ห้ามใช้ antimotility ใน bloody diarrhea ที่มีไข้",
            "Antimotility เช่นกัน ห้ามใช้",
            "ห้ามใช้ loperamide และต้องได้รับการประเมิน",
            "ในไทย Campylobacter ดื้อ fluoroquinolone สูงมาก",
          ],
          k: "Dysentery (มูกเลือด + ไข้): ห้าม loperamide; ORS + azithromycin (ไทย: Campylobacter ดื้อ FQ สูง); คัดกรอง red flags ก่อนจ่ายยาหยุดถ่าย",
        },
      ],
    },
    {
      ref: "AGS Beers Criteria 2023; KDIGO 2024 Clinical Practice Guideline for CKD (medication management); Magnesium hydroxide and sodium phosphate enema prescribing information",
      qs: [
        {
          d: "medium",
          p: "หญิงอายุ 80 ปี CKD G4 (eGFR 22) ท้องผูกเรื้อรัง ยาระบายใดควรหลีกเลี่ยงมากที่สุด?",
          o: [
            "Milk of Magnesia (magnesium hydroxide) ทุกวัน และยาสวน sodium phosphate (Fleet)",
            "Lactulose 15 mL ก่อนนอน",
            "Polyethylene glycol (PEG) 17 g/วัน",
            "Senna 2 เม็ดก่อนนอน",
            "Bisacodyl เหน็บเมื่อจำเป็น",
          ],
          a: 0,
          r:
            "หลักการ: ไตเป็นทางขับ magnesium และ phosphate หลัก ผู้ป่วย CKD G4–5 ขับได้ลดลงมาก การใช้ยาที่มี Mg หรือ phosphate จึงเสี่ยงสะสม\n\n" +
            "ความเสี่ยงของแต่ละยา: (1) Magnesium hydroxide/Milk of Magnesia ใช้ประจำ → hypermagnesemia: อ่อนแรง reflex ลด ความดันต่ำ หัวใจเต้นช้า ซึม จนถึงหยุดหายใจ (2) Sodium phosphate enema/oral solution → hyperphosphatemia, hypocalcemia และ acute phosphate nephropathy (ไตวายถาวร) โดยเฉพาะผู้สูงอายุ ขาดน้ำ ใช้ ACEI/ARB/diuretic\n\n" +
            "ทางเลือกที่ปลอดภัย: osmotic laxative ที่ไม่มีอิเล็กโทรไลต์ — PEG (ใช้ได้ดีในผู้สูงอายุ) หรือ lactulose (ราคาถูก แต่ท้องอืด); stimulant (senna, bisacodyl) ใช้ได้; bulk-forming ต้องดื่มน้ำพอและไม่เหมาะกับผู้จำกัดน้ำ; ห้าม mineral oil ในผู้ที่กลืนลำบากหรือติดเตียงเพราะเสี่ยงสำลักเกิด lipoid pneumonia\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ผู้สูงอายุไทยมักซื้อ Milk of Magnesia หรือยาสวนจากร้านยาเอง ต้องถามโรคไตก่อนจ่ายเสมอ และทบทวนยาที่ทำให้ท้องผูก (opioid, anticholinergic, calcium/iron, CCB เช่น verapamil)",
          w: [
            "ถูก",
            "ใช้ได้ ไม่มีอิเล็กโทรไลต์สะสม",
            "ใช้ได้ดีในผู้สูงอายุ",
            "ใช้ได้",
            "ใช้ได้เมื่อจำเป็น",
          ],
          k: "CKD G4–5: หลีกเลี่ยงยาระบายที่มี Mg (MOM) และ phosphate (Fleet) → ใช้ PEG, lactulose, senna, bisacodyl",
        },
      ],
    },
  ],
  heme: [
    {
      title: "Iron deficiency anemia from menorrhagia",
      base:
        "หญิงไทยอายุ 32 ปี น้ำหนัก 50 kg ประจำเดือนมามากมา 1 ปี อ่อนเพลีย เหนื่อยง่าย Hb 9.0 g/dL, MCV 68 fL, ferritin 8 ng/mL, TSAT 6% " +
        "Hb electrophoresis ปกติ ไม่มีโรคประจำตัวอื่น",
      ref: "BSG Guidelines for the Management of Iron Deficiency Anaemia in Adults 2021; Stoffel NU et al. Lancet Haematol 2017/2020 (alternate-day iron); Ferric carboxymaltose/iron sucrose prescribing information",
      qs: [
        {
          d: "easy",
          p: "คำแนะนำการใช้ ferrous sulfate ชนิดรับประทานข้อใดถูกต้องที่สุด?",
          o: [
            "ทานวันละ 1 เม็ด (ธาตุเหล็ก ~60 mg) ตอนท้องว่างหรือพร้อมน้ำส้ม หลีกเลี่ยงชา กาแฟ นม และยาลดกรดในช่วงเวลาใกล้เคียง",
            "ทานพร้อมนมเพื่อลดการระคายกระเพาะ",
            "ทานวันละ 3–4 เม็ดเพื่อให้หายเร็วขึ้น",
            "หยุดยาทันทีถ้าอุจจาระเป็นสีดำ",
            "ทานพร้อม calcium carbonate เพื่อบำรุงกระดูกไปพร้อมกัน",
          ],
          a: 0,
          r:
            "การดูดซึมธาตุเหล็ก: ดูดซึมที่ duodenum ในรูป Fe²⁺ ได้ดีในสภาวะกรด vitamin C ช่วยรักษารูป ferrous และเพิ่มการดูดซึม ส่วนชา กาแฟ (tannin) นม calcium antacid PPI และยาบางชนิด (tetracycline, quinolone, levothyroxine) ลดการดูดซึม\n\n" +
            "ขนาดยาตามหลักฐานใหม่: การทานเหล็กกระตุ้นการหลั่ง hepcidin จากตับซึ่งลดการดูดซึมเหล็กในอีก 24–48 ชั่วโมง การให้ขนาดสูงหรือหลายครั้งต่อวันจึงไม่เพิ่มการดูดซึมแต่เพิ่ม ADR. แนวทางปัจจุบัน (BSG 2021) แนะนำธาตุเหล็ก 40–80 mg วันละครั้ง หรือวันเว้นวัน ซึ่งดูดซึมได้ดีกว่าและผู้ป่วยทนได้ดีกว่า\n\n" +
            "ADR และการแนะนำ: คลื่นไส้ ปวดท้อง ท้องผูก/ท้องเสีย อุจจาระสีดำ (ไม่อันตราย ต้องแยกจาก melena ซึ่งเหนียวและมีกลิ่นเหม็น) ถ้าทนไม่ได้ให้ทานพร้อมอาหารหรือลดเป็นวันเว้นวัน ดีกว่าหยุดยา\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ต้องหาและแก้สาเหตุการเสียเลือดร่วมด้วย (ส่งพบสูตินรีแพทย์เรื่องประจำเดือนมามาก); เก็บยาให้พ้นมือเด็กเพราะเหล็กเกินขนาดเป็นพิษรุนแรงในเด็ก",
          w: [
            "ถูก",
            "Calcium ในนมลดการดูดซึมเหล็ก",
            "ขนาดสูงเพิ่ม hepcidin ไม่เพิ่มการดูดซึม แต่เพิ่ม ADR",
            "อุจจาระดำจากเหล็กเป็นเรื่องปกติ ไม่ต้องหยุดยา",
            "Calcium ลดการดูดซึมเหล็ก ควรแยกเวลาอย่างน้อย 2 ชั่วโมง",
          ],
          k: "Oral iron: ธาตุเหล็ก 40–80 mg วันละครั้งหรือวันเว้นวัน (hepcidin), ท้องว่าง/vitamin C, เลี่ยงชา กาแฟ นม Ca antacid",
        },
        {
          d: "medium",
          p: "ferrous sulfate (FeSO₄·7H₂O) 300 mg 1 เม็ด มีธาตุเหล็ก (elemental iron) ประมาณเท่าใด?",
          o: ["30 mg", "60 mg", "100 mg", "150 mg", "300 mg"],
          a: 1,
          r:
            "หลักการ: ขนาดยาเหล็กต้องคิดจากธาตุเหล็ก (elemental iron) ไม่ใช่น้ำหนักเกลือ เพราะแต่ละเกลือมีสัดส่วนเหล็กต่างกัน\n\n" +
            "สัดส่วนธาตุเหล็กโดยประมาณ: ferrous sulfate heptahydrate ~20% (300 mg → 60 mg; เม็ดที่ใช้ในไทยส่วนใหญ่); dried ferrous sulfate ~30–33% (200 mg → 65 mg); ferrous fumarate ~33% (200 mg → 66 mg); ferrous gluconate ~12% (300 mg → 35 mg)\n\n" +
            "การนำไปใช้: เป้าหมายธาตุเหล็ก 40–80 mg/วัน → ferrous sulfate 300 mg 1 เม็ดวันละครั้งเพียงพอสำหรับผู้ใหญ่ส่วนใหญ่ (หรือวันเว้นวัน 1–2 เม็ด)\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ในการให้คำปรึกษาหรือเปลี่ยนผลิตภัณฑ์ (เช่น จากยาบัญชียาหลักเป็นวิตามินรวมที่มีเหล็ก) ต้องเทียบเป็นธาตุเหล็ก ผลิตภัณฑ์เสริมอาหารหลายชนิดมีเหล็กน้อยเกินไปสำหรับการรักษาภาวะขาดเหล็ก",
          c: ["FeSO₄·7H₂O มีธาตุเหล็ก ~20% โดยน้ำหนัก", "300 mg × 0.20 = 60 mg elemental iron"],
          w: ["คิดสัดส่วนต่ำเกินไป", "ถูก", "สูงเกินจริง", "สูงเกินจริง", "เป็นน้ำหนักเกลือ ไม่ใช่ธาตุเหล็ก"],
          k: "Elemental iron: FeSO₄·7H₂O ~20% (300 mg = 60 mg), ferrous fumarate ~33%, ferrous gluconate ~12%",
        },
        {
          d: "medium",
          p: "การติดตามผลการรักษาด้วยธาตุเหล็กชนิดรับประทานข้อใดถูกต้อง?",
          o: [
            "Reticulocyte เพิ่มใน 7–10 วัน Hb ควรเพิ่ม ~1–2 g/dL ใน 2–4 สัปดาห์ และให้ยาต่ออีกประมาณ 3 เดือนหลัง Hb ปกติ",
            "Hb ต้องกลับเป็นปกติภายใน 3 วัน",
            "หยุดยาทันทีเมื่อ Hb กลับเป็นปกติ",
            "Ferritin จะลดลงระหว่างการรักษา",
            "ประเมินผลครั้งแรกหลังใช้ยา 1 ปี",
          ],
          a: 0,
          r:
            "ลำดับการตอบสนอง: ไขกระดูกได้รับเหล็ก → reticulocyte เริ่มเพิ่มใน 3–5 วัน สูงสุด 7–10 วัน → Hb เพิ่มประมาณ 1–2 g/dL ในทุก 2–4 สัปดาห์ (ถ้า Hb ไม่เพิ่มอย่างน้อย 1–2 g/dL ใน 4 สัปดาห์ ถือว่าตอบสนองไม่ดี) → Hb กลับปกติมักใน 6–8 สัปดาห์\n\n" +
            "การเติมคลังเหล็ก: หลัง Hb ปกติต้องให้ต่ออีก ~3 เดือน เพื่อเติม ferritin (เป้าหมาย >50–100 ng/mL) ป้องกันการกลับเป็นซ้ำ\n\n" +
            "สาเหตุที่ตอบสนองไม่ดี: ไม่ได้ทานยา/ทานผิดวิธี เสียเลือดต่อเนื่อง การดูดซึมผิดปกติ (celiac, H. pylori, หลังผ่าตัดกระเพาะ, ใช้ PPI) การวินิจฉัยผิด (เช่น thalassemia trait ซึ่งพบบ่อยในไทย — MCV ต่ำแต่ ferritin ปกติ) หรือมีโรคเรื้อรังร่วม — ถ้าแก้ไม่ได้พิจารณา IV iron\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ในไทยต้องแยก iron deficiency จาก thalassemia trait ก่อนจ่ายเหล็กระยะยาว เพราะการให้เหล็กในผู้ที่ไม่ขาดเหล็กเสี่ยง iron overload",
          w: ["ถูก", "Hb เพิ่มช้ากว่านี้มาก", "ต้องเติมคลังเหล็กต่อ ~3 เดือน", "Ferritin ควรเพิ่มขึ้น", "ควรประเมินที่ 2–4 สัปดาห์"],
          k: "Oral iron response: retic สูงสุด 7–10 วัน, Hb ↑1–2 g/dL ใน 2–4 สัปดาห์, ให้ต่อ ~3 เดือนหลัง Hb ปกติ; ไม่ตอบสนอง → หาสาเหตุ/แยก thalassemia",
        },
        {
          d: "hard",
          p: "ผู้ป่วยทนยาเหล็กชนิดรับประทานไม่ได้ แพทย์จะให้ iron sucrose ทางหลอดเลือดดำ ปริมาณธาตุเหล็กรวมที่ต้องให้ (Ganzoni formula, target Hb 15 g/dL, iron stores 500 mg) ใกล้เคียงข้อใด?",
          o: ["820 mg", "1,020 mg", "1,220 mg", "1,520 mg", "1,720 mg"],
          a: 2,
          r:
            "สูตร Ganzoni: Total iron deficit (mg) = น้ำหนัก (kg) × [Hb เป้าหมาย − Hb จริง] (g/dL) × 2.4 + iron stores (mg). ค่า 2.4 มาจาก blood volume ~7% ของน้ำหนักตัว × ปริมาณเหล็กใน Hb 0.34% × 10; iron stores 500 mg สำหรับผู้ที่หนัก >35 kg\n\n" +
            "การคำนวณ: 50 × (15 − 9) × 2.4 = 720 mg สำหรับแก้ Hb + 500 mg สำหรับคลังเหล็ก = 1,220 mg\n\n" +
            "การให้ iron sucrose: ให้ครั้งละไม่เกิน 200 mg (หยดใน NSS) สูงสุด 3 ครั้ง/สัปดาห์ ผู้ป่วยรายนี้ต้องใช้ประมาณ 6 ครั้ง; ferric carboxymaltose ให้ได้ครั้งละ 750–1,000 mg (จำนวนครั้งน้อยกว่า แต่เสี่ยง hypophosphatemia). ข้อบ่งใช้ IV iron: ทนยาทานไม่ได้ ดูดซึมไม่ได้ ไม่ตอบสนอง ต้องการแก้เร็ว (เช่น ตั้งครรภ์ไตรมาส 3, ก่อนผ่าตัด) CKD\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: เฝ้าระวัง hypersensitivity ระหว่างและหลังให้ยาอย่างน้อย 30 นาที (เตรียมยาฉุกเฉินพร้อม), หยดช้าตามขนาด, ระวังยารั่วออกนอกหลอดเลือดทำให้ผิวคล้ำถาวร; ห้ามให้ร่วมกับเหล็กชนิดรับประทานในช่วงเดียวกันเพราะลดการดูดซึมและไม่จำเป็น",
          c: [
            "Total iron deficit = Wt × (Hb target − Hb actual) × 2.4 + iron stores",
            "= 50 × (15 − 9) × 2.4 + 500",
            "= 720 + 500 = 1,220 mg",
          ],
          w: ["ลืมบวกหรือคิดคลังเหล็กผิด", "คำนวณ Hb deficit ผิด", "ถูก", "ใช้ target Hb หรือค่าคงที่ผิด", "สูงเกินจริง"],
          k: "Ganzoni: Wt × ΔHb × 2.4 + 500 mg; iron sucrose ครั้งละ ≤200 mg; เฝ้าระวัง hypersensitivity ≥30 นาที",
        },
      ],
    },
    {
      title: "Breast cancer receiving doxorubicin/cyclophosphamide (AC)",
      base:
        "หญิงไทยอายุ 45 ปี น้ำหนัก 55 kg พื้นที่ผิวกาย 1.6 m² มะเร็งเต้านมระยะที่ 2 จะได้รับเคมีบำบัด doxorubicin 60 mg/m² + cyclophosphamide 600 mg/m² ทุก 3 สัปดาห์ 4 รอบ. " +
        "LVEF ก่อนเริ่ม 62% ไม่มีโรคหัวใจ",
      ref: "NCCN Guidelines: Antiemesis 2025; MASCC/ESMO Antiemetic Guideline 2023; ASCO Guideline: Management of Cardiac Dysfunction in Adult Cancer Survivors; IDSA/ASCO Guideline: Outpatient Management of Fever and Neutropenia",
      qs: [
        {
          d: "easy",
          p: "การป้องกันคลื่นไส้อาเจียนจากเคมีบำบัดวันแรก (acute CINV) ที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "Aprepitant + ondansetron + dexamethasone (± olanzapine)",
            "Metoclopramide 10 mg อย่างเดียว",
            "Ondansetron อย่างเดียว",
            "Domperidone + dimenhydrinate",
            "Lorazepam อย่างเดียว",
          ],
          a: 0,
          r:
            "การจัดระดับ: สูตร anthracycline + cyclophosphamide (AC) ในหญิงมะเร็งเต้านมจัดเป็น highly emetogenic chemotherapy (HEC, >90% เกิดอาเจียนถ้าไม่ป้องกัน) ผู้ป่วยหญิงอายุน้อยยังมีความเสี่ยงสูงขึ้น\n\n" +
            "สูตรป้องกัน (NCCN/MASCC-ESMO): 4 ยาร่วมกันในวันที่ 1 — NK1 receptor antagonist (aprepitant 125 mg วันที่ 1 แล้ว 80 mg วันที่ 2–3 หรือ fosaprepitant IV) + 5-HT3 antagonist (ondansetron, palonosetron) + dexamethasone + olanzapine 5–10 mg; สำหรับ AC อาจไม่ต้องให้ dexamethasone ต่อวันที่ 2–4\n\n" +
            "กลไก: acute CINV (ภายใน 24 ชั่วโมง) ขับเคลื่อนด้วย serotonin จาก enterochromaffin cells → 5-HT3; delayed CINV (2–5 วัน) ขับเคลื่อนด้วย substance P → NK1 receptor; dexamethasone และ olanzapine เสริมทั้งสองระยะ\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: aprepitant เป็น moderate CYP3A4 inhibitor ต้องลดขนาด dexamethasone ทางปากลง ~50% เมื่อใช้ร่วม และลดประสิทธิภาพยาคุมฮอร์โมนนานถึง 1 เดือน (warfarin INR ลดลง); olanzapine ทำให้ง่วง ให้ก่อนนอน; ondansetron ระวัง QT ยาวและท้องผูก",
          w: [
            "ถูก",
            "ได้ผลน้อยใน HEC และเสี่ยง EPS",
            "ไม่พอสำหรับ HEC และไม่ครอบคลุม delayed phase",
            "ไม่ใช่สูตรมาตรฐานสำหรับ CINV",
            "ใช้เสริมใน anticipatory nausea เท่านั้น",
          ],
          k: "AC = HEC → NK1 RA + 5-HT3 RA + dexamethasone + olanzapine; aprepitant ลดขนาด dexamethasone และลดประสิทธิภาพยาคุม",
        },
        {
          d: "medium",
          p: "ข้อใดเกี่ยวกับพิษต่อหัวใจของ doxorubicin ถูกต้องที่สุด?",
          o: [
            "ความเสี่ยงสัมพันธ์กับขนาดยาสะสม ควรตรวจ LVEF ก่อนเริ่มและระหว่างรักษา และหลีกเลี่ยงขนาดสะสมเกิน ~450–550 mg/m²",
            "ไม่ขึ้นกับขนาดยาสะสม ไม่ต้องติดตาม",
            "เกิดเฉพาะในวันที่ให้ยาเท่านั้น",
            "ป้องกันได้ด้วย digoxin ขนาดต่ำ",
            "ใช้ร่วมกับ trastuzumab ได้โดยไม่เพิ่มความเสี่ยง",
          ],
          a: 0,
          r:
            "กลไก: Anthracycline เกิด reactive oxygen species (ผ่าน iron complex) และยับยั้ง topoisomerase IIβ ในเซลล์กล้ามเนื้อหัวใจ ทำให้เซลล์ตายแบบสะสม เกิด dilated cardiomyopathy และ heart failure ซึ่งมักเป็นถาวร อาจเกิดได้หลายปีหลังได้ยา\n\n" +
            "ความเสี่ยงตามขนาดสะสม: doxorubicin สะสม 400 mg/m² เสี่ยง HF ~5%, 550 mg/m² ~26%; ขีดจำกัดทั่วไป 450–550 mg/m² (ต่ำกว่านี้ถ้ามีปัจจัยเสี่ยง: อายุ >65, ฉายรังสีบริเวณหัวใจ, โรคหัวใจเดิม, ได้ trastuzumab ร่วม). ผู้ป่วยรายนี้ได้ 60 mg/m² × 4 = 240 mg/m² ยังต่ำกว่าเกณฑ์\n\n" +
            "การติดตามและป้องกัน: ตรวจ LVEF (echocardiography/MUGA) ก่อนเริ่ม และเมื่อมีอาการหรือตามขนาดสะสม; LVEF ลด >10% จนต่ำกว่า 50% ต้องพิจารณาหยุดยา. Dexrazoxane (iron chelator) ลดพิษต่อหัวใจในผู้ที่ต้องได้ขนาดสะสมสูง; การหยดยานานขึ้นและ liposomal doxorubicin ลดพิษเช่นกัน\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: เภสัชกรมะเร็งต้องบันทึกขนาดสะสมตลอดชีวิตของผู้ป่วย (รวมจากโรงพยาบาลอื่น); doxorubicin เป็น vesicant รุนแรง ถ้ารั่วนอกหลอดเลือดให้ประคบเย็นและใช้ dexrazoxane; ปัสสาวะสีแดง 1–2 วันหลังได้ยาเป็นเรื่องปกติ",
          w: [
            "ถูก",
            "Cardiotoxicity สัมพันธ์กับขนาดสะสมชัดเจน",
            "ส่วนใหญ่เป็นพิษเรื้อรังที่เกิดภายหลังได้หลายเดือนถึงปี",
            "ไม่มีหลักฐาน",
            "Trastuzumab เพิ่มความเสี่ยง cardiotoxicity มาก ไม่ควรให้พร้อมกัน",
          ],
          k: "Doxorubicin: cardiotoxicity ตามขนาดสะสม (จำกัด ~450–550 mg/m²), ตรวจ LVEF, dexrazoxane ป้องกัน; vesicant",
        },
        {
          d: "hard",
          p: "10 วันหลังเคมีบำบัดรอบแรก ผู้ป่วยมีไข้ 38.6 °C ANC 300 cells/µL BP 112/70 mmHg ไม่มีอาการติดเชื้อเฉพาะที่ การจัดการที่เหมาะสมที่สุดคือข้อใด?",
          o: [
            "เพาะเชื้อในเลือดแล้วให้ antipseudomonal β-lactam เช่น ceftazidime, cefepime หรือ piperacillin/tazobactam ภายใน 1 ชั่วโมง",
            "ให้ paracetamol ลดไข้แล้วนัดติดตาม 1 สัปดาห์",
            "รอผลเพาะเชื้อ 48 ชั่วโมงก่อนเริ่มยาปฏิชีวนะ",
            "ให้ vancomycin อย่างเดียว",
            "ให้ G-CSF อย่างเดียวโดยไม่ให้ยาปฏิชีวนะ",
          ],
          a: 0,
          r:
            "นิยาม: Febrile neutropenia = ไข้ ≥38.3 °C ครั้งเดียว หรือ ≥38.0 °C นาน 1 ชั่วโมง ร่วมกับ ANC <500 (หรือคาดว่าจะลดลงต่ำกว่า 500 ใน 48 ชั่วโมง) เป็น oncologic emergency เพราะการติดเชื้อลุกลามเร็วมาก อาการแสดงของการอักเสบอาจไม่ชัดเพราะไม่มีเม็ดเลือดขาว\n\n" +
            "การรักษา: เพาะเชื้อในเลือด ≥2 ขวด แล้วเริ่ม empirical antipseudomonal β-lactam monotherapy ภายใน 60 นาที (cefepime, ceftazidime, piperacillin/tazobactam หรือ carbapenem ตามระบาดวิทยาของโรงพยาบาล) เพราะ Pseudomonas และ gram-negative ทำให้เสียชีวิตเร็ว; เพิ่ม vancomycin เฉพาะเมื่อมีข้อบ่งชี้ (hemodynamic instability, สงสัย catheter infection, skin/soft tissue infection, ปอดอักเสบ, MRSA colonization)\n\n" +
            "ประเมินความเสี่ยง: ใช้ MASCC score เพื่อพิจารณาว่าผู้ป่วยความเสี่ยงต่ำบางรายรักษาแบบผู้ป่วยนอกด้วย ciprofloxacin + amoxicillin/clavulanate ได้หรือไม่\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ปรับขนาดยาปฏิชีวนะตามไตและใช้ extended infusion สำหรับ β-lactam ได้; ผู้ป่วยที่ได้ AC ในรอบถัดไปอาจได้รับ G-CSF ป้องกัน (primary/secondary prophylaxis เมื่อความเสี่ยง FN ≥20%) เช่น filgrastim หรือ pegfilgrastim — ADR ปวดกระดูก",
          w: [
            "ถูก",
            "FN เป็นภาวะฉุกเฉิน การล่าช้าเพิ่มการเสียชีวิต",
            "ต้องเริ่มยาภายใน 1 ชั่วโมง ไม่รอผลเพาะเชื้อ",
            "ไม่ครอบคลุม gram-negative/Pseudomonas และไม่ใช่ยาตัวแรก",
            "G-CSF ไม่ใช่การรักษาการติดเชื้อ",
          ],
          k: "Febrile neutropenia: blood culture + antipseudomonal β-lactam ภายใน 60 นาที; vancomycin เฉพาะข้อบ่งชี้; MASCC score; G-CSF prophylaxis",
        },
      ],
    },
    {
      ref: "CHEST Guideline: Antithrombotic Therapy for VTE Disease; Warfarin patient education (สมาคมโรคหัวใจแห่งประเทศไทย)",
      qs: [
        {
          d: "easy",
          p: "ผู้ป่วยเริ่มใช้ warfarin ถามว่าต้องงดผักใบเขียวทั้งหมดหรือไม่ คำแนะนำใดเหมาะสมที่สุด?",
          o: [
            "ไม่ต้องงด แต่ควรรับประทานผักใบเขียวในปริมาณสม่ำเสมอใกล้เคียงกันทุกสัปดาห์ และแจ้งก่อนใช้สมุนไพรหรืออาหารเสริม",
            "งดผักใบเขียวทุกชนิดตลอดชีวิต",
            "ทานผักใบเขียวมากๆ เพื่อป้องกันเลือดออก",
            "ทานได้เฉพาะวันที่ไม่ได้ทานยา",
            "ผักไม่มีผลต่อ warfarin เลย",
          ],
          a: 0,
          r:
            "กลไก: Warfarin ยับยั้ง vitamin K epoxide reductase (VKORC1) ทำให้ตับสร้าง clotting factor II, VII, IX, X ที่ทำงานได้ลดลง vitamin K จากอาหารจึงต้านฤทธิ์ warfarin — การเปลี่ยนปริมาณ vitamin K อย่างมากทำให้ INR แกว่ง\n\n" +
            "หลักการให้คำแนะนำ: ไม่ต้องงดผัก (เพราะมีประโยชน์และการงดแล้วกลับมาทานทำให้ INR ลดฮวบ) แต่ให้ทานในปริมาณสม่ำเสมอ แพทย์จะปรับขนาดยาตามพฤติกรรมการกินที่คงที่. ผักที่มี vitamin K สูง: คะน้า ผักโขม บรอกโคลี ผักกาดเขียว ตำลึง ใบชะพลู\n\n" +
            "สิ่งที่เพิ่มความเสี่ยงในบริบทไทย: สมุนไพรและอาหารเสริม เช่น ขิง กระเทียมสกัด แปะก๊วย โสม ตังกุย น้ำมันปลา ขมิ้นชัน เพิ่มความเสี่ยงเลือดออก; แอลกอฮอล์; ยาที่ซื้อเอง เช่น NSAIDs, aspirin\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: สอนอาการเลือดออกผิดปกติ (เลือดออกตามไรฟัน จ้ำเลือด ปัสสาวะ/อุจจาระมีเลือด) และอาการลิ่มเลือด, ทานยาเวลาเดิมทุกวัน, ใช้สมุดบันทึก INR, ห้ามตั้งครรภ์ (teratogen)",
          w: [
            "ถูก",
            "การงดทำให้ INR แกว่งเมื่อกลับมาทาน และเสียประโยชน์ทางโภชนาการ",
            "Vitamin K ปริมาณมากทำให้ warfarin ได้ผลลดลง เสี่ยงลิ่มเลือด",
            "Warfarin ต้องทานทุกวัน",
            "Vitamin K ในผักมีผลต่อ warfarin ชัดเจน",
          ],
          k: "Warfarin: ทานผักใบเขียวสม่ำเสมอ ไม่ต้องงด; ระวังสมุนไพร/อาหารเสริม (ขิง กระเทียม แปะก๊วย ตังกุย น้ำมันปลา) และ NSAIDs",
        },
      ],
    },
    {
      ref: "Coiffier B et al. Guidelines for the management of pediatric and adult tumor lysis syndrome (J Clin Oncol 2008); Rasburicase prescribing information (boxed warning)",
      qs: [
        {
          d: "medium",
          p: "ชายไทยอายุ 40 ปี Burkitt lymphoma ก้อนใหญ่ uric acid 9.5 mg/dL LDH สูงมาก จะเริ่มเคมีบำบัด ตรวจพบ G6PD deficiency การป้องกัน tumor lysis syndrome ข้อใดเหมาะสมที่สุด?",
          o: [
            "ให้สารน้ำปริมาณมาก ร่วมกับ allopurinol (หลีกเลี่ยง rasburicase)",
            "ให้ rasburicase 0.2 mg/kg IV",
            "ให้ sodium bicarbonate ทำให้ปัสสาวะเป็นด่างอย่างเดียว",
            "จำกัดน้ำเพื่อป้องกันน้ำเกิน",
            "ให้ colchicine ป้องกัน",
          ],
          a: 0,
          r:
            "พยาธิสรีรวิทยา: เคมีบำบัดทำลายเซลล์มะเร็งที่โตเร็วจำนวนมาก (เช่น Burkitt lymphoma, ALL, AML ที่ WBC สูง) ปล่อย K, phosphate และ nucleic acid (→ uric acid) ออกมา เกิด hyperkalemia, hyperphosphatemia, hypocalcemia, hyperuricemia และ AKI จากผลึกตกตะกอนในท่อไต\n\n" +
            "การป้องกันตามความเสี่ยง: (1) สารน้ำ IV ปริมาณมาก 2–3 L/m²/วัน ให้ปัสสาวะ ≥100 mL/h (2) ลด uric acid: allopurinol (xanthine oxidase inhibitor ลดการสร้างใหม่ ไม่ลด uric acid ที่มีอยู่แล้ว เริ่ม 1–2 วันก่อนเคมีบำบัด) หรือ rasburicase (recombinant urate oxidase เปลี่ยน uric acid เป็น allantoin ที่ละลายน้ำ ลดระดับเร็ว เหมาะกับผู้ที่เสี่ยงสูงหรือ uric acid สูงอยู่แล้ว)\n\n" +
            "ทำไมห้าม rasburicase ใน G6PD deficiency: rasburicase ทำให้เกิด hydrogen peroxide เป็นผลพลอยได้ ผู้ขาด G6PD ไม่สามารถกำจัด oxidative stress ได้ เกิด hemolysis รุนแรงและ methemoglobinemia (boxed warning — ต้องคัดกรอง G6PD ก่อนให้). G6PD deficiency พบในชายไทย ~10–15% จึงสำคัญมากในบริบทไทย\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: ไม่แนะนำ urine alkalinization เป็นประจำแล้ว เพราะเพิ่มการตกตะกอน calcium phosphate; ถ้าใช้ allopurinol ร่วม azathioprine/6-MP ต้องลดขนาด thiopurine; ปรับขนาด allopurinol ตามไต",
          w: [
            "ถูก",
            "ห้ามใช้ใน G6PD deficiency เสี่ยง hemolysis และ methemoglobinemia รุนแรง",
            "ไม่แนะนำแล้ว เพิ่มการตกตะกอน calcium phosphate",
            "การจำกัดน้ำเพิ่มความเสี่ยงไตวายเฉียบพลัน",
            "ไม่มีบทบาทในการป้องกัน TLS",
          ],
          k: "TLS prevention: hydration + allopurinol หรือ rasburicase; ห้าม rasburicase ใน G6PD deficiency (ชายไทยพบ ~10–15%)",
        },
      ],
    },
    {
      ref: "Thalassemia International Federation (TIF) Guidelines for the Management of Transfusion Dependent Thalassaemia 2021; Deferiprone (GPO-L-ONE) prescribing information",
      qs: [
        {
          d: "medium",
          p: "ผู้ป่วยวัยรุ่นเป็น β-thalassemia/HbE ต้องรับเลือดสม่ำเสมอ ferritin 2,800 ng/mL เริ่มใช้ deferiprone (GPO-L-ONE) การติดตามที่สำคัญที่สุดคือข้อใด?",
          o: [
            "ตรวจ absolute neutrophil count ทุกสัปดาห์ และหยุดยาทันทีเมื่อมีไข้หรือเจ็บคอ",
            "ตรวจ INR ทุกเดือน",
            "ตรวจระดับยาในเลือดทุกวัน",
            "ตรวจการได้ยินทุกวัน",
            "ไม่ต้องติดตามเพราะเป็นยาทานที่ปลอดภัย",
          ],
          a: 0,
          r:
            "บริบทไทย: Thalassemia เป็นโรคทางพันธุกรรมที่พบมากที่สุดในไทย ผู้ป่วยที่ต้องรับเลือดประจำมีภาวะเหล็กเกินจนทำลายหัวใจ ตับ และต่อมไร้ท่อ ต้องใช้ยาขับเหล็ก. Deferiprone ชนิดรับประทานผลิตโดยองค์การเภสัชกรรม (GPO-L-ONE) ราคาถูกจึงใช้แพร่หลาย และขับเหล็กจากหัวใจได้ดี\n\n" +
            "ADR สำคัญ: agranulocytosis (ANC <500, พบ ~1%) และ neutropenia (~5%) มักเกิดในปีแรก อาจถึงชีวิตจากการติดเชื้อ → ตรวจ ANC ทุกสัปดาห์ (บางแนวทางห่างได้เมื่อใช้นานและคงที่) สอนผู้ป่วยหยุดยาทันทีและมาโรงพยาบาลเมื่อมีไข้ เจ็บคอ หรืออาการติดเชื้อ. ADR อื่น: ปวดข้อ คลื่นไส้ ปัสสาวะสีแดงน้ำตาล (เหล็กที่ถูกขับ) ขาด zinc ค่าตับสูง\n\n" +
            "ยาขับเหล็กอื่นและ ADR ที่ต้องติดตาม: deferoxamine (ฉีด SC ใต้ผิวหนังด้วยเครื่อง 8–12 ชั่วโมง; พิษต่อตาและหู → ตรวจการได้ยินและตาเป็นระยะ, เสี่ยง Yersinia infection); deferasirox (ทาน; พิษต่อไตและตับ, GI bleeding → ตรวจ SCr, LFT)\n\n" +
            "ข้อควรรู้สำหรับเภสัชกร: vitamin C เพิ่มการขับเหล็กของ deferoxamine แต่ให้เสริมขนาดต่ำเท่านั้น; ผู้ป่วยธาลัสซีเมียไม่ควรได้ยาบำรุงเลือดที่มีธาตุเหล็ก (ควรใช้ folic acid อย่างเดียว) — ร้านยาต้องระวังการจ่ายยาบำรุงเลือดที่มีเหล็ก",
          w: [
            "ถูก",
            "ไม่เกี่ยวข้อง",
            "ไม่จำเป็นในทางปฏิบัติ",
            "เป็นการติดตามของ deferoxamine (และไม่ต้องทุกวัน)",
            "Agranulocytosis อาจถึงชีวิต ต้องติดตาม ANC",
          ],
          k: "Deferiprone (GPO-L-ONE): ANC ทุกสัปดาห์ (agranulocytosis), หยุดยาเมื่อมีไข้; deferoxamine: ตา/หู; deferasirox: ไต/ตับ; ธาลัสซีเมียห้ามยาบำรุงที่มีเหล็ก",
        },
      ],
    },
  ],
};
