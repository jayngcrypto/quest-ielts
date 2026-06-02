"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import JayBubble from "@/components/jay/JayBubble";
import { VOCABULARY_SETS } from "@/data/vocabulary-questions";

interface VocabItem {
  word: string;
  meaning: string;
}

type Mode = "home" | "topic-list" | "topic-quiz" | "custom-input" | "custom-review" | "custom-quiz";

export default function VocabularyPage() {
  const [mode, setMode] = useState<Mode>("home");

  // Topic quiz state
  const [topicIndex, setTopicIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  // Custom vocab state
  const [input, setInput] = useState("");
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [customScore, setCustomScore] = useState(0);

  // Topic quiz logic
  const currentSet = VOCABULARY_SETS[topicIndex];
  const currentQ = currentSet?.questions[questionIndex];

  function startTopic(idx: number) {
    setTopicIndex(idx);
    setQuestionIndex(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
    setMode("topic-quiz");
  }

  function handleTopicCheck() {
    if (!selected) return;
    setChecked(true);
    if (selected === currentQ?.correctAnswer) {
      setScore(s => s + 1);
    }
  }

  function handleTopicNext() {
    if (questionIndex < (currentSet?.questions.length || 0) - 1) {
      setQuestionIndex(i => i + 1);
      setSelected(null);
      setChecked(false);
    } else {
      // Finished set
      setMode("home");
    }
  }

  // Custom vocab logic
  function parseVocab() {
    const lines = input.trim().split("\n").filter(l => l.trim());
    const items: VocabItem[] = lines.map(line => {
      const separators = [" - ", " – ", ": ", " = ", "\t"];
      let word = line.trim();
      let meaning = "";
      for (const sep of separators) {
        if (line.includes(sep)) {
          const parts = line.split(sep);
          word = parts[0].trim();
          meaning = parts.slice(1).join(sep).trim();
          break;
        }
      }
      return { word, meaning };
    }).filter(item => item.word && item.meaning);

    if (items.length > 0) {
      setVocabList(items);
      setMode("custom-review");
    }
  }

  function startCustomQuiz() {
    setMode("custom-quiz");
    setQuizIndex(0);
    setCustomScore(0);
    setShowResult(false);
    setQuizAnswer("");
  }

  function checkCustomAnswer() {
    const correct = vocabList[quizIndex].meaning.toLowerCase();
    const isCorrect = quizAnswer.toLowerCase().trim() === correct ||
      correct.includes(quizAnswer.toLowerCase().trim());
    if (isCorrect) setCustomScore(s => s + 1);
    setShowResult(true);
  }

  function nextCustomQuestion() {
    if (quizIndex < vocabList.length - 1) {
      setQuizIndex(i => i + 1);
      setQuizAnswer("");
      setShowResult(false);
    } else {
      setMode("custom-review");
    }
  }

  return (
    <AppShell>
      <div className="p-6 lg:p-8 font-nunito max-w-4xl">
        <h1 className="text-2xl font-black text-q-text mb-2">Đảo Từ Vựng</h1>
        <p className="text-sm font-bold text-q-text-2 mb-6">
          Học từ vựng theo chủ đề IELTS hoặc tự thêm danh sách của bạn.
        </p>

        {/* HOME — choose mode */}
        {mode === "home" && (
          <div className="space-y-6">
            <JayBubble
              variant="banner"
              message="Chọn cách học từ vựng phù hợp với bạn nhé! Học theo chủ đề IELTS hoặc tự thêm danh sách riêng."
              className="mb-2"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Topic-based */}
              <button
                onClick={() => setMode("topic-list")}
                className="text-left bg-q-card border-[2.5px] border-q-border rounded-3xl p-6 hover:border-q-teal hover:shadow-lg transition-all group"
              >
                <div className="text-3xl mb-3">📚</div>
                <div className="text-lg font-black text-q-text group-hover:text-q-teal-d transition-colors mb-2">
                  Từ vựng theo chủ đề
                </div>
                <p className="text-xs font-bold text-q-text-2 leading-relaxed">
                  {VOCABULARY_SETS.length} chủ đề IELTS có sẵn: Môi trường, Giáo dục, Công nghệ, Sức khỏe...
                  Mỗi chủ đề 5 câu quiz trắc nghiệm.
                </p>
              </button>

              {/* Option 2: Custom */}
              <button
                onClick={() => setMode("custom-input")}
                className="text-left bg-q-card border-[2.5px] border-q-border rounded-3xl p-6 hover:border-q-purple hover:shadow-lg transition-all group"
              >
                <div className="text-3xl mb-3">✏️</div>
                <div className="text-lg font-black text-q-text group-hover:text-q-purple-d transition-colors mb-2">
                  Tự nhập từ vựng
                </div>
                <p className="text-xs font-bold text-q-text-2 leading-relaxed">
                  Paste danh sách từ vựng của bạn vào. Hệ thống tự tạo flashcard và quiz để ôn tập.
                  Format: &quot;word - meaning&quot; mỗi dòng.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* TOPIC LIST — grid of topics */}
        {mode === "topic-list" && (
          <div>
            <button
              onClick={() => setMode("home")}
              className="text-xs font-extrabold text-q-purple-d mb-4 hover:underline"
            >
              ← Quay lại
            </button>

            <h2 className="text-lg font-black text-q-text mb-4">Chọn chủ đề</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {VOCABULARY_SETS.map((set, idx) => (
                <button
                  key={set.id}
                  onClick={() => startTopic(idx)}
                  className="text-left bg-q-card border-[2.5px] border-q-border rounded-2xl p-4 hover:border-q-teal/60 hover:shadow-md transition-all group"
                >
                  <div className="text-sm font-extrabold text-q-text group-hover:text-q-teal-d transition-colors">
                    {set.title}
                  </div>
                  <div className="text-xs font-bold text-q-text-3 mt-1">
                    {set.questions.length} câu · {set.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOM INPUT */}
        {mode === "custom-input" && (
          <div>
            <button
              onClick={() => setMode("home")}
              className="text-xs font-extrabold text-q-purple-d mb-4 hover:underline"
            >
              ← Quay lại
            </button>

            <h2 className="text-lg font-black text-q-text mb-2">Tự nhập từ vựng</h2>

            <JayBubble
              variant="banner"
              message="Paste từ vựng theo format: 'từ - nghĩa' mỗi dòng. Jay sẽ tạo flashcard và quiz tự động!"
              className="mb-4"
            />

            <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 mb-4">
              <label className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-2 block">
                Paste danh sách từ vựng
              </label>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={`sustainable - bền vững\nemission - khí thải\nbiodiversity - đa dạng sinh học\nrenewable - tái tạo được\ndeforestation - nạn phá rừng`}
                rows={8}
                className="w-full px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text placeholder:text-q-text-3 focus:border-q-purple focus:outline-none resize-none"
              />
              <p className="text-[10px] font-bold text-q-text-3 mt-2">
                Hỗ trợ format: &quot;word - meaning&quot;, &quot;word: meaning&quot;, &quot;word = meaning&quot;
              </p>
            </div>

            <button
              onClick={parseVocab}
              disabled={!input.trim()}
              className="px-8 py-3 rounded-pill text-sm font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Tạo bài học →
            </button>
          </div>
        )}

        {/* TOPIC QUIZ */}
        {mode === "topic-quiz" && currentSet && currentQ && (
          <div>
            <button
              onClick={() => setMode("home")}
              className="text-xs font-extrabold text-q-purple-d mb-4 hover:underline"
            >
              ← Quay lại
            </button>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-q-text-2">
                {currentSet.title} · Câu {questionIndex + 1}/{currentSet.questions.length}
              </span>
              <span className="text-xs font-extrabold text-q-teal-d">Đúng: {score}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-q-lav rounded-pill overflow-hidden border border-q-border mb-6">
              <div
                className="h-full bg-q-teal rounded-pill transition-all"
                style={{ width: `${((questionIndex + (checked ? 1 : 0)) / currentSet.questions.length) * 100}%` }}
              />
            </div>

            {/* Context */}
            {currentQ.context && (
              <div className="bg-q-lav border-[2px] border-q-purple/30 rounded-2xl p-4 mb-4">
                <div className="text-[10px] font-extrabold text-q-purple-d uppercase tracking-wider mb-1">Ngữ cảnh</div>
                <p className="text-sm font-bold text-q-text italic">&quot;{currentQ.context}&quot;</p>
              </div>
            )}

            {/* Question */}
            <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 mb-4">
              <p className="text-sm font-extrabold text-q-text mb-4">{currentQ.prompt}</p>
              <div className="space-y-2">
                {currentQ.choices?.map(c => {
                  let style = "border-q-border bg-q-card";
                  if (checked && c.id === currentQ.correctAnswer) style = "border-q-teal bg-q-mint";
                  else if (checked && c.id === selected && c.id !== currentQ.correctAnswer) style = "border-q-coral bg-q-peach";
                  else if (!checked && c.id === selected) style = "border-q-purple bg-q-lav";

                  return (
                    <button
                      key={c.id}
                      onClick={() => !checked && setSelected(c.id)}
                      disabled={checked}
                      className={`w-full text-left px-4 py-3 rounded-2xl border-[2.5px] transition-all flex items-center gap-3 ${style}`}
                    >
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${
                        c.id === selected ? "bg-q-purple border-q-purple-d text-white" : "border-q-border text-q-text-3"
                      }`}>{c.id}</span>
                      <span className="text-sm font-bold text-q-text">{c.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Check / Feedback */}
            {!checked ? (
              <button
                onClick={handleTopicCheck}
                disabled={!selected}
                className="w-full py-3 rounded-pill text-sm font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 disabled:opacity-40"
              >
                Kiểm tra
              </button>
            ) : (
              <div className={`rounded-2xl border-[2.5px] p-4 ${
                selected === currentQ.correctAnswer ? "bg-q-mint border-q-teal" : "bg-q-peach border-q-coral"
              }`}>
                <div className="text-sm font-extrabold mb-1">
                  {selected === currentQ.correctAnswer ? "✅ Chính xác!" : `❌ Đáp án đúng: ${currentQ.correctAnswer}`}
                </div>
                <p className="text-xs font-bold text-q-text-2 mb-3">{currentQ.explanation}</p>
                <button
                  onClick={handleTopicNext}
                  className="w-full py-3 rounded-pill text-sm font-extrabold text-white bg-q-teal border-[3px] border-q-teal-d hover:opacity-90"
                >
                  {questionIndex < currentSet.questions.length - 1 ? "Câu tiếp →" : "Hoàn thành ✓"}
                </button>
              </div>
            )}

            {/* Final score */}
            {checked && questionIndex >= currentSet.questions.length - 1 && (
              <div className="mt-6 bg-q-lav border-[2.5px] border-q-purple rounded-3xl p-5 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <div className="text-lg font-black text-q-purple-d">
                  Kết quả: {score + (selected === currentQ.correctAnswer ? 1 : 0)}/{currentSet.questions.length}
                </div>
                <div className="text-sm font-bold text-q-text-2 mt-1">
                  {score + (selected === currentQ.correctAnswer ? 1 : 0) === currentSet.questions.length
                    ? "Hoàn hảo! Bạn nắm vững chủ đề này!"
                    : "Tốt lắm! Ôn lại vài từ nữa nhé."}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CUSTOM REVIEW */}
        {mode === "custom-review" && (
          <div>
            <button
              onClick={() => { setMode("home"); setVocabList([]); setInput(""); }}
              className="text-xs font-extrabold text-q-purple-d mb-4 hover:underline"
            >
              ← Quay lại
            </button>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-q-text">
                {vocabList.length} từ vựng
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={startCustomQuiz}
                  className="px-5 py-2 rounded-pill text-xs font-extrabold text-white bg-q-teal border-[2.5px] border-q-teal-d hover:opacity-90"
                >
                  Bắt đầu Quiz →
                </button>
                <button
                  onClick={() => { setMode("custom-input"); setVocabList([]); setInput(""); }}
                  className="px-5 py-2 rounded-pill text-xs font-extrabold text-q-text-2 bg-q-card border-[2.5px] border-q-border hover:bg-q-lav"
                >
                  Nhập lại
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vocabList.map((item, i) => (
                <div
                  key={i}
                  className="bg-q-card border-[2.5px] border-q-border rounded-2xl p-4 hover:border-q-purple/50 transition-colors"
                >
                  <div className="text-sm font-extrabold text-q-purple-d mb-1">{item.word}</div>
                  <div className="text-xs font-bold text-q-text-2">{item.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOM QUIZ */}
        {mode === "custom-quiz" && vocabList[quizIndex] && (
          <div>
            <button
              onClick={() => setMode("custom-review")}
              className="text-xs font-extrabold text-q-purple-d mb-4 hover:underline"
            >
              ← Quay lại
            </button>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-q-text-2">
                Câu {quizIndex + 1} / {vocabList.length}
              </span>
              <span className="text-xs font-extrabold text-q-teal-d">
                Đúng: {customScore}
              </span>
            </div>

            <div className="w-full h-2 bg-q-lav rounded-pill overflow-hidden border border-q-border mb-6">
              <div
                className="h-full bg-q-purple rounded-pill transition-all"
                style={{ width: `${((quizIndex + (showResult ? 1 : 0)) / vocabList.length) * 100}%` }}
              />
            </div>

            <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-6 text-center">
              <div className="text-xs font-extrabold text-q-text-3 uppercase tracking-wider mb-3">
                Nghĩa của từ này là gì?
              </div>
              <div className="text-2xl font-black text-q-purple-d mb-6">
                {vocabList[quizIndex].word}
              </div>

              {!showResult ? (
                <div>
                  <input
                    type="text"
                    value={quizAnswer}
                    onChange={e => setQuizAnswer(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && quizAnswer && checkCustomAnswer()}
                    placeholder="Nhập nghĩa tiếng Việt..."
                    autoFocus
                    className="w-full max-w-sm mx-auto px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text text-center placeholder:text-q-text-3 focus:border-q-purple focus:outline-none"
                  />
                  <button
                    onClick={checkCustomAnswer}
                    disabled={!quizAnswer.trim()}
                    className="mt-4 px-8 py-3 rounded-pill text-sm font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 disabled:opacity-40"
                  >
                    Kiểm tra
                  </button>
                </div>
              ) : (
                <div>
                  <div className={`rounded-2xl p-4 mb-4 border-2 ${
                    quizAnswer.toLowerCase().trim() === vocabList[quizIndex].meaning.toLowerCase() ||
                    vocabList[quizIndex].meaning.toLowerCase().includes(quizAnswer.toLowerCase().trim())
                      ? "bg-q-mint border-q-teal"
                      : "bg-q-peach border-q-coral"
                  }`}>
                    <div className="text-sm font-extrabold mb-1">
                      {quizAnswer.toLowerCase().trim() === vocabList[quizIndex].meaning.toLowerCase() ||
                       vocabList[quizIndex].meaning.toLowerCase().includes(quizAnswer.toLowerCase().trim())
                        ? "✅ Chính xác!"
                        : "❌ Chưa đúng"}
                    </div>
                    <div className="text-xs font-bold text-q-text-2">
                      Đáp án: <span className="text-q-teal-d font-extrabold">{vocabList[quizIndex].meaning}</span>
                    </div>
                  </div>
                  <button
                    onClick={nextCustomQuestion}
                    className="px-8 py-3 rounded-pill text-sm font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90"
                  >
                    {quizIndex < vocabList.length - 1 ? "Câu tiếp →" : "Xem kết quả"}
                  </button>
                </div>
              )}
            </div>

            {quizIndex >= vocabList.length - 1 && showResult && (
              <div className="mt-6 bg-q-lav border-[2.5px] border-q-purple rounded-3xl p-5 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <div className="text-lg font-black text-q-purple-d">
                  Kết quả: {customScore + (
                    quizAnswer.toLowerCase().trim() === vocabList[quizIndex].meaning.toLowerCase() ||
                    vocabList[quizIndex].meaning.toLowerCase().includes(quizAnswer.toLowerCase().trim()) ? 1 : 0
                  )}/{vocabList.length}
                </div>
                <div className="flex gap-3 justify-center mt-4">
                  <button onClick={startCustomQuiz} className="px-5 py-2 rounded-pill text-xs font-extrabold text-white bg-q-purple border-[2.5px] border-q-purple-d">
                    Làm lại
                  </button>
                  <button onClick={() => setMode("custom-review")} className="px-5 py-2 rounded-pill text-xs font-extrabold text-q-text-2 bg-q-card border-[2.5px] border-q-border">
                    Xem danh sách
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
