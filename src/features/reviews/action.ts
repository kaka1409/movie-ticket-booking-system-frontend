"use server";

import { updateTag } from "next/cache";
import {
  apiMutation,
  toActionFailure,
  actionFailureFromApiError,
  type ActionFailure,
} from "@/libs/api";
import { getRequestLocale } from "@/libs/session";
import { getReviews } from "./api";
import type { ReviewSort, ReviewVote, ReviewVoteState, ReviewsResponse } from "./types";

export type ActionResult<T> = { success: true; data: T } | ActionFailure;

async function getReviewsPage(input: {
  movieSlug: string;
  skip: number;
  limit: number;
  sort: ReviewSort;
}): Promise<ActionResult<ReviewsResponse>> {
  try {
    // Server action: locale comes from the request cookie (no React state here).
    const result = await getReviews(input, await getRequestLocale());
    if ("error" in result) {
      return actionFailureFromApiError(result.error);
    }
    return { success: true, data: result.data };
  } catch (error: unknown) {
    return toActionFailure(error);
  }
}

async function mutateAndRefetch(
  mutate: () => Promise<unknown>,
  movieSlug: string,
  refetchSkip: number,
  refetchLimit: number,
  sort: ReviewSort,
): Promise<ActionResult<ReviewsResponse>> {
  try {
    await mutate();
    // Server-action-only tag invalidation: the refetch below immediately sees
    // fresh data, and every ISR page that rendered with the tag regenerates.
    updateTag("reviews");
    return await getReviewsPage({ movieSlug, skip: refetchSkip, limit: refetchLimit, sort });
  } catch (error: unknown) {
    return toActionFailure(error);
  }
}

/** One page of the detail list; a server action so paging needs no API route. */
export async function loadReviewsAction(input: {
  movieSlug: string;
  skip: number;
  limit: number;
  sort?: ReviewSort;
}): Promise<ActionResult<ReviewsResponse>> {
  return getReviewsPage({ ...input, sort: input.sort ?? "recent" });
}

/**
 * Creates the review, invalidates the `reviews` tag, then returns the page
 * re-rendered — pass the caller's current `refetchSkip`/`refetchLimit`.
 */
export async function createReviewAction(
  input: {
    movieSlug: string;
    rating: number;
    comment: string;
    refetchSkip?: number;
    refetchLimit: number;
    sort?: ReviewSort;
  },
  token: string,
): Promise<ActionResult<ReviewsResponse>> {
  return mutateAndRefetch(
    () =>
      apiMutation(
        "/reviews",
        {
          method: "POST",
          body: JSON.stringify({
            movieSlug: input.movieSlug,
            rating: input.rating,
            comment: input.comment,
          }),
        },
        token,
      ),
    input.movieSlug,
    input.refetchSkip ?? 0,
    input.refetchLimit,
    input.sort ?? "recent",
  );
}

/** Same contract as {@link createReviewAction}. */
export async function updateReviewAction(
  input: {
    reviewId: string;
    movieSlug: string;
    rating: number;
    comment: string;
    refetchSkip?: number;
    refetchLimit: number;
    sort?: ReviewSort;
  },
  token: string,
): Promise<ActionResult<ReviewsResponse>> {
  return mutateAndRefetch(
    () =>
      apiMutation(
        `/reviews/${input.reviewId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            rating: input.rating,
            comment: input.comment,
          }),
        },
        token,
      ),
    input.movieSlug,
    input.refetchSkip ?? 0,
    input.refetchLimit,
    input.sort ?? "recent",
  );
}

/** Same contract as {@link createReviewAction}. */
export async function deleteReviewAction(
  input: {
    reviewId: string;
    movieSlug: string;
    refetchSkip?: number;
    refetchLimit: number;
    sort?: ReviewSort;
  },
  token: string,
): Promise<ActionResult<ReviewsResponse>> {
  return mutateAndRefetch(
    () => apiMutation(`/reviews/${input.reviewId}`, { method: "DELETE" }, token),
    input.movieSlug,
    input.refetchSkip ?? 0,
    input.refetchLimit,
    input.sort ?? "recent",
  );
}

/**
 * Sets (or clears, with `value: null`) the caller's vote and returns the tallies
 * the server recomputed. A vote is a local list update, so the `reviews` tag is
 * deliberately left alone — invalidating it mid-page would refetch the list the
 * caller is looking at.
 */
export async function voteReviewAction(
  input: { reviewId: string; value: ReviewVote | null },
  token: string,
): Promise<ActionResult<ReviewVoteState>> {
  try {
    const response = await apiMutation<{ data: ReviewVoteState }>(
      `/reviews/${encodeURIComponent(input.reviewId)}/vote`,
      input.value === null
        ? { method: "DELETE" }
        : { method: "PUT", body: JSON.stringify({ value: input.value }) },
      token,
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    return toActionFailure(error);
  }
}
