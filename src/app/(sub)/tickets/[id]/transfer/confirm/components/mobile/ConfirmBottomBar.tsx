"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import type { Recipient } from "@/features/tickets/types";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { useTransferSubmit } from "@/features/tickets/hooks/useTransferSubmit";
import TransferConfirmForm from "@/features/tickets/components/TransferConfirmForm";

export default function ConfirmBottomBar({ recipient }: { recipient: Recipient }) {
  const router = useRouter();
  const { translate } = useLocale();
  const { ticket } = useTicketDetail();
  const { formAction, isPending, error } = useTransferSubmit();

  return (
    <div className="sticky bottom-0 z-cta bg-(--color-bg) border-t border-(--color-border) px-4 pb-6 pt-3">
      {error && (
        <p role="alert" className="mb-2 text-center text-xs text-red-400">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="flex-1 flex items-center justify-center py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition duration-150 active:scale-[0.98] border border-(--color-border) text-(--color-text-secondary) bg-transparent disabled:opacity-40"
        >
          {translate("tickets.transfer.cancel")}
        </button>
        <TransferConfirmForm
          className="flex-1"
          formAction={formAction}
          isPending={isPending}
          ticketId={ticket.id}
          recipientEmail={recipient.email}
        />
      </div>
    </div>
  );
}
