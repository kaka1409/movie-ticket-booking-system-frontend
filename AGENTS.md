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
  - `(sub)/` — notifications, `tickets/[id]` (detail page with back-arrow header), `booking/[slug]/cinema` (cinema & showtime selection), `booking/[slug]/seats` (seat selection), `booking/[slug]/snack` (food & drinks), `booking/[slug]/credentials` (contact information), `booking/[slug]/payment` (payment method selection), `booking/[slug]/status/success` (payment success), `booking/[slug]/status/failed` (payment failure)
  - `(auth)/` — login, register
- **`(main)/page.tsx`** re-exports `./home/page.tsx`.
- **Layout chain**: root layout (`LocaleProvider`) → each group wraps `LayoutProvider(layout="main"|"auth"|"sub"|"blank")`. Each layout type has its own `index.tsx` that uses `useDevice()` hook (`matchMedia`) to switch between mobile/desktop variants.
- **Layout structure** (`src/layouts/`):
  - `main/` — `index.tsx` (device switch), `mobile/` (MainLayout, Header, BottomNav), `desktop/` (MainLayout, Header, Footer), `types.ts`
  - `sub/` — `index.tsx`, `utils.ts` (getSubTitle, getBackHref), `mobile/` (SubLayout, Header), `desktop/` (SubLayout, Header)
  - `auth/` — `index.tsx`, `mobile/AuthLayout.tsx`, `desktop/AuthLayout.tsx`
  - `blank/` — `index.tsx`, `mobile/BlankLayout.tsx`, `desktop/BlankLayout.tsx`
  - `hooks/useDevice.ts` — shared matchMedia hook
  - `constants.ts` — LayoutType, Device types
- **Shared layout components** (`src/components/layout/`): `Logo.tsx` (size="sm"|"lg", tagline), `LanguageToggle.tsx` (variant="flag"|"text")
- **Shared hooks** (`src/hooks/`): `useDevice.ts` — returns `"mobile" | "desktop"` via `matchMedia`
- **Redux Toolkit**: store wired at `src/store/index.ts` — `reducer: {}` (unused, available for future features).
- **i18n**: `useLocale()` from `LocaleContext` via `useSyncExternalStore`. Returns `{ locale, setLocale, translate }`. Persists to `localStorage("locale")`. Translations at `src/locales/{en,vn}.json`. Throws if used outside `LocaleProvider`.
- **`@/`** alias → `src/` in `tsconfig.json`.
- Error & not-found pages at `src/app/errors.tsx` / `not-found.tsx`.
- **All API calls on server**: Every `page.tsx` is a server component that fetches data via `await`. Client components (`"use client"`) receive data via props only — no `useEffect` + API call pattern.

## State Management

- **`src/contexts/`** only holds cross-cutting contexts: `LocaleContext.tsx`. Feature-specific contexts live in `src/features/*/context.tsx`.
- **Movies page**: React Context (`src/features/movies/context.tsx`) with URL sync via `useSearchParams` + `router.replace`. State: `activeTab`, `query`, `filtersOpen`, `filters`, `appliedFilters`, `visibleCount`. URL-synced params: `status`, `genres`, `rating`, `format`, `ageRating`. Non-URL state: `query`, `filtersOpen`, `visibleCount`, `filters.releaseDate`, `filters.length`.
- **Tickets listing**: React Context (`src/features/tickets/context.tsx`) — `TicketsProvider` + `useTickets()` hook. Manages `activeTab` ("upcoming"|"past") and `visibleCount`. Tab switching resets `visibleCount` to 3; `loadMore` increments by 3.
- **Booking flow**: React Context (`src/features/booking/context.tsx`) — `BookingProvider` wraps all booking steps at `booking/[slug]/layout.tsx`. Manages cinema, seats, combos, foods, countdown, paymentMethod. Saves state on each step's CTA click. Local state initialized from context on back-navigation via `useState(contextValue)`. `paymentMethod` is included in `useMemo` dependency array.
- **Wishlist**: React Context (`src/features/wishlist/context.tsx`) — `WishlistProvider` at root layout, `useWishlist()` hook.
- **Booking step contexts** (local, per-step):
  - `CredentialsContext` (`credentials/components/mobile/CredentialsContext.tsx`) — manages `isValid` state shared between `ContactForm` and `BottomBar`.
  - `PaymentContext` (`payment/components/mobile/PaymentContext.tsx`) — manages `selectedMethod` state shared between `PaymentOption` and `BottomBar`.
  - `StatusContext` (`status/components/mobile/StatusContext.tsx`) — shared between success + fail pages. Provides `slug`, `transactionId`, `reason`, `movie`, `mounted` (animation state).
- **Other pages**: Local `useState` or no state needed.

## Feature Scaffolding

- `src/features/movies/` — `mock.tsx` (NOW_SHOWING, COMING_SOON, ALL_MOVIES, FEATURED_MOVIES), `constants.ts` (GENRES, AGE_RATINGS, RELEASE_OPTIONS, RATING_OPTIONS, LENGTH_OPTIONS, FORMAT_OPTIONS), `types.ts` (Movie, CastMember, FeaturedMovie), `api.ts` (getNowShowingMovies, getComingSoonMovies, getAllMovies, getFeaturedMovies, getMovieBySlug — mock with commented-out fetch). No hooks — `page.tsx` calls API directly via `await`.
- `src/features/tickets/` — `constants.ts` (SEAT_TYPES: Standard/VIP/SweetBox), `mock.ts` (UPCOMING with full detail + PAST with full detail), `types.ts` (FoodDrinkItem, UpcomingTicket, PastTicket), `api.ts` (getUpcomingTickets, getPastTickets, getTicketById).
- `src/features/notifications/` — `mock.tsx`, `constants.ts`, `types.ts`, `api.ts` (getNotifications).
- `src/features/auth/` — `mock.ts`.
- `src/features/profile/` — `mock.ts` (USER with avatarUrl from Contentful), `types.ts` (User interface), `api.ts` (getUser).
- `src/features/reviews/` — `mock.ts` (FILTERS with FilterKey), `api.ts` (getReviewFilters).
- `src/features/wishlist/` — `mock.ts` (INITIAL_WISHLIST IDs), `api.ts` (getInitialWishlist, re-exports INITIAL_WISHLIST).
- `src/features/booking/` — `types.ts` (Cinema, Showtime, DateOption, BookingSelection, BOOKING_STEPS [5 steps], Seat, SeatRow, SeatKind, SeatStatus, SeatPrice, ComboItem, FoodItem, FoodCategory), `mock.ts` (CINEMAS with PrimeSeat data, DATES, SEAT_ROWS with 10 rows A–J, SEAT_PRICES, COMBOS [4 combos], FOOD_ITEMS [8 items], FOOD_CATEGORIES, COUNTDOWN_SECONDS, MAX_SEATS_PER_BOOKING=8, SEAT_MAP_COLS=10), `api.ts` (getCinemas, getDates, getSeatRows, getSeatPrices, getCombos, getFoodItems, getFoodCategories, getCountdownSeconds, getMaxSeatsPerBooking), `context.tsx` (BookingProvider, useBooking).
- `src/hooks/` — `useDevice.ts` (returns `"mobile" | "desktop"` via `matchMedia`)
- `src/libs/constants.ts` has generic constants; `src/libs/utils.ts` has a `slugify` helper; `src/types/index.ts` has shared types (`Device`, `Movie`, `CastMember`, `FeaturedMovie`, `User`, `NotifType`, `Notification`, `SelectedSeat`, `SelectedCombo`, `SelectedFood`, `PaymentMethod`, `OrderDisplayProps`). Feature files re-export from `@/types` for backward compat.

## Ticket Detail Page

Two-level routing:
- **Listing**: `(main)/tickets/page.tsx` — inside main layout with BottomNav. Uses `TicketsProvider`.
- **Detail**: `(sub)/tickets/[id]/page.tsx` — **server component** that calls `getTicketById(id)` and passes to `TicketDetailClient`. Inside sub layout (back-arrow header, title "Ticket Details").

Detail page components under `(sub)/tickets/[id]/components/`:
- `TicketDetailClient.tsx` — client wrapper (receives ticket prop, renders mobile + desktop)
- `mobile/TicketInfo.tsx` — hero poster, theater/location, seat, food & drink, QR code, payment summary
- `mobile/TicketActions.tsx` — Download Ticket (always) + Cancel & Refund (only for success/confirmed/pending)
- `mobile/QRCode.tsx` — `qrcode.react` with full URL encoding (`https://primseat.com/tickets/{id}`), error correction level H
- `desktop/TicketDetail.tsx` — stub (returns null)

Past tickets show the same detail layout but without action buttons.

## Profile Page

`page.tsx` is a **server component** that calls `getUser()` and passes `user` prop to `MobileProfile.tsx` (client component):
- `MobileProfile.tsx` — client wrapper with `useLocale()` for menu labels
- `components/mobile/Avatar.tsx` — conic-gradient ring + `<Image>` (receives `user` prop, external URL from Contentful via `images.ctfassets.net` in `remotePatterns`)
- `components/mobile/UserInfo.tsx` — name + tier badge (Star icon, receives `user` prop)
- `components/mobile/MenuSection.tsx` — reusable menu card with icon rows, hover via Tailwind `hover:bg-(--color-surface-2)`
- `components/desktop/ProfileContent.tsx` — stub (returns null)

No BottomNav or TopNav — layout provides both. Menu items use i18n keys `profile.*`.

## Change Password Page

`(sub)/profile/password/page.tsx` — thin compose (mobile + desktop stub), same pattern as edit profile:
- `components/mobile/PasswordField.tsx` — reusable password input with Eye/EyeOff toggle, focus + error border states (same logic as edit profile `Field.tsx`)
- `components/mobile/PasswordRequirements.tsx` — 4 requirement checks with CheckCircle2/Circle icons, `text-(--color-gold)` for met, `text-(--color-text-muted)` for unmet
- `components/mobile/FormActions.tsx` — UPDATE PASSWORD + CANCEL buttons (same pattern as edit profile `SaveActions.tsx`)
- `components/mobile/ChangePasswordContent.tsx` — orchestrator with `validate()`, `touched` state, validation on submit
- `components/desktop/ChangePasswordContent.tsx` — stub (returns null)

Validation: Current Password (required), New Password (required + min 8 chars + uppercase + number + special char), Confirm Password (required + must match). `showErrors = touched && !isValid`.

Sub layout routing: `getSubTitle()` returns "Change Password", `getBackHref()` → `/profile` (handled by existing `/profile` prefix rule).

## Cinema & Showtime Page

`(sub)/booking/[slug]/cinema/page.tsx` resolves movie by slug from `ALL_MOVIES`, composes mobile components directly:
- `components/mobile/StepBar.tsx` — 5-step booking progress bar (SELECT CINEMA → SELECT SEATS → FOOD & DRINKS → CONTACT INFO → PAYMENT)
- `components/mobile/MovieSummary.tsx` — mini poster + movie info (duration, genre, ageRating, rating)
- `components/mobile/DatePicker.tsx` — horizontal scroll date picker
- `components/mobile/SearchBar.tsx` — cinema/location search input
- `components/mobile/CinemaCard.tsx` — cinema card with name, address, distance, badge, showtime chips (active/sold-out states)
- `components/mobile/CinemaList.tsx` — list wrapper + empty state
- `components/mobile/BottomBar.tsx` — sticky bottom bar with selection summary + "SELECT SEATS" CTA → links to `/booking/[slug]/seats`
- `components/desktop/CinemaContent.tsx` — stub (returns null)

Sub layout provides back button (→ movie detail) + "Cinema & Showtime" title. State managed via local `useState`.

## Seat Selection Page

`(sub)/booking/[slug]/seats/page.tsx` resolves movie by slug, composes mobile components:
- `components/mobile/StepBar.tsx` — step=2
- `components/mobile/CountdownBanner.tsx` — 5m59s countdown timer
- `components/mobile/SeatMap.tsx` — seat map with zoom-to-fit (ResizeObserver measures natural width, CSS `zoom` scales to viewport). Screen rendered as curved SVG arc. Max 8 seats enforced via `MAX_SEATS_PER_BOOKING`.
- `components/mobile/SeatCell.tsx` — regular (`w-6.5 h-6.5`), VIP (amber), sweetbox (`w-18.5 h-8`, pink). Occupied shows "×".
- `components/mobile/Legend.tsx` — color legend with × for occupied
- `components/mobile/BottomBar.tsx` — sticky bottom bar, selected seats + total price, "Continue to Snacks" CTA → `/booking/[slug]/snack`
- `components/desktop/SeatContent.tsx` — stub (returns null)

Seat types in mock: regular (5 cols/segment), VIP (5 cols/segment), sweetbox (2 pairs/segment). Rows A–H regular/VIP, I–J sweetbox. `handleToggle` blocks new selection when `selectedCount >= MAX_SEATS_PER_BOOKING`.

Booking flow navigation:
- Movie detail `BookTicketCTA` → `/booking/[slug]/cinema` (passes `?cinema=X&time=Y&date=Z` for preselection)
- Cinema BottomBar → `/booking/[slug]/seats` (active only when cinema+time selected)
- Seats BottomBar → `/booking/[slug]/snack`
- Snack BottomBar → `/booking/[slug]/credentials`
- Credentials BottomBar → `/booking/[slug]/payment`
- Payment BottomBar → 50/50 random → `/booking/[slug]/status/success` or `/booking/[slug]/status/failed` (2s simulated loading)

## Snack Page

`(sub)/booking/[slug]/snack/page.tsx` composes mobile components:
- `components/mobile/ComboCard.tsx` — combo card with image, name, description, price, quantity stepper
- `components/mobile/FoodItemCard.tsx` — food item card with Next.js `<Image>`, name, price, quantity stepper
- `components/mobile/CategorySection.tsx` — category header + food item list
- `components/mobile/Stepper.tsx` — quantity stepper (minus/plus buttons)
- `components/mobile/BottomBar.tsx` — sticky bottom bar, snack total + "Continue" CTA → `/booking/[slug]/credentials`

Section titles (`Quick Combos`, `Pick & Mix`) use `--color-gold-dark`. Prices use `--color-gold-light`.

## Credentials Page

`(sub)/booking/[slug]/credentials/page.tsx` — **server component** fetches movie, wraps with `CredentialsProvider`, imports components directly:
- `components/mobile/CredentialsContext.tsx` — manages `isValid` state shared between `ContactForm` and `BottomBar`
- `components/mobile/TextInput.tsx` — reusable text input with label
- `components/mobile/PhoneField.tsx` — phone input with country code selector (CDN flags via `flagcdn.com/w20/{flag}.png`)
- `components/mobile/FieldLabel.tsx` — field label component
- `components/mobile/OrderSummary.tsx` — reads all data from BookingContext (movie poster, genre, duration, cinema, room, date/time, seats, seat type, combos, foods, total)
- `components/mobile/BottomBar.tsx` — sticky bottom bar, total + "Continue to Payment" CTA → `/booking/[slug]/payment`, reads `isValid` from `useCredentials()`

## Payment Page

`(sub)/booking/[slug]/payment/page.tsx` — **server component** fetches movie, wraps with `PaymentProvider`, imports components directly:
- `components/mobile/PaymentContext.tsx` — manages `selectedMethod` state shared between `PaymentOption` and `BottomBar`
- `components/mobile/PaymentOption.tsx` — payment method card with brand image (`public/images/VNPay.png`, `public/images/momo.png` via `next/image`), reads `selected`/`setSelected` from `usePayment()`
- `components/mobile/OrderSummary.tsx` — same as credentials page, reads from BookingContext
- `components/mobile/SecureBadge.tsx` — security badge
- `components/mobile/TermsNote.tsx` — terms & conditions note
- `components/mobile/BottomBar.tsx` — sticky bottom bar, total + "Confirm Payment" CTA, reads `selectedMethod` from `usePayment()`. Simulates 2s payment processing → random redirect to success or fail

`StepBar current={5}` maps to "PAYMENT" step.

## Success & Fail Pages

Both pages use `<Suspense>` wrapper (required for `useSearchParams()`). White text theme throughout.

- `(sub)/booking/[slug]/status/success/page.tsx`:
  - `SuccessIcon.tsx` — animated green checkmark, reads `mounted` from `useStatus()`
  - `DetailRow.tsx` — reusable label/value row with `labelClass` prop for alignment
  - `TicketCard.tsx` — full ticket card, reads from `useBooking()` + `useStatus()`
  - `SuccessActions.tsx` — share/download action buttons, reads `mounted` from `useStatus()`

- `(sub)/booking/[slug]/status/failed/page.tsx`:
  - `FailedIcon.tsx` — animated red X with shake keyframe, reads `mounted` from `useStatus()`
  - `DetailRow.tsx` — same structure as success (self-contained duplicate, `labelClass` prop)
  - `FailedOrderCard.tsx` — same layout as success TicketCard but with red border, error code pill, no QR section
  - `FailActions.tsx` — retry/home/help action buttons, reads `mounted` from `useStatus()`

- `StatusContext.tsx` (`status/components/mobile/StatusContext.tsx`) — shared between success + fail pages. Provides `slug`, `transactionId`, `reason`, `movie`, `mounted`. Each page's `page.tsx` wraps with `<StatusProvider allMovies={allMovies}>`.

## Shared Booking Components

`booking/components/mobile/` (shared across all booking steps):
- `StepBar.tsx` — 5-step booking progress bar, reads `BOOKING_STEPS`, highlights current step
- `CountdownBanner.tsx` — 5m59s countdown timer, reads from BookingContext (only visible after first seat selection)
- `DetailRow.tsx` — reusable label/value row with icon, used in ticket cards

## Framework / Toolchain Quirks

- **React Compiler OFF** (`reactCompiler: false`). `babel-plugin-react-compiler` devDep present but unused.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. Use `@import "tailwindcss"` syntax. No JS config file. Custom `@utility scrollbar-hide` in `global.css`. Custom animations: `animate-fade-in` (fadeSlideIn keyframe), `animate-expand`.
- **Brand theme**: CSS custom properties in `global.css` (gold/black). Access via `var(--color-*)`. Spacing via `var(--space-*)`. Radius via `var(--radius-*)`. Shadows via `var(--shadow-*)`.
- **Tailwind + CSS variables**: Use `bg-(--color-gold)`, `text-(--color-text-muted)`, `shadow-(--shadow-card)`, `border-(--color-border)` syntax (88+ instances across codebase). Inline `style={}` only for dynamic/computed values — static styling always uses Tailwind utility classes.
- **Icons**: `lucide-react`.
- **QR codes**: `qrcode.react` (QRCodeSVG component) for ticket detail page.
- **Navigation**: `<Link>` (not `<a>`); active route via `usePathname()`. URL search params via `useSearchParams()` from `next/navigation`.
- **`"use client"`** required at top of every file using hooks or browser APIs.
- **Home page** (`(main)/home/page.tsx`) is a **server component** that fetches all data via API layer (`features/movies/api.ts`, `features/booking/api.ts`) and passes as props to mobile/desktop components. Sub-components under `home/components/{mobile,desktop}/`. MovieRow has `status` prop for "See All" navigation to movies page. API functions return mock data with commented-out `apiFetch()` calls — uncomment when backend is ready.
- **Movies page** (`(main)/movies/page.tsx`) — **server component** that fetches `getNowShowingMovies()` + `getComingSoonMovies()` via API layer, renders `<MoviesProvider>` + `<Suspense>` + individual components (Tabs, SearchBar, FilterPanel, MovieGrid). MovieGrid receives `nowShowing`/`comingSoon` as props. Desktop stub in `components/desktop/MovieGrid` (returns null).
- **Component split pattern**: Pages that render both mobile & desktop content in the same file use `block md:hidden` / `hidden md:block` (e.g. home, movies). Layout-level switching is handled by `LayoutProvider` via `matchMedia`. Each page has `components/{mobile,desktop}/` dirs. Shared components go in `components/shared/`. See `(main)/home/` as canonical example.
- **Sub layout `getSubTitle()`**: Handles `/notifications` (i18n), `/tickets` (returns "Ticket Details"), `/booking/[slug]/cinema` (returns "Cinema & Showtime"), `/booking/[slug]/seats` (returns "Select Seat"), `/booking/[slug]/snack` (returns "Food & Drinks"), `/booking/[slug]/credentials` (returns "Contact Information"), `/booking/[slug]/payment` (returns "Payment"), `/booking/[slug]/status/success` (returns "Payment Success"), `/booking/[slug]/status/failed` (returns "Payment Failed"), `/profile/edit` (returns "Edit Profile"), `/profile/password` (returns "Change Password"). Back button goes to `/tickets` for ticket routes, `/movies/[slug]` for cinema routes, `/booking/[slug]/cinema` for seat routes, `/booking/[slug]/seats` for snack routes, `/booking/[slug]/snack` for credentials routes, `/booking/[slug]/credentials` for payment routes, `/` for success routes, `/booking/[slug]/payment` for failed routes, `/profile` for all profile routes. Utility functions `getSubTitle()` and `getBackHref()` extracted to `src/layouts/sub/utils.ts`.
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
- No single-letter variables or abbreviations — all variable names must be clear and descriptive (e.g. `translate` not `t`, `movie` not `m`, `event` not `e`).
- Filter components (FilterChip, FilterCheckRow, FilterLabel) are internal to movies page `components/mobile/`.
- All cinema data uses **PrimeSeat** brand — Vietnamese addresses, km-based distances, 24h time format.
- Inline `style={}` props are used for dynamic/computed values (gradients, animation delays, computed widths, aspect ratios). Static styling always uses Tailwind utility classes with CSS custom property syntax.
- Payment method logos use `next/image` (`public/images/VNPay.png`, `public/images/momo.png`).
- Pages using `useSearchParams()` must wrap content in `<Suspense>` to avoid 404 during SSR.
