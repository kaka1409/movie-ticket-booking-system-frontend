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
import { DEFAULT_FILTERS } from "./constants";
import { buildMovieQuery, getMovies } from "./api";
import { writeParamsFromState } from "./url";
import type { Tab, Filters, Movie, MoviesMeta, FilterOptions } from "./types";
import type { ErrorResponse } from "@/libs/api";

/* ─── Movie list — trang /movies ────────────────────────────── */

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
  movies: Movie[];
  /** Total matching results on the server (from meta.total). */
  total: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  /** True while a page-1 (replace) fetch is in flight. */
  isFetching: boolean;
  fetchError: ErrorResponse["error"] | null;
  activeFilterCount: number;
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

/* ─── Provider ──────────────────────────────────────────────── */

interface MovieListState {
  movies: Movie[];
  meta?: MoviesMeta;
  /** Key of the (query, filters) this list was fetched with — null = never fetched / failed. */
  queryKey: string | null;
}

const SEARCH_DEBOUNCE_MS = 300;

function keyOf(query: string, filters: Filters): string {
  return JSON.stringify([
    query,
    filters.genres,
    filters.rating,
    filters.length,
    filters.format,
    filters.ageRating,
    filters.releaseDate,
  ]);
}

export function MovieListProvider({
  initialMovies,
  initialMeta,
  initialTab,
  initialQuery,
  initialFilters,
  initialFilterOptions,
  children,
}: {
  initialMovies: Movie[];
  initialMeta?: MoviesMeta;
  initialTab: Tab;
  initialQuery: string;
  initialFilters: Filters;
  initialFilterOptions: FilterOptions;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const initialKey = keyOf(initialQuery, initialFilters);

  /* ── State ── */
  const [activeTab, setActiveTabState] = useState<Tab>(initialTab);
  const [query, setQueryState] = useState(initialQuery);
  const [appliedQuery, setAppliedQuery] = useState(initialQuery);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFiltersState] = useState<Filters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters);
  const [lists, setLists] = useState<Record<Tab, MovieListState>>({
    now_showing:
      initialTab === "now_showing"
        ? {
            movies: initialMovies,
            meta: initialMeta,
            queryKey: initialMeta ? initialKey : null,
          }
        : { movies: [], meta: undefined, queryKey: null },
    coming_soon:
      initialTab === "coming_soon"
        ? {
            movies: initialMovies,
            meta: initialMeta,
            queryKey: initialMeta ? initialKey : null,
          }
        : { movies: [], meta: undefined, queryKey: null },
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  /**
   * Fetch failures are stored with the key they belong to, so the effect never
   * needs a synchronous setState to clear them (react-hooks/set-state-in-effect).
   */
  const [fetchFailure, setFetchFailure] = useState<{
    key: string;
    error: ErrorResponse["error"];
  } | null>(null);
  const [fetchNonce, setFetchNonce] = useState(0);

  /** Monotonic sequence — only the latest page-1 request may write state. */
  const seqRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Page-1 fetch: replace the active tab's list whenever the
        committed query/filters change (or on explicit retry) ── */
  const currentKey = keyOf(appliedQuery, appliedFilters);

  useEffect(() => {
    const entry = lists[activeTab];
    if (entry.queryKey === currentKey) return; // list already fresh

    const seq = ++seqRef.current;
    let cancelled = false;

    getMovies(buildMovieQuery(activeTab, appliedQuery, appliedFilters, 1))
      .then((result) => {
        if (cancelled || seq !== seqRef.current) return; // stale response
        if ("error" in result) {
          // Mark the key as attempted (stops the refetch loop) and surface
          // the error; retryFetch clears both and re-runs this effect.
          setFetchFailure({ key: currentKey, error: result.error });
          setLists((prev) => ({
            ...prev,
            [activeTab]: { ...prev[activeTab], queryKey: currentKey },
          }));
          return;
        }
        setFetchFailure(null);
        setLists((prev) => ({
          ...prev,
          [activeTab]: {
            movies: result.data,
            meta: result.meta,
            queryKey: currentKey,
          },
        }));
      })
      .catch(() => {
        // Defensive: apiFetch should never reject, but a thrown error here
        // would otherwise become an unhandled rejection.
        if (cancelled || seq !== seqRef.current) return;
        setFetchFailure({
          key: currentKey,
          error: { status: 0, code: "NETWORK_ERROR", message: "Network error" },
        });
        setLists((prev) => ({
          ...prev,
          [activeTab]: { ...prev[activeTab], queryKey: currentKey },
        }));
      });

    return () => {
      cancelled = true;
    };
    // `lists` is intentionally included: after a successful fetch its
    // queryKey matches currentKey and the effect early-returns (no loop).
  }, [activeTab, appliedQuery, appliedFilters, currentKey, fetchNonce, lists]);

  /* ── URL sync (debounced with the query — skipped on mount, SSR URL
        already matches) ── */
  const isFirstUrlSync = useRef(true);
  useEffect(() => {
    if (isFirstUrlSync.current) {
      isFirstUrlSync.current = false;
      return;
    }
    const params = writeParamsFromState(activeTab, appliedFilters, appliedQuery);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [activeTab, appliedFilters, appliedQuery, router, pathname]);

  /* ── Debounce cleanup on unmount ── */
  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  /* ── Derived ── */
  const activeList = lists[activeTab];
  /**
   * The list is "fetching" exactly while its queryKey is stale for the
   * current query/filters — derived, so no loading state needs syncing.
   */
  const isFetching = activeList.queryKey !== currentKey;
  const fetchError = fetchFailure && fetchFailure.key === currentKey ? fetchFailure.error : null;
  const total = activeList.meta?.total ?? activeList.movies.length;

  /* ── Actions ── */
  const setActiveTab = useCallback((tab: Tab) => setActiveTabState(tab), []);

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setAppliedQuery(q), SEARCH_DEBOUNCE_MS);
  }, []);

  const toggleFiltersOpen = useCallback(() => setFiltersOpen((v) => !v), []);

  const setFilters = useCallback((f: Filters) => setFiltersState(f), []);

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

  const retryFetch = useCallback(() => {
    setFetchFailure(null);
    // Invalidate the current key so the fetch effect runs again.
    setLists((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], queryKey: null } }));
    setFetchNonce((n) => n + 1);
  }, [activeTab]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || isFetching) return;
    const entry = lists[activeTab];
    if (!entry.meta?.hasNextPage || entry.queryKey !== currentKey) return;

    const queryKeyAtCall = currentKey;
    setIsLoadingMore(true);
    try {
      const result = await getMovies(
        buildMovieQuery(activeTab, appliedQuery, appliedFilters, (entry.meta.page ?? 1) + 1),
      );
      if ("error" in result) {
        console.warn("loadMore failed:", result.error);
        return;
      }

      const fetched = result.data;
      setLists((prev) => {
        const current = prev[activeTab];
        // Query changed while paging → the page-1 effect owns the list now.
        if (current.queryKey !== queryKeyAtCall) return prev;
        const existingIds = new Set(current.movies.map((movie) => movie.id));
        return {
          ...prev,
          [activeTab]: {
            movies: [...current.movies, ...fetched.filter((movie) => !existingIds.has(movie.id))],
            meta: result.meta ?? current.meta,
            queryKey: current.queryKey,
          },
        };
      });
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, isFetching, lists, activeTab, appliedQuery, appliedFilters, currentKey]);

  /* ── Filter count for the panel badge ── */
  const activeFilterCount = [
    appliedFilters.genres.length > 0,
    !!appliedFilters.rating,
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
        filterOptions: initialFilterOptions,
        movies: activeList.movies,
        total,
        hasMore: activeList.meta?.hasNextPage ?? false,
        isLoadingMore,
        isFetching,
        fetchError,
        activeFilterCount,
        setActiveTab,
        setQuery,
        toggleFiltersOpen,
        setFilters,
        applyFilters,
        clearFilters,
        retryFetch,
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

export function MovieDetailProvider({ movie, children }: { movie: Movie; children: ReactNode }) {
  return <MovieDetailContext.Provider value={movie}>{children}</MovieDetailContext.Provider>;
}

export function useMovieDetail(): Movie {
  const ctx = useContext(MovieDetailContext);
  if (!ctx) throw new Error("useMovieDetail must be used within MovieDetailProvider");
  return ctx;
}

/* ─── Showtime selection — booking preselection ─────────────── */

export interface ShowtimeSelection {
  showtimeId?: string;
  cinemaId: string;
  time: string;
  date: string;
}

interface MovieSelectionContextType {
  selectedShowtime: ShowtimeSelection | null;
  setSelectedShowtime: (selection: ShowtimeSelection | null) => void;
}

const MovieSelectionContext = createContext<MovieSelectionContextType | null>(null);

export function MovieSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeSelection | null>(null);

  return (
    <MovieSelectionContext.Provider value={{ selectedShowtime, setSelectedShowtime }}>
      {children}
    </MovieSelectionContext.Provider>
  );
}

export function useMovieSelection(): MovieSelectionContextType {
  const ctx = useContext(MovieSelectionContext);
  if (!ctx) throw new Error("useMovieSelection must be used within MovieSelectionProvider");
  return ctx;
}
