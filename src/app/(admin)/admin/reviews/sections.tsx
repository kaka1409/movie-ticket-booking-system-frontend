import AdminDataError from "@/app/(admin)/admin/components/shared/AdminDataError";
import { getAdminMovies, getAdminReviews } from "@/features/admin/api";
import type { AdminReviewStatusFilter } from "@/features/admin/types";
import { isUnauthorizedResult, getRequestLocale } from "@/libs/session";
import ReviewsManager from "./components/ReviewsManager";

/** The query the page resolved from `searchParams`. */
export interface AdminReviewsQuery {
  search: string;
  movieSlug: string;
  userId: string;
  rating: number;
  status: AdminReviewStatusFilter;
  sort: string;
  sortBy: string;
  dir: string;
  page: number;
}

export async function ReviewsManagerSection({
  search,
  movieSlug,
  userId,
  rating,
  status,
  sort,
  sortBy,
  dir,
  page,
}: AdminReviewsQuery) {
  const locale = await getRequestLocale();
  const [reviewsResult, moviesResult] = await Promise.all([
    getAdminReviews({
      page,
      search,
      movieSlug,
      userId,
      rating: rating === 0 ? "" : rating,
      status,
      sort,
      sortBy,
      dir: dir === "asc" ? "asc" : "desc",
      lang: locale,
    }),
    getAdminMovies({ page: 1, limit: 100 }),
  ]);

  if (isUnauthorizedResult(reviewsResult) || isUnauthorizedResult(moviesResult)) {
    return null;
  }
  if ("error" in reviewsResult) return <AdminDataError message={reviewsResult.error.message} />;
  if ("error" in moviesResult) return <AdminDataError message={moviesResult.error.message} />;

  return (
    // Remount on committed-filter change so unapplied draft edits cannot leak
    // into the new result set (same convention as MoviesManager).
    <ReviewsManager
      key={[search, movieSlug, userId, rating, status, sort, sortBy, dir].join("|")}
      reviews={reviewsResult.data.reviews}
      pagination={reviewsResult.meta!}
      movies={moviesResult.data.movies}
      search={search}
      movieSlug={movieSlug}
      userId={userId}
      rating={rating}
      status={status}
      sort={sort}
      sortBy={sortBy}
      dir={dir}
    />
  );
}
