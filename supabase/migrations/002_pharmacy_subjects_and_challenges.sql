-- ============================================================
-- 002: Pharmacy MCQ Subjects seed + User Challenges tracking
-- ============================================================

-- ── 1. Upsert 17 pharmacy subjects ──────────────────────────
INSERT INTO mcq_subjects (name, name_th, icon, exam_type)
VALUES
  ('pharma_chem',          'เภสัชเคมี',                    '⚗️',  'both'),
  ('pharmacology',         'เภสัชวิทยา',                   '💊',  'both'),
  ('pharma_care',          'เภสัชกรรมบริบาล',              '🏥',  'both'),
  ('clinical_pharm',       'เภสัชกรรมคลินิก',              '🩺',  'both'),
  ('pharm_tech',           'เภสัชกรรมเทคโนโลยี',           '🏭',  'both'),
  ('biopharm',             'ชีวเภสัชศาสตร์',               '🧬',  'both'),
  ('pharm_admin',          'เภสัชศาสตร์สังคมและบริหาร',    '📋',  'both'),
  ('toxicology',           'พิษวิทยา',                     '☠️',  'both'),
  ('cosmetic',             'เครื่องสำอาง',                 '✨',  'both'),
  ('herbal_med',           'เภสัชเวท/สมุนไพร',             '🌿',  'both'),
  ('pharm_law',            'กฎหมายเภสัชกรรม',              '⚖️',  'both'),
  ('biochem',              'ชีวเคมี',                      '🔬',  'both'),
  ('public_health_pharm',  'เภสัชสาธารณสุข',               '📊',  'both'),
  ('drug_info',            'สารสนเทศทางยา',                '📖',  'both'),
  ('compounding',          'การปรุงยา',                    '🧪',  'both'),
  ('nutrition',            'โภชนศาสตร์คลินิก',             '🥗',  'both'),
  ('pharma_marketing',     'การตลาดยา',                    '📈',  'both')
ON CONFLICT (name) DO UPDATE
  SET name_th   = EXCLUDED.name_th,
      icon      = EXCLUDED.icon,
      exam_type = EXCLUDED.exam_type;

-- ── 2. User Challenges tracking table ───────────────────────
CREATE TABLE IF NOT EXISTS user_challenges (
  id           TEXT PRIMARY KEY DEFAULT generate_hex_id(),
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  completed_at TEXT NOT NULL DEFAULT (to_char(now(), 'YYYY-MM-DD HH24:MI:SS')),
  UNIQUE (user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_challenges_user ON user_challenges(user_id);

-- ── 3. Helper view: daily attempt counts per user ───────────
-- Used by streak and daily-challenge checks
CREATE OR REPLACE VIEW user_daily_attempts AS
SELECT
  user_id,
  DATE(created_at::timestamp) AS attempt_day,
  COUNT(*)                    AS attempt_count,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) AS correct_count
FROM mcq_attempts
GROUP BY user_id, DATE(created_at::timestamp);
