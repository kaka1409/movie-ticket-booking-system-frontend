import { AdminHeaderSkeleton } from "../components/shared/AdminSkeletons";
import CinemasSkeleton from "../components/skeletons/CinemasSkeleton";

export default function AdminCinemasLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <CinemasSkeleton />
    </>
  );
}
