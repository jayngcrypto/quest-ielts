"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import JayBubble from "@/components/jay/JayBubble";
import QuestCard from "@/components/game/QuestCard";
import { getLevelProgress, LEVEL_NAMES } from "@/lib/tokens";
import { useRouter } from "next/navigation";
import {
  getProfile,
  getProgress,
  getSkills,
  getWeeklyActivity,
  getUnlockedAchievements,
  getCompletedLessons,
  type UserProfile,
  type UserProgress,
  type SkillScore,
  type DailyActivity,
} from "@/lib/supabase-db";
import { MOCK_LESSONS } from "@/lib/mock";

const SKILL_COLORS: Record<string, string> = {
  vocabulary: "#34D399",
  listening: "#60A5FA",
  reading: "#FBBF24",
  writing: "#FB7185",
  speaking: "#F472B6",
};

const SKILL_NAMES: Record<string, string> = {
  vocabulary: "Vocabulary",
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

const ALL_ACHIEVEMENTS = [
  { id: "a1", name: "Khởi đầu mới", icon: "🌱", rarity: "common" as const },
  { id: "a2", name: "7 ngày liên tiếp", icon: "🔥", rarity: "common" as const },
  { id: "a3", name: "100 từ vựng", icon: "📚", rarity: "common" as const },
  { id: "a4", name: "14 ngày liên tiếp", icon: "⚡", rarity: "rare" as const },
  { id: "a5", name: "Vua Listening", icon: "🎧", rarity: "rare" as const },
  { id: "a6", name: "Huyền thoại", icon: "👑", rarity: "legendary" as const },
];

function getJayMessage(progress: UserProgress | null): string {
  if (!progress || progress.xp === 0) {
    return "Chào mừng bạn đến Quest IELTS! Hãy bắt đầu bài học đầu tiên để nhận XP nhé!";
  }
  if (progress.streak_days >= 14) {
    return `${progress.streak_days} ngày liên tiếp rồi! Bạn đang trong top 10% người học chăm nhất!`;
  }
  if (progress.streak_days >= 7) {
    return `Bạn vừa học ${progress.streak_days} ngày liên tiếp! Tuyệt vời, tiếp tục nhé!`;
  }
  if (progress.streak_days >= 3) {
    return "Đà học tốt lắm! Giữ streak để nhân đôi XP nhé!";
  }
  return "Hôm nay học gì? Jay đã chuẩn bị nhiệm vụ cho bạn rồi nhé!";
}

function getNextQuests(completedLessonIds: string[]) {
  const quests: Array<{
    id: string;
    zone: "vocabulary" | "listening" | "reading" | "writing" | "speaking" | "castle";
    title: string;
    duration: string;
    xp: number;
    progress: number;
    status: "done" | "in-progress" | "locked";
  }> = [];

  const zones = ["vocabulary", "listening", "reading", "writing", "speaking"] as const;

  for (const zone of zones) {
    const lessons = MOCK_LESSONS[zone] || [];
    for (const lesson of lessons) {
      if (completedLessonIds.includes(lesson.id)) {
        continue; // skip completed
      }
      // First incomplete lesson in this zone = in-progress
      quests.push({
        id: lesson.id,
        zone,
        title: lesson.title,
        duration: "15 phút",
        xp: lesson.xp,
        progress: 0,
        status: "in-progress",
      });
      break; // Only show next lesson per zone
    }
  }

  // If no quests available, show first lessons
  if (quests.length === 0) {
    for (const zone of zones) {
      const lessons = MOCK_LESSONS[zone] || [];
      if (lessons.length > 0) {
        quests.push({
          id: lessons[0].id,
          zone,
          title: lessons[0].title,
          duration: "15 phút",
          xp: lessons[0].xp,
          progress: 0,
          status: "in-progress",
        });
      }
    }
  }

  return quests.slice(0, 4); // Max 4 quests
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [skills, setSkills] = useState<SkillScore[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<DailyActivity[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [p, prog, sk, weekly, achievements, lessons] = await Promise.all([
          getProfile(),
          getProgress(),
          getSkills(),
          getWeeklyActivity(),
          getUnlockedAchievements(),
          getCompletedLessons(),
        ]);
        setProfile(p);
        setProgress(prog);
        setSkills(sk);
        setWeeklyActivity(weekly);
        setUnlockedAchievements(achievements);
        setCompletedLessonIds(lessons);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const xp = progress?.xp || 0;
  const { level } = getLevelProgress(xp);
  const levelName = LEVEL_NAMES[level] || "Người mới";
  const streakDays = progress?.streak_days || 0;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";
  const dateStr = now.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" });

  const displayName = profile?.display_name || "bạn";
  const quests = getNextQuests(completedLessonIds);

  // Build streak week from weekly activity
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const streakWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayIndex = d.getDay(); // 0=CN, 1=T2...
    const activity = weeklyActivity.find(a => a.activity_date === dateStr);
    return {
      day: dayNames[dayIndex],
      done: !!activity && activity.xp_earned > 0,
    };
  });

  // Achievements display
  const achievementsList = ALL_ACHIEVEMENTS.filter(a => unlockedAchievements.includes(a.id));

  if (loading) {
    return (
      <AppShell>
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-q-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-q-text-2">Đang tải dữ liệu...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-6 lg:p-8 font-nunito">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content — 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Greeting */}
            <div>
              <h1 className="text-2xl font-black text-q-text">{greeting}, {displayName}!</h1>
              <p className="text-sm font-bold text-q-text-2 capitalize">{dateStr}</p>
            </div>

            {/* Stat chips */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-q-peach border-2 border-q-coral rounded-pill px-4 py-2">
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1C6 1 9.5 4 9.5 6.5C9.5 8.5 7.9 10 6 10C4.1 10 2.5 8.5 2.5 6.5C2.5 5 3.8 3.5 4.2 3C4.2 4.5 5.3 5 5.3 5C5.3 5 6 3 6 1Z" fill="#FB7185"/>
                </svg>
                <span className="text-xs font-extrabold text-q-coral-d">{streakDays} ngày streak</span>
              </div>
              <div className="flex items-center gap-2 bg-q-lav border-2 border-q-purple rounded-pill px-4 py-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <polygon points="7,1 9,5 13,5.5 10,8.5 11,13 7,10.5 3,13 4,8.5 1,5.5 5,5" fill="#A78BFA"/>
                </svg>
                <span className="text-xs font-extrabold text-q-purple-d">Cấp {level} · {levelName}</span>
              </div>
              <div className="flex items-center gap-2 bg-q-yellow border-2 border-q-amber rounded-pill px-4 py-2">
                <svg width="14" height="14" viewBox="0 0 12 12">
                  <path d="M6 1L7.5 4.5H11L8.5 7L9.5 11L6 9L2.5 11L3.5 7L1 4.5H4.5L6 1Z" fill="#FBBF24"/>
                </svg>
                <span className="text-xs font-extrabold text-q-amber-d">{xp.toLocaleString()} XP</span>
              </div>
            </div>

            {/* Jay banner */}
            <JayBubble variant="banner" message={getJayMessage(progress)} />

            {/* Nhiệm vụ hôm nay */}
            <div>
              <h2 className="text-lg font-black text-q-text mb-4">Nhiệm vụ hôm nay</h2>
              {quests.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quests.map(q => (
                    <QuestCard
                      key={q.id}
                      zone={q.zone}
                      title={q.title}
                      duration={q.duration}
                      xp={q.xp}
                      progress={q.progress}
                      status={q.status}
                      onClick={() => router.push(`/lesson/${q.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-8 text-center">
                  <div className="text-3xl mb-3">🎉</div>
                  <p className="text-sm font-bold text-q-text-2">Bạn đã hoàn thành tất cả nhiệm vụ hôm nay!</p>
                </div>
              )}
            </div>

            {/* Streak tuần này */}
            <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
              <h3 className="text-sm font-extrabold text-q-text mb-4">Streak tuần này</h3>
              <div className="flex items-center justify-between">
                {streakWeek.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full border-[2.5px] flex items-center justify-center transition-all ${
                      d.done
                        ? "bg-q-coral border-q-coral-d"
                        : "bg-q-cream border-q-border"
                    }`}>
                      {d.done ? (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-q-border" />
                      )}
                    </div>
                    <span className={`text-[11px] font-extrabold ${d.done ? "text-q-coral-d" : "text-q-text-3"}`}>
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel — 1/3 */}
          <div className="space-y-5">
            {/* Band progress */}
            <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
              <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-3">Tiến độ Band</div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-black text-q-text">{profile?.current_band || 0}</span>
                <span className="text-xs font-bold text-q-text-3">→</span>
                <span className="text-lg font-black text-q-purple">{profile?.target_band || 7.0}</span>
              </div>
              <div className="w-full h-3 bg-q-lav rounded-pill overflow-hidden border-2 border-q-border">
                <div
                  className="h-full bg-q-purple rounded-pill transition-all"
                  style={{
                    width: `${profile?.target_band && profile.current_band
                      ? ((profile.current_band) / (profile.target_band)) * 100
                      : 0}%`
                  }}
                />
              </div>
              <p className="text-xs font-bold text-q-text-2 mt-2">
                {profile?.current_band
                  ? `Còn ${(profile.target_band - profile.current_band).toFixed(1)} band nữa!`
                  : "Hãy làm bài test đầu tiên để xác định band hiện tại!"}
              </p>
            </div>

            {/* Skill bars */}
            <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
              <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-4">Khu vực</div>
              <div className="space-y-3">
                {skills.length > 0 ? skills.map(s => (
                  <div key={s.skill}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-q-text">{SKILL_NAMES[s.skill] || s.skill}</span>
                      <span className="text-xs font-bold text-q-text-2">{s.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-q-lav rounded-pill overflow-hidden">
                      <div className="h-full rounded-pill transition-all" style={{ width: `${s.score}%`, background: SKILL_COLORS[s.skill] || "#A78BFA" }} />
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-q-text-3 text-center py-2">Hoàn thành bài học để xem tiến độ kỹ năng</p>
                )}
              </div>
            </div>

            {/* Recent achievements */}
            <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
              <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-3">Thành tích gần đây</div>
              {achievementsList.length > 0 ? (
                <div className="space-y-2">
                  {achievementsList.slice(0, 3).map(a => (
                    <div key={a.id} className="flex items-center gap-3 bg-q-lav rounded-2xl px-3 py-2 border-2 border-q-border">
                      <span className="text-lg">{a.icon}</span>
                      <span className="text-xs font-extrabold text-q-text">{a.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-q-text-3 text-center py-2">Chưa có thành tích nào. Hãy bắt đầu học nhé!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
