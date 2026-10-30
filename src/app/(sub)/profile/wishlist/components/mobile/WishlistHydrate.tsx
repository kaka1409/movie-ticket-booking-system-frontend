"use client";

import { useEffect } from "react";
import { useWishlist } from "@/features/wishlist/contexts/WishlistContext";

/**
 * Effect-only mount helper (booking `CinemaAdopt` pattern): adopts the
 * server-fetched wishlist ids into the draft once, so the page renders
 * synced state while later toggles stay optimistic + BE-persisted.
 */
export default function WishlistHydrate({ ids }: { ids: string[] }) {
  const { hydrateWishlist } = useWishlist();

  useEffect(() => {
    hydrateWishlist(ids);
    // Mount-only adoption — ids come from the server render and never change
    // for the lifetime of this page (booking CinemaAdopt precedent).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
