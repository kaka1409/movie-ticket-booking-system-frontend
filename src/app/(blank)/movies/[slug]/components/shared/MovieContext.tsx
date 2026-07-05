"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { Movie } from "@/features/movies/types";

const MovieContext = createContext<Movie | null>(null);

export function MovieProvider({
  movie,
  children,
}: {
  movie: Movie;
  children: ReactNode;
}) {
  return <MovieContext.Provider value={movie}>{children}</MovieContext.Provider>;
}

export function useMovie() {
  const ctx = useContext(MovieContext);
  if (!ctx) throw new Error("useMovie must be used within MovieProvider");
  return ctx;
}
