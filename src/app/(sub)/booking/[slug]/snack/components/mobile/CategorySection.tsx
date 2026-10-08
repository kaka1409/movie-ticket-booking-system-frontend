"use client";

import { useBooking } from "@/features/booking/context";
import { withItemQty } from "@/features/booking/utils/snack";
import SectionHeader from "@/components/ui/SectionHeader";
import FoodItemCard from "./FoodItemCard";
import type { FoodItem } from "@/features/booking/types";

export default function CategorySection({ label, items }: { label: string; items: FoodItem[] }) {
  const { combos, foods, setSnacks } = useBooking();

  return (
    <div className="space-y-2">
      <SectionHeader variant="uppercase">{label}</SectionHeader>
      <div className="space-y-1">
        {items.map((item) => {
          const qty = foods.find((entry) => entry.id === item.id)?.qty ?? 0;

          return (
            <FoodItemCard
              key={item.id}
              item={item}
              qty={qty}
              onDecrement={() => setSnacks(combos, withItemQty(foods, item, -1))}
              onIncrement={() => setSnacks(combos, withItemQty(foods, item, +1))}
            />
          );
        })}
      </div>
    </div>
  );
}
