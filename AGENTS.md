# AGENTS.md

## Commands

```bash
pnpm dev          # dev server (no --turboproc flag; config has `turbopack` key but unused)
pnpm build        # production build
pnpm lint         # ESLint (next/core-web-vitals + typescript, flat config)
pnpm start        # production server
```

No test runner. `tests/{e2e,integration,unit}/` are empty dirs. `pnpm test` undefined.

## Architecture

- **Next.js 16.2.9 App Router** + **React 19.2.4** — four route groups under `src/app/`:
  - `(main)/` — home, movies list, tickets listing, profile
  - `(blank)/` — `movies/[slug]` (full-screen pages, no header/nav)
  - `(sub)/` — notifications, `tickets/[id]` (detail page with back-arrow header), `cinema/[slug]` (cinema & showtime selection)
  - `(auth)/` — login, register
- **`(main)/page.tsx`** re-exports `./home/page.tsx`.
- **Layout chain**: root layout (`LocaleProvider`) → each group wraps `LayoutProvider(layout="main"|"auth"|"sub"|"blank")`. LayoutProvider renders mobile or desktop variant via `matchMedia("(min-width: 768px)")`.
- **Mobile layout variants**: `mobile/main` (Header + BottomNav), `mobile/auth`, `mobile/sub` (back + title), `mobile/blank` (no chrome).
- **Desktop layout variants**: `desktop/main` (Header + Footer), `desktop/auth`, `desktop/sub` (nav bar + back + title), `desktop/blank` (no chrome).
- **Redux Toolkit**: store wired at `src/store/index.ts` — `reducer: {}` (unused, available for future features).
- **i18n**: `useLocale()` from `LocaleContext` via `useSyncExternalStore`. Persists to `localStorage("locale")`. Translations at `src/locales/{en,vn}.json`. Throws if used outside `LocaleProvider`.
- **`@/`** alias → `src/` in `tsconfig.json`.
- Error & not-found pages at `src/app/errors.tsx` / `not-found.tsx`.

## State Management

- **Movies page**: React Context (`src/contexts/MoviesContext.tsx`) with URL sync via `useSearchParams` + `router.replace`. State: `activeTab`, `query`, `filtersOpen`, `filters`, `appliedFilters`, `visibleCount`. URL-synced params: `status`, `genres`, `rating`, `format`, `ageRating`. Non-URL state: `query`, `filtersOpen`, `visibleCount`, `filters.releaseDate`, `filters.length`.
- **Tickets listing**: React Context (`src/contexts/TicketsContext.tsx`) — `TicketsProvider` + `useTickets()` hook. Manages `activeTab` ("upcoming"|"past") and `visibleCount`. Tab switching resets `visibleCount` to 3; `loadMore` increments by 3.
- **Other pages**: Local `useState` or no state needed.

## Feature Scaffolding

- `src/features/movies/` — `mock.tsx` (NOW_SHOWING, COMING_SOON), `constants.ts` (GENRES, AGE_RATINGS, RELEASE_OPTIONS, RATING_OPTIONS, LENGTH_OPTIONS, FORMAT_OPTIONS), `types.ts`, `api.ts`/`hooks.ts` (empty).
- `src/features/tickets/` — `constants.ts` (SEAT_TYPES: Standard/VIP/SweetBox), `mock.ts` (UPCOMING with full detail + PAST with full detail), `types.ts` (FoodDrinkItem, UpcomingTicket, PastTicket).
- `src/features/notifications/` — `mock.tsx`, `constants.ts`, `types.ts`.
- `src/features/auth/` — `mock.ts`.
- `src/features/profile/` — `mock.ts` (USER with avatarUrl from Contentful), `types.ts` (User interface).
- `src/features/booking/` — `mock.ts` (CINEMAS with PrimeSeat data, DATES), `types.ts` (Cinema, Showtime, DateOption, BookingSelection, BOOKING_STEPS).
- `src/hooks/` exists but is empty.
- `src/libs/constants.ts` has generic constants; `src/libs/utils.ts` has a `slugify` helper; `src/types/index.ts` is a placeholder with only a comment.

## Ticket Detail Page

Two-level routing:
- **Listing**: `(main)/tickets/page.tsx` — inside main layout with BottomNav. Uses `TicketsProvider`.
- **Detail**: `(sub)/tickets/[id]/page.tsx` — inside sub layout (back-arrow header, title "Ticket Details"). Resolves ticket from mock via `useParams`. No provider needed.

Detail page components under `(sub)/tickets/[id]/components/`:
- `mobile/TicketInfo.tsx` — hero poster, theater/location, seat, food & drink, QR code, payment summary
- `mobile/TicketActions.tsx` — Download Ticket (always) + Cancel & Refund (only for success/confirmed/pending)
- `mobile/QRCode.tsx` — `qrcode.react` with full URL encoding (`https://primseat.com/tickets/{id}`), error correction level H
- `desktop/TicketDetail.tsx` — stub (returns null)

Past tickets show the same detail layout but without action buttons.

## Profile Page

`page.tsx` directly imports mobile components (same pattern as home page):
- `components/mobile/Avatar.tsx` — conic-gradient ring + `<Image>` (external URL from Contentful via `images.ctfassets.net` in `remotePatterns`)
- `components/mobile/UserInfo.tsx` — name + tier badge (Star icon)
- `components/mobile/MenuSection.tsx` — reusable menu card with icon rows, hover via Tailwind `hover:bg-(--color-surface-2)`
- `components/desktop/ProfileContent.tsx` — stub (returns null)

No BottomNav or TopNav — layout provides both. Menu items use i18n keys `profile.*`.

## Cinema & Showtime Page

`page.tsx` resolves movie by slug from `ALL_MOVIES`, composes mobile components directly:
- `components/mobile/StepBar.tsx` — 5-step booking progress bar (SELECT CINEMA → SELECT SEATS → FOOD & DRINKS → PAYMENT → CONFIRM)
- `components/mobile/MovieSummary.tsx` — mini poster + movie info (duration, genre, ageRating, rating)
- `components/mobile/DatePicker.tsx` — horizontal scroll date picker
- `components/mobile/SearchBar.tsx` — cinema/location search input
- `components/mobile/CinemaCard.tsx` — cinema card with name, address, distance, badge, showtime chips (active/sold-out states)
- `components/mobile/CinemaList.tsx` — list wrapper + empty state
- `components/mobile/BottomBar.tsx` — sticky bottom bar with selection summary + "SELECT SEATS" CTA
- `components/desktop/CinemaContent.tsx` — stub (returns null)

Sub layout provides back button (→ movie detail) + "Cinema & Showtime" title. State managed via local `useState`.

## Framework / Toolchain Quirks

- **React Compiler OFF** (`reactCompiler: false`). `babel-plugin-react-compiler` devDep present but unused.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. Use `@import "tailwindcss"` syntax. No JS config file. Custom `@utility scrollbar-hide` in `global.css`. Custom animations: `animate-fade-in` (fadeSlideIn keyframe), `animate-expand`.
- **Brand theme**: CSS custom properties in `global.css` (gold/black). Access via `var(--color-*)`. Spacing via `var(--space-*)`. Radius via `var(--radius-*)`. Shadows via `var(--shadow-*)`.
- **Tailwind + CSS variables**: Use `bg-(--color-gold)`, `text-(--color-text-muted)`, `shadow-(--shadow-card)`, `border-(--color-border)` syntax (88+ instances across codebase). No inline `style={}` props — always use Tailwind utility classes.
- **Icons**: `lucide-react`.
- **QR codes**: `qrcode.react` (QRCodeSVG component) for ticket detail page.
- **Navigation**: `<Link>` (not `<a>`); active route via `usePathname()`. URL search params via `useSearchParams()` from `next/navigation`.
- **`"use client"`** required at top of every file using hooks or browser APIs.
- **Home page** (`(main)/home/page.tsx`) renders mobile/desktop variants via `hidden md:block` / `block md:hidden`. Imports data from `@/features/movies/mock`. Sub-components under `home/components/{mobile,desktop}/`. MovieRow has `status` prop for "See All" navigation to movies page.
- **Movies page** (`(main)/movies/page.tsx`) — thin compose file wrapped in `<MoviesProvider>` + `<Suspense>`. Mobile components in `components/mobile/` (Tabs, SearchBar, FilterPanel, MovieGrid). Desktop stub in `components/desktop/MovieGrid` (returns null).
- **Component split pattern**: Pages that render both mobile & desktop content in the same file use `block md:hidden` / `hidden md:block` (e.g. home, movies). Layout-level switching is handled by `LayoutProvider` via `matchMedia`. Each page has `components/{mobile,desktop}/` dirs. Shared components go in `components/shared/`. See `(main)/home/` as canonical example.
- **Sub layout `getSubTitle()`**: Handles `/notifications` (i18n), `/tickets` (returns "Ticket Details"), `/cinema/[slug]` (returns "Cinema & Showtime"), `/movies/[slug]` (returns movie title). Back button goes to `/tickets` for ticket routes, `/movies/[slug]` for cinema routes, `/` otherwise.
- `postcss.config.mjs` only has `@tailwindcss/postcss` plugin.
- No Prettier config, no CI/CD workflows.

## Movies Page Deep Linking

URL scheme for movies page with query params:
```
/movies?status=now_showing
/movies?status=coming_soon&genres=Action,Drama&rating=4.5+&format=IMAX&ageRating=R
```

| Param | Values | Default |
|-------|--------|---------|
| `status` | `now_showing`, `coming_soon` | `now_showing` |
| `genres` | Comma-separated (e.g. `Action,Drama`) | empty |
| `rating` | `4.5+`, `4.0+`, `3.5+` | empty |
| `format` | `2D`, `IMAX`, `4DX` | empty |
| `ageRating` | `P`, `PG-13`, `R`, `NC-17` | empty |

Home page "See All" / "Explore All" buttons link to movies page with appropriate `status` param.

## Conventions

- Pages and layouts are default-exported.
- Types defined inline or in `features/*/types.ts`.
- `"use client"` at the top of every file using hooks or browser APIs.
- Filter components (FilterChip, FilterCheckRow, FilterLabel) are internal to movies page `components/mobile/`.
- All cinema data uses **PrimeSeat** brand — Vietnamese addresses, km-based distances, 24h time format.
- Inline `style={}` props are not used — always convert to Tailwind utility classes with CSS custom property syntax.
