import { z } from "zod";
import {
  optionalDate,
  optionalInteger,
  TRAILER_URL_PATTERN,
  SLUG_PATTERN,
  type Translate,
} from "./shared";

/**
 * Movie form. `slug` is only validated on create (the backend treats it as
 * immutable afterwards) and `status` moves forward only — the service rejects a
 * step backwards, which surfaces as a normal submit error.
 */
export function createMovieSchema(translate: Translate, isEditing: boolean) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, translate("admin.movies.title_required"))
      .max(255, translate("admin.movies.too_long")),
    slug: isEditing
      ? z.string()
      : z
          .string()
          .trim()
          .max(255, translate("admin.movies.too_long"))
          .refine(
            (value) => value === "" || SLUG_PATTERN.test(value),
            translate("admin.movies.slug_invalid"),
          ),
    status: z.enum(["now_showing", "coming_soon", "ended"]),
    director: z.string().trim().max(255, translate("admin.movies.too_long")),
    language: z.string().trim().max(50, translate("admin.movies.too_long")),
    duration: optionalInteger(1, 600, translate("admin.movies.duration_invalid")),
    releaseDate: optionalDate(translate("admin.movies.date_invalid")),
    featuredFrom: optionalDate(translate("admin.movies.date_invalid")),
    featuredTo: optionalDate(translate("admin.movies.date_invalid")),
    featuredOrder: optionalInteger(0, 999, translate("admin.common.number_required")),
    ageRatingId: z.string().optional(),
    posterUrl: z.string().trim().max(1024, translate("admin.movies.too_long")),
    trailerUrl: z
      .string()
      .trim()
      .max(2048, translate("admin.movies.too_long"))
      .refine(
        (value) => value === "" || TRAILER_URL_PATTERN.test(value),
        translate("admin.movies.trailer_url_invalid"),
      ),
    synopsis: z.string().trim().max(4000, translate("admin.movies.too_long")),
    synopsisVi: z.string().trim().max(4000, translate("admin.movies.too_long")),
    featuredLabel: z.string().trim().max(120, translate("admin.movies.too_long")),
    featuredLabelVi: z.string().trim().max(120, translate("admin.movies.too_long")),
    featuredDescription: z.string().trim().max(600, translate("admin.movies.too_long")),
    featuredDescriptionVi: z.string().trim().max(600, translate("admin.movies.too_long")),
    genreIds: z.array(z.string().uuid()).max(20, translate("admin.movies.too_many_genres")),
    isFeatured: z.boolean(),
  });
}

export type AdminMovieFormValues = z.infer<ReturnType<typeof createMovieSchema>>;
