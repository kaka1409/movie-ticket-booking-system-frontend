# [AGENTS.md](http://AGENTS.md)

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
- `(main)/page.tsx` re-exports `./home/page.tsx`.
- **Layout chain**: root layout (`DeviceProvider` → `AuthProvider` → `WishlistProvider`) → each group wraps `LayoutProvider(layout="main"|"auth"|"sub"|"blank")`. Each layout type has its own `index.tsx` that uses `useDevice()` hook (`matchMedia`) to switch between mobile/desktop variants. Protected routes use `ProtectedRoute` wrapper (page-level for `(main)/tickets` and `(main)/profile`, layout-level for `(sub)/`).
- **Layout structure** (`src/layouts/`):
  - `components/` — `Logo.tsx`, `LanguageToggle.tsx` (shared across layouts)
  - `main/` — `index.tsx` (device switch), `mobile/` (MainLayout, Header, BottomNav), `desktop/` (MainLayout, Header, Footer), `types.ts`
  - `sub/` — `index.tsx`, `utils.ts` (getSubTitle), `mobile/` (SubLayout, Header), `desktop/` (SubLayout, Header)
  - `auth/` — `index.tsx`, `mobile/AuthLayout.tsx`, `desktop/AuthLayout.tsx`
  - `blank/` — `index.tsx`, `mobile/BlankLayout.tsx`, `desktop/BlankLayout.tsx`
  - `constants.ts` — LayoutType, Device types (device hook lives in `src/hooks/useDevice.ts`)
- **Shared layout components** (`src/layouts/components/`): `Logo.tsx` (size="sm"|"lg", tagline), `LanguageToggle.tsx` (variant="flag"|"text")
- **Shared UI components** (`src/components/ui/`): `MovieCard.tsx` (reusable movie card), `Skeleton.tsx` (Skeleton, SkeletonCard loaders), `TearLine.tsx` (ticket-style dashed separator with circular cutouts), `FormActions.tsx` (primary + cancel button pair), `Tabs.tsx` (generic tab bar), `Button.tsx` (primary/outline/loadMore variants, loading state), `FormField.tsx` (icon + input + focus/error border), `Badge.tsx` (neutral/dark/gold/success/error pills), `SectionHeader.tsx` (borderLeft/goldBar/uppercase variants), `SearchBar.tsx` (icon + input + clear button), `EmptyState.tsx` (icon + title + description + CTA), `InputField.tsx` (text input with icon), `PasswordField.tsx` (password input with Eye/EyeOff toggle), `Logo.tsx` (brand logo), `TermsCheckbox.tsx` (checkbox with terms/privacy links), `ExpandableText.tsx` (review body with Show more/less past 160 chars)
- **Shared hooks** (`src/hooks/`): `useDevice.ts` — returns `"mobile" | "desktop"` via `matchMedia("(min-width: 740px)")`, kept in sync with `--breakpoint-md: 740px` in `styles/global.css` (not the Tailwind default 768px) so the JS device switch and every `md:` page split change variant on the same pixel — iPad mini portrait (744px) renders desktop. Known gap: most desktop page bodies are still null stubs, so tablet-portrait visitors get desktop chrome with empty bodies until those are built (backlog); `useMounted.ts` — flips to `true` shortly after mount (booking status page entry animations); `useAppendReveal.ts` — paginated-list reveal (grow → scroll first new card into view + animation threshold; `swapKey` change = list replaced, no scroll); `useDebouncedValue.ts` — returns a value once it stops changing for `delayMs` (default 300 ms)
- **Redux Toolkit**: store wired at `src/store/index.ts` — `reducer: {}` (unused; reserved for future global state, e.g. notifications badge).
- **i18n**: `useLocale()` from `LocaleContext` via `useSyncExternalStore`. Returns `{ locale, setLocale, translate }`. Persists to `localStorage("locale")`. Translations at `src/locales/{en,vn}.json`. Throws if used outside `LocaleProvider`.
- `@/` alias → `src/` in `tsconfig.json`.
- Error pages: `src/app/error.tsx` (root, uses shared `components/shared/RouteError.tsx`), `src/app/global-error.tsx`, per-group `error.tsx` in `(main)`, `(blank)`, `(sub)`, `(auth)`; 404 at `src/app/not-found.tsx`.
- **All API calls on server**: Every `page.tsx` is a server component that fetches data via `await` — except `tickets/[id]/cancel/page.tsx`, a client state machine by design. Client components (`"use client"`) receive data via props only — no `useEffect` + API call pattern — except request-keyed refetches (movies list, home QuickBooking dates/slots) that re-run when their key (filters/locale, movie/date) changes. Protected pages are wrapped with `<ProtectedRoute>` client component for auth gating. **Exception**: the seat-hold lifecycle (`GET`/`PUT`/`DELETE /seat-holds`) runs client-side in `features/booking/hooks/useSeatHolds.ts` — the access token lives in RAM, so the Bearer header is attached in the browser and the token never reaches the Next.js server.

## State Management

- `src/contexts/` holds cross-cutting contexts: `DeviceContext.tsx` (server UA-guessed `initialDevice` so first paint skips the mobile→desktop flash), `LocaleContext.tsx`, `AuthContext.tsx`. AuthContext provides `{ user, token, isAuthenticated, isLoading, setAuth, clearAuth, updateUser }` — state only, no API actions. Feature-specific contexts live in `src/features/*/context.tsx`.
- **Movies page**: React Context (`src/features/movies/context.tsx`) with URL sync via `router.replace` (initial tab/query/filters seeded server-side, no `useSearchParams`). State: `activeTab`, `query`, `filtersOpen`, `filters`, `appliedFilters`, `visibleCount`. URL-synced params: `status`, `q`, `genres`, `rating`, `format`, `ageRating`. Non-URL state: `filtersOpen`, `visibleCount`, `filters.releaseDate`, `filters.length`.
- **Tickets listing**: server-side URL pager — `(main)/tickets/page.tsx` reads `?tab=upcoming|past&page=N`, fetches only the visible tab (`getUpcomingTickets`/`getPastTickets`), renders `Tabs` + `Pager` (`components/mobile/Pager.tsx`: prev/next + 5 windowed numbers, hidden on a single page). No listing context, no client slicing; desktop `TicketsContent` is a null stub.
- **Booking flow**: central `useReducer` draft — `BookingProvider` (`src/features/booking/context.tsx`) wraps all booking steps at `booking/[slug]/layout.tsx` and holds one `BookingState` (cinema slice incl. `cinemaQuery`, seat selection + live `seatGrid`/`maxSeats`, snack arrays, contact, `paymentMethodId` + `paymentMethod`, countdown, `holdExpiresAt`) driven by the typed `bookingReducer` in `src/features/booking/reducer.ts` (`SET_CINEMA`/`SET_CINEMA_QUERY`/`SET_CINEMA_DATE`/`CLEAR_CINEMA_SLOT`/`ADOPT_MOVIE`/`ADOPT_SEAT_GRID`/`SET_SEAT_GRID`/`SELECT_HOLD_CELLS`/`CLEAR_SEAT_SELECTION`/`TOGGLE_SEAT`/`SET_SNACKS`/`SET_CONTACT`/`SET_PAYMENT`/`SET_HOLD`/`START_COUNTDOWN`/`EXPIRE_SESSION`/`RESET`). The context setters (`setCinema`, `setCinemaQuery`, `toggleSeat`, `setSnacks`, `setCredentials`, `setPayment`, `startCountdown`, `expireSession`, …) are thin dispatch wrappers so consumers stay prop-stable. One 10-minute session starts at the first seats-step CTA (`START_COUNTDOWN` no-ops afterwards — re-presses never extend it) and persists across refreshes via `sessionStorage("booking:countdownStart")`; `EXPIRE_SESSION` (fired by `SessionExpiryWatcher`) drops the clock so a re-pick + CTA starts a new session. Derived values (`total`, `ticketCount`, `ticketPrice`, `snackTotal`, `seatType`) are computed in the value memo — never stored in state; `selectedSeats` is derived inside the reducer from `seatGrid`. `resetBooking()` (dispatch `RESET`) runs from `PaidBookingReset`.
- **Wishlist**: React Context (`src/features/wishlist/context.tsx`) — `WishlistProvider` at root layout, `useWishlist()` hook. `toggleWishlist(id, feedback?)` is the single choke point for every heart: optimistic local toggle + BE sync when logged in (rollback on real failures) + toast feedback; logged-out picks mirror to `localStorage("wishlist")` and restore on mount (two-pass effect with `eslint-disable`, no hydration mismatch since storage has no server equivalent).
- **Toast**: `ToastContext.tsx` (`ToastProvider` outermost in root layout, `useToast().notify(message, { variant, durationMs? })` — success/error/info, max 3 stacked, 3 s auto-dismiss, click to close) + `components/ui/ToastViewport.tsx` (fixed stack, `aria-live="polite"`). Use for simple notifications; keep dedicated snackbars when an action button is needed (wishlist Undo).
- **Booking step data flow** — no step-level contexts (`src/features/booking/contexts/` was removed): server pages fetch catalogs and pass them as props, step state lives in the booking reducer, and components read `useBooking()` plus pure helpers in `features/booking/utils/`:
  - **Cinema step** — `CinemaAdopt` (effect-only component mounted once by the page) adopts the server-resolved URL selection into the draft (URL params win over the saved draft; a URL date that differs clears the stale selection) plus the slim `BookingMovie` snapshot. That snapshot is the step's only `GET /movies/:slug` fetch: credentials/payment read `movie` from `useBooking()` instead of refetching, guarded by `RequireDraft`. Handlers sit where the data is: `CinemaList` toggles slots through `resolveSlotSelection`, `DatePickerWrapper` dispatches `setCinemaDate` + `router.replace`, `SearchBar`/`BottomBar` read and write the draft directly. No mirror effect, so UI and draft cannot diverge.
  - **Seats step** — the grid lives in the reducer as `seatGrid`; `SeatMapWrapper` adopts the server map (`ADOPT_SEAT_GRID` re-marks the draft's saved seats) and renders `seatGrid ?? restoreSelectedSeats(initialRows, selectedSeats)` so first paint never flashes an empty map. `TOGGLE_SEAT` is one pure transition (sweetbox pair toggle, cap counts CHAIRS via `seatIds.length`, derives `selectedSeats`) and never starts the countdown. Sweetbox cells share one label (`I(1-2)`) for 2 chairs. `?showtimeId=` deep links sync into the draft from `SeatMapWrapper`; the hold network side lives in `hooks/useSeatHolds.ts` (restore/release/expiry only).
  - **Snack step** — the selected `combos[]`/`foods[]` arrays in the draft are the single source of truth (back-navigation restore and zeroing come for free); steppers upsert through `withItemQty()` → `setSnacks`. No qty records, no sync effects.
  - **Status pages** — no context: each `page.tsx` derives `transactionId`/`reason` server-side (URL param → fetched-booking fallback) and passes `movie`/`booking`/`reason`/`transactionId` as props; entry animations use the shared `useMounted()` hook (`src/hooks/useMounted.ts`); `PaidBookingReset` (effect-only) dispatches `resetBooking()` once the fetched booking is `paid`.
- **Other pages**: Local `useState` or no state needed.

## Feature Scaffolding

- `src/features/movies/` — `mock.tsx` (NOW_SHOWING, COMING_SOON, ALL_MOVIES — module-internal), `constants.ts` (GENRES, AGE_RATINGS, RELEASE_OPTIONS, RATING_OPTIONS, LENGTH_OPTIONS, FORMAT_OPTIONS), `types.ts` (Movie, CastMember, FeaturedMovie), `api.ts` (LIVE: `buildMovieQuery`, `getMovies`, `getFeaturedMovies`, `getGenres`/`getFormats`/`getAgeRatings`; MOCK: `getAllMovies`, `getMovieBySlug` — marked with `MOCK` comments, TODO(api) to switch callers to `getMovieDetail`). No hooks — `page.tsx` calls API directly via `await`.
- `src/features/tickets/` — `constants.ts` (TICKET_STATUS, CANCELLATION_FEE), `mock.ts` (MOCK_RECIPIENTS, MOCK_ELIGIBLE_SHOWTIMES + legacy UPCOMING/PAST detail fixtures), `types.ts` (FoodDrinkItem, UpcomingTicket, PastTicket, Recipient, TicketTransfer, SeatTicket, ModificationType, ModificationSeat, EligibleShowtime), `api.ts` (LIVE queries: getUpcomingTickets, getPastTickets, getTicketById; MOCK: findRecipient, searchRecipients, getEligibleShowtimes, cancelTicket — `TODO(api)`), `action.ts` (server actions: createTransfer, cancelTransfer, modifyTicket, cancelTicket — `"use server"`), `adapters.ts` (wire → UI mapping + `TicketPageMeta`), `contexts/` (TransferContext, TicketDetailContext, ModificationContext — no listing context).
- `src/features/notifications/` — `mock.tsx`, `constants.ts`, `types.ts`, `api.ts` (getNotifications).
- `src/features/auth/` — `types.ts` (User, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, RefreshResponse), `action.ts` (server actions: loginAction, registerAction, refreshAction, logoutAction — `"use server"`), `schema.ts` (createLoginSchema, createRegisterSchema — Zod factory functions with i18n).
- `src/features/profile/` — `types.ts` (User interface, UpdateProfileRequest), `action.ts` (updateProfile server action), `mock.ts`.
- `src/features/reviews/` — `mock.ts` (FILTERS with FilterKey), `types.ts` (FilterKey, `MovieReview` + `MyReview`/`MyReviewsResponse` for `/reviews/me`), `api.ts` (`getReviewFilters`, `getReviews`, `getMyReviews`, client-interactive `deleteMyReview`), `action.ts` (movie-detail review server actions), `useMovieReviews.ts` (detail-page review state: paging/mutations), `useReviewHighlight.ts` (shared `#review-<id>` deep-link: scroll + 4 s ring + bounded page hunt), `constants.ts` (`REVIEWS_PAGE_SIZE`, `REVIEW_MAX_LENGTH = 500`).
- `src/features/wishlist/` — no mock (deleted): `types.ts` (`WishlistItem`, `WishlistMovie` — exact BE payload, `WishlistTab`), `api.ts` (LIVE: `getWishlist` + client-interactive `addWishlist`/`removeWishlist` with RAM Bearer, seat-holds precedent), `context.tsx` (WishlistProvider, useWishlist — `toggleWishlist(id, feedback?)` is the single choke point for every heart: optimistic local + BE sync when logged in with rollback + toast; logged-out picks mirror to `localStorage("wishlist")` with mount restore).
- `src/features/booking/` — `types.ts` (SelectedSeat/SelectedCombo/SelectedFood/BookingMovie/BOOKING_STEP_KEYS re-export shared types + wire types: SeatMapCell/SeatMapRow/SeatMapResponse/CurrentSeatHoldResponse/SeatHoldResponse/PaymentMethodOption/BookingStatus/PaymentFailReason/BookingDetail/PayResult), `utils/` domain folder: `seat.ts` (`getSeatLabel` — the single seat-label format everywhere; grid helpers `restoreSelectedSeats`/`selectCellsByIds`/`clearGridSelection`), `cinema.ts` (`findShowtime`/`resolveSlotSelection`/`resolveCinemaAdoption` — step selection + URL adoption), `bookingCard.ts` (`bookingCardData(booking)` — BookingDetail → card props: merged sweetbox seats, snacks, payment-method label, theater/date/bookingRef), `snack.ts` (`withItemQty` stepper upsert), `seatMap.ts` (`adaptSeatMap` — wire GET /seats → SeatGrid `SeatRow[]`: kind mapping, multi-segment cell splitting, price passthrough), `api.ts` (LIVE: `getSeatMap`, `getCombos`, `getFoodItems`, `getFoodCategories`, `getPaymentMethods`, `getSeatHolds`/`putSeatHolds`/`releaseSeatHolds` (client-interactive, Bearer from RAM), `getBookingById`; MOCK out-of-scope: `getSeatRows`, `getSeatPrices`, `getCountdownSeconds` (+ `getCinemas`/`getDates` for ticket-modify only) + `TODO(api)`), `action.ts` (`"use server"`: `createBookingAction`, `payBookingAction` — see Server Actions Convention), `mock.ts` (re-exports `features/shared/mock`), `context.tsx` (BookingProvider, useBooking — thin dispatch wrappers over the reducer), `reducer.ts` (BookingState, BookingAction, bookingReducer, INITIAL_BOOKING_STATE — the seat grid and cinema-step UI state live here too), `hooks/useSeatHolds.ts` (client seat-hold lifecycle: restore/release/early-hold safety; the session end is enforced by `SessionExpiryWatcher`, not the hook), `components/` (`CinemaAdopt`, `PaidBookingReset`, `SessionExpiryWatcher`, `RequireDraft` — effect-only mount helpers/guards).
- `src/hooks/` — `useDevice.ts` (returns `"mobile" | "desktop"` via `matchMedia`), `useMounted.ts` (post-mount flip for staged entry animations), `useAppendReveal.ts` (grow-reveal + scroll for movies/tickets/reviews lists), `useDebouncedValue.ts` (value that settles after `delayMs`)
- `src/libs/utils.ts` has `slugify`, `formatVND`, `formatDate`, `formatRelativeTime`, `getSafeReturnUrl`, `buildLoginUrl`; `src/libs/date.ts` has `formatDateOnly` (local calendar dates); `src/libs/zod.ts` has shared Zod validators (`isValidPhone`, password regex patterns); `src/types/index.ts` has shared types (`Device`, `Movie`, `CastMember`, `FeaturedMovie`). Feature-specific types live in `features/*/types.ts`. Feature-specific Zod schemas live in `features/*/schema.ts`.

## Auth Pages (Login & Register)

Tab-switching auth page — both login and register in a single `AuthPage` component.

- **Login route**: `(auth)/login/page.tsx` — server component, reads `searchParams.returnUrl`, sanitizes with `getSafeReturnUrl()` (from `libs/utils.ts`: must start with a single `/`, rejects `//host`, `/\host` and `/login` loops), renders `<LoginForm returnUrl={...}>` for mobile + desktop
- **Register route**: `(auth)/register/page.tsx` — renders `RegisterForm` for mobile + desktop
- **Auth layout**: `(auth)/layout.tsx` → `LayoutProvider(layout="auth")` → `AuthLayout` (Logo + LanguageToggle header, centered content).
- **LoginForm** (`(auth)/login/components/mobile/LoginForm.tsx`, `"use client"`): `InputField`, `PasswordField`, `Tabs` (login/register switch), `Button`, `Logo`. On success: `setAuth(...)` then `router.push(returnUrl ?? "/")`.
- **RegisterForm** (`(auth)/register/components/mobile/RegisterForm.tsx`): register form, on success → `/login`.
- **Validation**: Zod schemas from `features/auth/schema.ts` — `createLoginSchema(translate)` and `createRegisterSchema(translate)` (factory functions). Pattern: `schema.safeParse()` → `result.error.flatten().fieldErrors` → `touched` + show errors.
- **API calls**: Server actions in `features/auth/action.ts` — `loginAction()`, `registerAction()`, `refreshAction()`, `logoutAction()` (all `"use server"`).
- **Auth context**: `src/contexts/AuthContext.tsx` — `AuthProvider` wraps root layout, `useAuth()` hook provides `{ user, token, isAuthenticated, isLoading, setAuth, clearAuth, updateUser }`. AuthContext is **state-only** — consumer components (LoginForm, RegisterForm, ProfileMenu) call server actions directly, then update state via `setAuth()`/`clearAuth()`. Access token stored in RAM only (React state). Refresh token in HttpOnly cookie (managed by server actions via `cookies()` API). On mount, calls `refreshAction()` to restore session.
- **Error handling**: 401 → "Invalid email or password", 409 → "Email already exists", other → generic server error. Displayed as red alert box below form.
- **CSS conventions**: Uses `bg-(--color-gold)`, `text-(--color-text-muted)`, `border-(--color-border)` parenthesized syntax (NOT `bg-[--color-gold]` bracket syntax).
- **Backend endpoints**:
  - `POST /api/v1/auth/login` — body `{ email, password }` → `{ data: { accessToken, user } }` + Set-Cookie: refreshToken (HttpOnly, Secure, SameSite=Strict, path=/)
  - `POST /api/v1/auth/register` — body `{ fullname, email, password }` → `{ data: { message } }`
  - `POST /api/v1/auth/refresh` — forwards refreshToken cookie → new accessToken + new refreshToken cookie (rotation)
  - `POST /api/v1/auth/logout` — forwards refreshToken cookie → clears refresh token cookie + revokes token in DB

## Protected Route Guards

Protection is layered (outside-in):

1. **Server gate** — `hasSession(): Promise<boolean>` from `src/libs/session`, called at the top of `(sub)/layout.tsx`, `(main)/tickets/page.tsx`, `(main)/profile/page.tsx`. When the `refreshToken` cookie is absent it renders `LoginPrompt` in place of children — no redirect: the visitor stays on the protected URL and the prompt's CTA links to `/login?returnUrl={pathname}` (sanitized again by the login page).

- Page-level gates (`tickets`, `profile`) return before any fetch → nothing leaves the server.
- The layout-level gate (`(sub)/`) swaps only the DOM output: Next 16 still executes the child page segment, so its rows land in the flight `<script>` payload but are never committed to the DOM. With a live backend that cookie-less fetch answers 401 → error union → no protected data enters the payload; during the mock phase only placeholder mock data appears there.

2. `src/components/shared/ProtectedRoute.tsx` — client component, UX layer (handles a cookie that exists but fails `refreshAction()`):

- `isLoading` → skeleton spinner
- `!isAuthenticated` → `LoginPrompt` (icon + "Login Required" + CTA button → `/login?returnUrl={pathname}` via `usePathname()`)
- `isAuthenticated` → render children
- Rendered at page level by `tickets/page.tsx` and `profile/page.tsx`, and at layout level by `(sub)/layout.tsx`

3. **Backend enforcement** — server-side fetches of user-scoped data forward the incoming cookies via `getRequestCookie()` (see API Layer).

- `src/components/shared/LoginPrompt.tsx` — shared prompt UI: returned directly by the server gate, and reused by `ProtectedRoute` for the client-side fallback.
- **Component-level protection**: Movie detail `Reviews.tsx` conditionally renders `WriteReview` — shows login CTA for unauthenticated users, review list remains public

| Route                                                                | Protected?               |
| -------------------------------------------------------------------- | ------------------------ |
| `/`, `/home`, `/movies`, `/movies/:slug`                             | Public                   |
| `/tickets`, `/profile`                                               | Protected (page-level)   |
| `/profile/*`, `/tickets/:id/*`, `/booking/:slug/*`, `/notifications` | Protected (layout-level) |

Known gap: a present-but-revoked `refreshToken` cookie passes `hasSession()`. Handled without ever leaving the URL: client-side a backend 401 dispatches `UNAUTHORIZED_EVENT` (`libs/api.ts` `notifyUnauthorized`, `/auth/*` excluded) → `AuthContext` only clears state and `ProtectedRoute` swaps to the prompt in place; server-side callers check `isUnauthorizedResult(result)` (`libs/session.ts`) on `apiFetch` results and return `<LoginPrompt />` — wired on tickets listing/detail, booking seats/status pages (the stale cookie itself can't be cleared from a server component; the next login overwrites it). Rule: no `redirect()` to `/login` anywhere on the 401 path — a child-segment redirect used to win over the parent layout's prompt and yank the URL, which is exactly the bug this rule prevents.

## Ticket Detail Page

Two-level routing:

- **Listing**: `(main)/tickets/page.tsx` — server URL pager (`?tab=&page=`, one tab fetched per render) inside main layout with BottomNav. Server gate (`hasSession()` → `LoginPrompt`) + `<ProtectedRoute>` client fallback. Mobile renders `Tabs` + `UpcomingTicketList`/`PastTicketList` + `Pager`; desktop `TicketsContent` is a null stub.
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

`(sub)/profile/wishlist/page.tsx` — server component: fetches live `getWishlist(cookie, locale)` (no mock — entries carry the full movie card via `WishlistItem`; failure → local draft fallback), mounts `WishlistHydrate`, then composes:

- `components/mobile/WishlistHydrate.tsx` — effect-only mount adoption of server ids into the draft (booking `CinemaAdopt` pattern)
- `components/mobile/WishlistMovieList.tsx` — count sentence (`count_prefix`/`count_suffix`) on top, search bar (title + genre, debounced) + All/Now Showing/Coming Soon chips (shared `ui/Chip` `variant="outline"`, reviews style) + 2-column grid; filtering is client-side; local-only ids without a BE payload never render; `isBookable` reads `movie.status`
- `components/mobile/WishlistCard.tsx` — compact card with heart toggle (undoable removal via parent snackbar)
- `components/mobile/EmptyState.tsx` — empty state when wishlist is empty
- `components/desktop/WishlistContent.tsx` — stub (returns null)

Uses `WishlistProvider` from `features/wishlist/context.tsx` at root layout. `loading.tsx` present.

## Cinema & Showtime Page

`(sub)/booking/[slug]/cinema/page.tsx` — server component: resolves the movie via live `getMovieDetail(slug)` (the booking flow's **only** movie-detail fetch — `REVALIDATE_MOVIE_DETAIL` = 1 h, adopted into the draft for every later step), date options via `getShowtimeDates(slug)`, and slots via `getShowtimes(slug, date)`, then composes mobile components directly:

- `components/mobile/StepBar.tsx` — 5-step booking progress bar (SELECT CINEMA → SELECT SEATS → FOOD & DRINKS → CONTACT INFO → PAYMENT)
- `components/mobile/MovieSummary.tsx` — mini poster + movie info (duration, genre, ageRating, rating)
- `components/mobile/SearchBar.tsx` — cinema/location search input
- `components/mobile/CinemaList.tsx` — list wrapper + empty state (cinema cards rendered inline)
- `components/mobile/BottomBar.tsx` — sticky bottom bar with selection summary + "SELECT SEATS" CTA → links to `/booking/[slug]/seats`
- `components/desktop/CinemaContent.tsx` — stub (returns null)

Sub layout provides back button (→ movie detail) + "Cinema & Showtime" title. State lives in the booking reducer (`useBooking()`); the page mounts `CinemaAdopt` (URL selection **and** the `BookingMovie` snapshot) and passes `movie`/`cinemas`/`dates` down as props.

## Seat Selection Page

`(sub)/booking/[slug]/seats/page.tsx` — server component: redirects to `/booking/[slug]/cinema` when `?showtimeId=` is missing, otherwise fetches `getSeatMap(showtimeId)` + `getShowtimeById(showtimeId)` in parallel (401 → `redirectIfUnauthorized`), adapts the wire map via `adaptSeatMap`, and composes mobile components:

- `components/mobile/StepBar.tsx` — step=2
- `components/mobile/CountdownBanner.tsx` — session-deadline countdown: shows `countdownStartTime + countdownSeconds` once the session started (hold re-presses never move it), `holdExpiresAt` is only a fallback for a session the tab forgot, static `countdownSeconds` (10:00) pre-CTA. The value derives from the absolute deadline (no setState-in-effect).
- Seat map rendered inline in page (fixed layout, no zoom/pan — `SeatGrid` fits the viewport width). Screen rendered as curved SVG arc. Max seats = `MAX_SEATS_PER_BOOKING` (8), counted in CHAIRS (`seatIds.length`, so a sweetbox pair counts 2).
- `components/mobile/BottomBar.tsx` — sticky bottom bar, selected seats + total (per-cell `price` from the wire — sweetbox cell price is the price of both chairs), "Continue to Snacks" CTA. The CTA is a handler, not a link: it is where the seat hold is finally created (`PUT /seat-holds`), then `setHoldExpiresAt` + `startCountdown` + `router.push('/snack')` on success; `409` → `recoverSeatMap` + inline `booking.seats.hold_taken`; any other failure → inline `booking.seats.hold_failed`. Picking seats writes nothing to the server.
- `components/desktop/SeatContent.tsx` — stub (returns null)

Seat-hold lifecycle — the hold is created **at the seats-step CTA** (`PUT /seat-holds`); re-pressing only re-syncs the hold to the new selection, never the session. The 10-minute session is enforced by `SessionExpiryWatcher` (mounted once in `booking/[slug]/layout.tsx`, so it fires on every step — not just seats):

- CTA (seats `BottomBar`): `PUT /seat-holds` (set-replacement, TTL 600 s) → adopt `expiresAt` as `holdExpiresAt`, `startCountdown()` (first press starts the session, later presses no-op), advance to the snack step. A `409 SEAT_TAKEN` refetches the map via `recoverSeatMap` (`utils/seatMap.ts`) and stays on the step — the taken cells come back `occupied`, the survivors stay selected for a retry.
- Mount: `GET /seat-holds?showtimeId=` restores the caller's live hold (seat ids re-selected, `expiresAt` adopted as `holdExpiresAt`); expired/empty holds are ignored. The session clock itself restores from `sessionStorage`, so a hard refresh keeps the original deadline.
- Selection change: **no network call.** Emptying the selection while a hold is live (`holdExpiresAt !== null`) sends `DELETE /seat-holds?showtimeId=` — the PUT body is `@ArrayNotEmpty` server-side. Abandoned holds are reaped by the backend cleanup cron (1 min).
- Session expiry (1 s interval in `SessionExpiryWatcher` vs the session deadline) → `DELETE /seat-holds` even when the hold TTL is still valid + selection cleared + `expireSession()` (clock reset, draft kept) so a re-pick + CTA starts a new session.
- Hold expiry (1 s interval in `useSeatHolds` vs `holdExpiresAt`) → safety net for the backend dropping a hold early: selection cleared + `holdExpiresAt` nulled.
- Booking summary syncs from `?showtimeId=` when the step is opened directly.

Booking flow navigation:

- Movie detail `BookTicketCTA` → `/booking/[slug]/cinema` (passes `?showtimeId=X` when a showtime slot was picked on the detail page)
- Cinema BottomBar → `/booking/[slug]/seats?showtimeId=...` (active only when cinema+time selected)
- Seats BottomBar → `PUT /seat-holds` (creates the hold + starts the countdown) → `/booking/[slug]/snack`
- Snack BottomBar → `/booking/[slug]/credentials`
- Credentials BottomBar → `/booking/[slug]/payment`
- Payment BottomBar → `createBookingAction` → `payBookingAction` → `/booking/[slug]/status/success?bookingId=...` or `/booking/[slug]/status/failed?bookingId=...&reason=...` (see Payment Page)

## Snack Page

`(sub)/booking/[slug]/snack/page.tsx` — server component, fetches the live catalogs in parallel (`getCombos`, `getFoodItems`, `getFoodCategories` — contract §4.2–4.4), composes mobile components:

- `components/mobile/ComboCard.tsx` — combo card with image (null-safe), name, description, price, quantity stepper
- `components/mobile/FoodItemCard.tsx` — food item card with Next.js `<Image>` (null-safe), name, price, quantity stepper
- `components/mobile/CategorySection.tsx` — category header + food item list
- `components/mobile/Stepper.tsx` — quantity stepper (minus/plus buttons)
- `components/mobile/BottomBar.tsx` — sticky bottom bar, snack total + "Continue" CTA → `/booking/[slug]/credentials`

Section titles (`Quick Combos`, `Pick & Mix`) use `--color-gold-dark`. Prices use `--color-gold-light`. Stepper quantities are derived from the selected arrays in the booking draft — zeroing a stepper updates the totals immediately and back-navigation restores the quantities without any sync effect.

## Credentials Page

`(sub)/booking/[slug]/credentials/page.tsx` — **server component** that fetches nothing (the movie comes from the draft, the contact lives in `BookingProvider`) and wraps its output in `<RequireDraft slug={slug}>` so a cold deep link or hard refresh bounces back to the cinema step instead of rendering an unfillable form:

- Shared state: `ContactForm` syncs its local fields into the booking draft via `setCredentials`; `BottomBar` derives `isValid` from the same draft with `createContactSchema(translate)` — no separate credentials context
- `components/mobile/TextInput.tsx` — reusable text input with label
- `components/mobile/PhoneField.tsx` — phone input with country code selector (CDN flags via `flagcdn.com/w20/{flag}.png`)
- `components/mobile/FieldLabel.tsx` — field label component
- `components/mobile/ContactForm.tsx` — prefill priority: saved BookingContext contact info → logged-in auth user (`fullname`/`email`) → empty
- `components/mobile/OrderSummary.tsx` — takes no props; reads the movie snapshot (`BookingMovie` adopted at the cinema step) plus cinema, room, date/time, seats, seat type, combos, foods and total from BookingContext
- `components/mobile/BottomBar.tsx` — sticky bottom bar, total + "Continue to Payment" CTA → `/booking/[slug]/payment`, derives `isValid` from the booking contact draft

## Payment Page

`(sub)/booking/[slug]/payment/page.tsx` — **server component** that fetches only `getPaymentMethods` (contract §4.5, brand images mapped from `PAYMENT_IMAGES`), wraps its output in `<RequireDraft slug={slug}>` (same draft guard as credentials), and imports components directly (no extra provider):

- Shared state: the selected gateway lives in the booking draft (`paymentMethodId` + `paymentMethod` display name via `setPayment(id, name)`), shared between `PaymentOption` and `BottomBar`. Unlike the old `PaymentContext`, the id persists across back-navigation (a re-entered payment page keeps the radio pre-selected) and is cleared by `resetBooking()`.
- `components/mobile/PaymentOption.tsx` — payment method card with brand image (`public/images/VNPay.png`, `public/images/momo.png` via `next/image`), reads `paymentMethodId`/`setPayment` from `useBooking()` (one dispatch writes both the id and the display name)
- `components/mobile/OrderSummary.tsx` — same as credentials page (no props; movie snapshot + booking details from BookingContext)
- `components/mobile/SecureBadge.tsx` — security badge
- `components/mobile/TermsNote.tsx` — terms & conditions note
- `components/mobile/BottomBar.tsx` — sticky bottom bar. On CTA: `createBookingAction(seats + snacks + contact, RAM token)` → `payBookingAction({ bookingId, method }, token)` → route:
  - `pay.status === "success"` → `/status/success?bookingId=...`
  - `pay` failed → `/status/failed?bookingId=...&reason={PaymentFailReason}` (the BE payment simulator fails 50/50)
  - create `409 SEAT_TAKEN` → `/seats?showtimeId=...` (seats stolen; the restore idle-check keeps survivors)
  - create `409 INVALID_STATE` → `/cinema` (showtime unusable)
  - no selection / no token / no showtime → inline error (`booking.payment.error_missing_selection`) — the payment page never fabricates a booking from mock data
  - Other errors → inline error text from the union

`StepBar current={5}` maps to "PAYMENT" step. The success route also works when `?bookingId=` is absent (direct/mock-era URL) — the cards then fall back to the BookingContext draft.

## Success & Fail Pages

Both pages are plain server components with no `<Suspense>` — nothing client-side reads `useSearchParams()` anymore. White text theme throughout. Each `page.tsx` reads `?bookingId=` (plus `?transactionId=` / `?reason=`) and fetches `getBookingById(bookingId, await getRequestCookie())` when a `bookingId` is present (401 → `redirectIfUnauthorized(result, pathname)`); `getMovieDetail(slug)` runs **only when** `bookingId` **is absent** (direct/mock-era URL — the real flow redirects with a `bookingId`, and its payload already carries the movie). It derives `transactionId` (URL param → `booking.transactionRef` → `booking.id` → `"N/A"`) and `reason` (URL param → `booking.payment.reason`) server-side, passes everything as props, and renders `<PaidBookingReset booking={booking}/>`.

- `(sub)/booking/[slug]/status/success/page.tsx`:
  - `SuccessIcon.tsx` — animated green checkmark; `mounted` from the shared `useMounted()` hook
  - `DetailRow.tsx` — reusable label/value row with `labelClass` prop for alignment
  - `TicketCard.tsx` — takes `{ movie, booking, transactionId }`; prefers the fetched `booking` via `bookingCardData()` (poster/title/ageRating from `booking.showtime.movie` with movie-detail fallback), QR → `/tickets/{booking.id}`, booking ref = `transactionRef`; falls back to the BookingContext draft when no `bookingId`
  - `SuccessActions.tsx` — share/download action buttons; `useMounted()`
- `(sub)/booking/[slug]/status/failed/page.tsx`:
  - `FailedIcon.tsx` — animated red X with shake keyframe; takes the `reason` prop for `FailReason`, `mounted` from `useMounted()`
  - `DetailRow.tsx` — same structure as success; both import the shared `booking/components/mobile/DetailRow.tsx`
  - `FailedOrderCard.tsx` — takes `{ movie, booking, reason }`; same layout as success TicketCard but with red border, error code pill (from `reason`/`booking.payment.reason`), no QR section; same booking-first data source
  - `FailActions.tsx` — retry/home/help action buttons; `useMounted()`
- `PaidBookingReset.tsx` (`features/booking/components/PaidBookingReset.tsx`) — effect-only (renders nothing), mounted by both pages: dispatches `resetBooking()` when the fetched booking status is `paid`, so a paid booking ends the flow and drops the local draft (a still-failed booking keeps its draft for the retry path).

## Shared Booking Components

`booking/components/mobile/` (shared across all booking steps):

- `StepBar.tsx` — 5-step booking progress bar, reads `BOOKING_STEP_KEYS`, highlights current step
- `CountdownBanner.tsx` — session-deadline countdown (session first-CTA + 10 min wins over the hold TTL; static 10:00 pre-CTA or after a lapsed session, ticking once a session starts)
- `DetailRow.tsx` — reusable label/value row with icon, used in ticket cards
- `PriceBreakdown.tsx` — shared seats→snacks→payment/total block used by ticket detail, booking success/failed cards, transfer confirm and both OrderSummary panels

## Framework / Toolchain Quirks

- **Proxy convention**: Next 16 renamed `middleware.ts` → `src/proxy.ts` (exported `proxy()` function). A leftover `middleware.ts` is deprecated and **silently ignored at build time**; `proxy` runs on the Node.js runtime only. The project currently defines no proxy — route protection lives in `hasSession()` gates (see Protected Route Guards).
- **React Compiler OFF** (`reactCompiler: false`); the `babel-plugin-react-compiler` devDep was removed.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. Use `@import "tailwindcss"` syntax. No JS config file. Custom `@utility scrollbar-hide` in `global.css`. Custom animations: `animate-fade-in` (fadeSlideIn keyframe), `animate-expand`.
- **Brand theme**: CSS custom properties in `global.css` (gold/black). Access via `var(--color-*)`. Spacing via `var(--space-*)`. Radius via `var(--radius-*)`. Shadows via `var(--shadow-*)`.
- **Tailwind + CSS variables**: Use `bg-(--color-gold)`, `text-(--color-text-muted)`, `shadow-(--shadow-card)`, `border-(--color-border)` syntax (88+ instances across codebase). Inline `style={}` only for dynamic/computed values — static styling always uses Tailwind utility classes.
- **Icons**: `lucide-react`.
- **QR codes**: `qrcode.react` (QRCodeSVG component) for ticket detail page.
- **Navigation**: `<Link>` (not `<a>`); active route via `usePathname()`. URL search params via `useSearchParams()` from `next/navigation`.
- `"use client"` required at top of every file using hooks or browser APIs.
- **Loading states**: Every route has a `loading.tsx` file for streaming Suspense loading states.
- **Home page** (`(main)/home/page.tsx`) is a **server component** that fetches movies + featured via API layer (`features/movies/api.ts`) and passes them as props to mobile/desktop components. Exception: the QuickBooking widgets (`mobile/QuickBooking.tsx`, `desktop/QuickBookingBar.tsx`) fetch their own dates/slots client-side (they depend on the picked movie — `getShowtimeDates` then `getShowtimes`, lists keyed by movie+locale/movie+date, CTA by exact `showtimeId`); the mobile `SearchBar` is a native GET form to `/movies?q=`. Sub-components under `home/components/{mobile,desktop}/`. MovieRow has `status` prop for "See All" navigation to movies page.
- **Movie detail showtimes**: `ShowtimesProvider` takes `datesAvailable` (dates API answered, even with zero days). When the movie genuinely has no showtime days (`dates` empty + available), mobile/desktop render no date strip at all — just the `movies.detail.no_showtimes` empty state. The local fallback chips (`buildFallbackDateChips`) stay for dates-API failures only, and `?date=` deep links skip their fetch when no days exist.
- **Movies page** (`(main)/movies/page.tsx`) — **server component**: reads the `searchParams` prop server-side, derives `initialTab`/`initialFilters` with the helpers in `features/movies/url.ts` (`readTabFromParams`, `readFiltersFromParams`, `writeParamsFromState`), fetches `getMovies()` for both tabs, and passes everything as props into `<MovieListProvider>`. The provider no longer calls `useSearchParams()` — no `<Suspense>` boundary needed and the URL state is fully server-rendered. Components: Tabs, SearchBar, FilterPanel, MovieGrid. Desktop stub in `components/desktop/MovieGrid` (returns null).
- **Component split pattern**: Pages that render both mobile & desktop content in the same file use `block md:hidden` / `hidden md:block` (e.g. home, movies). Layout-level switching is handled by `LayoutProvider` via `matchMedia`. Each page has `components/{mobile,desktop}/` dirs. Shared components go in `components/shared/`. See `(main)/home/` as canonical example.
- **Sub layout** `getSubTitle()`: Uses i18n keys via `translate()` — `t("notif.title")`, `t("tickets.detail_title")`, `t("tickets.transfer.title")`, `t("tickets.transfer.confirm_title")`, `t("tickets.cancel.title")`, `t("booking.cinema.title")`, `t("booking.seats.title")`, `t("booking.snack.title")`, `t("booking.credentials.title")`, `t("booking.payment.title")`, `t("booking.status.success.title")`, `t("booking.status.failed.title")`, `t("profile.edit_profile")`, `t("profile.change_password")`, `t("profile.review_rating")`, `t("profile.wishlist_label")`. Routing prefix `/profile` → back to `/profile`. Extracted to `src/layouts/sub/utils.ts`.
- **Sub layout** `getBackHref()`: Determines back-button target — `transfer/confirm` → `transfer`, `transfer` → ticket detail, `/tickets/[id]/cancel` → `/tickets/[id]`, `/tickets/[id]` → `/tickets`, otherwise `null` (uses `router.back()`). Also in `src/layouts/sub/utils.ts`.
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
- Never shadow browser globals (`window`, `document`) — pick a descriptive name (`releaseWindow`, not `window`).
- Exported functions, components and types get English `/** JSDoc */`; non-obvious logic gets a short WHY comment. Never leave commented-out dead code in files.
- State flags are `is*`/`setIs*` (`isLoading`, `isAuthenticated`); simple adjective flags for local display state are acceptable (`mounted`, `expired`).
- Helper placement: calendar-date math → `libs/date.ts` (`formatDateOnly`); shared pure helpers → `libs/utils.ts` (`buildLoginUrl`, `formatVND`); feature helpers → `features/*/utils.ts` (or a domain-split `utils/` folder when a feature outgrows one file — booking: `getSeatLabel` in `utils/seat.ts`).
- Mock vs live: every API function is marked at its definition (`MOCK`/`LIVE` comment or section-level `TODO(api)` marker). The booking flow itself is fully LIVE (seat map, holds, catalogs, create/pay, booking detail); remaining booking mocks (`getSeatRows`, `getSeatPrices`, `getCountdownSeconds`, plus `getCinemas`/`getDates` for ticket-modify only) — do not "just wire it live" without checking the payload.
- Repeated markup goes to a shared component: `booking/components/mobile/PriceBreakdown.tsx` (seats/snacks/total), `(main)/tickets/components/mobile/TicketList.tsx` (upcoming/past list).
- Filter components (FilterCheckRow, FilterLabel) are internal to movies page `components/mobile/`; the chip itself is shared at `components/ui/Chip.tsx` (movies filter panel + wishlist status tabs).
- All cinema data uses **PrimeSeat** brand — Vietnamese addresses, km-based distances, 24h time format.
- Inline `style={}` props are used for dynamic/computed values (gradients, animation delays, computed widths, aspect ratios). Static styling always uses Tailwind utility classes with CSS custom property syntax.
- Payment method logos use `next/image` (`public/images/VNPay.png`, `public/images/momo.png`).
- Pages using `useSearchParams()` must wrap content in `<Suspense>` to avoid 404 during SSR.

## Server Actions Convention

- `api.ts` = queries only (GET requests via `apiFetch`). No `"use server"` directive.
- `action.ts` = mutations (POST/PATCH/PUT/DELETE via `apiMutation`) as `"use server"` server actions.
- Actions return discriminated unions: `{ success: true, data } | { success: false, error, status? }` — plus the booking-specific `BookingActionResult` with server-normalized error arms.
- Two param shapes: `useActionState` style `(prevState, data)` (auth, profile) and explicit `(input, token)` (reviews, booking `action.ts`) — the RAM access token is passed as a server-action argument because server actions cannot read React state.
- Auth actions (`features/auth/action.ts`) read/write cookies via `cookies()` from `next/headers` and `apiMutation`'s `cookie`/`raw` params.
- Consumer components (LoginForm, RegisterForm, ProfileMenu) call server actions directly, then update auth state via `useAuth().setAuth()` or `useAuth().clearAuth()`.
- Booking actions never throw: `createBookingAction` / `payBookingAction` catch transport failures and return the union's `{ success: false, ... }` arm.

## API Layer

`src/libs/api.ts` exports two functions:

- `apiFetch<T>(path, options?, token?, cookie?)` — GET queries. Sends `credentials: "include"` by default — this forwards cookies **in the browser only**; during server rendering it does nothing. Server components fetching user-scoped data MUST pass `await getRequestCookie()` as the 4th arg (sets the `Cookie` header), e.g. `getBookingById(bookingId, await getRequestCookie())`.
- `apiMutation<T>(path, options, token?, cookie?, raw?)` — POST/PATCH/PUT/DELETE mutations. `method` required. `cookie` param forwards Cookie header. `raw: true` returns `Response` (for reading `Set-Cookie` headers in auth actions). No credentials by default.
- The three seat-hold functions in `features/booking/api.ts` are the exception that calls `apiMutation`/`apiFetch` **from the browser with a Bearer token** (RAM-only access token). `apiMutation` throws on failure, so the hold wrappers convert throws into the `{ error }` union arm via `toErrorUnion` — the context only ever consumes unions.

`src/libs/session.ts` (server-only, imported by server components/layouts):

- `getRequestCookie()` — returns the full incoming Cookie header (or `undefined` when empty) for passing into `apiFetch`/`apiMutation`.
- `getRequestLocale()` — reads the `locale` cookie (`en|vn`, default `en`) for catalog fetches. Server components cannot read localStorage, so this cookie is the only SSR-safe locale source.
- `hasSession()` — returns `true` when a `refreshToken` cookie is present (server-side counterpart of `isAuthenticated`); protected layouts/pages render `LoginPrompt` instead of children when it returns `false`.

## Catalog Localization (`?lang=`)

- SSR locale resolution (no flash): the root layout resolves `initialLocale` server-side — saved `locale` cookie first, then `Accept-Language` (`vi*` → VN), EN fallback — and passes it to `LocaleProvider`. `getServerSnapshot` returns that value, so the SSR HTML already carries the visitor's language; the client snapshot reads the cookie first (the same source the server used) so hydration matches exactly. New vi-browser visitors see VN on the very first paint; returning users never see an EN→VN swap. This opts the app out of static prerendering — already the case for every catalog page — while the fetch cache keeps backend load flat.
- Localized backend endpoints (movies, genres/formats/age-ratings, showtime dates, combos, food, payment methods, review filters) take `?lang=en|vn` via the `withLang(path, locale)` helper in `libs/api.ts`. Feature fetchers accept a trailing `locale` param (default `"en"`); server pages pass `await getRequestLocale()`, client contexts pass `useLocale()`.
- Reading the locale cookie forces per-request rendering (ISR HTML would serve one locale to everyone); the 60s fetch cache still shields the backend because the cache key includes the `?lang=` URL. Build-time `generateStaticParams`/`generateMetadata` stay on the EN default.
- The `genres` filter accepts canonical or Vietnamese names in both locales (backend matches `name` OR `nameVi`).
- Formatters are locale-explicit: `formatVND(amount, locale)`, `formatDate(iso, locale)`, `formatTicketDatetime(date, time, locale)` (24h clock both locales). Durations render as minutes (`{duration} {translate("common.min")}`), never `Xh Ym`. Date chips use `toShowtimeDateChips(records, locale)`; today's chip shows `translate("common.today")`, never a hardcoded `"TODAY"`.
- Review-filter and release/length filter labels render from i18n keys by stable token (`reviews.filters.<key>`, `movies.filter_release.<token>`, `movies.filter_length.*`), never from the backend `label` payload. Payment display is `Via/Qua + brand` (branch gateway logic on the method id, never on the localized label).
- Locale switching is two pipelines: `setLocale` (`contexts/LocaleContext.tsx`) flips static keys instantly via the `localechange` event, then calls `router.refresh()` so server segments refetch catalog data with the new cookie — client state (booking draft, countdown, scroll) is preserved, no reload. New `?lang=` URLs miss the fetch cache once, then cache per locale. Islands need no remount: movies auto-refetches (locale in queryKey), showtime chips derive from the `dates` prop + locale, review bodies are user content (never localized).

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
- [ ] Mock data — mock files under `features/*/mock*`; live vs mock split marked at each function. Booking flow fully LIVE; wishlist fully LIVE (no mock file); home QuickBooking widgets fully LIVE (dates/slots from showtimes API, CTA by `showtimeId`); remaining mocks: tickets, notifications, booking `getSeatRows`/`getSeatPrices`/`getCountdownSeconds` + `getCinemas`/`getDates` (ticket-modify only). File-level `TODO(api)` markers: `notifications/api.ts`, `tickets/api.ts`, `booking/api.ts` `[blocked]`

### Level 2 — Security

- [x] Access token RAM-only; refresh token httpOnly + Secure + SameSite=Strict cookie
- [x] Open redirect sanitized (`getSafeReturnUrl` rejects `//`, `/\`, `/login` loops)
- [x] No XSS sinks (0 `dangerouslySetInnerHTML`, 0 `eval`, 0 raw `<img>`)
- [x] Layered route guards (`hasSession()` → `ProtectedRoute` → cookie forward)
- [x] `next/image` host allowlist (11 explicit hosts, no wildcards)
- [x] Session/401 handling — client: `UNAUTHORIZED_EVENT` in `libs/api.ts` → `AuthContext` clears state only, `ProtectedRoute` renders the prompt in place (excludes `/auth/*`, no redirect); server: `isUnauthorizedResult()` in `libs/session.ts` → `<LoginPrompt />` in place — wired on tickets listing/detail and booking seats/status pages
- [ ] Security headers — no CSP/HSTS/X-Frame-Options/Referrer-Policy `[before deploy]`
- [ ] Reviews + booking actions pass raw `accessToken` as a server-action argument — the only places the token crosses the wire; prefer cookie `[now]`
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
- [x] SEO — root metadata (`metadataBase`, title template, OG/Twitter, `NEXT_PUBLIC_SITE_URL` in `libs/site.ts`), `generateMetadata` on `movies/[slug]` (canonical, OG), per-page titles, `robots: noindex` on all protected/auth routes, `app/robots.ts` + `app/sitemap.ts`, JSON-LD `Movie` + `AggregateRating` on the detail page. Remaining: locale-aware metadata (titles don't vary by `locale` cookie) and hreflang (not applicable — locale is cookie-based, not URL-based)
- [x] Font loading — `next/font` Inter (self-hosted, `latin`+`latin-ext`+`vietnamese` subsets, `display: swap`) wired to `--font-inter` → `--font-sans` in `global.css`
- [ ] Monitoring / analytics `[prod only]`

### Tests

- [ ] Unit tests — 0 test files, no test runner; `tests/{unit,integration,e2e}/` are empty `[before deploy]`
- [ ] E2E tests `[before deploy]`
- [ ] Tests pass in CI `[before deploy]`
