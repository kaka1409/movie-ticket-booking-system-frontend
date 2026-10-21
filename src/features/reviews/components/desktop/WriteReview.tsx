"use client";

import { Pencil, Star } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { REVIEW_MAX_LENGTH } from "@/features/reviews/constants";
import { useReviewComposer } from "@/features/reviews/hooks/useReviewComposer";

export default function WriteReview({
  onSubmit,
  disabled,
}: {
  onSubmit: (rating: number, text: string) => Promise<boolean>;
  disabled?: boolean;
}) {
  const { translate } = useLocale();
  const composer = useReviewComposer({ onSubmit, disabled });

  return (
    <div className="rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-5">
      <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-(--color-text-primary)">
        <Pencil size={15} className="text-(--color-gold)" />
        {translate("movies.detail.write_review")}
      </h3>

      <div className="mb-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => composer.setHoveredRating(star)}
            onMouseLeave={() => composer.setHoveredRating(0)}
            onClick={() => composer.selectRating(star)}
            aria-label={translate("movies.detail.rate_star")}
            className="cursor-pointer transition-transform duration-100 hover:scale-110"
          >
            <Star
              size={22}
              className={
                star <= (composer.hoveredRating || composer.rating)
                  ? "text-(--color-gold) fill-(--color-gold)"
                  : "text-(--color-border) fill-(--color-border)"
              }
            />
          </button>
        ))}

        {composer.rating > 0 && (
          <span className="self-center text-sm font-bold text-(--color-gold)">
            {composer.rating}.0 / 5.0
          </span>
        )}
      </div>

      <textarea
        value={composer.text}
        onChange={(event) => composer.setText(event.target.value)}
        placeholder={translate("movies.detail.review_placeholder")}
        rows={3}
        maxLength={REVIEW_MAX_LENGTH}
        className="w-full resize-none rounded-(--radius-md) border border-(--color-border) bg-(--color-surface-2) px-4 py-3 text-sm text-(--color-text-primary) font-[inherit] placeholder-(--color-text-muted) outline-none transition-colors focus:border-(--color-gold)/50"
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <span
          className={`text-xs tabular-nums ${
            composer.remaining <= 50 ? "font-bold text-red-400" : "text-(--color-text-muted)"
          }`}
        >
          {composer.remaining} / {REVIEW_MAX_LENGTH}
        </span>
        <button
          type="button"
          onClick={() => void composer.submit()}
          disabled={!composer.canSubmit}
          className="cursor-pointer rounded-(--radius-md) bg-(--color-gold) px-6 py-2.5 text-sm font-bold text-(--color-bg) transition-all duration-150 hover:bg-(--color-gold-dark) active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {translate("movies.detail.post_review")}
        </button>
      </div>
    </div>
  );
}
