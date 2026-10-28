import { cache } from "react";
import { settleApiResponse } from "@/libs/api";
import { getMyReviews } from "@/features/reviews/api";
import { getWishlist } from "@/features/wishlist/api";
import { getUpcomingTickets } from "@/features/tickets/api";
import type { UpcomingTicket } from "@/features/tickets/types";

/** Activity counters for the desktop overview; `null` = the feed failed. */
export interface ProfileStats {
  reviews: number | null;
  wishlist: number | null;
  tickets: number | null;
}

/**
 * First page of upcoming tickets. Two desktop boundaries read it (the stats
 * tile and the next-screening widget), so `cache()` keeps them at one call.
 */
export const getProfileUpcomingTickets = cache((cookie: string | undefined, locale: "en" | "vn") =>
  settleApiResponse(getUpcomingTickets(1, cookie, locale)),
);

/** A failed counter renders as "—" rather than blocking the rest of the page. */
export const getProfileStats = async (
  cookie: string | undefined,
  locale: "en" | "vn",
): Promise<ProfileStats> => {
  const [reviews, wishlist, tickets] = await Promise.all([
    settleApiResponse(getMyReviews({ skip: 0, limit: 1 }, cookie, locale)),
    settleApiResponse(getWishlist(cookie, locale)),
    getProfileUpcomingTickets(cookie, locale),
  ]);

  return {
    reviews: "error" in reviews ? null : reviews.data.total,
    wishlist: "error" in wishlist ? null : wishlist.data.length,
    tickets:
      "error" in tickets
        ? null
        : (tickets.meta?.total ?? (tickets.data as UpcomingTicket[]).length),
  };
};
