import { isUnauthorizedResult, getRequestLocale } from "@/libs/session";
import {
  getAdminDashboardActionQueue,
  getAdminDashboardLiveBookings,
  getAdminDashboardLiveShowtimes,
  getAdminDashboardMetrics,
  getAdminDashboardPaymentHealth,
  getAdminDashboardTopMovies,
  getAdminPaymentMethods,
} from "@/features/admin/api";
import AdminDataError from "./components/shared/AdminDataError";
import ActionQueueCard from "./components/operations/ActionQueueCard";
import PaymentHealthCard from "./components/operations/PaymentHealthCard";
import AdminKpiRow from "./components/kpi/AdminKpiRow";
import TopBoxOfficeTable from "./components/analytics/TopBoxOfficeTable";
import LiveShowtimesMonitor from "./components/operations/LiveShowtimesMonitor";
import LiveBookingsFeed from "./components/operations/LiveBookingsFeed";

/**
 * Operator inbox: counts of payments, refunds, transfers, reviews and accounts
 * that need attention. Reads `/admin/dashboard/action-queue`.
 */
export async function ActionQueueSection() {
  const result = await getAdminDashboardActionQueue();
  if (isUnauthorizedResult(result)) return null;
  if ("error" in result) return <AdminDataError message={result.error.message} />;
  return <ActionQueueCard queue={result.data} />;
}

/** KPI overview card: 8 metric tiles + detail & revenue/attendance charts. */
export async function KpiSection() {
  const result = await getAdminDashboardMetrics();
  if (isUnauthorizedResult(result)) return null;
  if ("error" in result) return <AdminDataError message={result.error.message} />;
  return <AdminKpiRow kpi={result.data.kpi} analytics={result.data.analytics} />;
}

/** Top box office leaderboard for the last 30 days. */
export async function TopMoviesSection() {
  const locale = await getRequestLocale();
  const result = await getAdminDashboardTopMovies(locale);
  if (isUnauthorizedResult(result)) return null;
  if ("error" in result) return <AdminDataError message={result.error.message} />;
  return <TopBoxOfficeTable movies={result.data} />;
}

/** Live showtimes monitor: today's screens with fill and check-in progress. */
export async function LiveShowtimesSection() {
  const result = await getAdminDashboardLiveShowtimes();
  if (isUnauthorizedResult(result)) return null;
  if ("error" in result) return <AdminDataError message={result.error.message} />;
  return <LiveShowtimesMonitor showtimes={result.data} />;
}

/** Recent bookings feed, labelled through the payment-method catalog. */
export async function LiveBookingsSection() {
  const [bookingsResult, methodsResult] = await Promise.all([
    getAdminDashboardLiveBookings(),
    getAdminPaymentMethods(),
  ]);
  if (isUnauthorizedResult(bookingsResult) || isUnauthorizedResult(methodsResult)) {
    return null;
  }
  if ("error" in bookingsResult) return <AdminDataError message={bookingsResult.error.message} />;
  if ("error" in methodsResult) return <AdminDataError message={methodsResult.error.message} />;
  return (
    <LiveBookingsFeed bookings={bookingsResult.data} paymentMethods={methodsResult.data} />
  );
}

/** Payment health: demo-mode banner + per-method settlement stats. */
export async function PaymentHealthSection() {
  const result = await getAdminDashboardPaymentHealth();
  if (isUnauthorizedResult(result)) return null;
  if ("error" in result) return <AdminDataError message={result.error.message} />;
  return <PaymentHealthCard health={result.data} />;
}
