import { AdminHeaderSkeleton, AdminListSkeleton } from "../components/shared/AdminSkeletons";

export default function AdminCombosLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <AdminListSkeleton filtersCard filterCardStyle="chips" columns={5} />
    </>
  );
}
