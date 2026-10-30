"use client";

import { Loader2, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type AdminButtonVariant = "primary" | "outline" | "ghost" | "danger";
export type AdminButtonSize = "sm" | "md" | "icon";

const VARIANT_CLASSES: Record<AdminButtonVariant, string> = {
  primary: "bg-(--color-gold) text-(--color-on-accent) hover:shadow-(--shadow-glow)",
  outline:
    "border border-(--color-border) text-(--color-text-secondary) hover:border-(--color-gold)/40 hover:text-(--admin-accent-ink)",
  ghost: "text-(--color-text-muted) hover:bg-(--color-surface-2) hover:text-(--color-text-primary)",
  danger: "border border-red-500/50 text-red-500 hover:bg-red-500/10",
};

const SIZE_CLASSES: Record<AdminButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-[11px]",
  md: "h-9 gap-2 px-3.5 text-xs",
  icon: "h-8 w-8",
};

/**
 * Compact console button — the storefront `Button` is a full-width, tall CTA
 * that would not fit a toolbar or a table row. Icon-only usage keeps its
 * accessible name from `label`.
 */
export default function AdminButton({
  children,
  label,
  icon: Icon,
  variant = "outline",
  size = "sm",
  type = "button",
  isLoading = false,
  disabled = false,
  title,
  className = "",
  onClick,
}: {
  children?: ReactNode;
  /** Accessible name; required when the button renders no text. */
  label?: string;
  icon?: LucideIcon;
  variant?: AdminButtonVariant;
  size?: AdminButtonSize;
  type?: "button" | "submit";
  isLoading?: boolean;
  disabled?: boolean;
  title?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={children ? undefined : label}
      aria-busy={isLoading || undefined}
      title={title ?? label}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl font-bold tracking-wider uppercase transition duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
    >
      {isLoading ? (
        <Loader2 size={14} className="animate-spin" aria-hidden />
      ) : (
        Icon && <Icon size={size === "md" ? 15 : 14} aria-hidden className="shrink-0" />
      )}
      {children}
    </button>
  );
}
