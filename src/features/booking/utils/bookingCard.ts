import type { Movie } from "@/features/movies/types";
import { getPaymentLabel } from "./paymentBrand";
import type { BookingDetail, PaymentMethodOption, SelectedCombo, SelectedSeat } from "../types";

interface BookingCardData {
  /** Seats merged per label — both sweetbox chairs collapse back into one pair line. */
  seats: SelectedSeat[];
  snacks: SelectedCombo[];
  paymentMethod: string;
  total: number;
  theater: string;
  dateTime: string;
  bookingRef: string;
}

/**
 * Map a `GET /bookings/:id` payload onto the shape the success/failed cards
 * render (they were written against BookingContext). The payment label is
 * resolved from the catalog because the ids are opaque wire values.
 */
export function bookingCardData(
  booking: BookingDetail,
  paymentMethods: PaymentMethodOption[],
): BookingCardData {
  const seatsByLabel = new Map<string, SelectedSeat>();
  for (const seat of booking.seats) {
    const existing = seatsByLabel.get(seat.label);
    if (existing) {
      // Sweetbox pair: two chairs share one label — merge so the card shows
      // `I(1-2) … 1× 280000` instead of the pair listed twice.
      existing.price += seat.price;
      existing.seatIds.push(seat.id);
    } else {
      seatsByLabel.set(seat.label, {
        seatIds: [seat.id],
        label: seat.label,
        type: seat.type,
        price: seat.price,
      });
    }
  }

  return {
    seats: [...seatsByLabel.values()],
    snacks: [
      ...booking.combos.map((combo) => ({
        id: combo.id,
        name: combo.name,
        qty: combo.quantity,
        price: combo.price,
      })),
      ...booking.foods.map((food) => ({
        id: food.id,
        name: food.name,
        qty: food.quantity,
        price: food.price,
      })),
    ],
    paymentMethod: booking.payment
      ? getPaymentLabel(paymentMethods, booking.payment.method)
      : "N/A",
    total: booking.totalPrice,
    theater: [
      booking.showtime.cinema.name,
      booking.showtime.room.name,
      booking.showtime.cinema.address,
    ]
      .filter(Boolean)
      .join(", "),
    dateTime: `${booking.showtime.date}  ${booking.showtime.startTime}`,
    bookingRef: booking.transactionRef ?? booking.id,
  };
}

/** Movie identity printed on a ticket/receipt header. */
interface TicketIdentity {
  posterSrc: string | null;
  title: string;
  ageRating?: string;
}

/**
 * Resolve the poster/title/age-rating a ticket or receipt card shows: the
 * movie-detail payload (direct-link entry, no `?bookingId=`) wins, the
 * authoritative `GET /bookings/:id` payload is the fallback.
 */
export function resolveTicketIdentity(
  movie: Movie | undefined,
  booking: BookingDetail | null,
): TicketIdentity {
  return {
    posterSrc: movie?.src ?? booking?.showtime.movie.posterUrl ?? null,
    title: movie?.title ?? booking?.showtime.movie.title ?? "N/A",
    ageRating: movie?.ageRating ?? booking?.showtime.movie.ageRating ?? undefined,
  };
}
