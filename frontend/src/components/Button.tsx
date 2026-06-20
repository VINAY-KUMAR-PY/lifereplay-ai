import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-slate-950 text-white hover:bg-slate-800 disabled:bg-slate-400"
      : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 disabled:text-slate-400";

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
