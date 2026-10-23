import { getMovieDetail } from "@/features/movies/api";
import { getBookingById, getPaymentMethods } from "@/features/booking/api";
import { getRequestCookie, getRequestLocale, isUnauthorizedResult } from "@/libs/session";
import PaidBookingReset from "@/features/booking/components/PaidBookingReset";
import LoginPrompt from "@/components/shared/LoginPrompt";
import type { Movie } from "@/features/movies/types";
import type { BookingDetail, PaymentMethodOption } from "@/features/booking/types";

// Mobile components
import FailedIcon from "./components/mobile/FailedIcon";
import FailedOrderCard from "./components/mobile/FailedOrderCard";
import FailActions from "./components/mobile/FailActions";

// Desktop components
import DesktopFailContent from "./components/desktop/FailContent";

export default async function FailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ bookingId?: string; reason?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = await getRequestLocale();

  const [movieResult, bookingResult, catalogResult] = await Promise.all([
    // Real flow always carries `?bookingId=` (submit redirects with it) — the
    // booking payload already carries the movie, so no detail fetch there.
    query.bookingId ? Promise.resolve(null) : getMovieDetail(slug, locale),
    query.bookingId
      ? getBookingById(query.bookingId, await getRequestCookie())
      : Promise.resolve(null),
    // Only the receipt needs the catalog (opaque ids → display labels); an
    // outage degrades to the ids themselves instead of blanking the page.
    getPaymentMethods(locale),
  ]);

  if (bookingResult && isUnauthorizedResult(bookingResult)) return <LoginPrompt />;

  const movie = movieResult === null || "error" in movieResult ? undefined : movieResult.data;
  const booking = bookingResult && !("error" in bookingResult) ? bookingResult.data : null;
  const paymentMethods: PaymentMethodOption[] =
    "error" in catalogResult ? [] : catalogResult.data.methods;
  // URL param first (explicit gateway failure), then the persisted payment
  // reason on the fetched booking.
  const reason = query.reason ?? booking?.payment?.reason ?? null;

  return (
    <>
      <PaidBookingReset booking={booking} />

      {/* Mobile */}
      <div className="block md:hidden">
        <FailPageMobile
          movie={movie}
          booking={booking}
          reason={reason}
          paymentMethods={paymentMethods}
        />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopFailContent
          movie={movie}
          booking={booking}
          reason={reason}
          paymentMethods={paymentMethods}
        />
      </div>
    </>
  );
}

function FailPageMobile({
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
    <>
      <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg)">
        <main className="flex-1 overflow-y-auto pb-8 pt-10 space-y-6">
          <FailedIcon reason={reason} />

          <FailedOrderCard
            movie={movie}
            booking={booking}
            reason={reason}
            paymentMethods={paymentMethods}
          />

          <FailActions />
        </main>
      </div>
    </>
  );
}
