import ForgotPasswordForm from "./components/ForgotPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  robots: { index: false },
};

/**
 * Password-reset route — currently a prepared placeholder (see
 * `ForgotPasswordForm`): the desktop shell and the mobile auth chrome both wrap
 * the same body, so the real flow only has to fill the form in.
 */
export default function ForgotPasswordPage() {
  return (
    <>
      <div className="block md:hidden">
        <ForgotPasswordForm />
      </div>
      <div className="hidden md:block">
        <ForgotPasswordForm />
      </div>
    </>
  );
}
