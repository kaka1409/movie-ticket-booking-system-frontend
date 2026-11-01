"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowUpRight } from "lucide-react";
import type { MyReview } from "@/features/reviews/types";
import { useLocale } from "@/contexts/LocaleContext";
import { formatDate } from "@/libs/utils";
import ExpandableText from "@/components/ui/ExpandableText";
import Stars from "@/components/ui/Stars";

/**
 * Own-review card: movie poster + title link, my score (1–10, same scale as the
 * movie score), comment and date. Delete is a two-tap inline confirm; the row
 * only leaves the list after the BE confirms (the parent keeps it + toasts on
 * failure).
 */
export default function ReviewCard({
  review,
  isDeleting,
  onDelete,
}: {
  review: MyReview;
  isDeleting: boolean;
  onDelete: (reviewId: string) => void;
}) {
  // Client-rendered so the date follows the UI locale.
  const { locale, translate } = useLocale();
  const [isArmed, setIsArmed] = useState(false);

  return (
    <article
      data-review-card
      className="rounded-2xl bg-(--color-surface) p-4 shadow-(--shadow-card)"
    >
      <div className="flex gap-3">
        <Link
          href={`/movies/${review.movie.slug}`}
          className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-xl"
        >
          {review.movie.src && (
            <Image
              src={review.movie.src}
              alt={review.movie.title}
              fill
              sizes="80px"
              className="object-cover"
            />
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/movies/${review.movie.slug}`}>
              <h2 className="text-lg font-semibold text-(--color-text-primary)">
                {review.movie.title}
              </h2>
            </Link>
            <span className="shrink-0 text-xs text-(--color-text-muted)">
              {formatDate(review.createdAt, locale)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Stars rating={review.rating} size={12} />
            <span className="text-sm font-medium text-(--color-text-primary)">
              {review.rating.toFixed(1)}
            </span>
          </div>

          <span className="inline-block w-fit text-2xs font-bold tracking-wide uppercase text-(--color-gold) bg-(--color-gold)/10 rounded-full px-2 py-0.5">
            {review.movie.genre}
          </span>

          {review.comment && (
            <ExpandableText
              text={review.comment}
              className="text-sm leading-snug text-(--color-text-muted)"
            />
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 border-t border-(--color-border) pt-3">
        {isArmed ? (
          <>
            <span className="mr-auto text-xs text-(--color-text-muted)">
              {translate("profile.myreviews.delete_confirm")}
            </span>
            <button
              type="button"
              onClick={() => setIsArmed(false)}
              className="rounded-xl border border-(--color-border) px-4 py-2 text-xs font-bold text-(--color-text-primary)"
            >
              {translate("profile.myreviews.cancel")}
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onDelete(review.id)}
              className="rounded-xl bg-red-500 px-4 py-2 text-xs font-extrabold text-white disabled:opacity-40"
            >
              {translate("profile.myreviews.confirm_delete")}
            </button>
          </>
        ) : (
          <>
            <Link
              href={`/movies/${review.movie.slug}#review-${review.id}`}
              className="mr-auto flex items-center gap-1.5 rounded-xl border border-(--color-border) px-4 py-2 text-xs font-bold text-(--color-gold)"
            >
              <ArrowUpRight size={14} />
              {translate("profile.myreviews.view")}
            </Link>
            <button
              type="button"
              onClick={() => setIsArmed(true)}
              className="flex items-center gap-1.5 rounded-xl border border-(--color-border) px-4 py-2 text-xs font-bold text-red-400"
            >
              <Trash2 size={14} />
              {translate("profile.myreviews.delete")}
            </button>
          </>
        )}
      </div>
    </article>
  );
}
