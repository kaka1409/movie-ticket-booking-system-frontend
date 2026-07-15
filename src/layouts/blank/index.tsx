"use client";

import { useDevice } from "@/hooks/useDevice";
import MobileBlankLayout from "./mobile/BlankLayout";
import DesktopBlankLayout from "./desktop/BlankLayout";

export default function BlankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const device = useDevice();

  return device === "mobile" ? (
    <MobileBlankLayout>{children}</MobileBlankLayout>
  ) : (
    <DesktopBlankLayout>{children}</DesktopBlankLayout>
  );
}
