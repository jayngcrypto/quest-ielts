"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "teal";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-extrabold rounded-pill cursor-pointer transition-all duration-150 active:scale-95 border-none",
          {
            "bg-q-purple text-white border-[3px] border-q-purple-d hover:opacity-90": variant === "primary",
            "bg-q-card text-q-purple-d border-[2.5px] border-q-border hover:bg-q-lav": variant === "secondary",
            "bg-transparent text-q-text-2 border-[2px] border-q-border hover:bg-q-lav": variant === "ghost",
            "bg-q-coral text-white border-[3px] border-q-coral-d hover:opacity-90": variant === "danger",
            "bg-q-teal text-white border-[3px] border-q-teal-d hover:opacity-90": variant === "teal",
            "px-4 py-2 text-xs": size === "sm",
            "px-6 py-3 text-sm": size === "md",
            "px-8 py-4 text-base": size === "lg",
            "w-full": fullWidth,
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
