"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useSeatHoldSubmit } from "@/features/booking/hooks/useSeatHoldSubmit";
import { formatVND } from "@/libs/utils";
import Button from "@/components/ui/Button";
import MicroLabel from "@/components/ui/MicroLabel";
import SeatLegend from "@/components/shared/seats/SeatLegend";
import BookingStepLayout from "@/app/(sub)/booking/components/desktop/BookingStepLayout";
import CountdownRow from "@/app/(sub)/booking/components/desktop/CountdownRow";
import RailTheater from "@/app/(sub)/booking/components/desktop/RailTheater";
import RailSeats from "@/app/(sub)/booking/components/desktop/RailSeats";

/**
 * Desktop seats step: the map arrives as `slots`, so the shell — stepper, title,
 * rail with the running clock and the CTA — paints before the rows land.
 *
 * The map now expands to full width of the left column (no max-w-md cap).
 * Seat legend is moved to the top of the card for better visibility.
 *
 * The hold itself is created by `useSeatHoldSubmit` (shared with the mobile bar,
 * so the network side exists once); nothing here touches the backend.
 */
export default function SeatContent({ slots }: { slots: ReactNode }) {
  const { translate, locale } = useLocale();
  const { selectedSeats } = useBooking();
  const { hasSeats, isReserving, errorText, submit } = useSeatHoldSubmit();

  const ticketPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);

  return (
    <BookingStepLayout
      current={2}
      summary={
        <div className="space-y-4">
          <CountdownRow />

          <RailTheater />
          <RailSeats />

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
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 min-h-[600px]">
        <h1 className="text-xl font-extrabold tracking-wide text-(--color-text-primary) mb-6">
          {translate("booking.seats.title")}
        </h1>

        <SeatLegend desktop />
        <div className="mt-6">
          {slots}
        </div>
      </div>
    </BookingStepLayout>
  );
}
