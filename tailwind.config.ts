import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["var(--font-nunito)", "sans-serif"],
      },
      colors: {
        q: {
          cream:    "#FFF8F0",
          lav:      "#EDE8FF",
          mint:     "#E4F7F0",
          sky:      "#E3F2FF",
          peach:    "#FFE8E0",
          yellow:   "#FFF3CC",
          purple:   "#A78BFA",
          "purple-d":"#7C5CBF",
          teal:     "#34D399",
          "teal-d": "#0F9E72",
          pink:     "#F472B6",
          "pink-d": "#BE3A85",
          blue:     "#60A5FA",
          "blue-d": "#1D6FBF",
          amber:    "#FBBF24",
          "amber-d":"#B45309",
          coral:    "#FB7185",
          "coral-d":"#BE1D3E",
          text:     "#2D2040",
          "text-2": "#6B5F8A",
          "text-3": "#A99CC4",
          border:   "#E8E0F5",
          card:     "#FFFFFF",
        },
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
        pill: "999px",
      },
      boxShadow: {
        card:  "0 2px 12px 0 rgba(167,139,250,0.08)",
        float: "0 8px 32px 0 rgba(167,139,250,0.14)",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop": {
          "0%":   { transform: "scale(0.92)", opacity: "0" },
          "100%": { transform: "scale(1)",    opacity: "1" },
        },
        "xp-fill": {
          "0%":   { width: "0%" },
          "100%": { width: "var(--xp-w)" },
        },
        "float": {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-6px)" },
        },
        "wiggle": {
          "0%,100%": { transform: "rotate(-3deg)" },
          "50%":     { transform: "rotate(3deg)" },
        },
        "pulse-ring": {
          "0%":   { transform: "scale(1)",    opacity: "0.6" },
          "100%": { transform: "scale(1.6)",  opacity: "0" },
        },
        "sparkle": {
          "0%,100%": { opacity: "0", transform: "scale(0) rotate(0deg)" },
          "50%":     { opacity: "1", transform: "scale(1) rotate(180deg)" },
        },
        "bounce-in": {
          "0%":   { transform: "scale(0.3)", opacity: "0" },
          "50%":  { transform: "scale(1.05)" },
          "70%":  { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "glow": {
          "0%,100%": { boxShadow: "0 0 5px rgba(167,139,250,0.3), 0 0 10px rgba(167,139,250,0.1)" },
          "50%":     { boxShadow: "0 0 20px rgba(167,139,250,0.6), 0 0 40px rgba(167,139,250,0.3)" },
        },
        "slide-right": {
          "0%":   { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "float-slow": {
          "0%,100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%":     { transform: "translateY(-8px) rotate(1deg)" },
          "66%":     { transform: "translateY(-4px) rotate(-1deg)" },
        },
      },
      animation: {
        "fade-up":     "fade-up 0.4s ease both",
        "pop":         "pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        "xp-fill":     "xp-fill 1s ease both",
        "float":       "float 3s ease-in-out infinite",
        "wiggle":      "wiggle 0.5s ease-in-out",
        "pulse-ring":  "pulse-ring 1.2s ease-out infinite",
        "sparkle":     "sparkle 2s ease-in-out infinite",
        "bounce-in":   "bounce-in 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
        "glow":        "glow 2s ease-in-out infinite",
        "slide-right": "slide-right 0.5s ease both",
        "float-slow":  "float-slow 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
