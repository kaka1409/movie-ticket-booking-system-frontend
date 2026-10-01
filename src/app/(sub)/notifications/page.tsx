import { getNotifications } from "@/features/notifications/api";
import { getRequestCookie } from "@/libs/session";
import MobileNotificationList from "./components/mobile/NotificationList";
import DesktopNotificationList from "./components/desktop/NotificationList";

export default async function NotificationsPage() {
  const notifications = await getNotifications(await getRequestCookie());

  return (
    <>
      <div className="block md:hidden">
        <MobileNotificationList notifications={notifications} />
      </div>
      <div className="hidden md:block">
        <DesktopNotificationList />
      </div>
    </>
  );
}
