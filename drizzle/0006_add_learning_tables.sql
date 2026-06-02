-- Migration: Microlearning (Duolingo-style) learning tables
-- Adds units → lessons → cards content model, per-user progress, and student Q&A.
-- Quizzes inside lessons reuse the existing mcq_questions bank.

-- ========================================
-- 1. Learning Units (one per subject / topic group)
-- ========================================
CREATE TABLE IF NOT EXISTS learning_units (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  subject_id text REFERENCES mcq_subjects(id) ON DELETE CASCADE,
  title_th text NOT NULL,
  description_th text,
  icon text NOT NULL DEFAULT '📘',
  sort_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

-- ========================================
-- 2. Learning Lessons
-- ========================================
CREATE TABLE IF NOT EXISTS learning_lessons (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  unit_id text NOT NULL REFERENCES learning_units(id) ON DELETE CASCADE,
  title_th text NOT NULL,
  subtitle_th text,
  icon text NOT NULL DEFAULT '⭐',
  sort_order integer NOT NULL DEFAULT 0,
  est_minutes integer NOT NULL DEFAULT 5,
  xp_reward integer NOT NULL DEFAULT 10,
  quiz_question_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  quiz_count integer NOT NULL DEFAULT 3,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

-- ========================================
-- 3. Lesson Cards (ordered content steps)
-- ========================================
CREATE TABLE IF NOT EXISTS lesson_cards (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  lesson_id text NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
  card_type text NOT NULL DEFAULT 'concept'
    CHECK (card_type IN ('concept', 'example', 'tip', 'mnemonic', 'warning', 'qa')),
  title_th text,
  body_md text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  source text NOT NULL DEFAULT 'authored' CHECK (source IN ('authored', 'student_qa')),
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

-- ========================================
-- 4. Lesson Progress (per user per lesson)
-- ========================================
CREATE TABLE IF NOT EXISTS lesson_progress (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id text NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score integer NOT NULL DEFAULT 0,
  quiz_total integer NOT NULL DEFAULT 0,
  last_card_index integer NOT NULL DEFAULT 0,
  completed_at text,
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_user_lesson ON lesson_progress(user_id, lesson_id);

-- ========================================
-- 5. Lesson Questions (student Q&A — answered via API, auto-appended as a qa card)
-- ========================================
CREATE TABLE IF NOT EXISTS lesson_questions (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id text NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer_md text,
  card_id text REFERENCES lesson_cards(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'answered' CHECK (status IN ('answered', 'failed')),
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

-- ========================================
-- Supporting indexes
-- ========================================
CREATE INDEX IF NOT EXISTS idx_units_subject ON learning_units(subject_id);
CREATE INDEX IF NOT EXISTS idx_lessons_unit ON learning_lessons(unit_id);
CREATE INDEX IF NOT EXISTS idx_cards_lesson ON lesson_cards(lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_lesson ON lesson_questions(lesson_id);
