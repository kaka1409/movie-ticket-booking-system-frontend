# PrimeSeat

PrimeSeat is a responsive web-based movie ticket booking system designed to provide a seamless and optimized user experience for browsing movies, selecting showtimes, reserving seats, and completing ticket purchases online. The system supports both guest and registered users, while also providing administrative features for cinema management and operational monitoring:

This repository contains the frontend codebase for PrimeSeat which use Next.js 16.2 with App Router and React 19 + TypeScript.

## Tech Stack

- **Next.js 16.2** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Redux Toolkit**
- **lucide-react** (icons)
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
│   ├── (main)/       # Home, movies, tickets, notifications, profile
│   └── (auth)/       # Login, register
├── components/
│   ├── layout/       # Header, BottomNav, LayoutProvider (responsive)
│   └── ui/movie/     # MovieCard (reusable)
├── contexts/         # LocaleContext (i18n)
├── features/         # Feature modules (scaffolding)
├── libs/             # Constants, utilities
├── locales/          # en.json, vn.json
├── store/            # Redux store
├── styles/           # global.css (Tailwind + custom utilities)
└── types/            # Shared TypeScript types
```

## Notes

- Responsive layout: mobile (< 768px) shows Header + BottomNav, desktop shows placeholder shell
- Brand theme uses CSS variables (gold/black palette) in `global.css`
- Movie poster images configured in `next.config.ts` `images.remotePatterns`
