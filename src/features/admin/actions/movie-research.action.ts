"use server";

import { mutateAdmin } from "../mutation";
import type { AdminActionResult, AdminMovie, MovieResearchCandidate } from "../types";

export async function runMovieResearchAction(token: string) {
  return mutateAdmin<{ id: string; status: string; discovered: number; enriched: number }>(
    "POST",
    "/admin/movie-research/runs",
    token,
  );
}

export async function updateMovieResearchCandidateAction(
  token: string,
  id: string,
  status: "pending" | "rejected",
): Promise<AdminActionResult<MovieResearchCandidate>> {
  return mutateAdmin("PATCH", `/admin/movie-research/candidates/${id}`, token, { status });
}

export async function importMovieResearchCandidateAction(
  token: string,
  id: string,
): Promise<AdminActionResult<AdminMovie>> {
  return mutateAdmin("POST", `/admin/movie-research/candidates/${id}/import`, token);
}
