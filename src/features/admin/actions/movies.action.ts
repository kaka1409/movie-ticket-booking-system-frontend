"use server";

import { apiFetch } from "@/libs/api";
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
  return mutateAdmin<AdminMovie>("POST", "/movies", token, input);
}

/** `slug` is immutable: it is the public URL every deep link already points at. */
export async function updateMovieAction(
  token: string,
  slug: string,
  input: AdminMovieInput,
): Promise<AdminActionResult<AdminMovie>> {
  return mutateAdmin<AdminMovie>("PATCH", `/movies/${slug}`, token, input);
}

/** Answers `409 MOVIE_IN_USE` while showtimes, reviews or wishlists reference it. */
export async function deleteMovieAction(
  token: string,
  slug: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("DELETE", `/movies/${slug}`, token);
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
      `/movies/${slug}/cast`,
      { cache: "no-store" },
      token,
      await getRequestCookie(),
    );

    if ("error" in result) {
      return { success: false, error: result.error.message, status: result.error.status };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function addMovieCastAction(
  token: string,
  slug: string,
  input: AdminCastInput,
): Promise<AdminActionResult<AdminMovieCastItem>> {
  return mutateAdmin<AdminMovieCastItem>("POST", `/movies/${slug}/cast`, token, input);
}

export async function updateMovieCastAction(
  token: string,
  slug: string,
  castId: string,
  input: AdminCastInput,
): Promise<AdminActionResult<AdminMovieCastItem>> {
  return mutateAdmin<AdminMovieCastItem>("PATCH", `/movies/${slug}/cast/${castId}`, token, input);
}

export async function deleteMovieCastAction(
  token: string,
  slug: string,
  castId: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("DELETE", `/movies/${slug}/cast/${castId}`, token);
}
