/* ─── Selected Items (used across booking steps) ────────── */

/** One cinema/showtime selection written into the booking draft as a unit. */
export interface CinemaDraft {
  cinemaId: string | null;
  cinemaName: string;
  time: string;
  date: string;
  room: string;
  location: string;
  showtimeId?: string;
}

export interface SelectedSeat {
  /** Backend seat UUID(s) — one id per chair; a sweetbox cell carries its pair. */
  seatIds: string[];
  label: string;
  type: string;
  price: number;
}

export interface SelectedCombo {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface SelectedFood {
  id: string;
  name: string;
  qty: number;
  price: number;
}

