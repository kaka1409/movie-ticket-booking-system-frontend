"use client";

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
  const base = "whitespace-nowrap border transition-all duration-150 rounded-(--radius-sm) px-4";
  const filled = `py-2 text-xs font-semibold ${
    active
      ? "border-(--color-gold) bg-(--color-gold) text-black shadow-(--shadow-glow)"
      : "border-(--color-border) bg-transparent text-white hover:border-(--color-gold)/40"
  }`;
  const outline = `py-1.5 text-sm ${
    active
      ? "border-(--color-gold) text-(--color-gold)"
      : "border-transparent text-(--color-text-muted)"
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
