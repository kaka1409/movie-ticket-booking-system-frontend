"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import BookingBottomBar from "@/components/shared/BookingBottomBar";

export default function BottomBar() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { translate } = useLocale();
  const { modificationType } = useModification();
  const [isLoading, setIsLoading] = useState(false);

  const canConfirm = !!modificationType;

  const handleConfirm = async () => {
    if (!canConfirm || isLoading) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    router.push(`/tickets/${id}/modify/payment`);
  };

  return (
    <BookingBottomBar
      canProceed={canConfirm}
      ctaText={
        isLoading
          ? translate("booking.payment.processing")
          : translate("tickets.modify.review.confirm_cta")
      }
      isLoading={isLoading}
      onCtaClick={() => void handleConfirm()}
    />
  );
}
