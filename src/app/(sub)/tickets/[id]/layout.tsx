import { notFound } from "next/navigation";
import { getTicketById } from "@/features/tickets/api";
import { TicketDetailProvider } from "@/features/tickets/contexts/TicketDetailContext";
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

  return <TicketDetailProvider ticket={result.data}>{children}</TicketDetailProvider>;
}
