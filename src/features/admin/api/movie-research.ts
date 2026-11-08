import { apiFetch } from "@/libs/api";
import type {
  MovieResearchCandidate,
  MovieResearchModel,
  MovieResearchRun,
} from "../types";
import { ADMIN_NO_STORE, adminCookie, buildAdminQuery } from "./shared";

export async function getMovieResearchCandidates(status?: string) {
  return apiFetch<MovieResearchCandidate[]>(
    `/admin/movie-research/candidates${buildAdminQuery({ status })}`,
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}

export async function getMovieResearchRuns() {
  return apiFetch<MovieResearchRun[]>(
    "/admin/movie-research/runs",
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}

export async function getMovieResearchModels() {
  // NO_STORE like the other admin reads; the BE caches the OpenRouter catalog
  // for 10 minutes, so this stays cheap without a stale FE cache layer.
  return apiFetch<MovieResearchModel[]>(
    "/admin/movie-research/models",
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}

export async function deleteMovieResearchCandidate(id: string) {
  return apiFetch<{ id: string }>(
    `/admin/movie-research/candidates/${id}`,
    { method: "DELETE" },
    undefined,
    await adminCookie(),
  );
}
