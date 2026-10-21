/** Lowercase, strip Vietnamese diacritics and punctuation, collapse spaces to hyphens. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** BCP-47 tag for `Intl`/`toLocale*` calls — the UI locale is `en` | `vn`. */
export function toLocaleTag(locale: "en" | "vn"): string {
  return locale === "vn" ? "vi-VN" : "en-US";
}

/**
 * Locale-formatted amount with the ₫ suffix (`120,000₫` in EN, `120.000₫`
 * in VN). The suffix stays ₫ in both locales — the amount is always VND.
 */
export function formatVND(amount: number, locale: "en" | "vn"): string {
  return `${amount.toLocaleString(toLocaleTag(locale))}₫`;
}

/**
 * Canonical login redirect URL: `/login?returnUrl=<encoded>` when a target is
 * known, plain `/login` otherwise. The prompt, the auth forms and the header CTA
 * all build their link here so the query shape stays consistent — a value from
 * outside the app is sanitized with {@link getSafeReturnUrl} first.
 */
export function buildLoginUrl(returnUrl?: string | null): string {
  return returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : "/login";
}

/**
 * Twin of {@link buildLoginUrl} for the register page: a visitor bounced off a
 * protected page and signing up instead of signing in still lands on the page
 * they were after.
 */
export function buildRegisterUrl(returnUrl?: string | null): string {
  return returnUrl ? `/register?returnUrl=${encodeURIComponent(returnUrl)}` : "/register";
}

/**
 * Auth entry points — never a valid post-auth target: the visitor would land
 * back on the form they just cleared.
 */
const AUTH_ENTRY_PATHS = ["/login", "/register", "/forgot-password"] as const;

/**
 * Sanitize a post-login redirect target (open-redirect guard). Only
 * same-origin paths survive: the value must start with a single `/`
 * (`//host` and `/\host` would be treated as scheme-relative URLs by the
 * browser) and auth entry points are rejected (see above). Everything else
 * falls back to `/`.
 */
function getSafeReturnUrl(rawReturnUrl: string | null | undefined): string {
  if (!rawReturnUrl) return "/";
  if (!rawReturnUrl.startsWith("/")) return "/";
  if (rawReturnUrl.startsWith("//") || rawReturnUrl.startsWith("/\\")) return "/";
  const isAuthEntry = AUTH_ENTRY_PATHS.some(
    (path) => rawReturnUrl === path || rawReturnUrl.startsWith(`${path}?`),
  );
  if (isAuthEntry) return "/";
  return rawReturnUrl;
}

/**
 * The target the auth pages carry in their links and redirects: the sanitized
 * `returnUrl`, or `undefined` when it resolves to the home fallback — so the
 * tab links stay plain (`/login`, never `/login?returnUrl=%2F`).
 */
export function authReturnTarget(rawReturnUrl: string | null | undefined): string | undefined {
  const safeReturnUrl = getSafeReturnUrl(rawReturnUrl);
  return safeReturnUrl === "/" ? undefined : safeReturnUrl;
}

/** Short absolute date (`Oct 4, 2026` in EN, `4 thg 10, 2026` in VN). */
export function formatDate(dateStr: string, locale: "en" | "vn"): string {
  const parsedDate = new Date(dateStr);
  return parsedDate.toLocaleDateString(toLocaleTag(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Locale-aware relative label ("3 days ago") via `Intl.RelativeTimeFormat`;
 * returns `""` for unparseable input.
 */
export function formatRelativeTime(isoDate: string, locale: "en" | "vn"): string {
  const timestamp = Date.parse(isoDate);
  if (Number.isNaN(timestamp)) return "";

  const rtf = new Intl.RelativeTimeFormat(locale === "vn" ? "vi" : "en", {
    numeric: "auto",
  });
  const diff = timestamp - Date.now();
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000000],
    ["month", 2592000000],
    ["week", 604800000],
    ["day", 86400000],
    ["hour", 3600000],
    ["minute", 60000],
  ];

  for (const [unit, ms] of units) {
    if (Math.abs(diff) >= ms) {
      return rtf.format(Math.round(diff / ms), unit);
    }
  }

  return rtf.format(0, "minute");
}
