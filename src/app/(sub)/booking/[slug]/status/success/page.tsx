"use client";

import { Suspense } from "react";
import SuccessContent from "./components/mobile/SuccessContent";
import DesktopSuccessContent from "./components/desktop/SuccessContent";

export default function SuccessPage() {
  return (
    <Suspense>
      <div className="block md:hidden">
        <SuccessContent />
      </div>
      <div className="hidden md:block">
        <DesktopSuccessContent />
      </div>
    </Suspense>
  );
}
