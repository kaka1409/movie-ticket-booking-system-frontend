export interface Showtime {
  id?: string;
  time: string;
  room: string;
  available: boolean;
  date?: string;
}

export interface Cinema {
  id: string;
  name: string;
  address: string;
  distance?: string;
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
  isAvailable: boolean;
}

export interface GroupedShowtimeCinema {
  id: string;
  name: string;
  address: string;
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
    badge: string;
  };
  room: {
    id: string;
    name: string;
  };
}
