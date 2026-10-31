"use client";

import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import Link from "next/link";
import type { FilterKey, MyReview } from "@/features/reviews/types";
import { useLocale } from "@/contexts/LocaleContext";
import { useAppendReveal } from "@/hooks/useAppendReveal";
import EmptyState from "@/components/ui/EmptyState";
import Tabs from "@/components/ui/Tabs";
import LoadMoreButton from "../shared/LoadMoreButton";
import ReviewRow from "./ReviewRow";
import { useMyReviews } from "@/features/reviews/hooks/useMyReviews";

export default function ReviewContent({
  initialReviews,
  total,
  filters,
}: {
  initialReviews: MyReview[];
  total: number;
  filters: readonly { key: string; label: string }[];
}) {
  const { translate } = useLocale();
  const {
    reviews,
    totalCount,
    activeFilter,
    isLoadingMore,
    deletingId,
    hasMore,
    handleFilterChange,
    handleLoadMore,
    handleDelete,
  } = useMyReviews(initialReviews, total);

  const { containerRef: listRef, animThreshold } = useAppendReveal<HTMLDivElement>({
    count: reviews.length,
    cardSelector: "[data-review-card]",
  });

  const tabItems = filters.map((filter) => ({
    key: filter.key,
    label: translate(`reviews.filters.${filter.key}`),
  }));

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((accumulator, item) => accumulator + item.rating, 0) / reviews.length
        ).toFixed(1)
      : "—";

  const positivePercent =
    reviews.length > 0
      ? Math.round((reviews.filter((item) => item.rating >= 4).length / reviews.length) * 100)
      : 0;

  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title={translate("profile.myreviews.empty_title")}
        description={translate("profile.myreviews.empty_desc")}
      >
        <Link
          href="/movies"
          className="rounded-xl bg-(--color-gold) px-6 py-3 text-sm font-extrabold tracking-wide text-black transition hover:brightness-110 active:scale-95"
        >
          {translate("profile.myreviews.browse")}
        </Link>
      </EmptyState>
    );
  }

  return (
    <>
      {/* Review Stats Summary Banner */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3.5 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-gold)/15 text-(--color-gold)">
            <MessageSquare size={18} />
          </span>
          <div>
            <p className="text-xl font-black text-white">{totalCount}</p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-(--color-text-muted)">
              {translate("profile.stats.reviews")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-gold)/15 text-(--color-gold)">
            <Star size={18} fill="currentColor" />
          </span>
          <div>
            <p className="text-xl font-black text-white">{averageRating} / 5.0</p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-(--color-text-muted)">
              {translate("profile.myreviews.average_rating")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-gold)/15 text-(--color-gold)">
            <ThumbsUp size={18} />
          </span>
          <div>
            <p className="text-xl font-black text-white">{positivePercent}%</p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-(--color-text-muted)">
              {translate("profile.myreviews.positive_reviews")}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-(--color-border)/50 pb-4">
        <p className="text-xs text-(--color-text-muted)">
          {translate("profile.myreviews.count_prefix")}{" "}
          <span className="font-bold text-white">{totalCount}</span>{" "}
          {translate("profile.myreviews.count_suffix")}
        </p>

        <Tabs
          tabs={tabItems}
          activeTab={activeFilter}
          ariaLabel={translate("profile.review_rating")}
          onTabChange={(key) => handleFilterChange(key as FilterKey)}
          stretch={false}
        />
      </div>

      {/* Review Cards List */}
      <div ref={listRef} className="mt-5 space-y-4">
        {reviews.map((review, index) => (
          <div key={review.id} className={index >= animThreshold ? "animate-fade-in" : ""}>
            <ReviewRow
              review={review}
              isDeleting={deletingId === review.id}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 border-t border-(--color-border)/40 pt-4">
          <LoadMoreButton onClick={handleLoadMore} disabled={isLoadingMore} />
        </div>
      )}
    </>
  );
}
