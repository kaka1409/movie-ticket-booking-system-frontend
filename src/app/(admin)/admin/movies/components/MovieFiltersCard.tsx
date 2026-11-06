"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Chip from "@/components/ui/Chip";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminSearchInput from "@/app/(admin)/admin/components/shared/AdminSearchInput";
import {
  ADMIN_CARD_CLASS,
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
} from "@/features/admin/constants";
import type {
  AdminCatalogEntry,
  AdminMovieFeaturedState,
  AdminMovieStatus,
} from "@/features/admin/types";

/** Draft the card hands to `onApply` — wire param names for the URL commit. */
export interface MovieFilterDraft {
  search: string;
  status: string;
  genres: string;
  ageRating: string;
  releaseFrom: string;
  releaseTo: string;
  featuredState: AdminMovieFeaturedState | "";
}

const STATUS_OPTIONS: { value: AdminMovieStatus; labelKey: string }[] = [
  { value: "now_showing", labelKey: "admin.movies.status_now_showing" },
  { value: "coming_soon", labelKey: "admin.movies.status_coming_soon" },
  { value: "ended", labelKey: "admin.movies.status_ended" },
];

const FEATURED_STATE_OPTIONS: {
  value: AdminMovieFeaturedState;
  labelKey: string;
}[] = [
  { value: "flagged", labelKey: "admin.movies.featured_flagged" },
  { value: "active", labelKey: "admin.movies.featured_active" },
  { value: "scheduled", labelKey: "admin.movies.featured_scheduled" },
  { value: "expired", labelKey: "admin.movies.featured_expired" },
];

/**
 * Compact filter card above the movie table: search + create on top, a labeled
 * field grid of selectable chips and date inputs, Apply/Clear footer. Edits
 * stay local until Apply — one URL navigation per commit, like the other
 * console tables.
 */
export default function MovieFiltersCard({
  genres,
  ageRatings,
  search,
  status,
  genre,
  ageRating,
  releaseFrom,
  releaseTo,
  featuredState,
  isFiltered,
  onApply,
  onClear,
  onCreate,
}: {
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
  isFiltered: boolean;
  onApply: (draft: MovieFilterDraft) => void;
  onClear: () => void;
  onCreate: () => void;
}) {
  const { translate } = useLocale();

  const [searchInput, setSearchInput] = useState(search);
  const [statusValue, setStatusValue] = useState(status);
  const [genreValue, setGenreValue] = useState(genre);
  const [ageRatingValue, setAgeRatingValue] = useState(ageRating);
  const [releaseFromValue, setReleaseFromValue] = useState(releaseFrom);
  const [releaseToValue, setReleaseToValue] = useState(releaseTo);
  const [featuredStateValue, setFeaturedStateValue] = useState(featuredState);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApply({
      search: searchInput,
      status: statusValue,
      genres: genreValue,
      ageRating: ageRatingValue,
      releaseFrom: releaseFromValue,
      releaseTo: releaseToValue,
      featuredState: featuredStateValue,
    });
  };

  const handleClear = () => {
    setSearchInput("");
    setStatusValue("");
    setGenreValue("");
    setAgeRatingValue("");
    setReleaseFromValue("");
    setReleaseToValue("");
    setFeaturedStateValue("");
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className={`${ADMIN_CARD_CLASS} mb-3 p-3`}>
      <div className="flex items-center gap-2">
        <AdminSearchInput
          value={searchInput}
          onChange={setSearchInput}
          className="min-w-0 flex-1"
          placeholderKey="admin.movies.search"
        />
        <AdminButton icon={Plus} variant="primary" size="md" onClick={onCreate}>
          {translate("admin.movies.new")}
        </AdminButton>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-(--color-border) pt-3 sm:grid-cols-3">
        <div>
          <span className={ADMIN_LABEL_CLASS}>{translate("admin.movies.column_status")}</span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Chip
              label={translate("admin.movies.all_statuses")}
              active={statusValue === ""}
              onClick={() => setStatusValue("")}
              variant="selectable"
            />
            {STATUS_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={translate(option.labelKey)}
                active={statusValue === option.value}
                onClick={() =>
                  setStatusValue(statusValue === option.value ? "" : option.value)
                }
                variant="selectable"
              />
            ))}
          </div>
        </div>

        <div>
          <span className={ADMIN_LABEL_CLASS}>{translate("admin.movies.filter_genre")}</span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Chip
              label={translate("admin.movies.all_genres")}
              active={genreValue === ""}
              onClick={() => setGenreValue("")}
              variant="selectable"
            />
            {genres.map((entry) => (
              <Chip
                key={entry.id}
                label={entry.name}
                active={genreValue === entry.name}
                onClick={() => setGenreValue(genreValue === entry.name ? "" : entry.name)}
                variant="selectable"
              />
            ))}
          </div>
        </div>

        <div>
          <span className={ADMIN_LABEL_CLASS}>
            {translate("admin.movies.filter_age_rating")}
          </span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Chip
              label={translate("admin.movies.all_age_ratings")}
              active={ageRatingValue === ""}
              onClick={() => setAgeRatingValue("")}
              variant="selectable"
            />
            {ageRatings.map((entry) => (
              <Chip
                key={entry.id}
                label={entry.name}
                active={ageRatingValue === entry.name}
                onClick={() =>
                  setAgeRatingValue(ageRatingValue === entry.name ? "" : entry.name)
                }
                variant="selectable"
              />
            ))}
          </div>
        </div>

        <div>
          <span className={ADMIN_LABEL_CLASS}>{translate("admin.movies.filter_featured")}</span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Chip
              label={translate("admin.common.all")}
              active={featuredStateValue === ""}
              onClick={() => setFeaturedStateValue("")}
              variant="selectable"
            />
            {FEATURED_STATE_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={translate(option.labelKey)}
                active={featuredStateValue === option.value}
                onClick={() =>
                  setFeaturedStateValue(
                    featuredStateValue === option.value ? "" : option.value,
                  )
                }
                variant="selectable"
              />
            ))}
          </div>
        </div>

        <label className="block">
          <span className={ADMIN_LABEL_CLASS}>
            {translate("admin.movies.filter_release_from")}
          </span>
          <input
            type="date"
            value={releaseFromValue}
            onChange={(event) => setReleaseFromValue(event.target.value)}
            className={`${ADMIN_INPUT_CLASS} mt-1.5`}
          />
        </label>

        <label className="block">
          <span className={ADMIN_LABEL_CLASS}>
            {translate("admin.movies.filter_release_to")}
          </span>
          <input
            type="date"
            value={releaseToValue}
            onChange={(event) => setReleaseToValue(event.target.value)}
            className={`${ADMIN_INPUT_CLASS} mt-1.5`}
          />
        </label>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-(--color-border) pt-3">
        <AdminButton type="submit" variant="outline" size="md">
          {translate("admin.common.apply")}
        </AdminButton>
        {isFiltered && (
          <AdminButton onClick={handleClear}>
            {translate("admin.common.clear_filters")}
          </AdminButton>
        )}
      </div>
    </form>
  );
}
