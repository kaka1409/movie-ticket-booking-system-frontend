// ─── Layout Types ──────────────────────────────────
export type Device = "mobile" | "desktop";

// ─── Movie Types (shared across features) ──────────
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
