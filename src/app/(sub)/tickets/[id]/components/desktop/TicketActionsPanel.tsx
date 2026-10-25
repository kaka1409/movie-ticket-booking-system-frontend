"use client";

import { ArrowUpRight, Check, CreditCard, Download, Pencil, X, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { useLocale } from "@/contexts/LocaleContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { useTransferDecisions } from "@/features/tickets/hooks/useTransferDecisions";

const PANEL_CLASS =
  "space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-lg";

/**
 * Desktop detail rail — the verbs this ticket still allows. A recipient decides
 * the offer (accept parks it for the transfer checkout); the owner gets what the
 * ticket's own state permits: an open offer clears every action, and only a
 * scannable payload offers the download.
 *
 * Both dispatchers sit on real `<form action>`s (see `useTransferDecisions`).
 */
export default function TicketActionsPanel() {
  const { ticket, viewerRole, transfer, incomingTransfer } = useTicketDetail();
  const { translate } = useLocale();
  const { acceptFormAction, declineFormAction, isAccepting, isDeclining, isBusy, error } =
    useTransferDecisions();

  if (viewerRole === "recipient" && incomingTransfer) {
    return (
      <section className={PANEL_CLASS}>
        {incomingTransfer.status === "awaiting_payment" ? (
          <>
            <Button
              href={`/tickets/${ticket.id}/transfer/payment`}
              icon={CreditCard}
              iconPosition="left"
            >
              {translate("tickets.transfer.incoming_awaiting_cta")}
            </Button>
            <p className="text-center text-xs text-(--color-text-muted)">
              {translate("tickets.transfer.incoming_awaiting_hint")}
            </p>
          </>
        ) : (
          <form action={acceptFormAction}>
            <input type="hidden" name="transferId" value={incomingTransfer.id} />
            <Button
              type="submit"
              disabled={isBusy}
              loading={isAccepting}
              icon={Check}
              iconPosition="left"
            >
              {translate("tickets.transfer.accept")}
            </Button>
          </form>
        )}

        <form action={declineFormAction}>
          <input type="hidden" name="transferId" value={incomingTransfer.id} />
          <Button
            type="submit"
            variant="loadMore"
            disabled={isBusy}
            loading={isDeclining}
            icon={X}
            iconPosition="left"
          >
            {translate("tickets.transfer.decline")}
          </Button>
        </form>

        {error && (
          <p role="alert" className="text-center text-xs text-red-400">
            {error}
          </p>
        )}
      </section>
    );
  }

  // An open offer parks the ticket: it can be neither modified, re-sent nor
  // cancelled until the deal closes.
  const hasOpenTransfer = Boolean(transfer);
  const canCancel = ["success", "confirmed", "pending"].includes(ticket.status);
  const hasScannableQr = "qrCode" in ticket && Boolean(ticket.qrCode);

  const handleDownload = () => {
    window.print();
  };

  return (
    <section className={PANEL_CLASS}>
      {!hasOpenTransfer && hasScannableQr && (
        <Button type="button" icon={Download} iconPosition="left" onClick={handleDownload}>
          {translate("tickets.detail.download_ticket")}
        </Button>
      )}

      {!hasOpenTransfer && canCancel && (
        <div className="space-y-3 pt-1">
          <Button
            variant="loadMore"
            href={`/tickets/${ticket.id}/modify`}
            icon={Pencil}
            iconPosition="left"
          >
            {translate("tickets.detail.edit_ticket")}
          </Button>

          <Button
            variant="loadMore"
            href={`/tickets/${ticket.id}/transfer`}
            icon={ArrowUpRight}
            iconPosition="left"
          >
            {translate("tickets.detail.transfer_ticket")}
          </Button>

          <div className="border-t border-(--color-border)/50 pt-2">
            <Button
              variant="danger"
              href={`/tickets/${ticket.id}/cancel`}
              icon={XCircle}
              iconPosition="left"
            >
              {translate("tickets.detail.cancel_refund")}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
