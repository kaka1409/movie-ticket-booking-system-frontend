import { getTicketById } from "@/features/tickets/api";
import MobileTicketInfo from "./components/mobile/TicketInfo";
import MobileTicketActions from "./components/mobile/TicketActions";
import DesktopTicketDetail from "./components/desktop/TicketDetail";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getTicketById(id);

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-(--color-bg)">
        <p className="text-(--color-text-secondary) text-lg">Ticket not found</p>
      </div>
    );
  }

  const isUpcoming = "cinema" in ticket;
  const detail = isUpcoming ? ticket : ticket;

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <MobileTicketInfo
          ticket={ticket}
          detail={detail}
        />
        {isUpcoming &&
          <MobileTicketActions status={ticket.status}
        />}
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopTicketDetail />
      </div>
    </>
  );
}
