"use client";

import { useDevice } from "@/hooks/useDevice";
import MobileMainLayout from "./mobile/MainLayout";
import DesktopMainLayout from "./desktop/MainLayout";

export default function MainLayout({
  children,
  unreadCount = 0,
}: {
  children: React.ReactNode;
  unreadCount?: number;
}) {
  const device = useDevice();

  return device === "mobile" ? (
    <MobileMainLayout unreadCount={unreadCount}>{children}</MobileMainLayout>
  ) : (
    <DesktopMainLayout>{children}</DesktopMainLayout>
  );
}
