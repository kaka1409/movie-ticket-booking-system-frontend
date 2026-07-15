// ─── Layout Types ──────────────────────────────────
export type Device = "mobile" | "desktop";

// ─── Movie Types ───────────────────────────────────
export interface CastMember {
  name: string;
  role: string;
  src: string;
}

export interface Movie {
  id: string;
  title: string;
  slug: string;
  genre: string;
  rating: number;
  duration: number;
  src?: string;
  synopsis: string;
  director: string;
  cast: CastMember[];
  releaseDate: string;
  ageRating: string;
  language: string;
}

export interface FeaturedMovie extends Movie {
  label: string;
  description: string;
}

// ─── Profile Types ─────────────────────────────────
export interface User {
  name: string;
  email: string;
  phone: string;
  dob: string;
  tier: "Member" | "Gold Member" | "Platinum";
  avatarUrl: string;
}

// ─── Notification Types ────────────────────────────
export type NotifType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: number;
  type: NotifType;
  title: string;
  message: string | React.ReactNode;
  time: string;
  meta?: string;
  action?: { label: string; href: string };
  read: boolean;
}

// ─── Booking Types (used outside booking flow) ─────
export interface SelectedSeat {
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

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  badge?: string;
}

// ─── Shared Component Props ────────────────────────
export interface OrderDisplayProps {
  movie: Movie | undefined;
  transactionId: string;
  cinemaName: string;
  room: string;
  date: string;
  time: string;
  selectedSeats: SelectedSeat[];
  seatType: string;
  paymentMethod: string;
  combos: SelectedCombo[];
  foods: SelectedFood[];
  total: number;
}
