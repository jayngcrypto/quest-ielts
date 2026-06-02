export const MOCK_USER = {
  name: "Minh Anh",
  xp: 1240,
  streakDays: 14,
  currentBand: 5.5,
  targetBand: 7.0,
  examDate: "2025-06-15",
  level: 7,
  lessonsCompleted: 42,
};

export const MOCK_QUESTS = [
  { id: "q1", zone: "vocabulary" as const, title: "20 từ vựng chủ đề môi trường", duration: "10 phút", xp: 50, progress: 100, status: "done" as const },
  { id: "q2", zone: "listening" as const, title: "Nghe bài hội thoại giao tiếp", duration: "15 phút", xp: 75, progress: 100, status: "done" as const },
  { id: "q3", zone: "reading" as const, title: "Đọc passage dạng matching", duration: "20 phút", xp: 100, progress: 40, status: "in-progress" as const },
  { id: "q4", zone: "writing" as const, title: "Viết Task 1 — biểu đồ cột", duration: "30 phút", xp: 120, progress: 0, status: "locked" as const },
];

export const JAY_MESSAGES = {
  streak_7: "Bạn vừa học 7 ngày liên tiếp! Tuyệt vời, tiếp tục nhé!",
  streak_14: "14 ngày liên tiếp rồi! Bạn đang trong top 10% người học chăm nhất!",
  level_up: "Chúc mừng lên cấp! Hành trình của bạn đang tiến triển rất tốt.",
  daily_start: "Hôm nay học gì? Jay đã chuẩn bị 4 nhiệm vụ cho bạn rồi nhé!",
  near_level: "Chỉ còn 60 XP nữa là lên cấp. Làm thêm 1 bài nữa thôi!",
  weak_skill: "Kỹ năng Writing đang thấp nhất. Jay gợi ý tập trung vào đây tuần này.",
};

export const MOCK_SKILLS = [
  { name: "Vocabulary", zone: "vocabulary" as const, score: 72, color: "#34D399" },
  { name: "Listening", zone: "listening" as const, score: 65, color: "#60A5FA" },
  { name: "Reading", zone: "reading" as const, score: 58, color: "#FBBF24" },
  { name: "Writing", zone: "writing" as const, score: 40, color: "#FB7185" },
  { name: "Speaking", zone: "speaking" as const, score: 45, color: "#F472B6" },
];

export const MOCK_ACHIEVEMENTS = [
  { id: "a1", name: "Khởi đầu mới", icon: "🌱", rarity: "common" as const, unlocked: true },
  { id: "a2", name: "7 ngày liên tiếp", icon: "🔥", rarity: "common" as const, unlocked: true },
  { id: "a3", name: "100 từ vựng", icon: "📚", rarity: "common" as const, unlocked: true },
  { id: "a4", name: "14 ngày liên tiếp", icon: "⚡", rarity: "rare" as const, unlocked: true },
  { id: "a5", name: "Vua Listening", icon: "🎧", rarity: "rare" as const, unlocked: false },
  { id: "a6", name: "Huyền thoại", icon: "👑", rarity: "legendary" as const, unlocked: false },
];

export const MOCK_WEEKLY_XP = [
  { day: "T2", xp: 120 },
  { day: "T3", xp: 85 },
  { day: "T4", xp: 150 },
  { day: "T5", xp: 60 },
  { day: "T6", xp: 200 },
  { day: "T7", xp: 90 },
  { day: "CN", xp: 0 },
];

export const MOCK_STREAK_WEEK = [
  { day: "T2", done: true },
  { day: "T3", done: true },
  { day: "T4", done: true },
  { day: "T5", done: true },
  { day: "T6", done: true },
  { day: "T7", done: true },
  { day: "CN", done: false },
];

export const MOCK_ZONE_PROGRESS = {
  vocabulary: { progress: 72, level: 4, lessonsTotal: 20, lessonsDone: 14 },
  listening: { progress: 65, level: 3, lessonsTotal: 18, lessonsDone: 12 },
  reading: { progress: 58, level: 3, lessonsTotal: 15, lessonsDone: 9 },
  writing: { progress: 0, level: 1, lessonsTotal: 12, lessonsDone: 0 },
  speaking: { progress: 0, level: 1, lessonsTotal: 10, lessonsDone: 0 },
  castle: { progress: 0, level: 1, lessonsTotal: 5, lessonsDone: 0 },
};

export const MOCK_LESSONS: Record<string, Array<{ id: string; title: string; xp: number; status: "done" | "in-progress" | "locked" }>> = {
  vocabulary: [
    { id: "v1", title: "Chủ đề: Môi trường", xp: 50, status: "done" },
    { id: "v2", title: "Chủ đề: Giáo dục", xp: 50, status: "done" },
    { id: "v3", title: "Chủ đề: Công nghệ", xp: 50, status: "in-progress" },
    { id: "v4", title: "Chủ đề: Sức khỏe", xp: 50, status: "locked" },
    { id: "v5", title: "Chủ đề: Xã hội", xp: 50, status: "locked" },
  ],
  listening: [
    { id: "l1", title: "Section 1: Hội thoại đời thường", xp: 75, status: "done" },
    { id: "l2", title: "Section 2: Monologue xã hội", xp: 75, status: "done" },
    { id: "l3", title: "Section 3: Thảo luận học thuật", xp: 75, status: "in-progress" },
    { id: "l4", title: "Section 4: Bài giảng", xp: 75, status: "locked" },
  ],
  reading: [
    { id: "r1", title: "Matching Headings", xp: 100, status: "done" },
    { id: "r2", title: "True/False/Not Given", xp: 100, status: "done" },
    { id: "r3", title: "Fill in the Blank", xp: 100, status: "in-progress" },
    { id: "r4", title: "Multiple Choice", xp: 100, status: "locked" },
  ],
  writing: [
    { id: "w1", title: "Task 1: Biểu đồ cột", xp: 120, status: "locked" },
    { id: "w2", title: "Task 1: Biểu đồ đường", xp: 120, status: "locked" },
    { id: "w3", title: "Task 2: Opinion Essay", xp: 150, status: "locked" },
  ],
  speaking: [
    { id: "s1", title: "Part 1: Introduction", xp: 80, status: "locked" },
    { id: "s2", title: "Part 2: Cue Card", xp: 100, status: "locked" },
    { id: "s3", title: "Part 3: Discussion", xp: 120, status: "locked" },
  ],
  castle: [
    { id: "c1", title: "Mock Test 1", xp: 500, status: "locked" },
  ],
};
