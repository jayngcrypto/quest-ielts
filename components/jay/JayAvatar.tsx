import { cn } from "@/lib/utils";

interface JayAvatarProps {
  size?: number;
  className?: string;
}

export default function JayAvatar({ size = 44, className }: JayAvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full bg-q-purple border-[3px] border-q-purple-d flex items-center justify-center flex-shrink-0",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 26 26" fill="none" aria-hidden>
        <circle cx="13" cy="13" r="10" fill="#EDE8FF"/>
        <circle cx="10" cy="11" r="2.5" fill="#2D2040"/>
        <circle cx="16" cy="11" r="2.5" fill="#2D2040"/>
        <path d="M9 16 Q13 20 17 16" stroke="#2D2040" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="8" cy="15" rx="2.5" ry="1.5" fill="#FB7185" opacity=".7"/>
        <ellipse cx="18" cy="15" rx="2.5" ry="1.5" fill="#FB7185" opacity=".7"/>
      </svg>
    </div>
  );
}
