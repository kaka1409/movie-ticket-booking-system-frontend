"use client";

import { useActionState, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  Download,
  Loader2,
  MoreHorizontal,
  Pencil,
  X,
  XCircle,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import ActionSheet, { ActionRow } from "@/components/ui/ActionSheet";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { acceptTransfer, declineTransfer } from "@/features/tickets/action";
import type { TransferDecisionActionResult } from "@/features/tickets/action";

const initialDecisionState: TransferDecisionActionResult = { success: false, error: "" };

/** A decided transfer (accepted elsewhere/expired) is not an error — it is done. */
function isSettled(state: TransferDecisionActionResult): boolean {
  return state.success || state.code === "TRANSFER_NOT_PENDING";
}

export default function TicketActions() {
  const { ticket, viewerRole, transfer, incomingTransfer } = useTicketDetail();
  const { translate } = useLocale();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [actionsOpen, setActionsOpen] = useState(false);

  const [acceptState, acceptFormAction, isAccepting] = useActionState(
    acceptTransfer,
    initialDecisionState,
  );
  const [declineState, declineFormAction, isDeclining] = useActionState(
    declineTransfer,
    initialDecisionState,
  );

  // Accepted: the same URL now renders the owner view (QR included).
  useEffect(() => {
    if (!isSettled(acceptState)) return;
    router.refresh();
  }, [acceptState, router]);

  // Declined (or already settled): the ticket is no longer readable here.
  useEffect(() => {
    if (!isSettled(declineState)) return;
    router.replace("/tickets");
    router.refresh();
  }, [declineState, router]);

  if (viewerRole === "recipient" && incomingTransfer) {
    const error =
      !acceptState.success && !declineState.success
        ? acceptState.error || declineState.error
        : "";
    const isBusy = isAccepting || isDeclining;

    return (
      <div className="px-4 pb-8 space-y-3">
        <form action={acceptFormAction}>
          <input type="hidden" name="transferId" value={incomingTransfer.id} />
          <button
            type="submit"
            disabled={isBusy}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-extrabold text-sm tracking-wide transition-all duration-150 active:scale-[0.98] bg-(--color-gold) text-(--color-bg) shadow-(--shadow-glow) disabled:opacity-50"
          >
            {isAccepting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            {translate("tickets.transfer.accept")}
          </button>
        </form>

        <form action={declineFormAction}>
          <input type="hidden" name="transferId" value={incomingTransfer.id} />
          <button
            type="submit"
            disabled={isBusy}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-extrabold text-sm tracking-wide transition-all duration-150 active:scale-[0.98] border border-(--color-border) text-(--color-text-secondary) bg-transparent disabled:opacity-50"
          >
            {isDeclining ? <Loader2 size={18} className="animate-spin" /> : <X size={18} />}
            {translate("tickets.transfer.decline")}
          </button>
        </form>

        {error && !isSettled(acceptState) && !isSettled(declineState) && (
          <p className="text-center text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }

  const canCancel = ["success", "confirmed", "pending"].includes(ticket.status);
  const isTransferPending = transfer?.status === "pending";
  // No payload = nothing scannable (dead entitlement, or the owner view of a
  // ticket whose QR is revoked) — downloading it would hand out a dead code.
  const hasScannableQr = "qrCode" in ticket && Boolean(ticket.qrCode);

  return (
    <div className="px-4 pb-8 space-y-3">
      {!isTransferPending && hasScannableQr && (
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-extrabold text-sm tracking-wide transition-all duration-150 active:scale-[0.98] bg-(--color-gold) text-(--color-bg) shadow-(--shadow-glow)"
        >
          <Download size={18} />
          {translate("tickets.detail.download_ticket")}
        </button>
      )}

      {!isTransferPending && canCancel && (
        <>
          <button
            type="button"
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
