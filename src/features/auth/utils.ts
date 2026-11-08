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
