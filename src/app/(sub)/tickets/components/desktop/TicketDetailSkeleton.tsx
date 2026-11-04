import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Shape of the desktop ticket detail: identity band, the boarding pass (branding
 * bar, hero, seat chips, tear line, payment summary) and the QR/actions rail.
 */
export default function TicketDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="h-7 w-64 rounded" />
        <Skeleton className="h-4 w-80 rounded-full" />
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-10">
        <main className="min-w-0 overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)">
          <div className="flex items-center justify-between border-b border-(--color-border)/60 bg-(--color-surface-2)/60 px-6 py-3.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-full" />
            </div>
            <Skeleton className="h-3 w-32 rounded-full" />
          </div>

          <div className="flex flex-col gap-6 p-6 sm:flex-row">
            <Skeleton className="w-36 shrink-0 rounded-xl" style={{ aspectRatio: "2/3" }} />

            <div className="min-w-0 flex-1">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-14 rounded-md" />
                <Skeleton className="h-5 w-10 rounded-md" />
              </div>

              <Skeleton className="mt-3 h-7 w-2/3 rounded-md" />

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Skeleton className="h-[62px] rounded-xl" />
                <Skeleton className="h-[62px] rounded-xl" />
              </div>

              <div className="mt-4 border-t border-(--color-border)/50 pt-4">
                <Skeleton className="h-3 w-16 rounded-full" />
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-7 w-16 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-6 border-t-2 border-dashed border-(--color-border)" />

          <div className="space-y-3 p-6">
            <Skeleton className="h-3 w-28 rounded-full" />
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <Skeleton className="h-3 w-28 rounded-full" />
                <Skeleton className="h-3 w-20 rounded-full" />
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-(--color-border) pt-3">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-full" />
            </div>
          </div>
        </main>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="mx-auto mt-3 h-3 w-40 rounded-full" />
          </div>

          <div className="space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </aside>
      </div>
    </div>
  );
}
