"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import MobileMainLayout from "./mobile/main";
import MobileAuthLayout from "./mobile/auth";
import MobileSubLayout from "./mobile/sub";
import DesktopMainLayout from "./desktop/main";
import DesktopAuthLayout from "./desktop/auth";
import DesktopSubLayout from "./desktop/sub";

interface LayoutProviderProps {
  children: ReactNode;
  layout?: LayoutType;
  title?: string;
  titleKey?: string;
  subtitle?: string;
}

type LayoutType = "auth" | "main" | "sub";

const LAYOUTS = {
  mobile: {
    auth: MobileAuthLayout,
    main: MobileMainLayout,
    sub: MobileSubLayout,
  },
  desktop: {
    auth: DesktopAuthLayout,
    main: DesktopMainLayout,
    sub: DesktopSubLayout,
  },
} as const;

export default function LayoutProvider({
  children,
  layout = "main",
  title,
  titleKey,
  subtitle,
}: LayoutProviderProps) {
  const { t } = useLocale();
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
  const resolvedTitle = titleKey ? t(titleKey) : title;

  if (layout === "sub") {
    return (
      <Layout title={resolvedTitle} subtitle={subtitle}>
        {children}
      </Layout>
    );
  }

  return <Layout>{children}</Layout>;
}
