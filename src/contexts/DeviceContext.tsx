"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Device } from "@/types";

/**
 * Server-guessed device (from the request User-Agent, see `resolveInitialDevice`
 * in `src/app/layout.tsx`) so the first paint — SSR and hydration alike —
 * renders the right layout variant instead of flashing mobile-then-desktop.
 * `useDevice` still owns the truth after mount: its `matchMedia` effect
 * corrects a misclassified UA (e.g. iPadOS reporting desktop) and follows
 * window resizes across the breakpoint.
 */
const DeviceContext = createContext<Device>("mobile");

export function DeviceProvider({
  initialDevice,
  children,
}: {
  initialDevice: Device;
  children: ReactNode;
}) {
  return <DeviceContext.Provider value={initialDevice}>{children}</DeviceContext.Provider>;
}

export function useInitialDevice(): Device {
  return useContext(DeviceContext);
}
