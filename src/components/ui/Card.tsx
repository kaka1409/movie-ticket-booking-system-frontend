import type { ReactNode } from "react";

export default function Card({
  selected = false,
  error = false,
  children,
  className = "",
}: {
  selected?: boolean;
  error?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-(--color-surface) shadow-[--shadow-card] transition-all duration-200 ${
        error
          ? "border border-red-500/20 shadow-[0_0_0_1px_rgba(239,68,68,0.06)]"
          : selected
            ? "border border-(--color-gold) shadow-[0_0_0_1px_rgba(255,204,77,0.15)]"
            : "border border-(--color-border)"
      } ${className}`}
    >
      {children}
    </div>
  );
}
