/* ─── Combo & Food Types ─────────────────────────────────── */

export type FoodCategory = "popcorn" | "drinks" | "candy";

export interface ComboItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tag?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  price: number;
  image: string;
}
