export interface Showtime {
  time: string;
  available: boolean;
}

export interface Cinema {
  id: number;
  name: string;
  address: string;
  distance: string;
  badge: string;
  badgeColor: string;
  showtimes: Showtime[];
}

export interface DateOption {
  value: string;
  day: number;
  month: string;
  weekday: string;
}

export interface BookingSelection {
  cinemaId: number | null;
  time: string;
  date: string;
}

export const BOOKING_STEPS = [
  "SELECT CINEMA",
  "SELECT SEATS",
  "FOOD & DRINKS",
  "PAYMENT",
  "CONFIRM",
] as const;
