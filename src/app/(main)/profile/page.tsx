import { getUser } from "@/features/profile/api";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Avatar from "./components/mobile/Avatar";
import UserInfo from "./components/mobile/UserInfo";
import ProfileMenu from "./components/mobile/ProfileMenu";
import DesktopProfileContent from "./components/desktop/ProfileContent";

export default async function ProfilePage() {
  const user = await getUser();

  return (
    <ProtectedRoute>
      <>
        {/* Mobile */}
        <div className="block md:hidden">
          <div className="flex flex-col items-center pt-10 pb-8">
            <Avatar user={user} />
            <UserInfo user={user} />
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
