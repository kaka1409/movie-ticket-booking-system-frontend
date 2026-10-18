"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import type { Recipient } from "@/features/tickets/types";
import { createTransfer } from "@/features/tickets/action";
import type { TransferActionResult } from "@/features/tickets/action";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import Button from "@/components/ui/Button";

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

  const [state, formAction, isPending] = useActionState(createTransfer, initialState);

  // Selected labels → backend seat UUIDs; drives both the hidden inputs and the
  // CTA's disabled state (nothing to transfer → nothing to submit).
  const seatIds = ticket.seatItems
    .filter((seat) => seatLabels.includes(seat.label) && seat.seatId)
    .map((seat) => seat.seatId as string);

  useEffect(() => {
    if (state.success) {
      router.push(`/tickets/${ticket.id}`);
    }
  }, [state, router, ticket.id]);

  const handleCancel = () => {
    router.back();
  };

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
        <form action={formAction} className="flex-1">
          <input type="hidden" name="ticketId" value={ticket.id} />
          <input type="hidden" name="recipientEmail" value={recipient.email} />
          <input type="hidden" name="transferSnacks" value={String(transferSnacks)} />
          {seatIds.map((seatId) => (
            <input key={seatId} type="hidden" name="seatId" value={seatId} />
          ))}
          <Button type="submit" loading={isPending} disabled={seatIds.length === 0}>
            {translate("tickets.transfer.confirm_cta")}
          </Button>
        </form>
      </div>
    </div>
  );
}
