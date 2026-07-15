import { getNotifications } from "@/features/notifications/api";
import LayoutProvider from "@/layouts/LayoutProvider";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notifications = await getNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <LayoutProvider layout="main" unreadCount={unreadCount}>
      {children}
    </LayoutProvider>
  );
}
