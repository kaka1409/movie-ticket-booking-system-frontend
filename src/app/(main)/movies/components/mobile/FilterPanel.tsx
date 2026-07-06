"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useMovies } from "@/contexts/MoviesContext";
import {
  GENRES,
  AGE_RATINGS,
  RELEASE_OPTIONS,
  RATING_OPTIONS,
  LENGTH_OPTIONS,
  FORMAT_OPTIONS,
} from "@/features/movies/constants";
import FilterChip from "./FilterChip";
import FilterCheckRow from "./FilterCheckRow";
import FilterLabel from "./FilterLabel";
import type { Filters } from "./types";

export default function FilterPanel() {
  const { t } = useLocale();
  const {
    filtersOpen,
    toggleFiltersOpen,
    activeFilterCount,
    clearFilters,
    filters,
    setFilters,
    applyFilters,
  } = useMovies();

  const toggleGenre = (g: string) =>
    setFilters({
      ...filters,
      genres: filters.genres.includes(g)
        ? filters.genres.filter((x) => x !== g)
        : [...filters.genres, g],
    });

  const toggleSingle = (field: keyof Omit<Filters, "genres">) => (val: string) => {
    setFilters({
      ...filters,
      [field]: filters[field] === val ? "" : val,
    });
  };

  return (
    <section className="mx-(--space-md) rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface)">
      {/* ── Header (toggle) ── */}
      <button
        onClick={toggleFiltersOpen}
        className="flex w-full items-center justify-between p-(--space-md)"
        aria-expanded={filtersOpen}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-(--color-gold)" />
          <span className="text-sm font-bold text-white">
            {t("movies.filters")}
          </span>
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
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
              className="text-xs font-semibold uppercase tracking-widest text-(--color-text-muted) hover:text-(--color-gold)"
            >
              {t("movies.clear_all")}
            </span>
          )}
          <ChevronDown
            size={18}
            className={`text-(--color-gold) transition-transform duration-200 ${filtersOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* ── Content (animated) ── */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${filtersOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden min-h-0">
          <div className="space-y-5 border-t border-(--color-border) p-(--space-md)">
            {/* Release Date */}
            <div>
              <FilterLabel>{t("movies.release_date")}</FilterLabel>
              <div className="flex flex-wrap gap-2">
                {RELEASE_OPTIONS.map((o) => (
                  <FilterChip
                    key={o}
                    label={o}
                    active={filters.releaseDate === o}
                    onClick={() => setFilters({ ...filters, releaseDate: o })}
                  />
                ))}
              </div>
            </div>

            {/* Genre */}
            <div>
              <FilterLabel>{t("movies.genre")}</FilterLabel>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {GENRES.map((g) => (
                  <FilterCheckRow
                    key={g}
                    label={g}
                    checked={filters.genres.includes(g)}
                    onChange={() => toggleGenre(g)}
                  />
                ))}
              </div>
            </div>

            {/* Rating + Length */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FilterLabel>{t("movies.rating")}</FilterLabel>
                <div className="flex flex-col gap-2">
                  {RATING_OPTIONS.map((o) => (
                    <FilterCheckRow
                      key={o}
                      label={o}
                      checked={filters.rating === o}
                      onChange={() => toggleSingle("rating")(o)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <FilterLabel>{t("movies.length")}</FilterLabel>
                <div className="flex flex-col gap-2">
                  {LENGTH_OPTIONS.map((o) => (
                    <FilterCheckRow
                      key={o}
                      label={o}
                      checked={filters.length === o}
                      onChange={() => toggleSingle("length")(o)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Format + Age Rating */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FilterLabel>{t("movies.format")}</FilterLabel>
                <div className="flex flex-wrap gap-2">
                  {FORMAT_OPTIONS.map((o) => (
                    <FilterChip
                      key={o}
                      label={o}
                      active={filters.format === o}
                      onClick={() => toggleSingle("format")(o)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <FilterLabel>{t("movies.age_rating")}</FilterLabel>
                <div className="flex flex-wrap gap-2">
                  {AGE_RATINGS.map((o) => (
                    <FilterChip
                      key={o}
                      label={o}
                      active={filters.ageRating === o}
                      onClick={() => toggleSingle("ageRating")(o)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Apply */}
            <button
              onClick={applyFilters}
              className="
                w-full rounded-(--radius-md) bg-(--color-gold) py-3.5
                text-sm font-extrabold uppercase tracking-widest text-black
                shadow-(--shadow-glow) transition-all duration-150
                hover:bg-(--color-gold-dark) active:scale-[0.98]
              "
            >
              {t("movies.apply_filters")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
