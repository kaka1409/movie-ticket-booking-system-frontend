import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import AccountSkeleton from "@/components/shared/profile/desktop/AccountSkeleton";

function WishlistCardSkeleton() {
  return (
    <SkeletonCard className="overflow-hidden p-0">
      <Skeleton className="w-full" style={{ aspectRatio: "3/4" }} />
      <div className="space-y-2 px-4 pt-2 pb-4">
        <Skeleton className="h-4 w-3/4 rounded-full" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-3 w-8 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </SkeletonCard>
  );
}

/** Responsive fallback for the streamed wishlist feed. */
export default function WishlistPageSkeleton() {
  return (
    <>
      <div className="block min-h-dvh max-w-md bg-(--color-bg) md:hidden">
        <main className="space-y-4 px-(--space-md) pt-4 pb-10">
          {Array.from({ length: 3 }).map((_, index) => (
            <WishlistCardSkeleton key={index} />
          ))}
        </main>
      </div>
      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
          <AccountSkeleton />
        </div>
      </div>
    </>
  );
}
