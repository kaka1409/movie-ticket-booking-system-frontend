import { AdminHeaderSkeleton, AdminListSkeleton } from "../components/shared/AdminSkeletons";

export default function AdminReviewsLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <AdminListSkeleton search={false} total={false} action={false} columns={5} />
    </>
  );
}
