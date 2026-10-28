import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import { AdminTableSkeleton } from "@/features/admin/components/AdminSkeletons";
import { CinemasManagerSection } from "./sections";

export const metadata: Metadata = { title: "Cinemas" };

export default function AdminCinemasPage() {
  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.cinema"
        titleKey="admin.cinemas.title"
        descriptionKey="admin.cinemas.description"
      />
      <Suspense fallback={<AdminTableSkeleton />}>
        <CinemasManagerSection />
      </Suspense>
    </>
  );
}
