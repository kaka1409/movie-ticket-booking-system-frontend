import { Suspense } from "react";
import { getRequestCookie, getRequestLocale } from "@/libs/session";
import ReviewsShell from "./components/desktop/ReviewsShell";
import { MobileReviewsSection, DesktopReviewsSection } from "./sections";
import { MobileReviewListSkeleton, DesktopReviewsSkeleton } from "./components/shared/ReviewsSkeletons";

export default async function ReviewPage() {
  const locale = await getRequestLocale();
  const cookie = await getRequestCookie();

  return (
    <>
      <div className="block md:hidden">
        <Suspense fallback={<MobileReviewListSkeleton />}>
          <MobileReviewsSection cookie={cookie} locale={locale} />
        </Suspense>
      </div>
      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
          <ReviewsShell
            content={
              <Suspense fallback={<DesktopReviewsSkeleton />}>
                <DesktopReviewsSection cookie={cookie} locale={locale} />
              </Suspense>
            }
          />
        </div>
      </div>
    </>
  );
}