"use client";

import { useDevice } from "@/hooks/useDevice";
import MobileMainLayout from "./mobile/MainLayout";
import DesktopMainLayout from "./desktop/MainLayout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const device = useDevice();

  return device === "mobile" ? (
    <MobileMainLayout>{children}</MobileMainLayout>
  ) : (
    <DesktopMainLayout>{children}</DesktopMainLayout>
  );
}
