"use client";

import { useParams } from "next/navigation";
import { useSnackSelection } from "@/features/booking/contexts/SnackSelectionContext";
import { useLocale } from "@/contexts/LocaleContext";
import BookingBottomBar from "@/components/booking/BookingBottomBar";

export default function BottomBar() {
  const params = useParams();
  const slug = params.slug as string;
  const { combos, foodItems, comboQty, foodQty } = useSnackSelection();
  const { translate } = useLocale();

  const comboTotal = combos.reduce((sum, c) => sum + c.price * (comboQty[c.id] ?? 0), 0);
  const foodTotal = foodItems.reduce((sum, f) => sum + f.price * (foodQty[f.id] ?? 0), 0);
  const total = comboTotal + foodTotal;

  const totalItems =
    Object.values(comboQty).reduce((s, q) => s + q, 0) +
    Object.values(foodQty).reduce((s, q) => s + q, 0);
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
        amount: total,
      }}
      canProceed={true}
      ctaText={hasItems ? translate("booking.snack.continue") : translate("booking.snack.skip")}
      ctaHref={`/booking/${slug}/credentials`}
      alwaysEnabled={true}
    />
  );
}
