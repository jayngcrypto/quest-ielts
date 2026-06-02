import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "lav" | "mint" | "yellow" | "peach";
  hover?: boolean;
}

export default function Card({ variant = "default", hover, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border-[2.5px] border-q-border",
        {
          "bg-q-card":    variant === "default",
          "bg-q-lav":     variant === "lav",
          "bg-q-mint":    variant === "mint",
          "bg-q-yellow":  variant === "yellow",
          "bg-q-peach":   variant === "peach",
          "cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 hover:border-q-purple": hover,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
