"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { DEFAULT_FILTERS } from "../constants";
import { writeParamsFromState } from "../utils/url";
import type { Tab, Filters, Movie, MoviesMeta, FilterOptions } from "../types";
import type { ErrorResponse } from "@/libs/api";
import { useMovieListFeed } from "../hooks/useMovieListFeed";

/* ─── Movie list — /movies ─────────────────────────────────── */

interface MovieListContextType {
  activeTab: Tab;
  /** Live search input value (updates immediately). */
  query: string;
  /** Debounced search value actually sent to the server. */
  appliedQuery: string;
  filtersOpen: boolean;
  /** Draft filters edited inside the panel (committed on Apply). */
  filters: Filters;
  /** Committed filters driving the current result list. */
  appliedFilters: Filters;
  filterOptions: FilterOptions;
  adoptFilterOptions: (
    catalog: keyof FilterOptions,
    options: FilterOptions[keyof FilterOptions],
  ) => void;
  movies: Movie[];
  /** Identity of the list on screen (tab + committed query/filters). */
  listKey: string;
  /** Total matching results on the server (from meta.total). */
  total: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  /** True while a page-1 (replace) fetch is in flight. */
  isFetching: boolean;
  fetchError: ErrorResponse["error"] | null;
  activeFilterCount: number;
  adoptInitialFeed: ReturnType<typeof useMovieListFeed>["adoptInitialFeed"];
  setActiveTab: (tab: Tab) => void;
  setQuery: (query: string) => void;
  toggleFiltersOpen: () => void;
  setFilters: (filters: Filters) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  retryFetch: () => void;
  loadMore: () => Promise<void>;
}

const MovieListContext = createContext<MovieListContextType | null>(null);

const SEARCH_DEBOUNCE_MS = 300;

export function MovieListProvider({
  initialMovies,
  initialMeta,
  initialTab,
  initialQuery,
  initialFilters,
  initialFilterOptions,
  deferInitialFetch = false,
  children,
}: {
  initialMovies: Movie[];
  initialMeta?: MoviesMeta;
  initialTab: Tab;
  initialQuery: string;
  initialFilters: Filters;
  initialFilterOptions: FilterOptions;
  deferInitialFetch?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocale();

  const [activeTab, setActiveTabState] = useState<Tab>(initialTab);
  const [query, setQueryState] = useState(initialQuery);
  const [appliedQuery, setAppliedQuery] = useState(initialQuery);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFiltersState] = useState<Filters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters);
  const [filterOptions, setFilterOptionsState] = useState(initialFilterOptions);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const feed = useMovieListFeed({
    initialTab,
    initialMovies,
    initialMeta,
    initialQuery,
    initialFilters,
    activeTab,
    appliedQuery,
    appliedFilters,
    locale,
    deferInitialFetch,
  });

  /* URL sync (debounced with the query — skipped on mount, SSR URL already
     matches). */
  const isFirstUrlSync = useRef(true);
  useEffect(() => {
    if (isFirstUrlSync.current) {
      isFirstUrlSync.current = false;
      return;
    }
    const params = writeParamsFromState(activeTab, appliedFilters, appliedQuery);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [activeTab, appliedFilters, appliedQuery, router, pathname]);

  /* Debounce cleanup on unmount. */
  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const setActiveTab = useCallback((tab: Tab) => setActiveTabState(tab), []);

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setAppliedQuery(q), SEARCH_DEBOUNCE_MS);
  }, []);

  const toggleFiltersOpen = useCallback(() => setFiltersOpen((previous) => !previous), []);

  const setFilters = useCallback((f: Filters) => setFiltersState(f), []);

  const adoptFilterOptions = useCallback(
    (catalog: keyof FilterOptions, options: FilterOptions[keyof FilterOptions]) => {
      setFilterOptionsState((previous) => ({ ...previous, [catalog]: options }));
    },
    [],
  );

  const applyFilters = useCallback(() => {
    setAppliedFilters(filters);
    setFiltersOpen(false);
  }, [filters]);

  const clearFilters = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setFiltersState(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setQueryState("");
    setAppliedQuery("");
  }, []);

  /* Filter count for the panel badge. */
  const activeFilterCount = [
    appliedFilters.genres.length > 0,
    /* the rating pair counts as one flag */
    !!(appliedFilters.ratingMin || appliedFilters.ratingMax),
    !!appliedFilters.length,
    !!appliedFilters.format,
    !!appliedFilters.ageRating,
    !!appliedFilters.releaseDate,
  ].filter(Boolean).length;

  return (
    <MovieListContext.Provider
      value={{
        activeTab,
        query,
        appliedQuery,
        filtersOpen,
        filters,
        appliedFilters,
        filterOptions,
        ...feed,
        activeFilterCount,
        setActiveTab,
        setQuery,
        toggleFiltersOpen,
        setFilters,
        adoptFilterOptions,
        applyFilters,
        clearFilters,
      }}
    >
      {children}
    </MovieListContext.Provider>
  );
}

/* ─── Hook ──────────────────────────────────────────────────── */

/** Catalog state for the movies page: tab, search, draft/applied filters, URL sync. */
export function useMovieList(): MovieListContextType {
  const ctx = useContext(MovieListContext);
  if (!ctx) throw new Error("useMovieList must be used within MovieListProvider");
  return ctx;
}
