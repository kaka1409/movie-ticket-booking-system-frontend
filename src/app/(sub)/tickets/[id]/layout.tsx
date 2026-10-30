import { notFound } from "next/navigation";
import { getTicketById } from "@/features/tickets/api";
import { TicketDetailProvider } from "@/features/tickets/contexts/TicketDetailContext";
import TicketRealtimeRefresh from "@/app/(sub)/tickets/components/shared/TicketRealtimeRefresh";
import LoginPrompt from "@/components/shared/LoginPrompt";
import { getRequestCookie, getRequestLocale, isUnauthorizedResult } from "@/libs/session";

export default async function TicketDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getTicketById(id, await getRequestCookie(), await getRequestLocale());

  // Dead session → prompt in place (never redirect: a child redirect would
  // win over the parent layout's own prompt and yank the URL).
  if (isUnauthorizedResult(result)) {
    return <LoginPrompt />;
  }
  // An absent ticket surfaces as the backend 404 — anything else failed
  // mid-fetch also lands here (no ticket to show either way).
  if ("error" in result) {
    notFound();
  }

  return (
    <TicketDetailProvider ticket={result.data}>
      {/* Live view: re-reads this ticket when someone else changes it, and
          navigates to /tickets if ownership moved away (avoids a 404 page). */}
      <TicketRealtimeRefresh ticketId={result.data.id} />
      {children}
    </TicketDetailProvider>
  );
}
