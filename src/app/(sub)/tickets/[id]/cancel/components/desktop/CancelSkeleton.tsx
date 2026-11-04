import { Skeleton } from "@/components/ui/Skeleton";

/** Shape of the desktop cancel step: ticket summary beside the inline policy rail. */
export default function CancelSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <Skeleton className="h-3 w-28 rounded-full" />
      <Skeleton className="mt-3 h-2.5 w-20 rounded-full" />
      <Skeleton className="mt-1.5 h-7 w-64 rounded" />

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
        <div className="min-w-0 space-y-5">
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 lg:p-6">
            <Skeleton className="h-2.5 w-24 rounded-full" />
            <div className="mt-3 flex gap-3">
              <Skeleton className="h-24 w-16 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-4 w-1/2 rounded-full" />
                <Skeleton className="h-3 w-2/3 rounded-full" />
                <Skeleton className="h-3 w-1/2 rounded-full" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-2.5 w-16 rounded-full" />
              <Skeleton className="h-3 w-1/2 rounded-full" />
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex justify-between">
                <Skeleton className="h-3 w-28 rounded-full" />
                <Skeleton className="h-3 w-20 rounded-full" />
              </div>
            ))}
            <div className="flex justify-between border-t border-(--color-border) pt-3">
              <Skeleton className="h-3.5 w-24 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-full" />
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:sticky lg:top-24">
          <Skeleton className="h-4 w-40 rounded-full" />
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-3 w-full rounded-full" />
          ))}
          <Skeleton className="h-12 w-full rounded-2xl" />
        </aside>
      </div>
    </div>
  );
}
