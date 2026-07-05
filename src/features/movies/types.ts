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
  cast: string[];
  releaseDate: string;
  ageRating: string;
  language: string;
}
