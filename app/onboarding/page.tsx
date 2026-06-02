"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import JayBubble from "@/components/jay/JayBubble";
import JayAvatar from "@/components/jay/JayAvatar";

const GOALS = [
  { id: "study_abroad", emoji: "🎓", label: "Du học", desc: "Đạt band để apply trường quốc tế" },
  { id: "work", emoji: "💼", label: "Xin việc", desc: "IELTS cho CV và phỏng vấn" },
  { id: "graduate", emoji: "📜", label: "Tốt nghiệp", desc: "Đạt chuẩn đầu ra đại học" },
  { id: "immigration", emoji: "✈️", label: "Định cư", desc: "IELTS cho visa định cư" },
];

const BANDS = ["4.0", "5.0", "5.5", "6.0", "6.5+"];
const TARGET_BANDS = ["5.5", "6.0", "6.5", "7.0", "7.5", "8.0+"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<string[]>([]);
  const [currentBand, setCurrentBand] = useState("");
  const [targetBand, setTargetBand] = useState("");
  const [examDate, setExamDate] = useState("");

  function toggleGoal(id: string) {
    setGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  }

  function canNext() {
    if (step === 0) return goals.length > 0;
    if (step === 1) return currentBand !== "";
    if (step === 2) return targetBand !== "";
    return true;
  }

  function handleNext() {
    if (step < 3) setStep(step + 1);
    else router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-q-cream font-nunito">
      {/* Top progress */}
      <div className="bg-q-card border-b-2 border-q-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-q-purple rounded-[10px] border-2 border-q-purple-d flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
              <polygon points="11,2 20,8 17,19 5,19 2,8" fill="white" opacity=".9"/>
            </svg>
          </div>
          <span className="text-sm font-black text-q-text">Quest IELTS</span>
        </div>
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-3 h-3 rounded-full border-2 transition-all ${
              i <= step ? "bg-q-purple border-q-purple-d scale-110" : "bg-q-lav border-q-border"
            }`} />
          ))}
        </div>
        <div className="text-xs font-extrabold text-q-text-2">Bước {step + 1}/4</div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left — form */}
        <div className="lg:col-span-3">
          {step === 0 && (
            <div>
              <h1 className="text-2xl font-black text-q-text mb-2">Mục tiêu của bạn là gì?</h1>
              <p className="text-sm font-bold text-q-text-2 mb-6">Chọn một hoặc nhiều mục tiêu. Jay sẽ thiết kế lộ trình phù hợp.</p>
              <div className="grid grid-cols-2 gap-4">
                {GOALS.map(g => (
                  <div
                    key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    className={`cursor-pointer rounded-3xl border-[2.5px] p-5 transition-all ${
                      goals.includes(g.id)
                        ? "border-q-purple bg-q-lav shadow-card"
                        : "border-q-border bg-q-card hover:border-q-purple/50"
                    }`}
                  >
                    <div className="text-2xl mb-2">{g.emoji}</div>
                    <div className="text-sm font-extrabold text-q-text mb-1">{g.label}</div>
                    <div className="text-xs font-bold text-q-text-2">{g.desc}</div>
                    {goals.includes(g.id) && (
                      <div className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-q-purple">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6" fill="#A78BFA"/>
                          <path d="M4 7L6 9L10 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Đã chọn
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-2xl font-black text-q-text mb-2">Band IELTS hiện tại của bạn?</h1>
              <p className="text-sm font-bold text-q-text-2 mb-6">Chưa thi bao giờ? Chọn 4.0 — Jay sẽ bắt đầu từ cơ bản.</p>
              <div className="flex flex-wrap gap-3">
                {BANDS.map(b => (
                  <button
                    key={b}
                    onClick={() => setCurrentBand(b)}
                    className={`px-6 py-4 rounded-2xl border-[2.5px] text-lg font-black transition-all ${
                      currentBand === b
                        ? "border-q-purple bg-q-lav text-q-purple-d"
                        : "border-q-border bg-q-card text-q-text hover:border-q-purple/50"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-black text-q-text mb-2">Band mục tiêu & ngày thi</h1>
              <p className="text-sm font-bold text-q-text-2 mb-6">Jay sẽ tính toán lộ trình phù hợp với thời gian của bạn.</p>
              
              <div className="mb-6">
                <label className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-3 block">Band mục tiêu</label>
                <div className="flex flex-wrap gap-3">
                  {TARGET_BANDS.map(b => (
                    <button
                      key={b}
                      onClick={() => setTargetBand(b)}
                      className={`px-5 py-3 rounded-2xl border-[2.5px] text-base font-black transition-all ${
                        targetBand === b
                          ? "border-q-purple bg-q-lav text-q-purple-d"
                          : "border-q-border bg-q-card text-q-text hover:border-q-purple/50"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-2 block">Ngày thi dự kiến (không bắt buộc)</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                  className="px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-card text-sm font-bold text-q-text focus:border-q-purple focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <JayAvatar size={56} />
                <div>
                  <h1 className="text-2xl font-black text-q-text">Chào mừng đến Quest IELTS!</h1>
                  <p className="text-sm font-bold text-q-text-2">Jay đã sẵn sàng đồng hành cùng bạn.</p>
                </div>
              </div>

              <div className="bg-q-lav border-[2.5px] border-q-border rounded-3xl p-6 mb-6">
                <div className="text-xs font-extrabold text-q-purple-d uppercase tracking-wider mb-3">Lộ trình của bạn</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-q-card rounded-2xl p-3 border-2 border-q-border">
                    <span className="text-lg">🎯</span>
                    <div>
                      <div className="text-sm font-extrabold text-q-text">Mục tiêu: Band {targetBand || "7.0"}</div>
                      <div className="text-xs font-bold text-q-text-2">Từ band {currentBand || "5.0"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-q-card rounded-2xl p-3 border-2 border-q-border">
                    <span className="text-lg">📅</span>
                    <div>
                      <div className="text-sm font-extrabold text-q-text">
                        Thời gian: {examDate ? (() => {
                          const now = new Date();
                          const exam = new Date(examDate);
                          const diffMs = exam.getTime() - now.getTime();
                          const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
                          const months = Math.floor(diffDays / 30);
                          const days = diffDays % 30;
                          if (months > 0 && days > 0) return `~${months} tháng ${days} ngày`;
                          if (months > 0) return `~${months} tháng`;
                          return `${diffDays} ngày`;
                        })() : "Chưa đặt ngày thi"}
                      </div>
                      <div className="text-xs font-bold text-q-text-2">
                        {examDate
                          ? `Ngày thi: ${new Date(examDate).toLocaleDateString("vi-VN")} · 15-20 phút mỗi ngày`
                          : "15-20 phút mỗi ngày, học theo tốc độ của bạn"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-q-card rounded-2xl p-3 border-2 border-q-border">
                    <span className="text-lg">🗺️</span>
                    <div>
                      <div className="text-sm font-extrabold text-q-text">6 khu vực kỹ năng</div>
                      <div className="text-xs font-bold text-q-text-2">Vocabulary → Listening → Reading → Writing → Speaking → Final</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 rounded-pill text-sm font-extrabold text-q-text-2 bg-q-card border-[2.5px] border-q-border hover:bg-q-lav transition-colors"
              >
                ← Quay lại
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="px-8 py-3 rounded-pill text-sm font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {step === 3 ? "Bắt đầu học ngay! 🚀" : "Tiếp tục →"}
            </button>
          </div>
        </div>

        {/* Right — Jay card */}
        <div className="lg:col-span-2 hidden lg:block">
          <JayBubble
            variant="card"
            message={
              step === 0 ? "Hãy chọn mục tiêu để Jay biết bạn cần gì nhé! Mỗi mục tiêu sẽ có lộ trình khác nhau."
              : step === 1 ? "Không sao nếu band còn thấp — ai cũng bắt đầu từ đâu đó. Quan trọng là bắt đầu!"
              : step === 2 ? "Jay sẽ tính toán số bài cần học mỗi ngày dựa trên thời gian bạn có."
              : "Tuyệt vời! Hành trình bắt đầu rồi. Jay sẽ nhắc bạn học mỗi ngày nhé!"
            }
          />
        </div>
      </div>
    </div>
  );
}
