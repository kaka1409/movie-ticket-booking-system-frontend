"use client";

import { SearchX } from "lucide-react";
import { useWishlist } from "@/features/wishlist/context";
import type { WishlistItem } from "@/features/wishlist/types";
import { useLocale } from "@/contexts/LocaleContext";
import SearchBar from "@/components/ui/SearchBar";
import Chip from "@/components/ui/Chip";
import EmptyState from "@/components/ui/EmptyState";
import UndoSnackbar from "@/components/ui/UndoSnackbar";
import WishlistPosterCard from "./WishlistPosterCard";
import WishlistEmptyState from "@/features/wishlist/components/WishlistEmptyState";
import { useWishlistBrowser } from "@/features/wishlist/hooks/useWishlistBrowser";
import AccountShell from "@/features/profile/components/desktop/AccountShell";

const TABS = ["all", "now_showing", "coming_soon"] as const;

export default function WishlistContent({ initialItems }: { initialItems: WishlistItem[] }) {
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
      <AccountShell
        title={translate("profile.wishlist_label")}
        description={translate("profile.pages.wishlist_desc")}
      >
        <WishlistEmptyState />
      </AccountShell>
    );
  }

  return (
    <AccountShell
      title={translate("profile.wishlist_label")}
      description={translate("profile.pages.wishlist_desc")}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-(--color-text-muted)">
          {translate("profile.wishlist.count_prefix")}{" "}
          <span className="font-bold text-(--color-text-primary)">{visibleMovies.length}</span>{" "}
          {translate("profile.wishlist.count_suffix")}
        </p>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={translate("profile.wishlist.search_placeholder")}
            className="lg:w-64"
          />
          <div className="flex items-center gap-2 overflow-x-auto">
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
        </div>
      </div>

      {isFiltering && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs font-bold text-(--color-gold)"
          >
            {translate("profile.wishlist.clear_filters")}
          </button>
        </div>
      )}

      {visibleMovies.length === 0 ? (
        <div className="mt-6">
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
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-3 gap-4 xl:grid-cols-4">
          {visibleMovies.map((movie) => (
            <WishlistPosterCard
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
          className="bottom-8 left-1/2 -translate-x-1/2 w-[min(92vw,420px)]"
        />
      )}
    </AccountShell>
  );
}
