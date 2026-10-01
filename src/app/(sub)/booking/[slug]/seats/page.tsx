import { notFound } from "next/navigation";
import { getMovieDetail } from "@/features/movies/api";
import { getShowtimeById } from "@/features/showtimes/api";
import { getSeatRows, getMaxSeatsPerBooking, getSeatPrices } from "@/features/booking/api";
import { SeatSelectionProvider } from "@/features/booking/contexts/SeatSelectionContext";
import SectionFallback from "@/components/ui/SectionFallback";

// Shared
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";

// Local mobile
import SeatMapWrapper from "./components/mobile/SeatMapWrapper";
import BottomBar from "./components/mobile/BottomBar";

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
  const [movieResult, seatRows, maxSeats, seatPrices] = await Promise.all([
    getMovieDetail(slug),
    getSeatRows(),
    getMaxSeatsPerBooking(),
    getSeatPrices(),
  ]);

  if ("error" in movieResult) {
    if (movieResult.error.status === 404) notFound();

    return (
      <div className="min-h-dvh bg-(--color-bg) py-10">
        <SectionFallback error={movieResult.error} />
      </div>
    );
  }

  // The selected showtime drives the room, cinema and seat map of this step.
  const showtimeResult = showtimeId ? await getShowtimeById(showtimeId) : null;
  const showtime =
    showtimeResult && !("error" in showtimeResult) ? showtimeResult.data : null;

  return (
    <SeatSelectionProvider
      initialRows={seatRows}
      maxSeats={maxSeats}
      seatPrices={seatPrices}
      initialShowtime={showtime}
    >
      {/* Mobile */}
      <div className="block md:hidden">
        <StepBar current={2} />
        <main className="space-y-5 pt-1 pb-10">
          <CountdownBanner />
          <SeatMapWrapper />
        </main>
        <BottomBar seatPrices={seatPrices} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopSeatContent />
      </div>
    </SeatSelectionProvider>
  );
}
