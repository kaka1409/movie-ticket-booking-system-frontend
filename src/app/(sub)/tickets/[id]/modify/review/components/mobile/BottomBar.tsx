"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useModifySubmit } from "@/features/tickets/hooks/useModifySubmit";
import BookingBottomBar from "@/components/shared/BookingBottomBar";

export default function BottomBar() {
  const { translate } = useLocale();
  const { canSubmit, isPending, errorMessage, submit } = useModifySubmit();

  return (
    <BookingBottomBar
      canProceed={canSubmit && !isPending}
      ctaText={
        isPending
          ? translate("booking.payment.processing")
          : translate("tickets.modify.review.confirm_cta")
      }
      isLoading={isPending}
      errorText={errorMessage}
      onCtaClick={submit}
    />
  );
}
