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
  - `(auth)/` — login, register, forgot-password (placeholder — the BE reset endpoint does not exist yet)
- `(main)/page.tsx` re-exports `./home/page.tsx`.
- **Layout chain**: root layout (`DeviceProvider` → `AuthProvider` → `WishlistProvider`) → each group wraps `LayoutProvider(layout="main"|"auth"|"sub"|"blank")`. Each layout type has its own `index.tsx` that uses `useDevice()` hook (`matchMedia`) to switch between mobile/desktop variants. Protected routes use `ProtectedRoute` wrapper (page-level for `(main)/tickets` and `(main)/profile`, layout-level for `(sub)/`).
- **Layout structure** (`src/layouts/`):
  - `components/` — `Logo.tsx`, `LanguageToggle.tsx` (shared across layouts)
  - `main/` — `index.tsx` (device switch), `mobile/` (MainLayout, Header, BottomNav), `desktop/` (MainLayout, Header, Footer), `types.ts`
  - `sub/` — `index.tsx`, `utils.ts` (getSubTitle/getBackHref — the mobile Header is their only consumer), `mobile/` (SubLayout, Header), `desktop/` (SubLayout only — bare `DesktopShell`; desktop sub pages carry no back/title strip)
  - `auth/` — `index.tsx`, `mobile/AuthLayout.tsx`, `desktop/AuthLayout.tsx` (DesktopShell + promo/form card — see _Auth Pages_), `constants.ts` (promo artwork + bullets)
  - `blank/` — `index.tsx`, `mobile/BlankLayout.tsx`, `desktop/BlankLayout.tsx`
  - `constants.ts` — LayoutType, Device types (device hook lives in `src/hooks/useDevice.ts`)
- **Shared layout components** (`src/layouts/components/`): `Logo.tsx` (size="sm"|"lg", tagline — the tagline itself hides below `lg:`), `LanguageToggle.tsx` (variant="flag"|"text"), `DesktopShell.tsx` (main Header + Footer — the single desktop chrome)
- **Shared UI components** (`src/components/ui/`): `MovieCard.tsx` (reusable movie card), `Skeleton.tsx` (Skeleton, SkeletonCard loaders), `TearLine.tsx` (ticket-style dashed separator with circular cutouts), `FormActions.tsx` (primary + cancel button pair), `Tabs.tsx` (generic tab bar with two deliberately different semantics: `linkFor={(key) => href}` renders real links inside a `<nav>` and marks the current one `aria-current="page"` — a link that navigates must never be `role="tab"` — which is what the auth login/register switch (keeping `returnUrl`) and the tickets pager use; without `linkFor` it is a real `role="tablist"`/`role="tab"` bar with `aria-selected`, roving tabindex and Arrow/Home/End focus (manual activation: Enter/Space selects, so arrowing across the fetching movies tabs fires no request per keypress); `idBase` adds `aria-controls` plus stable ids for a `role="tabpanel"` through the exported `tabId`/`tabPanelId` helpers; an unnamed link bar stays a plain `div` instead of an unlabelled landmark; `stretch={false}` sizes each tab to its label instead of splitting the row — the desktop movies toolbar and the notifications page use it), `Button.tsx` (primary/outline/loadMore variants, loading state), `FormField.tsx` (icon + input + focus/error border), `Badge.tsx` (neutral/dark/gold/success/error pills), `SectionHeader.tsx` (borderLeft/goldBar/uppercase variants), `SearchBar.tsx` (icon + input + clear button), `EmptyState.tsx` (icon + title + description + CTA), `InputField.tsx` (text input with icon), `PasswordField.tsx` (password input with Eye/EyeOff toggle), `Logo.tsx` (brand logo), `TermsCheckbox.tsx` (checkbox with terms/privacy links), `RangeSlider.tsx` (double-thumb range slider — two native range inputs on one track, no dependency), `ExpandableText.tsx` (review body with Show more/less past 160 chars), `UndoSnackbar.tsx` (undo affordance for destructive toggles; placement via `className`), `PasswordChecklist.tsx` (live password-rule checklist off `PASSWORD_RULES` — desktop register + change-password; `size="sm"` tightens the rows where the card is already tall), `ErrorAlert.tsx` (inline form failure box, `role="alert"`), `Avatar.tsx` (circular member portrait — `fallbackSrc` swaps the initial letter for a brand image, exported as `DEFAULT_AVATAR_SRC` = `/images/default-avatar.jpg`), `AvatarRing.tsx` (conic gold ring around `Avatar` — mobile profile avatar, desktop overview hero, avatar editor), `Dropdown.tsx` (header popover primitive: trigger button + `absolute right-0` panel, closes on a second click, an outside `pointerdown`, `Escape` (focus returns to the trigger) and a route change; `role="menu"` also wires ArrowUp/ArrowDown roving focus over its `role="menuitem"` children)
- **Shared hooks** (`src/hooks/`): `useDevice.ts` — returns `"mobile" | "desktop"` via `matchMedia("(min-width: 740px)")`, kept in sync with `--breakpoint-md: 740px` in `styles/global.css` (not the Tailwind default 768px) so the JS device switch and every `md:` page split change variant on the same pixel — iPad mini portrait (744px) renders desktop. Known gap: the booking flow, the movies list, the auth screens, notifications and the account pages now render on both skins; tickets and the remaining desktop loading skeletons are still pending (see _Desktop variants_); `useMounted.ts` — flips to `true` shortly after mount (booking status page entry animations); `useAppendReveal.ts` — paginated-list reveal (grow → scroll first new card into view + animation threshold; `swapKey` change = list replaced, no scroll; **skips the scroll when its container has no layout boxes**, which is what keeps the hidden device tree's list from scrolling the visible one); `useDebouncedValue.ts` — returns a value once it stops changing for `delayMs` (default 300 ms); feature hooks added for the account area: `features/profile/hooks/{useProfileForm,usePasswordForm}.ts`, `features/reviews/hooks/useMyReviews.ts`, `features/wishlist/hooks/useWishlistBrowser.ts`
- **Redux Toolkit**: store wired at `src/store/index.ts` — `reducer: {}` (unused; reserved for future global state, e.g. notifications badge).
- **i18n**: `useLocale()` from `LocaleContext` via `useSyncExternalStore`. Returns `{ locale, setLocale, translate }`. Persists to `localStorage("locale")`. Translations at `src/locales/{en,vn}.json`. Throws if used outside `LocaleProvider`.
- `@/` alias → `src/` in `tsconfig.json`.
- Error pages: `src/app/error.tsx` (root, uses shared `components/shared/RouteError.tsx`), `src/app/global-error.tsx`, per-group `error.tsx` in `(main)`, `(blank)`, `(sub)`, `(auth)`; 404 at `src/app/not-found.tsx`.
- **All API calls on server**: Every `page.tsx` is a server component that fetches data via `await` — except `tickets/[id]/cancel/page.tsx`, a client state machine by design. Client components (`"use client"`) receive data via props only — no `useEffect` + API call pattern — except request-keyed refetches (movies list, home QuickBooking dates/slots) that re-run when their key (filters/locale, movie/date) changes. Protected pages are wrapped with `<ProtectedRoute>` client component for auth gating. **Exception**: the seat-hold lifecycle (`GET`/`PUT`/`DELETE /seat-holds`) runs client-side in `features/booking/hooks/useSeatHolds.ts` — the access token lives in RAM, so the Bearer header is attached in the browser and the token never reaches the Next.js server.

## State Management

- `src/contexts/` holds cross-cutting contexts: `DeviceContext.tsx` (server UA-guessed `initialDevice` so first paint skips the mobile→desktop flash), `LocaleContext.tsx`, `AuthContext.tsx`. AuthContext provides `{ user, token, isAuthenticated, isLoading, setAuth, clearAuth, updateUser }` — state only, no API actions. Feature-specific contexts live in `src/features/*/context.tsx`.
- **Movies page**: React Context (`src/features/movies/context.tsx`) with URL sync via `router.replace` (initial tab/query/filters seeded server-side, no `useSearchParams`). State: `activeTab`, `query`, `filtersOpen`, `filters`, `appliedFilters`, `visibleCount`. URL-synced params: `status`, `q`, `genres`, `ratingMin`, `ratingMax`, `format`, `ageRating`. Non-URL state: `filtersOpen`, `visibleCount`, `filters.releaseDate`, `filters.length`.
- **Tickets listing**: server-side URL pager — `(main)/tickets/page.tsx` reads `?tab=upcoming|past&page=N`, fetches only the visible tab (`getUpcomingTickets`/`getPastTickets`), renders `Tabs` + `Pager` (`components/mobile/Pager.tsx`: prev/next + 5 windowed numbers, hidden on a single page). No listing context, no client slicing; desktop `TicketsContent` is a null stub.
- **Booking flow**: central `useReducer` draft — `BookingProvider` (`src/features/booking/context.tsx`) wraps all booking steps at `booking/[slug]/layout.tsx` and holds one `BookingState` (cinema slice incl. `cinemaQuery`, seat selection + live `seatGrid`/`maxSeats`, snack arrays, contact, `paymentMethodId` + `paymentMethod`, countdown, `holdExpiresAt`) driven by the typed `bookingReducer` in `src/features/booking/reducer.ts` (`SET_CINEMA`/`SET_CINEMA_QUERY`/`SET_CINEMA_DATE`/`CLEAR_CINEMA_SLOT`/`ADOPT_MOVIE`/`ADOPT_SEAT_GRID`/`SET_SEAT_GRID`/`SELECT_HOLD_CELLS`/`CLEAR_SEAT_SELECTION`/`TOGGLE_SEAT`/`SET_SNACKS`/`SET_CONTACT`/`SET_PAYMENT`/`SET_HOLD`/`START_COUNTDOWN`/`EXPIRE_SESSION`/`RESET`). The context setters (`setCinema`, `setCinemaQuery`, `toggleSeat`, `setSnacks`, `setCredentials`, `setPayment`, `startCountdown`, `expireSession`, …) are thin dispatch wrappers so consumers stay prop-stable. One 10-minute session starts at the first seats-step CTA (`START_COUNTDOWN` no-ops afterwards — re-presses never extend it) and persists across refreshes via `sessionStorage("booking:countdownStart")`; `EXPIRE_SESSION` (fired by `SessionExpiryWatcher`) drops the clock so a re-pick + CTA starts a new session. Derived values (`total`, `ticketCount`, `ticketPrice`, `snackTotal`, `seatType`) are computed in the value memo — never stored in state; `selectedSeats` is derived inside the reducer from `seatGrid`. `resetBooking()` (dispatch `RESET`) runs from `PaidBookingReset`.
- **Wishlist**: React Context (`src/features/wishlist/context.tsx`) — `WishlistProvider` at root layout, `useWishlist()` hook. `toggleWishlist(id, feedback?)` is the single choke point for every heart: optimistic local toggle + BE sync when logged in (rollback on real failures) + toast feedback; logged-out picks mirror to `localStorage("wishlist")` and restore on mount (two-pass effect with `eslint-disable`, no hydration mismatch since storage has no server equivalent).
- **Toast**: `ToastContext.tsx` (`ToastProvider` outermost in root layout, `useToast().notify(message, { variant, durationMs? })` — success/error/info, max 3 stacked, 3 s auto-dismiss, click to close) + `components/ui/ToastViewport.tsx` (fixed stack, `aria-live="polite"`). Use for simple notifications; keep dedicated snackbars when an action button is needed (wishlist Undo).
- **Booking step data flow** — no step-level contexts (`src/features/booking/contexts/` was removed): server pages fetch catalogs and pass them as props, step state lives in the booking reducer, and components read `useBooking()` plus pure helpers in `features/booking/utils/`:
  - **Cinema step** — `CinemaAdopt` (effect-only component mounted once by the page) adopts the server-resolved URL selection into the draft (URL params win over the saved draft; a URL date that differs clears the stale selection) plus the slim `BookingMovie` snapshot. That snapshot is the step's only `GET /movies/:slug` fetch: credentials/payment read `movie` from `useBooking()` instead of refetching, guarded by `RequireDraft`. Handlers sit where the data is: `CinemaList` toggles slots through `resolveSlotSelection`, `DatePickerWrapper` dispatches `setCinemaDate` + `router.replace`, `SearchBar`/`BottomBar` read and write the draft directly. No mirror effect, so UI and draft cannot diverge.
  - **Seats step** — the grid lives in the reducer as `seatGrid`; `SeatMapAdopter` (effect-only, mounted **once at page level**) adopts the server map (`ADOPT_SEAT_GRID` re-marks the draft's saved seats), syncs `?showtimeId=` deep links into the draft and runs the hold lifecycle, while `SeatMapWrapper` only paints `seatGrid ?? restoreSelectedSeats(initialRows, selectedSeats)` so first paint never flashes an empty map. `TOGGLE_SEAT` is one pure transition (sweetbox pair toggle, cap counts CHAIRS via `seatIds.length`, derives `selectedSeats`) and never starts the countdown. Sweetbox cells share one label (`I(1-2)`) for 2 chairs. The hold network side lives in `hooks/useSeatHolds.ts` (restore/release/expiry only) and the seats CTA in `hooks/useSeatHoldSubmit.ts`.
  - **Snack step** — the selected `combos[]`/`foods[]` arrays in the draft are the single source of truth (back-navigation restore and zeroing come for free); steppers upsert through `withItemQty()` → `setSnacks`. No qty records, no sync effects.
  - **Status pages** — no context: each `page.tsx` derives `transactionId`/`reason` server-side (URL param → fetched-booking fallback) and passes `movie`/`booking`/`reason`/`transactionId` as props; entry animations use the shared `useMounted()` hook (`src/hooks/useMounted.ts`); `PaidBookingReset` (effect-only) dispatches `resetBooking()` once the fetched booking is `paid`.
- **Other pages**: Local `useState` or no state needed.

## Feature Scaffolding

- `src/features/movies/` — `mock.tsx` (NOW_SHOWING, COMING_SOON, ALL_MOVIES — module-internal), `constants.ts` (FALLBACK_GENRES, FALLBACK_AGE_RATINGS, FALLBACK_FORMATS, RELEASE_OPTIONS, LENGTH_OPTIONS, RATING_MIN/RATING_MAX/RATING_STEP, MOVIES_PAGE_SIZE, DEFAULT_FILTERS), `types.ts` (Movie/CastMember/FeaturedMovie re-exports + Tab, Filters, MovieQuery, MoviesMeta, CatalogOption, FilterOptions), `url.ts` (searchParams ⇄ state), `api.ts` (LIVE: `buildMovieQuery`, `getMovies`, `getFeaturedMovies`, `getGenres`/`getFormats`/`getAgeRatings`; MOCK: `getAllMovies`, `getMovieBySlug` — marked with `MOCK` comments, TODO(api) to switch callers to `getMovieDetail`). No hooks — `page.tsx` calls API directly via `await`.
- `src/features/tickets/` — `constants.ts` (TICKET_STATUS, CANCELLATION_FEE), `types.ts` (FoodDrinkItem, UpcomingTicket, PastTicket, Recipient, TicketTransfer, SeatTicket, ModificationType, ModificationSeat, EligibleShowtime), `status.ts` (`PAST_STATUS_META` — past-ticket `status` → `{ labelKey }`, the single source for the listing badge + `isPastStatus()` narrowing guard; the FE-only `transferred` status covers a ticket given away), `api.ts` (LIVE: getUpcomingTickets, getPastTickets, getTicketById, getEligibleShowtimes, findRecipient — exact-email recipient lookup via `GET /user/search`), `action.ts` (server actions: `createTransfer`/`cancelTransfer`/`acceptTransfer`/`declineTransfer` take `(prevState, formData: FormData)` and forward the refresh cookie; `modifyTicket`/`cancelTicket` take `(prevState, { …, token })` — `"use server"`), `adapters.ts` (wire → UI mapping + `TicketPageMeta` + recipient/eligible-showtime adapters), `contexts/` (TransferContext, TicketDetailContext, ModificationContext — no listing context), `hooks/` (`useTransferSubmit` confirm-form binding, `useTransferDecisions` accept/decline, `useCancelTransfer`, `useCancelFlow` the 4-view cancel machine, `useModifyPayment` fee math + `modifyTicket` submit), `components/` (`TicketRealtimeRefresh`, `TransferConfirmForm`). No mock file.
- `src/features/notifications/` — `mock.tsx`, `constants.ts` (`NOTIFICATION_EVENT` + `TICKET_UPDATED_EVENT` window event), `types.ts` (`Notification` + `NotificationMeta`), `api.ts` (`getNotifications(cookie?, locale)` — `withLang`'d, since the backend renders each notice from a stored code + params), `adapters.ts` (`toNotification` narrows the free-form `meta` JSON to `{ ticketId? }`), `context.tsx` (the provider keys its socket effect on `locale` too: a locale switch re-reads the inbox in the new language, and a push is re-read before it is announced so the toast is localized), `components/NotificationRow.tsx` (the inbox row shared by the header popup and the desktop page — see _Notifications_).
- `src/features/auth/` — `types.ts` (User, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, RefreshResponse), `action.ts` (server actions: loginAction, registerAction, refreshAction, logoutAction — `"use server"`), `schema.ts` (createLoginSchema, createRegisterSchema — Zod factory functions with i18n).
- `src/features/profile/` — `types.ts` (User interface, UpdateProfileRequest), `action.ts` (updateProfile server action).
- `src/features/reviews/` — `mock.ts` (FILTERS with FilterKey), `types.ts` (FilterKey, `MovieReview` + `MyReview`/`MyReviewsResponse` for `/reviews/me`), `api.ts` (`getReviewFilters`, `getReviews`, `getMyReviews`, client-interactive `deleteMyReview`), `action.ts` (movie-detail review server actions), `useMovieReviews.ts` (detail-page review state: paging/mutations), `useReviewHighlight.ts` (shared `#review-<id>` deep-link: scroll + 4 s ring + bounded page hunt), `constants.ts` (`REVIEWS_PAGE_SIZE`, `REVIEW_MAX_LENGTH = 500`).
- `src/features/wishlist/` — no mock (deleted): `types.ts` (`WishlistItem`, `WishlistMovie` — exact BE payload, `WishlistTab`), `api.ts` (LIVE: `getWishlist` + client-interactive `addWishlist`/`removeWishlist` with RAM Bearer, seat-holds precedent), `context.tsx` (WishlistProvider, useWishlist — `toggleWishlist(id, feedback?)` is the single choke point for every heart: optimistic local + BE sync when logged in with rollback + toast; logged-out picks mirror to `localStorage("wishlist")` with mount restore).
- `src/features/booking/` — `types.ts` (SelectedSeat/SelectedCombo/SelectedFood/BookingMovie/BOOKING_STEP_KEYS re-export shared types + wire types: SeatMapCell/SeatMapRow/SeatMapResponse/CurrentSeatHoldResponse/SeatHoldResponse/PaymentMethodOption/BookingStatus/PaymentFailReason/BookingDetail/PayResult), `utils/` domain folder: `seat.ts` (`getSeatLabel` — the single seat-label format everywhere; grid helpers `restoreSelectedSeats`/`selectCellsByIds`/`clearGridSelection`), `cinema.ts` (`findShowtime`/`resolveSlotSelection`/`resolveCinemaAdoption` — step selection + URL adoption), `bookingCard.ts` (`bookingCardData(booking)` — BookingDetail → card props: merged sweetbox seats, snacks, payment-method label, theater/date/bookingRef), `snack.ts` (`withItemQty` stepper upsert), `seatMap.ts` (`adaptSeatMap` — wire GET /seats → SeatGrid `SeatRow[]`: kind mapping, multi-segment cell splitting, price passthrough), `api.ts` (LIVE: `getSeatMap`, `getCombos`, `getFoodItems`, `getFoodCategories`, `getPaymentMethods`, `getSeatHolds`/`putSeatHolds`/`releaseSeatHolds` (client-interactive, Bearer from RAM), `getBookingById`), `action.ts` (`"use server"`: `createBookingAction`, `payBookingAction` — see Server Actions Convention), `constants.ts` (`BOOKING_SESSION_SECONDS` = 600 — session clock seed), `context.tsx` (BookingProvider, useBooking — thin dispatch wrappers over the reducer), `reducer.ts` (BookingState, BookingAction, bookingReducer, INITIAL_BOOKING_STATE — the seat grid and cinema-step UI state live here too), `hooks/` (`useSeatHolds.ts` client seat-hold lifecycle: restore/release/early-hold safety, the session end is enforced by `SessionExpiryWatcher` not the hook; `useSeatHoldSubmit.ts` seats-step CTA; `useCinemaSelection.ts` cinema filter + slot toggle; `useContactDraft.ts` credentials fields + draft sync; `useSubmitBooking.ts` payment create → pay → route), `components/` (`CinemaAdopt`, `PaidBookingReset`, `SeatMapAdopter`, `SessionExpiryWatcher`, `RequireDraft` — effect-only mount helpers/guards). No mock file.
- `src/hooks/` — `useDevice.ts` (returns `"mobile" | "desktop"` via `matchMedia`), `useMounted.ts` (post-mount flip for staged entry animations), `useAppendReveal.ts` (grow-reveal + scroll for movies/tickets/reviews lists), `useDebouncedValue.ts` (value that settles after `delayMs`)
- `src/libs/utils.ts` has `slugify`, `formatVND`, `formatDate`, `formatRelativeTime`, `getSafeReturnUrl`, `authReturnTarget`, `buildLoginUrl`, `buildRegisterUrl`; `src/libs/date.ts` has `formatDateOnly` (local calendar dates); `src/libs/zod.ts` has shared Zod validators (`isValidPhone`, password regex patterns) and `PASSWORD_RULES` (the checklist/schema single source); `src/types/index.ts` has shared types (`Device`, `Movie`, `CastMember`, `FeaturedMovie`). Feature-specific types live in `features/*/types.ts`. Feature-specific Zod schemas live in `features/*/schema.ts`.

## Auth Pages (Login & Register)

Three routes under `(auth)/` — login, register and a prepared `forgot-password` placeholder. Every page renders **both** device trees, so the form logic lives once in `features/auth/hooks/` and the four skins (login/register × mobile/desktop) are presentation only.

- **Login route**: `(auth)/login/page.tsx` — server component, reads `searchParams.returnUrl` and resolves it with `authReturnTarget()` (`libs/utils.ts`): `getSafeReturnUrl` sanitization (must start with a single `/`, rejects `//host`, `/\host` and every auth entry point — `/login`, `/register`, `/forgot-password`) plus `"/"` → `undefined`, so the tab links stay plain (`/login`, never `/login?returnUrl=%2F`). Renders the mobile + desktop `LoginForm`.
- **Register route**: `(auth)/register/page.tsx` — same shape; `returnUrl` arrives from the login page's register link, so a visitor bounced off a protected page who signs up instead of signing in still lands where they were going.
- **Forgot-password route**: `(auth)/forgot-password/page.tsx` — **placeholder**: the real form's shape (email field + submit) with the CTA `disabled` and an honest "still being built" note, because the backend reset endpoint does not exist yet. One body (`components/ForgotPasswordForm.tsx`, no device split — the layouts already differ around it) turns the login form's long-dead `/forgot-password` link into a page that is ready for the wiring.
- **Auth layout**: `(auth)/layout.tsx` → `LayoutProvider(layout="auth")` → device switch.
  - Mobile `AuthLayout` (unchanged): Logo + LanguageToggle header, centred content.
  - Desktop `AuthLayout`: the shared `DesktopShell` (site header + footer, so the auth screens navigate like every other page) around a centred `max-w-7xl` card that holds **two tiles** — the artwork and the form — with the artwork owning the majority of the width (`lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]`, 3:2). The card owns the padding (`p-2 lg:p-3`) and the artwork is a real rounded tile inside it (`relative overflow-hidden rounded-xl`), not a full-bleed backdrop: nothing sits _under_ the form, so the poster can never be mistaken for the page background and the card keeps one radius. From `lg:` the row is `lg:min-h-[620px]` (the tile carries the floor; the form grows it when the register checklist makes it taller) and the tile must keep `lg:h-auto`, otherwise the fixed tablet `h-52` would win over the grid row height and the artwork would cover only a top strip. Below `lg:` — the 740–1023px band — the tile becomes an in-flow `h-52` banner above the form in a single column. The promo copy (`PromoBrand` + headline + subtitle) lives inside the tile at every breakpoint; the bullets stay `lg:`-only because the 208px tablet banner has no room for them. The form column carries `.surface-raised` because `FormField` paints `--color-surface` — without the lift the input wells would vanish into the flat card. The skins drop their `max-w-md` from `lg:` (`lg:max-w-none`) — the 2fr column is already the right width — and keep it below, where the column is full width.
  - Promo content lives in `layouts/auth/constants.ts`: `AUTH_PROMO_IMAGE` (+ its `sizes` — the `lg:` tile is ~710 CSS px at the capped container width), currently `/images/og-cover.png` standing in for the real key art — spec: landscape 4:3, ≥1600×1200, ≤500 KB — and `AUTH_PROMO_BULLETS`, the three selling points (keys under `auth.promo.*`).
- **Form logic** (`features/auth/hooks/`): `useLoginForm({ returnUrl })` / `useRegisterForm({ returnUrl })` own the fields, Zod validation (`touched` gates the field errors), the server-action call and the post-auth redirect; the skins read the controller and render controls. **Register also signs you in**: `POST /auth/register` answers with a message and no session, so the hook then calls `loginAction` with the same credentials, adopts the session via `setAuth` and lands on `returnUrl`; if that follow-up fails (the account does exist by then) it falls back to `buildLoginUrl(returnUrl)`. `useLogout()` is the one sign-out path — `clearAuth()` → `logoutAction()` → `router.push("/")`, returning `isLoggingOut` — shared by the mobile `ProfileMenu` and the desktop `AccountMenu`.
- **Tab switch**: the login/register switch is `ui/Tabs` with `linkFor` (`buildLoginUrl`/`buildRegisterUrl`) — real links, so each form keeps its own URL, `returnUrl` travels between the tabs, and no shared chrome remounts. `onTabChange` is therefore optional (button variant only).
- **Validation**: Zod schemas from `features/auth/schema.ts` — `createLoginSchema(translate)` and `createRegisterSchema(translate)` (factory functions). Pattern: `schema.safeParse()` → `result.error.flatten().fieldErrors` → `touched` + show errors.
- **Password rules**: `PASSWORD_RULES` in `libs/zod.ts` — 8 characters, uppercase, number, special — is the single source: `ui/PasswordChecklist.tsx` renders it live (labels under `common.password.*`) for the desktop register form and the change-password page, and the exporting schemas validate with the same regexes sitting right above it, so a checklist can never disagree with the validator. The desktop register form prints it under the password pair, always visible; mobile keeps the plain field set.
- **Header CTA**: the desktop `Header` hides its Login button on `/login`, `/register` and `/forgot-password` (and their sub-paths) — the card carries its own CTA, and a second one beside it is noise. The profile chip still wins when a session exists.
- **Desktop header popups** (`layouts/main/desktop/`): `NotificationBell.tsx` — the bell opens the inbox (`ui/Dropdown`); it lists **every** notice in a capped, hidden-scrollbar panel (`max-h-[min(70vh,480px)] overflow-y-auto scrollbar-hide`) with mark-all-read plus an explicit close (X) button in its header — the panel is tall enough that clicking outside should not be the only way out — and each row marks itself read and follows its action href. Its rows are `features/notifications/components/NotificationRow.tsx` at `density="compact"` (the page renders the same component at `"comfortable"`), and a "View all notifications" footer hands off to the `/notifications` page, which owns the All/Unread switch (see _Notifications_). `AccountMenu.tsx` — the header chip (avatar with the `DEFAULT_AVATAR_SRC` brand fallback, name, chevron; no tier line) opens a `role="menu"` panel: identity header, then two labelled `role="group"` sections — Account (Profile, Change Password) and Activity (Review & Rating, Wishlist), the same `profile.account`/`profile.activity` keys the mobile menu uses — each row an icon tile (`h-7 w-7 rounded-lg bg-(--color-surface-2)`) that tints gold with the row plus a chevron that fades in on hover, and finally a red Logout reusing the shared `useLogout()`. The locale switch uses `variant="flag"`, matching mobile.
- **API calls**: Server actions in `features/auth/action.ts` — `loginAction()`, `registerAction()`, `refreshAction()`, `logoutAction()` (all `"use server"`).
- **Auth context**: `src/contexts/AuthContext.tsx` — `AuthProvider` wraps root layout, `useAuth()` hook provides `{ user, token, isAuthenticated, isLoading, setAuth, clearAuth, updateUser }`. AuthContext is **state-only** — consumer components (LoginForm, RegisterForm, ProfileMenu) call server actions directly, then update state via `setAuth()`/`clearAuth()`. Access token stored in RAM only (React state). Refresh token in HttpOnly cookie (managed by server actions via `cookies()` API). On mount, calls `refreshAction()` to restore session.
- **Error handling**: 401 → "Invalid email or password", 409 → "Email already exists", other → generic server error — rendered by the shared `ui/ErrorAlert.tsx` (`role="alert"`, so the message is announced when it appears).
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

- `isLoading` → auth-gate skeleton inside the same `AuthGateShell` card the prompt uses, so nothing shifts when the restore settles
- `!isAuthenticated` → `LoginPrompt` (icon + "Login Required" + a CTA link to `/login?returnUrl={pathname}` and a "Sign Up" link to `/register?returnUrl={pathname}` — `usePathname()` feeds both)
- `isAuthenticated` → render children
- Rendered at page level by `tickets/page.tsx` and `profile/page.tsx`, and at layout level by `(sub)/layout.tsx`

3. **Backend enforcement** — server-side fetches of user-scoped data forward the incoming cookies via `getRequestCookie()` (see API Layer).

- `src/components/shared/LoginPrompt.tsx` — shared prompt UI: returned directly by the server gate, and reused by `ProtectedRoute` for the client-side fallback. Both CTAs are real `<Link>`s (`buildLoginUrl`/`buildRegisterUrl`), never programmatic pushes, so a visitor with no account reaches register in one step with the `returnUrl` intact — and the register page signs the new account in. Its chrome is `src/components/shared/AuthGateShell.tsx`: the plain mobile stack below `md:`, one centred `max-w-md` card from `md:` up (`.surface-raised` inside the card keeps the prompt's `bg-(--color-surface)` icon tile a step above the card). The prompt replaces the page, so it owns its own band; `md:` is the device split there, not a desktop enhancement, because the device layout renders it and exactly one instance exists per request.
- **Component-level protection**: Movie detail `Reviews.tsx` conditionally renders `WriteReview` — shows login CTA for unauthenticated users, review list remains public

| Route                                                                | Protected?               |
| -------------------------------------------------------------------- | ------------------------ |
| `/`, `/home`, `/movies`, `/movies/:slug`                             | Public                   |
| `/tickets`, `/profile`                                               | Protected (page-level)   |
| `/profile/*`, `/tickets/:id/*`, `/booking/:slug/*`, `/notifications` | Protected (layout-level) |

Known gap: a present-but-revoked `refreshToken` cookie passes `hasSession()`. Handled without ever leaving the URL: client-side a backend 401 dispatches `UNAUTHORIZED_EVENT` (`libs/api.ts` `notifyUnauthorized`, `/auth/*` excluded) → `AuthContext` only clears state and `ProtectedRoute` swaps to the prompt in place; server-side callers check `isUnauthorizedResult(result)` (`libs/session.ts`) on `apiFetch` results and return `<LoginPrompt />` — wired on tickets listing/detail, booking seats/status pages (the stale cookie itself can't be cleared from a server component; the next login overwrites it). Rule: no `redirect()` to `/login` anywhere on the 401 path — a child-segment redirect used to win over the parent layout's prompt and yank the URL, which is exactly the bug this rule prevents.

## Ticket Detail Page

Two-level routing:

- **Listing**: `(main)/tickets/page.tsx` — server URL pager (`?tab=&page=`, one tab fetched per render) inside main layout with BottomNav. Server gate (`hasSession()` → `LoginPrompt`) + `<ProtectedRoute>` client fallback. Mobile renders `Tabs` + `UpcomingTicketList`/`PastTicketList` + `Pager`; desktop `TicketsContent` is a null stub. Each upcoming card wears its status on the **poster**: a full-width `TicketCountdown` ribbon (client-only, ticks against the absolute showtime deadline, compact units — the poster is ~96 px wide) for a usable ticket, or the gold `tickets.transfer.pending_badge` ribbon while a transfer is in flight (a countdown would be misleading). The tag row keeps a gold pill carrying the one thing the ribbon cannot fit — the recipient name (`features/tickets/adapters.ts` → `isTransferring`/`transferRecipientName`).
- **Detail**: `(sub)/tickets/[id]/page.tsx` — renders components directly (no props). **Layout** (`layout.tsx`) is the server component that calls `getTicketById(id, await getRequestCookie())`, wraps children in `<TicketDetailProvider>`. Components read ticket from `useTicketDetail()` context.

Detail page components under `(sub)/tickets/[id]/components/`:

- `mobile/TicketInfo.tsx` — hero poster, theater/location, seat, food & drink, QR code, payment summary
- `mobile/TicketActions.tsx` — owner: Download Ticket (only while a scan payload exists) + Cancel & Refund (only for success/confirmed/pending) + Transfer Ticket (upcoming only). Recipient (`viewerRole === "recipient"`): Accept Transfer + Decline only.
- `mobile/QRCode.tsx` — `qrcode.react` rendering the backend's signed scan payload (`ticketId.qrToken.signature`) as-is; the URL form (`https://primseat.com/tickets/{id}`) is only a fallback for values without a payload (never called with a bare id from the detail page)
- `desktop/TicketDetail.tsx` — stub (returns null)

Past tickets show the same detail layout but without action buttons.

**QR gating**: the backend issues `qrCode`/`qrToken` **only** for a usable ticket (owner + `active` + not revoked) — a used/expired/refunded/cancelled ticket and a pending recipient get neither. The FE never fabricates a QR: `TicketInfo` renders `<QRCode value={ticket.qrCode}/>` only when the payload exists (no `ticket.id` fallback) and otherwise shows a neutral panel labelled with `PAST_STATUS_META` (`tickets.detail.qr_invalid_hint` when the status is not a past one), and `TicketActions` hides **Download Ticket** whenever `ticket.qrCode` is absent. Rationale: a dead QR is misleading — the gate (`POST /tickets/check-in`) rejects it with `TICKET_NOT_ACTIVE` / `TICKET_EXPIRED`.

**Past-status badges**: the backend persists the terminal status (`used` | `expired` | `cancelled` | `refunded`) — `mapPastStatus` (adapters) passes it straight through and `PastCard` reads `PAST_STATUS_META[status]` (`features/tickets/status.ts`) for the badge label (`translate(meta.labelKey)` → `tickets.used`/`tickets.expired`/`tickets.refunded`/`tickets.cancelled`). Use the `isPastStatus()` guard before indexing the map (the detail status union also carries upcoming values). Never derive "expired" from the showtime client-side: the backend expiry sweep (minute cron) is the authority, and a ticket that was checked in, refunded or cancelled must keep showing _that_ status. **No muted styling** — every past card renders at full opacity.

**Transfer provenance**: `GET /tickets/past` also returns the tickets the viewer transferred away, so `toPastTicket` maps the summary's settled-transfer field to `PastTicket.transferProvenance` (deliberately not `transfer` — that name is the _open_ transfer detail on `UpcomingTicket`, and the detail context narrows on it) and `mapPastStatus` returns the viewer-derived `"transferred"` status (a `TicketStatus` member that exists only on the FE) for `direction: "sent"`. `PastCard` shows the provenance badge (`tickets.transfer.sent_badge` / `received_badge`) **instead of** the terminal badge whenever `transferProvenance` is present, and for a sent ticket it names the recipient where the "View Details" link would be — ownership moved on accept, so the detail endpoint answers 404 for the sender and the link must not be rendered.

**Live refresh** (`features/tickets/components/TicketRealtimeRefresh.tsx`): the ticket _writer_ is often not the viewer, so both the listing (`<TicketRealtimeRefresh />`, no id) and the detail layout (`<TicketRealtimeRefresh ticketId={...} />`) stay honest about a transfer the other side accepted/declined/cancelled. Triggers: the notification push (`notification:new` → provider dispatches `TICKET_UPDATED_EVENT` with `{ ticketId }`) and returning to a hidden tab; a 15 s throttle coalesces them. A listener reacts unless the event names a _different_ ticket. On the detail page the ticket is re-read **before** refreshing — `getTicketById` answering 404 means ownership moved away, so the visitor is sent to `/tickets` (`router.replace`) instead of rendering the layout's `notFound()`; otherwise `router.refresh()`.

## Ticket Transfer

Two sub-routes under `(sub)/tickets/[id]/transfer/`:

- `transfer/page.tsx` — wraps **both** device trees with one `TransferProvider` (they both render, so a per-branch provider would fork the draft), then renders `SeatSelector`, `RecipientInput`, `TransferBottomBar`. Mobile/desktop split via `block md:hidden`.
- `transfer/confirm/page.tsx` — **server component** that reads `searchParams` (`seats`, `recipient` = email, `transferSnacks`), calls `findRecipient()` (exact email), redirects to transfer page if invalid. Renders `ConfirmCard`, `ConfirmBottomBar`.

Both have `loading.tsx`. Desktop stubs return null.

Components under `transfer/components/`:

- `mobile/SeatSelector.tsx` — seat toggle for transferable seats
- `mobile/RecipientInput.tsx` — exact-email recipient lookup (valid email → `findRecipient()` → `GET /user/search`; adopts the single match into the transfer context, shows "not found" otherwise)
- `mobile/TransferBottomBar.tsx` — sticky bottom bar with transfer CTA → links to confirm page (passes the recipient email)
- `desktop/TransferContent.tsx` — stub

Components under `transfer/confirm/components/`:

- `mobile/ConfirmCard.tsx` — transfer summary (seats, recipient, snacks toggle)
- `mobile/ConfirmBottomBar.tsx` — the mobile layout around the shared confirm control: `features/tickets/hooks/useTransferSubmit.ts` resolves the selected seat labels to backend seat UUIDs at render and binds `createTransfer`, `features/tickets/components/TransferConfirmForm.tsx` renders the repeated hidden `seatId` inputs inside a real `<form action={formAction}>` (plus hidden `ticketId`/`recipientEmail`/`transferSnacks`), and the hook redirects to the ticket detail from an effect on success (never during render). The CTA is `type="submit"` and disabled when no transferable seat resolves.
- `desktop/ConfirmContent.tsx` — stub

`TransferContext.tsx` (`features/tickets/contexts/`) manages `selectedSeats`, `recipient`, `transferSnacks` state. `TicketDetailContext.tsx` provides `{ ticket, viewerRole, transfer, incomingTransfer }` from layout.

### Incoming transfers (recipient side)

`GET /tickets/:id` also answers for the recipient of the ticket's open transfer, so the `transfer received` notification (which already links to `/tickets/{ticketId}`) opens a real page. The payload is view-shaped by the backend:

- `viewerRole: "owner" | "recipient"` — `TicketDetailContext` exposes the resolved value (defaults to `owner` for list-derived data).
- Owner: `transfer` (who it is going to) + the QR.
- Recipient: `incomingTransfer` (`{ id, sender, transferredSeats, transferSnacks }`) and **no QR** (`qrToken`/`qrCode` are null/absent until they accept).
- `TicketInfo` renders the offer panel instead of the QR; `TicketActions` renders Accept/Decline instead of Download/More actions.
- Accept → `acceptTransfer` (`POST /tickets/transfers/:id/accept`) then `router.refresh()` — the same URL re-renders as the owner view with the QR. Decline → `declineTransfer` then `router.replace("/tickets")`. Both are real `<form action={formAction}>` submits (hidden `transferId`), and `isAccepting || isDeclining` disables **both** buttons while a decision is in flight.
- The owner's Cancel Transfer button (`TicketInfo` pending-transfer panel) is likewise a `<form action={formAction}>` with a hidden `ticketId`, refreshing on success.
- `409 TRANSFER_NOT_PENDING` is treated as "already handled" (the actions carry `status`/`code` through the union), not as an error.

## Ticket Cancel & Refund

Single route under `(sub)/tickets/[id]/cancel/` — no separate routes for success/failed:

- `cancel/page.tsx` — **client component**; the 4-view machine (`idle` summary / `processing` overlay / `success` / `failed`) lives in `features/tickets/hooks/useCancelFlow.ts` so both device skins drive it from one place. Reads ticket from `useTicketDetail()` context (parent layout). Computes cancellation fee (fixed ₫20,000), total paid, and refund amount locally.
- `cancel/loading.tsx` — skeleton matching summary layout
- `cancel/components/mobile/CancelSummary.tsx` — movie info card (poster, title, cinema, datetime), seats, price breakdown (ticket + combo), total paid, cancellation fee, refund amount, refund-to section (payment method from ticket), cancellation policy link, Continue button
- `cancel/components/mobile/CancellationPolicySheet.tsx` — bottom sheet with 4 policy rules, Done button. Uses `ActionSheet` wrapper.
- `cancel/components/mobile/ConfirmationSheet.tsx` — bottom sheet with refund amount, "Cancel Booking" (red) + "Keep My Ticket" buttons. Uses `ActionSheet` wrapper.
- `cancel/components/mobile/CancelResult.tsx` — success state: animated green checkmark (same pattern as booking status success), refund info card with "Processing" badge, View Ticket + Back to Home buttons. Failed state: animated red alert with shake keyframe (same pattern as booking status failed), refund info card with "Refund Failed" badge, Try Again + Contact Support buttons.
- `cancel/components/desktop/CancelContent.tsx` — stub (returns null)

Entry point: `TicketActions.tsx` Cancel & Refund row → `router.push(/tickets/${id}/cancel)`. Currently shown only when `canCancel` is true (status success/confirmed/pending) and no pending transfer.

Cancellation fee is fixed ₫20,000 (policy time from backend in future). `cancelTicket` is the live server action (`POST /tickets/:id/cancel`) — the backend decides the refund outcome. After success, "View Ticket" calls `router.replace()` + `router.refresh()` to re-fetch server-side ticket data.

## Profile Page

`page.tsx` is a **server component** wrapped with `<ProtectedRoute>`, renders `Avatar`, `UserInfo`, `ProfileMenu` directly (no props). All client components read user from `useAuth().user` context.

- `components/mobile/Avatar.tsx` — conic-gradient ring around the shared `ui/Avatar` (reads `user.avatarUrl` from auth context with the `DEFAULT_AVATAR_SRC` brand fallback; external URL from Contentful via `images.ctfassets.net` in `remotePatterns`)
- `components/mobile/UserInfo.tsx` — name + tier badge (Star icon, reads `user.name` from auth context)
- `components/mobile/MenuSection.tsx` — reusable menu card with icon rows, hover via Tailwind `hover:bg-(--color-surface-2)`
- `components/desktop/ProfileContent.tsx` — desktop overview: identity hero + 3 stat tiles (upcoming tickets / reviews / wishlist, counts from server, `—` on fetch failure) + account details; wraps in `AccountShell`
- Shared desktop chrome for the whole account area: `features/profile/components/desktop/{AccountShell,AccountNav,AccountSkeleton}.tsx` — `AccountShell` is the eyebrow + gold-bar `h1` + description/action row over a sticky nav and one `rounded-2xl bg-(--color-surface)` panel whose `.surface-raised` inner wrapper lifts every nested card; the tablet band (740–1023) flattens the nav into a pill strip. `AccountNav` derives the active entry from `usePathname()` through `accountSectionForPathname()` (longest href wins, trailing slash tolerated) instead of taking an `active` prop, so a page cannot disagree with the nav about where it is, and `features/profile/accountSections.ts` is the single source of nav entries. Each desktop account page owns its `mx-auto w-full max-w-7xl px-6 py-8 lg:px-8` band (the sub layout is a bare `DesktopShell`), and the desktop branch of every `loading.tsx` repeats that band around `AccountSkeleton`.

No BottomNav or TopNav — layout provides both. Menu items use i18n keys `profile.*`.

## Change Password Page

`(sub)/profile/password/page.tsx` — thin compose (mobile + desktop):

- `components/mobile/PasswordField.tsx` — reusable password input with Eye/EyeOff toggle, focus + error border states
- `components/mobile/PasswordRequirements.tsx` — card around the shared `ui/PasswordChecklist` (the page owns the card + title, the rules and their live state come from `PASSWORD_RULES`)
- `components/mobile/PasswordForm.tsx` — orchestrator with `validate()`, `touched` state, validation on submit, UPDATE PASSWORD + CANCEL actions; the CTA is `disabled` while `PASSWORD_CHANGE_ENABLED` is false
- `components/desktop/ChangePasswordContent.tsx` — form column (fields + `ui/ErrorAlert`) beside the shared `ui/PasswordChecklist`; the CTA is honestly disabled and an info box carries `profile.password.unavailable`, both gated by `PASSWORD_CHANGE_ENABLED = false` in `features/profile/constants.ts` because the backend has no change-password endpoint. Neither skin pretends the form works.

Validation: Current Password (required), New Password (required + min 8 chars + uppercase + number + special char), Confirm Password (required + must match). `showErrors = touched && !isValid`.

Sub layout routing: `getSubTitle()` returns "Change Password". Back button goes to `/profile` (handled by existing `/profile` prefix rule).

## Edit Profile Page

`(sub)/profile/edit/page.tsx` — thin compose (mobile + desktop):

- `components/mobile/ProfileForm.tsx` — profile form with fields, uses `updateProfile` server action via `useTransition`
- `components/mobile/AvatarEditor.tsx` — avatar editor; the camera control is disabled and the panel states `profile.edit.photo_unavailable` because the backend has no avatar upload
- `components/desktop/EditProfileContent.tsx` — avatar column + two-column field grid driven by the same `useProfileForm` controller as the mobile form (so the DOB round-trip fix cannot drift between skins); actions sit right-aligned (`ui/Button fullWidth={false}`).

Validation: Full name (required), phone (required), DOB as date picker. `loading.tsx` present.

## Reviews & Rating Page

`(sub)/profile/reviews/page.tsx` — reviews listing:

- `components/mobile/ReviewList.tsx` — review list wrapper
- `components/mobile/ReviewCard.tsx` — individual review card with rating, text, date
- `components/mobile/FilterBar.tsx` — filter bar for rating-based filtering
- `components/mobile/StarRating.tsx` — star rating display component
- `components/mobile/LoadMoreButton.tsx` — load more pagination
- `components/desktop/ReviewContent.tsx` — count line + `ui/Tabs stretch={false}` sort + `ReviewRow` cards (poster, title, rating, `ExpandableText` body, two-tap delete) + Load more + `EmptyState`; the listing state (paging, sort, delete) comes from `features/reviews/hooks/useMyReviews.ts`, shared with the mobile list. `ReviewRow`'s destructive confirm is its own red `<button>` (Button `size="sm"` metrics) rather than a recoloured gold `primary`.

The page fetches `getMyReviews({ skip: 0, limit: 10, sort: "recent" }, cookie, locale)` and `getReviewFilters(locale)` server-side and hands both to either skin. `loading.tsx` present.

## Wishlist Page

`(sub)/profile/wishlist/page.tsx` — server component: fetches live `getWishlist(cookie, locale)` (no mock — entries carry the full movie card via `WishlistItem`; failure → local draft fallback), mounts `WishlistHydrate`, then composes:

- `components/mobile/WishlistHydrate.tsx` — effect-only mount adoption of server ids into the draft (booking `CinemaAdopt` pattern)
- `components/mobile/WishlistMovieList.tsx` — count sentence (`count_prefix`/`count_suffix`) on top, search bar (title + genre, debounced) + All/Now Showing/Coming Soon chips (shared `ui/Chip` `variant="outline"`, reviews style) + single-column list; filtering is client-side; local-only ids without a BE payload never render; `isBookable` reads `movie.status`
- `components/mobile/WishlistCard.tsx` — vertical card (16:9 poster banner on top + title/meta row), Book CTA for now-showing or a muted "Coming Soon" label otherwise, heart toggle (undoable removal via parent snackbar)
- `components/mobile/EmptyState.tsx` — empty state when wishlist is empty
- `components/desktop/WishlistContent.tsx` — `SearchBar` + outline `ui/Chip` status tabs + poster grid (`grid-cols-3 xl:grid-cols-4`) of `WishlistPosterCard`, undoable removal via `ui/UndoSnackbar`; filtering/undo state comes from `features/wishlist/hooks/useWishlistBrowser.ts`, shared with the mobile list. `WishlistEmptyState` lives in `features/wishlist/components/` because both skins render it.

Uses `WishlistProvider` from `features/wishlist/context.tsx` at root layout. `loading.tsx` present.

## Notifications

One inbox, two surfaces, one state.

- **Data** — `NotificationProvider` (`features/notifications/context.tsx`) is the client source of truth: SSR-seeded by the root layout (cookie fetch, current locale), kept live by the `notification:new` socket, re-read on reconnect and on a locale switch. Both surfaces read `useNotifications()`, so the bell badge, the tab counts and the rows can never disagree. The list is gated on `isAuthenticated || isLoading` — the server has no session state, so `isAuthenticated` is `false` while the server renders and a plain `isAuthenticated` gate would discard the seed and flash an empty inbox; `isLoading` keeps it open until the restore settles, and a logged-out visitor seeds `[]` anyway. The FE asks for `?limit=50`; older notices are out of reach until paging is added (the backend already reports `page`/`hasNextPage`).
- **Mobile** — `(sub)/notifications/page.tsx` → `components/mobile/NotificationList.tsx` + `NotificationCard` (unchanged): mark-all-read strip, cards, tapping a card marks it read.
- **Desktop** — `components/desktop/NotificationList.tsx`: one reading column (`mx-auto w-full max-w-4xl px-6 py-8 lg:px-8` — an inbox stretched to 7xl is mostly whitespace), a gold-bar `h1` + `notif.subtitle` + an outline mark-all-read CTA, then a `bg-(--color-surface)` panel (`.surface-raised` inside) holding an All/Unread `ui/Tabs` bar over `divide-y` rows. The tabs pass `idBase="notifications"`, so the region is a real `role="tabpanel"` wired with `aria-controls`/`aria-labelledby`. Filtering is **local state**: the list is already loaded, so switching tabs must not cost a navigation and the URL would add nothing the back button can use. The Unread tab keeps only unread rows and each tab has its own empty state (`notif.no_notifications` vs `notif.empty_unread_*`).
- **Rows** — `features/notifications/components/NotificationRow.tsx` with `density="compact"` (popup: 36 px tile, clamped message, read rows `opacity-55`) or `"comfortable"` (page: 44 px tile, three-line message, chevron cue, read rows keep contrast — only the title drops to the secondary colour). The whole row is the target and is a `<Link>` when the notice carries an action, a `<button>` otherwise — never a link nested inside a link.
- **Bell** — the header popup stays the quick view; its footer links here.

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
- Seat map rendered inline in page (fixed layout, no zoom/pan — `SeatGrid` fits the viewport width). Screen rendered as curved SVG arc. Max seats comes from the seat-map wire (`maxSeats`, currently 8), counted in CHAIRS (`seatIds.length`, so a sweetbox pair counts 2).
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

**Desktop is a separate design, not the mobile stack widened.** Both screens share one skeleton: a left-aligned hero (`SuccessHero` / `FailHero` — icon beside the copy, driven by `useMounted()`) over a `max-w-6xl` body that is **one column below `lg:`** and `lg:grid-cols-[minmax(0,1fr)_360px]` above it — the receipt card + the side panel, so the side panel drops under the receipt in the 740–1023px band (same rule as the booking steps).

- `(sub)/booking/[slug]/status/success/page.tsx` — mobile: `SuccessIcon` (shared) + `TicketCard` + `SuccessActions`; desktop `components/desktop/`: `SuccessHero`, `ReceiptCard` (movie identity + theater/day + `PriceBreakdown`), `SuccessSidePanel` (QR + booking ref + Download / Back to Home), composed by `SuccessContent`.
- `(sub)/booking/[slug]/status/failed/page.tsx` — mobile: `FailedIcon` + `FailedOrderCard` + `FailActions`; desktop `components/desktop/`: `FailHero`, `FailedReceipt` (red-tinted border + error-code pill), `FailSidePanel` (Retry / Back to Home + the support card), composed by `FailContent`.
- Data derivation is shared, never re-implemented per skin: `resolveTicketIdentity(movie, booking)` (poster/title/ageRating precedence) in `features/booking/utils/bookingCard.ts`, and `failReasonMessageKey(reason)` / `paymentErrorCode(reason)` in `features/booking/utils/paymentFailure.ts` (the two maps used to be copy-pasted per component).
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
- **Movies page** (`(main)/movies/page.tsx`) — **server component**: reads the `searchParams` prop server-side, derives `initialTab`/`initialFilters` with the helpers in `features/movies/url.ts` (`readTabFromParams`, `readFiltersFromParams`, `writeParamsFromState`), fetches `getMovies()` for the active tab plus the three filter catalogs, and passes everything as props into `<MovieListProvider>`. The provider no longer calls `useSearchParams()` — no `<Suspense>` boundary needed and the URL state is fully server-rendered.
  - **Mobile** (`components/mobile/`): `Tabs` + `SearchBar` + `FilterPanel` (collapsible card, one Apply for the whole draft) + `MovieGrid` (2 columns, compact `ui/MovieCard`, load-more).
  - **Desktop** (`components/desktop/`): `MoviesHeader` (the tab name as the `h1` + the server result total), `FilterSidebar` (same draft/apply model, sticky at `lg:sticky lg:top-24` and showing **every** section at once — deliberately no viewport-height cap and no scroll region of its own, so no filter can hide behind an (invisible) inner scrollbar; the tradeoff is that on a short viewport Apply can fall below the fold, which costs a page scroll, never a lost control; it owns **Clear All** itself, in its card header next to the active-filter badge, because that is the filter set it resets; its six sections fold individually via `FilterSection` (label = toggle, `aria-expanded`/`aria-controls`, local open state, all expanded by default) and each carries a badge derived from the **draft** — a gold dot for a single setting, the count for Genre — so a folded section still shows that it is set; the sections run two-up at tablet with `items-start` and collapse to one column from `lg:`, and **Genre is two-up at every width** (`grid grid-cols-2`) since it is the one list long enough to dwarf the rest), `MovieToolbar` (`MovieTabs stretch={false}` + the search field, `items-end` so the tab underline and the search bottom line up) and `MovieGrid` (`grid-cols-3 xl:grid-cols-4` with the desktop `MovieCard` — poster badges, title/genre, and the tab's one action; skeletons for the first page of a query; load-more). Layout: **one column at 740–1023px** (the filter card stacks above the grid), `lg:grid-cols-[300px_minmax(0,1fr)]` from `lg:`, where the content column is a single `rounded-2xl border bg-(--color-surface)` panel holding the toolbar over the grid, with a `.surface-raised` scope so the nested cards _and_ the search field step up to `--color-surface-2` (the loading bars in that scope use a muted tint — `ui/Skeleton`'s own `--color-surface-2` would vanish into the lifted card).
  - Bookability is the **active tab**, not `movie.status`: the tab is the status query the server answered, so the optional wire field can neither hide nor invent the CTA. Every desktop card links to the detail page; only the Now Showing tab adds Book Now (`/booking/{slug}/cinema`).
  - A tab switch empties the list before the page-1 fetch lands, so both grids render skeletons while `isFetching && movies.length === 0` instead of flashing the "no results" panel (the desktop header holds its result line open for the same reason).
- **Component split pattern**: Pages that render both mobile & desktop content in the same file use `block md:hidden` / `hidden md:block` (e.g. home, movies). Layout-level switching is handled by `LayoutProvider` via `matchMedia`. Each page has `components/{mobile,desktop}/` dirs. Shared components go in `components/shared/`. See `(main)/home/` as canonical example.
- **Desktop variants**: `(main)`, `(blank)`, `(sub)` and `(auth)` desktop all render through `DesktopShell` (main Header + Footer) — one chrome, and no per-group back/title strip. Because BOTH device trees render, every side effect (fetch, seat-map adoption, hold subscription, socket) must mount **once at page level** — never inside a `block md:hidden` branch — or it runs twice (see `features/booking/components/SeatMapAdopter.tsx`). Step logic therefore lives in device-agnostic controller hooks under `features/*/hooks/` and the two skins are presentation only. Inside desktop-only components use `lg:`/`xl:`, never `md:` (740px is the mobile/desktop split, so `md:` is always true there); desktop containers are `mx-auto max-w-7xl px-6 lg:px-8`. The booking flow's desktop body is `booking/components/desktop/BookingStepLayout.tsx`: a one-panel step body — `rounded-2xl border bg-(--color-surface)` — holding a `StepRail` (numbers + connectors, with the step labels appearing only at `lg:`; steps already passed are links, the current and future ones are inert) over a body that is **one column below `lg:`** — the summary rail drops under the content at full width — and becomes content + sticky rail from `lg:` up. The panel's `.surface-raised` wrapper (defined in `global.css`; also used by the movies list panel) re-points `--color-surface` at `--color-surface-2`, so every card nested inside steps up one level while the mobile skin keeps the original scale. `BookingRail` renders the adopted movie identity plus whatever the step hands it as `summary`/`action`, with `errorText` under the CTA; `RailSummary` and `CountdownRow` are the shared rail blocks. The 1-second booking clock lives in `features/booking/countdown.tsx` (`CountdownProvider`, mounted once by the booking layout; both skins read it through `useCountdownRemaining`/`formatCountdown`). The two terminal status pages are the exception to the rail rule: they have their own desktop design (hero + wide receipt + side panel — see _Success & Fail Pages_). The movies list follows the other half of the rule: `MoviesHeader` + `FilterSidebar` + the movie panel (`MovieToolbar` + `MovieGrid`) stack in one column at 740–1023px and become a `lg:grid-cols-[280px_minmax(0,1fr)]` sidebar + content grid from `lg:` (see _Movies Page Deep Linking_).
- **Sub layout** `getSubTitle()`: Uses i18n keys via `translate()` — `t("notif.title")`, `t("tickets.detail_title")`, `t("tickets.transfer.title")`, `t("tickets.transfer.confirm_title")`, `t("tickets.cancel.title")`, `t("booking.cinema.title")`, `t("booking.seats.title")`, `t("booking.snack.title")`, `t("booking.credentials.title")`, `t("booking.payment.title")`, `t("booking.status.success.title")`, `t("booking.status.failed.title")`, `t("profile.edit_profile")`, `t("profile.change_password")`, `t("profile.review_rating")`, `t("profile.wishlist_label")`. Routing prefix `/profile` → back to `/profile`. Extracted to `src/layouts/sub/utils.ts`.
- **Sub layout** `getBackHref()`: Exhaustive deterministic back-button target so it works even on a first entry with no browser history — profile sub-pages → `/profile`, `/notifications` → `/`, `/booking/[slug]/cinema` → `/movies/[slug]` (then seats → cinema, snack → seats, credentials → snack, payment → credentials), ticket routes walk one level up (`/tickets/[id]` → `/tickets`), unrecognised → `/`. The terminal booking status pages (`/status/success|failed`) return `null` → the mobile header hides its back button (both pages have a "Back to Home" CTA). Also in `src/layouts/sub/utils.ts`.
- `useSmartBack(fallbackHref)` (`src/hooks/`) — back handler that keeps real browser history when present (`window.history.length > 1`) and otherwise replaces to `fallbackHref`; used by the public movie-detail hero (`/movies` fallback) where the true origin is worth preserving.
- `postcss.config.mjs` only has `@tailwindcss/postcss` plugin.
- Prettier: `.prettierrc` (`printWidth: 100`, double quotes, trailing commas) + `.prettierignore`; `pnpm format` / `pnpm format:check`. No CI/CD workflows.

## Movies Page Deep Linking

URL scheme for movies page with query params:

```
/movies?status=now_showing
/movies?status=coming_soon&genres=Action,Drama&ratingMin=4.5&ratingMax=9&format=IMAX&ageRating=R
```

| Param                     | Values                                | Default       |
| ------------------------- | ------------------------------------- | ------------- |
| `status`                  | `now_showing`, `coming_soon`          | `now_showing` |
| `genres`                  | Comma-separated (e.g. `Action,Drama`) | empty         |
| `ratingMin` / `ratingMax` | numbers 0–10 (inclusive window)       | empty         |
| `format`                  | `2D`, `IMAX`, `4DX`                   | empty         |
| `ageRating`               | `P`, `PG-13`, `R`, `NC-17`            | empty         |

`ratingMin`/`ratingMax` are clamped into 0–10 on read and an inverted pair is dropped before it can reach the API (the backend answers `400` for `min > max`); a bound sitting on its edge (min `0`, max `10`) means "unbounded" and is omitted. The old single-bound `?rating=` param is gone — the panel and the API move together (`forbidNonWhitelisted` turns a stray `rating` into a `400`).

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
- Mock vs live: every API function is marked at its definition (`MOCK`/`LIVE` comment or section-level `TODO(api)` marker). The booking flow, tickets, wishlist and notifications are fully LIVE; the only remaining mocks are `movies` (`ALL_MOVIES` + `getAllMovies`/`getMovieBySlug`) and `reviews` filters — do not "just wire it live" without checking the payload.
- Repeated markup goes to a shared component: `booking/components/mobile/PriceBreakdown.tsx` (seats/snacks/total), `(main)/tickets/components/mobile/TicketList.tsx` (upcoming/past list).
- Movie page components are split `{mobile,desktop,shared}/`: `shared/` carries the pieces **both** device trees drive — `Tabs.tsx` and `SearchBar.tsx` (movies-context adapters) plus the `FilterCheckRow.tsx`/`FilterLabel.tsx` atoms — and is layout-free, so each tree owns its own spacing. `FilterLabel.tsx` also exports its class string (`FILTER_LABEL_CLASS`) for the desktop `FilterSection`, whose label sits inside a `<button>` and therefore has to be a `<span>` (`<p>` is not allowed there). The chip itself is shared at `components/ui/Chip.tsx` (movies filter panel + wishlist status tabs).
- All cinema data uses **PrimeSeat** brand — Vietnamese addresses, km-based distances, 24h time format.
- Inline `style={}` props are used for dynamic/computed values (gradients, animation delays, computed widths, aspect ratios). Static styling always uses Tailwind utility classes with CSS custom property syntax.
- Payment method logos use `next/image` (`public/images/VNPay.png`, `public/images/momo.png`).
- Pages using `useSearchParams()` must wrap content in `<Suspense>` to avoid 404 during SSR.

## Server Actions Convention

- `api.ts` = queries only (GET requests via `apiFetch`). No `"use server"` directive.
- `action.ts` = mutations (POST/PATCH/PUT/DELETE via `apiMutation`) as `"use server"` server actions.
- Actions return discriminated unions: `{ success: true, data } | { success: false, error, status? }` — plus the booking-specific `BookingActionResult` with server-normalized error arms.
- Three param shapes: `useActionState` style `(prevState, data)` (auth, profile), `useActionState` **form** style `(prevState, formData: FormData)` (tickets transfer), and explicit `(input, token)` (reviews, booking `action.ts`, ticket modify/cancel) — where the RAM access token must cross the wire it is passed as a server-action argument because server actions cannot read React state.
- **Never call a `useActionState` dispatcher from an `onClick`.** React 19 requires a transition; outside one the dispatcher never flips `isPending` and dev logs _"An async function with useActionState was called outside of a transition"_ — so `disabled={isPending}` guards silently fail (real double-submit risk). Put the dispatcher on a real `<form action={formAction}>`: React wraps it in a transition, `isPending` drives the spinner/`disabled`, and Enter submits. Extra fields travel as hidden inputs; a list travels as repeated names read with `formData.getAll()`.
- Ticket **transfer** actions (`createTransfer`/`cancelTransfer`/`acceptTransfer`/`declineTransfer`) forward the incoming **refresh cookie** via `getRequestCookie()` instead of a RAM token — `ReadAuthGuard` accepts Bearer **or** the refresh cookie, so this matches the ticket read path and keeps the token out of the DOM. `modifyTicket`/`cancelTicket` still take `(prevState, { …, token })`.
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
- Localized backend endpoints (movies, genres/formats/age-ratings, showtime dates, combos, food, payment methods, review filters, notifications) take `?lang=en|vn` via the `withLang(path, locale)` helper in `libs/api.ts`. Feature fetchers accept a trailing `locale` param (default `"en"`); server pages pass `await getRequestLocale()`, client contexts pass `useLocale()`.
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
- [ ] Mock data — live vs mock split marked at each function. Booking flow, tickets (listing/detail/transfer/modify/cancel), wishlist, notifications and home QuickBooking are fully LIVE (no mock file). Remaining mocks: `movies/mock.tsx` (`ALL_MOVIES`/`NOW_SHOWING`/`COMING_SOON` — desktop preview popover) + `movies/api.ts` (`getAllMovies`/`getMovieBySlug`, `TODO(api)`), and `reviews/mock.ts` (`FILTERS`/`FilterKey`; `getReviewFilters` carries a `TODO(api)`) `[blocked]`

### Level 2 — Security

- [x] Access token RAM-only; refresh token httpOnly + Secure + SameSite=Strict cookie
- [x] Open redirect sanitized (`getSafeReturnUrl` rejects `//`, `/\` and every auth entry point — `/login`, `/register`, `/forgot-password` — which would bounce the visitor straight back into a form)
- [x] No XSS sinks (0 `dangerouslySetInnerHTML`, 0 `eval`, 0 raw `<img>`)
- [x] Layered route guards (`hasSession()` → `ProtectedRoute` → cookie forward)
- [x] `next/image` host allowlist (11 explicit hosts, no wildcards)
- [x] Session/401 handling — client: `UNAUTHORIZED_EVENT` in `libs/api.ts` → `AuthContext` clears state only, `ProtectedRoute` renders the prompt in place (excludes `/auth/*`, no redirect); server: `isUnauthorizedResult()` in `libs/session.ts` → `<LoginPrompt />` in place — wired on tickets listing/detail and booking seats/status pages
- [ ] Security headers — no CSP/HSTS/X-Frame-Options/Referrer-Policy `[before deploy]`
- [ ] Reviews, booking and ticket modify/cancel actions pass raw `accessToken` as a server-action argument — the remaining places the token crosses the wire; prefer cookie `[now]` (ticket **transfer** actions already forward the refresh cookie)
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
