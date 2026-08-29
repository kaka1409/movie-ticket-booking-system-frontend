"use client";

import TypeCards from "./components/mobile/TypeCards";
import ModifyBottomBar from "./components/mobile/BottomBar";

import DesktopModifyContent from "./components/desktop/ModifyContent";

export default function ModifyPage() {
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col min-h-dvh">
          <main className="flex-1 overflow-y-auto pb-5 pt-4 space-y-6">
            <TypeCards />
          </main>
          <ModifyBottomBar />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopModifyContent />
      </div>
    </>
  );
}
