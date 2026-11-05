import { getAdminDashboardData } from "@/features/admin/dashboard";
import AdminKpiRow from "./components/kpi/AdminKpiRow";
import TopBoxOfficeTable from "./components/analytics/TopBoxOfficeTable";
import LiveShowtimesMonitor from "./components/operations/LiveShowtimesMonitor";
import LiveBookingsFeed from "./components/operations/LiveBookingsFeed";

/**
 * Server component streaming live metrics, Chart.js views, and cinema operations.
 */
export async function AdminDashboardSection() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      {/* KPI overview: 8 metric tiles + detail & revenue/attendance charts */}
      <AdminKpiRow kpi={data.kpi} analytics={data.analytics} />

      {/* Top Movies ranking */}
      <TopBoxOfficeTable movies={data.topMovies} />

      {/* Operations Row: Live Showtimes monitor & Live bookings stream */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <LiveShowtimesMonitor showtimes={data.liveShowtimes} />
        </div>
        <div className="lg:col-span-5">
          <LiveBookingsFeed bookings={data.liveBookings} />
        </div>
      </div>
    </div>
  );
}
