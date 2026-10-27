/** `admin-theme` cookie value: an explicit pick, or `system` to follow the OS. */
export type AdminTheme = "dark" | "light" | "system";

/** `admin-sidebar` cookie value — the rail width from `md:` up. */
export type AdminSidebarMode = "expanded" | "collapsed";

/**
 * Result of every console write. Actions never throw: a rejected delete, a 409
 * `IN_USE` and a dropped connection all arrive as `{ success: false }` with the
 * backend's own message, which is what the dialogs render.
 */
export type AdminActionResult<TData = null> =
  | { success: true; data: TData }
  | { success: false; error: string; status?: number; code?: string };

/** Pager envelope shared by every backend-paginated admin read. */
export interface AdminPaginationMeta {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export type AdminMovieStatus = "now_showing" | "coming_soon" | "ended";
export type AdminUserRole = "USER" | "ADMIN";
export type AdminUserStatus = "active" | "banned";

/* ── Catalogs (genres / formats / age ratings) ─────────────────────────────── */

export type AdminCatalogKind = "genres" | "formats" | "age-ratings";

/**
 * One row of any of the three lookup catalogs. The backend counts usage against
 * a different relation per catalog (`movieCount` / `showtimeCount`), so the read
 * layer normalises it to `usageCount` and the screen stays generic.
 */
export interface AdminCatalogEntry {
  id: string;
  name: string;
  nameVi: string | null;
  sortOrder: number;
  isActive: boolean;
  usageCount: number;
}

export interface AdminCatalogInput {
  /** Required on create; every other field is a partial update. */
  name?: string;
  nameVi?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

/* ── Movies ────────────────────────────────────────────────────────────────── */

export interface AdminMovieGenre {
  id: string;
  name: string;
  nameVi: string | null;
}

/** Row-level usage counters, delivered in a parallel array by `/movies/list`. */
export interface AdminMovieCounts {
  showtimes: number;
  reviews: number;
  wishlists: number;
}

export interface AdminMovie {
  id: string;
  title: string;
  slug: string;
  status: AdminMovieStatus;
  posterUrl?: string;
  synopsis?: string;
  synopsisVi?: string;
  director?: string;
  language?: string;
  duration?: number;
  /** `YYYY-MM-DD` (the wire already slices the instant). */
  releaseDate?: string;
  ageRatingId?: string;
  ageRatingName?: string;
  rating: number;
  isFeatured: boolean;
  featuredLabel?: string;
  featuredLabelVi?: string;
  featuredDescription?: string;
  featuredDescriptionVi?: string;
  featuredFrom?: string;
  featuredTo?: string;
  featuredOrder?: number;
  genres: AdminMovieGenre[];
  counts?: AdminMovieCounts;
}

export interface AdminMovieCastItem {
  castId: string;
  name: string;
  roleName?: string;
  imageUrl?: string;
  sortOrder: number;
}

/** Write payload for `POST`/`PATCH /movies`; cast rows have their own routes. */
export interface AdminMovieInput {
  title?: string;
  /** Only honoured on create — the slug is immutable afterwards. */
  slug?: string;
  status?: AdminMovieStatus;
  synopsis?: string;
  synopsisVi?: string;
  director?: string;
  language?: string;
  duration?: number;
  releaseDate?: string;
  ageRatingId?: string | null;
  posterUrl?: string | null;
  genreIds?: string[];
  isFeatured?: boolean;
  featuredLabel?: string | null;
  featuredLabelVi?: string | null;
  featuredDescription?: string | null;
  featuredDescriptionVi?: string | null;
  featuredFrom?: string | null;
  featuredTo?: string | null;
  featuredOrder?: number;
}

export interface AdminMovieCreateInput extends AdminMovieInput {
  title: string;
}

export interface AdminCastInput {
  name: string;
  roleName?: string;
  imageUrl?: string;
  sortOrder?: number;
}

/* ── Cinemas & rooms ───────────────────────────────────────────────────────── */

export interface AdminCinemaRoom {
  id: string;
  name: string;
  showtimes: number;
  seats: number;
}

export interface AdminCinema {
  id: string;
  name: string;
  address: string;
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
  cinemaId: string;
  cinemaName: string;
  rows: AdminSeatLayoutRow[];
}

export interface AdminCinemaInput {
  name?: string;
  address?: string;
  badge?: string | null;
}

export interface AdminRoomInput {
  cinemaId?: string;
  name?: string;
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

/* ── Showtimes ─────────────────────────────────────────────────────────────── */

export interface AdminShowtimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  format: string;
  roomId: string;
  roomName: string;
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
  room: { id: string; name: string; cinema: { id: string; name: string } };
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

/* ── Snacks ────────────────────────────────────────────────────────────────── */

export interface AdminFoodItemInput {
  name?: string;
  nameVi?: string;
  category?: string;
  price?: number;
  image?: string | null;
  isActive?: boolean;
}

export interface AdminComboInput {
  name?: string;
  nameVi?: string | null;
  description?: string | null;
  descriptionVi?: string | null;
  price?: number;
  image?: string | null;
  tag?: string | null;
  isActive?: boolean;
}

export interface AdminFoodItem {
  id: string;
  name: string;
  nameVi?: string;
  category: string;
  price: number;
  image?: string;
  isActive: boolean;
  bookingCount: number;
}

export interface AdminCombo {
  id: string;
  name: string;
  nameVi?: string;
  description?: string;
  descriptionVi?: string;
  price: number;
  image?: string;
  tag?: string;
  isActive: boolean;
  bookingCount: number;
}

/* ── Accounts ──────────────────────────────────────────────────────────────── */

export interface AdminUser {
  id: string;
  fullname: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  createdAt: string;
  bookingCount: number;
}

/* ── Payments & moderation ─────────────────────────────────────────────────── */

export interface AdminPaymentMethod {
  id: string;
  nameEn: string;
  nameVi?: string;
  descriptionEn?: string;
  descriptionVi?: string;
  sortOrder: number;
  isActive: boolean;
  /** Gateway adapter is switched on in the backend env. */
  adapterEnabled: boolean;
}

export interface AdminPaymentMethodInput {
  nameEn?: string;
  nameVi?: string | null;
  descriptionEn?: string;
  descriptionVi?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface AdminReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  movie: {
    id: string;
    slug: string;
    title: string;
    genre: string;
    src?: string;
    posterUrl?: string;
  };
}

/* ── Gate ──────────────────────────────────────────────────────────────────── */

export interface AdminCheckinResult {
  ticketId: string;
  bookingId: string;
  status: "used";
  usedAt: string;
  ownerName: string;
  movieTitle: string;
  cinemaName: string;
  roomName: string;
  format: string;
  date: string;
  startTime: string;
  endTime: string;
  seatLabels: string[];
}
