"use client";

import EditProfileContent from "./components/mobile/EditProfileContent";
import DesktopEditProfileContent from "./components/desktop/EditProfileContent";

export default function EditProfilePage() {
  return (
    <>
      <div className="block md:hidden">
        <EditProfileContent />
      </div>
      <div className="hidden md:block">
        <DesktopEditProfileContent />
      </div>
    </>
  );
}
