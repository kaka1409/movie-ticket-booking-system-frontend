import MobileLoginForm from "./components/mobile/LoginForm";
import DesktopLoginForm from "./components/desktop/LoginForm";
import { authReturnTarget } from "@/libs/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnUrl?: string }>;
}) {
  const { returnUrl } = await searchParams;
  /* Sanitized here, once: the form only ever receives a same-origin target (or
     `undefined` for home, which keeps the tab links plain). */
  const target = authReturnTarget(returnUrl);

  return (
    <>
      <div className="block md:hidden">
        <MobileLoginForm returnUrl={target} />
      </div>
      <div className="hidden md:block">
        <DesktopLoginForm returnUrl={target} />
      </div>
    </>
  );
}
