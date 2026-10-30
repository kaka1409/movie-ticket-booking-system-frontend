"use client";

import { ArrowRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { useSeatsStep } from "@/features/tickets/hooks/useModifySteps";
import { formatVND } from "@/libs/utils";
import Button from "@/components/ui/Button";
import MicroLabel from "@/components/ui/MicroLabel";
import ModifyStepLayout from "@/app/(sub)/tickets/components/desktop/ModifyStepLayout";
import SeatMapStepBody from "@/app/(sub)/tickets/components/shared/SeatMapStepBody";
import ModifySeatGrid from "@/app/(sub)/tickets/components/shared/ModifySeatGrid";
import SeatInfo from "../shared/SeatInfo";

/**
 * Desktop seats step: the picked-target map in the content column (capped at
 * `max-w-md` — `SeatGrid` uses fixed cells, it must not stretch), the ticket
 * context on top; the pick + CTA live in the rail.
 */
export default function SeatContent() {
  const { translate, locale } = useLocale();
  const { selectedSeats } = useModification();
  const { canContinue, isNavigating, hintText, goToNextStep } = useSeatsStep();

  const seatCount = selectedSeats.reduce((total, seat) => total + seat.seatIds.length, 0);
  const labels = selectedSeats.map((seat) => seat.label).join(", ");
  const newSeatsTotal = selectedSeats.reduce((total, seat) => total + seat.price, 0);

  return (
    <ModifyStepLayout
      current="seats"
      summary={
        <div className="space-y-4">
          <div>
            <MicroLabel className="text-(--color-text-muted)">
              {translate("booking.common.seats")} ({seatCount})
            </MicroLabel>
            <p className="mt-1 text-sm leading-snug font-bold text-(--color-text-primary)">
              {labels || "—"}
            </p>
          </div>

          {newSeatsTotal > 0 && (
            <div className="flex items-end justify-between">
              <MicroLabel className="text-(--color-text-muted)">
                {translate("booking.common.total_price")}
              </MicroLabel>
              <span className="text-base font-extrabold text-(--color-gold)">
                {formatVND(newSeatsTotal, locale)}
              </span>
            </div>
          )}

          <p className="text-xs text-(--color-text-muted)">{hintText}</p>
        </div>
      }
      action={
        <Button
          icon={ArrowRight}
          disabled={!canContinue}
          loading={isNavigating}
          onClick={goToNextStep}
        >
          {translate("tickets.transfer.continue")}
        </Button>
      }
    >
      <div className="space-y-5">
        <h1 className="text-xl font-extrabold tracking-wide text-(--color-text-primary)">
          {translate("tickets.modify.seats.title")}
        </h1>

        <SeatInfo />

        <SeatMapStepBody>
          <div className="mx-auto w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
            <ModifySeatGrid />
          </div>
        </SeatMapStepBody>
      </div>
    </ModifyStepLayout>
  );
}
