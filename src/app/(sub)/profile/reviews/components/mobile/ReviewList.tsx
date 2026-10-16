"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import Link from "next/link";
import type { FilterKey, MyReview } from "@/features/reviews/types";
import { deleteMyReview, getMyReviews } from "@/features/reviews/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import { useAppendReveal } from "@/hooks/useAppendReveal";
import EmptyState from "@/components/ui/EmptyState";
import FilterBar from "./FilterBar";
import ReviewCard from "./ReviewCard";
import LoadMoreButton from "./LoadMoreButton";

const PAGE_SIZE = 10;

/**
 * Own-reviews list with server paging: filter switches refetch from skip 0,
 * Load More appends the next page. Deletions are optimistic-removed only after
 * the BE confirms (the row stays + error toast on failure).
 */
export default function ReviewList({
  initialReviews,
  total,
  filters,
}: {
  initialReviews: MyReview[];
  total: number;
  filters: readonly { key: string; label: string }[];
}) {
  const { token } = useAuth();
  const { locale, translate } = useLocale();
  const { notify } = useToast();
  const [reviews, setReviews] = useState<MyReview[]>(initialReviews);
  const [totalCount, setTotalCount] = useState(total);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("recent");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const hasMore = reviews.length < totalCount;

  const { containerRef: listRef, animThreshold } = useAppendReveal<HTMLDivElement>({
    count: reviews.length,
    cardSelector: "[data-review-card]",
  });

  async function handleFilterChange(key: FilterKey) {
    setActiveFilter(key);
    // Browser fetches forward cookies automatically (`credentials: "include"`),
    // and `/reviews/me` accepts the refresh cookie — no RAM token needed.
    const result = await getMyReviews({ skip: 0, limit: PAGE_SIZE, sort: key }, undefined, locale);
    if ("error" in result) {
      notify(translate("profile.myreviews.toast_load_failed"), { variant: "error" });
      return;
    }
    setReviews(result.data.reviews);
    setTotalCount(result.data.total);
  }

  async function handleLoadMore() {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    const result = await getMyReviews(
      { skip: reviews.length, limit: PAGE_SIZE, sort: activeFilter },
      undefined,
      locale,
    );
    setIsLoadingMore(false);
    if ("error" in result) {
      notify(translate("profile.myreviews.toast_load_failed"), { variant: "error" });
      return;
    }
    setReviews((prev) => [...prev, ...result.data.reviews]);
    setTotalCount(result.data.total);
  }

  async function handleDelete(reviewId: string) {
    setDeletingId(reviewId);
    const result = await deleteMyReview(reviewId, token ?? "");
    setDeletingId(null);
    if ("error" in result) {
      notify(translate("profile.myreviews.toast_delete_failed"), { variant: "error" });
      return;
    }
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    setTotalCount((prev) => Math.max(0, prev - 1));
    notify(translate("profile.myreviews.toast_deleted"));
  }

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
