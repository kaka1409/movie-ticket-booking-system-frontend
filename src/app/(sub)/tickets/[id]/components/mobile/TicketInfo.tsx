"use client";

import Image from "next/image";
import { CreditCard, MapPin, UtensilsCrossed, Calendar, Armchair } from "lucide-react";
import type { UpcomingTicket, PastTicket } from "@/features/tickets/types";
import { useLocale } from "@/contexts/LocaleContext";
import QRCode from "./QRCode";

interface TicketInfoProps {
  ticket: UpcomingTicket | PastTicket;
  detail: UpcomingTicket | PastTicket | null;
}

export default function TicketInfo({ ticket, detail }: TicketInfoProps) {
  const { translate } = useLocale();
  return (
    <main className="flex-1 overflow-y-auto pb-8 p-4">
      {/* Hero ticket card */}
      <div className="rounded-3xl overflow-hidden bg-(--color-surface) border border-(--color-gold)/20 shadow-(--shadow-card)">
        {/* Poster */}
        <div className="relative w-full h-80 bg-(--color-surface)">
          <Image
            src={ticket.poster}
            alt={ticket.movie}
            fill
            sizes="100%"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/80 text-(--color-text-secondary) border border-(--color-border)">
                {ticket.format}
              </span>
              {detail?.ageRating && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/80 text-(--color-text-secondary) border border-(--color-border)">
                  {detail.ageRating}
                </span>
              )}
            </div>
            <h2 className="text-white font-extrabold text-2xl leading-tight">
              {ticket.movie}
            </h2>
          </div>
        </div>

        {/* Ticket body */}
        <div className="px-4 pt-5 pb-2 space-y-5">
          {/* Theater + Date grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1 text-(--color-text-muted)">
                <MapPin size={11} className="inline mr-1.5" />
                {translate("tickets.detail.theater")}
              </p>
              <p className="text-white font-bold text-sm">{detail?.cinema}</p>
              {detail?.location && (
                <p className="text-xs mt-0.5 text-(--color-text-muted)">
                  {detail.location}{detail?.screen && ` • ${detail.screen}`}
                </p>
              )}
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1 text-(--color-text-muted)">
                <Calendar size={11} className="inline mr-1.5" />
                {translate("tickets.detail.date_time")}
              </p>
              <p className="text-white font-bold text-sm">{ticket.datetime}</p>
            </div>
          </div>

          {/* Seat */}
          <div>
            <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1 text-(--color-text-muted)">
              <Armchair size={11} className="inline mr-1.5" />
              {translate("tickets.detail.seat")}
            </p>
            <p className="text-white font-extrabold text-xl tracking-wide mb-1">
              {detail?.seats}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-white font-bold text-sm">
                {detail?.seatClass ?? translate("tickets.detail.standard")} {translate("tickets.detail.ticket")}
              </p>
              <p className="text-white font-bold text-sm">
                {detail?.seatPrice} × {detail?.seats.split(",").length}
              </p>
            </div>
          </div>

          {/* Food & Drink */}
          {detail?.foodDrink && detail.foodDrink.length > 0 && (
            <div>
              <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1 text-(--color-text-muted)">
                <UtensilsCrossed size={11} className="inline mr-1.5" />
                {translate("tickets.detail.food_drink")}
              </p>
              <div className="space-y-1.5">
                {detail.foodDrink.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <p className="text-white font-bold text-sm">{item.name}</p>
                    <p className="text-white font-bold text-sm">
                      {item.price} × {item.qty}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tear line */}
          <div className="relative flex items-center -mx-4">
            <div className="absolute -left-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
            <div className="flex-1 border-t-2 border-dashed border-(--color-border)" />
            <div className="absolute -right-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
          </div>

          {/* QR Code */}
          <QRCode value={ticket.id} />

          {/* Booking ID row */}
          <div className="flex items-center justify-between py-1">
            <p className="text-sm text-(--color-text-muted)">{translate("tickets.detail.booking_id")}</p>
            <p className="font-bold text-sm text-(--color-text-secondary)">
              #{ticket.id}
            </p>
          </div>

          {/* Tear line */}
          <div className="relative flex items-center -mx-4">
            <div className="absolute -left-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
            <div className="flex-1 border-t-2 border-dashed border-(--color-border)" />
            <div className="absolute -right-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
          </div>

          {/* Payment summary */}
          <div className="space-y-3 pb-2">
            <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-(--color-text-muted)">
              {translate("tickets.detail.payment_summary")}
            </p>

            <div className="flex items-center justify-between">
              <p className="text-sm text-(--color-text-secondary)">
                {translate("tickets.detail.total_price")}
              </p>
              <p className="font-extrabold text-base text-(--color-gold)">
                {detail?.totalPrice}
              </p>
            </div>

            {detail?.paymentMethod && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-(--color-text-secondary)">
                  {translate("tickets.detail.payment_method")}
                </p>
                <p className="flex items-center gap-1.5 font-semibold text-sm text-(--color-text-secondary)">
                  <CreditCard size={14} className="text-(--color-gold)" />
                  {detail.paymentMethod}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
