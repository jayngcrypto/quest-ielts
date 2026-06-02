"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import JayBubble from "@/components/jay/JayBubble";
import { VOCABULARY_SETS } from "@/data/vocabulary-questions";
import { LISTENING_SETS } from "@/data/listening-questions";
import { READING_SETS } from "@/data/reading-questions";
import { WRITING_SETS } from "@/data/writing-questions";
import { SPEAKING_SETS } from "@/data/speaking-questions";
import { completeLesson } from "@/lib/supabase-db";
import { Question, QuestionSet } from "@/lib/questions";

function getQuestionSet(lessonId: string): QuestionSet | null {
  const prefix = lessonId.charAt(0);
  // Extract numeric index: "v1" → 0, "v2" → 1, "l1" → 0, etc.
  const num = parseInt(lessonId.slice(1), 10);
  if (isNaN(num) || num < 1) return null;
  const idx = num - 1;

  switch (prefix) {
    case "v":
      return VOCABULARY_SETS[idx] || null;
    case "l":
      return LISTENING_SETS[idx] || null;
    case "r":
      return READING_SETS[idx] || null;
    case "w":
      return WRITING_SETS[idx] || null;
    case "s":
      return SPEAKING_SETS[idx] || null;
    default:
      return null;
  }
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  const questionSet = useMemo(() => getQuestionSet(lessonId), [lessonId]);
  const questions = questionSet?.questions || [];
  const totalQuestions = questions.length;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [fillAnswer, setFillAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [finishing, setFinishing] = useState(false);

  const currentQ: Question | undefined = questions[questionIndex];
  const isFillBlank = currentQ?.type === "fill_blank";
  const isEssay = currentQ?.type === "essay";

  const userAnswer = isFillBlank ? fillAnswer.trim() : selected;
  const isCorrect = isFillBlank
    ? fillAnswer.trim().toLowerCase() === (currentQ?.correctAnswer || "").toLowerCase()
    : selected === currentQ?.correctAnswer;

  function handleCheck() {
    if (isFillBlank && !fillAnswer.trim()) return;
    if (!isFillBlank && !selected) return;
    setChecked(true);
    if (isCorrect) {
      setCorrect(c => c + 1);
      setTotalXP(xp => xp + (currentQ?.xpReward || 10));
    } else {
      setWrong(w => w + 1);
      setHearts(h => Math.max(0, h - 1));
    }
  }

  async function handleNext() {
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex(i => i + 1);
      setSelected(null);
      setFillAnswer("");
      setChecked(false);
    } else {
      // All questions done — complete lesson
      setFinishing(true);
      const zone = questionSet?.zone || "vocabulary";
      const earnedXP = totalXP + (isCorrect ? (currentQ?.xpReward || 10) : 0);
      try {
        await completeLesson(lessonId, zone, earnedXP);
      } catch (e) {
        console.error("Failed to save lesson completion:", e);
      }
      router.push("/quests");
    }
  }

  // Handle hearts depletion
  useEffect(() => {
    if (hearts === 0 && !finishing) {
      const timeout = setTimeout(() => router.push("/quests"), 2000);
      return () => clearTimeout(timeout);
    }
  }, [hearts, finishing, router]);

  const progress = ((questionIndex + (checked ? 1 : 0)) / totalQuestions) * 100;

  // Loading / not found state
  if (!questionSet || totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-q-cream font-nunito flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📭</div>
          <h2 className="text-lg font-black text-q-text mb-2">Không tìm thấy bài học</h2>
          <p className="text-sm font-bold text-q-text-2 mb-4">Bài học &quot;{lessonId}&quot; không tồn tại.</p>
          <button
            onClick={() => router.push("/quests")}
            className="px-6 py-3 rounded-pill text-sm font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90"
          >
            Quay lại Quests
          </button>
        </div>
      </div>
    );
  }

  if (hearts === 0) {
    return (
      <div className="min-h-screen bg-q-cream font-nunito flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">💔</div>
          <h2 className="text-lg font-black text-q-coral-d mb-2">Hết mạng rồi!</h2>
          <p className="text-sm font-bold text-q-text-2">Đang quay lại...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-q-cream font-nunito flex flex-col">
      {/* Top bar */}
      <div className="bg-q-card border-b-[2.5px] border-q-border px-4 py-3 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-q-text-2 hover:text-q-text transition-colors">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 4L6 10L12 16"/>
          </svg>
        </button>
        <span className="text-sm font-extrabold text-q-text flex-shrink-0">{questionSet.title}</span>
        
        {/* Progress bar */}
        <div className="flex-1 h-3 bg-q-lav rounded-pill overflow-hidden border-2 border-q-border mx-2">
          <div className="h-full bg-q-purple rounded-pill transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 14S2 10 2 6.5C2 4 4 2.5 5.5 2.5C6.8 2.5 7.7 3.2 8 4C8.3 3.2 9.2 2.5 10.5 2.5C12 2.5 14 4 14 6.5C14 10 8 14 8 14Z"
                fill={i < hearts ? "#FB7185" : "#E8E0F5"} stroke={i < hearts ? "#BE1D3E" : "#E8E0F5"} strokeWidth="0.5"/>
            </svg>
          ))}
        </div>

        {/* XP */}
        <div className="flex items-center gap-1 bg-q-yellow border-2 border-q-amber rounded-pill px-3 py-1 flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M6 1L7.5 4.5H11L8.5 7L9.5 11L6 9L2.5 11L3.5 7L1 4.5H4.5L6 1Z" fill="#FBBF24"/>
          </svg>
          <span className="text-xs font-extrabold text-q-amber-d">+{totalXP} XP</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left sidebar — vocab words from this set */}
        <div className="hidden lg:block lg:col-span-2 bg-q-card border-r-2 border-q-border p-4">
          <div className="text-[10px] font-extrabold text-q-text-3 uppercase tracking-widest mb-3">Câu hỏi bài này</div>
          <div className="space-y-2">
            {questions.slice(0, 8).map((q, i) => (
              <div key={q.id} className={`rounded-xl px-3 py-2 border-2 ${
                i < questionIndex ? "bg-q-mint border-q-teal" :
                i === questionIndex ? "bg-q-lav border-q-purple" :
                "bg-q-cream border-q-border"
              }`}>
                <div className="text-[10px] font-extrabold text-q-text truncate">Câu {i + 1}</div>
                <div className="text-[10px] font-bold text-q-text-2 truncate">{q.prompt.slice(0, 30)}...</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main question area */}
        <div className="lg:col-span-7 p-6 lg:p-10 flex flex-col items-center justify-center">
          <div className="w-full max-w-lg">
            {/* Question type badge */}
            <div className="inline-flex items-center gap-2 bg-q-lav border-2 border-q-purple rounded-pill px-3 py-1.5 mb-4">
              <span className="text-[10px] font-extrabold text-q-purple-d uppercase tracking-wider">
                {currentQ.type === "multiple_choice" ? "Chọn đáp án" :
                 currentQ.type === "fill_blank" ? "Điền từ" :
                 currentQ.type === "true_false" ? "True / False / Not Given" :
                 currentQ.type === "essay" ? "Viết" : currentQ.type}
              </span>
            </div>

            {/* Question prompt */}
            <h2 className="text-xl font-black text-q-text mb-4">{currentQ.prompt}</h2>

            {/* Context */}
            {currentQ.context && (
              <div className="bg-q-lav border-2 border-q-border rounded-2xl px-4 py-3 mb-6">
                <p className="text-sm font-bold text-q-purple-d italic leading-relaxed">
                  {currentQ.highlightWord
                    ? currentQ.context.split(currentQ.highlightWord).map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <span className="bg-q-purple text-white px-1.5 py-0.5 rounded-lg not-italic font-extrabold">
                              {currentQ.highlightWord}
                            </span>
                          )}
                        </span>
                      ))
                    : currentQ.context
                  }
                </p>
              </div>
            )}

            {/* Choices (for multiple_choice / true_false) */}
            {currentQ.choices && currentQ.choices.length > 0 && (
              <div className="space-y-3 mb-6">
                {currentQ.choices.map(c => {
                  let borderColor = "border-q-border";
                  let bg = "bg-q-card";
                  if (checked && c.id === currentQ.correctAnswer) {
                    borderColor = "border-q-teal";
                    bg = "bg-q-mint";
                  } else if (checked && c.id === selected && !isCorrect) {
                    borderColor = "border-q-coral";
                    bg = "bg-q-peach";
                  } else if (!checked && c.id === selected) {
                    borderColor = "border-q-purple";
                    bg = "bg-q-lav";
                  }

                  return (
                    <button
                      key={c.id}
                      onClick={() => !checked && setSelected(c.id)}
                      disabled={checked}
                      className={`w-full text-left px-4 py-3.5 rounded-2xl border-[2.5px] transition-all flex items-center gap-3 ${borderColor} ${bg} ${
                        !checked ? "hover:border-q-purple/50 cursor-pointer" : ""
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black flex-shrink-0 ${
                        c.id === selected ? "bg-q-purple border-q-purple-d text-white" : "border-q-border text-q-text-2"
                      }`}>
                        {c.id}
                      </div>
                      <span className="text-sm font-bold text-q-text">{c.text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Fill blank input */}
            {isFillBlank && (
              <div className="mb-6">
                <input
                  type="text"
                  value={fillAnswer}
                  onChange={e => setFillAnswer(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && fillAnswer.trim() && !checked && handleCheck()}
                  disabled={checked}
                  placeholder="Nhập câu trả lời..."
                  autoFocus
                  className="w-full px-4 py-3.5 rounded-2xl border-[2.5px] border-q-border bg-q-card text-sm font-bold text-q-text placeholder:text-q-text-3 focus:border-q-purple focus:outline-none disabled:opacity-70"
                />
              </div>
            )}

            {/* Essay type — just show explanation after "check" */}
            {isEssay && !checked && (
              <div className="mb-6">
                <p className="text-xs font-bold text-q-text-2 italic">
                  Đây là câu hỏi viết. Nhấn &quot;Xem gợi ý&quot; để xem hướng dẫn.
                </p>
              </div>
            )}

            {/* Check / Next button */}
            {!checked ? (
              <button
                onClick={handleCheck}
                disabled={isFillBlank ? !fillAnswer.trim() : isEssay ? false : !selected}
                className="w-full py-3.5 rounded-pill text-base font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {isEssay ? "Xem gợi ý" : "Kiểm tra"}
              </button>
            ) : (
              /* Feedback bar */
              <div className={`rounded-2xl border-[2.5px] p-4 ${
                isEssay ? "bg-q-lav border-q-purple" :
                isCorrect ? "bg-q-mint border-q-teal" : "bg-q-peach border-q-coral"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {isEssay ? (
                    <>
                      <span className="text-sm font-extrabold text-q-purple-d">📝 Hướng dẫn viết</span>
                    </>
                  ) : isCorrect ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" fill="#34D399"/>
                        <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-sm font-extrabold text-q-teal-d">Chính xác! 🎉</span>
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" fill="#FB7185"/>
                        <path d="M7 7L13 13M13 7L7 13" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                      <span className="text-sm font-extrabold text-q-coral-d">Chưa đúng rồi!</span>
                    </>
                  )}
                </div>
                {!isEssay && !isCorrect && (
                  <p className="text-xs font-bold text-q-text-2 mb-1">
                    Đáp án đúng: <span className="font-extrabold text-q-teal-d">{currentQ.correctAnswer}</span>
                  </p>
                )}
                <p className="text-xs font-bold text-q-text-2 leading-relaxed mb-3">
                  {currentQ.explanation}
                </p>
                <button
                  onClick={handleNext}
                  disabled={finishing}
                  className={`w-full py-3 rounded-pill text-sm font-extrabold text-white transition-opacity hover:opacity-90 disabled:opacity-60 ${
                    isEssay ? "bg-q-purple border-[3px] border-q-purple-d" :
                    isCorrect ? "bg-q-teal border-[3px] border-q-teal-d" : "bg-q-coral border-[3px] border-q-coral-d"
                  }`}
                >
                  {finishing ? "Đang lưu..." : questionIndex < totalQuestions - 1 ? "Câu tiếp →" : "Hoàn thành bài học 🏆"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar — tips */}
        <div className="hidden lg:block lg:col-span-3 bg-q-card border-l-2 border-q-border p-4">
          <JayBubble
            variant="card"
            message={currentQ.tags && currentQ.tags.length > 0
              ? `Chủ đề: ${currentQ.tags.join(", ")}. Hãy chú ý ngữ cảnh để chọn đáp án chính xác nhất!`
              : "Đọc kỹ ngữ cảnh và chú ý từ khóa để chọn đáp án đúng nhé!"
            }
            className="mb-4"
          />
          
          <div className="bg-q-lav border-2 border-q-border rounded-2xl p-4">
            <div className="text-[10px] font-extrabold text-q-text-3 uppercase tracking-widest mb-3">Tiến độ bài này</div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-q-teal" />
                <span className="text-xs font-extrabold text-q-teal-d">{correct} đúng</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-q-coral" />
                <span className="text-xs font-extrabold text-q-coral-d">{wrong} sai</span>
              </div>
            </div>
            <div className="text-xs font-bold text-q-text-2">
              Câu {questionIndex + 1}/{totalQuestions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
