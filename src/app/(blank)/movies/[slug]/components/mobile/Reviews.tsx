"use client";

import { useState, useRef, useEffect } from "react";
import { X, LogIn, RotateCcw, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import SectionHeader from "@/components/ui/SectionHeader";
import { useLocale } from "@/contexts/LocaleContext";
import { useMovieDetail } from "@/features/movies/contexts/MovieDetailContext";
import { useMovieReviews, formatReviewCount } from "@/features/reviews/hooks/useMovieReviews";
import { useReviewHighlight } from "@/features/reviews/hooks/useReviewHighlight";
import type { ReviewFilter, ReviewVoteMap, ReviewsResponse } from "@/features/reviews/types";
import WriteReview from "@/components/shared/reviews/mobile/WriteReview";
import ReviewCard from "@/components/shared/reviews/mobile/ReviewCard";
import ReviewSortBar from "./ReviewSortBar";

interface ReviewsProps {
  initialData: ReviewsResponse | null;
  initialError: string | null;
  initialVotes: ReviewVoteMap;
  filters: ReviewFilter[];
}

export default function Reviews({
  initialData,
  initialError,
  initialVotes,
  filters,
}: ReviewsProps) {
  const { translate } = useLocale();
  const { slug } = useMovieDetail();
  const router = useRouter();

  const [maxHeight, setMaxHeight] = useState<string>("none");
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    reviews,
    average,
    ratingCount,
    breakdown,
    hasReviews,
    page,
    totalPages,
    sort,
    loadingPage,
    mutating,
    retrying,
    error,
    actionError,
    isAuthenticated,
    currentUserId,
    clearActionError,
    goToPage,
    changeSort,
    retry,
    create,
    save,
    remove,
    vote,
    isVoting,
  } = useMovieReviews({
    movieSlug: slug,
    initialData,
    initialError,
    initialVotes,
    anchorRef: containerRef,
  });

  useEffect(() => {
    if (containerRef.current) {
      setMaxHeight(containerRef.current.scrollHeight + "px");
    }
  }, [reviews.length, page]);

  const highlightedId = useReviewHighlight({
    reviewIds: reviews.map((review) => review.id),
    page,
    totalPages,
    loadingPage,
    goToPage,
  });

  const chartColumns = [...breakdown].sort((left, right) => left.stars - right.stars);
  const busiestRating = Math.max(1, ...chartColumns.map((column) => column.count));

  return (
    <section className="px-4 space-y-4">
      <SectionHeader variant="goldBar">{translate("movies.detail.reviews")}</SectionHeader>

      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) px-4 py-4">
        <div className="mb-3 flex items-center gap-2">
          <Star size={22} className="text-(--color-gold) fill-(--color-gold)" aria-hidden />
          <span className="flex items-baseline gap-0.5">
            <span className="text-4xl leading-none font-extrabold text-(--color-gold)">
              {average.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-(--color-text-muted)">/10</span>
          </span>
          <span className="ml-auto text-2xs text-(--color-text-muted)">
            {formatReviewCount(ratingCount)} {translate("movies.detail.ratings")}
          </span>
        </div>

        <div className="mb-3 border-t border-(--color-border)" />

        <div className="flex h-16 items-end gap-1 border-b border-(--color-border)">
          {chartColumns.map((column) => {
            const height = column.count > 0 ? Math.max((column.count / busiestRating) * 100, 8) : 0;

            return (
              <div key={column.stars} className="flex h-full flex-1 items-end justify-center">
                {column.count > 0 && (
                  <div
                    className="w-full rounded-t-sm bg-(--color-gold)"
                    style={{ height: `${height}%` }}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex gap-1">
          {chartColumns.map((column) => (
            <span
              key={column.stars}
              className="flex-1 text-center text-3xs font-semibold text-(--color-text-muted)"
            >
              {column.stars}
            </span>
          ))}
        </div>
      </div>

      {isAuthenticated ? (
        <WriteReview onSubmit={create} disabled={mutating} />
      ) : (
        <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) p-4 flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-bg)">
            <LogIn size={18} className="text-(--color-text-muted)" />
          </div>
          <p className="text-sm text-(--color-text-muted) text-center">
            {translate("movies.detail.login_to_review")}
          </p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full py-3 rounded-xl font-bold text-sm tracking-widest uppercase bg-(--color-gold) text-(--color-bg) hover:bg-(--color-gold-dark) active:scale-[0.98] transition duration-150"
          >
            {translate("auth.protected.login_btn")}
          </button>
        </div>
      )}

      {actionError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 flex items-start justify-between gap-3">
          <p className="text-xs text-red-400 leading-relaxed">{actionError}</p>
          <button
            type="button"
            onClick={clearActionError}
            aria-label={translate("movies.detail.cancel")}
            className="shrink-0 text-red-400 hover:text-red-300 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) px-4 py-6 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-(--color-text-muted)">{error || translate("common.error")}</p>
          <button
            type="button"
            onClick={() => void retry()}
            disabled={retrying}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border border-(--color-gold) text-(--color-gold) hover:bg-(--color-gold) hover:text-(--color-bg) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw size={14} /> {translate("common.try_again")}
          </button>
        </div>
      )}

      {!error && !hasReviews && (
        <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) px-4 py-8 text-center">
          <p className="text-sm text-(--color-text-muted)">
            {translate("movies.detail.no_reviews")}
          </p>
        </div>
      )}

      {!error && hasReviews && (
        <ReviewSortBar
          filters={filters}
          active={sort}
          disabled={loadingPage}
          onChange={(next) => void changeSort(next)}
        />
      )}

      {!error && hasReviews && (
        <div
          ref={containerRef}
          style={{ maxHeight }}
          className="animate-expand rounded-2xl bg-(--color-surface) border border-(--color-border) px-4 divide-y divide-(--color-border)"
        >
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwner={currentUserId === review.userId}
              canVote={currentUserId !== review.userId}
              isVoting={isVoting(review.id)}
              highlighted={highlightedId === review.id}
              onVote={(next) => void vote(review, next)}
              onSave={(rating, text) => save(review.id, rating, text)}
              onDelete={() => remove(review.id)}
            />
          ))}
        </div>
      )}

      {!error && hasReviews && totalPages > 1 && (
        <nav
          aria-label={translate("movies.detail.reviews")}
          className="flex items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => void goToPage(page - 1)}
            disabled={page === 1 || loadingPage}
            aria-label={translate("movies.detail.prev_page")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--color-border) text-(--color-text-muted) transition-colors hover:bg-(--color-surface) disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              type="button"
              key={pageNumber}
              onClick={() => void goToPage(pageNumber)}
              disabled={loadingPage}
              aria-current={pageNumber === page ? "page" : undefined}
              className={`flex h-9 min-w-9 items-center justify-center rounded-xl border px-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                pageNumber === page
                  ? "border-(--color-gold) bg-(--color-gold) text-(--color-bg)"
                  : "border-(--color-border) text-(--color-text-muted) hover:bg-(--color-surface)"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            onClick={() => void goToPage(page + 1)}
            disabled={page === totalPages || loadingPage}
            aria-label={translate("movies.detail.next_page")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--color-border) text-(--color-text-muted) transition-colors hover:bg-(--color-surface) disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      )}
    </section>
  );
}
