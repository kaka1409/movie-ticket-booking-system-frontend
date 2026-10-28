import type { ReactNode } from "react";

import HeroSection from "./HeroSection";
import Synopsis from "./Synopsis";
import TopCast from "./TopCast";

/* Desktop layout: full-bleed hero, then content column + sticky showtimes rail.
   Reviews and the showtime rail arrive as slots, so both stream while the hero,
   synopsis and cast paint from the movie read the page already awaited. */
export default function MovieDetailDesktop({
  reviews,
  showtimes,
  recommended,
}: {
  reviews: ReactNode;
  showtimes: ReactNode;
  recommended?: ReactNode;
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
              {reviews}
            </div>

            <div className="w-80 shrink-0">{showtimes}</div>
          </div>
        </div>

        {recommended}
      </div>
    </div>
  );
}
