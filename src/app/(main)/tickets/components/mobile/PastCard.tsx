"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import type { PastTicket } from "@/features/tickets/types";
import { PAST_STATUS_META } from "@/features/tickets/status";
import Badge from "@/components/ui/Badge";

export default function PastCard({ ticket }: { ticket: PastTicket }) {
  const { translate } = useLocale();
  const { transfer } = ticket;
  // Provenance replaces the terminal status: for a ticket I gave away the
  // entitlement status belongs to whoever holds it now, not to me.
  const badgeKey = transfer
    ? transfer.direction === "sent"
      ? "tickets.transfer.sent_badge"
      : "tickets.transfer.received_badge"
    : PAST_STATUS_META[ticket.status].labelKey;
  const isSent = transfer?.direction === "sent";

  return (
    <article className="flex gap-3 p-4 rounded-2xl bg-(--color-surface) border border-(--color-border) shadow-(--shadow-card)">
      {/* Poster */}
      <div className="shrink-0 w-20 rounded-xl overflow-hidden aspect-2/3 relative">
        <Image src={ticket.poster} alt={ticket.movie} fill sizes="80px" className="object-cover" />
        <span className="absolute bottom-0 left-0 right-0 flex h-full items-end p-2 text-[8px] font-black uppercase tracking-tight text-white/15">
          {ticket.movie}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-base leading-tight text-(--color-text-primary)">
            {ticket.movie}
          </h3>
          <Badge
            variant="neutral"
            size="xs"
            className="ml-2 uppercase text-(--color-text-secondary)"
          >
            {translate(badgeKey)}
          </Badge>
        </div>

        <div className="">
          <p className="text-sm mb-0.5 font-light text-(--color-gold-light)">{ticket.format}</p>
          <p className="text-xs text-(--color-text-secondary)">{ticket.datetime}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-light text-(--color-text-secondary)">
            {ticket.ticketCount}{" "}
            {ticket.ticketCount > 1 ? translate("common.tickets") : translate("common.ticket")}
          </p>
          {isSent ? (
            // Ownership moved on accept, so GET /tickets/:id answers 404 for the
            // sender — name the recipient instead of rendering a dead link.
            <span className="text-sm font-light text-(--color-text-secondary)">
              {translate("tickets.transfer.recipient_label")}: {transfer?.counterpartyName}
            </span>
          ) : (
            <Link
              href={`/tickets/${ticket.id}`}
              className="text-sm font-bold underline underline-offset-2 transition-colors text-(--color-gold)"
            >
              {translate("tickets.view_details")}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
