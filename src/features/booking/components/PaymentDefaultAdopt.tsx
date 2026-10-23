"use client";

import { useEffect } from "react";
import { useBooking } from "@/features/booking/context";
import type { PaymentMethodOption } from "@/features/booking/types";

/**
 * Keeps the draft's gateway in step with the server catalog, so the CTA is
 * usable the moment exactly one method is sellable (the usual demo state) and
 * a draft left pointing at a now-disabled method cannot block the step.
 *
 * Effect-only and mounted once at page level: both device trees render, so a
 * per-skin copy would dispatch twice.
 */
export default function PaymentDefaultAdopt({ methods }: { methods: PaymentMethodOption[] }) {
  const { paymentMethodId, setPayment } = useBooking();

  const sellableMethods = methods.filter((method) => method.enabled);
  const singleMethod = sellableMethods.length === 1 ? sellableMethods[0] : null;
  const selectionIsSellable = sellableMethods.some((method) => method.id === paymentMethodId);

  useEffect(() => {
    if (singleMethod) {
      if (paymentMethodId !== singleMethod.id) setPayment(singleMethod.id, singleMethod.name);
      return;
    }

    if (!selectionIsSellable && paymentMethodId !== "") setPayment("", "");
  }, [singleMethod, selectionIsSellable, paymentMethodId, setPayment]);

  return null;
}
