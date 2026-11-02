# Per-page implementation detail

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

## Home Page (streamed)

`(main)/home/page.tsx` (re-exported by `(main)/page.tsx`) awaits **only** the `locale` cookie, then returns a shell whose data blocks are independent `<Suspense>` boundaries — the page streams instead of blocking on the slowest catalog call. Fallbacks live in `(main)/home/components/HomeSkeletons.tsx`, mirroring each section's box so a section landing never shifts the rows below it; `HomePageSkeleton` (same composition) is what both `home/loading.tsx` and `(main)/loading.tsx` render, so navigation fallbacks cannot drift from the in-page ones.

- **Sections** — `(main)/home/sections.tsx` holds one async wrapper per block: `FeaturedHeroSection` / `FeaturedBannerSection` (featured), `NowShowingSection` + `NowShowingRowSection` + `ForYouSection` + `QuickBookingSection` (now showing), `ComingSoonSection` / `ComingSoonRowSection` (coming soon). Each awaits one memoized feed from `features/movies/api.ts` (`cache()`-keyed on locale) and passes plain props to the existing skin — no client component changed. Four blocks read the now-showing list and still cost one backend call per request.
- **Quick booking is a single page-level node** (`home/components/shared/QuickBookingShell.tsx`): the dates → cinemas → slots controller must exist once because both device trees render, so the shell mounts `QuickBookingProvider` and paints both skins (`hidden md:block` bar / `block md:hidden` widget) itself. That is why the trees are split into fragments around it (hero · quick booking · the rest) instead of one wrapper each: mobile keeps its rhythm via `mt-(--space-lg)` on the quick-booking shell and on the following fragment.
- **Failure is local**: each section keeps its `error` union from `apiFetch`/`settle()`, so a dead backend renders `SectionFallback` in that block only — the shell, the other sections and the quick-booking form stay usable. An empty list still renders nothing, as before.
- `MoviePreviewProvider` wraps the three desktop data sections (hover preview); it holds no data, so it sits outside their boundaries.

## Ticket Detail Page

Two-level routing:

- **Listing**: `(main)/tickets/page.tsx` — server URL pager (`?tab=&page=`, one tab fetched per render) inside main layout with BottomNav. Server gate (`hasSession()` → `LoginPrompt`) + `<ProtectedRoute>` client fallback. Mobile renders `Tabs` + `UpcomingTicketList`/`PastTicketList` + `Pager`; desktop renders `TicketsContent` (`components/desktop/TicketsContent.tsx` — the 2-column ticket-stub card grid over a title band with the tab links). Each upcoming card wears its status on the **poster**: a full-width `TicketCountdown` ribbon (client-only, ticks against the absolute showtime deadline, compact units — the poster is ~96 px wide) for a usable ticket, or the gold `tickets.transfer.pending_badge` ribbon while a transfer is in flight (a countdown would be misleading). The tag row keeps a gold pill carrying the one thing the ribbon cannot fit — the recipient name (`features/tickets/adapters/ticket.ts` → `isTransferring`/`transferRecipientName`).
- **Detail**: `(sub)/tickets/[id]/page.tsx` — renders components directly (no props). **Layout** (`layout.tsx`) is the server component that calls `getTicketById(id, await getRequestCookie())`, wraps children in `<TicketDetailProvider>`. Components read ticket from `useTicketDetail()` context.

Detail page components under `(sub)/tickets/[id]/components/`:

- `mobile/TicketInfo.tsx` — hero poster, theater/location, seat, food & drink, QR code, payment summary
- `mobile/TicketActions.tsx` — owner: Download Ticket (only while a scan payload exists) + Cancel & Refund (only for success/confirmed/pending) + Transfer Ticket (upcoming only). Recipient (`viewerRole === "recipient"`): Accept Transfer + Decline only.
- `mobile/QRCode.tsx` — `qrcode.react` rendering the backend's signed scan payload (`ticketId.qrToken.signature`) as-is; the URL form (`https://primseat.com/tickets/{id}`) is only a fallback for values without a payload (never called with a bare id from the detail page)
- `desktop/TicketDetail.tsx` — the desktop detail: `TicketHeader` band, the `TicketOverviewCard` (identity + price breakdown) on the page background, and a sticky rail (`lg:sticky lg:top-24`) holding `TicketQrPanel` + `TicketActionsPanel` (both drive the shared `useTransferDecisions` / `useCancelFlow` machines); the body is the `lg:grid-cols-[minmax(0,1fr)_360px]` two-column split.

Past tickets show the same detail layout but without action buttons.

**QR gating**: the backend issues `qrCode`/`qrToken` **only** for a usable ticket (owner + `active` + not revoked) — a used/expired/refunded/cancelled ticket and a pending recipient get neither. The FE never fabricates a QR: `TicketInfo` renders `<QRCode value={ticket.qrCode}/>` only when the payload exists (no `ticket.id` fallback) and otherwise shows a neutral panel labelled with `PAST_STATUS_META` (`tickets.detail.qr_invalid_hint` when the status is not a past one), and `TicketActions` hides **Download Ticket** whenever `ticket.qrCode` is absent. Rationale: a dead QR is misleading — the gate (`POST /tickets/check-in`) rejects it with `TICKET_NOT_ACTIVE` / `TICKET_EXPIRED`.

**Past-status badges**: the backend persists the terminal status (`used` | `expired` | `cancelled` | `refunded`) — `toPastStatus` (adapters) passes it straight through and `PastCard` reads `PAST_STATUS_META[status]` (`features/tickets/constants.ts`) for the badge label (`translate(meta.labelKey)` → `tickets.used`/`tickets.expired`/`tickets.refunded`/`tickets.cancelled`). Use the `isPastStatus()` guard before indexing the map (the detail status union also carries upcoming values). Never derive "expired" from the showtime client-side: the backend expiry sweep (minute cron) is the authority, and a ticket that was checked in, refunded or cancelled must keep showing _that_ status. **No muted styling** — every past card renders at full opacity.

**Transfer provenance**: `GET /tickets/past` also returns the tickets the viewer transferred away, so `toPastTicket` maps the summary's settled-transfer field to `PastTicket.transferProvenance` (deliberately not `transfer` — that name is the _open_ transfer detail on `UpcomingTicket`, and the detail context narrows on it) and `toPastStatus` returns the viewer-derived `"transferred"` status (a `TicketStatus` member that exists only on the FE) for `direction: "sent"`. `PastCard` shows the provenance badge (`tickets.transfer.sent_badge` / `received_badge`) **instead of** the terminal badge whenever `transferProvenance` is present, and a sent card names the recipient inside the info block (under the showtime) — the "View Details" link stays, because the detail endpoint serves a third viewer role. `toDetailTicket` turns `viewerRole: "sender"` into a `PastTicket` (`status: "transferred"`) whose `transferProvenance` also carries `amount` and `settledAt`; `TransferProvenance` (`(sub)/tickets/[id]/components/shared/`) renders that as the closed history page — badge, recipient, frozen amount, settle date and the "no longer yours" note — in place of the credential panel on both skins, and the action panels render nothing when no verb is left.

**Transfer expiry** (no FE code): the backend closes a `pending` transfer once its accept window ends (2 hours before the showtime starts) — the row becomes `expired`, the sender's QR is re-armed and both parties get a notice (`transfer_expired` for the sender, `transfer_offer_expired` for the recipient). `expired` never reaches the wire (listings expose `pending`/`accepted` only), so the only visible effect is the `pending_badge` ribbon and the recipient's offer panel disappearing — driven by the notification push above. Never compute this cutoff client-side.

**Live refresh** (`features/tickets/components/TicketRealtimeRefresh.tsx`): the ticket _writer_ is often not the viewer, so both the listing (`<TicketRealtimeRefresh />`, no id) and the detail layout (`<TicketRealtimeRefresh ticketId={...} />`) stay honest about a transfer the other side accepted/declined/cancelled. Triggers: the notification push (`notification:new` → provider dispatches `TICKET_UPDATED_EVENT` with `{ ticketId }`) and returning to a hidden tab; a 15 s throttle coalesces them. A listener reacts unless the event names a _different_ ticket. On the detail page the ticket is re-read **before** refreshing — `getTicketById` answering 404 means ownership moved away, so the visitor is sent to `/tickets` (`router.replace`) instead of rendering the layout's `notFound()`; otherwise `router.refresh()`.

## Ticket Transfer

Two sub-routes under `(sub)/tickets/[id]/transfer/`:

- `transfer/page.tsx` — wraps **both** device trees with one `TransferProvider` (they both render, so a per-branch provider would fork the draft), then renders `SeatSelector`, `RecipientInput`, `TransferBottomBar`. Mobile/desktop split via `block md:hidden`.
- `transfer/confirm/page.tsx` — **server component** that reads `searchParams` (`seats`, `recipient` = email, `transferSnacks`), calls `getRecipient()` (exact email), redirects to transfer page if invalid. Renders `ConfirmCard`, `ConfirmBottomBar`.

Both have `loading.tsx` with device-aware branches (`block md:hidden` + `hidden md:block` around the mobile skeleton and the desktop skeleton).

Components under `transfer/components/`:

- `mobile/SeatSelector.tsx` — seat toggle for transferable seats
- `mobile/RecipientInput.tsx` — exact-email recipient lookup (valid email → `getRecipient()` → `GET /user/search`; adopts the single match into the transfer context, shows "not found" otherwise)
- `mobile/TransferBottomBar.tsx` — sticky bottom bar with transfer CTA → links to confirm page (passes the recipient email)
- `desktop/TransferContent.tsx` — the recipient lookup (`components/shared/RecipientField.tsx`) beside the `TicketOverviewCard`; the CTA keeps the transfer warning and stays disabled until a recipient resolves (the draft lives in `TransferContext`, which both trees share at page level).

Components under `transfer/confirm/components/`:

- `mobile/ConfirmCard.tsx` — transfer summary (seats, recipient, snacks toggle)
- `mobile/ConfirmBottomBar.tsx` — the mobile layout around the shared confirm control: `features/tickets/hooks/useTransferSubmit.ts` resolves the selected seat labels to backend seat UUIDs at render and binds `createTransferAction`, `features/tickets/components/TransferConfirmForm.tsx` renders the repeated hidden `seatId` inputs inside a real `<form action={formAction}>` (plus hidden `ticketId`/`recipientEmail`/`transferSnacks`), and the hook redirects to the ticket detail from an effect on success (never during render). The CTA is `type="submit"` and disabled when no transferable seat resolves.
- `desktop/ConfirmContent.tsx` — the confirm rail: the recipient + the shared `TransferConfirmForm` (real `<form action={formAction}>`) + cancel; the recipient arrives as a prop from the server page, which already validated `?recipient=`.

`TransferContext.tsx` (`features/tickets/contexts/`) manages `selectedSeats`, `recipient`, `transferSnacks` state. `TicketDetailContext.tsx` provides `{ ticket, viewerRole, transfer, incomingTransfer }` from layout.

### Incoming transfers (recipient side)

`GET /tickets/:id` also answers for the recipient of the ticket's open transfer, so the `transfer received` notification (which already links to `/tickets/{ticketId}`) opens a real page. The payload is view-shaped by the backend:

- `viewerRole: "owner" | "recipient"` — `TicketDetailContext` exposes the resolved value (defaults to `owner` for list-derived data).
- Owner: `transfer` (who it is going to) + the QR.
- Recipient: `incomingTransfer` (`{ id, sender, transferredSeats, transferSnacks }`) and **no QR** (`qrToken`/`qrCode` are null/absent until they accept).
- `TicketInfo` renders the offer panel instead of the QR; `TicketActions` renders Accept/Decline instead of Download/More actions.
- Accept → `acceptTransferAction` (`POST /tickets/transfers/:id/accept`) then `router.refresh()` — the same URL re-renders as the owner view with the QR. Decline → `declineTransferAction` then `router.replace("/tickets")`. Both are real `<form action={formAction}>` submits (hidden `transferId`), and `isAccepting || isDeclining` disables **both** buttons while a decision is in flight.
- The owner's Cancel Transfer button (`TicketInfo` pending-transfer panel) is likewise a `<form action={formAction}>` with a hidden `ticketId`, refreshing on success.
- `409 TRANSFER_NOT_PENDING` is treated as "already handled" (the actions carry `status`/`code` through the union), not as an error.

### Transfer payment (sender side)

`transfer/page.tsx` wraps **both** device trees with one `TransferProvider` (they both render, so a per-branch provider would fork the draft), then renders `SeatSelector`, `RecipientInput`, `TransferBottomBar`. Mobile/desktop split via `block md:hidden`.

- The UI allows the owner to select **transferable seats only** (those not already transferred, respecting SweetBox pairing, SweetBox cell is taken if any of its chairs is selected, seat count matches SweetBox rules). Seats are those the owner owns, are upcoming (showtime not started), and are transferable (status pending, no other open transfer for that seat).

- The preview shows `tickets.transfer.pending_badge` + recipient name (once resolved) on the listing card. Owner selects a recipient email; validation includes:
  - `getRecipient(email)` must return an exact match (GET `/user/search`)
  - Recipient cannot be the sender (409 CONFLICT)
  - Recipient may not have an open transfer request for the same ticket (409 CONFLICT)
  - Recipient's account must be active (409 CONFLICT)

- Recipient validation renders inline for mobile, as a separate recipient lookup panel for desktop.

- A transfer can be cancelled at any time before acceptance: the sender sees a "Cancel Transfer" button in the transfer panel, which posts `{ ticketId }` via `cancelTransferAction` (POST `/tickets/transfers/:id/cancel`).

- Once the recipient accepts, `awaiting_payment` is set and the sender must pay through `/tickets/:id/transfer/payment`:
  - `transfer/payment/page.tsx` is a real `<form action={formAction}>` for both skins. `useTransferPayment` (device-agnostic, mounted once by `TransferPaymentScreen` above both skins) opens the payment intent (`GET /payments/:transferId/intent` and `POST /payments/:transferId/create` if missing) and polls every 3 s (`getPaymentIntent`) with three UI states:
    - **Open**: QR code for the amount (`Booking.totalPrice`) that the recipient must pay to the sender; the QR shows until captured (IPN); the panel includes a "Cancel Transfer" button (POST `/tickets/transfers/:id/cancel`) available while the transfer is pending OR `paymentExpiresAt <= now` (payment window closed), otherwise `409 TRANSFER_PAYMENT_IN_PROGRESS`.
    - **Pending**: QR rotates (once at settle), payment window starts, `paymentExpiresAt = now + 10:00`
    - **Closed**: `paymentExpiresAt <= now`, payment not captured → QR expires, panel shows "Payment expired. The transfer is cancelled. Choose seats again" CTA to `/tickets/:id/transfer`.
  - The payment step sets `paymentExpiresAt` in the payment row (unique per transfer), and `awaiting_payment` transition includes this field; the UI disables the "Cancel Transfer" button after `paymentExpiresAt <= now`.
  - The transfer step is gated: only the sender can initiate or cancel before payment, only the recipient can accept/decline before payment, both sides can see status, and the recipient cannot pay (they can only accept).

- The recipient accepts via `acceptTransferAction` (POST `/tickets/transfers/:id/accept`): acceptance moves the transfer to `awaiting_payment` and starts the 10-minute payment window. If the recipient accepts after `paymentExpiresAt` (closed), `409 TRANSFER_PAYMENT_EXPIRED` and the transfer expires (owner must re-send).

- The recipient's payment window (`paymentExpiresAt`) is a field on the payment row (kind=transfer), owned by the backend; the UI only knows to disable actions and show the expiry warning, never compute the deadline.

- The payment QR page (`transfer/payment/page.tsx`) renders `<TransferPaymentScreen>` with:
  - **Open**: QR code + recipient payee name + amount (`Booking.totalPrice`), "Cancel Transfer" button (POST `/tickets/transfers/:id/cancel`), "Check Status" CTA to retry the intent.
  - **Pending**: 10-minute clock, "Cancel Transfer" button (disabled if payment started), "Check Status" CTA.
  - **Closed**: payment expired, panel shows "Payment window closed. Transfer cancelled. Choose seats again" CTA to `/tickets/:id/transfer`.
  - Both device trees render: mobile: full-width QR + amount + CTA; desktop: two-up with QR left + amount/status right + cancel CTA.

- Transfer expiry is server-controlled: after acceptance (`awaiting_payment`), `paymentExpiresAt` is written and expires after 10 min. If not captured by then, the payment window closes, `paymentExpiresAt` is set to past, and the transfer reverts to `pending` (sender must re-send). The UI disables "Cancel Transfer" after `paymentExpiresAt <= now`.

- The recipient's QR for the ticket is not issued until payment (`IPN capture`), so the owner sees a neutral pending panel (no QR) until they pay.

- A paid transfer uses the same QR layout as a paid booking (`transfer/payment/page.tsx`): QR shows the signed payload (`ticketId.qrToken.signature`), amount is `Booking.totalPrice`, recipient sees "The recipient must pay this amount to the sender" instead of "Pay for your ticket", and after payment lands the sender sees "Payment received" and the QR becomes the ticket QR for the recipient.

## Ticket Modify

Five sub-routes under `(sub)/tickets/[id]/modify/` — there is **no payment step**: the backend accepts only changes that keep the amount paid identical (same cinema, same seat-type mix), so the review CTA submits and lands straight on success.

- `modify/page.tsx` — type picker (`TypeCards`): showtime / seats / both. The choice lives in `ModificationContext` (`ModificationProvider` wraps the segment in `modify/layout.tsx`), so every later step reads the same draft.
- `modify/showtime/page.tsx` — `ShowtimeDataLoader` fetches `GET /tickets/:id/modify/eligible-showtimes?lang=<locale>` (same movie, same cinema, still outside the cutoff; `format` is catalog content, so the read takes the locale). `EligibleShowtime.requiresSeatSelection` is the server's answer: a target room other than the ticket's needs a fresh seat pick, so `BottomBar` routes to `seats` instead of `review` in that case.
- `modify/seats/page.tsx` — `SeatMapWrapper` loads the chosen showtime's map (the current one for a seats-only change); the SweetBox pair rule and the seat count come from the ticket.
- `modify/review/page.tsx` — `ComparisonCard` (current vs new showtime/seats) + `PriceSummary` (total paid, "same-price change — no extra charge") + `limit_notice` (one change per ticket). `BottomBar` → `useModifySubmit` posts `{ newShowtimeId?, newSeatIds? }` (absent keys mean unchanged) through `modifyTicketAction` and routes to `success`; a rejection renders inline through `BookingBottomBar`'s `errorText`, localized from the backend `code` by `features/tickets/utils.ts` `getModifyErrorMessage` (an unmapped code falls back to the server message). `TICKET_TRANSFER_PENDING` is its own answer: cancelling the offer is the sender's decision, so the server refuses rather than auto-closing it.
- `modify/success/page.tsx` — confirmation linking back to the ticket.

Rules the FE must not re-implement (backend `api-contract.md` §7.2): same movie, same cinema, one change per ticket, same seat-type multiset, ≥ 1 h before the current showtime, QR rotated after success. A price change answers `409 MODIFICATION_REQUIRES_PAYMENT`; cancel + rebook is the only path until top-up/refund exists. The whole modify cluster now ships a desktop skin: the type → showtime → seats → review → success ladder runs through the shared modify step hooks (`useModifySteps` + `useModifySubmit`) and the `ModifyStepLayout`/`ModifyRail`/`ModifyStepRail` trio, and the ladder is derived from the draft so a skipped step is never painted as done.

## Ticket Cancel & Refund

Single route under `(sub)/tickets/[id]/cancel/` — no separate routes for success/failed:

- `cancel/page.tsx` — **client component**; the 4-view machine (`idle` summary / `processing` overlay / `success` / `failed` = refused) lives in `features/tickets/hooks/useCancelFlow.ts` so both device skins drive it from one place. Reads ticket from `useTicketDetail()` context (parent layout). Shows total paid and the refund (= 100% of it, no fee) locally; the backend owns the time gate.
- `cancel/loading.tsx` — skeleton matching summary layout
- `cancel/components/mobile/CancelSummary.tsx` — movie info card (poster, title, cinema, datetime), seats, price breakdown (ticket + combo), total paid, cancellation fee, refund amount, refund-to section (payment method from ticket), cancellation policy link, Continue button
- `cancel/components/mobile/CancellationPolicySheet.tsx` — bottom sheet with 4 policy rules, Done button. Uses `ActionSheet` wrapper.
- `cancel/components/mobile/ConfirmationSheet.tsx` — bottom sheet with refund amount, "Cancel Booking" (red) + "Keep My Ticket" buttons. Uses `ActionSheet` wrapper.
- `cancel/components/mobile/CancelResult.tsx` — success state: animated green checkmark (same pattern as booking status success), refund info card with "Processing" badge, View Ticket + Back to Home buttons. Failed state: animated red alert with shake keyframe (same pattern as booking status failed), refund info card with "Refund Failed" badge, Try Again + Contact Support buttons.
- `cancel/components/desktop/CancelContent.tsx` — the desktop cancel step: summary panel + inline policy rail + `ConfirmDialog` (mounted only while open, focus hand-back on unmount) driven by the same `useCancelFlow` machine as mobile.

Entry point: `TicketActions.tsx` Cancel & Refund row → `router.push(/tickets/${id}/cancel)`. Currently shown only when `canCancel` is true (status success/confirmed/pending) and no pending transfer.

Cancellation is **100% with no fee**; the only gate is time — the backend refuses a cancel inside 2 hours of the showtime (`MODIFICATION_NOT_ALLOWED`) and the failed view renders that reason, localized by `getCancelErrorMessage`, instead of inventing a refund amount. `cancelTicketAction` is the live server action (`POST /tickets/:id/cancel`). After success, "View Ticket" calls `router.replace()` + `router.refresh()` to re-fetch server-side ticket data.

## Profile Page

`page.tsx` is a **server component** wrapped with `<ProtectedRoute>`, renders `Avatar`, `UserInfo`, `ProfileMenu` directly (no props). All client components read user from `useAuth().user` context.

- `components/mobile/Avatar.tsx` — conic-gradient ring around the shared `ui/Avatar` (reads `user.avatarUrl` from auth context with the `DEFAULT_AVATAR_SRC` brand fallback; external URL from Contentful via `images.ctfassets.net` in `remotePatterns`)
- `components/mobile/UserInfo.tsx` — name + tier badge (Star icon, reads `user.name` from auth context)
- `components/mobile/MenuSection.tsx` — reusable menu card with icon rows, hover via Tailwind `hover:bg-(--color-surface-2)`
- `components/desktop/ProfileContent.tsx` — desktop overview: identity hero + 3 stat tiles (upcoming tickets / reviews / wishlist, counts from server, `—` on fetch failure) + account details; wraps in `AccountShell`
- Shared desktop chrome for the whole account area: `features/profile/components/desktop/{AccountShell,AccountNav,AccountSkeleton}.tsx` — `AccountShell` is the eyebrow + gold-bar `h1` + description/action row over a sticky nav and one `rounded-2xl bg-(--color-surface)` panel whose `.surface-raised` inner wrapper lifts every nested card; the tablet band (740–1023) flattens the nav into a pill strip. `AccountNav` derives the active entry from `usePathname()` through `accountSectionForPathname()` (longest href wins, trailing slash tolerated) instead of taking an `active` prop, so a page cannot disagree with the nav about where it is, and `features/profile/constants.ts` is the single source of nav entries. Each desktop account page owns its `mx-auto w-full max-w-7xl px-6 py-8 lg:px-8` band (the sub layout is a bare `DesktopShell`), and the desktop branch of every `loading.tsx` repeats that band around `AccountSkeleton`.

No BottomNav or TopNav — layout provides both. Menu items use i18n keys `profile.*`.

## Change Password Page

`(sub)/profile/password/page.tsx` — thin compose (mobile + desktop):

- `components/ui/PasswordField.tsx` (shared) — reusable password input with Eye/EyeOff toggle, focus + error border states
- `components/shared/PasswordRequirements.tsx` — card around the shared `ui/PasswordChecklist` (the page owns the card + title, the rules and their live state come from `PASSWORD_RULES`)
- `components/mobile/PasswordForm.tsx` — orchestrator with `validate()`, `touched` state, validation on submit, UPDATE PASSWORD + CANCEL actions; the CTA is `disabled` while `PASSWORD_CHANGE_ENABLED` is false
- `components/desktop/ChangePasswordContent.tsx` — form column (fields + `ui/ErrorAlert`) beside the shared `ui/PasswordChecklist`; the CTA is honestly disabled and an info box carries `profile.password.unavailable`, both gated by `PASSWORD_CHANGE_ENABLED = false` in `features/profile/constants.ts` because the backend has no change-password endpoint. Neither skin pretends the form works.

Validation: Current Password (required), New Password (required + min 8 chars + uppercase + number + special char), Confirm Password (required + must match). `showErrors = touched && !isValid`.

Sub layout routing: `getSubTitle()` returns "Change Password". Back button goes to `/profile` (handled by existing `/profile` prefix rule).

## Edit Profile Page

`(sub)/profile/edit/page.tsx` — thin compose (mobile + desktop):

- `components/mobile/ProfileForm.tsx` — profile form with fields, uses `updateProfileAction` server action via `useTransition`
- `components/mobile/AvatarEditor.tsx` — avatar editor; the camera control is disabled and the panel states `profile.edit.photo_unavailable` because the backend has no avatar upload
- `components/desktop/EditProfileContent.tsx` — avatar column + two-column field grid driven by the same `useProfileForm` controller as the mobile form (so the DOB round-trip fix cannot drift between skins); actions sit right-aligned (`ui/Button fullWidth={false}`).

Validation: Full name (required), phone (required), DOB as date picker. `loading.tsx` present.

## Reviews & Rating Page

`(sub)/profile/reviews/page.tsx` — reviews listing:

- `components/mobile/ReviewList.tsx` — review list wrapper
- `components/mobile/ReviewCard.tsx` — individual review card with rating, text, date
- `components/mobile/FilterBar.tsx` — filter bar for rating-based filtering
- `components/shared/StarRating.tsx` - star rating display component (the movie-level fractional row); a **single review** renders the compact `ui/RatingBadge` (`★ 8/10`) instead
- `components/shared/LoadMoreButton.tsx` — load more pagination
- `components/desktop/ReviewContent.tsx` — count line + `ui/Tabs stretch={false}` sort + `ReviewRow` cards (poster, title, rating, `ExpandableText` body, two-tap delete) + Load more + `EmptyState`; the listing state (paging, sort, delete) comes from `features/reviews/hooks/useMyReviews.ts`, shared with the mobile list. `ReviewRow`'s destructive confirm is its own red `<button>` (Button `size="sm"` metrics) rather than a recoloured gold `primary`.

The page fetches `getMyReviews({ skip: 0, limit: 10, sort: "recent" }, cookie, locale)` and `getReviewFilters(locale)` server-side and hands both to either skin. `loading.tsx` present.

## Wishlist Page

`(sub)/profile/wishlist/page.tsx` — server component: fetches live `getWishlist(cookie, locale)` (no mock — entries carry the full movie card via `WishlistItem`; failure → local draft fallback), mounts `WishlistHydrate`, then composes:

- `components/mobile/WishlistHydrate.tsx` — effect-only mount adoption of server ids into the draft (booking `CinemaAdopter` pattern)
- `components/mobile/WishlistMovieList.tsx` — count sentence (`count_prefix`/`count_suffix`) on top, search bar (title + genre, debounced) + All/Now Showing/Coming Soon chips (shared `ui/Chip` `variant="outline"`, reviews style) + single-column list; filtering is client-side; local-only ids without a BE payload never render; `isBookable` reads `movie.status`
- `components/mobile/WishlistCard.tsx` — vertical card (16:9 poster banner on top + title/meta row), Book CTA for now-showing or a muted "Coming Soon" label otherwise, heart toggle (undoable removal via parent snackbar)
- `components/mobile/EmptyState.tsx` — empty state when wishlist is empty
- `components/desktop/WishlistContent.tsx` — `SearchBar` + outline `ui/Chip` status tabs + poster grid (`grid-cols-3 xl:grid-cols-4`) of `WishlistPosterCard`, undoable removal via `ui/UndoSnackbar`; filtering/undo state comes from `features/wishlist/hooks/useWishlistBrowser.ts`, shared with the mobile list. `WishlistEmptyState` lives in `features/wishlist/components/` because both skins render it.

Uses `WishlistProvider` from `features/wishlist/contexts/WishlistContext.tsx` at root layout. `loading.tsx` present.

## Notifications

One inbox, two surfaces, one state.

- **Data** — `NotificationProvider` (`features/notifications/contexts/NotificationsContext.tsx`) is the client source of truth: SSR-seeded by the root layout (cookie fetch, current locale), kept live by the `notification:new` socket, re-read on reconnect and on a locale switch. Both surfaces read `useNotifications()`, so the bell badge, the tab counts and the rows can never disagree. The list is gated on `isAuthenticated || isLoading` — the server has no session state, so `isAuthenticated` is `false` while the server renders and a plain `isAuthenticated` gate would discard the seed and flash an empty inbox; `isLoading` keeps it open until the restore settles, and a logged-out visitor seeds `[]` anyway. The FE asks for `?limit=50`; older notices are out of reach until paging is added (the backend already reports `page`/`hasNextPage`).
- **Mobile** — `(sub)/notifications/page.tsx` → `components/mobile/NotificationList.tsx` + `NotificationCard` (unchanged): mark-all-read strip, cards, tapping a card marks it read.
- **Desktop** — `components/desktop/NotificationList.tsx`: one reading column (`mx-auto w-full max-w-4xl px-6 py-8 lg:px-8` — an inbox stretched to 7xl is mostly whitespace), a gold-bar `h1` + `notif.subtitle` + an outline mark-all-read CTA, then a `bg-(--color-surface)` panel (`.surface-raised` inside) holding an All/Unread `ui/Tabs` bar over `divide-y` rows. The tabs pass `idBase="notifications"`, so the region is a real `role="tabpanel"` wired with `aria-controls`/`aria-labelledby`. Filtering is **local state**: the list is already loaded, so switching tabs must not cost a navigation and the URL would add nothing the back button can use. The Unread tab keeps only unread rows and each tab has its own empty state (`notif.no_notifications` vs `notif.empty_unread_*`).
- **Rows** — `features/notifications/components/NotificationRow.tsx` with `density="compact"` (popup: 36 px tile, clamped message, read rows `opacity-55`) or `"comfortable"` (page: 44 px tile, three-line message, chevron cue, read rows keep contrast — only the title drops to the secondary colour). The whole row is the target and is a `<Link>` when the notice carries an action, a `<button>` otherwise — never a link nested inside a link.
- **Bell** — the header popup stays the quick view; its footer links here.

## Cinema & Showtime Page

`(sub)/booking/[slug]/cinema/page.tsx` — streamed. The page awaits `params`/`searchParams`, the locale and `getMovieDetail(slug)` (the booking flow's **only** movie-detail fetch — `REVALIDATE_MOVIE_DETAIL` = 1 h, adopted into the draft for every later step; it decides the 404 and feeds the mobile summary and the desktop rail), then paints both trees' chrome. The schedule streams from `sections.tsx`:

- `CinemaScheduleSection` — day strip + search + cinema cards, one boundary per tree.
- `CinemaAdoptSection` — the `?cinema=`/`time=`/`showtimeId=` adoption plus the `BookingMovie` snapshot, in a `fallback={null}` boundary at page level (effect-only, must mount once for both skins).
- Both read one memoized `getMovieSchedule(slug, locale, today, requestedDate)` (`features/showtimes/api.ts`: dates and the opening day's slots go out together, `?date=` wins over the resolved default), so the two skins cost one round trip. The page passes `requestedDate` only after `DATE_PATTERN` validates it.

Mobile composition:

- `components/mobile/StepBar.tsx` — 5-step booking progress bar (SELECT CINEMA → SELECT SEATS → FOOD & DRINKS → CONTACT INFO → PAYMENT)
- `components/mobile/MovieSummary.tsx` — mini poster + movie info (duration, genre, ageRating, rating)
- `components/mobile/SearchBar.tsx` — cinema/location search input
- `components/mobile/CinemaList.tsx` — list wrapper + empty state (cinema cards rendered inline)
- `components/mobile/BottomBar.tsx` — sticky bottom bar with selection summary + "SELECT SEATS" CTA → links to `/booking/[slug]/seats`; it reads the cinema name/address/time from the draft (written by `resolveSlotSelection`), so it paints without the streamed schedule
- `components/desktop/CinemaContent.tsx` — the step shell (`BookingStepLayout`) + rail; the schedule arrives as the `slots` prop, the movie identity comes from the page's fetch

State lives in the booking reducer (`useBooking()`).

## Seat Selection Page

`(sub)/booking/[slug]/seats/page.tsx` — streamed: the page awaits `params`/`searchParams` only (a deep link without `?showtimeId=` redirects to `/booking/[slug]/cinema`) and paints the chrome — `StepBar` (step 2), `CountdownBanner`, the bottom bar. The grid streams from `sections.tsx` (`MobileSeatMapSection` / `DesktopSeatMapSection`, one boundary per tree) and `SeatMapAdoptSection` rides a `fallback={null}` boundary at page level. `getSeatMap` and `getShowtimeById` are called independently from their feature APIs and the same promises feed both skins and the adopter; the seat-map response is adapted once.

- `components/mobile/CountdownBanner.tsx` — session-deadline countdown: shows `countdownStartTime + countdownSeconds` once the session started (hold re-presses never move it), `holdExpiresAt` is only a fallback for a session the tab forgot, static `countdownSeconds` (10:00) pre-CTA. The value derives from the absolute deadline (no setState-in-effect).
- Seat map rendered inside the streamed section (fixed layout, no zoom/pan — `SeatGrid` fits the viewport width). Screen rendered as curved SVG arc. Max seats comes from the seat-map wire (`maxSeats`, currently 8), counted in CHAIRS (`seatIds.length`, so a sweetbox pair counts 2).
- `components/mobile/BottomBar.tsx` — sticky bottom bar, selected seats + total (per-cell `price` from the wire — sweetbox cell price is the price of both chairs), "Continue to Snacks" CTA. The CTA is a handler, not a link: it is where the seat hold is finally created (`PUT /seat-holds`), then `setHoldExpiresAt` + `startCountdown` + `router.push('/snack')` on success; `409` → `recoverSeatMap` + inline `booking.seats.hold_taken`; any other failure → inline `booking.seats.hold_failed`. Picking seats writes nothing to the server.

Seat-hold lifecycle — the hold is created **at the seats-step CTA** (`PUT /seat-holds`); re-pressing only re-syncs the hold to the new selection, never the session. The 10-minute session is enforced by `SessionExpiryWatcher` (mounted once in `booking/[slug]/layout.tsx`, so it fires on every step — not just seats):

- CTA (seats `BottomBar`): `PUT /seat-holds` (set-replacement, TTL 600 s) → adopt `expiresAt` as `holdExpiresAt`, `startCountdown()` (first press starts the session, later presses no-op), advance to the snack step. A `409 SEAT_TAKEN` refetches the map via `recoverSeatMap` (`utils/seatMap.ts`) and stays on the step — the taken cells come back `occupied`, the survivors stay selected for a retry.
- Mount: `GET /seat-holds?showtimeId=` restores the caller's live hold (seat ids re-selected, `expiresAt` adopted as `holdExpiresAt`); expired/empty holds are ignored. The session clock itself restores from `sessionStorage`, so a hard refresh keeps the original deadline.
- Selection change: **no network call.** Emptying the selection while a hold is live (`holdExpiresAt !== null`) sends `DELETE /seat-holds?showtimeId=` — the PUT body is `@ArrayNotEmpty` server-side. Abandoned holds are reaped by the backend cleanup cron (1 min).
- Session expiry (1 s interval in `SessionExpiryWatcher` vs the session deadline) → `DELETE /seat-holds` even when the hold TTL is still valid + selection cleared + `expireSession()` (clock reset, draft kept) so a re-pick + CTA starts a new session.
- Hold expiry (1 s interval in `useSeatHolds` vs `holdExpiresAt`) → safety net for the backend dropping a hold early: selection cleared + `holdExpiresAt` nulled.
- The backend now enforces the SweetBox pair rule server-side (`PUT /seat-holds`, `POST /bookings`, modify-seats): a partial cell answers `400 VALIDATION_ERROR` with the offending cell in the message. The FE always toggles whole cells, so this should never fire — if it does, recover the map like a `SEAT_TAKEN`.
- `GET /bookings/:id` returns `expiresAt: null` once the booking is `paid` (the backend clears it on settle); keep the countdown/null-guard logic as-is (`expiresAt: string | null`).
- The settle path is `POST /payments/:bookingId/create` (intent) + the QR page: the booking step never charges, it only creates the booking. `POST /payments/:bookingId/pay` still exists as the pre-intent **legacy** route (single-settle and idempotent — a double submit answers `200` twice with the same `transactionRef`), but the app no longer calls it. A `409 INVALID_STATE` on either path also means "the showtime already started".
- Booking summary syncs from `?showtimeId=` when the step is opened directly.

Booking flow navigation:

- Movie detail `BookTicketCTA` → `/booking/[slug]/cinema` (passes `?showtimeId=X` when a showtime slot was picked on the detail page)
- Cinema BottomBar → `/booking/[slug]/seats?showtimeId=...` (active only when cinema+time selected)
- Seats BottomBar → `PUT /seat-holds` (creates the hold + starts the countdown) → `/booking/[slug]/snack`
- Snack BottomBar → `/booking/[slug]/credentials`
- Credentials BottomBar → `/booking/[slug]/payment`
- Payment BottomBar → `createBookingAction` → `/booking/[slug]/payment/qr?bookingId=...&method=...` → the QR page opens the intent and routes to the success/failed page (see Payment QR Page)

## Snack Page

`(sub)/booking/[slug]/snack/page.tsx` — streamed: the page awaits the locale only, so `StepBar` (step 3), `CountdownBanner`, `SnackHeader` and the bottom bar paint immediately. Combos and the food/category catalog use separate async sections and separate API calls; each promise is shared by the mobile and desktop boundaries. The food items and categories stay together because the section groups items by category.

- `components/mobile/ComboCard.tsx` — combo card with image (null-safe), name, description, price, quantity stepper
- `components/mobile/FoodItemCard.tsx` — food item card with Next.js `<Image>` (null-safe), name, price, quantity stepper
- `components/mobile/CategorySection.tsx` — category header + food item list
- `components/mobile/Stepper.tsx` — quantity stepper (minus/plus buttons)
- `components/mobile/BottomBar.tsx` — sticky bottom bar, snack total + "Continue" CTA → `/booking/[slug]/credentials`

Section titles (`Quick Combos`, `Pick & Mix`) use `--color-gold-dark`. Prices use `--color-gold-light`. Stepper quantities are derived from the selected arrays in the booking draft — zeroing a stepper updates the totals immediately and back-navigation restores the quantities without any sync effect.

## Credentials Page

`(sub)/booking/[slug]/credentials/page.tsx` — **server component** that fetches nothing (the movie comes from the draft, the contact lives in `BookingProvider`) and wraps its output in `<RequireDraft slug={slug}>` so a cold deep link or hard refresh bounces back to the cinema step instead of rendering an unfillable form:

- Shared state: `ContactForm` syncs its local fields into the booking draft via `setCredentials`; `BottomBar` derives `isValid` from the same draft with `createContactSchema(translate)` — no separate credentials context
- `components/ui/InputField.tsx` (shared) — reusable text input with label
- `components/shared/PhoneField.tsx` — phone input with country code selector (CDN flags via `flagcdn.com/w20/{flag}.png`)
- `components/ui/FormField.tsx` (label lives inside the field) — field label component
- `components/shared/ContactForm.tsx` — prefill priority: saved BookingContext contact info → logged-in auth user (`fullname`/`email`) → empty
- `features/booking/components/OrderSummary.tsx` — takes no props; reads the movie snapshot (`BookingMovie` adopted at the cinema step) plus cinema, room, date/time, seats, seat type, combos, foods and total from BookingContext. Shared with the payment step on purpose: the recap must not change shape between two adjacent steps.
- `components/mobile/BottomBar.tsx` — sticky bottom bar, total + "Continue to Payment" CTA → `/booking/[slug]/payment`, derives `isValid` from the booking contact draft

## Payment Page

`(sub)/booking/[slug]/payment/page.tsx` — streamed: the page awaits `params` + the locale only, so `<RequireDraft slug={slug}>`, the order summary, secure/terms notes and both CTAs paint immediately. `getPaymentMethods(locale)` is called once from `features/booking/api.ts`; the same promise feeds mobile/desktop picker sections and the page-level `PaymentDefaultAdoptSection`.

- **The server catalog is the only source of methods** — ids, labels, descriptions and order all come from `GET /payment-methods`; the page keeps no list of its own. `PaymentDefaultAdopt` (effect-only, mounted **once at page level** because both device trees render) preselects the single sellable method (the usual demo state) and clears a draft pointing at a method the server no longer sells, so the CTA is usable without a click.
- **`enabled: false` means "coming soon"**: every row still renders — `PaymentOption` leaves a disabled card visible with a lock plus the `booking.payment.coming_soon` badge but inert (`disabled`/`aria-disabled`), and the sellable demo method wears `booking.payment.demo` when `meta.demo` is set. Availability is server-computed; the FE never decides it.
- Shared state: the selection lives in the booking draft (`paymentMethodId` + `paymentMethod` display name via `setPayment(id, name)`), shared between `PaymentOption` and `BottomBar`; the id persists across back-navigation (a re-entered payment page keeps the radio pre-selected) and is cleared by `resetBooking()`.
- `components/mobile/PaymentOption.tsx` — one catalog card: brand logo from `features/booking/utils/paymentBrand.ts` (`public/images/VNPay.png`, `public/images/momo.png` via `next/image`) or a `FlaskConical` tile for an id the app has no art for, so a method added later still renders readably; reads `paymentMethodId`/`setPayment` from `useBooking()` (one dispatch writes both the id and the display name)
- `components/desktop/PaymentContent.tsx` — the same picker inside `BookingStepLayout` (two-up from `xl:`) with the pay CTA in the rail; both skins drive `useSubmitBooking`, so the create → QR hand-off exists once. It receives the picker as `slots`, so the rail and CTA paint before the catalog lands.
- `features/booking/components/OrderSummary.tsx` — same component as the credentials step (no props; movie snapshot + booking details from BookingContext)
- `components/shared/SecureBadge.tsx` — security badge
- `components/shared/TermsNote.tsx` — terms & conditions note
- `components/mobile/BottomBar.tsx` — sticky bottom bar. On CTA: `createBookingAction(seats + snacks + contact, RAM token)` and then hand off to the QR screen — the booking is created here, the payment attempt is not:
  - success → `/payment/qr?bookingId=...&method={gateway}`
  - create `409 SEAT_TAKEN` → `/seats?showtimeId=...` (seats stolen; the restore idle-check keeps survivors)
  - create `409 INVALID_STATE` → `/cinema` (showtime unusable)
  - no selection / no token / no showtime → inline error (`booking.payment.error_missing_selection`) — the payment page never fabricates a booking from mock data
  - Other errors → inline error text from the union

`StepBar current={5}` maps to "PAYMENT" step. The success route also works when `?bookingId=` is absent (direct URL) — the cards then fall back to the BookingContext draft.

## Payment QR Page

`(sub)/booking/[slug]/payment/qr?bookingId=&method=` — the focused checkout screen (deliberately **no** `StepBar`/`StepRail`: the mobile sub-header keeps the generic "Payment" title and its back button returns to the movie). Server component: a missing `?bookingId=` redirects to `/payment`; it awaits `getBookingById` for auth/404/paid decisions and streams the method catalog + QR screen afterward. Method precedence: a `?method=` the catalog actually lists → `booking.payment.method` → the first sellable catalog method; when nothing is sellable it redirects to `/payment`, the one place that can explain why. A catalog outage must not block a payment that is already open: the screen then falls back to the booking's (or the URL's) method and hides the demo panel.

- **The page owns the attempt**, not the payment step. `usePaymentIntent` (device-agnostic; mounted once by `PaymentQrScreen` above both skins) opens it on mount — `GET /payments/:bookingId/intent` and, when that answers `404` **or** a `pending` row with `kind: null` (the handleless row `POST /bookings` writes), `POST .../create` — then polls every 3 s while `pending`. A retry here can therefore never create a second booking, and a refresh re-shows the open QR instead of minting a charge.
- **Routing follows the attempt's own state**: `success` → re-read the booking and open `/status/success` only when it is `paid` (a charge captured after the window is refunded instead, so the page shows the refund notice); `failed` → `/status/failed?reason={intent.reason}`. `expired` stays on the page: its panel offers a new attempt, which answers `409 BOOKING_EXPIRED` once the booking itself is gone — that flips the page to a closed state with a "Choose seats again" CTA.
- **Simulate / sync**: `createPaymentIntentAction` / `simulatePaymentAction` / `syncPaymentAction` (`features/booking/action.ts`, token as an argument like the rest of the booking mutations); `getPaymentIntent` (`api.ts`) is the one booking query that runs in the browser with the RAM Bearer, because the route is JWT-only. `settled` → success page, `declined` → failed page, `late_success` (or `duplicate_charge` without a paid booking) → refund notice, `no_change` → "not confirmed yet" while polling continues.
- **Demo controls** are gated by `meta.demo` on `GET /payment-methods` (surfaced as `PaymentCatalog.demo`), so the panel is never rendered on a server that would answer `403`. The page threads the **whole** catalog into the screen (`paymentMethods`) so the recap and the receipt labels resolve through `getPaymentLabel`; whether a method is sellable is already decided by the payment step and by the booking's own record, never re-derived here.
- Shared presentation lives in `components/shared/payment/` and `components/shared/seats/`; route-level booking guards, adopters and receipt cards live under `app/(sub)/booking/components/`.

## Success & Fail Pages

Both pages are plain server components with no `<Suspense>` — nothing client-side reads `useSearchParams()` anymore. White text theme throughout. Each `page.tsx` reads `?bookingId=` (plus `?transactionId=` / `?reason=`) and fetches `getBookingById(bookingId, await getRequestCookie())` when a `bookingId` is present (401 → `redirectIfUnauthorized(result, pathname)`); `getMovieDetail(slug)` runs **only when** `bookingId` **is absent** (direct/mock-era URL — the real flow redirects with a `bookingId`, and its payload already carries the movie). It derives `transactionId` (URL param → `booking.transactionRef` → `booking.id` → `"N/A"`) and `reason` (URL param → `booking.payment.reason`) server-side, passes everything as props, and renders `<PaidBookingReset booking={booking}/>`.

**Desktop is a separate design, not the mobile stack widened.** Both screens share one skeleton: a left-aligned hero (`SuccessHero` / `FailHero` — icon beside the copy, driven by `useMounted()`) over a `max-w-6xl` body that is **one column below `lg:`** and `lg:grid-cols-[minmax(0,1fr)_360px]` above it — the receipt card + the side panel, so the side panel drops under the receipt in the 740–1023px band (same rule as the booking steps).

- `(sub)/booking/[slug]/status/success/page.tsx` — mobile: `SuccessIcon` (shared) + `TicketCard` + `SuccessActions`; desktop `components/desktop/`: `SuccessHero`, `ReceiptCard` (movie identity + theater/day + `PriceBreakdown`), `SuccessSidePanel` (QR + booking ref + Download / Back to Home), composed by `SuccessContent`.
- `(sub)/booking/[slug]/status/failed/page.tsx` — mobile: `FailedIcon` + `FailedOrderCard` + `FailActions`; desktop `components/desktop/`: `FailHero`, `FailedReceipt` (red-tinted border + error-code pill), `FailSidePanel` (Retry / Back to Home + the support card), composed by `FailContent`.
- Data derivation is shared, never re-implemented per skin: `resolveTicketIdentity(movie, booking)` (poster/title/ageRating precedence) in `features/booking/utils/bookingCard.ts`, and `failReasonMessageKey(reason)` / `paymentErrorCode(reason)` in `features/booking/utils/paymentFailure.ts` (the two maps used to be copy-pasted per component).
- `PaidBookingReset.tsx` (`features/booking/components/PaidBookingReset.tsx`) — effect-only (renders nothing), mounted by both pages: dispatches `resetBooking()` when the fetched booking status is `paid`, so a paid booking ends the flow and drops the local draft (a still-failed booking keeps its draft for the retry path).

## Movie Detail Page

- `(blank)/movies/[slug]/page.tsx` — streamed: awaits `params` + locale + `getMovieDetail` (404 → in-page `MobileMovieNotFound`; decides metadata) then paints both trees. Showtimes and reviews stream into their own `<Suspense>` per tree; JSON-LD for Movie schema flushes in a `fallback={null}` boundary.
- New "You may also like" section (`components/{mobile,desktop}/Recommended.tsx`) streams at the bottom (mobile) / below the content+rail block (desktop) from `features/movies/api.ts` (`cache()` loader over `GET /movies/:slug/related`). Empty/error -> render `null`. Mobile uses `ui/MovieCard` in a 2-column grid with client-side pagination (4 cards/page, `RECOMMENDED_MOBILE_PAGE_SIZE`); desktop uses the shared `features/movies/components/MoviePosterCard.tsx` in a 6-card grid (`RECOMMENDED_DESKTOP_COUNT`).
- Reviews block: `loadReviewBlock` (`sections.tsx`) reads the first page, the caller's own votes (`GET /reviews/votes`, cookie — empty for anonymous) and the localized sort labels in one pass, then both trees render `Reviews`. Per-review scores are the compact `ui/RatingBadge` (`★ 8/10`), not the ten-icon row; the movie-level `{average}/10` + `Stars` + histogram are unchanged. Each card carries `shared/reviews/ReviewVoteButtons` (optimistic, one vote per review, own review = tallies only) and the list is topped by a route-local `ReviewSortBar` (`desktop/` pill row, `mobile/` scrollable chips) driven by `GET /reviews/filters` (`recent` · `helpful` · `highest` · `lowest`).

## Shared Booking Components

`booking/components/mobile/` (shared across all booking steps):

- `StepBar.tsx` — 5-step booking progress bar, reads `BOOKING_STEP_KEYS`, highlights current step
- `CountdownBanner.tsx` — session-deadline countdown (session first-CTA + 10 min wins over the hold TTL; static 10:00 pre-CTA or after a lapsed session, ticking once a session starts)

`src/components/shared/` — booking-shaped blocks the ticket pages render too:

- `DetailRow.tsx` — reusable label/value row with icon, used in ticket cards
- `PriceBreakdown.tsx` — shared seats→snacks→payment/total block used by ticket detail, booking success/failed cards, transfer confirm and the credentials/payment OrderSummary

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

`ratingMin`/`ratingMax` are clamped into 0–10 on read and an inverted pair is dropped before it can reach the API (the backend answers `400` for `min > max`); a bound sitting on its edge (min `0`, max `10`) means "unbounded" and is omitted. Any sent bound means "the movie must have a score", so movies whose `rating` is `null` (no review yet) drop out of the filtered list. The old single-bound `?rating=` param is gone — the panel and the API move together (`forbidNonWhitelisted` turns a stray `rating` into a `400`).

Home page "See All" / "Explore All" buttons link to movies page with appropriate `status` param.

URL → state is applied **once, server-side at render** (via `features/movies/utils/url.ts`); the provider then drives the URL itself with `router.replace` on tab/filter changes. Browser back/forward does not re-apply URL state to the already-mounted provider.

## Error & 404 Pages

- `src/app/error.tsx` (root) + per-group `error.tsx` (`(main)`, `(blank)`, `(sub)`, `(auth)`, `(admin)`) all render `components/shared/RouteError.tsx`; `src/app/global-error.tsx` covers errors thrown inside the root layout.
- `src/app/not-found.tsx` is the 404 for both unknown URLs and in-page `notFound()` calls from any group — it renders **inside** that group's chrome when triggered there, and standalone when the URL itself is unknown.
- Desktop (`md:`) layout: `components/shared/StatusPageShell.tsx` splits the screen into a left-aligned message column and a right-hand `.surface-raised` panel (quick links for 404, Try again + Back to Home + Ref code for errors). Mobile keeps the original centred column and stacked buttons (`md:hidden`).
- Constraints: no side effect, no `"use client"` split into device trees; animation keyframes (`filmStripScroll`, `glitchDecode`) are unchanged. `min-h-dvh` is retained so the standalone case fills the viewport.

`(admin)` is its own route group: `layout.tsx` reads only cookies (`hasSession()`, the theme, the sidebar mode) and mounts `layouts/AdminLayout.tsx`; a visitor with no refresh cookie gets `LoginPrompt` from the server layout, and a cookie without the admin role is answered in place by `AdminLayout`'s client gate (`LoginPrompt` / `AdminForbiddenPanel`) — never a redirect, so the URL survives. `admin/page.tsx` (the dashboard) has no feed.

Every console route follows one shape: the page awaits nothing but `searchParams` (only `/admin/movies` has any) and renders `<AdminPageHeader>` — a client component taking i18n **keys**, so it paints without a server translator — then streams its manager in one `<Suspense fallback={<AdminTableSkeleton />}>`:

| Route                    | Streamed manager section                                | Feeds                                       |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------- |
| `/admin/catalogs`        | `CatalogsManagerSection`                                | genres + formats + age ratings              |
| `/admin/movies`          | `MoviesManagerSection` (takes `search`/`status`/`page`) | movie list (+`meta`) + genres + age ratings |
| `/admin/cinemas`         | `CinemasManagerSection`                                 | cinema tree (rooms, seat layout)            |
| `/admin/combos`          | `CombosManagerSection`                                  | combos                                      |
| `/admin/food`            | `FoodManagerSection`                                    | food items                                  |
| `/admin/payment-methods` | `PaymentMethodsManagerSection`                          | gateway catalog                             |

- Each manager section lives beside its page (`sections.tsx`) and is the only place that reads admin data. One consumer per feed, so no `cache()` loader is involved.
- **401 renders `null`** — the console layout owns the prompt (the section would otherwise double it). A real failure renders `AdminDataError` in the table's place, keeping the header and the URL filters alive.
- `features/admin/components/AdminSkeletons.tsx` holds `AdminHeaderSkeleton` + `AdminTableSkeleton`, shared by every route boundary and by `(admin)/loading.tsx`, so the navigation fallback and the in-page one cannot drift.
- Mutations are server actions in `features/admin/actions/*` returning `{ success, data } | { success, error }`; managers re-render from `router.refresh()` after a write, which re-runs the same section.
