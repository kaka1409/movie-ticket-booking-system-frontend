"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
  type MouseEvent,
} from "react";
import type { Movie } from "@/features/movies/types";
import { getMovieDetail } from "@/features/movies/api";
import { useLocale } from "@/contexts/LocaleContext";
import { ALL_MOVIES } from "@/features/movies/mock";
import MoviePreviewPopover from "./MoviePreviewPopover";

interface MoviePreviewContextValue {
  handleCardMouseEnter: (movie: Movie, e: MouseEvent) => void;
  handleCardMouseMove: (e: MouseEvent) => void;
  handleCardMouseLeave: () => void;
}

const MoviePreviewContext = createContext<MoviePreviewContextValue | null>(null);

const ENTER_DELAY_MS = 200;

export function MoviePreviewProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [detailMovie, setDetailMovie] = useState<Movie | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // In-memory cache for fetched movie details
  const detailCacheRef = useRef<Map<string, Movie>>(new Map());
  const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentSlugRef = useRef<string | null>(null);

  const fetchDetail = useCallback(
    async (movie: Movie) => {
      // Cache is per locale — a cached EN detail must never serve the VN UI.
      const cacheKey = `${locale}:${movie.slug}`;
      // Check cache first
      const cached = detailCacheRef.current.get(cacheKey);
      if (cached) {
        setDetailMovie(cached);
        setIsLoadingDetail(false);
        return;
      }

      setIsLoadingDetail(true);
      currentSlugRef.current = movie.slug;

      try {
        const response = await getMovieDetail(movie.slug, locale);
        if ("data" in response && response.data) {
          detailCacheRef.current.set(cacheKey, response.data);
          if (currentSlugRef.current === movie.slug) {
            setDetailMovie(response.data);
          }
        } else {
          // Fallback to local catalog if API returns error (live fields win —
          // the mock only fills gaps the API never returns).
          const fallback = ALL_MOVIES.find((m) => m.slug === movie.slug || m.id === movie.id);
          const merged = { ...(fallback ?? {}), ...movie };
          detailCacheRef.current.set(cacheKey, merged);
          if (currentSlugRef.current === movie.slug) {
            setDetailMovie(merged);
          }
        }
      } catch {
        const fallback = ALL_MOVIES.find((m) => m.slug === movie.slug || m.id === movie.id);
        const merged = { ...(fallback ?? {}), ...movie };
        detailCacheRef.current.set(cacheKey, merged);
        if (currentSlugRef.current === movie.slug) {
          setDetailMovie(merged);
        }
      } finally {
        if (currentSlugRef.current === movie.slug) {
          setIsLoadingDetail(false);
        }
      }
    },
    [locale],
  );

  const handleCardMouseEnter = useCallback(
    (movie: Movie, e: MouseEvent) => {
      // Touch screens have no hover — a tap would open a preview that can
      // only be dismissed by scrolling, so skip the whole flow there.
      if (window.matchMedia("(hover: none)").matches) return;
      if (enterTimeoutRef.current) {
        clearTimeout(enterTimeoutRef.current);
      }

      const clientX = e.clientX;
      const clientY = e.clientY;

      setCursorPos({ x: clientX, y: clientY });
      setActiveMovie(movie);

      // Check cache immediately or trigger fetch
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

  const handleCardMouseMove = useCallback((e: MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleCardMouseLeave = useCallback(() => {
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

  // Close immediately on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        if (enterTimeoutRef.current) {
          clearTimeout(enterTimeoutRef.current);
          enterTimeoutRef.current = null;
        }
        setIsOpen(false);
        setActiveMovie(null);
        setDetailMovie(null);
        setCursorPos(null);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

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
      value={{
        handleCardMouseEnter,
        handleCardMouseMove,
        handleCardMouseLeave,
      }}
    >
      {children}

      {/* Cursor-following Movie Preview Popover */}
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
