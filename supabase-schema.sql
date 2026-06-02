-- ============================================
-- Quest IELTS — Supabase Database Schema
-- Chạy file này trong Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Profiles table — thông tin user
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  target_band REAL NOT NULL DEFAULT 7.0,
  current_band REAL NOT NULL DEFAULT 0,
  exam_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. User progress — XP, streak, lessons
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  xp INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Skill scores — điểm từng kỹ năng
CREATE TABLE IF NOT EXISTS skill_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL CHECK (skill IN ('vocabulary', 'listening', 'reading', 'writing', 'speaking')),
  score INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, skill)
);

-- 4. Completed lessons — bài đã hoàn thành
CREATE TABLE IF NOT EXISTS completed_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  zone TEXT NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- 5. Achievements — thành tích đã mở khoá
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- 6. Daily activity — tracking streak
CREATE TABLE IF NOT EXISTS daily_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  lessons_done INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, activity_date)
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own skills" ON skill_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own skills" ON skill_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own skills" ON skill_scores FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own lessons" ON completed_lessons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lessons" ON completed_lessons FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own activity" ON daily_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own activity" ON daily_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own activity" ON daily_activity FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- Auto-create profile + progress on signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', ''));

  INSERT INTO public.user_progress (id, xp, streak_days, lessons_completed)
  VALUES (NEW.id, 0, 0, 0);

  INSERT INTO public.skill_scores (user_id, skill, score) VALUES
    (NEW.id, 'vocabulary', 0),
    (NEW.id, 'listening', 0),
    (NEW.id, 'reading', 0),
    (NEW.id, 'writing', 0),
    (NEW.id, 'speaking', 0);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
