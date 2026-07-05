"use client";

import MobileRegisterForm from "./components/mobile/RegisterForm";
import DesktopRegisterForm from "./components/desktop/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <div className="block md:hidden">
        <MobileRegisterForm />
      </div>
      <div className="hidden md:block">
        <DesktopRegisterForm />
      </div>
    </>
  );
}
