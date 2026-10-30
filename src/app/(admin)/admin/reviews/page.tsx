import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { AdminTableSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";
import { ReviewsManagerSection } from "./sections";

export const metadata: Metadata = { title: "Reviews" };

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ skip?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const skip = Math.max(0, Number(params.skip ?? "0") || 0);
  const limit = Math.max(1, Number(params.limit ?? "10") || 10);

  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.users"
        titleKey="admin.reviews.title"
        descriptionKey="admin.reviews.description"
      />
      <Suspense fallback={<AdminTableSkeleton />}>
        <ReviewsManagerSection skip={skip} limit={limit} />
      </Suspense>
    </>
  );
}
