"use client";
import { useState, useRef, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import JayBubble from "@/components/jay/JayBubble";
import { gradeSpeaking } from "@/lib/ai";

/* ─── Speaking Prompts ─── */
const SPEAKING_PROMPTS = {
  1: [
    "Where are you from? Tell me about your hometown.",
    "Do you work or study? What do you like about it?",
    "What do you do in your free time?",
    "Do you prefer reading books or watching movies? Why?",
    "How often do you use social media?",
  ],
  2: [
    "Describe a person who has influenced you. You should say: who this person is, how you know them, what they did that influenced you, and explain why they had such an impact.",
    "Describe a place you would like to visit. You should say: where it is, how you know about it, what you would do there, and explain why you want to visit.",
    "Describe a skill you learned recently. You should say: what the skill is, how you learned it, how long it took, and explain how useful it is.",
  ],
  3: [
    "Do you think education systems need to change? How?",
    "What are the advantages and disadvantages of working from home?",
    "How has technology changed the way people communicate?",
  ],
};

/* ─── Shadowing Data ─── */
const SHADOWING_SETS = [
  { id: "s1", title: "Simple Phrases", level: "Beginner", phrases: [
    "Nice to meet you.",
    "How are you doing today?",
    "I would like a cup of coffee please.",
    "Could you repeat that for me?",
    "Thank you very much for your help.",
    "I'm looking forward to seeing you.",
    "What time does the train leave?",
    "Excuse me, where is the nearest bank?",
  ]},
  { id: "s2", title: "IELTS Speaking Responses", level: "Intermediate", phrases: [
    "Well, I think there are several reasons for this.",
    "From my perspective, technology has both advantages and disadvantages.",
    "If I had to choose, I would probably say that education is more important.",
    "To be honest, I haven't really thought about this before.",
    "In my country, most young people prefer living in big cities.",
    "I strongly believe that the government should invest more in public transport.",
    "Looking back, I think my university years were the best time of my life.",
    "One thing I really enjoy is spending time outdoors, especially hiking.",
  ]},
  { id: "s3", title: "Advanced Expressions", level: "Advanced", phrases: [
    "It goes without saying that environmental protection should be a top priority.",
    "Having said that, there are compelling arguments on both sides of the debate.",
    "What strikes me most about this issue is the lack of public awareness.",
    "I'm inclined to believe that the benefits far outweigh the drawbacks.",
    "There's no denying the fact that globalization has transformed our economy.",
    "From an economic standpoint, investing in renewable energy makes perfect sense.",
    "While I appreciate the convenience of social media, I'm concerned about privacy.",
    "It's worth noting that not everyone has equal access to quality education.",
  ]},
];

/* ─── Helpers ─── */
function computeSimilarity(original: string, spoken: string): number {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const origWords = normalize(original);
  const spokenWords = normalize(spoken);
  if (origWords.length === 0) return 0;
  let matched = 0;
  for (const w of origWords) {
    if (spokenWords.includes(w)) matched++;
  }
  return Math.round((matched / origWords.length) * 100);
}

/* ─── Main Page ─── */
export default function SpeakingPage() {
  const [activeTab, setActiveTab] = useState<"speaking" | "shadowing">("speaking");

  return (
    <AppShell>
      <div className="p-6 lg:p-8 font-nunito">
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("speaking")}
            className={`px-5 py-2.5 rounded-pill text-sm font-extrabold border-[2.5px] transition-all ${
              activeTab === "speaking"
                ? "bg-q-purple text-white border-q-purple-d"
                : "bg-q-card text-q-text-2 border-q-border hover:border-q-purple/50"
            }`}
          >
            🎤 Speaking Practice
          </button>
          <button
            onClick={() => setActiveTab("shadowing")}
            className={`px-5 py-2.5 rounded-pill text-sm font-extrabold border-[2.5px] transition-all ${
              activeTab === "shadowing"
                ? "bg-q-teal text-white border-q-teal-d"
                : "bg-q-card text-q-text-2 border-q-border hover:border-q-teal/50"
            }`}
          >
            🔊 Shadowing
          </button>
        </div>

        {activeTab === "speaking" ? <SpeakingTab /> : <ShadowingTab />}
      </div>
    </AppShell>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   SPEAKING TAB — Original functionality
   ═══════════════════════════════════════════════════════════════════ */
function SpeakingTab() {
  const [part, setPart] = useState<1 | 2 | 3>(1);
  const [promptIndex, setPromptIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof gradeSpeaking>> | null>(null);
  const [error, setError] = useState("");
  const recognitionRef = useRef<any>(null);

  const currentPrompt = SPEAKING_PROMPTS[part][promptIndex];

  function startRecording() {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setError("Trình duyệt không hỗ trợ ghi âm. Dùng Chrome nhé!");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = transcript;

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript + interim);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setTranscript(finalTranscript);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }

  function stopRecording() {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }

  async function handleGrade() {
    if (!transcript.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await gradeSpeaking(transcript, part);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi kết nối AI. Thử lại sau.");
    }
    setLoading(false);
  }

  function reset() {
    setTranscript("");
    setResult(null);
    setError("");
  }

  return (
    <>
      <h1 className="text-2xl font-black text-q-text mb-2">Luyện Speaking</h1>
      <p className="text-sm font-bold text-q-text-2 mb-6">Nói và nhận chấm điểm + sửa lỗi từ AI.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Part selector */}
          <div className="flex gap-2">
            {([1, 2, 3] as const).map(p => (
              <button
                key={p}
                onClick={() => { setPart(p); setPromptIndex(0); reset(); }}
                className={`px-4 py-2 rounded-pill text-xs font-extrabold border-[2.5px] transition-all ${
                  part === p
                    ? "bg-q-purple text-white border-q-purple-d"
                    : "bg-q-card text-q-text-2 border-q-border hover:border-q-purple/50"
                }`}
              >
                Part {p}
              </button>
            ))}
          </div>

          {/* Prompt */}
          <div className="bg-q-lav border-[2.5px] border-q-purple rounded-3xl p-5">
            <div className="text-xs font-extrabold text-q-purple-d uppercase tracking-wider mb-2">
              Câu hỏi Part {part}
            </div>
            <p className="text-sm font-bold text-q-text leading-relaxed">{currentPrompt}</p>
            <div className="flex gap-2 mt-3">
              {SPEAKING_PROMPTS[part].map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setPromptIndex(i); reset(); }}
                  className={`w-6 h-6 rounded-full text-[10px] font-black border-2 ${
                    promptIndex === i
                      ? "bg-q-purple border-q-purple-d text-white"
                      : "bg-q-card border-q-border text-q-text-3"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Recording area */}
          <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider">
                {isRecording ? "🔴 Đang ghi âm..." : "Nhấn để bắt đầu nói"}
              </span>
              <span className="text-xs font-bold text-q-text-3">
                {transcript.split(" ").filter(Boolean).length} từ
              </span>
            </div>

            {/* Record button */}
            <div className="flex justify-center mb-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-16 h-16 rounded-full flex items-center justify-center border-[3px] transition-all ${
                  isRecording
                    ? "bg-q-coral border-q-coral-d animate-pulse"
                    : "bg-q-purple border-q-purple-d hover:scale-105"
                }`}
              >
                {isRecording ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                    <rect x="4" y="4" width="12" height="12" rx="2" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2">
                    <rect x="7" y="2" width="6" height="10" rx="3" />
                    <path d="M4 10C4 13.3 6.7 16 10 16C13.3 16 16 13.3 16 10" />
                    <line x1="10" y1="16" x2="10" y2="19" />
                  </svg>
                )}
              </button>
            </div>

            {/* Transcript */}
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder="Transcript sẽ hiện ở đây khi bạn nói... Hoặc bạn có thể gõ trực tiếp."
              rows={6}
              className="w-full px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text placeholder:text-q-text-3 focus:border-q-purple focus:outline-none resize-none"
            />
          </div>

          <button
            onClick={handleGrade}
            disabled={!transcript.trim() || loading}
            className="w-full py-3.5 rounded-pill text-base font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 disabled:opacity-40"
          >
            {loading ? "Đang chấm..." : "🤖 AI Chấm điểm Speaking"}
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
              <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 text-center">
                <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-2">Band Score</div>
                <div className="text-4xl font-black text-q-purple-d">{result.band}</div>
              </div>

              <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
                <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-3">Chi tiết</div>
                <div className="space-y-3">
                  {result.feedback.map((f, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-extrabold text-q-text">{f.criterion}</span>
                        <span className="text-xs font-black text-q-purple-d">{f.score}</span>
                      </div>
                      <p className="text-[11px] font-bold text-q-text-2">{f.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {result.corrections.length > 0 && (
                <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
                  <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-3">Sửa lỗi</div>
                  <div className="space-y-2">
                    {result.corrections.map((c, i) => (
                      <div key={i} className="bg-q-cream rounded-xl p-3 border border-q-border">
                        <div className="text-xs">
                          <span className="line-through text-q-coral-d font-bold">{c.original}</span>
                          {" → "}
                          <span className="text-q-teal-d font-extrabold">{c.corrected}</span>
                        </div>
                        <p className="text-[10px] font-bold text-q-text-3 mt-1">{c.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
                <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-3">Gợi ý</div>
                <div className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-bold text-q-text-2">
                      <span className="text-q-teal-d">💡</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <JayBubble
              variant="card"
              message="Nhấn nút micro để bắt đầu nói. Hệ thống sẽ ghi lại và AI chấm điểm theo 4 tiêu chí Speaking IELTS!"
            />
          )}
        </div>
      </div>
    </>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   SHADOWING TAB — Listen & Repeat
   ═══════════════════════════════════════════════════════════════════ */
function ShadowingTab() {
  const [selectedSet, setSelectedSet] = useState<typeof SHADOWING_SETS[number] | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [userText, setUserText] = useState("");
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const currentPhrase = selectedSet ? selectedSet.phrases[phraseIndex] : "";

  const playPhrase = useCallback(() => {
    if (!currentPhrase || isPlaying) return;
    const utterance = new SpeechSynthesisUtterance(currentPhrase);
    utterance.lang = "en-GB";
    utterance.rate = 0.8;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [currentPhrase, isPlaying]);

  function startListening() {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setUserText("(Browser does not support speech recognition)");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript;
      setUserText(spoken);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }

  function checkAccuracy() {
    if (!userText.trim() || !currentPhrase) return;
    const score = computeSimilarity(currentPhrase, userText);
    setAccuracy(score);
  }

  function nextPhrase() {
    if (!selectedSet) return;
    if (phraseIndex < selectedSet.phrases.length - 1) {
      setPhraseIndex(phraseIndex + 1);
    } else {
      setPhraseIndex(0);
    }
    setUserText("");
    setAccuracy(null);
    window.speechSynthesis.cancel();
  }

  function goBack() {
    setSelectedSet(null);
    setPhraseIndex(0);
    setUserText("");
    setAccuracy(null);
    window.speechSynthesis.cancel();
  }

  const levelColor = (level: string) => {
    if (level === "Beginner") return "bg-q-teal/10 text-q-teal-d border-q-teal";
    if (level === "Intermediate") return "bg-q-purple/10 text-q-purple-d border-q-purple";
    return "bg-q-coral/10 text-q-coral-d border-q-coral";
  };

  /* ─── Set Selection ─── */
  if (!selectedSet) {
    return (
      <>
        <h1 className="text-2xl font-black text-q-text mb-2">Shadowing Practice</h1>
        <p className="text-sm font-bold text-q-text-2 mb-6">Nghe và nhắc lại để cải thiện phát âm và fluency.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SHADOWING_SETS.map(set => (
            <button
              key={set.id}
              onClick={() => { setSelectedSet(set); setPhraseIndex(0); setUserText(""); setAccuracy(null); }}
              className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 text-left hover:border-q-teal/50 transition-all hover:scale-[1.02]"
            >
              <span className={`inline-block px-2.5 py-1 rounded-pill text-[10px] font-extrabold border-[1.5px] mb-3 ${levelColor(set.level)}`}>
                {set.level}
              </span>
              <h3 className="text-base font-black text-q-text mb-1">{set.title}</h3>
              <p className="text-xs font-bold text-q-text-3">{set.phrases.length} phrases</p>
            </button>
          ))}
        </div>
      </>
    );
  }

  /* ─── Phrase Practice ─── */
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={goBack}
          className="w-8 h-8 rounded-full bg-q-card border-[2px] border-q-border flex items-center justify-center text-q-text-2 hover:border-q-teal/50"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-black text-q-text">{selectedSet.title}</h1>
          <p className="text-xs font-bold text-q-text-3">
            Phrase {phraseIndex + 1} / {selectedSet.phrases.length}
          </p>
        </div>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* Progress bar */}
        <div className="w-full h-2 bg-q-border rounded-full overflow-hidden">
          <div
            className="h-full bg-q-teal rounded-full transition-all"
            style={{ width: `${((phraseIndex + 1) / selectedSet.phrases.length) * 100}%` }}
          />
        </div>

        {/* Phrase card */}
        <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-6">
          <div className="text-xs font-extrabold text-q-teal-d uppercase tracking-wider mb-3">
            Listen & Repeat
          </div>
          <p className="text-lg font-bold text-q-text leading-relaxed mb-5">
            &ldquo;{currentPhrase}&rdquo;
          </p>

          {/* Play button */}
          <button
            onClick={playPhrase}
            disabled={isPlaying}
            className={`px-5 py-2.5 rounded-pill text-sm font-extrabold border-[2.5px] transition-all ${
              isPlaying
                ? "bg-q-teal/20 text-q-teal-d border-q-teal animate-pulse"
                : "bg-q-teal text-white border-q-teal-d hover:opacity-90"
            }`}
          >
            {isPlaying ? "🔊 Playing..." : "▶️ Play"}
          </button>
        </div>

        {/* Record / Type area */}
        <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
          <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-3">
            Your Turn
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={isRecording ? stopListening : startListening}
              className={`w-14 h-14 rounded-full flex items-center justify-center border-[3px] transition-all ${
                isRecording
                  ? "bg-q-coral border-q-coral-d animate-pulse"
                  : "bg-q-teal border-q-teal-d hover:scale-105"
              }`}
            >
              {isRecording ? (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="white">
                  <rect x="4" y="4" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2">
                  <rect x="7" y="2" width="6" height="10" rx="3" />
                  <path d="M4 10C4 13.3 6.7 16 10 16C13.3 16 16 13.3 16 10" />
                  <line x1="10" y1="16" x2="10" y2="19" />
                </svg>
              )}
            </button>
          </div>

          <textarea
            value={userText}
            onChange={e => { setUserText(e.target.value); setAccuracy(null); }}
            placeholder="Nhấn mic để nói hoặc gõ câu bạn nghe được..."
            rows={3}
            className="w-full px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text placeholder:text-q-text-3 focus:border-q-teal focus:outline-none resize-none"
          />
        </div>

        {/* Check & Result */}
        {accuracy === null ? (
          <button
            onClick={checkAccuracy}
            disabled={!userText.trim()}
            className="w-full py-3.5 rounded-pill text-base font-extrabold text-white bg-q-teal border-[3px] border-q-teal-d hover:opacity-90 disabled:opacity-40"
          >
            ✓ Check Accuracy
          </button>
        ) : (
          <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider">Accuracy</span>
              <span className={`text-2xl font-black ${
                accuracy >= 80 ? "text-q-teal-d" : accuracy >= 50 ? "text-q-yellow-d" : "text-q-coral-d"
              }`}>
                {accuracy}%
              </span>
            </div>
            <div className="w-full h-3 bg-q-border rounded-full overflow-hidden mb-4">
              <div
                className={`h-full rounded-full transition-all ${
                  accuracy >= 80 ? "bg-q-teal" : accuracy >= 50 ? "bg-q-yellow" : "bg-q-coral"
                }`}
                style={{ width: `${accuracy}%` }}
              />
            </div>
            <p className="text-xs font-bold text-q-text-2 mb-4">
              {accuracy >= 80 ? "🎉 Excellent! Great pronunciation." : accuracy >= 50 ? "👍 Good try! Listen again and focus on the words you missed." : "💪 Keep practicing! Try listening one more time."}
            </p>
            <button
              onClick={nextPhrase}
              className="w-full py-3 rounded-pill text-sm font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90"
            >
              {phraseIndex < selectedSet.phrases.length - 1 ? "Next Phrase →" : "🔄 Start Over"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
