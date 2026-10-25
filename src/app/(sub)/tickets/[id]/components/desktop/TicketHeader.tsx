"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useLocale } from "@/contexts/LocaleContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { isPastStatus, PAST_STATUS_META } from "@/features/tickets/status";

/**
 * Desktop ticket detail header:
 * Offers clean back navigation to the tickets list, movie title,
 * cinema wall-clock schedule, and technology/rating badges.
 */
export default function TicketHeader() {
  const { ticket } = useTicketDetail();
  const { translate } = useLocale();

  const where = [ticket.cinema, ticket.room].filter(Boolean).join(" · ");
  const when = [where, ticket.datetime].filter(Boolean).join(" · ");

  return (
    <header className="min-w-0 border-b border-(--color-border)/50 pb-5">
      <Link
        href="/tickets"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-(--color-text-muted) transition-colors hover:text-(--color-gold) mb-3"
      >
        <ArrowLeft size={14} />
        <span>{translate("nav.tickets")}</span>
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-[0.18em] text-(--color-gold) uppercase">
            {translate("tickets.detail_title")}
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white">{ticket.movie}</h1>
          <p className="mt-1.5 text-sm text-(--color-text-muted)">{when}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="gold" size="xs" className="uppercase font-bold">
            {ticket.format}
          </Badge>
          {ticket.ageRating && (
            <Badge variant="neutral" size="xs" className="uppercase font-bold">
              {ticket.ageRating}
            </Badge>
          )}
          {isPastStatus(ticket.status) && (
            <Badge variant="neutral" size="xs" className="uppercase font-bold">
              {translate(PAST_STATUS_META[ticket.status].labelKey)}
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
}
