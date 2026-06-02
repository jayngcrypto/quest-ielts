import { cn } from "@/lib/utils";
import JayAvatar from "./JayAvatar";

interface JayBubbleProps {
  message: string;
  variant?: "banner" | "card" | "inline";
  dismissable?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export default function JayBubble({
  message, variant = "inline", dismissable, onDismiss, className
}: JayBubbleProps) {
  if (variant === "banner") {
    return (
      <div className={cn(
        "flex items-center gap-4 bg-q-lav border-[2.5px] border-q-border rounded-3xl p-4",
        className
      )}>
        <JayAvatar size={44} />
        <div className="flex-1">
          <div className="text-[10px] font-extrabold text-q-purple uppercase tracking-wide mb-0.5">
            Mentor Jay
          </div>
          <p className="text-sm font-bold text-q-purple-d leading-relaxed italic">
            "{message}"
          </p>
        </div>
        {dismissable && (
          <button
            onClick={onDismiss}
            className="text-xs font-bold text-q-text-3 px-3 py-1.5 border-2 border-q-border rounded-pill bg-q-card hover:bg-q-lav transition-colors"
          >
            Đã hiểu
          </button>
        )}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("bg-q-card border-[2px] border-q-border rounded-3xl p-5", className)}>
        <div className="flex items-center gap-3 mb-3">
          <JayAvatar size={40} />
          <div>
            <div className="text-sm font-extrabold text-q-text">Mentor Jay</div>
            <div className="text-xs font-bold text-q-text-2">Người đồng hành IELTS</div>
          </div>
        </div>
        <div className="bg-q-lav rounded-2xl p-3 text-sm font-bold text-q-purple-d leading-relaxed">
          "{message}"
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3 bg-q-lav border-2 border-q-border rounded-2xl p-3", className)}>
      <JayAvatar size={32} />
      <p className="text-xs font-bold text-q-purple-d leading-snug">
        {message}
      </p>
    </div>
  );
}
