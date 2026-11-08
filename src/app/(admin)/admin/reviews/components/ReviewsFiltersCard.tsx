"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminFilterChipGroup from "@/app/(admin)/admin/components/shared/AdminFilterChips";
import AdminSearchInput from "@/app/(admin)/admin/components/shared/AdminSearchInput";
import { ADMIN_CARD_CLASS, ADMIN_INPUT_CLASS, ADMIN_LABEL_CLASS } from "@/features/admin/constants";
import type { AdminReviewStatusFilter } from "@/features/admin/types";

/** Draft the card hands to `onApply` — wire param names for the URL commit. */
export interface ReviewFilterDraft {
  search: string;
  movieSlug: string;
  userId: string;
  rating: number;
  status: AdminReviewStatusFilter;
  sort: string;
}

const REVIEW_STATUSES: Exclude<AdminReviewStatusFilter, "all">[] = ["live", "deleted"];
const REVIEW_SORTS = ["recent", "helpful", "highest", "lowest"];

/**
 * Compact filter card above the review table, same shape as `MovieFiltersCard`:
 * search on top, selects/chip groups below, Apply/Clear footer. `userId` rides
 * along untouched so a deep link from a user row survives Apply.
 */
export default function ReviewsFiltersCard({
  movies,
  search,
  movieSlug,
  userId,
  rating,
  status,
  sort,
  total,
  isFiltered,
  onApply,
  onClear,
}: {
  movies: { slug: string; title: string }[];
  search: string;
  movieSlug: string;
  userId: string;
  rating: number;
  status: AdminReviewStatusFilter;
  sort: string;
  total: number;
  isFiltered: boolean;
  onApply: (draft: ReviewFilterDraft) => void;
  onClear: () => void;
}) {
  const { translate } = useLocale();

  const [searchInput, setSearchInput] = useState(search);
  const [movieValue, setMovieValue] = useState(movieSlug);
  const [ratingValue, setRatingValue] = useState(String(rating));
  const [statusValue, setStatusValue] = useState(status === "all" ? "" : status);
  const [sortValue, setSortValue] = useState(sort);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApply({
      search: searchInput,
      movieSlug: movieValue,
      userId,
      rating: Number(ratingValue),
      status: statusValue === "" ? "all" : (statusValue as AdminReviewStatusFilter),
      sort: sortValue,
    });
  };

  const handleClear = () => {
    setSearchInput("");
    setMovieValue("");
    setRatingValue("0");
    setStatusValue("");
    setSortValue("recent");
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className={`${ADMIN_CARD_CLASS} mb-3 p-3`}>
      <AdminSearchInput
        value={searchInput}
        onChange={setSearchInput}
        placeholderKey="admin.reviews.search"
      />

      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-(--color-border) pt-3 sm:grid-cols-4">
        <label className="block">
          <span className={ADMIN_LABEL_CLASS}>{translate("admin.reviews.column_movie")}</span>
          <select
            name="movie"
            value={movieValue}
            onChange={(event) => setMovieValue(event.target.value)}
            className={`${ADMIN_INPUT_CLASS} mt-1.5`}
          >
            <option value="">{translate("admin.common.all")}</option>
            {movies.map((movie) => (
              <option key={movie.slug} value={movie.slug}>
                {movie.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={ADMIN_LABEL_CLASS}>{translate("admin.reviews.column_rating")}</span>
          <select
            name="rating"
            value={ratingValue}
            onChange={(event) => setRatingValue(event.target.value)}
            className={`${ADMIN_INPUT_CLASS} mt-1.5`}
          >
            <option value="0">{translate("admin.common.all")}</option>
            {Array.from({ length: 10 }, (_, index) => index + 1).map((score) => (
              <option key={score} value={score}>
                {score}/10
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={ADMIN_LABEL_CLASS}>{translate("admin.reviews.column_sort")}</span>
          <select
            name="sort"
            value={sortValue}
            onChange={(event) => setSortValue(event.target.value)}
            className={`${ADMIN_INPUT_CLASS} mt-1.5`}
          >
            {REVIEW_SORTS.map((option) => (
              <option key={option} value={option}>
                {translate(`admin.reviews.sort_${option}`)}
              </option>
            ))}
          </select>
        </label>

        <AdminFilterChipGroup
          labelKey="admin.reviews.column_status"
          options={REVIEW_STATUSES.map((option) => ({
            value: option,
            labelKey: `admin.reviews.status_${option}`,
          }))}
          value={statusValue}
          onChange={(value) => setStatusValue(value as AdminReviewStatusFilter)}
        />
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-(--color-border) pt-3">
        <AdminButton type="submit" variant="primary" size="md">
          {translate("admin.common.apply")}
        </AdminButton>
        {isFiltered && (
          <AdminButton onClick={handleClear}>{translate("admin.common.clear_filters")}</AdminButton>
        )}
        <p className="ml-auto text-[11px] font-semibold text-(--color-text-muted)">
          {translate("admin.common.total")}: {total}
        </p>
      </div>
    </form>
  );
}
