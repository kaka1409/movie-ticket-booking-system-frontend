"use client";

import { useState, useMemo } from "react";
import { COMBOS, FOOD_ITEMS, FOOD_CATEGORIES } from "@/features/booking/mock";
import { useBooking } from "@/contexts/BookingContext";

// Mobile components
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";
import ComboCard from "./components/mobile/ComboCard";
import CategorySection from "./components/mobile/CategorySection";
import BottomBar from "./components/mobile/BottomBar";

// Desktop components
import DesktopSnackContent from "./components/desktop/SnackContent";

export default function CombosPage() {
  const { combos: savedCombos, foods: savedFoods } = useBooking();

  const [comboQty, setComboQty] = useState<Record<string, number>>(() => {
    const base = Object.fromEntries(COMBOS.map((c) => [c.id, 0]));
    savedCombos.forEach((c) => {
      base[c.id] = c.qty;
    });
    return base;
  });

  const [foodQty, setFoodQty] = useState<Record<string, number>>(() => {
    const base = Object.fromEntries(FOOD_ITEMS.map((f) => [f.id, 0]));
    savedFoods.forEach((f) => {
      base[f.id] = f.qty;
    });
    return base;
  });

  const changeCombo = (id: string, delta: number) =>
    setComboQty((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(10, (prev[id] ?? 0) + delta)),
    }));

  const changeFood = (id: string, delta: number) =>
    setFoodQty((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(10, (prev[id] ?? 0) + delta)),
    }));

  const foodByCategory = useMemo(
    () =>
      FOOD_CATEGORIES.map((cat) => ({
        ...cat,
        items: FOOD_ITEMS.filter((f) => f.category === cat.id),
      })),
    []
  );

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <StepBar current={3} />

        <main className="space-y-5 pt-1 pb-10">
          <CountdownBanner />

          <div className="px-4 pt-1">
            <h2 className="font-extrabold text-2xl text-(--color-text-primary) mb-1">
              Grab a Snack
            </h2>
            <p className="text-sm text-(--color-text-muted)">
              Add combos or pick your favourites — totally optional.
            </p>
          </div>

          {/* Quick Combos */}
          <div className="space-y-3">
            <h3 className="px-4 text-xs font-bold tracking-widest uppercase text-(--color-gold-dark)">
              Quick Combos
            </h3>
            <div className="space-y-3">
              {COMBOS.map((item) => (
                <ComboCard
                  key={item.id}
                  item={item}
                  qty={comboQty[item.id] ?? 0}
                  onDecrement={() => changeCombo(item.id, -1)}
                  onIncrement={() => changeCombo(item.id, +1)}
                />
              ))}
            </div>
          </div>

          {/* Pick & Mix */}
          <div className="space-y-4">
            {foodByCategory.map((cat) => (
              <CategorySection
                key={cat.id}
                label={cat.label}
                items={cat.items}
                quantities={foodQty}
                onChange={changeFood}
              />
            ))}
          </div>
        </main>

        <BottomBar comboQty={comboQty} foodQty={foodQty} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopSnackContent />
      </div>
    </>
  );
}
