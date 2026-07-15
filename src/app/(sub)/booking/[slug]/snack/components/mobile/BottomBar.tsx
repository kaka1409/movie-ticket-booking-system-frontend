"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useBooking, type SelectedCombo, type SelectedFood } from "@/features/booking/context";
import { useSnackSelection } from "./SnackSelectionContext";

export default function BottomBar() {
  const params = useParams();
  const slug = params.slug as string;
  const { setSnacks } = useBooking();
  const { combos, foodItems, comboQty, foodQty } = useSnackSelection();

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

  const handleSaveAndNavigate = () => {
    const selectedCombos: SelectedCombo[] = combos
      .filter((c) => (comboQty[c.id] ?? 0) > 0)
      .map((c) => ({
        id: c.id,
        name: c.name,
        qty: comboQty[c.id] ?? 0,
        price: c.price,
      }));

    const selectedFoods: SelectedFood[] = foodItems
      .filter((f) => (foodQty[f.id] ?? 0) > 0)
      .map((f) => ({
        id: f.id,
        name: f.name,
        qty: foodQty[f.id] ?? 0,
        price: f.price,
      }));

    setSnacks(selectedCombos, selectedFoods);
  };

  return (
    <div className="sticky bottom-0 z-50 bg-(--color-bg) border-t border-(--color-border) px-4 pb-6 pt-3">
      <div className="flex items-end justify-between mb-3 min-h-[40px]">
        <div>
          <p className="text-[9px] font-bold tracking-widest uppercase text-(--color-text-muted) mb-0.5">
            Selected Items
          </p>
          <p
            className={`font-bold text-base ${
              hasItems
                ? "text-(--color-text-primary)"
                : "text-(--color-text-muted)"
            }`}
          >
            {hasItems
              ? `${totalItems} Item${totalItems > 1 ? "s" : ""}`
              : "No items selected"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold tracking-widest uppercase text-(--color-text-muted) mb-0.5">
            TOTAL
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
        onClick={handleSaveAndNavigate}
        className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-extrabold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98] bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_20px_rgba(255,204,77,0.25)]"
      >
        {hasItems ? "Continue to Credential" : "Skip — Pay for Tickets Only"}
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}
