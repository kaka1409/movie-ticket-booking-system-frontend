"use client";

import { useCallback, useMemo, useState } from "react";
import { REVIEWS_PAGE_SIZE } from "../constants";
import {
  loadReviewsAction,
  createReviewAction,
  updateReviewAction,
  deleteReviewAction,
} from "../action";
import type { MovieReview, ReviewSummary, ReviewsResponse, UiReview } from "../types";
import { formatRelativeTime } from "@/libs/utils";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

const PAGE_SIZE = REVIEWS_PAGE_SIZE;

function mapReview(review: MovieReview, locale: "en" | "vn"): UiReview {
  return {
    id: review.id,
    userId: review.userId,
    user: review.user.name,
    src: review.user.avatarUrl ?? undefined,
    rating: review.rating,
    time: formatRelativeTime(review.createdAt, locale),
    text: review.comment,
  };
}

/** Review total for display: `1.2k` from a thousand up, plain digits below. */
export function formatReviewCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

interface RatingBreakdown {
  stars: number;
  pct: number;
}

interface ScrollAnchor {
  current: HTMLElement | null;
}

/**
 * Detail-page review controller: list, paging, rating summary and the
 * create/update/delete mutations. `useReviewHighlight` owns the `#review-<id>`
 * scroll and ring, so the two must not be merged.
 */
export function useMovieReviews({
  movieSlug,
  initialData,
  initialError,
  anchorRef,
}: {
  movieSlug: string;
  initialData: ReviewsResponse | null;
  initialError: string | null;
  anchorRef?: ScrollAnchor;
}) {
  const { translate, locale } = useLocale();
  const { token, isAuthenticated, user } = useAuth();
  const { notify } = useToast();

  const [rawReviews, setRawReviews] = useState<MovieReview[]>(initialData?.reviews ?? []);
  const [total, setTotal] = useState(initialData?.total ?? 0);
  const [summary, setSummary] = useState<ReviewSummary | null>(initialData?.ratingSummary ?? null);
  const [error, setError] = useState<string | null>(initialError);
  const [actionError, setActionError] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [page, setPage] = useState(1);
  const [retrying, setRetrying] = useState(false);

  const reviews = useMemo(
    () => rawReviews.map((review) => mapReview(review, locale)),
    [rawReviews, locale],
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const applyData = useCallback((data: ReviewsResponse) => {
    setRawReviews(data.reviews);
    setTotal(data.total);
    setSummary(data.ratingSummary);
    setError(null);
  }, []);

  const scrollToAnchor = useCallback(() => {
    anchorRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [anchorRef]);

  const fetchPage = useCallback(
    async (targetPage: number): Promise<boolean> => {
      const result = await loadReviewsAction({
        movieSlug,
        skip: (targetPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      });
      if (result.success) {
        applyData(result.data);
        setPage(targetPage);
        scrollToAnchor();
        return true;
      }
      setActionError(result.error);
      return false;
    },
    [movieSlug, applyData, scrollToAnchor],
  );

  const goToPage = useCallback(
    async (targetPage: number) => {
      if (loadingPage || targetPage === page) return;
      if (targetPage < 1 || targetPage > totalPages) return;
      setLoadingPage(true);
      try {
        await fetchPage(targetPage);
      } finally {
        setLoadingPage(false);
      }
    },
    [loadingPage, page, totalPages, fetchPage],
  );

  const retry = useCallback(async () => {
    setRetrying(true);
    setActionError(null);
    try {
      const result = await loadReviewsAction({
        movieSlug,
        skip: 0,
        limit: PAGE_SIZE,
      });
      if (result.success) {
        applyData(result.data);
        setPage(1);
      } else {
        setError(result.error);
      }
    } catch {
      setError(translate("common.error"));
    } finally {
      setRetrying(false);
    }
  }, [movieSlug, applyData, translate]);

  const create = useCallback(
    async (rating: number, text: string): Promise<boolean> => {
      if (!token) return false;
      setMutating(true);
      setActionError(null);
      try {
        const result = await createReviewAction(
          {
            movieSlug,
            rating,
            comment: text,
            refetchSkip: 0,
            refetchLimit: PAGE_SIZE,
          },
          token,
        );
        if (!result.success) {
          setActionError(result.error);
          notify(translate("movies.detail.action_failed"), { variant: "error" });
          return false;
        }
        applyData(result.data);
        setPage(1);
        scrollToAnchor();
        notify(translate("movies.detail.review_posted"), { variant: "success" });
        return true;
      } catch {
        setActionError(translate("movies.detail.action_failed"));
        notify(translate("movies.detail.action_failed"), { variant: "error" });
        return false;
      } finally {
        setMutating(false);
      }
    },
    [token, movieSlug, applyData, scrollToAnchor, translate, notify],
  );

  const save = useCallback(
    async (id: string, rating: number, text: string): Promise<boolean> => {
      if (!token) return false;
      setActionError(null);
      try {
        const result = await updateReviewAction(
          {
            reviewId: id,
            movieSlug,
            rating,
            comment: text,
            refetchSkip: (page - 1) * PAGE_SIZE,
            refetchLimit: PAGE_SIZE,
          },
          token,
        );
        if (!result.success) {
          setActionError(result.error);
          notify(translate("movies.detail.action_failed"), { variant: "error" });
          return false;
        }
        applyData(result.data);
        notify(translate("movies.detail.review_updated"), { variant: "success" });
        return true;
      } catch {
        setActionError(translate("movies.detail.action_failed"));
        notify(translate("movies.detail.action_failed"), { variant: "error" });
        return false;
      }
    },
    [token, movieSlug, page, applyData, translate, notify],
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      if (!token) return false;
      if (!window.confirm(translate("movies.detail.delete_confirm"))) {
        return false;
      }
      setActionError(null);
      try {
        const result = await deleteReviewAction(
          {
            reviewId: id,
            movieSlug,
            refetchSkip: (page - 1) * PAGE_SIZE,
            refetchLimit: PAGE_SIZE,
          },
          token,
        );
        if (!result.success) {
          setActionError(result.error);
          notify(translate("movies.detail.action_failed"), { variant: "error" });
          return false;
        }
        if (result.data.reviews.length === 0 && page > 1) {
          await fetchPage(page - 1);
        } else {
          applyData(result.data);
        }
        notify(translate("movies.detail.review_deleted"), { variant: "success" });
        return true;
      } catch {
        setActionError(translate("movies.detail.action_failed"));
        notify(translate("movies.detail.action_failed"), { variant: "error" });
        return false;
      }
    },
    [token, movieSlug, page, applyData, fetchPage, translate, notify],
  );

  const average = summary?.average ?? 0;
  const ratingCount = summary?.total ?? 0;
  const breakdown = useMemo<RatingBreakdown[]>(
    () =>
      (summary?.ratingSummary ?? []).map((entry) => ({
        stars: entry.stars,
        pct: ratingCount > 0 ? Math.round((entry.count / ratingCount) * 100) : 0,
      })),
    [summary, ratingCount],
  );

  return {
    reviews,
    average,
    ratingCount,
    breakdown,
    hasReviews: rawReviews.length > 0,
    page,
    totalPages,
    loadingPage,
    mutating,
    retrying,
    error,
    actionError,
    isAuthenticated,
    currentUserId: user?.id ?? null,
    clearActionError: () => setActionError(null),
    goToPage,
    retry,
    create,
    save,
    remove,
  };
}
