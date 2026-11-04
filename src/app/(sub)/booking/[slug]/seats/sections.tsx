import SeatMapAdopter from "@/app/(sub)/booking/components/adopters/SeatMapAdopter";
import SectionFallback from "@/components/ui/SectionFallback";
import { adaptSeatMap } from "@/features/booking/utils/seatMap";
import type { getSeatMap } from "@/features/booking/api";
import type { getShowtimeById } from "@/features/showtimes/api";
import SeatMapWrapper from "./components/mobile/SeatMapWrapper";

type SeatMapPromise = ReturnType<typeof getSeatMap>;
type ShowtimePromise = ReturnType<typeof getShowtimeById>;
type SeatSectionProps = { seatMapPromise: SeatMapPromise };

/**
 * Mobile map surface. The step chrome (stepper, countdown, bar) paints first;
 * this lands as soon as the map does. A rejected session renders nothing so the
 * route's client gate can show the prompt.
 */
export async function MobileSeatMapSection({ seatMapPromise }: SeatSectionProps) {
  const result = await seatMapPromise;

  if ("error" in result) {
    if (result.error.status === 401) return null;
    return <SectionFallback error={result.error} />;
  }

  return <SeatMapWrapper initialRows={adaptSeatMap(result.data).rows} />;
}

/** Desktop map surface — the step shell already supplies the capped card. */
export async function DesktopSeatMapSection({ seatMapPromise }: SeatSectionProps) {
  const result = await seatMapPromise;

  if ("error" in result) {
    if (result.error.status === 401) return null;
    return <SectionFallback error={result.error} />;
  }

  return <SeatMapWrapper initialRows={adaptSeatMap(result.data).rows} showLegend={false} size="xl" />;
}

/**
 * Effect-only: exactly one map adoption + hold subscription for both trees,
 * mounted at page level in a `fallback={null}` boundary.
 */
export async function SeatMapAdoptSection({
  seatMapPromise,
  showtimePromise,
}: SeatSectionProps & { showtimePromise: ShowtimePromise }) {
  const [seatMapResult, showtimeResult] = await Promise.all([seatMapPromise, showtimePromise]);

  if ("error" in seatMapResult) return null;
  const { rows, maxSeats } = adaptSeatMap(seatMapResult.data);
  const showtime = "error" in showtimeResult ? null : showtimeResult.data;

  return <SeatMapAdopter initialRows={rows} maxSeats={maxSeats} initialShowtime={showtime} />;
}
