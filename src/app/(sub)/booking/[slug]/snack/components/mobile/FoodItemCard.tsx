"use client";

import Image from "next/image";
import { FoodItem } from "@/features/booking/types";
import Stepper from "./Stepper";

export default function FoodItemCard({
  item,
  qty,
  onDecrement,
  onIncrement,
}: {
  item: FoodItem;
  qty: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  const isSelected = qty > 0;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isSelected
          ? "bg-(--color-gold)/5 border border-(--color-gold)/30"
          : "border border-transparent"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-colors duration-200 ${
          isSelected ? "bg-(--color-gold)/10" : "bg-(--color-surface-2)"
        }`}
      >
        <Image
          className="object-contain w-auto h-auto"
          src={item.image}
          alt={item.name}
          width={40}
          height={40}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-(--color-text-primary) leading-tight">
          {item.name}
        </h4>
        <p className="font-extrabold text-sm text-(--color-gold-light) mt-0.5">
          {item.price.toLocaleString("vi-VN")}₫
        </p>
      </div>

      <Stepper
        value={qty}
        onDecrement={onDecrement}
        onIncrement={onIncrement}
      />
    </div>
  );
}
