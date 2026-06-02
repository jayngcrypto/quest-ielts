"use client";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import JayBubble from "@/components/jay/JayBubble";

const DICTATION_SETS = [
  {
    id: "dict-01", title: "Daily Conversations", level: "Beginner",
    segments: [
      { text: "I would like to book a table for two please.", hint: "Restaurant booking" },
      { text: "Could you tell me how to get to the train station.", hint: "Asking for directions" },
      { text: "The meeting has been postponed until next Monday.", hint: "Office announcement" },
      { text: "I'm afraid we don't have any rooms available tonight.", hint: "Hotel reception" },
      { text: "Would you mind turning down the music a little.", hint: "Polite request" },
    ],
  },
  {
    id: "dict-02", title: "Academic English", level: "Intermediate",
    segments: [
      { text: "The research findings suggest a strong correlation between exercise and mental health.", hint: "Research" },
      { text: "Students are required to submit their assignments by the end of the week.", hint: "University" },
      { text: "The professor emphasized the importance of critical thinking in academic writing.", hint: "Lecture" },
      { text: "According to the data renewable energy consumption has increased significantly.", hint: "Statistics" },
      { text: "The study was conducted over a period of three years with five hundred participants.", hint: "Methodology" },
    ],
  },
  {
    id: "dict-03", title: "News & Current Affairs", level: "Upper-Intermediate",
    segments: [
      { text: "The government announced new measures to tackle climate change yesterday.", hint: "Politics" },
      { text: "Scientists have discovered a new species of deep sea fish in the Pacific Ocean.", hint: "Science" },
      { text: "The unemployment rate has fallen to its lowest level in over a decade.", hint: "Economy" },
      { text: "Experts warn that artificial intelligence could transform the job market within ten years.", hint: "Technology" },
      { text: "The World Health Organization has issued new guidelines on nutrition and exercise.", hint: "Health" },
    ],
  },
  {
    id: "dict-04", title: "IELTS Listening Style", level: "Intermediate",
    segments: [
      { text: "The library is open from nine thirty in the morning until eight in the evening.", hint: "Information" },
      { text: "You will need to bring your passport and two photographs for the application.", hint: "Requirements" },
      { text: "The course runs for twelve weeks and classes are held on Tuesday and Thursday.", hint: "Course details" },
      { text: "There is a deposit of two hundred pounds which is refundable at the end of the lease.", hint: "Accommodation" },
      { text: "The museum offers guided tours at eleven AM and two PM on weekdays.", hint: "Facilities" },
    ],
  },
];

export default function DictationPage() {
  const [setIdx, setSetIdx] = useState<number | null>(null);
  const [segIndex, setSegIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSet = setIdx !== null ? DICTATION_SETS[setIdx] : null;
  const currentSeg = currentSet?.segments[segIndex];

  function playSegment() {
    if (!currentSeg) return;
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(currentSeg.text);
    utterance.lang = "en-GB";
    utterance.rate = 0.85;
    utterance.onend = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
  }

  function checkDict() {
    if (!currentSeg || !userInput.trim()) return;
    setChecked(true);
    const correct = currentSeg.text.toLowerCase().replace(/[.,!?'"]/g, "").split(/\s+/);
    const user = userInput.trim().toLowerCase().replace(/[.,!?'"]/g, "").split(/\s+/);
    let matches = 0;
    correct.forEach((w, i) => { if (user[i] === w) matches++; });
    if (matches / correct.length >= 0.7) setScore(s => s + 1);
  }

  function nextSeg() {
    if (!currentSet) return;
    if (segIndex < currentSet.segments.length - 1) {
      setSegIndex(i => i + 1);
      setUserInput("");
      setChecked(false);
      setShowAnswer(false);
    } else {
      setSetIdx(null);
      setSegIndex(0);
      setScore(0);
    }
  }

  const accuracy = (() => {
    if (!checked || !currentSeg) return 0;
    const correct = currentSeg.text.toLowerCase().replace(/[.,!?'"]/g, "").split(/\s+/);
    const user = userInput.trim().toLowerCase().replace(/[.,!?'"]/g, "").split(/\s+/);
    let matches = 0;
    correct.forEach((w, i) => { if (user[i] === w) matches++; });
    return Math.round((matches / correct.length) * 100);
  })();

  return (
    <AppShell>
      <div className="p-6 lg:p-8 font-nunito max-w-3xl">
        <h1 className="text-2xl font-black text-q-text mb-2">Dictation</h1>
        <p className="text-sm font-bold text-q-text-2 mb-6">Nghe câu ngắn rồi viết lại. Luyện tai nghe + spelling.</p>

        {/* Home — select set */}
        {setIdx === null && (
          <div>
            <JayBubble variant="banner" message="Mỗi câu chỉ 5-10 giây. Nghe kỹ rồi viết lại chính xác nhất có thể!" className="mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DICTATION_SETS.map((set, idx) => (
                <button key={set.id} onClick={() => { setSetIdx(idx); setSegIndex(0); setUserInput(""); setChecked(false); setScore(0); }}
                  className="text-left bg-q-card border-[2.5px] border-q-border rounded-2xl p-5 hover:border-q-purple/60 hover:shadow-md transition-all">
                  <div className="text-sm font-extrabold text-q-text mb-1">{set.title}</div>
                  <div className="text-xs font-bold text-q-text-3">{set.segments.length} sentences · {set.level}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Exercise */}
        {currentSet && currentSeg && (
          <div>
            <button onClick={() => setSetIdx(null)} className="text-xs font-extrabold text-q-purple-d mb-4 hover:underline">← Back</button>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-q-text-2">{currentSet.title} · {segIndex + 1}/{currentSet.segments.length}</span>
              <span className="text-xs font-extrabold text-q-teal-d">Score: {score}</span>
            </div>
            <div className="w-full h-2 bg-q-lav rounded-pill overflow-hidden border border-q-border mb-6">
              <div className="h-full bg-q-purple rounded-pill transition-all" style={{ width: `${((segIndex + (checked ? 1 : 0)) / currentSet.segments.length) * 100}%` }} />
            </div>

            <div className="bg-q-sky border-[2.5px] border-q-blue rounded-3xl p-5 mb-5 text-center">
              <p className="text-xs font-bold text-q-blue-d mb-2">💡 {currentSeg.hint}</p>
              <button onClick={playSegment} disabled={isPlaying}
                className={`w-14 h-14 rounded-full flex items-center justify-center border-[3px] mx-auto transition-all ${isPlaying ? "bg-q-blue border-q-blue-d animate-pulse" : "bg-q-blue border-q-blue-d hover:scale-105"}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white"><polygon points="6,3 17,10 6,17" /></svg>
              </button>
              <p className="text-[10px] font-bold text-q-blue-d mt-2">{isPlaying ? "Playing..." : "Click to listen"}</p>
            </div>

            <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 mb-4">
              <textarea value={userInput} onChange={e => !checked && setUserInput(e.target.value)} disabled={checked}
                placeholder="Type what you hear..." rows={2}
                className="w-full px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text placeholder:text-q-text-3 focus:border-q-purple focus:outline-none resize-none" />
            </div>

            {!checked ? (
              <button onClick={checkDict} disabled={!userInput.trim()} className="w-full py-3 rounded-pill text-sm font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 disabled:opacity-40">Check</button>
            ) : (
              <div className={`rounded-2xl border-[2.5px] p-4 ${accuracy >= 70 ? "bg-q-mint border-q-teal" : "bg-q-peach border-q-coral"}`}>
                <div className="text-sm font-extrabold mb-2">{accuracy >= 90 ? "🎉 Excellent!" : accuracy >= 70 ? "✅ Good!" : "❌ Try again!"} {accuracy}%</div>
                <button onClick={() => setShowAnswer(!showAnswer)} className="text-xs font-extrabold text-q-purple-d hover:underline mb-2 block">{showAnswer ? "Hide answer" : "Show answer"}</button>
                {showAnswer && <div className="bg-q-lav rounded-xl p-3 mb-3"><p className="text-xs font-bold text-q-purple-d">{currentSeg.text}</p></div>}
                <button onClick={nextSeg} className="w-full py-3 rounded-pill text-sm font-extrabold text-white bg-q-blue border-[3px] border-q-blue-d hover:opacity-90">
                  {segIndex < currentSet.segments.length - 1 ? "Next →" : "Done"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
