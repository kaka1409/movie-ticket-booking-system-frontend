import { Suspense } from "react";
import { getWishlist } from "@/features/wishlist/api";
import { getRequestCookie, getRequestLocale } from "@/libs/session";
import WishlistPageSkeleton from "./components/shared/WishlistSkeletons";
import { WishlistSection } from "./sections";

export default async function WishlistPage() {
  const [cookie, locale] = await Promise.all([getRequestCookie(), getRequestLocale()]);
  const wishlistPromise = getWishlist(cookie, locale);

  return (
    <Suspense fallback={<WishlistPageSkeleton />}>
      <WishlistSection wishlistPromise={wishlistPromise} />
    </Suspense>
  );
}
