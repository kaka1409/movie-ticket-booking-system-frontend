"use client";

import { SearchX, Heart, Ticket, Calendar, ArrowUpDown } from "lucide-react";
import { useWishlist } from "@/features/wishlist/contexts/WishlistContext";
import type { WishlistItem } from "@/features/wishlist/types";
import { useLocale } from "@/contexts/LocaleContext";
import SearchBar from "@/components/ui/SearchBar";
import EmptyState from "@/components/ui/EmptyState";
import UndoSnackbar from "@/components/ui/UndoSnackbar";
import WishlistMovieRow from "./WishlistMovieRow";
import WishlistEmptyState from "@/app/(sub)/profile/wishlist/components/shared/WishlistEmptyState";
import {
  useWishlistBrowser,
  type WishlistSortOption,
} from "@/features/wishlist/hooks/useWishlistBrowser";
import AccountShell from "@/components/shared/profile/desktop/AccountShell";

const TABS = ["all", "now_showing", "coming_soon"] as const;

/**
 * Desktop wishlist browser:
 * Features top status metrics banner, search bar with status filter badges,
 * dynamic client-side sorting, and spacious horizontal movie row cards.
 */
export default function WishlistContent({ initialItems }: { initialItems: WishlistItem[] }) {
  const { wishlist } = useWishlist();
  const { translate } = useLocale();
  const pageTitle = translate("profile.wishlist_label");
  const {
    movies,
    visibleMovies,
    query,
    setQuery,
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,
    nowShowingCount,
    comingSoonCount,
    lastRemoved,
    isFiltering,
    handleToggleWishlist,
    handleUndo,
    handleClearFilters,
  } = useWishlistBrowser(initialItems);

  if (movies.length === 0) {
    return (
      <AccountShell title={pageTitle} description={translate("profile.pages.wishlist_desc")}>
        <WishlistEmptyState />
      </AccountShell>
    );
  }

  return (
    <AccountShell title={pageTitle} description={translate("profile.pages.wishlist_desc")}>
      {/* 1. Watchlist Quick Stats Overview Banner */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3.5 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-card)">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-gold)/15 text-(--color-gold)">
            <Heart size={18} fill="currentColor" />
          </span>
          <div>
            <p className="text-2xl font-black text-white">{movies.length}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-(--color-text-muted)">
              {translate("profile.wishlist_label")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-card)">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <Ticket size={18} />
          </span>
          <div>
            <p className="text-2xl font-black text-white">{nowShowingCount}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-(--color-text-muted)">
              {translate("profile.wishlist.ready_to_watch")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-card)">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-gold-light)/15 text-(--color-gold-light)">
            <Calendar size={18} />
          </span>
          <div>
            <p className="text-2xl font-black text-white">{comingSoonCount}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-(--color-text-muted)">
              {translate("profile.wishlist.coming_soon_count")}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Integrated Filter & Sort Toolbar */}
      <div className="flex flex-col gap-4 border-b border-(--color-border)/50 pb-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Status Filter Tabs with Count Badges */}
        <div className="flex items-center gap-2 overflow-x-auto overscroll-x-contain pb-1 scrollbar-hide">
          {TABS.map((tab) => {
            const count =
              tab === "all"
                ? movies.length
                : tab === "now_showing"
                  ? nowShowingCount
                  : comingSoonCount;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition duration-150 active:scale-95 ${
                  isActive
                    ? "border-(--color-gold) bg-(--color-gold)/15 text-(--color-gold)"
                    : "border-(--color-border) bg-(--color-surface-2) text-(--color-text-secondary) hover:border-(--color-gold)/40 hover:text-white"
                }`}
              >
                <span>{translate(`profile.wishlist.filter_${tab}`)}</span>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-2xs font-black ${
                    isActive
                      ? "bg-(--color-gold) text-black"
                      : "bg-(--color-surface) text-(--color-text-muted)"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={translate("profile.wishlist.search_placeholder")}
            className="w-full sm:w-60"
          />

          {/* Sort Selector Dropdown */}
          <div className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-xs font-semibold text-white">
            <ArrowUpDown size={14} className="text-(--color-gold)" />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as WishlistSortOption)}
              className="cursor-pointer bg-transparent text-xs font-bold text-white outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold)"
              aria-label={translate("profile.wishlist.sort_by")}
            >
              <option value="default" className="bg-(--color-surface-2)">
                {translate("profile.wishlist.sort_default")}
              </option>
              <option value="rating" className="bg-(--color-surface-2)">
                {translate("profile.wishlist.sort_rating")}
              </option>
              <option value="title" className="bg-(--color-surface-2)">
                {translate("profile.wishlist.sort_title")}
              </option>
              <option value="duration" className="bg-(--color-surface-2)">
                {translate("profile.wishlist.sort_duration")}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Clear Filters Prompt */}
      {isFiltering && (
        <div className="mt-3 flex items-center justify-between text-xs">
          <p className="text-(--color-text-muted)">
            {translate("profile.wishlist.count_prefix")}{" "}
            <span className="font-bold text-white">{visibleMovies.length}</span>{" "}
            {translate("profile.wishlist.count_suffix")}
          </p>

          <button
            type="button"
            onClick={handleClearFilters}
            className="font-bold text-(--color-gold) hover:underline"
          >
            {translate("profile.wishlist.clear_filters")}
          </button>
        </div>
      )}

      {/* 3. Horizontal Movie Cards List or Empty State */}
      {visibleMovies.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={SearchX}
            title={translate("profile.wishlist.empty_filtered_title")}
            description={translate("profile.wishlist.empty_filtered_desc")}
          >
            <button
              type="button"
              onClick={handleClearFilters}
              className="rounded-xl bg-(--color-gold) px-6 py-2.5 text-xs font-bold text-black transition hover:brightness-110 active:scale-95"
            >
              {translate("profile.wishlist.clear_filters")}
            </button>
          </EmptyState>
        </div>
      ) : (
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
          {visibleMovies.map((movie) => (
            <WishlistMovieRow
              key={movie.id}
              movie={movie}
              liked={wishlist.includes(movie.id)}
              isBookable={movie.status === "now_showing"}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
        </div>
      )}

      {/* Undo Notification Snackbar */}
      {lastRemoved && (
        <UndoSnackbar
          message={translate("profile.wishlist.removed")}
          actionLabel={translate("profile.wishlist.undo")}
          onAction={handleUndo}
          className="bottom-8 left-1/2 w-[min(92vw,420px)] -translate-x-1/2"
        />
      )}
    </AccountShell>
  );
}
