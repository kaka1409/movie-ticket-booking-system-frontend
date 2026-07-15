import { getUser } from "@/features/profile/api";
import ProfileForm from "./components/mobile/ProfileForm";
import DesktopEditProfileContent from "./components/desktop/EditProfileContent";

export default async function EditProfilePage() {
  const user = await getUser();

  return (
    <>
      <div className="block md:hidden">
        <ProfileForm user={user} />
      </div>
      <div className="hidden md:block">
        <DesktopEditProfileContent />
      </div>
    </>
  );
}
