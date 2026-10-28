import SeatMapAdopter from "@/features/booking/components/SeatMapAdopter";
import SectionFallback from "@/components/ui/SectionFallback";
import { getSeatStep } from "@/features/booking/seats";
import SeatMapWrapper from "./components/mobile/SeatMapWrapper";

type SeatSectionProps = { showtimeId: string };

/**
 * Mobile map surface. The step chrome (stepper, countdown, bar) paints first;
 * this lands as soon as the map does. A rejected session renders nothing so the
 * route's client gate can show the prompt.
 */
export async function MobileSeatMapSection({ showtimeId }: SeatSectionProps) {
  const { rows, error, isUnauthorized } = await getSeatStep(showtimeId);

  if (isUnauthorized) return null;
  if (error) return <SectionFallback error={error} />;

  return <SeatMapWrapper initialRows={rows} />;
}

/** Desktop map surface — the step shell already supplies the capped card. */
export async function DesktopSeatMapSection({ showtimeId }: SeatSectionProps) {
  const { rows, error, isUnauthorized } = await getSeatStep(showtimeId);

  if (isUnauthorized) return null;
  if (error) return <SectionFallback error={error} />;

  return <SeatMapWrapper initialRows={rows} />;
}

/**
 * Effect-only: exactly one map adoption + hold subscription for both trees,
 * mounted at page level in a `fallback={null}` boundary.
 */
export async function SeatMapAdoptSection({ showtimeId }: SeatSectionProps) {
  const { rows, maxSeats, showtime, error } = await getSeatStep(showtimeId);

  if (error) return null;

  return <SeatMapAdopter initialRows={rows} maxSeats={maxSeats} initialShowtime={showtime} />;
}
