"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { useBooking } from "@/features/booking/context";
import { usePayment } from "./PaymentContext";
import { PAYMENT_METHODS } from "./PaymentOption";

export default function BottomBar() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { ticketCount, cinemaName, total, setPaymentMethod } = useBooking();
  const { selectedMethod } = usePayment();
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


      <button
        onClick={handleClick}
        disabled={!canPay || isLoading}
        className={`flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98] ${
          canPay && !isLoading
            ? "bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_20px_rgba(255,204,77,0.25)]"
            : "bg-(--color-surface) text-(--color-text-muted) border border-(--color-border) cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 size={17} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Confirm Payment
            <ArrowRight size={17} />
          </>
        )}
      </button>
    </div>
  );
}
