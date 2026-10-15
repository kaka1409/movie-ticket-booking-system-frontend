"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { formatVND } from "@/libs/utils";
import MicroLabel from "@/components/ui/MicroLabel";

export default function PriceSummary() {
  const { translate, locale } = useLocale();
  const { ticket } = useTicketDetail();
  const { modificationType, selectedSeats } = useModification();

  const showtimeFee = 15000;
  const seatsFee = selectedSeats.length > 0 ? 10000 : 0;

  const showShowtime = modificationType === "showtime" || modificationType === "both";
  const showSeats = modificationType === "seats" || modificationType === "both";

  let difference = 0;
  if (showtimeFee > 0 && showShowtime) difference += showtimeFee;
  if (showSeats && selectedSeats.length > 0) {
    const currentTotal = ticket.seatItems.reduce((sum, s) => sum + s.price, 0);
    const newTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    difference += newTotal - currentTotal;
  }
  if (showSeats) difference += seatsFee;

  const isPay = difference > 0;
  const isRefund = difference < 0;

  return (
    <section className="px-4">
      <div className="p-4 rounded-2xl bg-(--color-surface) border border-(--color-border)">
        <MicroLabel className="text-(--color-text-muted) mb-3">
          {translate("tickets.modify.review.price_adjustment")}
        </MicroLabel>

        <div className="space-y-2">
          {showShowtime && (
            <div className="flex justify-between text-sm">
              <span className="text-(--color-text-secondary)">
                {translate("tickets.modify.change_showtime")}
              </span>
              <span className="font-medium text-(--color-text-primary)">
                {formatVND(showtimeFee, locale)}
              </span>
            </div>
          )}
          {showSeats && selectedSeats.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-(--color-text-secondary)">
                {translate("tickets.modify.change_seats")}
              </span>
              <span className="font-medium text-(--color-text-primary)">
                {formatVND(seatsFee, locale)}
              </span>
            </div>
          )}

          <div className="pt-2 mt-2 border-t border-(--color-border) flex justify-between">
            <span className="font-bold text-sm text-(--color-text-primary)">
              {translate("booking.common.total")}
            </span>
            <span
              className={`font-extrabold text-lg ${
                isPay
                  ? "text-(--color-gold)"
                  : isRefund
                    ? "text-emerald-500"
                    : "text-(--color-text-primary)"
              }`}
            >
              {isRefund
                ? `+${formatVND(Math.abs(difference), locale)}`
                : formatVND(difference, locale)}
            </span>
          </div>

          <p className="text-xs text-(--color-text-muted) text-center">
            {isRefund
              ? translate("tickets.modify.review.you_refund")
              : isPay
                ? translate("tickets.modify.review.you_pay")
                : translate("tickets.modify.review.no_change")}
          </p>
        </div>
      </div>
    </section>
  );
}
