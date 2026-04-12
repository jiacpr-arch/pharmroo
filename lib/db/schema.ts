import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ========================================
// 1. Users (replaces Supabase auth.users + profiles)
// ========================================
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default(""),
  password_hash: text("password_hash"),
  role: text("role", { enum: ["user", "admin"] }).notNull().default("user"),
  membership_type: text("membership_type", {
    enum: ["free", "monthly", "yearly"],
  })
    .notNull()
    .default("free"),
  membership_expires_at: text("membership_expires_at"),
  onboarding_done: boolean("onboarding_done").notNull().default(false),
  daily_goal: integer("daily_goal").notNull().default(20),
  target_exam: text("target_exam"),
  weak_subjects: jsonb("weak_subjects").default(sql`'[]'::jsonb`),
  line_user_id: text("line_user_id"),
  line_linked_at: text("line_linked_at"),
  referral_code: text("referral_code").unique(),
  referred_by: text("referred_by"),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// NextAuth sessions
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires_at: integer("expires_at").notNull(),
});

// ========================================
// 2. MCQ Subjects
// ========================================
export const mcqSubjects = pgTable("mcq_subjects", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  name: text("name").notNull().unique(),
  name_th: text("name_th").notNull(),
  icon: text("icon").notNull().default("📝"),
  exam_type: text("exam_type", { enum: ["PLE-PC", "PLE-CC1", "both"] })
    .notNull()
    .default("both"),
  question_count: integer("question_count").notNull().default(0),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// ========================================
// 3. MCQ Questions
// ========================================
export const mcqQuestions = pgTable("mcq_questions", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  subject_id: text("subject_id").references(() => mcqSubjects.id),
  exam_type: text("exam_type", { enum: ["PLE-PC", "PLE-CC1"] })
    .notNull()
    .default("PLE-CC1"),
  exam_source: text("exam_source"),
  exam_day: integer("exam_day"),
  question_number: integer("question_number"),
  scenario: text("scenario").notNull(),
  image_url: text("image_url"),
  choices: jsonb("choices").notNull().default(sql`'[]'::jsonb`),
  correct_answer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  detailed_explanation: jsonb("detailed_explanation"),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] })
    .notNull()
    .default("medium"),
  is_ai_enhanced: boolean("is_ai_enhanced").notNull().default(false),
  ai_notes: text("ai_notes"),
  status: text("status", { enum: ["active", "review", "disabled"] })
    .notNull()
    .default("active"),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// ========================================
// 4. MCQ Attempts
// ========================================
export const mcqAttempts = pgTable("mcq_attempts", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  user_id: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  question_id: text("question_id").references(() => mcqQuestions.id, {
    onDelete: "cascade",
  }),
  selected_answer: text("selected_answer").notNull(),
  is_correct: boolean("is_correct").notNull(),
  time_spent_seconds: integer("time_spent_seconds"),
  mode: text("mode", { enum: ["practice", "mock"] })
    .notNull()
    .default("practice"),
  session_id: text("session_id"),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// ========================================
// 5. MCQ Sessions
// ========================================
export const mcqSessions = pgTable("mcq_sessions", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  user_id: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  mode: text("mode", { enum: ["practice", "mock"] })
    .notNull()
    .default("practice"),
  exam_type: text("exam_type", { enum: ["PLE-PC", "PLE-CC1"] })
    .notNull()
    .default("PLE-CC1"),
  exam_day: integer("exam_day"),
  subject_id: text("subject_id").references(() => mcqSubjects.id),
  total_questions: integer("total_questions").notNull().default(0),
  correct_count: integer("correct_count").notNull().default(0),
  time_limit_minutes: integer("time_limit_minutes"),
  completed_at: text("completed_at"),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// ========================================
// 6. Question Sets
// ========================================
export const questionSets = pgTable("question_sets", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  name: text("name").notNull(),
  name_th: text("name_th").notNull(),
  description: text("description"),
  exam_type: text("exam_type", {
    enum: ["PLE-CC1", "PLE-PC1", "PLE-IP1", "PLE-PHCP1", "mixed"],
  }),
  exam_day: integer("exam_day"),
  question_count: integer("question_count").notNull().default(0),
  price: real("price").notNull(),
  original_price: real("original_price"),
  is_bundle: boolean("is_bundle").notNull().default(false),
  is_active: boolean("is_active").notNull().default(true),
  sort_order: integer("sort_order").notNull().default(0),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// ========================================
// 7. Set Questions (many-to-many)
// ========================================
export const setQuestions = pgTable(
  "set_questions",
  {
    set_id: text("set_id").references(() => questionSets.id, {
      onDelete: "cascade",
    }),
    question_id: text("question_id").references(() => mcqQuestions.id, {
      onDelete: "cascade",
    }),
    sort_order: integer("sort_order").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.set_id, t.question_id] })]
);

// ========================================
// 8. Set Purchases
// ========================================
export const setPurchases = pgTable("set_purchases", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  user_id: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  set_id: text("set_id").references(() => questionSets.id, {
    onDelete: "cascade",
  }),
  payment_order_id: text("payment_order_id"),
  status: text("status", { enum: ["pending", "active", "refunded"] })
    .notNull()
    .default("pending"),
  purchased_at: text("purchased_at"),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// ========================================
// 9. Payment Orders
// ========================================
export const paymentOrders = pgTable("payment_orders", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  user_id: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  order_type: text("order_type", { enum: ["subscription", "set"] })
    .notNull()
    .default("subscription"),
  plan_type: text("plan_type", { enum: ["monthly", "yearly"] }),
  set_id: text("set_id").references(() => questionSets.id),
  amount: real("amount").notNull(),
  slip_url: text("slip_url"),
  status: text("status", { enum: ["pending", "approved", "rejected"] })
    .notNull()
    .default("pending"),
  reviewed_by: text("reviewed_by").references(() => users.id),
  reviewed_at: text("reviewed_at"),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
  invoice_requested: boolean("invoice_requested").default(false),
  invoice_type: text("invoice_type", { enum: ["personal", "company"] }),
  invoice_name: text("invoice_name"),
  invoice_tax_id: text("invoice_tax_id"),
  invoice_address: text("invoice_address"),
  invoice_branch: text("invoice_branch"),
  stripe_session_id: text("stripe_session_id"),
  payment_method: text("payment_method").default("stripe"),
});

// ========================================
// 10. User Challenges
// ========================================
export const userChallenges = pgTable(
  "user_challenges",
  {
    id: text("id").primaryKey().default(sql`generate_hex_id()`),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    challenge_id: text("challenge_id").notNull(),
    completed_at: text("completed_at")
      .notNull()
      .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
  },
  (t) => [uniqueIndex("uq_user_challenge").on(t.user_id, t.challenge_id)]
);

// ========================================
// 11. Invoices
// ========================================
export const invoices = pgTable("invoices", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  invoice_number: text("invoice_number").notNull().unique(),
  user_id: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  order_id: text("order_id").references(() => paymentOrders.id),
  payment_method: text("payment_method").notNull().default("stripe"),
  stripe_session_id: text("stripe_session_id"),
  plan_type: text("plan_type"),
  order_type: text("order_type", { enum: ["subscription", "set"] }),
  set_name: text("set_name"),
  amount: real("amount").notNull(),
  vat_amount: real("vat_amount").notNull(),
  total_amount: real("total_amount").notNull(),
  buyer_name: text("buyer_name"),
  buyer_tax_id: text("buyer_tax_id"),
  buyer_address: text("buyer_address"),
  buyer_email: text("buyer_email"),
  status: text("status", { enum: ["paid", "voided"] })
    .notNull()
    .default("paid"),
  issued_at: text("issued_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// ========================================
// 12. Exams (MEQ — Progressive Case)
// ========================================
export const exams = pgTable("exams", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] })
    .notNull()
    .default("medium"),
  status: text("status", { enum: ["draft", "published", "archived"] })
    .notNull()
    .default("published"),
  is_free: boolean("is_free").notNull().default(false),
  publish_date: text("publish_date"),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// ========================================
// 13. Exam Parts (MEQ parts — 6 ตอนต่อเคส)
// ========================================
export const examParts = pgTable("exam_parts", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  exam_id: text("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  part_number: integer("part_number").notNull(),
  scenario: text("scenario").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  key_points: jsonb("key_points").default(sql`'[]'::jsonb`),
  time_minutes: integer("time_minutes").notNull().default(10),
});

// ========================================
// 14. Long Cases (OSCE-style — AI Patient Simulation)
// ========================================
export const longCases = pgTable("long_cases", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  title: text("title").notNull(),
  specialty: text("specialty").notNull(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] })
    .notNull()
    .default("medium"),
  patient_info: jsonb("patient_info").notNull(),
  history_script: jsonb("history_script").notNull(),
  pe_findings: jsonb("pe_findings").notNull(),
  lab_results: jsonb("lab_results").notNull(),
  correct_diagnosis: text("correct_diagnosis").notNull(),
  accepted_ddx: jsonb("accepted_ddx").default(sql`'[]'::jsonb`),
  management_plan: text("management_plan").notNull(),
  scoring_rubric: jsonb("scoring_rubric").notNull(),
  status: text("status", { enum: ["draft", "published", "archived"] })
    .notNull()
    .default("published"),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// ========================================
// 15. Long Case Sessions (user play-through)
// ========================================
export const longCaseSessions = pgTable("long_case_sessions", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  long_case_id: text("long_case_id")
    .notNull()
    .references(() => longCases.id, { onDelete: "cascade" }),
  phase: text("phase", {
    enum: ["history", "pe_lab", "diagnosis", "examiner", "scoring", "completed"],
  })
    .notNull()
    .default("history"),
  history_messages: jsonb("history_messages").default(sql`'[]'::jsonb`),
  selected_pe: jsonb("selected_pe").default(sql`'[]'::jsonb`),
  selected_labs: jsonb("selected_labs").default(sql`'[]'::jsonb`),
  diagnosis_submission: jsonb("diagnosis_submission"),
  examiner_messages: jsonb("examiner_messages").default(sql`'[]'::jsonb`),
  scores: jsonb("scores"),
  total_score: real("total_score"),
  completed_at: text("completed_at"),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// ========================================
// 16. Referrals
// ========================================
export const referrals = pgTable("referrals", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  referrer_id: text("referrer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  referred_id: text("referred_id").references(() => users.id, {
    onDelete: "set null",
  }),
  code: text("code").notNull().unique(),
  status: text("status", { enum: ["pending", "rewarded"] })
    .notNull()
    .default("pending"),
  reward_days: integer("reward_days").notNull().default(30),
  rewarded_at: text("rewarded_at"),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// ========================================
// 17. LINE Link Codes (for OA linking)
// ========================================
export const lineLinkCodes = pgTable("line_link_codes", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  code: text("code").notNull().unique(),
  expires_at: text("expires_at").notNull(),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// ========================================
// 18. Blog Posts (AI auto-generated)
// ========================================
export const blogPosts = pgTable("blog_posts", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  reading_time: integer("reading_time").notNull().default(3),
  content: text("content").notNull(),
  cover_image: text("cover_image"),
  published_at: text("published_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// ========================================
// 19. App Settings (key-value store)
// ========================================
export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// ========================================
// Types
// ========================================
export type Invoice = typeof invoices.$inferSelect;
export type User = typeof users.$inferSelect;
export type McqSubject = typeof mcqSubjects.$inferSelect;
export type McqQuestion = typeof mcqQuestions.$inferSelect;
export type McqAttempt = typeof mcqAttempts.$inferSelect;
export type McqSession = typeof mcqSessions.$inferSelect;
export type QuestionSet = typeof questionSets.$inferSelect;
export type SetPurchase = typeof setPurchases.$inferSelect;
export type PaymentOrder = typeof paymentOrders.$inferSelect;
export type Exam = typeof exams.$inferSelect;
export type ExamPart = typeof examParts.$inferSelect;
export type LongCase = typeof longCases.$inferSelect;
export type LongCaseSession = typeof longCaseSessions.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
export type LineLinkCode = typeof lineLinkCodes.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type AppSetting = typeof appSettings.$inferSelect;
