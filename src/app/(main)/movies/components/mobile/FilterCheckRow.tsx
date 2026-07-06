"use client";

export default function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="flex items-center gap-2.5 py-0.5 group"
      aria-pressed={checked}
    >
      <span
        className={`
          flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-150
          ${
            checked
              ? "border-(--color-gold) bg-(--color-gold)"
              : "border-(--color-border) bg-transparent group-hover:border-(--color-gold)/40"
          }
        `}
      >
        {checked && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path
              d="M1 3.5L3.5 6L8 1"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span
        className={`text-sm font-medium transition-colors`}
      >
        {label}
      </span>
    </button>
  );
}
