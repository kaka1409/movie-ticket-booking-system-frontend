"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getMovieDetail } from "../api";
import type { Movie } from "../types";

interface MoviePreviewContextValue {
  handleCardMouseEnter: (movie: Movie, event: MouseEvent) => void;
  handleCardMouseMove: (event: MouseEvent) => void;
  handleCardMouseLeave: () => void;
}

interface MoviePreviewState {
  previewMovie: Movie | null;
  cursorPos: { x: number; y: number } | null;
  isOpen: boolean;
  isLoadingDetail: boolean;
}

const MoviePreviewContext = createContext<MoviePreviewContextValue | null>(null);
const MoviePreviewStateContext = createContext<MoviePreviewState | null>(null);

/** Hover dwell before the card opens its popover — a cursor crossing the row stays quiet. */
const ENTER_DELAY_MS = 200;

export function MoviePreviewProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [detailMovie, setDetailMovie] = useState<Movie | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const detailCacheRef = useRef<Map<string, Movie>>(new Map());
  const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
        detail = "data" in response && response.data ? response.data : movie;
      } catch {
        detail = movie;
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
    currentSlugRef.current = null;
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMovie(null);
      setDetailMovie(null);
      setCursorPos(null);
      setIsLoadingDetail(false);
      closeTimeoutRef.current = null;
    }, 220);
  }, []);

  const handleCardMouseEnter = useCallback(
    (movie: Movie, event: MouseEvent) => {
      // Touch screens have no hover — a tap would open a preview that can
      // only be dismissed by scrolling, so skip the whole flow there.
      if (window.matchMedia("(hover: none)").matches) return;
      if (enterTimeoutRef.current) {
        clearTimeout(enterTimeoutRef.current);
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      setCursorPos({ x: event.clientX, y: event.clientY });
      setActiveMovie(movie);
      currentSlugRef.current = movie.slug;

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
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const previewMovie = detailMovie ?? activeMovie;
  const handlers = useMemo(
    () => ({
      handleCardMouseEnter,
      handleCardMouseMove,
      handleCardMouseLeave: closePreview,
    }),
    [handleCardMouseEnter, handleCardMouseMove, closePreview],
  );

  return (
    <MoviePreviewContext.Provider value={handlers}>
      <MoviePreviewStateContext.Provider
        value={{
          previewMovie,
          cursorPos,
          isOpen,
          isLoadingDetail,
        }}
      >
        {children}
      </MoviePreviewStateContext.Provider>
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

export function useMoviePreviewState() {
  const context = useContext(MoviePreviewStateContext);
  if (!context) {
    throw new Error("useMoviePreviewState must be used within MoviePreviewProvider");
  }
  return context;
}
