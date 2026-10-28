"use client";

import { SearchX } from "lucide-react";
import { useWishlist } from "@/features/wishlist/context";
import type { WishlistItem } from "@/features/wishlist/types";
import { useLocale } from "@/contexts/LocaleContext";
import SearchBar from "@/components/ui/SearchBar";
import Chip from "@/components/ui/Chip";
import EmptyState from "@/components/ui/EmptyState";
import WishlistCard from "./WishlistCard";
import EmptyWishlistState from "@/features/wishlist/components/WishlistEmptyState";
import UndoSnackbar from "@/components/ui/UndoSnackbar";
import { useWishlistBrowser } from "@/features/wishlist/hooks/useWishlistBrowser";

export default function WishlistMovieList({ initialItems }: { initialItems: WishlistItem[] }) {
  const { wishlist } = useWishlist();
  const { translate } = useLocale();
  const {
    movies,
    visibleMovies,
    query,
    setQuery,
    activeTab,
    setActiveTab,
    lastRemoved,
    isFiltering,
    handleToggleWishlist,
    handleUndo,
    handleClearFilters,
  } = useWishlistBrowser(initialItems);

  if (movies.length === 0) {
    return (
      <main className="flex-1 overflow-y-auto">
        <EmptyWishlistState />
      </main>
    );
  }

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

      <div className="my-3 flex items-center gap-3 overflow-x-auto overscroll-x-contain py-2">
        {(["all", "now_showing", "coming_soon"] as const).map((tab) => (
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
        <UndoSnackbar
          message={translate("profile.wishlist.removed")}
          actionLabel={translate("profile.wishlist.undo")}
          onAction={handleUndo}
          className="inset-x-4 bottom-24"
        />
      )}
    </main>
  );
}
