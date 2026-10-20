"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowUpRight, Loader2 } from "lucide-react";
import type { MyReview } from "@/features/reviews/types";
import { useLocale } from "@/contexts/LocaleContext";
import { formatDate } from "@/libs/utils";
import ExpandableText from "@/components/ui/ExpandableText";
import StarRating from "../mobile/StarRating";
import Button from "@/components/ui/Button";

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
      className="flex gap-4 rounded-xl border border-(--color-border) bg-(--color-surface) p-4 transition-colors duration-150 hover:border-(--color-gold)/30"
    >
      <Link
        href={`/movies/${review.movie.slug}`}
        className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg"
      >
        {review.movie.src && (
          <Image
            src={review.movie.src}
            alt={review.movie.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={`/movies/${review.movie.slug}`}>
              <h3 className="truncate text-base font-bold text-white transition-colors hover:text-(--color-gold-light)">
                {review.movie.title}
              </h3>
            </Link>
            <p className="mt-0.5 text-[11px] text-(--color-text-muted)">
              {review.movie.genre} · {formatDate(review.createdAt, locale)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StarRating rating={review.rating} />
            <span className="text-sm font-bold text-(--color-text-primary)">
              {review.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {review.comment && (
          <ExpandableText
            text={review.comment}
            className="mt-1 text-sm leading-snug text-(--color-text-muted)"
          />
        )}

        <div className="mt-2 flex items-center justify-end gap-2 border-t border-(--color-border) pt-3">
          {isArmed ? (
            <>
              <span className="mr-auto text-xs text-(--color-text-muted)">
                {translate("profile.myreviews.delete_confirm")}
              </span>
              <Button
                variant="outline"
                size="sm"
                fullWidth={false}
                className="px-4"
                onClick={() => setIsArmed(false)}
              >
                {translate("profile.myreviews.cancel")}
              </Button>
              {/* Destructive action gets its own red skin instead of overriding
                  the gold `primary` variant — the confirm reads as a different
                  kind of action, and the classes match Button size="sm" so the
                  two buttons stay the same height. */}
              <button
                type="button"
                onClick={() => onDelete(review.id)}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2.5 rounded-xl bg-red-500 px-4 py-3 text-xs font-extrabold tracking-wide text-white uppercase transition-colors duration-150 hover:bg-red-600 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {translate("profile.myreviews.confirm_delete")}
              </button>
            </>
          ) : (
            <>
              <Link
                href={`/movies/${review.movie.slug}#review-${review.id}`}
                className="mr-auto flex items-center gap-1.5 rounded-xl border border-(--color-border) px-3 py-1.5 text-xs font-bold text-(--color-gold) transition-colors hover:border-(--color-gold)/40"
              >
                <ArrowUpRight size={13} />
                {translate("profile.myreviews.view")}
              </Link>
              <button
                type="button"
                onClick={() => setIsArmed(true)}
                className="flex items-center gap-1.5 rounded-xl border border-(--color-border) px-3 py-1.5 text-xs font-bold text-red-400 transition-colors hover:border-red-500/40"
              >
                <Trash2 size={13} />
                {translate("profile.myreviews.delete")}
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
