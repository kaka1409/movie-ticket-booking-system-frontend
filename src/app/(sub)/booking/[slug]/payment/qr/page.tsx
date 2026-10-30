import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getBookingById, getPaymentMethods } from "@/features/booking/api";
import { getRequestCookie, getRequestLocale, isUnauthorizedResult } from "@/libs/session";
import LoginPrompt from "@/components/shared/LoginPrompt";
import PageError from "@/app/(sub)/booking/components/mobile/PageError";
import { PaymentQrSection } from "./sections";
import PaymentQrLoading from "./loading";

export default async function PaymentQrPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ bookingId?: string; method?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);

  // The QR page only exists for a booking the payment step already created.
  if (!query.bookingId) redirect(`/booking/${slug}/payment`);

  const cookie = await getRequestCookie();
  const locale = await getRequestLocale();
  const catalogPromise = getPaymentMethods(locale);
  const bookingResult = await getBookingById(query.bookingId, cookie);

  if (isUnauthorizedResult(bookingResult)) return <LoginPrompt />;
  if ("error" in bookingResult) {
    if (bookingResult.error.status === 404) notFound();
    return <PageError error={bookingResult.error} />;
  }

  const booking = bookingResult.data;
  if (booking.status === "paid") {
    redirect(`/booking/${slug}/status/success?bookingId=${encodeURIComponent(booking.id)}`);
  }

  return (
    <Suspense fallback={<PaymentQrLoading />}>
      <PaymentQrSection
        slug={slug}
        booking={booking}
        methodQuery={query.method}
        catalogPromise={catalogPromise}
      />
    </Suspense>
  );
}
