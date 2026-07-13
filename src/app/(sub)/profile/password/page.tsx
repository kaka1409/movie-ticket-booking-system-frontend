"use client";

import ChangePasswordContent from "./components/mobile/ChangePasswordContent";
import DesktopChangePasswordContent from "./components/desktop/ChangePasswordContent";

export default function ChangePasswordPage() {
  return (
    <>
      <div className="block md:hidden">
        <ChangePasswordContent />
      </div>
      <div className="hidden md:block">
        <DesktopChangePasswordContent />
      </div>
    </>
  );
}
