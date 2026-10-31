"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clapperboard, Pencil, Plus, Trash2, UsersRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminDeleteDialog from "@/app/(admin)/admin/components/shared/AdminDeleteDialog";
import AdminPagination from "@/app/(admin)/admin/components/shared/AdminPagination";
import AdminSearchInput from "@/app/(admin)/admin/components/shared/AdminSearchInput";
import AdminTable, {
  type AdminTableColumn,
} from "@/app/(admin)/admin/components/shared/AdminTable";
import { ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import { deleteMovieAction } from "@/features/admin/actions/movies.action";
import type {
  AdminCatalogEntry,
  AdminMovie,
  AdminMovieStatus,
  AdminPaginationMeta,
} from "@/features/admin/types";
import MovieCastDialog from "./MovieCastDialog";
import MovieFormDialog from "./MovieFormDialog";

const STATUS_BADGE: Record<
  AdminMovieStatus,
  { variant: "success" | "gold" | "neutral"; key: string }
> = {
  now_showing: { variant: "success", key: "admin.movies.status_now_showing" },
  coming_soon: { variant: "gold", key: "admin.movies.status_coming_soon" },
  ended: { variant: "neutral", key: "admin.movies.status_ended" },
};

const STATUS_OPTIONS: AdminMovieStatus[] = ["now_showing", "coming_soon", "ended"];

/**
 * Movie table plus its dialogs. The backend paginates this list, so the page
 * number and filters live in the URL (`AdminPagination` in link mode) rather than
 * in `useAdminTableState`.
 */
export default function MoviesManager({
  movies,
  pagination,
  genres,
  ageRatings,
  search,
  status,
}: {
  movies: AdminMovie[];
  pagination?: AdminPaginationMeta;
  genres: AdminCatalogEntry[];
  ageRatings: AdminCatalogEntry[];
  search: string;
  status: string;
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();

  const [searchInput, setSearchInput] = useState(search);
  const [formTarget, setFormTarget] = useState<AdminMovie | "new" | null>(null);
  const [castTarget, setCastTarget] = useState<AdminMovie | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminMovie | null>(null);

  const buildHref = (overrides: { page?: number; search?: string; status?: string }) => {
    const nextSearch = overrides.search ?? search;
    const nextStatus = overrides.status ?? status;
    const nextPage = overrides.page ?? 1;
    const params = new URLSearchParams();

    if (nextSearch !== "") params.set("search", nextSearch);
    if (nextStatus !== "") params.set("status", nextStatus);
    if (nextPage > 1) params.set("page", String(nextPage));

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
              className="h-11 w-8 shrink-0 rounded-md border border-(--color-border) object-cover"
            />
          ) : (
            <span className="flex h-11 w-8 shrink-0 items-center justify-center rounded-md bg-(--color-surface-2) text-(--color-text-muted)">
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
      id: "genres",
      headerKey: "admin.movies.column_genres",
      cell: (movie) => (
        <span className="line-clamp-1 text-[12px]">
          {movie.genres.length === 0
            ? translate("admin.common.none")
            : movie.genres.map((genre) => genre.name).join(", ")}
        </span>
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
      id: "usage",
      headerKey: "admin.movies.column_usage",
      className: "w-28",
      align: "right",
      cell: (movie) => (
        <span className="tabular-nums text-[12px]">
          {movie.counts?.showtimes ?? 0} / {movie.counts?.reviews ?? 0}
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
            icon={UsersRound}
            label={translate("admin.movies.cast_open")}
            onClick={() => setCastTarget(movie)}
          />
          <AdminButton
            size="icon"
            variant="ghost"
            icon={Pencil}
            label={translate("admin.common.edit")}
            onClick={() => setFormTarget(movie)}
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

  const isFiltered = search !== "" || status !== "";

  return (
    <>
      <form
        className="mb-3 flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          navigate(buildHref({ search: searchInput }));
        }}
      >
        <AdminSearchInput
          value={searchInput}
          onChange={setSearchInput}
          className="w-full sm:max-w-xs"
          placeholderKey="admin.movies.search"
        />

        <select
          value={status}
          aria-label={translate("admin.movies.column_status")}
          onChange={(event) => navigate(buildHref({ status: event.target.value }))}
          className={`${ADMIN_INPUT_CLASS} w-auto`}
        >
          <option value="">{translate("admin.movies.all_statuses")}</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {translate(STATUS_BADGE[option].key)}
            </option>
          ))}
        </select>

        {isFiltered && (
          <AdminButton
            onClick={() => {
              setSearchInput("");
              navigate("/admin/movies");
            }}
          >
            {translate("admin.common.clear_search")}
          </AdminButton>
        )}

        <AdminButton
          icon={Plus}
          variant="primary"
          size="md"
          className="ml-auto"
          onClick={() => setFormTarget("new")}
        >
          {translate("admin.movies.new")}
        </AdminButton>
      </form>

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
        />

        {pagination && (
          <AdminPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            hrefFor={(page) => buildHref({ page })}
          />
        )}
      </div>

      <MovieFormDialog
        isOpen={formTarget !== null}
        movie={formTarget === "new" ? null : formTarget}
        genres={genres}
        ageRatings={ageRatings}
        onClose={() => setFormTarget(null)}
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
