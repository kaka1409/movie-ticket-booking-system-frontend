"use client";

import { useLocale } from "@/contexts/LocaleContext";
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
  // Labels come from `reviews.filters.<key>` so the BE-localized `label`
  // payload and the EN mock fallback both render in the UI locale.
  const { translate } = useLocale();
  return (
    <nav className="flex items-center gap-3 overflow-x-auto py-2 text-sm">
      {filters.map((filter) => {
        const isActive = filter.key === active;
        return (
          <button
            key={filter.key}
            type="button"
            onClick={() => onChange(filter.key as FilterKey)}
            className={`whitespace-nowrap rounded-sm px-4 py-1.5 transition-colors ${
              isActive
                ? "border border-(--color-gold) text-(--color-gold)"
                : "border border-transparent text-(--color-text-muted)"
            }`}
          >
            {translate(`reviews.filters.${filter.key}`)}
          </button>
        );
      })}
    </nav>
  );
}
