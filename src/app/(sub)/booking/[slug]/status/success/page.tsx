import { Suspense } from "react";
import { getMovieDetail } from "@/features/movies/api";
import { getBookingById, getPaymentMethods } from "@/features/booking/api";
import { getRequestCookie, getRequestLocale, isUnauthorizedResult } from "@/libs/session";
import PaidBookingReset from "@/app/(sub)/booking/components/shared/PaidBookingReset";
import LoginPrompt from "@/components/shared/LoginPrompt";

// Mobile components
import SuccessIcon from "@/components/shared/SuccessIcon";
import SuccessActions from "./components/mobile/SuccessActions";

// Desktop components
import DesktopSuccessContent from "./components/desktop/SuccessContent";
import { SuccessReceiptSection } from "./sections";
import { StatusReceiptSkeleton } from "../components/shared/StatusSkeletons";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ bookingId?: string; transactionId?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = await getRequestLocale();

  const moviePromise = query.bookingId ? null : getMovieDetail(slug, locale);
  const catalogPromise = getPaymentMethods(locale);
  const bookingResult = query.bookingId
    ? await getBookingById(query.bookingId, await getRequestCookie())
    : null;

  if (bookingResult && isUnauthorizedResult(bookingResult)) return <LoginPrompt />;

  const booking = bookingResult && !("error" in bookingResult) ? bookingResult.data : null;
  // Payment gateways may return their own reference; the fetched booking wins
  // over the raw URL param only when the param is absent.
  const transactionId = query.transactionId ?? booking?.transactionRef ?? booking?.id ?? "N/A";

  return (
    <>
      <PaidBookingReset booking={booking} />

      {/* Mobile */}
      <div className="block md:hidden print:hidden">
        <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg)">
          <main className="flex-1 overflow-y-auto pb-8 pt-4 space-y-6">
            <SuccessIcon
              titleKey="booking.status.success.title"
              messageKey="booking.status.success.message"
            />
            <Suspense fallback={<StatusReceiptSkeleton />}>
              <SuccessReceiptSection
                moviePromise={moviePromise}
                catalogPromise={catalogPromise}
                booking={booking}
                transactionId={transactionId}
              />
            </Suspense>
            <SuccessActions />
          </main>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block print:block">
        <DesktopSuccessContent
          booking={booking}
          transactionId={transactionId}
          receipt={
            <Suspense fallback={<StatusReceiptSkeleton />}>
              <SuccessReceiptSection
                moviePromise={moviePromise}
                catalogPromise={catalogPromise}
                booking={booking}
                transactionId={transactionId}
              />
            </Suspense>
          }
        />
      </div>
    </>
  );
}
