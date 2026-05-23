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
  role: text("role", { enum: ["user", "admin", "nursing_admin"] }).notNull().default("user"),
  membership_type: text("membership_type", {
    enum: ["free", "monthly", "yearly"],
  })
    .notNull()
    .default("free"),
  membership_expires_at: text("membership_expires_at"),
  onboarding_done: boolean("onboarding_done").notNull().default(false),
  daily_goal: integer("daily_goal").notNull().default(20),
  target_exam: text("target_exam"),
  exam_category: text("exam_category", { enum: ["pharmacy", "nursing"] }),
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
  exam_type: text("exam_type", { enum: ["PLE-PC", "PLE-CC1", "both", "NLE"] })
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
  exam_type: text("exam_type", { enum: ["PLE-PC", "PLE-CC1", "NLE"] })
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
  exam_type: text("exam_type", { enum: ["PLE-PC", "PLE-CC1", "NLE"] })
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
    enum: ["PLE-CC1", "PLE-PC1", "PLE-IP1", "PLE-PHCP1", "NLE", "mixed"],
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
// 12. Referrals
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
// 20. Landing Pages (targets for ad-driven auto-optimization)
// ========================================
export const landingPages = pgTable("landing_pages", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  path: text("path").notNull().unique(),
  name: text("name").notNull(),
  conversion_event: text("conversion_event").notNull().default("signup"),
  ctr_threshold: real("ctr_threshold").notNull().default(0.01),
  cpa_threshold_thb: real("cpa_threshold_thb").notNull().default(150),
  roas_threshold: real("roas_threshold").notNull().default(1.0),
  auto_optimize: boolean("auto_optimize").notNull().default(false),
  status: text("status", { enum: ["active", "paused"] }).notNull().default("active"),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// ========================================
// 21. Ad Campaigns (cross-platform registry)
// ========================================
export const adCampaigns = pgTable(
  "ad_campaigns",
  {
    id: text("id")
      .primaryKey()
      .default(sql`generate_hex_id()`),
    platform: text("platform", { enum: ["meta", "google", "tiktok", "ga4"] }).notNull(),
    external_id: text("external_id").notNull(),
    name: text("name").notNull(),
    landing_page_id: text("landing_page_id").references(() => landingPages.id, {
      onDelete: "set null",
    }),
    status: text("status", { enum: ["active", "paused", "archived"] })
      .notNull()
      .default("active"),
    last_synced_at: text("last_synced_at"),
    created_at: text("created_at")
      .notNull()
      .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
  },
  (t) => ({
    platformExternal: uniqueIndex("ad_campaigns_platform_external_idx").on(
      t.platform,
      t.external_id
    ),
  })
);

// ========================================
// 22. Ad Metrics Daily (time series per campaign)
// ========================================
export const adMetricsDaily = pgTable(
  "ad_metrics_daily",
  {
    id: text("id")
      .primaryKey()
      .default(sql`generate_hex_id()`),
    campaign_id: text("campaign_id")
      .notNull()
      .references(() => adCampaigns.id, { onDelete: "cascade" }),
    date: text("date").notNull(),
    impressions: integer("impressions").notNull().default(0),
    clicks: integer("clicks").notNull().default(0),
    ctr: real("ctr").notNull().default(0),
    spend_thb: real("spend_thb").notNull().default(0),
    conversions: integer("conversions").notNull().default(0),
    cpa_thb: real("cpa_thb"),
    roas: real("roas"),
    raw: jsonb("raw"),
    ingested_at: text("ingested_at")
      .notNull()
      .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
  },
  (t) => ({
    campaignDate: uniqueIndex("ad_metrics_campaign_date_idx").on(t.campaign_id, t.date),
  })
);

// ========================================
// 23. Page Variants (A/B variants generated by Claude)
// ========================================
export const pageVariants = pgTable("page_variants", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  landing_page_id: text("landing_page_id")
    .notNull()
    .references(() => landingPages.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  patch: jsonb("patch").notNull().default(sql`'{}'::jsonb`),
  traffic_pct: integer("traffic_pct").notNull().default(0),
  is_active: boolean("is_active").notNull().default(false),
  is_baseline: boolean("is_baseline").notNull().default(false),
  created_by: text("created_by", { enum: ["claude", "human"] }).notNull().default("claude"),
  metrics_summary: jsonb("metrics_summary"),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
});

// ========================================
// 24. Optimization Runs (audit trail of auto-fix attempts)
// ========================================
export const optimizationRuns = pgTable("optimization_runs", {
  id: text("id")
    .primaryKey()
    .default(sql`generate_hex_id()`),
  landing_page_id: text("landing_page_id")
    .notNull()
    .references(() => landingPages.id, { onDelete: "cascade" }),
  trigger: text("trigger", { enum: ["scheduled", "manual", "alert"] })
    .notNull()
    .default("scheduled"),
  reason: jsonb("reason").notNull().default(sql`'{}'::jsonb`),
  proposal: jsonb("proposal"),
  applied_variant_id: text("applied_variant_id").references(() => pageVariants.id, {
    onDelete: "set null",
  }),
  status: text("status", {
    enum: ["pending", "proposed", "applied", "rejected", "rolled_back", "failed"],
  })
    .notNull()
    .default("pending"),
  error: text("error"),
  created_at: text("created_at")
    .notNull()
    .default(sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`),
  completed_at: text("completed_at"),
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
export type Referral = typeof referrals.$inferSelect;
export type LineLinkCode = typeof lineLinkCodes.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type AppSetting = typeof appSettings.$inferSelect;
export type LandingPage = typeof landingPages.$inferSelect;
export type AdCampaign = typeof adCampaigns.$inferSelect;
export type AdMetricsDaily = typeof adMetricsDaily.$inferSelect;
export type PageVariant = typeof pageVariants.$inferSelect;
export type OptimizationRun = typeof optimizationRuns.$inferSelect;
