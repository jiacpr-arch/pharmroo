-- Seed question_sets
-- Run after pharmroo_schema.sql

INSERT INTO question_sets (id, name, name_th, description, exam_type, exam_day, question_count, price, original_price, is_bundle, is_active, sort_order)
VALUES
  (
    gen_random_uuid(),
    'PLE-CC1 Day 1',
    'PLE-CC1 วันที่ 1 (120 ข้อ)',
    'ข้อสอบ PLE-CC1 วันที่ 1 ครอบคลุม Pharmacotherapy, Pharmaceutical Technology, Pharmaceutical Chemistry',
    'PLE-CC1',
    1,
    120,
    390,
    490,
    false,
    true,
    10
  ),
  (
    gen_random_uuid(),
    'PLE-CC1 Day 2',
    'PLE-CC1 วันที่ 2 (120 ข้อ)',
    'ข้อสอบ PLE-CC1 วันที่ 2 ครอบคลุม Pharmaceutical Analysis, Pharmacokinetics, Pharmacy Law, Herbal',
    'PLE-CC1',
    2,
    120,
    390,
    490,
    false,
    true,
    20
  ),
  (
    gen_random_uuid(),
    'PLE-CC1 Full (Day 1+2)',
    'PLE-CC1 ครบ 2 วัน (240 ข้อ)',
    'ชุดรวม PLE-CC1 ทั้ง 2 วัน 240 ข้อ ครอบคลุมทุกหมวดวิชา — ประหยัดกว่าซื้อแยก',
    'PLE-CC1',
    NULL,
    240,
    590,
    780,
    false,
    true,
    30
  ),
  (
    gen_random_uuid(),
    'PLE-PC1',
    'PLE-PC1 เภสัชกรรมบริบาล (120 ข้อ)',
    'ข้อสอบสำหรับนักศึกษาเภสัชสาขาบริบาลเภสัชกรรม (Clinical Pharmacy) 120 ข้อ',
    'PLE-PC1',
    NULL,
    120,
    490,
    590,
    false,
    true,
    40
  ),
  (
    gen_random_uuid(),
    'Bundle All Sets',
    'Bundle ทุกชุด — ประหยัดสุด',
    'รวมทุกชุดข้อสอบ PLE-CC1 (Day1+Day2) + PLE-PC1 รวม 360 ข้อ — ประหยัดกว่า 40% เมื่อเทียบกับซื้อแยก',
    'mixed',
    NULL,
    360,
    990,
    1370,
    true,
    true,
    5
  );
