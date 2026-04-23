import Anthropic from "@anthropic-ai/sdk";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SubjectConfig {
  name: string;
  name_th: string;
  exam_type: "PLE-CC1" | "PLE-PC1" | "NLE";
  exam_day?: 1 | 2;
  topic_areas: string[];
}

export interface GeneratedQuestion {
  subject_id: string;
  exam_type: string;
  exam_day?: number;
  scenario: string;
  choices: { label: string; text: string }[];
  correct_answer: string;
  difficulty: "easy" | "medium" | "hard";
  detailed_explanation: {
    summary: string;
    reason: string;
    choices: { label: string; text: string; is_correct: boolean; explanation: string }[];
    key_takeaway: string;
    calculation_steps?: string[];
  };
  is_ai_enhanced: true;
  ai_notes: string;
  status: "active";
}

// ─── Subject definitions (คละหมวดวิชา) ────────────────────────────────────────
// NOTE: `name` must match exactly the `name` column in the mcq_subjects table.

export const SUBJECT_CONFIGS: SubjectConfig[] = [
  {
    name: "Pharmacotherapy",
    name_th: "Pharmacotherapy",
    exam_type: "PLE-CC1",
    exam_day: 1,
    topic_areas: [
      "การเลือกยาที่เหมาะสมสำหรับโรคเรื้อรัง (DM, HT, HF, AF, CKD)",
      "Drug interactions และ contraindications",
      "Adverse drug reactions (ADR) และการจัดการ",
      "การปรับขนาดยาในผู้ป่วย renal/hepatic impairment",
      "Antibiotic stewardship: การเลือก ATB ตามเชื้อและ sensitivity",
      "ยาในหญิงตั้งครรภ์และให้นมบุตร (FDA category, ยา avoid)",
      "ยาในผู้สูงอายุ: Beer's criteria, polypharmacy",
      "การรักษา acute conditions: ACS, stroke, sepsis, anaphylaxis",
      "Oncology: ยา chemo พื้นฐาน, supportive care, side effects",
    ],
  },
  {
    name: "Infectious",
    name_th: "โรคติดเชื้อ",
    exam_type: "PLE-CC1",
    exam_day: 1,
    topic_areas: [
      "Antibiotic spectrum: gram-positive, gram-negative, anaerobes",
      "Beta-lactam antibiotics: penicillins, cephalosporins, carbapenems",
      "Antibiotic resistance mechanisms: MRSA, ESBL, VRE",
      "Antifungal therapy: azoles, amphotericin B, echinocandins",
      "Antiviral therapy: HIV, influenza, hepatitis B/C",
      "Empiric vs definitive therapy, de-escalation",
      "Pharmacokinetics/pharmacodynamics of antibiotics (PK/PD)",
      "Opportunistic infections in immunocompromised patients",
    ],
  },
  {
    name: "Cardiovascular",
    name_th: "โรคหัวใจและหลอดเลือด",
    exam_type: "PLE-CC1",
    exam_day: 1,
    topic_areas: [
      "Heart failure: HFrEF vs HFpEF, guideline-directed therapy",
      "Hypertension: first-line agents, compelling indications",
      "Atrial fibrillation: rate control, rhythm control, anticoagulation",
      "Acute coronary syndrome: STEMI, NSTEMI, antiplatelet therapy",
      "Dyslipidemia: statins, fibrates, PCSK9 inhibitors",
      "Anticoagulants: warfarin, DOACs, INR monitoring",
      "Antiarrhythmics: Vaughan Williams classification",
      "Shock: cardiogenic, vasopressors, inotropes",
    ],
  },
  {
    name: "Pharmacokinetics",
    name_th: "เภสัชจลนศาสตร์",
    exam_type: "PLE-CC1",
    exam_day: 2,
    topic_areas: [
      "One-compartment model: oral/IV, AUC, Cmax, Tmax",
      "Bioavailability: absolute F, relative F, bioequivalence",
      "Volume of distribution (Vd) และ clinical significance",
      "Clearance: renal, hepatic, total body clearance",
      "Half-life: t1/2 = 0.693/k และการประยุกต์ใช้",
      "Multiple dosing: steady state, loading dose",
      "TDM: Vancomycin, Aminoglycosides, Phenytoin, Digoxin",
      "Nonlinear pharmacokinetics: Michaelis-Menten (Phenytoin)",
    ],
  },
  {
    name: "PharmacyLaw",
    name_th: "กฎหมายยา/จริยธรรม",
    exam_type: "PLE-CC1",
    exam_day: 2,
    topic_areas: [
      "พ.ร.บ.ยา พ.ศ. 2510: ประเภทยา, ใบอนุญาต, บทลงโทษ",
      "ยาควบคุมพิเศษ vs ยาอันตราย vs ยาสามัญ",
      "GPP/GMP มาตรฐาน",
      "พ.ร.บ.วัตถุออกฤทธิ์ต่อจิตและประสาท: schedule I-IV",
      "จรรยาบรรณวิชาชีพเภสัชกรรม",
      "Pharmacovigilance: ADR reporting",
      "พ.ร.บ.คุ้มครองผู้บริโภค และ พ.ร.บ.อาหาร",
    ],
  },
  {
    name: "Pharmacognosy",
    name_th: "เภสัชเวท/สมุนไพร",
    exam_type: "PLE-CC1",
    exam_day: 2,
    topic_areas: [
      "ยาสมุนไพรในบัญชียาหลักแห่งชาติ: ฟ้าทะลายโจร, ขมิ้นชัน, กระชาย",
      "Herb-drug interactions: St. John's Wort, Warfarin + herbs",
      "สารสำคัญในสมุนไพร: alkaloids, flavonoids, terpenes, glycosides",
      "ผลิตภัณฑ์เสริมอาหาร: Omega-3, Vitamin D, Probiotics",
      "ฤทธิ์ทางเภสัชวิทยา: anti-inflammatory, antimicrobial, antioxidant",
      "การควบคุมคุณภาพสมุนไพร: standardization, fingerprint",
    ],
  },
  {
    name: "Biopharmaceutics",
    name_th: "ชีวเภสัชศาสตร์/เทคโนโลยีเภสัชกรรม",
    exam_type: "PLE-CC1",
    exam_day: 1,
    topic_areas: [
      "BCS classification (I–IV): solubility, permeability",
      "Dissolution testing: apparatus, acceptance criteria",
      "Bioavailability factors: first-pass effect, food effect",
      "Dosage forms: tablets, capsules, injections, topical, inhalation",
      "Controlled release systems: matrix, reservoir, osmotic pump",
      "Sterile preparations: IV admixture, aseptic technique",
      "Excipients: binders, disintegrants, preservatives, surfactants",
      "GMP: cleanroom classification, validation, quality control",
    ],
  },
  {
    name: "PharmCalculations",
    name_th: "การคำนวณทางเภสัชกรรม",
    exam_type: "PLE-CC1",
    exam_day: 1,
    topic_areas: [
      "Pharmaceutical calculations: dilution, concentration, % w/v, % w/w",
      "IV drip rate calculations: mL/hr, drops/min",
      "Dosing calculations: mg/kg, BSA-based dosing",
      "Electrolyte calculations: mEq, mmol, osmolarity",
      "Creatinine clearance: Cockcroft-Gault equation",
      "Pharmacokinetic calculations: Vd, CL, t1/2, AUC",
      "Compounding calculations: alligations, dilutions",
    ],
  },
  {
    name: "ADR_DI",
    name_th: "ADR/Drug Interactions",
    exam_type: "PLE-CC1",
    exam_day: 2,
    topic_areas: [
      "Common ADRs: Stevens-Johnson, agranulocytosis, hepatotoxicity",
      "Pharmacokinetic drug interactions: CYP450 inducers/inhibitors",
      "Pharmacodynamic drug interactions: additive, synergistic, antagonistic",
      "Narrow therapeutic index drugs: warfarin, digoxin, phenytoin, lithium",
      "Serotonin syndrome, NMS: causes, symptoms, management",
      "QT-prolonging drugs: risk factors, monitoring",
      "Naranjo algorithm: causality assessment",
    ],
  },
  {
    name: "Psychiatric",
    name_th: "จิตเวชศาสตร์",
    exam_type: "PLE-CC1",
    exam_day: 1,
    topic_areas: [
      "Antidepressants: SSRIs, SNRIs, TCAs, MAOIs — ข้อบ่งชี้และ ADR",
      "Antipsychotics: typical vs atypical, EPS, metabolic syndrome",
      "Mood stabilizers: lithium (monitoring, toxicity), valproate, lamotrigine",
      "Benzodiazepines: indications, dependence, withdrawal",
      "ADHD: methylphenidate, atomoxetine",
      "Anxiety disorders: pharmacotherapy approach",
      "Schizophrenia: maintenance therapy, compliance",
    ],
  },
  {
    name: "Neurologic",
    name_th: "ระบบประสาท",
    exam_type: "PLE-CC1",
    exam_day: 1,
    topic_areas: [
      "Epilepsy: first-line AEDs, drug interactions, teratogenicity",
      "Parkinson's disease: levodopa, dopamine agonists, MAO-B inhibitors",
      "Migraine: acute (triptans) vs prophylactic therapy",
      "Stroke: tPA criteria, antiplatelet/anticoagulation post-stroke",
      "Pain management: WHO ladder, opioid equianalgesic dosing",
      "Alzheimer's disease: AChE inhibitors, memantine",
      "Multiple sclerosis: disease-modifying therapies",
    ],
  },
  {
    name: "Endocrine",
    name_th: "ต่อมไร้ท่อ",
    exam_type: "PLE-CC1",
    exam_day: 1,
    topic_areas: [
      "Type 2 DM: metformin, sulfonylureas, GLP-1 agonists, SGLT2 inhibitors",
      "Insulin therapy: types, regimens, sick-day rules",
      "Hypothyroidism: levothyroxine dosing, monitoring",
      "Hyperthyroidism: methimazole, propylthiouracil, β-blockers",
      "Osteoporosis: bisphosphonates, calcium, vitamin D",
      "Corticosteroids: adrenal suppression, tapering",
      "Diabetes complications: DKA, HHS management",
    ],
  },
  {
    name: "Renal",
    name_th: "โรคไต",
    exam_type: "PLE-CC1",
    exam_day: 2,
    topic_areas: [
      "CKD staging (KDIGO): GFR, albuminuria",
      "Drug dosing in CKD: renal dose adjustment",
      "Dialysis: hemodialysis vs peritoneal dialysis, drug removal",
      "Electrolyte disorders: hyperkalemia, hyponatremia, acidosis management",
      "Anemia of CKD: EPO, iron supplementation",
      "Nephrotoxic drugs: aminoglycosides, NSAIDs, contrast agents",
      "Acute kidney injury: causes, RIFLE criteria, management",
    ],
  },
  {
    name: "Gastrointestinal",
    name_th: "ระบบทางเดินอาหาร",
    exam_type: "PLE-CC1",
    exam_day: 1,
    topic_areas: [
      "GERD/PUD: PPIs, H2 blockers, H. pylori eradication regimens",
      "IBD: 5-ASA, corticosteroids, immunosuppressants, biologics",
      "Constipation/diarrhea: laxatives, antidiarrheal agents",
      "Nausea/vomiting: antiemetics (ondansetron, metoclopramide, prochlorperazine)",
      "Liver disease: DILI, cirrhosis complications, hepatic encephalopathy",
      "Pancreatitis: supportive care, antibiotic use",
      "IBS: pharmacotherapy approach",
    ],
  },
  {
    name: "Hematologic",
    name_th: "โลหิตวิทยา",
    exam_type: "PLE-CC1",
    exam_day: 2,
    topic_areas: [
      "Iron deficiency anemia: oral vs IV iron, monitoring",
      "Vitamin B12/folate deficiency: causes, treatment",
      "Anticoagulation: heparin, LMWH, warfarin, DOACs",
      "Thromboembolic disease: DVT/PE treatment and prophylaxis",
      "Sickle cell disease: hydroxyurea, pain management",
      "Thrombocytopenia: HIT, ITP management",
      "Antiplatelet therapy: aspirin, clopidogrel, ticagrelor",
    ],
  },
  {
    name: "Pulmonary",
    name_th: "ระบบทางเดินหายใจ",
    exam_type: "PLE-CC1",
    exam_day: 1,
    topic_areas: [
      "Asthma: stepwise therapy, SABA, ICS, LABA, biologics",
      "COPD: GOLD classification, bronchodilators, exacerbation management",
      "Community-acquired pneumonia: empiric antibiotics, risk stratification",
      "TB: first-line regimens, DOT, drug resistance",
      "Pulmonary hypertension: endothelin antagonists, PDE5 inhibitors",
      "Inhaler devices: MDI, DPI, nebulizer technique",
      "Oxygen therapy: indications, flow rates",
    ],
  },
  {
    name: "Immunologic",
    name_th: "ภูมิคุ้มกันวิทยา",
    exam_type: "PLE-CC1",
    exam_day: 2,
    topic_areas: [
      "Immunosuppressants: cyclosporine, tacrolimus, mycophenolate",
      "Rheumatoid arthritis: DMARDs, biologics (TNF inhibitors)",
      "SLE: hydroxychloroquine, corticosteroids, belimumab",
      "Gout: allopurinol, febuxostat, colchicine, NSAIDs",
      "Allergic reactions: antihistamines, corticosteroids, epinephrine",
      "Vaccines: schedules, contraindications, live vs inactivated",
      "Anaphylaxis: recognition and emergency management",
    ],
  },
  {
    name: "Dispensing",
    name_th: "การจ่ายยา/เภสัชกรรมปฏิบัติ",
    exam_type: "PLE-CC1",
    exam_day: 2,
    topic_areas: [
      "Medication reconciliation: admission, discharge",
      "Prescription interpretation: SIG codes, abbreviations",
      "Patient counseling: medication adherence, storage",
      "High-alert medications: insulin, anticoagulants, concentrated electrolytes",
      "Look-alike/sound-alike (LASA) drugs",
      "Over-the-counter (OTC) counseling: cold, pain, GI products",
      "Medication errors: types, prevention, reporting",
    ],
  },
  {
    name: "PharmCare",
    name_th: "การบริบาลทางเภสัชกรรม",
    exam_type: "PLE-CC1",
    exam_day: 2,
    topic_areas: [
      "Medication therapy management (MTM): comprehensive medication review",
      "Drug-related problems (DRP): identification, classification",
      "Therapeutic drug monitoring: goals, parameters",
      "Adherence assessment: barriers, strategies",
      "Pharmacist-managed clinics: anticoagulation, DM, HTN",
      "SOAP note documentation",
      "Interprofessional collaboration in patient care",
    ],
  },
  {
    name: "PublicHealth",
    name_th: "สาธารณสุข/ระบาดวิทยา",
    exam_type: "PLE-CC1",
    exam_day: 2,
    topic_areas: [
      "Epidemiology: incidence, prevalence, RR, OR, NNT",
      "Screening programs: sensitivity, specificity, PPV, NPV",
      "Health promotion and disease prevention",
      "Thailand essential medicines list (บัญชียาหลักแห่งชาติ)",
      "Rational drug use (RDU) principles",
      "Universal health coverage: 30-baht scheme",
      "Pharmacoepidemiology: drug utilization studies",
    ],
  },
  {
    name: "HealthInsurance",
    name_th: "ประกันสุขภาพ/เศรษฐศาสตร์",
    exam_type: "PLE-CC1",
    exam_day: 2,
    topic_areas: [
      "Thailand health insurance systems: UCS, CSMBS, SSS",
      "Pharmacoeconomics: CEA, CUA, CBA",
      "QALY, DALY concepts",
      "Drug reimbursement criteria",
      "Health technology assessment (HTA)",
      "Cost-minimization analysis",
      "Budget impact analysis",
    ],
  },

  // ─── NLE (Nursing Licensing Exam) subjects ────────────────────────────────────
  {
    name: "NursingAdult",
    name_th: "การพยาบาลผู้ใหญ่",
    exam_type: "NLE",
    topic_areas: [
      "Respiratory nursing: COPD, asthma, pneumonia, mechanical ventilation, oxygen therapy",
      "Cardiovascular nursing: ACS, heart failure, shock, dysrhythmias, cardiac monitoring",
      "Neurological nursing: stroke, seizure, increased ICP, spinal cord injury, GCS assessment",
      "Perioperative nursing: preoperative assessment, intraoperative care, PACU, wound care",
      "Oncology nursing: chemotherapy side effects, mucositis, neutropenia, palliative care",
      "Fluid/electrolyte imbalances: hyponatremia, hyperkalemia, metabolic acidosis, IV therapy",
      "Infection and sepsis: sepsis bundle, wound infection, central line care, isolation precautions",
      "Endocrine nursing: DKA, HHS, thyroid crisis, steroid management",
    ],
  },
  {
    name: "NursingGeriatric",
    name_th: "การพยาบาลผู้สูงอายุ",
    exam_type: "NLE",
    topic_areas: [
      "Comprehensive geriatric assessment (CGA): ADL, IADL, cognitive screening (MMSE, MoCA)",
      "Delirium vs dementia vs depression: differential diagnosis, nursing management",
      "Falls prevention: risk assessment (Morse Fall Scale), environment modification, hip fracture",
      "Polypharmacy and Beer's criteria: drug review, deprescribing, medication safety",
      "Functional decline: immobility complications, pressure injury prevention (Braden Scale)",
      "Nutritional assessment in elderly: malnutrition screening (MNA), dysphagia management",
      "Elder abuse and neglect: types, recognition, mandatory reporting",
      "Palliative and end-of-life care: symptom management, family support, DNR",
    ],
  },
  {
    name: "NursingPediatric",
    name_th: "การพยาบาลเด็กและวัยรุ่น",
    exam_type: "NLE",
    topic_areas: [
      "Growth and development: Erikson psychosocial stages, Piaget cognitive stages, developmental milestones",
      "Pediatric vital signs and assessment: age-appropriate norms, pediatric pain assessment (FLACC, Wong-Baker)",
      "Common childhood respiratory illnesses: croup, bronchiolitis, asthma exacerbation, RSV",
      "Fever management and febrile seizure: antipyretic use, seizure precautions, parental education",
      "Congenital heart disease: cyanotic (ToF, TGA) vs acyanotic (VSD, ASD, PDA) defects",
      "Pediatric fluid therapy: weight-based calculations, dehydration assessment, oral rehydration",
      "Childhood immunization schedule: vaccines, contraindications, cold chain",
      "Adolescent health: eating disorders, substance use, reproductive health, confidentiality",
    ],
  },
  {
    name: "NursingMaternal",
    name_th: "การพยาบาลมารดาและทารก",
    exam_type: "NLE",
    topic_areas: [
      "Antepartum complications: preeclampsia/eclampsia (magnesium sulfate), gestational diabetes, placenta previa, PROM",
      "APGAR scoring: 5 components, interpretation, resuscitation decision",
      "Newborn assessment: physical examination, reflexes (Moro, rooting, Babinski), gestational age",
      "Breastfeeding: latch technique, common problems (engorgement, mastitis), benefits",
      "Postpartum complications: PPH (uterine atony, retained placenta), infection (endometritis), DVT",
      "Newborn hyperbilirubinemia: risk factors, phototherapy, exchange transfusion criteria",
      "Neonatal care: thermoregulation, hypoglycemia, congenital anomaly identification",
      "Postpartum blues vs depression vs psychosis: screening (Edinburgh scale), management",
    ],
  },
  {
    name: "NursingMidwifery",
    name_th: "การผดุงครรภ์",
    exam_type: "NLE",
    topic_areas: [
      "Stages of labor: latent, active, transition, second stage, third stage — duration and characteristics",
      "Fetal heart rate monitoring: baseline, variability, accelerations, decelerations (early/late/variable)",
      "Labor complications: prolonged labor, fetal distress, umbilical cord prolapse, shoulder dystocia",
      "Normal vaginal delivery: cardinal movements, delivery technique, Apgar at 1 and 5 minutes",
      "Episiotomy: indications, types (mediolateral vs median), repair, postpartum care",
      "Placenta delivery: management of third stage, signs of placental separation, controlled cord traction",
      "Induction and augmentation of labor: oxytocin protocol, Bishop score, contraindications",
      "Postpartum uterine assessment: involution, lochia characteristics (rubra, serosa, alba), fundal height",
    ],
  },
  {
    name: "NursingPsych",
    name_th: "การพยาบาลสุขภาพจิตและจิตเวชศาสตร์",
    exam_type: "NLE",
    topic_areas: [
      "Therapeutic communication: techniques (reflection, clarification, silence), non-therapeutic responses, boundaries",
      "Mental status examination (MSE): appearance, behavior, affect, thought process, insight",
      "Schizophrenia: positive/negative symptoms, antipsychotic side effects (EPS, tardive dyskinesia, NMS)",
      "Mood disorders: major depressive disorder, bipolar I/II — nursing interventions, medication monitoring",
      "Anxiety disorders: panic disorder, PTSD, OCD — nursing management, relaxation techniques",
      "Suicide risk assessment: SAD PERSONS scale, safety planning, environmental safety",
      "Substance use disorders: alcohol withdrawal (CIWA), opioid withdrawal, relapse prevention",
      "Personality disorders: borderline, antisocial — limit setting, therapeutic milieu management",
    ],
  },
  {
    name: "NursingCommunity",
    name_th: "การพยาบาลอนามัยชุมชนและการรักษาพยาบาลขั้นต้น",
    exam_type: "NLE",
    topic_areas: [
      "Levels of prevention: primary (health promotion, immunization), secondary (screening), tertiary (rehabilitation)",
      "Epidemiology basics: incidence vs prevalence, attack rate, herd immunity, outbreak investigation",
      "Non-communicable disease (NCD) programs: DM/HT screening, lifestyle modification counseling",
      "Communicable disease control: TB (DOTS), HIV/AIDS, dengue, COVID-19 — isolation and reporting",
      "Maternal and child health (MCH): ANC schedule, growth monitoring, EPI program",
      "Primary care nursing: SOAP documentation, triage, wound care, basic procedures",
      "Environmental and occupational health: hazard identification, workplace health promotion",
      "Disaster nursing and mass casualty: START triage, field hospital setup, mental health support",
    ],
  },
  {
    name: "NursingLawEthics",
    name_th: "กฎหมายและจรรยาบรรณวิชาชีพ",
    exam_type: "NLE",
    topic_areas: [
      "Nursing Council Act (พ.ร.บ.วิชาชีพการพยาบาลและการผดุงครรภ์): licensing, scope of practice, renewal",
      "Patient rights: informed consent elements, capacity assessment, right to refuse treatment",
      "Confidentiality and privacy: exceptions (mandatory reporting, public health threat), medical records",
      "Bioethical principles: autonomy, beneficence, nonmaleficence, justice — clinical application",
      "Professional misconduct: types, disciplinary process, grounds for license suspension/revocation",
      "Nursing documentation: legal requirements, incident reports, chain of custody",
      "End-of-life care: DNR orders, advance directives, withdrawing vs withholding treatment",
      "Delegation and supervision: principles, accountability, unlicensed assistive personnel (UAP)",
    ],
  },
];

// ─── Prompt builder ────────────────────────────────────────────────────────────

function buildPrompt(subject: SubjectConfig, count: number, batchIndex: number): string {
  const n = subject.topic_areas.length;
  const start = (batchIndex * 3) % n;
  const rotated = [
    ...subject.topic_areas.slice(start),
    ...subject.topic_areas.slice(0, start),
  ];
  const topics = rotated.slice(0, Math.min(4, n));

  if (subject.exam_type === "NLE") {
    return `สร้างข้อสอบ NLE (ข้อสอบขึ้นทะเบียนสภาการพยาบาล) ไทย จำนวน ${count} ข้อ
หมวดวิชา: ${subject.name_th}
หัวข้อที่ครอบคลุม:
${topics.map((t, i) => `${i + 1}. ${t}`).join("\n")}

มาตรฐานคุณภาพ (สำคัญ — ต้องการโจทย์เชิงลึก ไม่สั้น ไม่ง่ายเกิน):

[Difficulty distribution]
- 15% easy / 50% medium / 35% hard (ต้องระบุใน field)

[ความยาว + เนื้อหาตาม difficulty]
- easy (1-2 ประโยค): pure recall — concept, definition, normal value, classification
- medium (3-5 ประโยค): clinical/nursing decision — **บังคับมี patient context**: อายุ + เพศ + diagnosis/condition + assessment findings (vital signs, physical exam, lab) + intervention หรือ priority ที่ต้องตัดสินใจ
- hard (5-8 ประโยค): integration multi-step — ต้อง integrate ≥2 concepts (เช่น assessment + prioritization + intervention + rationale + patient education, หรือ ethics + legal + therapeutic communication)

[Distractor quality — สำคัญที่สุด]
- ตัวเลือกผิดต้องเป็น "common nursing student errors" ที่หน้าตาเหมือนคำตอบจริง:
  - Intervention ที่เหมาะสมในเวลาอื่นแต่ไม่ใช่ priority ตอนนี้
  - คำตอบที่ "ถูกบางส่วน" แต่ขาด safety priority
  - Action ที่อยู่นอก scope ของพยาบาล
  - คำสั่งที่ขัดกับ standard of care/ethics
- ห้ามใช้ตัวเลือก absurd ที่ตัดออกได้ทันที
- ห้ามใช้ "ทุกข้อข้างต้นถูก/ผิด"

[Format]
- 4 ตัวเลือก (A-D) — ความยาวตัวเลือกใกล้เคียงกัน
- ภาษาไทย ยกเว้นคำศัพท์ทางพยาบาล/การแพทย์ที่นิยมใช้ภาษาอังกฤษ
- ใช้ guideline/best practice ไทยและสากลล่าสุด
- ครอบคลุมหลาย topic ใน batch ไม่ซ้ำ

[ตัวอย่าง hard question คุณภาพดี — ใช้เป็น quality bar]
{
  "scenario": "ผู้ป่วยหญิง 65 ปี admit ด้วย CHF exacerbation ได้รับ furosemide 40 mg IV BID มา 3 วัน วันนี้พยาบาลประเมินพบ: BP 95/60 mmHg (จากเดิม 130/80), HR 110 ครั้ง/นาที, RR 22, SpO2 92% room air, urine output 800 mL/8 hr, K 3.0 mEq/L, Cr 1.8 (baseline 1.0), ผู้ป่วยบ่นเวียนศีรษะเมื่อลุกนั่ง การพยาบาลที่เป็น priority สูงสุดคือข้อใด",
  "choices": [
    {"label": "A", "text": "ให้ KCl supplement ทาง IV ตามแผนการรักษา"},
    {"label": "B", "text": "หยุด furosemide ชั่วคราว แจ้งแพทย์รายงาน hypotension + AKI + hypokalemia + over-diuresis เพื่อทบทวนแผนการรักษาทันที"},
    {"label": "C", "text": "จัดท่านอนศีรษะสูง ให้ออกซิเจน mask 4 LPM"},
    {"label": "D", "text": "เพิ่ม IV NSS 1000 mL ใน 4 ชั่วโมงเพื่อแก้ภาวะ hypotension"}
  ],
  "correct_answer": "B",
  "difficulty": "hard"
}

ตอบเป็น JSON array เท่านั้น ห้ามใส่ข้อความหรือ markdown อื่น:
[
  {
    "scenario": "โจทย์ข้อสอบ clinical scenario",
    "choices": [
      {"label": "A", "text": "..."},
      {"label": "B", "text": "..."},
      {"label": "C", "text": "..."},
      {"label": "D", "text": "..."}
    ],
    "correct_answer": "B",
    "difficulty": "medium",
    "topic_tag": "หัวข้อย่อย",
    "detailed_explanation": {
      "summary": "คำตอบที่ถูกต้อง: B. [ชื่อคำตอบ] — อธิบายสั้น 1 ประโยค",
      "reason": "อธิบายเหตุผล 2-3 ย่อหน้า: วิเคราะห์โจทย์ + หลักการพยาบาล",
      "choices": [
        {"label": "A", "text": "...", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค (ระบุ misconception ที่พบบ่อย)"},
        {"label": "B", "text": "...", "is_correct": true, "explanation": "ทำไมถูก 1-2 ประโยค"},
        {"label": "C", "text": "...", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค"},
        {"label": "D", "text": "...", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค"}
      ],
      "key_takeaway": "จุดสำคัญที่ต้องจำ 1-2 ประโยค"
    }
  }
]`;
  }

  return `สร้างข้อสอบ PLE (Pharmacy Licensing Examination) ไทย จำนวน ${count} ข้อ
หมวดวิชา: ${subject.name_th}
หัวข้อที่ครอบคลุม:
${topics.map((t, i) => `${i + 1}. ${t}`).join("\n")}

มาตรฐานคุณภาพ (สำคัญ — ผู้ใช้รายงานว่าโจทย์เก่าสั้นและง่ายเกินไป):

[Difficulty distribution]
- 15% easy / 50% medium / 35% hard (ต้องระบุใน field)

[ความยาว + เนื้อหาตาม difficulty]
- easy (1-2 ประโยค): pure recall — MoA, drug class, common ADR, brand-generic, schedule
- medium (3-5 ประโยค): clinical decision — **บังคับมี patient context**: อายุ + เพศ + comorbidity ≥1 + current medications ≥1 + lab/vital signs ที่จำเป็นต่อการตอบ (เช่น SCr/eGFR, K, INR, BP, HR)
- hard (5-8 ประโยค): integration multi-step — ต้อง integrate ≥2 concepts (เช่น renal-adjusted dose + drug interaction + monitoring plan + counseling, หรือ ADR identification + alternative selection + dose conversion)

[Distractor quality — สำคัญที่สุด]
- ตัวเลือกผิดต้องเป็น "common trainee mistakes" ที่หน้าตาเหมือนคำตอบจริง:
  - ยาตระกูลเดียวกันแต่ผิด indication/contraindication
  - ขนาดยาที่พบใช้ผิดบ่อย (เช่น loading vs maintenance, mg vs mcg, q6h vs q8h)
  - Alternative drug ที่ contraindicated ใน comorbidity ที่โจทย์ระบุ
  - คำตอบที่ "ถูกบางส่วน" แต่ขาดประเด็นสำคัญที่โจทย์ทดสอบ
- ห้ามใช้ตัวเลือก absurd ที่ตัดออกได้ทันทีโดยไม่ต้องคิด
- ห้ามใช้ "ทุกข้อข้างต้นถูก/ผิด"

[Format]
- 5 ตัวเลือก (A-E) — ความยาวตัวเลือกใกล้เคียงกัน
- ภาษาไทย ยกเว้นชื่อยา (generic name) และคำศัพท์วิชาชีพ
- ชื่อยาและขนาดต้องถูกต้องตามจริง (อ้างอิง guideline ไทย/สากลล่าสุด)
- ครอบคลุมหลาย topic ใน batch ไม่ซ้ำ

[ตัวอย่าง hard question คุณภาพดี — ใช้เป็น quality bar]
{
  "scenario": "ผู้ป่วยชาย 72 ปี น้ำหนัก 60 กก. ประวัติ HFrEF (EF 28%), AF, CKD stage 3b (eGFR 32 mL/min/1.73m²) ปัจจุบันรับยาประจำ: furosemide 40 mg OD, bisoprolol 5 mg OD, sacubitril/valsartan 49/51 mg BID, warfarin (INR 2.4 last week), spironolactone 25 mg OD ผู้ป่วยมาด้วย ankle edema เพิ่มขึ้น 1 สัปดาห์ BP 108/68, HR 62, K 4.6 mEq/L แพทย์ขอเริ่ม dapagliflozin 10 mg OD เพื่อลด HF hospitalization คำแนะนำที่สำคัญที่สุดของเภสัชกรคือข้อใด",
  "choices": [
    {"label": "A", "text": "เริ่ม dapagliflozin 10 mg OD ทันที ไม่ต้องปรับยาอื่น"},
    {"label": "B", "text": "ลด furosemide ลง 50% ชั่วคราว 1-2 สัปดาห์ + monitor BP/volume status เพราะ SGLT2i มี natriuretic effect ร่วมกัน"},
    {"label": "C", "text": "หยุด spironolactone เพื่อป้องกัน hyperkalemia จาก SGLT2i"},
    {"label": "D", "text": "ลด dapagliflozin เป็น 5 mg OD เพราะ eGFR <45"},
    {"label": "E", "text": "เปลี่ยน warfarin เป็น apixaban เพราะ interaction กับ SGLT2i"}
  ],
  "correct_answer": "B",
  "difficulty": "hard"
}

ตอบเป็น JSON array เท่านั้น ห้ามใส่ข้อความหรือ markdown อื่น:
[
  {
    "scenario": "โจทย์ข้อสอบ",
    "choices": [
      {"label": "A", "text": "..."},
      {"label": "B", "text": "..."},
      {"label": "C", "text": "..."},
      {"label": "D", "text": "..."},
      {"label": "E", "text": "..."}
    ],
    "correct_answer": "B",
    "difficulty": "medium",
    "topic_tag": "Drug interaction",
    "detailed_explanation": {
      "summary": "คำตอบที่ถูกต้อง: B. [ชื่อคำตอบ] — อธิบายสั้น 1 ประโยค",
      "reason": "อธิบายเหตุผล 2-3 ย่อหน้า: วิเคราะห์โจทย์ + หลักการทางวิทยาศาสตร์ + เหตุผลที่ถูก",
      "choices": [
        {"label": "A", "text": "...", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค (ระบุ misconception ที่พบบ่อย)"},
        {"label": "B", "text": "...", "is_correct": true, "explanation": "ทำไมถูก 1-2 ประโยค"},
        {"label": "C", "text": "...", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค"},
        {"label": "D", "text": "...", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค"},
        {"label": "E", "text": "...", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค"}
      ],
      "key_takeaway": "จุดสำคัญที่ต้องจำ 1-2 ประโยค"
    }
  }
]`;
}

// ─── Parse ─────────────────────────────────────────────────────────────────────

function parseQuestions(text: string): unknown[] | null {
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
    }
    const match = cleaned.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// ─── Main export ───────────────────────────────────────────────────────────────

/**
 * Generate MCQ questions for a subject using Claude Sonnet.
 */
export async function generateMcqBatch(
  subject: SubjectConfig,
  subjectId: string,
  count: number,
  batchIndex = 0
): Promise<GeneratedQuestion[]> {
  const client = new Anthropic();
  const prompt = buildPrompt(subject, count, batchIndex);

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const raw = parseQuestions(text);

  if (!raw || !Array.isArray(raw)) return [];

  const isNLE = subject.exam_type === "NLE";
  const expectedChoices = isNLE ? 4 : 5;
  const validAnswers = isNLE ? "ABCD" : "ABCDE";

  const questions: GeneratedQuestion[] = [];
  for (const q of raw) {
    const item = q as Record<string, unknown>;
    if (
      typeof item.scenario === "string" &&
      Array.isArray(item.choices) &&
      (item.choices as unknown[]).length === expectedChoices &&
      typeof item.correct_answer === "string" &&
      validAnswers.includes(item.correct_answer as string) &&
      item.detailed_explanation
    ) {
      questions.push({
        subject_id: subjectId,
        exam_type: subject.exam_type,
        ...(subject.exam_day !== undefined && { exam_day: subject.exam_day }),
        scenario: item.scenario as string,
        choices: item.choices as { label: string; text: string }[],
        correct_answer: item.correct_answer as string,
        difficulty: (["easy", "medium", "hard"].includes(item.difficulty as string)
          ? item.difficulty
          : "medium") as "easy" | "medium" | "hard",
        detailed_explanation: item.detailed_explanation as GeneratedQuestion["detailed_explanation"],
        is_ai_enhanced: true,
        ai_notes: `daily-gen • ${subject.name_th} • batch${batchIndex}`,
        status: "active",
      });
    }
  }

  return questions;
}
