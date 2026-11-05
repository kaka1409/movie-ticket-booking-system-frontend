import { Skeleton } from "@/components/ui/Skeleton";
import type { ReactNode } from "react";

/**
 * Generic desktop account skeleton:
 * Matches the Header Hero + Horizontal Tabs geometry so desktop (740px+)
 * transitions smoothly with zero cumulative layout shift.
 */
export default function AccountSkeleton({ children }: { children?: ReactNode }) {
  return (
    <div className="min-w-0" aria-busy="true">
      {/* 1. Hero Header Skeleton */}
      <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <Skeleton className="h-20 w-20 rounded-full lg:h-24 lg:w-24" />
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-48 rounded-lg" />
                <Skeleton className="h-5 w-32 rounded-full" />
              </div>
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-3 w-28 rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* 2. Horizontal Tabs Skeleton — `AccountTabs`: icon + label per item, `p-4` */}
      <div className="mt-4 flex gap-1 overflow-hidden border-b border-(--color-border)">
        {["w-12", "w-16", "w-14", "w-20", "w-16"].map((width, index) => (
          <div key={`${width}-${index}`} className="flex h-[52px] shrink-0 items-center gap-1.5 px-4">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className={`h-4 ${width} rounded-full`} />
          </div>
        ))}
      </div>

      {/* 3. Content Area Skeleton */}
      <div className="mt-8 min-w-0">
        <div className="mb-6 space-y-2">
          <Skeleton className="h-[26px] w-48 rounded-md" />
          <Skeleton className="h-3 w-72 max-w-full rounded-full" />
        </div>
        {children ?? (
          <div className="space-y-6">
            <Skeleton className="h-44 w-full rounded-2xl" />
            <div className="grid gap-6 lg:grid-cols-2">
              <Skeleton className="h-56 rounded-2xl" />
              <Skeleton className="h-56 rounded-2xl" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
