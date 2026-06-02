import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  days: number;
  size?: "sm" | "md";
  className?: string;
}

export default function StreakBadge({ days, size = "md", className }: StreakBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border-2 font-extrabold",
        "bg-q-peach border-q-coral text-q-coral-d",
        { "px-3 py-1 text-xs": size === "sm", "px-4 py-2 text-sm": size === "md" },
        className
      )}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M7 1C7 1 11 4.5 11 8C11 10.2 9.2 12 7 12C4.8 12 3 10.2 3 8C3 6 4.5 4 5 3C5 5 6.5 5.5 6.5 5.5C6.5 5.5 7 3 7 1Z"
          fill="#FB7185" stroke="#BE1D3E" strokeWidth="1"/>
      </svg>
      {days} ngày liên tiếp
    </div>
  );
}
