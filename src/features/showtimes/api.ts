import { apiFetch, type ApiResponse } from "@/libs/api";
import type {
  ShowtimesResponse,
  ShowtimeDateOption,
  ShowtimeDetail,
} from "./types";

export function getShowtimes(
  movieSlug: string,
  date: string,
  cinemaId?: string,
): Promise<ApiResponse<ShowtimesResponse>> {
  const query = new URLSearchParams({
    movieSlug,
    date,
  });
  if (cinemaId) {
    query.set("cinemaId", cinemaId);
  }

  return apiFetch<ShowtimesResponse>(`/showtimes?${query.toString()}`);
}

export function getShowtimeDates(
  movieSlug: string,
): Promise<ApiResponse<ShowtimeDateOption[]>> {
  return apiFetch<ShowtimeDateOption[]>(
    `/showtimes/dates?movieSlug=${encodeURIComponent(movieSlug)}`,
  );
}

export function getShowtimeById(
  id: string,
): Promise<ApiResponse<ShowtimeDetail>> {
  return apiFetch<ShowtimeDetail>(`/showtimes/${encodeURIComponent(id)}`);
}

