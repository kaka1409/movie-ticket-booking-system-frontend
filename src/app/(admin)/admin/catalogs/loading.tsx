import { AdminHeaderSkeleton, AdminListSkeleton } from "../components/shared/AdminSkeletons";

export default function AdminCatalogsLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <AdminListSkeleton filtersCard filterCardStyle="chips" columns={5} />
    </>
  );
}
