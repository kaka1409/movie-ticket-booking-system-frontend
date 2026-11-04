"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, QrCode, Popcorn, ArrowRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import TearLine from "@/components/ui/TearLine";
import Badge from "@/components/ui/Badge";
import TicketCountdown from "@/components/shared/tickets/TicketCountdown";
import type { UpcomingTicket } from "@/features/tickets/types";
import QuickQrModal from "./QuickQrModal";

/**
 * Desktop cinema boarding pass card:
 * Displays movie visual with live countdown, theater and hall specifications,
 * formatted seat badges, snacks indicator, quick QR preview modal, and detail CTA.
 */
export default function UpcomingTicketCard({ ticket }: { ticket: UpcomingTicket }) {
  const { translate } = useLocale();
  const [isQuickQrOpen, setIsQuickQrOpen] = useState(false);

  const totalSnackCount = (ticket.foodDrink ?? []).reduce(
    (accumulator, currentItem) => accumulator + currentItem.qty,
    0,
  );

  return (
    <>
      <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-(--color-gold)/20 bg-(--color-surface) transition duration-200 hover:border-(--color-gold)/40 hover:shadow-xl">
        {/* Main Ticket Area */}
        <div className="flex gap-5 p-5">
          {/* Movie Poster & Status Ribbon */}
          <div className="relative aspect-[2/3] w-32 shrink-0 overflow-hidden rounded-xl bg-(--color-surface-2) shadow-md">
            <Image
              src={ticket.poster}
              alt={ticket.movie}
              fill
              sizes="128px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {ticket.isTransferring ? (
              <span className="absolute inset-x-0 top-0 bg-(--color-gold) px-1 py-1.5 text-center text-2xs font-black tracking-wider text-black uppercase">
                {translate("tickets.transfer.pending_badge")}
              </span>
            ) : (
              <TicketCountdown
                startsAtMs={ticket.startsAtMs}
                endsAtMs={ticket.endsAtMs}
                tone="gold"
              />
            )}
            <span className="absolute bottom-2 left-2 text-3xs font-black tracking-tight text-white/20 uppercase">
              {ticket.movie}
            </span>
          </div>

          {/* Ticket Information */}
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <Badge variant="gold" size="xs" className="uppercase font-extrabold">
                  {ticket.format}
                </Badge>
                {ticket.ageRating && (
                  <Badge variant="neutral" size="xs" className="uppercase font-bold">
                    {ticket.ageRating}
                  </Badge>
                )}
              </div>

              <h3 className="text-lg font-black tracking-tight text-white line-clamp-1">
                {ticket.movie}
              </h3>

              <div className="mt-2.5 space-y-1.5 text-sm text-(--color-text-secondary)">
                <p className="flex items-center gap-2">
                  <CalendarDays size={14} className="shrink-0 text-(--color-gold)" />
                  <span className="font-medium text-white">{ticket.datetime}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={14} className="shrink-0 text-(--color-gold)" />
                  <span className="truncate">
                    {ticket.cinema}
                    {ticket.room ? ` · ${ticket.room}` : ""}
                  </span>
                </p>
              </div>
            </div>

            {/* Badges & Accessories */}
            <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-(--color-border)/50">
              <span className="rounded-lg border border-(--color-border) bg-(--color-surface-2) px-2.5 py-1 text-xs font-semibold text-(--color-text-secondary)">
                {translate("tickets.seats_label")}
                <span className="font-bold text-white">
                  {ticket.seatItems.map((seatItem) => seatItem.label).join(", ")}
                </span>
              </span>

              {totalSnackCount > 0 && (
                <span className="flex items-center gap-1.5 rounded-lg border border-(--color-border) bg-(--color-surface-2) px-2.5 py-1 text-xs font-semibold text-(--color-gold)">
                  <Popcorn size={13} />
                  <span>{totalSnackCount} combo</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Perforated Tear Line */}
        <TearLine className="my-0 px-4" />

        {/* Ticket Stub Footer & Quick Actions */}
        <div className="flex items-center justify-between gap-4 bg-(--color-surface-2)/40 px-5 py-3.5">
          <div className="min-w-0">
            <p className="text-2xs font-bold tracking-widest text-(--color-gold)/80 uppercase">
              {translate("tickets.booking_id")}
            </p>
            <p className="truncate font-mono text-xs font-bold text-white/90">#{ticket.id}</p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {ticket.qrCode && (
              <button
                type="button"
                onClick={() => setIsQuickQrOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-xs font-bold text-white transition hover:border-(--color-gold)/60 hover:text-(--color-gold) active:scale-95"
                title={translate("tickets.quick_qr")}
              >
                <QrCode size={15} />
                <span className="hidden sm:inline">{translate("tickets.quick_qr")}</span>
              </button>
            )}

            <Link
              href={`/tickets/${ticket.id}`}
              className="flex items-center gap-1.5 rounded-xl border border-(--color-gold) bg-(--color-gold)/10 px-4 py-2 text-xs font-bold text-(--color-gold) transition hover:bg-(--color-gold) hover:text-black active:scale-95"
            >
              <span>{translate("tickets.view_details")}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </article>

      {/* Quick QR Lightbox Dialog */}
      <QuickQrModal
        ticket={ticket}
        isOpen={isQuickQrOpen}
        onClose={() => setIsQuickQrOpen(false)}
      />
    </>
  );
}
