"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";
import Button from "@/components/ui/Button";
import MicroLabel from "@/components/ui/MicroLabel";
import BookingStepLayout from "@/app/(sub)/booking/components/desktop/BookingStepLayout";
import CountdownRow from "@/app/(sub)/booking/components/desktop/CountdownRow";
import RailTheater from "@/app/(sub)/booking/components/desktop/RailTheater";
import RailSeats from "@/app/(sub)/booking/components/desktop/RailSeats";
import SnackHeader from "../shared/SnackHeader";

/**
 * Desktop snack step: the catalog arrives as `slots`, so the shell — stepper,
 * header, rail with the running selection and its total — paints before it.
 *
 * The selection itself is the booking draft (the same arrays the mobile cards
 * write through `withItemQty`), so the carts cannot diverge between skins.
 */
export default function SnackContent({ slots }: { slots: ReactNode }) {
  const params = useParams();
  const slug = params.slug as string;
  const { translate, locale } = useLocale();
  const { combos: selectedCombos, foods: selectedFoods, snackTotal } = useBooking();

  // The selected arrays only hold qty > 0 entries, so the counter derives
  // straight from them — zeroing a stepper updates it live.
  const totalItems =
    selectedCombos.reduce((sum, combo) => sum + combo.qty, 0) +
    selectedFoods.reduce((sum, food) => sum + food.qty, 0);
  const hasItems = totalItems > 0;

  return (
    <BookingStepLayout
      current={3}
      summary={
        <div className="space-y-4">
          <CountdownRow />

          <RailTheater />
          <RailSeats />

          <div>
            <MicroLabel className="text-(--color-text-muted)">
              {translate("booking.common.snacks_combos")}
            </MicroLabel>
            <p className="mt-1 text-sm font-bold text-(--color-text-primary)">
              {hasItems
                ? `${totalItems} ${
                    totalItems > 1
                      ? translate("booking.snack.items")
                      : translate("booking.snack.item")
                  }`
                : translate("booking.snack.no_items")}
            </p>
          </div>

          <div className="flex items-end justify-between">
            <MicroLabel className="text-(--color-text-muted)">
              {translate("booking.common.total")}
            </MicroLabel>
            <span className="text-base font-extrabold text-(--color-gold)">
              {formatVND(snackTotal, locale)}
            </span>
          </div>
        </div>
      }
      action={
        <Button href={`/booking/${slug}/credentials`} icon={ArrowRight}>
          {hasItems ? translate("booking.snack.continue") : translate("booking.snack.skip")}
        </Button>
      }
    >
      <div className="space-y-8">
        <SnackHeader className="" />
        {slots}
      </div>
    </BookingStepLayout>
  );
}
