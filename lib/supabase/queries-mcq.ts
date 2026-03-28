import { createClient } from "./server";
import type { McqSubject, McqQuestion, QuestionSet, SetPurchase } from "../types-mcq";

export async function getMcqSubjects(): Promise<McqSubject[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mcq_subjects")
    .select("*")
    .order("name_th", { ascending: true });

  if (error) {
    console.error("Error fetching MCQ subjects:", error);
    return [];
  }
  return (data as McqSubject[]) || [];
}

export async function getMcqQuestions(options?: {
  subjectId?: string;
  examType?: string;
  examDay?: 1 | 2;
  setId?: string;
  limit?: number;
  randomize?: boolean;
}): Promise<McqQuestion[]> {
  const supabase = await createClient();

  // If setId provided, join through set_questions
  if (options?.setId) {
    const { data, error } = await supabase
      .from("set_questions")
      .select("question_id, sort_order, mcq_questions!inner(*, mcq_subjects(name, name_th, icon))")
      .eq("set_id", options.setId)
      .order("sort_order", { ascending: true })
      .limit(options.limit || 300);

    if (error || !data) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let questions = data.map((row: any) => row.mcq_questions as McqQuestion);
    if (options.randomize) questions = questions.sort(() => Math.random() - 0.5);
    return questions;
  }

  let query = supabase
    .from("mcq_questions")
    .select("*, mcq_subjects(name, name_th, icon)")
    .eq("status", "active");

  if (options?.subjectId) {
    query = query.eq("subject_id", options.subjectId);
  }
  if (options?.examType) {
    query = query.eq("exam_type", options.examType);
  }
  if (options?.examDay) {
    query = query.eq("exam_day", options.examDay);
  }

  const limit = options?.limit || 50;
  query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching MCQ questions:", error);
    return [];
  }

  let questions = (data as McqQuestion[]) || [];

  // Shuffle if randomize
  if (options?.randomize) {
    questions = questions.sort(() => Math.random() - 0.5);
  }

  return questions;
}

export async function getMcqQuestion(id: string): Promise<McqQuestion | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mcq_questions")
    .select("*, mcq_subjects(name, name_th, icon)")
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (error) {
    console.error("Error fetching MCQ question:", error);
    return null;
  }
  return data as McqQuestion;
}

export async function getQuestionSets(userId?: string): Promise<QuestionSet[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("question_sets")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  if (!userId) return data as QuestionSet[];

  // Check which sets the user has purchased
  const { data: purchases } = await supabase
    .from("set_purchases")
    .select("set_id")
    .eq("user_id", userId)
    .eq("status", "active");

  const purchasedIds = new Set((purchases || []).map((p: { set_id: string }) => p.set_id));
  return (data as QuestionSet[]).map((s) => ({
    ...s,
    user_purchased: purchasedIds.has(s.id),
  }));
}

export async function getQuestionSet(id: string): Promise<QuestionSet | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("question_sets")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as QuestionSet;
}

export async function getUserSetPurchases(userId: string): Promise<SetPurchase[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("set_purchases")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active");

  if (error || !data) return [];
  return data as SetPurchase[];
}

export async function getMcqSubjectCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mcq_questions")
    .select("subject_id")
    .eq("status", "active");

  if (error || !data) return {};

  const counts: Record<string, number> = {};
  for (const row of data) {
    counts[row.subject_id] = (counts[row.subject_id] || 0) + 1;
  }
  return counts;
}
