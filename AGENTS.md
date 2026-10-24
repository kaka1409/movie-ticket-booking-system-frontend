# AGENTS.md - frontend

## Commands

```bash
pnpm dev      # dev server on :3000 (compiles new routes on demand)
pnpm build    # production build - needs the backend on :8080
pnpm lint     # ESLint flat config (next/core-web-vitals + typescript)
pnpm format   # Prettier write (printWidth 100, double quotes)
```

No test runner: `tests/{unit,integration,e2e}/` are empty. Agent never commits.

Never run `pnpm build` while `pnpm dev` is running: both write `.next`, and Next writes `.next/dev/types/routes.d.ts` non-atomically, so the build's type check can read a torn file. `tsconfig.json` excludes `.next/dev` for that reason - that directory is dev-only generated state, never a typecheck input.

## Architecture

- Next.js 16.2.9 App Router + React 19.2.4; `@/` alias -> `src/`.
- Route groups under `src/app/`: `(main)` home/movies/tickets/profile, `(blank)` `movies/[slug]`, `(sub)` ALL protected (notifications, tickets detail/transfer/cancel, booking steps, profile sub-pages), `(auth)` login/register/forgot-password.
- Layout chain: root layout (`DeviceProvider` -> `AuthProvider` -> `WishlistProvider`) -> `LayoutProvider(layout=...)`; every layout switches mobile/desktop via `useDevice()` (`matchMedia("(min-width: 740px)")`, same pixel as `--breakpoint-md`).
- **All API calls happen on the server** in `page.tsx` (pass data down as props). Client components never `useEffect`-fetch, except request-keyed refetches and the two RAM-Bearer cases: seat holds (`useSeatHolds`) and `getPaymentIntent` (JWT-only route).
- Mutations are server actions; the access token lives in RAM only, the refresh token in an HttpOnly cookie.
- i18n EN/VN: `useLocale()` + `src/locales/{en,vn}.json`; SSR locale comes from the `locale` cookie (never localStorage); catalog fetches take `?lang=`.

### Framework notes

- Tailwind CSS v4 via `@tailwindcss/postcss`, `@import "tailwindcss"`, no JS config; colors/spacing use `bg-(--color-gold)`-style CSS variables.
- Next 16: `middleware.ts` is gone (renamed `src/proxy.ts`); this project defines no proxy - guards are `hasSession()` + `ProtectedRoute`.
- `reactCompiler: false`. Navigation is `<Link>` + `usePathname()`/`useSearchParams()` (wrap the latter in `<Suspense>`); `"use client"` on any file using hooks; every route has a `loading.tsx`.
- Icons `lucide-react`, QR `qrcode.react`, images `next/image` (host allowlist in `next.config.ts`).

## Conventions

- Pages and layouts are default-exported.
- Types defined inline or in `features/*/types.ts`.
- Name by role so an import reads without opening the file: every `action.ts` export is `<verb><Noun>Action` (`createTransferAction`, `updateProfileAction`), queries are `get<Noun>` (`getReviewsPage`, `getRecipient`), and wire→UI mappers are `to<Noun>` (`toPastStatus`). The suffix is the only thing that separates a server action from an ordinary helper at a call site.
- `"use client"` at the top of every file using hooks or browser APIs.
- No single-letter variables or abbreviations — all variable names must be clear and descriptive (e.g. `translate` not `t`, `movie` not `m`, `event` not `e`).
- Never shadow browser globals (`window`, `document`) — pick a descriptive name (`releaseWindow`, not `window`).
- Exported functions, components and types get English `/** JSDoc */`; non-obvious logic gets a short WHY comment. Never leave commented-out dead code in files.
- State flags are `is*`/`setIs*` (`isLoading`, `isAuthenticated`); simple adjective flags for local display state are acceptable (`mounted`, `expired`).
- Helper placement: calendar-date math → `libs/date.ts` (`formatDateOnly`); shared pure helpers → `libs/utils.ts` (`buildLoginUrl`, `formatVND`); feature helpers → `features/*/utils.ts` (or a domain-split `utils/` folder when a feature outgrows one file — booking: `getSeatLabel` in `utils/seat.ts`).
- Feature scaffolding: `src/features/auth/` owns the `User` type (the profile feature only carries `UpdateProfileRequest`) — import the session shape from `features/auth/types.ts`, never redefine it.
- Repeated markup goes to a shared component: `components/shared/PriceBreakdown.tsx` (seats/snacks/total), `(main)/tickets/components/mobile/TicketList.tsx` (upcoming/past list).
- Movie page components are split `{mobile,desktop,shared}/`: `shared/` carries the pieces **both** device trees drive — `Tabs.tsx` and `SearchBar.tsx` (movies-context adapters) plus the `FilterCheckRow.tsx`/`FilterLabel.tsx` atoms — and is layout-free, so each tree owns its own spacing. `FilterLabel.tsx` also exports its class string (`FILTER_LABEL_CLASS`) for the desktop `FilterSection`, whose label sits inside a `<button>` and therefore has to be a `<span>` (`<p>` is not allowed there). The chip itself is shared at `components/ui/Chip.tsx` (movies filter panel + wishlist status tabs).
- All cinema data uses **PrimeSeat** brand — Vietnamese addresses, km-based distances, 24h time format.
- Inline `style={}` props are used for dynamic/computed values (gradients, animation delays, computed widths, aspect ratios). Static styling always uses Tailwind utility classes with CSS custom property syntax.
- Payment brand art lives in `features/booking/paymentBrand.ts` (`PAYMENT_BRAND_IMAGES`) and is rendered with `next/image`; an id with no asset gets an icon tile, so the catalog can grow without a code change.
- Pages using `useSearchParams()` must wrap content in `<Suspense>` to avoid 404 during SSR.

### Comment Policy

- A comment explains **why** the code is shaped this way — the constraint, invariant, trap or tradeoff. It never restates what the next statement does (`// set state`, `// map over rows`, `// close the dropdown`).
- **At most 4 lines** per block. If it needs more, the excess belongs in this file or nowhere: split the block, or cut the narrative.
- No refactor archaeology and no era vocabulary — `mock-era`, `kept from the original flow`, `used to`, `extracted from`, `reserved for future use`. Describe what the code guarantees now; git history holds the rest.
- Never duplicate prose that already lives here. Link the concept in one clause instead of re-explaining it.
- JSDoc on an export only when the contract is not obvious from the signature (units, mutation side effects, cache/lifecycle assumptions, a default that callers misread). A presentational component with self-describing props needs none — padding it with a prop-by-prop list is worse than silence.
- Per-line JSX labels (`{/* Title */}`, `{/* Footer */}`) are noise; keep a JSX comment only when it flags a non-obvious mechanism (edge flip, hidden device tree, timing).

## Write-time rules (short form)

- `api.ts` = GET queries via `apiFetch`; `action.ts` = `"use server"` mutations via `apiMutation`. Actions return `{ success: true, data } | { success: false, error, status? }` and never throw.
- Server components fetching user-scoped data must pass `await getRequestCookie()`; `credentials: "include"` only works in the browser.
- React 19: a `useActionState` dispatcher must sit on a real `<form action={formAction}>` - calling it from `onClick` skips the transition, so `isPending` never flips and double submits get through.
- Both device trees always render: mount every side effect once at PAGE level, keep step logic in `features/*/hooks`, use `lg:`/`xl:` inside desktop components.
- Desktop container `mx-auto max-w-7xl px-6 lg:px-8` (notifications = `max-w-4xl`); `.surface-raised` goes on a wrapper; tokens `--color-bg #0f0f0f`, `--color-surface #1c1b1b`, `--color-surface-2 #242424`, `--color-border #2e2e2e`.
- Forms: zod v4 schemas from `features/*/schema.ts` factories taking `translate`; `safeParse` -> `flatten().fieldErrors`; `touched && !isValid` gates the messages.
- Showtime `date` + `HH:mm` fields are cinema wall clock (`Asia/Ho_Chi_Minh`), not instants; compose them with `buildShowtimeStart`/`buildShowtimeEnd`.

## Read on demand

- Route groups, layouts, shared components, hooks: `docs/architecture.md`
- Per-page implementation detail: `docs/pages.md`
- State management (booking reducer, tickets pager, wishlist, toast): `docs/state.md`
- Feature folder inventory: `docs/features.md`
- Toolchain quirks, server actions, API layer, catalog i18n, form validation (full detail): `docs/conventions.md`
- Pending work / production readiness: `docs/progress.md`
- Desktop skin rules: `.opencode/skills/fe-desktop-skin/SKILL.md`
