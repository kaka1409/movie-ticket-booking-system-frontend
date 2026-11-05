"use client";

import { useMemo } from "react";
import { Chart } from "react-chartjs-2";
import "@/libs/chartjs";
import { BarChart3 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAdminChartTheme } from "@/features/admin/hooks/useAdminChartTheme";
import type { AdminAnalyticsDataPoint, AdminAnalyticsTimeRange } from "@/features/admin/types";
import type { ChartData, ChartOptions } from "chart.js";

interface RevenueAttendanceChartProps {
  range7d: AdminAnalyticsDataPoint[];
  range30d: AdminAnalyticsDataPoint[];
  range12m: AdminAnalyticsDataPoint[];
  /** Controlled by the KPI card's shared range filter — this chart has no pills of its own. */
  selectedRange: AdminAnalyticsTimeRange;
}

/**
 * Main dual-axis analytics chart contrasting ticket & F&B revenue against customer attendance.
 */
export default function RevenueAttendanceChart({
  range7d,
  range30d,
  range12m,
  selectedRange,
}: RevenueAttendanceChartProps) {
  const { locale, translate } = useLocale();
  const { palette } = useAdminChartTheme();

  const currentDataPoints = useMemo(() => {
    if (selectedRange === "30d") return range30d;
    if (selectedRange === "12m") return range12m;
    return range7d;
  }, [selectedRange, range7d, range30d, range12m]);

  const chartData: ChartData = useMemo(() => {
    return {
      labels: currentDataPoints.map((point) => point.label),
      datasets: [
        {
          type: "bar" as const,
          label: translate("admin.dashboard.ticket_revenue"),
          data: currentDataPoints.map((point) => point.ticketRevenue),
          backgroundColor: palette.gold,
          borderRadius: 4,
          yAxisID: "yRevenue",
          stack: "revenue",
          order: 2,
        },
        {
          type: "bar" as const,
          label: translate("admin.dashboard.fnb_revenue"),
          data: currentDataPoints.map((point) => point.fnbRevenue),
          backgroundColor: palette.emerald,
          borderRadius: 4,
          yAxisID: "yRevenue",
          stack: "revenue",
          order: 2,
        },
        {
          type: "line" as const,
          label: translate("admin.dashboard.attendance"),
          data: currentDataPoints.map((point) => point.attendance),
          borderColor: palette.cyan,
          backgroundColor: palette.cyan,
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: palette.cyan,
          pointBorderColor: palette.surface,
          pointBorderWidth: 2,
          tension: 0.35,
          yAxisID: "yAttendance",
          order: 1,
        },
      ],
    };
  }, [currentDataPoints, palette, translate]);

  const chartOptions: ChartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "end",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            pointStyle: "circle",
            color: palette.textMuted,
            font: { size: 12, weight: 500 },
            padding: 16,
          },
        },
        tooltip: {
          backgroundColor: palette.tooltipBg,
          titleColor: palette.textPrimary,
          bodyColor: palette.textPrimary,
          borderColor: palette.tooltipBorder,
          borderWidth: 1,
          padding: 10,
          titleFont: { size: 12, weight: "bold" },
          bodyFont: { size: 12 },
          callbacks: {
            label: (context) => {
              const datasetLabel = context.dataset.label || "";
              const value = Number(context.raw || 0);
              if (context.dataset.yAxisID === "yAttendance") {
                return ` ${datasetLabel}: ${value.toLocaleString(locale === "vn" ? "vi-VN" : "en-US")} ${translate("admin.dashboard.visitors_suffix")}`;
              }
              const formattedVnd =
                value >= 1000000000
                  ? `${(value / 1000000000).toFixed(1)}B ₫`
                  : `${(value / 1000000).toFixed(1)}M ₫`;
              return ` ${datasetLabel}: ${formattedVnd}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: palette.textMuted,
            font: { size: 11 },
          },
        },
        yRevenue: {
          type: "linear",
          position: "left",
          grid: {
            color: palette.gridLine,
          },
          ticks: {
            color: palette.textMuted,
            font: { size: 11 },
            callback: (value) => {
              const num = Number(value);
              if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
              if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
              return `${num}`;
            },
          },
        },
        yAttendance: {
          type: "linear",
          position: "right",
          grid: { drawOnChartArea: false },
          ticks: {
            color: palette.textMuted,
            font: { size: 11 },
            callback: (value) => `${value}`,
          },
        },
      },
    };
  }, [palette, locale, translate]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--color-surface-2) text-(--color-text-secondary)">
          <BarChart3 size={16} aria-hidden />
        </div>
        <div>
          <h2 className="text-sm font-bold text-(--color-text-primary)">
            {translate("admin.dashboard.chart_revenue_attendance_title")}
          </h2>
          <p className="text-2xs text-(--color-text-muted)">
            {translate("admin.dashboard.chart_revenue_attendance_subtitle")}
          </p>
        </div>
      </div>

      <div className="mt-4 min-h-[300px] flex-1">
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
