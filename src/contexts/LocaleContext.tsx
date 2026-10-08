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
import en from "@/locales/en.json";
import vn from "@/locales/vn.json";

export type Locale = "en" | "vn";
type Messages = Record<string, unknown>;

const messages: Record<Locale, Messages> = { en, vn };

const STORAGE_KEY = "locale";
/** Fired by `setLocale` so other listeners re-read the snapshot (same tab). */
const LOCALE_CHANGE_EVENT = "localechange";

/** localStorage first (written by `setLocale`), cookie as the cross-tab fallback. */
function readSavedLocale(): Locale | null {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage disabled — fall through to the cookie below
  }
  if (saved !== "vn" && saved !== "en") {
    saved = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/)?.[1] ?? null;
  }
  return saved === "vn" || saved === "en" ? saved : null;
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
const getServerSnapshot = (): Locale => "en";

interface LocaleContextType {
  locale: Locale;
  setLocale: (newLocale: Locale) => void;
  translate: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

/**
 * Locale lives in an external store (localStorage + cookie) so the root layout
 * never has to read cookies — SSR always renders the default (EN), and the
 * saved choice applies through `useSyncExternalStore` right after hydration.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocale = useCallback((newLocale: Locale) => {
    document.cookie = `${STORAGE_KEY}=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // Ignore if localStorage is disabled
    }
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  }, []);

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
