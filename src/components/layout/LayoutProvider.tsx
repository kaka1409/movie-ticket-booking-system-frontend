"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import MobileMainLayout from "./mobile/main";
import MobileAuthLayout from "./mobile/auth";
import MobileSubLayout from "./mobile/sub";
import MobileBlankLayout from "./mobile/blank";
import DesktopMainLayout from "./desktop/main";
import DesktopAuthLayout from "./desktop/auth";
import DesktopSubLayout from "./desktop/sub";
import DesktopBlankLayout from "./desktop/blank";

interface LayoutProviderProps {
  children: ReactNode;
  layout?: LayoutType;
}

type LayoutType = "auth" | "main" | "sub" | "blank";

const LAYOUTS = {
  mobile: {
    auth: MobileAuthLayout,
    main: MobileMainLayout,
    sub: MobileSubLayout,
    blank: MobileBlankLayout,
  },
  desktop: {
    auth: DesktopAuthLayout,
    main: DesktopMainLayout,
    sub: DesktopSubLayout,
    blank: DesktopBlankLayout,
  },
} as const;

export default function LayoutProvider({
  children,
  layout = "main",
}: LayoutProviderProps) {
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      setDevice(e.matches ? "desktop" : "mobile");
    };
    update(mql);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const layouts = device === "mobile" ? LAYOUTS["mobile"] : LAYOUTS["desktop"];
  const Layout = layouts[layout];

  return <Layout>{children}</Layout>;
}
