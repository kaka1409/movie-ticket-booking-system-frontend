import LayoutProvider from "@/layouts/LayoutProvider";
import { LoginFormProvider, RegisterFormProvider } from "@/features/auth/context";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider layout="auth">
      <LoginFormProvider>
        <RegisterFormProvider>
          {children}
        </RegisterFormProvider>
      </LoginFormProvider>
    </LayoutProvider>
  );
}
