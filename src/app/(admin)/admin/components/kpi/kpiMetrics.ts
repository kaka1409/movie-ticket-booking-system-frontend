import {
  Armchair,
  BadgeCheck,
  DollarSign,
  Hourglass,
  Popcorn,
  Ticket,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { formatVND, toLocaleTag } from "@/libs/utils";
import type {
  AdminAnalyticsTimeRange,
  AdminKpiOccupancyRange,
  AdminKpiRangeData,
  AdminKpiSummary,
} from "@/features/admin/types";

export type KpiMetricKey =
  | "revenue"
  | "tickets"
  | "concessions"
  | "occupancy"
  | "avgTicketPrice"
  | "attachRate"
  | "checkinRate"
  | "pendingPayments";

export interface KpiMetricDef {
  key: KpiMetricKey;
  icon: LucideIcon;
  titleKey: string;
  /** Key into the Chart.js palette returned by `useAdminChartTheme`. */
  paletteKey:
    | "gold"
    | "cyan"
    | "emerald"
    | "purple"
    | "blue"
    | "orange"
    | "teal"
    | "rose";
}

export const KPI_METRICS: KpiMetricDef[] = [
  {
    key: "revenue",
    icon: DollarSign,
    titleKey: "admin.dashboard.kpi_revenue_title",
    paletteKey: "gold",
  },
  {
    key: "tickets",
    icon: Ticket,
    titleKey: "admin.dashboard.kpi_tickets_title",
    paletteKey: "cyan",
  },
  {
    key: "concessions",
    icon: Popcorn,
    titleKey: "admin.dashboard.kpi_fnb_title",
    paletteKey: "emerald",
  },
  {
    key: "occupancy",
    icon: Armchair,
    titleKey: "admin.dashboard.kpi_occupancy_title",
    paletteKey: "purple",
  },
  {
    key: "avgTicketPrice",
    icon: Wallet,
    titleKey: "admin.dashboard.kpi_avg_ticket_title",
    paletteKey: "blue",
  },
  {
    key: "attachRate",
    icon: UtensilsCrossed,
    titleKey: "admin.dashboard.kpi_attach_rate_title",
    paletteKey: "orange",
  },
  {
    key: "checkinRate",
    icon: BadgeCheck,
    titleKey: "admin.dashboard.kpi_checkin_rate_title",
    paletteKey: "teal",
  },
  {
    key: "pendingPayments",
    icon: Hourglass,
    titleKey: "admin.dashboard.kpi_pending_payments_title",
    paletteKey: "rose",
  },
];

/** The window payload of any KPI metric — occupancy carries extra gauge fields. */
export type KpiWindow = AdminKpiRangeData | AdminKpiOccupancyRange;

export function getKpiWindow(
  kpi: AdminKpiSummary,
  metric: KpiMetricKey,
  range: AdminAnalyticsTimeRange,
): KpiWindow {
  switch (metric) {
    case "revenue":
      return kpi.revenue[range];
    case "tickets":
      return kpi.tickets[range];
    case "concessions":
      return kpi.concessions[range];
    case "occupancy":
      return kpi.occupancy[range];
    case "avgTicketPrice":
      return kpi.avgTicketPrice[range];
    case "attachRate":
      return kpi.attachRate[range];
    case "checkinRate":
      return kpi.checkinRate[range];
    case "pendingPayments":
      return kpi.pendingPayments[range];
  }
}

export function isOccupancyWindow(window: KpiWindow): window is AdminKpiOccupancyRange {
  return "ratePercent" in window;
}

/** Headline figure for the selected window, already locale-formatted. */
export function formatKpiValue(
  metric: KpiMetricKey,
  window: KpiWindow,
  locale: "en" | "vn",
  ticketsSuffix: string,
): string {
  if (isOccupancyWindow(window)) return `${window.ratePercent}%`;
  if (metric === "tickets") {
    return `${window.value.toLocaleString(toLocaleTag(locale))} ${ticketsSuffix}`;
  }
  if (metric === "attachRate" || metric === "checkinRate") return `${window.value}%`;
  if (metric === "pendingPayments") return window.value.toLocaleString(toLocaleTag(locale));
  return formatVND(window.value, locale);
}

/** Growth badge payload: occupancy compares against the room average, others vs the prior window. */
export function getKpiGrowth(window: KpiWindow): {
  percent: number;
  vsKey: "admin.dashboard.vs_average" | "admin.dashboard.vs_previous_period";
} {
  if (isOccupancyWindow(window)) {
    return { percent: window.differenceFromAverage, vsKey: "admin.dashboard.vs_average" };
  }
  return { percent: window.growthPercent, vsKey: "admin.dashboard.vs_previous_period" };
}

/** Chart geometry per metric: occupancy keeps the radial gauge, tickets/pending are bars, the rest are area lines. */
export type KpiChartKind = "line" | "bar" | "gauge";

export function getKpiChartKind(metric: KpiMetricKey): KpiChartKind {
  if (metric === "occupancy") return "gauge";
  if (metric === "tickets" || metric === "pendingPayments") return "bar";
  return "line";
}

/**
 * Unit of `series[].value` per metric — drives tooltip and axis formatting.
 * `moneyM` = millions of VND (revenue/concessions sparkline convention),
 * `vnd` = full VND (avg ticket price), `percent` = 0–100 share, `count` = plain number.
 */
export type KpiValueFormat = "moneyM" | "vnd" | "percent" | "count";

export function getKpiValueFormat(metric: KpiMetricKey): KpiValueFormat {
  if (metric === "revenue" || metric === "concessions") return "moneyM";
  if (metric === "avgTicketPrice") return "vnd";
  if (metric === "attachRate" || metric === "checkinRate") return "percent";
  return "count";
}
