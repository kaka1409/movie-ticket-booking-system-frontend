import RegisterForm from "./components/mobile/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <>
      <div className="block md:hidden">
        <RegisterForm />
      </div>
      <div className="hidden md:block">
        <RegisterForm />
      </div>
    </>
  );
}
