"use client";

import type { ReactNode } from "react";
import { PRESS_SOFT_CLASS } from "@/libs/press";

/**
 * Selectable chip with three styles: `filled` (movies filter panel — gold
 * filled when active), `outline` (reviews-style tabs and wishlist status
 * chips — transparent with gold border + text when active) and `selectable`
 * (admin console pickers — a surface tile that fills gold when chosen, with
 * an optional trailing icon such as a remove-X).
 */
export default function Chip({
  label,
  active,
  onClick,
  variant = "filled",
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: "filled" | "outline" | "selectable";
  /** Trailing glyph inside the chip, e.g. an X marking a removable pick. */
  icon?: ReactNode;
}) {
  const base = `inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap border ${PRESS_SOFT_CLASS} disabled:cursor-not-allowed disabled:opacity-50`;
  const filled = `rounded-(--radius-sm) px-4 py-2 text-xs font-semibold ${
    active
      ? "border-(--color-gold) bg-(--color-gold) text-(--color-on-accent) shadow-(--shadow-glow) hover:brightness-110"
      : "border-(--color-border) bg-transparent text-white hover:border-(--color-gold)/40 hover:text-(--color-gold-light)"
  }`;
  const outline = `rounded-(--radius-sm) px-4 py-1.5 text-sm ${
    active
      ? "border-(--color-gold) text-(--color-gold) hover:bg-(--color-gold)/10"
      : "border-transparent text-(--color-text-muted) hover:border-(--color-border-strong) hover:text-(--color-text-primary)"
  }`;
  const selectable = `rounded-md px-3.5 py-2 text-xs font-semibold ${
    active
      ? "border-(--color-gold) bg-(--color-gold) text-(--color-on-accent)"
      : "border-(--color-border) bg-(--color-surface-2) text-(--color-text-primary) hover:border-(--color-gold)/40 hover:text-(--color-gold-light)"
  }`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`${base} ${variant === "outline" ? outline : variant === "selectable" ? selectable : filled}`}
    >
      {label}
      {icon}
    </button>
  );
}
