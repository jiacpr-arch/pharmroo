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
    prompt:"Delayed-release tablet รุ่นหนึ่งมีผลดังนี้: uncoated core Q30 = 96%; หลังเคลือบ acid stage 2 ชั่วโมงปลดปล่อย 1.5%; buffer pH 6.8 ที่ 45 นาทีปลดปล่อย 58% (เกณฑ์ ≥80%). Coating weight gain อยู่ใน target และ SEM ไม่พบ crack. Batch record พบว่า curing time เพิ่มจาก validated 60 นาทีเป็น 4 ชั่วโมง ขณะที่ inlet temperature เดิม. ข้อใดเป็นสมมติฐานและการยืนยันที่เหมาะสมที่สุด?",
    options:["สงสัย over-curing ทำให้ polymer coalescence มากขึ้นและ film permeability ลดลง; ทำ comparative dissolution/film study ตาม curing time","สงสัย disintegrant ใน core ต่ำ; เพิ่ม disintegrant แล้วตัดประเด็น coating ออก","สงสัย coat บางเกินไป; เพิ่ม coating weight gain เพื่อให้ acid resistance สูงขึ้น","สงสัย API particle size ใหญ่; micronize API แล้วทำ dissolution เฉพาะ core","สงสัย assay ต่ำ; เพิ่ม sample size ของ assay โดยไม่ทบทวน coating process"],
    rationale:"ข้อมูลแยกสาเหตุได้ค่อนข้างชัด: core ละลายดี, acid resistance ผ่าน, coat thickness อยู่ใน target และไม่มี crack แต่ buffer release ช้าเฉพาะหลังมี curing time นานกว่าช่วง validated. Over-curing สามารถเพิ่ม polymer coalescence/ลด permeability และชะลอการเปิดของ enteric film จึงควรยืนยันด้วย study ที่เปรียบเทียบ curing time กับ dissolution/film properties.",
    traps:["Core Q30 96% ทำให้ disintegrant ต่ำไม่ใช่สมมติฐานแรก","Acid stage ผ่านอยู่แล้ว; เพิ่ม coat อาจยิ่งชะลอ buffer release","Micronization ไม่อธิบายความต่างก่อน/หลัง coating เมื่อ core ผ่านดี","Assay ไม่ได้ตอบ mechanism ของ delayed buffer release และไม่ใช่ root-cause test"],
    difficulty:"hard",
    ref:"Aulton’s Pharmaceutics; enteric coating process-development principles; USP delayed-release performance concepts"
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
    prompt:"Critical pair ใน HPLC ให้ tR1 = 7.40 min, W1 = 0.44 min และ tR2 = 8.06 min, W2 = 0.47 min. Method specification กำหนด Rs ≥1.50. หากผลอื่นของ system suitability ผ่านทั้งหมด ข้อใดเป็นข้อสรุปและแนวทางปรับ method ที่เหมาะสมที่สุด?",
    options:["Rs ≈1.45 จึงไม่ผ่านแบบ marginal; ควรปรับ selectivity เช่น mobile-phase composition/pH ก่อนพิจารณาเพิ่ม run time อย่างเดียว","Rs ≈1.50 จึงผ่านพอดีและไม่ต้องประเมิน robustness","Rs ≈2.90 จึงผ่านมาก สามารถเพิ่ม injection volume เพื่อเพิ่ม sensitivity","Rs ≈1.45 แต่ถือว่าผ่านได้เพราะ peak area ของ API มากกว่า impurity","Rs ≈0.73 และควรลด flow rateลงครึ่งหนึ่งซึ่งรับประกันว่า Rs จะเพิ่มเป็นสองเท่า"],
    rationale:"Rs = 2(8.06−7.40)/(0.44+0.47) = 1.32/0.91 ≈1.45 จึงต่ำกว่าเกณฑ์ 1.50 แม้เพียงเล็กน้อย. การเพิ่ม selectivity (α) ผ่าน pH/organic composition/chemistry มักมี leverage ต่อ resolution มากกว่าการยืด retention timeอย่างเดียว และต้องยืนยัน robustness.",
    traps:["คำนวณคลาดเคลื่อนและไม่ควรถือ thresholdแบบปัดขึ้นโดยไม่มีหลัก","Rs ไม่ได้เท่ากับ 2.90; injection volumeสูงยังอาจทำให้ peak broadening/overload","Peak areaไม่ใช่เกณฑ์ทดแทน chromatographic resolution","0.73เกิดจากลืม factor 2 และการลด flow rateไม่ได้ทำให้ Rs เพิ่มเป็นสองเท่าโดยอัตโนมัติ"],
    difficulty:"hard",
    ref:"USP <621> Chromatography; chromatographic method-development principles",
    calc:["ΔtR = 8.06 − 7.40 = 0.66 min","W1 + W2 = 0.44 + 0.47 = 0.91 min","Rs = 2(0.66)/0.91 ≈ 1.45","เทียบเกณฑ์: 1.45 < 1.50 → fail marginally"]
  },
  {
    topic:"HPLC peak tailing",
    prompt:"Weakly basic API (pKa 8.3) วิเคราะห์ด้วย silica-based C18. ที่ mobile-phase pH 6.8 พบ tailing factor 2.4; เมื่อปรับ pH เป็น 3.0 โดยคง organic ratio ใกล้เดิม tailing factor ลดเป็น 1.2 และ efficiency ดีขึ้น. ข้อใดอธิบายผลนี้ได้เหมาะสมที่สุด?",
    options:["ที่ pH ต่ำ residual silanol บน silica ถูก ionize น้อยลง จึงลด secondary ionic interaction กับ basic analyte","ที่ pH ต่ำ API กลายเป็น unionized มากขึ้นจึงไม่เกิด tailing","ที่ pH ต่ำ C18 ligand เปลี่ยนเป็น charged stationary phase ทำให้ peak symmetric","ที่ pH ต่ำ UV detector มี selectivity สูงขึ้นจึงลด peak tailing","ที่ pH ต่ำ viscosity ลดลงเสมอจึงทำให้ silanol interaction หายไป"],
    rationale:"Basic analytes มัก tail จาก secondary interaction กับ deprotonated residual silanol sites. การลด pH suppress silanol ionization จึงลด ionic interaction แม้ API จะ protonated มากขึ้นก็ตาม. นี่เป็นเหตุผลเชิง surface chemistry ไม่ใช่ detector effect.",
    traps:["Weak base ที่ pH 3 จะ protonated มากขึ้น ไม่ใช่ unionized มากขึ้น","C18 ligandไม่ได้เปลี่ยนเป็น charged phaseเพียงเพราะ pHต่ำ","Detector ไม่ได้เปลี่ยน chromatographic peak shape ที่เกิดจาก column interaction","Viscosityอาจเปลี่ยนตาม solvent composition/temperature แต่ไม่ใช่คำอธิบายจำเพาะของ silanol suppression"],
    difficulty:"hard",
    ref:"USP <621>; silica-based RP-HPLC selectivity and silanol-interaction principles"
  },
  {
    topic:"Stability-indicating HPLC",
    prompt:"Forced degradation ของ Drug X ให้ผล: unstressed assay 99.4%; acid stress assay 87.0% และมี degradant D = 11.8%. D elutes ที่ shoulder ของ API. PDA รายงาน peak purity 'pass' แต่ D และ API มี UV spectra คล้ายกันมาก. ข้อใดเป็นข้อสรุปที่เหมาะสมที่สุดก่อนประกาศว่าวิธีเป็น stability-indicating?",
    options:["ยังสรุปไม่ได้; ต้องยืนยัน separation/selectivity เพิ่มด้วยการปรับ chromatographic conditions หรือ orthogonal evidence เพราะ PDA peak-purity อาจพลาด co-elution ของสาร spectra คล้ายกัน","ถือว่าผ่าน specificity แล้วเพราะ PDA peak purity pass เป็นหลักฐานเด็ดขาด","ถือว่าผ่านเพราะ mass balance 98.8% ใกล้ 100% แม้ critical pair ยังเป็น shoulder","ลด acid stress จน degradant ต่ำกว่า 5% แล้วถือว่า specificity ผ่านโดยไม่ต้องเปลี่ยน method","ใช้ area normalization ของ API+D เป็น 100% แล้วไม่ต้องแยก D ออกจาก API"],
    rationale:"Peak-purity tools มีข้อจำกัด โดยเฉพาะเมื่อ co-eluting species มี spectra คล้ายกัน. Shoulder ของ known degradant ที่ critical API peak ทำให้ต้องมีหลักฐานเพิ่มว่า method แยก analyte จาก degradants ได้จริง; mass balanceดีไม่ได้พิสูจน์ specificity.",
    traps:["PDA passไม่ใช่หลักฐานเด็ดขาดเมื่อ spectra คล้ายและมี chromatographic shoulder","Mass balanceสนับสนุน degradation accounting แต่ไม่ยืนยัน resolution/selectivity","ลด stressเพียงเพื่อทำให้ impurityน้อยลงไม่แก้ข้อจำกัด method","Area normalizationไม่แทน chromatographic separationของ critical impurity"],
    difficulty:"hard",
    ref:"ICH Q2(R2); ICH Q14; stability-indicating method-development principles"
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
    prompt:"ผลิตภัณฑ์มี labeled claim 100 mg/tablet แต่ initial assay = 102.0% label claim. หลัง 12 เดือน assay = 95.0% label claim. สมมติ first-order degradation และไม่มี assay bias. หาก specification shelf life คือ assay ≥90.0% label claim ค่าเวลาที่คาดว่าจะถึง 90.0% ใกล้เคียงข้อใดที่สุด?",
    options:["ประมาณ 21 เดือน","ประมาณ 17 เดือน","ประมาณ 24 เดือน","ประมาณ 30 เดือน","ประมาณ 12 เดือน เพราะ assay ลด 7% ใน 12 เดือน"],
    rationale:"First-order ต้องใช้สัดส่วน concentration จริง: k = ln(102/95)/12 ≈0.00592 month⁻¹. เวลาจาก initial 102% ไปถึง 90% คือ ln(102/90)/k ≈21.1 เดือน. จุดหลอกคือ t90 ที่นี่อิง specification 90% label claim ไม่ใช่ 90% ของ initial assay.",
    traps:["17 เดือนได้จากการตีความ 90% ของ initialหรือประมาณเชิงเส้นบางแบบ","24 เดือนไม่ตรง exponential fit จากข้อมูลสองจุด","30 เดือนสูงเกินจาก estimated k","ใช้การลดแบบ linear 7%/12เดือนขัดกับ assumption first-order"],
    difficulty:"hard",
    ref:"ICH Q1A(R2) concepts; pharmaceutical stability kinetics",
    calc:["k = ln(102/95) / 12 ≈ 0.00592 month⁻¹","t = ln(102/90) / 0.00592","t ≈ 21.1 months"]
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
    prompt:"Assay sample preparation เดียวกันให้ injection แรก 92.0% (OOS). Reinjection จาก vial เดิมได้ 99.1%. System suitability ผ่านทั้งสองครั้ง. Audit trail ไม่พบ aborted run, detector error หรือ autosampler alarm; chromatograms ไม่มี integration anomaly. ขั้นตอนใดเหมาะสมที่สุดตามหลัก OOS?",
    options:["คงผล 92.0% ไว้ใน investigation และดำเนิน laboratory investigation/Phase II ตาม SOP; reinjection ที่ผ่านเพียงอย่างเดียวยังไม่เป็น assignable cause","invalidate 92.0% เพราะ reinjection จาก vialเดียวกันพิสูจน์ว่า instrument ผิดพลาด","เฉลี่ย 92.0% กับ 99.1% แล้วใช้ mean เป็น reportable result","เตรียมตัวอย่างใหม่อย่างน้อย 6 ชุดและใช้ค่าเฉลี่ยหากผ่านโดยไม่ต้องอธิบายผลเดิม","เลือก 99.1% เป็นผลสุดท้ายเพราะ system suitability ผ่านและใกล้ historical mean"],
    rationale:"เมื่อไม่มี objective evidence ของ assignable laboratory error ผล reinjection ที่ผ่านไม่ลบ OOS เดิม. ต้องสืบสวนอย่างเป็นระบบและหาก Phase I ไม่พบสาเหตุ อาจขยายไป manufacturing/Phase II ตาม SOP โดย retesting plan ต้อง pre-defined/scientifically justified.",
    traps:["Passing reinjectionไม่พิสูจน์ instrument errorเมื่อไม่มี supporting evidence","การเฉลี่ยผล OOSกับ passing resultเพื่อให้ผ่านไม่ถูกหลัก","Retestจำนวนมากโดยไม่มี protocolเป็น testing into compliance","Historical meanไม่ใช่เหตุผล invalidate valid OOS result"],
    difficulty:"hard",
    ref:"FDA Guidance for Industry: Investigating OOS Test Results for Pharmaceutical Production; GMP data-integrity principles"
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
    prompt:"Tablet press เกิด weight excursion เฉพาะช่วงท้าย batch. Data review พบ: hopper level <18% เกิด feeder torque oscillation; weight CV เพิ่มจาก 1.1% เป็น 4.8%; เมื่อ operator เติม blend ให้ hopper >30% ค่า CV กลับปกติภายใน 2 นาที. Raw-material PSD, blend assay, balance calibration และ compression force อยู่ใน trend. CAPA package ใดตอบ root cause และ effectiveness verification ได้ดีที่สุด?",
    options:["ตั้ง validated minimum hopper-level control/interlock ร่วมกับแก้ feeder-control logic แล้วติดตาม weight-CV trendหลาย batchesเพื่อยืนยัน effectiveness","เพิ่ม end-product sampling เป็นสองเท่าและอบรม operatorให้เฝ้าดูหน้าจอ","ลด tablet-weight specification ให้กว้างขึ้นและเพิ่ม reconciliation","เปลี่ยน excipient supplierพร้อมทำ incoming testเพิ่ม แม้ material trendปกติ","เพิ่ม compression forceช่วงท้าย batchเพื่อชดเชย underfill"],
    rationale:"ข้อมูลแสดง causal chain ที่ทำซ้ำได้ระหว่าง low hopper level → feeder instability → weight variability และ reversal หลังเติม hopper. CAPA ที่ดีต้องกำจัด/ควบคุมสาเหตุเชิง process และมี effectiveness check จาก process metric ที่สัมพันธ์โดยตรง ไม่ใช่เพียงเพิ่ม detection.",
    traps:["Sampling/trainingเพิ่ม detectionแต่ไม่แก้ feeder/hopper mechanism","การขยาย specเป็นการยอมรับปัญหา ไม่ใช่แก้สาเหตุ","ไม่มี evidence ชี้ supplierและจะสร้าง uncontrolled changeใหม่","Compression forceมีผลต่อ compact properties ไม่แก้ die-fill mass variabilityจาก feeder"],
    difficulty:"hard",
    ref:"ICH Q9(R1); ICH Q10; FDA Process Validation lifecycle principles"
  },
  {
    topic:"Quality risk management / FMEA",
    prompt:"FMEA มี 2 failure modes: A = cross-contamination ของ highly potent API (S=10,O=2,D=2) และ B = cosmetic tablet mottling (S=4,O=5,D=2). ทั้งสองมี RPN=40. ข้อใดเป็นการตีความที่เหมาะสมที่สุดตามหลัก Quality Risk Management?",
    options:["ไม่ควรถือว่าความเสี่ยงเท่ากันเพียงเพราะ RPN เท่ากัน; failure mode A ควรได้รับ attention สูงจาก severity/ผลต่อผู้ป่วยและต้องพิจารณาร่วมกับ controls/uncertainty","ความเสี่ยงเท่ากันทุกประการเพราะ RPN เท่ากับ 40 เหมือนกัน","ควรจัดการ B ก่อนเสมอเพราะ occurrence สูงกว่า A","ควรจัดการ A และ B เหมือนกันโดยใช้ CAPA แบบเดียวกันเพื่อความสม่ำเสมอ","RPN ต่ำกว่า 100 หมายความว่าปิด risk ได้ทั้งสองโดยไม่ต้อง mitigation"],
    rationale:"ICH Q9(R1) เตือนข้อจำกัดของ scoring/RPN: ผลคูณเดียวกันอาจซ่อน profile ที่ต่างกันมาก. Severity สูงมาก โดยเฉพาะ patient-safety/cross-contamination ต้องได้รับการพิจารณาเด่น แม้ occurrence ต่ำและ RPNเท่ากับเหตุการณ์เชิง cosmetic.",
    traps:["RPNเท่ากันไม่ได้แปล risk profileเท่ากัน","Occurrenceสูงอย่างเดียวไม่ชนะ severityสูงเสมอ","Mitigationต้อง risk-specific ไม่ใช่ one-size-fits-all","ไม่มี universal RPN cutoffที่ใช้ปิด riskโดยอัตโนมัติ"],
    difficulty:"hard",
    ref:"ICH Q9(R1) Quality Risk Management"
  },
  {
    topic:"Blend uniformity / segregation",
    prompt:"Low-dose direct-compression tablet: blend uniformity ที่ blender discharge ผ่าน (RSD 2.1%). ระหว่าง compression tablet weight RSD คงที่ 1.2% แต่ content uniformity ของ 20 เม็ดช่วงต้นผ่านและ 20 เม็ดท้าย batch มีแนวโน้มต่ำลงต่อเนื่อง. API d50 = 18 µm, major diluent d50 = 160 µm และมี pneumatic transfer ก่อนเข้า hopper. การศึกษาต่อใดแยก 'segregation ระหว่าง transfer/feed' ออกจาก 'analytical variability' ได้ดีที่สุด?",
    options:["ทำ stratified sampling ตามตำแหน่ง/เวลา ณ transfer line-hopper-tablet sequence แล้ววิเคราะห์ API concentration พร้อม particle-size/segregation mapping","ทำ assay composite sample ของทั้ง batchเพิ่มอีก 3 ครั้ง","เพิ่มจำนวน replicate injectionsจาก tablet ปลาย batchโดยไม่เก็บ sampleตามตำแหน่ง","วัด tablet hardnessต้นและปลาย batchเท่านั้น","ทำ dissolution ของ composite sampleโดยไม่แยกช่วงเวลา"],
    rationale:"Hypothesis คือ spatial/temporal segregation หลัง blender. ต้องออกแบบ sampling ที่รักษาข้อมูลตำแหน่งและเวลาเพื่อดู concentration gradient และเชื่อมกับ particle-size difference/transfer step; composite assayหรือ replicate analytical injectionsจะลบข้อมูล segregation pattern.",
    traps:["Composite assayเฉลี่ยสัญญาณและอาจซ่อน gradient","Replicate injectionช่วยประเมิน analytical precisionแต่ไม่บอกว่าความเข้มข้นเปลี่ยนตาม process locationหรือไม่","Hardnessไม่วัด API distribution","Composite dissolutionไม่แยก process segregationจาก analytical variability"],
    difficulty:"hard",
    ref:"ICH Q8(R2); process-understanding and stratified content-uniformity principles"
  },
  {
    topic:"OOT vs OOS / continued verification",
    prompt:"Assay specification 95–105%. 12 batches ล่าสุดยังผ่านทั้งหมด แต่ค่าเฉลี่ยลดจากประมาณ 100.1% เหลือ 97.9% อย่างต่อเนื่อง. จุดเปลี่ยนเริ่มพร้อมกันกับ (1) การเปลี่ยน reference-standard lot และ (2) การเพิ่ม granulation endpoint time 15%. ไม่มี deviation เปิดอยู่. การดำเนินการใดเหมาะสมที่สุดเป็นลำดับแรก?",
    options:["เปิด trend/OOT investigation และแยกประเมิน analytical shift จาก reference-standard change กับ process driftจาก granulation change โดยใช้ retained samples/bridging data และ process trends","สรุปทันทีว่าเป็น process drift เพราะ granulation time เปลี่ยน","สรุปทันทีว่าเป็น analytical bias เพราะ reference standard เปลี่ยน","ไม่ต้อง investigate จนกว่าจะมี OOS ต่ำกว่า 95%","หยุด release ทุก batchย้อนหลังทั้งหมดโดยไม่ประเมิน individual batch quality"],
    rationale:"มีสอง contemporaneous changes ที่ต่างสามารถสร้าง apparent trend ได้. Scientific investigation ต้อง discriminate analytical system shift ออกจาก true process drift โดย bridging/retained-sample reanalysisที่มี justificationและ process data ไม่ควรเลือกสาเหตุจากเวลาเกิดร่วมกันเพียงอย่างเดียว.",
    traps:["Temporal associationกับ process changeยังไม่พิสูจน์ causationเมื่อ analytical changeเกิดพร้อมกัน","Reference-standard changeเป็น plausible causeแต่ยังต้องยืนยันด้วย bridging/traceability","การรอ OOSขัดกับ proactive continued process verification","Trend signalไม่ทำให้ทุก released/within-spec batch invalidโดยอัตโนมัติ"],
    difficulty:"hard",
    ref:"ICH Q10; FDA Process Validation lifecycle; GMP OOT/trending and laboratory-control principles"
  }
];


const D2: Draft[] = [
  {
    topic:"Assay calculation / external standard",
    prompt:"HPLC assay ใช้ external standard. Standard ชั่ง 50.0 mg (potency 99.2% as-is) ปรับปริมาตรเป็น 100.0 mL แล้วเจือจาง 5.0 mL เป็น 50.0 mL. Sample ชั่งผงยาเทียบเท่า label claim 50.0 mg ปรับเป็น 100.0 mL แล้วเจือจางแบบเดียวกัน. Mean peak area: standard 485,000; sample 492,000. หาก response factor เท่ากัน assay (% label claim) ใกล้เคียงเท่าใด?",
    options:["100.6%","99.2%","101.4%","98.6%","102.2%"],
    rationale:"เมื่อ standard/sample มี nominal concentration และ dilution scheme เหมือนกัน ต้องแก้ด้วย standard potency: Assay ≈ (492000/485000)×99.2 = 100.63%. จุดหลอกคือห้ามลืม potency ของ reference standard.",
    traps:["99.2% คือ potency standard ไม่ใช่ assay sample","101.4% คือ area ratio ×100 โดยไม่ได้แก้ standard potency","98.6% เกิดจากใช้ potency correctionกลับทิศ","102.2% ไม่ตรงการคำนวณจาก area ratioและ potency"],
    difficulty:"hard",
    ref:"ICH Q2(R2); compendial external-standard quantitation principles",
    calc:["Area ratio = 492000/485000 = 1.01443","Assay = 1.01443 × 99.2%","≈ 100.6% label claim"]
  },
  {
    topic:"Assay / salt-to-base conversion",
    prompt:"ผลิตภัณฑ์ระบุ label claim เป็น Drug X free base 100 mg/tablet แต่ใช้ Drug X hydrochloride (MW salt 336.8; MW free base 300.4) เป็นวัตถุดิบ. หาก API assay ของเกลือ = 98.5% as-is ต้องชั่ง Drug X HCl กี่ mg โดยประมาณต่อเม็ดเพื่อให้ได้ free base 100 mg?",
    options:["113.8 mg","111.9 mg","101.5 mg","98.5 mg","116.7 mg"],
    rationale:"ต้องแก้ทั้ง molecular-weight conversion และ potency: required salt = 100×(336.8/300.4)/0.985 ≈113.8 mg.",
    traps:["111.9 mg แก้เฉพาะ MW แต่ไม่แก้ potency","101.5 mg เป็นการแก้ potencyของ free baseโดยไม่แปลง salt","98.5 mg ใช้ assay%เป็นมวลโดยตรง","116.7 mg สูงเกินจากทั้งสอง correction"],
    difficulty:"hard",
    ref:"Pharmaceutical calculations; assay/potency correction principles",
    calc:["Stoichiometric salt needed = 100 × 336.8/300.4 ≈ 112.12 mg","Correct for 98.5% potency: 112.12/0.985 ≈ 113.83 mg"]
  },
  {
    topic:"Assay / dried basis",
    prompt:"API certificate ระบุ assay 97.8% as-is และ water by KF = 2.5%. หากต้องรายงาน assay on anhydrous basis ค่าใกล้เคียงเท่าใด?",
    options:["100.3%","95.4%","97.8%","99.1%","102.5%"],
    rationale:"Anhydrous assay = as-is assay /(1−water fraction) = 97.8/0.975 ≈100.31%.",
    traps:["95.4% เป็นการคูณด้วย fraction แห้งผิดทิศ","97.8% ยังเป็น as-is","99.1% ไม่ตรง correction","102.5% คือการบวก water%ตรง ๆ"],
    difficulty:"hard",
    ref:"Compendial basis correction principles",
    calc:["Dry fraction = 1 − 0.025 = 0.975","Anhydrous assay = 97.8/0.975 ≈ 100.3%"]
  },
  {
    topic:"Assay / dilution-factor trap",
    prompt:"Sample solution เตรียมโดยชั่งผงยาเทียบเท่า API 25 mg เติมเป็น 100 mL จากนั้นดูด 4.0 mL เติมเป็น 50.0 mL. HPLC เทียบ standard 20 µg/mL แล้ว sample final ให้ response เท่ากับ 98.0% ของ standard. ปริมาณ API ใน sample เดิมใกล้เคียงเท่าใด?",
    options:["24.5 mg","19.6 mg","25.0 mg","12.25 mg","30.6 mg"],
    rationale:"Final sample concentration = 0.98×20 =19.6 µg/mL. ย้อน dilution 4→50 คือ ×12.5 จึง original stock =245 µg/mL; ×100 mL =24,500 µg =24.5 mg.",
    traps:["19.6 mg สับสน final concentrationกับ total amount","25 mg คือ nominal claim ไม่ใช่ measured amount","12.25 mg เกิดจากใช้ dilution factorครึ่งหนึ่ง","30.6 mg ใช้ dilution factorผิด"],
    difficulty:"hard",
    ref:"Pharmaceutical analytical calculations",
    calc:["Cfinal = 20×0.98 = 19.6 µg/mL","Coriginal = 19.6×(50/4) = 245 µg/mL","Amount = 245×100 = 24,500 µg = 24.5 mg"]
  },
  {
    topic:"Assay / reference-standard potency",
    prompt:"Analyst คำนวณ assay โดยสมมติ USP reference standard =100.0% แต่ certificate lot ปัจจุบันระบุ assigned content 98.7% as-is. Sample/standard area ratio =1.005 และ nominal concentrations เท่ากัน. ผลที่ถูกต้องควรเป็นข้อใด?",
    options:["ประมาณ 99.2% ไม่ใช่ 100.5%","100.5% เพราะ reference standardถือว่า 100%เสมอ","98.7% เพราะ sample areaไม่สำคัญ","101.8% เพราะต้องหารด้วย 98.7%","ต้องรายงาน 100.0% โดยปัดค่า"],
    rationale:"Quantitation ต้องใช้ assigned content/potency ของ reference material ตาม certificate: 1.005×98.7 ≈99.19%.",
    traps:["Assigned contentต้องถูกใช้ ไม่ใช่สมมติ100เสมอ","Sample/standard responseยังมีผล","การหารด้วย0.987จะ correctionกลับทิศ","ห้ามปัดเพื่อบังคับให้เป็น100"],
    difficulty:"hard",
    ref:"ICH Q2(R2) — suitably characterized reference materials"
  },
  {
    topic:"Chromatography / retention factor",
    prompt:"Unretained marker ให้ t0=1.20 min และ API tR=6.00 min. Retention factor k' ของ API เท่าใด?",
    options:["4.0","5.0","3.8","0.8","6.0"],
    rationale:"k'=(tR−t0)/t0=(6.00−1.20)/1.20=4.0.",
    traps:["5.0 คือ tR/t0 ไม่ใช่ k'","3.8 ไม่ตรงสูตร","0.8 คือส่วนต่าง normalizedผิด","6.0 คือ retention time ไม่ใช่ retention factor"],
    difficulty:"medium",
    ref:"USP <621> Chromatography",
    calc:["k' = (6.00−1.20)/1.20","= 4.80/1.20 = 4.0"]
  },
  {
    topic:"Chromatography / selectivity",
    prompt:"Critical pair มี k'1=3.0 และ k'2=3.6. Selectivity factor α (กำหนด peak 2 retained มากกว่า) เท่าใด?",
    options:["1.20","0.83","0.60","1.60","6.60"],
    rationale:"α=k'2/k'1=3.6/3.0=1.20.",
    traps:["0.83 คือกลับเศษส่วน","0.60 คือผลต่าง","1.60 ไม่ตรงอัตราส่วน","6.60 คือผลบวก"],
    difficulty:"medium",
    ref:"Chromatographic separation theory"
  },
  {
    topic:"Chromatography / plate number",
    prompt:"Peak API มี tR=8.0 min และ baseline width W=0.40 min. หากใช้ N=16(tR/W)^2 จำนวน theoretical plates ใกล้เคียงเท่าใด?",
    options:["6,400","3,200","1,600","12,800","400"],
    rationale:"N=16(8/0.4)^2=16×20^2=6,400.",
    traps:["3,200 ลืม factorบางส่วน","1,600 ใช้ 4แทน16","12,800 เพิ่มfactorสองเท่า","400 คือเพียง ratio squaredโดยไม่คูณ16"],
    difficulty:"hard",
    ref:"USP <621> Chromatography",
    calc:["tR/W = 8/0.4 = 20","N = 16×20² = 6,400"]
  },
  {
    topic:"Chromatography / pH–pKa weak acid",
    prompt:"Weak acid API มี pKa 4.5 วิเคราะห์ด้วย C18 RP-HPLC. เมื่อ mobile-phase pH เปลี่ยนจาก 3.0 เป็น 6.0 โดย organic fractionคงเดิม retention time ลดลงมาก. คำอธิบายใดเหมาะสมที่สุด?",
    options:["ที่ pH 6 weak acid ionized มากขึ้น จึงมี hydrophobic interactionกับ C18 ลดลง","ที่ pH 6 weak acid unionized มากขึ้นจึงออกเร็วขึ้น","C18 กลายเป็น polar stationary phaseที่ pHสูง","UV absorbanceลดลงจึงทำให้ retentionลด","pHไม่มีผลต่อ retentionของ ionizable compounds"],
    rationale:"Weak acid เมื่อ pHสูงกว่า pKaจะอยู่ใน ionized formมากขึ้น มี polarityสูงขึ้นและโดยทั่วไป retainบน hydrophobic C18น้อยลง.",
    traps:["ทิศทาง ionizationตรงข้าม","C18 chemistryไม่ได้สลับเป็น polarเพียงเพราะ pH","Detector responseไม่กำหนด chromatographic retention","pHมีผลมากต่อ ionizable analytes"],
    difficulty:"hard",
    ref:"RP-HPLC ionization/selectivity principles; ICH Q14 robustness considerations"
  },
  {
    topic:"Chromatography / pH–pKa weak base",
    prompt:"Weak base pKa 8.5 มี tR 4.2 min ที่ pH 3.0 และ 8.9 min ที่ pH 7.0 บน C18 โดย organic ratioคงเดิม. ข้อใดอธิบายแนวโน้มได้ดีที่สุด?",
    options:["เมื่อ pHเข้าใกล้ pKa สัดส่วน unionized baseเพิ่มขึ้น จึง retainบน C18มากขึ้น","เมื่อ pHสูงขึ้น base protonatedมากขึ้นจึง retainมากขึ้น","pHสูงทำให้ C18 ligandยาวขึ้น","retentionเพิ่มเพราะ detector sensitivityเพิ่ม","ผลนี้พิสูจน์ว่า columnเสื่อม"],
    rationale:"Weak base ที่ pHต่ำจะ protonated/ionizedมาก; เมื่อ pHสูงเข้าใกล้ pKa fraction unionizedเพิ่มและ hydrophobic retentionเพิ่ม.",
    traps:["Weak base protonatedลดลงเมื่อ pHสูง","C18 chain lengthไม่เปลี่ยน","Detector sensitivityไม่สร้าง retention shift","ข้อมูลสอดคล้องกับ ionization chemistry ไม่ได้พิสูจน์ column failure"],
    difficulty:"hard",
    ref:"RP-HPLC ionization/selectivity principles"
  },
  {
    topic:"Chromatography / buffer pH robustness",
    prompt:"Method ของ ionizable impurityมี critical pair Rs=1.55 ที่ pH 4.50 แต่ robustness study pH 4.40 ให้ Rs=1.22 และ pH4.60 ให้ Rs=1.82. ข้อใดเป็นข้อสรุปที่เหมาะสมที่สุด?",
    options:["Method มีความไวต่อ pHสูงและ control strategy/nominal conditionควรถูกพัฒนาให้ robustกว่านี้","Method robustเพราะ nominal pHให้ Rs>1.5","ให้ analystปรับ pHตาม chromatogramแต่ละครั้งโดยไม่กำหนดช่วง","ตัด pHออกจาก methodเพราะเป็นตัวแปรรบกวน","เพิ่ม injection volumeเพื่อชดเชย Rsต่ำ"],
    rationale:"Robustnessต้องดู deliberate small variations; การที่ pHเปลี่ยนเพียง0.1แล้ว critical resolution fail แสดงmethod sensitivityและ control spaceแคบ.",
    traps:["Nominal passอย่างเดียวไม่พิสูจน์ robustness","Ad-hoc adjustmentโดยไม่กำหนดprocedureทำให้ methodไม่ควบคุม","ตัด parameterไม่ได้เพราะ pHเป็น critical analytical parameter","Injection volumeไม่แก้ selectivity loss"],
    difficulty:"hard",
    ref:"ICH Q2(R2); ICH Q14"
  },
  {
    topic:"Gradient HPLC / re-equilibration",
    prompt:"Gradient method ให้ retention timeของ API driftเร็วขึ้นทีละน้อยตลอด sequence ทั้งที่ pressureปกติ. Blankหลัง runยาวไม่มี carryover. เมื่อเพิ่ม re-equilibration timeระหว่าง injections retentionกลับคงที่. สาเหตุใดเหมาะสมที่สุด?",
    options:["Columnยังกลับสู่ initial mobile-phase compositionไม่สมบูรณ์ก่อน injectionถัดไป","Detector lampเสื่อมทำให้ compoundออกเร็วขึ้น","Autosamplerฉีด volumeลดลงทุกครั้ง","Column particle sizeเพิ่มขึ้นระหว่าง run","API potencyลดลงใน vial"],
    rationale:"Gradient methodsต้อง re-equilibrate stationary phaseกับ initial composition; insufficient re-equilibrationทำให้ effective starting solvent strengthเปลี่ยนและ retention drift.",
    traps:["Lampมีผลresponseไม่ใช่ retention mechanism","Injection volumeมีผล area/shapeมากกว่า systematic retention driftแบบนี้","Particle sizeไม่เพิ่มระหว่าง sequence","Sample potencyไม่กำหนด retention shiftแบบต่อเนื่อง"],
    difficulty:"hard",
    ref:"USP <621>; gradient method-development principles"
  },
  {
    topic:"Chromatography / flow-rate scaling",
    prompt:"Method transfer เปลี่ยน column ID จาก 4.6 mm เป็น 3.0 mm โดยต้องการรักษา linear velocityใกล้เดิม. เดิม flow=1.00 mL/min. Flowใหม่ควรประมาณเท่าใด?",
    options:["0.43 mL/min","0.65 mL/min","0.30 mL/min","1.53 mL/min","2.35 mL/min"],
    rationale:"Flow scalesตาม cross-sectional area ∝ ID²: 1.00×(3.0/4.6)²≈0.425 mL/min.",
    traps:["0.65ใช้ ratio IDเชิงเส้นไม่ใช่พื้นที่","0.30ต่ำเกิน","1.53กลับอัตราส่วน","2.35กลับ square ratio"],
    difficulty:"hard",
    ref:"Chromatographic geometrical scaling principles",
    calc:["F2=F1×(ID2/ID1)²","=1.00×(3.0/4.6)²","≈0.43 mL/min"]
  },
  {
    topic:"Chromatography / particle size",
    prompt:"เปลี่ยน HPLC column จาก 5 µm เป็น 2.6 µm superficially porous particles โดยคง dimensionsและ mobile phaseใกล้เดิม. แนวโน้มใดสมเหตุสมผลที่สุด?",
    options:["Efficiencyอาจเพิ่มและ pressureมักเพิ่ม จึงต้องตรวจ pressure/system suitabilityและปรับ flowตามความเหมาะสม","Efficiencyลดและ pressureลดเสมอ","Retention timeต้องเพิ่มสองเท่าแน่นอน","Selectivityเปลี่ยนเป็นศูนย์","Detector wavelengthต้องเปลี่ยนตาม particle size"],
    rationale:"Smaller/effective particlesลด mass-transfer contributionและเพิ่ม efficiency แต่เพิ่ม flow resistance; magnitudeขึ้นกับ particle morphology/system.",
    traps:["ทิศทางโดยทั่วไปตรงข้าม","Retentionไม่ได้ถูกกำหนดโดย particle sizeแบบสองเท่าคงที่","Selectivityขึ้นกับ chemistry/conditionsไม่ใช่ศูนย์","Wavelengthไม่เกี่ยวกับ particle size"],
    difficulty:"medium",
    ref:"USP <621>; chromatography fundamentals"
  },
  {
    topic:"Chromatography / peak fronting",
    prompt:"API peak symmetricที่ injection 5 µL แต่เกิด frontingชัดเมื่อเพิ่มเป็น 50 µL โดย concentrationเดิม และผลกลับปกติเมื่อกลับมา5 µL. สาเหตุใดควรสงสัยมากที่สุด?",
    options:["Column/sample solvent overloadจาก injection volumeสูง","Residual silanol interaction","Detector wavelengthผิด","Insufficient re-equilibration","Column temperatureต่ำเกินไปเสมอ"],
    rationale:"Frontingที่ขึ้นกับ injection load/volumeและ reversibleเมื่อ volumeลด สอดคล้องกับ overloadหรือ strong sample-solvent effect.",
    traps:["Silanol interactionมักสัมพันธ์กับ tailingโดยเฉพาะ basic analytes","Wavelengthไม่ทำให้ peak front","Re-equilibrationมักทำให้ retention drift","Temperatureไม่อธิบาย volume-dependent reversible frontingได้ตรงที่สุด"],
    difficulty:"hard",
    ref:"Chromatographic peak-shape troubleshooting"
  },
  {
    topic:"Chromatography / carryover",
    prompt:"Sequence: blankก่อน standardสะอาด; high standard area=1,000,000; blankถัดมามี API area=1,800; sample low-levelคาด area≈9,000. ข้อใดเป็น concernที่เหมาะสมที่สุด?",
    options:["Carryover ~0.18% ของ high standard แต่อาจเท่ากับ ~20% ของ low sample response จึงมีนัยสำคัญต่อ low-level quantitation","Carryoverไม่มีนัยสำคัญเพราะต่ำกว่า1%ของ high standardเสมอ","Blank peakพิสูจน์ว่า sample degraded","ต้องลบ blank areaจากทุก sampleโดยอัตโนมัติ","เพิ่ม detector wavelengthจะกำจัด carryover"],
    rationale:"Carryoverต้องประเมินเทียบกับ intended low-level measurement ไม่ใช่เทียบ high standardอย่างเดียว: 1,800/9,000=20%, จึง biasสูงต่อ low sample.",
    traps:["Thresholdต้องสัมพันธ์กับ intended use","Blankหลัง high standardชี้ system carryoverมากกว่าsample degradation","Automatic subtractionอาจปกปิด root causeและต้องมี validated approach","Wavelengthไม่กำจัด material carryover"],
    difficulty:"hard",
    ref:"ICH Q2(R2)/Q14; analytical carryover principles",
    calc:["Carryover vs high = 1800/1,000,000 = 0.18%","Relative to low sample = 1800/9000 = 20%"]
  },
  {
    topic:"Chromatography / sample stability",
    prompt:"Fresh sample assay=100.1%. Autosampler reanalysisหลัง24 hได้97.8% และมี degradantเพิ่ม. Standard stableและsystem suitabilityผ่าน. การดำเนินการใดเหมาะสมที่สุด?",
    options:["กำหนด/ยืนยัน sample-solution stability windowและใช้ preparationภายในช่วงที่ validated","เฉลี่ย freshกับ24 hแล้วรายงาน99%","ถือว่า instrument driftแม้ standard stable","เพิ่ม injection volumeของ aged sample","ตัด degradantออกจาก integration"],
    rationale:"ข้อมูลชี้ sample solution instability; analytical procedureต้องกำหนด hold time/storageที่ให้ผลเชื่อถือได้.",
    traps:["การเฉลี่ยค่าจาก unstable solutionไม่ถูกต้อง","Standard/system suitabilityคงที่ลดความเป็นไปได้ของ instrument drift","Injection volumeไม่แก้chemical degradation","ห้ามตัด degradantเพื่อกลบ instability"],
    difficulty:"medium",
    ref:"ICH Q14 robustness/solution stability considerations"
  },
  {
    topic:"Chromatography / filter adsorption",
    prompt:"Unfiltered centrifuged sample assay=100.0%; PVDF-filtered=99.8%; nylon-filtered=95.6%. Blankจาก filtersสะอาด. ข้อใดเหมาะสมที่สุด?",
    options:["สงสัย analyte adsorptionกับ nylon membraneและควรทำ filter-compatibility/recovery study","Nylonให้ผลต่ำเพราะ detector wavelengthเปลี่ยน","PVDFต้องห้ามใช้เพราะให้99.8%","ใช้ nylonต่อแต่คูณ correction factorคงที่โดยไม่validate","สรุปว่า sampleไม่homogeneousแม้ aliquotเดียวกัน"],
    rationale:"Membrane-specific negative biasโดย blankสะอาดสอดคล้องกับ adsorption; filter suitabilityต้องประเมิน recoveryและอาจต้อง pre-rinse/เปลี่ยน membrane.",
    traps:["Detector wavelengthไม่ได้เปลี่ยนเพราะ membrane","99.8%ใกล้ unfilteredและอาจ acceptableตามcriteria","Correction factorโดยไม่มีvalidationไม่เหมาะ","Pattern membrane-specificชี้ filter interactionมากกว่าhomogeneity"],
    difficulty:"hard",
    ref:"ICH Q14 sample-preparation robustness principles"
  },
  {
    topic:"Chromatography / extraction recovery",
    prompt:"Spiked placebo ที่80%,100%,120% ให้ recovery 99.4, 99.8, 100.2% แต่ intact tablet sampleเมื่อ extraction 10 นาทีให้ assay 94%; extraction 30 และ60 นาทีให้99.5และ99.6%. ข้อสรุปใดเหมาะสมที่สุด?",
    options:["ปัญหาหลักคือ sample extraction timeไม่เพียงพอ แม้ spike-recoveryใน placeboจะดี","Method accuracyผ่านจึง extraction timeไม่มีผล","Tablet assay94%พิสูจน์ว่า batch OOS","เพิ่ม standard concentrationเพื่อแก้ extraction","ใช้10นาทีต่อได้เพราะ precisionอาจดี"],
    rationale:"Spiked analyteใน placeboอาจ extractง่ายกว่า APIที่ฝังใน dosage-form matrix. Time-dependent recoveryของ intact tabletชี้ extraction kineticsเป็น critical sample-preparation parameter.",
    traps:["Accuracy studyแบบspikeไม่ได้รับประกัน quantitative extractionจากfinished dosage form","ยังต้องแยก analytical extraction failureจากtrue batch potencyก่อนสรุปOOS","Standard concentrationไม่แก้ sample extraction","Precisionดีไม่ได้ชดเชย systematic low recovery"],
    difficulty:"hard",
    ref:"ICH Q2(R2); ICH Q14 sample preparation development"
  },
  {
    topic:"Chromatography / relative response factor",
    prompt:"Impurity A peak area =12,000; API reference peak area at equivalent concentration =10,000. หาก defined RRF = response impurity / response API =1.20 และวิธีคำนวณ impurityใช้ API responseเป็น reference ควรทำอย่างไรกับ impurity result?",
    options:["หาร apparent impurity resultด้วย1.20เพื่อแก้ว่า impurityตอบสนองแรงกว่า API","คูณ apparent impurityด้วย1.20","ไม่ต้องแก้เพราะ RRF>1เสมอ","ลบ20%ของ API assay","เพิ่ม impurity areaอีก20%"],
    rationale:"RRF=1.20หมายถึงที่ concentrationเท่ากัน impurityให้responseสูงกว่าAPI20%; หาก quantitateเทียบAPIโดยไม่แก้จะ overestimate จึงต้องหารด้วยRRF.",
    traps:["คูณจะยิ่ง overestimate","RRFอาจต้องใช้ correctionตามmethod/intended criteria","RRF correctionใช้กับ impurity responseไม่ใช่ลบ API assay","เพิ่มareaผิดทิศ"],
    difficulty:"hard",
    ref:"ICH Q2(R2) — relative response factors"
  },
  {
    topic:"Impurity quantitation / RRF",
    prompt:"Related-substances methodคำนวณ impurity X ได้0.36%โดยสมมติ responseเท่ากับAPI. RRF(X)=0.75 (response impurity/response API). Corrected impurityใกล้เคียงเท่าใด?",
    options:["0.48%","0.27%","0.36%","0.75%","1.11%"],
    rationale:"เมื่อ impurityตอบสนองเพียง75%ของAPI apparent resultจะต่ำกว่าจริง; corrected=0.36/0.75=0.48%.",
    traps:["0.27คือคูณ RRFผิดทิศ","0.36คือไม่แก้","0.75คือRRFไม่ใช่content","1.11ไม่ตรงสมการ"],
    difficulty:"hard",
    ref:"ICH Q2(R2) RRF principles",
    calc:["Corrected impurity = apparent / RRF","0.36/0.75 = 0.48%"]
  },
  {
    topic:"Impurity method / area normalization",
    prompt:"APIและ impurityมี UV molar absorptivityต่างกันมากที่ detection wavelength. เหตุใด area normalizationโดยไม่ใช้RRFจึงอาจให้ impurity%ผิด?",
    options:["Peak area fractionสะท้อน detector response ไม่ใช่ mass fractionโดยตรงเมื่อ response factorsต่างกัน","Retention timeต่างกันทำให้ area normalizationใช้ไม่ได้เสมอ","Gradient methodห้ามใช้ area normalizationทุกกรณี","API peakใหญ่จึงต้องตั้งเป็น100%เสมอ","UV detectorวัดเฉพาะ concentrationไม่ขึ้นกับ absorptivity"],
    rationale:"UV responseขึ้นกับ absorptivityและmethod conditions; ต่างสารอาจให้ areaต่อหน่วยมวลต่างกัน จึงต้องพิจารณาRRF/standardization.",
    traps:["Retention timeต่างไม่ใช่เหตุหลัก","Gradientไม่ได้ห้าม area normalizationโดยนิยามแต่ต้องvalidate","การตั้งAPI100%ไม่แก้response bias","UV responseขึ้นกับ absorptivityอย่างชัดเจน"],
    difficulty:"medium",
    ref:"ICH Q2(R2) relative-response considerations"
  },
  {
    topic:"LOD / LOQ / S:N",
    prompt:"Sensitivity solutionให้ impurity peak S/N≈9 ที่ concentration0.03%. หาก procedureกำหนด LOQต้องมี S/N≥10 ข้อใดเหมาะสมที่สุด?",
    options:["0.03%ยังไม่demonstrate LOQ criterion; ต้องเพิ่มความเข้มข้นหรือปรับmethodจนระดับLOQให้performanceตามเกณฑ์","0.03%เป็นLOQเพราะS/Nใกล้10","0.03%เป็นLODและLOQพร้อมกันโดยอัตโนมัติ","ลดconcentrationจนS/N=3แล้วใช้เป็นLOQ","เพิ่มintegration thresholdเพื่อให้S/Nดูสูงขึ้น"],
    rationale:"Predefined LOQ criterionต้องถูกmeet; S/N9ต่ำกว่า10 จึงยังไม่ยืนยันLOQที่0.03%.",
    traps:["ไม่ควรปัด criterionเชิงvalidation","LOD/LOQไม่จำเป็นต้องเท่ากัน","S/N≈3มักเกี่ยวกับdetection conceptไม่ใช่quantitation","เปลี่ยนintegrationเพื่อผ่านcriterionโดยไม่มีscientific basisไม่ถูกต้อง"],
    difficulty:"medium",
    ref:"ICH Q2(R2)"
  },
  {
    topic:"Calibration model / residuals",
    prompt:"Calibration 50–150% nominalให้ r=0.9998 แต่ residualsเป็นรูปโค้ง: ค่าต่ำและสูงเป็นบวก ขณะที่ช่วงกลางเป็นลบอย่างเป็นระบบ. ข้อใดเหมาะสมที่สุด?",
    options:["Correlation coefficientสูงไม่พอ; residual patternชี้ possible nonlinearity/model mismatch ต้องประเมินmodel/range","ถือว่าlinearแน่นอนเพราะ r>0.999","ตัดจุดต่ำสุดและสูงสุดออกทันทีเพื่อให้เส้นตรง","เพิ่ม replicateเฉพาะ100%แล้วlinearจะผ่าน","ใช้average residual=0เป็นหลักฐานlinear"],
    rationale:"Linearityต้องประเมินความเหมาะสมของcalibration modelตลอดrange; structured residualsบ่งชี้curvatureแม้rสูง.",
    traps:["rเพียงค่าเดียวอาจหลอกได้","ตัดจุดต้องมีscientific justificationไม่ใช่เพื่อpass","Replicateกลางไม่แก้model curvature","Residualเฉลี่ยใกล้0เป็นคุณสมบัติของregressionและไม่พิสูจน์randomness"],
    difficulty:"hard",
    ref:"ICH Q2(R2) calibration model / reportable range"
  },
  {
    topic:"Assay / standard bracketing",
    prompt:"Sequence assayยาว 60 injections. Initial standard responseเฉลี่ย=500,000; bracketing standardกลางsequence=496,500; final=491,000. Sample responsesลดตามเวลาใกล้เคียงกัน. ข้อใดควรตรวจสอบก่อนสรุปว่าproduct assayลดตามลำดับ?",
    options:["Standard-response drift/system stability และ predefined bracketing acceptanceก่อนตีความ sample trend","Sample degradationแน่นอนเพราะ areaลด","Batch blend segregationแน่นอน","เพิ่มsample concentrationให้areaสูงขึ้น","ใช้initial standardคำนวณทุกsampleโดยไม่สนfinal standard"],
    rationale:"เมื่อstandard driftในทิศเดียวกับsamples ต้องแยกinstrument/system response driftออกจากsample trendและใช้bracketingตามvalidated procedure.",
    traps:["ยังไม่มีหลักฐานsample degradationเฉพาะ","Chromatographic sequence trendไม่พิสูจน์manufacturing segregation","เพิ่มconcentrationไม่แก้drift","เพิกเฉยfinal standardอาจสร้างbias"],
    difficulty:"hard",
    ref:"GMP chromatographic system suitability / bracketing principles"
  },
  {
    topic:"Data integrity / manual integration",
    prompt:"Chromatogram sampleหนึ่ง OOSเพราะ impurity0.24% (limit0.20%). Analyst manually reintegrate baselineแล้วได้0.18% โดยไม่มีdocumented integration ruleและไม่พบ chromatographic anomaly. การดำเนินการใดเหมาะสมที่สุด?",
    options:["ไม่ควรแทนผลเดิมด้วยmanual integrationที่ไม่มีscientific rule; ต้องinvestigateและใช้predefined/justified integration procedure","ใช้0.18%เพราะ manual integrationแม่นกว่าsoftwareเสมอ","เฉลี่ย0.24กับ0.18","เลือกค่าต่ำกว่าเพราะลดfalse positive","ลบoriginal chromatogramเพื่อป้องกันสับสน"],
    rationale:"Reprocessing/integrationต้องมีscientific justification, audit trailและSOP; manual changeเพื่อทำให้ผ่านเป็นdata-integrity riskและไม่invalidateผลเดิม.",
    traps:["Manualไม่ inherently superior","Averaging incompatible integrationsไม่แก้root cause","เลือกค่าต่ำเป็นbias","ห้ามลบraw data"],
    difficulty:"hard",
    ref:"GMP data integrity; FDA OOS principles"
  },
  {
    topic:"Chromatography / ghost peak",
    prompt:"Blankหลัง mobile-phase preparationใหม่มี unknown peakที่ 6.2 min; peakเดียวกันปรากฏในทุกstandardและsampleด้วย areaเกือบคงที่ ไม่สัมพันธ์concentration. Blankจาก mobile phase lotเดิมไม่มี peak. สาเหตุใดน่าจะมากที่สุด?",
    options:["Contaminantจาก mobile phase/reagent lotใหม่","API degradantในทุกsample","Column overload","Detector saturation","Sample carryoverจากhigh standard"],
    rationale:"Peakในblankและทุกinjectionที่areaคงที่หลังเปลี่ยนreagent lotชี้background contaminantจากmobile phase/reagent.",
    traps:["Degradantไม่ควรอยู่ในblank","Overloadขึ้นกับsample load","Detector saturationเกิดกับhighresponseไม่ใช่constant blank peak","Carryoverต้องสัมพันธ์กับpreceding injectionsและไม่จำเพาะlotใหม่"],
    difficulty:"medium",
    ref:"Chromatographic troubleshooting principles"
  },
  {
    topic:"Chromatography / split peak",
    prompt:"API peakแยกเป็นสองยอดเมื่อ sample solventเป็น100% acetonitrile แต่กลับเป็นsingle symmetric peakเมื่อsample solventใกล้ initial mobile phase (20% acetonitrile). สาเหตุใดเหมาะสมที่สุด?",
    options:["Strong sample-solvent mismatchทำให้ focusingผิดและเกิด peak distortion/splitting","APIมีสอง polymorphจึงเกิดสอง chromatographic peaksแน่นอน","Detector wavelengthสองค่าเกิดพร้อมกัน","Columnมีvoidแน่นอนแม้เปลี่ยนsample solventแล้วหาย","Autosamplerฉีดสองครั้งเสมอ"],
    rationale:"Injection solventที่แรงกว่ามากเทียบinitial mobile phaseอาจทำให้ analyteไม่focusที่column headและเกิดsplit/distorted peak; การหายเมื่อmatch solventสนับสนุนสมมติฐานนี้.",
    traps:["Polymorphsมักละลายเป็นmoleculeเดียวกันและไม่ได้สร้างสองHPLC peaksโดยอัตโนมัติ","Detector wavelengthไม่สร้างsplit peakเชิงretention","Column voidไม่ควรหายเพียงเปลี่ยนsample solvent","Double injectionต้องมีaudit/injection evidenceและไม่สัมพันธ์solvent strength"],
    difficulty:"hard",
    ref:"HPLC injection-solvent compatibility principles"
  },
  {
    topic:"Chromatography / retention shift",
    prompt:"All peaksรวมถึง internal standard shiftจาก tR≈8 minเป็น≈6.5 minพร้อมกัน แต่ relative retention/orderคงเดิม. Pressureลดลง20%. ข้อใดควรตรวจสอบก่อน?",
    options:["Flow rateจริง/possible leakหรือmobile-phase compositionผิดที่ทำให้system velocity/elution strengthเปลี่ยน","Analyteทุกตัวเกิดdegradationพร้อมกัน","Detector wavelengthผิด","Sample potencyสูงเกิน","Integration thresholdต่ำเกิน"],
    rationale:"Global retention shiftพร้อมpressure changeชี้system/mobile-phase/flow issueมากกว่าสารแต่ละตัว; ควรตรวจpump flow, leaks, mixing/composition.",
    traps:["Degradationไม่ทำให้ทุกpeak shiftเหมือนกันและorderคงเดิม","Wavelengthมีผลresponseไม่ใช่retention","Potencyมีผลarea","Integration thresholdไม่เปลี่ยนtrue tR"],
    difficulty:"hard",
    ref:"HPLC system troubleshooting"
  },
  {
    topic:"Chromatography / column-lot robustness",
    prompt:"Methodผ่านvalidationบน C18 lot A. Lot Bซึ่งเป็นsame USP L1และdimensionsเดียวกันให้ critical Rs=1.18 ขณะที่ lot A=1.72. ข้อใดเหมาะสมที่สุด?",
    options:["Methodอาจไม่robustต่อ column selectivity variation; ต้องประเมินcolumn equivalence/critical method parametersและกำหนดcontrolที่เหมาะสม","Lot Bต้องถือว่าเสียทันทีเพราะsameL1ต้องเหมือนทุกอย่าง","เพิ่มrun timeอย่างเดียวรับประกันRsผ่าน","เปลี่ยนdetector wavelengthเพื่อเพิ่มRs","ใช้lot Aตลอดไปโดยไม่document risk"],
    rationale:"USP classificationเดียวกันไม่ได้รับประกันidentical selectivity. Robust methodต้องทนreasonable column-lot variationหรือกำหนดspecific column/selectivity controlsอย่างมีเหตุผล.",
    traps:["SameL1ยังมีsurface chemistryต่างกันได้","Run time aloneไม่แก้selectivityเสมอ","Wavelengthไม่แก้separation","การล็อกlotโดยไม่lifecycle/control planไม่ยั่งยืน"],
    difficulty:"hard",
    ref:"ICH Q14 robustness; USP <621>"
  },
  {
    topic:"System suitability / sample-specific interference",
    prompt:"System suitability solutionให้ Rs=2.0 ผ่านเกณฑ์ แต่ sampleจริงมี excipient degradantใหม่ co-eluteกับAPI ทำให้peak purity fail. ข้อใดถูกต้องที่สุด?",
    options:["SSTผ่านไม่ได้รับประกันsample specificityต่อinterferentที่ไม่ได้อยู่ในSST; methodต้องถูกinvestigate/ปรับให้เหมาะกับmatrixจริง","SSTผ่านจึงsample resultใช้ได้เสมอ","Peak purity failไม่สำคัญถ้าareaAPIสูง","ให้ลบdegradantออกจากintegration","เพิ่มจำนวนstandard injectionsแทนการแก้method"],
    rationale:"SST monitor predefined system performance; ถ้าmatrix introduces unrepresented interferent วิธีอาจไม่specificสำหรับintended purposeแม้SSTผ่าน.",
    traps:["SSTไม่ครอบคลุมทุกpossiblematrix interferent","Areaสูงไม่ลบco-elution","Manual deletionไม่แก้specificity","Standard precisionไม่แก้sample selectivity"],
    difficulty:"hard",
    ref:"ICH Q2(R2); ICH Q14"
  },
  {
    topic:"GC / headspace residual solvents",
    prompt:"ทำไม headspace GC จึงเหมาะกับการวิเคราะห์ residual solvents ใน solid drug productหลายกรณีมากกว่า direct liquid injection?",
    options:["ช่วยนำ volatile analytesเข้าสู่gas phaseและลดการฉีดnonvolatile matrixเข้าสู่column/inlet","เพราะGCตรวจเฉพาะwater","เพราะheadspaceทำให้ทุกsolventมีresponse factorเท่ากัน","เพราะไม่ต้องใช้standard calibration","เพราะช่วยวิเคราะห์nonvolatile saltsได้ดีกว่า"],
    rationale:"Headspace samplingแยกvolatile solventsจากnonvolatile matrixตามpartition equilibrium ลดmatrix contaminationและเหมาะกับvolatile residual solvents.",
    traps:["GCไม่ได้ตรวจเฉพาะwater","Response factorsยังต่างและต้องcalibrate","ยังต้องstandardization/validation","Nonvolatile saltsไม่ใช่เป้าหมายheadspace GC"],
    difficulty:"medium",
    ref:"ICH Q3C; pharmacopoeial residual-solvent GC principles"
  },
  {
    topic:"Headspace GC / equilibration",
    prompt:"Headspace GC replicate variabilityสูงเมื่อ vial equilibrationเพียง5 min แต่ลดลงชัดเจนที่30 minและคงที่ถึง45 min. ข้อใดเหมาะสมที่สุด?",
    options:["Equilibration timeเดิมไม่พอให้partitioningถึงreproducible state; ควรกำหนดhold timeที่validated","เพิ่มinjection volumeอย่างเดียว","ลดoven temperatureเป็นศูนย์","ตัดreplicateที่ต่างออก","ใช้area normalizationแทนinternal standard"],
    rationale:"Headspace quantitationอาศัยreproducible partition equilibrium; insufficient equilibrationสร้างprecision problem.",
    traps:["Injection volumeไม่แก้equilibrium variability","Temperatureต้องoptimizedไม่ใช่ลดแบบไม่มีเหตุผล","ห้ามตัดข้อมูลเพียงเพราะต่าง","Normalizationไม่แก้sample equilibration"],
    difficulty:"medium",
    ref:"Headspace GC method-development principles"
  },
  {
    topic:"GC / internal standard",
    prompt:"GCใช้ internal standard (IS). Standard: analyte 100 µg/mL + ISคงที่ ให้ area ratio analyte/IS=1.25. Sampleให้ratio=1.00 และสมมติresponse linearผ่านorigin. Sample concentrationใกล้เคียงเท่าใด?",
    options:["80 µg/mL","100 µg/mL","125 µg/mL","60 µg/mL","20 µg/mL"],
    rationale:"Csample/Cstd = ratio_sample/ratio_std =1.00/1.25=0.8; จึง80 µg/mL.",
    traps:["100ไม่แก้ratio","125กลับratio","60ต่ำเกิน","20ไม่สัมพันธ์"],
    difficulty:"medium",
    ref:"Internal-standard quantitation principles",
    calc:["Csample = 100×(1.00/1.25)=80 µg/mL"]
  },
  {
    topic:"Titrimetric assay / blank correction",
    prompt:"Assay titration: sampleใช้ titrant 24.80 mL; blankใช้0.60 mL. Titer factor=5.00 mg API/mL titrant. ปริมาณAPIในsampleเท่าใด?",
    options:["121.0 mg","124.0 mg","118.0 mg","127.0 mg","5.0 mg"],
    rationale:"Corrected volume=24.80−0.60=24.20 mL; ×5.00=121.0 mg.",
    traps:["124ใช้uncorrected volume","118หักblankผิด","127บวกblank","5คือtiter factorไม่ใช่amount"],
    difficulty:"medium",
    ref:"Pharmaceutical titrimetric calculations",
    calc:["Vcorrected=24.80−0.60=24.20 mL","Amount=24.20×5.00=121.0 mg"]
  },
  {
    topic:"Assay / water correction and dispensing",
    prompt:"ต้องการชั่ง APIให้ได้100.0 g anhydrous drug. Lotมี assay99.0% on anhydrous basis และ water3.0%. ต้องชั่ง as-is materialประมาณเท่าใด?",
    options:["104.1 g","101.0 g","103.0 g","97.0 g","107.2 g"],
    rationale:"As-is potency fraction =0.99×0.97=0.9603. Required mass=100/0.9603≈104.13 g.",
    traps:["101แก้เฉพาะassay","103แก้เฉพาะwaterแบบบวกตรง","97คือdry fraction","107.2สูงเกิน"],
    difficulty:"hard",
    ref:"Pharmaceutical manufacturing calculations",
    calc:["As-is active fraction=0.99×(1−0.03)=0.9603","Mass=100/0.9603≈104.1 g"]
  },
  {
    topic:"Assay vs content uniformity",
    prompt:"Batch assayจาก composite sample=100.2% แต่ content uniformityพบหลายเม็ดที่85–88%และบางเม็ด112–115%. ข้อสรุปใดเหมาะสมที่สุด?",
    options:["ค่าเฉลี่ย batchอาจถูกแต่ dose-to-dose uniformityมีปัญหา; assayผ่านไม่ทดแทนcontent uniformity","Batchผ่านเพราะassayเฉลี่ย100.2%","CUผิดแน่นอนเพราะassayผ่าน","เพิ่มsample size assayจะพิสูจน์CU","ใช้tablet weightแทนCUได้ทุกกรณี"],
    rationale:"Composite assayบอกaverage potency ส่วนCUประเมินindividual dosage units; segregation/mixing/fill variabilityอาจเฉลี่ยออกมา100แต่individual unitsผิด.",
    traps:["Assay averageไม่รับประกันindividual dose","ยังไม่ควรinvalid CUเพราะassayผ่าน","Composite assayเพิ่มจำนวนไม่ได้แทนindividual testing","Weight variationใช้แทนได้เฉพาะตามconditions/compendial allowance ไม่ใช่ทุกกรณี"],
    difficulty:"hard",
    ref:"USP <905> Uniformity of Dosage Units"
  },
  {
    topic:"Dissolution assay / dilution calculation",
    prompt:"Dissolution vessel900 mL. เก็บsample10.0 mLที่30 minแล้วเจือจาง1.0 mLเป็น10.0 mL. HPLC final sampleเทียบ standard10 µg/mLให้response 0.90เท่าของstandard. หากยังไม่แก้volume replacement ยาละลายในvessel ณเวลานั้นประมาณกี่mg?",
    options:["81 mg","8.1 mg","90 mg","9 mg","810 mg"],
    rationale:"Final=9 µg/mL. ก่อนเจือจาง10เท่า=90 µg/mL. ใน900 mL=81,000 µg=81 mg.",
    traps:["8.1ลืม dilution factor","90สับสนconcentrationกับamount","9ใช้final concentrationเป็นmg","810เพิ่มfactorเกิน"],
    difficulty:"hard",
    ref:"USP <711> concepts; analytical dilution calculations",
    calc:["Cfinal=10×0.90=9 µg/mL","Cvessel=9×10=90 µg/mL","Amount=90×900=81,000 µg=81 mg"]
  },
  {
    topic:"Dissolution / sample replacement correction",
    prompt:"Vessel900 mL. เก็บ10 mLที่10 minและแทนด้วยmediumใหม่ จากนั้นเก็บ10 mLที่20 min. Concentrationที่10 min=50 µg/mL; ที่20 min=80 µg/mL. ปริมาณสะสมที่ละลายถึง20 minโดยประมาณเท่าใด?",
    options:["72.5 mg","72.0 mg","80.0 mg","76.0 mg","45.0 mg"],
    rationale:"Amount present at20min=80×900=72,000µg. ต้องบวกdrugที่ถูกนำออกครั้งแรก=50×10=500µg. Total=72,500µg=72.5mg.",
    traps:["72.0ไม่แก้withdrawn drug","80สับสนconcentration","76ไม่ตรงmass balance","45ใช้ข้อมูล10minผิด"],
    difficulty:"hard",
    ref:"Dissolution sampling mass-balance principles",
    calc:["Present at20 min=80×900=72,000 µg","Removed at10 min=50×10=500 µg","Cumulative=72,500 µg=72.5 mg"]
  },
  {
    topic:"Dissolution / sink condition",
    prompt:"Dose=100 mg, dissolution medium900 mL, equilibrium solubilityในmedium=0.15 mg/mL. ข้อใดถูกต้องที่สุดเกี่ยวกับ sink conditionโดยใช้เกณฑ์เชิงหลักการว่าปริมาตรควรมากกว่าที่ทำsaturated solutionหลายเท่า?",
    options:["Mediumนี้มีcapacityละลายได้135 mg จึงใกล้saturationสำหรับdose100 mgและอาจไม่เป็นrobust sink condition","เป็นsinkดีมากเพราะ900 mLมากเสมอ","Solubilityไม่เกี่ยวกับsinkถ้าใช้paddle","ต้องลดvolumeเพื่อเพิ่มsink","Sinkขึ้นกับtablet hardnessเท่านั้น"],
    rationale:"Medium capacity=0.15×900=135 mg เพียง1.35เท่าของdose จึงมีdriving forceจำกัดเมื่อ dissolutionสูง; sink conditionโดยทั่วไปต้องมีcapacityมากกว่าปริมาณdoseอย่างมีmargin.",
    traps:["Volumeอย่างเดียวไม่พอ ต้องดูsolubility×volume","Apparatusไม่ลบthermodynamic solubility","ลดvolumeยิ่งลดcapacity","Hardnessมีผลreleaseแต่ไม่กำหนดsink"],
    difficulty:"hard",
    ref:"USP dissolution principles; biopharmaceutics",
    calc:["Capacity=0.15 mg/mL×900 mL=135 mg","Capacity/dose=1.35"]
  },
  {
    topic:"Dissolution profile / f2 concept",
    prompt:"สอง formulationมีค่าเฉลี่ยdissolutionที่ 5,10,15,30 min ต่างกันเล็กน้อย แต่ test productถึง>85%ภายใน15 minและreferenceก็เช่นกัน. ก่อนคำนวณf2ควรพิจารณาประเด็นใด?",
    options:["เมื่อทั้งสองผลิตภัณฑ์ละลายเร็วมากตามเกณฑ์ที่เกี่ยวข้อง อาจไม่จำเป็นต้องใช้f2ในบางregulatory contexts; ต้องตรวจเงื่อนไขguidelineก่อน","ต้องคำนวณf2เสมอทุกกรณี","ใช้ค่าassayแทนprofileได้","ถ้า30minเท่ากันถือว่าprofilesเหมือนกันแน่นอน","เพิ่มจุดเวลาเฉพาะหลังทั้งสอง100%เพื่อทำf2"],
    rationale:"Similarity assessmentมีเงื่อนไขเฉพาะเรื่องsampling pointsและrapid dissolution; ต้องใช้guidelineที่เกี่ยวข้อง ไม่ควรคำนวณf2แบบกลไกทุกกรณี.",
    traps:["ไม่ใช่ทุกกรณีต้องf2","Assayไม่แทนrelease profile","จุดเดียวไม่พิสูจน์profile similarity","จุดหลังplateauจำนวนมากอาจผิดเงื่อนไข/ไม่เพิ่มinformation"],
    difficulty:"hard",
    ref:"Regulatory dissolution-profile comparison principles"
  },
  {
    topic:"Degradation / mass balance",
    prompt:"Forced degradation: unstressed assay99.8%, total impurities0.2%; stressed assay82.0%, total impurities15.0%. หากใช้ mass balanceแบบง่าย assay+impurities ข้อใดเหมาะสมที่สุด?",
    options:["Mass balance≈97.0%; มีunaccounted loss≈3%ที่ควรพิจารณาเช่นnonchromophoric/volatile degradantsหรือresponse-factor bias","Mass balance=82%","Mass balance=115%","Mass balanceสมบูรณ์เพราะimpuritiesเพิ่ม","ต้องเป็น100%เสมอมิฉะนั้นmethodinvalidทันที"],
    rationale:"Simple mass balanceหลังstress≈82+15=97%. การขาด3%เป็นsignalให้investigateแต่ไม่ใช่หลักฐานเดียวว่ method invalid.",
    traps:["82คิดเฉพาะassay","115บวกผิด","Impurityเพิ่มไม่ได้แปลaccountingครบ","Mass balanceอาจไม่ถึง100จากresponse/volatile/non-UV speciesและmeasurement uncertainty"],
    difficulty:"hard",
    ref:"Stability-indicating method-development principles"
  },
  {
    topic:"Stability / zero vs first order",
    prompt:"Assayลดจาก100→96→92→88% ที่0,6,12,18เดือนอย่างเกือบlinearกับเวลา. หากข้อมูลนี้เป็นตัวแทนจริง kinetic modelใดสอดคล้องเชิงempiricalมากกว่า?",
    options:["Zero-order approximation","First-orderแน่นอนเพราะยาทุกชนิดเป็นfirst-order","Second-order","ไม่มีdegradation","Michaelis–Mentenเสมอ"],
    rationale:"การลดจำนวนpercentage pointsคงที่ต่อช่วงเวลาเป็นlinear concentration-vs-time pattern ซึ่งสอดคล้องกับzero-order approximationมากกว่า exponential first-order.",
    traps:["ไม่ใช่ทุกdrugต้องfirst-order","Second-orderจะไม่ให้linear C vs tแบบนี้","ข้อมูลแสดงdegradationชัด","Michaelis–Mentenไม่ใช่default pharmaceutical stability model"],
    difficulty:"medium",
    ref:"Pharmaceutical stability kinetics"
  },
  {
    topic:"Stability / Arrhenius",
    prompt:"อัตราการdegradationเพิ่มประมาณ2เท่าเมื่ออุณหภูมิเพิ่มจาก25°Cเป็น35°C ภายใต้ช่วงนี้. หากถือQ10≈2อย่างง่าย อัตราที่45°Cคาดประมาณกี่เท่าของ25°C?",
    options:["4 เท่า","2 เท่า","3 เท่า","8 เท่า","1/4 เท่า"],
    rationale:"เพิ่ม20°C =สองช่วง10°C; Q10²=2²=4.",
    traps:["2เท่าคือเพิ่มเพียง10°C","3ไม่ตรงQ10 model","8คือสามช่วง10°C","ทิศทางกลับกัน"],
    difficulty:"medium",
    ref:"Accelerated stability kinetics concepts",
    calc:["45−25=20°C","Number of 10°C increments=2","Rate ratio≈2²=4"]
  },
  {
    topic:"Assay / chromatographic specificity",
    prompt:"Assay HPLCมีAPI peakที่5.0 min. Placeboไม่มีpeakที่5.0 แต่ stressed placebo+API mixtureเกิดnew degradantที่4.95 minและRsกับAPI=0.9. ข้อใดถูกต้องที่สุด?",
    options:["Methodอาจspecificสำหรับunstressed placeboแต่ยังไม่stability-indicatingต่อdegradantนี้","Methodspecificสมบูรณ์เพราะplaceboเดิมไม่interfere","Rs0.9เพียงพอเสมอถ้าpeakareaใหญ่","ให้ใช้retention timeอย่างเดียวแยกpeak","ไม่ต้องสนdegradantเพราะเกิดเฉพาะstress"],
    rationale:"Specificityต้องครอบคลุมrelevant degradantsสำหรับstability-indicating use; placebo interference testอย่างเดียวไม่พอ.",
    traps:["Unstressed placebo passไม่พิสูจน์degradant separation","Rs adequacyขึ้นกับmethod criterionและ0.9แสดงpoor separation","Retention timeอย่างเดียวไม่แยกco-elution","Forced degradationใช้challenge methodโดยตรง"],
    difficulty:"hard",
    ref:"ICH Q2(R2); ICH Q14"
  },
  {
    topic:"Assay / precision hierarchy",
    prompt:"Repeatability%RSD=0.4% แต่เมื่อdifferent analyst/day/instrument %RSDรวม=2.1% และpredefined intermediate-precision criterion≤1.5%. ข้อใดเหมาะสมที่สุด?",
    options:["Repeatabilityผ่านแต่ intermediate precisionไม่ผ่าน จึงต้องinvestigate sources of within-lab variability","Method precisionผ่านเพราะrepeatabilityดี","ใช้เฉพาะanalystเดิมเพื่อหลีกเลี่ยงfailure","ตัดข้อมูลวันที่สอง","เปลี่ยนaccuracy criterionแทน"],
    rationale:"Precisionมีหลายระดับ; methodอาจrepeatableแต่ไม่ruggedพอภายในlaboratory. ต้องinvestigateday/analyst/instrument effects.",
    traps:["Repeatabilityไม่แทนintermediate precision","ล็อกanalystไม่ใช่validation solutionทั่วไป","ห้ามตัดข้อมูลเพื่อpass","Accuracyเป็นคนละperformance characteristic"],
    difficulty:"hard",
    ref:"ICH Q2(R2)"
  },
  {
    topic:"Assay / range",
    prompt:"Method validate accuracy/precisionที่80–120% label claim แต่โรงงานต้องใช้methodเดียวกันตรวจ cleaning validation residueที่0.1%ของlabel-equivalent concentration. ข้อใดเหมาะสมที่สุด?",
    options:["Validationเดิมไม่ครอบคลุมintended useใหม่นี้ ต้องประเมินlower range/QL/selectivityและrevalidateตามความจำเป็น","ใช้ได้ทันทีเพราะmethodเคยlinear","ใช้ได้ถ้าr=0.999","ลดinjection volume","เพิ่มstandard potency correction"],
    rationale:"Validationต้องfit for intended purpose; range80–120%ไม่ครอบคลุมtrace-level residue0.1%.",
    traps:["Linearityเดิมในhigh rangeไม่พิสูจน์low-level performance","rสูงไม่แก้range mismatch","Injection volumeไม่แทนvalidation","Potency correctionไม่เกี่ยวกับsensitivity range"],
    difficulty:"hard",
    ref:"ICH Q2(R2)"
  },
  {
    topic:"Method transfer / bias",
    prompt:"Sending lab assay mean=100.1%, receiving lab=98.7% บนshared samples; precisionของแต่ละlabดี (<0.5%RSD). Differenceเกิดซ้ำทุกระดับ. ข้อใดควรสงสัย/ประเมินมากที่สุด?",
    options:["Systematic biasระหว่างlabs เช่น reference standard preparation, volumetric technique, calibrationหรือmethod implementation","Random errorอย่างเดียว","Sampleinhomogeneityแน่นอน","Column efficiencyเพียงอย่างเดียว","ใช้ค่าเฉลี่ยสองlabแล้วถือว่าปัญหาหาย"],
    rationale:"Good within-lab precisionแต่persistent between-lab shiftชี้systematic biasมากกว่าrandom variation ต้องทำmethod transfer/co-validation investigation.",
    traps:["Random errorมักเพิ่มscatterไม่ใช่stable offset","Shared homogeneous samplesและrepeatabilityดีลดโอกาสinhomogeneity","Column efficiencyอาจเป็นfactorหนึ่งแต่ไม่ควรสรุปโดยไม่มีevidence","Averagingไม่กำจัดbias"],
    difficulty:"hard",
    ref:"ICH Q2(R2) co-validation / intermediate precision concepts"
  },
  {
    topic:"Assay / volumetric error",
    prompt:"Sample stockควรเติมครบ100.0 mL แต่ analystอ่านmeniscusผิดและจริงเติมถึง99.0 mL แล้วใช้calculationเดิม100 mL. ผล assayจะมีbiasทิศทางใดโดยประมาณ?",
    options:["สูงประมาณ1.0% เพราะsampleจริงเข้มข้นกว่าที่สมมติ","ต่ำประมาณ1.0%","ไม่มีผลเพราะHPLCเทียบstandard","สูง10%","ต่ำ10%"],
    rationale:"Actual concentrationสูงกว่า nominal factor100/99≈1.0101 จึงresponseสูงและคำนวณ assayสูงประมาณ1%.",
    traps:["ทิศทางตรงข้าม","External standardไม่แก้sample dilution error","ไม่ถึง10%","ทิศทางและขนาดผิด"],
    difficulty:"hard",
    ref:"Analytical volumetric calculations",
    calc:["Bias factor≈100/99=1.0101","≈+1.01% relative"]
  },
  {
    topic:"Assay / pipette error",
    prompt:"Dilution stepต้องpipette10.00 mLเป็น100.0 mL แต่pipetteจริงส่ง9.80 mL ขณะที่calculationสมมติ10.00 mL. หากทุกอย่างอื่นถูก ผล assayที่คำนวณจะbiasอย่างไร?",
    options:["ต่ำประมาณ2%","สูงประมาณ2%","ไม่เปลี่ยน","ต่ำ10%","สูง10%"],
    rationale:"Final sample concentrationจริง=9.8/10ของที่คาด=98%; detector responseต่ำลงแต่calculationยังใช้factorเดิม จึง assayต่ำ≈2%.",
    traps:["ทิศทางกลับกัน","Dilution delivery errorมีผลโดยตรง","ไม่ถึง10%","ทิศทางและขนาดผิด"],
    difficulty:"hard",
    ref:"Analytical dilution-error principles"
  },

];


const D3: Draft[] = [
  // Case 11 — Back titration assay
  {
    topic:"Monograph interpretation / back titration classification",
    prompt:"อ่าน Assay procedure ต่อไปนี้: ชั่ง Drug E ประมาณ 1.20 g เติม 50.0 mL ของ 0.500 N NaOH ต้มเบา ๆ 10 นาที ปล่อยเย็น แล้วไทเทรต NaOH ส่วนเกินด้วย 0.500 N HCl พร้อมทำ blank determination ภายใต้เงื่อนไขเดียวกัน. วิธีนี้จัดเป็นการไทเทรตชนิดใดได้เหมาะสมที่สุด?",
    options:["Residual (back) titration","Direct acidimetry","Complexometric titration","Redox titration","Precipitation titration"],
    rationale:"เติม NaOH ปริมาณเกินให้ทำปฏิกิริยากับ analyte ก่อน แล้ววัด reagent ส่วนเกินด้วยกรดมาตรฐาน จึงเป็น residual/back titration ไม่ใช่ direct titration.",
    traps:["Direct titrationต้องไทเทรต analyteโดยตรงด้วยtitrantหลัก ไม่ใช่เติมreagentเกินแล้ววัดส่วนเหลือ","ไม่มีmetal-chelate endpoint","ไม่มีoxidation-state changeเป็นbasis","ไม่มีprecipitate-equivalence reactionเป็นbasis"],
    difficulty:"hard",
    ref:"Pharmaceutical volumetric analysis; compendial assay principles"
  },
  {
    topic:"Monograph interpretation / blank in back titration",
    prompt:"จาก procedure เดิม Drug E ใช้ NaOH เกินแล้ว back-titrate ด้วย HCl. เหตุผลสำคัญที่สุดของ blank determination คือข้อใด?",
    options:["หาปริมาณ NaOH ที่ถูกใช้/สูญเสียจาก reagent, solvent และขั้นตอน heating ที่ไม่เกี่ยวกับ analyte เพื่อให้คำนวณ consumption ของ analyte ได้ถูกต้อง","ยืนยันว่า HCl มีสีเดียวกับ sample","ใช้แทน standardization ของ HCl ทุกครั้ง","เพิ่ม sensitivity โดยทำให้ endpointช้าลง","แก้ผลจาก sample weight ที่ชั่งผิด"],
    rationale:"Blankผ่านทุกขั้นตอนโดยไม่มีanalyte ช่วยวัดbackground consumption/neutralization; ความต่างระหว่างblankและsampleสะท้อนequivalentsที่analyteใช้.",
    traps:["สีไม่ใช่หน้าที่หลักของblank","Blankไม่แทนการstandardize titrant","Blankไม่ได้มีวัตถุประสงค์เพิ่มsensitivity","Blankไม่สามารถแก้weighing errorของsample"],
    difficulty:"hard",
    ref:"Volumetric assay blank-correction principles"
  },
  {
    topic:"Back titration / assay calculation",
    prompt:"Drug E assay: blank ใช้ 48.60 mL ของ 0.500 N HCl, sample ใช้ 22.40 mL. Monograph ระบุว่า HCl 0.500 N แต่ละ 1.00 mL ที่ต่างกันเทียบเท่า Drug E 41.20 mg. หากชั่ง sample 1.100 g ปริมาณ Drug E และ assay โดยประมาณเท่าใด?",
    options:["1.079 g และ 98.1%","0.922 g และ 83.8%","1.001 g และ 91.0%","1.100 g และ 100.0%","0.540 g และ 49.1%"],
    rationale:"Corrected volume =48.60−22.40=26.20 mL; Drug E=26.20×41.20=1079.44 mg; assay=1079.44/1100×100≈98.13%.",
    traps:["0.922gมาจากใช้sample titration volumeแทนblank difference","1.001gไม่ตรงequivalent factor","100%เป็นnominalไม่ใช่measured","0.540gเกิดจากhalve equivalentsผิด"],
    difficulty:"hard",
    ref:"Compendial back-titration calculations",
    calc:["ΔV = 48.60 − 22.40 = 26.20 mL","Amount = 26.20 × 41.20 = 1079.44 mg","Assay = 1079.44/1100 ×100 ≈ 98.1%"]
  },
  {
    topic:"Back titration / endpoint selection",
    prompt:"Drug E back titration ใช้ strong baseส่วนเกินและ back-titrateด้วย strong acid. หาก procedure ใช้ visual indicator เหตุผลใดสำคัญที่สุดในการเลือก indicator?",
    options:["ช่วงเปลี่ยนสีต้องครอบคลุมบริเวณ pH ใกล้ equivalence ของ back-titration matrixจริง โดยไม่ถูกรบกวนจาก sample color/solvent","เลือก indicator ที่มี pKa เท่ากับ pKa ของ Drug E เสมอ","เลือก indicator ที่ให้สีเข้มที่สุดโดยไม่สนendpoint","ใช้ methyl orangeได้ทุกacid–base titrationโดยอัตโนมัติ","indicatorไม่มีผลเพราะคำนวณจากnormalityอย่างเดียว"],
    rationale:"Indicator errorขึ้นกับตำแหน่งtransition rangeเทียบกับtitration curveในmatrix; ต้องเหมาะกับactual endpointและsample characteristics ไม่ใช่จำชื่อindicatorแบบตายตัว.",
    traps:["pKa analyteไม่จำเป็นต้องเท่ากับindicator pKaในback titration","สีเข้มไม่ใช่criterionหลัก","ไม่มีindicatorสากลสำหรับทุกacid-base system","Endpoint detectionมีผลต่อmeasured volumeโดยตรง"],
    difficulty:"hard",
    ref:"Acid–base titration endpoint theory"
  },
  {
    topic:"Back titration / reagent standardization",
    prompt:"ใน assay แบบ back titrationเดียวกัน หาก NaOH ดูด CO₂ ระหว่างเก็บจน actual normalityลดลง แต่ analystยังใช้ nominal 0.500 N ในการคำนวณ ข้อใดเป็นความเสี่ยงที่ถูกต้องที่สุด?",
    options:["Stoichiometric equivalenceอาจถูกคำนวณผิด จึงต้องใช้ standardized titrant/reagentตามprocedureและfactorจริง","ไม่มีผลเพราะมีblankแล้วทุกกรณี","Blankทำให้ไม่ต้องstandardizeทั้งNaOHและHCl","ผลจะต่ำเสมอในทิศทางเดียวโดยไม่ขึ้นกับสูตรคำนวณ","แก้ได้ด้วยเพิ่มindicator"],
    rationale:"Blankช่วยbackground correctionแต่ไม่แทนknowledgeของactual concentration/equivalence factor. CarbonationของNaOHเปลี่ยนeffective normalityและทำให้stoichiometryผิดหากใช้nominal value.",
    traps:["Blankไม่สามารถแก้concentration factorทุกกรณีโดยเฉพาะเมื่อequivalent factorคำนวณจากnormality","ยังต้องstandardizeตามcompendial procedure","ทิศทางbiasขึ้นกับcalculation designและwhich reagent factor used","Indicatorไม่แก้titrant concentration"],
    difficulty:"hard",
    ref:"Compendial titrant standardization principles"
  },

  // Case 12 — Ion-pair RP-HPLC monograph
  {
    topic:"Monograph LC / separation mode identification",
    prompt:"อ่าน LC monograph: Mobile phase = 3 g/L sodium octanesulfonate in water : acetonitrile (82:18), ปรับ pH 3.2 ด้วย phosphoric acid; column 4.6×250 mm, packing L1; UV 272 nm. สำหรับ basic drug ที่วิเคราะห์ ระบบนี้อธิบายกลไก separationได้เหมาะสมที่สุดอย่างไร?",
    options:["Reversed-phase ion-pair chromatography โดย anionic alkylsulfonateช่วยเพิ่มretention/selectivityของcationic analyteบนC18","Classical cation-exchange chromatographyบนcharged resin","Size-exclusion chromatography","Normal-phase adsorption chromatography","Micellar electrokinetic chromatography"],
    rationale:"L1คือC18 reversed-phase และalkylsulfonate anionทำหน้าที่ion-pair reagentกับprotonated basic analyte จึงเป็นion-pair RP-LC.",
    traps:["Stationary phaseไม่ใช่ion-exchange resin","ไม่มีpore-size molecular sievingเป็นกลไกหลัก","Mobile phaseเป็นaqueous-richและcolumnC18ไม่ใช่normal-phase silica","เป็นLCไม่ใช่capillary electrophoresis"],
    difficulty:"hard",
    ref:"USP <621> Chromatography; ion-pair RP-HPLC principles"
  },
  {
    topic:"Ion-pair LC / reagent role",
    prompt:"จาก monograph เดิม เหตุผลหลักของ sodium octanesulfonate คือข้อใด?",
    options:["สร้าง hydrophobic ion-pair/ปรับsurface interactionกับ protonated basic analyte เพื่อเพิ่มและควบคุมretention/selectivity","ทำหน้าที่เป็นUV chromophoreของanalyte","ลดviscosityของmobile phaseเป็นหลัก","เป็นbufferชนิดเดียวที่คงpH3.2ได้","ใช้เป็นinternal standard"],
    rationale:"Alkylsulfonateมีanionic headและhydrophobic alkyl chain ช่วยmodify retentionของcationic/basic speciesในRP-LCผ่านion-pair/dynamic surface mechanisms.",
    traps:["ไม่ได้เพิ่มchromophoreของanalyte","เกลือมักเพิ่มionic contentไม่ใช่ลดviscosityเป็นprimary role","pH controlมาจากacid/buffer systemไม่ใช่octanesulfonateเพียงอย่างเดียว","ไม่ได้ถูกเติมในknown amountเพื่อเป็นIS"],
    difficulty:"hard",
    ref:"Ion-pair chromatography theory"
  },
  {
    topic:"Ion-pair LC / pH failure",
    prompt:"Basic drug มี pKa 8.7. Mobile phase monographกำหนด pH 3.2 แต่ analystเตรียมได้ pH 5.2 ขณะที่ organic ratioเท่าเดิม. ผลกระทบใดควรกังวลที่สุดต่อ ion-pair methodนี้?",
    options:["Ionization stateของanalyteและsilanol/reagent interactionsเปลี่ยน ทำให้retention/selectivityของcritical peaksอาจเปลี่ยนอย่างมีนัยสำคัญ","APIจะunionizedทั้งหมดที่pH5.2","C18จะกลายเป็นanion-exchange resinเต็มรูปแบบ","UV detectorจะเปลี่ยนwavelengthอัตโนมัติ","ไม่มีผลเพราะpHยังต่ำกว่า7"],
    rationale:"แม้weak baseยังprotonatedมากที่ทั้งสองpH แต่degree of ionizationของsurface sitesและion-pair equilibriumสามารถเปลี่ยนselectivityได้มาก; ion-pair methodsมักไวต่อpH/ionic conditions.",
    traps:["pH5.2ยังต่ำกว่าpKa8.7มาก จึงไม่unionizedทั้งหมด","C18ไม่ได้เปลี่ยนchemistryเป็นion-exchange resin","Detector wavelengthไม่เปลี่ยนอัตโนมัติ","neutral pHไม่ได้เป็นเส้นแบ่งของchromatographic effect"],
    difficulty:"hard",
    ref:"Ion-pair LC robustness; ICH Q14"
  },
  {
    topic:"LC monograph / sample dilution reading",
    prompt:"Monographกำหนด sample stock nominally 4.0 mg/mL. Sample solution ต้อง nominally 0.40 mg/mL จาก stock โดยใช้ diluentเดิม. หากต้องเตรียม sample solution 25.0 mL ควรดูด stockกี่mL?",
    options:["2.50 mL","1.00 mL","4.00 mL","10.0 mL","0.40 mL"],
    rationale:"C1V1=C2V2; V1=(0.40×25.0)/4.0=2.50mL.",
    traps:["1mLให้0.16mg/mL","4mLให้0.64mg/mL","10mLให้1.6mg/mL","0.4mLให้0.064mg/mL"],
    difficulty:"hard",
    ref:"Analytical sample-preparation calculations",
    calc:["V1=(0.40 mg/mL×25.0 mL)/(4.0 mg/mL)=2.50 mL"]
  },
  {
    topic:"LC monograph / system suitability interpretation",
    prompt:"Monographกำหนด tailing factor NMT 2.0 และ %RSD ของ 6 standard injections NMT 2.0%. ผลจริง: tailing=1.85, standard areas 502100, 497900, 501800, 498500, 500600, 499100. ข้อใดเหมาะสมที่สุด?",
    options:["Tailingผ่าน และ %RSDประมาณ0.36%จึงผ่าน system suitability ทั้งสองเกณฑ์","Tailingไม่ผ่านเพราะต้อง≤1.5","%RSDประมาณ2.6%จึงfail","ผ่านเฉพาะRSDแต่tailingfail","สรุปไม่ได้เพราะต้องมีsample injectionก่อน"],
    rationale:"Mean≈500,000 และSDประมาณ1,800 ทำให้RSD≈0.36%; tailing1.85≤2.0. จึงผ่านcriteriaที่ให้.",
    traps:["เกณฑ์ที่โจทย์ให้คือ2.0ไม่ใช่1.5","ข้อมูลareasมีspreadต่ำมากไม่ถึง2.6%","tailingผ่าน","SSTตามเกณฑ์ที่ให้ประเมินstandardได้โดยไม่ต้องsampleก่อน"],
    difficulty:"hard",
    ref:"USP <621> system suitability",
    calc:["Mean area ≈ 500,000","SD ≈ 1,800","%RSD ≈ (1800/500000)×100 ≈0.36%","Tailing 1.85 ≤2.0"]
  },

  // Case 13 — Gradient related-substances monograph
  {
    topic:"Related substances / gradient table reading",
    prompt:"Related-substances LC gradient: 0 min B=10%, 10 min B=10%, 30 min B=70%, 35 min B=70%, 36 min B=10%, stop 45 min. เหตุผลสำคัญที่สุดของช่วง36–45 minคือข้อใด?",
    options:["Re-equilibrate columnกลับสู่initial compositionก่อนinjectionถัดไป","เพิ่มresolutionของlate peaksด้วยBสูง","ใช้ล้างdetector flow cellด้วยน้ำบริสุทธิ์","ทำให้ทุกimpurityออกที่เวลาเดียวกัน","ใช้คำนวณdead volume"],
    rationale:"หลังgradientสูงต้องกลับinitial compositionและให้column/stationary phase equilibrateเพียงพอเพื่อreproducible retentionในrunถัดไป.",
    traps:["ช่วง36–45คือB10%ไม่ใช่Bสูง","ไม่ได้ระบุwater flushของdetector","เป้าหมายไม่ใช่ทำให้peaks co-elute","Dead volumeไม่ได้คำนวณจากช่วงนี้โดยตรง"],
    difficulty:"hard",
    ref:"Gradient HPLC method lifecycle principles"
  },
  {
    topic:"Related substances / corrected impurity",
    prompt:"Impurity P มี peak area 18,000; API reference solutionที่เทียบเท่า0.20%ให้ area 20,000. RRF(P)=1.50 (response P/response API). หากใช้single-point comparison ค่าประมาณ impurity P เท่าใด?",
    options:["0.12%","0.18%","0.20%","0.27%","0.30%"],
    rationale:"Apparent = (18000/20000)×0.20%=0.18%; corrected forRRF=0.18/1.50=0.12%.",
    traps:["0.18ยังไม่แก้RRF","0.20คือstandard level","0.27คือคูณRRFผิดทิศ","0.30ไม่ตรงarea ratio"],
    difficulty:"hard",
    ref:"ICH Q2(R2); impurity RRF quantitation",
    calc:["Apparent=0.9×0.20%=0.18%","Corrected=0.18/1.50=0.12%"]
  },
  {
    topic:"Related substances / critical pair SST",
    prompt:"Related-substances methodกำหนด Rs ระหว่าง impurity A/API NLT1.5 และ standard RSD NMT5%. ผล: RSD1.1% แต่ Rs=1.31. ข้อใดถูกต้องที่สุด?",
    options:["System suitability failเพราะcritical separationไม่ผ่าน แม้precision criterionผ่าน","System suitabilityผ่านเพราะRSDเป็นcriterionสำคัญกว่า","เฉลี่ยRsกับRSDแล้วถ้าต่ำกว่า5ถือว่าผ่าน","ใช้sampleได้ถ้าAPI assayอยู่ในspec","ปรับintegrationเพื่อให้Rsเพิ่ม"],
    rationale:"SST criteriaเป็นindependent acceptance requirements; failureของcritical resolutionทำให้methodไม่พร้อมใช้งานตามprocedure.",
    traps:["ไม่มีhierarchyที่ให้RSDลบล้างRs","ห้ามเฉลี่ยคนละmetric","Assay specไม่แทนSSTของrelated substances","Integrationไม่ได้เพิ่มtrue chromatographic resolution"],
    difficulty:"hard",
    ref:"USP <621>; GMP laboratory controls"
  },
  {
    topic:"Related substances / disregard limit vs LOQ",
    prompt:"Monographระบุ disregard/reporting threshold 0.05%, LOQ validatedที่0.02%, specification total impurities NMT1.0%. พบunknown peaks 0.03%, 0.04%, 0.06%, 0.20%. ตามprocedureที่ให้ disregard peaks <0.05%. Total impuritiesที่ต้องนำมารวมตามruleนี้เท่าใด?",
    options:["0.26%","0.33%","0.23%","0.20%","0.06%"],
    rationale:"ตามdisregard ruleให้ไม่นับ0.03และ0.04; นับ0.06+0.20=0.26%. LOQต่ำกว่าthresholdไม่ได้หมายความว่าทุกpeakเหนือLOQต้องรวมถ้าmonographกำหนดdisregard ruleชัด.",
    traps:["0.33รวมทุกpeakที่quantifiableแต่ขัดrule","0.23รวม0.03ผิดและตัด0.06","0.20ตัด0.06ผิด","0.06ตัดmain impurity0.20"],
    difficulty:"hard",
    ref:"Compendial related-substances reporting/disregard principles",
    calc:["Count only ≥0.05%: 0.06+0.20=0.26%"]
  },
  {
    topic:"Related substances / unknown impurity identification threshold",
    prompt:"Stability sampleพบunknown impurity0.18%ซ้ำหลายlot. Specification individual unknown NMT0.20%, แต่ regulatory identification thresholdสำหรับผลิตภัณฑ์นี้ตามข้อมูลที่ให้คือ0.10%. ข้อใดเหมาะสมที่สุด?",
    options:["แม้ยังไม่OOSตามspec0.20% แต่เกินidentification threshold จึงต้องดำเนินการidentify/assessตามregulatory framework","ไม่ต้องทำอะไรจนเกิน0.20%","ถือว่าOOSทันทีเพราะเกิน0.10%","ลบpeakออกเพราะยังต่ำspec","รวมกับAPI assayแทน"],
    rationale:"Specification limitกับqualification/identification thresholdsตอบคนละคำถาม; impurityอาจwithin release specแต่ยังtrigger regulatory identification requirement.",
    traps:["รอrelease limitอย่างเดียวอาจพลาดidentification obligation","Identification thresholdไม่จำเป็นต้องเท่ากับrelease spec จึงไม่ใช่OOSโดยอัตโนมัติ","ห้ามลบreal peak","ไม่รวมimpurityกลับเข้าAPI assay"],
    difficulty:"hard",
    ref:"ICH Q3B(R2) concepts"
  },

  // Case 14 — Delayed-release dissolution monograph
  {
    topic:"Delayed-release dissolution / stage logic",
    prompt:"Delayed-release tablet monograph: Acid stage 0.1 N HCl 2 h, acceptance = NMT10% dissolved; Buffer stage pH6.8 ต่ออีก45 min, Q=80%. Batchหนึ่ง acid stage=6%, buffer stage=82%. ข้อใดถูกต้องที่สุด?",
    options:["ผ่านcriteriaที่ให้ทั้ง acid resistanceและbuffer release","Fail acid stageเพราะต้อง0%","Fail buffer stageเพราะต้องมากกว่า90%","ผ่านเฉพาะacid stage","สรุปไม่ได้จนทำassay"],
    rationale:"Acid6%≤10% และbuffer82%≥Q80ตามcriteriaที่โจทย์กำหนด. Qไม่ใช่90%โดยอัตโนมัติ.",
    traps:["MonographอนุญาตNMT10ไม่ใช่0","Qระบุ80","ทั้งสองผ่าน","Dissolution acceptanceประเมินจากcriteriaนี้โดยตรง ไม่ต้องassayก่อนเพื่อสรุปตามข้อมูล"],
    difficulty:"hard",
    ref:"USP <711>/<724> delayed-release concepts"
  },
  {
    topic:"Dissolution / cumulative correction multi-sampling",
    prompt:"Vessel900 mLและแทนmediumทุกครั้ง. เก็บ10mLที่10,20,30min. Concentrationsในvessel ณแต่ละเวลา=20,50,80 µg/mL. ปริมาณสะสมที่ละลายถึง30minเท่าใด?",
    options:["72.7 mg","72.0 mg","73.5 mg","80.0 mg","69.3 mg"],
    rationale:"Amount present30min=80×900=72,000µg. Drug removedก่อนหน้า=20×10 +50×10=700µg. Total=72,700µg=72.7mg.",
    traps:["72.0ไม่แก้withdrawals","73.5บวกcurrent aliquotซ้ำ","80สับสนconcentration","69.3ผิดทิศvolume correction"],
    difficulty:"hard",
    ref:"Dissolution serial-sampling mass balance",
    calc:["At30min in vessel=80×900=72,000µg","Removed earlier=20×10+50×10=700µg","Cumulative=72,700µg=72.7mg"]
  },
  {
    topic:"Dissolution / medium pH sensitivity",
    prompt:"Enteric productผ่านacid stageแต่buffer releaseที่pH6.8=85%; robustnessลองpH6.6ได้62%และpH7.0ได้94%. ข้อใดเป็นข้อสรุปที่เหมาะสมที่สุด?",
    options:["ReleaseมีpH sensitivityสูงใกล้polymer dissolution threshold; ต้องควบคุมbuffer pH/ionic conditionsและเข้าใจpolymer trigger","Product robustเพราะpH6.8ผ่าน","ควรเลือกpH7.0เป็นofficial methodทันทีโดยไม่change control","pHไม่เกี่ยวกับenteric polymer","เพิ่มpaddle speedแทนการศึกษาพีเอช"],
    rationale:"Enteric polymersมีpH-dependent ionization/dissolution; small pH shiftสร้างlarge release changeจึงเป็นcritical test conditionและอาจสะท้อนproduct sensitivity.",
    traps:["Nominal passไม่เท่ากับrobustness","เปลี่ยนofficial methodต้องscientific/regulatory justification","pHเป็นกลไกหลักของenteric release","เพิ่มagitationอาจmask pH effectและไม่ใช่คำตอบแรก"],
    difficulty:"hard",
    ref:"Enteric polymer dissolution and method robustness principles"
  },
  {
    topic:"Dissolution / deaeration artifact",
    prompt:"Immediate-release tabletบางlotให้dissolutionต่ำและแปรปรวนเฉพาะเมื่อmediumไม่ได้deaerate; เห็นair bubblesเกาะใต้tabletและbasket. เมื่อdeaerateผลกลับปกติ. คำอธิบายใดเหมาะสมที่สุด?",
    options:["Dissolved/entrained gasสร้างbubblesที่รบกวนwetting/hydrodynamics ทำให้apparent dissolutionต่ำและvariable","APIเกิดoxidationทันทีจากoxygenจึงลดassay","Tablet hardnessลดจากair bubble","Detector saturationจากoxygen","Medium pHเพิ่ม2unitsเพราะbubble"],
    rationale:"Bubblesสามารถเกาะsurface/basketและเปลี่ยนeffective wetting/hydrodynamics เป็นartifactทางphysical testing; deaerationจึงสำคัญเมื่อmethod sensitive.",
    traps:["ผลย้อนกลับทันทีด้วยdeaerationชี้physical artifactมากกว่าchemical oxidation","Hardnessไม่ได้เปลี่ยนจากbubbleในvessel","Detectorไม่เกี่ยวกับphysical dissolution stage","Gasไม่ได้ทำให้pHเพิ่ม2unitsโดยทั่วไป"],
    difficulty:"hard",
    ref:"USP dissolution apparatus operational considerations"
  },
  {
    topic:"Dissolution / coning diagnosis",
    prompt:"Paddle methodพบ coningของdense particlesใต้shaftและQต่ำ. เพิ่มrpmจาก50เป็น75ทำให้Qผ่านแต่method monographกำหนด50rpm. ขั้นตอนที่เหมาะสมที่สุดคืออะไร?",
    options:["Investigate hydrodynamic artifactและformulation behaviorภายใต้official condition; ห้ามปรับrpmเพื่อให้ผ่านโดยไม่มีmethod change justification","รายงาน75rpmเป็นผลofficialเพราะผ่าน","ใช้ค่าเฉลี่ย50และ75rpm","เพิ่มsurfactantโดยไม่validate","เปลี่ยนเป็นbasketทุกbatchโดยไม่change control"],
    rationale:"Compendial/validated conditionsต้องถูกปฏิบัติ. Observationที่75rpmช่วยinvestigationแต่ไม่สามารถแทนofficial conditionเพื่อrescue resultโดยพลการ.",
    traps:["Passing alternate conditionไม่invalidateofficial failure","การเฉลี่ยต่างconditionsไม่มีความหมายcompendial","Surfactant/change apparatusเป็นmethod changesต้องjustify/validate"],
    difficulty:"hard",
    ref:"USP dissolution method control / OOS principles"
  },

  // Case 15 — Nonaqueous titration monograph
  {
    topic:"Nonaqueous assay / method identification",
    prompt:"Monographของ weak organic base: dissolve sampleในglacial acetic acid, add acetic anhydride, titrateด้วย0.1 M perchloric acid, determine endpoint potentiometrically. วิธีนี้จัดเป็นอะไร?",
    options:["Nonaqueous acidimetric titration","Aqueous alkalimetry","Redox titration","Complexometry","Argentometric titration"],
    rationale:"Weak baseถูกไทเทรตด้วยstrong acid(HClO₄)ในnonaqueous acidic solvent จึงเป็นnonaqueous acidimetry.",
    traps:["ไม่ใช่aqueous base titration","ไม่มีelectron transfer","ไม่มีmetal chelate","ไม่มีAg⁺ precipitation"],
    difficulty:"hard",
    ref:"Pharmaceutical nonaqueous titration principles"
  },
  {
    topic:"Nonaqueous titration / acetic anhydride role",
    prompt:"ใน procedure weak base + glacial acetic acid + acetic anhydride เหตุผลสำคัญของacetic anhydrideคือข้อใด?",
    options:["ช่วยกำจัดtrace waterโดยทำปฏิกิริยาเป็นacetic acid ลดผลของน้ำต่อnonaqueous titration","ทำหน้าที่เป็นindicator","เป็นprimary standardของperchloric acid","เพิ่มUV absorbanceของdrug","ตกตะกอนchloride ion"],
    rationale:"Waterทำให้solvent systemเปลี่ยนและทำให้endpointของnonaqueous acid-base titrationไม่คม; acetic anhydrideช่วยscavenge water.",
    traps:["ไม่ใช่visual indicator","ไม่ใช่standardของtitrant","ไม่มีหน้าที่spectrophotometric","ไม่ใช่precipitating reagent"],
    difficulty:"hard",
    ref:"Nonaqueous titration solvent chemistry"
  },
  {
    topic:"Nonaqueous titration / water contamination",
    prompt:"ถ้าglacial acetic acidมีwaterสูงกว่าปกติอย่างมีนัยสำคัญและไม่ได้แก้ไข ผลใดน่ากังวลที่สุด?",
    options:["Endpoint sharpnessและapparent basicityของanalyteอาจเปลี่ยน ทำให้titration bias/precisionแย่ลง","Perchloric acidจะกลายเป็นbase","Drugจะเปลี่ยนเป็นmetal complexเสมอ","ไม่มีผลเพราะwaterเป็นneutral","Potentiometric electrodeจะอ่าน0 mVเสมอ"],
    rationale:"Nonaqueous titrationอาศัยsolvent leveling/differentiating effects; waterเปลี่ยนacid-base equilibriaและendpoint behavior.",
    traps:["HClO₄ไม่กลายเป็นbase","ไม่มีmetal source","Waterไม่inertต่อacid-base solvent system","Electrodeไม่ได้ถูกบังคับเป็น0mV"],
    difficulty:"hard",
    ref:"Nonaqueous acid-base equilibria"
  },
  {
    topic:"Nonaqueous titration / stoichiometric calculation",
    prompt:"Drug B เป็นmonobasic compound MW 321.4. ใช้0.1000 M HClO₄ ปริมาตร15.60 mL. หากstoichiometry1:1 ปริมาณDrug Bเท่าใด?",
    options:["501.4 mg","321.4 mg","156.0 mg","50.14 mg","1002.8 mg"],
    rationale:"Moles=0.1000 mol/L×0.01560L=0.001560mol; mass=0.001560×321.4=0.5014g.",
    traps:["321.4mgคือ1mmolไม่ใช่1.56mmol","156mgสับสนvolume/molarity","50.14mgfactor10ผิด","1002.8mgfactor2ผิด"],
    difficulty:"hard",
    ref:"Volumetric stoichiometric calculations",
    calc:["n=0.1000×0.01560=0.001560 mol","m=0.001560×321.4=0.5014 g=501.4 mg"]
  },
  {
    topic:"Nonaqueous titration / potentiometric endpoint",
    prompt:"เหตุใด potentiometric endpointจึงมักมีประโยชน์ในnonaqueous assayของcolored/opaque sample?",
    options:["ไม่พึ่งการมองสีindicatorโดยตรงและสามารถหาจุดinflectionของpotential–volume curve","ทำให้titrantไม่ต้องstandardize","กำจัดmatrixทั้งหมดก่อนtitration","ทำให้stoichiometryเปลี่ยนเป็น2:1","ทำให้ไม่ต้องทำblank"],
    rationale:"Electrometric endpointช่วยลดvisual indicator interferenceจากสี/turbidityและให้objective signal แต่ยังต้องควบคุมtitrant/blank/stoichiometry.",
    traps:["ยังต้องstandardize","ไม่ได้remove matrix","ไม่เปลี่ยนreaction stoichiometry","Blankอาจยังจำเป็นตามprocedure"],
    difficulty:"hard",
    ref:"Potentiometric titration endpoint principles"
  },

  // Case 16 — Headspace GC monograph advanced
  {
    topic:"Headspace GC / salting-out",
    prompt:"Residual-solvent headspace GC methodเติมsodium chlorideปริมาณคงที่ในทุกvial. จุดประสงค์ที่สมเหตุสมผลที่สุดคือข้อใด?",
    options:["เพิ่มionic strengthเพื่อลดsolubilityของorganic volatilesในaqueous phaseและเพิ่มpartitionสู่headspaceอย่างreproducible","ทำหน้าที่เป็นflame-ionization fuel","เป็นinternal standard","ลดheadspace volumeเป็นศูนย์","ทำให้solvents nonvolatile"],
    rationale:"Salting-outลดactivity/solubilityของorganic volatilesในliquid phaseและเพิ่มheadspace response; ต้องคงเงื่อนไขให้สม่ำเสมอ.",
    traps:["FID fuelเป็นH₂/airไม่ใช่NaCl","NaClไม่ได้เป็นquantitativeIS","ไม่ได้กำจัดheadspace","ทำให้volatile partitionไปgasมากขึ้นไม่ใช่nonvolatile"],
    difficulty:"hard",
    ref:"Headspace GC partition principles"
  },
  {
    topic:"Headspace GC / vial fill-volume effect",
    prompt:"Method validateที่ sample solution5 mLใน20 mL vial. Analystเผลอใช้10 mLใน20 mL vial โดยamount analyteเท่ากัน. เหตุใดresponseอาจเปลี่ยนแม้total analyteเท่าเดิม?",
    options:["Phase ratio (headspace/liquid volume) เปลี่ยน จึงเปลี่ยนpartition equilibriumและgas-phase concentration","FID responseไม่ขึ้นกับheadspace","Moles analyteเพิ่มสองเท่าโดยอัตโนมัติ","Column polarityเปลี่ยนตามfill volume","Carrier gas compositionเปลี่ยนเอง"],
    rationale:"Static headspace responseขึ้นกับpartition coefficientและphase ratio β; liquid/headspace volumesจึงเป็นcritical conditions.",
    traps:["Headspace samplingขึ้นกับgas concentrationอย่างมาก","โจทย์บอกtotal analyteเท่าเดิม","Column chemistryไม่เปลี่ยน","Carrier gasไม่ได้ปรับอัตโนมัติจากfill volume"],
    difficulty:"hard",
    ref:"Static headspace quantitative theory"
  },
  {
    topic:"Headspace GC / vial leak diagnosis",
    prompt:"Replicate headspace vialsบางใบให้areaของทั้งanalyteและinternal standardต่ำพร้อมกันมาก แต่area ratioยังใกล้เดิม. Crimp inspectionพบcapหลวม. ข้อใดเหมาะสมที่สุด?",
    options:["Vial leakทำให้volatile headspaceสูญเสีย; IS ratioอาจชดเชยบางส่วนแต่ต้องinvestigate vial integrityและacceptance","Analyte degradationเฉพาะตัว","Detector saturation","Column bleed","RRFผิด"],
    rationale:"Common-mode lossของanalyteและISพร้อมphysical evidenceของcapหลวมชี้headspace leak; ratioอาจmask absolute lossแต่ไม่ได้ทำให้sample preparation valid.",
    traps:["Selective degradationควรเปลี่ยนratio","Saturationให้high signal problem","Column bleedให้backgroundไม่ใช่lowall peaks","RRFไม่ทำให้absolute areasตกจากvialหนึ่ง"],
    difficulty:"hard",
    ref:"Headspace GC system/sample integrity principles"
  },
  {
    topic:"Headspace GC / standard addition calculation",
    prompt:"Matrix headspace responseสงสัยsuppression. Unspiked sample area ratio=0.40; เมื่อspikeเพิ่ม solvent 50 µg/g ratio=0.65. สมมติlinearและinterceptจากmatrix constant. Estimated original solvent concentrationโดยstandard additionเท่าใด?",
    options:["80 µg/g","20 µg/g","50 µg/g","130 µg/g","32.5 µg/g"],
    rationale:"Response increment0.25เกิดจาก50µg/g; slope=0.25/50=0.005 perµg/g. Original response0.40/slope=80µg/g.",
    traps:["20เกิดจากกลับratio","50คือspike amount","130คือบวกspikeผิด","32.5คือmultiply ratioผิด"],
    difficulty:"hard",
    ref:"Standard-addition quantitative analysis",
    calc:["Slope=(0.65−0.40)/50=0.005","Coriginal=0.40/0.005=80 µg/g"]
  },
  {
    topic:"Headspace GC / matrix mismatch",
    prompt:"Residual solvent standardเตรียมในwater แต่sampleเป็นhigh-salt viscous matrix. Standard curvelinearมากแต่spike recoveryในsample=135%. ข้อใดเป็นสมมติฐานที่ดีที่สุด?",
    options:["Matrix partitioningต่างจากaqueous standards ทำให้headspace response factorไม่matched; ต้องmatrix-matchหรือใช้appropriate calibration strategy","Sampleมีsolventเพิ่มจากcolumn bleedแน่นอน","Linearityสูงพิสูจน์accuracyแล้ว","ลดdetector temperatureจะแก้matrix effect","ใช้retention timeแทนarea"],
    rationale:"Headspace responseขึ้นกับpartition coefficientและphase ratio; matrix salt/viscosity/compositionสามารถเปลี่ยนpartitioning ทำให้external aqueous calibration biasแม้linear.",
    traps:["Column bleedไม่ได้อธิบาย135% spike recoveryจำเพาะ","Linearityไม่เท่ากับaccuracyในmatrix","Detector temperatureไม่แก้sample partitioningโดยตรง","Retention timeไม่ใช่quantitative response"],
    difficulty:"hard",
    ref:"Headspace GC matrix-effect principles"
  },

  // Case 17 — Size-exclusion chromatography biologic
  {
    topic:"SEC / separation principle",
    prompt:"Protein drug monographใช้SEC columnสำหรับวัดhigh-molecular-weight species (HMWS). กลไกหลักของSECคือข้อใด?",
    options:["แยกตามhydrodynamic sizeจากการเข้าถึงpore volumeต่างกัน โดยspeciesใหญ่กว่ามักออกก่อน","แยกตามchargeด้วยion-exchange sites","แยกตามhydrophobicityด้วยC18","แยกตามchirality","แยกตามboiling point"],
    rationale:"SECไม่มีideal strong adsorption; large moleculesเข้าถึงporesได้น้อยจึงtravel pathสั้นและeluteก่อนsmall species.",
    traps:["Chargeเป็นIEX","Hydrophobicityเป็นRP-HPLC","Chiralityเป็นchiral LC","Boiling pointเป็นGC"],
    difficulty:"hard",
    ref:"Size-exclusion chromatography theory"
  },
  {
    topic:"SEC / void volume interpretation",
    prompt:"SEC chromatogramมีpeakหนึ่งออกใกล้void volumeและเพิ่มขึ้นหลังheat stressของprotein. Peakนี้น่าจะสอดคล้องกับอะไร?",
    options:["Large aggregates/HMWSที่ถูกexcludeจากporesมาก","Monomerที่เล็กที่สุด","Free amino acids","Buffer salts","Detector noiseเท่านั้น"],
    rationale:"Speciesขนาดใหญ่มากเข้าถึงpore volumeน้อยและeluteใกล้void volume; heat stressมักเพิ่มaggregates.",
    traps:["Monomerretainsผ่านpore volumeมากกว่าaggregate","Amino acidsและsaltsเล็กมากออกช้ากว่า/total volume","Patternstress-dependentสนับสนุนreal species"],
    difficulty:"hard",
    ref:"SEC aggregate analysis"
  },
  {
    topic:"SEC / nonspecific interaction",
    prompt:"Protein SEC peakมีtailingและretentionเปลี่ยนเมื่อionic strengthลดลง ทั้งที่molecular sizeไม่เปลี่ยน. ข้อใดควรสงสัย?",
    options:["Secondary electrostatic interactionระหว่างproteinกับstationary phaseนอกเหนือจากsize-exclusion mechanism","Proteinทุกตัวต้องเปลี่ยนMWเมื่อsaltลด","UV detector drift","Autosampler carryoverเท่านั้น","Void volumeเพิ่มเพราะtemperatureคงที่"],
    rationale:"Ideal SECต้องminimize non-size interactions. Ionic-strength dependenceของretention/shapeบ่งชี้electrostatic adsorption/secondary interactions.",
    traps:["Saltไม่ได้เปลี่ยนcovalent MWโดยอัตโนมัติ","Detector driftไม่อธิบายretention dependenceon ionic strength","Carryoverไม่สร้างsystematic ionic-strength effect","Void volumeไม่ได้เพิ่มเองจากsaltแบบคำอธิบายหลัก"],
    difficulty:"hard",
    ref:"SEC method development for proteins"
  },
  {
    topic:"SEC / aggregate quantitation limitation",
    prompt:"HMWSและmonomerมีUV extinction coefficientsไม่เท่ากันเล็กน้อย. หากคำนวณaggregate%ด้วยarea normalizationโดยสมมติresponseเท่ากัน ข้อใดเหมาะสมที่สุด?",
    options:["อาจเกิดbiasในmass fractionและควรประเมินresponse equivalence/RRFตามintended accuracy","Area%เท่ากับmass%เสมอในSEC","Retention timeแก้response differenceอัตโนมัติ","ต้องใช้GCแทนSEC","ให้ปรับareaให้รวม100%แล้วbiasหาย"],
    rationale:"Area normalization assumes equal response per mass/mole; differenceในabsorptivityทำให้area fractionไม่เท่ากับmass fraction.",
    traps:["ไม่ใช่สัจพจน์","Retentionไม่แก้detector response factor","GCไม่เหมาะกับintact proteins","Normalizationเพียงบังคับsum ไม่แก้RRF bias"],
    difficulty:"hard",
    ref:"Quantitative SEC response-factor principles"
  },
  {
    topic:"SEC / system suitability",
    prompt:"SEC SSTกำหนด resolutionระหว่างdimerและmonomer NLT1.5. Standard monomerบริสุทธิ์ไม่มีdimerเพียงพอให้วัดRs. แนวทางใดสมเหตุสมผลที่สุด?",
    options:["ใช้system suitability mixture/ stressed or spiked sampleที่มีทั้งสองspeciesในระดับเหมาะสมตามvalidated procedure","คำนวณRsจากmonomer peakเดียว","ยกเลิกRs criterionทุกrun","ใช้tailing factorของmonomerแทนRsโดยอัตโนมัติ","เพิ่มinjection volumeจนmonomerแตกเป็นสองpeak"],
    rationale:"Resolutionต้องมีสองpeaksที่represent critical pair; SST materialควรถูกdesignedให้challenge separationอย่างเหมาะสม.",
    traps:["Rsต้องใช้สองretention positions/widths","ห้ามลบcritical SSTโดยไม่มีlifecycle justification","Tailingไม่เทียบเท่าcritical pair resolution","Overloadเพื่อสร้างartificial splitไม่ใช่solution"],
    difficulty:"hard",
    ref:"ICH Q14; SEC system suitability design"
  },

  // Case 18 — Chiral HPLC
  {
    topic:"Chiral LC / purpose",
    prompt:"Racemic drugมีR-enantiomerเป็นactiveและS-enantiomerเป็นspecified impurity. เหตุผลที่ achiral C18 methodทั่วไปไม่เพียงพอสำหรับenantiomeric purityคือข้อใด?",
    options:["Enantiomersมีphysical propertiesเกือบเหมือนกันในachiral environment จึงต้องมีchiral recognition/selectivityเพื่อแยก","EnantiomersมีMWต่างกันมาก","UV wavelengthของสองenantiomerต่างกันเสมอ","C18แยกได้เพราะRจะออกก่อนเสมอ","S-enantiomerไม่ดูดUV"],
    rationale:"Enantiomersต่างinteractionเมื่ออยู่ในchiral environment; achiral stationary/mobile phaseมักให้retentionเหมือนกัน.",
    traps:["Enantiomersมีsame formula/MW","UV spectraในachiral mediumมักเหมือนกัน","ไม่มีuniversal R-first rule","ทั้งสองมักมีchromophoreเดียวกัน"],
    difficulty:"hard",
    ref:"Chiral chromatography principles"
  },
  {
    topic:"Chiral LC / enantiomeric excess",
    prompt:"Chiral HPLC (response factorsเท่ากัน) ให้ R area=97.0% และ S area=3.0%. Enantiomeric excess (ee) ของRประมาณเท่าใด?",
    options:["94% ee R","97% ee R","3% ee R","100% ee R","91% ee R"],
    rationale:"ee=|%R−%S|=97−3=94%.",
    traps:["97%คือenantiomer fractionไม่ใช่ee","3%คือminor fraction","ไม่ใช่enantiopure","91%คำนวณผิด"],
    difficulty:"hard",
    ref:"Stereochemical purity calculations",
    calc:["ee=97%−3%=94% R"]
  },
  {
    topic:"Chiral LC / racemate spike suitability",
    prompt:"Assay sampleปกติมีS-enantiomerต่ำมากจนไม่เห็นcritical separationชัด. เหตุผลที่ใช้racemate-spiked SST solutionมีประโยชน์คืออะไร?",
    options:["สร้างทั้งRและS peaksในระดับเหมาะสมเพื่อยืนยันresolutionของcritical enantiomer pair","เพิ่มassay potencyของsample","ทำให้columnกลายเป็นachiral","ใช้แทนreference standardทั้งหมด","ลดretention timeของRเป็นศูนย์"],
    rationale:"SSTควรchallenge chiral separation; racemate/spikeช่วยให้minor enantiomerมีsignalเพียงพอวัดRs.",
    traps:["ไม่ได้เพิ่มtrue potency","ไม่เปลี่ยนstationary phase chirality","ยังต้องcharacterized standardsตามmethod","ไม่ได้ทำให้tRเป็นศูนย์"],
    difficulty:"hard",
    ref:"Chiral LC system suitability"
  },
  {
    topic:"Chiral LC / temperature selectivity",
    prompt:"Chiral method Rs=1.7ที่20°Cแต่1.2ที่30°C ขณะที่pressureและefficiencyแทบไม่เปลี่ยน. ข้อใดน่าจะถูกต้องที่สุด?",
    options:["Chiral recognition/selectivityมีtemperature dependence แม้column efficiencyใกล้เดิม จึงtemperatureเป็นcritical method parameter","Rsลดเพราะdetector wavelengthเปลี่ยนอัตโนมัติ","Pressureคงที่พิสูจน์ว่าRsต้องคงที่","เพิ่มsample concentrationจะแก้selectivity","Temperatureไม่มีผลต่อthermodynamic interactions"],
    rationale:"Chiral separationมักไวต่อenthalpy/entropyของdiastereomeric interactions; αเปลี่ยนตามtemperatureได้มากโดยpressure/Nเปลี่ยนน้อย.",
    traps:["Detector wavelengthไม่ได้เปลี่ยนอัตโนมัติ","Resolutionขึ้นกับselectivityด้วยไม่ใช่pressure/Nเท่านั้น","Concentrationไม่แก้thermodynamic selectivityและอาจoverload","Temperatureมีผลต่อequilibriaชัด"],
    difficulty:"hard",
    ref:"Chiral chromatography thermodynamics"
  },
  {
    topic:"Chiral LC / RRF and minor enantiomer",
    prompt:"S-enantiomer response factorเทียบR =0.80. Area normalizationที่ไม่แก้RRFให้S=2.0%. Corrected S fractionโดยประมาณ (เมื่อSมีสัดส่วนต่ำมาก) ใกล้ข้อใด?",
    options:["ประมาณ2.5%","1.6%","2.0%","0.8%","4.0%"],
    rationale:"Minor impurityที่responseต่ำกว่าR จะถูกunderestimate; first-order correction≈2.0/0.80=2.5%. สำหรับexact normalizationอาจต่างเล็กน้อยแต่2.5%ใกล้สุด.",
    traps:["1.6คือคูณRRFผิดทิศ","2.0คือไม่แก้","0.8คือRRF","4.0ไม่มีbasis"],
    difficulty:"hard",
    ref:"Chiral impurity response-factor concepts",
    calc:["Approx corrected S≈2.0/0.80=2.5%"]
  },

  // Case 19 — LC assay with monograph suitability/qualification logic
  {
    topic:"Compendial method / verification vs validation",
    prompt:"QC labนำofficial pharmacopoeial assay methodมาใช้กับproductที่ตรงmonographโดยไม่ดัดแปลง. แนวทางใดเหมาะสมที่สุด?",
    options:["ทำcompendial method verificationว่าสามารถปฏิบัติmethodได้เหมาะสมในlab/product matrixตามcharacteristicsที่เกี่ยวข้อง; ไม่จำเป็นต้องrevalidateทุกparameterแบบmethodใหม่โดยอัตโนมัติ","ไม่ต้องทำอะไรเพราะเป็นofficial method","ต้องfull validationทุกparameterเหมือนnovel methodเสมอ","ทำเฉพาะinstrument qualificationก็พอ","เปลี่ยนmobile phaseให้เหมาะกับlabโดยไม่ประเมินผล"],
    rationale:"Compendial proceduresยังต้องdemonstrate suitabilityภายใต้actual conditions of use; extentเป็นverificationตามapplicable pharmacopoeial/regulatory expectations ไม่ใช่zero workหรือfull revalidationทุกครั้ง.",
    traps:["Official statusไม่ลบresponsibilityของlab","Full revalidationอาจเกินจำเป็นถ้าไม่modified","Instrument qualificationไม่พิสูจน์method performanceในmatrix","Modificationอาจtrigger additional validation/change control"],
    difficulty:"hard",
    ref:"USP <1226> Verification of Compendial Procedures; ICH Q2(R2)"
  },
  {
    topic:"Compendial LC / instrument qualification",
    prompt:"เครื่องHPLCผ่านinstallation/operational/performance qualificationแล้ว. ข้อใดถูกต้องที่สุดเกี่ยวกับการใช้official monograph method?",
    options:["Instrument qualificationเป็นnecessary infrastructureแต่ไม่แทนsystem suitabilityของแต่ละrunหรือmethod verificationในactual use","Qualificationทำให้ไม่ต้องsystem suitabilityอีก","Qualificationพิสูจน์specificityของทุกmethod","Qualificationทำให้reference standardไม่ต้องมีpotency","Qualificationแทนanalyst trainingได้"],
    rationale:"Qualificationแสดงว่าequipmentเหมาะและทำงานตามdesign แต่run-specific performanceและmethod suitabilityยังต้องประเมินตามprocedure.",
    traps:["SSTยังต้องตามmonograph","Specificityเป็นmethod/matrix property","Reference standardต้องcharacterized","Training/competencyเป็นคนละcontrol"],
    difficulty:"hard",
    ref:"GMP equipment qualification; USP <621>/<1226>"
  },
  {
    topic:"Compendial LC / allowed adjustment",
    prompt:"Labต้องการลดrun timeของofficial LC monographโดยเปลี่ยนcolumn lengthและparticle size. ก่อนทำควรพิจารณาอะไรสำคัญที่สุด?",
    options:["ขอบเขต allowable adjustmentsตามpharmacopoeia, preservation of chromatographic performance/SST และneed for additional verification/validation","ลดrun timeได้เสมอถ้าAPI retentionยังเห็น","เปลี่ยนได้โดยไม่documentเพราะsameL1","ใช้areaอย่างเดียวพิสูจน์equivalence","ถ้าpressureต่ำลงถือว่าequivalent"],
    rationale:"Compendial chromatographyมีกรอบallowed adjustmentsแต่ต้องรักษาselectivity/system suitabilityและdocument impact; บางchangesเกินขอบเขตและเป็นmethod modification.",
    traps:["RetentionของAPIอย่างเดียวไม่พอ","SameL1ไม่รับประกันsameperformance","Areaไม่ประเมินcritical separation","Pressureไม่ใช่equivalence criterion"],
    difficulty:"hard",
    ref:"USP <621> allowable adjustments; analytical lifecycle"
  },
  {
    topic:"Compendial LC / asymmetry vs tailing",
    prompt:"Monographกำหนด tailing factor NMT2.0 แต่software reportให้ asymmetry factor As=1.6 ที่10% peak height ไม่ใช่USP tailing factorที่5% height. ข้อใดเหมาะสมที่สุด?",
    options:["ห้ามนำAs=1.6ไปเทียบกับUSP tailing limitโดยตรงโดยไม่ยืนยันนิยาม/algorithmเดียวกัน","ถือว่าผ่านเพราะ1.6<2.0","คูณAsด้วย2แล้วเทียบ","Asและtailing factorเหมือนกันทุกsoftware","ใช้peak areaแทนทั้งสอง"],
    rationale:"Peak asymmetry metricsมีนิยามและmeasurement heightต่างกัน; acceptance criterionต้องใช้metricตามmonograph/validated calculation.",
    traps:["ตัวเลขต่ำกว่าlimitไม่ได้พอถ้าmetricคนละนิยาม","ไม่มีuniversalfactor2 conversion","Software namingไม่ทำให้นิยามเท่ากัน","Areaไม่แทนshape metric"],
    difficulty:"hard",
    ref:"USP <621> peak symmetry/tailing definitions"
  },
  {
    topic:"Compendial LC / SST failure after sample",
    prompt:"Initial SSTผ่าน. หลังsample 20 injections bracketing standardพบtailing2.3 (limit2.0) และRSDยังผ่าน. Sample resultsก่อนbracketควรจัดการอย่างไรเหมาะสมที่สุด?",
    options:["ประเมินrun validityตามSOP/monographและinvestigateเมื่อSST/bracketingไม่ผ่าน; ไม่ควรถือsampleทั้งหมดvalidโดยอัตโนมัติ","ถือvalidทั้งหมดเพราะinitial SSTผ่าน","ตัดbracketing standardออก","เปลี่ยนtailing limitเป็น2.5","เฉลี่ยtailingต้นกับท้ายแล้วถ้า≤2ถือว่าผ่าน"],
    rationale:"Bracketing/end SSTใช้ยืนยันsystem performanceตลอดsequence; failureอาจinvalidate affected intervalและต้องinvestigateตามpredefined rules.",
    traps:["Initial passไม่รับประกันlate-run performance","ห้ามลบfailed control","Spec changeต้องformal science/regulatory basis","Averagingpass/fail checkpointsไม่ใช่usual acceptance logic"],
    difficulty:"hard",
    ref:"GMP chromatographic sequence control; USP <621>"
  },

  // Case 20 — Multi-technique analytical decision
  {
    topic:"Analytical technique selection / polymorph",
    prompt:"ต้องแยกคำถามว่า API lotสองlotมีchemical purityเท่ากันแต่ต่างcrystal formหรือไม่ เทคนิคใดให้หลักฐานโดยตรงที่สุด?",
    options:["PXRD","HPLC assay","UV absorbance","Acid-base titration","Headspace GC"],
    rationale:"PXRD fingerprintสะท้อนcrystal latticeและแยกpolymorphsได้โดยตรงมากกว่าassay/solution techniques.",
    traps:["HPLCในsolutionมักสูญเสียsolid-state information","UVไม่บอกlattice","Titrationวัดequivalents","HS-GCวัดvolatiles"],
    difficulty:"hard",
    ref:"ICH Q6A solid-state characterization"
  },
  {
    topic:"Analytical technique selection / amorphous fraction",
    prompt:"ต้องติดตามการเพิ่มamorphous contentเล็กน้อยในpredominantly crystalline APIหลังmilling. ชุดเทคนิคใดมีเหตุผลมากที่สุดสำหรับorthogonal assessment?",
    options:["PXRDร่วมกับDSC","GC-FIDร่วมกับKarl Fischer","Titrationร่วมกับUV","SECร่วมกับELISA","Headspace GCร่วมกับviscometer"],
    rationale:"PXRDให้crystallinity patternและDSCให้thermal transitions/glass transition/melting changes จึงorthogonalต่อsolid-state change.",
    traps:["GC/KFเน้นvolatile/water","Titration/UVเน้นchemical amount","SEC/ELISAเหมาะmacromolecules","HS-GC/viscosityไม่directต่อcrystallinity"],
    difficulty:"hard",
    ref:"Solid-state pharmaceutical characterization"
  },
  {
    topic:"Analytical technique selection / degradation identity",
    prompt:"HPLCพบunknown degradation peakและต้องการข้อมูลmolecular massเพื่อช่วยidentify ขั้นต่อไปใดเหมาะสมที่สุด?",
    options:["LC–MS","เพิ่มUV wavelengthเพียงอย่างเดียว","Friability test","PXRDของtabletทั้งเม็ดอย่างเดียว","Tapped density"],
    rationale:"LC-MSเชื่อมchromatographic separationกับmass-to-charge informationของunknown speciesและช่วยstructural elucidation.",
    traps:["UV spectraให้chromophore infoจำกัดไม่ใช่molecular mass","Friability/flowไม่เกี่ยวchemical identity","PXRDไม่เหมาะidentifytrace solution degradantโดยตรง"],
    difficulty:"hard",
    ref:"Analytical identification strategies"
  },
  {
    topic:"Analytical technique selection / trace metals",
    prompt:"ต้องวิเคราะห์elemental impurity Pb, Cd, As, Hg ระดับtraceในAPI เทคนิคใดเหมาะสมที่สุดโดยทั่วไป?",
    options:["ICP-MS","HPLC-UV","DSC","FTIR","Dissolution apparatus"],
    rationale:"ICP-MSให้multi-element trace sensitivityและเป็นเทคนิคหลักสำหรับelemental impuritiesหลายชนิด.",
    traps:["HPLC-UVไม่วัดelementsโดยตรง","DSCวัดthermal","FTIRวัดvibrational functional groups","Dissolutionวัดrelease"],
    difficulty:"hard",
    ref:"ICH Q3D elemental impurities; pharmacopeial elemental analysis"
  },
  {
    topic:"Analytical technique selection / volatile impurity",
    prompt:"Unknown impurityมีboiling pointต่ำและสูญหายเมื่อsample solutionเปิดฝาทิ้งไว้. เทคนิคใดควรพิจารณาเป็นลำดับต้น?",
    options:["Headspace GC-MS","SEC-UV","PXRD","Potentiometric titration","Dissolution UV"],
    rationale:"Volatile unknownเหมาะกับheadspace samplingเพื่อลดloss/matrixและMSช่วยidentity.",
    traps:["SECใช้sizeของmacromolecules","PXRD solid-state lattice","Titrationไม่identifyvolatile species","Dissolutionไม่ใช่identity technique"],
    difficulty:"hard",
    ref:"Volatile impurity analysis principles"
  }
];




function buildQuestion(d: Draft, index: number): McqQuestion {
  const pos = answerPositions[index % answerPositions.length];
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
      question_count: 150,
      created_at: "2026-09-22 16:00:00",
    },
  };
}

export const IP1_PILOT_050: McqQuestion[] = [...D, ...D2, ...D3].map(buildQuestion);
