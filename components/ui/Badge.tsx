import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "purple" | "amber" | "teal" | "coral" | "pink" | "blue";
}

const styles = {
  purple: "bg-q-lav text-q-purple-d border-q-purple",
  amber:  "bg-q-yellow text-q-amber-d border-q-amber",
  teal:   "bg-q-mint text-q-teal-d border-q-teal",
  coral:  "bg-q-peach text-q-coral-d border-q-coral",
  pink:   "bg-[#FBEAF0] text-q-pink-d border-q-pink",
  blue:   "bg-q-sky text-q-blue-d border-q-blue",
};

export default function Badge({ variant = "purple", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border-2 px-3 py-1 text-xs font-extrabold",
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
