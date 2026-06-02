"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import JayBubble from "@/components/jay/JayBubble";
import { getUnlockedAchievements } from "@/lib/supabase-db";

const ALL_BADGES = [
  // Phổ thông (common)
  { id: "a1", name: "Khởi đầu mới", icon: "🌱", rarity: "common" },
  { id: "a2", name: "7 ngày liên tiếp", icon: "🔥", rarity: "common" },
  { id: "a3", name: "100 từ vựng", icon: "📚", rarity: "common" },
  { id: "a4", name: "Bài đầu tiên", icon: "✅", rarity: "common" },
  { id: "a5", name: "50 XP một ngày", icon: "⚡", rarity: "common" },
  { id: "a6", name: "Nghe 10 bài", icon: "🎧", rarity: "common" },
  { id: "a7", name: "Đọc 5 passage", icon: "📖", rarity: "common" },
  { id: "a8", name: "Lên cấp 3", icon: "⬆️", rarity: "common" },
  { id: "a9", name: "Hoàn thành zone 1", icon: "🏝️", rarity: "common" },
  { id: "a10", name: "200 từ vựng", icon: "📕", rarity: "common" },
  { id: "a11", name: "Học lúc 6h sáng", icon: "🌅", rarity: "common" },
  { id: "a12", name: "Không sai câu nào", icon: "💯", rarity: "common" },
  { id: "a13", name: "3 bài một ngày", icon: "🎯", rarity: "common" },
  { id: "a14", name: "Chia sẻ thành tích", icon: "📤", rarity: "common" },
  { id: "a15", name: "Xem thống kê", icon: "📊", rarity: "common" },
  { id: "a16", name: "Đổi avatar", icon: "🎨", rarity: "common" },
  // Hiếm (rare)
  { id: "a17", name: "14 ngày liên tiếp", icon: "💪", rarity: "rare" },
  { id: "a18", name: "500 từ vựng", icon: "🧠", rarity: "rare" },
  { id: "a19", name: "30 ngày liên tiếp", icon: "🏆", rarity: "rare" },
  { id: "a20", name: "Lên cấp 5", icon: "🌟", rarity: "rare" },
  { id: "a21", name: "1000 XP tổng", icon: "💎", rarity: "rare" },
  { id: "a22", name: "Hoàn thành 3 zone", icon: "🗺️", rarity: "rare" },
  { id: "a23", name: "Viết essay đầu tiên", icon: "✍️", rarity: "rare" },
  { id: "a24", name: "Speaking 10 phút", icon: "🎤", rarity: "rare" },
  { id: "a25", name: "Band 5.5 predicted", icon: "📈", rarity: "rare" },
  { id: "a26", name: "Mời bạn bè", icon: "👥", rarity: "rare" },
  { id: "a27", name: "100 bài hoàn thành", icon: "🎓", rarity: "rare" },
  { id: "a28", name: "Top 10% tuần", icon: "🥇", rarity: "rare" },
  { id: "a29", name: "Học đủ 5 skill", icon: "⭐", rarity: "rare" },
  { id: "a30", name: "Night owl", icon: "🦉", rarity: "rare" },
  { id: "a31", name: "Weekend warrior", icon: "⚔️", rarity: "rare" },
  { id: "a32", name: "Lên cấp 7", icon: "🚀", rarity: "rare" },
  // Huyền thoại (legendary)
  { id: "a33", name: "60 ngày liên tiếp", icon: "👑", rarity: "legendary" },
  { id: "a34", name: "1000 từ vựng", icon: "📚", rarity: "legendary" },
  { id: "a35", name: "Band 6.5 predicted", icon: "🎯", rarity: "legendary" },
  { id: "a36", name: "Hoàn thành tất cả zone", icon: "🏰", rarity: "legendary" },
  { id: "a37", name: "Lên cấp 10", icon: "🌈", rarity: "legendary" },
  { id: "a38", name: "90 ngày liên tiếp", icon: "💫", rarity: "legendary" },
  { id: "a39", name: "5000 XP tổng", icon: "🔮", rarity: "legendary" },
  { id: "a40", name: "Band 7.0 predicted", icon: "🏅", rarity: "legendary" },
  { id: "a41", name: "200 bài hoàn thành", icon: "🎖️", rarity: "legendary" },
  { id: "a42", name: "Perfect week", icon: "✨", rarity: "legendary" },
  { id: "a43", name: "Mentor's pride", icon: "🦋", rarity: "legendary" },
  { id: "a44", name: "Band 7.5 predicted", icon: "💎", rarity: "legendary" },
  { id: "a45", name: "365 ngày liên tiếp", icon: "🌍", rarity: "legendary" },
  { id: "a46", name: "10000 XP tổng", icon: "⚜️", rarity: "legendary" },
  { id: "a47", name: "Band 8.0 predicted", icon: "🏆", rarity: "legendary" },
  { id: "a48", name: "Quest Master", icon: "🐉", rarity: "legendary" },
];

const RARITY_CONFIG = {
  common: { label: "Phổ thông", bg: "bg-q-yellow", border: "border-q-amber", text: "text-q-amber-d" },
  rare: { label: "Hiếm", bg: "bg-q-lav", border: "border-q-purple", text: "text-q-purple-d" },
  legendary: { label: "Huyền thoại", bg: "bg-[#FBEAF0]", border: "border-q-pink", text: "text-q-pink-d" },
};

export default function AchievementsPage() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const ids = await getUnlockedAchievements();
        setUnlockedIds(ids);
      } catch (e) {
        console.error("Failed to fetch achievements:", e);
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
            <p className="text-sm font-bold text-q-text-2">Đang tải thành tích...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const unlockedSet = new Set(unlockedIds);
  const unlockedCount = ALL_BADGES.filter(b => unlockedSet.has(b.id)).length;
  const totalCount = ALL_BADGES.length;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);

  const nextBadge = ALL_BADGES.find(b => !unlockedSet.has(b.id));

  return (
    <AppShell>
      <div className="p-6 lg:p-8 font-nunito">
        <h1 className="text-2xl font-black text-q-text mb-2">Thành tích</h1>
        <p className="text-sm font-bold text-q-text-2 mb-6">Mỗi huy hiệu là bằng chứng cho hành trình của bạn.</p>

        {/* Progress */}
        <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-extrabold text-q-text">{unlockedCount} / {totalCount} huy hiệu</span>
            <span className="text-xs font-bold text-q-text-2">{progressPct}%</span>
          </div>
          <div className="w-full h-3 bg-q-lav rounded-pill overflow-hidden border-2 border-q-border">
            <div className="h-full bg-q-purple rounded-pill transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Jay hint */}
        {nextBadge && (
          <JayBubble
            variant="banner"
            message={`Huy hiệu tiếp theo: "${nextBadge.name}" ${nextBadge.icon} — Cố lên, sắp mở khóa rồi!`}
            className="mb-6"
          />
        )}

        {/* Badge grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {ALL_BADGES.map(badge => {
            const isUnlocked = unlockedSet.has(badge.id);
            const rarity = RARITY_CONFIG[badge.rarity as keyof typeof RARITY_CONFIG];
            return (
              <div
                key={badge.id}
                className={`rounded-3xl border-[2.5px] p-4 text-center transition-all ${
                  isUnlocked
                    ? `${rarity.bg} ${rarity.border}`
                    : "bg-q-cream border-q-border opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">
                  {isUnlocked ? badge.icon : "🔒"}
                </div>
                <div className={`text-xs font-extrabold leading-tight mb-1 ${
                  isUnlocked ? rarity.text : "text-q-text-3"
                }`}>
                  {badge.name}
                </div>
                <div className={`text-[10px] font-extrabold uppercase tracking-wider ${
                  isUnlocked ? rarity.text : "text-q-text-3"
                }`}>
                  {rarity.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
