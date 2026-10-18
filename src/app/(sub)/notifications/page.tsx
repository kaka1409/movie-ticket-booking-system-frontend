"use client";

import MobileNotificationList from "./components/mobile/NotificationList";
import DesktopNotificationList from "./components/desktop/NotificationList";

export default function NotificationsPage() {
  return (
    <>
      <div className="block md:hidden">
        <MobileNotificationList />
      </div>
      <div className="hidden md:block">
        <DesktopNotificationList />
      </div>
    </>
  );
}
