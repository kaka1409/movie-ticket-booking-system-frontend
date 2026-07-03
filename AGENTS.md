# AGENTS.md

## Commands

```bash
pnpm dev          # dev server (next dev — Turbopack config exists in next.config.ts but not activated via CLI flag)
pnpm build        # production build
pnpm lint         # ESLint (next/core-web-vitals + typescript, flat config)
pnpm start        # production server
```

No test runner configured. `tests/{e2e,integration,unit}/` are empty dirs. `pnpm test` is undefined.

## Architecture

- **Next.js 16.2.9 App Router** + **React 19.2.4** — two route groups under `src/app/`:
  - `(main)/` — home, movies, tickets, notifications, profile
  - `(auth)/` — login, register
- **`(main)/page.tsx`** re-exports `home/page.tsx`.
- **Layout chain**: root layout (`LocaleProvider`) → `(main)/layout.tsx` (`LayoutProvider`, responsive) or `(auth)/layout.tsx` (bare `<div>`).
- **Responsive**: `LayoutProvider` detects 768px breakpoint. Renders `MobileLayout` (sticky `Header` + fixed `BottomNav`) and `DesktopLayout` (empty stub). Visibility toggled via `data-shell` CSS attributes in `global.css`.
- **Redux Toolkit**: store wired at `src/store/index.ts` — empty (`reducer: {}`).
- **i18n**: `useLocale()` from `LocaleContext` → `{ locale, setLocale, t(key) }`. Translations in `src/locales/{en,vn}.json`. Throws if used outside `LocaleProvider`.
- **Feature scaffolding**: `src/features/{auth,movies,profile,tickets}/` — only `movies/` has empty `api.ts`/`hooks.ts`; others empty.
- **`@/`** alias → `src/` in `tsconfig.json`.
- Error & not-found pages at `src/app/errors.tsx` / `not-found.tsx`.

## Framework / Toolchain Quirks

- **React Compiler OFF** (`reactCompiler: false`). `babel-plugin-react-compiler` devDep present but unused.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. Use `@import "tailwindcss"` syntax. No JS config file. Custom `@utility scrollbar-hide` in `global.css`.
- **Brand theme**: CSS variables in `src/styles/global.css` (gold/black). Access via `var(--color-*)` or `text-(--color-gold)`.
- **Icons**: `lucide-react`.
- **Navigation**: `<Link>` (not `<a>`); active route via `usePathname()`.
- **`"use client"`** only on components using hooks/browser APIs. Page stubs are Server Components (no directive).
- **Home page** (`(main)/home/page.tsx`) is the only substantial page (~247 lines) — inline components with hardcoded data from `src/libs/constants.ts`. Other routes are 3–6 line stubs.
- `pnpm-workspace.yaml` only controls native build permissions (`sharp`, `unrs-resolver`), not monorepo workspaces.
- No Prettier config, no CI/CD workflows.
- `src/libs/utils.ts` and `src/types/index.ts` are empty/placeholder.

## Conventions

- Pages and layouts are default-exported.
- Types are defined inline; no shared type definitions yet.
- `"use client"` at the top of every file using hooks or browser APIs.
