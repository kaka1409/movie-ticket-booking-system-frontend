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
- **Redux Toolkit**: store wired at `src/store/index.ts` — `reducer: {}` (unused).
- **i18n**: `useLocale()` from `LocaleContext` via `useSyncExternalStore`. Persists to `localStorage("locale")`. Translations at `src/locales/{en,vn}.json`. Throws if used outside `LocaleProvider`.
- **`@/`** alias → `src/` in `tsconfig.json`.
- Error & not-found pages at `src/app/errors.tsx` / `not-found.tsx`.

## Feature Scaffolding

- `src/features/movies/` — `mock.tsx` (NOW_SHOWING, COMING_SOON), `constants.ts`, `types.ts`, `api.ts`/`hooks.ts` (empty).
- `src/features/tickets/` — `constants.ts`, `mock.ts`.
- `src/features/notifications/` — `mock.tsx`, `constants.ts`, `types.ts`.
- `src/features/auth/` — `mock.ts`.
- `src/features/profile/` — `mock.ts`.
- `src/hooks/` exists but is empty.
- `src/libs/constants.ts` has generic constants; `src/libs/utils.ts` and `src/types/index.ts` are empty placeholders.

## Framework / Toolchain Quirks

- **React Compiler OFF** (`reactCompiler: false`). `babel-plugin-react-compiler` devDep present but unused.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. Use `@import "tailwindcss"` syntax. No JS config file. Custom `@utility scrollbar-hide` in `global.css`.
- **Brand theme**: CSS custom properties in `global.css` (gold/black). Access via `var(--color-*)`. Spacing via `var(--space-*)`.
- **Icons**: `lucide-react`.
- **Navigation**: `<Link>` (not `<a>`); active route via `usePathname()`.
- **`"use client"`** required at top of every file using hooks or browser APIs.
- **Home page** (`(main)/home/page.tsx`) renders mobile/desktop variants via `hidden md:block` / `block md:hidden`. Imports data from `@/features/movies/mock`. Sub-components under `home/components/{mobile,desktop}/`.
- **Component split pattern**: All pages use `block md:hidden` / `hidden md:block` to render mobile/desktop variants. Each page has `components/{mobile,desktop}/` dirs. Shared components go in `components/shared/`. See `(main)/home/` as canonical example.
- `postcss.config.mjs` only has `@tailwindcss/postcss` plugin.
- No Prettier config, no CI/CD workflows.

## Conventions

- Pages and layouts are default-exported.
- Types defined inline or in `features/*/types.ts`.
- `"use client"` at the top of every file using hooks or browser APIs.
