import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

/**
 * Fallbacks for the movie detail page's streamed blocks. Each mirrors the box
 * its section paints (header band, chip row, card spacing), so the hero,
 * synopsis and cast never move when showtimes or reviews land.
 */

/** Mobile showtimes: gold-bar header, day chips, two cinema cards. */
export function MobileShowtimesSkeleton() {
  return (
    <section className="space-y-3 px-4">
      <Skeleton className="h-4 w-28 rounded-full" />

      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-13 w-14 shrink-0 rounded-xl" />
        ))}
      </div>

      {Array.from({ length: 2 }).map((_, index) => (
        <SkeletonCard key={index} className="p-0">
          <div className="space-y-2 p-3">
            <Skeleton className="h-3 w-2/3 rounded-full" />
            <Skeleton className="h-2 w-1/2 rounded-full" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, chipIndex) => (
                <Skeleton key={chipIndex} className="h-6 w-14 rounded-full" />
              ))}
            </div>
          </div>
        </SkeletonCard>
      ))}
    </section>
  );
}

/** Mobile reviews: header, rating summary, two review cards. */
export function MobileReviewsSkeleton() {
  return (
    <section className="space-y-3 px-4">
      <Skeleton className="h-4 w-24 rounded-full" />

      <div className="flex items-center gap-5 py-1">
        <Skeleton className="h-16 w-16 shrink-0 rounded-full" />
        <div className="flex-1 space-y-1.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-1.5 w-full rounded-full" />
          ))}
        </div>
      </div>

      {Array.from({ length: 2 }).map((_, index) => (
        <SkeletonCard key={index}>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-3 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-24 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-full rounded-full" />
              <Skeleton className="h-2.5 w-3/4 rounded-full" />
            </div>
          </div>
        </SkeletonCard>
      ))}
    </section>
  );
}

/** Desktop rail: the showtime card (header, day chips, two cinema blocks, CTA). */
export function DesktopRailSkeleton() {
  return (
    <div className="rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface)">
      <div className="border-b border-(--color-border) px-5 pt-5 pb-4">
        <Skeleton className="h-4 w-28 rounded-full" />
      </div>

      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-13 rounded-(--radius-md)" />
          ))}
        </div>

        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3.5 w-40 rounded-full" />
            <Skeleton className="h-2.5 w-52 rounded-full" />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {Array.from({ length: 4 }).map((_, chipIndex) => (
                <Skeleton key={chipIndex} className="h-7 w-14 rounded-(--radius-sm)" />
              ))}
            </div>
          </div>
        ))}

        <Skeleton className="h-12 w-full rounded-(--radius-md)" />
      </div>
    </div>
  );
}

/** Bars the skeleton draws: a plausible distribution, only the silhouette matters. */
const DESKTOP_CHART_BAR_HEIGHTS = [30, 55, 40, 75, 50, 85, 65, 45, 20, 10];

/** Desktop content column: reviews header, rating panel (score + column chart), two wide review cards. */
export function DesktopReviewsSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-6 w-24 rounded-full" />

      <div className="flex items-center gap-8 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-5">
        <div className="flex shrink-0 flex-col items-center gap-2 border-r border-(--color-border) pr-8">
          <Skeleton className="h-10 w-20 rounded-lg" />
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-2.5 w-16 rounded-full" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex h-32 items-end gap-1.5 border-b border-(--color-border)">
            {DESKTOP_CHART_BAR_HEIGHTS.map((height, index) => (
              <Skeleton
                key={index}
                className="flex-1 rounded-t-sm"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="mt-1.5 flex gap-1.5">
            {Array.from({ length: DESKTOP_CHART_BAR_HEIGHTS.length }).map((_, index) => (
              <Skeleton key={index} className="h-2 flex-1 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <SkeletonCard className="h-40 p-5">{null}</SkeletonCard>
      <SkeletonCard className="h-52 p-5">{null}</SkeletonCard>
    </div>
  );
}

/** Mobile "you may also like": gold-bar header + 4 poster cards in 2 cols + pager. */
export function MobileRecommendedSkeleton() {
  return (
    <section className="space-y-3 px-4">
      <Skeleton className="h-4 w-32 rounded-full" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="aspect-[2/3] w-full rounded-(--radius-lg)" />
            <Skeleton className="h-3 w-4/5 rounded-full" />
            <Skeleton className="h-2.5 w-3/5 rounded-full" />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <span key={index} className="block h-2 w-2 rounded-full bg-(--color-border)" />
        ))}
      </div>
    </section>
  );
}

/** Desktop "you may also like": border-top + header + 6 poster cards. */
export function DesktopRecommendedSkeleton() {
  return (
    <section className="border-t border-(--color-border) pt-10 pb-16">
      <Skeleton className="mb-5 h-6 w-48 rounded-full" />
      <div className="grid grid-cols-3 gap-5 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
            <Skeleton className="h-3 w-4/5 rounded-full" />
            <Skeleton className="h-2.5 w-3/5 rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
