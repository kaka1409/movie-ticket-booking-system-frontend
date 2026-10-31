import { Skeleton, SurfaceSkeleton } from "@/components/ui/Skeleton";

export function MobileReviewListSkeleton() {
  return (
    <div className="min-h-dvh max-w-md mx-auto bg-(--color-bg) block md:hidden">
      <main className="px-(--space-md) pb-10 pt-2 space-y-4">
        <div className="flex gap-3 overflow-hidden py-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-24 shrink-0 rounded-sm" />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-2xl" />
        ))}
      </main>
    </div>
  );
}

export function DesktopReviewsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SurfaceSkeleton key={index} raised className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-(--color-border)/50 pb-4">
        <SurfaceSkeleton raised className="h-3 w-40 rounded-full" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <SurfaceSkeleton key={index} raised className="h-8 w-20 rounded-sm" />
          ))}
        </div>
      </div>
      <div className="mt-5 space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SurfaceSkeleton key={index} raised className="h-32 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
