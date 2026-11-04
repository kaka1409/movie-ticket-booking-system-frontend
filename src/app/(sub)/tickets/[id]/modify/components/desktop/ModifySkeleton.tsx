import ModifyPanelSkeleton from "@/app/(sub)/tickets/components/desktop/ModifyPanelSkeleton";
import { SkeletonBar } from "@/components/ui/Skeleton";

/**
 * Shape of the modify type step: the question, the three change-type rows and
 * the limit notice. Nothing is picked yet, so the rail holds identity + CTA only.
 */
export default function ModifySkeleton() {
  return (
    <ModifyPanelSkeleton>
      <div className="space-y-3">
        <SkeletonBar className="h-3.5 w-56 rounded-full" />

        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) px-4 py-4"
          >
            <SkeletonBar className="h-12 w-12 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <SkeletonBar className="h-3.5 w-32 rounded-full" />
              <SkeletonBar className="h-3 w-2/3 rounded-full" />
            </div>
            <SkeletonBar className="h-5 w-5 shrink-0 rounded-full" />
          </div>
        ))}

        <SkeletonBar className="h-3 w-72 rounded-full" />
      </div>
    </ModifyPanelSkeleton>
  );
}
