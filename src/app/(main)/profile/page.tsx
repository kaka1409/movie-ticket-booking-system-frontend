"use client";

import MobileProfileContent from "./components/mobile/ProfileContent";
import DesktopProfileContent from "./components/desktop/ProfileContent";

export default function ProfilePage() {
  return (
    <>
      <div className="block md:hidden">
        <MobileProfileContent />
      </div>
      <div className="hidden md:block">
        <DesktopProfileContent />
      </div>
    </>
  );
}
