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
  const { seatCount } = useModification();
  const [isLoading, setIsLoading] = useState(false);

  const canContinue = seatCount > 0;

  const handleContinue = async () => {
    if (!canContinue || isLoading) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    router.push(`/tickets/${id}/modify/review`);
  };

  return (
    <BookingBottomBar
      hintText={
        seatCount > 0
          ? `${seatCount} ${translate("tickets.modify.seats.selected")}`
          : translate("tickets.modify.seats.select_prompt")
      }
      canProceed={canContinue}
      ctaText={
        isLoading ? translate("booking.payment.processing") : translate("tickets.transfer.continue")
      }
      isLoading={isLoading}
      onCtaClick={() => void handleContinue()}
    />
  );
}
