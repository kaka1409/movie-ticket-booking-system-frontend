import type { ReviewVote } from "../types";

export interface VoteTally {
  upvoteCount: number;
  downvoteCount: number;
  myVote: ReviewVote | null;
}

/**
 * Tallies after moving from `current.myVote` to `next` (null = no vote). Pure
 * so the optimistic paint and the rollback share one definition of the delta;
 * the server's recomputed counts replace the result on success.
 */
export function applyVoteChange(current: VoteTally, next: ReviewVote | null): VoteTally {
  let upvoteCount = current.upvoteCount;
  let downvoteCount = current.downvoteCount;

  if (current.myVote === "up") upvoteCount -= 1;
  if (current.myVote === "down") downvoteCount -= 1;
  if (next === "up") upvoteCount += 1;
  if (next === "down") downvoteCount += 1;

  return {
    upvoteCount: Math.max(upvoteCount, 0),
    downvoteCount: Math.max(downvoteCount, 0),
    myVote: next,
  };
}
