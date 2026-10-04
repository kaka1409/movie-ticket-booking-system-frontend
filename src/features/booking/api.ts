import type {
  Cinema,
  DateOption,
  SeatRow,
  SeatPrice,
  ComboItem,
  FoodItem,
  FoodCategory,
} from "./types";
import {
  CINEMAS,
  DATES,
  SEAT_ROWS,
  SEAT_PRICES,
  COMBOS,
  FOOD_ITEMS,
  FOOD_CATEGORIES,
  COUNTDOWN_SECONDS,
  MAX_SEATS_PER_BOOKING,
} from "./mock";

// TODO(api): replace the mock returns below with real fetches when the backend is ready.

export async function getCinemas(): Promise<Cinema[]> {
  return CINEMAS;
}

export async function getDates(): Promise<DateOption[]> {
  return DATES;
}

export async function getSeatRows(): Promise<SeatRow[]> {
  return SEAT_ROWS;
}

export async function getSeatPrices(): Promise<SeatPrice> {
  return SEAT_PRICES;
}

export async function getCombos(): Promise<ComboItem[]> {
  return COMBOS;
}

export async function getFoodItems(): Promise<FoodItem[]> {
  return FOOD_ITEMS;
}

export async function getFoodCategories(): Promise<readonly { id: FoodCategory; label: string }[]> {
  return FOOD_CATEGORIES;
}

export async function getCountdownSeconds(): Promise<number> {
  return COUNTDOWN_SECONDS;
}

export async function getMaxSeatsPerBooking(): Promise<number> {
  return MAX_SEATS_PER_BOOKING;
}
