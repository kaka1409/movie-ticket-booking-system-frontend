"use client";

import Image from "next/image";
import { MonitorPlay, CalendarDays, User } from "lucide-react";
import type { Recipient } from "@/features/tickets/types";
import { useLocale } from "@/contexts/LocaleContext";
import DetailRow from "@/app/(sub)/booking/components/mobile/DetailRow";
import PriceBreakdown from "@/app/(sub)/booking/components/mobile/PriceBreakdown";
import TearLine from "@/components/ui/TearLine";
import MicroLabel from "@/components/ui/MicroLabel";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";

interface ConfirmCardProps {
  seatLabels: string[];
  recipient: Recipient;
  transferSnacks?: boolean;
}

export default function ConfirmCard({
  seatLabels,
  recipient,
  transferSnacks = false,
}: ConfirmCardProps) {
  const { ticket } = useTicketDetail();
  const { translate } = useLocale();

  const selectedSeats = ticket.seatItems.filter((seat) => seatLabels.includes(seat.label));
  const totalSeats = ticket.seatItems.length;
  const showSnacks = transferSnacks && !!ticket.foodDrink && ticket.foodDrink.length > 0;

  return (
    <section className="px-4">
      <div className="rounded-3xl overflow-visible bg-(--color-surface) border border-(--color-border) shadow-[--shadow-card]">
        {/* Top: movie info */}
        <div className="flex gap-3 p-4">
          <div className="w-20 h-30 flex-shrink-0 rounded-sm overflow-hidden relative">
            <Image
              src={ticket.poster}
              alt={ticket.movie}
              width={80}
              height={120}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="font-bold text-base text-white mb-1">{ticket.movie}</h3>
            <p className="text-xs text-white/60">
              {ticket.format}
              {ticket.ageRating ? ` · ${ticket.ageRating}` : ""}
            </p>
          </div>
        </div>

        {/* Tear line */}
        <TearLine className="px-0 my-0" lineClassName="mx-3" />

        {/* Ticket details */}
        <div className="px-4 py-4 space-y-4">
          {/* Theater + DateTime */}
          <div className="flex justify-between gap-4">
            <DetailRow
              icon={MonitorPlay}
              label={translate("booking.common.theater")}
              value={
                <>
                  {ticket.cinema}
                  {ticket.room && <>, {ticket.room}</>}
                  {ticket.location && <>, {ticket.location}</>}
                </>
              }
            />
            <DetailRow
              icon={CalendarDays}
              label={translate("booking.common.date_time")}
              value={ticket.datetime}
              valueClass="text-white font-bold text-sm text-right"
              labelClass="justify-end"
            />
          </div>

          {/* Seats being transferred + optional snacks + payment/total */}
          <PriceBreakdown
            seats={selectedSeats}
            seatsHeaderText={
              <>
                {translate("tickets.transfer.seats_label")} ({selectedSeats.length}/{totalSeats})
              </>
            }
            snacks={showSnacks ? (ticket.foodDrink ?? []) : []}
            paymentMethod={ticket.paymentMethod}
            total={ticket.totalPrice ?? null}
            hideTotal={!showSnacks}
          />
        </div>

        {/* Tear line */}
        <TearLine className="px-0 my-0" lineClassName="mx-3" />

        {/* Recipient */}
        <div className="px-4 py-4 space-y-3">
          <MicroLabel className="flex items-center gap-1.5 text-white/60">
            <User size={10} />
            {translate("tickets.transfer.confirm_recipient_label")}
          </MicroLabel>
          <div className="flex items-center gap-3.5">
            <Image
              src={recipient.avatar}
              alt={recipient.name}
              width={44}
              height={44}
              className="shrink-0 w-11 h-11 rounded-full object-cover bg-(--color-surface-2)"
            />
            <span className="flex flex-col gap-0.5 min-w-0">
              <span className="font-bold text-sm text-(--color-text-primary)">
                {recipient.name}
              </span>
              <span className="text-xs text-(--color-text-muted)">@{recipient.username}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
