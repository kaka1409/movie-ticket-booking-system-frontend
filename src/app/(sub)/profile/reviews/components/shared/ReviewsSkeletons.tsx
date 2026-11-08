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
      <div className="grid grid-cols-3 divide-x divide-(--color-border)/50">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 px-3 py-1 sm:gap-4 sm:px-5">
            <SurfaceSkeleton raised className="h-9 w-9 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <SurfaceSkeleton raised className="h-6 w-12 rounded-md" />
              <SurfaceSkeleton raised className="h-2.5 w-16 rounded-full" />
            </div>
          </div>
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
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <SurfaceSkeleton key={index} raised className="h-40 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
