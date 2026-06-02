export type QuestionType = "multiple_choice" | "fill_blank" | "matching" | "true_false" | "essay";
export type ZoneId = "vocabulary" | "listening" | "reading" | "writing" | "speaking";

export interface Question {
  id: string;
  zone: ZoneId;
  type: QuestionType;
  level: number; // 1-10
  prompt: string;
  context?: string;
  highlightWord?: string;
  choices?: { id: string; text: string }[];
  correctAnswer?: string;
  explanation: string;
  xpReward: number;
  tags?: string[];
}

export interface QuestionSet {
  id: string;
  zone: ZoneId;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
}

// ============================================================
// VOCABULARY QUESTIONS — 30 bộ (mỗi bộ 5 câu = 150 câu)
// ============================================================
