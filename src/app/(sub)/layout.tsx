import LayoutProvider from "@/layouts/LayoutProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function SubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider layout="sub">
      <ProtectedRoute>{children}</ProtectedRoute>
    </LayoutProvider>
  );
}
