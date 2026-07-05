"use client";

import MobileTicketsContent from "./components/mobile/TicketsContent";
import DesktopTicketsContent from "./components/desktop/TicketsContent";

export default function TicketsPage() {
  return (
    <>
      <div className="block md:hidden">
        <MobileTicketsContent />
      </div>
      <div className="hidden md:block">
        <DesktopTicketsContent />
      </div>
    </>
  );
}
