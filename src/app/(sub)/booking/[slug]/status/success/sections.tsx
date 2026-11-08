import TicketCard from "./components/mobile/TicketCard";
import TicketCaptureCard from "./components/shared/TicketCaptureCard";
import ReceiptCard from "@/app/(sub)/booking/components/shared/ReceiptCard";
import type { BookingDetail } from "@/features/booking/types";

export async function SuccessReceiptSection({
  moviePromise,
  catalogPromise,
  booking,
  transactionId,
  withCapture = false,
}: {
  moviePromise: ReturnType<typeof import("@/features/movies/api").getMovieDetail> | null;
  catalogPromise: ReturnType<typeof import("@/features/booking/api").getPaymentMethods>;
  booking: BookingDetail | null;
  transactionId: string;
  /** Desktop only: mounts the off-screen ticket-styled card the download button captures. */
  withCapture?: boolean;
}) {
  const [movieResult, catalogResult] = await Promise.all([moviePromise, catalogPromise]);
  const movie = !movieResult || "error" in movieResult ? undefined : movieResult.data;
  const paymentMethods = "error" in catalogResult ? [] : catalogResult.data.methods;

  return (
    <>
      <div className="block md:hidden print:hidden">
        <TicketCard
          movie={movie}
          booking={booking}
          transactionId={transactionId}
          paymentMethods={paymentMethods}
        />
      </div>
      <div className="hidden md:block print:block">
        <ReceiptCard movie={movie} booking={booking} paymentMethods={paymentMethods} />
      </div>
      {withCapture && (
        // Off-screen, not display:none — html-to-image only captures rendered elements.
        <div className="pointer-events-none absolute top-0 -left-[10000px]">
          <TicketCaptureCard
            movie={movie}
            booking={booking}
            transactionId={transactionId}
            paymentMethods={paymentMethods}
          />
        </div>
      )}
    </>
  );
}
