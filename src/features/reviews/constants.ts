export const REVIEWS_PAGE_SIZE = 5;

/** Fallback filter list when `/reviews/filters` is unavailable — labels are i18n keys rendered by the consumer. */
export const REVIEW_FILTER_FALLBACK = [
  { key: "recent", label: "Recent" },
  { key: "highest", label: "Highest Rated" },
  { key: "lowest", label: "Lowest Rated" },
] as const;

/** Max review comment length — enforced by `maxLength` on every composer/textarea and mirrored by BE `@MaxLength`. */
export const REVIEW_MAX_LENGTH = 500;

/** Review scores share the movie score scale (1–10, BE `review_rating_range`). */
export const REVIEW_RATING_MAX = 10;

/** Clickable star values, low → high. */
export const REVIEW_RATING_STEPS = Array.from(
  { length: REVIEW_RATING_MAX },
  (_, index) => index + 1,
);
