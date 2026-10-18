"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { useWishlist, type WishlistFeedback } from "@/features/wishlist/context";
import type { WishlistItem, WishlistMovie, WishlistTab } from "@/features/wishlist/types";
import { useLocale } from "@/contexts/LocaleContext";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import SearchBar from "@/components/ui/SearchBar";
import Chip from "@/components/ui/Chip";
import EmptyState from "@/components/ui/EmptyState";
import WishlistCard from "./WishlistCard";
import EmptyWishlistState from "./EmptyState";

const UNDO_WINDOW_MS = 4000;

const TABS: WishlistTab[] = ["all", "now_showing", "coming_soon"];

/**
 * Single-column wishlist list. The list renders only synced BE items (local-only
 * ids have no card payload and stay hidden); a title/genre search bar and
 * All / Now Showing / Coming Soon chips filter client-side — the list is
 * personal and small, so no round-trip per keystroke. Removing a title shows
 * an Undo snackbar for a few seconds so an accidental tap is recoverable;
 * additions dismiss any pending snackbar without showing one.
 */
export default function WishlistMovieList({ initialItems }: { initialItems: WishlistItem[] }) {
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

  // Local-only ids (hearted while logged out) carry no payload — they stay in
  // the draft for heart states elsewhere but never render a card here.
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
    // Re-adding through the same choke point replays the BE sync + toast.
    toggleWishlist(removed.id, buildFeedback());
  }

  function handleClearFilters() {
    setQuery("");
    setActiveTab("all");
  }

  if (movies.length === 0) {
    return (
      <main className="flex-1 overflow-y-auto">
        <EmptyWishlistState />
      </main>
    );
  }

  const isFiltering = debouncedQuery.trim() !== "" || activeTab !== "all";

  return (
    <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-(--color-text-muted)">
          {translate("profile.wishlist.count_prefix")}{" "}
          <span className="font-bold text-(--color-text-primary)">{visibleMovies.length}</span>{" "}
          {translate("profile.wishlist.count_suffix")}
        </p>
        {isFiltering && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="shrink-0 text-xs font-bold text-(--color-gold)"
          >
            {translate("profile.wishlist.clear_filters")}
          </button>
        )}
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={translate("profile.wishlist.search_placeholder")}
      />

      <div className="my-3 flex items-center gap-3 overflow-x-auto py-2">
        {TABS.map((tab) => (
          <Chip
            key={tab}
            label={translate(`profile.wishlist.filter_${tab}`)}
            active={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            variant="outline"
          />
        ))}
      </div>

      {visibleMovies.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title={translate("profile.wishlist.empty_filtered_title")}
          description={translate("profile.wishlist.empty_filtered_desc")}
        >
          <button
            type="button"
            onClick={handleClearFilters}
            className="rounded-xl bg-(--color-gold) px-6 py-3 text-sm font-extrabold tracking-wide text-black"
          >
            {translate("profile.wishlist.clear_filters")}
          </button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {visibleMovies.map((movie) => (
            <WishlistCard
              key={movie.id}
              movie={movie}
              liked={wishlist.includes(movie.id)}
              isBookable={movie.status === "now_showing"}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
        </div>
      )}

      {lastRemoved && (
        <div className="fixed inset-x-4 bottom-24 z-50 flex items-center justify-between gap-3 rounded-2xl border border-(--color-border) bg-(--color-surface) px-4 py-3 shadow-[--shadow-card]">
          <p className="min-w-0 flex-1 truncate text-sm text-(--color-text-primary)">
            {translate("profile.wishlist.removed")}
          </p>
          <button
            type="button"
            onClick={handleUndo}
            className="shrink-0 text-sm font-extrabold text-(--color-gold)"
          >
            {translate("profile.wishlist.undo")}
          </button>
        </div>
      )}
    </main>
  );
}
