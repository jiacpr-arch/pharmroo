-- PharmRoo Database Schema
-- สำหรับ Supabase project ใหม่

-- ========================================
-- 1. Profiles (users)
-- ========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT DEFAULT '',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  membership_type TEXT DEFAULT 'free' CHECK (membership_type IN ('free', 'monthly', 'yearly')),
  membership_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- 2. MCQ Subjects (หมวดวิชาเภสัช)
-- ========================================
CREATE TABLE IF NOT EXISTS public.mcq_subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  name_th TEXT NOT NULL,
  icon TEXT DEFAULT '📝',
  exam_type TEXT DEFAULT 'both' CHECK (exam_type IN ('PLE-PC', 'PLE-CC1', 'both')),
  question_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mcq_subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read subjects" ON public.mcq_subjects FOR SELECT USING (true);

-- ========================================
-- 3. MCQ Questions
-- ========================================
CREATE TABLE IF NOT EXISTS public.mcq_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES public.mcq_subjects(id),
  exam_type TEXT DEFAULT 'PLE-CC1' CHECK (exam_type IN ('PLE-PC', 'PLE-CC1')),
  exam_source TEXT,
  exam_day SMALLINT CHECK (exam_day IN (1, 2)),
  question_number INTEGER,
  scenario TEXT NOT NULL,
  image_url TEXT,
  choices JSONB NOT NULL DEFAULT '[]',
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  detailed_explanation JSONB,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_ai_enhanced BOOLEAN DEFAULT FALSE,
  ai_notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'review', 'disabled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mcq_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active questions" ON public.mcq_questions FOR SELECT
  USING (status = 'active');
CREATE POLICY "Admin can manage questions" ON public.mcq_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ========================================
-- 4. MCQ Attempts (user answers)
-- ========================================
CREATE TABLE IF NOT EXISTS public.mcq_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.mcq_questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INTEGER,
  mode TEXT DEFAULT 'practice' CHECK (mode IN ('practice', 'mock')),
  session_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mcq_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own attempts" ON public.mcq_attempts FOR ALL
  USING (auth.uid() = user_id);

-- ========================================
-- 5. MCQ Sessions
-- ========================================
CREATE TABLE IF NOT EXISTS public.mcq_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mode TEXT DEFAULT 'practice' CHECK (mode IN ('practice', 'mock')),
  exam_type TEXT DEFAULT 'PLE-CC1' CHECK (exam_type IN ('PLE-PC', 'PLE-CC1')),
  exam_day SMALLINT CHECK (exam_day IN (1, 2)),
  subject_id UUID REFERENCES public.mcq_subjects(id),
  total_questions INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  time_limit_minutes INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mcq_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own sessions" ON public.mcq_sessions FOR ALL
  USING (auth.uid() = user_id);

-- ========================================
-- 6. Question Sets (ชุดข้อสอบ)
-- ========================================
CREATE TABLE IF NOT EXISTS public.question_sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_th TEXT NOT NULL,
  description TEXT,
  exam_type TEXT CHECK (exam_type IN ('PLE-CC1', 'PLE-PC1', 'PLE-IP1', 'PLE-PHCP1', 'mixed')),
  exam_day SMALLINT CHECK (exam_day IN (1, 2)),
  question_count INTEGER DEFAULT 0,
  price NUMERIC NOT NULL,
  original_price NUMERIC,             -- ราคาก่อนลด (แสดงขีดฆ่า)
  is_bundle BOOLEAN DEFAULT FALSE,    -- ชุดรวม
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.question_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active sets" ON public.question_sets FOR SELECT
  USING (is_active = TRUE);
CREATE POLICY "Admin can manage sets" ON public.question_sets FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ========================================
-- 7. Set Questions (many-to-many)
-- ========================================
CREATE TABLE IF NOT EXISTS public.set_questions (
  set_id UUID REFERENCES public.question_sets(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.mcq_questions(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (set_id, question_id)
);

ALTER TABLE public.set_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read set questions" ON public.set_questions FOR SELECT USING (true);
CREATE POLICY "Admin can manage set questions" ON public.set_questions FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ========================================
-- 8. Set Purchases (การซื้อชุดข้อสอบ)
-- ========================================
CREATE TABLE IF NOT EXISTS public.set_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  set_id UUID REFERENCES public.question_sets(id) ON DELETE CASCADE,
  payment_order_id UUID,              -- FK to payment_orders after creation
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'refunded')),
  purchased_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, set_id)
);

ALTER TABLE public.set_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own set purchases" ON public.set_purchases FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create set purchases" ON public.set_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can manage set purchases" ON public.set_purchases FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ========================================
-- 9. Payment Orders
-- ========================================
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_type TEXT DEFAULT 'subscription' CHECK (order_type IN ('subscription', 'set')),
  plan_type TEXT CHECK (plan_type IN ('monthly', 'yearly')),
  set_id UUID REFERENCES public.question_sets(id),
  amount NUMERIC NOT NULL,
  slip_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.payment_orders FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.payment_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can manage orders" ON public.payment_orders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ========================================
-- 10. Indexes
-- ========================================
CREATE INDEX idx_mcq_questions_subject ON public.mcq_questions(subject_id);
CREATE INDEX idx_mcq_questions_exam_type ON public.mcq_questions(exam_type);
CREATE INDEX idx_mcq_questions_exam_day ON public.mcq_questions(exam_day);
CREATE INDEX idx_mcq_questions_status ON public.mcq_questions(status);
CREATE INDEX idx_mcq_attempts_user ON public.mcq_attempts(user_id);
CREATE INDEX idx_mcq_attempts_session ON public.mcq_attempts(session_id);
CREATE INDEX idx_mcq_sessions_user ON public.mcq_sessions(user_id);
CREATE INDEX idx_payment_orders_user ON public.payment_orders(user_id);
CREATE INDEX idx_payment_orders_status ON public.payment_orders(status);
CREATE INDEX idx_set_questions_set ON public.set_questions(set_id);
CREATE INDEX idx_set_purchases_user ON public.set_purchases(user_id);
CREATE INDEX idx_set_purchases_status ON public.set_purchases(status);
