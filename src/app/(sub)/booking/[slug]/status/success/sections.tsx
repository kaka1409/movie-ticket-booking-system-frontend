import TicketCard from "./components/mobile/TicketCard";
import ReceiptCard from "@/app/(sub)/booking/components/shared/ReceiptCard";
import type { BookingDetail } from "@/features/booking/types";

export async function SuccessReceiptSection({
  moviePromise,
  catalogPromise,
  booking,
  transactionId,
}: {
  moviePromise: ReturnType<typeof import("@/features/movies/api").getMovieDetail> | null;
  catalogPromise: ReturnType<typeof import("@/features/booking/api").getPaymentMethods>;
  booking: BookingDetail | null;
  transactionId: string;
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
    </>
  );
}
