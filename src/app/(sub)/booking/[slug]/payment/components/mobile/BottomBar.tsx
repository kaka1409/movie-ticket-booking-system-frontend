"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBooking } from "@/features/booking/context";
import { usePayment } from "@/features/booking/contexts/PaymentContext";
import { useLocale } from "@/contexts/LocaleContext";
import { PAYMENT_METHODS } from "@/features/booking/mock";
import BookingBottomBar from "@/components/booking/BookingBottomBar";

export default function BottomBar() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { setPaymentMethod } = useBooking();
  const { selectedMethod } = usePayment();
  const { translate } = useLocale();
  const [isLoading, setIsLoading] = useState(false);

  const canPay = !!selectedMethod;

  const handleClick = async () => {
    if (!canPay || isLoading) return;

    const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod);
    if (method) setPaymentMethod(method.name);

    setIsLoading(true);

    // Simulate external payment gateway processing
    await new Promise((r) => setTimeout(r, 2000));

    const success = Math.random() > 0.5;
    const txnId = `TXN${Date.now()}`;

    if (success) {
      router.push(`/booking/${slug}/status/success?transactionId=${txnId}`);
    } else {
      router.push(`/booking/${slug}/status/failed?reason=payment_declined&transactionId=${txnId}`);
    }
  };

  return (
    <BookingBottomBar
      canProceed={canPay}
      ctaText={
        isLoading ? translate("booking.payment.processing") : translate("booking.payment.confirm")
      }
      onCtaClick={handleClick}
      isLoading={isLoading}
    />
  );
}
