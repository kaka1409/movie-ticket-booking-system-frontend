import { getMovieDetail } from "@/features/movies/api";
import { getBookingById } from "@/features/booking/api";
import { getRequestCookie, redirectIfUnauthorized } from "@/libs/session";
import PaidBookingReset from "@/features/booking/components/PaidBookingReset";

// Mobile components
import SuccessIcon from "./components/mobile/SuccessIcon";
import TicketCard from "./components/mobile/TicketCard";
import SuccessActions from "./components/mobile/SuccessActions";

// Desktop components
import DesktopSuccessContent from "./components/desktop/SuccessContent";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ bookingId?: string; transactionId?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);

  const [movieResult, bookingResult] = await Promise.all([
    getMovieDetail(slug),
    query.bookingId
      ? getBookingById(query.bookingId, await getRequestCookie())
      : Promise.resolve(null),
  ]);

  if (bookingResult) redirectIfUnauthorized(bookingResult, `/booking/${slug}/status/success`);

  const movie = "error" in movieResult ? undefined : movieResult.data;
  const booking = bookingResult && !("error" in bookingResult) ? bookingResult.data : null;
  // Payment gateways may return their own reference; the fetched booking wins
  // over the raw URL param only when the param is absent.
  const transactionId = query.transactionId ?? booking?.transactionRef ?? booking?.id ?? "N/A";

  return (
    <>
      <PaidBookingReset booking={booking} />

      {/* Mobile */}
      <div className="block md:hidden">
        <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg)">
          {/* Scrollable body */}
          <main className="flex-1 overflow-y-auto pb-8 pt-4 space-y-6">
            <SuccessIcon />
            <TicketCard movie={movie} booking={booking} transactionId={transactionId} />
            <SuccessActions />
          </main>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopSuccessContent />
      </div>
    </>
  );
}
