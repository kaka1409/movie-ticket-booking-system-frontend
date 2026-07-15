import LayoutProvider from "@/layouts/LayoutProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutProvider layout="auth">{children}</LayoutProvider>;
}
