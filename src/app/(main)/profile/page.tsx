import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Avatar from "./components/mobile/Avatar";
import UserInfo from "./components/mobile/UserInfo";
import ProfileMenu from "./components/mobile/ProfileMenu";
import DesktopProfileContent from "./components/desktop/ProfileContent";

export default function ProfilePage() {
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
