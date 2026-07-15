"use client";

import { useDevice } from "@/hooks/useDevice";
import MobileAuthLayout from "./mobile/AuthLayout";
import DesktopAuthLayout from "./desktop/AuthLayout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const device = useDevice();

  return device === "mobile" ? (
    <MobileAuthLayout>{children}</MobileAuthLayout>
  ) : (
    <DesktopAuthLayout>{children}</DesktopAuthLayout>
  );
}
