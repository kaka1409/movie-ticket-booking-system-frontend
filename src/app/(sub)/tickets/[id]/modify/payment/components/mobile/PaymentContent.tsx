"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useModifyPayment } from "@/features/tickets/hooks/useModifyPayment";
import { formatVND } from "@/libs/utils";
import BookingBottomBar from "@/components/shared/BookingBottomBar";
import MicroLabel from "@/components/ui/MicroLabel";

/** Local gateway cards — the backend charges the difference on the original method. */
const PAYMENT_METHODS: { id: string; name: string; description: string; imageSrc: string }[] = [
  { id: "vnpay", name: "VNPAY", description: "Bank Transfer", imageSrc: "/images/VNPay.png" },
  { id: "momo", name: "MoMo E-Wallet", description: "Fast & Secure", imageSrc: "/images/momo.png" },
];

export default function PaymentContent() {
  const { translate, locale } = useLocale();
  const {
    difference,
    selectedMethod,
    setSelectedMethod,
    canPay,
    isPending,
    errorMessage,
    confirm,
  } = useModifyPayment();

  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1 overflow-y-auto pb-5 pt-4 space-y-5">
        {/* Amount to pay */}
        <section className="px-4">
          <div className="p-5 rounded-2xl bg-(--color-surface) border border-(--color-border) text-center">
            <MicroLabel className="text-(--color-text-muted) mb-2">
              {translate("tickets.modify.payment.pay_difference")}
            </MicroLabel>
            <p className="font-extrabold text-3xl text-(--color-gold)">
              {formatVND(difference, locale)}
            </p>
          </div>
        </section>

        {/* Payment methods */}
        <section className="px-4 space-y-3">
          <MicroLabel className="text-(--color-text-muted)">
            {translate("booking.payment.select_method")}
          </MicroLabel>
          {PAYMENT_METHODS.map((method) => {
            const selected = selectedMethod === method.id;
            return (
              <button
                type="button"
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all duration-150 active:scale-[0.99] text-left ${
                  selected
                    ? "bg-(--color-surface) border-(--color-gold) shadow-[0_0_0_1px_rgba(255,204,77,0.12)]"
                    : "bg-(--color-surface) border-(--color-border) hover:border-(--color-gold)/30"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
                    selected
                      ? "border-(--color-gold) bg-(--color-gold)"
                      : "border-(--color-text-muted) bg-transparent"
                  }`}
                >
                  {selected && <div className="w-2 h-2 rounded-full bg-[#0F0F0F]" />}
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-(--color-surface-2) overflow-hidden">
                  <Image
                    src={method.imageSrc}
                    alt={method.name}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-sm text-(--color-text-primary)">
                    {method.name}
                  </span>
                  <p className="text-xs text-(--color-text-muted) mt-0.5">{method.description}</p>
                </div>
              </button>
            );
          })}
        </section>

        {/* Refund notice */}
        {difference < 0 && (
          <section className="px-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs">
              <Clock size={14} />
              {translate("tickets.modify.payment.refund_notice")}
            </div>
          </section>
        )}
      </main>

      {/* Bottom bar */}
      <BookingBottomBar
        canProceed={canPay}
        ctaText={
          isPending
            ? translate("booking.payment.processing")
            : translate("tickets.modify.payment.confirm_cta")
        }
        isLoading={isPending}
        errorText={errorMessage ?? undefined}
        onCtaClick={confirm}
      />
    </div>
  );
}
