import PasswordForm from "./components/mobile/PasswordForm";
import DesktopChangePasswordContent from "./components/desktop/ChangePasswordContent";

export default async function ChangePasswordPage() {
  return (
    <>
      <div className="block md:hidden">
        <PasswordForm />
      </div>
      <div className="hidden md:block">
        <DesktopChangePasswordContent />
      </div>
    </>
  );
}
