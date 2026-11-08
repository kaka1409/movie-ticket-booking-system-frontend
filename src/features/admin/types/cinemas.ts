export interface AdminCinemaRoom {
  id: string;
  name: string;
  nameVi: string | null;
  showtimes: number;
  seats: number;
}

export interface AdminCinema {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  badge?: string;
  rooms: AdminCinemaRoom[];
}

export interface AdminRoom extends AdminCinemaRoom {
  cinemaId: string;
  cinemaName: string;
}

export interface AdminSeatType {
  id: string;
  name: string;
  basePrice: number;
  /** Derived `Seat`/`RoomSeatConfig` references — 0 means safe to delete. */
  seatCount: number;
  configCount: number;
}

export interface AdminSeatLayoutSegment {
  start: number;
  end: number;
  seatTypeId: string;
  seatTypeName: string;
}

export interface AdminSeatLayoutRow {
  rowLabel: string;
  segments: AdminSeatLayoutSegment[];
}

export interface AdminSeatLayout {
  id: string;
  name: string;
  nameVi: string | null;
  cinemaId: string;
  cinemaName: string;
  rows: AdminSeatLayoutRow[];
}

export interface AdminCinemaInput {
  name?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  badge?: string | null;
}

export interface AdminRoomInput {
  cinemaId?: string;
  name?: string;
  nameVi?: string | null;
}

/** One segment of a seat row: seats `start..end` share a seat type. */
export interface AdminSeatSegmentInput {
  start: number;
  end: number;
  seatTypeId: string;
}

export interface AdminSeatLayoutRowInput {
  rowLabel: string;
  segments: AdminSeatSegmentInput[];
}

export interface AdminSeatLayoutInput {
  rows?: AdminSeatLayoutRowInput[];
}
