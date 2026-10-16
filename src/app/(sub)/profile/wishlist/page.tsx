import { getWishlist } from "@/features/wishlist/api";
import { getRequestCookie, getRequestLocale } from "@/libs/session";
import WishlistMovieList from "./components/mobile/WishlistMovieList";
import WishlistHydrate from "./components/mobile/WishlistHydrate";
import DesktopWishlistContent from "./components/desktop/WishlistContent";

export default async function WishlistPage() {
  const wishlistResult = await getWishlist(await getRequestCookie(), await getRequestLocale());

  // A failed fetch (e.g. stale cookie the gate couldn't see) falls back to the
  // local draft — `ProtectedRoute` still swaps to the prompt client-side.
  const initialItems = "error" in wishlistResult ? [] : wishlistResult.data;

  return (
    <>
      <WishlistHydrate ids={initialItems.map((item) => item.movieId)} />
      <div className="block md:hidden">
        <WishlistMovieList initialItems={initialItems} />
      </div>
      <div className="hidden md:block">
        <DesktopWishlistContent />
      </div>
    </>
  );
}
