"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import type { Recipient } from "@/features/tickets/types";
import { createTransfer } from "@/features/tickets/api";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";

interface ConfirmBottomBarProps {
  seatLabels: string[];
  recipient: Recipient;
  transferSnacks: boolean;
}

export default function ConfirmBottomBar({
  seatLabels,
  recipient,
  transferSnacks,
}: ConfirmBottomBarProps) {
  const router = useRouter();
  const { ticket } = useTicketDetail();
  const { translate } = useLocale();

  const handleConfirm = async () => {
    await createTransfer(ticket.id, recipient, seatLabels, transferSnacks);
    router.push(`/tickets/${ticket.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="sticky bottom-0 z-50 bg-(--color-bg) border-t border-(--color-border) px-4 pb-6 pt-3">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 flex items-center justify-center py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98] border border-(--color-border) text-(--color-text-secondary) bg-transparent"
        >
          {translate("tickets.transfer.cancel")}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="flex-1 flex items-center justify-center py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98] bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_20px_rgba(255,204,77,0.25)]"
        >
          {translate("tickets.transfer.confirm_cta")}
        </button>
      </div>
    </div>
  );
}
