import {
  AdminHeaderSkeleton,
  AdminTableSkeleton,
} from "@/features/admin/components/AdminSkeletons";

/** Console route fallback — header band + table shell, so the first paint of a
 * route already has the page's shape instead of a centred spinner. */
export default function AdminLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <AdminTableSkeleton />
    </>
  );
}
