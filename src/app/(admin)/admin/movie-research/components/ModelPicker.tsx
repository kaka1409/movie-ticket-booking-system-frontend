"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { MovieResearchModel } from "@/features/admin/types";

/**
 * Searchable model picker for the research run card: a select-looking trigger
 * that opens a popup with a filter box and a scrollable free-model list.
 * Closes on outside click / Escape; selection reports the model id upward.
 */
export default function ModelPicker({
  models,
  value,
  onChange,
  disabled,
}: {
  models: MovieResearchModel[];
  value: string;
  onChange: (modelId: string) => void;
  disabled?: boolean;
}) {
  const { translate } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = models.find((model) => model.id === value);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return models;
    return models.filter(
      (model) =>
        model.id.toLowerCase().includes(needle) || model.name.toLowerCase().includes(needle),
    );
  }, [models, query]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex h-9 w-full min-w-56 cursor-pointer items-center justify-between gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-2) px-3.5 text-xs font-semibold text-(--color-text-primary) transition hover:border-(--color-gold)/40 disabled:cursor-not-allowed disabled:opacity-50 sm:w-64"
      >
        <span className="truncate">{selected ? selected.name : value || "—"}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-(--color-text-muted) transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-popover mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-(--shadow-card)">
          <div className="flex items-center gap-2 border-b border-(--color-border) px-3 py-2.5">
            <Search size={14} className="shrink-0 text-(--color-text-muted)" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={translate("admin.research.model_search")}
              autoFocus
              className="w-full bg-transparent text-sm text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
            />
          </div>
          <ul role="listbox" className="max-h-64 overflow-y-auto p-1.5">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-xs text-(--color-text-muted)">
                {translate("admin.research.model_empty")}
              </li>
            ) : (
              filtered.map((model) => (
                <li key={model.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={model.id === value}
                    onClick={() => {
                      onChange(model.id);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition hover:bg-(--color-surface-2)"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-(--color-text-primary)">
                        {model.name}
                      </span>
                      <span className="block truncate text-2xs text-(--color-text-muted)">
                        {model.id}
                      </span>
                    </span>
                    {model.id === value && (
                      <Check size={14} className="shrink-0 text-(--color-gold)" />
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
