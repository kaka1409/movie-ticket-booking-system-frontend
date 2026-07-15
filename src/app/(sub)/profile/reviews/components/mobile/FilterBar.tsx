"use client";

import type { FilterKey } from "@/features/reviews/mock";

export default function FilterBar({
  filters,
  active,
  onChange,
}: {
  filters: readonly { key: string; label: string }[];
  active: FilterKey;
  onChange: (key: FilterKey) => void;
}) {
  return (
    <nav className="flex items-center gap-3 overflow-x-auto py-2 text-sm">
      {filters.map((f) => {
        const isActive = f.key === active;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onChange(f.key as FilterKey)}
            className={`whitespace-nowrap rounded-sm px-4 py-1.5 transition-colors ${
              isActive
                ? "border border-(--color-gold) text-(--color-gold)"
                : "border border-transparent text-(--color-text-muted)"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </nav>
  );
}
