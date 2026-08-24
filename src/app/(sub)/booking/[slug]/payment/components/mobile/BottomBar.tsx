"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useBooking } from "@/features/booking/context";
import { usePayment } from "@/features/booking/contexts/PaymentContext";
import { useLocale } from "@/contexts/LocaleContext";
import { PAYMENT_METHODS } from "@/features/booking/mock";
import Button from "@/components/ui/Button";

export default function BottomBar() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { ticketCount, cinemaName, total, setPaymentMethod } = useBooking();
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
    <div className="sticky bottom-0 z-50 bg-(--color-bg) border-t border-(--color-border) px-4 pb-6 pt-3">


      <Button
        onClick={handleClick}
        disabled={!canPay}
        loading={isLoading}
        icon={isLoading ? undefined : ArrowRight}
      >
        {isLoading
          ? translate("booking.payment.processing")
          : translate("booking.payment.confirm")}
      </Button>
    </div>
  );
}
