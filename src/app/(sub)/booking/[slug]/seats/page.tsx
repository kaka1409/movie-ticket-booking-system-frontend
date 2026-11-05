import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSeatMap } from "@/features/booking/api";
import { getShowtimeById } from "@/features/showtimes/api";
import { getRequestCookie } from "@/libs/session";

// Shared
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";

// Local mobile
import BottomBar from "./components/mobile/BottomBar";

// Desktop
import DesktopSeatContent from "./components/desktop/SeatContent";

import { SeatMapSkeleton } from "./components/shared/SeatSkeletons";
import { DesktopSeatMapSection, MobileSeatMapSection, SeatMapAdoptSection } from "./sections";

/**
 * Seats step, streamed: the page only resolves the URL (the showtime id is the
 * step's whole identity) and paints the chrome — stepper, countdown, bar — so
 * the step is navigable before the map lands. The grid streams into each tree's
 * own boundary and the adoption effect rides a `fallback={null}` one; all three
 * read the same seat map and showtime requests, so each endpoint is called once.
 *
 * The map is rendered FOR THE CALLER: the refresh cookie identifies them, so the
 * seats their own live hold still pins come back `idle` (contract §4.1.4) and
 * survive a back-navigation or a refresh. Dropping the cookie would paint them
 * `occupied` and empty the draft's selection.
 */
export default async function SelectSeatPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ showtimeId?: string }>;
}) {
  const [{ slug }, { showtimeId }] = await Promise.all([params, searchParams]);

  // The seat map is keyed by showtime — a deep link without one goes back to step 1.
  if (!showtimeId) redirect(`/booking/${slug}/cinema`);

  // The identity read must finish before the fetch starts, so the two calls are
  // sequential here (the cookie read is a local parse, not a round trip).
  const cookie = await getRequestCookie();
  const seatMapPromise = getSeatMap(showtimeId, { cookie });
  const showtimePromise = getShowtimeById(showtimeId);

  return (
    <>
      <Suspense fallback={null}>
        <SeatMapAdoptSection seatMapPromise={seatMapPromise} showtimePromise={showtimePromise} />
      </Suspense>

      <div className="block md:hidden">
        <StepBar current={2} />
        <main className="space-y-5 pt-1 pb-10">
          <CountdownBanner />
          <Suspense fallback={<SeatMapSkeleton />}>
            <MobileSeatMapSection seatMapPromise={seatMapPromise} />
          </Suspense>
        </main>
        <BottomBar />
      </div>

      <div className="hidden md:block">
        <DesktopSeatContent
          slots={
            <Suspense fallback={<SeatMapSkeleton raised />}>
              <DesktopSeatMapSection seatMapPromise={seatMapPromise} />
            </Suspense>
          }
        />
      </div>
    </>
  );
}
