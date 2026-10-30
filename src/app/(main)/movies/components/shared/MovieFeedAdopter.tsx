"use client";

import { useEffect } from "react";
import { useMovieList } from "@/features/movies/contexts/MovieListContext";
import type { Filters, Movie, MoviesMeta, Tab } from "@/features/movies/types";
import type { ErrorResponse } from "@/libs/api";

export default function MovieFeedAdopter({
  tab,
  query,
  filters,
  movies,
  meta,
  error,
}: {
  tab: Tab;
  query: string;
  filters: Filters;
  movies: Movie[];
  meta?: MoviesMeta;
  error: ErrorResponse["error"] | null;
}) {
  const { adoptInitialFeed } = useMovieList();

  useEffect(() => {
    adoptInitialFeed(tab, query, filters, movies, meta, error);
  }, [adoptInitialFeed, tab, query, filters, movies, meta, error]);

  return null;
}
