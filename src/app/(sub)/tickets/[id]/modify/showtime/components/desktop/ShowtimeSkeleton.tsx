import { Skeleton } from "@/components/ui/Skeleton";

/** Shape of the desktop showtime step: current slot, search, eligible grid, rail. */
export default function ShowtimeSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
        <Skeleton className="h-8 w-64" />

        <div className="mt-6 space-y-4">
          <div className="h-12 rounded-xl border border-(--color-border) bg-(--color-surface-2) p-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </div>

          <Skeleton className="h-11 rounded-2xl" />

          <div className="space-y-2">
            <Skeleton className="h-3 w-48" />
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div />
          <div className="space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface-2) p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
