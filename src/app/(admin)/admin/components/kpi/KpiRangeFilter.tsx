"use client";

import { useLocale } from "@/contexts/LocaleContext";
import type { AdminAnalyticsTimeRange } from "@/features/admin/types";

const RANGE_OPTIONS = ["7d", "30d", "12m"] as const;

interface KpiRangeFilterProps {
  selectedRange: AdminAnalyticsTimeRange;
  onRangeChange: (range: AdminAnalyticsTimeRange) => void;
}

/** Shared reporting-window pills for the KPI overview card. */
export default function KpiRangeFilter({ selectedRange, onRangeChange }: KpiRangeFilterProps) {
  const { translate } = useLocale();

  return (
    <div
      role="group"
      aria-label={translate("admin.dashboard.kpi_range_label")}
      className="inline-flex self-start rounded-lg border border-(--color-border) bg-(--color-surface-2) p-0.5 sm:self-auto"
    >
      {RANGE_OPTIONS.map((rangeOption) => {
        const isActive = selectedRange === rangeOption;
        return (
          <button
            key={rangeOption}
            type="button"
            onClick={() => onRangeChange(rangeOption)}
            aria-pressed={isActive}
            className={`cursor-pointer rounded-md px-2 py-0.5 text-3xs font-semibold transition-colors ${
              isActive
                ? "bg-(--color-surface) text-(--color-text-primary) shadow-sm"
                : "text-(--color-text-muted) hover:text-(--color-text-primary)"
            }`}
          >
            {translate(`admin.dashboard.range_${rangeOption}`)}
          </button>
        );
      })}
    </div>
  );
}
