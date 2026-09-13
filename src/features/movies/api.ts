import type { Movie, FeaturedMovie } from "./types";
// import { apiFetch } from "@/libs/api";
import { NOW_SHOWING, COMING_SOON, ALL_MOVIES, FEATURED_MOVIES } from "./mock";

export async function getNowShowingMovies(): Promise<Movie[]> {
  // TODO: replace with real fetch when backend is ready
  // return apiFetch<Movie[]>("/movies/now-showing");
  return NOW_SHOWING;
}

export async function getComingSoonMovies(): Promise<Movie[]> {
  // return apiFetch<Movie[]>("/movies/coming-soon");
  return COMING_SOON;
}

export async function getAllMovies(): Promise<Movie[]> {
  // return apiFetch<Movie[]>("/movies");
  return ALL_MOVIES;
}

export async function getFeaturedMovies(): Promise<FeaturedMovie[]> {
  // return apiFetch<FeaturedMovie[]>("/movies/featured");
  return FEATURED_MOVIES;
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
