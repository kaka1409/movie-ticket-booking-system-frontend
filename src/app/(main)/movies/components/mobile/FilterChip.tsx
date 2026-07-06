"use client";

export default function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`
        rounded-(--radius-sm) px-4 py-2 text-xs font-semibold border transition-all duration-150 whitespace-nowrap
        ${
          active
            ? "border-(--color-gold) bg-(--color-gold) text-black shadow-(--shadow-glow)"
            : "border-(--color-border) bg-transparent text-white hover:border-(--color-gold)/40"
        }
      `}
    >
      {label}
    </button>
  );
}
