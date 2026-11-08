"use client";

import { useMemo, useState } from "react";
import { ADMIN_PAGE_SIZE } from "../constants";

export interface AdminTableSortState {
  key: string;
  direction: "asc" | "desc";
}

export type AdminSortValue = string | number | boolean | null | undefined;

/**
 * In-memory search + filters + sorting + paging for the console lists the
 * backend answers in full (catalogs, snacks, combos, cinemas, payment methods).
 * Lists that the backend paginates itself (movies, users, reviews) drive the
 * page from the URL instead — sorting there is a server concern.
 *
 * `rows` may already be narrowed by a filter the page owns — the count and the
 * page window follow whatever comes in. `matches` + `filters` add committed
 * filter chips on top of the search box; both reset to page 1 on change, like
 * `setSearch`. `getSortValue` powers header sorting: it maps a row + the
 * column's `sortKey` to a comparable value; `null`/`undefined` always sort last.
 */
export function useAdminTableState<TRow, TFilters extends object = Record<string, string>>({
  rows,
  getSearchText,
  matches,
  initialFilters,
  pageSize = ADMIN_PAGE_SIZE,
  getSortValue,
}: {
  rows: TRow[];
  /** Everything about a row the search box should match. */
  getSearchText: (row: TRow) => string;
  /** Committed-filter predicate; omitted means "no extra filters". */
  matches?: (row: TRow, filters: TFilters) => boolean;
  initialFilters?: TFilters;
  pageSize?: number;
  /** Row → comparable value for a `sortKey`; required for sorting to do anything. */
  getSortValue?: (row: TRow, key: string) => AdminSortValue;
}): {
  search: string;
  setSearch: (value: string) => void;
  filters: TFilters;
  setFilters: (filters: TFilters) => void;
  sort: AdminTableSortState | null;
  /** First click on a key sorts ascending; clicking the active key flips direction. */
  toggleSort: (key: string) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  visibleRows: TRow[];
  totalRows: number;
  totalPages: number;
} {
  const [search, setSearchValue] = useState("");
  const [filters, setFiltersValue] = useState<TFilters>(() => initialFilters ?? ({} as TFilters));
  const [sort, setSort] = useState<AdminTableSortState | null>(null);
  const [page, setPage] = useState(1);

  // A new query always restarts at the first page — otherwise a narrow result
  // set can leave the operator on an empty page 4.
  const [syncedSearch, setSyncedSearch] = useState(search);
  if (syncedSearch !== search) {
    setSyncedSearch(search);
    setPage(1);
  }

  const matchedRows = useMemo(() => {
    const filtered = matches ? rows.filter((row) => matches(row, filters)) : rows;
    const needle = search.trim().toLowerCase();
    const searched =
      needle === ""
        ? filtered
        : filtered.filter((row) => getSearchText(row).toLowerCase().includes(needle));
    if (!sort || !getSortValue) return searched;

    const direction = sort.direction === "asc" ? 1 : -1;
    return [...searched].sort((left, right) => {
      const a = getSortValue(left, sort.key);
      const b = getSortValue(right, sort.key);
      // Missing values always sink to the bottom, whichever way the arrow points.
      if (a == null && b == null) return 0;
      if (a == null) return 1;
      if (b == null) return -1;
      const compared =
        typeof a === "number" && typeof b === "number"
          ? a - b
          : String(a).localeCompare(String(b));
      return compared * direction;
    });
  }, [rows, search, getSearchText, matches, filters, sort, getSortValue]);

  const totalRows = matchedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;

  return {
    search,
    setSearch: setSearchValue,
    filters,
    setFilters: (next) => {
      setFiltersValue(next);
      setPage(1);
    },
    sort,
    toggleSort: (key) =>
      setSort((current) =>
        current?.key === key
          ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
          : { key, direction: "asc" },
      ),
    page: currentPage,
    setPage,
    pageSize,
    visibleRows: matchedRows.slice(startIndex, startIndex + pageSize),
    totalRows,
    totalPages,
  };
}
