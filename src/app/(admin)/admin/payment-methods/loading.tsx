import { AdminHeaderSkeleton, AdminListSkeleton } from "../components/shared/AdminSkeletons";

export default function AdminPaymentMethodsLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <AdminListSkeleton search={false} total={false} action={false} pager={false} columns={5} />
    </>
  );
}
