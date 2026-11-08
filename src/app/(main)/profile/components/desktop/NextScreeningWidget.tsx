"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Film, ArrowRight, Ticket, Popcorn } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Badge from "@/components/ui/Badge";
import TicketCountdown from "@/components/shared/tickets/TicketCountdown";
import type { UpcomingTicket } from "@/features/tickets/types";

/**
 * Desktop widget displaying the member's earliest upcoming screening,
 * or an invitation to explore movies when no ticket is booked.
 */
export default function NextScreeningWidget({ nextTicket }: { nextTicket: UpcomingTicket | null }) {
  const { translate } = useLocale();

  if (!nextTicket) {
    return (
      <section>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--color-gold)/10 text-(--color-gold)">
              <Film size={24} />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                {translate("profile.no_next_screening")}
              </h3>
              <p className="mt-0.5 text-xs text-(--color-text-muted)">
                {translate("profile.no_next_screening_desc")}
              </p>
            </div>
          </div>

          <Link
            href="/movies"
            className="flex shrink-0 items-center gap-2 rounded-xl border border-(--color-gold) bg-(--color-gold) px-4 py-2.5 text-xs font-bold text-black transition hover:brightness-110 active:scale-95"
          >
            <span>{translate("profile.book_movie_cta")}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    );
  }

  const snackCount = (nextTicket.foodDrink ?? []).reduce((total, item) => total + item.qty, 0);

  return (
    <section>
      <div className="flex items-center justify-between border-b border-(--color-border)/50 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-(--color-gold)/15 text-(--color-gold)">
            <Ticket size={14} />
          </span>
          <p className="text-xs font-bold tracking-wider text-(--color-gold) uppercase">
            {translate("profile.next_screening")}
          </p>
        </div>

        <span className="font-mono text-xs text-(--color-text-muted)">#{nextTicket.id}</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative aspect-[2/3] w-24 shrink-0 overflow-hidden rounded-xl bg-(--color-surface-2) shadow-md">
          <Image
            src={nextTicket.poster}
            alt={nextTicket.movie}
            fill
            sizes="96px"
            className="object-cover"
          />
          <TicketCountdown
            startsAtMs={nextTicket.startsAtMs}
            endsAtMs={nextTicket.endsAtMs}
            tone="gold"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Badge variant="gold" size="xs" className="uppercase font-extrabold">
                {nextTicket.format}
              </Badge>
              {nextTicket.ageRating && (
                <Badge variant="neutral" size="xs" className="uppercase font-bold">
                  {nextTicket.ageRating}
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-black tracking-tight text-white line-clamp-1">
              {nextTicket.movie}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-(--color-text-secondary)">
              <span className="flex items-center gap-1.5 font-medium text-white">
                <CalendarDays size={13} className="text-(--color-gold)" />
                {nextTicket.datetime}
              </span>
              <span className="flex items-center gap-1.5 truncate font-medium text-white">
                <MapPin size={13} className="text-(--color-gold)" />
                {nextTicket.cinema} {nextTicket.room ? `· ${nextTicket.room}` : ""}
              </span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 pt-2 border-t border-(--color-border)/40 text-xs">
            <span className="rounded-lg border border-(--color-border) bg-(--color-surface-2) px-2.5 py-1 font-semibold text-(--color-text-secondary)">
              {translate("tickets.seats_label")}
              <span className="font-bold text-white">
                {nextTicket.seatItems.map((seatItem) => seatItem.label).join(", ")}
              </span>
            </span>

            {snackCount > 0 && (
              <span className="flex items-center gap-1 rounded-lg border border-(--color-border) bg-(--color-surface-2) px-2 py-1 font-semibold text-(--color-gold)">
                <Popcorn size={12} />
                <span>
                  {snackCount} {translate("profile.combo_label")}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="sm:pl-4 sm:border-l sm:border-(--color-border)/40 shrink-0">
          <Link
            href={`/tickets/${nextTicket.id}`}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-(--color-gold) bg-(--color-gold)/10 px-4 py-2.5 text-xs font-bold text-(--color-gold) transition hover:bg-(--color-gold) hover:text-black active:scale-95"
          >
            <span>{translate("profile.view_ticket")}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
