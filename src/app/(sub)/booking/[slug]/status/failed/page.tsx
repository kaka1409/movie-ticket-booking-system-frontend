import { getMovieDetail } from "@/features/movies/api";
import { getBookingById } from "@/features/booking/api";
import { getRequestCookie, redirectIfUnauthorized } from "@/libs/session";
import PaidBookingReset from "@/features/booking/components/PaidBookingReset";
import type { Movie } from "@/features/movies/types";
import type { BookingDetail } from "@/features/booking/types";

// Mobile components
import FailedIcon from "./components/mobile/FailedIcon";
import FailedOrderCard from "./components/mobile/FailedOrderCard";
import FailActions from "./components/mobile/FailActions";

// Desktop components
import DesktopFailContent from "./components/desktop/FailContent";

export default async function FailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ bookingId?: string; reason?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);

  const [movieResult, bookingResult] = await Promise.all([
    // Real flow always carries `?bookingId=` (submit redirects with it) — the
    // booking payload already carries the movie, so no detail fetch there.
    query.bookingId ? Promise.resolve(null) : getMovieDetail(slug),
    query.bookingId
      ? getBookingById(query.bookingId, await getRequestCookie())
      : Promise.resolve(null),
  ]);

  if (bookingResult) redirectIfUnauthorized(bookingResult, `/booking/${slug}/status/failed`);

  const movie =
    movieResult === null || "error" in movieResult ? undefined : movieResult.data;
  const booking = bookingResult && !("error" in bookingResult) ? bookingResult.data : null;
  // URL param first (explicit gateway failure), then the persisted payment
  // reason on the fetched booking.
  const reason = query.reason ?? booking?.payment?.reason ?? null;

  return (
    <>
      <PaidBookingReset booking={booking} />

      {/* Mobile */}
      <div className="block md:hidden">
        <FailPageMobile movie={movie} booking={booking} reason={reason} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopFailContent />
      </div>
    </>
  );
}

function FailPageMobile({
  movie,
  booking,
  reason,
}: {
  movie: Movie | undefined;
  booking: BookingDetail | null;
  reason: string | null;
}) {
  return (
    <>
      <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg)">
        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto pb-8 pt-10 space-y-6">
          {/* Error hero */}
          <FailedIcon reason={reason} />

          {/* Failed order card */}
          <FailedOrderCard movie={movie} booking={booking} reason={reason} />

          {/* Action buttons */}
          <FailActions />
        </main>
      </div>
    </>
  );
}
