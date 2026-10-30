"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Movie } from "../types";

const MovieDetailContext = createContext<Movie | null>(null);

/** Hands the server-fetched movie to the detail page's client islands. */
export function MovieDetailProvider({ movie, children }: { movie: Movie; children: ReactNode }) {
  return <MovieDetailContext.Provider value={movie}>{children}</MovieDetailContext.Provider>;
}

/** The movie rendered by the detail page; throws outside its provider. */
export function useMovieDetail(): Movie {
  const ctx = useContext(MovieDetailContext);
  if (!ctx) throw new Error("useMovieDetail must be used within MovieDetailProvider");
  return ctx;
}
