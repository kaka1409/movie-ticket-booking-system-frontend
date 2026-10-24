# Frontend progress / pending work

## Production Readiness — PENDING

> **Audit: 2026-10-03** — ticks reflect actual code state (21/34).
> Tags: `[now]` = do now, low effort · `[blocked]` = waiting on backend modules · `[before deploy]` = before deploy/demo · `[prod only]` = real production only

### Level 1 — Foundation

- [x] Next.js 16.2.9 + React 19.2.4 App Router
- [x] TypeScript strict (`"strict": true` in tsconfig)
- [x] ESLint flat config (next/core-web-vitals + typescript)
- [x] Production build + lint pass
- [x] Prettier — `.prettierrc` + `.prettierignore` + `pnpm format`; whole codebase formatted
- [x] Environment documentation — `.env.example` added; README documents `BACKEND_URL`/`API_PREFIX` (evaluated at build time)
- [x] README accuracy — stale `features/auth/api.ts` reference fixed; env + test sections added
- [x] Unused dev tooling — `babel-plugin-react-compiler` removed (`reactCompiler: false` unchanged)
- [ ] Mock data — live vs mock split marked at each function. Booking flow, tickets (listing/detail/transfer/modify/cancel), wishlist, notifications, home QuickBooking and the whole movies catalog are LIVE (no mock in any fetcher). Remaining: `movies/mock.tsx` (`ALL_MOVIES` — the desktop preview popover's field fallback only) and `reviews/mock.ts` (`FILTERS`/`FilterKey` used as the `getReviewFilters` fallback) `[blocked]`

### Level 2 — Security

- [x] Access token RAM-only; refresh token httpOnly + Secure + SameSite=Strict cookie
- [x] Open redirect sanitized (`getSafeReturnUrl` rejects `//`, `/\` and every auth entry point — `/login`, `/register`, `/forgot-password` — which would bounce the visitor straight back into a form)
- [x] No XSS sinks (0 `dangerouslySetInnerHTML`, 0 `eval`, 0 raw `<img>`)
- [x] Layered route guards (`hasSession()` → `ProtectedRoute` → cookie forward)
- [x] `next/image` host allowlist (11 explicit hosts, no wildcards)
- [x] Session/401 handling — client: `UNAUTHORIZED_EVENT` in `libs/api.ts` → `AuthContext` clears state only, `ProtectedRoute` renders the prompt in place (excludes `/auth/*`, no redirect); server: `isUnauthorizedResult()` in `libs/session.ts` → `<LoginPrompt />` in place — wired on tickets listing/detail and booking seats/status pages
- [ ] Security headers — no CSP/HSTS/X-Frame-Options/Referrer-Policy `[before deploy]`
- [x] Reviews, booking and ticket modify/cancel actions pass raw `accessToken` as a server-action argument — the remaining places the token crosses the wire; prefer cookie `[now]`; ticket **transfer** actions already forward the refresh cookie
- [ ] `allowedDevOrigins` hardcodes LAN IPs — dev-only, harmless in production `[before deploy]`

### Level 3 — Reliability

- [x] 404 page (root `not-found.tsx` + in-component `MovieNotFound`)
- [x] Loading states — 25 `loading.tsx` skeletons built on `components/ui/Skeleton.tsx`
- [x] API layer never rejects — `apiFetch` returns a discriminated union; actions return `{ success }` unions
- [x] Error boundaries — root `error.tsx` (shared `components/shared/RouteError.tsx`) + per-group `error.tsx` in all 4 route groups + `global-error.tsx`
- [x] Unhandled rejections — all 3 `.then()` chains now have `.catch()` (movies context surfaces `fetchFailure`, RecipientInput clears results, ShowtimeDataLoader shows error + retry instead of hanging skeleton)
- [x] Silent failure — `AuthContext` session-restore failure logged via `console.warn`

### Level 4 — Operations

- [x] Console cleanliness (3 `console.warn`, 0 `console.log` in `src/`)
- [ ] Deploy config — no `output: "standalone"`, no Dockerfile/vercel.json `[before deploy]`
- [ ] CI/CD — no `.github/` workflows `[before deploy]`
- [ ] Build-time env — `next.config.ts` `rewrites()` evaluates `BACKEND_URL` at build time; undocumented `[before deploy]`
- [x] SEO — root metadata (`metadataBase`, title template, OG/Twitter, `NEXT_PUBLIC_SITE_URL` in `libs/site.ts`), `generateMetadata` on `movies/[slug]` (canonical, OG), per-page titles, `robots: noindex` on all protected/auth routes, `app/robots.ts` + `app/sitemap.ts`, JSON-LD `Movie` + `AggregateRating` on the detail page. Remaining: locale-aware metadata (titles don't vary by `locale` cookie) and hreflang (not applicable — locale is cookie-based, not URL-based)
- [x] Font loading — `next/font` Inter (self-hosted, `latin`+`latin-ext`+`vietnamese` subsets, `display: swap`) wired to `--font-inter` → `--font-sans` in `global.css`
- [x] Transfer actions complete and documented: all transfer flow pages documented in `docs/pages.md`, transfer feature updated in `docs/features.md`, transfer state management added to `docs/state.md`, transfer security progress tracked in `docs/progress.md`
- [ ] Monitoring / analytics `[prod only]`

### Tests

- [ ] Unit tests — 0 test files, no test runner; `tests/{unit,integration,e2e}/` are empty `[before deploy]`
- [ ] E2E tests `[before deploy]`
- [ ] Tests pass in CI `[before deploy]`
