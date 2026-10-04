import type { GroupedShowtimeCinema, ShowtimeDateOption } from "@/features/showtimes/types";
import type { ReviewsResponse } from "@/features/reviews/types";

import HeroSection from "./HeroSection";
import Synopsis from "./Synopsis";
import TopCast from "./TopCast";
import Showtimes from "./Showtimes";
import Reviews from "./Reviews";

/* Desktop layout: full-bleed hero, then content column + sticky showtimes rail. */
export default function MovieDetailDesktop({
  date,
  today,
  dates,
  cinemas,
  showtimesError,
  reviewsData,
  reviewsError,
}: {
  date: string;
  today: string;
  dates: ShowtimeDateOption[];
  cinemas: GroupedShowtimeCinema[];
  showtimesError: string | null;
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
              <Showtimes
                date={date}
                today={today}
                dates={dates}
                cinemas={cinemas}
                error={showtimesError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
