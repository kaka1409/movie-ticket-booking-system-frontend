"use client";

import Image from "next/image";
import type { ComboItem } from "@/features/booking/types";
import Stepper from "./Stepper";
import { useSnackSelection } from "./SnackSelectionContext";

export default function ComboCard({ item }: { item: ComboItem }) {
  const { comboQty, changeCombo } = useSnackSelection();
  const qty = comboQty[item.id] ?? 0;
  const isSelected = qty > 0;

  return (
    <article
      className={`mx-4 rounded-2xl overflow-hidden transition-all duration-200 bg-(--color-surface) border ${
        isSelected
          ? "border-(--color-gold) shadow-[0_0_0_1px_rgba(255,204,77,0.12)]"
          : "border-(--color-border)"
      }`}
    >
      <div className="flex gap-0">
        <div
          className={`relative w-28 flex-shrink-0 flex items-center justify-center overflow-hidden transition-colors duration-200 ${
            isSelected ? "bg-(--color-gold)/8" : "bg-(--color-surface-2)"
          }`}
        >
          <Image
            className="object-contain w-auto h-auto"
            src={item.image}
            alt={item.name}
            width={112}
            height={80}
            loading="eager"
          />

          {item.tag && (
            <span className="absolute top-2 left-0 right-0 mx-auto w-fit px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase bg-(--color-gold) text-[#0F0F0F]">
              {item.tag}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 p-3.5 flex flex-col justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-(--color-text-primary) leading-snug mb-1">
              {item.name}
            </h3>
            <p className="text-xs text-(--color-text-muted) leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-extrabold text-lg text-(--color-gold-light) tracking-tight">
              {item.price.toLocaleString("vi-VN")}₫
            </span>
            <Stepper
              value={qty}
              onDecrement={() => changeCombo(item.id, -1)}
              onIncrement={() => changeCombo(item.id, +1)}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
