import { AdminHeaderSkeleton, AdminListSkeleton } from "../components/shared/AdminSkeletons";

export default function AdminUsersLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <AdminListSkeleton search select apply total action columns={5} />
    </>
  );
}
