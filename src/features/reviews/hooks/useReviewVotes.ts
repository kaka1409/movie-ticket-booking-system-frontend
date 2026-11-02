"use client";

import { useCallback, useRef, useState } from "react";
import { voteReviewAction } from "../action";
import { applyVoteChange, type VoteTally } from "../utils/vote";
import type { ReviewVote, ReviewVoteMap } from "../types";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";

interface ReviewTallySource {
  id: string;
  upvoteCount: number;
  downvoteCount: number;
}

/**
 * Owns the caller's own votes for the reviews on screen. The wire list is the
 * shared (anonymous) read, so the personal half — which side I picked — arrives
 * once as `initialVotes` and is then tracked as local overrides: paging swaps
 * the rows without losing state, and one failed vote rolls its row back.
 */
export function useReviewVotes({ initialVotes }: { initialVotes: ReviewVoteMap }) {
  const { token } = useAuth();
  const { translate } = useLocale();
  const { notify } = useToast();

  const [overrides, setOverrides] = useState<Record<string, VoteTally>>({});
  const [pending, setPending] = useState<Record<string, true>>({});
  // The ref is the guard: two clicks in the same tick both see the old state.
  const inFlight = useRef(new Set<string>());

  const getVote = useCallback(
    (review: ReviewTallySource): VoteTally =>
      overrides[review.id] ?? {
        upvoteCount: review.upvoteCount,
        downvoteCount: review.downvoteCount,
        myVote: initialVotes[review.id] ?? null,
      },
    [overrides, initialVotes],
  );

  const setVote = useCallback(
    async (review: ReviewTallySource, next: ReviewVote | null): Promise<void> => {
      if (!token || inFlight.current.has(review.id)) return;

      const previous = getVote(review);
      inFlight.current.add(review.id);
      setOverrides((current) => ({ ...current, [review.id]: applyVoteChange(previous, next) }));
      setPending((current) => ({ ...current, [review.id]: true }));

      const result = await voteReviewAction({ reviewId: review.id, value: next }, token);

      inFlight.current.delete(review.id);
      setPending((current) => {
        const nextPending = { ...current };
        delete nextPending[review.id];
        return nextPending;
      });

      if (!result.success) {
        setOverrides((current) => ({ ...current, [review.id]: previous }));
        notify(translate("movies.detail.vote_failed"), { variant: "error" });
        return;
      }

      // The server derives the tallies from the rows — trust it over the delta.
      setOverrides((current) => ({
        ...current,
        [review.id]: {
          upvoteCount: result.data.upvoteCount,
          downvoteCount: result.data.downvoteCount,
          myVote: result.data.myVote,
        },
      }));
    },
    [token, getVote, notify, translate],
  );

  const isVoting = useCallback((reviewId: string) => pending[reviewId] === true, [pending]);

  return { getVote, setVote, isVoting };
}
