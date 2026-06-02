"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import ZoneCard from "@/components/game/ZoneCard";
import { ZONE_CONFIG } from "@/lib/tokens";
import { MOCK_LESSONS } from "@/lib/mock";
import { getCompletedLessons } from "@/lib/supabase-db";
import { useRouter } from "next/navigation";

type ZoneId = keyof typeof ZONE_CONFIG;

const ZONE_IDS: ZoneId[] = ["vocabulary", "listening", "reading", "writing", "speaking", "castle"];

function computeZoneProgress(zoneId: string, completedIds: string[]) {
  const lessons = MOCK_LESSONS[zoneId] || [];
  const total = lessons.length;
  const done = lessons.filter(l => completedIds.includes(l.id)).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  const level = Math.floor(done / 2) + 1; // Every 2 lessons = 1 level
  return { progress, level, lessonsTotal: total, lessonsDone: done };
}

function getLessonStatuses(zoneId: string, completedIds: string[]) {
  const lessons = MOCK_LESSONS[zoneId] || [];
  let foundNext = false;
  return lessons.map(lesson => {
    if (completedIds.includes(lesson.id)) {
      return { ...lesson, status: "done" as const };
    }
    if (!foundNext) {
      foundNext = true;
      return { ...lesson, status: "in-progress" as const };
    }
    return { ...lesson, status: "locked" as const };
  });
}

export default function MapPage() {
  const router = useRouter();
  const [selectedZone, setSelectedZone] = useState<ZoneId>("vocabulary");
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const ids = await getCompletedLessons();
      setCompletedIds(ids);
      setLoading(false);
    }
    load();
  }, []);

  const zoneData = computeZoneProgress(selectedZone, completedIds);
  const zoneLessons = getLessonStatuses(selectedZone, completedIds);
  const zoneConfig = ZONE_CONFIG[selectedZone];

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
        <h1 className="text-2xl font-black text-q-text mb-2">Bản đồ hành trình</h1>
        <p className="text-sm font-bold text-q-text-2 mb-6">Khám phá 6 khu vực kỹ năng. Mở khóa dần dần khi bạn tiến bộ.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map canvas */}
          <div className="lg:col-span-2 rounded-3xl p-6" style={{ background: "#E8F4FF" }}>
            <div className="grid grid-cols-3 gap-4">
              {ZONE_IDS.map(zId => {
                const zp = computeZoneProgress(zId, completedIds);
                // Unlock logic: vocabulary always open, others need previous zone > 0%
                const zoneIdx = ZONE_IDS.indexOf(zId);
                const prevZone = zoneIdx > 0 ? ZONE_IDS[zoneIdx - 1] : null;
                const prevProgress = prevZone ? computeZoneProgress(prevZone, completedIds).progress : 100;
                const isLocked = zId !== "vocabulary" && prevProgress === 0;
                const isActive = zId === selectedZone;
                return (
                  <ZoneCard
                    key={zId}
                    zoneId={zId}
                    progress={zp.progress}
                    level={zp.level}
                    locked={isLocked}
                    active={isActive}
                    onClick={() => !isLocked && setSelectedZone(zId)}
                  />
                );
              })}
            </div>
          </div>

          {/* Right detail panel */}
          <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl border-2 flex items-center justify-center"
                style={{ background: zoneConfig.bg, borderColor: zoneConfig.border }}
              >
                <span className="text-lg font-black" style={{ color: zoneConfig.colorD }}>
                  {selectedZone.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-sm font-extrabold text-q-text">{zoneConfig.name}</div>
                <div className="text-xs font-bold text-q-text-2">{zoneConfig.skill} · Lv.{zoneData.level}</div>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-bold text-q-text-2 mb-1">
                <span>Tiến độ</span>
                <span>{zoneData.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-q-lav rounded-pill overflow-hidden border border-q-border">
                <div className="h-full rounded-pill" style={{ width: `${zoneData.progress}%`, background: zoneConfig.color }} />
              </div>
              <div className="text-xs font-bold text-q-text-3 mt-1">
                {zoneData.lessonsDone}/{zoneData.lessonsTotal} bài học
              </div>
            </div>

            {/* Lessons list */}
            <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-3">Danh sách bài học</div>
            <div className="space-y-2 mb-5">
              {zoneLessons.map((lesson, i) => (
                <div
                  key={lesson.id}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 border-2 transition-colors ${
                    lesson.status === "done"
                      ? "bg-q-mint border-q-teal"
                      : lesson.status === "in-progress"
                      ? "bg-q-lav border-q-purple cursor-pointer hover:bg-q-purple/10"
                      : "bg-q-cream border-q-border opacity-60"
                  }`}
                  onClick={() => lesson.status !== "locked" && router.push(`/lesson/${lesson.id}`)}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                    lesson.status === "done" ? "bg-q-teal text-white"
                    : lesson.status === "in-progress" ? "bg-q-purple text-white"
                    : "bg-q-border text-q-text-3"
                  }`}>
                    {lesson.status === "done" ? "✓" : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-extrabold text-q-text truncate">{lesson.title}</div>
                  </div>
                  <span className="text-[10px] font-extrabold text-q-amber-d">+{lesson.xp} XP</span>
                </div>
              ))}
            </div>

            {zoneLessons.some(l => l.status === "in-progress") && (
              <button
                onClick={() => {
                  const next = zoneLessons.find(l => l.status === "in-progress");
                  if (next) router.push(`/lesson/${next.id}`);
                }}
                className="w-full py-3 rounded-pill text-sm font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 transition-opacity"
              >
                Tiếp tục học →
              </button>
            )}

            {zoneData.progress === 0 && (
              <button
                onClick={() => {
                  const first = zoneLessons[0];
                  if (first) router.push(`/lesson/${first.id}`);
                }}
                className="w-full py-3 rounded-pill text-sm font-extrabold text-white bg-q-teal border-[3px] border-q-teal-d hover:opacity-90 transition-opacity"
              >
                Bắt đầu học →
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
