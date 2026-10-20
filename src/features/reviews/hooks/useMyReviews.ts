"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import { deleteMyReview, getMyReviews } from "@/features/reviews/api";
import type { FilterKey, MyReview } from "@/features/reviews/types";

const PAGE_SIZE = 10;

/**
 * Device-agnostic controller for the "my reviews" list: filter switches refetch
 * from skip 0, Load More appends, deletions are optimistic only after the BE
 * confirms. Both skins read this hook; the append-reveal scroll stays in the
 * skin because it needs a container ref.
 */
export function useMyReviews(initialReviews: MyReview[], initialTotal: number) {
  const { token } = useAuth();
  const { locale, translate } = useLocale();
  const { notify } = useToast();

  const [reviews, setReviews] = useState<MyReview[]>(initialReviews);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("recent");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const hasMore = reviews.length < totalCount;

  const handleFilterChange = useCallback(
    async (key: FilterKey) => {
      setActiveFilter(key);
      const result = await getMyReviews(
        { skip: 0, limit: PAGE_SIZE, sort: key },
        undefined,
        locale,
      );
      if ("error" in result) {
        notify(translate("profile.myreviews.toast_load_failed"), { variant: "error" });
        return;
      }
      setReviews(result.data.reviews);
      setTotalCount(result.data.total);
    },
    [locale, notify, translate],
  );

  const handleLoadMore = useCallback(async () => {
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
  }, [isLoadingMore, reviews.length, activeFilter, locale, notify, translate]);

  const handleDelete = useCallback(
    async (reviewId: string) => {
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
    },
    [token, notify, translate],
  );

  return {
    reviews,
    totalCount,
    activeFilter,
    isLoadingMore,
    deletingId,
    hasMore,
    handleFilterChange,
    handleLoadMore,
    handleDelete,
  };
}
