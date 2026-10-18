"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { findRecipient } from "@/features/tickets/api";
import { useTransfer } from "@/features/tickets/contexts/TransferContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { isValidEmail } from "@/libs/zod";
import SearchBar from "@/components/ui/SearchBar";

/**
 * Exact-email recipient lookup: a valid address triggers `GET /user/search`,
 * which returns a single user (or none). The recipient is adopted into the
 * transfer context only when found, so the CTA stays disabled otherwise.
 */
export default function RecipientInput() {
  const { recipient, setRecipient } = useTransfer();
  const { token } = useAuth();
  const { translate } = useLocale();
  const [query, setQuery] = useState("");
  const [notFound, setNotFound] = useState(false);
  const debouncedQuery = useDebouncedValue(query);
  const requestSequenceRef = useRef(0);

  useEffect(() => {
    const email = debouncedQuery.trim();
    const canSearch = isValidEmail(email);
    const requestSequence = ++requestSequenceRef.current;

    // All state transitions land in the promise callback (never synchronously
    // in the effect body), so a stale keystroke can't flash a stale result.
    // The RAM Bearer token authenticates the client call (route also accepts
    // the refresh cookie for server-side callers).
    const lookup = canSearch
      ? findRecipient(email, { token: token ?? undefined })
      : Promise.resolve(null);

    lookup
      .then((found) => {
        if (requestSequence !== requestSequenceRef.current) return;
        setRecipient(found);
        setNotFound(canSearch && !found);
      })
      .catch(() => {
        if (requestSequence !== requestSequenceRef.current) return;
        setRecipient(null);
        setNotFound(canSearch);
      });
  }, [debouncedQuery, setRecipient, token]);

  return (
    <section className="px-4 space-y-3">
      <h2 className="font-bold text-xl text-(--color-text-primary)">
        {translate("tickets.transfer.transfer_to")}
      </h2>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={translate("tickets.transfer.email_placeholder")}
      />

      {notFound && (
        <p className="text-sm text-red-400">
          {translate("tickets.transfer.recipient_not_found").replace("{query}", query.trim())}
        </p>
      )}

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
            <span className="font-bold text-sm text-(--color-text-primary)">{recipient.name}</span>
            <span className="text-xs text-(--color-text-muted)">{recipient.email}</span>
          </span>
        </div>
      )}
    </section>
  );
}
