export interface Showtime {
  id?: string;
  time: string;
  room: string;
  available: boolean;
  date?: string;
  /** Catalog format name (2D / IMAX / 3D) — the card groups its chips by it. */
  format?: string;
}

export interface Cinema {
  id: string;
  name: string;
  address: string;
  distance?: string;
  latitude?: number | null;
  longitude?: number | null;
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

export interface ShowtimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  format: string;
  roomId: string;
  roomName: string;
  roomNameVi: string | null;
  isAvailable: boolean;
}

export interface GroupedShowtimeCinema {
  id: string;
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  badge: string;
  showtimes: ShowtimeSlot[];
}

export interface ShowtimesResponse {
  date: string;
  movie: {
    id: string;
    title: string;
    slug: string;
    posterUrl?: string;
    duration: number;
    ageRating: string;
  };
  cinemas: GroupedShowtimeCinema[];
}

export interface ShowtimeDateOption {
  date: string;
  dayOfWeek: string;
  day: number;
  month: number;
  hasShowtimes: boolean;
}

export interface ShowtimeDetail {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  format: string;
  isAvailable: boolean;
  movie: {
    id: string;
    title: string;
    slug: string;
    posterUrl?: string;
    duration: number;
    ageRating: string;
  };
  cinema: {
    id: string;
    name: string;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
    badge: string;
  };
  room: {
    id: string;
    name: string;
    nameVi: string | null;
  };
}

/** Data needed by a movie schedule block for one resolved date. */
export interface MovieSchedule {
  dates: ShowtimeDateOption[];
  /** True when the dates API answered, even with zero days. */
  datesAvailable: boolean;
  date: string;
  cinemas: GroupedShowtimeCinema[];
  error: string | null;
}

/** First-render seed for the home quick-booking widgets. */
export interface QuickBookingSeed {
  locale: "en" | "vn";
  movieSlug: string;
  dates: ShowtimeDateOption[] | null;
  activeDate: string;
  cinemas: GroupedShowtimeCinema[] | null;
  selectedCinemaId: string;
}
