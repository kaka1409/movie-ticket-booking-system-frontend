"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import type { Recipient } from "@/features/tickets/types";
import { createTransfer } from "@/features/tickets/action";
import type { TransferActionResult } from "@/features/tickets/action";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";

interface ConfirmBottomBarProps {
  seatLabels: string[];
  recipient: Recipient;
  transferSnacks: boolean;
}

const initialState: TransferActionResult = { success: false, error: "" };

export default function ConfirmBottomBar({
  seatLabels,
  recipient,
  transferSnacks,
}: ConfirmBottomBarProps) {
  const router = useRouter();
  const { ticket } = useTicketDetail();
  const { translate } = useLocale();
  const { token } = useAuth();

  const [state, formAction, isPending] = useActionState(createTransfer, initialState);

  const handleConfirm = () => {
    if (isPending) return;
    formAction({
      ticketId: ticket.id,
      recipient,
      seats: seatLabels,
      transferSnacks,
      token: token ?? "",
    });
  };

  const handleCancel = () => {
    router.back();
  };

  if (state.success) {
    router.push(`/tickets/${ticket.id}`);
  }

  return (
    <div className="sticky bottom-0 z-50 bg-(--color-bg) border-t border-(--color-border) px-4 pb-6 pt-3">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="flex-1 flex items-center justify-center py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98] border border-(--color-border) text-(--color-text-secondary) bg-transparent disabled:opacity-40"
        >
          {translate("tickets.transfer.cancel")}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98] bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_20px_rgba(255,204,77,0.25)] disabled:opacity-40"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {translate("tickets.transfer.confirm_cta")}
        </button>
      </div>
    </div>
  );
}
