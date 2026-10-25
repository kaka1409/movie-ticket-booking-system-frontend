"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useMovieList } from "@/features/movies/context";
import {
  RELEASE_OPTIONS,
  RELEASE_LABEL_KEYS,
  LENGTH_OPTIONS,
  LENGTH_LABEL_KEYS,
  RATING_MIN,
  RATING_MAX,
  RATING_STEP,
} from "@/features/movies/constants";
import Chip from "@/components/ui/Chip";
import RangeSlider from "@/components/ui/RangeSlider";
import FilterCheckRow from "../shared/FilterCheckRow";
import { FILTER_LABEL_CLASS } from "../shared/FilterLabel";
import type { Filters } from "@/features/movies/types";

export default function FilterPanel() {
  const { translate } = useLocale();
  const {
    filtersOpen,
    toggleFiltersOpen,
    activeFilterCount,
    clearFilters,
    filters,
    setFilters,
    applyFilters,
    filterOptions,
  } = useMovieList();

  const toggleGenre = (genre: string) =>
    setFilters({
      ...filters,
      genres: filters.genres.includes(genre)
        ? filters.genres.filter((existingGenre) => existingGenre !== genre)
        : [...filters.genres, genre],
    });

  const toggleSingle = (field: keyof Omit<Filters, "genres">) => (selectedValue: string) => {
    setFilters({
      ...filters,
      [field]: filters[field] === selectedValue ? "" : selectedValue,
    });
  };

  return (
    <section className="mx-(--space-md) rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface)">
      <button
        type="button"
        onClick={toggleFiltersOpen}
        className="flex w-full items-center justify-between p-(--space-md)"
        aria-expanded={filtersOpen}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-(--color-gold)" />
          <span className="text-sm font-bold text-white">{translate("movies.filters")}</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--color-gold) text-[10px] font-black text-black">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <span
              role="button"
              onClick={(event) => {
                event.stopPropagation();
                clearFilters();
              }}
              className="text-xs font-semibold uppercase tracking-widest text-(--color-text-muted) hover:text-(--color-gold)"
            >
              {translate("movies.clear_all")}
            </span>
          )}
          <ChevronDown
            size={18}
            className={`text-(--color-gold) transition-transform duration-200 ${filtersOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${filtersOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden min-h-0">
          <div className="space-y-5 border-t border-(--color-border) p-(--space-md)">
            <div>
              <p className={FILTER_LABEL_CLASS}>{translate("movies.release_date")}</p>
              <div className="flex flex-wrap gap-2">
                {RELEASE_OPTIONS.map((option) => (
                  <Chip
                    key={option.token}
                    label={translate(RELEASE_LABEL_KEYS[option.token])}
                    active={filters.releaseDate === option.token}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        releaseDate: filters.releaseDate === option.token ? "" : option.token,
                      })
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <p className={FILTER_LABEL_CLASS}>{translate("movies.genre")}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {filterOptions.genres.map((genre) => (
                  <FilterCheckRow
                    key={genre.id}
                    label={genre.name}
                    checked={filters.genres.includes(genre.name)}
                    onChange={() => toggleGenre(genre.name)}
                  />
                ))}
              </div>
            </div>

            {/* Rating range slider (backend scale 0–10) — the two edges mean "unbounded" */}
            <div>
              <p className={FILTER_LABEL_CLASS}>{translate("movies.rating")}</p>
              <RangeSlider
                min={RATING_MIN}
                max={RATING_MAX}
                step={RATING_STEP}
                valueMin={filters.ratingMin ? Number(filters.ratingMin) : RATING_MIN}
                valueMax={filters.ratingMax !== "" ? Number(filters.ratingMax) : RATING_MAX}
                labelMin={translate("movies.rating_min")}
                labelMax={translate("movies.rating_max")}
                onValueMinChange={(value) =>
                  setFilters({
                    ...filters,
                    ratingMin: value > RATING_MIN ? String(value) : "",
                  })
                }
                onValueMaxChange={(value) =>
                  setFilters({
                    ...filters,
                    ratingMax: value < RATING_MAX ? String(value) : "",
                  })
                }
              />
              <div className="mt-1 flex items-center justify-between text-sm font-bold tabular-nums">
                <span
                  className={
                    filters.ratingMin ? "text-(--color-gold)" : "text-(--color-text-muted)"
                  }
                >
                  {filters.ratingMin ? `≥ ${filters.ratingMin}` : "—"}
                </span>
                <span
                  className={
                    filters.ratingMax ? "text-(--color-gold)" : "text-(--color-text-muted)"
                  }
                >
                  {filters.ratingMax ? `≤ ${filters.ratingMax}` : "—"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={FILTER_LABEL_CLASS}>{translate("movies.length")}</p>
                <div className="flex flex-col gap-2">
                  {LENGTH_OPTIONS.map((option) => (
                    <FilterCheckRow
                      key={option}
                      label={translate(LENGTH_LABEL_KEYS[option])}
                      checked={filters.length === option}
                      onChange={() => toggleSingle("length")(option)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className={FILTER_LABEL_CLASS}>{translate("movies.age_rating")}</p>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.ageRatings.map((ageRating) => (
                    <Chip
                      key={ageRating.id}
                      label={ageRating.name}
                      active={filters.ageRating === ageRating.name}
                      onClick={() => toggleSingle("ageRating")(ageRating.name)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className={FILTER_LABEL_CLASS}>{translate("movies.format")}</p>
              <div className="flex flex-wrap gap-2">
                {filterOptions.formats.map((format) => (
                  <Chip
                    key={format.id}
                    label={format.name}
                    active={filters.format === format.name}
                    onClick={() => toggleSingle("format")(format.name)}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={applyFilters}
              className="
                w-full rounded-(--radius-md) bg-(--color-gold) py-3.5
                text-sm font-extrabold uppercase tracking-widest text-black
                shadow-(--shadow-glow) transition-all duration-150
                hover:bg-(--color-gold-dark) active:scale-[0.98]
              "
            >
              {translate("movies.apply_filters")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
