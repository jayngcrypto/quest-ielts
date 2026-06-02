"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { getProfile, getProgress, updateProfile, UserProfile, UserProgress } from "@/lib/supabase-db";
import { supabase } from "@/lib/supabase";
import { getLevelProgress, LEVEL_NAMES } from "@/lib/tokens";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [targetBand, setTargetBand] = useState("7.0");
  const [examDate, setExamDate] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [prof, prog] = await Promise.all([getProfile(), getProgress()]);
        setProfile(prof);
        setProgress(prog);
        if (prof) {
          setName(prof.display_name || "");
          setTargetBand(String(prof.target_band || 7.0));
          setExamDate(prof.exam_date || "");
        }
      } catch (e) {
        console.error("Failed to fetch profile:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateProfile({
        display_name: name,
        target_band: parseFloat(targetBand),
        exam_date: examDate || null,
      });
      if (updated) {
        setProfile(prev => prev ? { ...prev, display_name: name, target_band: parseFloat(targetBand), exam_date: examDate || null } : prev);
      }
      setEditing(false);
    } catch (e) {
      console.error("Failed to save profile:", e);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <AppShell>
        <div className="p-6 lg:p-8 font-nunito flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-q-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-q-text-2">Đang tải hồ sơ...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const xp = progress?.xp || 0;
  const { level, progress: levelProgress } = getLevelProgress(xp);
  const levelName = LEVEL_NAMES[level] || "Người mới";
  const displayName = profile?.display_name || "Người dùng";
  const currentBand = profile?.current_band || 5.0;
  const targetBandNum = profile?.target_band || 7.0;

  return (
    <AppShell>
      <div className="p-6 lg:p-8 font-nunito max-w-3xl">
        {/* Profile hero */}
        <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-q-purple border-[3px] border-q-purple-d flex items-center justify-center text-3xl font-black text-white flex-shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-black text-q-text">{displayName}</h1>
              <p className="text-sm font-extrabold text-q-purple-d">Cấp {level} · {levelName}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[10px] font-extrabold bg-q-lav text-q-purple-d border border-q-purple rounded-pill px-2.5 py-1">
                  🎓 Du học
                </span>
                <span className="text-[10px] font-extrabold bg-q-lav text-q-purple-d border border-q-purple rounded-pill px-2.5 py-1">
                  💼 Xin việc
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-q-peach border-[2.5px] border-q-coral rounded-3xl p-4 text-center">
            <div className="text-2xl font-black text-q-coral-d">{progress?.streak_days || 0}</div>
            <div className="text-xs font-extrabold text-q-coral-d mt-1">Ngày streak</div>
          </div>
          <div className="bg-q-yellow border-[2.5px] border-q-amber rounded-3xl p-4 text-center">
            <div className="text-2xl font-black text-q-amber-d">{xp.toLocaleString()}</div>
            <div className="text-xs font-extrabold text-q-amber-d mt-1">Tổng XP</div>
          </div>
          <div className="bg-q-lav border-[2.5px] border-q-purple rounded-3xl p-4 text-center">
            <div className="text-2xl font-black text-q-purple-d">{progress?.lessons_completed || 0}</div>
            <div className="text-xs font-extrabold text-q-purple-d mt-1">Bài đã học</div>
          </div>
        </div>

        {/* Band target */}
        <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 mb-6">
          <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-3">Mục tiêu Band</div>
          <div className="flex items-center gap-4 mb-3">
            <div className="text-center">
              <div className="text-2xl font-black text-q-text">{currentBand}</div>
              <div className="text-[10px] font-extrabold text-q-text-3">Hiện tại</div>
            </div>
            <div className="flex-1 h-3 bg-q-lav rounded-pill overflow-hidden border-2 border-q-border relative">
              <div
                className="h-full bg-q-purple rounded-pill"
                style={{ width: `${targetBandNum > currentBand ? ((currentBand - 4) / (targetBandNum - 4)) * 100 : 100}%` }}
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-q-purple">{targetBandNum}</div>
              <div className="text-[10px] font-extrabold text-q-text-3">Mục tiêu</div>
            </div>
          </div>
          {profile?.exam_date && (
            <p className="text-xs font-bold text-q-text-2">
              Ngày thi dự kiến: {new Date(profile.exam_date).toLocaleDateString("vi-VN")}
            </p>
          )}
        </div>

        {/* Edit form */}
        <div className="bg-q-card border-[2.5px] border-q-border rounded-3xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider">Thông tin cá nhân</div>
            <button
              onClick={() => {
                if (editing) {
                  // Cancel — reset form
                  setName(profile?.display_name || "");
                  setTargetBand(String(profile?.target_band || 7.0));
                  setExamDate(profile?.exam_date || "");
                }
                setEditing(!editing);
              }}
              className="text-xs font-extrabold text-q-purple hover:underline"
            >
              {editing ? "Hủy" : "Chỉnh sửa"}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-1.5 block">Họ và tên</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={!editing}
                className="w-full px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text disabled:opacity-70 focus:border-q-purple focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-1.5 block">Band mục tiêu</label>
              <select
                value={targetBand}
                onChange={e => setTargetBand(e.target.value)}
                disabled={!editing}
                className="w-full px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text disabled:opacity-70 focus:border-q-purple focus:outline-none transition-colors"
              >
                {["5.5", "6.0", "6.5", "7.0", "7.5", "8.0"].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-1.5 block">Ngày thi dự kiến</label>
              <input
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                disabled={!editing}
                className="w-full px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-cream text-sm font-bold text-q-text disabled:opacity-70 focus:border-q-purple focus:outline-none transition-colors"
              />
            </div>

            {editing && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 rounded-pill text-sm font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-pill text-sm font-extrabold text-q-coral-d bg-q-peach border-[2.5px] border-q-coral hover:opacity-80 transition-opacity"
        >
          Đăng xuất
        </button>
      </div>
    </AppShell>
  );
}
