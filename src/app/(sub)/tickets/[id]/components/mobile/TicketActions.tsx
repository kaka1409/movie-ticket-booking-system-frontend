"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, MoreHorizontal, Pencil, ArrowUpRight, XCircle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import ActionSheet, { ActionRow } from "@/components/ui/ActionSheet";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";

export default function TicketActions() {
  const { ticket, transfer } = useTicketDetail();
  const { translate } = useLocale();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [actionsOpen, setActionsOpen] = useState(false);
  const canCancel = ["success", "confirmed", "pending"].includes(ticket.status);
  const isTransferPending = transfer?.status === "pending";

  return (
    <div className="px-4 pb-8 space-y-3">
      {!isTransferPending && (
        <button className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-extrabold text-sm tracking-wide transition-all duration-150 active:scale-[0.98] bg-(--color-gold) text-[#0F0F0F] shadow-(--shadow-glow)">
          <Download size={18} />
          {translate("tickets.detail.download_ticket")}
        </button>
      )}

      {!isTransferPending && canCancel && (
        <>
          <button
            onClick={() => setActionsOpen(true)}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-extrabold text-sm tracking-wide transition-all duration-150 active:scale-[0.98] border border-(--color-border) text-(--color-text-secondary) bg-transparent"
          >
            <MoreHorizontal size={18} />
            {translate("tickets.detail.more_actions")}
          </button>

          <ActionSheet open={actionsOpen} onClose={() => setActionsOpen(false)}>
            <ActionRow
              icon={Pencil}
              label={translate("tickets.detail.edit_ticket")}
              description={translate("tickets.detail.edit_ticket_desc")}
              onClick={() => {
                setActionsOpen(false);
                router.push(`/tickets/${id}/modify`);
              }}
            />
            <ActionRow
              icon={ArrowUpRight}
              label={translate("tickets.detail.transfer_ticket")}
              description={translate("tickets.detail.transfer_ticket_desc")}
              onClick={() => {
                setActionsOpen(false);
                router.push(`/tickets/${id}/transfer`);
              }}
            />
            <ActionRow
              icon={XCircle}
              label={translate("tickets.detail.cancel_refund")}
              description={translate("tickets.detail.cancel_refund_desc")}
              danger
              onClick={() => {
                setActionsOpen(false);
                router.push(`/tickets/${id}/cancel`);
              }}
            />
          </ActionSheet>
        </>
      )}
    </div>
  );
}
