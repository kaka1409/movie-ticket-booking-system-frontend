"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Recipient } from "../types";

interface TransferContextType {
  recipient: Recipient | null;
  setRecipient: (recipient: Recipient | null) => void;
}

const TransferContext = createContext<TransferContextType | null>(null);

/**
 * Transfer draft — the recipient only. Seats and snacks are not choices: the
 * whole ticket moves at the amount the backend freezes on the offer.
 */
export function TransferProvider({ children }: { children: ReactNode }) {
  const [recipient, setRecipient] = useState<Recipient | null>(null);

  const value = useMemo(() => ({ recipient, setRecipient }), [recipient]);

  return <TransferContext.Provider value={value}>{children}</TransferContext.Provider>;
}

/** Transfer draft; throws outside `TransferProvider`. */
export function useTransfer() {
  const ctx = useContext(TransferContext);
  if (!ctx) throw new Error("useTransfer must be used within TransferProvider");
  return ctx;
}
