"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import "@/libs/chartjs";
import { TrendingUp, Ticket } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { toLocaleTag } from "@/libs/utils";
import { useAdminChartTheme } from "@/features/admin/hooks/useAdminChartTheme";
import type { ChartOptions } from "chart.js";

interface KpiBarChartCardProps {
  todayTickets: number;
  growthPercent: number;
  hourlyDistribution: { hour: string; count: number }[];
}

/**
 * Top KPI card presenting tickets sold today with an hourly histogram.
 */
export default function KpiBarChartCard({
  todayTickets,
  growthPercent,
  hourlyDistribution,
}: KpiBarChartCardProps) {
  const { locale, translate } = useLocale();
  const { palette } = useAdminChartTheme();

  const chartData = useMemo(() => {
    return {
      labels: hourlyDistribution.map((item) => item.hour),
      datasets: [
        {
          data: hourlyDistribution.map((item) => item.count),
          backgroundColor: palette.cyan,
          borderRadius: 3,
          barPercentage: 0.65,
        },
      ],
    };
  }, [hourlyDistribution, palette]);

  const chartOptions: ChartOptions<"bar"> = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600 },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          displayColors: false,
          backgroundColor: palette.tooltipBg,
          titleColor: palette.textPrimary,
          bodyColor: palette.textPrimary,
          borderColor: palette.tooltipBorder,
          borderWidth: 1,
          padding: 6,
          titleFont: { size: 11, weight: "bold" },
          bodyFont: { size: 11 },
          callbacks: {
            title: (items) => `${items[0]?.label || ""}`,
            label: (context) =>
              `${context.parsed.y} ${translate("admin.dashboard.tickets_suffix")}`,
          },
        },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
    };
  }, [palette, translate]);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-card)">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-2xs font-semibold tracking-wider text-(--color-text-muted) uppercase">
            {translate("admin.dashboard.kpi_tickets_title")}
          </span>
          <div className="mt-1 text-xl font-bold tracking-tight text-(--color-text-primary) xl:text-2xl">
            {todayTickets.toLocaleString(toLocaleTag(locale))}{" "}
            <span className="text-sm font-medium text-(--color-text-muted)">
              {translate("admin.dashboard.tickets_suffix")}
            </span>
          </div>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500">
          <Ticket size={18} aria-hidden />
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
          <TrendingUp size={14} aria-hidden />
          <span>+{growthPercent}%</span>
          <span className="text-2xs text-(--color-text-muted)">
            {translate("admin.dashboard.vs_yesterday")}
          </span>
        </div>
        <div className="h-10 w-28 shrink-0">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
