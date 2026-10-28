"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { useBooking } from "@/features/booking/context";
import { useLocale } from "@/contexts/LocaleContext";
import { useSeatHoldSubmit } from "@/features/booking/hooks/useSeatHoldSubmit";
import { formatVND } from "@/libs/utils";
import Button from "@/components/ui/Button";
import MicroLabel from "@/components/ui/MicroLabel";
import BookingStepLayout from "@/app/(sub)/booking/components/desktop/BookingStepLayout";
import CountdownRow from "@/app/(sub)/booking/components/desktop/CountdownRow";

/**
 * Desktop seats step: the map arrives as `slots`, so the shell — stepper, title,
 * rail with the running clock and the CTA — paints before the rows land.
 *
 * The map is capped at `max-w-md` because `SeatGrid` uses fixed 26px cells with
 * a `justify-between` row layout — stretching it across a wide column would tear
 * a row's two blocks apart instead of scaling it.
 *
 * The hold itself is created by `useSeatHoldSubmit` (shared with the mobile bar,
 * so the network side exists once); nothing here touches the backend.
 */
export default function SeatContent({ slots }: { slots: ReactNode }) {
  const { translate, locale } = useLocale();
  const { selectedSeats } = useBooking();
  const { labels, hasSeats, isReserving, errorText, submit } = useSeatHoldSubmit();

  // Chairs, not cells — a sweetbox cell covers two seats.
  const seatCount = selectedSeats.reduce(
    (total, seat) => total + Math.max(seat.seatIds.length, 1),
    0,
  );
  const ticketPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);

  return (
    <BookingStepLayout
      current={2}
      summary={
        <div className="space-y-4">
          <CountdownRow />

          <div>
            <MicroLabel className="text-(--color-text-muted)">
              {translate("booking.common.seats")} ({seatCount})
            </MicroLabel>
            <p className="mt-1 text-sm leading-snug font-bold text-(--color-text-primary)">
              {labels || "—"}
            </p>
          </div>

          {ticketPrice > 0 && (
            <div className="flex items-end justify-between">
              <MicroLabel className="text-(--color-text-muted)">
                {translate("booking.common.total_price")}
              </MicroLabel>
              <span className="text-base font-extrabold text-(--color-gold)">
                {formatVND(ticketPrice, locale)}
              </span>
            </div>
          )}
        </div>
      }
      action={
        <Button onClick={submit} disabled={!hasSeats} loading={isReserving} icon={ArrowRight}>
          {translate("booking.seats.continue_snacks")}
        </Button>
      }
      errorText={errorText}
    >
      <div className="space-y-6">
        <h1 className="text-xl font-extrabold tracking-wide text-(--color-text-primary)">
          {translate("booking.seats.title")}
        </h1>

        <div className="mx-auto w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
          {slots}
        </div>
      </div>
    </BookingStepLayout>
  );
}
