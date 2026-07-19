import { Skeleton, SkeletonCard } from "@/components/common/Skeleton";

function StepBarSkeleton() {
  return (
    <div className="px-4 pt-4 pb-3">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-2 w-20 rounded-full" />
        <Skeleton className="h-2 w-16 rounded-full" />
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 rounded-full bg-(--color-border)"
          >
            {index === 0 && (
              <div className="h-full rounded-full w-full bg-(--color-gold)" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CountdownBannerSkeleton() {
  return (
    <div className="mx-4 rounded-xl bg-(--color-surface) border border-(--color-border) px-4 py-3 flex items-center justify-between">
      <Skeleton className="h-3 w-24 rounded-full" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}

function BottomBarSkeleton() {
  return (
    <div className="sticky bottom-0 z-50 px-4 pb-6 pt-3 bg-(--color-bg) border-t border-(--color-border)">
      <div className="flex items-center justify-between mb-3 px-1">
        <Skeleton className="h-3 w-32 rounded-full" />
        <Skeleton className="h-3 w-12 rounded-full" />
      </div>
      <Skeleton className="h-12 w-full rounded-2xl" />
    </div>
  );
}

function CinemaStepSkeleton() {
  return (
    <>
      <div className="px-4 pt-2 pb-1">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-(--color-surface) border border-(--color-border)">
          <Skeleton className="w-16 shrink-0 rounded-lg" style={{ aspectRatio: "2/3" }} />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-full" />
            <Skeleton className="h-3 w-1/2 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-10 rounded-md" />
              <Skeleton className="h-5 w-12 rounded-md" />
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-14 shrink-0 rounded-xl" />
        ))}
      </div>
      <div className="px-4 pb-3">
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
      <div className="px-4 space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index} className="p-0">
            <div className="p-3 space-y-2">
              <Skeleton className="h-3 w-2/3 rounded-full" />
              <Skeleton className="h-2 w-1/2 rounded-full" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, chipIndex) => (
                  <Skeleton key={chipIndex} className="h-6 w-14 rounded-full" />
                ))}
              </div>
            </div>
          </SkeletonCard>
        ))}
      </div>
    </>
  );
}

function SeatsStepSkeleton() {
  return (
    <>
      <div className="mx-4 mt-2 rounded-xl bg-(--color-surface) border border-(--color-border) p-4 flex items-center justify-center">
        <Skeleton className="h-20 w-full max-w-xs rounded-lg" />
      </div>
      <div className="px-4 py-4 flex justify-center">
        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: 80 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-6.5 h-6.5 rounded-sm"
            />
          ))}
        </div>
      </div>
      <div className="px-4 py-2 flex items-center gap-4 justify-center">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <Skeleton className="w-3 h-3 rounded-sm" />
            <Skeleton className="h-2 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </>
  );
}

function SnackStepSkeleton() {
  return (
    <>
      <div className="px-4 py-2">
        <Skeleton className="h-4 w-32 rounded-full" />
      </div>
      <div className="px-4 space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index} className="p-0">
            <div className="flex gap-3 p-3">
              <Skeleton className="w-20 h-20 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4 rounded-full" />
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>
          </SkeletonCard>
        ))}
      </div>
      <div className="px-4 py-3">
        <Skeleton className="h-4 w-28 rounded-full" />
      </div>
      <div className="px-4 space-y-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <SkeletonCard key={index} className="p-0">
            <div className="flex gap-3 p-3">
              <Skeleton className="w-16 h-16 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-2/3 rounded-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-14 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>
          </SkeletonCard>
        ))}
      </div>
    </>
  );
}

function CredentialsStepSkeleton() {
  return (
    <>
      <div className="px-4 space-y-4 pt-2">
        <Skeleton className="h-4 w-28 rounded-full" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-1.5">
            <Skeleton className="h-2.5 w-20 rounded-full" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>
      <div className="px-4 pt-4">
        <SkeletonCard className="p-0">
          <div className="p-4 space-y-3">
            <div className="flex gap-3">
              <Skeleton className="w-12 h-16 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4 rounded-full" />
                <Skeleton className="h-2 w-1/2 rounded-full" />
              </div>
            </div>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <Skeleton className="h-2.5 w-24 rounded-full" />
                <Skeleton className="h-2.5 w-16 rounded-full" />
              </div>
            ))}
            <div className="border-t border-dashed border-(--color-border) my-1" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-20 rounded-full" />
              <Skeleton className="h-3.5 w-24 rounded-full" />
            </div>
          </div>
        </SkeletonCard>
      </div>
    </>
  );
}

function PaymentStepSkeleton() {
  return (
    <>
      <div className="px-4 pt-2">
        <SkeletonCard className="p-0">
          <div className="p-4 space-y-3">
            <div className="flex gap-3">
              <Skeleton className="w-12 h-16 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4 rounded-full" />
                <Skeleton className="h-2 w-1/2 rounded-full" />
              </div>
            </div>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <Skeleton className="h-2.5 w-24 rounded-full" />
                <Skeleton className="h-2.5 w-16 rounded-full" />
              </div>
            ))}
            <div className="border-t border-dashed border-(--color-border) my-1" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-20 rounded-full" />
              <Skeleton className="h-3.5 w-24 rounded-full" />
            </div>
          </div>
        </SkeletonCard>
      </div>
      <div className="px-4 pt-4 pb-2">
        <Skeleton className="h-4 w-40 rounded-full" />
      </div>
      <div className="px-4 space-y-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <SkeletonCard key={index} className="p-0">
            <div className="flex items-center gap-3 p-4">
              <Skeleton className="w-10 h-6 rounded-md" />
              <Skeleton className="h-3 flex-1 rounded-full" />
              <Skeleton className="w-5 h-5 rounded-full border-2 border-(--color-border)" />
            </div>
          </SkeletonCard>
        ))}
      </div>
      <div className="px-4 pt-3 flex flex-col items-center gap-2">
        <Skeleton className="h-2 w-48 rounded-full" />
        <Skeleton className="h-2 w-36 rounded-full" />
      </div>
    </>
  );
}

const STEP_CONTENT: Record<number, () => React.ReactNode> = {
  1: CinemaStepSkeleton,
  2: SeatsStepSkeleton,
  3: SnackStepSkeleton,
  4: CredentialsStepSkeleton,
  5: PaymentStepSkeleton,
};

export default function BookingSkeleton({ step = 1 }: { step?: number }) {
  const StepContent = STEP_CONTENT[step] ?? CinemaStepSkeleton;
  return (
    <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg)">
      <StepBarSkeleton />
      {step >= 2 && <CountdownBannerSkeleton />}
      <main className="flex-1 overflow-y-auto pb-24 space-y-4">
        <StepContent />
      </main>
      <BottomBarSkeleton />
    </div>
  );
}
