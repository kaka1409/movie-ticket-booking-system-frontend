import {
  AdminSkeletonButton,
  AdminSkeletonSelect,
} from "@/app/(admin)/admin/components/shared/AdminSkeletons";

export default function ShowtimesSkeleton() {
  return (
    <div aria-hidden>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <AdminSkeletonSelect className="w-full sm:max-w-xs" />
        <div className="h-9 w-32 animate-pulse rounded-xl border border-(--color-border) bg-(--color-surface-2)" />
        <AdminSkeletonButton />
        <AdminSkeletonButton className="ml-auto" />
      </div>

      <div className="animate-pulse rounded-2xl border border-(--color-border) bg-(--color-surface) p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-2) px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded bg-(--color-surface)" />
              <div className="h-3.5 w-24 rounded bg-(--color-surface)" />
              <div className="h-3 w-12 rounded-full bg-(--color-surface)" />
              <div className="h-3 w-32 rounded bg-(--color-surface)" />
            </div>
            <div className="flex gap-1">
              <div className="h-7 w-7 rounded-lg bg-(--color-surface)" />
              <div className="h-7 w-7 rounded-lg bg-(--color-surface)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
