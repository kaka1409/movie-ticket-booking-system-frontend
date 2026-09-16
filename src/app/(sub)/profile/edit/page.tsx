import ProfileForm from "./components/mobile/ProfileForm";
import DesktopEditProfileContent from "./components/desktop/EditProfileContent";

export default function EditProfilePage() {
  return (
    <>
      <div className="block md:hidden">
        <ProfileForm />
      </div>
      <div className="hidden md:block">
        <DesktopEditProfileContent />
      </div>
    </>
  );
}
