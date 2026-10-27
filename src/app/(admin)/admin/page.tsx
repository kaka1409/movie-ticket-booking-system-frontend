import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import AdminDashboardLinks from "./components/AdminDashboardLinks";

/**
 * Console landing. Phase 2 ships the navigation launchpad; the KPI tiles and
 * Chart.js panels replace the body once the entity screens exist (every number
 * they show is an aggregation of admin reads, so nothing here is faked).
 */
export default function AdminDashboardPage() {
  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.overview"
        titleKey="admin.dashboard.title"
        descriptionKey="admin.dashboard.description"
      />
      <AdminDashboardLinks />
    </>
  );
}
