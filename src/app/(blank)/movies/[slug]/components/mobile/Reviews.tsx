"use client";

import { useState } from "react";
import { Star, Pencil, Trash2 } from "lucide-react";
import SectionHeading from "../shared/SectionHeading";
import Stars from "../shared/Stars";
import Avatar from "../shared/Avatar";
import { RATING_BREAKDOWN, REVIEWS } from "../shared/mock";

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

function WriteReview() {
  const [userRating, setUserRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState("");

  return (
    <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) p-4 space-y-3">
      <p className="text-(--color-text-primary) font-bold text-sm">
        Write a Review
      </p>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setUserRating(s)}
            aria-label={`Rate ${s} stars`}
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
        placeholder="Share your thoughts about the movie..."
        rows={3}
        className="w-full bg-(--color-bg) border border-(--color-border) rounded-xl px-3 py-3 text-sm text-(--color-text-secondary) placeholder-(--color-text-muted) resize-none outline-none focus:border-(--color-gold)/50 transition-colors font-[inherit]"
      />

      <button
        disabled={!userRating || !text.trim()}
        className="w-full py-3 rounded-xl font-bold text-sm tracking-widest uppercase bg-(--color-gold) text-(--color-bg) hover:bg-(--color-gold-dark) active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
      >
        Post Review
      </button>
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof REVIEWS)[number] }) {
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
        <div className="flex items-center gap-2">
          <button aria-label="Edit review">
            <Pencil
              size={14}
              className="text-(--color-text-muted) hover:text-(--color-gold) transition-colors"
            />
          </button>
          <button aria-label="Delete review">
            <Trash2
              size={14}
              className="text-(--color-text-muted) hover:text-red-400 transition-colors"
            />
          </button>
        </div>
      </div>

      <p className="text-(--color-text-secondary) text-sm leading-relaxed pl-11">
        {review.text}
      </p>
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="px-4 space-y-4">
      <SectionHeading>Reviews</SectionHeading>

      <div className="flex items-center gap-5 py-1">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-5xl font-extrabold text-(--color-gold) leading-none">
            4.8
          </span>
          <Stars rating={4.8} size={13} />
          <span className="text-(--color-text-muted) text-[10px] mt-0.5">
            2.4k ratings
          </span>
        </div>

        <div className="flex-1 space-y-1.5">
          {RATING_BREAKDOWN.map((r) => (
            <RatingBar key={r.stars} stars={r.stars} pct={r.pct} />
          ))}
        </div>
      </div>

      <WriteReview />

      <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) px-4 divide-y divide-(--color-border)">
        {REVIEWS.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>

      <button className="w-full py-3 rounded-2xl border border-(--color-border) text-(--color-gold) font-bold text-sm tracking-widest uppercase hover:bg-(--color-surface) transition-colors">
        Load More Reviews
      </button>
    </section>
  );
}
