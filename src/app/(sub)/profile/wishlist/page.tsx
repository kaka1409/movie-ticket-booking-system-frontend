import { getAllMovies } from "@/features/movies/api";
import WishlistMovieList from "./components/mobile/WishlistMovieList";
import DesktopWishlistContent from "./components/desktop/WishlistContent";

export default async function WishlistPage() {
  const allMovies = await getAllMovies();

  return (
    <>
      <div className="block md:hidden">
        <WishlistMovieList allMovies={allMovies} />
      </div>
      <div className="hidden md:block">
        <DesktopWishlistContent />
      </div>
    </>
  );
}
