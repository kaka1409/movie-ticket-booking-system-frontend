"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useModifyTypeStep } from "@/features/tickets/hooks/useModifySteps";
import BookingBottomBar from "@/components/shared/BookingBottomBar";

export default function BottomBar() {
  const { translate } = useLocale();
  const { canContinue, goToNextStep } = useModifyTypeStep();

  return (
    <BookingBottomBar
      canProceed={canContinue}
      ctaText={translate("tickets.transfer.continue")}
      onCtaClick={goToNextStep}
    />
  );
}
