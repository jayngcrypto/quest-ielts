import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Quest IELTS — Biến hành trình IELTS thành phiêu lưu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #F472B6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* Logo gem */}
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "30px",
            border: "3px solid rgba(255,255,255,0.4)",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 22 22">
            <polygon points="11,2 20,8 17,19 5,19 2,8" fill="white" opacity="0.9" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 900,
            color: "white",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          Quest IELTS
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
          }}
        >
          Biến hành trình IELTS thành cuộc phiêu lưu 🗺️
        </div>

        {/* Features row */}
        <div
          style={{
            display: "flex",
            gap: "30px",
            marginTop: "40px",
          }}
        >
          {["🎮 RPG Gamified", "⭐ XP & Level", "🤖 AI Grading", "🔥 Daily Streak"].map((f) => (
            <div
              key={f}
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: "40px",
                padding: "12px 24px",
                fontSize: "18px",
                fontWeight: 700,
                color: "white",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              {f}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            fontSize: "16px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          quest-ielts.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
