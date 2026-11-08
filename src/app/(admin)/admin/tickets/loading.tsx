import { AdminHeaderSkeleton, AdminListSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";

export default function Loading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <AdminListSkeleton filtersCard filterCardStyle="chips" columns={6} />
    </>
  );
}
