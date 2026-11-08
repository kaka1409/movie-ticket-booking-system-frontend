import type { ActionFailure } from "@/libs/api";

/** `admin-theme` cookie value: an explicit pick, or `system` to follow the OS. */
export type AdminTheme = "dark" | "light" | "system";

/** `admin-sidebar` cookie value — the rail width from `md:` up. */
export type AdminSidebarMode = "expanded" | "collapsed";

/**
 * Result of every console write. Actions never throw: a rejected delete, a 409
 * `IN_USE` and a dropped connection all arrive as `{ success: false }` with the
 * backend's own message, which is what the dialogs render.
 */
export type AdminActionResult<TData = null> = { success: true; data: TData } | ActionFailure;

/** Pager envelope shared by every backend-paginated admin read. */
export interface AdminPaginationMeta {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export type AdminMovieStatus = "now_showing" | "coming_soon" | "ended";
/**
 * Featured lifecycle the admin list can filter by. Mirrors the backend
 * `FEATURED_STATES`: `flagged` = raw `isFeatured`, `active` = inside the
 * featured window (what the home block shows), `scheduled`/`expired` = the
 * window bounds the storefront never reports.
 */
export type AdminMovieFeaturedState = "flagged" | "active" | "scheduled" | "expired";
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
  trailerUrl?: string | null;
  synopsisVi?: string;
  director?: string;
  language?: string;
  duration?: number;
  /** `YYYY-MM-DD` (the wire already slices the instant). */
  releaseDate?: string;
  ageRatingId?: string;
  ageRatingName?: string;
  /** Live-review average (0–10); `null` while the movie has no review yet. */
  rating: number | null;
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
  trailerUrl?: string | null;
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

export interface MovieResearchCandidate {
  id: string;
  tmdbId: number;
  title: string;
  originalTitle: string | null;
  synopsis: string | null;
  synopsisVi: string | null;
  director: string | null;
  language: string | null;
  duration: number | null;
  releaseDate: string | null;
  posterUrl: string | null;
  trailerUrl: string | null;
  genres: string[];
  markets: string[];
  sourceUrl: string;
  aiReason: string | null;
  aiConfidence: number | null;
  status: "pending" | "rejected" | "importing" | "imported";
  importedMovieId: string | null;
  discoveredAt: string;
}

export type MovieResearchRunStatus = "running" | "paused" | "completed" | "failed" | "stopped";

export interface MovieResearchRun {
  id: string;
  status: MovieResearchRunStatus | string;
  discovered: number;
  enriched: number;
  processed: number;
  model: string | null;
  error: string | null;
  startedAt: string;
  finishedAt: string | null;
}

export interface MovieResearchModel {
  id: string;
  name: string;
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
  latitude?: number | null;
  longitude?: number | null;
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

/* ── Showtime schedule board (day hierarchy) ──────────────────────────────── */

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
  avatarUrl?: string | null;
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

/** Row of `GET /reviews/admin`: the review plus its author and vote tallies. */
export interface AdminReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  deletedAt?: string;
  upvoteCount: number;
  downvoteCount: number;
  user: {
    id: string;
    fullname: string;
    email: string;
    avatarUrl?: string;
  };
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

/* ── Dashboard Metrics & Live Operations ─────────────────────────────────── */

export interface AdminKpiDataPoint {
  label: string;
  value: number;
}

/**
 * One reporting window of a KPI card: headline figure, growth versus the
 * previous window, and the chart series. Revenue/concessions `value` is in
 * VND while `series` stays in millions so Chart.js tick formatters keep working.
 */
export interface AdminKpiRangeData {
  value: number;
  /** `null` when no honest previous-period comparison exists (pending payments). */
  growthPercent: number | null;
  series: AdminKpiDataPoint[];
}

/** Occupancy window: the gauge reads `ratePercent`, the series plots it per bucket. */
export interface AdminKpiOccupancyRange {
  ratePercent: number;
  peakPercent: number;
  differenceFromAverage: number;
  totalSeats: number;
  bookedSeats: number;
  series: AdminKpiDataPoint[];
}

export type AdminKpiRangeMap<T> = Record<AdminAnalyticsTimeRange, T>;

export interface AdminKpiSummary {
  revenue: AdminKpiRangeMap<AdminKpiRangeData>;
  tickets: AdminKpiRangeMap<AdminKpiRangeData>;
  concessions: AdminKpiRangeMap<AdminKpiRangeData>;
  occupancy: AdminKpiRangeMap<AdminKpiOccupancyRange>;
  /** Mean ticket price per window; `value`/series are full VND. */
  avgTicketPrice: AdminKpiRangeMap<AdminKpiRangeData>;
  /** Share of tickets sold with a combo; `value`/series are percents. */
  attachRate: AdminKpiRangeMap<AdminKpiRangeData>;
  /** Share of issued tickets checked in; `value`/series are percents. */
  checkinRate: AdminKpiRangeMap<AdminKpiRangeData>;
  /** Payments still awaiting settlement at window end; `value`/series are counts. */
  pendingPayments: AdminKpiRangeMap<AdminKpiRangeData>;
}

export interface AdminAnalyticsDataPoint {
  label: string;
  ticketRevenue: number;
  fnbRevenue: number;
  totalRevenue: number;
  attendance: number;
}

export type AdminAnalyticsTimeRange = "7d" | "30d" | "12m";

export interface AdminTopMoviePerformance {
  id: string;
  rank: number;
  title: string;
  slug: string;
  posterUrl: string | null;
  genre: string;
  revenue: number;
  ticketsSold: number;
  occupancyRate: number;
}

export interface AdminLiveShowtimeItem {
  id: string;
  startTime: string;
  endTime: string;
  movieTitle: string;
  posterUrl: string | null;
  cinemaName: string;
  roomName: string;
  format: string;
  bookedSeats: number;
  checkedInSeats: number;
  totalSeats: number;
  status: "selling" | "almost_full" | "sold_out" | "in_screen" | "ended";
}

export interface AdminLiveBookingItem {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string | null;
  customerAvatarUrl: string | null;
  movieTitle: string;
  moviePosterUrl: string | null;
  cinemaName: string;
  roomName: string;
  /** Cinema wall-clock day + start time of the booked showtime. */
  showtime: { date: string; startTime: string };
  seatCount: number;
  comboCount: number;
  totalAmount: number;
  paymentMethod: AdminPaymentMethodCode | null;
  paymentStatus: AdminPaymentStatus | null;
  status: "paid" | "holding" | "cancelled";
  createdAt: string;
}

/** `GET /admin/dashboard/metrics` payload — KPI windows + chart series. */
export interface AdminDashboardMetrics {
  kpi: AdminKpiSummary;
  analytics: {
    range7d: AdminAnalyticsDataPoint[];
    range30d: AdminAnalyticsDataPoint[];
    range12m: AdminAnalyticsDataPoint[];
  };
}

/** `GET /admin/dashboard/action-queue` — counts of items needing an operator. */
export interface AdminActionQueue {
  pendingPayments: number;
  pendingRefunds: number;
  awaitingTransfers: number;
  deletedReviews: number;
  bannedUsers: number;
  asOf: string;
}

export interface AdminPaymentMethodHealth {
  success: number;
  failed: number;
  pending: number;
  expired: number;
  /** Successful-charge revenue over the last 30 days, in VND. */
  revenue: number;
}

/** `GET /admin/dashboard/payment-health` — per-method stats + gateway state. */
export interface AdminPaymentHealth {
  demoMode: boolean;
  methods: (AdminPaymentMethod & { stats: AdminPaymentMethodHealth })[];
}

/* ── Transactions (bookings + payments + tickets) ─────────────────────────── */

export type AdminBookingStatus = "pending" | "paid" | "expired" | "cancelled";
export type AdminPaymentStatus = "pending" | "success" | "failed" | "expired";
export type AdminPaymentMethodCode = "vnpay" | "momo" | "simulated";
export type AdminTicketStatus = "active" | "used" | "expired" | "cancelled" | "refunded";

/** One row of the admin transaction table — the booking (= order) plus payment/ticket state. */
export interface AdminTransaction {
  id: string;
  status: AdminBookingStatus;
  totalPrice: number;
  createdAt: string;
  contact: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  customer: {
    id: string;
    fullname: string | null;
    email: string;
    avatarUrl?: string | null;
  };
  movie: {
    id: string;
    title: string;
    slug: string;
    posterUrl: string | null;
  };
  showtime: {
    id: string;
    date: string;
    startTime: string;
    cinemaName: string;
    roomName: string;
  };
  seatCount: number;
  payment: {
    id: string;
    method: AdminPaymentMethodCode;
    status: AdminPaymentStatus;
    reason: string | null;
    transactionRef: string | null;
    paidAt: string | null;
  } | null;
  ticket: {
    id: string;
    status: AdminTicketStatus;
    usedAt: string | null;
  } | null;
}

export interface AdminTransactionDetail {
  id: string;
  status: AdminBookingStatus;
  totalPrice: number;
  createdAt: string;
  expiresAt: string | null;
  contact: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  customer: {
    id: string;
    fullname: string | null;
    email: string;
    avatarUrl?: string | null;
  };
  showtime: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    format: string;
    movie: {
      id: string;
      title: string;
      slug: string;
      posterUrl: string | null;
      duration: number | null;
      ageRating: string | null;
    };
    cinema: {
      id: string;
      name: string;
      address: string;
    };
    room: {
      id: string;
      name: string;
    };
  };
  seats: { id: string; label: string; type: string; price: number }[];
  combos: { id: string; name: string; quantity: number; price: number }[];
  foods: { id: string; name: string; quantity: number; price: number }[];
  payments: {
    id: string;
    kind: string;
    method: AdminPaymentMethodCode;
    status: AdminPaymentStatus;
    reason: string | null;
    amount: number;
    transactionRef: string | null;
    providerTransactionId: string | null;
    paidAt: string | null;
    expiresAt: string | null;
    createdAt: string;
    refunds: {
      id: string;
      amount: number;
      status: string;
      reason: string | null;
      createdAt: string;
    }[];
  }[];
  ticket: {
    id: string;
    status: AdminTicketStatus;
    issuedAt: string;
    usedAt: string | null;
    revokedAt: string | null;
    owner: {
      id: string;
      fullname: string | null;
      email: string;
      avatarUrl?: string | null;
    };
    transfers: {
      id: string;
      status: string;
      amount: number;
      paymentExpiresAt: string | null;
      createdAt: string;
      senderId: string;
      recipientId: string;
    }[];
  } | null;
}

/* ── Tickets ──────────────────────────────────────────────────────────────── */

/** One row of the admin ticket table — entitlement + owner/buyer + showtime context. */
export interface AdminTicket {
  id: string;
  status: AdminTicketStatus;
  issuedAt: string;
  usedAt: string | null;
  revokedAt: string | null;
  owner: {
    id: string;
    fullname: string | null;
    email: string;
    avatarUrl?: string | null;
  };
  buyer: {
    id: string;
    fullname: string | null;
    email: string;
    avatarUrl?: string | null;
  };
  booking: {
    id: string;
    status: AdminBookingStatus;
    totalPrice: number;
  };
  showtime: {
    id: string;
    date: string;
    startTime: string;
    movie: {
      id: string;
      title: string;
      slug: string;
      posterUrl: string | null;
    };
    cinemaName: string;
    roomName: string;
  };
  seatCount: number;
  hasOpenTransfer: boolean;
}

export interface AdminTicketDetail {
  id: string;
  status: AdminTicketStatus;
  issuedAt: string;
  usedAt: string | null;
  revokedAt: string | null;
  reminderSentAt: string | null;
  owner: {
    id: string;
    fullname: string | null;
    email: string;
    avatarUrl?: string | null;
  };
  /** Same wire shape as the customer-facing booking detail (`toBookingDetail`). */
  booking: {
    id: string;
    status: AdminBookingStatus;
    totalPrice: number;
    createdAt: string;
    expiresAt: string | null;
    transactionRef: string | null;
    payment: {
      method: AdminPaymentMethodCode;
      status: AdminPaymentStatus;
      reason: string | null;
    } | null;
    showtime: {
      id: string;
      date: string;
      startTime: string;
      endTime: string;
      format: string;
      movie: {
        id: string;
        title: string;
        slug: string;
        posterUrl: string | null;
        duration: number | null;
        ageRating: string | null;
      };
      cinema: { id: string; name: string; address: string };
      room: { id: string; name: string };
    };
    seats: { id: string; label: string; type: string; price: number }[];
    combos: { id: string; name: string; quantity: number; price: number }[];
    foods: { id: string; name: string; quantity: number; price: number }[];
    contact: { name: string; email: string; phone: string } | null;
  };
  transfers: {
    id: string;
    status: string;
    amount: number;
    paymentExpiresAt: string | null;
    createdAt: string;
    sender: { id: string; fullname: string | null; email: string; avatarUrl?: string | null };
    recipient: { id: string; fullname: string | null; email: string; avatarUrl?: string | null };
    payments: {
      id: string;
      kind: string;
      method: AdminPaymentMethodCode;
      status: AdminPaymentStatus;
      amount: number;
      transactionRef: string | null;
      paidAt: string | null;
      createdAt: string;
    }[];
  }[];
}

/** Result of an admin ticket cancel — same shape as the customer cancel. */
export interface AdminTicketCancelResult {
  success: boolean;
  refundStatus: "processing" | "none";
  refundAmount: number;
}
