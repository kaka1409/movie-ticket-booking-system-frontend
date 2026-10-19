import type { BookingDetail, DateOption } from "@/features/booking/types";
import type {
  EligibleShowtime,
  FoodDrinkItem,
  IncomingTransfer,
  PastTicket,
  Recipient,
  SeatTicket,
  TicketTransfer,
  UpcomingTicket,
} from "./types";

/* ─── Wire shapes (mirror the backend TicketSummary / TicketDetail) ─── */

export interface TicketSummaryWire {
  ticketId: string;
  bookingId: string;
  ticketStatus: string;
  movieTitle: string;
  movieSlug: string;
  posterUrl: string | null;
  cinemaName: string;
  roomName: string;
  showtimeDate: string;
  showtimeStart: string;
  showtimeEnd: string;
  format: string;
  seatLabels: string[];
  seatCount: number;
  totalPrice: number;
  /** Owner-side badge: the open transfer this ticket is in, `null` when free. */
  pendingTransfer: { id: string; recipientName: string } | null;
  /** Settled-transfer provenance for the viewer, `null` when never transferred. */
  transfer: { direction: "sent" | "received"; counterpartyName: string } | null;
}

export interface TicketDetailWire extends BookingDetail {
  ticketId: string;
  ticketStatus: string;
  issuedAt: string;
  usedAt: string | null;
  /** Owner-only credential — `null` while the viewer is a pending recipient. */
  qrToken: string | null;
  qrCode?: string;
  /** Which side of the ticket the backend shaped this payload for. */
  viewerRole: "owner" | "recipient";
  pendingTransfer: {
    id: string;
    recipientId: string;
    recipient: {
      id: string;
      name: string;
      email: string;
      avatarUrl: string | null;
    };
    seatIds: string[];
    transferSnacks: boolean;
    createdAt: string;
  } | null;
  incomingTransfer: {
    id: string;
    sender: {
      id: string;
      name: string;
      email: string;
      avatarUrl: string | null;
    };
    seatIds: string[];
    transferSnacks: boolean;
    createdAt: string;
  } | null;
}

export interface TicketPageMeta {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

/* ─── Display maps ─── */

/** Backend ticket statuses → listing card statuses. */
function mapUpcomingStatus(): UpcomingTicket["status"] {
  // Upcoming only ever holds usable tickets (active + paid) — a failed
  // payment leaves the booking pending and mints no ticket at all.
  return "success";
}

function mapPastStatus(ticketStatus: string, transferredAway = false): PastTicket["status"] {
  // A ticket I gave away is history from the moment the transfer settles — the
  // remaining entitlement status (still `active` for the recipient) is theirs,
  // not mine, so it must not be shown as if this ticket were still mine.
  if (transferredAway) return "transferred";
  switch (ticketStatus) {
    case "used":
      return "used";
    case "expired":
      // Persisted by the backend expiry sweep once the showtime ended.
      return "expired";
    case "cancelled":
      return "cancelled";
    case "refunded":
      return "refunded";
    default:
      // Unknown terminal status — the safest card is the neutral one.
      return "expired";
  }
}

function mapDetailStatus(ticketStatus: string): UpcomingTicket["status"] | PastTicket["status"] {
  if (ticketStatus === "active") return "success";
  return mapPastStatus(ticketStatus);
}

const PAYMENT_BRANDS: Record<string, string> = {
  vnpay: "VNPAY",
  momo: "MoMo",
};

const POSTER_FALLBACK = "/images/movie-poster-placeholder.jpg";

const DEFAULT_AVATAR = "/images/default-avatar.jpg";

/**
 * Backend `YYYY-MM-DD` + `HH:mm` → concrete instant. Both halves are
 * server-local wall clock (the backend reads the DATE/TIME columns without a
 * zone conversion — see `formatTime`), so the browser builds the same local
 * instant the formatter below renders. One source: the card label and the
 * countdown can never drift apart.
 */
export function buildShowtimeStart(showtimeDate: string, showtimeStart: string): Date {
  const [year, month, day] = showtimeDate.split("-").map(Number);
  const [hours, minutes] = showtimeStart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

/**
 * Epoch ms of the showtime end. A screening can run past midnight (`endTime`
 * before `startTime`), so roll the date-only half to the next day instead of
 * producing an end that precedes the start.
 */
export function buildShowtimeEnd(
  showtimeDate: string,
  showtimeEnd: string,
  startMs: number,
): number {
  const end = buildShowtimeStart(showtimeDate, showtimeEnd);
  if (end.getTime() <= startMs) end.setDate(end.getDate() + 1);
  return end.getTime();
}

/**
 * Backend `YYYY-MM-DD` + `HH:mm` → card display (`Fri, Nov 10, 8:00 PM` in
 * EN, `Th 6, 10 thg 11, 20:00` in VN). 24-hour clock in both locales to match
 * the backend `HH:MM` convention — the backend sends structured parts, never
 * a preformatted string.
 */
export function formatTicketDatetime(
  showtimeDate: string,
  showtimeStart: string,
  locale: "en" | "vn",
): string {
  const tag = locale === "vn" ? "vi-VN" : "en-US";
  const at = buildShowtimeStart(showtimeDate, showtimeStart);
  const datePart = new Intl.DateTimeFormat(tag, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(at);
  const timePart = new Intl.DateTimeFormat(tag, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(at);
  return `${datePart}, ${timePart}`;
}

/* ─── List adapters ─── */

/**
 * Summary → upcoming card. Summaries carry labels only (no seat prices) —
 * cards read `.label`, so seats map with empty type/price. Anything needing
 * money or snacks comes from the detail endpoint, never N+1 list fetches.
 */
export function toUpcomingTicket(summary: TicketSummaryWire, locale: "en" | "vn"): UpcomingTicket {
  const startsAtMs = buildShowtimeStart(summary.showtimeDate, summary.showtimeStart).getTime();
  return {
    id: summary.ticketId,
    status: mapUpcomingStatus(),
    movie: summary.movieTitle,
    datetime: formatTicketDatetime(summary.showtimeDate, summary.showtimeStart, locale),
    startsAtMs,
    endsAtMs: buildShowtimeEnd(summary.showtimeDate, summary.showtimeEnd, startsAtMs),
    cinema: summary.cinemaName,
    format: summary.format,
    seatItems: summary.seatLabels.map((label): SeatTicket => ({ label, type: "", price: 0 })),
    poster: summary.posterUrl ?? POSTER_FALLBACK,
    room: summary.roomName,
    totalPrice: summary.totalPrice,
    isTransferring: summary.pendingTransfer !== null,
    transferRecipientName: summary.pendingTransfer?.recipientName,
  };
}

export function toPastTicket(summary: TicketSummaryWire, locale: "en" | "vn"): PastTicket {
  const transferProvenance = summary.transfer ?? undefined;
  return {
    id: summary.ticketId,
    status: mapPastStatus(summary.ticketStatus, transferProvenance?.direction === "sent"),
    movie: summary.movieTitle,
    format: summary.format,
    datetime: formatTicketDatetime(summary.showtimeDate, summary.showtimeStart, locale),
    ticketCount: summary.seatCount,
    poster: summary.posterUrl ?? POSTER_FALLBACK,
    cinema: summary.cinemaName,
    seatItems: summary.seatLabels.map((label): SeatTicket => ({ label, type: "", price: 0 })),
    transferProvenance,
    room: summary.roomName,
    totalPrice: summary.totalPrice,
  };
}

/* ─── Detail adapter ─── */

/** Backend combos + foods → one `foodDrink` list (`quantity` → `qty`). */
function toFoodDrink(detail: TicketDetailWire): FoodDrinkItem[] {
  return [
    ...detail.combos.map((combo) => ({
      name: combo.name,
      price: combo.price,
      qty: combo.quantity,
    })),
    ...detail.foods.map((food) => ({ name: food.name, price: food.price, qty: food.quantity })),
  ];
}

/**
 * Full detail → card shape. Returns an upcoming ticket for usable
 * entitlements, a past ticket otherwise — the layout's `notFound()` only
 * fires on a real 404, never on a status.
 */
export function toDetailTicket(
  detail: TicketDetailWire,
  locale: "en" | "vn",
): UpcomingTicket | PastTicket {
  const foodDrink = toFoodDrink(detail);
  const seatItems: SeatTicket[] = detail.seats.map((seat) => ({
    seatId: seat.id,
    label: seat.label,
    type: seat.type,
    price: seat.price,
  }));
  const seatTotal = seatItems.reduce((sum, seat) => sum + seat.price, 0);
  const snackTotal = foodDrink.reduce((sum, item) => sum + item.price * item.qty, 0);
  const startsAtMs = buildShowtimeStart(detail.showtime.date, detail.showtime.startTime).getTime();
  const base = {
    id: detail.ticketId,
    showtimeId: detail.showtime.id,
    movie: detail.showtime.movie.title,
    datetime: formatTicketDatetime(detail.showtime.date, detail.showtime.startTime, locale),
    startsAtMs,
    endsAtMs: buildShowtimeEnd(detail.showtime.date, detail.showtime.endTime, startsAtMs),
    cinema: detail.showtime.cinema.name,
    location: detail.showtime.cinema.address,
    format: detail.showtime.format,
    room: detail.showtime.room.name,
    ageRating: detail.showtime.movie.ageRating ?? undefined,
    poster: detail.showtime.movie.posterUrl ?? POSTER_FALLBACK,
    seatItems,
    totalSeatPrice: seatTotal,
    totalSnackPrice: snackTotal,
    totalPrice: detail.totalPrice,
    // Mirrors the `common.via` dictionary key (adapters stay hook-free, so the
    // word is inlined instead of translated — keep both in sync).
    paymentMethod: detail.payment
      ? `${locale === "vn" ? "Qua" : "Via"} ${PAYMENT_BRANDS[detail.payment.method] ?? detail.payment.method}`
      : undefined,
    foodDrink,
  };

  if (detail.ticketStatus === "active") {
    const ticket: UpcomingTicket = {
      ...base,
      status: mapDetailStatus(detail.ticketStatus) as UpcomingTicket["status"],
      viewerRole: detail.viewerRole,
      transfer: toTransfer(detail),
      incomingTransfer: toIncomingTransfer(detail),
      isTransferring: detail.pendingTransfer !== null,
      transferRecipientName: detail.pendingTransfer?.recipient.name,
      // The backend only issues the signed scan payload for a usable owner
      // ticket; absent means "no QR to render" (dead entitlement / recipient).
      qrCode: detail.qrCode ?? detail.qrToken ?? undefined,
    };
    return ticket;
  }
  // A past ticket never carries a credential — the backend masks it and the
  // card shape has no such field.
  return {
    ...base,
    status: mapDetailStatus(detail.ticketStatus) as PastTicket["status"],
    ticketCount: seatItems.length,
  };
}

/**
 * Pending transfer → card shape. Seat IDs resolve to labels through the
 * detail's own seats; the recipient comes from the backend include.
 */
function toTransfer(detail: TicketDetailWire): TicketTransfer | undefined {
  const pending = detail.pendingTransfer;
  if (!pending) return undefined;
  const labelById = new Map(detail.seats.map((seat) => [seat.id, seat.label] as const));
  return {
    status: "pending",
    recipient: {
      id: pending.recipient.id,
      name: pending.recipient.name,
      email: pending.recipient.email,
      avatar: pending.recipient.avatarUrl ?? DEFAULT_AVATAR,
    },
    transferredSeats: pending.seatIds.map((seatId) => labelById.get(seatId) ?? seatId),
    transferSnacks: pending.transferSnacks,
  };
}

/**
 * Incoming offer → card shape. Same seat-label resolution as the outgoing
 * panel; the sender replaces the recipient.
 */
function toIncomingTransfer(detail: TicketDetailWire): IncomingTransfer | undefined {
  const incoming = detail.incomingTransfer;
  if (!incoming) return undefined;
  const labelById = new Map(detail.seats.map((seat) => [seat.id, seat.label] as const));
  return {
    id: incoming.id,
    sender: {
      id: incoming.sender.id,
      name: incoming.sender.name,
      email: incoming.sender.email,
      avatar: incoming.sender.avatarUrl ?? DEFAULT_AVATAR,
    },
    transferredSeats: incoming.seatIds.map((seatId) => labelById.get(seatId) ?? seatId),
    transferSnacks: incoming.transferSnacks,
  };
}

/* ─── Transfer recipient lookup ─────────────────────────── */

/** Wire shape of `GET /user/search` (exact-email recipient lookup). */
export interface SearchRecipientWire {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export function toRecipient(row: SearchRecipientWire): Recipient {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatarUrl ?? DEFAULT_AVATAR,
  };
}

/* ─── Eligible showtimes (ticket modification) ──────────── */

/** Wire shape of `GET /tickets/:id/modify/eligible-showtimes` — times are `HH:mm`. */
export interface EligibleShowtimeWire {
  showtimeId: string;
  date: string;
  startTime: string;
  endTime: string;
  format: string;
  cinema: { id: string; name: string };
  room: { id: string; name: string };
}

/** Wire row → the modification UI shape (no address/distance in the source payload). */
export function toEligibleShowtime(row: EligibleShowtimeWire): EligibleShowtime {
  return {
    showtimeId: row.showtimeId,
    date: row.date,
    time: row.startTime,
    room: row.room.name,
    cinemaId: row.cinema.id,
    cinemaName: row.cinema.name,
    address: "",
    distance: "",
  };
}

/** Distinct showtime dates → the booking date-strip options (ascending). */
export function toEligibleDateOptions(
  showtimes: EligibleShowtime[],
  locale: "en" | "vn",
): DateOption[] {
  const tag = locale === "vn" ? "vi-VN" : "en-US";
  const seen = new Set<string>();
  const options: DateOption[] = [];

  for (const showtime of showtimes) {
    if (seen.has(showtime.date)) continue;
    seen.add(showtime.date);
    const [year, month, day] = showtime.date.split("-").map(Number);
    const at = new Date(year, month - 1, day);
    options.push({
      value: showtime.date,
      day,
      month: at.toLocaleDateString(tag, { month: "short" }).toUpperCase(),
      weekday: at.toLocaleDateString(tag, { weekday: "short" }).toUpperCase(),
    });
  }

  return options.sort((first, second) => first.value.localeCompare(second.value));
}
