"use client";

import { useMemo } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import "@/libs/chartjs";
import { TrendingUp } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND, toLocaleTag } from "@/libs/utils";
import { useAdminChartTheme } from "@/features/admin/hooks/useAdminChartTheme";
import type {
  AdminAnalyticsTimeRange,
  AdminKpiSummary,
} from "@/features/admin/types";
import type { ChartOptions } from "chart.js";
import {
  formatKpiValue,
  getKpiChartKind,
  getKpiGrowth,
  getKpiValueFormat,
  getKpiWindow,
  isOccupancyWindow,
  KPI_METRICS,
  type KpiMetricKey,
  type KpiValueFormat,
  type KpiWindow,
} from "./kpiMetrics";

interface KpiDetailChartProps {
  kpi: AdminKpiSummary;
  metric: KpiMetricKey;
  range: AdminAnalyticsTimeRange;
}

function useSeriesScale(series: { value: number }[]) {
  const values = series.map((point) => point.value);
  return {
    minValue: values.length ? Math.min(...values) : 0,
    maxValue: values.length ? Math.max(...values) : 0,
  };
}

function formatTickValue(value: number, format: KpiValueFormat): string {
  switch (format) {
    case "moneyM":
      return `${value}M`;
    case "vnd":
      return `${Math.round(value / 1000)}K`;
    case "percent":
      return `${value}%`;
    default:
      return `${value}`;
  }
}

function CartesianChart({
  window,
  kind,
  color,
  alpha,
  format,
}: {
  window: KpiWindow;
  kind: "line" | "bar";
  color: string;
  alpha: string;
  format: KpiValueFormat;
}) {
  const { palette } = useAdminChartTheme();
  const { locale } = useLocale();
  const { minValue, maxValue } = useSeriesScale(window.series);

  const chartData = useMemo(
    () => ({
      labels: window.series.map((point) => point.label),
      datasets: [
        kind === "line"
          ? {
              data: window.series.map((point) => point.value),
              fill: true,
              borderColor: color,
              backgroundColor: alpha,
              borderWidth: 2.5,
              tension: 0.38,
              pointRadius: 3,
              pointHoverRadius: 6,
              pointBackgroundColor: color,
              pointBorderColor: palette.surface,
              pointBorderWidth: 2,
            }
          : {
              data: window.series.map((point) => point.value),
              backgroundColor: color,
              borderRadius: 6,
              borderSkipped: false,
              barPercentage: 0.55,
              categoryPercentage: 0.8,
            },
      ],
    }),
    [window.series, kind, color, alpha, palette.surface],
  );

  const chartOptions = useMemo<ChartOptions>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600 },
      interaction: { mode: "index", intersect: false },
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
          padding: 8,
          titleFont: { size: 12, weight: "bold" },
          bodyFont: { size: 12 },
          callbacks: {
            title: (items) => items[0]?.label || "",
            label: (context) => {
              const value = Number((context.parsed as { y?: number }).y ?? 0);
              if (format === "moneyM") return ` ${value}M ₫`;
              if (format === "vnd") return ` ${formatVND(value, locale)}`;
              if (format === "percent") return ` ${value}%`;
              return ` ${value.toLocaleString(toLocaleTag(locale))}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: palette.textMuted, font: { size: 11, weight: 500 }, padding: 6 },
        },
        y: {
          grid: { color: palette.gridLine },
          ticks: {
            color: palette.textMuted,
            font: { size: 10 },
            maxTicksLimit: 4,
            callback: (value: string | number) => formatTickValue(Number(value), format),
          },
          ...(kind === "line"
            ? { min: Math.max(0, Math.floor(minValue * 0.85)), max: Math.ceil(maxValue * 1.1) }
            : {}),
        },
      },
    }),
    [palette, kind, format, locale, minValue, maxValue],
  );

  if (kind === "bar")
    return <Bar data={chartData} options={chartOptions as ChartOptions<"bar">} />;
  return <Line data={chartData} options={chartOptions as ChartOptions<"line">} />;
}

function OccupancyGauge({ window }: { window: KpiWindow }) {
  const { palette } = useAdminChartTheme();
  const { locale, translate } = useLocale();
  const occupancy = isOccupancyWindow(window) ? window : null;
  const ratePercent = occupancy?.ratePercent ?? 0;

  const chartData = useMemo(
    () => ({
      datasets: [
        {
          data: [ratePercent, Math.max(0, 100 - ratePercent)],
          backgroundColor: [palette.purple, palette.surfaceTrack],
          borderWidth: 0,
          circumference: 180,
          rotation: -90,
          cutout: "75%",
        },
      ],
    }),
    [ratePercent, palette],
  );

  const chartOptions = useMemo<ChartOptions<"doughnut">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600 },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    }),
    [],
  );

  return (
    <div className="relative flex h-56 w-full items-center justify-center">
      <Doughnut data={chartData} options={chartOptions} />
      {occupancy && (
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className="text-3xl font-extrabold tracking-tight text-(--color-text-primary)">
            {ratePercent}%
          </span>
          <span className="mt-0.5 text-2xs font-medium text-(--color-text-muted)">
            {occupancy.bookedSeats.toLocaleString(toLocaleTag(locale))} /{" "}
            {occupancy.totalSeats.toLocaleString(toLocaleTag(locale))}{" "}
            {translate("admin.dashboard.seats_suffix")}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Detail stage of the KPI overview: renders the selected metric's chart for the
 * selected reporting window — area lines for revenue-style metrics, bars for
 * counts, radial gauge for occupancy.
 */
export default function KpiDetailChart({ kpi, metric, range }: KpiDetailChartProps) {
  const { locale, translate } = useLocale();
  const { palette } = useAdminChartTheme();
  const metricDef = KPI_METRICS.find((entry) => entry.key === metric) ?? KPI_METRICS[0];
  const window = getKpiWindow(kpi, metric, range);
  const growth = getKpiGrowth(window);
  const chartKind = getKpiChartKind(metric);
  const valueFormat = getKpiValueFormat(metric);
  const accentColor = palette[metricDef.paletteKey];
  const accentAlpha = palette[`${metricDef.paletteKey}Alpha`];
  const hasData = isOccupancyWindow(window)
    ? window.totalSeats > 0
    : window.series.some((point) => point.value > 0);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-(--color-border)/70 bg-(--color-surface-2)/30 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: accentColor }}
            aria-hidden
          />
          <h3 className="text-sm font-bold text-(--color-text-primary)">
            {translate(metricDef.titleKey)}
          </h3>
          <span className="text-2xs text-(--color-text-muted)">
            {translate(`admin.dashboard.range_${range}`)}
          </span>
        </div>

        <div className="flex items-baseline gap-2.5">
          <span className="text-xl font-bold tracking-tight text-(--color-text-primary)">
            {formatKpiValue(metric, window, locale, translate("admin.dashboard.tickets_suffix"))}
          </span>
          {growth.percent !== null && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                growth.percent >= 0
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-rose-500/10 text-rose-500"
              }`}
            >
              <TrendingUp
                size={12}
                aria-hidden
                className={growth.percent < 0 ? "rotate-180" : undefined}
              />
              <span>
                {growth.percent > 0 ? "+" : ""}
                {growth.percent}%
              </span>
              <span className="hidden text-2xs font-normal text-(--color-text-muted) sm:inline">
                {translate(growth.vsKey)}
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 h-64 w-full flex-1">
        {hasData ? (
          chartKind === "gauge" ? (
            <OccupancyGauge window={window} />
          ) : (
            <CartesianChart
              window={window}
              kind={chartKind}
              color={accentColor}
              alpha={accentAlpha}
              format={valueFormat}
            />
          )
        ) : (
          <p className="flex h-full items-center justify-center text-2xs text-(--color-text-muted)">
            {translate("admin.dashboard.no_data")}
          </p>
        )}
      </div>
    </div>
  );
}
