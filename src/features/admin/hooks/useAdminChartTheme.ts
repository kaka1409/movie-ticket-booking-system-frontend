"use client";

import { useSyncExternalStore } from "react";
import { getChartPalette, type ChartPalette } from "@/libs/chartjs";

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  const adminContainer = document.querySelector<HTMLElement>("[data-admin-theme]");
  const themeValue = adminContainer?.getAttribute("data-admin-theme");

  if (themeValue === "light") return true;
  if (themeValue === "dark") return false;
  return window.matchMedia("(prefers-color-scheme: light)").matches;
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(callback: () => void): () => void {
  const adminContainer = document.querySelector<HTMLElement>("[data-admin-theme]");
  let observer: MutationObserver | null = null;
  if (adminContainer) {
    observer = new MutationObserver(callback);
    observer.observe(adminContainer, {
      attributes: true,
      attributeFilter: ["data-admin-theme"],
    });
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
  mediaQuery.addEventListener("change", callback);

  return () => {
    observer?.disconnect();
    mediaQuery.removeEventListener("change", callback);
  };
}

/**
 * Hook detecting whether the active admin theme evaluates to light mode,
 * observing runtime mutations on `[data-admin-theme]` and system media query changes.
 */
export function useAdminChartTheme(): { isLight: boolean; palette: ChartPalette } {
  const isLight = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    isLight,
    palette: getChartPalette(isLight),
  };
}
