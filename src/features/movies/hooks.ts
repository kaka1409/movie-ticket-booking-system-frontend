"use client";

import { useState, useEffect } from "react";
import {
  getNowShowingMovies,
  getComingSoonMovies,
  getFeaturedMovies,
} from "./api";
import type { Movie, FeaturedMovie } from "./types";

export function useNowShowingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNowShowingMovies()
      .then(setMovies)
      .finally(() => setLoading(false));
  }, []);

  return { movies, loading };
}

export function useComingSoonMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComingSoonMovies()
      .then(setMovies)
      .finally(() => setLoading(false));
  }, []);

  return { movies, loading };
}

export function useFeaturedMovies() {
  const [movies, setMovies] = useState<FeaturedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedMovies()
      .then(setMovies)
      .finally(() => setLoading(false));
  }, []);

  return { movies, loading };
}
