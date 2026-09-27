import type { Movie, FeaturedMovie, MoviesMeta } from "./types";
import { apiFetch, type ApiResponse } from "@/libs/api";
import { MOVIES_PAGE_SIZE } from "./constants";
import { ALL_MOVIES } from "./mock";

type FeaturedMovieResponse = Movie & {
  featuredLabel?: string;
  featuredDescription?: string;
};

export async function getFeaturedMovies(): Promise<ApiResponse<FeaturedMovie[]>> {
  const result = await apiFetch<FeaturedMovieResponse[]>("/movies?featured=true");

  if ("error" in result) {
    return { error: result.error };
  }

  return {
    data: result.data.map(
      ({ featuredLabel, featuredDescription, ...movie }) => ({
        ...movie,
        label: featuredLabel ?? "",
        description: featuredDescription ?? "",
      }),
    ),
  };
}

export async function getMovies(
  status: string = "now_showing",
  page: number = 1,
  limit: number = MOVIES_PAGE_SIZE,
): Promise<ApiResponse<Movie[], MoviesMeta>> {
  // Fetch paginated movies — shared by home rows and /movies grid
  return apiFetch<Movie[], MoviesMeta>(
    `/movies?status=${status}&page=${page}&limit=${limit}`,
  );
}

export async function getAllMovies(): Promise<Movie[]> {
  return ALL_MOVIES;
}

export async function getMovieBySlug(slug: string): Promise<Movie | undefined> {
  return ALL_MOVIES.find((movie) => movie.slug === slug);
}

export function getMovieDetail(slug: string): Promise<ApiResponse<Movie>> {
  return apiFetch<Movie>(`/movies/${encodeURIComponent(slug)}`);
}