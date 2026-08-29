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
  const { seatCount } = useModification();
  const [isLoading, setIsLoading] = useState(false);

  const canContinue = seatCount > 0;

  const handleContinue = async () => {
    if (!canContinue || isLoading) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    router.push(`/tickets/${id}/modify/review`);
  };

  return (
    <div className="sticky bottom-0 z-50 bg-(--color-bg) border-t border-(--color-border) px-4 pb-6 pt-3">
      <div className="flex items-end justify-between mb-3 min-h-[40px]">
        <div>
          <p className="text-[9px] font-bold tracking-widest uppercase text-(--color-text-muted) mb-0.5">
            {seatCount > 0
              ? `${seatCount} ${translate("tickets.modify.seats.selected")}`
              : translate("tickets.modify.seats.select_prompt")}
          </p>
        </div>
      </div>

      <button
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
