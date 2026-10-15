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

/**
 * Locale-formatted amount with the ₫ suffix (`120,000₫` in EN, `120.000₫`
 * in VN). The suffix stays ₫ in both locales — the amount is always VND.
 */
export function formatVND(amount: number, locale: "en" | "vn"): string {
  return `${amount.toLocaleString(locale === "vn" ? "vi-VN" : "en-US")}₫`;
}

/**
 * Canonical login redirect URL: `/login?returnUrl=<encoded>` when a target is
 * known, plain `/login` otherwise. All four redirect sites (proxy, session,
 * AuthContext 401 handler, ProtectedRoute) build their URL through here so the
 * query shape stays consistent — callers sanitize `returnUrl` with
 * {@link getSafeReturnUrl} first when the value comes from outside the app.
 */
export function buildLoginUrl(returnUrl?: string | null): string {
  return returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : "/login";
}

/**
 * Sanitize a post-login redirect target (open-redirect guard). Only
 * same-origin paths survive: the value must start with a single `/`
 * (`//host` and `/\host` would be treated as scheme-relative URLs by the
 * browser) and `/login` loops are rejected. Everything else falls back to `/`.
 */
export function getSafeReturnUrl(rawReturnUrl: string | null | undefined): string {
  if (!rawReturnUrl) return "/";
  if (!rawReturnUrl.startsWith("/")) return "/";
  if (rawReturnUrl.startsWith("//") || rawReturnUrl.startsWith("/\\")) return "/";
  if (rawReturnUrl === "/login" || rawReturnUrl.startsWith("/login?")) return "/";
  return rawReturnUrl;
}

/** Short absolute date (`Oct 4, 2026` in EN, `4 thg 10, 2026` in VN). */
export function formatDate(dateStr: string, locale: "en" | "vn"): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale === "vn" ? "vi-VN" : "en-US", {
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
