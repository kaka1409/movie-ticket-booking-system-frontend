import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Shape of the modify type step: the stepper, the question, the three change
 * type cards and the limit notice — one column of skeletons, desktop framing.
 */
export default function ModifySkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
        <Skeleton className="h-8 w-64" />

        <div className="mt-8 space-y-3">
          <Skeleton className="h-4 w-64" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-(--color-border) bg-(--color-surface-2) p-4"
            >
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="mt-3 h-4 w-40" />
              <Skeleton className="mt-1 h-3 w-56" />
            </div>
          ))}
          <Skeleton className="h-3 w-72" />
        </div>
      </div>
    </div>
  );
}
