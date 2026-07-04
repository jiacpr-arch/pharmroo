-- Close the anon-key exposure on the learning tables. The app reads/writes
-- them only through the direct postgres connection (drizzle over DATABASE_URL),
-- which bypasses RLS, so enabling RLS with no policies blocks only the
-- Supabase anon/authenticated client roles that nothing legitimate uses.
ALTER TABLE public.learning_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_questions ENABLE ROW LEVEL SECURITY;
