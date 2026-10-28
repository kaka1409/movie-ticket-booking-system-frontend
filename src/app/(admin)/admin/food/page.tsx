import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import { AdminTableSkeleton } from "@/features/admin/components/AdminSkeletons";
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
