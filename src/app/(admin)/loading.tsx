import {
  AdminHeaderSkeleton,
} from "./admin/components/shared/AdminSkeletons";
import AdminDashboardSkeleton from "./admin/components/skeletons/AdminDashboardSkeleton";

export default function AdminLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <AdminDashboardSkeleton />
    </>
  );
}
