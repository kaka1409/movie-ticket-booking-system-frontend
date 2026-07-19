import { Skeleton, SkeletonCard } from "@/components/common/Skeleton";

function ReviewCardSkeleton() {
  return (
    <SkeletonCard>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-16 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-3/4 rounded-full" />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="w-3.5 h-3.5 rounded-sm" />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-2.5 w-full rounded-full" />
          <Skeleton className="h-2.5 w-full rounded-full" />
          <Skeleton className="h-2.5 w-2/3 rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-2.5 w-20 rounded-full" />
          <Skeleton className="h-2.5 w-16 rounded-full" />
        </div>
      </div>
    </SkeletonCard>
  );
}

export default function ReviewsLoading() {
  return (
    <div className="min-h-dvh max-w-md mx-auto bg-(--color-bg) block md:hidden">
      <main className="px-(--space-md) pb-10 pt-2 space-y-4">
        {/* Filter bar */}
        <div className="flex gap-3 overflow-hidden py-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-24 shrink-0 rounded-sm" />
          ))}
        </div>

        {/* Review cards */}
        {Array.from({ length: 4 }).map((_, index) => (
          <ReviewCardSkeleton key={index} />
        ))}
      </main>
    </div>
  );
}
