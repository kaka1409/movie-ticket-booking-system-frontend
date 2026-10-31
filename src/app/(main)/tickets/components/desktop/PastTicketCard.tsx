"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Ticket, ArrowRight, UserCheck } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Badge from "@/components/ui/Badge";
import { PAST_STATUS_META } from "@/features/tickets/constants";
import type { PastTicket } from "@/features/tickets/types";

/**
 * Desktop past-ticket card:
 * Displays completed, expired, or transferred movie visits with clear status provenance.
 */
export default function PastTicketCard({ ticket }: { ticket: PastTicket }) {
  const { translate } = useLocale();
  const { transferProvenance } = ticket;
  const badgeKey = transferProvenance
    ? transferProvenance.direction === "sent"
      ? "tickets.transfer.sent_badge"
      : "tickets.transfer.received_badge"
    : PAST_STATUS_META[ticket.status].labelKey;
  const isSent = transferProvenance?.direction === "sent";

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) transition-colors hover:border-(--color-border)/80 shadow-(--shadow-card)">
      <div className="flex gap-4 p-4">
        {/* Muted Movie Poster */}
        <div className="relative aspect-[2/3] w-24 shrink-0 overflow-hidden rounded-xl bg-(--color-surface-2) opacity-80 group-hover:opacity-100 transition-opacity">
          <Image
            src={ticket.poster}
            alt={ticket.movie}
            fill
            sizes="96px"
            className="object-cover grayscale-25"
          />
          <span className="absolute inset-0 flex items-end p-2 text-[8px] font-black tracking-tight text-white/20 uppercase">
            {ticket.movie}
          </span>
        </div>

        {/* Card Body */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <h3 className="text-base font-bold text-white line-clamp-1">{ticket.movie}</h3>
              <Badge
                variant="neutral"
                size="xs"
                className="shrink-0 uppercase font-bold text-(--color-text-secondary)"
              >
                {translate(badgeKey)}
              </Badge>
            </div>

            <div className="space-y-1 text-xs text-(--color-text-muted)">
              <p className="flex items-center gap-1.5 font-medium text-(--color-gold-light)">
                {ticket.format}
              </p>
              <p className="flex items-center gap-1.5">
                <CalendarDays size={13} className="shrink-0 text-(--color-text-muted)" />
                <span>{ticket.datetime}</span>
              </p>
              {isSent && (
                <p className="flex items-center gap-1.5">
                  <UserCheck size={13} className="shrink-0 text-(--color-gold)" />
                  <span className="truncate">
                    {translate("tickets.transfer.recipient_label")}:{" "}
                    {transferProvenance?.counterpartyName}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-(--color-border)/40 pt-2 text-xs">
            <span className="flex items-center gap-1.5 text-(--color-text-secondary)">
              <Ticket size={13} className="text-(--color-gold)/70" />
              <span>
                {ticket.ticketCount}{" "}
                {ticket.ticketCount > 1 ? translate("common.tickets") : translate("common.ticket")}
              </span>
            </span>

            <Link
              href={`/tickets/${ticket.id}`}
              className="flex items-center gap-1 font-bold text-(--color-gold) hover:underline underline-offset-2"
            >
              <span>{translate("tickets.view_details")}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
