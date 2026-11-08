"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useLocale } from "@/contexts/LocaleContext";
import type {
  AdminAnalyticsTimeRange,
  AdminDashboardMetrics,
  AdminKpiSummary,
} from "@/features/admin/types";
import KpiMetricGrid from "./KpiMetricGrid";
import KpiRangeFilter from "./KpiRangeFilter";
import type { KpiMetricKey } from "@/features/admin/utils/kpiMetrics";

// Chart.js is ~200KB of canvas code the metric grid does not need — split it
// into on-demand chunks so the KPI tiles paint without waiting for it.
const chartLoading = () => (
  <div className="h-72 animate-pulse rounded-xl bg-(--color-surface-2)" />
);
const KpiDetailChart = dynamic(() => import("./KpiDetailChart"), {
  ssr: false,
  loading: chartLoading,
});
const RevenueAttendanceChart = dynamic(() => import("../analytics/RevenueAttendanceChart"), {
  ssr: false,
  loading: chartLoading,
});

interface AdminKpiRowProps {
  kpi: AdminKpiSummary;
  analytics: AdminDashboardMetrics["analytics"];
}

/**
 * KPI overview card: one shared reporting-window filter drives an 8-tile metric
 * grid, a detail chart for the selected metric, and the revenue/attendance
 * combo chart side by side.
 */
export default function AdminKpiRow({ kpi, analytics }: AdminKpiRowProps) {
  const { translate } = useLocale();
  const [selectedRange, setSelectedRange] = useState<AdminAnalyticsTimeRange>("7d");
  const [selectedMetric, setSelectedMetric] = useState<KpiMetricKey>("revenue");

  return (
    <section
      aria-label="KPI Overview"
      className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-bold text-(--color-text-primary)">
          {translate("admin.dashboard.kpi_overview_title")}
        </h2>
        <KpiRangeFilter selectedRange={selectedRange} onRangeChange={setSelectedRange} />
      </div>

      <KpiMetricGrid
        kpi={kpi}
        selectedRange={selectedRange}
        selectedMetric={selectedMetric}
        onSelectMetric={setSelectedMetric}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <KpiDetailChart kpi={kpi} metric={selectedMetric} range={selectedRange} />
        <RevenueAttendanceChart
          range7d={analytics.range7d}
          range30d={analytics.range30d}
          range12m={analytics.range12m}
          selectedRange={selectedRange}
        />
      </div>
    </section>
  );
}
