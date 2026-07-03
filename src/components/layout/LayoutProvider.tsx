"use client";

import { useEffect, useState } from "react";
import MobileLayout from "./MobileLayout";
import DesktopLayout from "./DesktopLayout";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");

    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      const device = e.matches ? "desktop" : "mobile";
      setDevice(device);
    };

    update(mql);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return (
    <>
      {device === "mobile" && (
        <>
          <MobileLayout />
          <main className="mx-auto w-full max-w-md flex-1 overflow-y-auto pb-20">
            {children}
          </main>
        </>
      )}
      {device === "desktop" &&
        <DesktopLayout>{children}</DesktopLayout>
      }
    </>
  );
}
