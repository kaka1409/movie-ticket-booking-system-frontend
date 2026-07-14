import type { Cinema, DateOption } from "./types";
import { apiFetch } from "@/libs/api";
import { CINEMAS, DATES } from "./mock";

export async function getCinemas(): Promise<Cinema[]> {
  // TODO: replace with real fetch when backend is ready
  // return apiFetch<Cinema[]>("/api/cinemas");
  return CINEMAS;
}

export async function getDates(): Promise<DateOption[]> {
  // return apiFetch<DateOption[]>("/api/dates");
  return DATES;
}
