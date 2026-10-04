# AGENTS.md

## Commands

```bash
pnpm dev          # dev server (no --turboproc flag; config has `turbopack` key for root resolution)
pnpm build        # production build
pnpm lint         # ESLint (next/core-web-vitals + typescript, flat config)
pnpm format       # Prettier write (config: .prettierrc)
pnpm start        # production server
```

No test runner. `tests/{e2e,integration,unit}/` are empty dirs. `pnpm test` undefined.

## Architecture

- **Next.js 16.2.9 App Router** + **React 19.2.4** — four route groups under `src/app/`:
  - `(main)/` — home, movies list, tickets listing (protected), profile (protected)
  - `(blank)/` — `movies/[slug]` (full-screen pages, no header/nav, public)
  - `(sub)/` — ALL routes are protected (requires authentication): notifications, `tickets/[id]`, `tickets/[id]/cancel`, `tickets/[id]/transfer`, `booking/[slug]/*`, `profile/edit`, `profile/password`, `profile/reviews`, `profile/wishlist`
  - `(auth)/` — login, register
- **`(main)/page.tsx`** re-exports `./home/page.tsx`.
- **Layout chain**: root layout (`AuthProvider` → `WishlistProvider`) → each group wraps `LayoutProvider(layout="main"|"auth"|"sub"|"blank")`. Each layout type has its own `index.tsx` that uses `useDevice()` hook (`matchMedia`) to switch between mobile/desktop variants. Protected routes use `ProtectedRoute` wrapper (page-level for `(main)/tickets` and `(main)/profile`, layout-level for `(sub)/`).
- **Layout structure** (`src/layouts/`):
  - `components/` — `Logo.tsx`, `LanguageToggle.tsx` (shared across layouts)
  - `main/` — `index.tsx` (device switch), `mobile/` (MainLayout, Header, BottomNav), `desktop/` (MainLayout, Header, Footer), `types.ts`
  - `sub/` — `index.tsx`, `utils.ts` (getSubTitle), `mobile/` (SubLayout, Header), `desktop/` (SubLayout, Header)
  - `auth/` — `index.tsx`, `mobile/AuthLayout.tsx`, `desktop/AuthLayout.tsx`
  - `blank/` — `index.tsx`, `mobile/BlankLayout.tsx`, `desktop/BlankLayout.tsx`
  - `constants.ts` — LayoutType, Device types (device hook lives in `src/hooks/useDevice.ts`)
  - `constants.ts` — LayoutType, Device types
- **Shared layout components** (`src/layouts/components/`): `Logo.tsx` (size="sm"|"lg", tagline), `LanguageToggle.tsx` (variant="flag"|"text")
- **Shared UI components** (`src/components/ui/`): `MovieCard.tsx` (reusable movie card), `Skeleton.tsx` (Skeleton, SkeletonCircle, SkeletonText, SkeletonCard loaders), `TearLine.tsx` (ticket-style dashed separator with circular cutouts), `FormActions.tsx` (primary + cancel button pair), `Tabs.tsx` (generic tab bar), `Button.tsx` (primary/outline/loadMore variants, loading state), `FormField.tsx` (icon + input + focus/error border), `Badge.tsx` (neutral/dark/gold/success/error pills), `Card.tsx` (card wrapper with selected/error states), `SectionHeader.tsx` (borderLeft/goldBar/uppercase variants), `SearchBar.tsx` (icon + input + clear button), `EmptyState.tsx` (icon + title + description + CTA), `InputField.tsx` (text input with icon), `PasswordField.tsx` (password input with Eye/EyeOff toggle), `Logo.tsx` (brand logo), `TermsCheckbox.tsx` (checkbox with terms/privacy links)
- **Shared hooks** (`src/hooks/`): `useDevice.ts` — returns `"mobile" | "desktop"` via `matchMedia`
- **Redux Toolkit**: store wired at `src/store/index.ts` — `reducer: {}` (unused; reserved for future global state, e.g. notifications badge).
- **i18n**: `useLocale()` from `LocaleContext` via `useSyncExternalStore`. Returns `{ locale, setLocale, translate }`. Persists to `localStorage("locale")`. Translations at `src/locales/{en,vn}.json`. Throws if used outside `LocaleProvider`.
- **`@/`** alias → `src/` in `tsconfig.json`.
- Error pages: `src/app/error.tsx` (root, uses shared `components/shared/RouteError.tsx`), `src/app/global-error.tsx`, per-group `error.tsx` in `(main)`, `(blank)`, `(sub)`, `(auth)`; 404 at `src/app/not-found.tsx`.
- **All API calls on server**: Every `page.tsx` is a server component that fetches data via `await`. Client components (`"use client"`) receive data via props only — no `useEffect` + API call pattern. Protected pages are wrapped with `<ProtectedRoute>` client component for auth gating.

## State Management

- **`src/contexts/`** holds cross-cutting contexts: `LocaleContext.tsx`, `AuthContext.tsx`. AuthContext provides `{ user, token, isAuthenticated, isLoading, setAuth, clearAuth, updateUser }` — state only, no API actions. Feature-specific contexts live in `src/features/*/context.tsx`.
- **Movies page**: React Context (`src/features/movies/context.tsx`) with URL sync via `useSearchParams` + `router.replace`. State: `activeTab`, `query`, `filtersOpen`, `filters`, `appliedFilters`, `visibleCount`. URL-synced params: `status`, `genres`, `rating`, `format`, `ageRating`. Non-URL state: `query`, `filtersOpen`, `visibleCount`, `filters.releaseDate`, `filters.length`.
- **Tickets listing**: React Context (`src/features/tickets/context.tsx`) — `TicketsProvider` + `useTickets()` hook. Manages `activeTab` ("upcoming"|"past") and `visibleCount`. Tab switching resets `visibleCount` to 3; `loadMore` increments by 3.
- **Booking flow**: React Context (`src/features/booking/context.tsx`) — `BookingProvider` wraps all booking steps at `booking/[slug]/layout.tsx`. Manages cinema, seats, combos, foods, countdown, paymentMethod. Saves state on each step's CTA click. Local state initialized from context on back-navigation via `useState(contextValue)`. `paymentMethod` is included in `useMemo` dependency array.
- **Wishlist**: React Context (`src/features/wishlist/context.tsx`) — `WishlistProvider` at root layout, `useWishlist()` hook.
- **Booking step contexts** (`src/features/booking/contexts/`):
  - `CinemaSelectionContext.tsx` — cinema/time selection state, search query, filtered cinemas
  - `SeatSelectionContext.tsx` — seat toggle logic, restores saved seats, starts countdown on first selection
  - `SnackSelectionContext.tsx` — combo/food quantity state, syncs selections to BookingContext
  - `CredentialsContext.tsx` — manages `isValid` state shared between `ContactForm` and `BottomBar`
  - `PaymentContext.tsx` — manages `selectedMethod` state shared between `PaymentOption` and `BottomBar`
  - `StatusContext.tsx` — shared between success + fail pages. Provides `slug`, `transactionId`, `reason`, `movie`, `mounted` (animation state)
- **Other pages**: Local `useState` or no state needed.

## Feature Scaffolding

- `src/features/movies/` — `mock.tsx` (NOW_SHOWING, COMING_SOON, ALL_MOVIES, FEATURED_MOVIES), `constants.ts` (GENRES, AGE_RATINGS, RELEASE_OPTIONS, RATING_OPTIONS, LENGTH_OPTIONS, FORMAT_OPTIONS), `types.ts` (Movie, CastMember, FeaturedMovie), `api.ts` (getNowShowingMovies, getComingSoonMovies, getAllMovies, getFeaturedMovies, getMovieBySlug — mock with commented-out fetch). No hooks — `page.tsx` calls API directly via `await`.
- `src/features/tickets/` — `constants.ts` (SEAT_TYPES: Standard/VIP/SweetBox), `mock.ts` (UPCOMING with full detail + PAST with full detail including cancelled/refunded tickets, MOCK_RECIPIENTS, MOCK_ELIGIBLE_SHOWTIMES), `types.ts` (FoodDrinkItem, UpcomingTicket, PastTicket, Recipient, TicketTransfer, SeatTicket, ModificationType, ModificationSeat, EligibleShowtime, ModificationResult), `api.ts` (queries only: getUpcomingTickets, getPastTickets, getTicketById, findRecipient, searchRecipients, getEligibleShowtimes), `action.ts` (server actions: createTransfer, cancelTransfer, modifyTicket, cancelTicket — `"use server"`), `context.tsx` (TicketsProvider), `contexts/` (TransferContext, TicketDetailContext, ModificationContext).
- `src/features/notifications/` — `mock.tsx`, `constants.ts`, `types.ts`, `api.ts` (getNotifications).
- `src/features/auth/` — `types.ts` (User, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, RefreshResponse, LogoutResponse), `action.ts` (server actions: loginAction, registerAction, refreshAction, logoutAction — `"use server"`), `schema.ts` (createLoginSchema, createRegisterSchema — Zod factory functions with i18n).
- `src/features/profile/` — `types.ts` (User interface, UpdateProfileRequest), `action.ts` (updateProfile server action), `api.ts` (empty, deprecated).
- `src/features/reviews/` — `mock.ts` (FILTERS with FilterKey), `types.ts` (FilterKey), `api.ts` (getReviewFilters).
- `src/features/wishlist/` — `mock.ts` (INITIAL_WISHLIST IDs), `api.ts` (getInitialWishlist, re-exports INITIAL_WISHLIST), `context.tsx` (WishlistProvider, useWishlist).
- `src/features/booking/` — `types.ts` (SelectedSeat, SelectedCombo, SelectedFood, BookingSelection, BOOKING_STEPS [5 steps] — re-exports shared types from `features/shared/types`), `mock.ts` (re-exports shared mock data from `features/shared/mock`), `api.ts` (getCinemas, getDates, getSeatRows, getSeatPrices, getCombos, getFoodItems, getFoodCategories, getCountdownSeconds, getMaxSeatsPerBooking — all re-export from shared), `context.tsx` (BookingProvider, useBooking), `contexts/` (CinemaSelectionContext, SeatSelectionContext, SnackSelectionContext, CredentialsContext, PaymentContext, StatusContext).
- `src/hooks/` — `useDevice.ts` (returns `"mobile" | "desktop"` via `matchMedia`)
- `src/libs/constants.ts` has generic constants; `src/libs/utils.ts` has `slugify`, `formatVND`, `formatDate` helpers; `src/libs/zod.ts` has shared Zod validators (`isValidPhone`, password regex patterns); `src/types/index.ts` has shared types (`Device`, `Movie`, `CastMember`, `FeaturedMovie`). Feature-specific types live in `features/*/types.ts`. Feature-specific Zod schemas live in `features/*/schema.ts`.

## Auth Pages (Login & Register)

Tab-switching auth page — both login and register in a single `AuthPage` component.

- **Login route**: `(auth)/login/page.tsx` — server component, reads `searchParams.returnUrl`, sanitizes with `getSafeReturnUrl()` (from `libs/utils.ts`: must start with a single `/`, rejects `//host`, `/\host` and `/login` loops), renders `<LoginForm returnUrl={...}>` for mobile + desktop
- **Register route**: `(auth)/register/page.tsx` — renders `RegisterForm` for mobile + desktop
- **Auth layout**: `(auth)/layout.tsx` → `LayoutProvider(layout="auth")` → `AuthLayout` (Logo + LanguageToggle header, centered content).
- **LoginForm** (`(auth)/login/components/mobile/LoginForm.tsx`, `"use client"`): `InputField`, `PasswordField`, `Tabs` (login/register switch), `Button`, `Logo`. On success: `setAuth(...)` then `router.push(returnUrl ?? "/")`.
- **RegisterForm** (`(auth)/register/components/mobile/RegisterForm.tsx`): register form, on success → `/login`.
- **Validation**: Zod schemas from `features/auth/schema.ts` — `createLoginSchema(translate)` and `createRegisterSchema(translate)` (factory functions). Pattern: `schema.safeParse()` → `result.error.flatten().fieldErrors` → `touched` + show errors.
- **API calls**: Server actions in `features/auth/action.ts` — `loginAction()`, `registerAction()`, `refreshAction()`, `logoutAction()` (all `"use server"`).
- **Auth context**: `contexts/AuthContext.tsx` — `AuthProvider` wraps root layout, `useAuth()` hook provides `{ user, token, isAuthenticated, isLoading, setAuth, clearAuth, updateUser }`. AuthContext is **state-only** — consumer components (LoginForm, RegisterForm, ProfileMenu) call server actions directly, then update state via `setAuth()`/`clearAuth()`. Access token stored in RAM only (React state). Refresh token in HttpOnly cookie (managed by server actions via `cookies()` API). On mount, calls `refreshAction()` to restore session.
- **Error handling**: 401 → "Invalid email or password", 409 → "Email already exists", other → generic server error. Displayed as red alert box below form.
- **CSS conventions**: Uses `bg-(--color-gold)`, `text-(--color-text-muted)`, `border-(--color-border)` parenthesized syntax (NOT `bg-[--color-gold]` bracket syntax).
- **Backend endpoints**:
  - `POST /api/v1/auth/login` — body `{ email, password }` → `{ data: { accessToken, user } }` + Set-Cookie: refreshToken (HttpOnly, Secure, SameSite=Strict, path=/)
  - `POST /api/v1/auth/register` — body `{ fullname, email, password }` → `{ data: { message } }`
  - `POST /api/v1/auth/refresh` — forwards refreshToken cookie → new accessToken + new refreshToken cookie (rotation)
  - `POST /api/v1/auth/logout` — forwards refreshToken cookie → clears refresh token cookie + revokes token in DB

## Protected Route Guards

Protection is layered (outside-in):

1. **`src/proxy.ts`** — Next 16 network-boundary hook (NOT `middleware.ts`: deprecated and **silently ignored** in Next 16). Matcher: `/notifications`, `/tickets/:path*`, `/booking/:path*`, `/profile`, `/profile/:path*`. Missing `refreshToken` cookie → `307 /login?returnUrl=<pathname+query>` (returnUrl is sanitized again by the login page). Optimistic check only — not an auth boundary.
2. **Server gate** — `requireAuth(returnUrl?)` from `src/libs/session.ts`, called at the top of `(sub)/layout.tsx`, `(main)/tickets/page.tsx`, `(main)/profile/page.tsx`. Throws `redirect("/login...")` when the `refreshToken` cookie is absent, **before any data fetch** → protected data never enters the RSC payload.
3. **`src/components/shared/ProtectedRoute.tsx`** — client component, UX layer:
   - `isLoading` → skeleton spinner
   - `!isAuthenticated` → login prompt with icon + "Login Required" + CTA button → `/login?returnUrl={pathname}`
   - `isAuthenticated` → render children
   - Rendered at page level by `tickets/page.tsx` and `profile/page.tsx`, and at layout level by `(sub)/layout.tsx`
4. **Backend enforcement** — server-side fetches of user-scoped data forward the incoming cookies via `getRequestCookie()` (see API Layer).

- **Component-level protection**: Movie detail `Reviews.tsx` conditionally renders `WriteReview` — shows login CTA for unauthenticated users, review list remains public

| Route                                                                | Protected?               |
| -------------------------------------------------------------------- | ------------------------ |
| `/`, `/home`, `/movies`, `/movies/:slug`                             | Public                   |
| `/tickets`, `/profile`                                               | Protected (page-level)   |
| `/profile/*`, `/tickets/:id/*`, `/booking/:slug/*`, `/notifications` | Protected (layout-level) |

Known gap: a present-but-revoked `refreshToken` cookie passes proxy + `requireAuth`. Handled at two layers now: client-side a backend 401 dispatches `UNAUTHORIZED_EVENT` (`libs/api.ts` `notifyUnauthorized`, `/auth/*` excluded) → `AuthContext` clears state and `router.replace` to `/login?returnUrl=...`; server-side call `redirectIfUnauthorized(result, returnUrl)` (`libs/session.ts`) on `apiFetch` results — wired up when the mocked user-scoped wrappers (`tickets`, `notifications`) switch to real fetches (the stale cookie itself can't be cleared from a server component; the next login overwrites it).

## Ticket Detail Page

Two-level routing:

- **Listing**: `(main)/tickets/page.tsx` — inside main layout with BottomNav. Wrapped with `<ProtectedRoute>`. Uses `TicketsProvider`.
- **Detail**: `(sub)/tickets/[id]/page.tsx` — renders components directly (no props). **Layout** (`layout.tsx`) is the server component that calls `getTicketById(id, await getRequestCookie())`, wraps children in `<TicketDetailProvider>`. Components read ticket from `useTicketDetail()` context.

Detail page components under `(sub)/tickets/[id]/components/`:

- `mobile/TicketInfo.tsx` — hero poster, theater/location, seat, food & drink, QR code, payment summary
- `mobile/TicketActions.tsx` — Download Ticket (always) + Cancel & Refund (only for success/confirmed/pending) + Transfer Ticket (upcoming only)
- `mobile/QRCode.tsx` — `qrcode.react` with full URL encoding (`https://primseat.com/tickets/{id}`), error correction level H
- `desktop/TicketDetail.tsx` — stub (returns null)

Past tickets show the same detail layout but without action buttons.

## Ticket Transfer

Two sub-routes under `(sub)/tickets/[id]/transfer/`:

- `transfer/page.tsx` — wraps with `TransferProvider`, renders `SeatSelector`, `RecipientInput`, `TransferBottomBar`. Mobile/desktop split via `block md:hidden`.
- `transfer/confirm/page.tsx` — **server component** that reads `searchParams` (`seats`, `recipient`, `transferSnacks`), calls `findRecipient()`, redirects to transfer page if invalid. Renders `ConfirmCard`, `ConfirmBottomBar`.

Both have `loading.tsx`. Desktop stubs return null.

Components under `transfer/components/`:

- `mobile/SeatSelector.tsx` — seat toggle for transferable seats
- `mobile/RecipientInput.tsx` — recipient search (uses `searchRecipients()` API)
- `mobile/TransferBottomBar.tsx` — sticky bottom bar with transfer CTA → links to confirm page
- `desktop/TransferContent.tsx` — stub

Components under `transfer/confirm/components/`:

- `mobile/ConfirmCard.tsx` — transfer summary (seats, recipient, snacks toggle)
- `mobile/ConfirmBottomBar.tsx` — calls `createTransfer()` API, redirects to ticket detail on success
- `desktop/ConfirmContent.tsx` — stub

`TransferContext.tsx` (`features/tickets/contexts/`) manages `selectedSeats`, `recipient`, `transferSnacks` state. `TicketDetailContext.tsx` provides `{ ticket, transfer }` from layout.

## Ticket Cancel & Refund

Single route under `(sub)/tickets/[id]/cancel/` — no separate routes for success/failed:

- `cancel/page.tsx` — **client component** state machine with 4 views: `idle` (summary), `processing` (loading overlay), `success`, `failed`. Reads ticket from `useTicketDetail()` context (parent layout). Computes cancellation fee (fixed ₫20,000), total paid, and refund amount locally.
- `cancel/loading.tsx` — skeleton matching summary layout
- `cancel/components/mobile/CancelSummary.tsx` — movie info card (poster, title, cinema, datetime), seats, price breakdown (ticket + combo), total paid, cancellation fee, refund amount, refund-to section (payment method from ticket), cancellation policy link, Continue button
- `cancel/components/mobile/CancellationPolicySheet.tsx` — bottom sheet with 4 policy rules, Done button. Uses `ActionSheet` wrapper.
- `cancel/components/mobile/ConfirmationSheet.tsx` — bottom sheet with refund amount, "Cancel Booking" (red) + "Keep My Ticket" buttons. Uses `ActionSheet` wrapper.
- `cancel/components/mobile/CancelResult.tsx` — success state: animated green checkmark (same pattern as booking status success), refund info card with "Processing" badge, View Ticket + Back to Home buttons. Failed state: animated red alert with shake keyframe (same pattern as booking status failed), refund info card with "Refund Failed" badge, Try Again + Contact Support buttons.
- `cancel/components/desktop/CancelContent.tsx` — stub (returns null)

Entry point: `TicketActions.tsx` Cancel & Refund row → `router.push(/tickets/${id}/cancel)`. Currently shown only when `canCancel` is true (status success/confirmed/pending) and no pending transfer.

Cancellation fee is fixed ₫20,000 (policy time from backend in future). `cancelTicket()` API simulates 2s delay with 70% success / 30% refund-failure. After success, "View Ticket" calls `router.replace()` + `router.refresh()` to re-fetch server-side ticket data.

## Profile Page

`page.tsx` is a **server component** wrapped with `<ProtectedRoute>`, renders `Avatar`, `UserInfo`, `ProfileMenu` directly (no props). All client components read user from `useAuth().user` context.

- `components/mobile/Avatar.tsx` — conic-gradient ring + `<Image>` (reads `user.avatarUrl` from auth context, external URL from Contentful via `images.ctfassets.net` in `remotePatterns`)
- `components/mobile/UserInfo.tsx` — name + tier badge (Star icon, reads `user.name` from auth context)
- `components/mobile/MenuSection.tsx` — reusable menu card with icon rows, hover via Tailwind `hover:bg-(--color-surface-2)`
- `components/desktop/ProfileContent.tsx` — stub (returns null)

No BottomNav or TopNav — layout provides both. Menu items use i18n keys `profile.*`.

## Change Password Page

`(sub)/profile/password/page.tsx` — thin compose (mobile + desktop stub), same pattern as edit profile:

- `components/mobile/PasswordField.tsx` — reusable password input with Eye/EyeOff toggle, focus + error border states
- `components/mobile/PasswordRequirements.tsx` — 4 requirement checks with CheckCircle2/Circle icons, `text-(--color-gold)` for met, `text-(--color-text-muted)` for unmet
- `components/mobile/PasswordForm.tsx` — orchestrator with `validate()`, `touched` state, validation on submit, UPDATE PASSWORD + CANCEL actions
- `components/desktop/ChangePasswordContent.tsx` — stub (returns null)

Validation: Current Password (required), New Password (required + min 8 chars + uppercase + number + special char), Confirm Password (required + must match). `showErrors = touched && !isValid`.

Sub layout routing: `getSubTitle()` returns "Change Password". Back button goes to `/profile` (handled by existing `/profile` prefix rule).

## Edit Profile Page

`(sub)/profile/edit/page.tsx` — thin compose (mobile + desktop stub):

- `components/mobile/ProfileForm.tsx` — profile form with fields, uses `updateProfile` server action via `useTransition`
- `components/mobile/AvatarEditor.tsx` — avatar editor with image upload
- `components/desktop/EditProfileContent.tsx` — stub (returns null)

Validation: Full name (required), phone (required), DOB as date picker. `loading.tsx` present.

## Reviews & Rating Page

`(sub)/profile/reviews/page.tsx` — reviews listing:

- `components/mobile/ReviewList.tsx` — review list wrapper
- `components/mobile/ReviewCard.tsx` — individual review card with rating, text, date
- `components/mobile/FilterBar.tsx` — filter bar for rating-based filtering
- `components/mobile/StarRating.tsx` — star rating display component
- `components/mobile/LoadMoreButton.tsx` — load more pagination
- `components/desktop/ReviewContent.tsx` — stub (returns null)

Uses `getReviewFilters()` from `features/reviews/api.ts` and `ALL_MOVIES` mock data. `loading.tsx` present.

## Wishlist Page

`(sub)/profile/wishlist/page.tsx` — wishlist listing:

- `components/mobile/WishlistMovieList.tsx` — wishlist movie grid
- `components/mobile/WishlistCard.tsx` — individual wishlist movie card with heart toggle
- `components/mobile/EmptyState.tsx` — empty state when wishlist is empty
- `components/desktop/WishlistContent.tsx` — stub (returns null)

Uses `WishlistProvider` from `features/wishlist/context.tsx` at root layout. `loading.tsx` present.

## Cinema & Showtime Page

`(sub)/booking/[slug]/cinema/page.tsx` resolves movie by slug from `ALL_MOVIES`, composes mobile components directly:

- `components/mobile/StepBar.tsx` — 5-step booking progress bar (SELECT CINEMA → SELECT SEATS → FOOD & DRINKS → CONTACT INFO → PAYMENT)
- `components/mobile/MovieSummary.tsx` — mini poster + movie info (duration, genre, ageRating, rating)
- `components/mobile/SearchBar.tsx` — cinema/location search input
- `components/mobile/CinemaList.tsx` — list wrapper + empty state (cinema cards rendered inline)
- `components/mobile/BottomBar.tsx` — sticky bottom bar with selection summary + "SELECT SEATS" CTA → links to `/booking/[slug]/seats`
- `components/desktop/CinemaContent.tsx` — stub (returns null)

Sub layout provides back button (→ movie detail) + "Cinema & Showtime" title. State managed via `CinemaSelectionContext`.

## Seat Selection Page

`(sub)/booking/[slug]/seats/page.tsx` resolves movie by slug, composes mobile components:

- `components/mobile/StepBar.tsx` — step=2
- `components/mobile/CountdownBanner.tsx` — 5m59s countdown timer
- Seat map rendered inline in page (zoom-to-fit via ResizeObserver + CSS `zoom`). Screen rendered as curved SVG arc. Max 8 seats enforced via `MAX_SEATS_PER_BOOKING`.
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
  - `DetailRow.tsx` — same structure as success; both import the shared `booking/components/mobile/DetailRow.tsx`
  - `FailedOrderCard.tsx` — same layout as success TicketCard but with red border, error code pill, no QR section
  - `FailActions.tsx` — retry/home/help action buttons, reads `mounted` from `useStatus()`

- `StatusContext.tsx` (`features/booking/contexts/StatusContext.tsx`) — shared between success + fail pages. Provides `slug`, `transactionId`, `reason`, `movie`, `mounted`. Each page's `page.tsx` wraps with `<StatusProvider allMovies={allMovies}>`.

## Shared Booking Components

`booking/components/mobile/` (shared across all booking steps):

- `StepBar.tsx` — 5-step booking progress bar, reads `BOOKING_STEPS`, highlights current step
- `CountdownBanner.tsx` — 5m59s countdown timer, reads from BookingContext (only visible after first seat selection)
- `DetailRow.tsx` — reusable label/value row with icon, used in ticket cards

## Framework / Toolchain Quirks

- **Proxy convention**: Next 16 renamed `middleware.ts` → **`src/proxy.ts`** (exported `proxy()` function). A leftover `middleware.ts` is deprecated and **silently ignored at build time**. `proxy` runs on the Node.js runtime only.
- **React Compiler OFF** (`reactCompiler: false`); the `babel-plugin-react-compiler` devDep was removed.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. Use `@import "tailwindcss"` syntax. No JS config file. Custom `@utility scrollbar-hide` in `global.css`. Custom animations: `animate-fade-in` (fadeSlideIn keyframe), `animate-expand`.
- **Brand theme**: CSS custom properties in `global.css` (gold/black). Access via `var(--color-*)`. Spacing via `var(--space-*)`. Radius via `var(--radius-*)`. Shadows via `var(--shadow-*)`.
- **Tailwind + CSS variables**: Use `bg-(--color-gold)`, `text-(--color-text-muted)`, `shadow-(--shadow-card)`, `border-(--color-border)` syntax (88+ instances across codebase). Inline `style={}` only for dynamic/computed values — static styling always uses Tailwind utility classes.
- **Icons**: `lucide-react`.
- **QR codes**: `qrcode.react` (QRCodeSVG component) for ticket detail page.
- **Navigation**: `<Link>` (not `<a>`); active route via `usePathname()`. URL search params via `useSearchParams()` from `next/navigation`.
- **`"use client"`** required at top of every file using hooks or browser APIs.
- **Loading states**: Every route has a `loading.tsx` file for streaming Suspense loading states.
- **Home page** (`(main)/home/page.tsx`) is a **server component** that fetches all data via API layer (`features/movies/api.ts`, `features/booking/api.ts`) and passes as props to mobile/desktop components. Sub-components under `home/components/{mobile,desktop}/`. MovieRow has `status` prop for "See All" navigation to movies page.
- **Movies page** (`(main)/movies/page.tsx`) — **server component**: reads the `searchParams` prop server-side, derives `initialTab`/`initialFilters` with the helpers in `features/movies/url.ts` (`readTabFromParams`, `readFiltersFromParams`, `writeParamsFromState`), fetches `getMovies()` for both tabs, and passes everything as props into `<MovieListProvider>`. The provider no longer calls `useSearchParams()` — no `<Suspense>` boundary needed and the URL state is fully server-rendered. Components: Tabs, SearchBar, FilterPanel, MovieGrid. Desktop stub in `components/desktop/MovieGrid` (returns null).
- **Component split pattern**: Pages that render both mobile & desktop content in the same file use `block md:hidden` / `hidden md:block` (e.g. home, movies). Layout-level switching is handled by `LayoutProvider` via `matchMedia`. Each page has `components/{mobile,desktop}/` dirs. Shared components go in `components/shared/`. See `(main)/home/` as canonical example.
- **Sub layout `getSubTitle()`**: Uses i18n keys via `translate()` — `t("notif.title")`, `t("tickets.detail_title")`, `t("tickets.transfer.title")`, `t("tickets.transfer.confirm_title")`, `t("tickets.cancel.title")`, `t("booking.cinema.title")`, `t("booking.seats.title")`, `t("booking.snack.title")`, `t("booking.credentials.title")`, `t("booking.payment.title")`, `t("booking.status.success.title")`, `t("booking.status.failed.title")`, `t("profile.edit_profile")`, `t("profile.change_password")`, `t("profile.review_rating")`, `t("profile.wishlist_label")`. Routing prefix `/profile` → back to `/profile`. Extracted to `src/layouts/sub/utils.ts`.
- **Sub layout `getBackHref()`**: Determines back-button target — `transfer/confirm` → `transfer`, `transfer` → ticket detail, `/tickets/[id]/cancel` → `/tickets/[id]`, `/tickets/[id]` → `/tickets`, otherwise `null` (uses `router.back()`). Also in `src/layouts/sub/utils.ts`.
- `postcss.config.mjs` only has `@tailwindcss/postcss` plugin.
- Prettier: `.prettierrc` (`printWidth: 100`, double quotes, trailing commas) + `.prettierignore`; `pnpm format` / `pnpm format:check`. No CI/CD workflows.

## Movies Page Deep Linking

URL scheme for movies page with query params:

```
/movies?status=now_showing
/movies?status=coming_soon&genres=Action,Drama&rating=4.5+&format=IMAX&ageRating=R
```

| Param       | Values                                | Default       |
| ----------- | ------------------------------------- | ------------- |
| `status`    | `now_showing`, `coming_soon`          | `now_showing` |
| `genres`    | Comma-separated (e.g. `Action,Drama`) | empty         |
| `rating`    | `4.5+`, `4.0+`, `3.5+`                | empty         |
| `format`    | `2D`, `IMAX`, `4DX`                   | empty         |
| `ageRating` | `P`, `PG-13`, `R`, `NC-17`            | empty         |

Home page "See All" / "Explore All" buttons link to movies page with appropriate `status` param.

URL → state is applied **once, server-side at render** (via `features/movies/url.ts`); the provider then drives the URL itself with `router.replace` on tab/filter changes. Browser back/forward does not re-apply URL state to the already-mounted provider.

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

## Server Actions Convention

- **`api.ts`** = queries only (GET requests via `apiFetch`). No `"use server"` directive.
- **`action.ts`** = mutations (POST/PATCH/DELETE via `apiMutation`) as `"use server"` server actions.
- Actions return discriminated unions: `{ success: true, data } | { success: false, error, status? }`.
- Actions accept `(prevState, data)` as params — compatible with `useActionState` pattern.
- Auth actions (`features/auth/action.ts`) read/write cookies via `cookies()` from `next/headers` and `apiMutation`'s `cookie`/`raw` params.
- Consumer components (LoginForm, RegisterForm, ProfileMenu) call server actions directly, then update auth state via `useAuth().setAuth()` or `useAuth().clearAuth()`.

## API Layer

`src/libs/api.ts` exports two functions:

- **`apiFetch<T>(path, options?, token?, cookie?)`** — GET queries. Sends `credentials: "include"` by default — this forwards cookies **in the browser only**; during server rendering it does nothing. Server components fetching user-scoped data MUST pass `await getRequestCookie()` as the 4th arg (sets the `Cookie` header), e.g. `getTicketById(id, await getRequestCookie())`.
- **`apiMutation<T>(path, options, token?, cookie?, raw?)`** — POST/PATCH/DELETE mutations. `method` required. `cookie` param forwards Cookie header. `raw: true` returns `Response` (for reading `Set-Cookie` headers in auth actions). No credentials by default.

`src/libs/session.ts` (server-only, imported by server components/layouts):

- **`getRequestCookie()`** — returns the full incoming Cookie header (or `undefined` when empty) for passing into `apiFetch`/`apiMutation`.
- **`requireAuth(returnUrl?)`** — redirects to `/login` (with `returnUrl` when the caller knows its path) unless a `refreshToken` cookie is present.

## Form Validation

- **Zod** (`zod` v4) for all form validation schemas.
- Shared validators in `src/libs/zod.ts` (`isValidPhone`, password regex patterns).
- Feature-specific schemas in `features/*/schema.ts` as factory functions that accept `translate` for i18n error messages.
- Pattern: `createSchema(t: (key: string) => string)` → returns `z.object(...)`.
- Forms use `schema.safeParse(data)` → `result.error.flatten().fieldErrors` for error display.
- `touched` state + `showErrors = touched && !isValid` pattern is consistent across all forms.
- Schemas wrapped in `useMemo(() => createSchema(translate), [translate])` to avoid re-creation on every render.
- Existing schemas: `features/auth/schema.ts` (`createLoginSchema`, `createRegisterSchema`), `features/booking/schema.ts` (`createContactSchema`), `features/profile/schema.ts` (`createProfileSchema`, `createPasswordSchema`).

---

## Production Readiness — PENDING

> **Audit: 2026-10-03** — ticks reflect actual code state (21/34).
> Tags: `[now]` = do now, low effort · `[blocked]` = waiting on backend modules · `[before deploy]` = before deploy/demo · `[prod only]` = real production only

### Level 1 — Foundation

- [x] Next.js 16.2.9 + React 19.2.4 App Router
- [x] TypeScript strict (`"strict": true` in tsconfig)
- [x] ESLint flat config (next/core-web-vitals + typescript)
- [x] Production build + lint pass
- [x] Prettier — `.prettierrc` + `.prettierignore` + `pnpm format`; whole codebase formatted
- [x] Environment documentation — `.env.example` added; README documents `BACKEND_URL`/`API_PREFIX` (evaluated at build time)
- [x] README accuracy — stale `features/auth/api.ts` reference fixed; env + test sections added
- [x] Unused dev tooling — `babel-plugin-react-compiler` removed (`reactCompiler: false` unchanged)
- [ ] Mock data — 9 mock files, 5 "replace with real fetch when backend is ready" TODOs `[blocked]`

### Level 2 — Security

- [x] Access token RAM-only; refresh token httpOnly + Secure + SameSite=Strict cookie
- [x] Open redirect sanitized (`getSafeReturnUrl` rejects `//`, `/\`, `/login` loops)
- [x] No XSS sinks (0 `dangerouslySetInnerHTML`, 0 `eval`, 0 raw `<img>`)
- [x] Layered route guards (`proxy.ts` → `requireAuth()` → `ProtectedRoute` → cookie forward)
- [x] `next/image` host allowlist (11 explicit hosts, no wildcards)
- [x] Session/401 handling — client: `UNAUTHORIZED_EVENT` in `libs/api.ts` → `AuthContext` clears state + redirects to login (excludes `/auth/*`); server: `redirectIfUnauthorized()` in `libs/session.ts` (call it on `apiFetch` results when the mocked user-scoped wrappers go live)
- [ ] Security headers — no CSP/HSTS/X-Frame-Options/Referrer-Policy `[before deploy]`
- [ ] Reviews action passes raw `accessToken` as an argument — only place the token crosses the wire; prefer cookie `[now]`
- [ ] `allowedDevOrigins` hardcodes LAN IPs — dev-only, harmless in production `[before deploy]`

### Level 3 — Reliability

- [x] 404 page (root `not-found.tsx` + in-component `MovieNotFound`)
- [x] Loading states — 25 `loading.tsx` skeletons built on `components/ui/Skeleton.tsx`
- [x] API layer never rejects — `apiFetch` returns a discriminated union; actions return `{ success }` unions
- [x] Error boundaries — root `error.tsx` (shared `components/shared/RouteError.tsx`) + per-group `error.tsx` in all 4 route groups + `global-error.tsx`
- [x] Unhandled rejections — all 3 `.then()` chains now have `.catch()` (movies context surfaces `fetchFailure`, RecipientInput clears results, ShowtimeDataLoader shows error + retry instead of hanging skeleton)
- [x] Silent failure — `AuthContext` session-restore failure logged via `console.warn`

### Level 4 — Operations

- [x] Console cleanliness (3 `console.warn`, 0 `console.log` in `src/`)
- [ ] Deploy config — no `output: "standalone"`, no Dockerfile/vercel.json `[before deploy]`
- [ ] CI/CD — no `.github/` workflows `[before deploy]`
- [ ] Build-time env — `next.config.ts` `rewrites()` evaluates `BACKEND_URL` at build time; undocumented `[before deploy]`
- [ ] SEO — single root metadata, 0 `generateMetadata`, no `metadataBase`/OpenGraph `[before deploy]`
- [ ] Font loading — no `next/font` (Inter falls back to system font, CLS risk) `[before deploy]`
- [ ] Monitoring / analytics `[prod only]`

### Tests

- [ ] Unit tests — 0 test files, no test runner; `tests/{unit,integration,e2e}/` are empty `[before deploy]`
- [ ] E2E tests `[before deploy]`
- [ ] Tests pass in CI `[before deploy]`
