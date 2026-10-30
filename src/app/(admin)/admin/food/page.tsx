import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { AdminTableSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";
import { FoodManagerSection } from "./sections";

export const metadata: Metadata = { title: "Food & beverage" };

export default function AdminFoodPage() {
  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.food"
        titleKey="admin.food.title"
        descriptionKey="admin.food.description"
      />
      <Suspense fallback={<AdminTableSkeleton />}>
        <FoodManagerSection />
      </Suspense>
    </>
  );
}
