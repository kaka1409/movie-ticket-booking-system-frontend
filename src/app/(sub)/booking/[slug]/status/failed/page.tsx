"use client";

import { Suspense } from "react";
import FailContent from "./components/mobile/FailContent";
import DesktopFailContent from "./components/desktop/FailContent";

export default function FailPage() {
  return (
    <Suspense>
      <div className="block md:hidden">
        <FailContent />
      </div>
      <div className="hidden md:block">
        <DesktopFailContent />
      </div>
    </Suspense>
  );
}
