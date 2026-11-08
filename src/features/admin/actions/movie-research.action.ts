"use server";

import { mutateAdmin } from "../api/mutation";
import type { AdminActionResult, AdminMovie, MovieResearchCandidate } from "../types";

export async function runMovieResearchAction(token: string, model?: string) {
  return mutateAdmin<{ id: string; status: string; discovered: number; enriched: number }>(
    "POST",
    "/admin/movie-research/runs",
    token,
    model ? { model } : {},
  );
}

export type MovieResearchRunControl = "pause" | "resume" | "stop";

export async function controlMovieResearchRunAction(
  token: string,
  runId: string,
  action: MovieResearchRunControl,
) {
  return mutateAdmin<{ status: string }>(
    "POST",
    `/admin/movie-research/runs/${runId}/${action}`,
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

export async function deleteMovieResearchCandidateAction(
  token: string,
  id: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin("DELETE", `/admin/movie-research/candidates/${id}`, token);
}
