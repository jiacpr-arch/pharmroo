import type { McqQuestion } from "@/lib/types-mcq";

type Difficulty = "easy" | "medium" | "hard";
type Draft = {
  topic: string;
  prompt: string;
  options: [string, string, string, string, string]; // correct answer first
  rationale: string;
  traps: [string, string, string, string]; // reasons the four distractors are not best
  difficulty: Difficulty;
  ref: string;
  calc?: string[];
};

const labels = ["ก", "ข", "ค", "ง", "จ"] as const;

// Ten balanced permutations: each answer label appears exactly 10 times across 50 questions.
const answerPositions = [
  1,3,0,4,2, 2,0,4,1,3,
  4,2,1,0,3, 3,1,4,2,0,
  0,4,3,1,2, 1,2,0,3,4,
  2,3,4,0,1, 4,0,1,2,3,
  3,2,1,4,0, 1,4,2,3,0,
];

const D: Draft[] = [
  {
    topic:"Biopharmaceutics / BCS",
    prompt:"Drug A มี aqueous solubility ต่ำ แต่มี intestinal permeability สูง หากพัฒนาเป็น immediate-release tablet ปัจจัยใดมีแนวโน้มเป็น rate-limiting step ต่อการดูดซึมมากที่สุด?",
    options:["การละลายของตัวยาจาก dosage form","การซึมผ่านเยื่อบุลำไส้","การจับกับ plasma protein","การขับออกทางไต","hepatic extraction หลังดูดซึม"],
    rationale:"ลักษณะ low solubility + high permeability สอดคล้องกับ BCS class II ซึ่งขั้นที่มักจำกัดการดูดซึมคือ dissolution/solubilization ไม่ใช่ permeability.",
    traps:["Permeability สูงอยู่แล้วจึงไม่ใช่ข้อจำกัดหลักของโจทย์","Protein binding เป็น PK หลังการดูดซึม ไม่ใช่ขั้นจำกัดการละลายจากเม็ดยา","Renal clearance มีผลต่อ systemic exposure หลังดูดซึม","Hepatic extraction มีผลต่อ bioavailability หลังดูดซึม แต่ไม่ใช่ rate-limiting step ที่โจทย์ชี้จาก BCS"],
    difficulty:"easy",
    ref:"FDA/ICH biopharmaceutics principles; Aulton’s Pharmaceutics"
  },
  {
    topic:"Wet granulation",
    prompt:"สารใดเหมาะสมที่สุดสำหรับใช้เป็น binder ในกระบวนการ wet granulation ของยาเม็ด?",
    options:["Povidone K30","Crospovidone","Magnesium stearate","Colloidal silicon dioxide","Sodium starch glycolate"],
    rationale:"Povidone (PVP) ใช้เป็น binder ได้ทั้งในรูปสารละลายและแห้ง ช่วยให้ผงรวมตัวเป็น granules ที่มีความแข็งแรงเหมาะสม.",
    traps:["Crospovidone เป็น superdisintegrant","Magnesium stearate เป็น lubricant","Colloidal silicon dioxide ใช้เป็น glidant/adsorbent","Sodium starch glycolate เป็น superdisintegrant"],
    difficulty:"easy",
    ref:"Aulton’s Pharmaceutics; Handbook of Pharmaceutical Excipients"
  },
  {
    topic:"Tablet troubleshooting",
    prompt:"หลังเพิ่มเวลา lubrication จาก 3 เป็น 15 นาที โดยใช้ magnesium stearate เท่าเดิม พบว่า disintegration และ dissolution ช้าลง แต่ assay และ weight variation ไม่เปลี่ยน สาเหตุใดสอดคล้องที่สุด?",
    options:["เกิด over-lubrication ทำให้ผิวอนุภาคมี hydrophobic film มากขึ้น","Binder เกิด cross-linking จากแรงเฉือน","Disintegrant เปลี่ยนเป็น amorphous form","API เกิด oxidation ระหว่างการผสม","Granule density ลดลงเพราะ magnesium stearate ดูดน้ำ"],
    rationale:"Magnesium stearate เป็น hydrophobic lubricant; การผสมนานเกินไปเพิ่มการเคลือบผิวอนุภาค ลด wettability และ water penetration จึงทำให้ disintegration/dissolution ช้าลง.",
    traps:["Binder cross-linking ไม่ใช่ผลจำเพาะที่คาดจาก lubrication time","การเปลี่ยน solid state ของ disintegrant ไม่ใช่กลไกหลักของ over-lubrication","Oxidation ไม่อธิบาย pattern ที่ assay ยังปกติและ dissolution ช้าลง","Magnesium stearate ไม่ได้ทำให้ granule density ลดผ่านการดูดน้ำเป็นกลไกหลัก"],
    difficulty:"medium",
    ref:"Aulton’s Pharmaceutics — tablet lubrication"
  },
  {
    topic:"Tablet defects",
    prompt:"ระหว่างการตอกยา ส่วนบนของเม็ดยาแยกออกจาก body หลังถูกดันออกจาก die โดยเกิดมากขึ้นเมื่อเพิ่ม turret speed ข้อบกพร่องนี้เรียกว่าอะไร?",
    options:["Capping","Lamination","Picking","Sticking","Chipping"],
    rationale:"Capping คือการแยกส่วนบนหรือส่วนล่างของเม็ดยาออกจาก body มักสัมพันธ์กับ entrapped air, elastic recovery และความเร็วการตอกสูง.",
    traps:["Lamination คือเม็ดยาแยกเป็นชั้นหลายชั้น ไม่จำเพาะที่ cap","Picking คือผิวเม็ดยาติดที่ punch face เฉพาะจุด","Sticking คือมวลยาติด punch/die","Chipping คือขอบเม็ดยาบิ่น"],
    difficulty:"easy",
    ref:"Aulton’s Pharmaceutics — compression defects"
  },
  {
    topic:"Powder flow",
    prompt:"Granules 3 สูตรมีค่า A: Carr's index 28%, angle of repose 42°; B: 20%, 35°; C: 13%, 28°. หากพิจารณาเฉพาะ flowability สูตรใดเหมาะต่อการป้อนเข้า tablet press มากที่สุด?",
    options:["สูตร C เพราะ Carr's index และ angle of repose ต่ำที่สุด","สูตร A เพราะ Carr's index สูงแสดงว่าบีบอัดได้ดี","สูตร B เพราะค่าทั้งสองอยู่กึ่งกลาง","สูตร A เพราะ angle of repose สูงทำให้ไหลช้าจึงแม่นยำ","สูตร B เพราะ Carr's index ใกล้ 20% จึงเป็นค่ามาตรฐาน"],
    rationale:"ทั้ง Carr's index และ angle of repose ที่ต่ำลงโดยทั่วไปสะท้อนการไหลที่ดีขึ้น ดังนั้น C ให้หลักฐานสองตัวชี้วัดสอดคล้องกันว่าดีที่สุดในชุดนี้.",
    traps:["Carr's index สูงสะท้อน cohesiveness/flow ที่แย่ลง ไม่ใช่ข้อดี","ค่ากึ่งกลางไม่ได้ทำให้ดีที่สุด","Angle สูงสัมพันธ์กับ flow ที่แย่ลง","ไม่มีหลักว่าค่าใกล้ 20% เป็นเป้าหมายที่ดีกว่าค่าต่ำกว่า"],
    difficulty:"medium",
    ref:"USP <1174> Powder Flow; Aulton’s Pharmaceutics"
  },
  {
    topic:"Enteric coating",
    prompt:"พอลิเมอร์ใดเหมาะสมที่สุดสำหรับทำ enteric coating ของยา acid-labile?",
    options:["HPMC phthalate","HPMC","Ethylcellulose","Povidone K30","PEG 6000"],
    rationale:"HPMC phthalate เป็น pH-dependent enteric polymer ที่ไม่ละลายในสภาวะกรดและละลายเมื่อ pH สูงขึ้นในลำไส้.",
    traps:["HPMC ทั่วไปเป็น film former แต่ไม่ใช่ enteric polymer","Ethylcellulose เป็น water-insoluble polymer ใช้ sustained-release ได้มากกว่า","Povidone เป็น binder/film former ที่ละลายน้ำ","PEG มักใช้เป็น plasticizer/solubilizer ไม่ใช่ enteric polymerหลัก"],
    difficulty:"easy",
    ref:"Aulton’s Pharmaceutics — modified-release coatings"
  },
  {
    topic:"Delayed-release dissolution",
    prompt:"Enteric-coated tablet ปลดปล่อยตัวยา 18% ระหว่าง acid stage ก่อนเข้าสู่ buffer stage ปัจจัยใดควรสงสัยเป็นอันดับแรก?",
    options:["Enteric film มี barrier ต่อกรดไม่เพียงพอ","Core tablet มี disintegrant ต่ำเกินไป","API มี particle size ใหญ่เกินไป","Binder ใน core สูงเกินไป","Lubricant ใน core มากเกินไป"],
    rationale:"โจทย์ผิดตั้งแต่ acid stage จึงต้องมองที่หน้าที่สำคัญของ enteric coat คือป้องกันการปลดปล่อยในกรด; film defect, coat level ต่ำ หรือ polymer/curing ไม่เหมาะเป็นสาเหตุที่ตรงที่สุด.",
    traps:["Disintegrant ต่ำมักทำให้ release หลัง coat เปิดช้า ไม่อธิบาย acid leakage ได้ดีที่สุด","Particle size ใหญ่สัมพันธ์กับ dissolution rate แต่ไม่ใช่ acid protection","Binder สูงอาจชะลอ core disintegration แต่ไม่ได้ทำให้ acid barrier ล้มเหลว","Lubricant สูงอาจชะลอ wetting/dissolution แต่ไม่ใช่สาเหตุแรกของ drug release ใน acid stage"],
    difficulty:"medium",
    ref:"USP delayed-release dissolution concepts; Aulton’s Pharmaceutics"
  },
  {
    topic:"Enteric coating troubleshooting",
    prompt:"Core tablet ให้ dissolution 94%. หลัง enteric coating พบว่า acid stage ผ่าน แต่ใน buffer stage ปลดปล่อยยาเพียง 61%. ข้อมูลใดควรตรวจสอบเป็นลำดับต้น ๆ?",
    options:["Coating weight gain, curing และ pH-solubility ของ enteric polymer","Assay ของ API ก่อน granulation","Blend uniformity ก่อน compression","Particle size ของ API เพียงอย่างเดียว","ความหนาแน่น bulk ของ excipient ก่อนผสม"],
    rationale:"Core ก่อนเคลือบละลายดี แต่ปัญหาเกิดหลัง coating และ acid resistance ผ่านแล้ว จึงต้องโฟกัส coat ที่อาจหนาเกิน/curing มากเกิน หรือ polymer เปิดที่ pH สูงเกิน ทำให้ release ใน buffer ล่าช้า.",
    traps:["Assay ไม่อธิบายความต่างก่อน/หลัง coating","Blend uniformity ถ้ามีปัญหาควรสะท้อนตั้งแต่ core","Particle size อาจมีผลต่อ intrinsic dissolution แต่ core test 94% ชี้ว่าไม่ใช่ root cause แรก","Bulk density ของ excipient ไม่สัมพันธ์โดยตรงกับความผิดปกติที่เกิดหลัง coating"],
    difficulty:"hard",
    ref:"Aulton’s Pharmaceutics; USP delayed-release performance testing"
  },
  {
    topic:"Preformulation / DSC",
    prompt:"ต้องการศึกษาว่า API เกิดการเปลี่ยนแปลงทางความร้อนหรือมี drug–excipient interaction ที่สะท้อนจาก melting endotherm เครื่องมือใดเหมาะสมที่สุด?",
    options:["Differential scanning calorimetry (DSC)","FTIR spectroscopy","Powder X-ray diffraction","HPLC","Karl Fischer titration"],
    rationale:"DSC วัด heat flow ที่สัมพันธ์กับ thermal transitions เช่น melting, crystallization และการเปลี่ยนแปลง endotherm/exotherm จึงเหมาะกับโจทย์ที่ระบุ thermogram/melting endotherm.",
    traps:["FTIR เหมาะกับ functional groups/chemical interactions แต่ไม่วัด heat-flow transition โดยตรง","PXRD เหมาะกับ crystallinity/polymorph","HPLC วัดองค์ประกอบ/ปริมาณและ impurities","Karl Fischer วัด water content"],
    difficulty:"medium",
    ref:"ICH Q6A concepts; pharmaceutical preformulation texts"
  },
  {
    topic:"Solid state / PXRD",
    prompt:"หากต้องการยืนยันว่า API เปลี่ยนจาก crystalline polymorph หนึ่งเป็นอีก polymorph หลังการผลิต เครื่องมือใดเหมาะสมที่สุด?",
    options:["Powder X-ray diffraction (PXRD)","UV-visible spectroscopy","Karl Fischer titration","Dissolution apparatus","Gas chromatography"],
    rationale:"Polymorphs ให้ diffraction pattern ต่างกัน จึงใช้ PXRD เป็นเทคนิคหลักในการ fingerprint และแยก crystalline forms.",
    traps:["UV-Vis ไม่จำเพาะต่อ crystal lattice","Karl Fischer วัดน้ำ","Dissolution อาจเห็นผลทางอ้อมแต่ไม่ยืนยัน polymorph โดยตรง","GC เหมาะกับ volatile/semi-volatile analytes"],
    difficulty:"medium",
    ref:"ICH Q6A; solid-state characterization principles"
  },
  {
    topic:"RP-HPLC",
    prompt:"ในการทำ RP-HPLC ด้วย C18 column หากต้องการลด retention time ของ hydrophobic API โดยยังใช้ column เดิม การปรับใดเหมาะสมที่สุด?",
    options:["เพิ่มสัดส่วน organic solvent ใน mobile phase","ลดสัดส่วน organic solvent","ลด flow rate","เพิ่ม aqueous phase","ลด column temperature"],
    rationale:"ใน reversed-phase chromatography stationary phase มีความไม่ชอบน้ำ; การเพิ่ม organic modifier เพิ่ม elution strength ทำให้ hydrophobic analyte อยู่กับ stationary phase น้อยลงและออกเร็วขึ้น.",
    traps:["ลด organic จะเพิ่ม retention","ลด flow rate โดยทั่วไปเพิ่มเวลา retention","เพิ่ม aqueous เทียบเท่าลด organic ทำให้ retention มากขึ้น","ผล temperature เป็น compound-dependent และไม่ใช่ตัวเลือกตรงที่สุดเท่าการเพิ่ม organic"],
    difficulty:"medium",
    ref:"USP <621> Chromatography; Snyder & Kirkland HPLC principles"
  },
  {
    topic:"Chromatographic resolution",
    prompt:"HPLC ให้ Peak 1: tR 5.2 min, baseline width 0.40 min และ Peak 2: tR 5.8 min, baseline width 0.42 min. ค่า resolution (Rs) โดยประมาณเท่าใด?",
    options:["1.46","0.73","1.02","2.93","3.66"],
    rationale:"ใช้ Rs = 2(tR2−tR1)/(W1+W2) = 2(0.6)/(0.40+0.42) = 1.2/0.82 ≈ 1.46.",
    traps:["0.73 เกิดจากลืม factor 2","1.02 ไม่ตรงสูตร baseline-width resolution","2.93 ใกล้ค่าที่เกิดจากใช้ denominator ผิดครึ่งหนึ่ง","3.66 ไม่สอดคล้องกับ peak spacing/width ที่ให้"],
    difficulty:"hard",
    ref:"USP <621> Chromatography",
    calc:["ΔtR = 5.8 − 5.2 = 0.6 min","W1 + W2 = 0.40 + 0.42 = 0.82 min","Rs = 2(0.6)/0.82 ≈ 1.46"]
  },
  {
    topic:"HPLC peak tailing",
    prompt:"วิเคราะห์ weakly basic API ด้วย silica-based C18 column พบ peak tailing เด่น ทั้งที่ detector และ injection volume ปกติ สาเหตุใดมีความเป็นไปได้มากที่สุด?",
    options:["Secondary interaction ระหว่าง basic analyte กับ residual silanol groups","UV wavelength อยู่ใกล้ λmax","Flow rate ต่ำทำให้ detector non-linear","Organic solvent ทำลาย chromophore ของ API","Injection volume ต่ำทำให้ overload"],
    rationale:"Residual silanol sites บน silica สามารถเกิด secondary ionic interaction กับ protonated basic analytes ทำให้ retention ไม่เป็นเนื้อเดียวและเกิด tailing.",
    traps:["การวัดใกล้ λmax เพิ่ม sensitivity ไม่ใช่สาเหตุจำเพาะของ tailing","Flow rate ต่ำไม่ทำให้ detector non-linear โดยอัตโนมัติ","Organic solvent ไม่ได้ทำลาย chromophoreเป็นคำอธิบายทั่วไป","Overload มักสัมพันธ์กับ sample mass/volume สูง ไม่ใช่ต่ำ"],
    difficulty:"hard",
    ref:"USP <621>; HPLC method-development principles"
  },
  {
    topic:"Stability-indicating HPLC",
    prompt:"Forced degradation ภายใต้ oxidative condition เกิด impurity peak ใกล้ API และ PDA รายงานว่า API peak purity fail ข้อสรุปใดเหมาะสมที่สุด?",
    options:["วิธีอาจยังไม่มี specificity เพียงพอ เพราะอาจมี co-elution ของ degradation product","วิธีผ่าน specificity แล้วเพราะ retention time API คงเดิม","ใช้วิธีต่อได้ถ้า assay API ยังมากกว่า 90%","ตัด impurity peak ออกจากการประเมินได้ถ้า area ต่ำ","เพิ่มความเข้มข้น standard เพื่อแก้ peak purity"],
    rationale:"Peak purity fail เป็นสัญญาณว่าภายใน API peak อาจมี spectral heterogeneity/co-elution จึงยังไม่ควรสรุปว่า method เป็น stability-indicating จนกว่าจะแยก/พิสูจน์ specificity ได้.",
    traps:["Retention time คงเดิมไม่พิสูจน์ว่าไม่มี co-elution","Assay recovery ไม่ทดแทน specificity","Area ต่ำก็ยังรบกวน critical peak ได้","เพิ่ม standard concentration ไม่แก้ separation/selectivity"],
    difficulty:"hard",
    ref:"ICH Q2(R2); ICH Q14; stability-indicating method principles"
  },
  {
    topic:"Gradient HPLC",
    prompt:"ตัวอย่างมี impurities ตั้งแต่ polar มากจนถึง hydrophobic มาก. Isocratic RP-HPLC ทำให้ early peaks ออกใกล้ solvent front แต่ hydrophobic impurity ออกหลัง 35 นาทีและ peak กว้าง วิธีใดเหมาะสมที่สุด?",
    options:["ใช้ gradient elution โดยเริ่ม organic ต่ำแล้วเพิ่มตามเวลา","ใช้ aqueous phase สูงคงที่ตลอด run","ใช้ organic phase สูงคงที่ตลอด run","ลด flow rate ตลอด run","เปลี่ยน detector wavelength เพียงอย่างเดียว"],
    rationale:"Gradient เหมาะเมื่อ analytes มีช่วง retention กว้าง ช่วยคง retention ของ early peaks และเพิ่ม elution strength ภายหลังเพื่อชะ hydrophobic species ให้เร็วและ peak แคบขึ้น.",
    traps:["Aqueous สูงยิ่งทำให้ late hydrophobic peak ช้า","Organic สูงคงที่อาจทำให้ early polar peaks co-elute ใกล้ void","ลด flow rateยิ่งทำให้ run นานขึ้น","Detector wavelength ไม่แก้ chromatographic retention/separation"],
    difficulty:"medium",
    ref:"USP <621>; HPLC method-development principles"
  },
  {
    topic:"Emulsion / Stokes' law",
    prompt:"O/W emulsion เกิด creaming แต่เขย่ากลับได้และไม่พบ coalescence การปรับใดลด creaming rate ได้โดยตรงตาม Stokes' law?",
    options:["ลด droplet size และเพิ่ม viscosity ของ continuous phase","เพิ่ม droplet size และลด viscosity","เพิ่ม density difference ระหว่างสอง phase","ลด viscosity ของ continuous phase","เพิ่ม droplet size โดยคง viscosity"],
    rationale:"ตาม Stokes' law creaming/sedimentation velocity แปรตาม r² และ density difference แต่แปรผกผันกับ viscosity; ลด r และเพิ่ม η จึงลดอัตราการแยกชั้น.",
    traps:["ทั้งสองการเปลี่ยนทำให้ creaming เร็วขึ้น","density difference สูงทำให้ creaming เร็วขึ้น","viscosity ต่ำทำให้ velocity สูงขึ้น","droplet ใหญ่ทำให้ velocity สูงขึ้นตาม r²"],
    difficulty:"medium",
    ref:"Aulton’s Pharmaceutics — dispersed systems"
  },
  {
    topic:"Suspensions",
    prompt:"Suspension ตกตะกอนค่อนข้างเร็ว แต่ sediment มีลักษณะหลวมและเขย่ากลับกระจายได้ง่าย ลักษณะนี้สอดคล้องกับระบบใดมากที่สุด?",
    options:["Flocculated suspension","Deflocculated suspension ที่เกิด compact cake","Coalesced emulsion","Phase-inverted emulsion","Ostwald-ripened crystal system"],
    rationale:"Flocculated particles รวมเป็น loose flocs จึงตกเร็วกว่าแต่ให้ sediment ที่มีปริมาตรมากและ redisperse ง่าย ลดความเสี่ยง caking.",
    traps:["Deflocculated particles มักตกช้ากว่าแต่ compact/cake ได้","Coalescence เป็นปรากฏการณ์ของ emulsion droplets","Phase inversion เป็นการสลับชนิด continuous/dispersed phase","Ostwald ripening คือการโตของอนุภาคใหญ่จากการละลายของอนุภาคเล็ก"],
    difficulty:"easy",
    ref:"Aulton’s Pharmaceutics — suspensions"
  },
  {
    topic:"Preservatives / pH",
    prompt:"Preservative ใน syrup เป็น weak acid. หากองค์ประกอบอื่นคงเดิม การเปลี่ยนแปลงใดมีแนวโน้มเพิ่ม antimicrobial activity ของ preservative ชนิดนี้?",
    options:["ลด pH เพื่อเพิ่มสัดส่วน unionized acid","เพิ่ม pH ให้สูงกว่า pKa มาก","เพิ่ม surfactant เพื่อจับ preservative ใน micelles","เพิ่ม ionic strength เพื่อบังคับให้แตกตัวมากขึ้น","เพิ่ม buffer capacity โดยไม่เปลี่ยน pH"],
    rationale:"Weak-acid preservatives เช่น benzoic/sorbic acid มี antimicrobial activity เด่นใน unionized form ซึ่งผ่าน microbial membrane ได้ดี; ลด pH เมื่อเทียบกับ pKa จะเพิ่ม unionized fraction.",
    traps:["pH สูงเพิ่ม ionized formและมักลด efficacy","Micellar binding อาจลด free preservative","การผลักให้ ionized มากขึ้นไม่ใช่เป้าหมาย","Buffer capacity อย่างเดียวไม่เปลี่ยน ionization fractionถ้า pH ไม่เปลี่ยน"],
    difficulty:"medium",
    ref:"Aulton’s Pharmaceutics; preservative chemistry"
  },
  {
    topic:"Pharmaceutical calculation",
    prompt:"ต้องการเตรียม NaCl 0.9% w/v ปริมาตร 2,000 mL ต้องใช้ NaCl กี่กรัม?",
    options:["18 g","9 g","12 g","15 g","20 g"],
    rationale:"0.9% w/v = 0.9 g/100 mL ดังนั้น 2,000 mL ต้องใช้ 0.9×20 = 18 g.",
    traps:["9 g เป็นปริมาณสำหรับ 1,000 mL","12 g เท่ากับ 0.6% w/v ใน 2 L","15 g เท่ากับ 0.75% w/v","20 g เท่ากับ 1.0% w/v"],
    difficulty:"easy",
    ref:"Basic pharmaceutical calculations",
    calc:["0.9% w/v = 0.9 g/100 mL","2,000/100 = 20","0.9 × 20 = 18 g"]
  },
  {
    topic:"Ostwald ripening",
    prompt:"ข้อใดอธิบาย Ostwald ripening ใน dispersed system ได้ถูกต้องที่สุด?",
    options:["อนุภาคขนาดเล็กละลายแล้วสารไปสะสมบนอนุภาคขนาดใหญ่ ทำให้ขนาดเฉลี่ยโตขึ้น","Droplets ชนและรวมกันโดยสูญเสีย interfacial film","Dispersed phase ลอยขึ้นเพราะ density ต่ำกว่า continuous phase","อนุภาครวมตัวเป็น loose reversible aggregates","ระบบ O/W เปลี่ยนเป็น W/O"],
    rationale:"Ostwald ripening ขับเคลื่อนด้วยความแตกต่างของ solubility/chemical potential ตามขนาด อนุภาคเล็กมี apparent solubility สูงกว่าและค่อย ๆ ป้อนมวลให้อนุภาคใหญ่.",
    traps:["คำอธิบายนี้คือ coalescence","คำอธิบายนี้คือ creaming","คำอธิบายนี้คือ flocculation","คำอธิบายนี้คือ phase inversion"],
    difficulty:"medium",
    ref:"Aulton’s Pharmaceutics — physical stability of dispersions"
  },
  {
    topic:"Sterilization",
    prompt:"ผลิตภัณฑ์เป็น aqueous solution ในภาชนะปิดสุดท้ายและทนความร้อน/ความชื้นได้ดี วิธีใดเหมาะสมที่สุดเมื่อสามารถใช้ได้?",
    options:["Terminal moist-heat sterilization","Aseptic processing โดยไม่ sterilize final container","Sterile filtration 0.45 µm","UV irradiation ของ final container","Dry heat sterilization ของสารละลายน้ำ"],
    rationale:"เมื่อ formulation/container ทนได้ terminal sterilization ให้ sterility assurance สูงกว่า aseptic processing เพราะ sterilize ผลิตภัณฑ์ในภาชนะสุดท้าย.",
    traps:["Aseptic processingใช้เมื่อ terminal sterilizationไม่เหมาะหรือทำไม่ได้","0.45 µm ไม่ใช่ sterilizing-grade filter โดยทั่วไป","UV penetration/validation ไม่เหมาะเป็น terminal sterilization ของ solution ใน container","Dry heatเหมาะกับวัสดุทนร้อน/น้ำมัน/depyration มากกว่า aqueous solution"],
    difficulty:"easy",
    ref:"PIC/S GMP / EU GMP Annex 1; pharmaceutics sterile-product principles"
  },
  {
    topic:"Sterile filtration",
    prompt:"Filter pore size ใดเป็นขนาดที่ใช้โดยทั่วไปสำหรับ sterilizing-grade membrane filtration ของสารละลายที่ไม่ทนความร้อน?",
    options:["0.22 µm","0.45 µm","1.2 µm","5 µm","10 µm"],
    rationale:"Sterilizing-grade membrane filters โดยทั่วไปมี nominal pore sizeประมาณ 0.22 µm (หรือ validated equivalent) เพื่อกักจุลชีพ.",
    traps:["0.45 µm ใช้ clarification/bioburden applications ได้ แต่ไม่ใช่ sterilizing-grade standard ทั่วไป","1.2 µm ใหญ่เกินไป","5 µm เป็น prefilterระดับหยาบ","10 µm เป็น filtrationหยาบ"],
    difficulty:"easy",
    ref:"EU/PIC/S GMP Annex 1; USP sterile filtration principles"
  },
  {
    topic:"Aseptic process simulation",
    prompt:"Media fill ของ aseptic line พบ contaminated unit แม้ finished-product sterility tests ของ batches ก่อนหน้าจะผ่าน การดำเนินการใดเหมาะสมที่สุด?",
    options:["เริ่ม investigation ต่อ aseptic process simulation และประเมิน state of control","ยอมรับผลเพราะ sterility test ของผลิตภัณฑ์เคยผ่าน","ทำ media fill ซ้ำและลบผลเดิมทันทีหากครั้งใหม่ผ่าน","เพิ่มจำนวนตัวอย่าง sterility test แล้วถือว่าแทน media fill ได้","ใช้ environmental monitoring อย่างเดียวแทนการสืบสวน"],
    rationale:"Media-fill contamination เป็นสัญญาณสำคัญของ aseptic-process control ต้อง investigate intervention, personnel, environment, equipment และ batch impact ตาม procedure; sterility test ไม่สามารถชดเชย process failure ได้.",
    traps:["Sterility test มีข้อจำกัดด้าน sampling และไม่พิสูจน์ process control","Repeat pass ไม่ invalidate original failure โดยอัตโนมัติ","เพิ่ม sample ไม่แทน aseptic process simulation","Environmental monitoring เป็นข้อมูลประกอบ แต่ไม่แทน investigation"],
    difficulty:"medium",
    ref:"EU/PIC/S GMP Annex 1 — aseptic process simulation"
  },
  {
    topic:"Bacterial endotoxin",
    prompt:"การทดสอบใดใช้ตรวจ bacterial endotoxins ในผลิตภัณฑ์ยาได้โดยตรง?",
    options:["Bacterial Endotoxins Test เช่น LAL-based method","Sterility test","Bioburden count","Preservative efficacy test","Total viable aerobic count เพียงอย่างเดียว"],
    rationale:"BET/LAL ตรวจ endotoxin activity โดยเฉพาะจาก Gram-negative bacterial lipopolysaccharide; เป็นคนละ endpoint กับการมีชีวิตของจุลชีพ.",
    traps:["Sterility test ตรวจ viable microorganisms ไม่ได้วัด endotoxin","Bioburden วัดจำนวนจุลชีพก่อน sterilization","Preservative efficacy ทดสอบการยับยั้ง challenge organisms","TVAC ไม่วัด endotoxin"],
    difficulty:"easy",
    ref:"USP <85> Bacterial Endotoxins Test"
  },
  {
    topic:"Endotoxin control",
    prompt:"เหตุผลสำคัญที่ endotoxin อาจยังเป็นปัญหาแม้กระบวนการสามารถฆ่า vegetative bacteria ได้คือข้อใด?",
    options:["การฆ่าจุลชีพไม่ได้แปลว่าจะกำจัด endotoxin ที่มีอยู่แล้ว","Endotoxin เป็นไวรัสจึงทน sterilization","Endotoxin เกิดเฉพาะจาก Gram-positive spores","Endotoxin เพิ่มจำนวนได้เองหลัง bacteria ตาย","Sterility test จะตรวจ endotoxin ได้เสมอ"],
    rationale:"Endotoxin เป็น lipopolysaccharide component จาก outer membrane ของ Gram-negative bacteria; nonviable cells/fragment ยังคงทิ้ง endotoxin ได้ และการทำให้ sterile ไม่เท่ากับ depyrogenation.",
    traps:["Endotoxin ไม่ใช่ไวรัส","แหล่งคลาสสิกคือ Gram-negative bacteria ไม่ใช่ Gram-positive spores","Endotoxin ไม่ได้ replicate เอง","Sterility test ตรวจ viable microbes ไม่ใช่ endotoxin"],
    difficulty:"medium",
    ref:"USP <85>; depyrogenation principles"
  },
  {
    topic:"Dry powder inhaler",
    prompt:"Excipient ใดนิยมใช้เป็น carrier ใน dry powder inhaler (DPI) formulations หลายชนิด?",
    options:["Lactose","Mineral oil","Propylene glycol","Sodium chloride injection","Povidone iodine"],
    rationale:"Lactose มีประวัติใช้เป็น carrier particle ใน DPI ช่วย handling/metering และการกระจายตัวของ micronized drug.",
    traps:["Mineral oil ไม่ใช่ DPI carrierมาตรฐาน","Propylene glycolพบใน liquid formulations มากกว่า","Sodium chloride injection เป็นสารละลายปราศจากเชื้อ ไม่ใช่ dry carrier","Povidone iodine เป็น antiseptic ไม่ใช่ DPI carrier"],
    difficulty:"easy",
    ref:"Aulton’s Pharmaceutics — pulmonary drug delivery"
  },
  {
    topic:"Inhalation particle size",
    prompt:"สำหรับยาสูดที่ต้องการให้อนุภาคมีโอกาสเข้าสู่ lower respiratory tract ช่วง aerodynamic diameter ใดโดยทั่วไปเหมาะสมที่สุด?",
    options:["ประมาณ 1–5 µm","10–20 µm","20–50 µm","50–100 µm",">100 µm"],
    rationale:"Fine-particle fraction ในช่วงประมาณ 1–5 µm มีโอกาสหลบ inertial impaction ใน oropharynx และไป deposition ใน lower airways ได้ดีกว่าอนุภาคใหญ่.",
    traps:["10–20 µm มีแนวโน้มตกใน upper airway มากขึ้น","20–50 µm ใหญ่เกินสำหรับ deep lung delivery","50–100 µm มักไม่เข้าสู่ lower respiratory tract","มากกว่า100 µm ยิ่งเกิด oropharyngeal deposition"],
    difficulty:"easy",
    ref:"Aulton’s Pharmaceutics — aerosol deposition"
  },
  {
    topic:"Metered dose inhaler QC",
    prompt:"pMDI มี assay ของ canister ผ่าน แต่ปริมาณยาที่ออกจาก actuator ต่อ actuation แปรปรวนสูง การทดสอบใดสัมพันธ์กับปัญหานี้มากที่สุด?",
    options:["Delivered-dose uniformity","Bulk density","Tablet friability","Loss on drying ของ API เพียงอย่างเดียว","Sedimentation volume เพียงอย่างเดียว"],
    rationale:"ปัญหาคือ dose ที่ผู้ใช้ได้รับต่อ actuation จึงต้องประเมิน delivered-dose uniformity ซึ่งรวมผลจาก formulation, valve, actuator และการจ่าย dose.",
    traps:["Bulk densityเป็นคุณสมบัติผง ไม่วัด emitted dose","Friabilityใช้กับ tablets","LOD อย่างเดียวไม่วัด dose delivery","Sedimentationอาจเป็นปัจจัยใน suspension aerosol แต่ไม่ใช่ endpoint QC ที่ตรงที่สุดกับคำถาม"],
    difficulty:"medium",
    ref:"Pharmacopoeial inhalation-product performance testing principles"
  },
  {
    topic:"Stability kinetics",
    prompt:"ตัวยาเริ่มต้น 100% หลังเก็บ 12 เดือนเหลือ 94%. หาก degradation เป็น first-order และอัตราคงที่ ค่า t90 โดยประมาณเท่าใด?",
    options:["20 เดือน","12 เดือน","16 เดือน","24 เดือน","30 เดือน"],
    rationale:"k = −ln(0.94)/12 ≈ 0.00516 month⁻¹ และ t90 = −ln(0.90)/k ≈ 20.4 เดือน.",
    traps:["12 เดือนคือเวลาที่วัด 94% ไม่ใช่ t90","16 เดือนได้จากการประมาณเชิงเส้นที่ไม่ตรง first-order","24 เดือนไม่ตรงสมการ exponential","30 เดือนสูงเกินจาก k ที่คำนวณได้"],
    difficulty:"hard",
    ref:"ICH Q1A(R2) concepts; pharmaceutical stability kinetics",
    calc:["k = −ln(0.94)/12 ≈ 0.00516 month⁻¹","t90 = −ln(0.90)/0.00516","t90 ≈ 20.4 months"]
  },
  {
    topic:"Forced degradation",
    prompt:"วัตถุประสงค์สำคัญของ forced degradation ในการพัฒนา analytical method คือข้อใด?",
    options:["ช่วยแสดงว่า method สามารถแยก/ตรวจ API จาก degradation products ได้อย่างจำเพาะ","ใช้กำหนด shelf life โดยตรงแทน long-term study","ใช้พิสูจน์ว่า accelerated stability ผ่านทุก condition","ใช้กำหนด process yield","ใช้แทน method validation ทั้งหมด"],
    rationale:"Forced degradation สร้าง degradation products ภายใต้ stress ที่เหมาะสมเพื่อ challenge specificity และสนับสนุนการพัฒนา stability-indicating method.",
    traps:["Shelf life ต้องอาศัย formal stability data ไม่ใช่ forced degradationโดยตรง","Forced degradationไม่ใช่ pass/fail accelerated stability","ไม่เกี่ยวกับ yield","ยังต้อง validate characteristics อื่นตาม intended use"],
    difficulty:"medium",
    ref:"ICH Q1A(R2); ICH Q2(R2); ICH Q14"
  },
  {
    topic:"Oxidative stability",
    prompt:"สำหรับ formulation ที่ API ไวต่อ oxidation กลยุทธ์ใดเหมาะสมที่สุดในเชิงหลักการ?",
    options:["พิจารณา antioxidant/chelating strategy และลด oxygen exposure ตามกลไกที่พิสูจน์ได้","เพิ่ม headspace oxygen เพื่อทำให้ระบบสมดุล","เพิ่ม water activity เสมอเพื่อเจือจาง oxygen","เพิ่ม pH ทุกกรณี","ใช้ภาชนะใสเพื่อให้เห็นการเปลี่ยนสี"],
    rationale:"การควบคุม oxidation ต้องลด initiators/oxygen/light/metal catalysts ตาม pathway และอาจใช้ antioxidant หรือ chelator ที่ compatible; ต้องยืนยันด้วย stability data.",
    traps:["เพิ่ม oxygen มักเพิ่ม oxidative stress","เพิ่ม water activityไม่ได้เป็นกลยุทธ์สากลและอาจเร่ง degradationอื่น","ผลของ pH เป็น drug-specific ไม่ควรเพิ่มทุกกรณี","ภาชนะใสอาจเพิ่ม photolysis และไม่ได้ป้องกัน oxidation"],
    difficulty:"easy",
    ref:"Aulton’s Pharmaceutics; ICH Q1 stability principles"
  },
  {
    topic:"OOS investigation",
    prompt:"Assay specification 95.0–105.0% ได้ผล 92.4% ขณะที่ system suitability ผ่าน นักวิเคราะห์ควรทำสิ่งใดก่อน?",
    options:["เริ่ม OOS laboratory investigation ตาม SOP และเก็บรักษาข้อมูลเดิม","วิเคราะห์ซ้ำจนได้ผลผ่านแล้วรายงานค่าที่ผ่าน","เฉลี่ยผลกับ batch ก่อนหน้า","ตัดผลออกเพราะ system suitability ผ่าน","ปล่อย batch หาก content uniformity ผ่าน"],
    rationale:"ผลนอก specification ต้องถูกบันทึกและ investigate อย่างเป็นระบบ เริ่มจาก laboratory phase ตรวจ calculation, preparation, instrument, chromatography และ potential assignable cause โดยไม่ testing into compliance.",
    traps:["Retesting ต้องมีเหตุผล/แผน ไม่ใช่ทำจนผ่าน","ห้ามเฉลี่ยข้าม batchเพื่อกลบ OOS","System suitabilityผ่านไม่ได้ทำให้ sample result invalid","การทดสอบอื่นผ่านไม่ลบ OOS assay"],
    difficulty:"medium",
    ref:"FDA OOS Guidance; GMP laboratory controls"
  },
  {
    topic:"OOS reinjection",
    prompt:"ตัวอย่าง OOS ได้ assay 92.0% แต่ reinjection จาก vial เดิมได้ 99.1%. System suitability ผ่านทั้งสองครั้ง การดำเนินการใดเหมาะสมที่สุด?",
    options:["Investigate ต่อและไม่ invalidate 92.0% จนกว่าจะมีหลักฐาน assignable cause","ใช้ 99.1% เป็น final resultทันทีเพราะ reinjectionผ่าน","เฉลี่ย 92.0 และ 99.1%","เตรียมใหม่หลายครั้งจนค่าเฉลี่ยผ่าน","สรุปว่า instrument malfunction โดยอัตโนมัติ"],
    rationale:"Passing reinjection บอกเพียงว่าผลสามารถต่างกันได้ แต่ยังไม่พิสูจน์สาเหตุของผลเดิม ต้องสืบสวน injection event, vial integrity, preparation, instrument logs และกำหนด scientifically justified disposition.",
    traps:["ผลใหม่ไม่ invalidate ผลเดิมโดยอัตโนมัติ","การเฉลี่ย OOS กับ passing resultเพื่อ compliance ไม่ถูกหลัก","Resampling/retestingต้องถูกกำหนดใน investigation plan ไม่ใช่ทำจนผ่าน","Instrument malfunction ต้องมี objective evidence"],
    difficulty:"hard",
    ref:"FDA OOS Guidance; GMP data integrity principles"
  },
  {
    topic:"CAPA",
    prompt:"ข้อใดเป็นตัวอย่างของ Corrective Action มากที่สุด?",
    options:["กำจัดสาเหตุของ deviation ที่เกิดขึ้นแล้วเพื่อป้องกันการเกิดซ้ำ","ทำ risk assessment เพื่อคาดการณ์ failure ที่ยังไม่เกิด","เพิ่ม annual training โดยไม่มี root cause","ประเมิน supplier ก่อนเริ่มซื้อวัตถุดิบ","วาง preventive maintenance ก่อนเกิด breakdown"],
    rationale:"Corrective action ตอบสนองต่อ nonconformity ที่เกิดแล้วและมุ่งกำจัด root cause เพื่อไม่ให้เกิดซ้ำ; preventive action มุ่งลดโอกาสของ potential nonconformity.",
    traps:["เป็น preventive/risk-management action","Trainingจะเป็น corrective actionได้ต่อเมื่อ root causeสนับสนุน ไม่ใช่ default","Supplier qualificationเป็น proactive control","Preventive maintenanceเป็น preventive control"],
    difficulty:"medium",
    ref:"ICH Q10 Pharmaceutical Quality System"
  },
  {
    topic:"Change control",
    prompt:"บริษัทต้องการเปลี่ยน supplier ของ critical excipient โดย specification บน CoA เหมือนเดิม ขั้นตอนใดเหมาะสมที่สุด?",
    options:["ดำเนินการผ่าน change control และประเมินผลกระทบ/ความเสี่ยงก่อน implementation","เปลี่ยนได้ทันทีหาก supplier มี GMP certificate","เปลี่ยนได้เมื่อ identity test ผ่านเพียงอย่างเดียว","ต้องทำ process validation ใหม่ทั้งหมดทุกกรณี","ต้องยื่นทะเบียนใหม่ทุกกรณีโดยไม่ต้องประเมินผลกระทบ"],
    rationale:"Same specification ไม่รับประกัน functional equivalence. Supplier/material change ต้องผ่าน pharmaceutical quality system, qualification และ risk/impact assessment เพื่อกำหนด testing, comparability, validation และ regulatory action ที่จำเป็น.",
    traps:["GMP certificateไม่แทน material comparability","Identity testอย่างเดียวไม่พอสำหรับ critical excipient","Extent of validationขึ้นกับ risk ไม่ใช่ทำใหม่ทั้งหมดเสมอ","Regulatory actionเป็น risk/change-specific ไม่ใช่ยื่นใหม่ทุกครั้ง"],
    difficulty:"medium",
    ref:"ICH Q9(R1); ICH Q10; GMP change control"
  },
  {
    topic:"Process validation",
    prompt:"ข้อใดอธิบาย process validation ได้เหมาะสมที่สุด?",
    options:["การสร้าง documented evidence ว่ากระบวนการที่กำหนดสามารถผลิตผลิตภัณฑ์ที่มีคุณภาพตามเกณฑ์อย่างสม่ำเสมอ","การตรวจ finished product จำนวนมากแทนการควบคุม process","การสอบเทียบ analytical balance","การทดสอบ raw material ทุก lot","การตรวจเครื่องจักรเฉพาะก่อนซื้อ"],
    rationale:"Modern process validation เป็น lifecycle approach ที่เชื่อม process design, qualification และ continued process verification เพื่อแสดง state of control และความสม่ำเสมอของ CQAs.",
    traps:["Finished testingอย่างเดียวไม่สร้าง process assurance","Calibrationเป็น metrology control","Raw-material testingเป็น QC input control","Pre-purchase equipment checkไม่ใช่ process validationทั้งหมด"],
    difficulty:"easy",
    ref:"FDA Process Validation Guidance; ICH Q8/Q10"
  },
  {
    topic:"Analytical validation / accuracy",
    prompt:"Assay method ให้ recovery ที่ระดับ 80%, 100%, 120% ของ target เท่ากับ 99.2%, 100.3%, 100.6% ตามลำดับ ข้อมูลนี้สนับสนุน analytical characteristic ใดโดยตรงที่สุด?",
    options:["Accuracy","Repeatability","Specificity","Detection limit","Robustness"],
    rationale:"Recovery study เทียบค่าที่วัดกับปริมาณที่ทราบ/เติมลงไป จึงประเมิน closeness to true/accepted value หรือ accuracy.",
    traps:["Repeatabilityต้องดูความแปรปรวนจาก replicate measurements","Specificityดูความสามารถแยก analyteจาก interferents","LODดูระดับต่ำสุดที่ตรวจพบ","Robustnessดูผลจาก deliberate small changes"],
    difficulty:"medium",
    ref:"ICH Q2(R2)"
  },
  {
    topic:"Analytical validation / specificity",
    prompt:"HPLC assay มี linearityและ precision ดี แต่ placebo ให้ peak ที่ retention time เดียวกับ API และมี area ประมาณ 4% ของ API response ข้อใดเป็น concern ชัดที่สุด?",
    options:["Specificity","Linearity","Repeatability","Range","Intermediate precision"],
    rationale:"Placebo interference ที่ตำแหน่ง API แสดงว่าวิธีอาจไม่แยก analyte จาก excipient/interferent ได้อย่างจำเพาะ แม้ performance characteristic อื่นจะดี.",
    traps:["Linearityเกี่ยวกับ response vs concentration","Repeatabilityเกี่ยวกับความแปรปรวนระยะสั้น","Rangeคือช่วงที่ accuracy/precision/linearityเหมาะสม","Intermediate precisionดู day/analyst/instrument variation"],
    difficulty:"medium",
    ref:"ICH Q2(R2)"
  },
  {
    topic:"Analytical validation / linearity",
    prompt:"ในการประเมิน linearity ของ quantitative HPLC ข้อใดเป็นหลักฐานที่เหมาะสมที่สุดเมื่อพิจารณาร่วมกับ residuals และช่วงความเข้มข้น?",
    options:["ความสัมพันธ์ของ analytical response กับ concentration ตลอดช่วงที่กำหนด","%RSD ของ replicate injections ที่ concentration เดียว","Recovery จาก spiked placebo","Peak purity ของ stressed sample","ผลเมื่อเปลี่ยน flow rate ±10%"],
    rationale:"Linearity คือความสามารถของวิธีให้ response ที่สัมพันธ์กับ analyte concentration ภายในช่วงที่กำหนด ควรประเมิน regression และ residual pattern ไม่ดู r เพียงอย่างเดียว.",
    traps:["%RSD ที่ระดับเดียวประเมิน precision","Spiked recoveryประเมิน accuracy","Peak purityสนับสนุน specificity","Deliberate method changesประเมิน robustness"],
    difficulty:"medium",
    ref:"ICH Q2(R2)"
  },
  {
    topic:"LOD / LOQ",
    prompt:"ข้อใดอธิบายความแตกต่างระหว่าง limit of detection (LOD) และ limit of quantitation (LOQ) ได้เหมาะสมที่สุด?",
    options:["LOD คือระดับต่ำที่ตรวจพบได้ ส่วน LOQ คือระดับต่ำที่วัดเชิงปริมาณได้ด้วย performance ที่ยอมรับได้","LOD ต้องสูงกว่า LOQ เสมอ","LOD ใช้เฉพาะ assay ส่วน LOQ ใช้เฉพาะ identity","LOQ ไม่เกี่ยวกับ precision","LOD และ LOQ มีความหมายเดียวกันถ้า detector เป็น UV"],
    rationale:"LOD เน้น detectability ขณะที่ LOQ ต้องสามารถ quantify ด้วย accuracy/precision ที่เหมาะสม จึงโดยทั่วไป LOQ อยู่ที่ concentrationสูงกว่า LOD.",
    traps:["ทิศทางกลับกัน; LOQ มักสูงกว่า LOD","การใช้งานขึ้นกับ intended purpose ไม่ได้แบ่งแบบนั้น","LOQ ต้องมี quantitative performanceรวม precision","Detector typeไม่ทำให้สองนิยามเท่ากัน"],
    difficulty:"medium",
    ref:"ICH Q2(R2)"
  },
  {
    topic:"Dissolution apparatus",
    prompt:"สำหรับ immediate-release conventional tablet ที่ไม่มีข้อกำหนดเฉพาะอื่น อุปกรณ์ใดเป็นหนึ่งใน apparatus ที่ใช้แพร่หลายในการทดสอบ dissolution?",
    options:["USP Apparatus 2 (paddle)","Friabilator","Disintegration basket-rack เพียงอย่างเดียว","Tapped-density tester","Karl Fischer cell"],
    rationale:"USP Apparatus 1 (basket) และ 2 (paddle) เป็น dissolution apparatus มาตรฐานที่ใช้กับ oral solid dosage forms ตาม monograph/method ที่กำหนด.",
    traps:["Friabilatorวัด friability","Disintegration testไม่เท่ากับ dissolution","Tapped density testerวัด powder packing","Karl Fischerวัดน้ำ"],
    difficulty:"easy",
    ref:"USP <711> Dissolution"
  },
  {
    topic:"Content uniformity",
    prompt:"ผลิตภัณฑ์ยาเม็ดมี API ขนาดต่ำมากเมื่อเทียบกับน้ำหนักเม็ด และมีความเสี่ยงต่อ segregation การควบคุมใดสัมพันธ์กับความสม่ำเสมอของปริมาณยาต่อหน่วยมากที่สุด?",
    options:["Uniformity of dosage units / content uniformity","Friability","Tablet thickness","Disintegration time","Moisture content ของภาชนะ"],
    rationale:"Low-dose product ไวต่อ blend segregation และ dose-to-dose variability จึงต้องให้ความสำคัญกับ content uniformity/uniformity of dosage units พร้อม control ของ blending/segregation.",
    traps:["Friabilityวัดความทนต่อการสึก","Thicknessเป็น physical dimension","Disintegrationไม่บอก API amountต่อหน่วย","Container moistureอาจสำคัญต่อ stabilityแต่ไม่ใช่ endpointตรงของ dose uniformity"],
    difficulty:"medium",
    ref:"USP <905> Uniformity of Dosage Units"
  },
  {
    topic:"Tablet coating defects",
    prompt:"หลัง film coating พบผิวเม็ดยาบางตำแหน่งถูกดึงหลุดติดกับผิว pan/เม็ดยาอื่น โดยมักสัมพันธ์กับ over-wetting ข้อบกพร่องใดใกล้เคียงที่สุด?",
    options:["Sticking","Capping","Lamination","Mottling","Bridging ของ score line"],
    rationale:"Over-wetting/insufficient drying ทำให้ tackiness สูงและเม็ดยาติดกันหรือผิวติดกับอุปกรณ์ เกิด sticking/picking ตามตำแหน่งและลักษณะ.",
    traps:["Cappingเกิดระหว่าง compression เป็นหลัก","Laminationคือเม็ดแยกเป็นชั้น","Mottlingคือสีไม่สม่ำเสมอ","Bridgingคือ film ปิดร่อง/ตัวอักษร ไม่ใช่ผิวถูกดึงจาก over-wetting"],
    difficulty:"easy",
    ref:"Aulton’s Pharmaceutics — coating defects"
  },
  {
    topic:"Lyophilization",
    prompt:"ใน freeze-drying ขั้น primary drying มีวัตถุประสงค์หลักใด?",
    options:["กำจัดน้ำแข็งโดย sublimation ภายใต้ความดันต่ำพร้อมควบคุม product temperature","กำจัด bound water โดย desorption เป็นหลัก","หลอมผลิตภัณฑ์ให้เป็นของเหลวก่อนอบ","เพิ่ม residual moisture เพื่อป้องกัน cake collapse","sterilize ผลิตภัณฑ์ด้วยความร้อน"],
    rationale:"Primary drying เกิดหลัง freezing โดยลด pressure และให้พลังงานอย่างควบคุมเพื่อให้น้ำแข็ง sublimation; ต้องรักษา product temperature ต่ำกว่า critical collapse/eutectic temperature ตามสูตร.",
    traps:["Bound/unfrozen water reductionเป็นบทบาทเด่นของ secondary drying","การหลอมจะทำลายโครงสร้าง freeze-dried cake","เป้าหมายคือเอาน้ำออก ไม่ใช่เพิ่ม residual moisture","Lyophilizationไม่ใช่ sterilization process"],
    difficulty:"medium",
    ref:"Aulton’s Pharmaceutics — freeze drying"
  },
  {
    topic:"Depyrogenation",
    prompt:"Dry-heat depyrogenation tunnel สำหรับ glass containers มีวัตถุประสงค์สำคัญที่ต่างจากการ sterilize ทั่วไปอย่างไร?",
    options:["มุ่งลด/ทำลาย pyrogenic endotoxin บนภาชนะด้วย cycle ที่ validated","มุ่งเพิ่ม bioburden เพื่อ challenge aseptic process","ใช้แทน washing step ได้เสมอ","ใช้เฉพาะเพื่อทำให้แก้วแห้งโดยไม่ต้อง validate lethality","ทำให้ endotoxin กลายเป็น viable bacteria ที่ตรวจได้"],
    rationale:"Depyrogenation dry heat ใช้ high-temperature validated process เพื่อให้เกิด endotoxin reduction ตาม acceptance criteria พร้อมให้ sterility assuranceกับ heat-stable components.",
    traps:["ไม่ใช่การเพิ่ม bioburden","Cleaning/washingยังเป็นส่วนสำคัญของ control strategy","ต้อง validate ทั้ง temperature distribution/penetration และ endotoxin reduction","Endotoxinไม่เปลี่ยนกลับเป็น viable bacteria"],
    difficulty:"medium",
    ref:"USP <1228>/<85> concepts; EU GMP Annex 1"
  },
  {
    topic:"Pharmaceutical water",
    prompt:"ในการควบคุม purified water/WFI parameter ใดใช้เป็น chemical quality indicators ที่สำคัญตาม pharmacopeial framework ร่วมกัน?",
    options:["Conductivity และ Total Organic Carbon (TOC)","Hardness และ color เพียงสองอย่าง","Assay ของ NaCl และ pH เท่านั้น","Dissolution และ friability","Particle size และ angle of repose"],
    rationale:"Conductivity ใช้ประเมิน ionic impurities และ TOC ประเมิน organic contamination burden; microbial/endotoxin requirementsขึ้นกับ water gradeและ use.",
    traps:["Hardness/colorไม่ใช่ core compendial pairสำหรับ pharmaceutical water control","NaCl assay/pHไม่ใช่ชุดมาตรฐานแทน conductivity/TOC","Dissolution/friabilityเป็น solid dosage tests","Particle flow metricsไม่เกี่ยวกับ water chemistry"],
    difficulty:"medium",
    ref:"USP <643> TOC; USP <645> Water Conductivity"
  },
  {
    topic:"Root cause / CAPA",
    prompt:"Deviation เกิด tablet weight ต่ำเป็นช่วง ๆ เฉพาะหลัง hopper level ลดต่ำกว่า 20%. Operator training, balance calibration และ raw-material assay ปกติ. Historian พบ feeder speed oscillationเมื่อ hopper ต่ำ. CAPA ใดมีเหตุผลเชิง root cause มากที่สุด?",
    options:["กำหนด/ควบคุม minimum hopper level และแก้ feeder control พร้อม verify effectiveness","อบรม operator ซ้ำทุกคนแม้ไม่พบ human error","เพิ่ม finished-product sampling อย่างเดียว","เปลี่ยน API supplier โดยไม่พบ material trend","ปรับ specification ของ tablet weight ให้กว้างขึ้น"],
    rationale:"หลักฐานเชื่อม failure กับ process condition (low hopper level → feeder oscillation → underfill) จึงควร corrective action ที่กำจัดสาเหตุเครื่อง/process และกำหนด control limit พร้อม effectiveness check.",
    traps:["Trainingเป็น CAPAได้เมื่อ root causeเกี่ยวกับ knowledge/behavior แต่ข้อมูลนี้ไม่สนับสนุน","Samplingมากขึ้นตรวจพบปัญหาได้แต่ไม่กำจัดสาเหตุ","ไม่มีหลักฐาน supplierเป็นสาเหตุ","ขยาย specเพื่อให้ผ่านคือการหลบปัญหา ไม่ใช่ corrective action"],
    difficulty:"hard",
    ref:"ICH Q9(R1); ICH Q10; GMP deviation/CAPA principles"
  },
  {
    topic:"Quality risk management / FMEA",
    prompt:"ในการทำ FMEA ทีมให้คะแนน Severity=9, Occurrence=4, Detectability=3. หากใช้ RPN = S×O×D ค่า RPN เท่าใด และการตีความใดเหมาะสมที่สุด?",
    options:["108; ใช้เป็นเครื่องมือจัดลำดับความเสี่ยงร่วมกับบริบท ไม่ควรใช้ threshold แบบกลไกเพียงอย่างเดียว","16; ค่าไม่สูงจึงปิด risk ได้ทันที","27; severityสูงแต่ occurrenceต่ำจึงไม่ต้องควบคุม","36; detectabilityต่ำแปลว่าตรวจได้ยากที่สุด","108; ค่าเดียวเพียงพอที่จะตัดสินใจ release batch"],
    rationale:"RPN=9×4×3=108. ICH Q9(R1) เน้นว่า risk scoring tools สนับสนุนการตัดสินใจ แต่ไม่ควรแทน scientific judgment; high severity อาจต้อง attention แม้ RPNไม่สูงสุด.",
    traps:["คำนวณผิดและสรุปเร็วเกิน","คำนวณผิด; severityสูงยังต้องพิจารณา","คำนวณผิดและความหมาย detectabilityขึ้นกับ scoring conventionที่กำหนด","RPNไม่ใช่ release criterion โดยอัตโนมัติ"],
    difficulty:"hard",
    ref:"ICH Q9(R1) Quality Risk Management",
    calc:["RPN = Severity × Occurrence × Detectability","9 × 4 × 3 = 108","พิจารณา score ร่วมกับ severity, uncertainty และ control strategy"]
  },
  {
    topic:"Blend uniformity / segregation",
    prompt:"Blend uniformity หลัง blender ผ่านทุกตำแหน่ง แต่ tablet content uniformity เริ่ม fail เฉพาะปลาย batch ขณะที่ tablet weight ยังผ่าน สาเหตุใดควรสงสัยมากที่สุด?",
    options:["Segregation ระหว่าง transfer/feed ทำให้ API distribution เปลี่ยนแม้น้ำหนักเม็ดยาคงที่","Assay method มี bias คงที่ทั้ง batch","Compression forceสูงทำให้ API สลายตัวเฉพาะปลาย batch","Lubricantทำให้ tablet weightต่ำทุกเม็ด","Coating weight gainไม่สม่ำเสมอแม้เป็น uncoated core"],
    rationale:"Blend ตอนจบ blenderสม่ำเสมอแต่ CU เสียเฉพาะปลาย run และ weightปกติ ชี้ dynamic segregation ระหว่าง discharge/transport/hopper เช่น size/density differences มากกว่าปัญหา die fill.",
    traps:["Analytical biasคงที่ควรกระทบทุกช่วง ไม่เฉพาะปลาย batch","Compression forceไม่ควรเปลี่ยน API amount per tabletโดยตรงและต้องมี degradation evidence","ถ้า weightต่ำทุกเม็ดจะเห็น weight variation/mean shift","Coatingไม่เกี่ยวหากทดสอบ core/uncoated stage"],
    difficulty:"hard",
    ref:"FDA blend/content uniformity principles; ICH Q8 process understanding"
  },
  {
    topic:"OOT vs OOS / continued verification",
    prompt:"Assay specification 95–105%. ผล 10 batches ล่าสุดคือ 100.2, 100.1, 99.9, 99.7, 99.5, 99.2, 98.9, 98.6, 98.3, 98.0% ทุก batch ยังอยู่ใน spec. การดำเนินการใดเหมาะสมที่สุด?",
    options:["ถือเป็น adverse trend/OOT signal ที่ควร trend-investigate ก่อนกลายเป็น OOS","ไม่ต้องทำอะไรจนกว่าจะต่ำกว่า 95%","รีลีสไม่ได้ทุก batch เพราะแนวโน้มลดลง","เฉลี่ยทั้งหมดแล้วใช้ค่าเฉลี่ยแทนผลแต่ละ batch","ปรับ specificationลงเป็น 90–105% เพื่อรองรับ trend"],
    rationale:"ทุกผลยัง within specification แต่มี monotonic downward trend ซึ่งเป็นสัญญาณ process drift. Continued process verification/trending ควรตรวจสอบก่อนเกิด failureจริง.",
    traps:["การรอ OOSทำให้เสียโอกาส proactive control","Trendอย่างเดียวไม่ได้ทำให้ทุก batch unreleasableโดยอัตโนมัติ ต้องประเมินคุณภาพและสาเหตุ","ห้ามใช้ค่าเฉลี่ยข้าม batchแทน individual release data","เปลี่ยน specเพื่อรองรับ driftโดยไม่มี scientific/regulatory basisไม่ถูกต้อง"],
    difficulty:"hard",
    ref:"ICH Q10; FDA Process Validation lifecycle / continued process verification"
  },
];

function buildQuestion(d: Draft, index: number): McqQuestion {
  const pos = answerPositions[index];
  const correct = d.options[0];
  const distractors = d.options.slice(1);
  const shuffled = [...distractors];
  shuffled.splice(pos, 0, correct);
  const answer = labels[pos];

  const choiceExplanations = shuffled.map((text, j) => {
    if (j === pos) {
      return {
        label: labels[j],
        text,
        is_correct: true,
        explanation: `ถูก — ${d.rationale}`,
      };
    }
    const originalWrongIndex = distractors.indexOf(text as string);
    return {
      label: labels[j],
      text,
      is_correct: false,
      explanation: `ไม่เลือก — ${d.traps[originalWrongIndex]}`,
    };
  });

  return {
    id: `ip1set1_${String(index + 1).padStart(3, "0")}`,
    subject_id: "ip1",
    exam_type: "PLE-CC1",
    exam_source: "PharmRU PLE-IP1 Mock Set 1",
    exam_day: null,
    question_number: index + 1,
    scenario: `IP1 Mock Set 1 · ${d.topic}\n\n${d.prompt}`,
    image_url: null,
    choices: shuffled.map((text, j) => ({ label: labels[j], text })),
    correct_answer: answer,
    explanation: `หลักการ: ${d.rationale}\n\nReference: ${d.ref}`,
    detailed_explanation: {
      summary: `เฉลย ${answer}. ${correct}`,
      reason: `【หลักการสำคัญ】\n${d.rationale}\n\n【วิธีคิดแบบข้อสอบ IP1】\nโจทย์ข้อนี้ต้องจับ keyword ของหัวข้อ “${d.topic}” แล้วแยกตัวเลือกที่จริงบางส่วนแต่ไม่ใช่ single best answer ออกจากคำตอบที่อธิบายข้อมูลทั้งหมดในโจทย์ได้ตรงที่สุด. ในงานอุตสาหกรรมต้องเชื่อม formulation/process/analytical result กับ critical quality attribute หรือ quality-system decision ที่เกี่ยวข้อง ไม่ควรเลือกจากความคุ้นชื่อเพียงอย่างเดียว.\n\n【Reference / หลักอ้างอิง】\n${d.ref}`,
      choices: choiceExplanations,
      key_takeaway: `Exam Pearl: ${d.rationale}`,
      ...(d.calc ? { calculation_steps: d.calc } : {}),
    },
    difficulty: d.difficulty,
    is_ai_enhanced: true,
    ai_notes: "Original PharmRU IP1 item. Distractors intentionally plausible; editorial verification recommended before high-stakes commercial use.",
    status: "active",
    created_at: "2026-09-22 16:00:00",
    mcq_subjects: {
      id: "ip1",
      name: "IP1",
      name_th: "เภสัชกรรมอุตสาหการ IP1",
      icon: "🏭",
      exam_type: "PLE-CC1",
      question_count: 50,
      created_at: "2026-09-22 16:00:00",
    },
  };
}

export const IP1_PILOT_050: McqQuestion[] = D.map(buildQuestion);
