"use server";

import { apiMutation } from "@/libs/api";
import { getReviews } from "./api";
import type { ReviewsResponse } from "./types";

export type ActionResult<T> =
  { success: true; data: T } | { success: false; error: string; status?: number };

function failure(error: unknown): {
  success: false;
  error: string;
  status?: number;
} {
  return {
    success: false,
    error: (error as Error).message,
    status: (error as { status?: number }).status,
  };
}

async function fetchReviews(input: {
  movieSlug: string;
  skip: number;
  limit: number;
}): Promise<ActionResult<ReviewsResponse>> {
  try {
    const result = await getReviews(input);
    if ("error" in result) {
      return {
        success: false,
        error: result.error.message,
        status: result.error.status,
      };
    }
    return { success: true, data: result.data };
  } catch (error: unknown) {
    return failure(error);
  }
}

async function mutateAndRefetch(
  mutate: () => Promise<unknown>,
  movieSlug: string,
  refetchSkip: number,
  refetchLimit: number,
): Promise<ActionResult<ReviewsResponse>> {
  try {
    await mutate();
    return await fetchReviews({ movieSlug, skip: refetchSkip, limit: refetchLimit });
  } catch (error: unknown) {
    return failure(error);
  }
}

export async function loadReviewsAction(input: {
  movieSlug: string;
  skip: number;
  limit: number;
}): Promise<ActionResult<ReviewsResponse>> {
  return fetchReviews(input);
}

export async function createReviewAction(
  input: {
    movieSlug: string;
    rating: number;
    comment: string;
    refetchSkip?: number;
    refetchLimit: number;
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
  );
}

export async function updateReviewAction(
  input: {
    reviewId: string;
    movieSlug: string;
    rating: number;
    comment: string;
    refetchSkip?: number;
    refetchLimit: number;
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
  );
}

export async function deleteReviewAction(
  input: {
    reviewId: string;
    movieSlug: string;
    refetchSkip?: number;
    refetchLimit: number;
  },
  token: string,
): Promise<ActionResult<ReviewsResponse>> {
  return mutateAndRefetch(
    () => apiMutation(`/reviews/${input.reviewId}`, { method: "DELETE" }, token),
    input.movieSlug,
    input.refetchSkip ?? 0,
    input.refetchLimit,
  );
}
