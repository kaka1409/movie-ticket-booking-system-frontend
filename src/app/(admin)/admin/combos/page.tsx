import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { AdminListSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";
import { CombosManagerSection } from "./sections";

export const metadata: Metadata = { title: "Combos" };

export default function AdminCombosPage() {
  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.food"
        titleKey="admin.combos.title"
        descriptionKey="admin.combos.description"
      />
      <Suspense fallback={<AdminListSkeleton columns={5} />}>
        <CombosManagerSection />
      </Suspense>
    </>
  );
}
