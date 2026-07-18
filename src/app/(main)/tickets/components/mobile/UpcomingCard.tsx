"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, RefreshCw } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { UpcomingTicket } from "@/features/tickets/types";

export default function UpcomingCard({ ticket }: { ticket: UpcomingTicket }) {
  const { translate } = useLocale();
  const failed = ticket.status === "failed";

  return (
    <article
      className={`rounded-2xl overflow-hidden bg-(--color-surface) shadow-(--shadow-card) ${
        failed ? "border border-red-500/30" : "border border-(--color-gold)/25"
      }`}
    >
      {/* Top section: poster + info */}
      <div className="flex gap-3 p-4">
        {/* Poster */}
        <div className="relative shrink-0 w-24 rounded-xl overflow-hidden aspect-[2/3]">
          <Image
            src={ticket.poster}
            alt={ticket.movie}
            fill
            sizes="96px"
            className="object-cover"
          />
          <span className="absolute bottom-2 left-2 text-[9px] font-black uppercase tracking-tight text-white/15">
            {ticket.movie}
          </span>
          <span
            className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-black ${
              failed
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {failed ? translate("tickets.failed") : translate("tickets.success")}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="text-white font-bold text-lg leading-tight mb-2">
            {ticket.movie}
          </h3>

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
              {translate("tickets.seats_label")}{ticket.seats}
            </span>
          </div>
        </div>
      </div>

      {/* Tear line */}
      <div className="relative flex items-center px-4 my-0">
        <div className="absolute -left-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
        <div className="flex-1 border-t-2 border-dashed border-(--color-border)" />
        <div className="absolute -right-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
      </div>

      {/* Bottom section: amount + CTA */}
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <p
            className={`text-xs font-bold tracking-widest uppercase mb-0.5 text-(--color-gold-light)/70`}
          >
            {failed ? translate("tickets.failed") : translate("tickets.booking_id")}
          </p>
          <p
            className={`font-extrabold text-xl text-(--color-text-primary)`}
          >
            {failed ? ticket.totalPrice : ticket.id}
          </p>
        </div>

        {failed ? (
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-150 active:scale-[0.97] bg-(--color-gold) text-[#0F0F0F] shadow-(--shadow-glow)">
            <RefreshCw size={15} />
            {translate("tickets.pay_now")}
          </button>
        ) : (
          <Link
            href={`/tickets/${ticket.id}`}
            className="flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm transition-all duration-150 active:scale-[0.97] border border-(--color-gold) text-(--color-gold) bg-transparent"
          >
            {translate("tickets.view_details")}
          </Link>
        )}
      </div>
    </article>
  );
}
