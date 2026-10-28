import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import { AdminTableSkeleton } from "@/features/admin/components/AdminSkeletons";
import { CatalogsManagerSection } from "./sections";

export const metadata: Metadata = { title: "Catalogs" };

/** Header is static; the three catalogs stream into the manager below it. */
export default function AdminCatalogsPage() {
  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.cinema"
        titleKey="admin.catalogs.title"
        descriptionKey="admin.catalogs.description"
      />
      <Suspense fallback={<AdminTableSkeleton />}>
        <CatalogsManagerSection />
      </Suspense>
    </>
  );
}
