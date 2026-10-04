"use client";

import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { useLocale } from "@/contexts/LocaleContext";

export default function CurrentShowtime() {
  const { ticket } = useTicketDetail();
  const { translate } = useLocale();

  return (
    <section>
      <p className="text-[9px] font-black tracking-[0.16em] uppercase text-(--color-text-muted) mb-2">
        {translate("tickets.modify.showtime.current_showtime")}
      </p>
      <div className="flex items-center gap-3 p-3 rounded-xl bg-(--color-surface) border border-(--color-border)">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-(--color-text-primary) truncate">{ticket.cinema}</p>
          <p className="text-xs text-(--color-text-muted) mt-0.5">
            {ticket.room && `${ticket.room} · `}
            {ticket.datetime}
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase bg-(--color-gold)/10 text-(--color-gold)">
          {ticket.format}
        </span>
      </div>
    </section>
  );
}
