import { Suspense } from "react";

import SuccessIcon from "@/components/shared/SuccessIcon";
import SuccessActions from "./components/mobile/SuccessActions";

import DesktopSuccessContent from "./components/desktop/SuccessContent";

export default function SuccessPage() {
  return (
    <Suspense>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg)">
          <main className="flex-1 overflow-y-auto pb-8 pt-4 space-y-6">
            <SuccessIcon
              titleKey="tickets.modify.success.title"
              messageKey="tickets.modify.success.message"
            />
            <SuccessActions />
          </main>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopSuccessContent />
      </div>
    </Suspense>
  );
}
