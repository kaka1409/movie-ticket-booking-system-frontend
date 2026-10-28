import { cache } from "react";
import { settleApiResponse } from "@/libs/api";
import type { ErrorResponse } from "@/libs/api";
import { getCombos, getFoodCategories, getFoodItems } from "./api";
import type { ComboItem, FoodCategory, FoodItem } from "./types";

/** A food-category row: `id` is the wire token, `label` is already localized. */
export type FoodCategoryOption = { id: FoodCategory; label: string };

/** The snack step's whole catalog behind one read. */
export interface SnackCatalog {
  combos: ComboItem[];
  foodItems: FoodItem[];
  foodCategories: FoodCategoryOption[];
  error: ErrorResponse["error"] | null;
  /** A rejected session renders nothing — the route's gate owns the prompt. */
  isUnauthorized: boolean;
}

/** Failure shape shared by every early return below. */
function toFailure(error: ErrorResponse["error"]): SnackCatalog {
  return {
    combos: [],
    foodItems: [],
    foodCategories: [],
    error,
    isUnauthorized: error.status === 401,
  };
}

/**
 * Combos + food items + category labels, fetched together. Both device trees
 * stream this in their own boundary, so the `cache()` wrapper is what keeps the
 * step at one round trip instead of two.
 */
export const getSnackCatalog = cache(async (locale: "en" | "vn"): Promise<SnackCatalog> => {
  const [combosResult, foodItemsResult, foodCategoriesResult] = await Promise.all([
    settleApiResponse(getCombos(locale)),
    settleApiResponse(getFoodItems(locale)),
    settleApiResponse(getFoodCategories(locale)),
  ]);

  if ("error" in combosResult) return toFailure(combosResult.error);
  if ("error" in foodItemsResult) return toFailure(foodItemsResult.error);
  if ("error" in foodCategoriesResult) return toFailure(foodCategoriesResult.error);

  return {
    combos: combosResult.data,
    foodItems: foodItemsResult.data,
    foodCategories: foodCategoriesResult.data,
    error: null,
    isUnauthorized: false,
  };
});
