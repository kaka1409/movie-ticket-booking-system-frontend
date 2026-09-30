"use client";

import { useState, useRef, useEffect } from "react";
import { X, LogIn, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import SectionHeader from "@/components/ui/SectionHeader";
import Stars from "@/components/ui/Stars";
import { useLocale } from "@/contexts/LocaleContext";
import { useMovieDetail } from "@/features/movies/context";
import {
  useMovieReviews,
  formatReviewCount,
} from "@/features/reviews/useMovieReviews";
import type { ReviewsResponse } from "@/features/reviews/types";
import WriteReview from "@/components/shared/WriteReview";
import ReviewCard from "@/components/shared/ReviewCard";

function RatingBar({ stars, pct }: { stars: number; pct: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-(--color-text-muted) text-xs w-2 text-right">
        {stars}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-(--color-border) overflow-hidden">
        <div
          className="h-full rounded-full bg-(--color-gold)"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface ReviewsProps {
  initialData: ReviewsResponse | null;
  initialError: string | null;
}

export default function Reviews({ initialData, initialError }: ReviewsProps) {
  const { translate } = useLocale();
  const { slug } = useMovieDetail();
  const router = useRouter();

  const [maxH, setMaxH] = useState<string>("none");
  const containerRef = useRef<HTMLDivElement>(null);

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
    anchorRef: containerRef,
  });

  useEffect(() => {
    if (containerRef.current) {
      setMaxH(containerRef.current.scrollHeight + "px");
    }
  }, [reviews.length, page]);

  return (
    <section className="px-4 space-y-4">
      <SectionHeader variant="goldBar">
        {translate("movies.detail.reviews")}
      </SectionHeader>

      <div className="flex items-center gap-5 py-1">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-5xl font-extrabold text-(--color-gold) leading-none">
            {average.toFixed(1)}
          </span>
          <Stars rating={average} size={13} />
          <span className="text-(--color-text-muted) text-[10px] mt-0.5">
            {formatReviewCount(ratingCount)} {translate("movies.detail.ratings")}
          </span>
        </div>

        
        <div className="flex-1 space-y-1.5">
          {breakdown.map((bar) => (
            <RatingBar key={bar.stars} stars={bar.stars} pct={bar.pct} />
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
          <button type="button"
            onClick={() => router.push("/login")}
            className="w-full py-3 rounded-xl font-bold text-sm tracking-widest uppercase bg-(--color-gold) text-(--color-bg) hover:bg-(--color-gold-dark) active:scale-[0.98] transition-all duration-150"
          >
            {translate("auth.protected.login_btn")}
          </button>
        </div>
      )}

      {actionError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 flex items-start justify-between gap-3">
          <p className="text-xs text-red-400 leading-relaxed">{actionError}</p>
          <button type="button"
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
          <p className="text-sm text-(--color-text-muted)">
            {error || translate("common.error")}
          </p>
          <button type="button"
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
        <div
          ref={containerRef}
          style={{ maxHeight: maxH }}
          className="animate-expand rounded-2xl bg-(--color-surface) border border-(--color-border) px-4 divide-y divide-(--color-border)"
        >
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwner={currentUserId === review.userId}
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
          <button type="button"
            onClick={() => void goToPage(page - 1)}
            disabled={page === 1 || loadingPage}
            aria-label={translate("movies.detail.prev_page")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--color-border) text-(--color-gold) transition-colors hover:bg-(--color-surface) disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button type="button"
                key={pageNumber}
                onClick={() => void goToPage(pageNumber)}
                disabled={loadingPage}
                aria-current={pageNumber === page ? "page" : undefined}
                className={`flex h-9 min-w-9 items-center justify-center rounded-xl border px-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  pageNumber === page
                    ? "border-(--color-gold) bg-(--color-gold) text-(--color-bg)"
                    : "border-(--color-border) text-(--color-gold) hover:bg-(--color-surface)"
                }`}
              >
                {pageNumber}
              </button>
            ),
          )}

          <button type="button"
            onClick={() => void goToPage(page + 1)}
            disabled={page === totalPages || loadingPage}
            aria-label={translate("movies.detail.next_page")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--color-border) text-(--color-gold) transition-colors hover:bg-(--color-surface) disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      )}
    </section>
  );
}
