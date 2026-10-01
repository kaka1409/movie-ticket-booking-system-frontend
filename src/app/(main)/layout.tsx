import { getNotifications } from "@/features/notifications/api";
import LayoutProvider from "@/layouts/LayoutProvider";
import { getRequestCookie } from "@/libs/session";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notifications = await getNotifications(await getRequestCookie());
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <LayoutProvider layout="main" unreadCount={unreadCount}>
      {children}
    </LayoutProvider>
  );
}
