import type { ReactNode } from "react";
import type { LayoutType } from "./constants";
import MainLayout from "./main";
import AuthLayout from "./auth";
import SubLayout from "./sub";
import BlankLayout from "./blank";

interface LayoutProviderProps {
  children: ReactNode;
  layout?: LayoutType;
}

const LAYOUTS = {
  main: MainLayout,
  auth: AuthLayout,
  sub: SubLayout,
  blank: BlankLayout,
} as const;

export default function LayoutProvider({ children, layout = "main" }: LayoutProviderProps) {
  const Layout = LAYOUTS[layout];

  if (layout === "main") {
    return <MainLayout>{children}</MainLayout>;
  }

  return <Layout>{children}</Layout>;
}
