"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Recipient } from "../types";

interface TransferContextType {
  /** Typed email address — the lookup input, shared by both device skins. */
  query: string;
  setQuery: (query: string) => void;
  recipient: Recipient | null;
  setRecipient: (recipient: Recipient | null) => void;
  /** A valid-looking email that resolved to nobody; drives the inline notice. */
  isRecipientMissing: boolean;
  setIsRecipientMissing: (isMissing: boolean) => void;
}

const TransferContext = createContext<TransferContextType | null>(null);

/**
 * Transfer draft — the typed email, the resolved recipient and the miss flag.
 * Seats and snacks are not choices: the whole ticket moves at the amount the
 * backend freezes on the offer.
 *
 * The draft is shared because both device trees render: the lookup runs once in
 * `RecipientLookupAdopter` and the two skins only mirror the same state.
 */
export function TransferProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [isRecipientMissing, setIsRecipientMissing] = useState(false);

  const value = useMemo(
    () => ({ query, setQuery, recipient, setRecipient, isRecipientMissing, setIsRecipientMissing }),
    [query, recipient, isRecipientMissing],
  );

  return <TransferContext.Provider value={value}>{children}</TransferContext.Provider>;
}

/** Transfer draft; throws outside `TransferProvider`. */
export function useTransfer() {
  const ctx = useContext(TransferContext);
  if (!ctx) throw new Error("useTransfer must be used within TransferProvider");
  return ctx;
}
