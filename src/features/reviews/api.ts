// import { apiFetch } from "@/libs/api";
import { FILTERS } from "./mock";
import type { FilterKey } from "./mock";

export async function getReviewFilters(): Promise<typeof FILTERS> {
  // TODO: replace with real fetch when backend is ready
  // return apiFetch<typeof FILTERS>("/api/v1/reviews/filters");
  return FILTERS;
}

export type { FilterKey };
