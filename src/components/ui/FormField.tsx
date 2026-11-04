"use client";

import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

export type FormFieldSize = "sm" | "md" | "lg";

export interface FormFieldProps {
  id?: string;
  label?: string;
  icon?: React.ElementType;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  size?: FormFieldSize;
  uppercaseLabel?: boolean;
  className?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
}

const sizeClasses: Record<FormFieldSize, { container: string; icon: string }> = {
  sm: {
    container: "px-3 py-1.5 text-xs rounded-lg gap-2",
    icon: "h-4 w-4",
  },
  /** Balanced size: comfortable on mobile touch (~44px) and compact on desktop (~40px). */
  md: {
    container: "px-4 py-3 md:py-2.5 text-sm rounded-xl gap-3",
    icon: "h-4.5 w-4.5",
  },
  lg: {
    container: "px-4 py-3.5 text-sm rounded-xl gap-3",
    icon: "h-5 w-5",
  },
};

/**
 * Presentational wrapper for form inputs providing label, leading icon,
 * focus/hover borders, error text, and hint caption.
 */
export default function FormField({
  id,
  label,
  icon: Icon,
  disabled = false,
  required = false,
  error,
  hint,
  size = "md",
  uppercaseLabel = true,
  className = "",
  rightSlot,
  children,
}: FormFieldProps) {
  const currentSize = sizeClasses[size];

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between px-1">
          <label
            htmlFor={id}
            className={`text-xs font-semibold tracking-wider text-(--color-gold-light) flex items-center gap-1 select-none ${
              uppercaseLabel ? "uppercase" : ""
            }`}
          >
            {label}
            {required && <span className="text-red-400">*</span>}
          </label>
        </div>
      )}

      <div
        className={`group flex items-center border bg-(--color-surface) transition-colors duration-150 ${
          currentSize.container
        } ${
          disabled
            ? "opacity-60 border-(--color-border) cursor-not-allowed bg-transparent"
            : error
              ? "border-red-500/80 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
              : "border-(--color-border-strong) hover:border-(--color-gold)/50 focus-within:border-(--color-gold) focus-within:ring-2 focus-within:ring-(--color-gold)/20"
        }`}
      >
        {Icon && (
          <Icon
            className={`shrink-0 transition-colors duration-150 ${currentSize.icon} ${
              disabled
                ? "text-(--color-text-muted)"
                : error
                  ? "text-red-400"
                  : "text-(--color-text-muted) group-focus-within:text-(--color-gold)"
            }`}
          />
        )}

        {children}

        {rightSlot && <div className="shrink-0 flex items-center">{rightSlot}</div>}
      </div>

      {error ? (
        <p className="flex items-center gap-1.5 px-1 text-xs text-red-400">
          <AlertCircle size={12} className="shrink-0" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="px-1 text-2xs text-(--color-text-muted)">{hint}</p>
      ) : null}
    </div>
  );
}
