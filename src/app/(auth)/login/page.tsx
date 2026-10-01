import LoginForm from "./components/mobile/LoginForm";
import { getSafeReturnUrl } from "@/libs/utils";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnUrl?: string }>;
}) {
  const { returnUrl } = await searchParams;
  const safeReturnUrl = getSafeReturnUrl(returnUrl);

  return (
    <>
      <div className="block md:hidden">
        <LoginForm returnUrl={safeReturnUrl} />
      </div>
      <div className="hidden md:block">
        <LoginForm returnUrl={safeReturnUrl} />
      </div>
    </>
  );
}
