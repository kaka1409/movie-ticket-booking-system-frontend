"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import type { PastTicket } from "@/features/tickets/types";

export default function PastCard({ ticket }: { ticket: PastTicket }) {
  const { translate } = useLocale();
  const expired = ticket.status === "expired";

  return (
    <article
      className={`flex gap-3 p-4 rounded-2xl bg-(--color-surface) border border-(--color-border) shadow-(--shadow-card) ${
        expired ? "opacity-70" : "opacity-100"
      }`}
    >
      {/* Poster */}
      <div className="shrink-0 w-20 rounded-xl overflow-hidden aspect-2/3 relative">
        <Image
          src={ticket.poster}
          alt={ticket.movie}
          fill
          sizes="80px"
          className="object-cover"
        />
        <span className="absolute bottom-0 left-0 right-0 flex h-full items-end p-2 text-[8px] font-black uppercase tracking-tight text-white/15">
          {ticket.movie}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex items-start justify-between">
          <h3
            className={`font-bold text-base leading-tight ${
              expired
                ? "text-(--color-text-muted)"
                : "text-(--color-text-primary)"
            }`}
          >
            {ticket.movie}
          </h3>
          <span
            className={`ml-2 shrink-0 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-(--color-surface-2) border border-(--color-border) ${
              expired
                ? "text-(--color-text-muted)"
                : "text-(--color-text-secondary)"
            }`}
          >
            {ticket.status === "used" ? translate("tickets.used") : translate("tickets.expired")}
          </span>
        </div>

        <div className="">
          <p
          className={`text-sm mb-0.5 font-light ${
            expired
                ? "text-(--color-text-muted)"
                : "text-(--color-gold-light)"
            }`
          }>
            {ticket.format}
          </p>
            
          <p className={`text-xs text-(--color-text-secondary) ${
            expired
              ? "text-(--color-text-muted)"
              : ""
            }`
          }>
            {ticket.datetime}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-light text-(--color-text-secondary)">
            {ticket.ticketCount} {ticket.ticketCount > 1 ? translate("common.tickets") : translate("common.ticket")}
          </p>
          <Link
            href={`/tickets/${ticket.id}`}
            className="text-sm font-bold underline underline-offset-2 transition-colors text-(--color-gold)"
          >
            {translate("tickets.view_details")}
          </Link>
        </div>
      </div>
    </article>
  );
}
