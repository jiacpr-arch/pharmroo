export interface McqSubject {
  id: string;
  name: string;
  name_th: string;
  icon: string;
  exam_type: "PLE-PC" | "PLE-CC1" | "both" | "NLE";
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
  exam_type: "PLE-PC" | "PLE-CC1" | "NLE";
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
  exam_type: "PLE-PC" | "PLE-CC1" | "NLE";
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
  { name: "pharma_chem", name_th: "เภสัชเคมี", icon: "⚗️" },
  { name: "pharmacology", name_th: "เภสัชวิทยา", icon: "💊" },
  { name: "pharma_care", name_th: "เภสัชกรรมบริบาล", icon: "🏥" },
  { name: "clinical_pharm", name_th: "เภสัชกรรมคลินิก", icon: "🩺" },
  { name: "pharm_tech", name_th: "เภสัชกรรมเทคโนโลยี", icon: "🏭" },
  { name: "biopharm", name_th: "ชีวเภสัชศาสตร์", icon: "🧬" },
  { name: "pharm_admin", name_th: "เภสัชศาสตร์สังคมและบริหาร", icon: "📋" },
  { name: "toxicology", name_th: "พิษวิทยา", icon: "☠️" },
  { name: "cosmetic", name_th: "เครื่องสำอาง", icon: "✨" },
  { name: "herbal_med", name_th: "เภสัชเวท/สมุนไพร", icon: "🌿" },
  { name: "pharm_law", name_th: "กฎหมายเภสัชกรรม", icon: "⚖️" },
  { name: "biochem", name_th: "ชีวเคมี", icon: "🔬" },
  { name: "public_health_pharm", name_th: "เภสัชสาธารณสุข", icon: "📊" },
  { name: "drug_info", name_th: "สารสนเทศทางยา", icon: "📖" },
  { name: "compounding", name_th: "การปรุงยา", icon: "🧪" },
  { name: "nutrition", name_th: "โภชนศาสตร์คลินิก", icon: "🥗" },
  { name: "pharma_marketing", name_th: "การตลาดยา", icon: "📈" },
] as const;
