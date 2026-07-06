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
  - `(main)/` — home, movies list, tickets, profile
  - `(blank)/` — `movies/[slug]` (full-screen pages, no header/nav)
  - `(sub)/` — notifications
  - `(auth)/` — login, register
- **`(main)/page.tsx`** re-exports `./home/page.tsx`.
- **Layout chain**: root layout (`LocaleProvider`) → each group wraps `LayoutProvider(layout="main"|"auth"|"sub"|"blank")`. LayoutProvider renders mobile or desktop variant via `matchMedia("(min-width: 768px)")`.
- **Mobile layout variants**: `mobile/main` (Header + BottomNav), `mobile/auth`, `mobile/sub`, `mobile/blank` (no chrome).
- **Desktop layout variants**: `desktop/main` (Header + Footer), `desktop/auth`, `desktop/sub`, `desktop/blank` (no chrome).
- **Redux Toolkit**: store wired at `src/store/index.ts` — `reducer: {}` (unused, available for future features).
- **i18n**: `useLocale()` from `LocaleContext` via `useSyncExternalStore`. Persists to `localStorage("locale")`. Translations at `src/locales/{en,vn}.json`. Throws if used outside `LocaleProvider`.
- **`@/`** alias → `src/` in `tsconfig.json`.
- Error & not-found pages at `src/app/errors.tsx` / `not-found.tsx`.

## State Management

- **Movies page**: React Context (`src/contexts/MoviesContext.tsx`) with URL sync via `useSearchParams` + `router.replace`. State: `activeTab`, `query`, `filtersOpen`, `filters`, `appliedFilters`, `visibleCount`. URL-synced params: `status`, `genres`, `rating`, `format`, `ageRating`. Non-URL state: `query`, `filtersOpen`, `visibleCount`, `filters.releaseDate`, `filters.length`.
- **Other pages**: Local `useState` or no state needed.

## Feature Scaffolding

- `src/features/movies/` — `mock.tsx` (NOW_SHOWING, COMING_SOON), `constants.ts` (GENRES, AGE_RATINGS, RELEASE_OPTIONS, RATING_OPTIONS, LENGTH_OPTIONS, FORMAT_OPTIONS), `types.ts`, `api.ts`/`hooks.ts` (empty).
- `src/features/tickets/` — `constants.ts`, `mock.ts`.
- `src/features/notifications/` — `mock.tsx`, `constants.ts`, `types.ts`.
- `src/features/auth/` — `mock.ts`.
- `src/features/profile/` — `mock.ts`.
- `src/hooks/` exists but is empty.
- `src/libs/constants.ts` has generic constants; `src/libs/utils.ts` and `src/types/index.ts` are empty placeholders.

## Framework / Toolchain Quirks

- **React Compiler OFF** (`reactCompiler: false`). `babel-plugin-react-compiler` devDep present but unused.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. Use `@import "tailwindcss"` syntax. No JS config file. Custom `@utility scrollbar-hide` in `global.css`. Custom animations: `animate-fade-in` (fadeSlideIn keyframe), `animate-expand`.
- **Brand theme**: CSS custom properties in `global.css` (gold/black). Access via `var(--color-*)`. Spacing via `var(--space-*)`. Radius via `var(--radius-*)`. Shadows via `var(--shadow-*)`.
- **Icons**: `lucide-react`.
- **Navigation**: `<Link>` (not `<a>`); active route via `usePathname()`. URL search params via `useSearchParams()` from `next/navigation`.
- **`"use client"`** required at top of every file using hooks or browser APIs.
- **Home page** (`(main)/home/page.tsx`) renders mobile/desktop variants via `hidden md:block` / `block md:hidden`. Imports data from `@/features/movies/mock`. Sub-components under `home/components/{mobile,desktop}/`. MovieRow has `status` prop for "See All" navigation to movies page.
- **Movies page** (`(main)/movies/page.tsx`) — thin compose file wrapped in `<MoviesProvider>` + `<Suspense>`. Mobile components in `components/mobile/` (Tabs, SearchBar, FilterPanel, MovieGrid). Desktop stub in `components/desktop/MovieGrid` (returns null).
- **Component split pattern**: All pages use `block md:hidden` / `hidden md:block` to render mobile/desktop variants. Each page has `components/{mobile,desktop}/` dirs. Shared components go in `components/shared/`. See `(main)/home/` as canonical example.
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
