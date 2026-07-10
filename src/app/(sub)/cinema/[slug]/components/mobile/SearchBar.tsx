"use client";

import { Search, X } from "lucide-react";

export default function SearchBar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-(--color-surface) border border-(--color-border)">
      <Search size={15} className="text-(--color-text-muted) shrink-0" />
      <input
        type="search"
        placeholder="Search cinemas or locations..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="flex-1 bg-transparent text-sm outline-none text-(--color-text-primary) placeholder:text-(--color-text-muted)"
      />
      {query && (
        <button onClick={() => onQueryChange("")} aria-label="Clear search">
          <X size={14} className="text-(--color-text-muted)" />
        </button>
      )}
    </div>
  );
}
