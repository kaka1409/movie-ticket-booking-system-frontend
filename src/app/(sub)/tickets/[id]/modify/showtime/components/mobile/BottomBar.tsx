"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";

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
    await new Promise((r) => setTimeout(r, 300));

    if (modificationType === "both") {
      router.push(`/tickets/${id}/modify/seats`);
    } else {
      router.push(`/tickets/${id}/modify/review`);
    }
  };

  return (
    <div className="sticky bottom-0 z-50 bg-(--color-bg) border-t border-(--color-border) px-4 pb-6 pt-3">
      <button
        type="button"
        onClick={handleContinue}
        disabled={!canContinue}
        className={`flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 ${
          canContinue
            ? "bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_20px_rgba(255,204,77,0.25)] active:scale-[0.98]"
            : "bg-(--color-surface) text-(--color-text-muted) cursor-not-allowed border border-(--color-border)"
        }`}
      >
        {isLoading
          ? translate("booking.payment.processing")
          : translate("tickets.transfer.continue")}
        {!isLoading && <ArrowRight size={17} />}
      </button>
    </div>
  );
}
