"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

export default function Field({
  label,
  icon: Icon,
  disabled = false,
  error,
  children,
}: {
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
  error?: string;
  children: ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <label className="flex flex-col gap-2">
      <span className="px-1 text-xs font-bold tracking-widest text-(--color-gold-light)">
        {label.toUpperCase()}
      </span>
      <div
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`flex items-center gap-3 rounded-xl border bg-(--color-surface) px-4 py-3.5 transition-all duration-150 ${
          disabled
            ? "opacity-80 border-(--color-border)"
            : error
            ? "border-red-500/70"
            : focused
            ? "border-(--color-gold)/60"
            : "border-(--color-border)"
        }`}
      >
        <Icon
          className={`h-5 w-5 shrink-0 transition-colors duration-150 ${
            disabled
              ? "text-(--color-text-muted)"
              : error
              ? "text-red-400"
              : focused
              ? "text-(--color-gold)"
              : "text-(--color-text-muted)"
          }`}
        />
        {children}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 px-1 text-xs text-red-400">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </label>
  );
}
