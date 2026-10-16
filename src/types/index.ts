// ─── Layout Types ──────────────────────────────────
export type Device = "mobile" | "desktop";

// ─── Movie Types (shared across features) ──────────
export interface CastMember {
  name: string;
  role: string;
  src: string;
}

/** Release status — mirrors the backend `MovieStatus` enum (`now_showing` books, others link to detail only). */
export type MovieStatus = "now_showing" | "coming_soon" | "ended";

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
  /** Absent on mock-era rows; live wishlist/catalog payloads always carry it. */
  status?: MovieStatus;
}

export interface FeaturedMovie extends Movie {
  label: string;
  description: string;
}
