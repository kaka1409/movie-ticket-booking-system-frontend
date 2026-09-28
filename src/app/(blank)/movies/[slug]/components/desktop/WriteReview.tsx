"use client";

import { useState } from "react";
import { Pencil, Star } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function WriteReview({
  onSubmit,
  disabled,
}: {
  onSubmit: (rating: number, text: string) => Promise<boolean>;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [text, setText] = useState("");
  const { translate } = useLocale();

  const handleSubmit = async () => {
    if (!userRating || !text.trim() || disabled) return;
    const posted = await onSubmit(userRating, text.trim());
    if (posted) {
      setUserRating(0);
      setText("");
    }
  };

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
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setUserRating(star)}
            aria-label={translate("movies.detail.rate_star")}
            className="cursor-pointer transition-transform duration-100 hover:scale-110"
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

        {userRating > 0 && (
          <span className="self-center text-sm font-bold text-(--color-gold)">
            {userRating}.0 / 5.0
          </span>
        )}
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={translate("movies.detail.review_placeholder")}
        rows={3}
        className="w-full resize-none rounded-(--radius-md) border border-(--color-border) bg-(--color-surface-2) px-4 py-3 text-sm text-(--color-text-primary) font-[inherit] placeholder-(--color-text-muted) outline-none transition-colors focus:border-(--color-gold)/50"
      />

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={disabled || !userRating || !text.trim()}
          className="cursor-pointer rounded-(--radius-md) bg-(--color-gold) px-6 py-2.5 text-sm font-bold text-(--color-bg) transition-all duration-150 hover:bg-(--color-gold-dark) active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {translate("movies.detail.post_review")}
        </button>
      </div>
    </div>
  );
}
