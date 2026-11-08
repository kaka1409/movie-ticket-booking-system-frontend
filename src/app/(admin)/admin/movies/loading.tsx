import { AdminHeaderSkeleton, AdminListSkeleton } from "../components/shared/AdminSkeletons";

export default function AdminMoviesLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <AdminListSkeleton filtersCard columns={8} />
    </>
  );
}
