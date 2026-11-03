import { getAdminDashboardData } from "@/features/admin/dashboard";
import AdminKpiRow from "./components/kpi/AdminKpiRow";
import RevenueAttendanceChart from "./components/analytics/RevenueAttendanceChart";
import TopBoxOfficeTable from "./components/analytics/TopBoxOfficeTable";
import LiveShowtimesMonitor from "./components/operations/LiveShowtimesMonitor";
import LiveBookingsFeed from "./components/operations/LiveBookingsFeed";
import QuickActionsBar from "./components/operations/QuickActionsBar";

/**
 * Server component streaming live metrics, Chart.js views, and cinema operations.
 */
export async function AdminDashboardSection() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      {/* 4 Top KPI mini-chart cards */}
      <AdminKpiRow kpi={data.kpi} />

      {/* Middle Row: Analytics combo chart (Bar+Line) & Top Movies ranking */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 xl:col-span-8">
          <RevenueAttendanceChart
            range7d={data.analytics.range7d}
            range30d={data.analytics.range30d}
            range12m={data.analytics.range12m}
          />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <TopBoxOfficeTable movies={data.topMovies} />
        </div>
      </div>

      {/* Operations Row: Live Showtimes monitor & Live bookings stream */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <LiveShowtimesMonitor showtimes={data.liveShowtimes} />
        </div>
        <div className="lg:col-span-5">
          <LiveBookingsFeed bookings={data.liveBookings} />
        </div>
      </div>

      {/* Bottom Row: Quick actions launchpad */}
      <QuickActionsBar />
    </div>
  );
}
