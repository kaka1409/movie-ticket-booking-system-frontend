"use client";

import { createContext, useContext, useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import type { ComboItem, FoodItem } from "@/features/booking/types";
import { useBooking } from "@/features/booking/context";

interface SnackSelectionContextType {
  combos: ComboItem[];
  foodItems: FoodItem[];
  foodCategories: readonly { id: string; label: string }[];
  comboQty: Record<string, number>;
  foodQty: Record<string, number>;
  changeCombo: (id: string, delta: number) => void;
  changeFood: (id: string, delta: number) => void;
  foodByCategory: { id: string; label: string; items: FoodItem[] }[];
}

const SnackSelectionContext = createContext<SnackSelectionContextType | null>(null);

export function SnackSelectionProvider({
  combos,
  foodItems,
  foodCategories,
  children,
}: {
  combos: ComboItem[];
  foodItems: FoodItem[];
  foodCategories: readonly { id: string; label: string }[];
  children: ReactNode;
}) {
  const { combos: savedCombos, foods: savedFoods } = useBooking();

  const [comboQty, setComboQty] = useState<Record<string, number>>({});
  const [foodQty, setFoodQty] = useState<Record<string, number>>({});

  useEffect(() => {
    if (combos.length > 0) {
      const base = Object.fromEntries(combos.map((combo) => [combo.id, 0]));
      savedCombos.forEach((savedCombo) => {
        base[savedCombo.id] = savedCombo.qty;
      });
      setComboQty(base);
    }
  }, [combos, savedCombos]);

  useEffect(() => {
    if (foodItems.length > 0) {
      const base = Object.fromEntries(foodItems.map((food) => [food.id, 0]));
      savedFoods.forEach((savedFood) => {
        base[savedFood.id] = savedFood.qty;
      });
      setFoodQty(base);
    }
  }, [foodItems, savedFoods]);

  const changeCombo = (id: string, delta: number) =>
    setComboQty((previous) => ({
      ...previous,
      [id]: Math.max(0, Math.min(10, (previous[id] ?? 0) + delta)),
    }));

  const changeFood = (id: string, delta: number) =>
    setFoodQty((previous) => ({
      ...previous,
      [id]: Math.max(0, Math.min(10, (previous[id] ?? 0) + delta)),
    }));

  const foodByCategory = useMemo(
    () =>
      foodCategories.map((category) => ({
        ...category,
        items: foodItems.filter((food) => food.category === category.id),
      })),
    [foodCategories, foodItems]
  );

  return (
    <SnackSelectionContext.Provider
      value={{
        combos,
        foodItems,
        foodCategories,
        comboQty,
        foodQty,
        changeCombo,
        changeFood,
        foodByCategory,
      }}
    >
      {children}
    </SnackSelectionContext.Provider>
  );
}

export function useSnackSelection() {
  const ctx = useContext(SnackSelectionContext);
  if (!ctx) throw new Error("useSnackSelection must be used within SnackSelectionProvider");
  return ctx;
}
