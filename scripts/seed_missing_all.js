const { Client } = require("pg");
const { randomUUID } = require("crypto");

const SUPABASE_URL = "postgresql://postgres.xdafacvqfqkicaxfhwom:juxsu1-xawqEv-cysvug@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres";

// Subject IDs
const S = {
  endocrine: "3c30613d-83c7-4be5-b3e3-ee9240e7552a",
  gi: "91eedbf3-4301-4f40-ae3d-3cc6f64c4f8a",
  derm: "12b0b8c1-fe53-49d8-9c4b-e348eba85e36",
  heme: "ace9965c-285b-4d4a-aaf2-5de9739cc09a",
  immuno: "ccb73060-b09f-4927-8ff8-53190db76d18",
  infect: "8bccedb2-3bdb-4f5c-9da9-f589b25672fd",
  neuro: "fb62e97d-dec1-4b47-b45f-617b2c03fb4d",
  psych: "beee26b1-72c2-4c70-be73-24d7fa036f19",
  renal: "557c6214-3039-4e1b-aeaf-99f55950de66",
  law: "83beabf8-abdd-4aef-a849-b0fec3d733b8",
  pk: "fe430fdf-f81b-4719-9ea9-cb7d514f47dc",
  pharmacognosy: "aad2199b-21dd-4ae6-ad09-41ac323a134f",
  biopharma: "2c02a7e8-0ee7-4c3f-afd4-5afb184043e4",
  adr: "49695e05-f84c-419b-8442-af9bbdeceb25",
  calc: "c7d84b07-f67b-40da-831d-bdc2caf07e63",
  publichealth: "64e001fd-e861-4986-bf5f-259bc363d577",
  pharmcare: "2b863220-f6d6-49d6-a426-8fff222869a1",
  dispensing: "ca25e948-542b-4e18-b3c3-ec9a4ca10b64",
  insurance: "4bc91ff4-b1c8-4d40-bdc7-d4541bec5d1f",
  pharmatech: "0a7f8e61-3786-494c-9c54-b6edc17b03b6",
};

function q(subjectId, scenario, choices, correct, explanation, detailed, difficulty = "medium") {
  return {
    subject_id: subjectId,
    scenario,
    choices: JSON.stringify(choices),
    correct_answer: correct,
    explanation,
    detailed_explanation: JSON.stringify(detailed),
    difficulty,
  };
}

const allQuestions = [
  // ==========================================
  // 1. MISSING SUB-TOPICS IN EXISTING GROUPS
  // ==========================================

  // --- Endocrine: Obesity ---
  q(S.endocrine, "ผู้ป่วยหญิงอายุ 38 ปี BMI 35 kg/m² มี DM type 2 ต้องการลดน้ำหนัก ยาที่ช่วยลดน้ำหนักได้ดีที่สุดและมี cardiovascular benefit คือ", ["Orlistat", "Semaglutide (GLP-1 RA)", "Phentermine", "Metformin"], "B",
    "Semaglutide (Wegovy) เป็น GLP-1 RA ที่ได้รับอนุมัติสำหรับ weight management ลดน้ำหนักได้ 12-15% และมี CV benefit",
    { A: "ผิด — Orlistat ลดได้ 3-5% ยับยั้ง lipase ผลข้างเคียง GI (steatorrhea)", B: "ถูก — Semaglutide 2.4 mg SC weekly (Wegovy) ลดน้ำหนัก 12-15% มี CV benefit จาก SELECT trial", C: "ผิด — Phentermine ใช้ระยะสั้น < 12 สัปดาห์ มี sympathomimetic effects", D: "ผิด — Metformin ลดน้ำหนักเล็กน้อย 1-3% ไม่ใช่ยาลดน้ำหนักโดยตรง" }),
  q(S.endocrine, "ผู้ป่วยชาย BMI 42 ยาลดน้ำหนัก Orlistat ออกฤทธิ์อย่างไร", ["ยับยั้ง pancreatic lipase ลดการดูดซึมไขมัน", "กระตุ้น GLP-1 receptor ลดความอยากอาหาร", "ยับยั้ง norepinephrine reuptake", "กระตุ้น serotonin receptor"], "A",
    "Orlistat ยับยั้ง pancreatic/gastric lipase ลดการดูดซึมไขมันจากอาหาร ~30%",
    { A: "ถูก — Orlistat inhibit GI lipase → ลดการดูดซึมไขมัน 30% → ผลข้างเคียง oily stool, steatorrhea", B: "ผิด — นั่นคือกลไกของ Semaglutide/Liraglutide", C: "ผิด — นั่นคือ Phentermine (sympathomimetic)", D: "ผิด — นั่นคือ Lorcaserin (ถูกถอนออกจากตลาดแล้ว)" }),

  // --- GI: Stress ulcer, Hepatitis B, Hemorrhoid ---
  q(S.gi, "ผู้ป่วยชายอายุ 55 ปี ใส่ท่อช่วยหายใจใน ICU มี coagulopathy ควรให้ stress ulcer prophylaxis ด้วยยาใด", ["Sucralfate", "IV Pantoprazole", "Misoprostol", "Antacid"], "B",
    "ICU patient มี risk factor ≥1 (mechanical ventilation > 48 hrs, coagulopathy): PPI IV เป็น first-line stress ulcer prophylaxis",
    { A: "ผิด — Sucralfate ใช้ได้แต่ด้อยกว่า PPI ใน high-risk ICU", B: "ถูก — IV PPI (Pantoprazole 40 mg OD) เป็น first-line SUP ใน high-risk ICU patients", C: "ผิด — Misoprostol ไม่ใช้ใน ICU stress ulcer prophylaxis", D: "ผิด — Antacid ต้องให้บ่อย ไม่สะดวกใน ICU" }),
  q(S.gi, "ผู้ป่วยหญิงอายุ 35 ปี ตรวจพบ Chronic Hepatitis B (HBsAg+, HBeAg+, HBV DNA สูง, ALT สูง) ยา antiviral first-line คือ", ["Lamivudine", "Entecavir หรือ Tenofovir", "Ribavirin", "Acyclovir"], "B",
    "Chronic HBV ที่ต้องรักษา: Entecavir หรือ Tenofovir เป็น first-line เพราะ potent และ high barrier to resistance",
    { A: "ผิด — Lamivudine resistance rate สูง (~70% ที่ 5 ปี) ไม่แนะนำเป็น first-line", B: "ถูก — Entecavir 0.5 mg OD หรือ Tenofovir (TDF 300 mg/TAF 25 mg) OD เป็น first-line ตาม AASLD/EASL guideline", C: "ผิด — Ribavirin ใช้ใน Hepatitis C ไม่ใช่ HBV", D: "ผิด — Acyclovir ใช้ใน Herpes ไม่มีฤทธิ์ต่อ HBV" }),
  q(S.gi, "ผู้ป่วยหญิงอายุ 45 ปี มี hemorrhoid grade 2 มีเลือดออกเวลาถ่าย ยาทา first-line ที่ช่วยบรรเทาอาการคือ", ["Topical nitroglycerin", "Topical hydrocortisone + lidocaine", "Oral antibiotics", "Topical antifungal"], "B",
    "Hemorrhoid grade 1-2: conservative treatment ยาทา steroid + local anesthetic ลดบวม ลดปวด",
    { A: "ผิด — Topical nitroglycerin ใช้ใน anal fissure ไม่ใช่ hemorrhoid", B: "ถูก — Topical corticosteroid (Hydrocortisone) + local anesthetic (Lidocaine) ลด inflammation/pain + fiber supplement + sitz bath", C: "ผิด — Antibiotics ไม่จำเป็นใน uncomplicated hemorrhoid", D: "ผิด — Antifungal ไม่เกี่ยวข้อง" }),

  // --- Derm: Wound, Seborrheic dermatitis ---
  q(S.derm, "ผู้ป่วยชายอายุ 60 ปี เบาหวาน มีแผลที่เท้า (diabetic foot ulcer) เริ่มมีสัญญาณการติดเชื้อ สิ่งแรกที่ควรทำคือ", ["ให้ IV vancomycin ทันที", "ทำ wound culture แล้วเริ่ม empiric antibiotics ที่ครอบคลุม gram+/gram-", "ใช้ povidone-iodine ล้างแผลอย่างเดียว", "ให้ oral metronidazole"], "B",
    "Diabetic foot infection: wound culture ก่อน แล้วเริ่ม empiric broad-spectrum antibiotics",
    { A: "ผิด — Vancomycin เดี่ยวครอบคลุมแค่ gram+ ไม่ครอบคลุม gram- ที่พบบ่อยในแผลเบาหวาน", B: "ถูก — Wound culture + empiric antibiotics (Amoxicillin-clavulanate หรือ Piperacillin-tazobactam ตาม severity) ตาม IDSA guideline", C: "ผิด — Antiseptic อย่างเดียวไม่เพียงพอเมื่อมี clinical infection", D: "ผิด — Metronidazole ครอบคลุมเฉพาะ anaerobes ไม่ครอบคลุมเชื้อหลัก" }),
  q(S.derm, "ผู้ป่วยชายอายุ 30 ปี มีขุยที่หนังศีรษะ คัน ผื่นแดงมีสะเก็ดมัน (Seborrheic dermatitis) ยาทาที่เหมาะสมคือ", ["Topical terbinafine", "Ketoconazole shampoo 2%", "Topical mupirocin", "Oral griseofulvin"], "B",
    "Seborrheic dermatitis สัมพันธ์กับ Malassezia yeast → antifungal shampoo (Ketoconazole) เป็น first-line",
    { A: "ผิด — Terbinafine ไม่ค่อย effective ต่อ Malassezia", B: "ถูก — Ketoconazole shampoo 2% ใช้ 2-3 ครั้ง/สัปดาห์ เป็น first-line + low-potency topical steroid ช่วงอักเสบ", C: "ผิด — Mupirocin ใช้ bacterial infection ไม่ใช่ seborrheic dermatitis", D: "ผิด — Griseofulvin ใช้ dermatophyte ไม่ใช่ Malassezia" }),

  // --- Hematologic: G6PD, Thalassemia ---
  q(S.heme, "ผู้ป่วยชายอายุ 25 ปี มี G6PD deficiency ยาใดที่ห้ามใช้เด็ดขาดเพราะทำให้เม็ดเลือดแดงแตก", ["Paracetamol", "Primaquine", "Amoxicillin", "Omeprazole"], "B",
    "Primaquine (antimalarial) เป็นยาที่ทำให้ hemolytic crisis ใน G6PD deficiency ได้รุนแรง",
    { A: "ผิด — Paracetamol ปลอดภัยใน G6PD deficiency", B: "ถูก — Primaquine, Dapsone, Methylene blue, Nitrofurantoin, Sulfonamides เป็นยาที่ต้องหลีกเลี่ยงใน G6PD deficiency", C: "ผิด — Amoxicillin ปลอดภัย", D: "ผิด — Omeprazole ปลอดภัย" }),
  q(S.heme, "ผู้ป่วย Beta-thalassemia major ได้รับ blood transfusion สม่ำเสมอ ภาวะแทรกซ้อนที่สำคัญที่สุดจาก chronic transfusion คือ", ["Hyperkalemia", "Iron overload (hemochromatosis)", "Vitamin B12 deficiency", "Thrombocytosis"], "B",
    "Chronic transfusion → iron overload → organ damage (heart, liver, endocrine) ต้องให้ iron chelation therapy",
    { A: "ผิด — Hyperkalemia เกิดจาก stored blood แต่ไม่ใช่ปัญหาหลักระยะยาว", B: "ถูก — Iron overload: แต่ละ unit PRBCs มี iron ~200 mg → สะสมที่หัวใจ ตับ ต่อมไร้ท่อ ต้องให้ Deferasirox/Deferoxamine", C: "ผิด — B12 deficiency ไม่เกี่ยว", D: "ผิด — Thrombocytosis ไม่ใช่ภาวะแทรกซ้อนหลัก" }),

  // --- Immunologic: Allergic rhinitis, Vaccination ---
  q(S.immuno, "ผู้ป่วยหญิงอายุ 28 ปี Allergic rhinitis ตลอดปี มีอาการจามน้ำมูกใส คัดจมูก ยาที่เป็น first-line คือ", ["Oral decongestant (Pseudoephedrine)", "Intranasal corticosteroid (Fluticasone)", "Oral 1st gen antihistamine (Chlorpheniramine)", "Intranasal ipratropium"], "B",
    "Intranasal corticosteroid เป็น most effective treatment สำหรับ allergic rhinitis ทุก guideline",
    { A: "ผิด — Oral decongestant ใช้ระยะสั้น < 3-5 วัน rebound congestion", B: "ถูก — Intranasal corticosteroid (Fluticasone, Mometasone) เป็น first-line สำหรับ moderate-severe allergic rhinitis ตาม ARIA guideline", C: "ผิด — 1st gen antihistamine ง่วงมาก ไม่ใช่ first-line", D: "ผิด — Ipratropium ใช้เฉพาะ rhinorrhea ไม่ลด sneezing/itching" }),
  q(S.immuno, "เด็กอายุ 2 เดือน ตามตาราง EPI ของไทย ควรได้รับวัคซีนใดบ้าง", ["BCG + HBV#1", "DTP-HB-Hib#1 + OPV#1", "MMR", "BCG + DTP#1"], "B",
    "EPI Thailand: อายุ 2 เดือน ได้ DTP-HB-Hib#1 + OPV#1 (BCG + HBV#1 ให้ตอนแรกเกิด)",
    { A: "ผิด — BCG + HBV#1 ให้ตอนแรกเกิด", B: "ถูก — 2 เดือน: DTP-HB-Hib dose 1 + OPV dose 1 ตาม EPI Thailand", C: "ผิด — MMR ให้อายุ 9-12 เดือน", D: "ผิด — BCG ให้แรกเกิด ไม่ใช่ 2 เดือน" }),

  // --- Infectious: Parasitic, STDs ---
  q(S.infect, "ผู้ป่วยเด็กอายุ 5 ปี ตรวจอุจจาระพบไข่พยาธิปากขอ (hookworm) ยาที่เหมาะสมคือ", ["Praziquantel", "Albendazole 400 mg single dose", "Ivermectin", "Metronidazole"], "B",
    "Hookworm (Ancylostoma/Necator): Albendazole 400 mg single dose หรือ Mebendazole 500 mg single dose",
    { A: "ผิด — Praziquantel ใช้กับ flukes (trematodes) และ tapeworms (cestodes)", B: "ถูก — Albendazole 400 mg single dose เป็น first-line สำหรับ hookworm, roundworm, whipworm (soil-transmitted helminths)", C: "ผิด — Ivermectin ใช้กับ Strongyloides, scabies, lice", D: "ผิด — Metronidazole ใช้กับ protozoa (Giardia, Entamoeba) ไม่ใช่ helminth" }),
  q(S.infect, "ผู้ป่วยหญิงอายุ 22 ปี ตกขาวผิดปกติ มีกลิ่นคาว pH > 4.5 Clue cells positive วินิจฉัย Bacterial Vaginosis ยา first-line คือ", ["Fluconazole oral", "Metronidazole oral 500 mg BID × 7 วัน", "Clotrimazole vaginal", "Azithromycin"], "B",
    "BV: Metronidazole oral หรือ vaginal gel เป็น first-line ตาม CDC STI guideline",
    { A: "ผิด — Fluconazole ใช้ Vulvovaginal candidiasis ไม่ใช่ BV", B: "ถูก — Metronidazole 500 mg oral BID × 7 วัน หรือ Metronidazole gel 0.75% intravaginal × 5 วัน", C: "ผิด — Clotrimazole ใช้กับ Candida", D: "ผิด — Azithromycin ใช้กับ Chlamydia ไม่ใช่ BV" }),
  q(S.infect, "ผู้ป่วยเด็กอายุ 8 ปี คันศีรษะ ตรวจพบเหา (Pediculosis capitis) ยาทาที่เหมาะสม first-line คือ", ["Ketoconazole shampoo", "Permethrin 1% lotion", "Lindane 1%", "Oral ivermectin"], "B",
    "Head lice: Permethrin 1% เป็น first-line topical pediculicide ปลอดภัยในเด็ก",
    { A: "ผิด — Ketoconazole ใช้กับเชื้อรา ไม่มีฤทธิ์ฆ่าเหา", B: "ถูก — Permethrin 1% lotion/cream rinse ทาทิ้งไว้ 10 นาทีแล้วล้างออก ทำซ้ำ 7-10 วัน", C: "ผิด — Lindane มี neurotoxicity ไม่แนะนำ first-line โดยเฉพาะเด็ก", D: "ผิด — Oral ivermectin ใช้เป็น second-line หรือ treatment failure" }),

  // --- Neurologic: Dementia, Pain management ---
  q(S.neuro, "ผู้ป่วยหญิงอายุ 75 ปี วินิจฉัย Alzheimer's disease ระยะ mild-moderate ยาที่เพิ่ม acetylcholine ใน CNS คือ", ["Memantine", "Donepezil", "Levodopa", "Haloperidol"], "B",
    "Mild-moderate Alzheimer's: Cholinesterase inhibitors (Donepezil, Rivastigmine, Galantamine) เป็น first-line",
    { A: "ผิด — Memantine (NMDA antagonist) ใช้ใน moderate-severe Alzheimer's", B: "ถูก — Donepezil 5-10 mg OD เป็น cholinesterase inhibitor first-line สำหรับ mild-moderate AD", C: "ผิด — Levodopa ใช้ Parkinson's disease", D: "ผิด — Haloperidol ใช้จัดการ behavioral symptoms ไม่ใช่ cognitive" }),
  q(S.neuro, "ผู้ป่วยชายอายุ 50 ปี มีอาการปวดเรื้อรัง (chronic noncancer pain) จาก low back pain ยาใดไม่ควรใช้เป็น first-line", ["Paracetamol scheduled dosing", "NSAIDs ระยะสั้น", "Oxycodone ระยะยาว", "Duloxetine"], "C",
    "Chronic noncancer pain: opioid ระยะยาวไม่ใช่ first-line เพราะ risk of dependence, tolerance, opioid-induced hyperalgesia",
    { A: "ผิด — Paracetamol เป็น first-line analgesic", B: "ผิด — NSAIDs ระยะสั้นเป็น first-line", C: "ถูก — Long-term opioid ไม่แนะนำเป็น first-line สำหรับ chronic noncancer pain (CDC 2022 guideline)", D: "ผิด — Duloxetine (SNRI) เป็น option สำหรับ chronic pain โดยเฉพาะ neuropathic" }),

  // --- Psychiatric: Drug abuse, Tobacco, Insomnia ---
  q(S.psych, "ผู้ป่วยชายอายุ 35 ปี ติดสุรา (Alcohol Use Disorder) ต้องการเลิกดื่ม ยาที่ช่วยลดความอยากดื่มและลด relapse คือ", ["Disulfiram", "Naltrexone", "Lorazepam", "Fluoxetine"], "B",
    "Naltrexone (opioid antagonist) ลด craving และ relapse rate ใน AUD ได้ดี",
    { A: "ผิด — Disulfiram ใช้ aversion therapy (ทำให้ดื่มแล้วไม่สบาย) ไม่ลด craving โดยตรง", B: "ถูก — Naltrexone 50 mg OD oral หรือ 380 mg IM monthly ลด craving, heavy drinking days, relapse", C: "ผิด — Lorazepam ใช้ alcohol withdrawal syndrome ไม่ใช่ maintenance", D: "ผิด — Fluoxetine ไม่มี indication สำหรับ AUD" }),
  q(S.psych, "ผู้ป่วยชายอายุ 40 ปี สูบบุหรี่ 20 มวน/วัน ต้องการเลิก ยาที่มีประสิทธิภาพสูงสุดสำหรับ smoking cessation คือ", ["Nicotine patch เดี่ยว", "Bupropion SR เดี่ยว", "Varenicline", "Nortriptyline"], "C",
    "Varenicline เป็น partial agonist ที่ nicotinic α4β2 receptor มี efficacy สูงสุดสำหรับ smoking cessation",
    { A: "ผิด — NRT (Nicotine patch) ช่วยได้แต่ efficacy ต่ำกว่า Varenicline", B: "ผิด — Bupropion ช่วยได้ efficacy ใกล้เคียง NRT", C: "ถูก — Varenicline: partial agonist α4β2 → ลด craving + ลด reward จากการสูบ; highest quit rate (~25-30% at 1 year)", D: "ผิด — Nortriptyline เป็น second-line off-label" }),
  q(S.psych, "ผู้ป่วยหญิงอายุ 55 ปี Insomnia เรื้อรัง ไม่ตอบสนองต่อ sleep hygiene ยาที่เหมาะสมสำหรับ short-term use คือ", ["Diazepam 10 mg ก่อนนอนทุกวัน", "Zolpidem 5 mg ก่อนนอน (ระยะสั้น < 4 สัปดาห์)", "Diphenhydramine 50 mg ทุกคืน", "Quetiapine 100 mg ก่อนนอน"], "B",
    "Zolpidem (non-benzodiazepine hypnotic) เป็น first-line สำหรับ short-term insomnia treatment",
    { A: "ผิด — Diazepam long-acting BZD ไม่เหมาะสำหรับ insomnia (hangover effect, dependence)", B: "ถูก — Zolpidem 5 mg (หญิง) หรือ 5-10 mg (ชาย) ก่อนนอน ระยะสั้น < 4 สัปดาห์ เป็น first-line", C: "ผิด — Diphenhydramine tolerance เร็ว anticholinergic effects ไม่แนะนำระยะยาว", D: "ผิด — Quetiapine ไม่ได้ approved สำหรับ insomnia มี metabolic side effects" }),

  // ==========================================
  // 2. NEW SUBJECTS
  // ==========================================

  // --- Renal (15 questions) ---
  q(S.renal, "ผู้ป่วยหญิงอายุ 22 ปี มีอาการปัสสาวะแสบขัด ปัสสาวะบ่อย UA: WBC สูง Nitrite positive วินิจฉัย Uncomplicated cystitis ยา first-line คือ", ["Ciprofloxacin", "Nitrofurantoin 100 mg BID × 5 วัน", "Amoxicillin", "Ceftriaxone IM"], "B",
    "Uncomplicated cystitis ในหญิง: Nitrofurantoin เป็น first-line ตาม IDSA guideline",
    { A: "ผิด — Fluoroquinolone สำรองสำหรับ complicated UTI เท่านั้น", B: "ถูก — Nitrofurantoin 100 mg BID × 5 วัน หรือ TMP-SMX DS BID × 3 วัน เป็น first-line", C: "ผิด — Amoxicillin resistance สูงต่อ E. coli", D: "ผิด — Ceftriaxone IM ใช้ pyelonephritis ไม่ใช่ uncomplicated cystitis" }),
  q(S.renal, "ผู้ป่วยชายอายุ 65 ปี CKD stage 4 (eGFR 20) มี hyperkalemia (K+ 6.2 mEq/L) ยาใดที่ต้องหยุดหรือลดขนาดก่อน", ["Amlodipine", "Furosemide", "Ramipril (ACEi)", "Metformin"], "C",
    "ACEi/ARB เพิ่ม potassium โดยลด aldosterone → ต้องหยุดหรือลดขนาดเมื่อ hyperkalemia",
    { A: "ผิด — Amlodipine ไม่ส่งผลต่อ potassium", B: "ผิด — Furosemide ลด potassium ช่วย hyperkalemia", C: "ถูก — ACEi/ARB ลด aldosterone → potassium retention → ต้อง hold/reduce ใน hyperkalemia", D: "ผิด — Metformin ต้องหยุดใน eGFR < 30 แต่ไม่ทำให้ hyperkalemia" }),
  q(S.renal, "ผู้ป่วย CKD stage 5 (eGFR 8) มี metabolic acidosis (HCO3- 14 mEq/L) ยาที่ใช้แก้ acidosis คือ", ["Calcium carbonate", "Sodium bicarbonate oral", "Kayexalate", "Furosemide"], "B",
    "CKD metabolic acidosis: Sodium bicarbonate oral เพื่อ maintain HCO3- ≥ 22 mEq/L",
    { A: "ผิด — Calcium carbonate เป็น phosphate binder ไม่แก้ acidosis", B: "ถูก — NaHCO3 oral 650-1300 mg BID-TID เป้าหมาย HCO3- ≥ 22 mEq/L (KDIGO)", C: "ผิด — Kayexalate (SPS) ใช้ลด potassium", D: "ผิด — Furosemide ไม่แก้ metabolic acidosis โดยตรง" }),
  q(S.renal, "ผู้ป่วย CKD stage 3 มี hyperphosphatemia (PO4 5.8 mg/dL) ยา phosphate binder first-line คือ", ["Aluminum hydroxide", "Calcium carbonate หรือ Calcium acetate", "Sevelamer", "Lanthanum carbonate"], "B",
    "Calcium-based phosphate binders เป็น first-line ใน CKD-MBD เพราะราคาถูกและได้ calcium เสริม",
    { A: "ผิด — Aluminum hydroxide ห้ามใช้ระยะยาวใน CKD เพราะ aluminum toxicity (encephalopathy, osteomalacia)", B: "ถูก — Calcium carbonate/acetate เป็น first-line phosphate binder ให้กินพร้อมอาหาร; ระวัง hypercalcemia", C: "ผิด — Sevelamer เป็น non-calcium binder ใช้เมื่อ calcium-based ไม่เหมาะ", D: "ผิด — Lanthanum เป็น alternative ไม่ใช่ first-line" }),
  q(S.renal, "ผู้ป่วย CKD stage 4 ตรวจพบ secondary hyperparathyroidism (iPTH สูง, Ca ต่ำ, PO4 สูง) ยาที่ช่วยกด PTH คือ", ["Cinacalcet", "Calcitriol (active Vitamin D)", "Ergocalciferol", "Bisphosphonate"], "B",
    "Active Vitamin D (Calcitriol) กด PTH secretion ใน secondary hyperparathyroidism ของ CKD",
    { A: "ผิด — Cinacalcet (calcimimetic) ใช้ใน dialysis patients ที่ไม่ตอบสนอง Vitamin D", B: "ถูก — Calcitriol (1,25-dihydroxyvitamin D3) กด PTH โดยตรง เป็น first-line ใน CKD 3-5", C: "ผิด — Ergocalciferol (Vitamin D2) ใช้เสริมเมื่อ 25-OH Vit D ต่ำ แต่ไม่ active ใน CKD", D: "ผิด — Bisphosphonate ใช้ osteoporosis ระวังใน CKD" }),

  // --- Pharmacy Law (15 questions) ---
  q(S.law, "ยาอันตราย (Dangerous drugs) ตาม พ.ร.บ. ยา พ.ศ. 2510 ต้องจ่ายโดยใคร", ["ใครก็ได้", "เภสัชกร หรือผู้ประกอบวิชาชีพเวชกรรม", "เภสัชกรเท่านั้น", "แพทย์เท่านั้น"], "B",
    "ยาอันตราย: ต้องจ่ายโดยเภสัชกร หรือผู้ประกอบวิชาชีพเวชกรรม/ทันตกรรม/สัตวแพทย์",
    { A: "ผิด — ยาอันตรายต้องมีผู้ประกอบวิชาชีพจ่ายยา", B: "ถูก — ยาอันตรายต้องจ่ายโดย เภสัชกร แพทย์ ทันตแพทย์ หรือสัตวแพทย์ ตามขอบเขตวิชาชีพ", C: "ผิด — แพทย์ก็จ่ายยาอันตรายได้เช่นกัน", D: "ผิด — เภสัชกรก็จ่ายได้" }),
  q(S.law, "ยาควบคุมพิเศษ (Specially controlled drugs) แตกต่างจากยาอันตรายอย่างไร", ["ไม่ต้องมีใบสั่งแพทย์", "ต้องมีใบสั่งยาจากผู้ประกอบวิชาชีพเวชกรรมหรือทันตกรรม", "ขายได้ในร้านขายของชำ", "ผลิตได้โดยไม่ต้องขึ้นทะเบียน"], "B",
    "ยาควบคุมพิเศษ: ต้องจ่ายตามใบสั่งยาจากแพทย์/ทันตแพทย์ เท่านั้น",
    { A: "ผิด — ยาควบคุมพิเศษต้องมีใบสั่งแพทย์", B: "ถูก — Specially controlled drugs ต้องมี prescription จากแพทย์/ทันตแพทย์ เช่น ยากลุ่ม Warfarin, Lithium, Clozapine", C: "ผิด — ขายเฉพาะร้านยาที่มีเภสัชกร", D: "ผิด — ต้องขึ้นทะเบียนตามกฎหมาย" }),
  q(S.law, "วัตถุออกฤทธิ์ประเภท 2 (เช่น Diazepam, Alprazolam) เภสัชกรร้านยาจ่ายได้หรือไม่", ["จ่ายได้โดยไม่ต้องมีใบสั่ง", "จ่ายได้ตามใบสั่งแพทย์ และต้องลงบันทึก", "จ่ายไม่ได้เด็ดขาด", "จ่ายได้เฉพาะโรงพยาบาล"], "B",
    "วัตถุออกฤทธิ์ประเภท 2: เภสัชกรร้านยาจ่ายได้ตามใบสั่งแพทย์ ต้องลงบันทึกรับ-จ่าย รายงาน อย.",
    { A: "ผิด — ต้องมีใบสั่งแพทย์", B: "ถูก — วัตถุออกฤทธิ์ ป.2 เภสัชกรจ่ายตามใบสั่งแพทย์ได้ ต้องทำบันทึก + รายงาน อย. ทุกเดือน", C: "ผิด — เภสัชกรจ่ายได้ตามใบสั่งแพทย์", D: "ผิด — ร้านยา ขย.1 ที่มีใบอนุญาตจ่ายได้" }),
  q(S.law, "ยาเสพติดให้โทษประเภท 2 (เช่น Morphine, Codeine) เภสัชกรชุมชนจ่ายยาได้หรือไม่", ["ได้ ไม่ต้องมีใบสั่ง", "ได้ ตามใบสั่งแพทย์", "ไม่ได้ จ่ายเฉพาะในโรงพยาบาล", "ได้ ถ้ามี Codeine < 10 mg/tablet"], "C",
    "ยาเสพติดให้โทษ ป.2: ร้านยาจ่ายไม่ได้ ต้องจ่ายในสถานพยาบาลที่มีใบอนุญาตเท่านั้น",
    { A: "ผิด — ต้องมีใบสั่งและเฉพาะสถานพยาบาล", B: "ผิด — ร้านยาไม่มีสิทธิ์ครอบครอง ยสท.ป.2", C: "ถูก — ยาเสพติดให้โทษ ป.2 จ่ายได้เฉพาะในสถานพยาบาลที่ได้รับอนุญาต ร้านยาจ่ายไม่ได้", D: "ผิด — ยาสำเร็จรูปที่มี codeine ต่ำกว่ากำหนดเป็น ยสท.ป.3 ไม่ใช่ ป.2" }, "hard"),
  q(S.law, "เภสัชกรที่เปิดร้านยาต้องปฏิบัติตนอย่างไรตามจรรยาบรรณวิชาชีพ", ["ขายยาทุกชนิดตามที่ลูกค้าขอ", "ปฏิเสธจ่ายยาเมื่อเห็นว่าอาจเป็นอันตรายต่อผู้ป่วย", "ให้คำปรึกษาเฉพาะเมื่อผู้ป่วยถาม", "โฆษณายาอย่างเสรี"], "B",
    "จรรยาบรรณเภสัชกร: มีหน้าที่ปกป้องความปลอดภัยของผู้ป่วย สามารถปฏิเสธจ่ายยาเมื่อเห็นว่าไม่เหมาะสม",
    { A: "ผิด — เภสัชกรต้องใช้วิจารณญาณ ไม่จ่ายยาตามที่ลูกค้าขอทุกกรณี", B: "ถูก — เภสัชกรมีสิทธิ์และหน้าที่ปฏิเสธจ่ายยาเพื่อความปลอดภัยของผู้ป่วย", C: "ผิด — เภสัชกรต้อง proactive ให้คำปรึกษาทุกครั้งที่จ่ายยา", D: "ผิด — การโฆษณายาต้องเป็นไปตาม พ.ร.บ. ยา ไม่ใช่เสรี" }),

  // --- Pharmacokinetics (15 questions) ---
  q(S.pk, "ยา A มี bioavailability 25% เมื่อให้ oral dose 200 mg ปริมาณยาที่เข้าสู่ systemic circulation คือเท่าใด", ["25 mg", "50 mg", "100 mg", "200 mg"], "B",
    "Bioavailability (F) = ปริมาณยาที่เข้า systemic / dose; F × dose = 0.25 × 200 = 50 mg",
    { A: "ผิด — 25 คือ % ไม่ใช่ mg", B: "ถูก — F × Dose = 0.25 × 200 mg = 50 mg เข้าสู่ systemic circulation", C: "ผิด — นั่นคือ F = 50%", D: "ผิด — นั่นคือ F = 100% (IV)" }, "easy"),
  q(S.pk, "ยาที่มี half-life 6 ชั่วโมง ถ้าให้ยาซ้ำทุก 6 ชั่วโมง จะถึง steady state ภายในเวลาประมาณเท่าใด", ["6 ชั่วโมง", "12 ชั่วโมง", "24 ชั่วโมง", "30 ชั่วโมง"], "D",
    "Steady state ≈ 4-5 half-lives; 5 × 6 hr = 30 ชั่วโมง",
    { A: "ผิด — 1 half-life", B: "ผิด — 2 half-lives", C: "ผิด — 4 half-lives (ใกล้เคียงแต่ไม่ใช่คำตอบที่ดีที่สุด)", D: "ถูก — Steady state ≈ 4-5 half-lives = 5 × 6 = 30 ชั่วโมง" }, "easy"),
  q(S.pk, "ยาใดที่เป็น prodrug ต้อง metabolize ก่อนจึงจะออกฤทธิ์", ["Enalapril", "Lisinopril", "Amlodipine", "Metoprolol"], "A",
    "Enalapril เป็น prodrug ถูก hydrolyzed เป็น Enalaprilat (active form) ที่ตับ",
    { A: "ถูก — Enalapril → Enalaprilat (active ACEi) ผ่าน hepatic ester hydrolysis", B: "ผิด — Lisinopril เป็น active drug ไม่ต้อง metabolize", C: "ผิด — Amlodipine เป็น active drug", D: "ผิด — Metoprolol เป็น active drug" }),
  q(S.pk, "ผู้ป่วยได้รับ Phenytoin มีค่า serum albumin 2.0 g/dL (ต่ำ) ผลต่อ total drug concentration คืออะไร", ["Total concentration สูงขึ้น", "Total concentration ต่ำลง แต่ free concentration อาจปกติ", "ไม่มีผลต่อ drug level", "Free concentration ลดลง"], "B",
    "Phenytoin จับ albumin สูง (~90%); เมื่อ albumin ต่ำ → total concentration ต่ำ แต่ free (active) drug อาจปกติหรือสูงขึ้น",
    { A: "ผิด — Total concentration จะต่ำลง", B: "ถูก — Hypoalbuminemia → total Phenytoin ลด แต่ free fraction เพิ่ม → ต้องใช้สูตร Winter-Tozer ปรับค่า", C: "ผิด — Albumin มีผลต่อ highly protein-bound drugs", D: "ผิด — Free concentration เพิ่มไม่ใช่ลด" }, "hard"),
  q(S.pk, "CYP3A4 inhibitor ที่แรงที่สุดในกลุ่มยาต่อไปนี้คือ", ["Rifampicin", "Ketoconazole", "Omeprazole", "Paracetamol"], "B",
    "Ketoconazole เป็น potent CYP3A4 inhibitor ลดการ metabolize ยาที่ผ่าน CYP3A4",
    { A: "ผิด — Rifampicin เป็น potent CYP3A4 INDUCER (ตรงข้าม)", B: "ถูก — Ketoconazole: strong CYP3A4 inhibitor → เพิ่ม level ของ Cyclosporine, Tacrolimus, Simvastatin ฯลฯ", C: "ผิด — Omeprazole เป็น CYP2C19 inhibitor ไม่ใช่ CYP3A4", D: "ผิด — Paracetamol ไม่มี significant CYP inhibition" }),

  // --- Pharmacognosy (10 questions) ---
  q(S.pharmacognosy, "สมุนไพรฟ้าทะลายโจร (Andrographis paniculata) มีสาร active หลักคือ", ["Curcumin", "Andrographolide", "Ginsenoside", "Silymarin"], "B",
    "Andrographolide เป็น diterpenoid lactone สารออกฤทธิ์หลักของฟ้าทะลายโจร มีฤทธิ์ anti-inflammatory, antipyretic",
    { A: "ผิด — Curcumin อยู่ในขมิ้นชัน (Turmeric)", B: "ถูก — Andrographolide เป็น active compound หลักของฟ้าทะลายโจร ใช้บรรเทาอาการไข้หวัด เจ็บคอ", C: "ผิด — Ginsenoside อยู่ในโสม (Ginseng)", D: "ผิด — Silymarin อยู่ใน Milk thistle" }),
  q(S.pharmacognosy, "ขมิ้นชัน (Curcuma longa) มีข้อควรระวังในการใช้ร่วมกับยาใด", ["Paracetamol", "Warfarin", "Metformin", "Omeprazole"], "B",
    "Curcumin มีฤทธิ์ antiplatelet อาจเพิ่มความเสี่ยงเลือดออกเมื่อใช้ร่วมกับ anticoagulant/antiplatelet",
    { A: "ผิด — ไม่มี significant interaction กับ Paracetamol", B: "ถูก — Curcumin + Warfarin: เพิ่ม bleeding risk เพราะ antiplatelet effect ของ curcumin", C: "ผิด — ไม่มี significant interaction", D: "ผิด — ไม่มี significant interaction" }),
  q(S.pharmacognosy, "St. John's Wort (Hypericum perforatum) มี interaction ที่สำคัญกับยาใด เนื่องจากเป็น CYP3A4 inducer", ["Paracetamol", "Cyclosporine", "Amoxicillin", "Ranitidine"], "B",
    "St. John's Wort เป็น potent CYP3A4/P-gp inducer → ลดระดับยา Cyclosporine, OCP, Warfarin, HIV protease inhibitors",
    { A: "ผิด — Paracetamol ไม่ได้ metabolize ผ่าน CYP3A4 เป็นหลัก", B: "ถูก — St. John's Wort + Cyclosporine: ลดระดับ Cyclosporine อย่างมาก → rejection risk สูง ห้ามใช้ร่วมกัน", C: "ผิด — Amoxicillin ไม่เกี่ยว", D: "ผิด — Ranitidine ไม่เกี่ยว" }),

  // --- Biopharmaceutics (10 questions) ---
  q(S.biopharma, "BCS (Biopharmaceutics Classification System) Class I หมายถึงยาที่มีคุณสมบัติอย่างไร", ["High solubility, Low permeability", "High solubility, High permeability", "Low solubility, High permeability", "Low solubility, Low permeability"], "B",
    "BCS Class I: High solubility + High permeability → ดูดซึมดี bioavailability สูง",
    { A: "ผิด — นั่นคือ BCS Class III", B: "ถูก — BCS Class I: High solubility + High permeability เช่น Metoprolol, Paracetamol", C: "ผิด — นั่นคือ BCS Class II เช่น Ibuprofen, Ketoconazole", D: "ผิด — นั่นคือ BCS Class IV" }, "easy"),
  q(S.biopharma, "Enteric coating มีวัตถุประสงค์หลักคือ", ["เพิ่ม solubility ของยา", "ป้องกันยาละลายในกระเพาะ ให้ละลายที่ลำไส้", "เพิ่มรสชาติ", "ลด dose ของยา"], "B",
    "Enteric coating ทนกรดในกระเพาะ (pH < 5) แต่ละลายที่ pH > 5.5 ในลำไส้เล็ก",
    { A: "ผิด — Enteric coating ไม่ได้เพิ่ม solubility", B: "ถูก — ป้องกันยาถูกทำลายโดยกรด (เช่น Omeprazole) หรือป้องกันยาระคายเคืองกระเพาะ (เช่น Aspirin EC)", C: "ผิด — Sugar coating ทำเรื่องรสชาติ", D: "ผิด — ไม่เกี่ยวกับ dose" }),
  q(S.biopharma, "ยาที่เป็น sustained-release ห้ามทำอะไร", ["กลืนทั้งเม็ด", "ดื่มน้ำตาม", "บด หัก เคี้ยวเม็ดยา", "รับประทานก่อนอาหาร"], "C",
    "Sustained-release: ห้ามบด/หัก/เคี้ยว เพราะทำลาย release-controlling mechanism → dose dumping อันตราย",
    { A: "ผิด — ต้องกลืนทั้งเม็ด", B: "ผิด — ดื่มน้ำตามปกติ", C: "ถูก — ห้ามบด/หัก/เคี้ยว sustained-release: ทำให้ยาทั้งหมดปล่อยพร้อมกัน (dose dumping) อันตราย", D: "ผิด — ก่อน/หลังอาหาร ขึ้นกับยาแต่ละตัว" }, "easy"),

  // --- ADR / Drug Interaction (15 questions) ---
  q(S.adr, "ผู้ป่วยใช้ Simvastatin อยู่ แพทย์สั่ง Clarithromycin เพิ่ม Drug interaction ที่ต้องระวังคือ", ["Clarithromycin ลด Simvastatin level", "Clarithromycin เพิ่ม Simvastatin level → rhabdomyolysis", "ไม่มี interaction", "Simvastatin ลด Clarithromycin level"], "B",
    "Clarithromycin เป็น CYP3A4 inhibitor → Simvastatin (CYP3A4 substrate) สะสม → rhabdomyolysis",
    { A: "ผิด — Clarithromycin ยับยั้ง ไม่ใช่เหนี่ยวนำ", B: "ถูก — Clarithromycin (CYP3A4 inhibitor) + Simvastatin → ↑ statin level → myopathy/rhabdomyolysis risk สูง ห้ามใช้ร่วม", C: "ผิด — เป็น major interaction", D: "ผิด — ทิศทางตรงข้าม" }),
  q(S.adr, "ACE inhibitor-induced angioedema เกิดจากกลไกใด", ["IgE-mediated allergic reaction", "Bradykinin accumulation", "Complement activation", "Direct mast cell degranulation"], "B",
    "ACEi ยับยั้ง ACE → ลด bradykinin degradation → bradykinin สะสม → vasodilation, increased vascular permeability → angioedema",
    { A: "ผิด — ไม่ใช่ IgE-mediated (ไม่ใช่ true allergy)", B: "ถูก — ACEi → ↓ bradykinin breakdown → bradykinin accumulation → angioedema (ไม่ตอบสนองต่อ epinephrine/antihistamine)", C: "ผิด — ไม่เกี่ยว complement", D: "ผิด — ไม่ใช่ direct mast cell activation" }),
  q(S.adr, "ผู้ป่วยใช้ Methotrexate กับ NSAIDs ร่วมกัน ADR ที่ต้องระวังคือ", ["Hepatoprotection เพิ่มขึ้น", "MTX toxicity เพิ่มขึ้น (myelosuppression, mucositis)", "NSAIDs ลดประสิทธิภาพ MTX", "ไม่มี interaction"], "B",
    "NSAIDs ลดการขับ MTX ทางไต (compete for renal tubular secretion) → MTX สะสม → toxicity",
    { A: "ผิด — ไม่ได้เกิด hepatoprotection", B: "ถูก — NSAIDs ลด renal clearance ของ MTX → ↑ MTX level → pancytopenia, mucositis, hepatotoxicity", C: "ผิด — NSAIDs เพิ่ม ไม่ใช่ลด MTX level", D: "ผิด — เป็น significant interaction" }),

  // --- Pharmaceutical Calculations (10 questions) ---
  q(S.calc, "แพทย์สั่ง Amoxicillin suspension 250 mg/5 mL ให้ผู้ป่วยเด็กน้ำหนัก 20 kg ขนาด 25 mg/kg/day แบ่งให้ TID ปริมาตรที่ต้องให้แต่ละมื้อคือ", ["2.5 mL", "3.3 mL", "5 mL", "10 mL"], "B",
    "25 mg/kg/day × 20 kg = 500 mg/day ÷ 3 = 166.7 mg/dose; 166.7 mg ÷ (250 mg/5 mL) = 3.3 mL",
    { A: "ผิด — คำนวณผิด", B: "ถูก — Total daily = 500 mg ÷ 3 doses = 166.7 mg/dose; 166.7 ÷ 50 (mg/mL) = 3.3 mL", C: "ผิด — 5 mL = 250 mg ซึ่งเกินขนาด per dose", D: "ผิด — 10 mL = 500 mg คือ total daily dose ไม่ใช่ per dose" }, "easy"),
  q(S.calc, "ต้องการเตรียม 500 mL ของ 0.9% NaCl จาก 23.4% NaCl stock solution ต้องใช้ stock solution กี่ mL", ["19.2 mL", "25 mL", "50 mL", "100 mL"], "A",
    "C1V1 = C2V2; 23.4% × V1 = 0.9% × 500 mL; V1 = 450/23.4 = 19.2 mL",
    { A: "ถูก — 23.4 × V1 = 0.9 × 500 = 450; V1 = 450/23.4 = 19.2 mL + qs water to 500 mL", B: "ผิด — คำนวณผิด", C: "ผิด — คำนวณผิด", D: "ผิด — คำนวณผิด" }),
  q(S.calc, "ผู้ป่วยได้รับ Heparin drip 25,000 units ใน NSS 500 mL สั่ง rate 1,000 units/hr อัตราการหยด (mL/hr) คือ", ["10 mL/hr", "20 mL/hr", "25 mL/hr", "50 mL/hr"], "B",
    "Concentration = 25,000/500 = 50 units/mL; Rate = 1,000 units/hr ÷ 50 units/mL = 20 mL/hr",
    { A: "ผิด — 10 mL/hr = 500 units/hr", B: "ถูก — 25,000 units/500 mL = 50 units/mL → 1,000 ÷ 50 = 20 mL/hr", C: "ผิด — 25 mL/hr = 1,250 units/hr", D: "ผิด — 50 mL/hr = 2,500 units/hr" }, "easy"),

  // --- Public Health (10 questions) ---
  q(S.publichealth, "ระบบ Thai Refer ในระบบสาธารณสุขไทย หมายถึงอะไร", ["ระบบส่งต่อผู้ป่วยระหว่างสถานพยาบาล", "ระบบประกันสังคม", "ระบบเบิกจ่ายยา", "ระบบทะเบียนเภสัชกร"], "A",
    "Thai Refer เป็นระบบส่งต่อผู้ป่วยระหว่างสถานพยาบาลในเครือข่ายสุขภาพ",
    { A: "ถูก — Thai Refer: ระบบส่งต่อผู้ป่วยข้ามสถานพยาบาลในเครือข่าย", B: "ผิด — ประกันสังคมเป็นระบบ SSO", C: "ผิด — ระบบเบิกจ่ายยาเป็นระบบอื่น", D: "ผิด — ทะเบียนเภสัชกรดูแลโดยสภาเภสัชกรรม" }),
  q(S.publichealth, "เภสัชกรชุมชน (Community pharmacist) มีบทบาทใดในระบบ National Drug Policy", ["ผลิตยาแผนปัจจุบัน", "ส่งเสริมการใช้ยาอย่างสมเหตุผล (RDU) และให้ความรู้แก่ประชาชน", "อนุมัติทะเบียนยา", "ตรวจวินิจฉัยโรค"], "B",
    "เภสัชกรชุมชนมีบทบาทหลักใน RDU (Rational Drug Use) ให้คำปรึกษา ส่งเสริมการใช้ยาอย่างเหมาะสม",
    { A: "ผิด — การผลิตยาเป็นหน้าที่ของบริษัทยา/โรงงาน", B: "ถูก — RDU (Rational Drug Use) เป็นบทบาทหลักของเภสัชกรชุมชน: จ่ายยาถูกต้อง ให้คำปรึกษา ป้องกัน polypharmacy", C: "ผิด — อนุมัติทะเบียนยาเป็นหน้าที่ อย.", D: "ผิด — การตรวจวินิจฉัยโรคเป็นหน้าที่แพทย์" }),

  // --- Pharmaceutical Care (10 questions) ---
  q(S.pharmcare, "SOAP note ในการบันทึกการบริบาลทางเภสัชกรรม S หมายถึงอะไร", ["Signs", "Subjective data", "Summary", "Solution"], "B",
    "SOAP: Subjective (ข้อมูลจากผู้ป่วย), Objective (ข้อมูลจากการตรวจ/lab), Assessment, Plan",
    { A: "ผิด — Signs เป็นส่วนของ Objective", B: "ถูก — S = Subjective: ข้อมูลที่ผู้ป่วยเล่า เช่น อาการปวด ประวัติ ความกังวล", C: "ผิด — Summary ไม่ใช่", D: "ผิด — Solution ไม่ใช่" }, "easy"),
  q(S.pharmcare, "DRP (Drug-Related Problem) ที่พบบ่อยที่สุดในผู้สูงอายุคือ", ["ยาราคาแพง", "Polypharmacy และ Drug interaction", "ยาหมดอายุ", "ไม่มีเภสัชกรดูแล"], "B",
    "ผู้สูงอายุมักได้ยาหลายชนิด (polypharmacy) → เพิ่มความเสี่ยง drug interactions, ADR, non-adherence",
    { A: "ผิด — ราคายาไม่ใช่ DRP โดยตรง", B: "ถูก — Polypharmacy (≥5 ยา) เป็น DRP หลักในผู้สูงอายุ → drug interaction, falls, confusion, non-adherence", C: "ผิด — ยาหมดอายุไม่ใช่ DRP ที่พบบ่อยที่สุด", D: "ผิด — ไม่ใช่ DRP" }),

  // --- Dispensing (10 questions) ---
  q(S.dispensing, "ผู้ป่วยมารับยา Warfarin ที่ร้านยา เภสัชกรควรให้คำแนะนำที่สำคัญที่สุดคือ", ["รับประทานพร้อมนม", "หลีกเลี่ยงอาหารที่มี Vitamin K สูงปริมาณมาก และมาตรวจ INR ตามนัด", "เคี้ยวเม็ดยาก่อนกลืน", "รับประทานก่อนนอนกับอาหารมัน"], "B",
    "Warfarin counseling: Vitamin K rich foods (ผักใบเขียว) ทำให้ INR ลด, ต้องตรวจ INR สม่ำเสมอ, สังเกตอาการเลือดออก",
    { A: "ผิด — นมไม่มี interaction กับ Warfarin", B: "ถูก — Key counseling: consistent Vitamin K intake, INR monitoring, bleeding signs, drug interactions (NSAIDs, antibiotics)", C: "ผิด — ไม่ต้องเคี้ยว", D: "ผิด — ไม่จำเป็นต้องกินกับอาหารมัน" }),
  q(S.dispensing, "ยา Insulin ที่เปิดใช้แล้วเก็บรักษาอย่างไร", ["แช่ช่องแข็ง (freezer)", "เก็บอุณหภูมิห้อง (< 30°C) ใช้ภายใน 28 วัน", "เก็บตู้เย็น ใช้ได้ตลอด", "วางกลางแดดได้"], "B",
    "Insulin เปิดใช้แล้ว: เก็บอุณหภูมิห้อง < 25-30°C หรือตู้เย็น ใช้ภายใน 28 วัน (บาง formulation 42 วัน)",
    { A: "ผิด — ห้ามแช่แข็ง protein จะเสีย", B: "ถูก — Insulin in-use: อุณหภูมิห้อง ≤ 30°C ใช้ภายใน 28 วัน ห้ามแช่แข็ง ห้ามโดนแสงแดด", C: "ผิด — ใช้ไม่ได้ตลอด มี expiry หลังเปิด", D: "ผิด — แสงแดดทำลาย insulin" }, "easy"),

  // --- Health Insurance (5 questions) ---
  q(S.insurance, "ระบบหลักประกันสุขภาพถ้วนหน้า (UC / บัตรทอง) ครอบคลุมประชาชนกลุ่มใด", ["เฉพาะข้าราชการ", "เฉพาะผู้ประกันตนตาม ม.33", "ประชาชนไทยทุกคนที่ไม่มีสิทธิ์อื่น", "เฉพาะเด็กอายุต่ำกว่า 12 ปี"], "C",
    "UC (Universal Coverage) ครอบคลุมประชาชนไทยที่ไม่ได้อยู่ในระบบประกันสังคมหรือสวัสดิการข้าราชการ",
    { A: "ผิด — ข้าราชการใช้สิทธิ์สวัสดิการข้าราชการ", B: "ผิด — ม.33 อยู่ในระบบประกันสังคม", C: "ถูก — UC/บัตรทอง: คนไทยทุกคนที่ไม่มีสิทธิ์ประกันสังคมหรือสวัสดิการข้าราชการ ดูแลโดย สปสช.", D: "ผิด — ครอบคลุมทุกอายุ ไม่ใช่เฉพาะเด็ก" }, "easy"),
  q(S.insurance, "ระบบประกันสังคม (Social Security) ตาม ม.33 ผู้ประกันตนต้องจ่ายสมทบเท่าไร", ["ไม่ต้องจ่าย", "5% ของเงินเดือน (สูงสุด 750 บาท/เดือน)", "10% ของเงินเดือน", "3% ของเงินเดือน"], "B",
    "ผู้ประกันตน ม.33 จ่ายสมทบ 5% ของเงินเดือน (ฐานเงินเดือนสูงสุด 15,000 บาท = สูงสุด 750 บาท/เดือน)",
    { A: "ผิด — ต้องจ่ายสมทบ", B: "ถูก — 5% ของเงินเดือน (สูงสุด 750 บาท/เดือน) + นายจ้าง 5% + รัฐบาล 2.75%", C: "ผิด — 10% สูงเกิน", D: "ผิด — 3% ไม่ถูก" }),
];

async function seed() {
  const client = new Client({ connectionString: SUPABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("Connected! Seeding", allQuestions.length, "questions...\n");

  let count = 0;
  for (const q of allQuestions) {
    const id = randomUUID();
    await client.query(
      `INSERT INTO mcq_questions (id, subject_id, exam_type, scenario, choices, correct_answer, explanation, detailed_explanation, difficulty, status)
       VALUES ($1, $2, 'PLE-CC1', $3, $4, $5, $6, $7, $8, 'active')`,
      [id, q.subject_id, q.scenario, q.choices, q.correct_answer, q.explanation, q.detailed_explanation, q.difficulty]
    );
    count++;
    if (count % 10 === 0) process.stdout.write(`  ${count}/${allQuestions.length}\r`);
  }

  console.log(`\n✅ Inserted ${count} questions!`);

  // Verify
  const r = await client.query(`SELECT s.name_th, COUNT(q.id) as count FROM mcq_subjects s LEFT JOIN mcq_questions q ON q.subject_id = s.id GROUP BY s.id, s.name_th ORDER BY count DESC`);
  console.log("\n=== Question counts ===");
  let total = 0;
  for (const row of r.rows) {
    if (Number(row.count) > 0) {
      console.log(`  ${row.name_th}: ${row.count}`);
      total += Number(row.count);
    }
  }
  console.log(`\n  TOTAL: ${total}`);

  await client.end();
}

seed().catch(console.error);
