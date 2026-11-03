import type { AdminKpiSummary } from "@/features/admin/types";
import KpiAreaChartCard from "./KpiAreaChartCard";
import KpiBarChartCard from "./KpiBarChartCard";
import KpiTrendChartCard from "./KpiTrendChartCard";
import KpiRadialGaugeCard from "./KpiRadialGaugeCard";

interface AdminKpiRowProps {
  kpi: AdminKpiSummary;
}

/**
 * Aggregates the 4 top KPI mini-chart cards across an adaptive grid.
 */
export default function AdminKpiRow({ kpi }: AdminKpiRowProps) {
  return (
    <section
      aria-label="KPI Overview"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <KpiAreaChartCard
        todayRevenue={kpi.revenue.today}
        growthPercent={kpi.revenue.growthPercent}
        sparkline={kpi.revenue.sparkline}
      />
      <KpiBarChartCard
        todayTickets={kpi.tickets.today}
        growthPercent={kpi.tickets.growthPercent}
        hourlyDistribution={kpi.tickets.hourlyDistribution}
      />
      <KpiTrendChartCard
        todayRevenue={kpi.concessions.today}
        growthPercent={kpi.concessions.growthPercent}
        sparkline={kpi.concessions.sparkline}
      />
      <KpiRadialGaugeCard
        ratePercent={kpi.occupancy.ratePercent}
        peakPercent={kpi.occupancy.peakPercent}
        differenceFromAverage={kpi.occupancy.differenceFromAverage}
        totalSeats={kpi.occupancy.totalSeats}
        bookedSeats={kpi.occupancy.bookedSeats}
      />
    </section>
  );
}
