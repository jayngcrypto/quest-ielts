"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import JayBubble from "@/components/jay/JayBubble";
import { getProgress, getSkills, getWeeklyActivity, UserProgress, SkillScore, DailyActivity } from "@/lib/supabase-db";

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

const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function StatsPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [skills, setSkills] = useState<SkillScore[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<DailyActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prog, sk, weekly] = await Promise.all([
          getProgress(),
          getSkills(),
          getWeeklyActivity(),
        ]);
        setProgress(prog);
        setSkills(sk);
        setWeeklyActivity(weekly);
      } catch (e) {
        console.error("Failed to fetch stats:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="p-6 lg:p-8 font-nunito flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-q-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-q-text-2">Đang tải thống kê...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  // Build weekly XP data for chart (last 7 days)
  const weeklyXP = (() => {
    const days: { day: string; xp: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayIndex = (date.getDay() + 6) % 7; // Mon=0, Sun=6
      const label = DAY_LABELS[dayIndex];
      const activity = weeklyActivity.find(a => a.activity_date === dateStr);
      days.push({ day: label, xp: activity?.xp_earned || 0 });
    }
    return days;
  })();

  const maxXP = Math.max(...weeklyXP.map(d => d.xp), 1);

  // Build calendar data for current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0

  const activeDates = new Set(weeklyActivity.map(a => a.activity_date));
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    return { day: dayNum, studied: activeDates.has(dateStr) };
  });

  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

  // Find weakest skill
  const weakestSkill = skills.length > 0
    ? skills.reduce((min, s) => s.score < min.score ? s : min, skills[0])
    : null;

  return (
    <AppShell>
      <div className="p-6 lg:p-8 font-nunito">
        <h1 className="text-2xl font-black text-q-text mb-2">Thống kê</h1>
        <p className="text-sm font-bold text-q-text-2 mb-6">Theo dõi tiến độ học tập của bạn.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* XP Chart 7 ngày */}
          <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
            <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-4">XP 7 ngày qua</div>
            <div className="flex items-end justify-between gap-2 h-40">
              {weeklyXP.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-extrabold text-q-amber-d">{d.xp > 0 ? d.xp : ""}</span>
                  <div className="w-full flex justify-center">
                    <div
                      className="w-8 rounded-t-xl transition-all bg-q-amber"
                      style={{ height: `${maxXP > 0 ? (d.xp / maxXP) * 120 : 0}px`, minHeight: d.xp > 0 ? "8px" : "2px" }}
                    />
                  </div>
                  <span className="text-[10px] font-extrabold text-q-text-3">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t-2 border-q-border flex justify-between">
              <span className="text-xs font-bold text-q-text-2">Tổng tuần: {weeklyXP.reduce((s, d) => s + d.xp, 0)} XP</span>
              <span className="text-xs font-bold text-q-text-2">TB/ngày: {Math.round(weeklyXP.reduce((s, d) => s + d.xp, 0) / 7)} XP</span>
            </div>
          </div>

          {/* Skill bars */}
          <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
            <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-4">Kỹ năng</div>
            <div className="space-y-4">
              {skills.length > 0 ? skills.map(s => (
                <div key={s.skill}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-extrabold text-q-text">{SKILL_NAMES[s.skill] || s.skill}</span>
                    <span className="text-sm font-black" style={{ color: SKILL_COLORS[s.skill] || "#A78BFA" }}>{s.score}%</span>
                  </div>
                  <div className="w-full h-3 bg-q-lav rounded-pill overflow-hidden border border-q-border">
                    <div className="h-full rounded-pill transition-all" style={{ width: `${s.score}%`, background: SKILL_COLORS[s.skill] || "#A78BFA" }} />
                  </div>
                </div>
              )) : (
                <p className="text-sm font-bold text-q-text-3 italic">Chưa có dữ liệu kỹ năng. Hãy hoàn thành bài học để cập nhật!</p>
              )}
            </div>
          </div>

          {/* Streak calendar */}
          <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
            <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-4">Lịch học — {monthNames[month]}, {year}</div>
            <div className="grid grid-cols-7 gap-1.5">
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(d => (
                <div key={d} className="text-center text-[10px] font-extrabold text-q-text-3 py-1">{d}</div>
              ))}
              {/* Offset for first day */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
              {calendarDays.map(d => (
                <div
                  key={d.day}
                  className={`w-full aspect-square rounded-lg flex items-center justify-center text-[10px] font-extrabold ${
                    d.studied
                      ? "bg-q-teal text-white"
                      : "bg-q-cream text-q-text-3 border border-q-border"
                  }`}
                >
                  {d.day}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs font-bold text-q-text-2">
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-q-teal" /> Đã học
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-q-cream border border-q-border" /> Chưa học
              </span>
            </div>
          </div>

          {/* Jay insight + overview */}
          <div className="flex flex-col gap-5">
            {weakestSkill && (
              <JayBubble
                variant="card"
                message={`Kỹ năng ${SKILL_NAMES[weakestSkill.skill] || weakestSkill.skill} đang thấp nhất (${weakestSkill.score}%). Jay gợi ý tập trung vào đây tuần này để cải thiện band tổng!`}
              />
            )}
            
            <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
              <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-3">Tổng quan</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-q-text-2">Tổng XP</span>
                  <span className="text-sm font-black text-q-amber-d">{(progress?.xp || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-q-text-2">Streak hiện tại</span>
                  <span className="text-sm font-black text-q-coral-d">{progress?.streak_days || 0} ngày</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-q-text-2">Bài đã học</span>
                  <span className="text-sm font-black text-q-purple-d">{progress?.lessons_completed || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
