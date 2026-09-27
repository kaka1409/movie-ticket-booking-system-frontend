import { apiFetch, type ApiResponse } from "@/libs/api";
import type { MovieShowtime } from "./types";

export function getShowtimes(
  movieSlug: string,
  date: string,
): Promise<ApiResponse<MovieShowtime[]>> {
  return apiFetch<MovieShowtime[]>(
    `/showtimes?movieSlug=${encodeURIComponent(movieSlug)}&date=${date}`,
  );
}
