import { getAllMovies } from "@/features/movies/api";
import { getReviewFilters } from "@/features/reviews/api";
import ReviewList from "./components/mobile/ReviewList";
import DesktopReviewContent from "./components/desktop/ReviewContent";

export default async function ReviewPage() {
  const [allMovies, filters] = await Promise.all([
    getAllMovies(),
    getReviewFilters(),
  ]);

  return (
    <>
      <div className="block md:hidden">
        <ReviewList allMovies={allMovies} filters={filters} />
      </div>
      <div className="hidden md:block">
        <DesktopReviewContent />
      </div>
    </>
  );
}
