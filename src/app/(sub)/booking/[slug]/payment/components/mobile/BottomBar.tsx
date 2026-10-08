"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useSubmitBooking } from "@/features/booking/hooks/useSubmitBooking";
import BookingBottomBar from "@/components/shared/BookingBottomBar";

export default function BottomBar() {
  const { translate } = useLocale();
  const { canPay, isLoading, errorMessage, submit } = useSubmitBooking();

  return (
    <BookingBottomBar
      canProceed={canPay}
      ctaText={
        isLoading ? translate("booking.payment.processing") : translate("booking.payment.confirm")
      }
      onCtaClick={submit}
      isLoading={isLoading}
      errorText={errorMessage}
    />
  );
}
