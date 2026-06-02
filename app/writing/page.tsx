"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import JayBubble from "@/components/jay/JayBubble";
import { gradeWriting } from "@/lib/ai";

/* ─── Essay Prompts (Task 2) ─── */
const PROMPTS = [
  { id: "p1", title: "Technology & Simplicity", topic: "Some people believe that technology has made our lives more complicated rather than simpler. To what extent do you agree or disagree?" },
  { id: "p2", title: "Rich vs Poor Gap", topic: "In many countries, the gap between the rich and the poor is increasing. What problems does this cause and what solutions can you suggest?" },
  { id: "p3", title: "Arts vs Public Services", topic: "Some people think that governments should spend money on public services rather than wasting it on the arts. To what extent do you agree?" },
  { id: "p4", title: "Online Communication", topic: "Many young people today prefer to communicate online rather than face to face. Do the advantages outweigh the disadvantages?" },
  { id: "p5", title: "Community Service", topic: "Some people believe that unpaid community service should be a compulsory part of high school programs. To what extent do you agree or disagree?" },
];

/* ─── Fill in the Blanks Data ─── */
const FILL_EXERCISES = [
  { id: "f1", title: "Collocations", sentences: [
    { text: "The government should _____ measures to reduce pollution.", answer: "take", hint: "take/make/do" },
    { text: "This issue has _____ a lot of attention recently.", answer: "attracted", hint: "attracted/gained/drawn" },
    { text: "We need to _____ into account all the factors.", answer: "take", hint: "take/put/bring" },
    { text: "The study _____ light on an important problem.", answer: "sheds", hint: "sheds/throws/gives" },
    { text: "It is widely _____ that education is important.", answer: "acknowledged", hint: "acknowledged/believed/known" },
  ]},
  { id: "f2", title: "Linking Words", sentences: [
    { text: "_____, technology has improved our lives significantly.", answer: "Overall", hint: "Overall/However/Therefore" },
    { text: "_____ the advantages, there are also drawbacks.", answer: "Despite", hint: "Despite/Although/Because" },
    { text: "The cost is high. _____, the quality is excellent.", answer: "However", hint: "However/Therefore/Moreover" },
    { text: "_____ to popular belief, this is not always true.", answer: "Contrary", hint: "Contrary/According/Due" },
    { text: "He studied hard; _____, he passed the exam.", answer: "consequently", hint: "consequently/however/moreover" },
  ]},
  { id: "f3", title: "Academic Vocabulary", sentences: [
    { text: "The results _____ that the hypothesis was correct.", answer: "indicate", hint: "indicate/show/suggest" },
    { text: "There has been a _____ increase in temperature.", answer: "significant", hint: "significant/large/major" },
    { text: "The data was _____ from multiple sources.", answer: "collected", hint: "collected/gathered/obtained" },
    { text: "This approach has several _____.", answer: "limitations", hint: "limitations/problems/issues" },
    { text: "The findings are _____ with previous research.", answer: "consistent", hint: "consistent/similar/aligned" },
  ]},
];

/* ─── Email Prompts ─── */
const EMAIL_PROMPTS = [
  { id: "e1", title: "Complaint Letter", scenario: "You recently bought a laptop online but it arrived damaged. Write an email to the company to complain and request a replacement.", wordCount: 150 },
  { id: "e2", title: "Job Application", scenario: "Write an email applying for an internship position at a marketing company. Include your qualifications and why you're interested.", wordCount: 150 },
  { id: "e3", title: "Request Information", scenario: "Write an email to a university requesting information about their English language courses, including dates, fees, and requirements.", wordCount: 120 },
  { id: "e4", title: "Apology Email", scenario: "Write an email to your professor apologizing for missing a deadline and explaining the circumstances.", wordCount: 100 },
];

/* ─── Types ─── */
type Tab = "essay" | "fill" | "email";

export default function WritingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("essay");

  return (
    <AppShell>
      <div className="p-6 lg:p-8 font-nunito">
        <h1 className="text-2xl font-black text-q-text mb-2">Luyện Writing</h1>
        <p className="text-sm font-bold text-q-text-2 mb-6">Chọn bài tập phù hợp để luyện kỹ năng viết.</p>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {([
            { key: "essay" as Tab, label: "📝 Essay (AI)" },
            { key: "fill" as Tab, label: "✏️ Fill in the Blanks" },
            { key: "email" as Tab, label: "📧 Email Writing" },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-extrabold transition-all border-[2.5px] ${
                activeTab === tab.key
                  ? "bg-q-purple text-white border-q-purple-d"
                  : "bg-q-card text-q-text-2 border-q-border hover:border-q-purple"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "essay" && <EssayTab />}
        {activeTab === "fill" && <FillTab />}
        {activeTab === "email" && <EmailTab />}
      </div>
    </AppShell>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 1: ESSAY (AI)
   ═══════════════════════════════════════════════════════════════ */
function EssayTab() {
  const [selectedPrompt, setSelectedPrompt] = useState<typeof PROMPTS[number] | null>(null);
  const [essay, setEssay] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof gradeWriting>> | null>(null);
  const [error, setError] = useState("");

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;

  async function handleGrade() {
    if (!selectedPrompt || wordCount < 50) return;
    setLoading(true);
    setError("");
    try {
      const res = await gradeWriting(essay, selectedPrompt.topic);
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lỗi kết nối AI. Thử lại sau.");
    }
    setLoading(false);
  }

  // Topic selection screen
  if (!selectedPrompt) {
    return (
      <div>
        <JayBubble variant="card" message="Chọn một đề bài bên dưới để bắt đầu viết essay. Jay sẽ chấm điểm theo tiêu chí IELTS!" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {PROMPTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPrompt(p)}
              className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 text-left hover:border-q-purple hover:shadow-md transition-all group"
            >
              <div className="text-xs font-extrabold text-q-purple-d uppercase tracking-wider mb-2">Task 2</div>
              <div className="text-sm font-black text-q-text mb-2 group-hover:text-q-purple-d transition-colors">{p.title}</div>
              <p className="text-xs font-bold text-q-text-2 leading-relaxed line-clamp-3">{p.topic}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Writing + grading screen
  return (
    <div>
      <button
        onClick={() => { setSelectedPrompt(null); setEssay(""); setResult(null); setError(""); }}
        className="text-sm font-extrabold text-q-purple-d hover:text-q-purple mb-4 inline-flex items-center gap-1"
      >
        ← Chọn đề khác
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Writing area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Prompt display */}
          <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
            <label className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-2 block">
              Đề bài (Task 2)
            </label>
            <p className="text-sm font-bold text-q-purple-d italic leading-relaxed">"{selectedPrompt.topic}"</p>
          </div>

          {/* Essay input */}
          <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider">
                Bài viết của bạn
              </label>
              <span className={`text-xs font-extrabold ${wordCount >= 250 ? "text-q-teal-d" : wordCount >= 150 ? "text-q-amber-d" : "text-q-coral-d"}`}>
                {wordCount} từ {wordCount < 250 && "(cần ≥250)"}
              </span>
            </div>
            <textarea
              value={essay}
              onChange={e => setEssay(e.target.value)}
              placeholder="Viết essay của bạn ở đây..."
              rows={14}
              className="w-full px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text placeholder:text-q-text-3 focus:border-q-purple focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <button
            onClick={handleGrade}
            disabled={wordCount < 50 || loading}
            className="w-full py-3.5 rounded-full text-base font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {loading ? "Đang chấm điểm..." : "🤖 AI Chấm điểm"}
          </button>

          {error && (
            <div className="bg-q-peach border-2 border-q-coral rounded-2xl p-3 text-xs font-bold text-q-coral-d">
              {error}
            </div>
          )}
        </div>

        {/* Result panel */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Band score */}
              <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 text-center">
                <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-2">Band Score</div>
                <div className="text-4xl font-black text-q-purple-d">{result.band}</div>
              </div>

              {/* Criteria scores */}
              <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
                <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-3">Chi tiết</div>
                <div className="space-y-3">
                  {result.feedback.map((f, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-extrabold text-q-text">{f.criterion}</span>
                        <span className="text-xs font-black text-q-purple-d">{f.score}</span>
                      </div>
                      <p className="text-[11px] font-bold text-q-text-2 leading-relaxed">{f.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
                <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-3">Gợi ý cải thiện</div>
                <div className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-bold text-q-text-2">
                      <span className="text-q-teal-d flex-shrink-0">💡</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <JayBubble
              variant="card"
              message="Viết xong essay rồi nhấn 'AI Chấm điểm'. Jay sẽ cho bạn band score + feedback chi tiết theo 4 tiêu chí IELTS!"
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 2: FILL IN THE BLANKS
   ═══════════════════════════════════════════════════════════════ */
function FillTab() {
  const [selectedSet, setSelectedSet] = useState<typeof FILL_EXERCISES[number] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  function handleCheck() {
    if (!selectedSet) return;
    const correct = selectedSet.sentences[currentIndex].answer;
    if (userAnswer.trim().toLowerCase() === correct.toLowerCase()) {
      setShowResult("correct");
      setScore((s) => s + 1);
    } else {
      setShowResult("wrong");
    }
  }

  function handleNext() {
    if (!selectedSet) return;
    if (currentIndex + 1 >= selectedSet.sentences.length) {
      setCompleted(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setUserAnswer("");
      setShowResult(null);
    }
  }

  function handleReset() {
    setSelectedSet(null);
    setCurrentIndex(0);
    setUserAnswer("");
    setShowResult(null);
    setScore(0);
    setCompleted(false);
  }

  // Exercise set selection
  if (!selectedSet) {
    return (
      <div>
        <JayBubble variant="card" message="Chọn bộ bài tập để luyện từ vựng và cấu trúc câu. Điền từ còn thiếu vào chỗ trống!" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {FILL_EXERCISES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedSet(ex)}
              className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 text-left hover:border-q-purple hover:shadow-md transition-all group"
            >
              <div className="text-2xl mb-2">✏️</div>
              <div className="text-sm font-black text-q-text mb-1 group-hover:text-q-purple-d transition-colors">{ex.title}</div>
              <p className="text-xs font-bold text-q-text-2">{ex.sentences.length} câu hỏi</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Completed screen
  if (completed) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-8 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <div className="text-lg font-black text-q-text mb-2">Hoàn thành!</div>
          <div className="text-sm font-bold text-q-text-2 mb-4">
            Bạn đúng <span className="text-q-teal-d font-black">{score}</span> / {selectedSet.sentences.length} câu
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setCurrentIndex(0); setUserAnswer(""); setShowResult(null); setScore(0); setCompleted(false); }}
              className="px-5 py-2.5 rounded-full text-sm font-extrabold text-q-purple-d bg-q-lavender border-[2.5px] border-q-purple hover:opacity-90 transition-opacity"
            >
              Làm lại
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-full text-sm font-extrabold text-white bg-q-purple border-[2.5px] border-q-purple-d hover:opacity-90 transition-opacity"
            >
              Chọn bài khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Question screen
  const sentence = selectedSet.sentences[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={handleReset}
        className="text-sm font-extrabold text-q-purple-d hover:text-q-purple mb-4 inline-flex items-center gap-1"
      >
        ← Chọn bài khác
      </button>

      <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-6">
        {/* Progress */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider">{selectedSet.title}</span>
          <span className="text-xs font-extrabold text-q-purple-d">
            {currentIndex + 1} / {selectedSet.sentences.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-q-border rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-q-purple rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / selectedSet.sentences.length) * 100}%` }}
          />
        </div>

        {/* Sentence */}
        <p className="text-base font-bold text-q-text leading-relaxed mb-4">{sentence.text}</p>

        {/* Hint */}
        <p className="text-xs font-bold text-q-text-2 mb-4">💡 Gợi ý: <span className="text-q-purple-d">{sentence.hint}</span></p>

        {/* Input */}
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !showResult) handleCheck(); if (e.key === "Enter" && showResult) handleNext(); }}
            placeholder="Nhập đáp án..."
            disabled={!!showResult}
            className="flex-1 px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text placeholder:text-q-text-3 focus:border-q-purple focus:outline-none disabled:opacity-60"
          />
          {!showResult ? (
            <button
              onClick={handleCheck}
              disabled={!userAnswer.trim()}
              className="px-5 py-3 rounded-2xl text-sm font-extrabold text-white bg-q-purple border-[2.5px] border-q-purple-d hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Kiểm tra
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-3 rounded-2xl text-sm font-extrabold text-white bg-q-teal border-[2.5px] border-q-teal-d hover:opacity-90 transition-opacity"
            >
              Tiếp →
            </button>
          )}
        </div>

        {/* Result feedback */}
        {showResult === "correct" && (
          <div className="mt-4 bg-q-mint border-2 border-q-teal rounded-2xl p-3 text-sm font-bold text-q-teal-d">
            ✅ Chính xác! Đáp án: <span className="font-black">{sentence.answer}</span>
          </div>
        )}
        {showResult === "wrong" && (
          <div className="mt-4 bg-q-peach border-2 border-q-coral rounded-2xl p-3 text-sm font-bold text-q-coral-d">
            ❌ Sai rồi! Đáp án đúng: <span className="font-black">{sentence.answer}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 3: EMAIL WRITING
   ═══════════════════════════════════════════════════════════════ */
function EmailTab() {
  const [selectedEmail, setSelectedEmail] = useState<typeof EMAIL_PROMPTS[number] | null>(null);
  const [emailText, setEmailText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof gradeWriting>> | null>(null);
  const [error, setError] = useState("");

  const wordCount = emailText.trim().split(/\s+/).filter(Boolean).length;

  async function handleGrade() {
    if (!selectedEmail || wordCount < 30) return;
    setLoading(true);
    setError("");
    try {
      const emailPrompt = `Grade this email writing. Scenario: ${selectedEmail.scenario}`;
      const res = await gradeWriting(emailText, emailPrompt);
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lỗi kết nối AI. Thử lại sau.");
    }
    setLoading(false);
  }

  // Email type selection
  if (!selectedEmail) {
    return (
      <div>
        <JayBubble variant="card" message="Luyện viết email theo các tình huống thực tế. Chọn loại email bạn muốn luyện!" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {EMAIL_PROMPTS.map((ep) => (
            <button
              key={ep.id}
              onClick={() => setSelectedEmail(ep)}
              className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 text-left hover:border-q-purple hover:shadow-md transition-all group"
            >
              <div className="text-2xl mb-2">📧</div>
              <div className="text-sm font-black text-q-text mb-1 group-hover:text-q-purple-d transition-colors">{ep.title}</div>
              <p className="text-xs font-bold text-q-text-2 leading-relaxed line-clamp-2">{ep.scenario}</p>
              <div className="mt-2 text-[11px] font-extrabold text-q-purple-d">~{ep.wordCount} từ</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Writing + grading screen
  return (
    <div>
      <button
        onClick={() => { setSelectedEmail(null); setEmailText(""); setResult(null); setError(""); }}
        className="text-sm font-extrabold text-q-purple-d hover:text-q-purple mb-4 inline-flex items-center gap-1"
      >
        ← Chọn loại email khác
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Writing area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Scenario display */}
          <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
            <label className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-2 block">
              📧 {selectedEmail.title}
            </label>
            <p className="text-sm font-bold text-q-text leading-relaxed">{selectedEmail.scenario}</p>
            <p className="text-xs font-bold text-q-purple-d mt-2">Độ dài gợi ý: ~{selectedEmail.wordCount} từ</p>
          </div>

          {/* Email input */}
          <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider">
                Email của bạn
              </label>
              <span className={`text-xs font-extrabold ${wordCount >= selectedEmail.wordCount ? "text-q-teal-d" : "text-q-amber-d"}`}>
                {wordCount} từ
              </span>
            </div>
            <textarea
              value={emailText}
              onChange={e => setEmailText(e.target.value)}
              placeholder="Dear Sir/Madam,&#10;&#10;I am writing to..."
              rows={12}
              className="w-full px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text placeholder:text-q-text-3 focus:border-q-purple focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <button
            onClick={handleGrade}
            disabled={wordCount < 30 || loading}
            className="w-full py-3.5 rounded-full text-base font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {loading ? "Đang chấm điểm..." : "🤖 AI Chấm điểm Email"}
          </button>

          {error && (
            <div className="bg-q-peach border-2 border-q-coral rounded-2xl p-3 text-xs font-bold text-q-coral-d">
              {error}
            </div>
          )}
        </div>

        {/* Result panel */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Band score */}
              <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 text-center">
                <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-2">Band Score</div>
                <div className="text-4xl font-black text-q-purple-d">{result.band}</div>
              </div>

              {/* Criteria scores */}
              <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
                <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-3">Chi tiết</div>
                <div className="space-y-3">
                  {result.feedback.map((f, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-extrabold text-q-text">{f.criterion}</span>
                        <span className="text-xs font-black text-q-purple-d">{f.score}</span>
                      </div>
                      <p className="text-[11px] font-bold text-q-text-2 leading-relaxed">{f.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
                <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-3">Gợi ý cải thiện</div>
                <div className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-bold text-q-text-2">
                      <span className="text-q-teal-d flex-shrink-0">💡</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <JayBubble
              variant="card"
              message="Viết email theo tình huống rồi nhấn chấm điểm. Jay sẽ đánh giá nội dung, ngữ pháp và tone phù hợp!"
            />
          )}
        </div>
      </div>
    </div>
  );
}
