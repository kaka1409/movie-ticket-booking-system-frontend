import { Skeleton } from "@/components/common/Skeleton";

function MovieGridCardSkeleton() {
  return (
    <div>
      <Skeleton className="w-full rounded-(--radius-lg)" style={{ aspectRatio: "2/3" }} />
      <Skeleton className="mt-2 h-3.5 w-3/4 rounded-full" />
      <Skeleton className="mt-1 h-2.5 w-1/2 rounded-full" />
    </div>
  );
}

export default function MoviesLoading() {
  return (
    <div className="min-h-dvh bg-(--color-bg) px-(--space-md)">
      <div className="space-y-4 pt-2 pb-10">
        {/* Tabs */}
        <div className="flex gap-3">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>

        {/* SearchBar */}
        <Skeleton className="h-11 w-full rounded-xl" />

        {/* Filter chips */}
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-20 shrink-0 rounded-xl" />
          ))}
        </div>

        {/* Results count */}
        <Skeleton className="h-3 w-24 rounded-full" />

        {/* MovieGrid - 2 columns */}
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <MovieGridCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
