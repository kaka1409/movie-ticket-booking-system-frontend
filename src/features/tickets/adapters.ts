import type { BookingDetail } from "@/features/booking/types";
import type {
  FoodDrinkItem,
  PastTicket,
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
}

export interface TicketDetailWire extends BookingDetail {
  ticketId: string;
  ticketStatus: string;
  issuedAt: string;
  usedAt: string | null;
  qrToken: string;
  qrCode?: string;
  pendingTransfer: {
    id: string;
    recipientId: string;
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

function mapPastStatus(ticketStatus: string): PastTicket["status"] {
  switch (ticketStatus) {
    case "used":
      return "used";
    case "cancelled":
      return "cancelled";
    case "refunded":
      return "refunded";
    default:
      // Active ticket whose show already ended.
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
  const [year, month, day] = showtimeDate.split("-").map(Number);
  const [hours, minutes] = showtimeStart.split(":").map(Number);
  const at = new Date(year, month - 1, day, hours, minutes);
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
  return {
    id: summary.ticketId,
    status: mapUpcomingStatus(),
    movie: summary.movieTitle,
    datetime: formatTicketDatetime(summary.showtimeDate, summary.showtimeStart, locale),
    cinema: summary.cinemaName,
    format: summary.format,
    seatItems: summary.seatLabels.map((label): SeatTicket => ({ label, type: "", price: 0 })),
    poster: summary.posterUrl ?? POSTER_FALLBACK,
    room: summary.roomName,
    totalPrice: summary.totalPrice,
  };
}

export function toPastTicket(summary: TicketSummaryWire, locale: "en" | "vn"): PastTicket {
  return {
    id: summary.ticketId,
    status: mapPastStatus(summary.ticketStatus),
    movie: summary.movieTitle,
    format: summary.format,
    datetime: formatTicketDatetime(summary.showtimeDate, summary.showtimeStart, locale),
    ticketCount: summary.seatCount,
    poster: summary.posterUrl ?? POSTER_FALLBACK,
    cinema: summary.cinemaName,
    seatItems: summary.seatLabels.map((label): SeatTicket => ({ label, type: "", price: 0 })),
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
    label: seat.label,
    type: seat.type,
    price: seat.price,
  }));
  const seatTotal = seatItems.reduce((sum, seat) => sum + seat.price, 0);
  const snackTotal = foodDrink.reduce((sum, item) => sum + item.price * item.qty, 0);
  const base = {
    id: detail.ticketId,
    movie: detail.showtime.movie.title,
    datetime: formatTicketDatetime(detail.showtime.date, detail.showtime.startTime, locale),
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
    qrCode: detail.qrCode ?? detail.qrToken,
  };

  if (detail.ticketStatus === "active") {
    const ticket: UpcomingTicket = {
      ...base,
      status: mapDetailStatus(detail.ticketStatus) as UpcomingTicket["status"],
      transfer: toTransfer(detail),
    };
    return ticket;
  }
  return {
    ...base,
    status: mapDetailStatus(detail.ticketStatus) as PastTicket["status"],
    ticketCount: seatItems.length,
  };
}

/**
 * Pending transfer → card shape. The recipient is ID-only until the transfer
 * batch adds the backend include — name/email/avatar stay empty so the
 * pending panel (which only needs status + seats + cancel) works today.
 * Seat IDs resolve to labels through the detail's own seats.
 */
// TODO(transfer): fill recipient from the backend include; drop the fallback.
function toTransfer(detail: TicketDetailWire): TicketTransfer | undefined {
  const pending = detail.pendingTransfer;
  if (!pending) return undefined;
  const labelById = new Map(detail.seats.map((seat) => [seat.id, seat.label] as const));
  return {
    status: "pending",
    recipient: { name: "", username: "", email: "", avatar: "" },
    transferredSeats: pending.seatIds.map((seatId) => labelById.get(seatId) ?? seatId),
    transferSnacks: pending.transferSnacks,
  };
}
