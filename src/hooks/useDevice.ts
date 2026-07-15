"use client";

import { useState, useEffect } from "react";
import type { Device } from "@/types";

export function useDevice(): Device {
  const [device, setDevice] = useState<Device>("mobile");

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      setDevice(e.matches ? "desktop" : "mobile");
    };
    update(mql);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return device;
}
