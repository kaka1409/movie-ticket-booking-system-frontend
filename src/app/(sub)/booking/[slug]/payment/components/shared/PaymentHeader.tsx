"use client";

import { useLocale } from "@/contexts/LocaleContext";

export default function PaymentHeader() {
  const { translate } = useLocale();

  return (
    <>
      <h2 className="font-bold text-lg text-(--color-text-primary)">
        {translate("booking.payment.select_method")}
      </h2>
      <div className="flex items-center justify-center gap-2 pb-2">
        <span className="text-xs text-(--color-text-muted)">
          {translate("booking.payment.eticket_notice")}
        </span>
      </div>
    </>
  );
}
