"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import JayBubble from "@/components/jay/JayBubble";
import QuestCard from "@/components/game/QuestCard";
import { MOCK_LESSONS } from "@/lib/mock";
import { getProgress, getCompletedLessons } from "@/lib/supabase-db";
import { useRouter } from "next/navigation";

function getJayMessage(streakDays: number): string {
  if (streakDays >= 14) return `${streakDays} ngày liên tiếp! Bạn đang trong top 10% người học chăm nhất!`;
  if (streakDays >= 7) return `${streakDays} ngày streak rồi! Tuyệt vời, tiếp tục nhé!`;
  if (streakDays >= 3) return "Đà học tốt lắm! Giữ streak để nhân đôi XP nhé!";
  return "Hôm nay học gì? Jay đã chuẩn bị nhiệm vụ cho bạn rồi nhé!";
}

function buildQuests(completedIds: string[]) {
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
      if (completedIds.includes(lesson.id)) continue;
      quests.push({
        id: lesson.id,
        zone,
        title: lesson.title,
        duration: "15 phút",
        xp: lesson.xp,
        progress: 0,
        status: "in-progress",
      });
      break;
    }
  }
  return quests;
}

export default function QuestsPage() {
  const router = useRouter();
  const [streakDays, setStreakDays] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [progress, lessons] = await Promise.all([getProgress(), getCompletedLessons()]);
      if (progress) setStreakDays(progress.streak_days);
      setCompletedIds(lessons);
      setLoading(false);
    }
    load();
  }, []);

  const quests = buildQuests(completedIds);

  if (loading) {
    return (
      <AppShell>
        <div className="p-8 flex items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-q-purple border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-6 lg:p-8 font-nunito">
        <h1 className="text-2xl font-black text-q-text mb-2">Nhiệm vụ hôm nay</h1>
        <p className="text-sm font-bold text-q-text-2 mb-6">Hoàn thành tất cả nhiệm vụ để giữ streak và nhận bonus XP!</p>

        {/* Day summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-q-peach border-[2.5px] border-q-coral rounded-3xl p-4 text-center">
            <div className="text-2xl font-black text-q-coral-d">{streakDays}</div>
            <div className="text-xs font-extrabold text-q-coral-d mt-1">Ngày streak</div>
          </div>
          <div className="bg-q-lav border-[2.5px] border-q-purple rounded-3xl p-4 text-center">
            <div className="text-2xl font-black text-q-purple-d">{quests.length}</div>
            <div className="text-xs font-extrabold text-q-purple-d mt-1">Nhiệm vụ</div>
          </div>
          <div className="bg-q-yellow border-[2.5px] border-q-amber rounded-3xl p-4 text-center">
            <div className="text-2xl font-black text-q-amber-d">{completedIds.length}</div>
            <div className="text-xs font-extrabold text-q-amber-d mt-1">Bài đã học</div>
          </div>
        </div>

        {/* Jay message */}
        <JayBubble variant="banner" message={getJayMessage(streakDays)} className="mb-6" />

        {/* Quest list */}
        {quests.length > 0 ? (
          <div className="space-y-4">
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
            <p className="text-sm font-bold text-q-text-2">Bạn đã hoàn thành tất cả nhiệm vụ!</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
