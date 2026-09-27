"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { DEFAULT_FILTERS, MOVIES_PAGE_SIZE } from "./constants";
import { getMovies } from "./api";
import type { Tab, Filters, Movie, MoviesMeta } from "./types";

/* ─── Movie list — trang /movies ────────────────────────────── */

interface MovieListContextType {
  activeTab: Tab;
  query: string;
  filtersOpen: boolean;
  filters: Filters;
  appliedFilters: Filters;
  movies: Movie[];
  hasMore: boolean;
  isLoadingMore: boolean;
  activeFilterCount: number;
  setActiveTab: (tab: Tab) => void;
  setQuery: (query: string) => void;
  toggleFiltersOpen: () => void;
  setFilters: (filters: Filters) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  loadMore: () => Promise<void>;
}

const MovieListContext = createContext<MovieListContextType | null>(null);

/* ─── URL Helpers ───────────────────────────────────────────── */

function readFiltersFromParams(sp: URLSearchParams): Filters {
  const genres = sp.get("genres")?.split(",").filter(Boolean) ?? [];
  return {
    releaseDate: "Any Time",
    genres,
    rating: sp.get("rating") ?? "",
    length: "",
    format: sp.get("format") ?? "",
    ageRating: sp.get("ageRating") ?? "",
  };
}

function writeParamsFromState(
  tab: Tab,
  filters: Filters,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("status", tab);
  if (filters.genres.length > 0) params.set("genres", filters.genres.join(","));
  if (filters.rating) params.set("rating", filters.rating);
  if (filters.format) params.set("format", filters.format);
  if (filters.ageRating) params.set("ageRating", filters.ageRating);
  return params;
}

/* ─── Provider ──────────────────────────────────────────────── */

interface MovieListState {
  movies: Movie[];
  meta?: MoviesMeta;
}

export function MovieListProvider({
  initialNowShowing,
  initialComingSoon,
  initialMeta,
  children,
}: {
  initialNowShowing: Movie[];
  initialComingSoon: Movie[];
  initialMeta: { nowShowing?: MoviesMeta; comingSoon?: MoviesMeta };
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  /* ── Initialize from URL ── */
  const initialTab = (
    ["now_showing", "coming_soon"].includes(searchParams.get("status") ?? "")
      ? searchParams.get("status")
      : "now_showing"
  ) as Tab;

  const initialFilters = readFiltersFromParams(searchParams);

  /* ── State ── */
  const [activeTab, setActiveTabState] = useState<Tab>(initialTab);
  const [query, setQueryState] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFiltersState] = useState<Filters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters);
  const [lists, setLists] = useState<Record<Tab, MovieListState>>({
    now_showing: { movies: initialNowShowing, meta: initialMeta.nowShowing },
    coming_soon: { movies: initialComingSoon, meta: initialMeta.comingSoon },
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  /* ── URL sync helper ── */
  const updateURL = useCallback(
    (tab: Tab, f: Filters) => {
      const params = writeParamsFromState(tab, f);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname],
  );

  /* ── Actions ── */
  const setActiveTab = useCallback(
    (tab: Tab) => {
      setActiveTabState(tab);
      updateURL(tab, filters);
    },
    [filters, updateURL],
  );

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
  }, []);

  const toggleFiltersOpen = useCallback(() => setFiltersOpen((v) => !v), []);

  const setFilters = useCallback((f: Filters) => setFiltersState(f), []);

  const applyFilters = useCallback(() => {
    setAppliedFilters(filters);
    setFiltersOpen(false);
    updateURL(activeTab, filters);
  }, [activeTab, filters, updateURL]);

  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    updateURL(activeTab, DEFAULT_FILTERS);
  }, [activeTab, updateURL]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore) return;
    const tab = activeTab;
    const current = lists[tab];
    if (!current.meta?.hasNextPage) return;

    setIsLoadingMore(true);
    try {
      const result = await getMovies(
        tab,
        current.meta.page + 1,
        MOVIES_PAGE_SIZE,
      );
      if ("error" in result) {
        console.warn("loadMore failed:", result.error);
        return;
      }

      const fetched = result.data;
      setLists((prev) => {
        const entry = prev[tab];
        const existingIds = new Set(entry.movies.map((movie) => movie.id));
        return {
          ...prev,
          [tab]: {
            movies: [
              ...entry.movies,
              ...fetched.filter((movie) => !existingIds.has(movie.id)),
            ],
            meta: result.meta ?? entry.meta,
          },
        };
      });
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, activeTab, lists]);

  /* ── Derived ── */
  const activeList = lists[activeTab];
  const activeFilterCount = [
    appliedFilters.genres.length > 0,
    !!appliedFilters.rating,
    !!appliedFilters.length,
    appliedFilters.format !== "" && appliedFilters.format !== "2D",
    !!appliedFilters.ageRating,
  ].filter(Boolean).length;

  return (
    <MovieListContext.Provider
      value={{
        activeTab,
        query,
        filtersOpen,
        filters,
        appliedFilters,
        movies: activeList.movies,
        hasMore: activeList.meta?.hasNextPage ?? false,
        isLoadingMore,
        activeFilterCount,
        setActiveTab,
        setQuery,
        toggleFiltersOpen,
        setFilters,
        applyFilters,
        clearFilters,
        loadMore,
      }}
    >
      {children}
    </MovieListContext.Provider>
  );
}

/* ─── Hook ──────────────────────────────────────────────────── */

export function useMovieList(): MovieListContextType {
  const ctx = useContext(MovieListContext);
  if (!ctx) throw new Error("useMovieList must be used within MovieListProvider");
  return ctx;
}

/* ─── Movie detail — trang /movies/[slug] ───────────────────── */

const MovieDetailContext = createContext<Movie | null>(null);

export function MovieDetailProvider({
  movie,
  children,
}: {
  movie: Movie;
  children: ReactNode;
}) {
  return (
    <MovieDetailContext.Provider value={movie}>
      {children}
    </MovieDetailContext.Provider>
  );
}

export function useMovieDetail(): Movie {
  const ctx = useContext(MovieDetailContext);
  if (!ctx)
    throw new Error("useMovieDetail must be used within MovieDetailProvider");
  return ctx;
}

/* ─── Showtime selection — booking preselection ─────────────── */

interface ShowtimeSelection {
  cinemaId: string;
  time: string;
  date: string;
}

interface MovieSelectionContextType {
  selectedShowtime: ShowtimeSelection | null;
  setSelectedShowtime: (selection: ShowtimeSelection | null) => void;
}

const MovieSelectionContext = createContext<MovieSelectionContextType | null>(
  null,
);

export function MovieSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedShowtime, setSelectedShowtime] =
    useState<ShowtimeSelection | null>(null);

  return (
    <MovieSelectionContext.Provider
      value={{ selectedShowtime, setSelectedShowtime }}
    >
      {children}
    </MovieSelectionContext.Provider>
  );
}

export function useMovieSelection(): MovieSelectionContextType {
  const ctx = useContext(MovieSelectionContext);
  if (!ctx)
    throw new Error(
      "useMovieSelection must be used within MovieSelectionProvider",
    );
  return ctx;
}
