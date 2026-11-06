import { AdminHeaderSkeleton, AdminListSkeleton } from "../components/shared/AdminSkeletons";

export default function AdminFoodLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <AdminListSkeleton columns={5} />
    </>
  );
}
