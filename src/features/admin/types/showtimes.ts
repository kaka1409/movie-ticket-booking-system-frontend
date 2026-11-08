export interface AdminShowtimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  format: string;
  roomId: string;
  roomName: string;
  roomNameVi: string | null;
  isAvailable: boolean;
}

export interface AdminShowtimeCinema {
  id: string;
  name: string;
  address: string;
  badge: string;
  showtimes: AdminShowtimeSlot[];
}

/** `GET /showtimes?movieSlug&date` — the schedule board for one movie-day. */
export interface AdminShowtimeBoard {
  date: string;
  movie: { id: string; title: string; slug: string };
  cinemas: AdminShowtimeCinema[];
}

/** Answer of a showtime write. */
export interface AdminShowtime {
  id: string;
  movie: { id: string; slug: string; title: string };
  room: { id: string; name: string; nameVi: string | null; cinema: { id: string; name: string } };
  format: { id: string; name: string };
  date: string;
  startTime: string;
  endTime: string;
}

/** `date` is the cinema wall clock day, `startTime` a `HH:mm` wall clock time. */
export interface AdminShowtimeInput {
  movieSlug?: string;
  roomId?: string;
  formatId?: string;
  date?: string;
  startTime?: string;
}

export interface AdminShowtimeCreateInput extends AdminShowtimeInput {
  movieSlug: string;
  roomId: string;
  formatId: string;
  date: string;
  startTime: string;
}



export interface AdminScheduleMovie {
  id: string;
  title: string;
  slug: string;
  posterUrl: string | null;
  duration: number | null;
  ageRating: string | null;
}

export interface AdminScheduleSlot {
  id: string;
  startTime: string;
  endTime: string;
  format: string;
  movie: AdminScheduleMovie;
  bookedSeats: number;
  heldSeats: number;
  totalSeats: number;
  isPast: boolean;
}

export interface AdminScheduleRoom {
  id: string;
  name: string;
  nameVi: string | null;
  totalSeats: number;
  showtimes: AdminScheduleSlot[];
}

export interface AdminScheduleCinema {
  id: string;
  name: string;
  address: string;
  badge: string | null;
  rooms: AdminScheduleRoom[];
}

/** `GET /admin/showtimes/schedule?date=` — cinemas → rooms → showtimes. */
export interface AdminScheduleResult {
  date: string;
  cinemas: AdminScheduleCinema[];
}

/** `GET /admin/showtimes/schedule/summary` row. */
export interface AdminScheduleDayCount {
  date: string;
  count: number;
}

export interface AdminSlotTemplateSlot {
  startTime: string;
  band: "matinee" | "all" | "prime" | "late";
}

/** `GET /admin/showtimes/slot-templates` row — static preset ladder. */
export interface AdminSlotTemplate {
  key: string;
  weekday: AdminSlotTemplateSlot[];
  weekend: AdminSlotTemplateSlot[];
}

export type AdminSeatStatus = "free" | "held" | "booked" | "checked_in";

export interface AdminSeatCell {
  id: string;
  seatNumber: number;
  label: string;
  kind: string;
  price: number;
  status: AdminSeatStatus;
}

export interface AdminSeatRow {
  label: string;
  seats: AdminSeatCell[];
}

/** `GET /admin/showtimes/:id/seats` — read-only ops seat map. */
export interface AdminShowtimeSeats {
  showtimeId: string;
  roomName: string;
  roomNameVi: string | null;
  rows: AdminSeatRow[];
}

export interface AdminSeedShowtimesInput {
  template?: string;
  horizonDays?: number;
  runDays?: number;
  dryRun?: boolean;
}

export interface AdminSeedSkippedSample {
  date: string;
  roomId: string;
  startTime: string;
  reason: "exists" | "conflict" | "past";
}

export interface AdminSeedShowtimesResult {
  template: string;
  horizonDays: number;
  runDays: number;
  dryRun: boolean;
  planned: number;
  created: number;
  skipped: { exists: number; conflict: number; past: number };
  moviesScheduled: number;
  roomsUsed: number;
  skippedSample: AdminSeedSkippedSample[];
}
