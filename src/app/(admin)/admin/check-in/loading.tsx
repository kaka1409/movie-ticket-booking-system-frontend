import { AdminHeaderSkeleton } from "../components/shared/AdminSkeletons";
import CheckinSkeleton from "../components/skeletons/CheckinSkeleton";

export default function AdminCheckinLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <CheckinSkeleton />
    </>
  );
}
