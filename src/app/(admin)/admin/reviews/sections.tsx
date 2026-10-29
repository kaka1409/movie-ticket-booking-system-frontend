import AdminDataError from "@/features/admin/components/AdminDataError";
import { getAdminDeletedReviews } from "@/features/admin/api";
import { isUnauthorizedResult, getRequestLocale } from "@/libs/session";
import ReviewsManager from "./components/ReviewsManager";

export interface AdminReviewsQuery {
  skip: number;
  limit: number;
}

export async function ReviewsManagerSection({ skip, limit }: AdminReviewsQuery) {
  const locale = await getRequestLocale();
  const result = await getAdminDeletedReviews({ skip, limit, lang: locale });
  if (isUnauthorizedResult(result)) return null;
  if ("error" in result) return <AdminDataError message={result.error.message} />;
  return (
    <ReviewsManager
      reviews={result.data.reviews}
      total={result.data.total}
      skip={skip}
      limit={limit}
    />
  );
}
