import type { ReviewsResponse } from "@/features/reviews/types";

import HeroSection from "./HeroSection";
import Synopsis from "./Synopsis";
import TopCast from "./TopCast";
import Showtimes from "./Showtimes";
import Reviews from "./Reviews";

/* Desktop layout: full-bleed hero, then content column + sticky showtimes rail.
   Date/slot state lives in `ShowtimesProvider` (page level), not props — the
   rail and the mobile tree must observe the same selection. */
export default function MovieDetailDesktop({
  reviewsData,
  reviewsError,
}: {
  reviewsData: ReviewsResponse | null;
  reviewsError: string | null;
}) {
  return (
    <div className="bg-(--color-bg)">
      <div className="mx-auto w-full max-w-screen-xl px-8 pt-6">
        <HeroSection />

        <div className="py-10">
          <div className="flex items-start gap-10">
            <div className="min-w-0 flex-1 space-y-10">
              <Synopsis />
              <TopCast />
              <Reviews initialData={reviewsData} initialError={reviewsError} />
            </div>

            <div className="w-80 shrink-0">
              <Showtimes />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
