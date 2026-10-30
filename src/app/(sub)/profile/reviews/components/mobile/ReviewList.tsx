"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import type { MyReview } from "@/features/reviews/types";
import { useLocale } from "@/contexts/LocaleContext";
import { useAppendReveal } from "@/hooks/useAppendReveal";
import EmptyState from "@/components/ui/EmptyState";
import FilterBar from "./FilterBar";
import ReviewCard from "./ReviewCard";
import LoadMoreButton from "../shared/LoadMoreButton";
import { useMyReviews } from "@/features/reviews/hooks/useMyReviews";

export default function ReviewList({
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

  if (reviews.length === 0) {
    return (
      <main className="flex-1 overflow-y-auto">
        <EmptyState
          icon={Star}
          title={translate("profile.myreviews.empty_title")}
          description={translate("profile.myreviews.empty_desc")}
        >
          <Link
            href="/movies"
            className="rounded-xl bg-(--color-gold) px-6 py-3 text-sm font-extrabold tracking-wide text-black"
          >
            {translate("profile.myreviews.browse")}
          </Link>
        </EmptyState>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto py-4 space-y-4 px-4">
      <FilterBar filters={filters} active={activeFilter} onChange={handleFilterChange} />

      <div ref={listRef} className="space-y-3">
        {reviews.map((review, index) => (
          <div key={review.id} className={index >= animThreshold ? "animate-fade-in" : ""}>
            <ReviewCard
              review={review}
              isDeleting={deletingId === review.id}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>

      {hasMore && <LoadMoreButton onClick={handleLoadMore} disabled={isLoadingMore} />}
    </main>
  );
}
