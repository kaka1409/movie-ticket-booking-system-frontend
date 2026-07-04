# AGENTS.md

## Commands

```bash
pnpm dev          # dev server (no --turboproc flag; config has `turbopac` key but unused)
pnpm build        # production build
pnpm lint         # ESLint (next/core-web-vitals + typescript, flat config)
pnpm start        # production server
```

No test runner. `tests/{e2e,integration,unit}/` are empty dirs. `pnpm test` undefined.

## Architecture

- **Next.js 16.2.9 App Router** + **React 19.2.4** — two route groups under `src/app/`:
  - `(main)/` — home (the only substantial page), movies, tickets, notifications, profile
  - `(auth)/` — login, register
- **`(main)/page.tsx`** re-exports `home/page.tsx`.
- **Layout chain**: root layout (`LocaleProvider` wrapper) → `(main)/layout.tsx` (`LayoutProvider`) or `(auth)/layout.tsx` (bare `<div>`).
- **Responsive**: `LayoutProvider` uses `useState` + `useEffect` with `matchMedia("(min-width: 768px)")`. Renders `MobileLayout` (sticky `Header` + fixed `BottomNav`) or `DesktopLayout` (real layout with `Header` + `Footer`). Visibility toggled via `hidden md:block` / `block md:hidden` utility classes in home page; `data-shell` attributes in `global.css` are unused.
- **Redux Toolkit**: store wired at `src/store/index.ts` — `reducer: {}` (unused).
- **i18n**: `useLocale()` from `LocaleContext` via `useSyncExternalStore`. Persists to `localStorage("locale")`. Translations at `src/locales/{en,vn}.json`. Throws if used outside `LocaleProvider`.
- **`src/hooks/`** exists but is empty.
- **Feature scaffolding** at `src/features/{auth,movies,profile,tickets}/`:
  - `movies/` has `mock.ts` (hardcoded `NOW_SHOWING`, `COMING_SOON` arrays), `constants.ts` (`GENRES`, `AGE_RATINGS`), plus empty `api.ts`/`hooks.ts`.
  - `tickets/` has `constants.ts` and `mock.ts`.
  - `auth/` and `profile/` each have `mock.ts`.
- **`@/`** alias → `src/` in `tsconfig.json`.
- Error & not-found pages at `src/app/errors.tsx` / `not-found.tsx`.

## Framework / Toolchain Quirks

- **React Compiler OFF** (`reactCompiler: false`). `babel-plugin-react-compiler` devDep present but unused.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. Use `@import "tailwindcss"` syntax. No JS config file. Custom `@utility scrollbar-hide` in `global.css`.
- **Brand theme**: CSS custom properties in `global.css` (gold/black). Access via `var(--color-*)`. Spacing via `var(--space-*)` or Tailwind `gap-(--space-lg)`.
- **Icons**: `lucide-react`.
- **Navigation**: `<Link>` (not `<a>`); active route via `usePathname()`.
- **`"use client"`** at top of every file using hooks or browser APIs. Page stubs are Server Components (no directive).
- **Home page** (`(main)/home/page.tsx`, ~41 lines `"use client"`) renders mobile/desktop variants via `hidden md:block`. Imports data from `@/features/movies/mock`. Sub-components under `home/components/{mobile,desktop}/`.
- Data sources: `src/libs/constants.ts` has generic constants; `src/features/*/mock.ts` has feature-specific hardcoded data.
- `postcss.config.mjs` only has `@tailwindcss/postcss` plugin.
- `root layout` sets `<html lang="en" data-scroll-behavior="smooth">`.
- No Prettier config, no CI/CD workflows.
- `src/libs/utils.ts` and `src/types/index.ts` are empty/placeholders.

## Conventions

- Pages and layouts are default-exported.
- Types defined inline; no shared type definitions yet.
- `"use client"` at the top of every file using hooks or browser APIs.
