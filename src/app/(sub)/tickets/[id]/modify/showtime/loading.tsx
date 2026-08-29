import { Skeleton } from "@/components/ui/Skeleton";

export default function ShowtimeLoading() {
  return (
    <div className="px-4 py-6 space-y-4">
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
    </div>
  );
}
