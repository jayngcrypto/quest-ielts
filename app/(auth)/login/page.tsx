"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Mock mode: bypass Supabase if not configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl === "your_supabase_url" || supabaseUrl.includes("placeholder")) {
      // Mock login — accept any credentials
      setTimeout(() => {
        localStorage.setItem("quest-ielts-user", JSON.stringify({ email, name: email.split("@")[0] }));
        router.push("/dashboard");
      }, 500);
      return;
    }

    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-nunito">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center p-14 text-white relative overflow-hidden" style={{ background: "#7C5CBF" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white" />
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white/20 rounded-xl border-2 border-white/40 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <polygon points="11,2 20,8 17,19 5,19 2,8" fill="white" opacity=".9"/>
              </svg>
            </div>
            <span className="text-xl font-black">Quest IELTS</span>
          </div>

          <h1 className="text-3xl font-black mb-4 leading-tight">
            Biến hành trình IELTS<br/>thành cuộc phiêu lưu.
          </h1>
          <p className="text-base font-bold opacity-80 mb-10 max-w-sm">
            Học theo lộ trình RPG, nhận XP mỗi ngày, lên cấp từng bước cùng mentor Jay.
          </p>

          <div className="space-y-4">
            {[
              { icon: "🗺️", text: "Lộ trình RPG với 6 khu vực kỹ năng" },
              { icon: "⭐", text: "Hệ thống XP & Level rõ ràng" },
              { icon: "🔥", text: "Streak giữ động lực mỗi ngày" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 border border-white/20">
                <span className="text-lg">{f.icon}</span>
                <span className="text-sm font-bold">{f.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-white/10 rounded-2xl p-4 border border-white/20">
            <p className="text-sm font-bold italic opacity-90">
              "Từ band 5.0 lên 7.0 trong 4 tháng. Quest IELTS giúp mình học đều đặn mà không chán!"
            </p>
            <p className="text-xs font-extrabold mt-2 opacity-70">— Thanh Hà, TP.HCM</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-col justify-center px-8 lg:px-16 py-12 bg-q-cream">
        <div className="max-w-sm mx-auto w-full">
          <h2 className="text-2xl font-black text-q-text mb-2">Đăng nhập</h2>
          <p className="text-sm font-bold text-q-text-2 mb-8">Chào mừng trở lại! Tiếp tục hành trình nào.</p>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl px-4 py-3 mb-4 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-card text-sm font-bold text-q-text placeholder:text-q-text-3 focus:border-q-purple focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-extrabold text-q-text-2 uppercase tracking-wider mb-1.5 block">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-2xl border-[2.5px] border-q-border bg-q-card text-sm font-bold text-q-text placeholder:text-q-text-3 focus:border-q-purple focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-pill text-base font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="text-center text-sm font-bold text-q-text-2 mt-8">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-q-purple font-extrabold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
