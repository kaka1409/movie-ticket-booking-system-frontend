import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { AdminListSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";
import { ReviewsManagerSection } from "./sections";
import type { AdminReviewStatusFilter } from "@/features/admin/api";

export const metadata: Metadata = { title: "Reviews" };

const REVIEW_STATUSES: AdminReviewStatusFilter[] = ["all", "live", "deleted"];
const REVIEW_SORTS = ["recent", "helpful", "highest", "lowest"];

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    movieSlug?: string;
    userId?: string;
    rating?: string;
    status?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const movieSlug = params.movieSlug?.trim() ?? "";
  const userId = params.userId?.trim() ?? "";
  const rating = /^\d+$/.test(params.rating ?? "")
    ? Math.min(10, Math.max(1, Number(params.rating)))
    : 0;
  const status = REVIEW_STATUSES.find((candidate) => candidate === params.status) ?? "all";
  const sort = REVIEW_SORTS.find((candidate) => candidate === params.sort) ?? "recent";
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.users"
        titleKey="admin.reviews.title"
        descriptionKey="admin.reviews.description"
      />
      <Suspense fallback={<AdminListSkeleton search select apply total columns={6} />}>
        <ReviewsManagerSection
          search={search}
          movieSlug={movieSlug}
          userId={userId}
          rating={rating}
          status={status}
          sort={sort}
          page={page}
        />
      </Suspense>
    </>
  );
}
