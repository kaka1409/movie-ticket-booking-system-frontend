import SeatInfo from "./components/mobile/SeatInfo";
import SeatMapWrapper from "./components/mobile/SeatMapWrapper";
import SeatBottomBar from "./components/mobile/BottomBar";

import DesktopSeatContent from "./components/desktop/SeatContent";

export default function SeatPage() {
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col min-h-dvh">
          <main className="flex-1 overflow-y-auto pb-5 pt-4 space-y-5">
            <SeatInfo />
            <SeatMapWrapper />
          </main>
          <SeatBottomBar />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopSeatContent />
      </div>
    </>
  );
}
