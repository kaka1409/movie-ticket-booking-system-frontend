import { getMyReviewsOverview } from "@/features/reviews/api";
import ReviewList from "./components/mobile/ReviewList";
import ReviewContent from "./components/desktop/ReviewContent";

export async function MobileReviewsSection({
  cookie,
  locale,
}: {
  cookie: string | undefined;
  locale: "en" | "vn";
}) {
  const { reviews, total, filters } = await getMyReviewsOverview(cookie, locale);
  return <ReviewList initialReviews={reviews} total={total} filters={filters} />;
}

export async function DesktopReviewsSection({
  cookie,
  locale,
}: {
  cookie: string | undefined;
  locale: "en" | "vn";
}) {
  const { reviews, total, filters } = await getMyReviewsOverview(cookie, locale);
  return <ReviewContent initialReviews={reviews} total={total} filters={filters} />;
}
