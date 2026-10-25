import { Skeleton } from "@/components/ui/Skeleton";

/** Shape of the desktop seats step: context card, map, rail with the CTA gate. */
export default function SeatSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
        <Skeleton className="h-8 w-64" />

        <div className="mt-6">
          <div className="mx-auto w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-surface-2) p-5">
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div />
          <div className="space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface-2) p-5">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
