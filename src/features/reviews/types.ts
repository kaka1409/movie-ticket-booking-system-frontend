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
