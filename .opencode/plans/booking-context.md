# Plan: Booking Context for Booking Flow

## Goal
Replace hardcoded `ORDER_SUMMARY` with a `BookingContext` that carries user selections across all booking steps (cinema → seats → snack → credentials).

## Problem
Currently each booking step is fully isolated. The credentials page displays hardcoded mock data regardless of what the user actually selected.

## Solution: React Context

### Data Flow

```
Cinema page  → save cinemaId, cinemaName, time, date, room → BookingContext
Seats page   → save selectedSeats, seatType, seatTotal     → BookingContext
Snack page   → save combos, foods, snackTotal              → BookingContext
Credentials  ← read all from BookingContext → OrderSummary + BottomBar
```

---

## Files to Create/Modify

### 1. NEW: `src/contexts/BookingContext.tsx`

```ts
"use client";

interface SelectedSeat {
  label: string;
  type: string;       // "Standard" | "VIP" | "SweetBox"
  price: number;
}

interface SelectedCombo {
  id: string;
  name: string;
  qty: number;
  price: number;
}

interface SelectedFood {
  id: string;
  name: string;
  qty: number;
  price: number;
}

interface BookingState {
  // Step 1 — Cinema
  cinemaId: number | null;
  cinemaName: string;
  time: string;
  date: string;
  room: string;         // badge: "IMAX", "STANDARD", etc.

  // Step 2 — Seats
  selectedSeats: SelectedSeat[];
  seatType: string;     // derived from first seat's type
  seatTotal: number;

  // Step 3 — Snacks
  combos: SelectedCombo[];
  foods: SelectedFood[];
  snackTotal: number;

  // Derived
  ticketCount: number;
  ticketPrice: number;  // sum of seat prices
  convFee: number;
  total: number;
}

interface BookingContextType extends BookingState {
  setCinema: (cinemaId: number, cinemaName: string, time: string, date: string, room: string) => void;
  setSeats: (seats: SelectedSeat[]) => void;
  setSnacks: (combos: SelectedCombo[], foods: SelectedFood[]) => void;
  resetBooking: () => void;
}
```

- `createContext<BookingContextType | null>(null)`
- `BookingProvider` with `useState<BookingState>` initialized to defaults
- `useBooking()` hook with null-guard
- Derived values (ticketCount, ticketPrice, snackTotal, total) computed via `useMemo`

---

### 2. NEW: `src/app/(sub)/booking/[slug]/layout.tsx`

Wraps all booking sub-routes with `BookingProvider`:

```tsx
import { BookingProvider } from "@/contexts/BookingContext";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>;
}
```

This ensures the provider stays mounted when navigating between steps (back/forward).

---

### 3. MODIFY: `src/app/(sub)/booking/[slug]/cinema/components/mobile/BottomBar.tsx`

- Import `useBooking`
- On CTA click (before navigating), call `setCinema(cinema.id, cinema.name, time, date, cinema.badge)`
- Existing navigation logic stays the same

---

### 4. MODIFY: `src/app/(sub)/booking/[slug]/seats/page.tsx`

- Import `useBooking`
- On mount, read `selectedSeats` from context to initialize `rows` state (for back-navigation)
- Pass `setSeats` to BottomBar or call it in the page

### 4a. MODIFY: `src/app/(sub)/booking/[slug]/seats/components/mobile/BottomBar.tsx`

- Import `useBooking`
- On CTA click, call `setSeats(collectedSeats)` with the computed seat list
- Existing navigation logic stays the same

---

### 5. MODIFY: `src/app/(sub)/booking/[slug]/snack/components/mobile/BottomBar.tsx`

- Import `useBooking`
- On CTA click, call `setSnacks(combos, foods)` with computed lists
- Existing navigation logic stays the same

---

### 6. MODIFY: `src/app/(sub)/booking/[slug]/credentials/components/mobile/OrderSummary.tsx`

- Replace `import { ORDER_SUMMARY } from mock` with `import { useBooking } from "@/contexts/BookingContext"`
- Read all data from context: movie (via slug + ALL_MOVIES), cinema, seats, combos, foods, totals
- Render dynamically instead of hardcoded mock

---

### 7. MODIFY: `src/app/(sub)/booking/[slug]/credentials/components/mobile/BottomBar.tsx`

- Replace `import { ORDER_SUMMARY } from mock` with `useBooking()`
- Read `total` from context

---

### 8. DELETE: `ORDER_SUMMARY` from `src/features/booking/mock.ts`

Remove the hardcoded `ORDER_SUMMARY` constant.

---

## State Initialization Strategy

| Step | State | Initialized from |
|------|-------|------------------|
| Cinema | cinemaId, cinemaName, time, date, room | User selection → `setCinema()` |
| Seats | selectedSeats, seatType, seatTotal | User selection → `setSeats()` |
| Snack | combos, foods, snackTotal | User selection → `setSnacks()` |
| Credentials | all above | Read-only from context |

### Back-navigation handling

- **Cinema → back to movie detail**: Cinema page reads existing context values to pre-fill selection UI
- **Seats → back to cinema**: Cinema page reads existing context to show current selection
- **Snack → back to seats**: Seats page reads `selectedSeats` from context to re-initialize rows
- **Credentials → back to snack**: Snack page reads `combos`/`foods` from context to pre-fill quantities

Since the `BookingProvider` is at the `[slug]` layout level, it stays mounted across all step navigations. State persists automatically.

---

## Derived Values

Computed in `BookingProvider` via `useMemo`:

```ts
ticketCount = selectedSeats.length;
ticketPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
seatType = selectedSeats[0]?.type ?? "Standard";
snackTotal = combos.reduce((s, c) => s + c.price * c.qty, 0)
           + foods.reduce((s, f) => s + f.price * f.qty, 0);
convFee = 25000; // fixed mock fee
total = ticketPrice + snackTotal + convFee;
```

---

## Order Summary Render (after changes)

```
┌──────────────────────────────────────┐
│  [poster]  {movie.title}             │
│            {movie.genre} • {duration}│
│                                      │
│  📅 {date} • {time}                  │
│  📍 {cinemaName} • {room}            │
│  💺 Seats: {seats joined}            │
├──────────────────────────────────────┤
│  🎫 {count}× {seatType} Ticket       │
│  🍿 combos...                        │
│  🍿 foods...                         │
│  Fee                        {convFee}│
│  ──────────────────────────────────  │
│  Total                        {total}│
└──────────────────────────────────────┘
```

---

## Execution Order

1. Create `BookingContext.tsx` (types + provider + hook)
2. Create `booking/[slug]/layout.tsx`
3. Update cinema BottomBar → save to context
4. Update seats page + BottomBar → save to context, read on back-nav
5. Update snack BottomBar → save to context
6. Update credentials OrderSummary → read from context
7. Update credentials BottomBar → read total from context
8. Remove `ORDER_SUMMARY` from mock.ts
9. Build and verify
