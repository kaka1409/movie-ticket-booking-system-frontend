"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clapperboard, Star, StarOff, Trash2, UsersRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminDeleteDialog from "@/app/(admin)/admin/components/shared/AdminDeleteDialog";
import AdminPagination from "@/app/(admin)/admin/components/shared/AdminPagination";
import AdminTable, {
  type AdminTableColumn,
} from "@/app/(admin)/admin/components/shared/AdminTable";
import { resolveAdminError } from "@/features/admin/errorMessages";
import { formatCalendarDate } from "@/libs/date";
import {
  deleteMovieAction,
  toggleMovieFeaturedAction,
} from "@/features/admin/actions/movies.action";
import type {
  AdminCatalogEntry,
  AdminMovie,
  AdminMovieFeaturedState,
  AdminMovieStatus,
  AdminPaginationMeta,
} from "@/features/admin/types";
import MovieCastDialog from "./MovieCastDialog";
import MovieFiltersCard from "./MovieFiltersCard";
import MovieFormDialog from "./MovieFormDialog";
import MovieInlineEdit from "./MovieInlineEdit";

const STATUS_BADGE: Record<
  AdminMovieStatus,
  { variant: "success" | "gold" | "neutral"; key: string }
> = {
  now_showing: { variant: "success", key: "admin.movies.status_now_showing" },
  coming_soon: { variant: "gold", key: "admin.movies.status_coming_soon" },
  ended: { variant: "neutral", key: "admin.movies.status_ended" },
};

const FEATURED_BADGE: Record<
  "active" | "scheduled" | "expired",
  { variant: "success" | "gold" | "neutral"; key: string }
> = {
  active: { variant: "success", key: "admin.movies.featured_active" },
  scheduled: { variant: "gold", key: "admin.movies.featured_scheduled" },
  expired: { variant: "neutral", key: "admin.movies.featured_expired" },
};

/**
 * Client-side mirror of the backend `active` window check, for the badge only —
 * the `featuredState` filter stays the source of truth for the row set. Dates
 * arrive as `YYYY-MM-DD`, so a lexicographic compare against today is exact.
 */
function featuredBadgeState(movie: AdminMovie): "active" | "scheduled" | "expired" | null {
  if (!movie.isFeatured) return null;
  const today = new Date().toISOString().slice(0, 10);
  if (movie.featuredTo && movie.featuredTo < today) return "expired";
  if (movie.featuredFrom && movie.featuredFrom > today) return "scheduled";
  return "active";
}

/** The committed filter set the URL carries; `genres` is the wire param name. */
interface MovieFilters {
  search: string;
  status: string;
  genres: string;
  ageRating: string;
  releaseFrom: string;
  releaseTo: string;
  featuredState: string;
}

/**
 * Movie table plus its dialogs. The backend paginates this list, so the page
 * number and filters live in the URL (`AdminPagination` in link mode) rather than
 * in `useAdminTableState`. The toolbar edits stay local until Apply — one
 * navigation per commit, like `UsersManager`.
 */
export default function MoviesManager({
  movies,
  pagination,
  genres,
  ageRatings,
  search,
  status,
  genre,
  ageRating,
  releaseFrom,
  releaseTo,
  featuredState,
}: {
  movies: AdminMovie[];
  pagination?: AdminPaginationMeta;
  genres: AdminCatalogEntry[];
  ageRatings: AdminCatalogEntry[];
  search: string;
  status: string;
  /** Selected genre name — the `genres` wire param carries names, not ids. */
  genre: string;
  ageRating: string;
  releaseFrom: string;
  releaseTo: string;
  featuredState: AdminMovieFeaturedState | "";
}) {
  const { translate, locale } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();
  const [isMutating, startMutation] = useTransition();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [castTarget, setCastTarget] = useState<AdminMovie | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminMovie | null>(null);

  /** Filters as committed in the URL — tab links and pagination build on these. */
  const appliedFilters: MovieFilters = {
    search,
    status,
    genres: genre,
    ageRating,
    releaseFrom,
    releaseTo,
    featuredState,
  };

  const buildHref = (filters: MovieFilters, page = 1) => {
    const params = new URLSearchParams();

    if (filters.search !== "") params.set("search", filters.search);
    if (filters.status !== "") params.set("status", filters.status);
    if (filters.genres !== "") params.set("genres", filters.genres);
    if (filters.ageRating !== "") params.set("ageRating", filters.ageRating);
    if (filters.releaseFrom !== "") params.set("releaseFrom", filters.releaseFrom);
    if (filters.releaseTo !== "") params.set("releaseTo", filters.releaseTo);
    if (filters.featuredState !== "") params.set("featuredState", filters.featuredState);
    if (page > 1) params.set("page", String(page));

    const query = params.toString();
    return query === "" ? "/admin/movies" : `/admin/movies?${query}`;
  };

  const navigate = (href: string) => startNavigation(() => router.push(href));

  const columns: AdminTableColumn<AdminMovie>[] = [
    {
      id: "movie",
      headerKey: "admin.movies.column_movie",
      cell: (movie) => (
        <div className="flex items-center gap-2.5">
          {movie.posterUrl ? (
            /* Admin-supplied URLs are arbitrary hosts, so next/image's allowlist
               does not apply to a poster thumbnail. */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={movie.posterUrl}
              alt=""
              loading="lazy"
              className="h-11 aspect-video shrink-0 rounded-md border border-(--color-border) object-cover"
            />
          ) : (
            <span className="flex h-11 aspect-video shrink-0 items-center justify-center rounded-md bg-(--color-surface-2) text-(--color-text-muted)">
              <Clapperboard size={14} aria-hidden />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-(--color-text-primary)">{movie.title}</p>
            <p className="truncate text-[11px] text-(--color-text-muted)">{movie.slug}</p>
          </div>
        </div>
      ),
    },
    {
      id: "status",
      headerKey: "admin.movies.column_status",
      className: "w-32",
      cell: (movie) => {
        const badge = STATUS_BADGE[movie.status];
        return (
          <Badge variant={badge.variant} size="xs">
            {translate(badge.key)}
          </Badge>
        );
      },
    },
    {
      id: "featured",
      headerKey: "admin.movies.column_featured",
      className: "w-28",
      cell: (movie) => {
        const state = featuredBadgeState(movie);
        if (!state) {
          return <span className="text-(--color-text-muted)">—</span>;
        }
        const badge = FEATURED_BADGE[state];
        return (
          <Badge variant={badge.variant} size="xs">
            {translate(badge.key)}
          </Badge>
        );
      },
    },
    {
      id: "release",
      headerKey: "admin.movies.release_date",
      className: "w-28",
      cell: (movie) => (
        <span className="whitespace-nowrap text-[12px] tabular-nums">
          {movie.releaseDate
            ? formatCalendarDate(movie.releaseDate, locale)
            : translate("admin.common.none")}
        </span>
      ),
    },
    {
      id: "ageRating",
      headerKey: "admin.movies.age_rating",
      className: "w-16",
      cell: (movie) =>
        movie.ageRatingName ? (
          <Badge variant="neutral" size="xs">
            {movie.ageRatingName}
          </Badge>
        ) : (
          <span className="text-(--color-text-muted)">—</span>
        ),
    },
    {
      id: "runtime",
      headerKey: "admin.movies.column_runtime",
      className: "w-24",
      align: "right",
      cell: (movie) => (
        <span className="tabular-nums">
          {movie.duration === undefined ? translate("admin.common.none") : `${movie.duration}′`}
        </span>
      ),
    },
    {
      id: "rating",
      headerKey: "admin.movies.column_rating",
      className: "w-24",
      align: "right",
      cell: (movie) =>
        movie.rating === null ? (
          <span className="text-(--color-text-muted)">—</span>
        ) : (
          <span className="tabular-nums">
            {movie.rating.toFixed(1)}
            <span className="text-[11px] text-(--color-text-muted)"> /10</span>
          </span>
        ),
    },
    {
      id: "actions",
      className: "w-32",
      align: "right",
      cell: (movie) => (
        <div className="flex items-center justify-end gap-1">
          <AdminButton
            size="icon"
            variant="ghost"
            icon={movie.isFeatured ? StarOff : Star}
            label={translate(
              movie.isFeatured
                ? "admin.movies.featured_disable"
                : "admin.movies.featured_enable",
            )}
            disabled={isMutating}
            onClick={() => {
              if (!token) return;
              startMutation(async () => {
                const result = await toggleMovieFeaturedAction(
                  token,
                  movie.slug,
                  !movie.isFeatured,
                );
                if (!result.success) {
                  notify(resolveAdminError(result, translate), { variant: "error" });
                  return;
                }
                notify(translate("admin.common.saved"), { variant: "success" });
                router.refresh();
              });
            }}
          />
          <AdminButton
            size="icon"
            variant="ghost"
            icon={UsersRound}
            label={translate("admin.movies.cast_open")}
            onClick={() => setCastTarget(movie)}
          />
          <AdminButton
            size="icon"
            variant="ghost"
            icon={Trash2}
            label={translate("admin.common.delete")}
            onClick={() => setDeleteTarget(movie)}
          />
        </div>
      ),
    },
  ];

  const isFiltered = Object.values(appliedFilters).some((value) => value !== "");

  return (
    <>
      <MovieFiltersCard
        genres={genres}
        ageRatings={ageRatings}
        search={search}
        status={status}
        genre={genre}
        ageRating={ageRating}
        releaseFrom={releaseFrom}
        releaseTo={releaseTo}
        featuredState={featuredState}
        isFiltered={isFiltered}
        onApply={(draft) => navigate(buildHref({ ...appliedFilters, ...draft }))}
        onClear={() => navigate("/admin/movies")}
        onCreate={() => setIsCreateOpen(true)}
      />

      <div className={isNavigating ? "pointer-events-none opacity-60 transition-opacity" : ""}>
        <AdminTable
          columns={columns}
          rows={movies}
          getRowId={(movie) => movie.id}
          emptyIcon={Clapperboard}
          emptyTitleKey={isFiltered ? "admin.common.no_results" : "admin.movies.empty_title"}
          emptyDescriptionKey={
            isFiltered ? "admin.common.no_results_body" : "admin.movies.empty_body"
          }
          captionKey="admin.movies.title"
          renderExpanded={(movie, closePanel) => (
            <MovieInlineEdit
              key={movie.id}
              movie={movie}
              genres={genres}
              ageRatings={ageRatings}
              onClose={closePanel}
            />
          )}
        />

        {pagination && (
          <AdminPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            hrefFor={(page) => buildHref(appliedFilters, page)}
          />
        )}
      </div>

      <MovieFormDialog
        isOpen={isCreateOpen}
        movie={null}
        genres={genres}
        ageRatings={ageRatings}
        onClose={() => setIsCreateOpen(false)}
      />

      <MovieCastDialog
        isOpen={castTarget !== null}
        movie={castTarget}
        onClose={() => setCastTarget(null)}
      />

      <AdminDeleteDialog
        isOpen={deleteTarget !== null}
        entityName={deleteTarget?.title ?? ""}
        onClose={() => setDeleteTarget(null)}
        onDelete={() => deleteMovieAction(token ?? "", deleteTarget?.slug ?? "")}
        onDeleted={(message) => {
          setDeleteTarget(null);
          notify(message, { variant: "success" });
          router.refresh();
        }}
      />
    </>
  );
}
