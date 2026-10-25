"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useShowtimeStep } from "@/features/tickets/hooks/useModifySteps";
import BookingBottomBar from "@/components/shared/BookingBottomBar";

export default function BottomBar() {
  const { translate } = useLocale();
  const { canContinue, isNavigating, goToNextStep } = useShowtimeStep();

  return (
    <BookingBottomBar
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
