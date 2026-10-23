import { notFound, redirect } from "next/navigation";
import { getBookingById, getPaymentMethods } from "@/features/booking/api";
import { getPaymentLabel } from "@/features/booking/paymentBrand";
import { getRequestCookie, getRequestLocale, isUnauthorizedResult } from "@/libs/session";
import LoginPrompt from "@/components/shared/LoginPrompt";
import PageError from "@/app/(sub)/booking/components/mobile/PageError";
import PaymentQrScreen from "./components/PaymentQrScreen";

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

  const [bookingResult, catalogResult] = await Promise.all([
    getBookingById(query.bookingId, await getRequestCookie()),
    getPaymentMethods(await getRequestLocale()),
  ]);

  if (isUnauthorizedResult(bookingResult)) return <LoginPrompt />;
  if ("error" in bookingResult) {
    if (bookingResult.error.status === 404) notFound();
    return <PageError error={bookingResult.error} />;
  }

  const booking = bookingResult.data;
  if (booking.status === "paid") {
    redirect(`/booking/${slug}/status/success?bookingId=${encodeURIComponent(booking.id)}`);
  }

  // A catalog outage must not block a payment that is already open, so the
  // screen falls back to the method id as its label and hides the demo panel.
  const catalog = "error" in catalogResult ? null : catalogResult.data;
  const catalogMethods = catalog?.methods ?? [];
  const isListed = (candidate: string | undefined): candidate is string =>
    candidate !== undefined && catalogMethods.some((option) => option.id === candidate);

  // A method the catalog does not list cannot be sold on this screen; the
  // booking's own record outranks an unknown `?method=` someone typed into the URL.
  const method =
    (catalog ? (isListed(query.method) ? query.method : undefined) : query.method) ??
    booking.payment?.method ??
    catalogMethods.find((option) => option.enabled)?.id;

  // Nothing to charge with: the payment step is the one place that shows why
  // (every card disabled) instead of leaving a dead QR page behind.
  if (!method) redirect(`/booking/${slug}/payment`);

  const methodLabel = getPaymentLabel(catalogMethods, method);

  return (
    <PaymentQrScreen
      slug={slug}
      booking={booking}
      method={method}
      methodLabel={methodLabel}
      isDemo={catalog?.demo === true}
      paymentMethods={catalogMethods}
    />
  );
}
