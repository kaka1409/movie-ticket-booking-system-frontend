"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import en from "@/locales/en.json";
import vn from "@/locales/vn.json";

export type Locale = "en" | "vn";
type Messages = Record<string, unknown>;

const messages: Record<Locale, Messages> = { en, vn };

interface LocaleContextType {
  locale: Locale;
  setLocale: (newLocale: Locale) => void;
  translate: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({
  initialLocale = "en",
  children,
}: {
  initialLocale?: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    document.cookie = `locale=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
    try {
      localStorage.setItem("locale", newLocale);
    } catch {
      // Ignore if localStorage is disabled
    }
  }, []);

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
