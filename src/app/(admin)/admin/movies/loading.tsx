import { AdminHeaderSkeleton, AdminListSkeleton } from "../components/shared/AdminSkeletons";

export default function AdminMoviesLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <AdminListSkeleton tabs={4} filtersCard columns={6} />
    </>
  );
}
