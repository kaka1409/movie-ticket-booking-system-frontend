import MobileLoginForm from "./components/mobile/LoginForm";
import DesktopLoginForm from "./components/desktop/LoginForm";

export default function LoginPage() {
  return (
    <>
      <div className="block md:hidden">
        <MobileLoginForm />
      </div>
      <div className="hidden md:block">
        <DesktopLoginForm />
      </div>
    </>
  );
}
