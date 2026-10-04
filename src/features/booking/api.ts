import type {
  Cinema,
  DateOption,
  SeatRow,
  SeatPrice,
  ComboItem,
  FoodItem,
  FoodCategory,
} from "./types";
// import { apiFetch } from "@/libs/api";
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

export async function getCinemas(): Promise<Cinema[]> {
  // TODO: replace with real fetch when backend is ready
  // return apiFetch<Cinema[]>("/cinemas");
  return CINEMAS;
}

export async function getDates(): Promise<DateOption[]> {
  // return apiFetch<DateOption[]>("/dates");
  return DATES;
}

export async function getSeatRows(): Promise<SeatRow[]> {
  // return apiFetch<SeatRow[]>("/seats");
  return SEAT_ROWS;
}

export async function getSeatPrices(): Promise<SeatPrice> {
  // return apiFetch<SeatPrice>("/seats/prices");
  return SEAT_PRICES;
}

export async function getCombos(): Promise<ComboItem[]> {
  // return apiFetch<ComboItem[]>("/combos");
  return COMBOS;
}

export async function getFoodItems(): Promise<FoodItem[]> {
  // return apiFetch<FoodItem[]>("/food-items");
  return FOOD_ITEMS;
}

export async function getFoodCategories(): Promise<readonly { id: FoodCategory; label: string }[]> {
  // return apiFetch<{ id: FoodCategory; label: string }[]>("/food-categories");
  return FOOD_CATEGORIES;
}

export async function getCountdownSeconds(): Promise<number> {
  // return apiFetch<number>("/countdown-seconds");
  return COUNTDOWN_SECONDS;
}

export async function getMaxSeatsPerBooking(): Promise<number> {
  // return apiFetch<number>("/max-seats-per-booking");
  return MAX_SEATS_PER_BOOKING;
}
