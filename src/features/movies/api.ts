import type { Movie, FeaturedMovie } from "./types";
// import { apiFetch } from "@/libs/api";
import { NOW_SHOWING, COMING_SOON, ALL_MOVIES, FEATURED_MOVIES } from "./mock";

export async function getNowShowingMovies(): Promise<Movie[]> {
  // TODO: replace with real fetch when backend is ready
  // return apiFetch<Movie[]>("/api/v1/movies/now-showing");
  return NOW_SHOWING;
}

export async function getComingSoonMovies(): Promise<Movie[]> {
  // return apiFetch<Movie[]>("/api/v1/movies/coming-soon");
  return COMING_SOON;
}

export async function getAllMovies(): Promise<Movie[]> {
  // return apiFetch<Movie[]>("/api/v1/movies");
  return ALL_MOVIES;
}

export async function getFeaturedMovies(): Promise<FeaturedMovie[]> {
  // return apiFetch<FeaturedMovie[]>("/api/v1/movies/featured");
  return FEATURED_MOVIES;
}

export async function getMovieBySlug(slug: string): Promise<Movie | undefined> {
  // return apiFetch<Movie>(`/api/v1/movies/${slug}`);
  return ALL_MOVIES.find((movie) => movie.slug === slug);
}
