import { getWishlist } from "@/features/wishlist/api";
import WishlistHydrate from "./components/mobile/WishlistHydrate";
import WishlistMovieList from "./components/mobile/WishlistMovieList";
import DesktopWishlistContent from "./components/desktop/WishlistContent";

export async function WishlistSection({
  wishlistPromise,
}: {
  wishlistPromise: ReturnType<typeof getWishlist>;
}) {
  const result = await wishlistPromise;
  const initialItems = "error" in result ? [] : result.data;

  return (
    <>
      <WishlistHydrate ids={initialItems.map((item) => item.movieId)} />
      <div className="block md:hidden">
        <WishlistMovieList initialItems={initialItems} />
      </div>
      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
          <DesktopWishlistContent initialItems={initialItems} />
        </div>
      </div>
    </>
  );
}
