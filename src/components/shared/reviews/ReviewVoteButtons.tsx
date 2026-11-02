"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { PRESS_CLASS } from "@/libs/press";
import type { ReviewVote } from "@/features/reviews/types";

/**
 * Helpfulness control shared by both device trees. Clicking the active side
 * clears the vote, clicking the other side switches it — the caller receives
 * the desired end state, never a toggle, so a retry is idempotent.
 */
export default function ReviewVoteButtons({
  upvoteCount,
  downvoteCount,
  myVote,
  canVote,
  isVoting,
  onVote,
  className = "",
}: {
  upvoteCount: number;
  downvoteCount: number;
  myVote: ReviewVote | null;
  /** False for the author's own review: tallies stay visible, buttons do not. */
  canVote: boolean;
  isVoting: boolean;
  onVote: (next: ReviewVote | null) => void;
  className?: string;
}) {
  const { translate } = useLocale();

  if (!canVote) {
    return (
      <div
        className={`flex items-center gap-3 text-2xs font-bold text-(--color-text-muted) tabular-nums ${className}`}
      >
        <span className="inline-flex items-center gap-1">
          <ThumbsUp size={12} aria-hidden />
          {upvoteCount}
        </span>
        <span className="inline-flex items-center gap-1">
          <ThumbsDown size={12} aria-hidden />
          {downvoteCount}
        </span>
      </div>
    );
  }

  const baseClass = `flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-2xs font-bold tabular-nums ${PRESS_CLASS} disabled:cursor-not-allowed disabled:opacity-50`;
  const idleClass =
    "border-(--color-border) text-(--color-text-muted) hover:border-(--color-gold)/40 hover:text-(--color-gold)";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => onVote(myVote === "up" ? null : "up")}
        disabled={isVoting}
        aria-pressed={myVote === "up"}
        aria-label={translate("movies.detail.vote_up")}
        className={`${baseClass} ${
          myVote === "up"
            ? "border-(--color-gold)/60 bg-(--color-gold)/15 text-(--color-gold)"
            : idleClass
        }`}
      >
        <ThumbsUp size={12} aria-hidden />
        {upvoteCount}
      </button>
      <button
        type="button"
        onClick={() => onVote(myVote === "down" ? null : "down")}
        disabled={isVoting}
        aria-pressed={myVote === "down"}
        aria-label={translate("movies.detail.vote_down")}
        className={`${baseClass} ${
          myVote === "down" ? "border-red-500/50 bg-red-500/10 text-red-400" : idleClass
        }`}
      >
        <ThumbsDown size={12} aria-hidden />
        {downvoteCount}
      </button>
    </div>
  );
}
