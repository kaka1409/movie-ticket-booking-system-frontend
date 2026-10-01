import { notFound } from "next/navigation";
import { getTicketById } from "@/features/tickets/api";
import { TicketDetailProvider } from "@/features/tickets/contexts/TicketDetailContext";
import { getRequestCookie } from "@/libs/session";

export default async function TicketDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getTicketById(id, await getRequestCookie());

  if (!ticket) {
    notFound();
  }

  return <TicketDetailProvider ticket={ticket}>{children}</TicketDetailProvider>;
}
