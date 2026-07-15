import { notFound } from "next/navigation";
import { getMovieBySlug } from "@/features/movies/api";
import { getSeatRows, getMaxSeatsPerBooking, getSeatPrices } from "@/features/booking/api";
import { SeatSelectionProvider } from "./components/mobile/SeatSelectionContext";

// Shared
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";

// Local mobile
import SeatMap from "./components/mobile/SeatMap";
import Legend from "./components/mobile/Legend";
import BottomBar from "./components/mobile/BottomBar";

// Desktop
import DesktopSeatContent from "./components/desktop/SeatContent";

export default async function SelectSeatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [movie, seatRows, maxSeats, seatPrices] = await Promise.all([
    getMovieBySlug(slug),
    getSeatRows(),
    getMaxSeatsPerBooking(),
    getSeatPrices(),
  ]);

  if (!movie) {
    notFound();
  }

  return (
    <SeatSelectionProvider initialRows={seatRows} maxSeats={maxSeats}>
      {/* Mobile */}
      <div className="block md:hidden">
        <StepBar current={2} />
        <main className="space-y-5 pt-1 pb-10">
          <CountdownBanner />
          <SeatMap />
          <Legend />
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
