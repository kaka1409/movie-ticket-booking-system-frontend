"use client";

import { useState } from "react";
import { Star, Pencil, Trash2, Check, X } from "lucide-react";
import Stars from "@/components/ui/Stars";
import Avatar from "@/components/ui/Avatar";
import { useLocale } from "@/contexts/LocaleContext";

export interface UiReview {
  id: string;
  userId: string;
  user: string;
  src: string | undefined;
  rating: number;
  time: string;
  text: string;
}

export default function ReviewCard({
  review,
  isOwner,
  onSave,
  onDelete,
}: {
  review: UiReview;
  isOwner: boolean;
  onSave: (rating: number, text: string) => Promise<boolean>;
  onDelete: () => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editHovered, setEditHovered] = useState(0);
  const [editText, setEditText] = useState(review.text);
  const { translate } = useLocale();

  const handleSave = async () => {
    if (!editRating || !editText.trim()) return;
    const ok = await onSave(editRating, editText.trim());
    if (ok) setEditing(false);
  };

  const handleCancel = () => {
    setEditRating(review.rating);
    setEditText(review.text);
    setEditing(false);
  };

  if (editing) {
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
                <button type="button"
                  key={star}
                  onMouseEnter={() => setEditHovered(star)}
                  onMouseLeave={() => setEditHovered(0)}
                  onClick={() => setEditRating(star)}
                  aria-label={translate("movies.detail.rate_star")}
                >
                  <Star
                    size={16}
                    className={
                      star <= (editHovered || editRating)
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
          value={editText}
          onChange={(event) => setEditText(event.target.value)}
          rows={3}
          className="w-full bg-(--color-bg) border border-(--color-border) rounded-xl px-3 py-3 text-base text-(--color-text-secondary) resize-none outline-none focus:border-(--color-gold)/50 transition-colors font-[inherit]"
        />

        <div className="flex gap-2 pl-11">
          <button type="button"
            onClick={() => void handleSave()}
            disabled={!editRating || !editText.trim()}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold bg-(--color-gold) text-(--color-bg) hover:bg-(--color-gold-dark) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Check size={14} /> {translate("movies.detail.save")}
          </button>
          <button type="button"
            onClick={handleCancel}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold border border-(--color-border) text-(--color-text-secondary) hover:bg-(--color-surface) transition-colors"
          >
            <X size={14} /> {translate("movies.detail.cancel")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 border-b border-(--color-border) last:border-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar src={review.src} name={review.user} size="w-9 h-9" />
          <div>
            <p className="text-(--color-text-primary) text-sm font-bold leading-tight">
              {review.user}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Stars rating={review.rating} size={11} />
              <span className="text-(--color-text-muted) text-[10px]">
                {review.time}
              </span>
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2">
            <button type="button"
              onClick={() => setEditing(true)}
              aria-label={translate("movies.detail.edit_review")}
            >
              <Pencil
                size={14}
                className="text-(--color-text-muted) hover:text-(--color-gold) transition-colors"
              />
            </button>
            <button type="button"
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

      <p className="text-(--color-text-secondary) text-sm leading-relaxed pl-11">
        {review.text}
      </p>
    </div>
  );
}
