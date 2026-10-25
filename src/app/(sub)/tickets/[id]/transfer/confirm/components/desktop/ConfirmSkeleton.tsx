import { Skeleton } from "@/components/ui/Skeleton";

/** Shape of the desktop transfer-confirm step: the ticket beside the recipient and the submit rail. */
export default function ConfirmSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <Skeleton className="h-3 w-28 rounded-full" />
      <Skeleton className="mt-3 h-7 w-64 rounded" />

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
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
          <div className="my-4 border-t-2 border-dashed border-(--color-border)" />
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <Skeleton className="h-3 w-28 rounded-full" />
                <Skeleton className="h-3 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
          <Skeleton className="h-3 w-24 rounded-full" />
          <div className="flex items-center gap-3.5">
            <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2 rounded-full" />
              <Skeleton className="h-3 w-2/3 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
