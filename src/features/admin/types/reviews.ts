export type AdminReviewStatusFilter = "all" | "live" | "deleted";

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
