"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import en from "@/locales/en.json";
import vn from "@/locales/vn.json";

export type Locale = "en" | "vn";
type Messages = Record<string, unknown>;

const messages: Record<Locale, Messages> = { en, vn };

const STORAGE_KEY = "locale";
/** Fired by `setLocale` so other listeners re-read the snapshot (same tab). */
const LOCALE_CHANGE_EVENT = "localechange";

function isLocale(value: string | null | undefined): value is Locale {
  return value === "vn" || value === "en";
}

/** Cookie first — it is what the server rendered with, so hydration matches exactly. */
function readCookieLocale(): Locale | null {
  if (typeof document === "undefined") return null;
  const saved = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/)?.[1] ?? null;
  return isLocale(saved) ? saved : null;
}

/** Cookie first (the value the server rendered with), `localStorage` as the fallback. */
function readSavedLocale(): Locale | null {
  const fromCookie = readCookieLocale();
  if (fromCookie) return fromCookie;
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage disabled — nothing left to read
  }
  return isLocale(saved) ? saved : null;
}

function subscribe(onStoreChange: () => void): () => void {
  // `storage` fires in *other* tabs when this one changes the locale.
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) onStoreChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
  };
}

const getSnapshot = (): Locale => readSavedLocale() ?? "en";

interface LocaleContextType {
  locale: Locale;
  setLocale: (newLocale: Locale) => void;
  translate: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

/**
 * Locale is resolved server-side (cookie → Accept-Language → EN, see the root
 * layout) and passed as `initialLocale`, so the SSR HTML already carries the
 * visitor's language — hydration applies no correction, hence no flash.
 * The external store below only takes over for client-side switches.
 */
export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, () => initialLocale);
  const router = useRouter();

  const setLocale = useCallback(
    (newLocale: Locale) => {
      document.cookie = `${STORAGE_KEY}=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
      try {
        localStorage.setItem(STORAGE_KEY, newLocale);
      } catch {
        // Ignore if localStorage is disabled
      }
      window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
      // Static keys switch instantly via the event above, but server-fetched
      // catalog data was frozen at render time — re-render the server segments
      // with the new cookie (client state and scroll are preserved, no reload).
      router.refresh();
    },
    [router],
  );

  /* External-system sync: keep `<html lang>` matching the current locale. */
  useEffect(() => {
    document.documentElement.lang = locale === "vn" ? "vi" : "en";
  }, [locale]);

  const translate = useCallback(
    (key: string) => {
      const parts = key.split(".");
      let result: unknown = messages[locale];
      for (const part of parts) {
        if (result == null || typeof result !== "object") return key;
        result = (result as Record<string, unknown>)[part];
      }
      return typeof result === "string" ? result : key;
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, translate }), [locale, setLocale, translate]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextType {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
