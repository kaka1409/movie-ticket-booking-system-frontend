import { Suspense } from "react";
import type { ReactNode } from "react";
import { getMovieDetail } from "@/features/movies/api";
import { getBookingById, getPaymentMethods } from "@/features/booking/api";
import { getRequestCookie, getRequestLocale, isUnauthorizedResult } from "@/libs/session";
import PaidBookingReset from "@/app/(sub)/booking/components/shared/PaidBookingReset";
import LoginPrompt from "@/components/shared/LoginPrompt";

// Mobile components
import FailedIcon from "./components/mobile/FailedIcon";
import FailActions from "./components/mobile/FailActions";

// Desktop components
import DesktopFailContent from "./components/desktop/FailContent";
import { FailedReceiptSection } from "./sections";
import { StatusReceiptSkeleton } from "../components/shared/StatusSkeletons";

export default async function FailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ bookingId?: string; reason?: string }>;
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
  // URL param first (explicit gateway failure), then the persisted payment
  // reason on the fetched booking.
  const reason = query.reason ?? booking?.payment?.reason ?? null;

  return (
    <>
      <PaidBookingReset booking={booking} />

      {/* Mobile */}
      <div className="block md:hidden">
        <FailPageMobile
          reason={reason}
          receipt={
            <Suspense fallback={<StatusReceiptSkeleton />}>
              <FailedReceiptSection
                moviePromise={moviePromise}
                catalogPromise={catalogPromise}
                booking={booking}
                reason={reason}
              />
            </Suspense>
          }
        />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopFailContent
          reason={reason}
          receipt={
            <Suspense fallback={<StatusReceiptSkeleton />}>
              <FailedReceiptSection
                moviePromise={moviePromise}
                catalogPromise={catalogPromise}
                booking={booking}
                reason={reason}
              />
            </Suspense>
          }
        />
      </div>
    </>
  );
}

function FailPageMobile({
  reason,
  receipt,
}: {
  reason: string | null;
  receipt: ReactNode;
}) {
  return (
    <>
      <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg)">
        <main className="flex-1 overflow-y-auto pb-8 pt-10 space-y-6">
          <FailedIcon reason={reason} />

          {receipt}

          <FailActions />
        </main>
      </div>
    </>
  );
}
import { Suspense } from "react";
