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
  const { modificationType, selectedShowtime } = useModification();
  const [isLoading, setIsLoading] = useState(false);

  const canContinue = !!selectedShowtime;

  const handleContinue = async () => {
    if (!canContinue || isLoading) return;
    setIsLoading(true);

    // Brief loading animation
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (modificationType === "both") {
      router.push(`/tickets/${id}/modify/seats`);
    } else {
      router.push(`/tickets/${id}/modify/review`);
    }
  };

  return (
    <BookingBottomBar
      canProceed={canContinue}
      ctaText={
        isLoading ? translate("booking.payment.processing") : translate("tickets.transfer.continue")
      }
      isLoading={isLoading}
      onCtaClick={() => void handleContinue()}
    />
  );
}
