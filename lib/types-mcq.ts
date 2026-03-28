export interface McqSubject {
  id: string;
  name: string;
  name_th: string;
  icon: string;
  exam_type: "PLE-PC" | "PLE-CC1" | "both";
  question_count: number;
  created_at: string;
}

export interface McqChoice {
  label: string;
  text: string;
}

export interface McqChoiceExplanation {
  label: string;
  text: string;
  is_correct: boolean;
  explanation: string;
}

export interface McqQuestion {
  id: string;
  subject_id: string;
  exam_type: "PLE-PC" | "PLE-CC1";
  exam_source: string | null;
  exam_day: 1 | 2 | null;
  question_number: number | null;
  scenario: string;
  image_url: string | null;
  choices: McqChoice[];
  correct_answer: string;
  explanation: string | null;
  detailed_explanation: {
    summary: string;
    reason: string;
    choices: McqChoiceExplanation[];
    key_takeaway: string;
    calculation_steps?: string[];
  } | null;
  difficulty: "easy" | "medium" | "hard";
  is_ai_enhanced: boolean;
  ai_notes: string | null;
  status: "active" | "review" | "disabled";
  created_at: string;
  // joined
  mcq_subjects?: McqSubject;
}

export interface McqAttempt {
  id: string;
  user_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  time_spent_seconds: number | null;
  mode: "practice" | "mock";
  session_id: string | null;
  created_at: string;
}

export interface McqSession {
  id: string;
  user_id: string;
  mode: "practice" | "mock";
  exam_type: "PLE-PC" | "PLE-CC1";
  exam_day: 1 | 2 | null;
  subject_id: string | null;
  total_questions: number;
  correct_count: number;
  time_limit_minutes: number | null;
  completed_at: string | null;
  created_at: string;
}

export interface QuestionSet {
  id: string;
  name: string;
  name_th: string;
  description: string | null;
  exam_type: "PLE-CC1" | "PLE-PC1" | "PLE-IP1" | "PLE-PHCP1" | "mixed" | null;
  exam_day: 1 | 2 | null;
  question_count: number;
  price: number;
  original_price: number | null;
  is_bundle: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  // joined
  user_purchased?: boolean;
}

export interface SetPurchase {
  id: string;
  user_id: string;
  set_id: string;
  payment_order_id: string | null;
  status: "pending" | "active" | "refunded";
  purchased_at: string | null;
  created_at: string;
}

export const MCQ_SUBJECTS = [
  { name: "pharmacotherapy", name_th: "Pharmacotherapy", icon: "💊" },
  { name: "pharma_tech", name_th: "เทคโนโลยีเภสัชกรรม", icon: "🧪" },
  { name: "pharma_chem", name_th: "เภสัชเคมี", icon: "⚗️" },
  { name: "pharma_analysis", name_th: "เภสัชวิเคราะห์", icon: "🔬" },
  { name: "pharmacokinetics", name_th: "เภสัชจลนศาสตร์", icon: "📈" },
  { name: "pharma_law", name_th: "กฎหมายยา/จริยธรรม", icon: "⚖️" },
  { name: "herbal", name_th: "สมุนไพร/ผลิตภัณฑ์สุขภาพ", icon: "🌿" },
] as const;
