"use client";

import { ArrowUpRight, Check, CreditCard, Download, Pencil, X, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import ActionRow from "@/components/ui/ActionRow";
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
 * Actions use ActionRow style with icon container + label + description.
 */
interface TicketActionsPanelProps {
  downloadTicket: () => void;
  isDownloading: boolean;
}

export default function TicketActionsPanel({ downloadTicket, isDownloading }: TicketActionsPanelProps) {
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
              size="lg"
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
              size="lg"
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
            size="lg"
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

  // No verb left (transferred away, used, expired, refunded) → no panel at all,
  // rather than an empty card in the rail.
  if (!hasOpenTransfer && !canCancel && !hasScannableQr) {
    return null;
  }

  return (
    <section className={PANEL_CLASS}>
      <h3 className="text-sm font-bold text-white mb-3">
        {translate("tickets.detail.actions_title")}
      </h3>

      {!hasOpenTransfer && hasScannableQr && (
        <ActionRow
          variant="desktop"
          icon={Download}
          label={translate("tickets.detail.download_ticket")}
          description={isDownloading ? "Downloading..." : translate("tickets.detail.download_ticket_desc")}
          onClick={downloadTicket}
        />
      )}

      {!hasOpenTransfer && canCancel && (
        <div className="space-y-2">
          <ActionRow
            variant="desktop"
            icon={Pencil}
            label={translate("tickets.detail.edit_ticket")}
            description={translate("tickets.detail.edit_ticket_desc")}
            href={`/tickets/${ticket.id}/modify`}
          />

          <ActionRow
            variant="desktop"
            icon={ArrowUpRight}
            label={translate("tickets.detail.transfer_ticket")}
            description={translate("tickets.detail.transfer_ticket_desc")}
            href={`/tickets/${ticket.id}/transfer`}
          />

          <div className="border-t border-(--color-border)/50 pt-2">
            <ActionRow
              variant="desktop"
              icon={XCircle}
              label={translate("tickets.detail.cancel_refund")}
              description={translate("tickets.detail.cancel_refund_desc")}
              danger
              href={`/tickets/${ticket.id}/cancel`}
            />
          </div>
        </div>
      )}
    </section>
  );
}
