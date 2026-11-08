import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { AdminListSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";
import { ReviewsManagerSection } from "./sections";
import type { AdminReviewStatusFilter } from "@/features/admin/types";

export const metadata: Metadata = { title: "Reviews" };

const REVIEW_STATUSES: AdminReviewStatusFilter[] = ["all", "live", "deleted"];
const REVIEW_SORTS = ["recent", "helpful", "highest", "lowest"];
/** Mirrors the BE `ADMIN_REVIEW_SORT_FIELDS` whitelist (`sortBy` wire param). */
const REVIEW_SORT_BY = ["createdAt", "rating", "votes", "author", "movie"];

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
    sortBy?: string;
    dir?: string;
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
  const sortBy = REVIEW_SORT_BY.find((candidate) => candidate === params.sortBy) ?? "";
  const dir = params.dir === "asc" || params.dir === "desc" ? params.dir : "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.users"
        titleKey="admin.reviews.title"
        descriptionKey="admin.reviews.description"
      />
      <Suspense fallback={<AdminListSkeleton filtersCard filterCardStyle="chips" columns={7} />}>
        <ReviewsManagerSection
          search={search}
          movieSlug={movieSlug}
          userId={userId}
          rating={rating}
          status={status}
          sort={sort}
          sortBy={sortBy}
          dir={dir}
          page={page}
        />
      </Suspense>
    </>
  );
}
