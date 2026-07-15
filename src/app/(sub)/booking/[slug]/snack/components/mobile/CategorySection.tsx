"use client";

import { useSnackSelection } from "./SnackSelectionContext";
import FoodItemCard from "./FoodItemCard";
import type { FoodItem } from "@/features/booking/types";

export default function CategorySection({
  label,
  items,
}: {
  label: string;
  items: FoodItem[];
}) {
  const { foodQty, changeFood } = useSnackSelection();

  return (
    <div className="space-y-2">
      <h3 className="px-4 text-xs font-bold tracking-widest uppercase text-(--color-gold-dark)">
        {label}
      </h3>
      <div className="space-y-1">
        {items.map((item) => (
          <FoodItemCard
            key={item.id}
            item={item}
            qty={foodQty[item.id] ?? 0}
            onDecrement={() => changeFood(item.id, -1)}
            onIncrement={() => changeFood(item.id, +1)}
          />
        ))}
      </div>
    </div>
  );
}
