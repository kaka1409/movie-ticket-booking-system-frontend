import { getMyReviews, getReviewFilters } from "@/features/reviews/api";
import { getRequestCookie, getRequestLocale } from "@/libs/session";
import ReviewList from "./components/mobile/ReviewList";
import DesktopReviewContent from "./components/desktop/ReviewContent";

const FIRST_PAGE_LIMIT = 10;

export default async function ReviewPage() {
  const locale = await getRequestLocale();
  const [reviewsResult, filters] = await Promise.all([
    getMyReviews(
      { skip: 0, limit: FIRST_PAGE_LIMIT, sort: "recent" },
      await getRequestCookie(),
      locale,
    ),
    getReviewFilters(locale),
  ]);

  // A failed fetch (e.g. stale cookie the gate couldn't see) falls back to an
  // empty list — `ProtectedRoute` still swaps to the prompt client-side.
  const initial = "error" in reviewsResult ? { reviews: [], total: 0 } : reviewsResult.data;

  return (
    <>
      <div className="block md:hidden">
        <ReviewList initialReviews={initial.reviews} total={initial.total} filters={filters} />
      </div>
      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
          <DesktopReviewContent
            initialReviews={initial.reviews}
            total={initial.total}
            filters={filters}
          />
        </div>
      </div>
    </>
  );
}
