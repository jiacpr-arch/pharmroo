import Anthropic from "@anthropic-ai/sdk";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SubjectConfig {
  name: string;
  name_th: string;
  exam_type: "PLE-CC1" | "PLE-PC1";
  exam_day: 1 | 2;
  topic_areas: string[];
}

export interface GeneratedQuestion {
  subject_id: string;
  exam_type: string;
  exam_day: number;
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
];

// ─── Prompt builder ────────────────────────────────────────────────────────────

function buildPrompt(subject: SubjectConfig, count: number, batchIndex: number): string {
  // Rotate topics per batch for diversity
  const n = subject.topic_areas.length;
  const start = (batchIndex * 3) % n;
  const rotated = [
    ...subject.topic_areas.slice(start),
    ...subject.topic_areas.slice(0, start),
  ];
  const topics = rotated.slice(0, Math.min(4, n));

  return `สร้างข้อสอบ PLE (Pharmacy Licensing Examination) ไทย จำนวน ${count} ข้อ
หมวดวิชา: ${subject.name_th}
หัวข้อที่ครอบคลุม:
${topics.map((t, i) => `${i + 1}. ${t}`).join("\n")}

กฎ:
- ข้อสอบ 5 ตัวเลือก (A-E) แบบ MCQ เหมือนข้อสอบ PLE จริง
- เขียนเป็นภาษาไทยทั้งหมด ยกเว้นชื่อยา/คำศัพท์ทางวิชาชีพ
- โจทย์ realistic: ชื่อยา generic ที่ถูกต้อง, ขนาดยาที่ถูกต้อง
- difficulty: 40% easy, 40% medium, 20% hard (ระบุใน field)
- ตัวเลือกที่ผิดต้องสมเหตุสมผล (plausible distractors)
- ครอบคลุมหลาย topic ไม่ซ้ำกันในชุดนี้

ตอบเป็น JSON array เท่านั้น ห้ามใส่ข้อความอื่น:
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
      "reason": "อธิบายเหตุผล 2-3 ย่อหน้า: วิเคราะห์โจทย์ + หลักการทางวิทยาศาสตร์",
      "choices": [
        {"label": "A", "text": "...", "is_correct": false, "explanation": "ทำไมผิด 1-2 ประโยค"},
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

  const questions: GeneratedQuestion[] = [];
  for (const q of raw) {
    const item = q as Record<string, unknown>;
    if (
      typeof item.scenario === "string" &&
      Array.isArray(item.choices) &&
      (item.choices as unknown[]).length === 5 &&
      typeof item.correct_answer === "string" &&
      "ABCDE".includes(item.correct_answer as string) &&
      item.detailed_explanation
    ) {
      questions.push({
        subject_id: subjectId,
        exam_type: subject.exam_type,
        exam_day: subject.exam_day,
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
