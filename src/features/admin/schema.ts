import { z } from "zod";

type Translate = (key: string) => string;

/**
 * Zod schemas for the console forms. They are factories because the messages are
 * translated at render time — the storefront forms follow the same rule.
 */

/** Flattens a failed parse into `{ field: firstMessage }` for `AdminFormField`. */
export function toAdminFieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && result[field] === undefined) {
      result[field] = issue.message;
    }
  }

  return result;
}

/** Genres, formats and age ratings share one payload. */
export function createCatalogSchema(translate: Translate) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, translate("admin.catalogs.name_required"))
      .max(60, translate("admin.catalogs.name_too_long")),
    nameVi: z.string().trim().max(60, translate("admin.catalogs.name_too_long")),
    sortOrder: z.coerce
      .number({ error: translate("admin.common.number_required") })
      .int(translate("admin.common.number_required"))
      .min(0)
      .max(999),
    isActive: z.boolean(),
  });
}

export type AdminCatalogFormValues = z.infer<ReturnType<typeof createCatalogSchema>>;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CATEGORY_TOKEN_PATTERN = /^[a-z][a-z0-9_-]*$/;

/** A required money field: blank is invalid, otherwise the amount must be ≥ 0. */
function requiredAmount(message: string) {
  return z
    .string()
    .trim()
    .refine(
      (value) => value !== "" && Number.isFinite(Number(value)) && Number(value) >= 0,
      message,
    );
}

/** A number field that is optional: blank means "not set", anything else must be in range. */
function optionalInteger(min: number, max: number, message: string) {
  return z
    .string()
    .trim()
    .refine(
      (value) => value === "" || (Number.isInteger(Number(value)) && Number(value) >= min && Number(value) <= max),
      message,
    );
}

const optionalDate = (message: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || DATE_PATTERN.test(value), message);

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
          .refine((value) => value === "" || SLUG_PATTERN.test(value), translate("admin.movies.slug_invalid")),
    status: z.enum(["now_showing", "coming_soon", "ended"]),
    director: z.string().trim().max(255, translate("admin.movies.too_long")),
    language: z.string().trim().max(50, translate("admin.movies.too_long")),
    duration: optionalInteger(1, 600, translate("admin.movies.duration_invalid")),
    releaseDate: optionalDate(translate("admin.movies.date_invalid")),
    featuredFrom: optionalDate(translate("admin.movies.date_invalid")),
    featuredTo: optionalDate(translate("admin.movies.date_invalid")),
    featuredOrder: optionalInteger(0, 999, translate("admin.common.number_required")),
    ageRatingId: z.string(),
    posterUrl: z.string().trim().max(1024, translate("admin.movies.too_long")),
    synopsis: z.string().trim().max(4000, translate("admin.movies.too_long")),
    synopsisVi: z.string().trim().max(4000, translate("admin.movies.too_long")),
    featuredLabel: z.string().trim().max(120, translate("admin.movies.too_long")),
    featuredLabelVi: z.string().trim().max(120, translate("admin.movies.too_long")),
    featuredDescription: z.string().trim().max(600, translate("admin.movies.too_long")),
    featuredDescriptionVi: z.string().trim().max(600, translate("admin.movies.too_long")),
    genreIds: z.array(z.string()),
    isFeatured: z.boolean(),
  });
}

export type AdminMovieFormValues = z.infer<ReturnType<typeof createMovieSchema>>;

/** Localised labels for one payment method; the live switch is a separate column. */
export function createPaymentMethodSchema(translate: Translate) {
  return z.object({
    nameEn: z
      .string()
      .trim()
      .min(1, translate("admin.paymentMethods.name_required"))
      .max(60, translate("admin.common.too_long")),
    nameVi: z.string().trim().max(60, translate("admin.common.too_long")),
    descriptionEn: z.string().trim().max(255, translate("admin.common.too_long")),
    descriptionVi: z.string().trim().max(255, translate("admin.common.too_long")),
    sortOrder: z.coerce
      .number({ error: translate("admin.common.number_required") })
      .int(translate("admin.common.number_required"))
      .min(0)
      .max(99),
    isActive: z.boolean(),
  });
}

export type AdminPaymentMethodFormValues = z.infer<ReturnType<typeof createPaymentMethodSchema>>;

/** Snack row. `category` is an open lowercase token, not an enum. */
export function createFoodItemSchema(translate: Translate) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, translate("admin.food.name_required"))
      .max(255, translate("admin.common.too_long")),
    nameVi: z.string().trim().max(255, translate("admin.common.too_long")),
    category: z
      .string()
      .trim()
      .min(1, translate("admin.food.category_required"))
      .max(60, translate("admin.common.too_long"))
      .refine((value) => CATEGORY_TOKEN_PATTERN.test(value), translate("admin.food.category_invalid")),
    price: requiredAmount(translate("admin.food.price_required")),
    image: z.string().trim().max(1024, translate("admin.common.too_long")),
    isActive: z.boolean(),
  });
}

export type AdminFoodItemFormValues = z.infer<ReturnType<typeof createFoodItemSchema>>;

/** Combos are standalone catalog rows — they never reference a snack. */
export function createComboSchema(translate: Translate) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, translate("admin.combos.name_required"))
      .max(255, translate("admin.common.too_long")),
    nameVi: z.string().trim().max(255, translate("admin.common.too_long")),
    description: z.string().trim().max(2048, translate("admin.common.too_long")),
    descriptionVi: z.string().trim().max(2048, translate("admin.common.too_long")),
    price: requiredAmount(translate("admin.combos.price_required")),
    image: z.string().trim().max(1024, translate("admin.common.too_long")),
    tag: z.string().trim().max(60, translate("admin.common.too_long")),
    isActive: z.boolean(),
  });
}

export type AdminComboFormValues = z.infer<ReturnType<typeof createComboSchema>>;

/** Cinema create/edit payload. */
export function createCinemaSchema(translate: Translate) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, translate("admin.cinemas.name_required"))
      .max(255, translate("admin.common.too_long")),
    address: z
      .string()
      .trim()
      .min(1, translate("admin.cinemas.address_required"))
      .max(255, translate("admin.common.too_long")),
    badge: z.string().trim().max(60, translate("admin.common.too_long")),
  });
}

export type AdminCinemaFormValues = z.infer<ReturnType<typeof createCinemaSchema>>;

/** Room create/edit payload. */
export function createRoomSchema(translate: Translate) {
  return z.object({
    cinemaId: z.string().min(1, translate("admin.rooms.cinema_required")),
    name: z
      .string()
      .trim()
      .min(1, translate("admin.rooms.name_required"))
      .max(120, translate("admin.common.too_long")),
  });
}

export type AdminRoomFormValues = z.infer<ReturnType<typeof createRoomSchema>>;

