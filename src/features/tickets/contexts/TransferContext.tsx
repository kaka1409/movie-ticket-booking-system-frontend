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

export function TransferProvider({ children }: { children: ReactNode }) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [transferSnacks, setTransferSnacks] = useState(false);

  const toggleSeat = useCallback((label: string) => {
    setSelectedSeats((prev) =>
      prev.includes(label) ? prev.filter((seat) => seat !== label) : [...prev, label],
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

export function useTransfer() {
  const ctx = useContext(TransferContext);
  if (!ctx) throw new Error("useTransfer must be used within TransferProvider");
  return ctx;
}
