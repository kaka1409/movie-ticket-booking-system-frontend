import type { Movie, FeaturedMovie } from "./types";
import { apiFetch, type ApiResult } from "@/libs/api";
import { ALL_MOVIES } from "./mock";

type FeaturedMovieResponse = Movie & {
  featuredLabel?: string;
  featuredDescription?: string;
};

export async function getNowShowingMovies(): Promise<ApiResult<Movie[]>> {
  return apiFetch<Movie[]>("/movies?status=now_showing&page=1&limit=6");
}

export async function getComingSoonMovies(): Promise<ApiResult<Movie[]>> {
  return apiFetch<Movie[]>("/movies?status=coming_soon&page=1&limit=6");
}

export async function getFeaturedMovies(): Promise<ApiResult<FeaturedMovie[]>> {
  const result = await apiFetch<FeaturedMovieResponse[]>("/movies?featured=true");

  if (result.error) {
    return { data: null, error: result.error };
  }

  return {
    data: result.data.map(
      ({ featuredLabel, featuredDescription, ...movie }) => ({
        ...movie,
        label: featuredLabel ?? "",
        description: featuredDescription ?? "",
      }),
    ),
    meta: result.meta,
    error: null,
  };
}

export async function getMovieBySlug(slug: string): Promise<Movie | undefined> {
  // return apiFetch<Movie>(`/movies/${slug}`);
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(ALL_MOVIES.find((movie) => movie.slug === slug))
  //   }, 3000)
  // });

  return ALL_MOVIES.find((movie) => movie.slug === slug)
}
