"use client";

import { usePaymentIntent } from "@/features/booking/hooks/usePaymentIntent";
import type { BookingDetail, PaymentMethodId, PaymentMethodOption } from "@/features/booking/types";
import PaymentQrMobile from "../mobile/PaymentQrContent";
import PaymentQrDesktop from "../desktop/PaymentQrContent";

/**
 * Both device trees render, so the intent lifecycle (get-or-create, poll,
 * simulate, sync) is mounted exactly once here and the skins stay presentational.
 */
export default function PaymentQrScreen({
  slug,
  booking,
  method,
  methodLabel,
  isDemo,
  paymentMethods,
}: {
  slug: string;
  booking: BookingDetail;
  method: PaymentMethodId;
  methodLabel: string;
  isDemo: boolean;
  paymentMethods: PaymentMethodOption[];
}) {
  const payment = usePaymentIntent({ slug, booking, method });

  return (
    <>
      <div className="block md:hidden print:hidden">
        <PaymentQrMobile
          slug={slug}
          booking={booking}
          methodLabel={methodLabel}
          isDemo={isDemo}
          payment={payment}
          paymentMethods={paymentMethods}
        />
      </div>
      <div className="hidden md:block print:block">
        <PaymentQrDesktop
          slug={slug}
          booking={booking}
          methodLabel={methodLabel}
          isDemo={isDemo}
          payment={payment}
          paymentMethods={paymentMethods}
        />
      </div>
    </>
  );
}
