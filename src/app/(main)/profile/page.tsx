import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoginPrompt from "@/components/shared/LoginPrompt";
import { hasSession } from "@/libs/session";
import Avatar from "./components/mobile/Avatar";
import UserInfo from "./components/mobile/UserInfo";
import ProfileMenu from "./components/mobile/ProfileMenu";
import DesktopProfileContent from "./components/desktop/ProfileContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  robots: { index: false },
};

export default async function ProfilePage() {
  if (!(await hasSession())) return <LoginPrompt />;

  return (
    <ProtectedRoute>
      <>
        {/* Mobile */}
        <div className="block md:hidden">
          <div className="flex flex-col items-center pt-10 pb-8">
            <Avatar />
            <UserInfo />
            <ProfileMenu />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <DesktopProfileContent />
        </div>
      </>
    </ProtectedRoute>
  );
}
