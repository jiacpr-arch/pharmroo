export type ClinicalSystem = {
  slug: string; icon: string; name: string; description: string; topics: string[];
  keywords: string[]; tone: string;
};

export const clinicalSystems: ClinicalSystem[] = [
  { slug:"cardiovascular",icon:"❤️",name:"หัวใจและหลอดเลือด",description:"ทบทวนโรคหัวใจที่ออกสอบบ่อย ตั้งแต่ HF, ACS, AF ไปจนถึงยาต้านการแข็งตัวของเลือด",topics:["Heart Failure","ACS","Atrial Fibrillation","Arrhythmia","Anticoagulants"],keywords:["heart","cardio","หัวใจ","heart failure","acs","atrial","arrhythm","anticoag"],tone:"from-rose-50 to-white" },
  { slug:"hypertension",icon:"🩸",name:"ความดันโลหิตสูง",description:"เจาะ ACEI, ARB, CCB, diuretics และจุดเลือกยาที่ชอบออกข้อสอบ",topics:["ACE inhibitors","ARBs","CCBs","Diuretics","Beta-blockers"],keywords:["hypertension","ความดัน","ace inhibitor","acei","arb","ccb","diuretic"],tone:"from-red-50 to-white" },
  { slug:"diabetes",icon:"🍬",name:"เบาหวาน",description:"ยาลดน้ำตาลและการเลือกใช้ยาแบบเชื่อมกลไก ผลข้างเคียง และ clinical pearl",topics:["Insulin","Metformin","SGLT2 inhibitors","GLP-1 RA","DPP-4 inhibitors"],keywords:["diabetes","เบาหวาน","insulin","metformin","sglt","glp-1","dpp-4"],tone:"from-amber-50 to-white" },
  { slug:"renal-electrolytes",icon:"🫘",name:"ไตและอิเล็กโทรไลต์",description:"CKD, AKI, renal dose adjustment และ electrolyte disorders ที่ต้องแม่นก่อนสอบ",topics:["CKD","AKI","Hyperkalemia","Hyponatremia","Renal dosing"],keywords:["renal","kidney","ไต","ckd","aki","hyperkal","hypokal","sodium","electrolyte"],tone:"from-sky-50 to-white" },
  { slug:"bone-joint",icon:"🦴",name:"กระดูกและข้อ",description:"Osteoporosis, gout, OA, RA และยาที่เกี่ยวข้อง",topics:["Osteoporosis","Gout","Osteoarthritis","Rheumatoid arthritis","NSAIDs"],keywords:["bone","joint","กระดูก","ข้อ","gout","osteoporosis","arthritis","nsaid"],tone:"from-violet-50 to-white" },
  { slug:"dyslipidemia",icon:"🫀",name:"ไขมันในเลือด",description:"Statin และยาลดไขมันกลุ่มสำคัญ พร้อม adverse effects และ interaction",topics:["Statins","Ezetimibe","Fibrates","PCSK9 inhibitors","Monitoring"],keywords:["lipid","ไขมัน","statin","ezetimibe","fibrate","pcsk9"],tone:"from-pink-50 to-white" },
  { slug:"infectious-disease",icon:"🦠",name:"โรคติดเชื้อ",description:"Antibiotics, spectrum, resistance และการเลือกยาตามเชื้อ",topics:["Antibiotics","Spectrum","Resistance","Dose adjustment","Common infections"],keywords:["infection","ติดเชื้อ","antibiotic","antimicrobial","bacteria"],tone:"from-emerald-50 to-white" },
  { slug:"respiratory",icon:"🫁",name:"ทางเดินหายใจ",description:"Asthma, COPD และ inhaler pharmacology",topics:["Asthma","COPD","SABA/LABA","ICS","Inhalers"],keywords:["respiratory","asthma","copd","inhaler","หอบ"],tone:"from-cyan-50 to-white" },
  { slug:"neuro-psych",icon:"🧠",name:"ประสาทและจิตเวช",description:"Stroke, epilepsy, depression และยาทางระบบประสาทที่ออกสอบบ่อย",topics:["Stroke","Epilepsy","Depression","Antipsychotics","CNS drugs"],keywords:["cns","brain","stroke","epilep","depress","psych","ประสาท","จิต"],tone:"from-indigo-50 to-white" },
  { slug:"gastrointestinal",icon:"🍽️",name:"ทางเดินอาหาร",description:"GERD, PUD, GI bleeding และยาที่ใช้บ่อย",topics:["GERD","PUD","GI bleeding","PPI","Antiemetics"],keywords:["gastro","gerd","pud","ppi","gi bleed","ทางเดินอาหาร"],tone:"from-orange-50 to-white" },
  { slug:"endocrine",icon:"🧬",name:"ต่อมไร้ท่อ",description:"Thyroid, adrenal และ steroid pharmacology",topics:["Thyroid","Adrenal","Corticosteroids","Hormones"],keywords:["endocrine","thyroid","adrenal","steroid","ต่อมไร้ท่อ"],tone:"from-teal-50 to-white" },
  { slug:"other",icon:"💊",name:"หัวข้ออื่น ๆ",description:"PK, ADR, drug interaction, calculation และกฎหมายยา",topics:["Pharmacokinetics","ADR","Drug interactions","Calculation","Drug Law"],keywords:["pharmacokinetic","calculation","drug law","interaction","adr","กฎหมาย"],tone:"from-slate-50 to-white" },
];

export function getClinicalSystem(slug:string){ return clinicalSystems.find(s=>s.slug===slug); }
export function postMatchesSystem(post:{title:string;description?:string|null;category?:string|null}, system:ClinicalSystem){
  const hay=`${post.title} ${post.description||""} ${post.category||""}`.toLowerCase();
  return system.keywords.some(k=>hay.includes(k.toLowerCase()));
}