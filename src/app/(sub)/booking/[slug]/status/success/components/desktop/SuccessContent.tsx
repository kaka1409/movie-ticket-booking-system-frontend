import type { Movie } from "@/features/movies/types";
import type { BookingDetail } from "@/features/booking/types";
import SuccessHero from "./SuccessHero";
import ReceiptCard from "./ReceiptCard";
import SuccessSidePanel from "./SuccessSidePanel";

/**
 * Desktop success page. The flow is over, so there is no stepper and no summary
 * rail: a left-aligned hero sits above a wide receipt card, with the scan
 * payload and the actions in a side panel.
 *
 * Below `lg:` the side panel drops under the receipt at full width — same
 * one-column rule the booking steps use in the 740–1023px band.
 */
export default function SuccessContent({
  movie,
  booking,
  transactionId,
}: {
  movie: Movie | undefined;
  booking: BookingDetail | null;
  transactionId: string;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8">
      <SuccessHero />

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <ReceiptCard movie={movie} booking={booking} />
        <SuccessSidePanel booking={booking} transactionId={transactionId} />
      </div>
    </div>
  );
}
