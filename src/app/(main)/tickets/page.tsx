import { Suspense } from "react";
import { TicketsProvider } from "@/features/tickets/context";
import { getUpcomingTickets, getPastTickets } from "@/features/tickets/api";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoginPrompt from "@/components/shared/LoginPrompt";
import { getRequestCookie, hasSession } from "@/libs/session";
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

// Desktop components
import TicketsContent from "@/app/(main)/tickets/components/desktop/TicketsContent";

export default async function TicketsPage() {
  if (!(await hasSession())) return <LoginPrompt />;
  const requestCookie = await getRequestCookie();

  const [upcoming, past] = await Promise.all([
    getUpcomingTickets(requestCookie),
    getPastTickets(requestCookie),
  ]);

  return (
    <ProtectedRoute>
      <Suspense fallback={<TicketsSkeleton />}>
        <TicketsProvider>
          {/* Mobile */}
          <div className="block md:hidden">
            <div className="space-y-4 py-(--space-md)">
              <Tabs />
              <UpcomingTicketList tickets={upcoming} />
              <PastTicketList tickets={past} />
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <TicketsContent />
          </div>
        </TicketsProvider>
      </Suspense>
    </ProtectedRoute>
  );
}
