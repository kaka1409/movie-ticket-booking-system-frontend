"use client";

import { PRESS_SOFT_CLASS } from "@/libs/press";

/**
 * Selectable filter chip with two styles: `filled` (movies filter panel —
 * gold filled when active) and `outline` (reviews-style tabs and wishlist
 * status chips — transparent with gold border + text when active).
 */
export default function Chip({
  label,
  active,
  onClick,
  variant = "filled",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: "filled" | "outline";
}) {
  const base = `cursor-pointer whitespace-nowrap rounded-(--radius-sm) border px-4 ${PRESS_SOFT_CLASS} disabled:cursor-not-allowed disabled:opacity-50`;
  const filled = `py-2 text-xs font-semibold ${
    active
      ? "border-(--color-gold) bg-(--color-gold) text-(--color-on-accent) shadow-(--shadow-glow) hover:brightness-110"
      : "border-(--color-border) bg-transparent text-white hover:border-(--color-gold)/40 hover:text-(--color-gold-light)"
  }`;
  const outline = `py-1.5 text-sm ${
    active
      ? "border-(--color-gold) text-(--color-gold) hover:bg-(--color-gold)/10"
      : "border-transparent text-(--color-text-muted) hover:border-(--color-border-strong) hover:text-(--color-text-primary)"
  }`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`${base} ${variant === "outline" ? outline : filled}`}
    >
      {label}
    </button>
  );
}
