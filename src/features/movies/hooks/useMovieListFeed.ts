"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ErrorResponse } from "@/libs/api";
import { buildMovieQuery, getMovies } from "../api";
import type { Filters, Movie, MoviesMeta, Tab } from "../types";

/** Result list of one tab, plus the key of the query it was fetched with. */
interface MovieListState {
  movies: Movie[];
  meta?: MoviesMeta;
  /** `null` = never fetched / failed, so the page-1 effect refetches. */
  queryKey: string | null;
}

/** What the movies page needs from the feed: rows, pager, loading and retry. */
export interface MovieListFeed {
  movies: Movie[];
  /** Total matching results on the server (from meta.total). */
  total: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  /** True while a page-1 (replace) fetch is in flight. */
  isFetching: boolean;
  fetchError: ErrorResponse["error"] | null;
  retryFetch: () => void;
  loadMore: () => Promise<void>;
}

function keyOf(query: string, filters: Filters, locale: "en" | "vn"): string {
  return JSON.stringify([
    locale,
    query,
    filters.genres,
    filters.ratingMin,
    filters.ratingMax,
    filters.length,
    filters.format,
    filters.ageRating,
    filters.releaseDate,
  ]);
}

/**
 * Catalog feed for the movies page: per-tab result lists, page-1 refetch on a
 * committed query/filter change, and cursor-free `loadMore` paging.
 *
 * Both device trees read the same provider, so the feed state lives here rather
 * than in either skin; the provider keeps the draft UI state (search box,
 * filter panel) beside it.
 */
export function useMovieListFeed({
  initialTab,
  initialMovies,
  initialMeta,
  initialQuery,
  initialFilters,
  activeTab,
  appliedQuery,
  appliedFilters,
  locale,
  deferInitialFetch = false,
}: {
  initialTab: Tab;
  initialMovies: Movie[];
  initialMeta?: MoviesMeta;
  initialQuery: string;
  initialFilters: Filters;
  activeTab: Tab;
  appliedQuery: string;
  appliedFilters: Filters;
  locale: "en" | "vn";
  deferInitialFetch?: boolean;
}): MovieListFeed {
  const initialKey = keyOf(initialQuery, initialFilters, locale);

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
  const skippedInitialFetchRef = useRef(false);

  const currentKey = keyOf(appliedQuery, appliedFilters, locale);

  /* Page-1 fetch: replace the active tab's list whenever the committed
     query/filters change (or on explicit retry). */
  useEffect(() => {
    if (deferInitialFetch && !skippedInitialFetchRef.current) {
      skippedInitialFetchRef.current = true;
      return;
    }
    const entry = lists[activeTab];
    if (entry.queryKey === currentKey) return; // list already fresh

    const seq = ++seqRef.current;
    let cancelled = false;

    getMovies(buildMovieQuery(activeTab, appliedQuery, appliedFilters, 1), locale)
      .then((result) => {
        if (cancelled || seq !== seqRef.current) return; // stale response
        if ("error" in result) {
          // Mark the key as attempted (stops the refetch loop) and surface
          // the error; retryFetch clears both and re-runs this effect.
          setFetchFailure({ key: currentKey, error: result.error });
          setLists((previous) => ({
            ...previous,
            [activeTab]: { ...previous[activeTab], queryKey: currentKey },
          }));
          return;
        }
        setFetchFailure(null);
        setLists((previous) => ({
          ...previous,
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
        setLists((previous) => ({
          ...previous,
          [activeTab]: { ...previous[activeTab], queryKey: currentKey },
        }));
      });

    return () => {
      cancelled = true;
    };
    // `lists` is intentionally included: after a successful fetch its
    // queryKey matches currentKey and the effect early-returns (no loop).
  }, [activeTab, appliedQuery, appliedFilters, currentKey, deferInitialFetch, fetchNonce, lists, locale]);

  const activeList = lists[activeTab];
  /**
   * The list is "fetching" exactly while its queryKey is stale for the
   * current query/filters — derived, so no loading state needs syncing.
   */
  const isFetching = activeList.queryKey !== currentKey;
  const fetchError = fetchFailure && fetchFailure.key === currentKey ? fetchFailure.error : null;
  const total = activeList.meta?.total ?? activeList.movies.length;

  const retryFetch = useCallback(() => {
    setFetchFailure(null);
    // Invalidate the current key so the fetch effect runs again.
    setLists((previous) => ({
      ...previous,
      [activeTab]: { ...previous[activeTab], queryKey: null },
    }));
    setFetchNonce((previousNonce) => previousNonce + 1);
  }, [activeTab]);

  const adoptInitialFeed = useCallback(
    (
      tab: Tab,
      query: string,
      filters: Filters,
      movies: Movie[],
      meta: MoviesMeta | undefined,
      error: ErrorResponse["error"] | null,
    ) => {
      const seedKey = keyOf(query, filters, locale);
      if (activeTab !== tab || currentKey !== seedKey) return;

      setLists((previous) => ({
        ...previous,
        [tab]: { movies, meta, queryKey: seedKey },
      }));
      setFetchFailure(error ? { key: seedKey, error } : null);
    },
    [activeTab, currentKey, locale],
  );

  const loadMore = useCallback(async () => {
    if (isLoadingMore || isFetching) return;
    const entry = lists[activeTab];
    if (!entry.meta?.hasNextPage || entry.queryKey !== currentKey) return;

    const queryKeyAtCall = currentKey;
    setIsLoadingMore(true);
    try {
      const result = await getMovies(
        buildMovieQuery(activeTab, appliedQuery, appliedFilters, (entry.meta.page ?? 1) + 1),
        locale,
      );
      if ("error" in result) {
        console.warn("loadMore failed:", result.error);
        return;
      }

      const fetched = result.data;
      setLists((previous) => {
        const current = previous[activeTab];
        // Query changed while paging → the page-1 effect owns the list now.
        if (current.queryKey !== queryKeyAtCall) return previous;
        const existingIds = new Set(current.movies.map((movie) => movie.id));
        return {
          ...previous,
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
  }, [
    isLoadingMore,
    isFetching,
    lists,
    activeTab,
    appliedQuery,
    appliedFilters,
    currentKey,
    locale,
  ]);

  return {
    movies: activeList.movies,
    total,
    hasMore: activeList.meta?.hasNextPage ?? false,
    isLoadingMore,
    isFetching,
    fetchError,
    retryFetch,
    adoptInitialFeed,
    loadMore,
  };
}
