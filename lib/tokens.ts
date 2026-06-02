export const ZONE_CONFIG = {
  vocabulary: {
    id: "vocabulary",
    name: "Đảo Từ Vựng",
    skill: "Vocabulary",
    color: "#34D399",
    colorD: "#0F9E72",
    bg: "#E4F7F0",
    border: "#34D399",
  },
  listening: {
    id: "listening",
    name: "Thung Lũng Nghe",
    skill: "Listening",
    color: "#60A5FA",
    colorD: "#1D6FBF",
    bg: "#E3F2FF",
    border: "#60A5FA",
  },
  reading: {
    id: "reading",
    name: "Khu Rừng Đọc",
    skill: "Reading",
    color: "#FBBF24",
    colorD: "#B45309",
    bg: "#FFF3CC",
    border: "#FBBF24",
  },
  writing: {
    id: "writing",
    name: "Thành Phố Viết",
    skill: "Writing",
    color: "#FB7185",
    colorD: "#BE1D3E",
    bg: "#FFE8E0",
    border: "#FB7185",
  },
  speaking: {
    id: "speaking",
    name: "Đấu Trường Nói",
    skill: "Speaking",
    color: "#F472B6",
    colorD: "#BE3A85",
    bg: "#FBEAF0",
    border: "#F472B6",
  },
  castle: {
    id: "castle",
    name: "Lâu Đài Mục Tiêu",
    skill: "Final Boss",
    color: "#A78BFA",
    colorD: "#7C5CBF",
    bg: "#EDE8FF",
    border: "#A78BFA",
  },
} as const;

export const LEVEL_NAMES: Record<number, string> = {
  1: "Người mới",
  2: "Học sinh",
  3: "Lữ hành",
  4: "Phiêu lưu gia",
  5: "Chiến binh",
  6: "Anh hùng",
  7: "Nhà thám hiểm",
  8: "Huyền thoại",
  9: "Bậc thầy",
  10: "Vô địch",
};

export function getLevelFromXP(xp: number) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXPForLevel(level: number) {
  return Math.pow(level - 1, 2) * 100;
}

export function getLevelProgress(xp: number) {
  const level = getLevelFromXP(xp);
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return { level, progress: Math.round(progress), currentLevelXP, nextLevelXP };
}
