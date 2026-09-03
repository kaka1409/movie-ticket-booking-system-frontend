import MobileTicketInfo from "./components/mobile/TicketInfo";
import MobileTicketActions from "./components/mobile/TicketActions";
import DesktopTicketDetail from "./components/desktop/TicketDetail";

export default async function TicketDetailPage() {
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <MobileTicketInfo />
        <MobileTicketActions />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopTicketDetail />
      </div>
    </>
  );
}
