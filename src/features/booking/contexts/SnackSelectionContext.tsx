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
  const {
    combos: savedCombos,
    foods: savedFoods,
    setSnacks,
  } = useBooking();

  // Initialize comboQty with saved combos and default values
  const [comboQty, setComboQty] = useState<Record<string, number>>(() => {
    const base = Object.fromEntries(combos.map((combo) => [combo.id, 0]));
    savedCombos.forEach((savedCombo) => {
      base[savedCombo.id] = savedCombo.qty;
    });
    return base;
  });

  // Initialize foodQty with saved foods and default values
  const [foodQty, setFoodQty] = useState<Record<string, number>>(() => {
    const base = Object.fromEntries(foodItems.map((food) => [food.id, 0]));
    savedFoods.forEach((savedFood) => {
      base[savedFood.id] = savedFood.qty;
    });
    return base;
  });

  // Update comboQty state when a combo is changed
  const changeCombo = (id: string, delta: number) =>
    setComboQty((previous) => ({
      ...previous,
      [id]: Math.max(0, Math.min(10, (previous[id] ?? 0) + delta)),
    }));

  // Update foodQty state when a food is changed
  const changeFood = (id: string, delta: number) =>
    setFoodQty((previous) => ({
      ...previous,
      [id]: Math.max(0, Math.min(10, (previous[id] ?? 0) + delta)),
    }));

  // Update snacks state when comboQty or foodQty changes
  useEffect(() => {
    const totalItems =
      Object.values(comboQty).reduce((sum, quantity) => sum + quantity, 0) +
      Object.values(foodQty).reduce((sum, quantity) => sum + quantity, 0);
    if (totalItems === 0) return;

    const selectedCombos: SelectedCombo[] = combos
      .filter((combo) => (comboQty[combo.id] ?? 0) > 0)
      .map((combo) => ({
        id: combo.id,
        name: combo.name,
        qty: comboQty[combo.id] ?? 0,
        price: combo.price,
      }));

    // Map selected combos and foods to their respective types
    const selectedFoods: SelectedFood[] = foodItems
      .filter((food) => (foodQty[food.id] ?? 0) > 0)
      .map((food) => ({
        id: food.id,
        name: food.name,
        qty: foodQty[food.id] ?? 0,
        price: food.price,
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
