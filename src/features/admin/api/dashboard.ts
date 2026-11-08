import { apiFetch } from "@/libs/api";
import type {
  AdminActionQueue,
  AdminDashboardMetrics,
  AdminLiveBookingItem,
  AdminLiveShowtimeItem,
  AdminPaymentHealth,
  AdminTopMoviePerformance,
} from "../types";
import { ADMIN_NO_STORE, adminCookie, buildAdminQuery } from "./shared";

/** KPI windows + revenue/attendance series (`GET /admin/dashboard/metrics`). */
export async function getAdminDashboardMetrics() {
  return apiFetch<AdminDashboardMetrics>(
    "/admin/dashboard/metrics",
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}

/** Box-office leaderboard, last 30 days (`GET /admin/dashboard/top-movies`). */
export async function getAdminDashboardTopMovies(lang: "en" | "vn") {
  return apiFetch<AdminTopMoviePerformance[]>(
    `/admin/dashboard/top-movies${buildAdminQuery({ lang })}`,
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}

/** Today's showtimes with seat fill and check-in counts. */
export async function getAdminDashboardLiveShowtimes() {
  return apiFetch<AdminLiveShowtimeItem[]>(
    "/admin/dashboard/live-showtimes",
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}

/** Latest bookings feed (`GET /admin/dashboard/live-bookings`). */
export async function getAdminDashboardLiveBookings() {
  return apiFetch<AdminLiveBookingItem[]>(
    "/admin/dashboard/live-bookings",
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}

/** Counts of items needing an operator (`GET /admin/dashboard/action-queue`). */
export async function getAdminDashboardActionQueue() {
  return apiFetch<AdminActionQueue>(
    "/admin/dashboard/action-queue",
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}

/** Per-method payment stats + gateway state (`GET /admin/dashboard/payment-health`). */
export async function getAdminDashboardPaymentHealth() {
  return apiFetch<AdminPaymentHealth>(
    "/admin/dashboard/payment-health",
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}
