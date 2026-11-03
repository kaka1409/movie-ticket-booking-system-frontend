"use client";

import type { RatingBreakdown } from "@/features/reviews/types";

/**
 * The movie's rating distribution as a column chart: one bar per score, low to
 * high. Heights scale to the busiest score rather than to 100%, so a movie with
 * a handful of reviews still reads as a shape instead of ten slivers.
 */
export default function RatingChart({ breakdown }: { breakdown: RatingBreakdown[] }) {
  const columns = [...breakdown].sort((left, right) => left.stars - right.stars);
  const busiest = Math.max(1, ...columns.map((column) => column.count));

  return (
    <div>
      <div className="flex h-32 items-end gap-1.5 border-b border-(--color-border)">
        {columns.map((column) => {
          const height = column.count > 0 ? Math.max((column.count / busiest) * 100, 4) : 0;

          return (
            <div key={column.stars} className="group flex h-full flex-1 items-end justify-center">
              <div
                className="relative w-full rounded-t-sm bg-(--color-gold) transition-colors duration-150 group-hover:bg-(--color-gold-light)"
                style={{ height: `${height}%` }}
              >
                {column.count > 0 && (
                  <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 text-3xs font-bold whitespace-nowrap tabular-nums text-(--color-text-primary) opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    {column.count}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-1.5 flex gap-1.5">
        {columns.map((column) => (
          <span
            key={column.stars}
            className="flex-1 text-center text-3xs font-semibold text-(--color-text-muted)"
          >
            {column.stars}
          </span>
        ))}
      </div>

      {/* The bars are decorative; this list is what a screen reader reads. */}
      <ul className="sr-only">
        {columns.map((column) => (
          <li key={column.stars}>
            {column.stars}/10 — {column.count}
          </li>
        ))}
      </ul>
    </div>
  );
}
