"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";

/** Which room's map is open below, and the reminder of how many seats are needed. */
export default function SeatInfo() {
  const { translate } = useLocale();
  const { ticket } = useTicketDetail();

  return (
    <section className="px-4 py-3 rounded-2xl bg-(--color-surface) border border-(--color-border)">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-sm text-(--color-text-primary)">{ticket.movie}</p>
          <p className="text-xs text-(--color-text-muted) mt-0.5">
            {ticket.cinema} · {ticket.room}
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-lg text-2xs font-bold tracking-wide uppercase bg-(--color-gold)/10 text-(--color-gold)">
          {ticket.format}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t border-(--color-border)">
        <p className="text-xs text-(--color-text-muted)">
          {translate("tickets.modify.seats.select_prompt")}
        </p>
      </div>
    </section>
  );
}
