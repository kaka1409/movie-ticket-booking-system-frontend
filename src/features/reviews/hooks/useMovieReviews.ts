"use client";

import { useCallback, useMemo, useState } from "react";
import { REVIEWS_PAGE_SIZE } from "../constants";
import {
  loadReviewsAction,
  createReviewAction,
  updateReviewAction,
  deleteReviewAction,
} from "../action";
import { useReviewVotes } from "./useReviewVotes";
import type {
  MovieReview,
  RatingBreakdown,
  ReviewSort,
  ReviewSummary,
  ReviewVote,
  ReviewVoteMap,
  ReviewsResponse,
  UiReview,
} from "../types";
import { formatRelativeTime } from "@/libs/date";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

const PAGE_SIZE = REVIEWS_PAGE_SIZE;

function mapReview(review: MovieReview, locale: "en" | "vn"): UiReview {
  return {
    id: review.id,
    userId: review.userId,
    user: review.user.name,
    src: review.user.avatarUrl || undefined,
    rating: review.rating,
    time: formatRelativeTime(review.createdAt, locale),
    text: review.comment,
    upvoteCount: review.upvoteCount,
    downvoteCount: review.downvoteCount,
    myVote: null,
  };
}

/** Review total for display: `1.2k` from a thousand up, plain digits below. */
export function formatReviewCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

interface ScrollAnchor {
  current: HTMLElement | null;
}

/**
 * Detail-page review controller: list, paging, sort, rating summary, votes and
 * the create/update/delete mutations. `useReviewHighlight` owns the
 * `#review-<id>` scroll and ring, so the two must not be merged.
 *
 * `initialVotes` covers the whole movie (every page), because the wire list is
 * the shared anonymous read and carries no per-user vote.
 */
export function useMovieReviews({
  movieSlug,
  initialData,
  initialError,
  initialVotes,
  anchorRef,
}: {
  movieSlug: string;
  initialData: ReviewsResponse | null;
  initialError: string | null;
  initialVotes: ReviewVoteMap;
  anchorRef?: ScrollAnchor;
}) {
  const { translate, locale } = useLocale();
  const { token, isAuthenticated, user } = useAuth();
  const { notify } = useToast();
  const { getVote, setVote, isVoting } = useReviewVotes({ initialVotes });

  const [rawReviews, setRawReviews] = useState<MovieReview[]>(initialData?.reviews ?? []);
  const [total, setTotal] = useState(initialData?.total ?? 0);
  const [summary, setSummary] = useState<ReviewSummary | null>(initialData?.ratingSummary ?? null);
  const [error, setError] = useState<string | null>(initialError);
  const [actionError, setActionError] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<ReviewSort>("recent");
  const [retrying, setRetrying] = useState(false);

  const reviews = useMemo(
    () =>
      rawReviews.map((review) => ({
        ...mapReview(review, locale),
        ...getVote(review),
      })),
    [rawReviews, locale, getVote],
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
    async (targetPage: number, nextSort: ReviewSort, shouldScroll = true): Promise<boolean> => {
      const result = await loadReviewsAction({
        movieSlug,
        skip: (targetPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        sort: nextSort,
      });
      if (result.success) {
        applyData(result.data);
        setPage(targetPage);
        if (shouldScroll) scrollToAnchor();
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
        await fetchPage(targetPage, sort);
      } finally {
        setLoadingPage(false);
      }
    },
    [loadingPage, page, totalPages, sort, fetchPage],
  );

  const changeSort = useCallback(
    async (nextSort: ReviewSort) => {
      if (nextSort === sort || loadingPage) return;
      setLoadingPage(true);
      setActionError(null);
      try {
        const loaded = await fetchPage(1, nextSort, false);
        if (loaded) setSort(nextSort);
      } finally {
        setLoadingPage(false);
      }
    },
    [sort, loadingPage, fetchPage],
  );

  const retry = useCallback(async () => {
    setRetrying(true);
    setActionError(null);
    try {
      const loaded = await fetchPage(1, sort);
      if (!loaded) setError(translate("common.error"));
    } catch {
      setError(translate("common.error"));
    } finally {
      setRetrying(false);
    }
  }, [fetchPage, sort, translate]);

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
            sort,
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
    [token, movieSlug, sort, applyData, scrollToAnchor, translate, notify],
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
            sort,
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
    [token, movieSlug, page, sort, applyData, translate, notify],
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
            sort,
          },
          token,
        );
        if (!result.success) {
          setActionError(result.error);
          notify(translate("movies.detail.action_failed"), { variant: "error" });
          return false;
        }
        if (result.data.reviews.length === 0 && page > 1) {
          await fetchPage(page - 1, sort);
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
    [token, movieSlug, page, sort, applyData, fetchPage, translate, notify],
  );

  const vote = useCallback(
    async (review: UiReview, nextValue: ReviewVote | null) => {
      if (!isAuthenticated) {
        notify(translate("movies.detail.login_to_vote"), { variant: "error" });
        return;
      }
      await setVote(review, nextValue);
    },
    [isAuthenticated, notify, translate, setVote],
  );

  const average = summary?.average ?? 0;
  const ratingCount = summary?.total ?? 0;
  const breakdown = useMemo<RatingBreakdown[]>(
    () =>
      (summary?.ratingSummary ?? []).map((entry) => ({
        stars: entry.stars,
        count: entry.count,
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
    sort,
    loadingPage,
    mutating,
    retrying,
    error,
    actionError,
    isAuthenticated,
    currentUserId: user?.id ?? null,
    clearActionError: () => setActionError(null),
    goToPage,
    changeSort,
    retry,
    create,
    save,
    remove,
    vote,
    isVoting,
  };
}
