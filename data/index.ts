import { VOCABULARY_SETS } from "./vocabulary-questions";
import { LISTENING_SETS } from "./listening-questions";
import { READING_SETS } from "./reading-questions";
import { WRITING_SETS } from "./writing-questions";
import { SPEAKING_SETS } from "./speaking-questions";
import { QuestionSet } from "@/lib/questions";

export const ALL_QUESTION_SETS: QuestionSet[] = [
  ...VOCABULARY_SETS,
  ...LISTENING_SETS,
  ...READING_SETS,
  ...WRITING_SETS,
  ...SPEAKING_SETS,
];

export function getSetsByZone(zone: string): QuestionSet[] {
  return ALL_QUESTION_SETS.filter(s => s.zone === zone);
}

export function getSetById(id: string): QuestionSet | undefined {
  return ALL_QUESTION_SETS.find(s => s.id === id);
}

export { VOCABULARY_SETS, LISTENING_SETS, READING_SETS, WRITING_SETS, SPEAKING_SETS };
