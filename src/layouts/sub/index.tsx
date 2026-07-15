"use client";

import { useDevice } from "@/hooks/useDevice";
import MobileSubLayout from "./mobile/SubLayout";
import DesktopSubLayout from "./desktop/SubLayout";

export default function SubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const device = useDevice();

  return device === "mobile" ? (
    <MobileSubLayout>{children}</MobileSubLayout>
  ) : (
    <DesktopSubLayout>{children}</DesktopSubLayout>
  );
}
