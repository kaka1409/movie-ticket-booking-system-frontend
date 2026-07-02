# AGENTS.md

## Commands

```bash
pnpm dev          # dev server (next dev — Turbopack config exists in next.config.ts but is not activated via CLI flag)
pnpm build        # production build
pnpm lint         # ESLint (next/core-web-vitals + typescript, flat config in eslint.config.mjs)
pnpm start        # production server
```

No test runner is configured. `tests/` dirs (e2e, integration, unit) are empty. `pnpm test` is not defined.

## Architecture

- **Next.js 16.2 App Router** with two route groups nested under `src/app/`:
  - `(main)/` — home, movies, tickets, notifications, profile
  - `(auth)/` — login, register
- **Layout hierarchy** (top to bottom):
  1. `src/app/layout.tsx` — root layout, owns `<html>`/`<body>`, imports `global.css`, wraps children in `LocaleProvider`
  2. `(main)/layout.tsx` — wraps with `LayoutProvider` (client component)
  3. `(auth)/layout.tsx` — separate layout for auth pages
- **Responsive layout**: `LayoutProvider` detects mobile vs desktop (768px breakpoint). Renders both `MobileLayout` and `DesktopLayout` shells; visibility toggled via CSS `data-shell` attributes in `global.css`. Mobile shell has sticky `Header` + fixed `BottomNav`; desktop shell is a placeholder stub.
- **Redux Toolkit**: store at `src/store/index.ts` — wired but no slices yet (`reducer: {}`).
- **i18n**: `LocaleContext` (`src/contexts/LocaleContext.tsx`) provides `useLocale()` returning `{ locale, setLocale, t }`. `t(key)` looks up translations from `src/locales/{en,vn}.json`. Header has a language toggle button.
- **Feature folders** under `src/features/`: intended to own API layer (`api.ts`), hooks, and components per feature. Currently **mostly empty scaffolding** — `movies/` has empty `api.ts` and `hooks.ts`; `auth/`, `profile/`, `tickets/` are empty directories.
- **`@/` path alias** maps to `src/` (configured in `tsconfig.json`).

## Framework / Toolchain Quirks

- **React Compiler is OFF** (`reactCompiler: false` in `next.config.ts`). `babel-plugin-react-compiler` devDep is present but unused. Manual memoization is fine if needed.
- **Tailwind CSS v4** with `@tailwindcss/postcss`. Use `@import "tailwindcss"` syntax. No `tailwind.config.js` — v4 uses CSS-based config.
- **Custom CSS variables** in `src/styles/global.css` define the brand theme (gold/black). Use `var(--color-*)` in inline styles or Tailwind arbitrary values like `text-(--color-gold)`.
- **Icons**: `lucide-react` is the icon library.
- Navigation uses `<Link>` (not `<a>`); active route is determined via `usePathname()`.
- **All page stubs use `"use client"`** where interactivity is needed. Otherwise prefer Server Components.
- **Home page** (`src/app/(main)/home/page.tsx`) is the only substantial page (~291 lines) — contains inline components (HeroBanner, QuickBooking, MovieCard, MovieRow, SearchBar) using hardcoded data from `src/libs/constants.ts`. Other route pages are 3-line stubs.
- `pnpm-workspace.yaml` only controls native build permissions (`sharp`, `unrs-resolver`), not monorepo workspaces.

## Conventions

- `"use client"` at the top of every component that uses hooks or browser APIs.
- Components are default-exported. Layouts and pages are standard Next.js conventions.
