"use client";

import { useParams, useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import BookingBottomBar from "@/components/shared/BookingBottomBar";

export default function BottomBar() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { translate } = useLocale();
  const { modificationType } = useModification();

  const canContinue = !!modificationType;

  const handleContinue = () => {
    if (!canContinue) return;

    if (modificationType === "showtime") {
      router.push(`/tickets/${id}/modify/showtime`);
    } else if (modificationType === "seats") {
      router.push(`/tickets/${id}/modify/seats`);
    } else {
      router.push(`/tickets/${id}/modify/showtime`);
    }
  };

  return (
    <BookingBottomBar
      canProceed={canContinue}
      ctaText={translate("tickets.transfer.continue")}
      onCtaClick={handleContinue}
    />
  );
}
