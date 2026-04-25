-- Template: Create a single NLE question set and populate it with nursing MCQs.
-- Copy this file, edit the constants, run against Postgres production.
--
-- Prerequisites:
--   1. drizzle/0005_add_nle_to_question_sets.sql has been applied
--   2. NLE questions exist in mcq_questions with exam_type='NLE'
--
-- WARNING: This uses named generate_hex_id(). If your DB doesn't have that,
-- replace with gen_random_uuid() or any unique id.

-- ============================================================
-- Step 1: Create the set
-- ============================================================
WITH new_set AS (
  INSERT INTO question_sets (name, name_th, description, exam_type, question_count, price, original_price, is_bundle, is_active, sort_order)
  VALUES (
    'nle-starter',                        -- name (machine-readable)
    'NLE Starter (100 ข้อ)',              -- name_th (displayed)
    'ชุดเริ่มต้นสำหรับเตรียมสอบขึ้นทะเบียนพยาบาล ครอบคลุมทุกวิชา',
    'NLE',                                 -- exam_type (must be 'NLE')
    100,                                   -- question_count (update after step 2)
    290,                                   -- price in THB
    490,                                   -- original_price (strike-through), NULL if no discount
    false,                                 -- is_bundle
    true,                                  -- is_active (false = hidden)
    100                                    -- sort_order (lower = shown first)
  )
  RETURNING id
)
-- ============================================================
-- Step 2: Bundle existing NLE questions into the set
-- (takes the first 100 active NLE questions ordered by creation)
-- ============================================================
INSERT INTO set_questions (set_id, question_id, sort_order)
SELECT
  (SELECT id FROM new_set),
  q.id,
  ROW_NUMBER() OVER (ORDER BY q.created_at)
FROM mcq_questions q
WHERE q.exam_type = 'NLE' AND q.status = 'active'
ORDER BY q.created_at
LIMIT 100;

-- ============================================================
-- Step 3: Sync question_count to the actual number of rows in set_questions
-- ============================================================
UPDATE question_sets
SET question_count = (
  SELECT COUNT(*) FROM set_questions WHERE set_id = question_sets.id
)
WHERE exam_type = 'NLE';

-- Verify:
SELECT id, name_th, exam_type, question_count, price, is_active
FROM question_sets
WHERE exam_type = 'NLE'
ORDER BY sort_order;
