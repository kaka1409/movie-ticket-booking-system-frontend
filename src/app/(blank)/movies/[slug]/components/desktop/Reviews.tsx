"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LogIn, RotateCcw, X } from "lucide-react";
import Stars from "@/components/ui/Stars";
import ReviewCard from "@/components/shared/reviews/desktop/ReviewCard";
import WriteReview from "@/components/shared/reviews/desktop/WriteReview";
import { useLocale } from "@/contexts/LocaleContext";
import { useMovieDetail } from "@/features/movies/contexts/MovieDetailContext";
import { useMovieReviews, formatReviewCount } from "@/features/reviews/hooks/useMovieReviews";
import { useReviewHighlight } from "@/features/reviews/hooks/useReviewHighlight";
import type { ReviewsResponse } from "@/features/reviews/types";

function RatingBar({ stars, pct }: { stars: number; pct: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 text-right text-2xs font-semibold text-(--color-text-muted)">
        {stars}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-(--color-border)">
        <div
          className="h-full rounded-full bg-(--color-gold) transition duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-7 text-2xs text-(--color-text-muted)">{pct}%</span>
    </div>
  );
}

export default function Reviews({
  initialData,
  initialError,
}: {
  initialData: ReviewsResponse | null;
  initialError: string | null;
}) {
  const { translate } = useLocale();
  const { slug } = useMovieDetail();
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const {
    reviews,
    average,
    ratingCount,
    breakdown,
    hasReviews,
    page,
    totalPages,
    loadingPage,
    mutating,
    retrying,
    error,
    actionError,
    isAuthenticated,
    currentUserId,
    clearActionError,
    goToPage,
    retry,
    create,
    save,
    remove,
  } = useMovieReviews({
    movieSlug: slug,
    initialData,
    initialError,
    anchorRef: listRef,
  });

  const highlightedId = useReviewHighlight({
    reviewIds: reviews.map((review) => review.id),
    page,
    totalPages,
    loadingPage,
    goToPage,
  });

  return (
    <section>
      <h2 className="text-xl font-bold text-(--color-text-primary)">
        {translate("movies.detail.reviews")}
      </h2>

      <div className="mt-5 mb-6 flex items-center gap-8 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-5">
        <div className="flex shrink-0 flex-col items-center gap-1">
          <span className="text-5xl leading-none font-extrabold text-(--color-gold)">
            {average.toFixed(1)}
          </span>
          <Stars rating={average} size={13} />
          <span className="mt-0.5 text-2xs text-(--color-text-muted)">
            {formatReviewCount(ratingCount)} {translate("movies.detail.ratings")}
          </span>
        </div>

        <div className="flex-1 space-y-1.5">
          {breakdown.map((bar) => (
            <RatingBar key={bar.stars} stars={bar.stars} pct={bar.pct} />
          ))}
        </div>
      </div>

      <div ref={formRef} className="mb-6">
        {isAuthenticated ? (
          <WriteReview onSubmit={create} disabled={mutating} />
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-bg)">
              <LogIn size={18} className="text-(--color-text-muted)" />
            </span>
            <p className="text-center text-sm text-(--color-text-muted)">
              {translate("movies.detail.login_to_review")}
            </p>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full cursor-pointer rounded-(--radius-md) bg-(--color-gold) py-3 text-sm font-bold text-(--color-bg) transition duration-150 hover:bg-(--color-gold-dark)"
            >
              {translate("auth.protected.login_btn")}
            </button>
          </div>
        )}
      </div>

      {actionError && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-(--radius-md) border border-red-500/40 bg-red-500/10 px-4 py-3">
          <p className="text-xs leading-relaxed text-red-400">{actionError}</p>
          <button
            type="button"
            onClick={clearActionError}
            aria-label={translate("movies.detail.cancel")}
            className="shrink-0 cursor-pointer text-red-400 transition-colors hover:text-red-300"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 flex flex-col items-center gap-3 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) px-6 py-10 text-center">
          <p className="text-sm text-(--color-text-muted)">{error || translate("common.error")}</p>
          <button
            type="button"
            onClick={() => void retry()}
            disabled={retrying}
            className="flex cursor-pointer items-center gap-2 rounded-(--radius-md) border border-(--color-gold) px-4 py-2 text-xs font-bold text-(--color-gold) transition-colors hover:bg-(--color-gold) hover:text-(--color-bg) disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw size={14} /> {translate("common.try_again")}
          </button>
        </div>
      )}

      {!error && !hasReviews && (
        <div className="rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) px-6 py-10 text-center">
          <p className="text-sm text-(--color-text-muted)">
            {translate("movies.detail.no_reviews")}
          </p>
        </div>
      )}

      {!error && hasReviews && (
        <>
          <div
            ref={listRef}
            className="divide-y divide-(--color-border) rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) px-5"
          >
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isOwner={currentUserId === review.userId}
                highlighted={highlightedId === review.id}
                onSave={(rating, text) => save(review.id, rating, text)}
                onDelete={() => remove(review.id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label={translate("movies.detail.reviews")}
              className="mt-5 flex items-center justify-center gap-2"
            >
              <button
                type="button"
                onClick={() => void goToPage(page - 1)}
                disabled={page === 1 || loadingPage}
                aria-label={translate("movies.detail.prev_page")}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-(--radius-sm) border border-(--color-border) text-(--color-text-muted) transition duration-150 hover:border-(--color-gold)/40 hover:text-(--color-gold) disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => void goToPage(pageNumber)}
                  disabled={loadingPage}
                  aria-current={pageNumber === page ? "page" : undefined}
                  className={`h-8 w-8 cursor-pointer rounded-(--radius-sm) border text-xs font-bold transition duration-150 disabled:cursor-not-allowed disabled:opacity-30 ${
                    pageNumber === page
                      ? "border-(--color-gold) bg-(--color-gold) text-(--color-bg)"
                      : "border-(--color-border) text-(--color-text-muted) hover:border-(--color-gold)/40 hover:text-(--color-gold)"
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
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-(--radius-sm) border border-(--color-border) text-(--color-text-muted) transition duration-150 hover:border-(--color-gold)/40 hover:text-(--color-gold) disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
