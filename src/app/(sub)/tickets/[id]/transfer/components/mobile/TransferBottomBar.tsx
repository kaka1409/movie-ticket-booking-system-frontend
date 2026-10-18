"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useTransfer } from "@/features/tickets/contexts/TransferContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";

export default function TransferBottomBar() {
  const router = useRouter();
  const { ticket } = useTicketDetail();
  const { selectedSeats, recipient, transferSnacks } = useTransfer();
  const { translate } = useLocale();

  const isValid = selectedSeats.length > 0 && recipient !== null;

  const handleContinue = () => {
    if (!isValid || !recipient) return;
    const seatsParam = selectedSeats.join(",");
    const snacksParam = transferSnacks ? "&transferSnacks=true" : "";
    router.push(
      `/tickets/${ticket.id}/transfer/confirm?seats=${encodeURIComponent(seatsParam)}&recipient=${encodeURIComponent(recipient.email)}${snacksParam}`,
    );
  };

  return (
    <div className="sticky bottom-0 z-50 bg-(--color-bg) border-t border-(--color-border) px-4 pb-6 pt-3 space-y-3">
      <p className="flex items-start gap-2 text-xs text-(--color-text-muted)">
        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-(--color-gold)" />
        {translate("tickets.transfer.warning")}
      </p>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!isValid}
        className={`flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98] ${
          isValid
            ? "bg-(--color-gold) text-(--color-bg) shadow-(--shadow-glow)"
            : "bg-(--color-surface) text-(--color-text-muted) border border-(--color-border) cursor-not-allowed"
        }`}
      >
        {translate("tickets.transfer.continue")}
        <ArrowRight size={17} />
      </button>
    </div>
  );
}
