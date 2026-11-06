import { AdminHeaderSkeleton } from "../components/shared/AdminSkeletons";
import MovieResearchSkeleton from "../components/skeletons/MovieResearchSkeleton";

export default function AdminMovieResearchLoading() {
  return (
    <>
      <AdminHeaderSkeleton />
      <MovieResearchSkeleton />
    </>
  );
}
