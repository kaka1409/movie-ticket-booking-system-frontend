import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import {
  ActionQueueSkeleton,
  KpiSectionSkeleton,
  LiveBookingsSkeleton,
  LiveShowtimesSkeleton,
  PaymentHealthSkeleton,
  TopMoviesSkeleton,
} from "./components/skeletons/AdminDashboardSkeleton";
import {
  ActionQueueSection,
  KpiSection,
  LiveBookingsSection,
  LiveShowtimesSection,
  PaymentHealthSection,
  TopMoviesSection,
} from "./sections";

export const metadata: Metadata = {
  title: "Dashboard",
};

/**
 * PrimeSeat Admin Console Dashboard landing.
 * Each widget streams behind its own Suspense boundary so a slow aggregate
 * never blanks the rest of the console.
 */
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrowKey="admin.nav.overview"
        titleKey="admin.dashboard.title"
        descriptionKey="admin.dashboard.description"
      />

      <Suspense fallback={<ActionQueueSkeleton />}>
        <ActionQueueSection />
      </Suspense>

      <Suspense fallback={<KpiSectionSkeleton />}>
        <KpiSection />
      </Suspense>

      <Suspense fallback={<TopMoviesSkeleton />}>
        <TopMoviesSection />
      </Suspense>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Suspense fallback={<LiveShowtimesSkeleton />}>
            <LiveShowtimesSection />
          </Suspense>
        </div>
        <div className="lg:col-span-5">
          <Suspense fallback={<LiveBookingsSkeleton />}>
            <LiveBookingsSection />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<PaymentHealthSkeleton />}>
        <PaymentHealthSection />
      </Suspense>
    </div>
  );
}
