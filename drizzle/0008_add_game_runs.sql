-- Migration: game_runs — ผลการเล่นเกมร้านยา (/game) หนึ่งแถวต่อการเล่นจบ 1 รอบ
-- XP ของเกมเก็บต่อแถว (คำนวณฝั่ง server จาก won/grade) แยกจาก XP ของ dashboard
-- ซึ่งคิดจากจำนวนข้อ MCQ ที่ทำ; badge ของเกมใช้ตาราง user_challenges ที่มีอยู่แล้ว

CREATE TABLE IF NOT EXISTS game_runs (
  id text PRIMARY KEY DEFAULT generate_hex_id(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scenario_slug text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'normal', 'hard')),
  won boolean NOT NULL,
  grade text NOT NULL CHECK (grade IN ('S', 'A', 'B', 'C')),
  score integer NOT NULL DEFAULT 0,
  wrong_count integer NOT NULL DEFAULT 0,
  duration_sec integer NOT NULL DEFAULT 0,
  xp integer NOT NULL DEFAULT 0,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
);

CREATE INDEX IF NOT EXISTS idx_game_runs_user_created
  ON game_runs (user_id, created_at);

CREATE INDEX IF NOT EXISTS idx_game_runs_user_slug
  ON game_runs (user_id, scenario_slug);
