"use client";

import { useLocale } from "@/contexts/LocaleContext";
import type { ReviewFilter, ReviewSort } from "@/features/reviews/types";

/** Mobile review sorter: a horizontally scrollable chip row above the list. */
export default function ReviewSortBar({
  filters,
  active,
  disabled,
  onChange,
  className = "",
}: {
  filters: ReviewFilter[];
  active: ReviewSort;
  disabled: boolean;
  onChange: (next: ReviewSort) => void;
  className?: string;
}) {
  const { translate } = useLocale();

  return (
    <div
      role="group"
      aria-label={translate("movies.detail.sort_reviews")}
      className={`-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] ${className}`}
    >
      {filters.map((filter) => (
        <button
          key={filter.key}
          type="button"
          onClick={() => onChange(filter.key)}
          disabled={disabled}
          aria-pressed={filter.key === active}
          className={`shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold) disabled:cursor-not-allowed disabled:opacity-50 ${
            filter.key === active
              ? "border-(--color-gold) bg-(--color-gold) text-(--color-bg)"
              : "border-(--color-border) text-(--color-text-muted) hover:border-(--color-gold)/40 hover:text-(--color-gold)"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
