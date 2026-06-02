"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { speak, stopSpeaking } from "@/lib/tts";
import { LISTENING_SETS } from "@/data/listening-questions";

// TED Talk data with 20 questions each
const TED_TALKS = [
  {
    id: "ted-01",
    title: "The power of vulnerability",
    speaker: "Brené Brown",
    youtubeId: "iCvmsMzlF7o",
    duration: "20:19",
    level: "Intermediate",
    questions: [
      { prompt: "What is Brené Brown's profession?", choices: ["A. Psychologist", "B. Researcher", "C. Teacher", "D. Doctor"], answer: "B" },
      { prompt: "What does she primarily study?", choices: ["A. Economics", "B. Human connection", "C. Technology", "D. History"], answer: "B" },
      { prompt: "What emotion does she say is necessary for connection?", choices: ["A. Happiness", "B. Anger", "C. Vulnerability", "D. Fear"], answer: "C" },
      { prompt: "How long did her research take?", choices: ["A. 2 years", "B. 6 years", "C. 10 years", "D. 1 year"], answer: "B" },
      { prompt: "What did she initially try to do with vulnerability?", choices: ["A. Embrace it", "B. Study it more", "C. Control and predict it", "D. Ignore it"], answer: "C" },
      { prompt: "What do 'wholehearted' people have in common?", choices: ["A. Wealth", "B. Courage to be imperfect", "C. High education", "D. Fame"], answer: "B" },
      { prompt: "What does she say we do when we feel vulnerable?", choices: ["A. We celebrate", "B. We numb it", "C. We share it", "D. We exercise"], answer: "B" },
      { prompt: "What happens when we numb vulnerability?", choices: ["A. We feel better", "B. We also numb joy and gratitude", "C. Nothing changes", "D. We become stronger"], answer: "B" },
      { prompt: "What does she say about children?", choices: ["A. They are not vulnerable", "B. They are hardwired for struggle", "C. They don't need connection", "D. They are always happy"], answer: "B" },
      { prompt: "What is her main message?", choices: ["A. Avoid vulnerability", "B. Be perfect", "C. Let ourselves be seen", "D. Work harder"], answer: "C" },
      { prompt: "Where did she give this talk?", choices: ["A. TEDxHouston", "B. TED main stage", "C. A university", "D. A conference"], answer: "A" },
      { prompt: "What did she call her breakdown?", choices: ["A. A crisis", "B. A spiritual awakening", "C. A breakdown/spiritual awakening", "D. A vacation"], answer: "C" },
      { prompt: "Who did she see after her breakdown?", choices: ["A. A doctor", "B. A therapist", "C. A friend", "D. A priest"], answer: "B" },
      { prompt: "What does she say about blame?", choices: ["A. It's healthy", "B. It's a way to discharge pain", "C. It solves problems", "D. It builds connection"], answer: "B" },
      { prompt: "What does she believe about worthiness?", choices: ["A. You must earn it", "B. Only some people have it", "C. We are all worthy of love", "D. It doesn't exist"], answer: "C" },
      { prompt: "What word does she use to describe being fully seen?", choices: ["A. Scary", "B. Beautiful", "C. Vulnerable", "D. All of the above"], answer: "D" },
      { prompt: "What does she say about certainty?", choices: ["A. We need more of it", "B. Faith requires uncertainty", "C. It's always possible", "D. Science provides it"], answer: "B" },
      { prompt: "How does she suggest we practice vulnerability?", choices: ["A. By saying I love you first", "B. By never taking risks", "C. By being perfect", "D. By hiding emotions"], answer: "A" },
      { prompt: "What is the opposite of vulnerability according to her?", choices: ["A. Strength", "B. Numbing", "C. Perfection", "D. Armor"], answer: "D" },
      { prompt: "What does she want the audience to do?", choices: ["A. Read her book", "B. Practice being vulnerable", "C. Avoid emotions", "D. Be more productive"], answer: "B" },
    ],
  },
  {
    id: "ted-02",
    title: "How to speak so that people want to listen",
    speaker: "Julian Treasure",
    youtubeId: "eIho2S0ZahI",
    duration: "9:58",
    level: "Intermediate",
    questions: [
      { prompt: "What does Julian call the most powerful sound in the world?", choices: ["A. Music", "B. The human voice", "C. Nature sounds", "D. Silence"], answer: "B" },
      { prompt: "What are the 'seven deadly sins' of speaking about?", choices: ["A. Grammar mistakes", "B. Habits that push people away", "C. Pronunciation errors", "D. Vocabulary problems"], answer: "B" },
      { prompt: "Which is NOT one of the deadly sins he mentions?", choices: ["A. Gossiping", "B. Judging", "C. Listening", "D. Complaining"], answer: "C" },
      { prompt: "What does 'dogmatism' mean in his context?", choices: ["A. Loving dogs", "B. Confusing facts with opinions", "C. Being quiet", "D. Speaking fast"], answer: "B" },
      { prompt: "What does HAIL stand for?", choices: ["A. Honesty, Authenticity, Integrity, Love", "B. Hope, Action, Intelligence, Luck", "C. Humor, Art, Ideas, Logic", "D. Health, Ambition, Innovation, Leadership"], answer: "A" },
      { prompt: "What does he say about register?", choices: ["A. It doesn't matter", "B. Speaking from the chest is more powerful", "C. High pitch is better", "D. Whisper always"], answer: "B" },
      { prompt: "What vocal tool does he demonstrate with 'we'?", choices: ["A. Pace", "B. Pitch", "C. Prosody", "D. Volume"], answer: "C" },
      { prompt: "What does he say about silence?", choices: ["A. Avoid it", "B. It's powerful and creates attention", "C. It's rude", "D. Fill it with words"], answer: "B" },
      { prompt: "What exercise does he recommend before speaking?", choices: ["A. Running", "B. Vocal warm-ups", "C. Meditation", "D. Reading"], answer: "B" },
      { prompt: "What would the world be like if everyone spoke powerfully?", choices: ["A. Louder", "B. A world designed to sound beautiful", "C. More arguments", "D. Quieter"], answer: "B" },
      { prompt: "What is negativity in speaking?", choices: ["A. Speaking softly", "B. Always finding fault", "C. Being honest", "D. Asking questions"], answer: "B" },
      { prompt: "What does he say about excuses?", choices: ["A. They're fine", "B. They're a deadly sin — blaming others", "C. Everyone makes them", "D. They show honesty"], answer: "B" },
      { prompt: "What is 'penultimate' in his list of sins?", choices: ["A. Exaggeration", "B. Lying", "C. Embroidery/exaggeration", "D. Shouting"], answer: "C" },
      { prompt: "What does timbre mean?", choices: ["A. Speed of speech", "B. The quality/feel of a voice", "C. Volume", "D. Accent"], answer: "B" },
      { prompt: "What does he say about pace?", choices: ["A. Always speak fast", "B. Varying pace creates interest", "C. Slow is always better", "D. It doesn't matter"], answer: "B" },
      { prompt: "What is the effect of speaking very slowly?", choices: ["A. Boredom", "B. Excitement and emphasis", "C. Confusion", "D. Anger"], answer: "B" },
      { prompt: "How many tools in his 'vocal toolbox'?", choices: ["A. 4", "B. 6", "C. 8", "D. 10"], answer: "B" },
      { prompt: "What does he compare the voice to?", choices: ["A. A weapon", "B. An instrument we all play", "C. A machine", "D. A computer"], answer: "B" },
      { prompt: "What is his final wish?", choices: ["A. More TED talks", "B. Conscious listening and speaking", "C. Louder voices", "D. More technology"], answer: "B" },
      { prompt: "What does he say can start a war?", choices: ["A. Money", "B. The human voice", "C. Technology", "D. Silence"], answer: "B" },
    ],
  },
];

type Tab = "ielts" | "ted" | "dictation";

const DICT_SETS = [
  { id: "d1", title: "Daily Conversations", level: "Beginner", segments: [
    { text: "I would like to book a table for two please.", hint: "Restaurant" },
    { text: "Could you tell me how to get to the train station.", hint: "Directions" },
    { text: "The meeting has been postponed until next Monday.", hint: "Office" },
    { text: "I'm afraid we don't have any rooms available tonight.", hint: "Hotel" },
    { text: "Would you mind turning down the music a little.", hint: "Request" },
  ]},
  { id: "d2", title: "Academic English", level: "Intermediate", segments: [
    { text: "The research findings suggest a strong correlation between exercise and mental health.", hint: "Research" },
    { text: "Students are required to submit their assignments by the end of the week.", hint: "University" },
    { text: "The professor emphasized the importance of critical thinking in academic writing.", hint: "Lecture" },
    { text: "According to the data renewable energy consumption has increased significantly.", hint: "Statistics" },
    { text: "The study was conducted over a period of three years with five hundred participants.", hint: "Methodology" },
  ]},
  { id: "d3", title: "IELTS Listening Style", level: "Intermediate", segments: [
    { text: "The library is open from nine thirty in the morning until eight in the evening.", hint: "Information" },
    { text: "You will need to bring your passport and two photographs for the application.", hint: "Requirements" },
    { text: "The course runs for twelve weeks and classes are held on Tuesday and Thursday.", hint: "Course" },
    { text: "There is a deposit of two hundred pounds which is refundable at the end of the lease.", hint: "Accommodation" },
    { text: "The museum offers guided tours at eleven AM and two PM on weekdays.", hint: "Facilities" },
  ]},
];

function DictationSection() {
  const [setIdx, setSetIdx] = useState<number | null>(null);
  const [segIdx, setSegIdx] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showAns, setShowAns] = useState(false);
  const [playing, setPlaying] = useState(false);

  const set = setIdx !== null ? DICT_SETS[setIdx] : null;
  const seg = set?.segments[segIdx];

  function play() {
    if (!seg) return;
    setPlaying(true);
    const u = new SpeechSynthesisUtterance(seg.text);
    u.lang = "en-GB"; u.rate = 0.85;
    u.onend = () => setPlaying(false);
    speechSynthesis.speak(u);
  }

  function check() {
    if (!seg || !input.trim()) return;
    setChecked(true);
    const c = seg.text.toLowerCase().replace(/[.,!?'"]/g, "").split(/\s+/);
    const u = input.trim().toLowerCase().replace(/[.,!?'"]/g, "").split(/\s+/);
    let m = 0; c.forEach((w, i) => { if (u[i] === w) m++; });
    if (m / c.length >= 0.7) setScore(s => s + 1);
  }

  function next() {
    if (!set) return;
    if (segIdx < set.segments.length - 1) { setSegIdx(i => i + 1); setInput(""); setChecked(false); setShowAns(false); }
    else { setSetIdx(null); setSegIdx(0); setScore(0); }
  }

  const acc = (() => {
    if (!checked || !seg) return 0;
    const c = seg.text.toLowerCase().replace(/[.,!?'"]/g, "").split(/\s+/);
    const u = input.trim().toLowerCase().replace(/[.,!?'"]/g, "").split(/\s+/);
    let m = 0; c.forEach((w, i) => { if (u[i] === w) m++; });
    return Math.round((m / c.length) * 100);
  })();

  if (setIdx === null) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DICT_SETS.map((s, i) => (
          <button key={s.id} onClick={() => { setSetIdx(i); setSegIdx(0); setInput(""); setChecked(false); setScore(0); }}
            className="text-left bg-q-card border-[2.5px] border-q-border rounded-2xl p-4 hover:border-q-purple/60 hover:shadow-md transition-all">
            <div className="text-sm font-extrabold text-q-text">{s.title}</div>
            <div className="text-xs font-bold text-q-text-3 mt-1">{s.segments.length} sentences · {s.level}</div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setSetIdx(null)} className="text-xs font-extrabold text-q-purple-d mb-4 hover:underline">← Back</button>
      <div className="flex justify-between mb-4">
        <span className="text-xs font-extrabold text-q-text-2">{set!.title} · {segIdx + 1}/{set!.segments.length}</span>
        <span className="text-xs font-extrabold text-q-teal-d">Score: {score}</span>
      </div>
      <div className="w-full h-2 bg-q-lav rounded-pill overflow-hidden border border-q-border mb-5">
        <div className="h-full bg-q-purple rounded-pill transition-all" style={{ width: `${((segIdx + (checked ? 1 : 0)) / set!.segments.length) * 100}%` }} />
      </div>
      <div className="bg-q-sky border-[2.5px] border-q-blue rounded-3xl p-5 mb-5 text-center">
        <p className="text-xs font-bold text-q-blue-d mb-2">💡 {seg!.hint}</p>
        <button onClick={play} disabled={playing} className={`w-14 h-14 rounded-full flex items-center justify-center border-[3px] mx-auto ${playing ? "bg-q-blue border-q-blue-d animate-pulse" : "bg-q-blue border-q-blue-d hover:scale-105"}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="white"><polygon points="6,3 17,10 6,17" /></svg>
        </button>
      </div>
      <textarea value={input} onChange={e => !checked && setInput(e.target.value)} disabled={checked} placeholder="Type what you hear..." rows={2}
        className="w-full px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text placeholder:text-q-text-3 focus:border-q-purple focus:outline-none resize-none mb-4" />
      {!checked ? (
        <button onClick={check} disabled={!input.trim()} className="w-full py-3 rounded-pill text-sm font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 disabled:opacity-40">Check</button>
      ) : (
        <div className={`rounded-2xl border-[2.5px] p-4 ${acc >= 70 ? "bg-q-mint border-q-teal" : "bg-q-peach border-q-coral"}`}>
          <div className="text-sm font-extrabold mb-2">{acc >= 90 ? "🎉 Excellent!" : acc >= 70 ? "✅ Good!" : "❌ Try again!"} {acc}%</div>
          <button onClick={() => setShowAns(!showAns)} className="text-xs font-extrabold text-q-purple-d hover:underline mb-2 block">{showAns ? "Hide" : "Show answer"}</button>
          {showAns && <div className="bg-q-lav rounded-xl p-3 mb-3"><p className="text-xs font-bold text-q-purple-d">{seg!.text}</p></div>}
          <button onClick={next} className="w-full py-3 rounded-pill text-sm font-extrabold text-white bg-q-blue border-[3px] border-q-blue-d hover:opacity-90">{segIdx < set!.segments.length - 1 ? "Next →" : "Done"}</button>
        </div>
      )}
    </div>
  );
}

export default function ListeningPage() {
  const [tab, setTab] = useState<Tab>("ielts");
  const [setIndex, setSetIndex] = useState(0);
  const [phase, setPhase] = useState<"select" | "listen" | "answer">("select");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentSet = LISTENING_SETS[setIndex];
  const currentQ = currentSet?.questions[questionIndex];

  // Build full transcript from all questions in the set
  const fullTranscript = currentSet?.questions
    .map(q => q.context?.replace(/^Transcript:\s*/i, "").replace(/['"]/g, "") || "")
    .filter(Boolean)
    .join(" ... ") || "";

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  function playFullAudio() {
    if (!fullTranscript) return;
    setIsPlaying(true);
    speak(fullTranscript, {
      rate: 0.8,
      lang: "en-GB",
      onEnd: () => setIsPlaying(false),
    });
    setPlayCount(c => c + 1);
  }

  function stopAudio() {
    stopSpeaking();
    setIsPlaying(false);
  }

  function startAnswering() {
    stopAudio();
    setPhase("answer");
    setQuestionIndex(0);
    setSelected(null);
    setChecked(false);
  }

  function handleCheck() {
    if (!selected) return;
    setChecked(true);
    if (currentQ?.type === "fill_blank") {
      if (selected.toLowerCase().trim() === currentQ.correctAnswer?.toLowerCase()) {
        setScore(s => s + 1);
      }
    } else if (selected === currentQ?.correctAnswer) {
      setScore(s => s + 1);
    }
  }

  function handleNext() {
    if (questionIndex < (currentSet?.questions.length || 0) - 1) {
      setQuestionIndex(i => i + 1);
      setSelected(null);
      setChecked(false);
    } else {
      // Finished this set
      setFinished(true);
    }
  }

  function nextSet() {
    if (setIndex < LISTENING_SETS.length - 1) {
      setSetIndex(i => i + 1);
    } else {
      setSetIndex(0); // Loop back
    }
    setPhase("listen");
    setQuestionIndex(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
    setPlayCount(0);
    setFinished(false);
    stopAudio();
  }

  // TED Talk state
  const [tedIndex, setTedIndex] = useState<number | null>(null);
  const [tedQIndex, setTedQIndex] = useState(0);
  const [tedSelected, setTedSelected] = useState<string | null>(null);
  const [tedChecked, setTedChecked] = useState(false);
  const [tedScore, setTedScore] = useState(0);

  const currentTed = tedIndex !== null ? TED_TALKS[tedIndex] : null;
  const currentTedQ = currentTed?.questions[tedQIndex];

  function checkTed() {
    if (!tedSelected || !currentTedQ) return;
    setTedChecked(true);
    if (tedSelected === currentTedQ.answer) setTedScore(s => s + 1);
  }

  function nextTedQ() {
    if (!currentTed) return;
    if (tedQIndex < currentTed.questions.length - 1) {
      setTedQIndex(i => i + 1);
      setTedSelected(null);
      setTedChecked(false);
    } else {
      setTedIndex(null);
      setTedQIndex(0);
      setTedScore(0);
    }
  }

  if (!currentSet) {
    return (
      <AppShell>
        <div className="p-8 text-center">
          <p className="text-lg font-black text-q-text">Đã hoàn thành tất cả bài nghe! 🎉</p>
        </div>
      </AppShell>
    );
  }

  const isCorrect = currentQ?.type === "fill_blank"
    ? selected?.toLowerCase().trim() === currentQ?.correctAnswer?.toLowerCase()
    : selected === currentQ?.correctAnswer;

  return (
    <AppShell>
      <div className="p-6 lg:p-8 font-nunito max-w-3xl">
        <h1 className="text-2xl font-black text-q-text mb-2">Luyện Listening</h1>
        <p className="text-sm font-bold text-q-text-2 mb-4">Nghe và trả lời câu hỏi.</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("ielts")} className={`px-5 py-2.5 rounded-pill text-sm font-extrabold border-[2.5px] transition-all ${tab === "ielts" ? "bg-q-blue text-white border-q-blue-d" : "bg-q-card text-q-text-2 border-q-border hover:border-q-blue/50"}`}>
            🎧 IELTS Practice
          </button>
          <button onClick={() => setTab("dictation")} className={`px-5 py-2.5 rounded-pill text-sm font-extrabold border-[2.5px] transition-all ${tab === "dictation" ? "bg-q-purple text-white border-q-purple-d" : "bg-q-card text-q-text-2 border-q-border hover:border-q-purple/50"}`}>
            ✍️ Dictation
          </button>
          <button onClick={() => setTab("ted")} className={`px-5 py-2.5 rounded-pill text-sm font-extrabold border-[2.5px] transition-all ${tab === "ted" ? "bg-q-coral text-white border-q-coral-d" : "bg-q-card text-q-text-2 border-q-border hover:border-q-coral/50"}`}>
            🎬 TED Talks
          </button>
        </div>

        {/* DICTATION TAB */}
        {tab === "dictation" && (
          <DictationSection />
        )}

        {/* TED TALKS TAB */}
        {tab === "ted" && tedIndex === null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TED_TALKS.map((talk, idx) => (
              <button key={talk.id} onClick={() => { setTedIndex(idx); setTedQIndex(0); setTedSelected(null); setTedChecked(false); setTedScore(0); }}
                className="text-left bg-q-card border-[2.5px] border-q-border rounded-3xl overflow-hidden hover:border-q-coral/60 hover:shadow-md transition-all group">
                <div className="w-full aspect-video bg-gray-100 relative">
                  <img src={`https://img.youtube.com/vi/${talk.youtubeId}/mqdefault.jpg`} alt={talk.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">{talk.duration}</div>
                </div>
                <div className="p-4">
                  <div className="text-sm font-extrabold text-q-text group-hover:text-q-coral-d mb-1">{talk.title}</div>
                  <div className="text-xs font-bold text-q-text-2">{talk.speaker} · {talk.questions.length} questions</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {tab === "ted" && currentTed && currentTedQ && (
          <div>
            <button onClick={() => setTedIndex(null)} className="text-xs font-extrabold text-q-purple-d mb-4 hover:underline">← Back</button>
            <h2 className="text-lg font-black text-q-text mb-1">{currentTed.title}</h2>
            <p className="text-xs font-bold text-q-text-2 mb-4">{currentTed.speaker} · Q{tedQIndex + 1}/{currentTed.questions.length} · Score: {tedScore}</p>

            <div className="w-full h-2 bg-q-lav rounded-pill overflow-hidden border border-q-border mb-4">
              <div className="h-full bg-q-coral rounded-pill transition-all" style={{ width: `${((tedQIndex + (tedChecked ? 1 : 0)) / currentTed.questions.length) * 100}%` }} />
            </div>

            <div className="w-full aspect-video rounded-3xl overflow-hidden border-[2.5px] border-q-border mb-5">
              <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${currentTed.youtubeId}`} title={currentTed.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>

            <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 mb-4">
              <p className="text-sm font-extrabold text-q-text mb-4">{currentTedQ.prompt}</p>
              <div className="space-y-2">
                {currentTedQ.choices.map(c => {
                  const id = c.charAt(0);
                  let style = "border-q-border bg-q-cream";
                  if (tedChecked && id === currentTedQ.answer) style = "border-q-teal bg-q-mint";
                  else if (tedChecked && id === tedSelected && id !== currentTedQ.answer) style = "border-q-coral bg-q-peach";
                  else if (!tedChecked && id === tedSelected) style = "border-q-purple bg-q-lav";
                  return (
                    <button key={c} onClick={() => !tedChecked && setTedSelected(id)} disabled={tedChecked}
                      className={`w-full text-left px-4 py-3 rounded-2xl border-[2.5px] transition-all ${style}`}>
                      <span className="text-sm font-bold text-q-text">{c}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {!tedChecked ? (
              <button onClick={checkTed} disabled={!tedSelected} className="w-full py-3 rounded-pill text-sm font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 disabled:opacity-40">Check</button>
            ) : (
              <div className={`rounded-2xl border-[2.5px] p-4 ${tedSelected === currentTedQ.answer ? "bg-q-mint border-q-teal" : "bg-q-peach border-q-coral"}`}>
                <div className="text-sm font-extrabold mb-2">{tedSelected === currentTedQ.answer ? "✅ Correct!" : `❌ Answer: ${currentTedQ.answer}`}</div>
                <button onClick={nextTedQ} className="w-full py-3 rounded-pill text-sm font-extrabold text-white bg-q-coral border-[3px] border-q-coral-d hover:opacity-90">
                  {tedQIndex < currentTed.questions.length - 1 ? "Next →" : "Done"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* IELTS TAB */}
        {tab === "ielts" && phase === "select" && (
          <div>
            <p className="text-sm font-bold text-q-text-2 mb-4">Chọn chủ đề để luyện nghe:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LISTENING_SETS.map((set, idx) => (
                <button
                  key={set.id}
                  onClick={() => { setSetIndex(idx); setPhase("listen"); setQuestionIndex(0); setSelected(null); setChecked(false); setScore(0); setPlayCount(0); setFinished(false); }}
                  className="text-left bg-q-card border-[2.5px] border-q-border rounded-2xl p-4 hover:border-q-blue/60 hover:shadow-md transition-all"
                >
                  <div className="text-sm font-extrabold text-q-text">{set.title}</div>
                  <div className="text-xs font-bold text-q-text-3 mt-1">{set.questions.length} questions · {set.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "ielts" && phase !== "select" && (
          <div>
            <button onClick={() => setPhase("select")} className="text-xs font-extrabold text-q-purple-d mb-4 hover:underline">← Chọn chủ đề khác</button>
        <p className="text-sm font-bold text-q-text-2 mb-6">
          Bộ {setIndex + 1}/{LISTENING_SETS.length}: {currentSet.title}
        </p>

        {/* PHASE 1: Listen to full audio */}
        {phase === "listen" && (
          <div className="space-y-6">
            <div className="bg-q-sky border-[2.5px] border-q-blue rounded-3xl p-6 text-center">
              <div className="text-xs font-extrabold text-q-blue-d uppercase tracking-wider mb-2">
                Bước 1: Nghe toàn bộ đoạn
              </div>
              <p className="text-sm font-bold text-q-text-2 mb-4">
                {currentSet.description}
              </p>
              <p className="text-xs font-bold text-q-text-3 mb-4">
                🎧 Nghe kỹ đoạn hội thoại/bài nói, sau đó trả lời {currentSet.questions.length} câu hỏi.
                Bạn có thể nghe lại nhiều lần.
              </p>

              {/* Play button */}
              <button
                onClick={isPlaying ? stopAudio : playFullAudio}
                className={`w-16 h-16 rounded-full flex items-center justify-center border-[3px] mx-auto transition-all ${
                  isPlaying
                    ? "bg-q-coral border-q-coral-d animate-pulse"
                    : "bg-q-blue border-q-blue-d hover:scale-105"
                }`}
              >
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                    <rect x="4" y="4" width="12" height="12" rx="2" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                    <polygon points="6,3 17,10 6,17" />
                  </svg>
                )}
              </button>

              <p className="text-[10px] font-bold text-q-blue-d mt-3">
                {isPlaying ? "Đang phát... Nhấn để dừng" : `Nhấn để nghe · Đã phát ${playCount} lần`}
              </p>
            </div>

            {/* Ready button */}
            <button
              onClick={startAnswering}
              disabled={playCount === 0}
              className="w-full py-3.5 rounded-pill text-base font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {playCount === 0 ? "Nghe audio trước đã" : `Sẵn sàng trả lời ${currentSet.questions.length} câu →`}
            </button>
          </div>
        )}

        {/* PHASE 2: Answer questions */}
        {phase === "answer" && !finished && currentQ && (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-q-text-2">
                Câu {questionIndex + 1}/{currentSet.questions.length}
              </span>
              <span className="text-xs font-extrabold text-q-teal-d">Đúng: {score}</span>
            </div>
            <div className="w-full h-2 bg-q-lav rounded-pill overflow-hidden border border-q-border mb-6">
              <div
                className="h-full bg-q-blue rounded-pill transition-all"
                style={{ width: `${((questionIndex + (checked ? 1 : 0)) / currentSet.questions.length) * 100}%` }}
              />
            </div>

            {/* Replay mini button */}
            <div className="flex justify-end mb-3">
              <button
                onClick={playFullAudio}
                disabled={isPlaying}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[10px] font-extrabold text-q-blue-d bg-q-sky border-[2px] border-q-blue hover:opacity-80 disabled:opacity-50"
              >
                <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
                  <polygon points="6,3 17,10 6,17" />
                </svg>
                Nghe lại
              </button>
            </div>

            {/* Question */}
            <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 mb-4">
              <div className="text-xs font-extrabold text-q-purple-d uppercase tracking-wider mb-2">
                {currentQ.type === "fill_blank" ? "Điền từ" : "Chọn đáp án đúng"}
              </div>
              <p className="text-sm font-extrabold text-q-text mb-4">{currentQ.prompt}</p>

              {currentQ.type === "fill_blank" ? (
                <input
                  type="text"
                  value={selected || ""}
                  onChange={e => !checked && setSelected(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && selected && !checked && handleCheck()}
                  disabled={checked}
                  placeholder="Nhập đáp án..."
                  className="w-full px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text focus:border-q-purple focus:outline-none"
                />
              ) : (
                <div className="space-y-2">
                  {currentQ.choices?.map(c => {
                    let style = "border-q-border bg-q-card";
                    if (checked && c.id === currentQ.correctAnswer) style = "border-q-teal bg-q-mint";
                    else if (checked && c.id === selected && !isCorrect) style = "border-q-coral bg-q-peach";
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
              )}
            </div>

            {/* Check / Feedback */}
            {!checked ? (
              <button
                onClick={handleCheck}
                disabled={!selected}
                className="w-full py-3 rounded-pill text-sm font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 disabled:opacity-40"
              >
                Kiểm tra
              </button>
            ) : (
              <div className={`rounded-2xl border-[2.5px] p-4 ${isCorrect ? "bg-q-mint border-q-teal" : "bg-q-peach border-q-coral"}`}>
                <div className="text-sm font-extrabold mb-1">
                  {isCorrect ? "✅ Chính xác!" : `❌ Đáp án đúng: ${currentQ.correctAnswer}`}
                </div>
                <p className="text-xs font-bold text-q-text-2 mb-3">{currentQ.explanation}</p>
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-pill text-sm font-extrabold text-white bg-q-blue border-[3px] border-q-blue-d hover:opacity-90"
                >
                  {questionIndex < currentSet.questions.length - 1 ? "Câu tiếp →" : "Xem kết quả"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* FINISHED */}
        {finished && (
          <div className="text-center space-y-6">
            <div className="bg-q-lav border-[2.5px] border-q-purple rounded-3xl p-8">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-xl font-black text-q-purple-d mb-2">Hoàn thành!</h2>
              <p className="text-lg font-black text-q-text">
                {score}/{currentSet.questions.length} câu đúng
              </p>
              <p className="text-sm font-bold text-q-text-2 mt-2">
                {score === currentSet.questions.length
                  ? "Hoàn hảo! Tai nghe của bạn rất tốt!"
                  : score >= currentSet.questions.length * 0.7
                  ? "Tốt lắm! Tiếp tục luyện nhé."
                  : "Cần luyện thêm. Thử nghe lại bộ này nhé!"}
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setPhase("listen"); setQuestionIndex(0); setSelected(null); setChecked(false); setScore(0); setPlayCount(0); setFinished(false); }}
                className="px-6 py-3 rounded-pill text-sm font-extrabold text-q-purple-d bg-q-card border-[2.5px] border-q-border hover:bg-q-lav"
              >
                Làm lại bộ này
              </button>
              <button
                onClick={nextSet}
                className="px-6 py-3 rounded-pill text-sm font-extrabold text-white bg-q-blue border-[3px] border-q-blue-d hover:opacity-90"
              >
                Bộ tiếp theo →
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
