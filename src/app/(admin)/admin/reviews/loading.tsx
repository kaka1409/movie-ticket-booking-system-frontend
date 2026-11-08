import { AdminHeaderSkeleton, AdminListSkeleton } from "../components/shared/AdminSkeletons";

export default function AdminReviewsLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <AdminListSkeleton filtersCard filterCardStyle="chips" columns={7} />
    </>
  );
}
