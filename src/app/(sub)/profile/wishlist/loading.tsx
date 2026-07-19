import { Skeleton, SkeletonCard } from "@/components/common/Skeleton";

function WishlistCardSkeleton() {
  return (
    <SkeletonCard className="overflow-hidden p-0">
      <Skeleton className="w-full" style={{ aspectRatio: "3/4" }} />
      <div className="px-4 pb-4 pt-2 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded-full" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-4 h-4 rounded-sm" />
          <Skeleton className="h-3 w-8 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </SkeletonCard>
  );
}

export default function WishlistLoading() {
  return (
    <div className="min-h-dvh max-w-md mx-auto bg-(--color-bg) block md:hidden">
      <main className="px-(--space-md) pb-10 pt-4 space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <WishlistCardSkeleton key={index} />
        ))}
      </main>
    </div>
  );
}
