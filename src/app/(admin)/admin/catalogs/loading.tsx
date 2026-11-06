import { AdminHeaderSkeleton, AdminListSkeleton } from "../components/shared/AdminSkeletons";

export default function AdminCatalogsLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <AdminListSkeleton tabs={3} columns={4} />
    </>
  );
}
