import type { PaymentMethodOption } from "@/features/booking/types";
import { getPaymentLabel } from "@/features/booking/utils/paymentBrand";
import { POSTER_FALLBACK } from "../constants";
import type {
  FoodDrinkItem,
  PastTicket,
  SeatTicket,
  TicketDetailWire,
  TicketSummaryWire,
  UpcomingTicket,
} from "../types";
import { buildShowtimeEnd, buildShowtimeStart, formatTicketDatetime } from "./time";
import { toIncomingTransfer, toTransfer } from "./transfer";

/* ─── Display maps ─── */

function toUpcomingStatus(): UpcomingTicket["status"] {
  // Upcoming only ever holds usable tickets (active + paid) — a failed
  // payment leaves the booking pending and mints no ticket at all.
  return "success";
}

function toPastStatus(ticketStatus: string, transferredAway = false): PastTicket["status"] {
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

function toDetailStatus(ticketStatus: string): UpcomingTicket["status"] | PastTicket["status"] {
  if (ticketStatus === "active") return "success";
  return toPastStatus(ticketStatus);
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
    status: toUpcomingStatus(),
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
    status: toPastStatus(summary.ticketStatus, transferProvenance?.direction === "sent"),
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
  paymentMethods: PaymentMethodOption[],
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
    // Brand label only — the surrounding rows already say "Payment Method" /
    // "Refund to", so a `Via`/`Qua` prefix here would read twice.
    paymentMethod: detail.payment
      ? getPaymentLabel(paymentMethods, detail.payment.method)
      : undefined,
    foodDrink,
  };

  // A ticket I gave away stays `active` for whoever holds it now, so the
  // viewer role — not the entitlement status — decides the shape: my page is a
  // closed history page, never an actionable ticket.
  if (detail.viewerRole === "sender" && detail.transferredAway) {
    return {
      ...base,
      status: "transferred",
      viewerRole: "sender",
      ticketCount: seatItems.length,
      transferProvenance: {
        direction: "sent",
        counterpartyName: detail.transferredAway.recipient.name,
        amount: detail.transferredAway.amount,
        settledAt: detail.transferredAway.transferredAt,
      },
    };
  }

  if (detail.ticketStatus === "active") {
    const ticket: UpcomingTicket = {
      ...base,
      status: toDetailStatus(detail.ticketStatus) as UpcomingTicket["status"],
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
    status: toDetailStatus(detail.ticketStatus) as PastTicket["status"],
    ticketCount: seatItems.length,
  };
}
