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

### Other Commands

```bash
pnpm build    # production build
pnpm start    # production server
pnpm lint     # ESLint
```

## Project Structure

```
src/
├── app/
│   ├── (main)/       # Home, movies list, tickets (protected), profile (protected)
│   ├── (blank)/      # Movie detail [slug] (full-screen, no header/nav)
│   ├── (sub)/        # ALL routes protected: notifications, tickets/[id], booking/[slug]/*, profile/*
│   └── (auth)/       # Login, register
├── components/
│   ├── auth/         # ProtectedRoute (auth guard)
│   ├── ui/           # Button, Badge, Card, Skeleton, InputField, PasswordField, Logo, TermsCheckbox, etc.
│   └── shared/       # MovieCard, CinemaCard, etc.
├── layouts/          # Layout system
│   ├── LayoutProvider.tsx
│   ├── constants.ts
│   ├── main/         # Home, movies, tickets, profile (Header + BottomNav / Header + Footer)
│   ├── sub/          # Detail pages (back button + title)
│   ├── auth/         # Login, register
│   └── blank/        # Full-screen pages (no chrome)
├── contexts/         # LocaleContext, AuthContext (cross-cutting)
├── features/         # Feature modules
│   ├── auth/         # Types, API, schema, context for authentication
│   ├── movies/       # Movie data, constants, types
│   ├── tickets/      # Ticket data, constants, types
│   ├── booking/      # Booking data, context, step contexts
│   └── ...
├── hooks/            # Shared custom hooks (useDevice)
├── libs/             # Constants, utilities (apiFetch, formatVND, etc.)
├── locales/          # en.json, vn.json
├── store/            # Redux store
├── styles/           # global.css (Tailwind + custom utilities)
└── types/            # Shared TypeScript types
```

## Notes

- Responsive layout: `LayoutProvider` selects layout type (main/auth/sub/blank), each layout's `index.tsx` uses `useDevice()` hook to switch between mobile/desktop variants via `matchMedia`
- Brand theme uses CSS variables (gold/black palette) in `global.css`
- Movie poster images configured in `next.config.ts` `images.remotePatterns`
- API layer (`features/*/api.ts`): movie/booking/notification APIs return mock data (commented-out fetch ready for backend). Auth API (`features/auth/api.ts`) connects to real backend via `apiFetch()` with `credentials: "include"`.
- Server components: all `page.tsx` files are server components that fetch data via API layer (`await`) and pass props to client components. Protected pages (`/tickets`, `/profile`, `(sub)/*`) are wrapped with `<ProtectedRoute>` client component.
- Auth system: RAM-only access token, HttpOnly cookie refresh token, automatic session restore on mount via `/api/v1/auth/refresh`
- Protected routes: `/tickets`, `/profile`, and all `(sub)/*` routes require authentication. Unauthenticated users see a login prompt with CTA.
- Movie detail review form is gated by auth — unauthenticated users see "Sign in to write a review" prompt, but review list remains public.
- Complete booking flow: cinema → seats → snack → credentials → payment → status/success or status/failed (6 pages, BookingContext persists state across steps)
- Payment step simulates external gateway: 2s loading → random 50/50 redirect to success or fail
- Edit profile page with field validation (full name, phone, DOB as date picker) — SAVE CHANGES button only active when changes detected
- Change password page with 4 requirement checks (8+ chars, uppercase, number, special char), errors shown on submit
- Wishlist page with persistent WishlistContext at root layout, heart toggle on movie detail
- Review & Rating page using ALL_MOVIES mock, filter by rating, load more pattern
- Cancel & refund flow: tickets/[id]/cancel — single page with 4-state machine (idle/processing/success/failed), two bottom sheets (cancellation policy + confirmation), animated result views matching booking status patterns, fixed ₫20,000 cancellation fee, refund to original payment method
