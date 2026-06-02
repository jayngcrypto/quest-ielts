import { supabase } from "./supabase";

// ============================================
// Types
// ============================================

export interface UserProfile {
  id: string;
  display_name: string;
  target_band: number;
  current_band: number;
  exam_date: string | null;
}

export interface UserProgress {
  xp: number;
  streak_days: number;
  last_active_date: string | null;
  lessons_completed: number;
}

export interface SkillScore {
  skill: string;
  score: number;
}

export interface DailyActivity {
  activity_date: string;
  xp_earned: number;
  lessons_done: number;
}

// ============================================
// Auth helpers
// ============================================

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ============================================
// Profile
// ============================================

export async function getProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function updateProfile(updates: Partial<Pick<UserProfile, "display_name" | "target_band" | "current_band" | "exam_date">>) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", user.id)
    .select()
    .single();

  return data;
}

// ============================================
// Progress
// ============================================

export async function getProgress(): Promise<UserProgress | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_progress")
    .select("xp, streak_days, last_active_date, lessons_completed")
    .eq("id", user.id)
    .single();

  return data;
}

export async function addXP(amount: number) {
  const user = await getCurrentUser();
  if (!user) return null;

  // Get current progress
  const { data: current } = await supabase
    .from("user_progress")
    .select("xp, streak_days, last_active_date, lessons_completed")
    .eq("id", user.id)
    .single();

  if (!current) return null;

  const today = new Date().toISOString().split("T")[0];
  const lastActive = current.last_active_date;

  // Calculate streak
  let newStreak = current.streak_days;
  if (lastActive !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastActive === yesterdayStr) {
      newStreak = current.streak_days + 1;
    } else if (lastActive !== today) {
      newStreak = 1; // Reset streak
    }
  }

  const { data } = await supabase
    .from("user_progress")
    .update({
      xp: current.xp + amount,
      streak_days: newStreak,
      last_active_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single();

  // Upsert daily activity
  await supabase
    .from("daily_activity")
    .upsert({
      user_id: user.id,
      activity_date: today,
      xp_earned: (current.xp || 0) + amount, // Will be replaced by increment logic
    }, { onConflict: "user_id,activity_date" });

  return data;
}

export async function completeLesson(lessonId: string, zone: string, xpEarned: number) {
  const user = await getCurrentUser();
  if (!user) return null;

  // Record completed lesson
  await supabase
    .from("completed_lessons")
    .upsert({
      user_id: user.id,
      lesson_id: lessonId,
      zone,
      xp_earned: xpEarned,
    }, { onConflict: "user_id,lesson_id" });

  // Increment lessons_completed
  const { data: current } = await supabase
    .from("user_progress")
    .select("lessons_completed")
    .eq("id", user.id)
    .single();

  if (current) {
    await supabase
      .from("user_progress")
      .update({
        lessons_completed: current.lessons_completed + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
  }

  // Add XP
  await addXP(xpEarned);

  return true;
}

// ============================================
// Skills
// ============================================

export async function getSkills(): Promise<SkillScore[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data } = await supabase
    .from("skill_scores")
    .select("skill, score")
    .eq("user_id", user.id);

  return data || [];
}

export async function updateSkill(skill: string, score: number) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data } = await supabase
    .from("skill_scores")
    .upsert({
      user_id: user.id,
      skill,
      score,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,skill" })
    .select()
    .single();

  return data;
}

// ============================================
// Achievements
// ============================================

export async function getUnlockedAchievements(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", user.id);

  return (data || []).map(a => a.achievement_id);
}

export async function unlockAchievement(achievementId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_achievements")
    .upsert({
      user_id: user.id,
      achievement_id: achievementId,
    }, { onConflict: "user_id,achievement_id" })
    .select()
    .single();

  return data;
}

// ============================================
// Weekly activity (for streak display)
// ============================================

export async function getWeeklyActivity(): Promise<DailyActivity[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  // Get last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const startDate = sevenDaysAgo.toISOString().split("T")[0];

  const { data } = await supabase
    .from("daily_activity")
    .select("activity_date, xp_earned, lessons_done")
    .eq("user_id", user.id)
    .gte("activity_date", startDate)
    .order("activity_date", { ascending: true });

  return data || [];
}

// ============================================
// Completed lessons list
// ============================================

export async function getCompletedLessons(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data } = await supabase
    .from("completed_lessons")
    .select("lesson_id")
    .eq("user_id", user.id);

  return (data || []).map(l => l.lesson_id);
}
