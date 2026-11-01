"use client";

import Image from "next/image";
import { Check, Pencil, Star, Trash2, X } from "lucide-react";
import Stars from "@/components/ui/Stars";
import ExpandableText from "@/components/ui/ExpandableText";
import { useLocale } from "@/contexts/LocaleContext";
import { REVIEW_MAX_LENGTH, REVIEW_RATING_STEPS } from "@/features/reviews/constants";
import { useReviewEditor } from "@/features/reviews/hooks/useReviewEditor";
import type { UiReview } from "@/features/reviews/types";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function ReviewCard({
  review,
  isOwner,
  highlighted = false,
  onSave,
  onDelete,
}: {
  review: UiReview;
  isOwner: boolean;
  /** Deep-link target (`#review-<id>`): gold ring while the highlight is live. */
  highlighted?: boolean;
  onSave: (rating: number, text: string) => Promise<boolean>;
  onDelete: () => Promise<boolean>;
}) {
  const { translate } = useLocale();
  const editor = useReviewEditor({ review, onSave });

  if (editor.isEditing) {
    return (
      <article className="space-y-3 border-b border-(--color-border) py-5 last:border-0">
        <div className="flex gap-1">
          {REVIEW_RATING_STEPS.map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => editor.setHoveredRating(star)}
              onMouseLeave={() => editor.setHoveredRating(0)}
              onClick={() => editor.selectRating(star)}
              aria-label={translate("movies.detail.rate_star")}
              className="cursor-pointer transition-transform duration-100 hover:scale-110"
            >
              <Star
                size={20}
                className={
                  star <= (editor.hoveredRating || editor.rating)
                    ? "text-(--color-gold) fill-(--color-gold)"
                    : "text-(--color-border) fill-(--color-border)"
                }
              />
            </button>
          ))}
        </div>

        <textarea
          value={editor.text}
          onChange={(event) => editor.setText(event.target.value)}
          rows={3}
          maxLength={REVIEW_MAX_LENGTH}
          className="w-full resize-none rounded-(--radius-md) border border-(--color-border) bg-(--color-surface-2) px-4 py-3 text-sm text-(--color-text-primary) font-[inherit] outline-none transition-colors focus:border-(--color-gold)/50"
        />

        <div className="flex items-center justify-end gap-2">
          <span
            className={`mr-auto text-xs tabular-nums ${
              editor.remaining <= 0 ? "text-red-400 font-bold" : "text-(--color-text-muted)"
            }`}
          >
            {editor.remaining} / {REVIEW_MAX_LENGTH}
          </span>
          <button
            type="button"
            onClick={editor.cancel}
            className="flex cursor-pointer items-center gap-1.5 rounded-(--radius-md) border border-(--color-border) px-5 py-2.5 text-sm font-bold text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-2)"
          >
            <X size={13} /> {translate("movies.detail.cancel")}
          </button>
          <button
            type="button"
            onClick={() => void editor.save()}
            disabled={!editor.canSave}
            className="flex cursor-pointer items-center gap-1.5 rounded-(--radius-md) bg-(--color-gold) px-5 py-2.5 text-sm font-bold text-(--color-bg) transition duration-150 hover:bg-(--color-gold-dark) disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check size={13} /> {translate("movies.detail.save")}
          </button>
        </div>
      </article>
    );
  }

  return (
    <article
      id={`review-${review.id}`}
      className={`scroll-mt-24 border-b border-(--color-border) py-5 last:border-0 rounded-xl transition-colors ${
        highlighted ? "bg-white/[0.04]" : ""
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-(--color-border) bg-(--color-surface-2)">
            {review.src ? (
              <Image
                src={review.src}
                alt={review.user}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-(--color-gold)">
                {getInitials(review.user)}
              </span>
            )}
          </div>

          <div>
            <p className="text-sm leading-tight font-bold text-(--color-text-primary)">
              {review.user}
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              <Stars rating={review.rating} size={11} />
              <span className="text-2xs text-(--color-text-muted)">{review.time}</span>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={editor.start}
              aria-label={translate("movies.detail.edit_review")}
              className="cursor-pointer rounded-full p-1.5 transition-colors hover:bg-(--color-surface-2)"
            >
              <Pencil
                size={13}
                className="text-(--color-text-muted) transition-colors hover:text-(--color-gold)"
              />
            </button>
            <button
              type="button"
              onClick={() => void onDelete()}
              aria-label={translate("movies.detail.delete_review")}
              className="cursor-pointer rounded-full p-1.5 transition-colors hover:bg-(--color-surface-2)"
            >
              <Trash2
                size={13}
                className="text-(--color-text-muted) transition-colors hover:text-red-400"
              />
            </button>
          </div>
        )}
      </div>

      <ExpandableText
        text={review.text}
        className="pl-12 text-sm leading-relaxed text-(--color-text-muted)"
      />
    </article>
  );
}
