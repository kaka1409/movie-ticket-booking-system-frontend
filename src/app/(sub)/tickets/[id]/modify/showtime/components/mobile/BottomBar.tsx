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

    await new Promise((resolve) => setTimeout(resolve, 300));

    // A different room means the current seats do not exist on that map, so
    // the server requires a new pick before the change can be submitted.
    const needsSeatSelection =
      modificationType === "both" || selectedShowtime?.requiresSeatSelection;

    if (needsSeatSelection) {
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
