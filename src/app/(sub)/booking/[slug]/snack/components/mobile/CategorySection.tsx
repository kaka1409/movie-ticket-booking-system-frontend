"use client";

import { useSnackSelection } from "@/features/booking/contexts/SnackSelectionContext";
import SectionHeader from "@/components/ui/SectionHeader";
import FoodItemCard from "./FoodItemCard";
import type { FoodItem } from "@/features/booking/types";

export default function CategorySection({ label, items }: { label: string; items: FoodItem[] }) {
  const { foodQty, changeFood } = useSnackSelection();

  return (
    <div className="space-y-2">
      <SectionHeader variant="uppercase">{label}</SectionHeader>
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
