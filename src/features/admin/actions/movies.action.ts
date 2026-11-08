"use server";

import { actionFailureFromApiError, apiFetch, toActionFailure } from "@/libs/api";
import { getRequestCookie } from "@/libs/session";
import { mutateAdmin } from "../mutation";
import type {
  AdminActionResult,
  AdminCastInput,
  AdminMovie,
  AdminMovieCastItem,
  AdminMovieCreateInput,
  AdminMovieInput,
} from "../types";

export async function createMovieAction(
  token: string,
  input: AdminMovieCreateInput,
): Promise<AdminActionResult<AdminMovie>> {
  return mutateAdmin<AdminMovie>("POST", "/admin/movies", token, input);
}

/** `slug` is immutable: it is the public URL every deep link already points at. */
export async function updateMovieAction(
  token: string,
  slug: string,
  input: AdminMovieInput,
): Promise<AdminActionResult<AdminMovie>> {
  return mutateAdmin<AdminMovie>("PATCH", `/admin/movies/${slug}`, token, input);
}

/**
 * Quick featured toggle from the table — sends only `isFeatured`, so the
 * label/window/order fields the edit dialog owns stay untouched.
 */
export async function toggleMovieFeaturedAction(
  token: string,
  slug: string,
  isFeatured: boolean,
): Promise<AdminActionResult<AdminMovie>> {
  return mutateAdmin<AdminMovie>("PATCH", `/admin/movies/${slug}`, token, { isFeatured });
}

/** Answers `409 MOVIE_IN_USE` while showtimes, reviews or wishlists reference it. */
export async function deleteMovieAction(
  token: string,
  slug: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("DELETE", `/admin/movies/${slug}`, token);
}

/**
 * Cast is read on demand (the edit dialog opens it) rather than shipped with
 * every table row — a list of 50 movies would otherwise carry hundreds of cast
 * entries the operator never looks at.
 */
export async function getMovieCastAction(
  token: string,
  slug: string,
): Promise<AdminActionResult<{ items: AdminMovieCastItem[] }>> {
  try {
    const result = await apiFetch<{ items: AdminMovieCastItem[] }>(
      `/admin/movies/${slug}/cast`,
      { cache: "no-store" },
      token,
      await getRequestCookie(),
    );

    if ("error" in result) {
      return actionFailureFromApiError(result.error);
    }

    return { success: true, data: result.data };
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function addMovieCastAction(
  token: string,
  slug: string,
  input: AdminCastInput,
): Promise<AdminActionResult<AdminMovieCastItem>> {
  return mutateAdmin<AdminMovieCastItem>("POST", `/admin/movies/${slug}/cast`, token, input);
}

export async function updateMovieCastAction(
  token: string,
  slug: string,
  castId: string,
  input: AdminCastInput,
): Promise<AdminActionResult<AdminMovieCastItem>> {
  return mutateAdmin<AdminMovieCastItem>(
    "PATCH",
    `/admin/movies/${slug}/cast/${castId}`,
    token,
    input,
  );
}

export async function deleteMovieCastAction(
  token: string,
  slug: string,
  castId: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("DELETE", `/admin/movies/${slug}/cast/${castId}`, token);
}
