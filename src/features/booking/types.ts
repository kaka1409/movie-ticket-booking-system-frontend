export interface Showtime {
  time: string;
  available: boolean;
}

export interface Cinema {
  id: number;
  name: string;
  address: string;
  distance: string;
  badge: string;
  badgeColor: string;
  showtimes: Showtime[];
}

export interface DateOption {
  value: string;
  day: number;
  month: string;
  weekday: string;
}

export interface BookingSelection {
  cinemaId: number | null;
  time: string;
  date: string;
}

export const BOOKING_STEPS = [
  "SELECT CINEMA",
  "SELECT SEATS",
  "FOOD & DRINKS",
  "PAYMENT",
  "CONFIRM",
] as const;

/* ─── Seat Selection Types ───────────────────────────────── */

export type SeatKind = "available" | "vip" | "sweetbox";
export type SeatStatus = "idle" | "selected" | "occupied";

export interface Seat {
  col: number;
  kind: SeatKind;
  status: SeatStatus;
  pairId?: string;
}

export interface SeatRow {
  label: string;
  segments: Seat[][];
}

export interface SeatPrice {
  available: number;
  vip: number;
  sweetbox: number;
}

/* ─── Combo Types ────────────────────────────────────────── */

export interface ComboItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tag?: string;
}

/* ─── Food & Drink Types ─────────────────────────────────── */

export type FoodCategory = "popcorn" | "drinks" | "candy";

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  price: number;
  image: string;
}
