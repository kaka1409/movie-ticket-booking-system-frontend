import { Skeleton, SkeletonCard } from "@/components/common/Skeleton";

function MovieCardSkeleton() {
  return (
    <div className="shrink-0 w-[130px]">
      <Skeleton className="w-full rounded-(--radius-lg)" style={{ aspectRatio: "2/3" }} />
      <Skeleton className="mt-2 h-3.5 w-3/4 rounded-full" />
      <Skeleton className="mt-1 h-2.5 w-1/2 rounded-full" />
    </div>
  );
}

function MovieRowSkeleton() {
  return (
    <section className="px-(--space-md)">
      <div className="mb-3 pl-1 flex items-center justify-between border-l-4 border-(--color-gold) rounded-(--radius-xs)">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-2.5 w-16 rounded-full" />
      </div>
      <div className="flex gap-3 overflow-hidden pb-(--space-sm)">
        {Array.from({ length: 4 }).map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

export default function HomeLoading() {
  return (
    <div className="min-h-dvh bg-(--color-bg) block md:hidden">
      <main className="pb-10 pt-2 space-y-8">
        {/* HeroBanner */}
        <Skeleton className="h-55 w-full" />

        {/* QuickBooking */}
        <div className="px-(--space-md)">
          <SkeletonCard>
            <div className="space-y-3">
              <Skeleton className="h-4 w-28 rounded-full" />
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-1">
                  <Skeleton className="h-2.5 w-16 rounded-full" />
                  <Skeleton className="h-9 w-full rounded-xl" />
                </div>
              ))}
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-12 shrink-0 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </SkeletonCard>
        </div>

        {/* SearchBar */}
        <div className="px-(--space-md)">
          <Skeleton className="h-11 w-full rounded-md" />
        </div>

        {/* MovieRow 1 */}
        <MovieRowSkeleton />

        {/* MovieRow 2 */}
        <MovieRowSkeleton />
      </main>
    </div>
  );
}
