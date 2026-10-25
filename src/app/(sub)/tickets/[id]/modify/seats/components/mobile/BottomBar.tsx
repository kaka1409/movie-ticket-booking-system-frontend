"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useSeatsStep } from "@/features/tickets/hooks/useModifySteps";
import BookingBottomBar from "@/components/shared/BookingBottomBar";

export default function BottomBar() {
  const { translate } = useLocale();
  const { canContinue, isNavigating, hintText, goToNextStep } = useSeatsStep();

  return (
    <BookingBottomBar
      hintText={hintText}
      canProceed={canContinue}
      ctaText={
        isNavigating
          ? translate("booking.payment.processing")
          : translate("tickets.transfer.continue")
      }
      isLoading={isNavigating}
      onCtaClick={goToNextStep}
    />
  );
}
