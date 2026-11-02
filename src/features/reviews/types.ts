export type FilterKey = "recent" | "helpful" | "highest" | "lowest";

export type ReviewSort = FilterKey;

/** Which side of a review the current user picked (one vote per review). */
export type ReviewVote = "up" | "down";

export interface ReviewFilter {
  key: FilterKey;
  label: string;
}

export interface MovieReview {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  upvoteCount: number;
  downvoteCount: number;
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

/** A review as the movie-detail cards render it (wire row already mapped to labels). */
export interface UiReview {
  id: string;
  userId: string;
  user: string;
  src: string | undefined;
  rating: number;
  time: string;
  text: string;
  upvoteCount: number;
  downvoteCount: number;
  myVote: ReviewVote | null;
}

/** Result of `PUT`/`DELETE /reviews/:reviewId/vote` — the caller's end state plus tallies. */
export interface ReviewVoteState {
  reviewId: string;
  upvoteCount: number;
  downvoteCount: number;
  myVote: ReviewVote | null;
}

/** Votes the current user cast on one movie's reviews, keyed by review id. */
export type ReviewVoteMap = Record<string, ReviewVote>;
