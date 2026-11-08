import { AdminHeaderSkeleton, AdminListSkeleton } from "../components/shared/AdminSkeletons";

export default function AdminPaymentMethodsLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <AdminListSkeleton filtersCard filterCardStyle="chips" columns={5} pager={false} />
    </>
  );
}
