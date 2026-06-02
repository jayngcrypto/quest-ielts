"use client";
import { cn } from "@/lib/utils";
import { getLevelProgress } from "@/lib/tokens";
import { useEffect, useRef } from "react";

interface XPBarProps {
  xp: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function XPBar({ xp, showLabel = true, size = "md", className }: XPBarProps) {
  const { level, progress, nextLevelXP } = getLevelProgress(xp);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fillRef.current) {
      fillRef.current.style.setProperty("--xp-w", `${progress}%`);
      fillRef.current.style.width = `${progress}%`;
    }
  }, [progress]);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-extrabold text-q-amber-d">
            {xp.toLocaleString()} XP
          </span>
          <span className="text-xs font-bold text-q-text-3">
            Cấp {level + 1}: {nextLevelXP.toLocaleString()} XP
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-pill overflow-hidden border-2 border-q-amber bg-[#FDE68A]",
          { "h-2": size === "sm", "h-3": size === "md", "h-4": size === "lg" }
        )}
      >
        <div
          ref={fillRef}
          className="h-full bg-q-amber rounded-pill transition-all duration-1000 ease-out"
          style={{ width: 0 }}
        />
      </div>
    </div>
  );
}
