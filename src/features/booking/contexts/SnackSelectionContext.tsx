"use client";

import { createContext, useContext, useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import type { ComboItem, FoodItem, SelectedCombo, SelectedFood } from "../types";
import { useBooking } from "../context";

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
  const { combos: savedCombos, foods: savedFoods, setSnacks } = useBooking();

  const [comboQty, setComboQty] = useState<Record<string, number>>(() => {
    const base = Object.fromEntries(combos.map((combo) => [combo.id, 0]));
    savedCombos.forEach((savedCombo) => {
      base[savedCombo.id] = savedCombo.qty;
    });
    return base;
  });

  const [foodQty, setFoodQty] = useState<Record<string, number>>(() => {
    const base = Object.fromEntries(foodItems.map((food) => [food.id, 0]));
    savedFoods.forEach((savedFood) => {
      base[savedFood.id] = savedFood.qty;
    });
    return base;
  });

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

  useEffect(() => {
    const totalItems =
      Object.values(comboQty).reduce((s, q) => s + q, 0) +
      Object.values(foodQty).reduce((s, q) => s + q, 0);
    if (totalItems === 0) return;

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
  }, [comboQty, foodQty, combos, foodItems, setSnacks]);

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
