"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useSnackSelection } from "@/features/booking/contexts/SnackSelectionContext";
import { useLocale } from "@/contexts/LocaleContext";

export default function BottomBar() {
  const params = useParams();
  const slug = params.slug as string;
  const { combos, foodItems, comboQty, foodQty } = useSnackSelection();
  const { translate } = useLocale();

  const comboTotal = combos.reduce(
    (sum, c) => sum + c.price * (comboQty[c.id] ?? 0),
    0
  );
  const foodTotal = foodItems.reduce(
    (sum, f) => sum + f.price * (foodQty[f.id] ?? 0),
    0
  );
  const total = comboTotal + foodTotal;

  const totalItems =
    Object.values(comboQty).reduce((s, q) => s + q, 0) +
    Object.values(foodQty).reduce((s, q) => s + q, 0);
  const hasItems = totalItems > 0;

  return (
    <div className="sticky bottom-0 z-50 bg-(--color-bg) border-t border-(--color-border) px-4 pb-6 pt-3">
      <div className="flex items-end justify-between mb-3 min-h-[40px]">
        <div>
          <p className="text-[9px] font-bold tracking-widest uppercase text-(--color-text-muted) mb-0.5">
            {translate("booking.snack.selected_items")}
          </p>
          <p
            className={`font-bold text-base ${
              hasItems
                ? "text-(--color-text-primary)"
                : "text-(--color-text-muted)"
            }`}
          >
            {hasItems
              ? `${totalItems} ${totalItems > 1 ? translate("booking.snack.items") : translate("booking.snack.item")}`
              : translate("booking.snack.no_items")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold tracking-widest uppercase text-(--color-text-muted) mb-0.5">
            {translate("booking.common.total")}
          </p>
          <p
            className={`font-extrabold text-xl tabular-nums ${
              hasItems ? "text-(--color-gold)" : "text-(--color-text-muted)"
            }`}
          >
            {hasItems ? `${total.toLocaleString("vi-VN")}₫` : "—"}
          </p>
        </div>
      </div>

      <Link
        href={`/booking/${slug}/credentials`}
        className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98] bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_20px_rgba(255,204,77,0.25)]"
      >
        {hasItems ? translate("booking.snack.continue") : translate("booking.snack.skip")}
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}
