# PrimeSeat

PrimeSeat is a responsive web-based movie ticket booking system designed to provide a seamless and optimized user experience for browsing movies, selecting showtimes, reserving seats, and completing ticket purchases online. The system supports registered users and admin roles, while also providing administrative features for cinema management and operational monitoring:

This repository contains the frontend codebase for PrimeSeat which use Next.js 16.2 with App Router and React 19 + TypeScript.

## Tech Stack

- **Next.js 16.2** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Redux Toolkit**
- **lucide-react** (icons)
- **qrcode.react** (QR code generation)
- **next/image** (optimized images for payment brand logos)
- **Zod** (form validation schemas)
- **i18n** (English / Vietnamese)

<!--## Screenshots-->

<!--| Home | Movie Detail |
|------|-------------|
| ![Home](public/images/screenshot-home.png) | ![Detail](public/images/screenshot-detail.png) |-->

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Install & Run

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

### Environment Variables

Copy the template, then adjust values in `.env.local` (gitignored; `.env.example` is committed):

```bash
cp .env.example .env.local
```

| Variable               | Default                 | Description                                                                                                                                                        |
| ---------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `BACKEND_URL`          | `http://localhost:8080` | Backend origin. Read server-side by `src/libs/api.ts` **and evaluated at build time** by `next.config.ts` `rewrites()` — set it before `pnpm build` when deploying |
| `API_PREFIX`           | `/api/v1`               | API path prefix                                                                                                                                                    |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public site origin for SEO metadata (`metadataBase`, OG/Twitter URLs, `robots.ts`, `sitemap.ts`) — **set to the real domain before `pnpm build`**                  |

### Other Commands

```bash
pnpm build    # production build
pnpm start    # production server
pnpm lint     # ESLint
pnpm format   # Prettier write (config: .prettierrc)
```

> No test runner yet — `tests/{unit,integration,e2e}/` are empty placeholders.

## Project Structure

```
src/
├── app/
│   ├── (main)/       # Home, movies list, tickets (protected), profile (protected)
│   ├── (blank)/      # Movie detail [slug] (full-screen, no header/nav)
│   ├── (sub)/        # ALL routes protected: notifications, tickets/[id], booking/[slug]/*, profile/*
│   └── (auth)/       # Login, register
├── components/
│   ├── ui/           # Button, Badge, Card, Skeleton, InputField, PasswordField, Logo, TermsCheckbox, etc.
│   └── shared/       # ProtectedRoute, BookingBottomBar, RouteError, ReviewCard, TrailerModal, WriteReview
├── layouts/          # Layout system
│   ├── LayoutProvider.tsx
│   ├── constants.ts
│   ├── main/         # Home, movies, tickets, profile (Header + BottomNav / Header + Footer)
│   ├── sub/          # Detail pages (back button + title)
│   ├── auth/         # Login, register
│   └── blank/        # Full-screen pages (no chrome)
├── contexts/         # DeviceContext, LocaleContext, AuthContext (cross-cutting)
├── features/         # Feature modules
│   ├── auth/         # Types, API, schema, context for authentication
│   ├── movies/       # Movie data, constants, types
│   ├── tickets/      # Ticket data, constants, types
│   ├── booking/      # Booking data, reducer, effect-only helpers
│   └── ...
├── hooks/            # Shared custom hooks (useDevice, useMounted, useAppendReveal, useDebouncedValue)
├── libs/             # Constants, utilities (apiFetch, formatVND, etc.)
├── locales/          # en.json, vn.json
├── store/            # Redux store
├── styles/           # global.css (Tailwind + custom utilities)
└── types/            # Shared TypeScript types
```

## Notes

- Responsive layout: `LayoutProvider` selects layout type (main/auth/sub/blank), each layout's `index.tsx` uses `useDevice()` hook to switch between mobile/desktop variants — seeded from the server UA guess (`DeviceProvider`) so first paint never flashes, `matchMedia` corrects on resize
- Brand theme uses CSS variables (gold/black palette) in `global.css`
- Movie poster images configured in `next.config.ts` `images.remotePatterns`
- API layer (`features/*/api.ts`): every catalog and flow is LIVE against the backend — movies, booking (seat map/holds/catalogs/create/payment intent/detail), tickets (listing/detail/transfer/modify/cancel), wishlist, notifications and reviews. Only field fallbacks remain (`movies/mock.tsx` for the desktop hover preview, `reviews/mock.ts` for the review filters). Auth mutations (`features/auth/action.ts`) connect to real backend via `apiMutation()` with cookies.
- Server components: `page.tsx` files are server components that fetch data via API layer (`await`) and pass props to client components (`tickets/[id]/cancel` is a client state machine by design). Protected pages (`/tickets`, `/profile`, `(sub)/*`) are gated server-side (`hasSession()` → `LoginPrompt`) plus the `<ProtectedRoute>` client fallback.
- Auth system: RAM-only access token, HttpOnly cookie refresh token, automatic session restore on mount via `/api/v1/auth/refresh`
- Protected routes: `/tickets`, `/profile`, and all `(sub)/*` routes require authentication. Unauthenticated users see a login prompt with CTA.
- Movie detail review form is gated by auth — unauthenticated users see "Sign in to write a review" prompt, but review list remains public.
- Complete booking flow: cinema → seats → snack → credentials → payment → QR → status/success or status/failed (`BookingProvider` persists the draft across steps)
- Payment step creates the booking (`createBookingAction`) and hands off to the QR page, which owns the attempt (`createPaymentIntentAction` → 3 s poll → simulate/sync). The method list comes from `GET /payment-methods`, so availability ("coming soon", demo controls) is decided by the server — the UI keeps no method list of its own
- Edit profile page with field validation (full name, phone, DOB as date picker) — SAVE CHANGES button only active when changes detected
- Change password page with 4 requirement checks (8+ chars, uppercase, number, special char), errors shown on submit
- Wishlist page with persistent WishlistContext at root layout, heart toggle on movie detail
- Review & Rating page using ALL_MOVIES mock, filter by rating, load more pattern
- Cancel & refund flow: tickets/[id]/cancel — single page with 4-state machine (idle/processing/success/rejected), two bottom sheets (cancellation policy + confirmation), animated result views matching booking status patterns, **100% refund with no fee** (the only gate is the 2-hour cutoff the backend enforces), refund to original payment method
