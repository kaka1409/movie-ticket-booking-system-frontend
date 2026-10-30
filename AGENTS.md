# AGENTS.md - frontend

## Commands

```bash
pnpm dev           # dev server on :3000 (compiles new routes on demand)
pnpm build         # production build - needs the backend on :8080
pnpm lint          # ESLint flat config (next/core-web-vitals + typescript)
pnpm typecheck     # tsc --noEmit
pnpm check:layers  # scripts/check-layers.mjs - the folder rules below (L1-L6)
pnpm verify        # lint + typecheck + check:layers - run before handing work over
pnpm format        # Prettier write (printWidth 100, double quotes)
```

No test runner: `tests/{unit,integration,e2e}/` are empty. Agent never commits.

Never run `pnpm build` while `pnpm dev` is running: both write `.next`, and Next writes `.next/dev/types/routes.d.ts` non-atomically, so the build's type check can read a torn file. `tsconfig.json` excludes `.next/dev` for that reason - that directory is dev-only generated state, never a typecheck input.

## Architecture

- Next.js 16.2.9 App Router + React 19.2.4; `@/` alias -> `src/`.
- Route groups under `src/app/`: `(main)` home/movies/tickets/profile, `(blank)` `movies/[slug]`, `(sub)` ALL protected (notifications, tickets detail/transfer/cancel, booking steps, profile sub-pages), `(auth)` login/register/forgot-password.
- Layout chain: root layout (`DeviceProvider` -> `AuthProvider` -> `WishlistProvider`) -> `LayoutProvider(layout=...)`; every layout switches mobile/desktop via `useDevice()` (`matchMedia("(min-width: 740px)")`, same pixel as `--breakpoint-md`).
- **All API calls happen on the server** in `page.tsx` (pass data down as props) or in the async section components it wraps in `<Suspense>` (streamed pages - see `/home`). Client components never `useEffect`-fetch, except request-keyed refetches and the two RAM-Bearer cases: seat holds (`useSeatHolds`) and `getPaymentIntent` (JWT-only route).
- Mutations are server actions; the access token lives in RAM only, the refresh token in an HttpOnly cookie.
- i18n EN/VN: `useLocale()` + `src/locales/{en,vn}.json`; SSR locale comes from the `locale` cookie (never localStorage); catalog fetches take `?lang=`.

### Framework notes

- Tailwind CSS v4 via `@tailwindcss/postcss`, `@import "tailwindcss"`, no JS config; colors/spacing use `bg-(--color-gold)`-style CSS variables.
- Next 16: `middleware.ts` is gone (renamed `src/proxy.ts`); this project defines no proxy - guards are `hasSession()` + `ProtectedRoute`.
- `reactCompiler: false`. Navigation is `<Link>` + `usePathname()`/`useSearchParams()` (wrap the latter in `<Suspense>`); `"use client"` on any file using hooks; every route has a `loading.tsx`.
- Icons `lucide-react`, QR `qrcode.react`, images `next/image` (host allowlist in `next.config.ts`).

### Layering (R1-R7, enforced by `pnpm check:layers`)

`app/` = routing + route-specific presentation. `features/<domain>/` = domain data, API calls, business logic and state; it does not own visual components. Cross-feature presentation belongs in `components/shared/`, and route-specific presentation belongs under that route in `app/`. `components/ui` is primitive. Full prose + the route-by-route table live in `docs/architecture.md` §Layering; the per-domain inventory is `docs/features.md`.

- R1: `app/**` owns routing + presentation; domain data/logic comes from `features/*`. A `features/` file never imports `@/app`.
- R2: `components/ui` imports no `@/features` / `@/app` / `@/layouts`; `components/shared` imports no `@/app`.
- R3: route-specific components stay in that route's `app/**/components/`; reusable presentation used across features belongs in `components/shared/`. Keep feature folders free of visual components.
- R4: one context per file at `features/<domain>/contexts/<Name>Context.tsx` — never a `context.tsx` barrel. `src/contexts/` holds only Auth/Device/Locale/Toast.
- R5: endpoint calls live in `features/<domain>/api.ts`; pure helper = `utils/<concern>.ts`; static data = `constants.ts`; effect-only mount = route `components/adopters/<Name>Adopter.tsx`; multi-file state = `state/` (`types.ts` + `initial.ts` + `reducer.ts` + barrel). Stream independent feeds with page-local async sections and Suspense.
- R6: `{desktop,mobile,shared}/` only when more than one device tree exists, and a piece both trees drive lives in `shared/`; a skin never imports the other skin (`check-layers` L6).
- R7: ~200 lines per file is the soft ceiling — past it, split by concern (a cohesive hook that is genuinely one unit may stay).

The script also fails an alias import that resolves to nothing (L5), which is what catches a move that forgot a call site.

## Conventions

- Pages and layouts are default-exported.
- Types defined inline, in `features/*/types.ts`, or in a `features/*/types/` folder once a domain outgrows one file (`tickets/types/{ui,wire}.ts` + barrel).
- Name by role so an import reads without opening the file: every `action.ts` export is `<verb><Noun>Action` (`createTransferAction`, `updateProfileAction`), queries are `get<Noun>` (`getReviewsPage`, `getRecipient`), and wire→UI mappers are `to<Noun>` (`toPastStatus`). The suffix is the only thing that separates a server action from an ordinary helper at a call site.
- `"use client"` at the top of every file using hooks or browser APIs.
- No single-letter variables or abbreviations — all variable names must be clear and descriptive (e.g. `translate` not `t`, `movie` not `m`, `event` not `e`).
- Never shadow browser globals (`window`, `document`) — pick a descriptive name (`releaseWindow`, not `window`).
- Exported functions, components and types get English `/** JSDoc */`; non-obvious logic gets a short WHY comment. Never leave commented-out dead code in files.
- State flags are `is*`/`setIs*` (`isLoading`, `isAuthenticated`); simple adjective flags for local display state are acceptable (`mounted`, `expired`).
- Helper placement: calendar-date math → `libs/date.ts` (`formatDateOnly`); shared pure helpers → `libs/utils.ts` (`buildLoginUrl`, `formatVND`); feature helpers → `features/*/utils.ts` (or a domain-split `utils/` folder when a feature outgrows one file — booking: `getSeatLabel` in `utils/seat.ts`).
- Feature scaffolding: `src/features/auth/` owns the `User` type (the profile feature only carries `UpdateProfileRequest`) — import the session shape from `features/auth/types.ts`, never redefine it.
- Repeated presentation used by multiple features belongs in `components/shared/`; route-local presentation belongs in that route's `app/**/components/`.
- Movie page components are split `{mobile,desktop,shared}/`: `shared/` carries the pieces **both** device trees drive — `Tabs.tsx` and `SearchBar.tsx` (movies-context adapters) plus the `FilterCheckRow.tsx`/`FilterLabel.tsx` atoms — and is layout-free, so each tree owns its own spacing. `FilterLabel.tsx` also exports its class string (`FILTER_LABEL_CLASS`) for the desktop `FilterSection`, whose label sits inside a `<button>` and therefore has to be a `<span>` (`<p>` is not allowed there). The chip itself is shared at `components/ui/Chip.tsx` (movies filter panel + wishlist status tabs).
- All cinema data uses **PrimeSeat** brand — Vietnamese addresses, km-based distances, 24h time format.
- Inline `style={}` props are used for dynamic/computed values (gradients, animation delays, computed widths, aspect ratios). Static styling always uses Tailwind utility classes with CSS custom property syntax.
- Payment brand art lives in `features/booking/utils/paymentBrand.ts` (`PAYMENT_BRAND_IMAGES` + `getPaymentLabel`/`getPaymentBrandImage`) and is rendered with `next/image`; an id with no asset gets an icon tile, so the catalog can grow without a code change.
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
- Desktop container `mx-auto max-w-7xl px-6 lg:px-8` (notifications = `max-w-4xl`); `.surface-raised` goes on a wrapper; tokens `--color-bg #0f0f0f`, `--color-surface #1c1b1b`, `--color-surface-2 #242424`, `--color-border #2e2e2e`, `--color-border-strong #6b6b6b`, `--text-2xs/3xs`, z-index ladder `--z-*`.
- Forms: zod v4 schemas from `features/*/schema.ts` factories taking `translate`; `safeParse` -> `flatten().fieldErrors`; `touched && !isValid` gates the messages.
- Showtime `date` + `HH:mm` fields are cinema wall clock (`Asia/Ho_Chi_Minh`), not instants; compose them with `buildShowtimeStart`/`buildShowtimeEnd`.
- Multi-feed pages **stream** — the page awaits only what it cannot paint without, every data block is an async section in its own `<Suspense>`:
  1. Page awaits `params`, `searchParams`, the `locale` cookie, `hasSession()`, plus a read that decides a redirect/404 (`getMovieDetail` on a booking step). Never two independent feeds in one page body.
  2. Each block gets a skeleton that mirrors its box; the route's `loading.tsx` renders the same composition, so the navigation fallback cannot drift from the in-page one.
  3. A feed read by several boundaries goes through a `cache()`-memoized loader (`features/<domain>/<page>.ts`) — N boundaries, one backend call. Memoize on scalar keys (slug, locale), never on arrays/objects — the key is by reference.
  4. A boundary holds no side effect: adoption/realtime effects mount once at page level in their own `fallback={null}` boundary.
  5. Errors render in place (`SectionFallback` or the page's error panel); a 401 renders `null` and the route's gate shows the prompt.
  6. Both device trees always render, so a block streamed into both gets one boundary per tree over the same memoized loader.
  7. `loading.tsx` is the fallback for the page segment only — it wraps `page.tsx`, NOT the `layout.tsx` in the same folder. A layout that awaits (e.g. `(sub)/tickets/[id]/layout.tsx`) needs its boundary in the **parent** segment, otherwise navigation into that subtree freezes with no fallback.
  8. The root layout does no network I/O. The inbox is not SSR-seeded: `NotificationProvider` reads it once after hydration (`isInboxLoading` covers the gap), removing a duplicate `GET /notifications` per load.
     Route-by-route table (what each page awaits, which loader, which skeleton): `docs/architecture.md` §Streaming.

## BE admin surface (implemented, not yet consumed)

The backend now exposes a CRUD-first admin surface (BE `AGENTS.md` "Admin management", BE `docs/api-contract.md` §12): `/movies/list` + movie/cast/showtime/cinema/room/seat-layout, `{genres,formats,age-ratings}/admin`, `{food-items,combos}/admin`, `/user/list` + `/user/:id/{role,status}`, `/payment-methods/all` + `PATCH /payment-methods/:id`, `/reviews/deleted` + `/reviews/:reviewId/restore`. Key FE-relevant facts: public snack/filter reads hide `isActive:false` rows server-side; `DELETE` on referenced rows answers `409 IN_USE` (deactivate is the supported path); banned accounts get `403 ACCOUNT_BANNED` on login/refresh; a soft-deleted review stays invisible to public reads until restored. No FE feature consumes these yet — an admin dashboard is a separate build.

## Read on demand

- Route groups, layouts, shared components, hooks: `docs/architecture.md`
- Per-page implementation detail: `docs/pages.md`
- State management (booking reducer, tickets pager, wishlist, toast): `docs/state.md`
- Feature folder inventory: `docs/features.md`
- Toolchain quirks, server actions, API layer, catalog i18n, form validation (full detail): `docs/conventions.md`
- Pending work / production readiness: `docs/progress.md`
- Desktop skin rules: `.opencode/skills/fe-desktop-skin/SKILL.md`
