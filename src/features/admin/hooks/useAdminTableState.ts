"use client";

import { useMemo, useState } from "react";
import { ADMIN_PAGE_SIZE } from "../constants";

/**
 * In-memory search + paging for the console lists the backend answers in full
 * (catalogs, snacks, combos, cinemas, payment methods). Lists that the backend
 * paginates itself (movies, users, reviews) drive the page from the URL instead.
 *
 * `rows` may already be narrowed by a filter the page owns — the count and the
 * page window follow whatever comes in.
 */
export function useAdminTableState<TRow>({
  rows,
  getSearchText,
  pageSize = ADMIN_PAGE_SIZE,
}: {
  rows: TRow[];
  /** Everything about a row the search box should match. */
  getSearchText: (row: TRow) => string;
  pageSize?: number;
}): {
  search: string;
  setSearch: (value: string) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  visibleRows: TRow[];
  totalRows: number;
  totalPages: number;
} {
  const [search, setSearchValue] = useState("");
  const [page, setPage] = useState(1);

  // A new query always restarts at the first page — otherwise a narrow result
  // set can leave the operator on an empty page 4.
  const [syncedSearch, setSyncedSearch] = useState(search);
  if (syncedSearch !== search) {
    setSyncedSearch(search);
    setPage(1);
  }

  const matchedRows = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (needle === "") return rows;
    return rows.filter((row) => getSearchText(row).toLowerCase().includes(needle));
  }, [rows, search, getSearchText]);

  const totalRows = matchedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;

  return {
    search,
    setSearch: setSearchValue,
    page: currentPage,
    setPage,
    pageSize,
    visibleRows: matchedRows.slice(startIndex, startIndex + pageSize),
    totalRows,
    totalPages,
  };
}
