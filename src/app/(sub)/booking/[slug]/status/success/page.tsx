import { getMovieDetail } from "@/features/movies/api";
import { getBookingById } from "@/features/booking/api";
import { getRequestCookie, getRequestLocale, isUnauthorizedResult } from "@/libs/session";
import PaidBookingReset from "@/features/booking/components/PaidBookingReset";
import LoginPrompt from "@/components/shared/LoginPrompt";

// Mobile components
import SuccessIcon from "@/components/shared/SuccessIcon";
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
  const locale = await getRequestLocale();

  const [movieResult, bookingResult] = await Promise.all([
    // Real flow always carries `?bookingId=` (submit redirects with it) — the
    // booking payload already carries the movie, so no detail fetch there.
    query.bookingId ? Promise.resolve(null) : getMovieDetail(slug, locale),
    query.bookingId
      ? getBookingById(query.bookingId, await getRequestCookie())
      : Promise.resolve(null),
  ]);

  if (bookingResult && isUnauthorizedResult(bookingResult)) return <LoginPrompt />;

  const movie = movieResult === null || "error" in movieResult ? undefined : movieResult.data;
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
            <SuccessIcon
              titleKey="booking.status.success.title"
              messageKey="booking.status.success.message"
            />
            <TicketCard movie={movie} booking={booking} transactionId={transactionId} />
            <SuccessActions />
          </main>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopSuccessContent movie={movie} booking={booking} transactionId={transactionId} />
      </div>
    </>
  );
}
