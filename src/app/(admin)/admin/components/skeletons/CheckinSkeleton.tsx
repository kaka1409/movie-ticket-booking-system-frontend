import { AdminSkeletonButton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";

export default function CheckinSkeleton() {
  return (
    <div
      className="animate-pulse rounded-2xl border border-(--color-border) bg-(--color-surface) p-5"
      aria-hidden
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="space-y-2">
          <div className="h-2.5 w-20 rounded bg-(--color-surface-2)" />
          <div className="h-9 rounded-xl border border-(--color-border) bg-(--color-surface-2)" />
          <div className="h-2.5 w-48 rounded bg-(--color-surface-2)" />
        </div>
        <div className="flex items-end">
          <AdminSkeletonButton className="w-28" />
        </div>
      </div>
      <div className="mt-4 h-24 rounded-xl border border-(--color-border) bg-(--color-surface-2)" />
    </div>
  );
}
