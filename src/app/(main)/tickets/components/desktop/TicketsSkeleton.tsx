import { SkeletonBar } from "@/components/ui/Skeleton";

function TicketStubSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-(--shadow-card)">
      <div className="flex gap-4 p-4">
        <SkeletonBar className="w-28 shrink-0 rounded-xl" style={{ aspectRatio: "2/3" }} />
        <div className="flex-1 space-y-3 pt-1">
          <SkeletonBar className="h-5 w-3/4 rounded-full" />
          <div className="space-y-2">
            <SkeletonBar className="h-3 w-40 rounded-full" />
            <SkeletonBar className="h-3 w-32 rounded-full" />
          </div>
          <div className="flex gap-2">
            <SkeletonBar className="h-6 w-16 rounded-full" />
            <SkeletonBar className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mx-4 border-t-2 border-dashed border-(--color-border)" />

      <div className="flex items-center justify-between gap-4 px-4 py-4">
        <div className="space-y-1">
          <SkeletonBar className="h-2.5 w-20 rounded-full" />
          <SkeletonBar className="h-3 w-32 rounded-full" />
        </div>
        <SkeletonBar className="h-11 w-32 rounded-xl" />
      </div>
    </div>
  );
}

/** Shape of the desktop tickets listing: title band with its tab links, then the panel of stubs. */
export default function TicketsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <SkeletonBar className="h-7 w-52 rounded" />
          <SkeletonBar className="h-4 w-24 rounded-full" />
        </div>
        <div className="flex gap-8">
          <SkeletonBar className="h-5 w-24 rounded-full" />
          <SkeletonBar className="h-5 w-20 rounded-full" />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
        <div className="surface-raised grid gap-5 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <TicketStubSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
