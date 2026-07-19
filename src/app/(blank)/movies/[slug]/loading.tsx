import { Skeleton, SkeletonCard } from "@/components/common/Skeleton";

function CastMemberSkeleton() {
  return (
    <div className="shrink-0 flex flex-col items-center gap-2">
      <Skeleton className="w-16 h-16 rounded-full" />
      <Skeleton className="h-2.5 w-14 rounded-full" />
    </div>
  );
}

export default function MovieDetailLoading() {
  return (
    <div className="min-h-dvh bg-(--color-bg) block md:hidden">
      <main className="pb-10">
        {/* Hero */}
        <div className="relative">
          <Skeleton className="h-85 w-full" />
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute top-5 left-4">
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
          <div className="absolute top-5 right-4">
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
          <div className="absolute bottom-6 left-4 right-4 flex gap-4">
            <Skeleton className="w-20 h-28 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4 rounded-full" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-8 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-5 w-10 rounded-md" />
                <Skeleton className="h-5 w-14 rounded-md" />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="w-14 h-14 rounded-full" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8 py-6 pb-12 px-(--space-md)">
          {/* Synopsis */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-2.5 w-full rounded-full" />
              <Skeleton className="h-2.5 w-full rounded-full" />
              <Skeleton className="h-2.5 w-3/4 rounded-full" />
            </div>
          </div>

          {/* TopCast */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-24 rounded-full" />
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 5 }).map((_, index) => (
                <CastMemberSkeleton key={index} />
              ))}
            </div>
          </div>

          {/* Showtimes */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-28 rounded-full" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-9 w-14 shrink-0 rounded-xl" />
              ))}
            </div>
            {Array.from({ length: 2 }).map((_, index) => (
              <SkeletonCard key={index} className="p-0">
                <div className="p-3 space-y-2">
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
          </div>

          {/* Book CTA */}
          <Skeleton className="h-12 w-full rounded-2xl" />

          {/* Reviews */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-24 rounded-full" />
            {Array.from({ length: 2 }).map((_, index) => (
              <SkeletonCard key={index}>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-3 w-20 rounded-full" />
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Skeleton key={starIndex} className="w-3.5 h-3.5 rounded-sm" />
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-2.5 w-full rounded-full" />
                    <Skeleton className="h-2.5 w-3/4 rounded-full" />
                  </div>
                </div>
              </SkeletonCard>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
