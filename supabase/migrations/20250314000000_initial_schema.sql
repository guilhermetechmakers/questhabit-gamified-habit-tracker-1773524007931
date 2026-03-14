-- QuestHabit initial schema
-- Idempotent: uses IF NOT EXISTS / CREATE OR REPLACE where applicable

-- Enum types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'coach', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE habit_frequency AS ENUM ('daily', 'weekly', 'custom');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE habit_privacy AS ENUM ('private', 'friends', 'public');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE completion_source AS ENUM ('app', 'reminder', 'offline', 'api');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE badge_rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE challenge_privacy AS ENUM ('private', 'invite', 'public');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- users (synced from auth.users via trigger)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login TIMESTAMPTZ,
  subscription_id TEXT,
  settings_json JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  xp_total INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_completion_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'target',
  schedule_json JSONB NOT NULL DEFAULT '{"frequency":"daily"}',
  xp_value INTEGER NOT NULL DEFAULT 10,
  privacy_flag habit_privacy NOT NULL DEFAULT 'private',
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_archived ON public.habits(archived);

CREATE TABLE IF NOT EXISTS public.completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  source completion_source NOT NULL DEFAULT 'app',
  xp_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_completions_habit_id ON public.completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_completions_user_id ON public.completions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_timestamp ON public.completions(timestamp);

CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  criteria_json JSONB NOT NULL DEFAULT '{}',
  icon_url TEXT,
  rarity badge_rarity NOT NULL DEFAULT 'common'
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);

CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rules_json JSONB NOT NULL DEFAULT '{}',
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  privacy challenge_privacy NOT NULL DEFAULT 'invite',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.challenge_participants (
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  progress_json JSONB NOT NULL DEFAULT '{}',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (challenge_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  payload_json JSONB NOT NULL DEFAULT '{}',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  device_info JSONB,
  refresh_token_hash TEXT,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Users: own row only
DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- User stats: own row only
DROP POLICY IF EXISTS "user_stats_select_own" ON public.user_stats;
CREATE POLICY "user_stats_select_own" ON public.user_stats FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "user_stats_all_own" ON public.user_stats;
CREATE POLICY "user_stats_all_own" ON public.user_stats FOR ALL USING (auth.uid() = user_id);

-- Habits: CRUD own
DROP POLICY IF EXISTS "habits_select_own" ON public.habits;
CREATE POLICY "habits_select_own" ON public.habits FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "habits_insert_own" ON public.habits;
CREATE POLICY "habits_insert_own" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "habits_update_own" ON public.habits;
CREATE POLICY "habits_update_own" ON public.habits FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "habits_delete_own" ON public.habits;
CREATE POLICY "habits_delete_own" ON public.habits FOR DELETE USING (auth.uid() = user_id);

-- Completions: own only
DROP POLICY IF EXISTS "completions_select_own" ON public.completions;
CREATE POLICY "completions_select_own" ON public.completions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "completions_insert_own" ON public.completions;
CREATE POLICY "completions_insert_own" ON public.completions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badges: read all (catalog)
DROP POLICY IF EXISTS "badges_select_all" ON public.badges;
CREATE POLICY "badges_select_all" ON public.badges FOR SELECT USING (true);

-- User badges: own only
DROP POLICY IF EXISTS "user_badges_select_own" ON public.user_badges;
CREATE POLICY "user_badges_select_own" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);

-- Challenges: select by participation or public
DROP POLICY IF EXISTS "challenges_select" ON public.challenges;
CREATE POLICY "challenges_select" ON public.challenges FOR SELECT USING (
  auth.uid() = creator_id OR
  privacy = 'public' OR
  EXISTS (SELECT 1 FROM public.challenge_participants cp WHERE cp.challenge_id = challenges.id AND cp.user_id = auth.uid())
);
DROP POLICY IF EXISTS "challenges_insert_own" ON public.challenges;
CREATE POLICY "challenges_insert_own" ON public.challenges FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Challenge participants
DROP POLICY IF EXISTS "challenge_participants_select" ON public.challenge_participants;
CREATE POLICY "challenge_participants_select" ON public.challenge_participants FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "challenge_participants_insert" ON public.challenge_participants;
CREATE POLICY "challenge_participants_insert" ON public.challenge_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: own only
DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Sessions: own only
DROP POLICY IF EXISTS "sessions_all_own" ON public.sessions;
CREATE POLICY "sessions_all_own" ON public.sessions FOR ALL USING (auth.uid() = user_id);

-- Admin audit logs: admin only (optional; can restrict by role in app)
DROP POLICY IF EXISTS "admin_audit_logs_admin" ON public.admin_audit_logs;
CREATE POLICY "admin_audit_logs_admin" ON public.admin_audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Trigger to sync public.users and user_stats when auth.users gets new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, public.users.display_name);
  INSERT INTO public.user_stats (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
