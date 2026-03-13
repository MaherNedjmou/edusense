"use client";

import { forwardRef } from "react";

type ButtonVariant = "primary" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", style, children, ...props }, ref) => {
    const base =
      "relative inline-flex items-center justify-center gap-2 font-semibold text-sm px-5 py-2 rounded-xl border-2 cursor-pointer select-none transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000]";

    const variants: Record<ButtonVariant, string> = {
      primary: "bg-secondary text-black border-secondary",
      outline: "bg-background text-primary border-primary/30",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        style={style}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;