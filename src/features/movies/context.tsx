"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  DEFAULT_FILTERS,
} from "./constants";
import type {
  Tab,
  Filters,
} from "./types";

/* ─── Context Type ──────────────────────────────────────────── */

interface MoviesContextType {
  activeTab: Tab;
  query: string;
  filtersOpen: boolean;
  filters: Filters;
  appliedFilters: Filters;
  visibleCount: number;
  activeFilterCount: number;
  setActiveTab: (tab: Tab) => void;
  setQuery: (query: string) => void;
  toggleFiltersOpen: () => void;
  setFilters: (filters: Filters) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  loadMore: () => void;
}

const MoviesContext = createContext<MoviesContextType | null>(null);

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

export function MoviesProvider({ children }: { children: ReactNode }) {
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
  const [visibleCount, setVisibleCount] = useState(4);

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
      setVisibleCount(4);
      updateURL(tab, filters);
    },
    [filters, updateURL],
  );

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    setVisibleCount(4);
  }, []);

  const toggleFiltersOpen = useCallback(() => setFiltersOpen((v) => !v), []);

  const setFilters = useCallback((f: Filters) => setFiltersState(f), []);

  const applyFilters = useCallback(() => {
    setAppliedFilters(filters);
    setFiltersOpen(false);
    setVisibleCount(4);
    updateURL(activeTab, filters);
  }, [activeTab, filters, updateURL]);

  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setVisibleCount(4);
    updateURL(activeTab, DEFAULT_FILTERS);
  }, [activeTab, updateURL]);

  const loadMore = useCallback(() => setVisibleCount((c) => c + 4), []);

  /* ── Derived ── */
  const activeFilterCount = [
    appliedFilters.genres.length > 0,
    !!appliedFilters.rating,
    !!appliedFilters.length,
    appliedFilters.format !== "" && appliedFilters.format !== "2D",
    !!appliedFilters.ageRating,
  ].filter(Boolean).length;

  return (
    <MoviesContext.Provider
      value={{
        activeTab,
        query,
        filtersOpen,
        filters,
        appliedFilters,
        visibleCount,
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
    </MoviesContext.Provider>
  );
}

/* ─── Hook ──────────────────────────────────────────────────── */

export function useMovies(): MoviesContextType {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("useMovies must be used within MoviesProvider");
  return ctx;
}
