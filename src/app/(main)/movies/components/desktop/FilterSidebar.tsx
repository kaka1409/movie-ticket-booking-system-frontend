"use client";

import { SlidersHorizontal, X } from "lucide-react";
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
import FilterSection from "./FilterSection";
import FilterCheckRow from "../shared/FilterCheckRow";
import type { Filters } from "@/features/movies/types";

/**
 * Collapsed-section indicator: a bare gold dot for a section holding a single
 * setting, the number itself for a multi-select one (Genre). Rendered from the
 * draft — the same source as the chips and check rows inside — so folding a
 * section away never hides the fact that it is set.
 */
function SectionBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-(--color-gold) px-1 text-[9px] font-black text-black">
      {count > 1 ? count : null}
    </span>
  );
}

/**
 * Desktop filter panel — the mobile accordion with its drawer removed: the same
 * draft/apply model (`filters` edits the draft, Apply commits it) and the same
 * sections, but sticky beside the grid and foldable one by one (`FilterSection`).
 *
 * Between 740px and 1023px the sidebar stacks above the grid at full width, so
 * the sections lay out two-up there (`items-start`, so folding one does not
 * stretch its neighbour) and collapse back to a single column from `lg:`, where
 * the sidebar is 300px wide.
 *
 * From `lg:` it is sticky and shows **every** section at once — no viewport cap
 * and no scroll region of its own, so the panel never hides a filter behind an
 * (invisible) inner scrollbar. The cost is that on a short viewport the bottom
 * row (Apply) can sit below the fold; sticky releases at the end of the grid,
 * so the page scroll still reaches it. The Genre section lays out two-up (the
 * other sections are short enough to stay single-column at 300px).
 *
 * Every indicator in here — the section badges and the header count that gates
 * Clear All — is derived from the **draft**, because that is what the controls on
 * screen show. `activeFilterCount` from the context counts the *committed*
 * filters and drives the mobile panel's badge instead.
 */
export default function FilterSidebar() {
  const { translate } = useLocale();
  const { filters, setFilters, applyFilters, clearFilters, filterOptions } = useMovieList();

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

  /* How many settings each section holds — `1` for the single-value sections,
     the genre count for the multi-select one. */
  const sectionActive = {
    releaseDate: filters.releaseDate ? 1 : 0,
    genres: filters.genres.length,
    rating: filters.ratingMin || filters.ratingMax ? 1 : 0,
    length: filters.length ? 1 : 0,
    ageRating: filters.ageRating ? 1 : 0,
    format: filters.format ? 1 : 0,
  };
  const draftFilterCount = Object.values(sectionActive).filter(Boolean).length;

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <SlidersHorizontal size={16} className="shrink-0 text-(--color-gold)" />
            <span className="truncate text-sm font-bold text-white">
              {translate("movies.filters")}
            </span>
            {draftFilterCount > 0 && (
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-(--color-gold) px-1 text-[10px] font-black text-black">
                {draftFilterCount}
              </span>
            )}
          </div>

          {/* Clears the draft *and* the committed filters, plus the search box. */}
          {draftFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex shrink-0 items-center gap-1 text-[10px] font-bold tracking-widest text-(--color-text-muted) uppercase transition-colors hover:text-(--color-gold)"
            >
              <X size={12} aria-hidden="true" />
              {translate("movies.clear_all")}
            </button>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 items-start gap-x-6 gap-y-4 border-t border-(--color-border) pt-4 lg:grid-cols-1">
          {/* Release Date */}
          <FilterSection
            title={translate("movies.release_date")}
            badge={<SectionBadge count={sectionActive.releaseDate} />}
          >
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
          </FilterSection>

          {/* Genre — the multi-select section, so its badge carries the count */}
          <FilterSection
            title={translate("movies.genre")}
            badge={<SectionBadge count={sectionActive.genres} />}
          >
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
          </FilterSection>

          {/* Rating range slider (backend scale 0–10) — the two edges mean "unbounded" */}
          <FilterSection
            title={translate("movies.rating")}
            badge={<SectionBadge count={sectionActive.rating} />}
            className="col-span-full lg:col-span-1"
          >
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
                className={filters.ratingMin ? "text-(--color-gold)" : "text-(--color-text-muted)"}
              >
                {filters.ratingMin ? `≥ ${filters.ratingMin}` : "—"}
              </span>
              <span
                className={filters.ratingMax ? "text-(--color-gold)" : "text-(--color-text-muted)"}
              >
                {filters.ratingMax ? `≤ ${filters.ratingMax}` : "—"}
              </span>
            </div>
          </FilterSection>

          {/* Length */}
          <FilterSection
            title={translate("movies.length")}
            badge={<SectionBadge count={sectionActive.length} />}
          >
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
          </FilterSection>

          {/* Age Rating */}
          <FilterSection
            title={translate("movies.age_rating")}
            badge={<SectionBadge count={sectionActive.ageRating} />}
          >
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
          </FilterSection>

          {/* Format */}
          <FilterSection
            title={translate("movies.format")}
            badge={<SectionBadge count={sectionActive.format} />}
          >
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
          </FilterSection>
        </div>

        <button
          type="button"
          onClick={applyFilters}
          className="mt-5 w-full rounded-(--radius-md) bg-(--color-gold) py-3.5 text-sm font-extrabold tracking-widest text-black uppercase shadow-(--shadow-glow) transition-all duration-150 hover:bg-(--color-gold-dark) active:scale-[0.98]"
        >
          {translate("movies.apply_filters")}
        </button>
      </div>
    </aside>
  );
}
