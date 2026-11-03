import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import AdminDashboardSkeleton from "./components/AdminDashboardSkeleton";
import { AdminDashboardSection } from "./sections";

export const metadata: Metadata = {
  title: "Dashboard",
};

/**
 * PrimeSeat Admin Console Dashboard landing.
 * Streams live KPI mini-charts, dual-axis revenue & attendance analytics,
 * box office rankings, live showtimes monitor, and booking operations.
 */
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrowKey="admin.nav.overview"
        titleKey="admin.dashboard.title"
        descriptionKey="admin.dashboard.description"
      />
      <Suspense fallback={<AdminDashboardSkeleton />}>
        <AdminDashboardSection />
      </Suspense>
    </div>
  );
}
