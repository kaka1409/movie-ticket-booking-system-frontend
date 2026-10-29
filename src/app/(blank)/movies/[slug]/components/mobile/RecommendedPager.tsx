"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Client-side pager for the mobile "you may also like" grid. The whole feed is
 * already loaded (the section streams a single `cache()` request), so changing
 * page only re-slices — no refetch, no URL change, no Suspense re-run.
 */
export default function RecommendedPager({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  // Guard against an unexpectedly large feed: render a compact label instead of
  // a row of dozens of dots.
  if (pageCount > 5) {
    return (
      <nav
        aria-label="Related movies pages"
        className="mt-4 flex items-center justify-center gap-3"
      >
        <button
          type="button"
          aria-label="Previous page"
          disabled={page === 0}
          onClick={() => onChange(page - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-(--color-border) text-(--color-text-secondary) transition-colors hover:text-(--color-gold-light) disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium text-(--color-text-secondary)">
          {page + 1} / {pageCount}
        </span>
        <button
          type="button"
          aria-label="Next page"
          disabled={page === pageCount - 1}
          onClick={() => onChange(page + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-(--color-border) text-(--color-text-secondary) transition-colors hover:text-(--color-gold-light) disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    );
  }

  return (
    <nav aria-label="Related movies pages" className="mt-4 flex items-center justify-center gap-1">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-(--color-text-secondary) transition-colors hover:text-(--color-gold-light) disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: pageCount }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Page ${index + 1}`}
          aria-current={index === page ? "page" : undefined}
          onClick={() => onChange(index)}
          className="flex h-8 w-8 items-center justify-center"
        >
          <span
            className={`block rounded-full transition ${
              index === page
                ? "h-2 w-4 bg-(--color-gold)"
                : "h-2 w-2 bg-(--color-border) hover:bg-(--color-text-muted)"
            }`}
          />
        </button>
      ))}
      <button
        type="button"
        aria-label="Next page"
        disabled={page === pageCount - 1}
        onClick={() => onChange(page + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-(--color-text-secondary) transition-colors hover:text-(--color-gold-light) disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
