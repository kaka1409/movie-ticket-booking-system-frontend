"use client";

import { FoodItem } from "@/features/booking/types";
import FoodItemCard from "./FoodItemCard";

export default function CategorySection({
  label,
  items,
  quantities,
  onChange,
}: {
  label: string;
  items: FoodItem[];
  quantities: Record<string, number>;
  onChange: (id: string, delta: number) => void;
}) {
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
            qty={quantities[item.id] ?? 0}
            onDecrement={() => onChange(item.id, -1)}
            onIncrement={() => onChange(item.id, +1)}
          />
        ))}
      </div>
    </div>
  );
}
