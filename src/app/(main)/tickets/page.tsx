import { Suspense } from "react";
import { getUpcomingTickets, getPastTickets } from "@/features/tickets/api";
import type { TicketPageMeta } from "@/features/tickets/adapters";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoginPrompt from "@/components/shared/LoginPrompt";
import {
  getRequestCookie,
  getRequestLocale,
  hasSession,
  isUnauthorizedResult,
} from "@/libs/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Tickets",
  robots: { index: false },
};

// Mobile components
import Tabs from "@/app/(main)/tickets/components/mobile/Tabs";
import UpcomingTicketList from "@/app/(main)/tickets/components/mobile/UpcomingTicketList";
import PastTicketList from "@/app/(main)/tickets/components/mobile/PastTicketList";
import TicketsSkeleton from "@/app/(main)/tickets/components/mobile/TicketsSkeleton";
import Pager from "@/app/(main)/tickets/components/mobile/Pager";

// Desktop components
import TicketsContent from "@/app/(main)/tickets/components/desktop/TicketsContent";

const DEFAULT_META: TicketPageMeta = {
  total: 0,
  totalPages: 1,
  page: 1,
  limit: 12,
  hasNextPage: false,
};

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>;
}) {
  if (!(await hasSession())) return <LoginPrompt />;
  const requestCookie = await getRequestCookie();
  const locale = await getRequestLocale();

  const query = await searchParams;
  const tab = query.tab === "past" ? "past" : "upcoming";
  const page = Math.max(1, Number(query.page) || 1);

  // Only the visible tab is fetched — the other list renders nothing.
  const upcomingResult =
    tab === "upcoming" ? await getUpcomingTickets(page, requestCookie, locale) : null;
  const pastResult = tab === "past" ? await getPastTickets(page, requestCookie, locale) : null;
  // A dead session (stale refresh cookie → backend 401) renders the prompt
  // in place — no redirect, the visitor stays on /tickets.
  if (upcomingResult && isUnauthorizedResult(upcomingResult)) return <LoginPrompt />;
  if (pastResult && isUnauthorizedResult(pastResult)) return <LoginPrompt />;
  const upcoming = upcomingResult && !("error" in upcomingResult) ? upcomingResult.data : [];
  const past = pastResult && !("error" in pastResult) ? pastResult.data : [];
  const activeResult = upcomingResult ?? pastResult;
  const meta = (activeResult && !("error" in activeResult) && activeResult.meta) || DEFAULT_META;
  return (
    <ProtectedRoute>
      <Suspense fallback={<TicketsSkeleton />}>
        {/* Mobile */}
        <div className="block md:hidden">
          <div className="space-y-4 py-(--space-md)">
            <Tabs activeTab={tab} />
            {tab === "upcoming" ? (
              <UpcomingTicketList tickets={upcoming} />
            ) : (
              <PastTicketList tickets={past} />
            )}
            <Pager meta={meta} tab={tab} />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <TicketsContent />
        </div>
      </Suspense>
    </ProtectedRoute>
  );
}
