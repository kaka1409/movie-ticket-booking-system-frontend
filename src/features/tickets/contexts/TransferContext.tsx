"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Recipient } from "../types";

interface TransferContextType {
  selectedSeats: string[];
  setSelectedSeats: (labels: string[]) => void;
  toggleSeat: (label: string) => void;
  recipient: Recipient | null;
  setRecipient: (recipient: Recipient | null) => void;
  transferSnacks: boolean;
  setTransferSnacks: (value: boolean) => void;
}

const TransferContext = createContext<TransferContextType | null>(null);

/** Transfer draft (seats, recipient, snack toggle) — one instance wraps both device trees. */
export function TransferProvider({ children }: { children: ReactNode }) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [transferSnacks, setTransferSnacks] = useState(false);

  const toggleSeat = useCallback((label: string) => {
    setSelectedSeats((previous) =>
      previous.includes(label) ? previous.filter((seat) => seat !== label) : [...previous, label],
    );
  }, []);

  const value = useMemo(
    () => ({
      selectedSeats,
      setSelectedSeats,
      toggleSeat,
      recipient,
      setRecipient,
      transferSnacks,
      setTransferSnacks,
    }),
    [selectedSeats, toggleSeat, recipient, transferSnacks],
  );

  return <TransferContext.Provider value={value}>{children}</TransferContext.Provider>;
}

/** Transfer draft; throws outside `TransferProvider`. */
export function useTransfer() {
  const ctx = useContext(TransferContext);
  if (!ctx) throw new Error("useTransfer must be used within TransferProvider");
  return ctx;
}
