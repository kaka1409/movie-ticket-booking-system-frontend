"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { REVIEW_MAX_LENGTH } from "@/features/reviews/constants";

export default function WriteReview({
  onSubmit,
  disabled,
}: {
  onSubmit: (rating: number, text: string) => Promise<boolean>;
  disabled?: boolean;
}) {
  const [userRating, setUserRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState("");
  const { translate } = useLocale();

  const handleSubmit = async () => {
    if (!userRating || !text.trim() || disabled) return;
    const isSubmitted = await onSubmit(userRating, text.trim());
    if (isSubmitted) {
      setUserRating(0);
      setText("");
    }
  };

  const remaining = REVIEW_MAX_LENGTH - text.length;

  return (
    <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) p-4 space-y-3">
      <p className="text-(--color-text-primary) font-bold text-sm">
        {translate("movies.detail.write_review")}
      </p>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setUserRating(star)}
            aria-label={translate("movies.detail.rate_star")}
          >
            <Star
              size={22}
              className={
                star <= (hovered || userRating)
                  ? "text-(--color-gold) fill-(--color-gold)"
                  : "text-(--color-border) fill-(--color-border)"
              }
            />
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value.slice(0, REVIEW_MAX_LENGTH))}
        placeholder={translate("movies.detail.review_placeholder")}
        rows={3}
        maxLength={REVIEW_MAX_LENGTH}
        className="w-full bg-(--color-bg) border border-(--color-border) rounded-xl px-3 py-3 text-base text-(--color-text-secondary) placeholder-(--color-text-muted) resize-none outline-none focus:border-(--color-gold)/50 transition-colors font-[inherit]"
      />

      <div className="flex items-center justify-between">
        <span
          className={`text-xs tabular-nums ${
            remaining <= 50 ? "text-red-400 font-bold" : "text-(--color-text-muted)"
          }`}
        >
          {remaining} / {REVIEW_MAX_LENGTH}
        </span>
      </div>

      <button
        type="button"
        disabled={disabled || !userRating || !text.trim()}
        onClick={() => void handleSubmit()}
        className="w-full py-3 rounded-xl font-bold text-sm tracking-widest uppercase bg-(--color-gold) text-(--color-bg) hover:bg-(--color-gold-dark) active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
      >
        {translate("movies.detail.post_review")}
      </button>
    </div>
  );
}
