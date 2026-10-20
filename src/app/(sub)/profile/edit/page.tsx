import ProfileForm from "./components/mobile/ProfileForm";
import DesktopEditProfileContent from "./components/desktop/EditProfileContent";

export default function EditProfilePage() {
  return (
    <>
      <div className="block md:hidden">
        <ProfileForm />
      </div>
      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
          <DesktopEditProfileContent />
        </div>
      </div>
    </>
  );
}
