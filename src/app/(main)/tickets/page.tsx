import { Suspense } from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoginPrompt from "@/components/shared/LoginPrompt";
import { getRequestCookie, getRequestLocale, hasSession } from "@/libs/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Tickets",
  robots: { index: false },
};

// Mobile components
import Tabs from "@/app/(main)/tickets/components/mobile/Tabs";
import { MobileTicketListSkeleton } from "@/app/(main)/tickets/components/mobile/TicketsSkeleton";
import TicketRealtimeRefresh from "@/app/(sub)/tickets/components/shared/TicketRealtimeRefresh";

// Desktop components
import DesktopTicketsSkeleton from "@/app/(main)/tickets/components/desktop/TicketsSkeleton";

import { DesktopTicketsSection, MobileTicketListSection } from "./sections";

/**
 * Streamed listings: the page awaits only the cookies and the query, so the tab
 * bar (mobile) and the header band (desktop) reach the browser at once and the
 * rows fill in per tree. Each tree keeps its own boundary because the fetched
 * rows sit in different DOM positions; the loader is `cache()`-memoized, so the
 * pair is still one backend call.
 */
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

  return (
    <ProtectedRoute>
      {/* Someone else can change a ticket this user is looking at (transfer
          accepted/declined, sender cancelled) — keep both lists live. */}
      <TicketRealtimeRefresh />

      {/* Mobile */}
      <div className="block md:hidden">
        <div className="space-y-4 py-(--space-md)">
          <Tabs activeTab={tab} />
          <Suspense fallback={<MobileTicketListSkeleton />}>
            <MobileTicketListSection tab={tab} page={page} cookie={requestCookie} locale={locale} />
          </Suspense>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <Suspense fallback={<DesktopTicketsSkeleton />}>
          <DesktopTicketsSection tab={tab} page={page} cookie={requestCookie} locale={locale} />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
