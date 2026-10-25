"use client";

import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import SearchBar from "@/components/ui/SearchBar";
import { useTransfer } from "@/features/tickets/contexts/TransferContext";

/**
 * Recipient picker shared by both device trees. Fully controlled by the draft, so
 * the hidden twin mirrors whatever the visible one types; the lookup itself runs
 * once in `RecipientLookupAdopter`, which is why nothing here debounces or fetches.
 */
export default function RecipientField({ className = "" }: { className?: string }) {
  const { translate } = useLocale();
  const { query, setQuery, recipient, isRecipientMissing } = useTransfer();

  return (
    <section className={`space-y-3 ${className}`}>
      <h2 className="text-xl font-bold text-(--color-text-primary)">
        {translate("tickets.transfer.transfer_to")}
      </h2>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={translate("tickets.transfer.email_placeholder")}
      />

      {isRecipientMissing && (
        <p className="text-sm text-red-400">
          {translate("tickets.transfer.recipient_not_found").replace("{query}", query.trim())}
        </p>
      )}

      {recipient && (
        <div className="animate-fade-in flex items-center gap-3.5 rounded-2xl border border-(--color-gold)/40 bg-(--color-surface) p-4 shadow-[0_0_0_1px_rgba(255,204,77,0.15)]">
          <Image
            src={recipient.avatar}
            alt={recipient.name}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full bg-(--color-surface-2) object-cover"
          />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-sm font-bold text-(--color-text-primary)">{recipient.name}</span>
            <span className="text-xs text-(--color-text-muted)">{recipient.email}</span>
          </span>
        </div>
      )}
    </section>
  );
}
