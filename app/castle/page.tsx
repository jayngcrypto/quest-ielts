"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";

const MOCK_TESTS = [
  { id: "t1", title: "Cambridge IELTS 18 - Test 1 (Reading)", type: "Academic", skills: "Reading", url: "https://tuhocielts.dolenglish.vn/luyen-thi-ielts/ielts-online-test-cambridge-ielts-18-test-1-reading-questions-answer-key-de-bai-dap-an-giai-thich-chi-tiet-free-pdf-download" },
  { id: "t2", title: "Cambridge IELTS 18 - Test 1 (Listening)", type: "Academic", skills: "Listening", url: "https://engnovate.com/ielts-listening-tests/cambridge-ielts-18-academic-listening-test-1/" },
  { id: "t3", title: "Cambridge IELTS 18 - Test 1 (Reading)", type: "Academic", skills: "Reading", url: "https://engnovate.com/ielts-reading-tests/cambridge-ielts-18-academic-reading-test-1/" },
  { id: "t4", title: "Cambridge IELTS 17 - Test 1 (Listening)", type: "Academic", skills: "Listening", url: "https://engnovate.com/ielts-listening-tests/cambridge-ielts-17-academic-listening-test-1/" },
  { id: "t5", title: "Cambridge IELTS 17 - Test 1 (Reading)", type: "Academic", skills: "Reading", url: "https://engnovate.com/ielts-reading-tests/cambridge-ielts-17-academic-reading-test-1/" },
  { id: "t6", title: "IELTS Practice Tests Plus Vol 1", type: "Academic", skills: "L + R + W", url: "https://ieltsonlinetests.com/collection/ielts-practice-tests-plus-volume-1" },
  { id: "t7", title: "IELTS Practice Tests Plus Vol 3", type: "Academic", skills: "L + R + W", url: "https://ieltsonlinetests.com/collection/ielts-practice-tests-plus-volume-3" },
  { id: "t8", title: "IELTS Recent Actual Tests (Free)", type: "Academic", skills: "L + R + W + S", url: "https://ieltsonlinetests.com/recent-actual-tests/free-ielts-mock-test-online" },
];

interface Scores {
  listening: string;
  reading: string;
  writing: string;
  speaking: string;
}

const STORAGE_KEY = "quest-ielts-mock-scores";

export default function CastlePage() {
  const [scores, setScores] = useState<Scores>({
    listening: "",
    reading: "",
    writing: "",
    speaking: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setScores(JSON.parse(stored));
      } catch {}
    }
  }, []);

  function handleScoreChange(field: keyof Scores, value: string) {
    // Allow empty or numbers 0-9
    const num = value.replace(/[^0-9.]/g, "");
    setScores(prev => ({ ...prev, [field]: num }));
    setSaved(false);
  }

  function saveScores() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    setSaved(true);
  }

  function getOverall(): string {
    const vals = [scores.listening, scores.reading, scores.writing, scores.speaking]
      .map(v => parseFloat(v))
      .filter(v => !isNaN(v));
    if (vals.length === 0) return "—";
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    // IELTS rounds to nearest 0.5
    return (Math.round(avg * 2) / 2).toFixed(1);
  }

  return (
    <AppShell>
      <div className="p-6 lg:p-8 font-nunito max-w-5xl">
        {/* Header */}
        <h1 className="text-2xl font-black text-q-text mb-1">🏰 Lâu Đài Mục Tiêu — Mock Test</h1>
        <p className="text-sm font-bold text-q-text-2 mb-6">
          Thi thử full kỹ năng IELTS. Chọn bài thi bên dưới.
        </p>

        {/* Info section */}
        <div className="bg-q-lav border-[2.5px] border-q-purple rounded-3xl p-5 mb-8">
          <div className="space-y-2">
            <p className="text-sm font-bold text-q-purple-d">
              ⏱️ Thời gian: ~2h45 (L: 30p, R: 60p, W: 60p, S: 15p)
            </p>
            <p className="text-sm font-bold text-q-purple-d">
              📝 Lưu ý: Thi trên website ieltsonlinetests.com. Sau khi thi xong, quay lại đây ghi điểm.
            </p>
          </div>
        </div>

        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {MOCK_TESTS.map(test => (
            <div
              key={test.id}
              className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 hover:border-q-purple/60 hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-extrabold text-q-text flex-1">{test.title}</h3>
                <span className="ml-2 px-2.5 py-0.5 rounded-full bg-q-lav border-[2px] border-q-purple text-[10px] font-black text-q-purple-d flex-shrink-0">
                  {test.type}
                </span>
              </div>
              <p className="text-xs font-bold text-q-text-2 mb-4">{test.skills}</p>
              <a
                href={test.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full py-2.5 rounded-xl text-center text-xs font-extrabold text-white bg-q-purple border-[2.5px] border-q-purple-d hover:opacity-90 transition-opacity block"
              >
                Bắt đầu thi →
              </a>
            </div>
          ))}
        </div>

        {/* Score Section */}
        <div className="bg-q-card border-[2.5px] border-q-purple rounded-3xl p-6">
          <h2 className="text-lg font-black text-q-purple-d mb-1">📊 Ghi điểm</h2>
          <p className="text-xs font-bold text-q-text-2 mb-5">Nhập band score sau khi thi xong. Lưu vào máy để theo dõi tiến độ.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="text-[11px] font-extrabold text-q-text-3 uppercase tracking-wider mb-1 block">
                Listening
              </label>
              <input
                type="text"
                value={scores.listening}
                onChange={e => handleScoreChange("listening", e.target.value)}
                placeholder="0-9"
                className="w-full px-4 py-2.5 rounded-xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text focus:outline-none focus:border-q-purple text-center"
              />
            </div>
            <div>
              <label className="text-[11px] font-extrabold text-q-text-3 uppercase tracking-wider mb-1 block">
                Reading
              </label>
              <input
                type="text"
                value={scores.reading}
                onChange={e => handleScoreChange("reading", e.target.value)}
                placeholder="0-9"
                className="w-full px-4 py-2.5 rounded-xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text focus:outline-none focus:border-q-purple text-center"
              />
            </div>
            <div>
              <label className="text-[11px] font-extrabold text-q-text-3 uppercase tracking-wider mb-1 block">
                Writing
              </label>
              <input
                type="text"
                value={scores.writing}
                onChange={e => handleScoreChange("writing", e.target.value)}
                placeholder="0-9"
                className="w-full px-4 py-2.5 rounded-xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text focus:outline-none focus:border-q-purple text-center"
              />
            </div>
            <div>
              <label className="text-[11px] font-extrabold text-q-text-3 uppercase tracking-wider mb-1 block">
                Speaking
              </label>
              <input
                type="text"
                value={scores.speaking}
                onChange={e => handleScoreChange("speaking", e.target.value)}
                placeholder="0-9"
                className="w-full px-4 py-2.5 rounded-xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text focus:outline-none focus:border-q-purple text-center"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm font-black text-q-purple-d">
              Overall: {getOverall()}
            </div>
            <button
              onClick={saveScores}
              className="px-6 py-2.5 rounded-xl text-sm font-extrabold text-white bg-q-purple border-[2.5px] border-q-purple-d hover:opacity-90 transition-opacity"
            >
              {saved ? "✓ Đã lưu" : "💾 Lưu điểm"}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
