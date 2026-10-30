export const REVIEWS_PAGE_SIZE = 5;

/** Fallback filter list when `/reviews/filters` is unavailable — labels are i18n keys rendered by the consumer. */
export const REVIEW_FILTER_FALLBACK = [
  { key: "recent", label: "Recent" },
  { key: "highest", label: "Highest Rated" },
  { key: "lowest", label: "Lowest Rated" },
] as const;

/** Max review comment length — enforced by `maxLength` on every composer/textarea and mirrored by BE `@MaxLength`. */
export const REVIEW_MAX_LENGTH = 500;
