"use client";

import { useParams } from "next/navigation";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useLocale } from "@/contexts/LocaleContext";
import BookingBottomBar from "@/components/shared/BookingBottomBar";

export default function BottomBar() {
  const params = useParams();
  const slug = params.slug as string;
  const { combos, foods, snackTotal } = useBooking();
  const { translate } = useLocale();

  // The selected arrays only hold qty > 0 entries — the item counter comes
  // straight from them (zeroing a stepper updates it live); the money total
  // is derived once in BookingContext.
  const totalItems =
    combos.reduce((sum, combo) => sum + combo.qty, 0) +
    foods.reduce((sum, food) => sum + food.qty, 0);
  const hasItems = totalItems > 0;

  return (
    <BookingBottomBar
      selectionInfo={{
        subLabel: hasItems
          ? `${totalItems} ${totalItems > 1 ? translate("booking.snack.items") : translate("booking.snack.item")}`
          : translate("booking.snack.no_items"),
      }}
      totalInfo={{
        label: translate("booking.common.total"),
        amount: snackTotal,
      }}
      canProceed={true}
      ctaText={hasItems ? translate("booking.snack.continue") : translate("booking.snack.skip")}
      ctaHref={`/booking/${slug}/credentials`}
      alwaysEnabled={true}
    />
  );
}
