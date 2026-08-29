import { notFound } from "next/navigation";
import { getTicketById } from "@/features/tickets/api";
import { TicketDetailProvider } from "@/features/tickets/contexts/TicketDetailContext";

export default async function TicketDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getTicketById(id);

  if (!ticket) {
    notFound();
  }

  return <TicketDetailProvider ticket={ticket}>{children}</TicketDetailProvider>;
}
