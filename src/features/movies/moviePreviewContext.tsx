"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getMovieDetail } from "./api";
import { ALL_MOVIES } from "./mock";
import type { Movie } from "./types";
import MoviePreviewPopover from "./components/MoviePreviewPopover";

interface MoviePreviewContextValue {
  handleCardMouseEnter: (movie: Movie, event: MouseEvent) => void;
  handleCardMouseMove: (event: MouseEvent) => void;
  handleCardMouseLeave: () => void;
}

const MoviePreviewContext = createContext<MoviePreviewContextValue | null>(null);

/** Hover dwell before the card opens its popover — a cursor crossing the row stays quiet. */
const ENTER_DELAY_MS = 200;

/** List rows are shallow — the local catalog only fills the fields the API never sends. */
function withCatalogFallback(movie: Movie): Movie {
  const fallback = ALL_MOVIES.find(
    (candidate) => candidate.slug === movie.slug || candidate.id === movie.id,
  );
  return { ...(fallback ?? {}), ...movie };
}

export function MoviePreviewProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [detailMovie, setDetailMovie] = useState<Movie | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const detailCacheRef = useRef<Map<string, Movie>>(new Map());
  const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentSlugRef = useRef<string | null>(null);

  const fetchDetail = useCallback(
    async (movie: Movie) => {
      // Cache is per locale — a cached EN detail must never serve the VN UI.
      const cacheKey = `${locale}:${movie.slug}`;
      const cached = detailCacheRef.current.get(cacheKey);
      if (cached) {
        setDetailMovie(cached);
        setIsLoadingDetail(false);
        return;
      }

      setIsLoadingDetail(true);
      currentSlugRef.current = movie.slug;

      let detail: Movie;
      try {
        const response = await getMovieDetail(movie.slug, locale);
        detail = "data" in response && response.data ? response.data : withCatalogFallback(movie);
      } catch {
        detail = withCatalogFallback(movie);
      }

      detailCacheRef.current.set(cacheKey, detail);
      // A slow answer for a movie the cursor already left must not repaint the popover.
      if (currentSlugRef.current === movie.slug) {
        setDetailMovie(detail);
        setIsLoadingDetail(false);
      }
    },
    [locale],
  );

  const closePreview = useCallback(() => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = null;
    }
    setIsOpen(false);
    setActiveMovie(null);
    setDetailMovie(null);
    setCursorPos(null);
    currentSlugRef.current = null;
  }, []);

  const handleCardMouseEnter = useCallback(
    (movie: Movie, event: MouseEvent) => {
      // Touch screens have no hover — a tap would open a preview that can
      // only be dismissed by scrolling, so skip the whole flow there.
      if (window.matchMedia("(hover: none)").matches) return;
      if (enterTimeoutRef.current) {
        clearTimeout(enterTimeoutRef.current);
      }

      setCursorPos({ x: event.clientX, y: event.clientY });
      setActiveMovie(movie);

      const cached = detailCacheRef.current.get(`${locale}:${movie.slug}`);
      if (cached) {
        setDetailMovie(cached);
        setIsLoadingDetail(false);
      } else {
        setDetailMovie(movie);
        void fetchDetail(movie);
      }

      enterTimeoutRef.current = setTimeout(() => {
        setIsOpen(true);
      }, ENTER_DELAY_MS);
    },
    [fetchDetail, locale],
  );

  const handleCardMouseMove = useCallback((event: MouseEvent) => {
    setCursorPos({ x: event.clientX, y: event.clientY });
  }, []);

  // The popover follows a fixed cursor position, so scrolling would detach it.
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("scroll", closePreview, { passive: true });
    return () => window.removeEventListener("scroll", closePreview);
  }, [isOpen, closePreview]);

  useEffect(() => {
    return () => {
      if (enterTimeoutRef.current) {
        clearTimeout(enterTimeoutRef.current);
      }
    };
  }, []);

  const displayMovie = detailMovie ?? activeMovie;

  return (
    <MoviePreviewContext.Provider
      value={{ handleCardMouseEnter, handleCardMouseMove, handleCardMouseLeave: closePreview }}
    >
      {children}

      {displayMovie && cursorPos && (
        <MoviePreviewPopover
          movie={displayMovie}
          cursorPos={cursorPos}
          isOpen={isOpen}
          isLoading={isLoadingDetail}
        />
      )}
    </MoviePreviewContext.Provider>
  );
}

export function useMoviePreview() {
  const context = useContext(MoviePreviewContext);
  if (!context) {
    throw new Error("useMoviePreview must be used within MoviePreviewProvider");
  }
  return context;
}
