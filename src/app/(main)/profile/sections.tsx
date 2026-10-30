import { getProfileUpcomingTickets } from "@/features/tickets/api";
import { getMyReviews } from "@/features/reviews/api";
import { getWishlist } from "@/features/wishlist/api";
import NextScreeningWidget from "./components/desktop/NextScreeningWidget";
import type { UpcomingTicket } from "@/features/tickets/types";

type ProfileSectionProps = { cookie: string | undefined; locale: "en" | "vn" };

/** Each activity count is a separate feed so one slow endpoint cannot hold the others. */
export async function TicketCountSection({ cookie, locale }: ProfileSectionProps) {
  const result = await getProfileUpcomingTickets(cookie, locale);
  const count = "error" in result ? null : (result.meta?.total ?? result.data.length);
  return <span>{count ?? "—"}</span>;
}

export async function ReviewCountSection({ cookie, locale }: ProfileSectionProps) {
  const result = await getMyReviews({ skip: 0, limit: 1 }, cookie, locale);
  return <span>{"error" in result ? "—" : result.data.total}</span>;
}

export async function WishlistCountSection({ cookie, locale }: ProfileSectionProps) {
  const result = await getWishlist(cookie, locale);
  return <span>{"error" in result ? "—" : result.data.length}</span>;
}

/** Desktop next-screening widget; shares the ticket read with the stats tile. */
export async function NextScreeningSection({ cookie, locale }: ProfileSectionProps) {
  const tickets = await getProfileUpcomingTickets(cookie, locale);
  const nextTicket = "error" in tickets ? null : ((tickets.data as UpcomingTicket[])[0] ?? null);
  return <NextScreeningWidget nextTicket={nextTicket} />;
}
