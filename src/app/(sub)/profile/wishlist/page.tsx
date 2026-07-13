"use client";

import WishlistContent from "./components/mobile/WishlistContent";
import DesktopWishlistContent from "./components/desktop/WishlistContent";

export default function WishlistPage() {
  return (
    <>
      <div className="block md:hidden">
        <WishlistContent />
      </div>
      <div className="hidden md:block">
        <DesktopWishlistContent />
      </div>
    </>
  );
}
