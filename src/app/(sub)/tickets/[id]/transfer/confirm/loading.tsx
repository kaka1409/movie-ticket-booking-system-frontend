import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function ConfirmLoading() {
  return (
    <div className="min-h-dvh max-w-md mx-auto bg-(--color-bg) block md:hidden">
      <main className="flex-1 pb-5 pt-4 space-y-6 px-4">
        <SkeletonCard className="rounded-3xl p-5 space-y-4">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-4 w-40 rounded-full" />
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-full" />
        </SkeletonCard>
      </main>
    </div>
  );
}
