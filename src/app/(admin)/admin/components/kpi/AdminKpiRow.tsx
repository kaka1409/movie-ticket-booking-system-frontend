"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import type {
  AdminAnalyticsTimeRange,
  AdminDashboardData,
  AdminKpiSummary,
} from "@/features/admin/types";
import KpiDetailChart from "./KpiDetailChart";
import KpiMetricGrid from "./KpiMetricGrid";
import KpiRangeFilter from "./KpiRangeFilter";
import type { KpiMetricKey } from "./kpiMetrics";
import RevenueAttendanceChart from "../analytics/RevenueAttendanceChart";

interface AdminKpiRowProps {
  kpi: AdminKpiSummary;
  analytics: AdminDashboardData["analytics"];
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
