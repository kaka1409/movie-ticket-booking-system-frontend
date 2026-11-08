"use client";

import { TrendingUp } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAdminChartTheme } from "@/features/admin/hooks/useAdminChartTheme";
import type {
  AdminAnalyticsTimeRange,
  AdminKpiSummary,
} from "@/features/admin/types";
import {
  formatKpiValue,
  getKpiGrowth,
  getKpiWindow,
  KPI_METRICS,
  type KpiMetricKey,
} from "./kpiMetrics";

interface KpiMetricGridProps {
  kpi: AdminKpiSummary;
  selectedRange: AdminAnalyticsTimeRange;
  selectedMetric: KpiMetricKey;
  onSelectMetric: (metric: KpiMetricKey) => void;
}

/**
 * 4x2 grid of selectable KPI tiles: each shows the selected window's headline
 * figure and growth badge. Selecting a tile drives the detail chart.
 */
export default function KpiMetricGrid({
  kpi,
  selectedRange,
  selectedMetric,
  onSelectMetric,
}: KpiMetricGridProps) {
  const { locale, translate } = useLocale();
  const { palette } = useAdminChartTheme();
  const ticketsSuffix = translate("admin.dashboard.tickets_suffix");

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {KPI_METRICS.map((metric) => {
        const window = getKpiWindow(kpi, metric.key, selectedRange);
        const growth = getKpiGrowth(window);
        const isSelected = metric.key === selectedMetric;

        return (
          <button
            key={metric.key}
            type="button"
            onClick={() => onSelectMetric(metric.key)}
            aria-pressed={isSelected}
            className={`flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 text-left transition-colors ${
              isSelected
                ? "border-(--color-gold)/50 bg-(--color-surface-2)"
                : "border-(--color-border)/70 bg-(--color-surface-2)/30 hover:border-(--color-border-strong) hover:bg-(--color-surface-2)/60"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: palette[metric.paletteKey] }}
                aria-hidden
              />
              <span className="text-xs font-semibold text-(--color-text-primary)">
                {translate(metric.titleKey)}
              </span>
            </div>

            <div className="flex items-end justify-between gap-2">
              <span className="truncate text-xl font-bold tracking-tight text-(--color-text-primary)">
                {formatKpiValue(metric.key, window, locale, ticketsSuffix)}
              </span>
              {growth.percent !== null && (
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-semibold ${
                    growth.percent >= 0
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-rose-500/10 text-rose-500"
                  }`}
                >
                  <TrendingUp
                    size={11}
                    aria-hidden
                    className={growth.percent < 0 ? "rotate-180" : undefined}
                  />
                  <span>
                    {growth.percent > 0 ? "+" : ""}
                    {growth.percent}%
                  </span>
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
