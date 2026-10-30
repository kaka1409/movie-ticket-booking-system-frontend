import enMessages from "@/locales/en.json";
import vnMessages from "@/locales/vn.json";
import type { FilterOptions, CatalogOption } from "../types";
import { FALLBACK_AGE_RATINGS, FALLBACK_FORMATS, FALLBACK_GENRES } from "../constants";

type FilterCatalog = keyof FilterOptions;

function fallbackCatalog(kind: FilterCatalog, locale: "en" | "vn"): CatalogOption[] {
  const fallback = {
    genres: FALLBACK_GENRES,
    formats: FALLBACK_FORMATS,
    ageRatings: FALLBACK_AGE_RATINGS,
  }[kind];
  const genreLabels = (locale === "vn" ? vnMessages : enMessages).movies.genre_name as Record<
    string,
    string
  >;

  return fallback.map((name) => ({
    id: name,
    name:
      kind === "genres"
        ? (genreLabels[name.toLowerCase().replace(/[^a-z]/g, "")] ?? name)
        : name,
  }));
}

/** Initial options keep filter controls usable while endpoint catalogs stream in. */
export function getFallbackFilterOptions(locale: "en" | "vn"): FilterOptions {
  return {
    genres: fallbackCatalog("genres", locale),
    formats: fallbackCatalog("formats", locale),
    ageRatings: fallbackCatalog("ageRatings", locale),
  };
}

/** Use backend catalog rows when available and static options on failure or empty results. */
export function resolveFilterCatalog(
  kind: FilterCatalog,
  rows: CatalogOption[] | null,
  locale: "en" | "vn",
): CatalogOption[] {
  return rows && rows.length > 0 ? rows : fallbackCatalog(kind, locale);
}
