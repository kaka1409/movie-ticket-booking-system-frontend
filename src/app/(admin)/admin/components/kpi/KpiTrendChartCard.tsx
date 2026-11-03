"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import "@/libs/chartjs";
import { TrendingUp, Popcorn } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";
import { useAdminChartTheme } from "@/features/admin/hooks/useAdminChartTheme";
import type { ChartOptions } from "chart.js";

interface KpiTrendChartCardProps {
  todayRevenue: number;
  growthPercent: number;
  sparkline: number[];
}

/**
 * Top KPI card presenting concessions (F&B) revenue with a trendline.
 */
export default function KpiTrendChartCard({
  todayRevenue,
  growthPercent,
  sparkline,
}: KpiTrendChartCardProps) {
  const { locale, translate } = useLocale();
  const { palette } = useAdminChartTheme();

  const chartData = useMemo(() => {
    return {
      labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
      datasets: [
        {
          data: sparkline,
          fill: true,
          borderColor: palette.emerald,
          backgroundColor: palette.emeraldAlpha,
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointBackgroundColor: palette.emerald,
          pointBorderColor: palette.surface,
          pointBorderWidth: 2,
        },
      ],
    };
  }, [sparkline, palette]);

  const chartOptions: ChartOptions<"line"> = useMemo(() => {
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
            title: (items) => items[0]?.label || "",
            label: (context) => `${context.parsed.y}M ₫`,
          },
        },
      },
      scales: {
        x: { display: false },
        y: { display: false, min: Math.min(...sparkline) * 0.9 },
      },
    };
  }, [palette, sparkline]);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-card)">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-2xs font-semibold tracking-wider text-(--color-text-muted) uppercase">
            {translate("admin.dashboard.kpi_fnb_title")}
          </span>
          <div className="mt-1 text-xl font-bold tracking-tight text-(--color-text-primary) xl:text-2xl">
            {formatVND(todayRevenue, locale)}
          </div>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
          <Popcorn size={18} aria-hidden />
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
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
