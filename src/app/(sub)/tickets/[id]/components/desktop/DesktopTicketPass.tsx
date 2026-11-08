"use client";

import Image from "next/image";
import { CalendarDays, MapPin, Armchair, Popcorn, Sparkles } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Badge from "@/components/ui/Badge";
import TearLine from "@/components/ui/TearLine";
import PriceBreakdown from "@/components/shared/PriceBreakdown";
import TicketCountdown from "@/components/shared/tickets/TicketCountdown";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import type { UpcomingTicket } from "@/features/tickets/types";
import { isPastStatus, PAST_STATUS_META } from "@/features/tickets/constants";

/**
 * High-end cinematic boarding pass for the desktop ticket detail view:
 * Features movie poster with live countdown, detailed venue & auditorium section,
 * itemized seat chips with category pricing, concessions with pick-up guidance,
 * and transparent billing summary.
 */
export default function DesktopTicketPass() {
  const { ticket } = useTicketDetail();
  const { translate } = useLocale();

  const isPast = isPastStatus(ticket.status);
  const total = ticket.totalPrice ?? 0;
  const foodDrinks = ticket.foodDrink ?? [];

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-xl">
        <div className="flex items-center justify-between border-b border-(--color-border)/60 bg-(--color-surface-2)/60 px-6 py-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-(--color-gold)/20 text-(--color-gold)">
              <Sparkles size={12} />
            </span>
            <span className="text-[11px] font-black tracking-widest text-(--color-gold) uppercase">
              {translate("tickets.ticket_pass")}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-(--color-text-muted)">
            <span>{translate("tickets.booking_id")}:</span>
            <span className="font-bold text-white">#{ticket.id}</span>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-6 sm:flex-row">
          <div className="relative aspect-[2/3] w-36 shrink-0 overflow-hidden rounded-xl bg-(--color-surface-2) shadow-lg">
            <Image
              src={ticket.poster}
              alt={ticket.movie}
              fill
              sizes="144px"
              priority
              className="object-cover"
            />
            {!isPast && (
              <TicketCountdown
                startsAtMs={(ticket as UpcomingTicket).startsAtMs}
                endsAtMs={(ticket as UpcomingTicket).endsAtMs}
              />
            )}
            <span className="absolute bottom-2 left-2 text-3xs font-black tracking-tight text-white/20 uppercase">
              {ticket.movie}
            </span>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="gold" size="xs" className="uppercase font-black">
                  {ticket.format}
                </Badge>
                {ticket.ageRating && (
                  <Badge variant="neutral" size="xs" className="uppercase font-bold">
                    {ticket.ageRating}
                  </Badge>
                )}
                {isPast && (
                  <Badge variant="neutral" size="xs" className="uppercase font-bold">
                    {translate(
                      PAST_STATUS_META[ticket.status as keyof typeof PAST_STATUS_META].labelKey,
                    )}
                  </Badge>
                )}
              </div>

              <h2 className="text-2xl font-black tracking-tight text-white">{ticket.movie}</h2>

              <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-(--color-text-secondary)">
                <div className="flex items-center gap-2.5 rounded-xl bg-(--color-surface-2)/60 p-3">
                  <CalendarDays size={18} className="shrink-0 text-(--color-gold)" />
                  <div>
                    <p className="text-2xs font-bold text-(--color-text-muted) uppercase tracking-wider">
                      {translate("home.quick_booking.date")}
                    </p>
                    <p className="font-bold text-white">{ticket.datetime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl bg-(--color-surface-2)/60 p-3">
                  <MapPin size={18} className="shrink-0 text-(--color-gold)" />
                  <div className="min-w-0">
                    <p className="text-2xs font-bold text-(--color-text-muted) uppercase tracking-wider">
                      {translate("tickets.cinema_venue")}
                    </p>
                    <p className="truncate font-bold text-white">
                      {ticket.cinema}
                      {ticket.room ? ` · ${ticket.room}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-(--color-border)/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-(--color-gold) uppercase tracking-wider mb-2">
                <Armchair size={14} />
                <span>{translate("tickets.seats_label")}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ticket.seatItems.map((seatItem) => (
                  <span
                    key={seatItem.seatId ?? seatItem.label}
                    className="flex items-center gap-1.5 rounded-lg border border-(--color-gold)/40 bg-(--color-gold)/10 px-3 py-1.5 text-xs font-bold text-white"
                  >
                    <span className="text-(--color-gold)">{seatItem.label}</span>
                    <span className="text-2xs text-(--color-text-muted)">({seatItem.type})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {foodDrinks.length > 0 && (
          <div className="border-t border-(--color-border)/60 bg-(--color-surface-2)/30 px-6 py-4">
            <div className="flex items-center gap-2 text-xs font-bold text-(--color-gold) uppercase tracking-wider mb-2">
              <Popcorn size={15} />
              <span>{translate("tickets.concessions_title")}</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {foodDrinks.map((foodItem, index) => (
                <div
                  key={`${foodItem.name}-${index}`}
                  className="flex items-center justify-between rounded-xl border border-(--color-border) bg-(--color-surface) p-3 text-xs"
                >
                  <span className="font-semibold text-white">
                    {foodItem.qty}x {foodItem.name}
                  </span>
                  <span className="font-mono text-(--color-text-muted)">
                    {foodItem.price > 0 ? `${foodItem.price.toLocaleString("vi-VN")} ₫` : "Free"}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2.5 text-[11px] text-(--color-text-muted)">
              {translate("tickets.concessions_pickup_note")}
            </p>
          </div>
        )}

        <TearLine className="my-0 px-6" />

        <div className="p-6">
          <p className="text-xs font-bold text-(--color-gold) uppercase tracking-wider mb-3">
            {translate("tickets.payment_summary")}
          </p>
          <PriceBreakdown
            seats={ticket.seatItems}
            snacks={foodDrinks}
            paymentMethod={ticket.paymentMethod}
            total={total}
          />
        </div>
      </section>
    </div>
  );
}
