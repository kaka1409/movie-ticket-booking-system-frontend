import { Skeleton } from "@/components/ui/Skeleton";

export default function PaymentLoading() {
  return (
    <div className="px-4 py-6 space-y-4">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
    </div>
  );
}
