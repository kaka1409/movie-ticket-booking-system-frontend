export type FilterKey = "recent" | "highest" | "lowest";

export type ReviewSort = FilterKey;

export interface ReviewFilter {
  key: FilterKey;
  label: string;
}

export interface MovieReview {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

/** Own review with the movie card it belongs to (`GET /reviews/me`). */
export interface MyReview {
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

export interface MyReviewsResponse {
  reviews: MyReview[];
  total: number;
}

export interface ReviewSummary {
  average: number;
  total: number;
  ratingSummary: {
    stars: number;
    count: number;
  }[];
}

export interface ReviewsResponse {
  reviews: MovieReview[];
  total: number;
  ratingSummary: ReviewSummary;
}
