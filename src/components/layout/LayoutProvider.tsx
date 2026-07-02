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
      const d = e.matches ? "desktop" : "mobile";
      setDevice(d);
    };

    update(mql);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return (
    <>
      <MobileLayout />
      <DesktopLayout />
      <main
        className={
          device === "mobile"
            ? "flex-1 overflow-y-auto pb-20 max-w-md mx-auto w-full"
            : "flex-1 overflow-y-auto w-full"
        }
      >
        {children}
      </main>
    </>
  );
}
