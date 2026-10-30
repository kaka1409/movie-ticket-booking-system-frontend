"use client";

import type { Movie } from "@/features/movies/types";
import type { ErrorResponse } from "@/libs/api";
import type { QuickBookingSeed } from "@/features/showtimes/api";
import { QuickBookingProvider } from "./QuickBookingProvider";
import QuickBookingBar from "../desktop/QuickBookingBar";
import QuickBooking from "../mobile/QuickBooking";

/**
 * Both device trees render at once, so the quick-booking controller must be
 * mounted exactly once for the page — which is why this section owns both skins
 * instead of each tree mounting its own copy (that would double every
 * dates/slots request). It therefore sits at page level, outside the trees'
 * wrappers; each skin carries its own hidden-by-breakpoint wrapper.
 */
export default function QuickBookingShell({
  movies,
  error,
  seed,
}: {
  movies: Movie[];
  error?: ErrorResponse["error"] | null;
  seed?: QuickBookingSeed | null;
}) {
  return (
    <QuickBookingProvider movies={movies} seed={seed}>
      <div className="hidden md:block">
        <QuickBookingBar movies={movies} error={error} />
      </div>
      <div className="mt-(--space-lg) block md:hidden">
        <QuickBooking movies={movies} error={error} />
      </div>
    </QuickBookingProvider>
  );
}
