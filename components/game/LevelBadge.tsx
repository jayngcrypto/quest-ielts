import { cn } from "@/lib/utils";
import { getLevelFromXP, LEVEL_NAMES } from "@/lib/tokens";

interface LevelBadgeProps {
  xp: number;
  showName?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export default function LevelBadge({ xp, showName = true, size = "md", className }: LevelBadgeProps) {
  const level = getLevelFromXP(xp);
  const name = LEVEL_NAMES[Math.min(level, 10)] || "Huyền thoại";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border-2 font-extrabold",
        "bg-q-yellow border-q-amber text-q-amber-d",
        { "px-3 py-1 text-xs": size === "sm", "px-4 py-2 text-sm": size === "md" },
        className
      )}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <polygon points="7,1 8.8,5.2 13.5,5.4 10,8.4 11.1,13 7,10.5 2.9,13 4,8.4 0.5,5.4 5.2,5.2"
          fill="#FBBF24" stroke="#B45309" strokeWidth="1"/>
      </svg>
      Cấp {level}{showName && ` · ${name}`}
    </div>
  );
}
