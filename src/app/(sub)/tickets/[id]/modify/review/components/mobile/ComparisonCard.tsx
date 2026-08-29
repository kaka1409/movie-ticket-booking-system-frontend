"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { formatVND } from "@/libs/utils";
import { CalendarDays, Armchair, ArrowRightLeft } from "lucide-react";

export default function ComparisonCard() {
  const { translate } = useLocale();
  const { ticket } = useTicketDetail();
  const { modificationType, selectedShowtime, selectedSeats } = useModification();

  const showShowtime = modificationType === "showtime" || modificationType === "both";
  const showSeats = modificationType === "seats" || modificationType === "both";

  const currentSeatsTotal = ticket.seatItems.reduce((sum, s) => sum + s.price, 0);
  const newSeatsTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <section className="px-4 space-y-4">
      <p className="text-[9px] font-black tracking-[0.16em] uppercase text-(--color-text-muted)">
        {translate("tickets.modify.review.changes_summary")}
      </p>

      {/* Showtime comparison */}
      {showShowtime && selectedShowtime && (
        <div className="rounded-2xl border border-(--color-border) overflow-hidden">
          <div className="px-4 py-3 bg-(--color-surface-2) flex items-center gap-2">
            <CalendarDays size={14} className="text-(--color-text-muted)" />
            <span className="text-xs font-bold uppercase tracking-wide text-(--color-text-muted)">
              {translate("booking.common.date_time")}
            </span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-(--color-surface-2) text-(--color-text-muted) flex-shrink-0">
                {translate("tickets.modify.review.current")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-(--color-text-primary)">
                  {ticket.cinema}
                </p>
                <p className="text-xs text-(--color-text-muted)">
                  {ticket.room} · {ticket.datetime}
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <ArrowRightLeft size={14} className="text-(--color-gold)" />
            </div>
            <div className="flex items-start gap-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-(--color-gold)/10 text-(--color-gold) flex-shrink-0">
                {translate("tickets.modify.review.new")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-(--color-gold)">
                  {selectedShowtime.cinemaName}
                </p>
                <p className="text-xs text-(--color-text-muted)">
                  {selectedShowtime.room} · {selectedShowtime.date} {selectedShowtime.time}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seats comparison */}
      {showSeats && (
        <div className="rounded-2xl border border-(--color-border) overflow-hidden">
          <div className="px-4 py-3 bg-(--color-surface-2) flex items-center gap-2">
            <Armchair size={14} className="text-(--color-text-muted)" />
            <span className="text-xs font-bold uppercase tracking-wide text-(--color-text-muted)">
              {translate("booking.common.seats")}
            </span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-(--color-surface-2) text-(--color-text-muted) flex-shrink-0">
                {translate("tickets.modify.review.current")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-(--color-text-primary)">
                  {ticket.seatItems.map((s) => s.label).join(", ")}
                </p>
                <p className="text-xs text-(--color-text-muted)">
                  {formatVND(currentSeatsTotal)}
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <ArrowRightLeft size={14} className="text-(--color-gold)" />
            </div>
            <div className="flex items-start gap-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-(--color-gold)/10 text-(--color-gold) flex-shrink-0">
                {translate("tickets.modify.review.new")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-(--color-gold)">
                  {selectedSeats.map((s) => s.label).join(", ")}
                </p>
                <p className="text-xs text-(--color-text-muted)">
                  {formatVND(newSeatsTotal)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
