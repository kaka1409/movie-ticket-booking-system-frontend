import type { Cinema, DateOption, SeatRow, SeatPrice, ComboItem, FoodItem, FoodCategory } from "./types";
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
  // return apiFetch<Cinema[]>("/api/v1/cinemas");
  return CINEMAS;
}

export async function getDates(): Promise<DateOption[]> {
  // return apiFetch<DateOption[]>("/api/v1/dates");
  return DATES;
}

export async function getSeatRows(): Promise<SeatRow[]> {
  // return apiFetch<SeatRow[]>("/api/v1/seats");
  return SEAT_ROWS;
}

export async function getSeatPrices(): Promise<SeatPrice> {
  // return apiFetch<SeatPrice>("/api/v1/seats/prices");
  return SEAT_PRICES;
}

export async function getCombos(): Promise<ComboItem[]> {
  // return apiFetch<ComboItem[]>("/api/v1/combos");
  return COMBOS;
}

export async function getFoodItems(): Promise<FoodItem[]> {
  // return apiFetch<FoodItem[]>("/api/v1/food-items");
  return FOOD_ITEMS;
}

export async function getFoodCategories(): Promise<readonly { id: FoodCategory; label: string }[]> {
  // return apiFetch<{ id: FoodCategory; label: string }[]>("/api/v1/food-categories");
  return FOOD_CATEGORIES;
}

export async function getCountdownSeconds(): Promise<number> {
  // return apiFetch<number>("/api/v1/countdown-seconds");
  return COUNTDOWN_SECONDS;
}

export async function getMaxSeatsPerBooking(): Promise<number> {
  // return apiFetch<number>("/api/v1/max-seats-per-booking");
  return MAX_SEATS_PER_BOOKING;
}
