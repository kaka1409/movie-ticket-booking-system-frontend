import ModifyPanelSkeleton from "@/app/(sub)/tickets/components/desktop/ModifyPanelSkeleton";
import { SkeletonBar } from "@/components/ui/Skeleton";

/**
 * Shape of the desktop review step: the side-by-side change cards in the content
 * column, the new total in the rail. A modification is a same-price swap, so
 * there is no payment block.
 */
export default function ReviewSkeleton() {
  return (
    <ModifyPanelSkeleton
      summary={
        <div className="space-y-3">
          <SkeletonBar className="h-2.5 w-24 rounded-full" />
          <SkeletonBar className="h-3.5 w-2/3 rounded-full" />
          <div className="flex justify-end">
            <SkeletonBar className="h-4 w-24 rounded-md" />
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <SkeletonBar className="h-7 w-44 rounded-md" />
        <SkeletonBar className="h-2.5 w-32 rounded-full" />

        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-(--color-border)">
            <div className="flex items-center gap-2 bg-(--color-surface-2) px-4 py-3">
              <SkeletonBar className="h-3.5 w-3.5 rounded-sm" />
              <SkeletonBar className="h-3 w-24 rounded-full" />
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-start gap-3">
                <SkeletonBar className="h-5 w-16 shrink-0 rounded" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <SkeletonBar className="h-3.5 w-1/2 rounded-full" />
                  <SkeletonBar className="h-3 w-2/3 rounded-full" />
                </div>
              </div>
              <div className="flex justify-center">
                <SkeletonBar className="h-3.5 w-3.5 rounded-sm" />
              </div>
              <div className="flex items-start gap-3">
                <SkeletonBar className="h-5 w-12 shrink-0 rounded" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <SkeletonBar className="h-3.5 w-1/2 rounded-full" />
                  <SkeletonBar className="h-3 w-2/3 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}

        <SkeletonBar className="mx-auto h-3 w-2/3 rounded-full" />
      </div>
    </ModifyPanelSkeleton>
  );
}
