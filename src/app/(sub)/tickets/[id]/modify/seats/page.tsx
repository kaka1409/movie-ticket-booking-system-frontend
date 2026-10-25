import SeatInfo from "./components/shared/SeatInfo";
import SeatBottomBar from "./components/mobile/BottomBar";

import ModifySeatMapAdopter from "@/features/tickets/components/ModifySeatMapAdopter";
import SeatMapStepBody from "@/features/tickets/components/SeatMapStepBody";
import ModifySeatGrid from "@/features/tickets/components/ModifySeatGrid";

import DesktopSeatContent from "./components/desktop/SeatContent";

export default function SeatPage() {
  return (
    <>
      {/* Both device trees render, so the target showtime's map is adopted once
          here; the skins only paint what the draft holds. */}
      <ModifySeatMapAdopter />

      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col min-h-dvh">
          <main className="flex-1 overflow-y-auto pb-5 pt-4 px-4 space-y-5">
            <SeatInfo />
            <SeatMapStepBody>
              <ModifySeatGrid />
            </SeatMapStepBody>
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
