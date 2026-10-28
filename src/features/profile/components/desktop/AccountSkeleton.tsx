import { Skeleton } from "@/components/ui/Skeleton";
import type { ReactNode } from "react";

/**
 * Generic desktop account skeleton: header + sticky nav + raised panel. Used by
 * every account route's `loading.tsx` so the desktop (740+) never flashes empty
 * while the server segment streams in.
 */
export default function AccountSkeleton({ children }: { children?: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="min-w-0">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="mt-2 h-7 w-48 rounded-md" />
        <Skeleton className="mt-2 h-4 w-72 rounded-md" />
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-8">
        <div className="hidden rounded-2xl border border-(--color-border) bg-(--color-surface) p-2 lg:block">
          <div className="flex items-center gap-3 border-b border-(--color-border) px-2.5 py-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-2.5 w-32 rounded-md" />
            </div>
          </div>
          <div className="mt-2 space-y-1 p-1.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 rounded-xl px-2.5 py-2">
                <Skeleton className="h-7 w-7 rounded-lg" />
                <Skeleton className="h-3 w-28 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <section className="min-w-0 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
          {children ?? (
            <div className="surface-raised space-y-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-3 w-64 rounded-md" />
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-24 rounded-xl" />
                ))}
              </div>
              <Skeleton className="mt-6 h-40 rounded-xl" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
