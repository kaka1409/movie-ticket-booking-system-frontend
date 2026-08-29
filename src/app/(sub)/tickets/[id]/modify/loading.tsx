import { Skeleton } from "@/components/ui/Skeleton";

export default function ModifyLoading() {
  return (
    <div className="px-4 py-6 space-y-4">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  );
}
