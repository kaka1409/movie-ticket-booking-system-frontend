/* ─── Cinema & Showtime ──────────────────────────────────── */

export interface Showtime {
  id?: string;
  time: string;
  room: string;
  available: boolean;
  date?: string;
}

export interface Cinema {
  id: string;
  name: string;
  address: string;
  distance?: string;
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

/* ─── Seat Types ────────────────────────────────────────── */

export type SeatKind = "available" | "vip" | "sweetbox";
export type SeatStatus = "idle" | "selected" | "occupied";

export interface Seat {
  col: number;
  kind: SeatKind;
  status: SeatStatus;
  pairId?: string;
  /** Backend seat UUIDs for `POST /bookings` — always empty in mock rows. */
  seatIds: string[];
  /** Price of this cell; a sweetbox cell covers both chairs of the pair. */
  price: number;
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

/* ─── Combo & Food Types ────────────────────────────────── */

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

/* ─── Payment Types ─────────────────────────────────────── */

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  badge?: string;
}
