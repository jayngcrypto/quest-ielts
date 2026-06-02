"use client";
import { useState } from "react";
import { ALL_QUESTION_SETS, getSetsByZone } from "@/data";
import { ZONE_CONFIG } from "@/lib/tokens";
import type { QuestionSet, Question, ZoneId } from "@/lib/questions";

const ZONES: ZoneId[] = ["vocabulary", "listening", "reading", "writing", "speaking"];

export default function AdminPage() {
  const [activeZone, setActiveZone] = useState<ZoneId>("vocabulary");
  const [selectedSet, setSelectedSet] = useState<QuestionSet | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const zoneSets = getSetsByZone(activeZone);

  return (
    <div className="min-h-screen bg-q-cream font-nunito">
      {/* Header */}
      <div className="bg-q-card border-b-[2.5px] border-q-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-q-purple rounded-[10px] border-2 border-q-purple-d flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
                <polygon points="11,2 20,8 17,19 5,19 2,8" fill="white" opacity=".9"/>
              </svg>
            </div>
            <span className="text-base font-black text-q-text">Quest IELTS — Admin</span>
          </div>
          <div className="text-sm font-bold text-q-text-2">
            Tổng: {ALL_QUESTION_SETS.length} bộ đề ·{" "}
            {ALL_QUESTION_SETS.reduce((s, set) => s + set.questions.length, 0)} câu hỏi
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Zone tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {ZONES.map(z => {
            const config = ZONE_CONFIG[z];
            const count = getSetsByZone(z).length;
            return (
              <button
                key={z}
                onClick={() => { setActiveZone(z); setSelectedSet(null); }}
                className={`px-4 py-2 rounded-pill text-xs font-extrabold border-[2.5px] transition-all ${
                  activeZone === z
                    ? "text-white"
                    : "bg-q-card text-q-text-2 border-q-border hover:border-q-purple/50"
                }`}
                style={activeZone === z ? { background: config.color, borderColor: config.colorD, color: "white" } : {}}
              >
                {config.name} ({count})
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Set list */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-extrabold text-q-text">Bộ đề {ZONE_CONFIG[activeZone].name}</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="text-xs font-extrabold text-q-purple hover:underline"
              >
                + Thêm mới
              </button>
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {zoneSets.map(set => (
                <div
                  key={set.id}
                  onClick={() => setSelectedSet(set)}
                  className={`cursor-pointer rounded-2xl border-[2px] p-3 transition-all ${
                    selectedSet?.id === set.id
                      ? "border-q-purple bg-q-lav"
                      : "border-q-border bg-q-card hover:border-q-purple/50"
                  }`}
                >
                  <div className="text-xs font-extrabold text-q-text truncate">{set.title}</div>
                  <div className="text-[10px] font-bold text-q-text-2 mt-0.5">
                    {set.questions.length} câu · {set.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question detail */}
          <div className="lg:col-span-2">
            {selectedSet ? (
              <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-q-text">{selectedSet.title}</h3>
                    <p className="text-xs font-bold text-q-text-2">{selectedSet.description}</p>
                  </div>
                  <span className="text-[10px] font-extrabold text-q-text-3 bg-q-lav px-2 py-1 rounded-pill">
                    {selectedSet.id}
                  </span>
                </div>

                <div className="space-y-4">
                  {selectedSet.questions.map((q, i) => (
                    <QuestionCard key={q.id} question={q} index={i} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-10 text-center">
                <div className="text-3xl mb-3">📝</div>
                <p className="text-sm font-bold text-q-text-2">Chọn một bộ đề để xem chi tiết</p>
                <p className="text-xs font-bold text-q-text-3 mt-1">
                  Hoặc nhấn "+ Thêm mới" để tạo bộ đề mới
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add form modal */}
        {showAddForm && (
          <AddQuestionModal onClose={() => setShowAddForm(false)} zone={activeZone} />
        )}
      </div>
    </div>
  );
}

function QuestionCard({ question, index }: { question: Question; index: number }) {
  return (
    <div className="bg-q-cream border-2 border-q-border rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-q-purple text-white text-[10px] font-black flex items-center justify-center">
          {index + 1}
        </span>
        <span className="text-[10px] font-extrabold text-q-purple-d uppercase tracking-wider">
          {question.type.replace("_", " ")} · Lv.{question.level}
        </span>
        <span className="text-[10px] font-bold text-q-amber-d ml-auto">+{question.xpReward} XP</span>
      </div>
      <p className="text-sm font-extrabold text-q-text mb-2">{question.prompt}</p>
      {question.context && (
        <p className="text-xs font-bold text-q-text-2 italic bg-q-lav rounded-xl px-3 py-2 mb-2">
          {question.context}
        </p>
      )}
      {question.choices && (
        <div className="space-y-1 mb-2">
          {question.choices.map(c => (
            <div key={c.id} className={`text-xs font-bold px-2 py-1 rounded-lg ${
              c.id === question.correctAnswer ? "bg-q-mint text-q-teal-d" : "text-q-text-2"
            }`}>
              {c.id}. {c.text} {c.id === question.correctAnswer && "✓"}
            </div>
          ))}
        </div>
      )}
      {question.correctAnswer && !question.choices && (
        <div className="text-xs font-bold text-q-teal-d bg-q-mint rounded-lg px-2 py-1 mb-2 inline-block">
          Đáp án: {question.correctAnswer}
        </div>
      )}
      <p className="text-[11px] font-bold text-q-text-2 leading-relaxed">
        💡 {question.explanation}
      </p>
    </div>
  );
}

function AddQuestionModal({ onClose, zone }: { onClose: () => void; zone: ZoneId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-q-card rounded-3xl border-[2.5px] border-q-border p-6 w-full max-w-lg">
        <h3 className="text-lg font-black text-q-text mb-4">Thêm bộ đề mới</h3>
        <p className="text-xs font-bold text-q-text-2 mb-4">
          Zone: {ZONE_CONFIG[zone].name}
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-1.5 block">
              Tiêu đề bộ đề
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="VD: Chủ đề: Môi trường"
              className="w-full px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text focus:border-q-purple focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-1.5 block">
              Mô tả
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="VD: Từ vựng về environment, pollution"
              className="w-full px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text focus:border-q-purple focus:outline-none"
            />
          </div>

          <div className="bg-q-lav rounded-2xl p-4 border-2 border-q-border">
            <p className="text-xs font-bold text-q-text-2">
              ⚠️ Hiện tại admin panel đang ở chế độ xem. Để thêm/sửa câu hỏi thật, cần kết nối Supabase.
              Sau khi setup Supabase, bạn có thể thêm/sửa/xóa câu hỏi trực tiếp từ đây.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-pill text-sm font-extrabold text-q-text-2 bg-q-cream border-[2.5px] border-q-border hover:bg-q-lav transition-colors"
          >
            Đóng
          </button>
          <button
            className="flex-1 py-3 rounded-pill text-sm font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d opacity-50 cursor-not-allowed"
            disabled
          >
            Lưu (cần Supabase)
          </button>
        </div>
      </div>
    </div>
  );
}
