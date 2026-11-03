"use client";

import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import "@/libs/chartjs";
import { Armchair, TrendingUp } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { toLocaleTag } from "@/libs/utils";
import { useAdminChartTheme } from "@/features/admin/hooks/useAdminChartTheme";
import type { ChartOptions } from "chart.js";

interface KpiRadialGaugeCardProps {
  ratePercent: number;
  peakPercent: number;
  differenceFromAverage: number;
  totalSeats: number;
  bookedSeats: number;
}

/**
 * Top KPI card presenting average seat occupancy rate using a semi-doughnut gauge.
 */
export default function KpiRadialGaugeCard({
  ratePercent,
  peakPercent,
  differenceFromAverage,
  totalSeats,
  bookedSeats,
}: KpiRadialGaugeCardProps) {
  const { locale, translate } = useLocale();
  const { palette } = useAdminChartTheme();

  const chartData = useMemo(() => {
    return {
      datasets: [
        {
          data: [ratePercent, Math.max(0, 100 - ratePercent)],
          backgroundColor: [palette.purple, palette.surfaceTrack],
          borderWidth: 0,
          circumference: 180,
          rotation: -90,
          cutout: "78%",
        },
      ],
    };
  }, [ratePercent, palette]);

  const chartOptions: ChartOptions<"doughnut"> = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600 },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    };
  }, []);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-card)">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-2xs font-semibold tracking-wider text-(--color-text-muted) uppercase">
            {translate("admin.dashboard.kpi_occupancy_title")}
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-(--color-text-primary) xl:text-2xl">
              {ratePercent}%
            </span>
            <span className="text-2xs text-(--color-text-muted)">
              {translate("admin.dashboard.peak")}: {peakPercent}%
            </span>
          </div>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-500">
          <Armchair size={18} aria-hidden />
        </div>
      </div>

      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
            <TrendingUp size={14} aria-hidden />
            <span>+{differenceFromAverage}%</span>
            <span className="text-2xs text-(--color-text-muted)">
              {translate("admin.dashboard.vs_average")}
            </span>
          </div>
          <span className="text-2xs text-(--color-text-muted)">
            {bookedSeats.toLocaleString(toLocaleTag(locale))} /{" "}
            {totalSeats.toLocaleString(toLocaleTag(locale))}{" "}
            {translate("admin.dashboard.seats_suffix")}
          </span>
        </div>
        <div className="relative flex h-10 w-24 shrink-0 items-center justify-center overflow-hidden">
          <Doughnut data={chartData} options={chartOptions} />
          <span className="absolute bottom-0 text-2xs font-bold text-(--color-text-primary)">
            {ratePercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
