import MobileTicketDetail from "./components/mobile/MobileTicketDetail";
import DesktopTicketDetail from "./components/desktop/TicketDetail";

export default async function TicketDetailPage() {
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <MobileTicketDetail />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopTicketDetail />
      </div>
    </>
  );
}
