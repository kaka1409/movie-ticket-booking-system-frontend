"use client";

import { useEffect, useMemo, useState } from "react";
import { useWishlist, type WishlistFeedback } from "@/features/wishlist/context";
import { useLocale } from "@/contexts/LocaleContext";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { WishlistItem, WishlistMovie, WishlistTab } from "@/features/wishlist/types";

const UNDO_WINDOW_MS = 4000;

/**
 * Device-agnostic controller for the wishlist browser: search + status filter
 * (client-side), synced-BE items only, undo state. Both skins read this hook.
 */
export function useWishlistBrowser(initialItems: WishlistItem[]) {
  const { wishlist, toggleWishlist } = useWishlist();
  const { translate } = useLocale();

  const [lastRemoved, setLastRemoved] = useState<WishlistMovie | null>(null);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<WishlistTab>("all");
  const debouncedQuery = useDebouncedValue(query);

  const serverMovies = useMemo(
    () => new Map(initialItems.map((item) => [item.movieId, item.movie])),
    [initialItems],
  );

  const movies = useMemo(
    () =>
      wishlist
        .map((id) => serverMovies.get(id))
        .filter((movie): movie is WishlistMovie => movie !== undefined),
    [wishlist, serverMovies],
  );

  const visibleMovies = useMemo(() => {
    const needle = debouncedQuery.trim().toLowerCase();
    return movies.filter((movie) => {
      if (activeTab !== "all" && movie.status !== activeTab) return false;
      if (!needle) return true;
      const haystack = `${movie.title} ${movie.genre}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [movies, activeTab, debouncedQuery]);

  useEffect(() => {
    if (!lastRemoved) return;
    const dismissTimer = setTimeout(() => setLastRemoved(null), UNDO_WINDOW_MS);
    return () => clearTimeout(dismissTimer);
  }, [lastRemoved]);

  function buildFeedback(): WishlistFeedback {
    return {
      added: translate("profile.wishlist.toast_added"),
      addFailed: translate("profile.wishlist.toast_add_failed"),
      removeFailed: translate("profile.wishlist.toast_remove_failed"),
    };
  }

  function handleToggleWishlist(movie: WishlistMovie) {
    const wasLiked = wishlist.includes(movie.id);
    toggleWishlist(movie.id, buildFeedback());
    if (wasLiked) {
      setLastRemoved(movie);
    } else {
      setLastRemoved(null);
    }
  }

  function handleUndo() {
    if (!lastRemoved) return;
    const removed = lastRemoved;
    setLastRemoved(null);
    toggleWishlist(removed.id, buildFeedback());
  }

  function handleClearFilters() {
    setQuery("");
    setActiveTab("all");
  }

  const isFiltering = debouncedQuery.trim() !== "" || activeTab !== "all";

  return {
    movies,
    visibleMovies,
    query,
    setQuery,
    activeTab,
    setActiveTab,
    lastRemoved,
    setLastRemoved,
    isFiltering,
    handleToggleWishlist,
    handleUndo,
    handleClearFilters,
    translate,
  };
}
