"use client";

import { useBooking } from "@/features/booking/context";
import PaymentMethodCard from "@/features/booking/components/payment/PaymentMethodCard";
import type { PaymentMethodOption } from "@/features/booking/types";

/**
 * Booking-step adapter: the catalog card bound to the draft's gateway. The
 * transfer checkout uses `PaymentMethodCard` directly with its own state.
 */
export default function PaymentOption({
  method,
  isDemo,
}: {
  method: PaymentMethodOption;
  isDemo: boolean;
}) {
  const { paymentMethodId, setPayment } = useBooking();

  return (
    <PaymentMethodCard
      method={method}
      isDemo={isDemo}
      isSelected={paymentMethodId === method.id}
      // Id for the pay action; display name for PriceBreakdown / ticket cards.
      onSelect={(selected) => setPayment(selected.id, selected.name)}
    />
  );
}
