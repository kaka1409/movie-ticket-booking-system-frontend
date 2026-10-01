import LayoutProvider from "@/layouts/LayoutProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { requireAuth } from "@/libs/session";

export default async function SubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <LayoutProvider layout="sub">
      <ProtectedRoute>{children}</ProtectedRoute>
    </LayoutProvider>
  );
}
