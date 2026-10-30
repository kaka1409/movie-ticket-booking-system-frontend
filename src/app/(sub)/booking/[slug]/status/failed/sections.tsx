import FailedOrderCard from "./components/mobile/FailedOrderCard";
import FailedReceipt from "./components/desktop/FailedReceipt";
import type { BookingDetail } from "@/features/booking/types";

export async function FailedReceiptSection({
  moviePromise,
  catalogPromise,
  booking,
  reason,
}: {
  moviePromise: ReturnType<typeof import("@/features/movies/api").getMovieDetail> | null;
  catalogPromise: ReturnType<typeof import("@/features/booking/api").getPaymentMethods>;
  booking: BookingDetail | null;
  reason: string | null;
}) {
  const [movieResult, catalogResult] = await Promise.all([moviePromise, catalogPromise]);
  const movie = !movieResult || "error" in movieResult ? undefined : movieResult.data;
  const paymentMethods = "error" in catalogResult ? [] : catalogResult.data.methods;

  return (
    <>
      <div className="block md:hidden">
        <FailedOrderCard
          movie={movie}
          booking={booking}
          reason={reason}
          paymentMethods={paymentMethods}
        />
      </div>
      <div className="hidden md:block">
        <FailedReceipt
          movie={movie}
          booking={booking}
          reason={reason}
          paymentMethods={paymentMethods}
        />
      </div>
    </>
  );
}
