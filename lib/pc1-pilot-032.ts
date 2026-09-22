import type { McqQuestion } from "@/lib/types-mcq";
type Q={p:string;o:string[];a:number;r:string};
type C={t:string;s:string;q:Q[]};
const C:C[]=[
{t:"T2DM + CKD",s:"หญิง 66 ปี T2DM, CKD G3a, eGFR 46, UACR 620 mg/g, BP 146/84, HbA1c 8.1% ใช้ metformin และ amlodipine",q:[
{p:"การเพิ่มยากลุ่มใดมีประโยชน์ต่อการชะลอ CKD และลด cardiovascular risk โดยตรง?",o:["SGLT2 inhibitor","Sulfonylurea","Acarbose","Meglitinide","DPP-4 inhibitor ทุกตัวเท่าเทียมกัน"],a:0,r:"SGLT2 inhibitor ที่มี outcome benefit แนะนำใน T2DM+CKD เมื่อ eGFR เหมาะสม"},
{p:"หลังเริ่ม ACE inhibitor ค่า SCr 1.2 เป็น 1.4 mg/dL, K 4.9 และผู้ป่วย stable ควรทำอย่างไร?",o:["หยุดทันที","ให้ต่อและติดตาม renal function/K","เพิ่ม potassium","เปลี่ยนเป็น NSAID","ให้ IV fluid ทุกกรณี"],a:1,r:"การเพิ่ม creatinine เล็กน้อยหลัง RAAS blockade ต้องตีความร่วมกับอาการและแนวโน้ม"},
{p:"ก่อน elective surgery ผู้ป่วยใช้ SGLT2 inhibitor ประเด็นใดสำคัญ?",o:["เพิ่ม dose ก่อนอดอาหาร","วางแผนหยุดล่วงหน้าตาม perioperative protocol","ให้ต่อถึงเช้าผ่าตัดเสมอ","เปลี่ยนเป็น sulfonylureaเอง","งดตรวจ glucose"],a:1,r:"SGLT2 inhibitor ต้องมี perioperative hold strategy เพื่อลด euglycemic DKA"},
{p:"คำแนะนำติดตามใดเหมาะสมที่สุด?",o:["ติดตาม HbA1c อย่างเดียว","ติดตาม eGFR/UACR/BP/K และ adherence ตามยา","ไม่ต้องติดตามไต","ดื่มน้ำหวานป้องกัน CKD","หยุดยาทุกครั้งที่ป่วยเล็กน้อย"],a:1,r:"CKD care ต้องติดตาม kidney markers, BP, electrolytes และ medication safety"}]},
{t:"ACS + PCI",s:"ชาย 70 ปี NSTEMI ได้ PCI ใส่ DES ไม่มี active bleeding และไม่มีข้อบ่งใช้ anticoagulation ระยะยาว",q:[
{p:"default antiplatelet strategy หลัง ACS ในผู้ป่วยที่ bleeding risk ไม่สูงคือข้อใด?",o:["Aspirin เดี่ยวทันที","DAPT aspirin + P2Y12 inhibitor","Warfarin เดี่ยว","หยุด antithrombotic","Triple therapy 12 เดือนทุกคน"],a:1,r:"DAPT เป็น default strategy หลัง ACS เมื่อไม่มีข้อจำกัด"},
{p:"หากผู้ป่วยมีความเสี่ยง GI bleeding ระหว่าง DAPT ควรพิจารณาอะไร?",o:["เพิ่ม NSAID","PPI gastroprotection","หยุด statin","เพิ่ม aspirin dose","ให้ vitamin K"],a:1,r:"PPI แนะนำในผู้ป่วย ACS ที่มี GI bleeding risk"},
{p:"ก่อนจำหน่าย ผู้ป่วยแจ้งว่าเป็น osteoarthritis และใช้ ibuprofen 400 mg วันละ 2–3 ครั้งเกือบทุกวัน ขณะนี้หลัง PCI ได้ aspirin ร่วมกับ P2Y12 inhibitor เภสัชกรควรจัดการเรื่องยาแก้ปวดอย่างไรจึงเหมาะสมที่สุด?",o:["หลีกเลี่ยง ibuprofen ใช้ประจำ และประเมินทางเลือก analgesia ที่มี bleeding/CV/renal risk ต่ำกว่า","รับ high-intensity lipid lowering ตามข้อบ่งใช้","เข้ cardiac rehabilitation","ติดตาม lipid","เลิกบุหรี่"],a:0,r:"ในผู้ป่วย ACS หลัง PCI ที่ใช้ DAPT การใช้ systemic NSAID เป็นประจำเพิ่มความเสี่ยง bleeding และ cardiovascular/renal adverse events จึงควรทบทวนและเลือก analgesic strategy ที่ปลอดภัยกว่า"},
{p:"การติดตาม secondary prevention ใดเหมาะสม?",o:["ไม่ต้องตรวจ lipid อีก","ติดตาม lipid หลังเริ่ม/ปรับ lipid-lowering therapy","หยุด statinเมื่อ LDL ลด","งด cardiac rehab","เน้น supplement แทนยา"],a:1,r:"ACS guideline เน้น lipid follow-up และ cardiac rehabilitation"}]},
{t:"Atrial fibrillation",s:"หญิง 78 ปี AF, HTN, DM, prior TIA, eGFR 55 ไม่มี active bleeding",q:[
{p:"เป้าหมายสำคัญในการจัดการ AF นอกเหนือจาก symptom control คืออะไร?",o:["ป้องกัน stroke/thromboembolism","ให้ aspirin ทุกคนแทน OAC","หยุดยาความดัน","ให้ antibiotic","ลด HbA1c ต่ำที่สุด"],a:0,r:"AF management ต้องประเมินและป้องกัน thromboembolism"},
{p:"ก่อนเลือก oral anticoagulant ควรประเมินอะไร?",o:["stroke risk, bleeding factors, renal function และ interaction","สีเม็ดยา","BMI อย่างเดียว","LDL อย่างเดียว","ไม่มีอะไรต้องประเมิน"],a:0,r:"การเลือก OAC ต้อง individualized และประเมิน safety"},
{p:"ผู้ป่วยเริ่ม NSAID ใช้เองทุกวัน ประเด็นสำคัญคือ?",o:["ลด bleeding risk","เพิ่ม bleeding risk และควรทบทวนความจำเป็น","ทำให้ OAC ไม่มีผล","ป้องกัน stroke","ไม่มี interaction ทางคลินิก"],a:1,r:"NSAID ร่วม anticoagulation เพิ่ม bleeding risk"},
{p:"แนวคิด AF-CARE เน้นข้อใด?",o:["รักษา rhythm อย่างเดียว","comorbidity, stroke prevention, symptom control และ reassessment","หยุด anticoagulation เมื่อไม่มี palpitation","ใช้ aspirin แทน OAC","ไม่ต้อง reassess"],a:1,r:"ESC 2024 ใช้ AF-CARE framework แบบองค์รวม"}]},
{t:"Asthma",s:"หญิง 26 ปี asthma ใช้ salbutamol 4-5 วัน/สัปดาห์และมี nocturnal symptoms เดือนละหลายครั้ง ไม่ได้ใช้ controller",q:[
{p:"แนวทางปัจจุบันไม่แนะนำการรักษาแบบใด?",o:["SABA-only treatment","ICS-containing treatment","ตรวจ inhaler technique","ประเมิน adherence","action plan"],a:0,r:"GINA ไม่แนะนำ SABA-only เพราะเพิ่ม exacerbation risk"},
{p:"preferred reliever strategy สำหรับผู้ใหญ่/วัยรุ่นใน Track 1 คือ?",o:["low-dose ICS-formoterol","oral salbutamol","theophylline PRN","LABA เดี่ยว","antibiotic PRN"],a:0,r:"GINA Track 1 ใช้ low-dose ICS-formoterol เป็น anti-inflammatory reliever"},
{p:"ก่อน step-up therapy ควรทำอะไร?",o:["ตรวจ adherence และ inhaler technique","เพิ่มยาทันทีโดยไม่ประเมิน","หยุด ICS","ใช้ SABA อย่างเดียว","ให้ prednisolone ระยะยาวทุกคน"],a:0,r:"ต้องแก้ modifiable factors ก่อน step-up"},
{p:"การดูแลต่อเนื่องใดเหมาะสม?",o:["written asthma action plan","ห้ามออกกำลังทุกชนิด","ไม่ต้องสอน inhaler","หยุด controller เมื่อดีขึ้น 1 วัน","ซื้อ antibiotic สำรอง"],a:0,r:"action plan และ inhaler education เป็นส่วนสำคัญของ asthma care"}]},
{t:"ESBL pyelonephritis",s:"หญิง 63 ปี pyelonephritis มีไข้สูงและ bacteremia; culture พบ ESBL E. coli พร้อม susceptibility, eGFR 42",q:[
{p:"การเลือก definitive antibiotic ควรยึดอะไรเป็นหลัก?",o:["site/severity, susceptibility และ PK/PD","ราคาอย่างเดียว","ยาที่กว้างที่สุดเสมอ","สีของเชื้อ","หลีกเลี่ยง culture"],a:0,r:"definitive therapy ต้องใช้ susceptibility ร่วมกับ site/severity และ PK/PD"},
{p:"เมื่อผู้ป่วย stable และมี active oral option การจัดการใดเหมาะสม?",o:["พิจารณา IV-to-oral step-down","IV ตลอดชีวิต","หยุด antibiotic ทันที","เพิ่มยาซ้ำกลุ่มเดียวกัน","เปลี่ยนตามความชอบโดยไม่ดู susceptibility"],a:0,r:"oral step-down ทำได้ในผู้ป่วยที่เหมาะสมเมื่อมี active oral agent"},
{p:"เภสัชกรควรติดตามอะไรเป็นพิเศษ?",o:["clinical response, renal function และ adverse effects","น้ำหนักอย่างเดียว","HbA1c อย่างเดียว","ไม่ต้องติดตาม","lipid อย่างเดียว"],a:0,r:"infection response และ renal dosing/safety สำคัญ"},
{p:"หลัก antimicrobial stewardship ที่เหมาะสมคือ?",o:["de-escalate เมื่อข้อมูลเพียงพอ","ใช้ broadest spectrum นานที่สุด","เพิ่ม antibiotic แม้ตอบสนองดี","ไม่ใช้ culture","ต่อยาเพราะกลัว relapse โดยไม่ประเมิน"],a:0,r:"ใช้ narrowest effective regimen และ duration ที่เหมาะสม"}]},
{t:"CKD + hyperkalemia",s:"ชาย 68 ปี CKD G4 ใช้ ACE inhibitor และ spironolactone, K 6.3 mEq/L มี peaked T waves",q:[
{p:"priority แรกคือข้อใด?",o:["จัดการ hyperkalemia ฉุกเฉินและ cardiac membrane stabilization ตามข้อบ่งใช้","นัดอีก 3 เดือน","เพิ่ม potassium","ให้ NSAID","หยุดตรวจ ECG"],a:0,r:"hyperkalemia พร้อม ECG change เป็นภาวะฉุกเฉิน"},
{p:"medication review ควรเน้นอะไร?",o:["ยาที่เพิ่ม potassium และ renal function","statin อย่างเดียว","ยาหยอดตา","วิตามิน C","ไม่มีความจำเป็น"],a:0,r:"ต้องค้นยา/ผลิตภัณฑ์ที่เพิ่ม K และประเมิน kidney function"},
{p:"ผลิตภัณฑ์ OTC ใดควรถามเพิ่มเติม?",o:["salt substitute ที่มี potassium","น้ำเกลือล้างจมูก","ยาทาผิว","น้ำตาเทียม","แชมพู"],a:0,r:"potassium-containing salt substitute อาจเพิ่ม K"},
{p:"หลังพ้นภาวะฉุกเฉิน หลักการจัดการ RAAS inhibitor คือ?",o:["ประเมินข้อบ่งใช้และแก้ reversible causes ก่อนตัดสินใจระยะยาว","ห้ามใช้ตลอดชีวิตทุกกรณี","เพิ่มสองเท่าทันที","ไม่ติดตาม K","ใช้ร่วม potassium supplement เสมอ"],a:0,r:"KDIGO เน้น individualized management และแก้ปัจจัย hyperkalemia เมื่อเป็นไปได้"}]},
{t:"Rheumatoid arthritis + methotrexate",s:"หญิง 48 ปี RA ใช้ methotrexate weekly มี oral ulcers, pancytopenia และเพิ่งได้ TMP-SMX",q:[
{p:"ปัญหาที่ต้องสงสัยมากที่สุดคือ?",o:["methotrexate toxicity","RA หายแล้ว","iron overload","opioid withdrawal","hyperthyroidism"],a:0,r:"mucositis + cytopenia ในผู้ใช้ methotrexate ต้องสงสัย toxicity"},
{p:"การตรวจใดสำคัญ?",o:["CBC, renal function และ liver tests","lipid อย่างเดียว","troponin อย่างเดียว","TSH อย่างเดียว","ไม่ต้องตรวจ"],a:0,r:"methotrexate toxicity ต้องประเมิน marrow, renal และ hepatic status"},
{p:"interaction ใดสำคัญในเคสนี้?",o:["TMP-SMX อาจเพิ่ม marrow/folate-related toxicity","paracetamol 1 dose ทำให้ methotrexateหมดฤทธิ์","antacid ทำให้ RA หาย","saline เพิ่ม toxicity เสมอ","ไม่มี interaction"],a:0,r:"TMP-SMX ร่วม methotrexate เพิ่มความเสี่ยง toxicity"},
{p:"counseling ใดสำคัญมาก?",o:["ย้ำ weekly dosing และวันรับประทานให้ชัดเจน","รับประทาน methotrexate ทุกวัน","หยุด folate ทุกกรณี","เพิ่ม dose เมื่อปวด","ไม่ต้องแจ้งยาใหม่"],a:0,r:"daily-vs-weekly dosing error เป็นอันตรายสำคัญ"}]},
{t:"Cirrhosis + ascites",s:"ชาย 59 ปี decompensated cirrhosis มี ascites ใช้ spironolactone/furosemide และซื้อ diclofenac ใช้เอง",q:[
{p:"ยาที่ควรทบทวนเร่งด่วนคือ?",o:["diclofenac","lactulose ตามข้อบ่งใช้","ยาขับปัสสาวะทุกตัวต้องหยุดเสมอ","วัคซีน","ไม่มี"],a:0,r:"NSAID ใน cirrhosis/ascites เพิ่ม renal dysfunction และ fluid retention risk"},
{p:"การติดตาม diuretic therapy ควรรวมอะไร?",o:["น้ำหนัก, renal function, Na/K และอาการ","LDL อย่างเดียว","HbA1c อย่างเดียว","ไม่มี lab","ECG อย่างเดียว"],a:0,r:"ต้องติดตาม volume response, kidney function และ electrolytes"},
{p:"หากมี confusion ใหม่ ควรคิดถึงอะไร?",o:["hepatic encephalopathy และ precipitating factors","เพิ่ม NSAID","หยุดประเมิน infection","ถือว่าเป็น aging","เพิ่ม sedative"],a:0,r:"new confusion ใน cirrhosis ต้องประเมิน encephalopathy และ triggers"},
{p:"คำแนะนำใดเหมาะสม?",o:["หลีกเลี่ยง NSAID ใช้เองและมาตรวจเมื่อมี red flags","ดื่ม alcohol เพื่อเพิ่ม appetite","เพิ่มเกลือมากๆ","หยุดยาทั้งหมดเอง","ใช้สมุนไพรไม่จำกัด"],a:0,r:"OTC counseling และ red-flag education สำคัญ"}]}
];
const refs=[
"ADA Standards of Care in Diabetes 2026; KDIGO 2024 CKD Guideline",
"2025 ACC/AHA/ACEP/NAEMSP/SCAI Acute Coronary Syndromes Guideline",
"2024 ESC Atrial Fibrillation Guideline",
"GINA 2025 Global Strategy for Asthma Management and Prevention",
"IDSA 2026 Guidance on Antimicrobial-Resistant Gram-Negative Infections",
"KDIGO 2024 CKD Guideline",
"Current methotrexate safety/monitoring guidance; verify local RA protocol",
"AASLD guidance for outpatient management of cirrhosis with ascites"
];
const clues=[
"eGFR 46 และ UACR 620 mg/g เป็น key clues ว่าต้องคิด beyond HbA1c และเน้น cardiorenal protection",
"ผู้ป่วยเป็น ACS หลัง PCI จึงต้องชั่ง ischemic benefit กับ bleeding risk และวาง secondary prevention",
"AF ร่วมกับอายุสูง HTN DM และ prior TIA ทำให้ stroke prevention เป็นแกนสำคัญของการรักษา",
"การใช้ SABA บ่อยและมี nocturnal symptoms สะท้อน poor asthma control และต้องมี ICS-containing strategy",
"เป็น pyelonephritis ร่วม bacteremia จาก ESBL-E จึงต้องใช้ site/severity, susceptibility และ PK/PD ตัดสินใจ",
"K 6.3 mEq/L ร่วม peaked T waves คือ severe hyperkalemia ที่มี cardiac toxicity ไม่ใช่ lab abnormality ธรรมดา",
"oral ulcers + pancytopenia ในผู้ใช้ weekly methotrexate และมี TMP-SMX ใหม่ เป็น pattern ที่ต้องสงสัย toxicity",
"decompensated cirrhosis + ascites ร่วม NSAID use เพิ่มความเสี่ยง renal hypoperfusion, AKI และควบคุม ascites ยาก"
];
const monitoring=[
"ติดตาม eGFR, UACR, serum K, BP, volume status และ adverse effects ของยาที่เพิ่ม",
"ติดตาม bleeding, adherence, lipid response, recurrent ischemia และการเข้าร่วม cardiac rehabilitation",
"ติดตาม bleeding, renal function, adherence, drug interactions และ reassess stroke/rhythm/rate strategy",
"ติดตาม symptom control, exacerbations, reliever use, inhaler technique และ adherence",
"ติดตาม fever/hemodynamics, culture response, renal function, adverse effects และความเหมาะสมของ oral step-down",
"ติดตาม ECG, serum K ซ้ำ, renal function, acid-base/volume status และยาที่เพิ่ม potassium",
"ติดตาม CBC, renal function, liver tests, mucositis/infection และตรวจ medication errors/interactions",
"ติดตามน้ำหนัก, ascites/edema, renal function, Na/K, BP และอาการ hepatic encephalopathy"
];
function whyWrong(text:string,caseIndex:number){
 if(text.includes("ทุก")||text.includes("เสมอ")) return "เป็นคำตอบแบบเหมารวมเกินไปและไม่สอดคล้องกับการดูแลแบบ individualized; ต้องพิจารณาข้อบ่งใช้ ความเสี่ยง และข้อมูลผู้ป่วยรายนี้";
 if(text.includes("อย่างเดียว")) return "ใช้ข้อมูลเพียงมิติเดียว ไม่เพียงพอสำหรับ pharmaceutical care ซึ่งต้องประเมิน efficacy, safety, comorbidity, interaction และ monitoring ร่วมกัน";
 if(text.includes("ไม่ต้อง")||text.includes("งด")) return "ละเลยการติดตาม/มาตรการความปลอดภัยที่จำเป็นในบริบทของเคสนี้";
 if(text.includes("NSAID")) return "NSAID อาจเพิ่ม renal, bleeding, cardiovascular หรือ disease-specific risk ในผู้ป่วยกลุ่มนี้ จึงไม่ใช่ตัวเลือกที่เหมาะสมที่สุด";
 if(text.includes("หยุด")) return "การหยุดยาโดยอัตโนมัติโดยไม่ประเมิน severity, indication และ reversible factors อาจทำให้สูญเสียประโยชน์ของการรักษา";
 return "แม้ดูเป็นทางเลือกที่เป็นไปได้บางบริบท แต่ไม่ตอบ key clinical problem ของผู้ป่วยรายนี้ได้ดีที่สุดเมื่อเทียบกับคำตอบที่ถูก";
}
const answerPositions=[2,0,4,1,3,1,3,0,4,2,4,2,1,3,0,0,4,2,1,3,3,1,4,0,2,2,4,0,3,1,1,3];
const altDistractors=[
["GLP-1 receptor agonist ที่มี CV benefit","Finerenone เมื่อ potassium และข้อบ่งใช้เหมาะสม","เพิ่ม metformin โดยไม่เปลี่ยนยาอื่น","DPP-4 inhibitor"],
["ติดตามซ้ำใน 1–2 สัปดาห์และประเมิน volume status","ลด ACEI ครึ่งหนึ่งทันทีแม้ไม่มี hypotension","เปลี่ยน ACEI เป็น ARB เพื่อป้องกัน creatinine rise","หยุด RAAS blockade ถาวร"],
["หยุดเฉพาะเช้าวันผ่าตัด","ให้ต่อจน NPO แล้วหยุดหลังผ่าตัด","เปลี่ยนเป็น DPP-4 inhibitor 1 วันก่อนผ่าตัด","เพิ่ม carbohydrate intake โดยไม่หยุดยา"],
["ติดตาม HbA1c และ fasting glucose เท่านั้น","ติดตาม eGFR และ potassium แต่ไม่ต้อง UACR","ติดตาม UACR ปีละครั้งโดยไม่ดู BP","ติดตามเฉพาะ adverse effects ของ SGLT2 inhibitor"],
["Aspirin monotherapy","Clopidogrel monotherapy","Oral anticoagulant + aspirin","Triple antithrombotic therapy"],
["H2-receptor antagonist","Sucralfate","เพิ่ม aspirin dose แล้วให้ antacid","เปลี่ยน P2Y12 inhibitor เป็น aspirin เดี่ยว"],
["เปลี่ยนเป็น celecoxib PRN โดยไม่ประเมิน cardiovascular risk เพิ่มเติม","ใช้ diclofenac topical สำหรับข้อเข่า พร้อมประเมินความเหมาะสมและติดตามอาการ","ใช้ acetaminophen ในขนาดที่เหมาะสมเป็นทางเลือกหนึ่ง พร้อมประเมินความรุนแรง/สาเหตุของอาการปวด","ใช้ naproxen ร่วม PPI เพื่อป้องกัน GI bleeding"],
["ตรวจ lipid ที่ 4–8 สัปดาห์หลังปรับยา","รอ 1 ปีค่อยตรวจ lipid","ใช้ LDL baseline อย่างเดียว","ตรวจ CK routine ทุก visit แม้ไม่มีอาการ"],
["Aspirin เพราะ prior TIA","Clopidogrel monotherapy","DOAC/warfarin ตาม stroke-risk assessment","No antithrombotic หาก sinus rhythm วันนี้"],
["ใช้ eGFR อย่างเดียวเลือก OAC","ใช้ bleeding score เป็นเหตุห้าม OAC โดยอัตโนมัติ","ประเมิน renal function, interactions และ adherence ร่วมกัน","เลือก aspirin ถ้าอายุ >75"],
["เปลี่ยน NSAID เป็น COX-2 inhibitor แล้วใช้ต่อ","เพิ่ม PPI แล้วไม่ต้องทบทวน NSAID","หลีกเลี่ยง NSAID หากเป็นไปได้และหาทางเลือก analgesia","ลด OAC dose เองเพื่อให้ใช้ NSAID"],
["หยุด OAC เมื่อไม่มี AF symptom","ประเมิน comorbidity/stroke prevention/symptoms ซ้ำเป็นระยะ","ใช้ rhythm control แทน stroke prevention","ใช้ aspirin หลัง cardioversion ทุกคน"],
["SABA PRN อย่างเดียว","Low-dose ICS-formoterol ตาม Track 1","LABA monotherapy","Daily oral corticosteroid"],
["SABA","ICS-formoterol","Ipratropium","Oral theophylline"],
["เพิ่ม ICS dose ทันที","ตรวจ adherence/technique/trigger ก่อน step-up","เพิ่ม LABA โดยไม่ใช้ ICS","ให้ prednisolone maintenance"],
["Peak-flow diary อย่างเดียว","Written action plan + inhaler education","หลีกเลี่ยง exercise ทั้งหมด","ใช้ antibiotic rescue pack ทุกครั้ง"],
["Piperacillin-tazobactam โดยไม่ดู susceptibility","Carbapenem ที่ active ตาม severity/site","Nitrofurantoin สำหรับ bacteremia","Oral fosfomycin สำหรับ bacteremia"],
["ต่อ IV therapy จนครบ course ทุกกรณี","พิจารณา oral step-down เมื่อ stable และมี active oral agent","หยุดทันทีเมื่อ afebrile 24 ชม.","เปลี่ยนเป็น oral agent ที่ไม่ susceptible"],
["ติดตาม creatinine อย่างเดียว","ติดตาม clinical response + renal function + adverse effects","ติดตาม CRP อย่างเดียว","repeat culture ทุกวันทุกคน"],
["คง broad spectrum จนครบแม้ culture ชัด","de-escalate ตาม susceptibility/response","เพิ่ม second agent เพื่อป้องกัน resistance","ยืด duration ทุกคน"],
["IV calcium เมื่อมี ECG change","Insulin/glucose อย่างเดียวโดยไม่ stabilize myocardium","Loop diuretic อย่างเดียว","Sodium bicarbonate ทุกคน"],
["หยุด ACEI/MRA ถาวรทันที","ทบทวน RAASi/MRA, K intake, supplements และ renal function","เพิ่ม potassium binder โดยไม่หาสาเหตุ","ลด dietary sodium อย่างเดียว"],
["Potassium-containing salt substitute","Calcium carbonate","Psyllium","Topical diclofenac"],
["หยุด RAASi ถาวรทุกคน","แก้ reversible causes และประเมิน cardiorenal benefit ก่อนตัดสินใจ","เพิ่ม MRA ทันที","ให้ potassium supplement"],
["Methotrexate toxicity","RA flare","Felty syndrome โดยไม่ประเมินยา","Iron deficiency anemia"],
["CBC + creatinine/eGFR + liver tests","ESR/CRP อย่างเดียว","ANA/RF ซ้ำ","Lipid profile"],
["Amoxicillin","TMP-SMX","Azithromycin","Doxycycline"],
["ย้ำ weekly dosing + folate plan + interaction check","แบ่ง methotrexate เป็น daily dose","หยุด folate","เพิ่ม dose เมื่อ joint pain"],
["Diclofenac","Spironolactone","Lactulose","Carvedilol"],
["น้ำหนัก + renal function + Na/K + BP","abdominal girth อย่างเดียว","LFT อย่างเดียว","serum ammonia routine อย่างเดียว"],
["Hepatic encephalopathy และค้น precipitant","progression of dementia","opioid withdrawal","isolated hyponatremia โดยไม่ประเมินอื่น"],
["หลีกเลี่ยง NSAID และรู้ red flags","จำกัดน้ำทุกคนแม้ Na ปกติ","เพิ่ม sodium เพื่อป้องกัน AKI","ใช้สมุนไพรแทนยา"]
];
function wrongReason(text:string,ci:number,qi:number){
 const t=text.toLowerCase();
 if(t.includes("monotherapy")||t.includes("อย่างเดียว")) return "ตัวเลือกนี้แก้เพียงส่วนหนึ่งของปัญหา แต่ไม่ครอบคลุมเป้าหมายหลักและความเสี่ยงของผู้ป่วยรายนี้ จึงด้อยกว่าคำตอบที่ถูก";
 if(t.includes("ทันที")||t.includes("ถาวร")||t.includes("ทุกคน")||t.includes("ทุกกรณี")) return "เป็นการตัดสินใจแบบ absolute โดยไม่ใช้ข้อมูลผู้ป่วยเพื่อ stratify risk/benefit จึงไม่ใช่ single best answer";
 if(t.includes("nsaid")||t.includes("naproxen")||t.includes("diclofenac")) return "ต้องระวัง renal, bleeding และ cardiovascular toxicity; ในบริบทนี้มีทางเลือกที่ตอบเป้าหมายและปลอดภัยกว่า";
 return `เป็น distractor ที่มีเหตุผลได้ในบางสถานการณ์ แต่ไม่เหมาะที่สุดใน Case ${ci+1}: ต้องเทียบ indication, outcome benefit, organ function, interaction และ monitoring กับคำตอบที่ถูก`;
}
export const PC1_PILOT_032:McqQuestion[]=C.flatMap((c,ci)=>c.q.map((q,qi)=>{
 const qn=ci*4+qi;
 const correctText=q.o[q.a];
 const distractors=altDistractors[qn];
 const pos=answerPositions[qn];
 const arranged=[...distractors]; arranged.splice(pos,0,correctText);
 const labels=["A","B","C","D","E"];
 const answer=labels[pos];
 return {
 id:`pc1pilot${String(qn+1).padStart(3,"0")}`,subject_id:"pc1",exam_type:"PLE-PC",exam_source:"PharmRU PC1 Pilot 032",exam_day:null,question_number:qn+1,
 scenario:`Case ${ci+1}/8 — ${c.t}\n${c.s}\n\nคำถาม ${qi+1}/4: ${q.p}`,image_url:null,
 choices:arranged.map((text,i)=>({label:labels[i],text})),correct_answer:answer,
 explanation:`วิเคราะห์โจทย์:\n${clues[ci]}\n\nClinical reasoning:\n${q.r} ประเด็นสำคัญคือไม่ได้เลือกยาหรือการจัดการจาก diagnosis เพียงอย่างเดียว แต่ต้องนำข้อมูลผู้ป่วยรายนี้มาชั่งประโยชน์และความเสี่ยง รวมถึงโรคร่วม การทำงานของไต/ตับ ยาร่วม และเป้าหมายการรักษา\n\nการนำไปใช้จริง:\nหากเลือกแนวทางนี้ ต้องประเมิน baseline ที่เกี่ยวข้องและติดตาม response หลังเริ่มหรือปรับการรักษา ไม่ควรตีความผลตรวจเพียงค่าเดียวโดยไม่ดูอาการและแนวโน้ม\n\nMonitoring / Follow-up:\n${monitoring[ci]}\n\nReference สำหรับตรวจเฉลย:\n${refs[ci]}`,
 detailed_explanation:{
  summary:`เฉลย ${answer}: ${correctText}`,
  reason:`【1. จับ Key clue】\n${clues[ci]}\n\n【2. Clinical reasoning】\n${q.r} ข้อนี้วัดการเชื่อมข้อมูลผู้ป่วยกับเป้าหมายการรักษา ไม่ใช่การจำชื่อยาอย่างเดียว ต้องพิจารณาทั้ง efficacy + safety + comorbidity + concomitant medications ก่อนเลือก single best answer\n\n【3. สิ่งที่ต้องทำต่อในเวชปฏิบัติ】\n${monitoring[ci]}\n\n【4. จุดที่มักพลาดในข้อสอบ】\nอย่าเลือกคำตอบเพราะเป็นสิ่งที่ “ทำได้” ให้เลือกสิ่งที่แก้ปัญหาสำคัญที่สุดของผู้ป่วย ณ เวลานั้น และระวังตัวเลือกที่ใช้คำว่า ทุกคน/เสมอ/ทันที โดยไม่มีเงื่อนไข\n\n【5. Reference】\n${refs[ci]}`,
  choices:arranged.map((text,i)=>({label:labels[i],text,is_correct:i===pos,explanation:i===pos?`ถูก — ${q.r} โดยข้อมูลสำคัญคือ ${clues[ci]}`:wrongReason(text,ci,qi)})),
  key_takeaway:`Exam Pearl: ${q.r}\nKey clue ที่ควรจำ: ${clues[ci]}\nติดตาม: ${monitoring[ci]}`
 },
 difficulty:qi<2?"medium":"hard",is_ai_enhanced:true,
 ai_notes:`PharmRU original PC1 pilot. Reference review: ${refs[ci]}. Clinical/editorial review recommended before commercial publication.`,
 status:"active",created_at:"2026-09-22 12:00:00",
 mcq_subjects:{id:"pc1",name:"PC1",name_th:"บริบาลเภสัชกรรม PC1",icon:"🩺",exam_type:"PLE-PC",question_count:32,created_at:"2026-09-22 12:00:00"}
 };
}));
