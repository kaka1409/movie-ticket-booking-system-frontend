import { Skeleton } from "@/components/ui/Skeleton";

export default function PaymentQrLoading() {
  return (
    <>
      <div className="block md:hidden">
        <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 pt-6">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-7 w-52 rounded" />
          <Skeleton className="h-4 w-full max-w-xs rounded" />
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </div>

      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
              <div className="space-y-4">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-8 w-64 rounded" />
                <Skeleton className="h-4 w-full max-w-sm rounded" />
                <Skeleton className="h-96 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
