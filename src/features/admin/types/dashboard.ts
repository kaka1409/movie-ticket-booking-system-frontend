import type { AdminPaymentMethod } from "./payments";
import type { AdminPaymentMethodCode, AdminPaymentStatus } from "./common";

export interface AdminKpiDataPoint {
  label: string;
  value: number;
}

/**
 * One reporting window of a KPI card: headline figure, growth versus the
 * previous window, and the chart series. Revenue/concessions `value` is in
 * VND while `series` stays in millions so Chart.js tick formatters keep working.
 */
export interface AdminKpiRangeData {
  value: number;
  /** `null` when no honest previous-period comparison exists (pending payments). */
  growthPercent: number | null;
  series: AdminKpiDataPoint[];
}

/** Occupancy window: the gauge reads `ratePercent`, the series plots it per bucket. */
export interface AdminKpiOccupancyRange {
  ratePercent: number;
  peakPercent: number;
  differenceFromAverage: number;
  totalSeats: number;
  bookedSeats: number;
  series: AdminKpiDataPoint[];
}

export type AdminKpiRangeMap<T> = Record<AdminAnalyticsTimeRange, T>;

export interface AdminKpiSummary {
  revenue: AdminKpiRangeMap<AdminKpiRangeData>;
  tickets: AdminKpiRangeMap<AdminKpiRangeData>;
  concessions: AdminKpiRangeMap<AdminKpiRangeData>;
  occupancy: AdminKpiRangeMap<AdminKpiOccupancyRange>;
  /** Mean ticket price per window; `value`/series are full VND. */
  avgTicketPrice: AdminKpiRangeMap<AdminKpiRangeData>;
  /** Share of tickets sold with a combo; `value`/series are percents. */
  attachRate: AdminKpiRangeMap<AdminKpiRangeData>;
  /** Share of issued tickets checked in; `value`/series are percents. */
  checkinRate: AdminKpiRangeMap<AdminKpiRangeData>;
  /** Payments still awaiting settlement at window end; `value`/series are counts. */
  pendingPayments: AdminKpiRangeMap<AdminKpiRangeData>;
}

export interface AdminAnalyticsDataPoint {
  label: string;
  ticketRevenue: number;
  fnbRevenue: number;
  totalRevenue: number;
  attendance: number;
}

export type AdminAnalyticsTimeRange = "7d" | "30d" | "12m";

export interface AdminTopMoviePerformance {
  id: string;
  rank: number;
  title: string;
  slug: string;
  posterUrl: string | null;
  genre: string;
  revenue: number;
  ticketsSold: number;
  occupancyRate: number;
}

export interface AdminLiveShowtimeItem {
  id: string;
  startTime: string;
  endTime: string;
  movieTitle: string;
  posterUrl: string | null;
  cinemaName: string;
  roomName: string;
  roomNameVi: string | null;
  format: string;
  bookedSeats: number;
  checkedInSeats: number;
  totalSeats: number;
  status: "selling" | "almost_full" | "sold_out" | "in_screen" | "ended";
}

export interface AdminLiveBookingItem {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string | null;
  customerAvatarUrl: string | null;
  movieTitle: string;
  moviePosterUrl: string | null;
  cinemaName: string;
  roomName: string;
  roomNameVi: string | null;
  /** Cinema wall-clock day + start time of the booked showtime. */
  showtime: { date: string; startTime: string };
  seatCount: number;
  comboCount: number;
  totalAmount: number;
  paymentMethod: AdminPaymentMethodCode | null;
  paymentStatus: AdminPaymentStatus | null;
  status: "paid" | "holding" | "cancelled";
  createdAt: string;
}

/** `GET /admin/dashboard/metrics` payload — KPI windows + chart series. */
export interface AdminDashboardMetrics {
  kpi: AdminKpiSummary;
  analytics: {
    range7d: AdminAnalyticsDataPoint[];
    range30d: AdminAnalyticsDataPoint[];
    range12m: AdminAnalyticsDataPoint[];
  };
}

/** `GET /admin/dashboard/action-queue` — counts of items needing an operator. */
export interface AdminActionQueue {
  pendingPayments: number;
  pendingRefunds: number;
  awaitingTransfers: number;
  deletedReviews: number;
  bannedUsers: number;
  asOf: string;
}

export interface AdminPaymentMethodHealth {
  success: number;
  failed: number;
  pending: number;
  expired: number;
  /** Successful-charge revenue over the last 30 days, in VND. */
  revenue: number;
}

/** `GET /admin/dashboard/payment-health` — per-method stats + gateway state. */
export interface AdminPaymentHealth {
  demoMode: boolean;
  methods: (AdminPaymentMethod & { stats: AdminPaymentMethodHealth })[];
}
