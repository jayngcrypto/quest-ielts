"use client";
import { useState, useEffect, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import { READING_SETS } from "@/data/reading-questions";

interface VocabPopup {
  word: string;
  x: number;
  y: number;
}

export default function ReadingPage() {
  const [setIndex, setSetIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [vocabPopup, setVocabPopup] = useState<VocabPopup | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const currentSet = setIndex !== null ? READING_SETS[setIndex] : null;

  // Build full passage from all question contexts
  const fullPassage = currentSet?.questions
    .map(q => q.context || "")
    .filter((v, i, arr) => arr.indexOf(v) === i) // deduplicate
    .join("\n\n") || "";

  // Dismiss popup on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setVocabPopup(null);
      }
    }
    if (vocabPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [vocabPopup]);

  function handleWordClick(word: string, e: React.MouseEvent<HTMLSpanElement>) {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const container = (e.target as HTMLElement).closest(".passage-container");
    const containerRect = container?.getBoundingClientRect();
    const x = rect.left - (containerRect?.left || 0);
    const y = rect.bottom - (containerRect?.top || 0) + 4;
    const cleanWord = word.replace(/[^a-zA-Z'-]/g, "");
    if (!cleanWord) return;
    setVocabPopup({ word: cleanWord, x, y });
  }

  function speakWord(word: string) {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }

  function renderPassage(text: string) {
    const paragraphs = text.split("\n\n");
    return paragraphs.map((para, pIdx) => (
      <p key={pIdx} className="mb-4 last:mb-0">
        {para.split(/(\s+)/).map((token, tIdx) => {
          if (/^\s+$/.test(token)) return <span key={tIdx}>{token}</span>;
          return (
            <span
              key={tIdx}
              onClick={(e) => handleWordClick(token, e)}
              className="cursor-pointer hover:bg-q-lav hover:text-q-purple-d rounded px-[1px] transition-colors"
            >
              {token}
            </span>
          );
        })}
      </p>
    ));
  }

  function handleSelect(questionId: string, value: string) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  function getScore() {
    if (!currentSet) return 0;
    return currentSet.questions.filter(q => answers[q.id] === q.correctAnswer).length;
  }

  function reset() {
    setSetIndex(null);
    setAnswers({});
    setSubmitted(false);
    setVocabPopup(null);
  }

  // Home — select passage
  if (setIndex === null) {
    return (
      <AppShell>
        <div className="p-6 lg:p-8 font-nunito max-w-4xl">
          <h1 className="text-2xl font-black text-q-text mb-2">Luyện Reading</h1>
          <p className="text-sm font-bold text-q-text-2 mb-6">Đọc passage rồi trả lời câu hỏi bên dưới. Giống format IELTS thật.</p>

          <div className="space-y-4">
            {READING_SETS.map((set, idx) => (
              <button
                key={set.id}
                onClick={() => { setSetIndex(idx); setAnswers({}); setSubmitted(false); }}
                className="w-full text-left bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 hover:border-q-amber/60 hover:shadow-md transition-all"
              >
                <div className="text-base font-extrabold text-q-text mb-1">{set.title}</div>
                <div className="text-xs font-bold text-q-text-2">{set.questions.length} questions · {set.description}</div>
              </button>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-6 lg:p-8 font-nunito max-w-5xl">
        <button onClick={reset} className="text-xs font-extrabold text-q-purple-d mb-4 hover:underline">
          ← Quay lại danh sách
        </button>

        <h1 className="text-xl font-black text-q-text mb-1">{currentSet?.title}</h1>
        <p className="text-xs font-bold text-q-text-2 mb-6">{currentSet?.questions.length} questions</p>

        {/* Full passage on top — clickable words */}
        <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-6 mb-8 relative passage-container">
          <div className="text-[10px] font-extrabold text-q-amber-d uppercase tracking-wider mb-3">📖 Reading Passage</div>
          <div className="text-sm font-bold text-q-text leading-[1.8]">
            {renderPassage(fullPassage)}
          </div>

          {/* Vocab popup */}
          {vocabPopup && (
            <div
              ref={popupRef}
              className="absolute z-50 bg-white border-[2.5px] border-q-purple rounded-2xl p-4 shadow-lg min-w-[200px]"
              style={{ left: vocabPopup.x, top: vocabPopup.y }}
            >
              <div className="text-sm font-black text-q-purple-d mb-2">{vocabPopup.word}</div>
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => speakWord(vocabPopup.word)}
                  className="w-8 h-8 rounded-full bg-q-lav border-2 border-q-purple flex items-center justify-center hover:bg-q-purple hover:text-white transition-colors text-q-purple-d"
                  title="Pronounce"
                >
                  🔊
                </button>
                <span className="text-[11px] font-bold text-q-text-2">Phát âm</span>
              </div>
              <a
                href={`https://dictionary.cambridge.org/dictionary/english/${vocabPopup.word.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-extrabold text-q-purple-d hover:underline"
              >
                📖 Look up →
              </a>
            </div>
          )}
        </div>

        {/* Questions below */}
        <div className="space-y-6 mb-8">
          {currentSet?.questions.map((q, idx) => {
            const userAnswer = answers[q.id] || "";
            const isCorrect = userAnswer === q.correctAnswer;
            const isFillBlank = q.type === "fill_blank";

            return (
              <div key={q.id} className={`bg-q-card border-[2.5px] rounded-3xl p-5 ${
                submitted
                  ? isCorrect ? "border-q-teal" : "border-q-coral"
                  : "border-q-border"
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    submitted
                      ? isCorrect ? "bg-q-teal text-white" : "bg-q-coral text-white"
                      : "bg-q-lav text-q-purple-d border-2 border-q-border"
                  }`}>
                    {submitted ? (isCorrect ? "✓" : "✗") : idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-extrabold text-q-text-3 uppercase tracking-wider mb-1">
                      {q.type === "true_false" ? "True / False / Not Given" :
                       q.type === "fill_blank" ? "Fill in the blank" : "Multiple Choice"}
                    </div>
                    <p className="text-sm font-extrabold text-q-text">{q.prompt}</p>
                  </div>
                </div>

                {/* Fill blank */}
                {isFillBlank && (
                  <div className="ml-10">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={e => handleSelect(q.id, e.target.value)}
                      disabled={submitted}
                      placeholder="Type your answer..."
                      className={`w-full max-w-sm px-4 py-2.5 rounded-xl border-[2.5px] text-sm font-bold focus:outline-none ${
                        submitted
                          ? isCorrect ? "border-q-teal bg-q-mint text-q-teal-d" : "border-q-coral bg-q-peach text-q-coral-d"
                          : "border-q-border bg-q-cream text-q-text focus:border-q-purple"
                      }`}
                    />
                    {submitted && !isCorrect && (
                      <p className="text-xs font-bold text-q-teal-d mt-1">Answer: {q.correctAnswer}</p>
                    )}
                  </div>
                )}

                {/* Multiple choice / True-False */}
                {!isFillBlank && q.choices && (
                  <div className="ml-10 space-y-2">
                    {q.choices.map(c => {
                      let style = "border-q-border bg-q-cream";
                      if (submitted && c.id === q.correctAnswer) style = "border-q-teal bg-q-mint";
                      else if (submitted && c.id === userAnswer && !isCorrect) style = "border-q-coral bg-q-peach";
                      else if (!submitted && c.id === userAnswer) style = "border-q-purple bg-q-lav";

                      return (
                        <button
                          key={c.id}
                          onClick={() => handleSelect(q.id, c.id)}
                          disabled={submitted}
                          className={`w-full text-left px-4 py-2.5 rounded-xl border-[2px] transition-all flex items-center gap-2 ${style}`}
                        >
                          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-black flex-shrink-0 ${
                            c.id === userAnswer ? "bg-q-purple border-q-purple-d text-white" : "border-q-border text-q-text-3"
                          }`}>{c.id}</span>
                          <span className="text-xs font-bold text-q-text">{c.text}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Explanation after submit */}
                {submitted && (
                  <div className="ml-10 mt-2">
                    <p className="text-[11px] font-bold text-q-text-2 italic">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit / Score */}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < (currentSet?.questions.length || 0)}
            className="w-full py-3.5 rounded-pill text-base font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 disabled:opacity-40"
          >
            Submit All Answers ({Object.keys(answers).length}/{currentSet?.questions.length})
          </button>
        ) : (
          <div className="bg-q-lav border-[2.5px] border-q-purple rounded-3xl p-6 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <div className="text-xl font-black text-q-purple-d mb-1">
              Score: {getScore()}/{currentSet?.questions.length}
            </div>
            <p className="text-sm font-bold text-q-text-2 mb-4">
              {getScore() === currentSet?.questions.length ? "Perfect!" :
               getScore() >= (currentSet?.questions.length || 0) * 0.7 ? "Good job!" : "Keep practicing!"}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setAnswers({}); setSubmitted(false); }} className="px-6 py-2.5 rounded-pill text-sm font-extrabold text-q-purple-d bg-q-card border-[2.5px] border-q-border hover:bg-q-lav">
                Try Again
              </button>
              <button onClick={reset} className="px-6 py-2.5 rounded-pill text-sm font-extrabold text-white bg-q-amber border-[3px] border-q-amber-d hover:opacity-90">
                Next Passage →
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
