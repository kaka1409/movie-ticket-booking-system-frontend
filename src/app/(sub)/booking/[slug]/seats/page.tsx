import { redirect } from "next/navigation";
import { getShowtimeById } from "@/features/showtimes/api";
import { getSeatMap } from "@/features/booking/api";
import { adaptSeatMap } from "@/features/booking/utils/seatMap";
import { isUnauthorizedResult } from "@/libs/session";
import LoginPrompt from "@/components/shared/LoginPrompt";

// Shared
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";
import PageError from "@/app/(sub)/booking/components/mobile/PageError";

// Local mobile
import SeatMapWrapper from "./components/mobile/SeatMapWrapper";
import BottomBar from "./components/mobile/BottomBar";

// Shared (effect-only mount helper — see SeatMapAdopter)
import SeatMapAdopter from "@/features/booking/components/SeatMapAdopter";

// Desktop
import DesktopSeatContent from "./components/desktop/SeatContent";

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

  // The selected showtime drives the room, cinema and seat map of this step.
  const [seatMapResult, showtimeResult] = await Promise.all([
    getSeatMap(showtimeId),
    getShowtimeById(showtimeId),
  ]);

  if ("error" in seatMapResult) {
    // A dead session renders the prompt in place (same rule as every other
    // protected fetch); anything else is a real fetch failure.
    if (isUnauthorizedResult(seatMapResult)) return <LoginPrompt />;
    return <PageError error={seatMapResult.error} />;
  }

  const { rows, maxSeats } = adaptSeatMap(seatMapResult.data);
  const showtime = "error" in showtimeResult ? null : showtimeResult.data;

  return (
    <>
      {/* Effect-only: exactly one seat-map adoption + hold subscription for both
          the mobile and the desktop tree. */}
      <SeatMapAdopter initialRows={rows} maxSeats={maxSeats} initialShowtime={showtime} />

      {/* Mobile */}
      <div className="block md:hidden">
        <StepBar current={2} />
        <main className="space-y-5 pt-1 pb-10">
          <CountdownBanner />
          <SeatMapWrapper initialRows={rows} />
        </main>
        <BottomBar />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopSeatContent initialRows={rows} />
      </div>
    </>
  );
}
