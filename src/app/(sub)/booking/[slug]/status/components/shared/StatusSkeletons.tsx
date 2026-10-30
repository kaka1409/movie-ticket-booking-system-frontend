import { Skeleton, SurfaceSkeleton } from "@/components/ui/Skeleton";

/** Compact placeholder for the receipt streamed below the status heading. */
export function StatusReceiptSkeleton() {
  return (
    <div className="mx-4 h-72 animate-pulse rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 md:mx-0">
      <Skeleton className="h-36 w-full rounded-xl" />
      <div className="mt-5 space-y-3">
        <Skeleton className="h-3 w-2/3 rounded-full" />
        <Skeleton className="h-3 w-1/2 rounded-full" />
        <Skeleton className="h-3 w-3/4 rounded-full" />
      </div>
    </div>
  );
}

/** Desktop success route fallback: hero band + receipt card + side panel. */
export function DesktopSuccessSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8">
      <Skeleton className="h-9 w-48 rounded-md" />
      <Skeleton className="mt-2 h-4 w-72 rounded-full" />

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
          <div className="surface-raised space-y-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <SurfaceSkeleton raised className="h-3 w-24 rounded-full" />
                <SurfaceSkeleton raised className="h-3 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
          <div className="surface-raised space-y-3">
            <SurfaceSkeleton raised className="h-24 w-full rounded-xl" />
            <SurfaceSkeleton raised className="h-12 w-full rounded-2xl" />
            <SurfaceSkeleton raised className="h-12 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Desktop failure route fallback: hero band + failed receipt + side panel. */
export function DesktopFailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8">
      <Skeleton className="h-9 w-48 rounded-md" />
      <Skeleton className="mt-2 h-4 w-64 rounded-full" />

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
          <div className="surface-raised space-y-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <SurfaceSkeleton raised className="h-3 w-24 rounded-full" />
                <SurfaceSkeleton raised className="h-3 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
          <div className="surface-raised space-y-3">
            <SurfaceSkeleton raised className="h-12 w-full rounded-2xl" />
            <SurfaceSkeleton raised className="h-12 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
