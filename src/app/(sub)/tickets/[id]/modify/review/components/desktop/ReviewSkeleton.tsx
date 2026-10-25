import { Skeleton } from "@/components/ui/Skeleton";

/** Shape of the desktop review step: the change comparison, rail with the confirm. */
export default function ReviewSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
        <Skeleton className="h-8 w-64" />

        <div className="mt-6 space-y-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
