import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { AdminListSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";
import type { AdminMovieFeaturedState, AdminMovieStatus } from "@/features/admin/types";
import { MoviesManagerSection } from "./sections";

export const metadata: Metadata = { title: "Movies" };

const STATUSES: AdminMovieStatus[] = ["now_showing", "coming_soon", "ended"];
const FEATURED_STATES: AdminMovieFeaturedState[] = [
  "flagged",
  "active",
  "scheduled",
  "expired",
];
const DATE_PARAM = /^\d{4}-\d{2}-\d{2}$/;
/** Mirrors the BE `ADMIN_MOVIE_SORT_FIELDS` whitelist. */
const MOVIE_SORT_FIELDS = ["title", "status", "releaseDate", "duration", "rating", "createdAt"];

/**
 * Awaits `searchParams` only (the query IS the page's identity), so the header
 * and the filter row paint before the movie list streams in.
 */
export default async function AdminMoviesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    genres?: string;
    ageRating?: string;
    releaseFrom?: string;
    releaseTo?: string;
    featuredState?: string;
    sort?: string;
    dir?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const status = STATUSES.find((candidate) => candidate === params.status) ?? "";
  const featuredState =
    FEATURED_STATES.find((candidate) => candidate === params.featuredState) ?? "";
  const genres = params.genres?.trim() ?? "";
  const ageRating = params.ageRating?.trim() ?? "";
  const releaseFromParam = params.releaseFrom ?? "";
  const releaseToParam = params.releaseTo ?? "";
  const releaseFrom = DATE_PARAM.test(releaseFromParam) ? releaseFromParam : "";
  const releaseTo = DATE_PARAM.test(releaseToParam) ? releaseToParam : "";
  const sort = MOVIE_SORT_FIELDS.find((candidate) => candidate === params.sort) ?? "";
  const dir = params.dir === "asc" || params.dir === "desc" ? params.dir : "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);

  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.cinema"
        titleKey="admin.movies.title"
        descriptionKey="admin.movies.description"
      />
      <Suspense fallback={<AdminListSkeleton filtersCard columns={8} />}>
        <MoviesManagerSection
          search={search}
          status={status}
          genres={genres}
          ageRating={ageRating}
          releaseFrom={releaseFrom}
          releaseTo={releaseTo}
          featuredState={featuredState}
          sort={sort}
          dir={dir}
          page={page}
        />
      </Suspense>
    </>
  );
}
