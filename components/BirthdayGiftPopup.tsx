"use client";

import { useState } from "react";

export default function BirthdayGiftPopup() {
  const [stage, setStage] = useState<"gift" | "message" | "hidden">("gift");

  if (stage === "hidden") return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2.5 h-2.5 rounded-full animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
              background: ["#A78BFA", "#FB7185", "#FBBF24", "#34D399", "#60A5FA", "#F472B6"][i % 6],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {stage === "gift" && (
        <div className="flex flex-col items-center gap-6 animate-bounce-in">
          <p className="text-lg font-extrabold text-white drop-shadow-lg">Long ơi, mở quà sinh nhật này! 🎁</p>
          <button
            onClick={() => setStage("message")}
            className="group relative cursor-pointer border-none bg-transparent p-0 transition-transform hover:scale-110 active:scale-95"
          >
            {/* Gift box */}
            <div className="w-32 h-32 relative animate-wiggle-slow">
              {/* Box body */}
              <div className="absolute bottom-0 w-32 h-24 bg-gradient-to-b from-[#FB7185] to-[#E11D48] rounded-2xl border-[3px] border-[#BE123C] shadow-xl" />
              {/* Ribbon vertical */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-24 bg-[#FBBF24] border-x-[2px] border-[#B45309]" />
              {/* Lid */}
              <div className="absolute top-[18px] -left-2 w-36 h-8 bg-gradient-to-b from-[#FB7185] to-[#E11D48] rounded-xl border-[3px] border-[#BE123C] shadow-lg" />
              {/* Ribbon horizontal */}
              <div className="absolute top-[20px] -left-2 w-36 h-5 bg-[#FBBF24] border-y-[2px] border-[#B45309] rounded-sm" />
              {/* Bow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2">
                <svg width="48" height="28" viewBox="0 0 48 28" fill="none">
                  <ellipse cx="14" cy="14" rx="12" ry="10" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
                  <ellipse cx="34" cy="14" rx="12" ry="10" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
                  <circle cx="24" cy="16" r="5" fill="#B45309" />
                </svg>
              </div>
              {/* Sparkles around gift */}
              <div className="absolute -top-3 -right-3 text-xl animate-ping">✨</div>
              <div className="absolute -bottom-2 -left-3 text-lg animate-ping" style={{ animationDelay: "0.5s" }}>✨</div>
            </div>
          </button>
          <p className="text-sm font-bold text-white/80">Click vào hộp quà để mở nè ~</p>
        </div>
      )}

      {stage === "message" && (
        <div className="bg-white rounded-3xl border-[3px] border-q-purple p-8 max-w-sm mx-4 text-center animate-bounce-in shadow-2xl relative overflow-hidden">
          {/* Decorative top */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#A78BFA] via-[#FB7185] to-[#FBBF24]" />
          
          <div className="text-5xl mb-4">🎂</div>
          <h2 className="text-2xl font-black text-q-text mb-3">
            Happy Birthday Long! 🎉
          </h2>
          <div className="space-y-2 mb-6">
            <p className="text-base text-q-text-2 leading-relaxed">
              Chúc Long sinh nhật vui vẻ!
            </p>
            <p className="text-base text-q-text-2 leading-relaxed">
              Cố gắng đạt band nhé 💪
            </p>
            <p className="text-lg font-extrabold text-q-pink-d mt-3">
              Mãi iu {"<3"} 💜
            </p>
          </div>
          <button
            onClick={() => setStage("hidden")}
            className="px-8 py-3 rounded-pill text-base font-extrabold text-white bg-q-purple border-[3px] border-q-purple-d hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            Bắt đầu hành trình thôi! 🚀
          </button>
        </div>
      )}
    </div>
  );
}
