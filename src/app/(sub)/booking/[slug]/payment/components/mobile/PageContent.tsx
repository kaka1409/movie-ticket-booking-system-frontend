"use client";

import { useState } from "react";
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";
import OrderSummary from "./OrderSummary";
import PaymentOption, { PAYMENT_METHODS } from "./PaymentOption";
import SecureBadge from "./SecureBadge";
import TermsNote from "./TermsNote";
import BottomBar from "./BottomBar";

export default function PageContent() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-dvh">
      <StepBar current={5} />

      <main className="flex-1 overflow-y-auto pb-5 pt-1 space-y-5">
        <CountdownBanner />

        <OrderSummary />

        <section className="px-4 space-y-3">
          <h2 className="font-bold text-lg text-(--color-text-primary)">
            Select Payment Method
          </h2>

          <div className="space-y-2.5">
            {PAYMENT_METHODS.map((m) => (
              <PaymentOption
                key={m.id}
                method={m}
                selected={selectedMethod === m.id}
                onSelect={() => setSelectedMethod(m.id)}
              />
            ))}
          </div>
        </section>

        <SecureBadge />

        <TermsNote />

        <div className="flex items-center justify-center gap-2 pb-2">
          <span className="text-xs text-(--color-text-muted)">
            E-ticket will be sent to your email after payment.
          </span>
        </div>
      </main>

      <BottomBar canPay={!!selectedMethod} />
    </div>
  );
}
