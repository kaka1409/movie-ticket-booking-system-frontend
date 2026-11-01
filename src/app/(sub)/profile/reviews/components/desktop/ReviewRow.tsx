"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowUpRight, Loader2, Quote, Film } from "lucide-react";
import type { MyReview } from "@/features/reviews/types";
import { useLocale } from "@/contexts/LocaleContext";
import { formatDate } from "@/libs/utils";
import ExpandableText from "@/components/ui/ExpandableText";
import Stars from "@/components/ui/Stars";
import Button from "@/components/ui/Button";

/**
 * Desktop review card:
 * High-res movie poster, star rating badge, stylish quote comment block,
 * direct link to film page, and confirm-to-delete action.
 */
export default function ReviewRow({
  review,
  isDeleting,
  onDelete,
}: {
  review: MyReview;
  isDeleting: boolean;
  onDelete: (reviewId: string) => void;
}) {
  const { locale, translate } = useLocale();
  const [isArmed, setIsArmed] = useState(false);

  return (
    <article
      data-review-card
      className="group flex flex-col gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm transition duration-200 hover:border-(--color-gold)/40 hover:shadow-md sm:flex-row sm:items-start"
    >
      {/* Movie Poster */}
      <Link
        href={`/movies/${review.movie.slug}`}
        className="relative aspect-[2/3] w-20 shrink-0 overflow-hidden rounded-xl bg-(--color-surface-2) shadow-sm"
      >
        {review.movie.src ? (
          <Image
            src={review.movie.src}
            alt={review.movie.title}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-(--color-text-muted)">
            <Film size={24} />
          </div>
        )}
      </Link>

      {/* Review Body */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/movies/${review.movie.slug}`}>
                <h3 className="truncate text-base font-extrabold text-white transition-colors hover:text-(--color-gold)">
                  {review.movie.title}
                </h3>
              </Link>
              <p className="mt-0.5 text-xs text-(--color-text-muted)">
                {review.movie.genre} · {formatDate(review.createdAt, locale)}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-2)/60 px-3 py-1.5 shadow-inner">
              <Stars rating={review.rating} size={12} />
              <span className="font-mono text-sm font-black text-(--color-gold)">
                {review.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Comment with quote styling */}
          {review.comment && (
            <div className="relative mt-3 rounded-xl border-l-2 border-(--color-gold)/50 bg-(--color-surface-2)/40 py-2 pl-3.5 pr-3">
              <Quote size={12} className="mb-1 text-(--color-gold)/40" />
              <ExpandableText
                text={review.comment}
                className="text-xs leading-relaxed text-(--color-text-secondary)"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-(--color-border)/50 pt-3">
          <Link
            href={`/movies/${review.movie.slug}#review-${review.id}`}
            className="flex items-center gap-1.5 text-xs font-bold text-(--color-gold) transition hover:underline underline-offset-2"
          >
            <span>{translate("profile.myreviews.view")}</span>
            <ArrowUpRight size={13} />
          </Link>

          <div className="flex items-center gap-2">
            {isArmed ? (
              <>
                <span className="text-xs text-(--color-text-muted)">
                  {translate("profile.myreviews.delete_confirm")}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth={false}
                  className="px-3"
                  onClick={() => setIsArmed(false)}
                >
                  {translate("profile.myreviews.cancel")}
                </Button>
                <button
                  type="button"
                  onClick={() => onDelete(review.id)}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-red-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-600 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                >
                  {isDeleting ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                  <span>{translate("profile.myreviews.confirm_delete")}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsArmed(true)}
                className="flex items-center gap-1.5 rounded-xl border border-(--color-border) bg-(--color-surface-2) px-3 py-1.5 text-xs font-bold text-(--color-text-muted) transition hover:border-red-500/40 hover:text-red-400 active:scale-95"
              >
                <Trash2 size={13} />
                <span>{translate("profile.myreviews.delete")}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
