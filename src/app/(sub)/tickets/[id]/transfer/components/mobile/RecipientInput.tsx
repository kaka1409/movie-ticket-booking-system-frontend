"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { searchRecipients } from "@/features/tickets/api";
import type { Recipient } from "@/features/tickets/types";
import { useTransfer } from "@/features/tickets/contexts/TransferContext";
import { useLocale } from "@/contexts/LocaleContext";
import SearchBar from "@/components/ui/SearchBar";

export default function RecipientInput() {
  const { recipient, setRecipient } = useTransfer();
  const { translate } = useLocale();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Recipient[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    searchRecipients(query).then(setResults);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    setIsOpen(true);
    if (recipient) {
      setRecipient(null);
    }
  };

  const handleSelect = (selected: Recipient) => {
    setRecipient(selected);
    setQuery(selected.name);
    setIsOpen(false);
  };

  return (
    <section className="px-4 space-y-3">
      <h2 className="font-bold text-xl text-(--color-text-primary)">
        {translate("tickets.transfer.transfer_to")}
      </h2>

      <div ref={containerRef} className="relative">
        <SearchBar
          value={query}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          placeholder={translate("tickets.transfer.email_placeholder")}
        />

        {/* Autocomplete dropdown */}
        {isOpen && !recipient && (
          <div className="absolute inset-x-0 top-full z-50 mt-1 rounded-2xl bg-(--color-surface) border border-(--color-border) shadow-[--shadow-card] overflow-hidden max-h-60 overflow-y-auto">
            {results.length > 0 ? (
              results.map((item, index) => (
                <button
                  key={item.username}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={`flex items-center gap-3.5 w-full px-4 py-3 text-left transition-colors hover:bg-(--color-surface-2) active:scale-[0.98] ${
                    index < results.length - 1 ? "border-b border-(--color-border)" : ""
                  }`}
                >
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="shrink-0 w-10 h-10 rounded-full object-cover bg-(--color-surface-2)"
                  />
                  <span className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-bold text-(--color-text-primary)">
                      {item.name}
                    </span>
                    <span className="text-xs text-(--color-text-muted)">
                      @{item.username}
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-red-400">
                {translate("tickets.transfer.recipient_not_found").replace(
                  "{query}",
                  query.trim()
                )}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Selected recipient preview */}
      {recipient && (
        <div className="animate-fade-in flex items-center gap-3.5 p-4 rounded-2xl bg-(--color-surface) border border-(--color-gold)/40 shadow-[0_0_0_1px_rgba(255,204,77,0.15)]">
          <Image
            src={recipient.avatar}
            alt={recipient.name}
            width={48}
            height={48}
            className="shrink-0 w-12 h-12 rounded-full object-cover bg-(--color-surface-2)"
          />
          <span className="flex flex-col gap-0.5 min-w-0">
            <span className="font-bold text-sm text-(--color-text-primary)">
              {recipient.name}
            </span>
            <span className="text-xs text-(--color-text-muted)">
              @{recipient.username}
            </span>
          </span>
        </div>
      )}
    </section>
  );
}
