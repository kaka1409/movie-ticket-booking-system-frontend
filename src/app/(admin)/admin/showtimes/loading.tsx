import { AdminHeaderSkeleton } from "../components/shared/AdminSkeletons";
import ShowtimesSkeleton from "../components/skeletons/ShowtimesSkeleton";

export default function AdminShowtimesLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <ShowtimesSkeleton />
    </>
  );
}
