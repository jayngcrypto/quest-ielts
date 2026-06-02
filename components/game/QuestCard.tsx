"use client";
import { cn } from "@/lib/utils";
import { ZONE_CONFIG } from "@/lib/tokens";

type ZoneId = keyof typeof ZONE_CONFIG;

interface QuestCardProps {
  zone: ZoneId;
  title: string;
  duration: string;
  xp: number;
  progress: number;
  status: "todo" | "in-progress" | "done" | "locked";
  onClick?: () => void;
}

export default function QuestCard({ zone, title, duration, xp, progress, status, onClick }: QuestCardProps) {
  const z = ZONE_CONFIG[zone];

  return (
    <div
      onClick={status !== "locked" ? onClick : undefined}
      className={cn(
        "bg-q-card border-[2.5px] border-q-border rounded-3xl p-4 transition-all duration-150 relative overflow-hidden",
        status !== "locked" && "cursor-pointer hover:-translate-y-0.5 hover:shadow-card",
        status === "locked" && "opacity-55 cursor-not-allowed",
        status === "done" && "border-q-teal"
      )}
    >
      {/* Zone color strip */}
      <div className="absolute top-0 left-0 w-full h-1 rounded-t-3xl" style={{ background: z.color }} />

      <div className="flex items-start gap-3 mt-1">
        {/* Status icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border-2"
          style={{ background: z.bg, borderColor: z.border }}
        >
          {status === "done" && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8L6.5 11.5L13 5" stroke="#0F9E72" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {status === "in-progress" && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="5" stroke={z.colorD} strokeWidth="2"/>
              <path d="M8 5V8L10 10" stroke={z.colorD} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
          {status === "todo" && (
            <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: z.colorD }} />
          )}
          {status === "locked" && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={z.colorD} strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="6" width="8" height="6" rx="1.5"/>
              <path d="M5 6V4.5C5 3.1 5.9 2 7 2C8.1 2 9 3.1 9 4.5V6"/>
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-extrabold text-q-text leading-snug mb-1 truncate">{title}</div>
          <div className="flex items-center gap-3 text-xs font-bold text-q-text-2">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 3V6L8 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {duration}
            </span>
            <span className="flex items-center gap-1" style={{ color: "#B45309" }}>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M6 1L7.5 4.5H11L8.5 7L9.5 11L6 9L2.5 11L3.5 7L1 4.5H4.5L6 1Z" fill="#FBBF24"/>
              </svg>
              +{xp} XP
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {status !== "locked" && (
        <div className="mt-3 w-full h-1.5 bg-q-lav rounded-pill overflow-hidden">
          <div
            className="h-full rounded-pill transition-all duration-500"
            style={{ width: `${progress}%`, background: status === "done" ? "#34D399" : z.color }}
          />
        </div>
      )}
    </div>
  );
}
