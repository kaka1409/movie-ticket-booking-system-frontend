"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import en from "@/locales/en.json";
import vn from "@/locales/vn.json";

type Locale = "en" | "vn";
type Messages = Record<string, string>;

const messages: Record<Locale, Messages> = { en, vn };

interface LocaleContextType {
  locale: Locale;
  setLocale: (newLocale: Locale) => void;
  translate: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

const LOCALE_EVENT = "locale-change";

function getSnapshot(): Locale {
  const saved = localStorage.getItem("locale");
  return saved === "vn" ? "vn" : "en";
}

function getServerSnapshot(): Locale {
  return "en";
}

function subscribe(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(LOCALE_EVENT, handler);
  return () => window.removeEventListener(LOCALE_EVENT, handler);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem("locale", newLocale);
    window.dispatchEvent(new Event(LOCALE_EVENT));
  }, []);

  const translate = useCallback(
    (key: string) => messages[locale][key] ?? key,
    [locale],
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, translate }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextType {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
