import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

/**
 * Fallbacks for the home page's streamed sections. Each one mirrors the exact
 * box its section paints (same container paddings, same aspect ratios) so a
 * section replacing its fallback never shifts the rows around it.
 *
 * `HomePageSkeleton` composes them in page order and doubles as the route-level
 * `loading.tsx` — one source, so navigation fallbacks and in-page fallbacks can
 * never drift apart.
 */

/** Desktop featured carousel. */
export function FeaturedHeroSkeleton() {
  return (
    <section className="mx-auto w-full max-w-7xl px-8 pt-6 pb-2">
      <Skeleton className="h-[360px] w-full rounded-(--radius-lg) md:h-[420px] lg:h-[480px]" />
    </section>
  );
}

/** Mobile featured banner. */
export function FeaturedBannerSkeleton() {
  return <Skeleton className="h-55 w-full" />;
}

/** Quick booking: the desktop card and the mobile widget, each in its own wrapper. */
export function QuickBookingSkeleton() {
  return (
    <>
      <section className="mx-auto hidden max-w-7xl px-8 pt-4 pb-2 md:block">
        <div className="rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) px-7 pb-5 pt-5 shadow-lg">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 lg:flex">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-2.5 w-20 rounded-full" />
                <Skeleton className="h-8 w-full rounded-(--radius-sm)" />
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-(--color-border) pt-4">
            <Skeleton className="h-3 w-28 rounded-full" />
            <Skeleton className="h-10 w-40 rounded-(--radius-md)" />
          </div>
        </div>
      </section>

      <div className="mx-(--space-md) mt-(--space-lg) block md:hidden">
        <SkeletonCard>
          <div className="space-y-3">
            <Skeleton className="h-5 w-36 rounded-full" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-1.5">
                <Skeleton className="h-2.5 w-16 rounded-full" />
                <Skeleton className="h-10 w-full rounded-(--radius-sm)" />
              </div>
            ))}
            <Skeleton className="h-12 w-full rounded-(--radius-sm)" />
          </div>
        </SkeletonCard>
      </div>
    </>
  );
}

/** Desktop poster grid — now showing and "For You" share the same card shape. */
export function MovieGridSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-8 pt-12 pb-4">
      <div className="mb-7 flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-52 rounded-full" />
          <Skeleton className="h-2.5 w-40 rounded-full" />
        </div>
        <Skeleton className="h-3 w-24 rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <article
            key={index}
            className="overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface)"
          >
            <Skeleton className="aspect-[2/3] w-full" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-3.5 w-3/4 rounded-full" />
              <Skeleton className="h-2.5 w-1/2 rounded-full" />
              <Skeleton className="mt-3 h-7 w-full rounded-(--radius-sm)" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/** Desktop coming-soon banners (3-up, landscape). */
export function ComingSoonSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-8 pt-12 pb-6">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-6 w-56 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface)"
          >
            <Skeleton className="aspect-[16/10] w-full" />
            <div className="flex items-center justify-between gap-3 p-3.5">
              <Skeleton className="h-2.5 w-2/3 rounded-full" />
              <Skeleton className="h-2.5 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Mobile horizontal movie row. */
export function MovieRowSkeleton() {
  return (
    <section className="px-(--space-md)">
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-2.5 w-16 rounded-full" />
      </div>
      <div className="flex gap-3 overflow-hidden pb-(--space-sm)">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="w-[130px] shrink-0 space-y-2">
            <Skeleton className="aspect-[2/3] w-full rounded-(--radius-lg)" />
            <Skeleton className="h-3 w-3/4 rounded-full" />
            <Skeleton className="h-2.5 w-1/2 rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

/** Mobile search bar placeholder (native form — no data, no boundary of its own). */
function SearchBarSkeleton() {
  return (
    <div className="mx-(--space-md)">
      <Skeleton className="h-11 w-full rounded-md" />
    </div>
  );
}

/** Whole-page fallback: the same node order and spacing as `home/page.tsx`. */
export function HomePageSkeleton() {
  return (
    <>
      <div className="block md:hidden">
        <FeaturedBannerSkeleton />
      </div>
      <div className="hidden md:block">
        <FeaturedHeroSkeleton />
      </div>

      <QuickBookingSkeleton />

      <div className="mt-(--space-lg) block md:hidden">
        <div className="flex flex-col gap-(--space-lg)">
          <SearchBarSkeleton />
          <MovieRowSkeleton />
          <MovieRowSkeleton />
        </div>
      </div>

      <div className="hidden md:block">
        <MovieGridSkeleton />
        <ComingSoonSkeleton />
        <MovieGridSkeleton />
      </div>
    </>
  );
}
