import PasswordForm from "./components/mobile/PasswordForm";
import DesktopChangePasswordContent from "./components/desktop/ChangePasswordContent";

export default async function ChangePasswordPage() {
  return (
    <>
      <div className="block md:hidden">
        <PasswordForm />
      </div>
      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
          <DesktopChangePasswordContent />
        </div>
      </div>
    </>
  );
}
