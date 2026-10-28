"use client";

import { Search } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Home search â€” a native GET form, so it works without JavaScript: submitting
 * navigates to `/movies?q=<query>`, which the movies page reads server-side.
 */
export default function SearchBar() {
  const { translate } = useLocale();
  return (
    <form
      action="/movies"
      method="get"
      className="mx-(--space-md) flex items-center gap-3 rounded-md bg-(--color-surface) px-(--space-md) py-3"
    >
      <Search size={16} className="shrink-0 text-(--color-gold-light)" />
      <input
        name="q"
        type="search"
        className="w-full bg-transparent text-base text-(--color-gold-light) outline-none placeholder:text-(--color-text-muted)"
        placeholder={translate("layout.header.search")}
        aria-label={translate("layout.header.search")}
      />
    </form>
  );
}
