import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { AdminTableSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";
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
