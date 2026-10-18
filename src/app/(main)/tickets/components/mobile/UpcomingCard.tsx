"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import TearLine from "@/components/ui/TearLine";
import type { UpcomingTicket } from "@/features/tickets/types";
import TicketCountdown from "./TicketCountdown";

export default function UpcomingCard({ ticket }: { ticket: UpcomingTicket }) {
  const { translate } = useLocale();

  return (
    <article className="rounded-2xl overflow-hidden bg-(--color-surface) shadow-(--shadow-card) border border-(--color-gold)/25">
      {/* Top section: poster + info */}
      <div className="flex gap-3 p-4">
        {/* Poster — the status chip is the remaining time, or the transfer state
            while the ticket is in flight (a countdown would be misleading). */}
        <div className="relative shrink-0 w-24 rounded-xl overflow-hidden aspect-[2/3]">
          <Image
            src={ticket.poster}
            alt={ticket.movie}
            fill
            sizes="96px"
            className="object-cover"
          />
          {ticket.isTransferring ? (
            <span className="absolute inset-x-0 top-0 bg-black/70 px-1 py-1 text-center text-[9px] font-black uppercase leading-tight tracking-tight text-(--color-gold) backdrop-blur-[2px]">
              {translate("tickets.transfer.pending_badge")}
            </span>
          ) : (
            <TicketCountdown startsAtMs={ticket.startsAtMs} endsAtMs={ticket.endsAtMs} />
          )}
          <span className="absolute bottom-2 left-2 text-[9px] font-black uppercase tracking-tight text-white/15">
            {ticket.movie}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="text-white font-bold text-lg leading-tight mb-2">{ticket.movie}</h3>

          <div className="space-y-1.5 mb-3">
            <p className="flex items-center gap-2 text-sm ">
              <CalendarDays size={13} className="shrink-0 text-(--color-gold)" />
              {ticket.datetime}
            </p>
            <p className="flex items-center gap-2 text-sm ">
              <MapPin size={13} className="shrink-0 text-(--color-gold)" />
              {ticket.cinema}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-(--color-surface-2) text-(--color-text-secondary) border border-(--color-border)">
              {ticket.format}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-(--color-surface-2) text-(--color-text-secondary) border border-(--color-border)">
              {translate("tickets.seats_label")}
              {ticket.seatItems.map((seat) => seat.label).join(", ")}
            </span>
            {ticket.isTransferring && (
              // The poster ribbon already names the state — this pill keeps the
              // one thing it cannot fit: who the ticket is waiting on.
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-(--color-gold)/10 text-(--color-gold) border border-(--color-gold)/40">
                {ticket.transferRecipientName
                  ? `→ ${ticket.transferRecipientName}`
                  : translate("tickets.transfer.pending_badge")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tear line */}
      <TearLine className="px-4 my-0" />

      {/* Bottom section: amount + CTA */}
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-0.5 text-(--color-gold-light)/70">
            {translate("tickets.booking_id")}
          </p>
          <p className="text-xs text-(--color-text-muted)">{ticket.id}</p>
        </div>

        <Link
          href={`/tickets/${ticket.id}`}
          className="
          flex items-center justify-center px-4 py-3 rounded-xl font-bold text-sm w-full
          transition-all duration-150 active:scale-[0.97] border border-(--color-gold) text-(--color-gold) bg-transparent"
        >
          {translate("tickets.view_details")}
        </Link>
      </div>
    </article>
  );
}
