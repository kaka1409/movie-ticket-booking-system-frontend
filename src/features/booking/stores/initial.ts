import type { BookingState } from "./types";

export const INITIAL_BOOKING_STATE: BookingState = {
  // Cinema & showtimes
  cinemaId: null,
  showtimeId: "",
  cinemaName: "",
  time: "",
  date: "",
  room: "",
  location: "",
  cinemaQuery: "",
  movie: null,

  // Seats
  selectedSeats: [],
  seatGrid: null,
  maxSeats: 0,
  countdownStarted: false,
  countdownStartTime: 0,
  holdExpiresAt: null,

  // Snacks
  combos: [],
  foods: [],

  // Contact
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  contactCountryCode: "+84",

  // Payment
  paymentMethodId: "",
  paymentMethod: "",
};
