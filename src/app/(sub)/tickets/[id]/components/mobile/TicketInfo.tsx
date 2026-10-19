"use client";

import Image from "next/image";
import { MonitorPlay, CalendarDays, Clock, Loader2, XCircle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import DetailRow from "@/app/(sub)/booking/components/mobile/DetailRow";
import PriceBreakdown from "@/app/(sub)/booking/components/mobile/PriceBreakdown";
import QRCode from "./QRCode";
import TearLine from "@/components/ui/TearLine";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { isPastStatus, PAST_STATUS_META } from "@/features/tickets/status";
import { useCancelTransfer } from "@/features/tickets/hooks/useCancelTransfer";

export default function TicketInfo() {
  const { ticket, transfer, incomingTransfer } = useTicketDetail();
  const { translate } = useLocale();
  const { cancelFormAction, isCancelPending } = useCancelTransfer();

  const seatItems = ticket?.seatItems ?? [];
  const isTransferPending = transfer?.status === "pending";

  return (
    <main className="flex-1 overflow-y-auto pb-8 p-4">
      {/* Hero ticket card */}
      <div className="rounded-3xl overflow-visible bg-(--color-surface) border border-(--color-border) shadow-(--shadow-card)">
        {/* Poster */}
        <div className="relative w-full h-80 bg-(--color-surface) rounded-t-3xl overflow-hidden">
          <Image
            src={ticket.poster}
            alt={ticket.movie}
            fill
            sizes="100%"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/80 text-(--color-text-secondary) border border-(--color-border)">
                {ticket.format}
              </span>
              {ticket?.ageRating && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/80 text-(--color-text-secondary) border border-(--color-border)">
                  {ticket.ageRating}
                </span>
              )}
            </div>
            <h2 className="text-white font-extrabold text-2xl leading-tight">{ticket.movie}</h2>
          </div>
        </div>

        {/* Tear line */}
        <TearLine className="px-0 my-0" lineClassName="mx-3" />

        {/* Booking details */}
        <div className="px-4 py-4 space-y-4">
          <div className="flex justify-center">
            <DetailRow
              icon={MonitorPlay}
              label={translate("booking.common.theater")}
              value={
                <>
                  {ticket?.cinema ?? "—"}
                  {ticket?.location && <>, {ticket.location}</>}
                  {ticket?.room && <>, {ticket.room}</>}
                </>
              }
            />
            <DetailRow
              icon={CalendarDays}
              label={translate("booking.common.date_time")}
              value={ticket.datetime}
              valueClass="text-white font-bold text-sm text-right"
              labelClass="justify-end "
            />
          </div>

          {/* Price breakdown: seats → snacks → payment + total */}
          <PriceBreakdown
            seats={seatItems}
            snacks={ticket?.foodDrink ?? []}
            paymentMethod={ticket?.paymentMethod}
            total={ticket?.totalPrice}
          />
        </div>

        {/* Tear line */}
        <TearLine className="px-0 my-0" lineClassName="mx-3" />

        {isTransferPending && transfer ? (
          /* Owner: transfer pending panel — replaces QR while waiting */
          <div className="px-4 pb-5 pt-4 flex flex-col items-center gap-3 text-center">
            <span className="px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 bg-(--color-gold)/10 border border-(--color-gold)/40">
              <Clock size={13} className="text-(--color-gold)" />
              <span className="text-[11px] font-bold uppercase tracking-wide text-(--color-gold)">
                {translate("tickets.transfer.pending_badge")}
              </span>
            </span>
            {transfer.transferredSeats.length > 0 && (
              <p className="font-extrabold text-lg text-(--color-text-primary)">
                {transfer.transferredSeats.join(" · ")}
              </p>
            )}
            <p className="text-sm text-(--color-text-muted)">
              {translate("tickets.transfer.pending_waiting").replace(
                "{name}",
                transfer.recipient.name,
              )}
            </p>
            <form action={cancelFormAction} className="mt-1">
              <input type="hidden" name="ticketId" value={ticket.id} />
              <button
                type="submit"
                disabled={isCancelPending}
                className="px-5 py-2.5 rounded-xl font-extrabold text-xs tracking-widest uppercase transition-all duration-150 active:scale-[0.98] border border-red-500/60 text-red-400 bg-transparent disabled:opacity-40"
              >
                {isCancelPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  translate("tickets.transfer.cancel_transfer")
                )}
              </button>
            </form>
          </div>
        ) : incomingTransfer ? (
          /* Recipient: offer panel — no QR until the transfer is accepted. */
          <div className="px-4 pb-5 pt-4 flex flex-col items-center gap-3 text-center">
            <span className="px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 bg-(--color-gold)/10 border border-(--color-gold)/40">
              <Clock size={13} className="text-(--color-gold)" />
              <span className="text-[11px] font-bold uppercase tracking-wide text-(--color-gold)">
                {translate("tickets.transfer.incoming_badge")}
              </span>
            </span>
            {incomingTransfer.transferredSeats.length > 0 && (
              <p className="font-extrabold text-lg text-(--color-text-primary)">
                {incomingTransfer.transferredSeats.join(" · ")}
              </p>
            )}
            <p className="text-sm text-(--color-text-muted)">
              {translate("tickets.transfer.incoming_from").replace(
                "{name}",
                incomingTransfer.sender.name,
              )}
            </p>
            <p className="text-xs text-(--color-text-muted)">
              {translate("tickets.transfer.incoming_hint")}
            </p>
          </div>
        ) : (
          /* QR Code — only when the backend issued a payload (usable, owner
             view). A dead entitlement must not render a scannable-looking QR. */
          <div className="px-4 pb-5 pt-4 flex flex-col items-center gap-3">
            {"qrCode" in ticket && ticket.qrCode ? (
              <QRCode value={ticket.qrCode} ticketId={ticket.id} />
            ) : (
              <div className="w-full flex flex-col items-center gap-2 px-4 py-6 rounded-2xl border border-(--color-border) bg-(--color-surface-2)">
                <XCircle size={26} className="text-(--color-text-muted)" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-(--color-text-muted)">
                  {isPastStatus(ticket.status)
                    ? translate(PAST_STATUS_META[ticket.status].labelKey)
                    : translate("tickets.detail.qr_invalid")}
                </span>
                <p className="text-xs text-center text-(--color-text-muted)">
                  {translate("tickets.detail.qr_invalid_hint")}
                </p>
              </div>
            )}
            <p className="text-xs text-white/60 tracking-wide">
              {translate("tickets.detail.booking_id")}
              <span className="font-bold text-white">#{ticket.id}</span>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
