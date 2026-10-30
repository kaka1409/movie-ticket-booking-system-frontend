import { redirect } from "next/navigation";
import { getPaymentLabel } from "@/features/booking/utils/paymentBrand";
import type { BookingDetail } from "@/features/booking/types";
import PaymentQrScreen from "./components/shared/PaymentQrScreen";

export async function PaymentQrSection({
  slug,
  booking,
  methodQuery,
  catalogPromise,
}: {
  slug: string;
  booking: BookingDetail;
  methodQuery?: string;
  catalogPromise: ReturnType<typeof import("@/features/booking/api").getPaymentMethods>;
}) {
  const catalogResult = await catalogPromise;
  const catalog = "error" in catalogResult ? null : catalogResult.data;
  const methods = catalog?.methods ?? [];
  const isListed = (candidate: string | undefined): candidate is string =>
    candidate !== undefined && methods.some((option) => option.id === candidate);
  const method =
    (catalog ? (isListed(methodQuery) ? methodQuery : undefined) : methodQuery) ??
    booking.payment?.method ??
    methods.find((option) => option.enabled)?.id;

  if (!method) redirect(`/booking/${slug}/payment`);

  return (
    <PaymentQrScreen
      slug={slug}
      booking={booking}
      method={method}
      methodLabel={getPaymentLabel(methods, method)}
      isDemo={catalog?.demo === true}
      paymentMethods={methods}
    />
  );
}
