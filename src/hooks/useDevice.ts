"use client";

import { useState, useEffect } from "react";
import type { Device } from "@/types";
import { useInitialDevice } from "@/contexts/DeviceContext";

export function useDevice(): Device {
  const initialDevice = useInitialDevice();
  // Server-guessed initial (never "mobile"-by-default anymore) — matches the
  // SSR HTML exactly, so hydration commits no correction and never flashes.
  const [device, setDevice] = useState<Device>(initialDevice);

  useEffect(() => {
    // Threshold mirrors `--breakpoint-md` in `src/styles/global.css` (740px,
    // not the Tailwind default 768px) so the JS device switch and the `md:`
    // page splits change variant on the same pixel.
    const mql = window.matchMedia("(min-width: 740px)");
    const update = (event: MediaQueryListEvent | MediaQueryList) => {
      setDevice(event.matches ? "desktop" : "mobile");
    };
    update(mql);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return device;
}
