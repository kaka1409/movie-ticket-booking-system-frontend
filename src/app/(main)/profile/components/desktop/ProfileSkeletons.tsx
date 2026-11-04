import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Fallbacks for the desktop overview's streamed blocks. Each mirrors the box its
 * section paints (same grid, same paddings) so a landing section never shifts
 * the blocks around it.
 */

/** The three activity tiles (`AccountStats`). */
export function AccountStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
          <Skeleton className="mt-4 h-8 w-16 rounded-md" />
          <Skeleton className="mt-2 h-3 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/** A single activity count, streamed independently inside its tile. */
export function AccountStatValueSkeleton() {
  return <Skeleton className="inline-block h-8 w-16 rounded-md align-middle" />;
}

/** The next-screening widget in its booked state (the taller of the two). */
export function NextScreeningSkeleton() {
  return (
    <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
      <div className="flex items-center justify-between border-b border-(--color-border)/50 pb-3 mb-4">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-3 w-20 rounded-full" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Skeleton className="w-24 shrink-0 rounded-xl" style={{ aspectRatio: "2/3" }} />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-6 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-56 rounded-full" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
        <Skeleton className="h-10 w-28 shrink-0 rounded-xl" />
      </div>
    </section>
  );
}

/**
 * The overview body in the order `ProfileContent` paints it: next screening,
 * then the three activity tiles, then the personal/security pair.
 */
export function ProfileOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <NextScreeningSkeleton />
      <AccountStatsSkeleton />

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <section
            key={index}
            className="flex flex-col justify-between rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card)"
          >
            <div>
              <div className="mb-4 flex items-center justify-between border-b border-(--color-border)/50 pb-3">
                <Skeleton className="h-3 w-28 rounded-full" />
                <Skeleton className="h-3 w-20 rounded-full" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, rowIndex) => (
                  <div key={rowIndex} className="min-w-0">
                    <Skeleton className="h-2.5 w-16 rounded-full" />
                    <Skeleton className="mt-1.5 h-3.5 w-24 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {index === 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-(--color-border)/40 pt-4">
                <Skeleton className="h-3 w-24 rounded-full" />
                <Skeleton className="h-9 w-32 rounded-xl" />
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
