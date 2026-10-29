"use client";

import { Clock, Loader2, Printer, XCircle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";
import MicroLabel from "@/components/ui/MicroLabel";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { useCancelTransfer } from "@/features/tickets/hooks/useCancelTransfer";
import { isPastStatus, PAST_STATUS_META } from "@/features/tickets/status";
import { formatDeadlineTime } from "@/features/tickets/utils";
import QRCode from "../mobile/QRCode";

const PANEL_CLASS =
  "space-y-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-lg";

/** The amount an offer froze, with whatever the viewer can still do about it. */
function TransferAmountBox({
  amount,
  hint,
}: {
  amount: number;
  /** Rendered under the amount — the frozen-price explanation or the deadline. */
  hint: string;
}) {
  const { translate, locale } = useLocale();

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface-2) px-4 py-3">
      <MicroLabel className="text-(--color-text-muted)">
        {translate("tickets.transfer.amount_label")}
      </MicroLabel>
      <p className="mt-1 text-lg font-extrabold text-(--color-gold)">{formatVND(amount, locale)}</p>
      <p className="mt-1 text-xs text-(--color-text-muted)">{hint}</p>
    </div>
  );
}

/**
 * Desktop detail rail — the ticket's credential. The owner of a usable ticket
 * gets the QR; either side of an open offer gets the state of that deal instead
 * (a parked ticket has no scannable code). A dead entitlement renders as dead:
 * the FE never fabricates a QR the check-in scanner would reject.
 */
export default function TicketQrPanel() {
  const { ticket, transfer, incomingTransfer } = useTicketDetail();
  const { translate, locale } = useLocale();
  const { cancelFormAction, isCancelPending, error: cancelError } = useCancelTransfer();

  if (transfer) {
    return (
      <section className={PANEL_CLASS}>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-(--color-gold)/40 bg-(--color-gold)/10 px-3 py-1.5">
          <Clock size={13} className="text-(--color-gold)" />
          <span className="text-[11px] font-bold tracking-wide text-(--color-gold) uppercase">
            {translate(
              transfer.status === "pending"
                ? "tickets.transfer.pending_badge"
                : "tickets.transfer.awaiting_badge",
            )}
          </span>
        </span>

        <p className="text-sm text-(--color-text-muted)">
          {translate(
            transfer.status === "pending"
              ? "tickets.transfer.pending_waiting"
              : "tickets.transfer.awaiting_payment",
          ).replace("{name}", transfer.recipient.name)}
        </p>

        <TransferAmountBox
          amount={transfer.amount}
          hint={
            transfer.status === "pending"
              ? translate("tickets.transfer.amount_hint")
              : translate("tickets.transfer.awaiting_deadline").replace(
                  "{time}",
                  formatDeadlineTime(transfer.paymentExpiresAt, locale),
                )
          }
        />

        {transfer.status === "awaiting_payment" && (
          <p className="text-xs text-(--color-text-muted)">
            {translate("tickets.transfer.awaiting_cancel_hint")}
          </p>
        )}

        <form action={cancelFormAction}>
          <input type="hidden" name="ticketId" value={ticket.id} />
          <button
            type="submit"
            disabled={isCancelPending}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/60 bg-transparent py-3.5 text-xs font-extrabold tracking-widest text-red-400 uppercase transition duration-150 hover:bg-red-500/10 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
          >
            {isCancelPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              translate("tickets.transfer.cancel_transfer")
            )}
          </button>
        </form>

        {cancelError && (
          <p role="alert" className="text-xs text-red-400">
            {cancelError}
          </p>
        )}
      </section>
    );
  }

  if (incomingTransfer) {
    return (
      <section className={PANEL_CLASS}>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-(--color-gold)/40 bg-(--color-gold)/10 px-3 py-1.5">
          <Clock size={13} className="text-(--color-gold)" />
          <span className="text-[11px] font-bold tracking-wide text-(--color-gold) uppercase">
            {translate(
              incomingTransfer.status === "pending"
                ? "tickets.transfer.incoming_badge"
                : "tickets.transfer.incoming_awaiting",
            )}
          </span>
        </span>

        <p className="text-sm text-(--color-text-muted)">
          {translate("tickets.transfer.incoming_from").replace(
            "{name}",
            incomingTransfer.sender.name,
          )}
        </p>

        <TransferAmountBox
          amount={incomingTransfer.amount}
          hint={
            incomingTransfer.status === "pending"
              ? translate("tickets.transfer.incoming_hint")
              : translate("tickets.transfer.awaiting_deadline").replace(
                  "{time}",
                  formatDeadlineTime(incomingTransfer.paymentExpiresAt, locale),
                )
          }
        />
      </section>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className={PANEL_CLASS}>
      <div className="flex items-center justify-between border-b border-(--color-border)/50 pb-3">
        <p className="text-xs font-bold tracking-wider text-(--color-gold) uppercase">
          {translate("tickets.gate_pass_title")}
        </p>
        <span className="font-mono text-xs text-(--color-text-muted)">#{ticket.id}</span>
      </div>

      {"qrCode" in ticket && ticket.qrCode ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl shadow-inner">
            <QRCode value={ticket.qrCode} ticketId={ticket.id} />
          </div>

          <p className="text-center text-xs leading-relaxed text-(--color-text-muted)">
            {translate("tickets.scan_instruction")}
          </p>

          <button
            type="button"
            onClick={handlePrint}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-(--color-gold)/40 bg-(--color-gold)/10 py-2.5 text-xs font-bold text-(--color-gold) transition hover:bg-(--color-gold)/20 active:scale-95"
          >
            <Printer size={15} />
            <span>{translate("tickets.print_ticket")}</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-(--color-border) bg-(--color-surface-2) px-4 py-8 text-center">
          <XCircle size={26} className="text-(--color-text-muted)" />
          <span className="text-[11px] font-bold tracking-[0.2em] text-(--color-text-muted) uppercase">
            {isPastStatus(ticket.status)
              ? translate(PAST_STATUS_META[ticket.status].labelKey)
              : translate("tickets.detail.qr_invalid")}
          </span>
          <p className="text-xs text-(--color-text-muted)">
            {translate("tickets.detail.qr_invalid_hint")}
          </p>
        </div>
      )}
    </section>
  );
}
