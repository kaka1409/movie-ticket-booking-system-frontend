"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Badge from "@/components/ui/Badge";
import AdminPagination from "@/app/(admin)/admin/components/shared/AdminPagination";
import AdminTable, {
  type AdminTableColumn,
} from "@/app/(admin)/admin/components/shared/AdminTable";
import type { AdminPaginationMeta, AdminReview } from "@/features/admin/types";
import type { AdminReviewStatusFilter } from "@/features/admin/api";
import { formatCalendarDate } from "@/libs/date";
import AdminAvatar from "../../components/shared/AdminAvatar";
import AdminPoster from "../../components/shared/AdminPoster";
import ReviewInlineEdit from "./ReviewInlineEdit";
import ReviewsFiltersCard, { type ReviewFilterDraft } from "./ReviewsFiltersCard";

interface ReviewsManagerProps {
  reviews: AdminReview[];
  pagination: AdminPaginationMeta;
  movies: { slug: string; title: string }[];
  search: string;
  movieSlug: string;
  userId: string;
  rating: number;
  status: AdminReviewStatusFilter;
  sort: string;
}

/**
 * Review moderation table over `GET /reviews/admin`. Backend-paginated like
 * `/user/list`, so filters and page live in the URL; rows expand into the
 * moderation panel (`ReviewInlineEdit`).
 */
export default function ReviewsManager({
  reviews,
  pagination,
  movies,
  search,
  movieSlug,
  userId,
  rating,
  status,
  sort,
}: ReviewsManagerProps) {
  const { translate, locale } = useLocale();
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();

  /** Filters as committed in the URL — pagination links build on these. */
  const appliedFilters: ReviewFilterDraft = {
    search,
    movieSlug,
    userId,
    rating,
    status,
    sort,
  };

  const buildHref = (filters: ReviewFilterDraft, page = 1) => {
    const params = new URLSearchParams();

    if (filters.search !== "") params.set("search", filters.search);
    if (filters.movieSlug !== "") params.set("movieSlug", filters.movieSlug);
    if (filters.userId !== "") params.set("userId", filters.userId);
    if (filters.rating > 0) params.set("rating", String(filters.rating));
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.sort !== "recent") params.set("sort", filters.sort);
    if (page > 1) params.set("page", String(page));

    const query = params.toString();
    return query === "" ? "/admin/reviews" : `/admin/reviews?${query}`;
  };

  const navigate = (href: string) => startNavigation(() => router.push(href));

  const columns: AdminTableColumn<AdminReview>[] = [
    {
      id: "user",
      headerKey: "admin.reviews.column_user",
      cell: (r) => (
        <div className="flex min-w-0 items-center gap-2">
          <AdminAvatar
            name={r.user.fullname}
            avatarUrl={r.user.avatarUrl}
            size={26}
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-(--color-text-primary)">{r.user.fullname}</p>
            <p className="truncate text-[11px] text-(--color-text-muted)">{r.user.email}</p>
          </div>
        </div>
      ),
    },
    {
      id: "movie",
      headerKey: "admin.reviews.column_movie",
      cell: (r) => (
        <div className="flex min-w-0 items-center gap-2">
          <AdminPoster src={r.movie.posterUrl} alt={r.movie.title} className="h-9 w-14" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-(--color-text-primary)">{r.movie.title}</p>
            <p className="truncate text-[11px] text-(--color-text-muted)">{r.movie.genre}</p>
          </div>
        </div>
      ),
    },
    {
      id: "rating",
      headerKey: "admin.reviews.column_rating",
      className: "w-20",
      cell: (r) => <span className="tabular-nums">{r.rating}/10</span>,
    },
    {
      id: "comment",
      headerKey: "admin.reviews.column_comment",
      cell: (r) => <p className="line-clamp-2 text-[12px]">{r.comment || "—"}</p>,
    },
    {
      id: "votes",
      headerKey: "admin.reviews.column_votes",
      className: "w-24",
      cell: (r) => (
        <span className="text-[11px] tabular-nums">
          <span className="text-emerald-400">▲{r.upvoteCount}</span>{" "}
          <span className="text-rose-400">▼{r.downvoteCount}</span>
        </span>
      ),
    },
    {
      id: "status",
      headerKey: "admin.reviews.column_status",
      className: "w-24",
      cell: (r) => (
        <Badge variant={r.deletedAt ? "error" : "success"} size="xs">
          {translate(r.deletedAt ? "admin.reviews.status_deleted" : "admin.reviews.status_live")}
        </Badge>
      ),
    },
    {
      id: "created",
      headerKey: "admin.reviews.column_created",
      className: "w-32",
      cell: (r) => (
        <span className="text-[11px]">{formatCalendarDate(r.createdAt.slice(0, 10), locale)}</span>
      ),
    },
  ];

  const isFiltered =
    appliedFilters.search !== "" ||
    appliedFilters.movieSlug !== "" ||
    appliedFilters.userId !== "" ||
    appliedFilters.rating > 0 ||
    appliedFilters.status !== "all" ||
    appliedFilters.sort !== "recent";

  return (
    <>
      <ReviewsFiltersCard
        movies={movies}
        search={search}
        movieSlug={movieSlug}
        userId={userId}
        rating={rating}
        status={status}
        sort={sort}
        total={pagination.total}
        isFiltered={isFiltered}
        onApply={(draft) => navigate(buildHref({ ...appliedFilters, ...draft }))}
        onClear={() => navigate("/admin/reviews")}
      />

      <div className={isNavigating ? "pointer-events-none opacity-60 transition-opacity" : ""}>
        <AdminTable
          columns={columns}
          rows={reviews}
          getRowId={(r) => r.id}
          emptyIcon={MessageSquare}
          emptyTitleKey={isFiltered ? "admin.common.no_results" : "admin.reviews.empty_title"}
          emptyDescriptionKey={
            isFiltered ? "admin.common.no_results_body" : "admin.reviews.empty_body"
          }
          captionKey="admin.reviews.title"
          renderExpanded={(review) => <ReviewInlineEdit key={review.id} review={review} />}
        />

        <AdminPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          hrefFor={(p) => buildHref(appliedFilters, p)}
        />
      </div>
    </>
  );
}
