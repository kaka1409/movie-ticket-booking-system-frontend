"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Star, Pencil, Trash2, Check, X } from "lucide-react";
import SectionHeading from "../shared/SectionHeading";
import Stars from "../shared/Stars";
import Avatar from "../shared/Avatar";
import {
  RATING_BREAKDOWN,
  REVIEWS,
  INITIAL_REVIEWS_VISIBLE,
  REVIEWS_LOAD_MORE,
} from "../shared/mock";
import { useLocale } from "@/contexts/LocaleContext";

type Review = (typeof REVIEWS)[number];

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

function WriteReview({
  onSubmit,
}: {
  onSubmit: (rating: number, text: string) => void;
}) {
  const [userRating, setUserRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState("");
  const { translate } = useLocale();

  const handleSubmit = () => {
    if (!userRating || !text.trim()) return;
    onSubmit(userRating, text.trim());
    setUserRating(0);
    setText("");
  };

  return (
    <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) p-4 space-y-3">
      <p className="text-(--color-text-primary) font-bold text-sm">
        {translate("movies.detail.write_review")}
      </p>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setUserRating(s)}
            aria-label={translate("movies.detail.rate_star")}
          >
            <Star
              size={22}
              className={
                s <= (hovered || userRating)
                  ? "text-(--color-gold) fill-(--color-gold)"
                  : "text-(--color-border) fill-(--color-border)"
              }
            />
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={translate("movies.detail.review_placeholder")}
        rows={3}
        className="w-full bg-(--color-bg) border border-(--color-border) rounded-xl px-3 py-3 text-base text-(--color-text-secondary) placeholder-(--color-text-muted) resize-none outline-none focus:border-(--color-gold)/50 transition-colors font-[inherit]"
      />

      <button
        disabled={!userRating || !text.trim()}
        onClick={handleSubmit}
        className="w-full py-3 rounded-xl font-bold text-sm tracking-widest uppercase bg-(--color-gold) text-(--color-bg) hover:bg-(--color-gold-dark) active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
      >
        {translate("movies.detail.post_review")}
      </button>
    </div>
  );
}

function ReviewCard({
  review,
  isOwner,
  onSave,
  onDelete,
}: {
  review: Review;
  isOwner: boolean;
  onSave: (rating: number, text: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editHovered, setEditHovered] = useState(0);
  const [editText, setEditText] = useState(review.text);
  const { translate } = useLocale();

  const handleSave = () => {
    if (!editRating || !editText.trim()) return;
    onSave(editRating, editText.trim());
    setEditing(false);
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
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onMouseEnter={() => setEditHovered(s)}
                  onMouseLeave={() => setEditHovered(0)}
                  onClick={() => setEditRating(s)}
                  aria-label={translate("movies.detail.rate_star")}
                >
                  <Star
                    size={16}
                    className={
                      s <= (editHovered || editRating)
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
          onChange={(e) => setEditText(e.target.value)}
          rows={3}
          className="w-full bg-(--color-bg) border border-(--color-border) rounded-xl px-3 py-3 text-base text-(--color-text-secondary) resize-none outline-none focus:border-(--color-gold)/50 transition-colors font-[inherit]"
        />

        <div className="flex gap-2 pl-11">
          <button
            onClick={handleSave}
            disabled={!editRating || !editText.trim()}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold bg-(--color-gold) text-(--color-bg) hover:bg-(--color-gold-dark) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Check size={14} /> {translate("movies.detail.save")}
          </button>
          <button
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
            <button onClick={() => setEditing(true)} aria-label={translate("movies.detail.edit_review")}>
              <Pencil
                size={14}
                className="text-(--color-text-muted) hover:text-(--color-gold) transition-colors"
              />
            </button>
            <button onClick={onDelete} aria-label={translate("movies.detail.delete_review")}>
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

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [showCount, setShowCount] = useState(INITIAL_REVIEWS_VISIBLE);
  const [maxH, setMaxH] = useState<string>("none");
  const containerRef = useRef<HTMLDivElement>(null);
  const { translate } = useLocale();

  const visibleReviews = reviews.slice(0, showCount);
  const hasMore = showCount < reviews.length;

  useEffect(() => {
    if (containerRef.current) {
      setMaxH(containerRef.current.scrollHeight + "px");
    }
  }, [showCount]);

  const handlePost = useCallback((rating: number, text: string) => {
    const newReview: Review = {
      id: Date.now(),
      user: translate("movies.detail.you"),
      src: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      rating,
      time: translate("movies.detail.just_now"),
      text,
    };
    setReviews((prev) => [newReview, ...prev]);
    setShowCount((prev) => prev + 1);
  }, [translate]);

  const handleLoadMore = useCallback(() => {
    setShowCount((prev) => prev + REVIEWS_LOAD_MORE);
  }, []);

  const handleSave = useCallback(
    (id: number, rating: number, text: string) => {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, rating, text } : r))
      );
    },
    []
  );

  const handleDelete = useCallback((id: number) => {
    if (window.confirm(translate("movies.detail.delete_confirm"))) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setShowCount((prev) => Math.max(prev - 1, INITIAL_REVIEWS_VISIBLE));
    }
  }, [translate]);

  return (
    <section className="px-4 space-y-4">
      <SectionHeading>{translate("movies.detail.reviews")}</SectionHeading>

      <div className="flex items-center gap-5 py-1">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-5xl font-extrabold text-(--color-gold) leading-none">
            4.8
          </span>
          <Stars rating={4.8} size={13} />
          <span className="text-(--color-text-muted) text-[10px] mt-0.5">
            2.4k {translate("movies.detail.ratings")}
          </span>
        </div>

        <div className="flex-1 space-y-1.5">
          {RATING_BREAKDOWN.map((r) => (
            <RatingBar key={r.stars} stars={r.stars} pct={r.pct} />
          ))}
        </div>
      </div>

      <WriteReview onSubmit={handlePost} />

      <div
        ref={containerRef}
        style={{ maxHeight: maxH }}
        className="animate-expand rounded-2xl bg-(--color-surface) border border-(--color-border) px-4 divide-y divide-(--color-border)"
      >
        {visibleReviews.map((r) => (
          <ReviewCard
            key={r.id}
            review={r}
            isOwner={r.user === translate("movies.detail.you")}
            onSave={(rating, text) => handleSave(r.id, rating, text)}
            onDelete={() => handleDelete(r.id)}
          />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={handleLoadMore}
          className="w-full py-3 rounded-2xl border border-(--color-border) text-(--color-gold) font-bold text-sm tracking-widest uppercase hover:bg-(--color-surface) transition-colors"
        >
          {translate("movies.detail.load_more_reviews")}
        </button>
      )}
    </section>
  );
}
