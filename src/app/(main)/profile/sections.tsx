import { getProfileStats, getProfileUpcomingTickets } from "@/features/profile/summary";
import AccountStats from "./components/desktop/AccountStats";
import NextScreeningWidget from "./components/desktop/NextScreeningWidget";
import type { UpcomingTicket } from "@/features/tickets/types";

type ProfileSectionProps = { cookie: string | undefined; locale: "en" | "vn" };

/**
 * Desktop activity counters — three independent feeds awaited together, so the
 * card row lands as one block instead of three staggered numbers.
 */
export async function ProfileStatsSection({ cookie, locale }: ProfileSectionProps) {
  const stats = await getProfileStats(cookie, locale);
  return <AccountStats stats={stats} />;
}

/** Desktop next-screening widget; shares the ticket read with the stats tile. */
export async function NextScreeningSection({ cookie, locale }: ProfileSectionProps) {
  const tickets = await getProfileUpcomingTickets(cookie, locale);
  const nextTicket = "error" in tickets ? null : ((tickets.data as UpcomingTicket[])[0] ?? null);
  return <NextScreeningWidget nextTicket={nextTicket} />;
}
