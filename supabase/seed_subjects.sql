-- Seed pharmacy subjects for PharmRoo
INSERT INTO public.mcq_subjects (name, name_th, icon, exam_type) VALUES
  ('pharmacotherapy', 'Pharmacotherapy', '💊', 'both'),
  ('pharma_tech', 'เทคโนโลยีเภสัชกรรม', '🧪', 'both'),
  ('pharma_chem', 'เภสัชเคมี', '⚗️', 'PLE-PC'),
  ('pharma_analysis', 'เภสัชวิเคราะห์', '🔬', 'both'),
  ('pharmacokinetics', 'เภสัชจลนศาสตร์', '📈', 'both'),
  ('pharma_law', 'กฎหมายยา/จริยธรรม', '⚖️', 'both'),
  ('herbal', 'สมุนไพร/ผลิตภัณฑ์สุขภาพ', '🌿', 'both')
ON CONFLICT (name) DO NOTHING;
