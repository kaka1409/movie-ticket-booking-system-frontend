import { Skeleton, SkeletonBar } from "@/components/ui/Skeleton";

/**
 * Fallbacks for the movies catalog. Each mirrors the box its section paints
 * (same container paddings, same grid and aspect ratios), so the swap from
 * skeleton to rows never shifts the page.
 */

function MoviePosterSkeleton() {
  return (
    <div>
      <Skeleton className="w-full rounded-(--radius-lg)" style={{ aspectRatio: "2/3" }} />
      <Skeleton className="mt-2 h-3.5 w-3/4 rounded-full" />
      <Skeleton className="mt-1 h-2.5 w-1/2 rounded-full" />
    </div>
  );
}

/** Mobile: tab chips, search field, filter chips, poster grid. */
export function MobileMoviesSkeleton() {
  return (
    <div className="min-h-dvh bg-(--color-bg) px-(--space-md)">
      <div className="space-y-4 pt-2 pb-10">
        <div className="flex gap-3">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>

        <Skeleton className="h-11 w-full rounded-xl" />

        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-20 shrink-0 rounded-xl" />
          ))}
        </div>

        <Skeleton className="h-3 w-24 rounded-full" />

        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <MoviePosterSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Desktop: title band over the filter card + list panel (one column until `lg:`). */
export function DesktopMoviesSkeleton() {
  return (
    <div className="bg-(--color-bg)">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
        <div>
          <Skeleton className="h-[26px] w-48 rounded-md" />
          <Skeleton className="mt-2 h-3 w-28 rounded-full" />
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-2.5 w-20 rounded-full" />
                  <Skeleton className="h-8 w-full rounded-(--radius-sm)" />
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
            <div className="surface-raised">
              <div className="flex items-end justify-between gap-6">
                <div className="flex gap-6">
                  <SkeletonBar className="h-5 w-24 rounded-full" />
                  <SkeletonBar className="h-5 w-24 rounded-full" />
                </div>
                <SkeletonBar className="h-10 w-full max-w-sm rounded-xl" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <MoviePosterSkeleton key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Route fallback: both device trees, so navigation and streaming share one shape. */
export default function MoviesPageSkeleton() {
  return (
    <>
      <div className="block md:hidden">
        <MobileMoviesSkeleton />
      </div>
      <div className="hidden md:block">
        <DesktopMoviesSkeleton />
      </div>
    </>
  );
}
