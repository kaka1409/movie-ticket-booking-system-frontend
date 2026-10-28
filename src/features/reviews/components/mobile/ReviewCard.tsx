"use client";

import { Star, Pencil, Trash2, Check, X } from "lucide-react";
import Stars from "@/components/ui/Stars";
import Avatar from "@/components/ui/Avatar";
import ExpandableText from "@/components/ui/ExpandableText";
import { useLocale } from "@/contexts/LocaleContext";
import { REVIEW_MAX_LENGTH } from "@/features/reviews/constants";
import { useReviewEditor } from "@/features/reviews/hooks/useReviewEditor";
import type { UiReview } from "@/features/reviews/types";

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
      <div className="py-4 border-b border-(--color-border) last:border-0 space-y-3">
        <div className="flex items-center gap-2">
          <Avatar src={review.src} name={review.user} size="w-9 h-9" />
          <div>
            <p className="text-(--color-text-primary) text-sm font-bold leading-tight">
              {review.user}
            </p>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => editor.setHoveredRating(star)}
                  onMouseLeave={() => editor.setHoveredRating(0)}
                  onClick={() => editor.selectRating(star)}
                  aria-label={translate("movies.detail.rate_star")}
                >
                  <Star
                    size={16}
                    className={
                      star <= (editor.hoveredRating || editor.rating)
                        ? "text-(--color-gold) fill-(--color-gold)"
                        : "text-(--color-border) fill-(--color-border)"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <textarea
          value={editor.text}
          onChange={(event) => editor.setText(event.target.value)}
          rows={3}
          maxLength={REVIEW_MAX_LENGTH}
          className="w-full bg-(--color-bg) border border-(--color-border) rounded-xl px-3 py-3 text-base text-(--color-text-secondary) resize-none outline-none focus:border-(--color-gold)/50 transition-colors font-[inherit]"
        />

        <div className="flex items-center gap-2 pl-11">
          <span
            className={`mr-auto text-xs tabular-nums ${
              editor.remaining <= 0 ? "text-red-400 font-bold" : "text-(--color-text-muted)"
            }`}
          >
            {editor.remaining} / {REVIEW_MAX_LENGTH}
          </span>
          <button
            type="button"
            onClick={() => void editor.save()}
            disabled={!editor.canSave}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold bg-(--color-gold) text-(--color-bg) hover:bg-(--color-gold-dark) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Check size={14} /> {translate("movies.detail.save")}
          </button>
          <button
            type="button"
            onClick={editor.cancel}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold border border-(--color-border) text-(--color-text-secondary) hover:bg-(--color-surface) transition-colors"
          >
            <X size={14} /> {translate("movies.detail.cancel")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`py-4 border-b border-(--color-border) last:border-0 rounded-xl transition-colors ${
        highlighted ? "bg-white/[0.04]" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar src={review.src} name={review.user} size="w-9 h-9" />
          <div>
            <p className="text-(--color-text-primary) text-sm font-bold leading-tight">
              {review.user}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Stars rating={review.rating} size={11} />
              <span className="text-(--color-text-muted) text-[10px]">{review.time}</span>
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={editor.start}
              aria-label={translate("movies.detail.edit_review")}
            >
              <Pencil
                size={14}
                className="text-(--color-text-muted) hover:text-(--color-gold) transition-colors"
              />
            </button>
            <button
              type="button"
              onClick={() => void onDelete()}
              aria-label={translate("movies.detail.delete_review")}
            >
              <Trash2
                size={14}
                className="text-(--color-text-muted) hover:text-red-400 transition-colors"
              />
            </button>
          </div>
        )}
      </div>

      <ExpandableText
        text={review.text}
        className="text-(--color-text-secondary) text-sm leading-relaxed pl-11"
      />
    </div>
  );
}
