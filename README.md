# PrimeSeat

PrimeSeat is a responsive web-based movie ticket booking system designed to provide a seamless and optimized user experience for browsing movies, selecting showtimes, reserving seats, and completing ticket purchases online. The system supports both guest and registered users, while also providing administrative features for cinema management and operational monitoring:

This repository contains the frontend codebase for PrimeSeat which use Next.js 16.2 with App Router and React 19 + TypeScript.

## Tech Stack

- **Next.js 16.2** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Redux Toolkit**
- **lucide-react** (icons)
- **qrcode.react** (QR code generation)
- **next/image** (optimized images for payment brand logos)
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
│   ├── (main)/       # Home, movies list, tickets, profile
│   ├── (blank)/      # Movie detail [slug] (full-screen, no header/nav)
│   ├── (sub)/        # Notifications, tickets/[id], booking/[slug] (cinema, seats, snack, credentials, payment, status/success, status/failed), profile/edit, profile/password, profile/reviews, profile/wishlist
│   └── (auth)/       # Login, register
├── components/
│   ├── layout/       # LayoutProvider (responsive), mobile/ & desktop/ variants
│   └── common/       # MovieCard (reusable)
├── contexts/         # LocaleContext, MoviesContext, TicketsContext, BookingContext, WishlistContext
├── features/         # Feature modules (mock data, constants, types)
├── hooks/            # Shared custom hooks (empty)
├── libs/             # Constants, utilities
├── locales/          # en.json, vn.json
├── store/            # Redux store
├── styles/           # global.css (Tailwind + custom utilities)
└── types/            # Shared TypeScript types
```

## Notes

- Responsive layout: `LayoutProvider` switches between mobile (`< 768px`, Header + BottomNav) and desktop (Header + Footer) variants via `matchMedia`
- Brand theme uses CSS variables (gold/black palette) in `global.css`
- Movie poster images configured in `next.config.ts` `images.remotePatterns`
- Complete booking flow: cinema → seats → snack → credentials → payment → status/success or status/failed (6 pages, BookingContext persists state across steps)
- Payment step simulates external gateway: 2s loading → random 50/50 redirect to success or fail
- Edit profile page with field validation (full name, phone, DOB as date picker) — SAVE CHANGES button only active when changes detected
- Change password page with 4 requirement checks (8+ chars, uppercase, number, special char), errors shown on submit
- Wishlist page with persistent WishlistContext at root layout, heart toggle on movie detail
- Review & Rating page using ALL_MOVIES mock, filter by rating, load more pattern
