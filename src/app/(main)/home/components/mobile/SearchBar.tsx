"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const { t } = useLocale();
  return (
    <div className="mx-(--space-md) flex items-center gap-3 rounded-md bg-(--color-surface) px-(--space-md) py-3">
      <Search size={16} className="shrink-0 text-(--color-gold-light)" />
      <input
        className="w-full bg-transparent text-sm text-(--color-gold-light) outline-none placeholder:text-(--color-text-muted)"
        placeholder={t("header.search")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
