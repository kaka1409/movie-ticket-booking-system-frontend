"use client";

import Image from "next/image";
import { CalendarDays, MonitorPlay, XCircle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import DetailRow from "@/components/shared/DetailRow";
import PriceBreakdown from "@/components/shared/PriceBreakdown";
import QRCode from "@/components/shared/tickets/QRCode";
import TearLine from "@/components/ui/TearLine";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { isPastStatus, PAST_STATUS_META } from "@/features/tickets/constants";

/**
 * Desktop ticket capture component that mirrors mobile TicketInfo design
 * for image download. Includes movie poster, details, and QR code.
 */
export default function TicketCapture() {
  const { ticket } = useTicketDetail();
  const { translate } = useLocale();

  const seatItems = ticket?.seatItems ?? [];

  return (
    <div className="rounded-3xl overflow-hidden bg-(--color-surface) border border-(--color-border) shadow-xl">
      <div className="relative w-full h-80 bg-(--color-surface) overflow-hidden">
        <Image
          src={ticket.poster}
          alt={ticket.movie}
          fill
          sizes="100%"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-1 rounded-full text-2xs font-bold bg-black/80 text-(--color-text-secondary) border border-(--color-border)">
              {ticket.format}
            </span>
            {ticket?.ageRating && (
              <span className="px-2.5 py-1 rounded-full text-2xs font-bold bg-black/80 text-(--color-text-secondary) border border-(--color-border)">
                {ticket.ageRating}
              </span>
            )}
          </div>
          <h2 className="text-white font-extrabold text-2xl leading-tight">{ticket.movie}</h2>
        </div>
      </div>

      <TearLine className="px-0 my-0" lineClassName="mx-6" />

      <div className="px-6 py-4 space-y-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
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
            valueClass="text-white font-bold text-sm text-right whitespace-nowrap"
            labelClass="justify-end"
          />
        </div>

        <PriceBreakdown
          seats={seatItems}
          snacks={ticket?.foodDrink ?? []}
          paymentMethod={ticket?.paymentMethod}
          total={ticket?.totalPrice}
        />
      </div>

      <TearLine className="px-0 my-0" lineClassName="mx-6" />

      <div className="px-6 pb-6 pt-4 flex flex-col items-center gap-3">
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
    </div>
  );
}
