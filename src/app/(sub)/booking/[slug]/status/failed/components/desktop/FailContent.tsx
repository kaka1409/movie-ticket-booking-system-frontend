import type { Movie } from "@/features/movies/types";
import type { BookingDetail, PaymentMethodOption } from "@/features/booking/types";
import FailHero from "./FailHero";
import FailedReceipt from "./FailedReceipt";
import FailSidePanel from "./FailSidePanel";

/**
 * Desktop failure page. Same skeleton as the success page — left-aligned hero,
 * wide receipt, side panel — so a failed payment reads as the same flow rather
 * than a separate screen.
 *
 * Below `lg:` the side panel drops under the receipt at full width.
 */
export default function FailContent({
  movie,
  booking,
  reason,
  paymentMethods,
}: {
  movie: Movie | undefined;
  booking: BookingDetail | null;
  reason: string | null;
  paymentMethods: PaymentMethodOption[];
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8">
      <FailHero reason={reason} />

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <FailedReceipt
          movie={movie}
          booking={booking}
          reason={reason}
          paymentMethods={paymentMethods}
        />
        <FailSidePanel />
      </div>
    </div>
  );
}
