import MobileRegisterForm from "./components/mobile/RegisterForm";
import DesktopRegisterForm from "./components/desktop/RegisterForm";
import { authReturnTarget } from "@/features/auth/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ returnUrl?: string }>;
}) {
  const { returnUrl } = await searchParams;
  /* Carried through from the login page (which links here with it) so a visitor
     who signs up instead of signing in still lands on the original target. */
  const target = authReturnTarget(returnUrl);

  return (
    <>
      <div className="block md:hidden">
        <MobileRegisterForm returnUrl={target} />
      </div>
      <div className="hidden md:block">
        <DesktopRegisterForm returnUrl={target} />
      </div>
    </>
  );
}
