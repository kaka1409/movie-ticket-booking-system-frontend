"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocale } from "@/contexts/LocaleContext";

const TRANSITION_MS = 450;

/**
 * Wraps a card/list region so a language switch dims it briefly and re-triggers
 * the enter animation, mirroring the /movies grid behaviour on locale change.
 */
export default function LocaleTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { locale } = useLocale();
  const [isChanging, setIsChanging] = useState(false);
  const previousLocaleRef = useRef(locale);

  useEffect(() => {
    if (locale === previousLocaleRef.current) return;
    previousLocaleRef.current = locale;
    setIsChanging(true);
    const timer = setTimeout(() => setIsChanging(false), TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [locale]);

  return (
    <div
      className={`transition-opacity duration-300 ${isChanging ? "opacity-50" : "opacity-100"} ${className ?? ""}`}
    >
      <div key={locale} className={isChanging ? "" : "animate-fade-in"}>
        {children}
      </div>
    </div>
  );
}
